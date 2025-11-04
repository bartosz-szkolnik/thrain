import { Logger } from './logger.ts';
import { Context } from '../core/router.ts';

export class Auth {
  private static _instance: Auth;
  private publicRoutes: Set<string> = new Set();

  private constructor() {}

  static get instance(): Auth {
    if (!Auth._instance) {
      Auth._instance = new Auth();
    }

    return Auth._instance;
  }

  addPublicRoutes(...paths: string[]) {
    paths.forEach(path => {
      this.publicRoutes.add(path);
    });
  }

  authenticate(ctx: Context, logger: Logger, tokenName: string, verifyFn: (token: string) => string) {
    const url = new URL(ctx.request.url);
    if (this.publicRoutes.has(url.pathname)) {
      return;
    }

    const cookie = ctx.request.headers.get('cookie') ?? '';
    const extractTokenRegExp = new RegExp(`${tokenName}=([^;]+)`);
    const match = extractTokenRegExp.exec(cookie);
    const token = match ? match[1] : null;

    if (!token) {
      logger.error('Tried to enter private url with no token');
      // return new Response('Unauthenticated', { status: 401 });
      throw new Error('No token');
    }

    try {
      verifyFn(token);
    } catch {
      logger.error('Tried to enter private url with invalid token');
      // return new Response('Unauthenticated', { status: 401 });
      throw new Error('Invalid token');
    }
  }
}
