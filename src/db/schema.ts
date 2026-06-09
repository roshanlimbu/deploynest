import { integer, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const projectsTable = pgTable("projects", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  repoUrl: varchar("repo_url", { length: 255 }).notNull(),
  branch: varchar({ length: 255 }).notNull().default("main"),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
});

export const deploymentStatusEnum = pgEnum("deployment_status", [
  "pending",
  "running",
  "success",
  "failed",
]);

export const deploymentsTable = pgTable("deployments", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  projectId: integer("project_id")
    .notNull()
    .references(() => projectsTable.id),
  status: deploymentStatusEnum().notNull().default("pending"),
  containerId: varchar("container_id", { length: 255 }),
  port: integer(),
  logs: text(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const jobStatusEnum = pgEnum("job_status", [
  "pending",
  "running",
  "completed",
  "failed",
]);

export const deploymentJobsTable = pgTable("deployment_jobs", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  deploymentId: integer("deployment_id")
    .notNull()
    .references(() => deploymentsTable.id),
  status: jobStatusEnum().notNull().default("pending"),
  jobType: varchar("job_type", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
});

export const deploymentLogsTable = pgTable("deployment_logs", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  deploymentId: integer("deployment_id")
    .notNull()
    .references(() => deploymentsTable.id),
  message: text().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
