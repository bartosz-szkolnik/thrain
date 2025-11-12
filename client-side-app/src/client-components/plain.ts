/// <reference lib="dom" />

export function hydrate(el: HTMLElement | null) {
  if (!el) {
    return;
  }

  const heading = document.createElement('h1');
  heading.textContent = 'Hello from client!';
  el.appendChild(heading);
}
