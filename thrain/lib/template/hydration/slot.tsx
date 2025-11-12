/** @jsx createElement */

import { createElement } from '../element.ts';

export type SlotProps = {
  name: string; // client bundle name, e.g. "Counter"
  props?: Record<string, unknown>;
  bundlePath?: string; // optional override, default 'static/_client/components'
};

export function Slot({ name, props = {}, bundlePath = 'static/_client/components' }: SlotProps) {
  const id = `slot-${Math.random().toString(36).slice(2, 9)}`;

  // safe-ish serialization (URL-encode to avoid breaking the inline script); keep props small
  const encoded = encodeURIComponent(JSON.stringify(props));
  const moduleUrl = `${bundlePath}/${name}.js`;

  return (
    <div>
      <div id={id}></div>
      <script type="module">
        {`
        (async () => {
          try {
            const resp = await fetch('${moduleUrl}')
            const file = await (await resp.blob()).text();

            const blob = new Blob([file], { type: 'text/javascript' });
            const blobUrl = URL.createObjectURL(blob);

            const mod = await import(blobUrl);
            URL.revokeObjectURL(blobUrl);

            const el = document.getElementById('${id}');
            const props = JSON.parse(decodeURIComponent('${encoded}'));

            // prefer named hydrate, fall back to default export
            if (mod.hydrate) {
              mod.hydrate(el, props);
            } else if (typeof mod.default === 'function') {
              mod.default(el.props);
            } else {
              console.warn('Client component ${name} has no hydrate/default function');
            }
          } catch (e) { console.error('Hydration error for ${name}', e) }
         })();`}
      </script>
    </div>
  );
}
