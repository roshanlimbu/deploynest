import {
  getAuthenticatedUser,
  unauthorizedResponse,
} from "../auth/auth.middleware";
import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
  updateProject,
} from "./projects.service";
import { validateProjectInput } from "./projects.validation";

type RouteParams = Record<string, string>;

function parseProjectId(params: RouteParams) {
  const projectId = Number(params.id);
  return Number.isInteger(projectId) ? projectId : null;
}

function notFoundResponse() {
  return Response.json({ message: "Project not found" }, { status: 404 });
}

export async function listProjectsController(req: Request) {
  const authUser = getAuthenticatedUser(req);
  if (!authUser) return unauthorizedResponse();

  const projects = await listProjects(authUser.id);
  return Response.json({ projects }, { status: 200 });
}

export async function createProjectController(req: Request) {
  try {
    const authUser = getAuthenticatedUser(req);
    if (!authUser) return unauthorizedResponse();

    const body = await req.json();
    const validation = validateProjectInput(body);

    if (!validation.success) {
      return Response.json({ message: validation.message }, { status: 400 });
    }

    const project = await createProject(authUser.id, validation.data);
    return Response.json({ project }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function getProjectController(req: Request, params: RouteParams) {
  const authUser = getAuthenticatedUser(req);
  if (!authUser) return unauthorizedResponse();

  const projectId = parseProjectId(params);
  if (!projectId) return notFoundResponse();

  const project = await getProject(authUser.id, projectId);
  if (!project) return notFoundResponse();

  return Response.json({ project }, { status: 200 });
}

export async function updateProjectController(
  req: Request,
  params: RouteParams,
) {
  try {
    const authUser = getAuthenticatedUser(req);
    if (!authUser) return unauthorizedResponse();

    const projectId = parseProjectId(params);
    if (!projectId) return notFoundResponse();

    const body = await req.json();
    const validation = validateProjectInput(body);

    if (!validation.success) {
      return Response.json({ message: validation.message }, { status: 400 });
    }

    const project = await updateProject(authUser.id, projectId, validation.data);
    if (!project) return notFoundResponse();

    return Response.json({ project }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function deleteProjectController(
  req: Request,
  params: RouteParams,
) {
  try {
    const authUser = getAuthenticatedUser(req);
    if (!authUser) return unauthorizedResponse();

    const projectId = parseProjectId(params);
    if (!projectId) return notFoundResponse();

    const project = await deleteProject(authUser.id, projectId);
    if (!project) return notFoundResponse();

    return Response.json({ message: "Project deleted" }, { status: 200 });
  } catch (error) {
    console.error("Delete project error:", error);
    return Response.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
