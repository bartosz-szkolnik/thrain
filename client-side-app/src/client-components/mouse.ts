/// <reference lib="dom" />

export function hydrate(el: HTMLElement) {
  const div = document.createElement('div');
  div.style.width = '100%';
  div.style.height = '50vh';
  div.style.border = '2px solid white';
  div.style.borderRadius = '10px';

  const text = document.createElement('h1');
  div.appendChild(text);

  div.addEventListener('mousemove', event => {
    const { clientX, clientY } = event;
    text.textContent = `Your mouse position is (${clientX}, ${clientY})`;
  });

  el.appendChild(div);
}
