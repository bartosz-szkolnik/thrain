import { createTitleElement, generateBasicHTML } from '../template/common.ts';
import { Element } from '../template/types.ts';

declare const Buffer: {
  byteLength: (value: string, encoding: 'utf8') => number;
};

export class Layout {
  private static _instance: Layout;

  private constructor() {}

  static get instance(): Layout {
    if (!Layout._instance) {
      Layout._instance = new Layout();
    }

    return Layout._instance;
  }

  checkIfContainsHTML(response: Response | void) {
    if (!response) {
      return false;
    }

    const ct = response.headers.get('content-type') ?? '';
    return ct.includes('text/html');
  }

  async addBasicHTMLToResponse(response: Response, title: string | null, headElements: Element[]) {
    const body = await response.text();
    const html = generateBasicHTML(body, { title: createTitleElement(title), headElements });

    // copy important headers and status
    const headers = new Headers(response.headers);
    headers.set('content-length', String(Buffer.byteLength(html, 'utf8')));

    return new Response(html, { status: response.status, headers });
  }
}
