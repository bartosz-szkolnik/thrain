// deno-lint-ignore-file no-explicit-any

/**
 * Type representing a remote procedure which is a function that takes any number of arguments and returns any type.
 *
 * All Arguments and return types must be serializable to JSON otherwise the RPC system will miss them.
 */
export type RemoteProcedure = (...args: any[]) => any;

/**
 * Type representing a provider of remote procedures, which is a record where keys are strings and values are RemoteProcedure functions.
 */
export type RemoteProcedureProvider = Record<string, RemoteProcedure>;

/**
 * Type representing multiple providers of remote procedures, which is a record where keys are strings and values are RemoteProcedureProvider objects.
 */
export type RemoteProcedureProviders = Record<string, RemoteProcedureProvider>;

export type AsPromises<T> = {
  [P in keyof T]: T[P] extends (...args: infer A) => infer R
    ? (...args: A) => R extends Promise<any> ? R : Promise<R>
    : never;
};

export class RpcRoutingError extends Error {
  constructor(message: string) {
    super(message);
  }
}
