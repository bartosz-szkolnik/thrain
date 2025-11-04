import { MiddlewareWrapper } from './middleware.ts';
import { Context, Router } from './router.ts';

export class Server {
  private server?: Deno.HttpServer<Deno.NetAddr>;
  router = new Router();
  middleware = new MiddlewareWrapper();

  constructor(private hostname: string, private port: number) {}

  start() {
    console.info(`Running server on host: ${this.hostname} port: ${this.port}`);
    const { hostname, port } = this;
    this.server = Deno.serve({ hostname, port }, this.handleRequest);
  }

  self() {
    return this.server;
  }

  private handleRequest = (request: Request) => {
    const method = request.method;
    const url = new URL(request.url);

    const matchedRoute = this.router.findMatchingRoute(method, url.pathname);
    if (matchedRoute) {
      const params = this.router.extractParams(url.pathname, matchedRoute.path);
      const context = { request, params } satisfies Context;

      return this.middleware.runMiddlewares(context, matchedRoute.handler);
    }

    return new Response('Not found', { status: 404 });
  };
}
