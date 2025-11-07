import { RpcRouter } from './router.ts';
import { RemoteProcedureProviders, RpcRoutingError } from './types.ts';

/**
 * Class representing an HTTP-based RPC (Remote Procedure Call) router.
 * This router handles incoming HTTP requests, invokes the appropriate remote procedure, and returns the result.
 *
 * @template Providers - The type of the remote procedure providers.
 * @extends RpcRouter<Providers, Request, Response>
 */
export class HttpRpcRouter<Providers extends RemoteProcedureProviders> extends RpcRouter<Providers, Request, Response> {
  /**
   * Handles an incoming HTTP request by invoking the specified provider and procedure with the given arguments.
   * Returns the result of the RPC call or an error response if the invocation fails.
   *
   * @param {Request} request - The HTTP request containing the RPC call details.
   * @returns {Promise<Response>} A promise that resolves to the HTTP response with the result of the RPC call or an error message.
   */
  async handle(request: Request): Promise<Response> {
    try {
      // Todo: type it
      const { provider, procedure, args } = await request.json();
      const result = await this.invoke(provider, procedure, args);

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      if (err instanceof RpcRoutingError) {
        return new Response(JSON.stringify({ name: err.name, error: err.message }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      if (err instanceof Error) {
        const { message, ...rest } = err;
        return new Response(JSON.stringify({ ...rest, error: message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(
        JSON.stringify({
          error: `Unknown Internal Server Error of type ${typeof err}`,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }
  }
}
