// Renderiza um frame de cada cena (renderStill) para revisão antes do render final.
//
//   npm run stills                          -> plano de revisão completo, em out/stills
//   node scripts/render-stills.mjs MagnusAd-Vertical 120,300 out/teste
//                                            -> frames avulsos de uma composição
import {bundle} from '@remotion/bundler';
import {openBrowser, renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// frame escolhido de cada cena (30fps)
const FULL = [
  ['1-problema', 100],
  ['2-virada-traco', 158],
  ['2-virada-logo', 192],
  ['3-cubo', 262],
  ['4a-sites', 400],
  ['4b-atende', 496],
  ['4c-agenda', 586],
  ['4d-flow', 646],
  ['4e-pulse', 728],
  ['4f-voz', 802],
  ['5-nichos', 1000],
  ['6-fechamento', 1185],
];
const SHORT = [
  ['1-problema', 70],
  ['2-virada', 140],
  ['4b-atende', 228],
  ['4e-pulse', 318],
  ['6-fechamento', 440],
];
const PLAN = {
  'MagnusAd-Vertical': FULL,
  'MagnusAd-Horizontal': FULL,
  'MagnusAd-15s': SHORT,
};

const [compArg, framesArg, outArg] = process.argv.slice(2);
const jobs = compArg
  ? [[compArg, framesArg.split(',').map((f) => [`f${f}`, Number(f)]), outArg ?? 'out/teste']]
  : Object.entries(PLAN).map(([id, list]) => [id, list, 'out/stills']);

const serveUrl = await bundle({entryPoint: path.join(root, 'src/index.ts')});
const browser = await openBrowser('chrome', {
  browserExecutable: process.env.REMOTION_BROWSER_EXECUTABLE ?? null,
});

for (const [id, list, outDir] of jobs) {
  const composition = await selectComposition({serveUrl, id, puppeteerInstance: browser});
  const dir = path.join(root, outDir, id);
  fs.mkdirSync(dir, {recursive: true});
  for (const [name, frame] of list) {
    const output = path.join(dir, `${name}.png`);
    await renderStill({composition, serveUrl, frame, output, puppeteerInstance: browser});
    console.log(`${id} · ${name} (frame ${frame}) -> ${path.relative(root, output)}`);
  }
}

await browser.close({silent: true});
