// node shoot.mjs <name>...: screenshot <name>.html (written by ansi2html.py) to <name>.png at 2x
import { chromium } from 'playwright';
const names = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ deviceScaleFactor: 2, viewport: { width: 900, height: 900 } });
for (const n of names) {
  await p.goto('file://' + process.cwd() + '/' + n + '.html');
  await (await p.$('#term')).screenshot({ path: n + '.png' });
}
await b.close();
