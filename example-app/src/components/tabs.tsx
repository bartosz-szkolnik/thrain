// Built with https://css-tricks.com/pure-css-tabs-with-details-grid-and-subgrid/

/** @jsx createElement */
import { Children, createElement, PropsWithChildren } from '@thrain/template/index.ts';

export function Tabs({ children }: PropsWithChildren) {
  return <div class="tabs">{children}</div>;
}

type TabProps = { name: string; isOpen: boolean; label: string; children?: Children; style: string };
export function Tab({ name, isOpen, label, children, style }: TabProps) {
  return (
    <details class="tab" name={name} open={isOpen ? 'open' : 'closed'} style={style}>
      <summary class="tab-label">{label}</summary>
      {children}
    </details>
  );
}
