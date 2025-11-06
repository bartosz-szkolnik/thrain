import { createLoadBalancingProxy as roundRobinProxy } from '@thrain/load-balancing/round-robin.ts';
import { createLoadBalancingProxy as leastConnectionsProxy } from '@thrain/load-balancing/least-connections.ts';
import { createServer, parse } from './utils.ts';

const loadBalancingAlgorithm = getLoadBalancingAlgorithm();

const serverConfigJSON = await Deno.readTextFile('./config.json');
const serversConfig = parse(serverConfigJSON).servers;

for (const { host, port, timeout } of serversConfig) {
  createServer(host, port, timeout);
}

const hostname = 'localhost';
const port = 8000;
console.info(`\nRunning proxy on host: ${hostname}:${port}`);

if (loadBalancingAlgorithm === '1') {
  console.info('Using Round Robin as load balancing algorithm');
  roundRobinProxy(hostname, port, serversConfig);
} else if (loadBalancingAlgorithm === '2') {
  console.info('Using Least Connections as load balancing algorithm');

  leastConnectionsProxy(hostname, port, serversConfig);
}

function getLoadBalancingAlgorithm() {
  const algorithm = prompt(`Please choose a load balancing algorithm.
    1. Round Robin
    2. Least Connections
  `);

  const possibleValues = ['1', '2'];
  if (!algorithm || !possibleValues.includes(algorithm)) {
    Deno.exit(0);
  }

  return algorithm;
}
