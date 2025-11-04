/** @jsx createElement */
import { createElement } from '@thrain/template/index.ts';
import { SwordIcon } from './icons/sword.tsx';

export function Navbar() {
  return (
    <header class="bg-white dark:bg-[#111111]">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center">
          <div class="flex items-center flex-1">
            <SwordIcon />
            <div class="ml-1 font-bold text-blue-500">Thrain Example App</div>
          </div>
          <div>
            <nav aria-label="Global">
              <ul class="flex items-center gap-6 text-sm">
                <li>
                  <a class="text-gray-500 dark:text-white transition hover:text-blue-500" href="/home">
                    Home
                  </a>
                </li>
                <li>
                  <a class="text-gray-500 dark:text-white transition hover:text-blue-500" href="/about">
                    About
                  </a>
                </li>
                <li>
                  <a class="text-gray-500 dark:text-white transition hover:text-blue-500" href="/styled">
                    Styled
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
