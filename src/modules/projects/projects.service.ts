import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "../../db";
import { deploymentsTable, deploymentJobsTable, deploymentLogsTable, projectsTable, projectDatabasesTable } from "../../db/schema";
import type { ProjectInput } from "./projects.validation";

export async function listProjects(userId: number) {
  return db.query.projectsTable.findMany({
    where: eq(projectsTable.userId, userId),
    orderBy: desc(projectsTable.id),
  });
}

export async function getProject(userId: number, projectId: number) {
  const project = await db.query.projectsTable.findFirst({
    where: and(
      eq(projectsTable.id, projectId),
      eq(projectsTable.userId, userId),
    ),
  });

  if (!project) return null;

  const database = await db.query.projectDatabasesTable.findFirst({
    where: eq(projectDatabasesTable.projectId, projectId),
  });

  return {
    ...project,
    database: database
      ? {
          id: database.id,
          engine: database.engine,
          dbName: database.dbName,
          status: database.status,
        }
      : null,
  };
}

export async function createProject(userId: number, input: ProjectInput) {
  const [project] = await db
    .insert(projectsTable)
    .values({
      name: input.name,
      repoUrl: input.repoUrl,
      branch: input.branch,
      appType: input.appType,
      userId,
    })
    .returning();

  if (input.database?.enabled && project) {
    await createProjectDatabase(project.id, input.database.engine);
  }

  return project;
}

export async function updateProject(
  userId: number,
  projectId: number,
  input: ProjectInput,
) {
  const [project] = await db
    .update(projectsTable)
    .set({
      name: input.name,
      repoUrl: input.repoUrl,
      branch: input.branch,
      appType: input.appType,
    })
    .where(and(eq(projectsTable.id, projectId), eq(projectsTable.userId, userId)))
    .returning();

  if (!project) return null;

  // Handle database toggle
  const existingDb = await getProjectDatabase(projectId);

  if (input.database?.enabled) {
    if (!existingDb) {
      await createProjectDatabase(projectId, input.database.engine);
    } else if (existingDb.engine !== input.database.engine) {
      // Engine changed: delete old, create new
      await deleteProjectDatabase(projectId);
      await createProjectDatabase(projectId, input.database.engine);
    }
  } else if (existingDb) {
    await deleteProjectDatabase(projectId);
  }

  return project;
}

export async function deleteProject(userId: number, projectId: number) {
  // First confirm the project belongs to this user
  const project = await getProject(userId, projectId);
  if (!project) return null;

  // Get all deployment IDs for this project
  const deployments = await db.query.deploymentsTable.findMany({
    where: eq(deploymentsTable.projectId, projectId),
    columns: { id: true },
  });
  const deploymentIds = deployments.map((d) => d.id);

  if (deploymentIds.length > 0) {
    // Get all job IDs for these deployments
    const jobs = await db.query.deploymentJobsTable.findMany({
      where: inArray(deploymentJobsTable.deploymentId, deploymentIds),
      columns: { id: true },
    });
    const jobIds = jobs.map((j) => j.id);

    // Delete logs → jobs → deployments in order
    await db.delete(deploymentLogsTable).where(inArray(deploymentLogsTable.deploymentId, deploymentIds));
    if (jobIds.length > 0) {
      await db.delete(deploymentJobsTable).where(inArray(deploymentJobsTable.id, jobIds));
    }
    await db.delete(deploymentsTable).where(inArray(deploymentsTable.id, deploymentIds));
  }

  // Delete project database config (cascade will handle it, but explicit for clarity)
  await deleteProjectDatabase(projectId);

  // Now safe to delete the project
  const [deleted] = await db
    .delete(projectsTable)
    .where(and(eq(projectsTable.id, projectId), eq(projectsTable.userId, userId)))
    .returning({ id: projectsTable.id });

  return deleted ?? null;
}

// ── Database provisioning helpers ─────────────────────────────────────

function generateCredentials(projectId: number) {
  const suffix = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  return {
    dbName: `deploynest_p${projectId}`,
    dbUser: `dn_user_${suffix}`,
    dbPassword: crypto.randomUUID(),
  };
}

export async function createProjectDatabase(projectId: number, engine: "mysql" | "postgresql") {
  const creds = generateCredentials(projectId);
  const containerName = `deploynest-db-${projectId}`;
  const port = engine === "mysql" ? 3306 : 5432;

  const [record] = await db
    .insert(projectDatabasesTable)
    .values({
      projectId,
      engine,
      dbName: creds.dbName,
      dbUser: creds.dbUser,
      dbPassword: creds.dbPassword,
      containerName,
      internalHost: containerName,
      port,
    })
    .returning();

  return record;
}

export async function getProjectDatabase(projectId: number) {
  return db.query.projectDatabasesTable.findFirst({
    where: eq(projectDatabasesTable.projectId, projectId),
  }) ?? null;
}

export async function deleteProjectDatabase(projectId: number) {
  await db
    .delete(projectDatabasesTable)
    .where(eq(projectDatabasesTable.projectId, projectId));
}
