/** @jsx createElement */
import { createElement } from '@thrain/template/index.ts';
import { Children, Metadata, HeadersFn } from '@thrain/template/types.ts';
import { Layout } from '../components/layout.tsx';
import { Input } from '../components/input.tsx';
import { Button } from '../components/button.tsx';

export const metadata: Metadata = {
  title: 'Home',
};

export const headers: HeadersFn = () => {
  return {
    'Cache-Control': 'max-age=60',
  };
};

export default function HomePage({}: { children?: Children }) {
  return (
    <Layout>
      <h1>Hello Thrain!</h1>
      <hr />
      <form class="mt-2 max-w-md" action="/test2" method="POST">
        <label htmlFor="test">Here's a test input</label>
        <Input id="test" name="test" />
        <br />
        <Button>Click me please!</Button>
      </form>
    </Layout>
  );
}
