import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';
import { demoFallback } from './src/demo-fallback.mjs';

// Where the site is served: GitHub Pages at alexknips.github.io/hivemind-site/ today. Once
// www.loomtracer.ai points at GitHub Pages, this line becomes 'https://www.loomtracer.ai/' and the
// custom domain is set in the repository's Pages settings. Every internal link reads the base from
// here (import.meta.env.BASE_URL), and so does scripts/rebuild-demo.sh. The static demo in
// public/demo/ is built for the old base: rebuild it then, or point src/data/demo.ts at the hosted demo.
const siteUrl = new URL('https://alexknips.github.io/hivemind-site/');
const base = siteUrl.pathname;

export default defineConfig({
  site: siteUrl.origin,
  base,
  // Pages merged away on 2026-10-02: Install went into the Quickstart, Architecture and Auth Model
  // into How it works. Old links land on the page that holds their content now.
  redirects: {
    '/getting-started/install': `${base}getting-started/quickstart/`,
    '/concepts/architecture': `${base}concepts/how-it-works/`,
    '/concepts/auth-model': `${base}concepts/how-it-works/`,
  },
  integrations: [
    starlight({
      title: 'Loomtracer',
      // Loomtracer's logo: the mark from the deck's logo (public/pitch/brand/loomtracer-color.svg)
      // with its threads shortened to a square, beside the same wordmark; ink on light, ivory on dark.
      logo: {
        light: './src/assets/logo-light.svg',
        dark: './src/assets/logo-dark.svg',
        alt: 'Loomtracer',
        replacesTitle: true,
      },
      description: 'Memory for decisions: what you and your coding agents decided, and why.',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/alexknips/hivemind' },
      ],
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Quickstart', slug: 'getting-started/quickstart' },
          ],
        },
        {
          label: 'Guides',
          items: [
            { label: 'MCP Setup', slug: 'guides/mcp-setup' },
            { label: 'Agent Capture', slug: 'guides/agent-capture' },
            { label: 'Human Review', slug: 'guides/human-review' },
          ],
        },
        {
          label: 'Concepts',
          items: [
            { label: 'How it works', slug: 'concepts/how-it-works' },
            { label: 'Decision Graph', slug: 'concepts/decision-graph' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'CLI Reference', slug: 'reference/cli' },
            { label: 'MCP Tools', slug: 'reference/mcp-tools' },
          ],
        },
      ],
      customCss: ['./src/styles/custom.css'],
      // On the site's 404 page at a path under demo/, show the demo app instead
      // (src/demo-fallback.mjs); on every other page it does nothing.
      head: [{ tag: 'script', content: `(${demoFallback})(${JSON.stringify(`${base}demo/`)});` }],
    }),
    tailwind({ applyBaseStyles: false }),
  ],
});
