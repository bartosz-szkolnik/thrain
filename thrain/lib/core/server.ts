import { Logger } from '../middlewares/logger.ts';
import { MiddlewareWrapper } from './middleware.ts';
import { Context, Router } from './router.ts';

const logger = Logger.instance;

export class Server {
  private readonly controller = new AbortController();
  private server?: Deno.HttpServer<Deno.NetAddr>;
  router = new Router();
  middleware = new MiddlewareWrapper();

  constructor(private hostname: string, private port: number) {}

  start() {
    logger.info(`Running server on host: ${this.hostname} port: ${this.port}`);

    const { signal } = this.controller;
    const { hostname, port } = this;
    this.server = Deno.serve({ hostname, port, signal }, this.handleRequest);
  }

  stop() {
    logger.info(`Stopping server on host: ${this.hostname} port: ${this.port}`);

    this.controller.abort();
    Deno.exit(0);
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
