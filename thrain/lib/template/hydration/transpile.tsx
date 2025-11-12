import { build } from 'esbuild';
import { ensureDir } from 'std';
import { removeFile, removeFilesFromDir, watchFileSystem } from '../../common/utils.ts';
import { Logger } from '../../middlewares/logger.ts';

const inDir = './src/client-components';
const outDir = './static/_client/components';

const logger = Logger.instance;

await ensureDir(outDir);
await removeFilesFromDir(outDir);

watchFileSystem(inDir, async event => {
  const [path] = event.paths;
  const [name] = path.split('/').reverse();

  if (event.kind === 'remove') {
    await removeFile(`${outDir}/${name.replace('.ts', '.js')}`);
    return;
  }

  await transpileFile(name);
});

await transpileDir();

async function transpileDir() {
  // find every .ts/.tsx in src/client-components
  for await (const file of Deno.readDir(inDir)) {
    if (!file.isFile) continue;
    if (!/\.(ts|tsx|js|jsx)$/.test(file.name)) continue;
    // if (!/\.(ts|js)$/.test(file.name)) continue;

    transpileFile(file.name);
  }

  logger.info('Listening on more changes...');
}

async function transpileFile(name: string) {
  const entry = `${inDir}/${name}`;

  await build({
    entryPoints: [entry],
    outdir: outDir,
    bundle: true,
    format: 'esm',
    target: ['es2020'],
    sourcemap: false,
    legalComments: 'none',
  });

  logger.info(`Build ${name}`);
}

// for await (const file of Deno.readDir(inDir)) {
//   if (!file.isFile) continue;
//   if (!/\.(tsx|jsx)$/.test(file.name)) continue;

//   const absolutePath = `../../../../client-side-app/${inDir}/${file.name}`;
//   const module = (await import(absolutePath)) as Module;

//   const Component = module.default;
//   // const title = module.metadata?.title ?? null;
//   // const headers = module.headers?.();
//   console.log(Component);

//   if (!Component) {
//     throw new Error('A module has to have a default export with a component.');
//   }

//   const html = renderStaticHTML(<Component />);
//   await Deno.writeTextFile(`${inDir}/${file.name.replace('.tsx', '.ts')}`, html);

//   console.log(`Compiled ${file.name} from TSX to TS`);
// }
