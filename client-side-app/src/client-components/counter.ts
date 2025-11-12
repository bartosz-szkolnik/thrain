/// <reference lib="dom" />

export function hydrate(el: HTMLElement | null, props: { initial?: number } = {}) {
  if (!el) {
    return;
  }

  let count = Number(props.initial ?? 0);
  const button = document.createElement('button');
  button.textContent = `Count: ${count}`;

  button.addEventListener('click', () => {
    count += 1;
    button.textContent = `Count: ${count}`;
  });

  el.appendChild(button);
}
