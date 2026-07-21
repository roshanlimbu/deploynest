import {
  getAuthenticatedUser,
  unauthorizedResponse,
} from "../auth/auth.middleware";
import {
  createDeployment,
  getDeployment,
  listDeploymentLogs,
  listDeployments,
} from "./deployments.service";

type RouteParams = Record<string, string>;

function parseId(value: string | undefined) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function notFoundResponse() {
  return Response.json({ message: "Deployment not found" }, { status: 404 });
}

export async function createDeploymentController(
  req: Request,
  params: RouteParams,
) {
  try {
    const authUser = getAuthenticatedUser(req);
    if (!authUser) return unauthorizedResponse();

    const projectId = parseId(params.id);
    if (!projectId) return notFoundResponse();

    const deployment = await createDeployment(authUser.id, projectId);
    if (!deployment) {
      return Response.json({ message: "Project not found" }, { status: 404 });
    }

    return Response.json({ deployment }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function listDeploymentsController(
  req: Request,
  params: RouteParams,
) {
  const authUser = getAuthenticatedUser(req);
  if (!authUser) return unauthorizedResponse();

  const projectId = parseId(params.id);
  if (!projectId) return notFoundResponse();

  const deployments = await listDeployments(authUser.id, projectId);
  if (!deployments) {
    return Response.json({ message: "Project not found" }, { status: 404 });
  }

  return Response.json({ deployments }, { status: 200 });
}

export async function getDeploymentController(
  req: Request,
  params: RouteParams,
) {
  const authUser = getAuthenticatedUser(req);
  if (!authUser) return unauthorizedResponse();

  const deploymentId = parseId(params.id);
  if (!deploymentId) return notFoundResponse();

  const deployment = await getDeployment(authUser.id, deploymentId);
  if (!deployment) return notFoundResponse();

  return Response.json({ deployment }, { status: 200 });
}

export async function listDeploymentLogsController(
  req: Request,
  params: RouteParams,
) {
  const authUser = getAuthenticatedUser(req);
  if (!authUser) return unauthorizedResponse();

  const deploymentId = parseId(params.id);
  if (!deploymentId) return notFoundResponse();

  const logs = await listDeploymentLogs(authUser.id, deploymentId);
  if (!logs) return notFoundResponse();

  return Response.json({ logs }, { status: 200 });
}
