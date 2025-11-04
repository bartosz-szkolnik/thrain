import { isTextElement } from './element.ts';
import type { Element, TextElement, HostElement } from './types.ts';

export function renderStaticHTML(element: Element | HostElement): string {
  if (isHostElement(element)) {
    return createHostElement(element);
  }

  return createDOMElement(element);
}

function createDOMElement(element: Element) {
  const props = createPropsString(element);

  if (isTextElement(element)) {
    if (isCustomPropsEmpty(element.props)) {
      return element.props.nodeValue;
    }

    return `<span ${props}>${element.props.nodeValue}</span>`;
  }

  return `<${element.type} ${props}>${renderChildren(element)}</${element.type}>`;
}

function createHostElement(element: HostElement) {
  return renderStaticHTML(element.type(element.props));
}

function renderChildren(element: Element) {
  const children = element.props.children;
  if (!children) {
    return '';
  }

  if (Array.isArray(children)) {
    return children.map(child => renderStaticHTML(child)).join('');
  }

  return renderStaticHTML(children);
}

function createPropsString(element: Element) {
  const isProperty = (key: string) => key !== 'children' && key !== 'nodeValue';
  return Object.entries(element.props)
    .flatMap(([key, value]) => {
      if (!isProperty(key)) {
        return [];
      }

      return `${key}="${value}"`;
    })
    .join(' ');
}

function isCustomPropsEmpty(props: TextElement['props']) {
  const { children: _, nodeValue: __, ...p } = props;
  return Object.keys(p).length === 0;
}

function isHostElement(element: Element | HostElement): element is HostElement {
  return typeof element.type === 'function';
}
