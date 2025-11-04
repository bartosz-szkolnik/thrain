import { Context, RouteHandler } from './router.ts';

export type Middleware = (ctx: Context, next: () => Promise<Response | void>) => Response | Promise<Response | void>;

export class MiddlewareWrapper {
  private middlewares: Middleware[] = [];

  use(middleware: Middleware) {
    this.middlewares.push(middleware);
  }

  async runMiddlewares(ctx: Context, handler: RouteHandler) {
    // Start with the final handler
    let composed: () => Promise<Response | void> = async () => await handler(ctx);

    // Compose middlewares in reverse order
    for (const middleware of [...this.middlewares].reverse()) {
      const next = composed;
      composed = async () => await middleware(ctx, next);
    }

    return (await composed()) as Response;
  }
}
