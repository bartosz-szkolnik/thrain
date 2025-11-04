import { Context } from '../core/router.ts';
import { createHash } from 'node:crypto';
import { Headers } from '../template/types.ts';

type HTMLRespongeArgs = { title: string | null; useExpireTag: false } | HTMLRespongeWithHeadersArgs;
type HTMLRespongeWithHeadersArgs = { title: string | null; useExpireTag: true; ctx: Context; headers?: Headers };

export function htmlResponse(html: string, args: HTMLRespongeArgs = { title: null, useExpireTag: false }) {
  const { title, useExpireTag } = args;
  // Basic case, where we don't care about more headers and we don't use etag
  if (!useExpireTag) {
    const headers = { 'Content-Type': 'text/html', Title: title ?? '' };

    return new Response(html, {
      status: 200,
      headers: { 'Cache-Control': getCacheControl(), ...headers },
    });
  }

  const { ctx, headers } = args as HTMLRespongeWithHeadersArgs;

  // User provided his own headers so we don't interfere with those, still use etag though
  if (headers) {
    return handleRevalidate(html, ctx.request, headers, title);
  }

  // We use etag, but with a default max-age of 1 hour
  return handleRevalidate(html, ctx.request, { 'Cache-Control': getCacheControl() }, title);
}

export function getCacheControl() {
  const isProd = Deno.env.get('BUILD_TYPE') === 'PROD';
  if (isProd) {
    return 'public, max-age=3600';
  }

  return 'private, no-store';
}

function handleRevalidate(html: string, request: Request, headers: Headers, title: string | null) {
  const etag = getExpireTag(html);
  const ifNoneMatch = request.headers.get('if-none-match')?.slice(2);
  if (etag === ifNoneMatch) {
    return new Response(null, { status: 304 });
  }

  return new Response(html, {
    status: 200,
    headers: {
      // 'Cache-Control': 'max-age=0, must-revalidate', // this makes the browser always revalidate
      // 'Cache-Control': 'max-age=10', // this allows browser to cache it for 10 seconds before revalidating
      'Content-Type': 'text/html',
      Title: title ?? '',
      ...headers,
      etag,
    },
  });
}

export function getExpireTag(html: string) {
  return md5(html);
}

function md5(value: string) {
  return createHash('md5').update(value).digest('hex');
}
