// node deck.mjs <deck url>: print the deck to loomtracer-pitch.pdf (16x9 in, one slide per page) and
// draw the contact sheet loomtracer-pitch.png (two slides per row at 800x450, labelled NN / total).
// Serve the built site first (npm run build && npm run preview in website/) and pass the deck's URL,
// e.g. http://localhost:4321/hivemind-site/pitch/. Needs `npm i playwright`; CHROME=<path> picks a browser.
import { chromium } from 'playwright';
const url = process.argv[2];
if (!url) throw new Error('usage: node deck.mjs <deck url>');
const b = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
await p.goto(url, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.pdf({ path: 'loomtracer-pitch.pdf', preferCSSPageSize: true, printBackground: true });

await p.addStyleTag({ content: '.controls{display:none!important}' });
const total = await p.locator('.slide').count();
const shots = [];
for (let n = 1; n <= total; n++) {
  await p.evaluate((n) => { location.hash = `#slide-${n}`; }, n);
  await p.waitForTimeout(300);
  shots.push((await p.locator('#stage').screenshot({ scale: 'css' })).toString('base64'));
}

const pad = (n) => String(n).padStart(2, '0');
const cells = shots.map((s, i) => `<figure><img src="data:image/png;base64,${s}"><figcaption>${pad(i + 1)} / ${pad(total)}</figcaption></figure>`).join('');
const sheet = await b.newPage({ viewport: { width: 1648, height: 400 } });
await sheet.setContent(`<style>
  body{margin:0;background:#332B32;font:22px 'Source Sans 3',system-ui,sans-serif;color:#FDF8F4}
  main{display:flex;flex-wrap:wrap;justify-content:center;gap:0 12px;padding:24px 12px 0 24px;width:1612px}
  figure{margin:0;width:800px;height:504px}img{display:block;width:800px;height:450px}
  figcaption{line-height:42px}</style><main>${cells}</main>`);
await sheet.locator('main').screenshot({ path: 'loomtracer-pitch.png' });
await b.close();
