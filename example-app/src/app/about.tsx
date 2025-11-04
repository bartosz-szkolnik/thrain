/** @jsx createElement */
import { createElement } from '@thrain/template/element.ts';
import { Layout } from '../components/layout.tsx';

export const metadata = {
  title: 'About Page',
};

export default function AboutPage() {
  return (
    <Layout>
      <h1>Hello from About page!</h1>
      <hr />
      {Array.from({ length: 10000 }).map((_, i) => createElement('div', null, `I am junk ${i}.`))}
    </Layout>
  );
}
