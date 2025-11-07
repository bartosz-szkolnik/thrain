import { RpcClient } from './client.ts';
import { RemoteProcedureProviders } from './types.ts';

/**
 * Class representing an HTTP-based RPC (Remote Procedure Call) client.
 * This client is responsible for sending RPC requests to a server over HTTP and handling the responses.
 *
 * @template Providers - The type of the remote procedure providers.
 * @extends RpcClient<Providers>
 */
export class HttpRpcClient<Providers extends RemoteProcedureProviders> extends RpcClient<Providers> {
  /**
   * Creates an instance of HttpRpcClient.
   *
   * @param {URL | string} url - The URL of the RPC server. This can be either a URL object or a string representing the URL.
   */
  constructor(private readonly url: URL | string) {
    super();
  }

  /**
   * Handles an RPC request by sending it to the server via HTTP POST.
   * This method serializes the provider, method, and arguments into a JSON payload and sends it to the server.
   * The server's response is then deserialized and returned as a promise.
   *
   * @param {string} provider - The name of the provider. This identifies the set of remote procedures to be invoked.
   * @param {string} procedure - The name of the procedure to invoke on the provider.
   * @param {unknown[]} args - The arguments to pass to the procedure. These arguments are serialized into the request payload.
   * @returns {Promise<unknown>} A promise that resolves to the response from the server. The response is deserialized from JSON.
   */
  override async handle(provider: string, procedure: string, args: unknown[]): Promise<unknown> {
    const result = await fetch(this.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, procedure, args }),
    });

    return result.json();
  }
}
