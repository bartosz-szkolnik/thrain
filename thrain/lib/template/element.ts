import { TEXT_ELEMENT_TAG_NAME } from './constants.ts';
import { type Element, type TextElement, type TagName } from './types.ts';

export function createElement(
  type: TagName,
  props?: Record<string, string> | null,
  ...children: (Element | string)[]
): Element {
  const c = children.flat().map(child => (typeof child === 'object' ? child : createTextElement(child)));
  return { type, props: { ...props, children: c } };
}

function createTextElement(text: string): TextElement {
  return {
    type: TEXT_ELEMENT_TAG_NAME,
    props: { nodeValue: text, children: [] },
  };
}

export function isTextElement(element: Element): element is TextElement {
  return (
    element.type === TEXT_ELEMENT_TAG_NAME &&
    Object.hasOwn(element.props, 'nodeValue') &&
    Object.hasOwn(element.props, 'children')
  );
}
