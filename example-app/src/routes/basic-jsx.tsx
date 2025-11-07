/** @jsx createElement */

import { Auth } from '@thrain/middlewares/auth.ts';
import { Server } from '@thrain/core/server.ts';
import { Children, createElement, renderStaticHTML } from '@thrain/template/index.ts';
import { htmlResponse } from '@thrain/common/http-helpers.ts';
import { redirect } from '@thrain/common/utils.ts';

const auth = Auth.instance;
auth.addPublicRoutes('/jsx', '/jsx/home', '/test2');

export function createJSXRoutes(server: Server) {
  server.router.get('/jsx', _ctx => {
    const jsx = <div style="font-family: Helvetica">Hello There</div>;

    const html = renderStaticHTML(jsx);
    return htmlResponse(html);
  });

  server.router.get('/jsx/home', _ctx => {
    const jsx = (
      <HomePage something="else">
        <h2>Hello from outside of home</h2>
        <h2>asd</h2>
      </HomePage>
    );

    const html = renderStaticHTML(jsx);
    return htmlResponse(html);
  });

  server.router.post('/test2', async ctx => {
    const data = await ctx.request.formData();
    console.log(data);

    return redirect('/jsx');
  });
}

function HomePage({ children }: { children?: Children; something: string }) {
  return (
    <div>
      <h1>Hello Thrain!</h1>
      <hr />
      {children}
    </div>
  );
}
