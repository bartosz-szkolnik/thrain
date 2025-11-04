/** @jsx createElement */
import { createElement, PropsWithChildren } from '@thrain/template/index.ts';
import { Navbar } from './navbar.tsx';

export function Layout(props: PropsWithChildren) {
  return (
    <div>
      <Navbar />
      <main class="mx-auto px-4 sm:px-6 lg:px-8">{props.children}</main>
    </div>
  );
}
