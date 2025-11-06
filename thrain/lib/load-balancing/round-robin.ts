import { ServerLike } from '../types.ts';

let current = -1;
export function createLoadBalancingProxy<TServer extends ServerLike>(
  hostname: string,
  port: number,
  servers: TServer[],
) {
  return Deno.serve({ port, hostname }, request => {
    current = (current + 1) % servers.length;
    const { host, port } = servers[current];

    const { pathname, search } = new URL(request.url);
    const url = new URL('.' + pathname, `http://${host}:${port}`);
    url.search = search;

    const headers = new Headers(request.headers);
    headers.set('Host', url.hostname);

    return fetch(url, {
      method: request.method,
      headers,
      body: request.body,
      redirect: 'manual',
    });
  });
}
