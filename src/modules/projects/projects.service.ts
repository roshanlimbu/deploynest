import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "../../db";
import { deploymentsTable, deploymentJobsTable, deploymentLogsTable, projectsTable } from "../../db/schema";
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

  return project ?? null;
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

  return project ?? null;
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

  // Now safe to delete the project
  const [deleted] = await db
    .delete(projectsTable)
    .where(and(eq(projectsTable.id, projectId), eq(projectsTable.userId, userId)))
    .returning({ id: projectsTable.id });

  return deleted ?? null;
}
