# hivemind-site

The HiveMind website: the landing page, the docs, the pitch deck (`/pitch/`), the use cases
(`/use-cases/`) and the demo (`/demo/`): the app itself, read-only, over made-up example data.

**Live:** https://alexknips.github.io/hivemind-site/

The product's code lives in [alexknips/hivemind](https://github.com/alexknips/hivemind). This
repo holds only the site. It moves again when the product is renamed.

## Layout

```
website/                  Astro + Starlight site
  src/pages/index.astro   landing page
  src/pages/use-cases.astro  use cases, on the landing page's header, footer and cards
  src/pages/pitch/        pitch deck (its own layout and script, the site's tokens); its screenshots are in public/pitch/img/
  src/components/         the header, footer and colour-scheme script the pages above share
  src/styles/tokens.css   design tokens: a copy of the app's (hivemind-ui src/styles/tokens.css), so site and app look the same
  src/content/docs/       the docs
  public/demo/            the demo: hivemind-ui's read-only snapshot build, never edited by hand
  src/demo-fallback.mjs   shows the demo, not the 404 page, at a missing path under /demo/
pitch-screens/            raw captures behind the deck's terminal screenshots, and how to re-render them
scripts/
  rebuild-demo.sh         rebuild public/demo/ from hivemind-ui and open a pull request
  demo-routes.mjs         its helper: a page for every link the demo app makes
CLAIMS.md                 every claim on the landing and use cases pages, with its evidence (release, changelog section, plan)
.github/workflows/
  deploy.yml                  build and deploy to GitHub Pages on push to main
  reference-docs.yml          fail if the docs drift from the latest hivemind release
  regenerate-reference.yml    regenerate the generated docs from that release, commit, deploy
.github/scripts/
  commit-generated-reference.sh   commits only what the generator owns
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

## The reference follows the latest hivemind release

The site documents the latest hivemind **release**, not master: master's new flags and tools
would advertise what nobody can install yet.

`reference-docs.yml` resolves the latest release tag
(`gh api repos/alexknips/hivemind/releases/latest`), checks out `alexknips/hivemind` at it,
builds its `generate-reference` binary and runs `--check` from this repo's root. It fails if
`reference/mcp-tools.md`, the tool counts in `guides/mcp-setup.md` and on the homepage, the
"Available tools" table in `guides/mcp-setup.md`, or the subcommand names in `reference/cli.md`
drift from that release. It runs on every push and pull request, and daily.

`regenerate-reference.yml` regenerates the generated parts from the same tag every six hours
and on manual dispatch (Actions -> "Regenerate reference docs" -> Run workflow, which is the
thing to do right after a release), commits the change to `main`, then runs the Pages deploy
and the check. It only ever commits what the generator writes: `reference/mcp-tools.md` as a
whole, and the digits of the "N tools" mentions in `guides/mcp-setup.md` and
`src/pages/index.astro`. `.github/scripts/commit-generated-reference.sh` refuses anything else.

Hand-written, and updated by hand at release time: `reference/cli.md` and the "Available
tools" table in `guides/mcp-setup.md`. When a release adds a tool, the check stays red on
`main` until that table row (and any `cli.md` section) is written. That red is the alarm, not
a fault in the job.

To regenerate locally, with hivemind checked out next to this repo at the release tag:

```sh
cargo run --manifest-path ../hivemind/Cargo.toml --bin generate-reference
```

## The demo

`website/public/demo/` is hivemind-ui's read-only snapshot build (`npm run build:demo`): the
current app over made-up example data, labelled "Example data" on every screen, with no server,
no sign-in and nothing to write to. The example data is part of that build
(`demo/public/snapshot/` in hivemind-ui), so new data arrives the same way as a new UI.

Don't edit it by hand. To bring the demo up to date with hivemind-ui:

```sh
scripts/rebuild-demo.sh <hivemind-ui repository>          # builds main
scripts/rebuild-demo.sh <hivemind-ui repository> <ref>    # a branch, tag or commit
```

The repository is anything `git clone` takes, a path or a URL. The script builds the demo in a
temporary clone with the base `/hivemind-site/demo/`, writes a page for every link the app
makes (`scripts/demo-routes.mjs`), replaces `website/public/demo/`, records the UI commit in
`website/public/demo/build.json`, and opens a pull request that lists the UI changes since the
last build. Check it locally (`cd website && npm run build && npx astro preview`), then merge:
`deploy.yml` publishes it. `--no-pr` only rebuilds the working tree. It needs git, Node, npm,
rsync, jq and a logged-in `gh`. hivemind-ui is not on GitHub, so no workflow here can build it;
the script runs where a checkout of it is.

**Links.** The app gives each page its own path: `/demo/decisions/<slug>`, `/demo/graph/<slug>`,
`/demo/flow`, `/demo/diagnostics`. Each of those is a real file (a copy of the app's
`index.html`), so a pasted link answers 200 (once Pages has added the trailing slash) and
unfurls. GitHub Pages answers any other missing path with the site's one `404.html`; under
`/demo/` that page loads the app in its place (`website/src/demo-fallback.mjs`), which shows
what the path names or says it has no such decision. Such a link still answers 404 to a
crawler. `/demo-preview/`, an older preview of the UI, now only points to `/demo/`. Old links such as
`/demo/?view=graph&node=<id>` are `/demo/` itself; the app moves them to the new path.

## License

AGPL-3.0, the same as HiveMind. See [LICENSE](LICENSE).
