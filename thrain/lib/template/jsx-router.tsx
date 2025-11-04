/** @jsx createElement */

import { htmlResponse } from '../common/http-helpers.ts';
import { Server } from '../core/server.ts';
import { Auth } from '../middlewares/auth.ts';
import { createElement } from './element.ts';
import { renderStaticHTML } from './renderer.ts';
import { MaybeChildren, Module, Props, Element as ThrainElement } from './types.ts';

// https://www.totaltypescript.com/what-is-jsx-intrinsicelements
declare global {
  namespace JSX {
    // The type produced by a JSX expression (e.g. <div />)
    type Element = ThrainElement;

    // Attributes/props accepted by intrinsic elements (e.g. "div", "span").
    // Make children optional and accept single or multiple children.
    interface IntrinsicElements {
      // input: (Props & { children?: MaybeChildren } & { disabled: boolean }) | undefined;
      [element: string]: (Props & { children?: MaybeChildren }) | undefined;
    }
  }
}

const auth = Auth.instance;

export async function useRoutes(server: Server, path: string, folderName = 'app') {
  for await (const f of Deno.readDir(`./src/${folderName}`)) {
    if (!f.isFile) continue;

    const [name] = f.name.split('.tsx');
    auth.addPublicRoutes(`/${name}`);

    server.router.get(`/${name}`, async ctx => {
      // does it have to be like that?
      const absolutePath = `../../../${path}/${folderName}/${f.name}`;
      const module = (await import(absolutePath)) as Module;

      const Component = module.default;
      const title = module.metadata?.title ?? null;
      const headers = module.headers?.();

      if (!Component) {
        throw new Error('A module has to have a default export with a component.');
      }

      const html = renderStaticHTML(<Component />);
      return htmlResponse(html, { ctx, title, headers, useExpireTag: true });
    });
  }
}
