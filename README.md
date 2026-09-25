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
pitch-screens/            raw captures behind the deck's terminal screenshots, and how to re-render them
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

`website/public/demo/` is a production build of hivemind-ui with the Vite base
`/hivemind-site/demo/`. To re-vendor it, build hivemind-ui with that base and replace the
directory's contents with its `dist/`.

## License

AGPL-3.0, the same as HiveMind. See [LICENSE](LICENSE).
