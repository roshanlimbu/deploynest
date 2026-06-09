CREATE TYPE "public"."deployment_status" AS ENUM('pending', 'running', 'success', 'failed');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('pending', 'running', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "deployment_jobs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "deployment_jobs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"deployment_id" integer NOT NULL,
	"status" "job_status" DEFAULT 'pending' NOT NULL,
	"job_type" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"started_at" timestamp,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "deployment_logs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "deployment_logs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"deployment_id" integer NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deployments" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "deployments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"project_id" integer NOT NULL,
	"status" "deployment_status" DEFAULT 'pending' NOT NULL,
	"container_id" varchar(255),
	"port" integer,
	"logs" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "projects_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"repo_url" varchar(255) NOT NULL,
	"branch" varchar(255) DEFAULT 'main' NOT NULL,
	"user_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "deployment_jobs" ADD CONSTRAINT "deployment_jobs_deployment_id_deployments_id_fk" FOREIGN KEY ("deployment_id") REFERENCES "public"."deployments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deployment_logs" ADD CONSTRAINT "deployment_logs_deployment_id_deployments_id_fk" FOREIGN KEY ("deployment_id") REFERENCES "public"."deployments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deployments" ADD CONSTRAINT "deployments_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;