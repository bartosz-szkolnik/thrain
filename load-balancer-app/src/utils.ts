import { Server } from '@thrain/core/server.ts';
import { Config } from './types.ts';
import { wait } from '@thrain/core/utils.ts';

export function createServer(host: string, port: number, timeout: number) {
  const server = new Server(host, port);

  server.router.get('/', async _context => {
    console.log(`Server on port ${port} is working...`);
    await wait(timeout);
    console.log(`Server on port ${port} has finished working`);
    return new Response(`Server response from port ${port}.\n`);
  });

  server.start();
}

export function parse(value: string) {
  return JSON.parse(value) as Config;
}
