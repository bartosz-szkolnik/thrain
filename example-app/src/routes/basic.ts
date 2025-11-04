import { Server } from '@thrain/core/index.ts';
import { readFileAsArrayBuffer, readTextFile } from '@thrain/common/utils.ts';
import { Auth } from '@thrain/middlewares/auth.ts';
import { getCacheControl, htmlResponse } from '@thrain/common/http-helpers.ts';

const auth = Auth.instance;
auth.addPublicRoutes('/', '/plain', '/styles/tailwind.css', '/favicon.ico');

export function createBasicRoutes(server: Server) {
  server.router.get('/', () => {
    const heading = '<h1>Welcome to the Thrain App</h1>';
    const loginLink = '<a href="./login">Allow me to login</a>';

    const main = `<main>${heading}${loginLink}</main>`;

    return htmlResponse(main);
  });

  server.router.get('/plain', () => {
    return new Response('Welcome to Thrain App', { status: 200 });
  });

  server.router.get('/styles/tailwind.css', async () => {
    const styles = await readTextFile('./src/styles/output.css');

    return new Response(styles, {
      status: 200,
      headers: { 'Content-Type': 'text/css', 'Cache-Control': getCacheControl() },
    });
  });

  server.router.get('/favicon.ico', async () => {
    const favicon = await readFileAsArrayBuffer('./public/favicon.ico');

    return new Response(favicon, {
      status: 200,
      headers: { 'Content-Type': 'image/x-icon', 'Cache-Control': 'public, max-age=3600' },
    });
  });
}
