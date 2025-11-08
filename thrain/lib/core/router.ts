import { RouterGroup } from './router-group.ts';
import { zip } from './utils.ts';

export type Context = {
  request: Request;
  params: { [key: string]: string };
};

export type RouteHandler = (ctx: Context) => Response | Promise<Response>;

export type Route = {
  path: string;
  method: string;
  handler: RouteHandler;
};

export class Router {
  private routes: Route[] = [];

  get(path: string, handler: RouteHandler) {
    this.addRoute('GET', path, handler);
  }

  post(path: string, handler: RouteHandler) {
    this.addRoute('POST', path, handler);
  }

  put(path: string, handler: RouteHandler) {
    this.addRoute('PUT', path, handler);
  }

  delete(path: string, handler: RouteHandler) {
    this.addRoute('DELETE', path, handler);
  }

  route(prefix: string): RouterGroup;
  route(prefix: string, callback: (group: RouterGroup) => void): Router;
  route(prefix: string, callback?: (group: RouterGroup) => void): Router | RouterGroup {
    const group = new RouterGroup(this, prefix);

    if (callback) {
      callback(group);
      return this;
    }

    return group;
  }

  findMatchingRoute(method: string, url: string) {
    return this.routes.find(route => {
      const routePathSegments = route.path.split('/');
      const urlPathSegments = url.split('/');

      if (routePathSegments.length !== urlPathSegments.length) {
        return false;
      }

      const segments = zip(routePathSegments, urlPathSegments);
      for (const [routeSegment, urlSegment] of segments) {
        if (routeSegment.startsWith(':')) {
          continue;
        }

        if (routeSegment !== urlSegment) {
          return false;
        }
      }

      return route.method === method;
    });
  }

  extractParams(url: string, routePath: string) {
    const params: { [key: string]: string } = {};

    const routePathSegments = routePath.split('/');
    const urlPathSegments = url.split('/');

    const segments = zip(routePathSegments, urlPathSegments);
    for (const [routeSegment, paramValue] of segments) {
      if (routeSegment.startsWith(':')) {
        const paramName = routeSegment.slice(1);
        params[paramName] = paramValue;
      }
    }

    return params;
  }

  private addRoute(method: string, path: string, handler: RouteHandler) {
    const route = { method, handler, path } satisfies Route;
    this.routes.push(route);
  }
}
