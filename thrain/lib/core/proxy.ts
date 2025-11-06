import { ServerLike } from '../types.ts';

// Taken from https://blog.r0b.io/post/creating-a-proxy-with-deno/
export function createSimpleProxy(host: string, port: number, additionalHeaders?: Record<string, string>) {
  return Deno.serve({ port: 8000 }, request => {
    const { pathname, search } = new URL(request.url);
    const url = new URL('.' + pathname, `http://${host}:${port}`);
    url.search = search;

    const headers = new Headers(request.headers);
    headers.set('Host', url.hostname);

    Object.entries(additionalHeaders ?? {}).forEach(([key, value]) => {
      headers.set(key, value);
    });

    return fetch(url, {
      method: request.method,
      headers,
      body: request.body,
      redirect: 'manual',
    });
  });
}

export class Proxy {
  private readonly controller = new AbortController();
  private readonly additionalHeaders: Map<string, string> = new Map();
  private proxy?: Deno.HttpServer<Deno.NetAddr>;

  constructor(private proxyConfig: ServerLike, private targetConfig: ServerLike) {}

  start() {
    const { host, port } = this.proxyConfig;
    console.info(`Running proxy on host: ${host} port: ${port}`);

    {
      const { host, port } = this.targetConfig;
      console.info(`This proxy is targeted to host: ${host} port: ${port}`);
    }

    const { signal } = this.controller;
    this.proxy = Deno.serve({ hostname: host, port, signal }, this.handleRequest);
  }

  stop() {
    const { host, port } = this.proxyConfig;
    console.info(`Stopping proxy on host: ${host} port: ${port}`);

    this.controller.abort();
    Deno.exit(0);
  }

  addHeader(key: string, value: string) {
    this.additionalHeaders.set(key, value);
  }

  private handleRequest = (request: Request) => {
    const { host, port } = this.targetConfig;

    const { pathname, search } = new URL(request.url);
    const url = new URL('.' + pathname, `http://${host}:${port}`);
    url.search = search;

    const headers = new Headers(request.headers);
    headers.set('Host', url.hostname);

    this.additionalHeaders.forEach((value, key) => {
      headers.set(key, value);
    });

    return fetch(url, {
      method: request.method,
      headers,
      body: request.body,
      redirect: 'manual',
    });
  };
}
