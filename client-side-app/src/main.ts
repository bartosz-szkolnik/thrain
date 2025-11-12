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
    const style = createElement('style', null, styles);
    return layout.addBasicHTMLToResponse(response, title ?? 'The best Blog on the internet', [style]);
  }

  return response;
});

createRoutes(server);

server.start();

const styles = `:root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`;
