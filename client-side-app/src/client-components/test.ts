/// <reference lib="dom" />

export function hydrate(el: HTMLElement | null) {
  if (!el) {
    return;
  }

  const heading = document.createElement('h1');
  heading.textContent = 'This is the test component!';
  el.appendChild(heading);

  const paragraph = document.createElement('p');
  paragraph.textContent = 'And this is a paragraph in the test component';
  el.appendChild(paragraph);

  const paragraph2 = document.createElement('p');
  paragraph2.textContent = 'And this is a second paragraph in the test component';
  el.appendChild(paragraph2);

  const paragraph3 = document.createElement('p');
  paragraph3.textContent = 'And this is the third paragraph in the test component';
  el.appendChild(paragraph3);

  const paragraph4 = document.createElement('p');
  paragraph4.textContent = 'And this is the fourth paragraph in the test component';
  el.appendChild(paragraph4);

  const paragraph5 = document.createElement('p');
  paragraph5.textContent = 'And this is the fifth paragraph in the test component';
  el.appendChild(paragraph5);

  const footer = document.createElement('footer');
  footer.textContent = 'And this is the footer that should allow me to finish it all';
  el.appendChild(footer);
}
