type RouteHandler = (req: Request) => Response | Promise<Response>;

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
    const route = this.routes.find(
      (r) => r.method === req.method && r.path === url.pathname,
    );
    if (route) return route.handler(req);
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
