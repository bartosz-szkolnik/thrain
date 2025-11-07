import { Server } from '@thrain/core/index.ts';
import { Logger, Layout } from '@thrain/middlewares/index.ts';
import { createRoutes } from './routes.tsx';
import { createElement } from '@thrain/template/element.ts';

const server = new Server('localhost', 8080);

const logger = Logger.instance;
const layout = Layout.instance;

// Define logging middleware
server.middleware.use((ctx, next) => {
  logger.info(`Request received for ${ctx.request.method} ${ctx.request.url}`);
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

  // const tailwindStyles = createElement('link', { rel: 'stylesheet', href: '/styles/tailwind.css' });
  // const favicon = createElement('link', { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' });
  if (layout.checkIfContainsHTML(response)) {
    const style = createElement('style', null, `* { font-family: 'Helvetica' }`);
    return layout.addBasicHTMLToResponse(response, title ?? 'The best Blog on the internet', [style]);
  }

  return response;
});

createRoutes(server);

server.start();
