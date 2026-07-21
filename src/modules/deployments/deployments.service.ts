import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "../../db";
import {
  deploymentJobsTable,
  deploymentLogsTable,
  deploymentsTable,
  projectsTable,
} from "../../db/schema";

export async function createDeployment(userId: number, projectId: number) {
  const project = await db.query.projectsTable.findFirst({
    where: and(
      eq(projectsTable.id, projectId),
      eq(projectsTable.userId, userId),
    ),
  });

  if (!project) return null;

  return db.transaction(async (tx) => {
    const [deployment] = await tx
      .insert(deploymentsTable)
      .values({ projectId })
      .returning();

    if (!deployment) throw new Error("Failed to create deployment");

    await tx.insert(deploymentJobsTable).values({
      deploymentId: deployment.id,
      jobType: "deploy",
    });

    return { ...deployment, projectName: project.name };
  });
}

export async function listDeployments(userId: number, projectId: number) {
  const project = await db.query.projectsTable.findFirst({
    where: and(
      eq(projectsTable.id, projectId),
      eq(projectsTable.userId, userId),
    ),
  });

  if (!project) return null;

  return db
    .select({
      id: deploymentsTable.id,
      projectId: deploymentsTable.projectId,
      status: deploymentsTable.status,
      containerId: deploymentsTable.containerId,
      port: deploymentsTable.port,
      domain: deploymentsTable.domain,
      logs: deploymentsTable.logs,
      createdAt: deploymentsTable.createdAt,
      projectName: projectsTable.name,
    })
    .from(deploymentsTable)
    .innerJoin(projectsTable, eq(deploymentsTable.projectId, projectsTable.id))
    .where(eq(deploymentsTable.projectId, projectId))
    .orderBy(desc(deploymentsTable.createdAt));
}

export async function getDeployment(userId: number, deploymentId: number) {
  const [deployment] = await db
    .select({
      id: deploymentsTable.id,
      projectId: deploymentsTable.projectId,
      status: deploymentsTable.status,
      containerId: deploymentsTable.containerId,
      port: deploymentsTable.port,
      domain: deploymentsTable.domain,
      logs: deploymentsTable.logs,
      createdAt: deploymentsTable.createdAt,
      projectName: projectsTable.name,
    })
    .from(deploymentsTable)
    .innerJoin(projectsTable, eq(deploymentsTable.projectId, projectsTable.id))
    .where(
      and(
        eq(deploymentsTable.id, deploymentId),
        eq(projectsTable.userId, userId),
      ),
    )
    .limit(1);

  return deployment ?? null;
}

export async function listDeploymentLogs(
  userId: number,
  deploymentId: number,
) {
  const deployment = await getDeployment(userId, deploymentId);
  if (!deployment) return null;

  return db
    .select({
      id: deploymentLogsTable.id,
      deploymentId: deploymentLogsTable.deploymentId,
      message: deploymentLogsTable.message,
      createdAt: deploymentLogsTable.createdAt,
    })
    .from(deploymentLogsTable)
    .where(eq(deploymentLogsTable.deploymentId, deploymentId))
    .orderBy(asc(deploymentLogsTable.id));
}
