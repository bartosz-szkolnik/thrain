import { createElement } from './element.ts';
import { renderStaticHTML } from './renderer.ts';
import { Element } from './types.ts';

type BasicHTMLConfig = {
  charset: Element;
  viewport: Element;
  colorScheme: Element;
  title: Element;
  headElements?: Element[];
};

const DEFAULT_BASIC_HTML_CONFIG = {
  charset: createElement('meta', { charset: 'UTF-8' }),
  viewport: createElement('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }),
  colorScheme: createElement('meta', { name: 'color-scheme', content: 'light dark' }),
  title: createTitleElement('Thrain App'),
} satisfies BasicHTMLConfig;

export function generateBasicHTML(body: string, config: Partial<BasicHTMLConfig>) {
  const charset = config.charset ?? DEFAULT_BASIC_HTML_CONFIG.charset;
  const viewport = config.viewport ?? DEFAULT_BASIC_HTML_CONFIG.viewport;
  const colorScheme = config.colorScheme ?? DEFAULT_BASIC_HTML_CONFIG.colorScheme;
  const titleElement = config.title ?? DEFAULT_BASIC_HTML_CONFIG.title;
  const headElements = config.headElements ?? [];

  const element = createElement(
    'html',
    { lang: 'en' },
    createElement('head', null, charset, viewport, colorScheme, titleElement, addSimpleJavaScript(), ...headElements),
    createElement('body', null, body),
  );

  return `
    <!DOCTYPE html>
    ${renderStaticHTML(element)}
  `;
}

export function createTitleElement(title: string | null) {
  return createElement('title', {}, title ?? 'Thrain App');
}

function addSimpleJavaScript() {
  const script = createElement(
    'script',
    null,
    `console.log('This is an example Thrain App. Hope you have a nice day.');`,
  );
  return script;
}
