/** @jsx createElement */
import {} from '@thrain/template/jsx-router.tsx';
import { createElement, Slot } from '@thrain/template/index.ts';

export function Page() {
  return (
    <div>
      <h1>Page</h1>
      <Slot name="plain" />
      <Slot name="counter" props={{ initial: 3 }} />
      <Slot name="mouse" />
      <Slot name="test" />
    </div>
  );
}
