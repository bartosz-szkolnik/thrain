import { Server } from '@thrain/core/index.ts';
import { createBasicRoutes } from './routes/basic.ts';
import { createAuthRoutes } from './routes/auth.ts';
import { createJSXRoutes } from './routes/basic-jsx.tsx';
import { Logger, Auth, Layout } from '@thrain/middlewares/index.ts';
import { APP_TOKEN_NAME, getCookie, verifyToken } from './auth.ts';
import { redirect } from '@thrain/common/index.ts';
import { useRoutes } from '@thrain/template/jsx-router.tsx';
import { createElement } from '@thrain/template/element.ts';

const server = new Server('localhost', 8080);

const logger = Logger.instance;
const auth = Auth.instance;
const layout = Layout.instance;

// Define logging middleware
server.middleware.use((ctx, next) => {
  logger.info(`Request received for ${ctx.request.method} ${ctx.request.url}`);
  return next();
});

// Define auth middleware
server.middleware.use((ctx, next) => {
  try {
    auth.authenticate(ctx, logger, APP_TOKEN_NAME, verifyToken);
  } catch (e) {
    const err = e as Error;
    if (err.message === 'Expired token') {
      const cookie = getCookie('');
      return new Response(null, {
        status: 302,
        headers: { 'Content-Type': 'text/html', 'Set-Cookie': cookie, Location: '/login' },
      });
    }

    return redirect('/login');
  }

  return next();
});

// Define HTML wrapping with basic structure middleware
server.middleware.use(async (_ctx, next) => {
  const response = await next();
  if (!response) {
    return response;
  }

  const title = response.headers.get('Title') || null;
  if (title) {
    response.headers.delete('Title');
  }

  const tailwindStyles = createElement('link', { rel: 'stylesheet', href: '/styles/tailwind.css' });
  const favicon = createElement('link', { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' });
  if (layout.checkIfContainsHTML(response)) {
    return layout.addBasicHTMLToResponse(response, title ?? 'Example App', [tailwindStyles, favicon]);
  }

  return response;
});

createBasicRoutes(server);
createAuthRoutes(server);
createJSXRoutes(server);
useRoutes(server, 'example-app/src');

server.start();
