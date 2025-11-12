import { Context } from '../core/router.ts';
import { executeAfter } from '../core/utils.ts';

export function readTextFile(path: string) {
  return Deno.readTextFile(path);
}

export function writeTextFile(path: string, json: string) {
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

/**
 * @deprecated Use `ctx.request.formData();` to get the FormData object.
 * Leaving it here just for educational purposes.
 */
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

export async function removeFilesFromDir(dir: string) {
  await Deno.remove(dir, { recursive: true });
}

export async function removeFile(name: string) {
  await Deno.remove(name);
}

export async function watchFileSystem(path: string, callback: (event: Deno.FsEvent) => void) {
  const watcher = Deno.watchFs(`./${path}`);
  const events = new Set<Deno.FsEvent['kind']>();

  for await (const event of watcher) {
    // For some reason when saving a file, two save events occur one after the other.
    // I don't want to call the callback two times so I added
    // this checking whether the event has occured already or not.
    if (events.has(event.kind)) {
      continue;
    }

    events.add(event.kind);
    callback(event);

    // We execute this after 10 miliseconds, because this for loop
    // never stops, it keeps waiting for new events, so the code after the loop
    // is not invoked. This made me do it this way. After 10 miliseconds
    // (hopefully all the events finished processing), we clear the Set of events,
    // so that the new save event (after user saved a file) will work normally.
    executeAfter(10, () => events.clear());
  }
}
