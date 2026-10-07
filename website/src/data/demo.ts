// Where the demo lives. Every link on the site to the demo reads this one constant: the header,
// the footer, the buttons on the landing and use cases pages, and the "Open it in the demo" links
// under the graphs (graph-stories.ts, Anatomy.astro).
//
// Today it is the static copy at public/demo/, under the site's base path. When the hosted demo on
// Vercel is up, set DEMO_URL to its address (ending in a slash) and delete the static copy:
// public/demo/, public/demo-preview/, scripts/rebuild-demo.sh, scripts/demo-routes.mjs and
// src/demo-fallback.mjs with its `head` entry in astro.config.mjs. Check that the deep links in
// graph-stories.ts and Anatomy.astro still open the same decisions there.
export const DEMO_URL = `${import.meta.env.BASE_URL}demo/`;

/** A page of the demo, such as `demoHref('decisions/<slug>/')`; the demo's start page without one. */
export function demoHref(path = ''): string {
  return `${DEMO_URL}${path}`;
}
