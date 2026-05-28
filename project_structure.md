# DeployNest
## A Self-Hosted Deployment Platform

---

# 1. Project Title

**DeployNest: A Self-Hosted Deployment Platform Using Docker and Rust-Based Deployment Workers**

---

# 2. Introduction

Modern application deployment platforms such as Vercel, Render, and Railway simplify the process of hosting applications by automating deployment directly from Git repositories. However, these services are cloud-hosted and often require recurring payments and limited infrastructure control.

DeployNest is a self-hosted deployment platform designed to automate the deployment of web applications onto a Virtual Private Server (VPS). The system allows users to connect Git repositories, automatically build applications using Docker, and manage deployments through a web dashboard.

The platform uses:
- Bun-based backend APIs
- Rust-based deployment workers
- Docker containerization
- Reverse proxy routing using Caddy
- Real-time deployment monitoring

The goal of the project is to demonstrate modern DevOps concepts, deployment automation, and scalable infrastructure management in a simplified educational environment.

---

# 3. Problem Statement

Deploying applications manually on VPS servers requires technical knowledge of:
- Linux servers
- Docker
- Reverse proxies
- Port management
- Build systems
- Deployment pipelines

Many beginner developers and small teams struggle with:
- Complex server configuration
- Repeated manual deployment steps
- Managing multiple applications
- Deployment monitoring

Existing commercial deployment platforms are often:
- Expensive
- Vendor-controlled
- Not self-hosted
- Limited in customization

DeployNest solves this problem by providing:
- A centralized deployment dashboard
- Automated Git-based deployments
- Containerized application management
- Self-hosted infrastructure control

---

# 4. Objectives

## Main Objective

To develop a self-hosted deployment platform that automates application deployment from Git repositories to VPS infrastructure using Docker containers.

## Specific Objectives

- To automate Git-based application deployment
- To containerize applications using Docker
- To create a centralized deployment dashboard
- To implement deployment monitoring and logging
- To manage deployed applications using container orchestration techniques
- To demonstrate DevOps and infrastructure automation concepts

---

# 5. Scope of the Project

The project supports:
- Deployment of Node.js and Next.js applications
- Docker-based application execution
- Public and private Git repositories
- Deployment logs
- Application restart/redeployment
- Subdomain-based routing

The project does not initially include:
- Kubernetes orchestration
- Auto-scaling
- Multi-server clustering
- Production-grade security infrastructure

---

# 6. Proposed System

The proposed system consists of the following components:

## Frontend Dashboard

A Next.js web interface for:
- Managing projects
- Triggering deployments
- Monitoring deployment status
- Viewing logs

## Backend API

A Bun-based API server responsible for:
- Authentication
- Project management
- Deployment management
- Communication with the deployment worker

## Rust Deployment Worker

A background worker responsible for:
- Cloning Git repositories
- Building Docker images
- Running containers
- Streaming deployment logs
- Managing deployments

## Docker Runtime

Used for:
- Application isolation
- Dependency management
- Container execution

## Reverse Proxy

Caddy server routes subdomains to deployed containers dynamically.

---

# 7. System Architecture

```txt
User
  ↓
Next.js Dashboard
  ↓
Bun Backend API
  ↓
PostgreSQL Database
  ↓
Rust Deployment Worker
  ↓
Docker Engine
  ↓
Caddy Reverse Proxy
  ↓
Running Applications
```

---

# 8. Workflow of the System

## Step 1
User logs into the platform.

## Step 2
User creates a project by entering:
- Repository URL
- Branch name
- Environment variables

## Step 3
Backend stores deployment request in database.

## Step 4
Rust worker detects pending deployment job.

## Step 5
Worker performs:
- Git clone
- Docker build
- Docker container creation

## Step 6
Caddy reverse proxy routes traffic to the deployed container.

## Step 7
User receives deployment URL and deployment logs.

---

# 9. Technologies Used

| Technology | Purpose |
|---|---|
| Next.js | Frontend dashboard |
| TypeScript | Application development |
| Bun | Backend API runtime |
| Rust | Deployment worker |
| PostgreSQL | Database |
| Docker | Containerization |
| Caddy | Reverse proxy |
| Drizzle ORM | Database ORM |
| WebSocket/SSE | Real-time logs |

---

# 10. Database Design

## Users Table

```txt
id
name
email
password
```

## Projects Table

```txt
id
name
repo_url
branch
user_id
```

## Deployments Table

```txt
id
project_id
status
container_id
port
logs
created_at
```

## Environment Variables Table

```txt
id
project_id
key
value
```

---

# 11. Features of the System

## Core Features

- Git-based deployment
- Dockerized applications
- Real-time deployment logs
- Automatic container management
- Restart and redeploy functionality
- Subdomain routing

## Advanced Features

- Private repository deployment
- GitHub token authentication
- Automatic Docker build
- Deployment history tracking

---

# 12. Advantages of the System

- Simplifies deployment process
- Reduces manual server management
- Supports self-hosted infrastructure
- Improves deployment consistency
- Demonstrates DevOps automation
- Provides centralized project management

---

# 13. Limitations

- Limited to single VPS deployment
- No automatic scaling
- Limited framework support initially
- Basic security implementation

---

# 14. Future Enhancements

Future improvements may include:
- Kubernetes integration
- Multi-server deployment
- Automatic SSL provisioning
- CI/CD pipeline integration
- Rollback system
- Monitoring dashboard
- Resource usage analytics
- GitHub webhook auto-deployment

---

# 15. Expected Outcome

The expected outcome is a fully functional deployment platform capable of:
- Deploying applications automatically from Git repositories
- Managing Docker containers
- Routing traffic dynamically
- Monitoring deployment status in real time

The system will demonstrate practical implementation of:
- DevOps concepts
- Deployment automation
- Container orchestration
- Infrastructure management

---

# 16. Conclusion

DeployNest is a modern self-hosted deployment platform designed to simplify VPS-based application deployment using Docker and automated deployment workers. The project combines modern web technologies, containerization, and infrastructure automation into a unified platform.

The project demonstrates practical knowledge of:
- Full-stack development
- Backend systems
- Deployment pipelines
- Docker containerization
- DevOps workflows
- Scalable application architecture

DeployNest provides an educational and practical approach to understanding modern deployment infrastructure while remaining lightweight and suitable for academic implementation.
