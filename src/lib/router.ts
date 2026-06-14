type RouteParams = Record<string, string>;
type RouteHandler = (
  req: Request,
  params: RouteParams,
) => Response | Promise<Response>;

type Route = {
  method: string;
  path: string;
  handler: RouteHandler;
};

class Router {
  private routes: Route[] = [];

  get(path: string, handler: RouteHandler) {
    this.routes.push({ method: "GET", path, handler });
  }

  post(path: string, handler: RouteHandler) {
    this.routes.push({ method: "POST", path, handler });
  }

  put(path: string, handler: RouteHandler) {
    this.routes.push({ method: "PUT", path, handler });
  }

  delete(path: string, handler: RouteHandler) {
    this.routes.push({ method: "DELETE", path, handler });
  }

  list() {
    return this.routes.map((r) => ({ method: r.method, path: r.path }));
  }

  handle(req: Request): Response | Promise<Response> | null {
    const url = new URL(req.url);
    for (const route of this.routes) {
      if (route.method !== req.method) continue;

      const params = matchPath(route.path, url.pathname);
      if (params) return route.handler(req, params);
    }

    return null;
  }

  print() {
    const routes = this.list();
    console.log("\n  Routes:");

    if (routes.length === 0) {
      console.log("  (no routes registered)");
      return;
    }

    console.log("  " + "\u2500".repeat(44));
    for (const r of routes) {
      console.log(`  ${r.method.padEnd(6)} ${r.path}`);
    }
    console.log("  " + "\u2500".repeat(44));
    console.log(`  Total: ${routes.length} routes\n`);
  }
}

export const router = new Router();

function matchPath(routePath: string, pathname: string): RouteParams | null {
  const routeParts = routePath.split("/").filter(Boolean);
  const pathParts = pathname.split("/").filter(Boolean);

  if (routeParts.length !== pathParts.length) return null;

  const params: RouteParams = {};

  for (let i = 0; i < routeParts.length; i++) {
    const routePart = routeParts[i]!;
    const pathPart = pathParts[i]!;

    if (routePart.startsWith(":")) {
      params[routePart.slice(1)] = decodeURIComponent(pathPart);
      continue;
    }

    if (routePart !== pathPart) return null;
  }

  return params;
}
