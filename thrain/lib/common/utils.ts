import { Context } from '../core/router.ts';

export function readTextFile(path: string) {
  return Deno.readTextFile(path);
}

export function writeFile(path: string, json: string) {
  return Deno.writeTextFile(path, json);
}

export function readFileAsArrayBuffer(path: string) {
  return Deno.readFile(path);
}

export function redirect(location: string, status = 302) {
  return new Response(null, {
    status,
    headers: { Location: location },
  });
}

export async function readFormData(ctx: Context) {
  if (!ctx.request.body) {
    throw new Error('Provided context with no body.');
  }

  const reader = ctx.request.body.getReader();

  const stream = new ReadableStream({
    start(controller) {
      return pump();

      async function pump(): Promise<void> {
        const { done, value } = await reader.read();
        if (done) {
          // When no more data needs to be consumed, close the stream
          controller.close();
          return;
        }

        // Enqueue the next data chunk into our target stream
        controller.enqueue(value);
        return pump();
      }
    },
  });

  const blob = await new Response(stream).blob();
  const formData = new FormData();

  for (const entry of (await blob.text()).split('&')) {
    const [key, value] = entry.split('=');
    formData.set(key, value);
  }

  return formData;
}
