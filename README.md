# hivemind-site

The HiveMind website: the landing page, the docs, the pitch deck (`/pitch/`), the use cases
(`/use-cases/`) and the 12 Angry Men demo (`/demo/`).

**Live:** https://alexknips.github.io/hivemind-site/

The product's code lives in [alexknips/hivemind](https://github.com/alexknips/hivemind). This
repo holds only the site. It moves again when the product is renamed.

## Layout

```
website/                  Astro + Starlight site
  src/pages/index.astro   landing page
  src/content/docs/       the docs
  public/pitch/           pitch deck (static HTML)
  public/use-cases/       use cases (static HTML)
  public/demo/            12 Angry Men demo (vendored hivemind-ui build)
.github/workflows/
  deploy.yml              build and deploy to GitHub Pages on push to main
  reference-docs.yml      fail if the docs drift from hivemind's code
```

The site stays under `website/` because hivemind's reference generator reads
`website/src/...` paths relative to its working directory.

## Run it locally

```sh
cd website
npm ci
npm run dev        # http://localhost:4321/hivemind-site/
npm run build      # static output in website/dist/
```

## Docs stay in sync with the code

`reference-docs.yml` checks out `alexknips/hivemind` at `master`, builds its
`generate-reference` binary and runs `--check` from this repo's root. It fails if
`reference/mcp-tools.md` or `reference/cli.md`, the tool count and the "Available tools"
table in `guides/mcp-setup.md`, or the tool count on the homepage drift from the code. It
runs on every push and pull request, and daily, so a hivemind change that drifts the docs
turns it red within a day.

To regenerate after a hivemind change, with hivemind checked out next to this repo:

```sh
cargo run --manifest-path ../hivemind/Cargo.toml --bin generate-reference
```

## The demo

`website/public/demo/` is a production build of hivemind-ui with the Vite base
`/hivemind-site/demo/`. To re-vendor it, build hivemind-ui with that base and replace the
directory's contents with its `dist/`.

## License

AGPL-3.0, the same as HiveMind. See [LICENSE](LICENSE).
