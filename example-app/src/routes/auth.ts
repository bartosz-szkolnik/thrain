import { Auth, Logger } from '@thrain/middlewares/index.ts';
import { Server } from '@thrain/core/index.ts';
import { createElement, renderStaticHTML } from '@thrain/template/index.ts';
import { redirect } from '@thrain/common/index.ts';
import { createCookieWithToken, validateData } from '../auth.ts';
import { getUserByCredentials } from '../db/users.ts';
import { htmlResponse } from '@thrain/common/http-helpers.ts';

const auth = Auth.instance;
const logger = Logger.instance;
auth.addPublicRoutes('/login', '/authenticate');

export function createAuthRoutes(server: Server) {
  server.router.get('/login', _ctx => {
    const element = createElement(
      'form',
      { id: 'login-form', action: 'authenticate', method: 'POST' },
      createElement('label', { for: 'email' }, 'E-mail address: '),
      createElement('input', { type: 'email', id: 'email', name: 'email' }),
      createElement('br'),
      createElement('label', { for: 'password' }, 'Password: '),
      createElement('input', { type: 'password', id: 'password', name: 'password' }),
      createElement('br'),
      createElement('button', { type: 'submit' }, 'Log in'),
    );

    const html = renderStaticHTML(element);
    return htmlResponse(html);
  });

  server.router.post('/authenticate', async ctx => {
    const formData = await ctx.request.formData();
    const data = Object.fromEntries(formData.entries());

    try {
      const { email, password } = validateData(data);
      const user = await getUserByCredentials(email, password);
      if (!user) {
        throw new Error('Incompatible email or password given.');
      }

      const cookieHeader = createCookieWithToken(user);
      return new Response(null, {
        status: 302,
        headers: {
          'Content-Type': 'text/html',
          'Set-Cookie': cookieHeader,
          Location: '/private',
        },
      });
    } catch (err: unknown) {
      logger.error(`${err}`);
      return redirect('/login');
    }
  });

  server.router.get('/private', _ctx => {
    return htmlResponse('<h1>Welcome to the private club</h1>');
  });
}
