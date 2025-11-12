/** @jsx createElement */
import {} from '@thrain/template/jsx-router.tsx';
import { createElement } from '@thrain/template/index.ts';
import { Server } from '@thrain/core/server.ts';
import { renderStaticHTML } from '@thrain/template/renderer.ts';
import { Page } from './components/page.tsx';
import { htmlResponse } from '@thrain/common/http-helpers.ts';

export function createRoutes(server: Server) {
  server.router.get('/', () => {
    return htmlResponse(renderStaticHTML(<Page />));
  });

  server.router.get('/static/_client/components/:name', async ctx => {
    const moduleUrl = `static/_client/components/${ctx.params.name}`;
    const file = await Deno.readFile(moduleUrl);

    return new Response(file, { headers: { 'Content-Type': 'text/javascript' } });
  });
}
