/**
 * The demo's fallback on GitHub Pages.
 *
 * `public/demo/` is a build of the app (hivemind-ui) with a file for every page it links
 * to (`demo/decisions/<slug>/`, `demo/graph/<slug>/`, `demo/flow/`; written by
 * `scripts/rebuild-demo.sh`), so those links answer 200. Pages answers any other
 * missing path with the site's one `404.html`, which is Starlight's "not found"
 * page. This script sits in the head of every Starlight page and does nothing,
 * except on that page at a path under `demo/`: there it swaps the page for the app,
 * which reads the path and shows what it names (or its own front page). The HTTP
 * status stays 404, so only a browser sees the app there, not a crawler.
 *
 * astro.config.mjs inlines it with `String(demoFallback)`: it must be self-contained.
 */
export function demoFallback(demoBase) {
  if (!location.pathname.startsWith(demoBase)) return;
  const root = document.documentElement;
  root.style.visibility = 'hidden';

  // A parsed <script> never runs; a fresh copy of it does.
  const live = (node) => {
    if (node.nodeName !== 'SCRIPT') return document.importNode(node, true);
    const script = document.createElement('script');
    for (const { name, value } of node.attributes) script.setAttribute(name, value);
    script.text = node.text;
    return script;
  };
  const parsed = new Promise((resolve) => {
    if (document.readyState !== 'loading') resolve();
    else document.addEventListener('DOMContentLoaded', () => resolve(), { once: true });
  });
  const app = fetch(`${demoBase}index.html`).then((response) => {
    if (!response.ok) throw new Error(`${demoBase}index.html: ${response.status}`);
    return response.text();
  });

  Promise.all([app, parsed])
    .then(([html]) => {
      const page = new DOMParser().parseFromString(html, 'text/html');
      for (const { name } of [...root.attributes]) root.removeAttribute(name);
      for (const { name, value } of page.documentElement.attributes) root.setAttribute(name, value);
      // The body first, so the app's script finds its root element.
      document.body.replaceWith(document.importNode(page.body, true));
      document.head.replaceChildren(...[...page.head.childNodes].map(live));
    })
    .catch(() => root.style.removeProperty('visibility'));
}
