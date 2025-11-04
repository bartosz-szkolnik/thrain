/** @jsx createElement */
import { createElement } from '@thrain/template/index.ts';
import { Layout } from '../components/layout.tsx';

export default function Styled() {
  return (
    <Layout>
      <div class="flex flex-col gap-5">
        <div class="size-64 w-full bg-red-400"></div>
        <div class="size-64 w-full bg-green-400"></div>
        <div class="size-64 w-full bg-blue-400"></div>
      </div>
    </Layout>
  );
}
