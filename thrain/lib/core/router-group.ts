import { RouteHandler, Router } from './router.ts';

export class RouterGroup {
  constructor(private readonly router: Router, private prefix: string) {
    // Ensure prefix starts with / and doesn't end with /
    this.prefix = prefix.startsWith('/') ? prefix : `/${prefix}`;
    if (this.prefix.endsWith('/')) {
      this.prefix = this.prefix.slice(0, -1);
    }
  }

  get(path: string, handler: RouteHandler) {
    const fullPath = this.getFullPath(path);

    this.router.get(fullPath, handler);
    return this;
  }

  post(path: string, handler: RouteHandler) {
    const fullPath = this.getFullPath(path);

    this.router.post(fullPath, handler);
    return this;
  }

  put(path: string, handler: RouteHandler) {
    const fullPath = this.getFullPath(path);

    this.router.put(fullPath, handler);
    return this;
  }

  delete(path: string, handler: RouteHandler) {
    const fullPath = this.getFullPath(path);

    this.router.delete(fullPath, handler);
    return this;
  }

  private getFullPath(path: string) {
    if (path === '/') {
      return this.prefix;
    }

    return `${this.prefix}${path.startsWith('/') ? path : `/${path}`}`;
  }
}
