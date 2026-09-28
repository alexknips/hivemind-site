import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';
import { demoFallback } from './src/demo-fallback.mjs';

const base = '/hivemind-site/';

export default defineConfig({
  site: 'https://alexknips.github.io',
  base,
  integrations: [
    starlight({
      title: 'HiveMind',
      // The app's wordmark: the "blocks" mark in the link colour, then the name.
      logo: { light: './src/assets/mark-light.svg', dark: './src/assets/mark-dark.svg', alt: '' },
      description: 'Memory for decisions: what you and your coding agents decided, and why.',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/alexknips/hivemind' },
      ],
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Quickstart', slug: 'getting-started/quickstart' },
            { label: 'Install', slug: 'getting-started/install' },
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
            { label: 'Architecture', slug: 'concepts/architecture' },
            { label: 'Auth Model', slug: 'concepts/auth-model' },
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
