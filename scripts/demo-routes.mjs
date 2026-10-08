// Writes a copy of the demo's index.html at every path the app links to, so each
// link answers 200 instead of the site's 404 page. Run by
// scripts/rebuild-demo.sh from inside the hivemind-ui checkout (it imports that
// checkout's Vite), after `npm run build:demo`:
//
//   node demo-routes.mjs <dist> <base>
//
// The paths come from the app's own code, not a copy of it: the snapshot is read
// with src/data/serverGraph.ts, each decision's slug comes from
// src/decision/decisionSlug.ts, and each URL from urlFor() in src/useUrlSync.ts,
// checked back through readUrlState().
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { runnerImport } from 'vite';

const [distArg, base] = process.argv.slice(2);
if (!distArg || !base?.startsWith('/') || !base.endsWith('/')) {
  console.error('usage: node demo-routes.mjs <dist> </base/path/>');
  process.exit(2);
}
const dist = resolve(distArg);

// Vite's `import.meta.env.BASE_URL` is what the app's URL code reads its base from.
const load = async (file) =>
  (await runnerImport(resolve(file), { configFile: false, logLevel: 'error', base })).module;
const { mapServerGraph } = await load('src/data/serverGraph.ts');
const { decisionAddresses } = await load('src/decision/decisionSlug.ts');
const { urlFor, readUrlState } = await load('src/useUrlSync.ts');

const graph = JSON.parse(readFileSync(join(dist, 'snapshot/graph.json'), 'utf8'));
const { decisions } = mapServerGraph(graph);
const addresses = decisionAddresses(decisions);

// The surfaces with a path of their own, then the two that name a decision.
const states = [
  ...['index', 'graph', 'flow', 'diagnostics'].map((view) => ({ view, decision: '' })),
  ...decisions.flatMap((d) => ['detail', 'graph'].map((view) => ({ view, decision: addresses.slugOf(d.id) }))),
];

const written = [];
for (const want of states) {
  const state = { filter: '', chapter: '', project: '', ...want };
  const url = urlFor(state, base);
  if (!url?.startsWith(base) || url.includes('?')) throw new Error(`unexpected URL for ${JSON.stringify(want)}: ${url}`);
  const got = readUrlState({ pathname: url, search: '' }, base);
  if (got.view !== state.view) {
    // A surface the app no longer has reads as its front page: nothing to write.
    console.warn(`skipped ${url}: the app reads it as "${got.view}", not "${state.view}"`);
    continue;
  }
  if (got.decision !== state.decision) throw new Error(`${url} reads back as decision "${got.decision}"`);
  const file = join(dist, decodeURIComponent(url.slice(base.length)), 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  copyFileSync(join(dist, 'index.html'), file);
  written.push(url);
}
console.log(`${written.length} pages for ${decisions.length} decisions:\n  ${written.join('\n  ')}`);
