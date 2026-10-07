# Loomtracer B4SF pitch

Six slides, adapted from Alex's original pitch and refined by Jeff for a one-minute team introduction. Slide 4 (decision metrics, added 2026-10-07) counts the decisions in our own project's record by who made them.

- [PDF preview](loomtracer-pitch.pdf)
- [Contact sheet](loomtracer-pitch.png)
- Editable deck: `website/src/pages/pitch/index.astro`
- Presenter view: `website/src/pages/pitch/presenter.astro`
- Script and source notes: `website/src/data/loomtracer-pitch.ts`

## Run and review

From `website/`, run `npm ci`, `npm run build`, then `npm run preview`.
Open `/hivemind-site/pitch/` on the preview server. Presenter script and manual rehearsal timer are at `/hivemind-site/pitch/presenter/`.

Left/right arrows, Page Up/Down, Home/End and Space navigate on desktop; F requests full screen. Narrow screens stack the slides and allow horizontal scrolling inside the decision-flow diagram. Presenter selection synchronizes with the audience window; the timer never advances slides. The 124-word script targets 65-68 seconds, pending an aloud rehearsal.

The presenter script and source notes are intentionally shareable. Private conversation prompts and follow-up tally templates are excluded. The presenter route is not access-controlled.

## Assets and claims

- The supplied Loomtracer stacked SVG is preserved unchanged. Palette: Ink #332B32, Ivory #FDF8F4, Blue #1D90CD, Orange-red #E25432, Yellow #F3BA1E. Fraunces 600 headlines; Source Sans 3 400/600 body and subheads. Font licenses are shipped in `website/public/pitch/fonts/`.
- The self-hosted capture reuses this repository's unchanged `website/public/pitch/img/capture.png`. See [original capture provenance](README.md): 24 September 2026, `hivemind` main `881412f` (`0.6.0+881412f`). The original pitch says the demonstrated behavior is available in v0.7.0; this update does not claim a new execution.
- The hosted graph screenshot shows fictional pricing-study data from the Loomtracer UI demo. It contains no private workspace data. Self-hosted and hosted are separate implementations; feature parity and automatic synchronization are not claimed.
- The decision flow is illustrative: agents explore options and contribute findings; people approve the direction. It does not claim automatic orchestration or measured outcomes.
- Slide 4's numbers are real counts from our own project's decision record (the hivemind repository's local ledger), read from a copy on 7 Oct 2026 with hivemind 0.7.0, not a benchmark. Its sources note in `website/src/data/loomtracer-pitch.ts` gives the ledger path, the commands and how a person's decision is told from an agent's. Speed, consistency and flexibility are shown as coming: they are not built.
- `www.loomtracer.ai` remains a plain-text placeholder for review, not a verified live destination.

The existing Astro version, GitHub Pages base path and deployment workflow are retained. A branch or draft PR does not deploy the updated deck; the current Pages workflow publishes changes after they reach `main`.
