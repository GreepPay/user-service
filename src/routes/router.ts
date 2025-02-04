type Handler = (req: BunRequest) => Response | Promise<Response>;

interface Route {
  method: string;
  path: string;
  handler: Handler;
}

export interface BunRequest extends Request {
  params: Record<string, string>;
  query: URLSearchParams;
}

class Router {
  private routes: Route[] = [];

  add(method: string, path: string, handler: Handler) {
    this.routes.push({ method: method.toUpperCase(), path, handler });
  }

  match(req: Request) {
    const url = new URL(req.url);
    const method = req.method.toUpperCase();
    const pathParts = url.pathname.split("/").filter(Boolean);

    for (const route of this.routes) {
      const routeParts = route.path.split("/").filter(Boolean);

      if (route.method !== method || routeParts.length !== pathParts.length) {
        continue;
      }

      const params: Record<string, string> = {};
      let match = true;

      for (let i = 0; i < routeParts.length; i++) {
        if (routeParts[i].startsWith(":")) {
          params[routeParts[i].slice(1)] = pathParts[i];
        } else if (routeParts[i] !== pathParts[i]) {
          match = false;
          break;
        }
      }

      if (match) {
        const extendedRequest: BunRequest = Object.create(req, {
          params: { value: params, enumerable: true },
          query: { value: url.searchParams, enumerable: true }
        });

        return route.handler(extendedRequest);
      }
    }

    return new Response("Not Found", { status: 404 });
  }
}

const router = new Router();

export default router;