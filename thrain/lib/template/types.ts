import { TEXT_ELEMENT_TAG_NAME } from './constants.ts';

export type TagName = string;

export type Children = Element | TextElement | (Element | TextElement)[];
export type Props = Record<PropertyKey, string> | Record<never, never>;
export type PropsWithChildren = { children?: Children } & Props;
export type FunctionComponent = (props: PropsWithChildren) => Element;

export type Element = {
  type: TagName;
  props: PropsWithChildren;
};

export type HostElement = {
  type: (props: PropsWithChildren) => Element;
  props: PropsWithChildren;
  (): Element;
};

export type TextElement = {
  type: typeof TEXT_ELEMENT_TAG_NAME;
  props: {
    nodeValue: string;
    children: never[];
  };
};

export type JSXElement = Partial<Element> & {
  [key: string]: unknown;
};

export type MaybeChildren = Children | Element | string | undefined;

export type Module = {
  default: HostElement;
  metadata: Metadata | undefined;
  headers: HeadersFn | undefined;
};

export type Metadata = { title?: string };
export type Headers = {
  'Cache-Control'?: string;
};
export type HeadersFn = () => Headers;
