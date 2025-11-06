import { ServerLike } from '../types.ts';

type ServerAdapter = {
  server: ServerLike;
  connections: number;
};

function createServerAdapter(server: ServerLike) {
  return {
    server,
    connections: 0,
  } satisfies ServerAdapter;
}

export function createLoadBalancingProxy<TServer extends ServerLike>(
  hostname: string,
  port: number,
  servers: TServer[],
) {
  const adapters = servers.map(createServerAdapter);

  return Deno.serve({ port, hostname }, async request => {
    const sorted = adapters.sort((a, b) => a.connections - b.connections);
    const target = sorted[0];
    target.connections++;

    const {
      server: { host, port },
    } = target;

    const { pathname, search } = new URL(request.url);
    const url = new URL('.' + pathname, `http://${host}:${port}`);
    url.search = search;

    const headers = new Headers(request.headers);
    headers.set('Host', url.hostname);

    const response = await fetch(url, {
      method: request.method,
      headers,
      body: request.body,
      redirect: 'manual',
    });

    target.connections--;
    return response;
  });
}
