import { and, desc, eq } from "drizzle-orm";
import { db } from "../../db";
import { projectsTable } from "../../db/schema";
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
  const [project] = await db
    .delete(projectsTable)
    .where(and(eq(projectsTable.id, projectId), eq(projectsTable.userId, userId)))
    .returning({ id: projectsTable.id });

  return project ?? null;
}
