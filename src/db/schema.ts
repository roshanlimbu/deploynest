import { integer, pgEnum, pgTable, text, timestamp, varchar, uniqueIndex } from "drizzle-orm/pg-core";

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
  appType: varchar("app_type", { length: 50 }).notNull().default("dockerfile"),
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
    .references(() => projectsTable.id, { onDelete: "cascade" }),
  status: deploymentStatusEnum().notNull().default("pending"),
  containerId: varchar("container_id", { length: 255 }),
  port: integer(),
  domain: varchar({ length: 255 }),
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
    .references(() => deploymentsTable.id, { onDelete: "cascade" }),
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
    .references(() => deploymentsTable.id, { onDelete: "cascade" }),
  message: text().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const dbEngineEnum = pgEnum("db_engine", ["mysql", "postgresql"]);
export const dbStatusEnum = pgEnum("db_status", ["pending", "running", "stopped", "failed"]);

export const projectDatabasesTable = pgTable("project_databases", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  projectId: integer("project_id")
    .notNull()
    .unique()
    .references(() => projectsTable.id, { onDelete: "cascade" }),
  engine: dbEngineEnum().notNull(),
  dbName: varchar("db_name", { length: 255 }).notNull(),
  dbUser: varchar("db_user", { length: 255 }).notNull(),
  dbPassword: varchar("db_password", { length: 255 }).notNull(),
  containerName: varchar("container_name", { length: 255 }),
  internalHost: varchar("internal_host", { length: 255 }),
  port: integer(),
  status: dbStatusEnum().notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
