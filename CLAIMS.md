# What the site claims, and the evidence

Every claim on the landing page (`website/src/pages/index.astro`) and the use cases page
(`website/src/pages/use-cases.astro`), with what it rests on. Kept next to the copy so that a
change to either is a change to both.

**The rules the copy follows.** Only what is in a release is said to work today. Anything merged
but not released, or under way, says "coming next". Anything decided but not built says "planned".
Both pages show the legend in one line, next to the tags: works today = in v0.7.0 (25 Sep 2026),
coming next = merged or under way, not yet released, planned = decided, not built.
No claim that HiveMind checks before it acts, or that it makes decisions better: the side-by-side
that could show that is planned. No internal names, tracker ids or changelog quotes in the public
copy. The product is HiveMind.

**Where the evidence comes from.** "Works today" claims cite the `v0.7.0` release of
[alexknips/hivemind](https://github.com/alexknips/hivemind/releases/tag/v0.7.0) (published
2026-09-25) and the section of its `CHANGELOG.md` that describes the behaviour, or the release
assets and install script. "Coming next" and "planned" items rest on the product plan as of
2026-09-26; the deck at `/pitch/` (2026-09-24) says the same things where it covers them.

Last checked: 2026-09-28, against `v0.7.0` (still the latest release on that day).

## Works today (v0.7.0)

| Claim | Evidence |
|---|---|
| Claude Code, Codex and Cursor connect over MCP; a CLI does the same | `v0.7.0` ships `hivemind mcp` (stdio) and the HTTP `/mcp` route; the site's [MCP setup](website/src/content/docs/guides/mcp-setup.md) documents all three clients; CHANGELOG v0.7.0 "Over MCP and HTTP too" and the `hivemind-context` plugin for Claude Code and Codex |
| Your agent records a decision with the options that lost, the reasons, and who decided, you or the agent | CHANGELOG v0.7.0, Added, Attribution: `--decided-by` records the human who decided when an agent captures; Breaking: a chosen option now self-accepts (a recorded choice no longer sits at `proposed`); Fixed: "Attribution is honest" (the recorder is no longer printed as the decider). Deck slide "You make the call. The agent writes it down." is a real session of it |
| Ask why in a fresh session: rationale, options chosen and rejected, who decided, whether it still holds | CHANGELOG v0.7.0, Added, Fluent verbs: "`why` answers why" (the decision's brief). `hivemind query why` is the documented alias of `get_decision_neighborhood` in [cli.md](website/src/content/docs/reference/cli.md). Deck slide "A new session asks why." |
| Ask "did it hold up?" and get whether it stands, was replaced, disputed, or rests on a stale premise | CHANGELOG v0.7.0, Fixed: "'Did it hold up?' works" (it returned an error in v0.6.0); `hivemind query verify` is the documented alias of `get_decision_outcome` in cli.md. Deck slide "Did it hold up?" |
| Replace a decision and the old one reads superseded; dispute one and it reads contested; nothing is edited or deleted | Status is derived from edges (the [Decision Graph](website/src/content/docs/concepts/decision-graph.md) page); `supersede` and `disagree` are write commands in cli.md and `DisagreeArgs` in `v0.7.0` `src/cli/args.rs` (positional description, `--reason`). The ledger is append-only (CHANGELOG v0.7.0, "Ledger replay of events captured earlier is unaffected") |
| Every decision says what it rests on: an earlier decision, something observed, an assumption, or a bet with a date to check; a capture that names nothing is refused; a replaced premise makes dependents read stale | CHANGELOG v0.7.0, Breaking: "Capture and supersede require grounding" (the four ways to answer, exit 2 / `isError` when empty); Added, "Answers show what a decision rests on" (superseded or rejected premise makes the decision stale in `verify`, `compact-view`, `situational`, `digest`) |
| "What should I know before I touch this?" from the current diff, each result saying whether it still holds | CHANGELOG v0.7.0, Added: "`query situational`" defaults to the current git diff; cli.md `query situational` ("each result surfaces `get_decision_outcome`'s `held_up`/`reasons`") |
| Several projects: every decision carries its project; a question from one project also looks in the project it is part of and the ones it depends on, one hop, and says where it stopped | CHANGELOG v0.7.0, Added, Projects: "Every decision carries its project", "Every answer names its project", "'What should I know' asks from one project" (the `scope` note); cli.md `query situational --project` |
| Describe a decision instead of quoting an id; an ambiguous description lists candidates instead of guessing | CHANGELOG v0.7.0, Added, Fluent verbs: `disagree`, `supersede`, `query chain`, `query why`, `query verify`, `query compact-view` take a description; an unresolved description writes nothing and lists numbered candidates |
| Look over a week of agent decisions in the terminal: accept, dispute or replace each | cli.md `review` (`--actor <pattern>`, `--since <duration>`, `--unreviewed-only`); the [Human Review](website/src/content/docs/guides/human-review.md) guide |
| Export the decision log as Markdown grouped by project | CHANGELOG v0.7.0, Added: "`hivemind export --format markdown --out <dir>`"; cli.md `export` |
| Import decisions from existing notes; they land as unreviewed | cli.md `import documents` ("land in the ledger immediately as unreviewed"); in releases since v0.5.0 (CHANGELOG v0.5.0) |
| Import decision candidates from a Google Doc or a git-tracked file, experimental; Google Docs only, no Confluence | `v0.7.0` `docs/INGESTION_CONNECTORS.md` (`hivemind import connector --url …`, Google Docs and git connectors; Confluence not supported) |
| Runs on one binary for Linux (x86_64, ARM64) and Apple Silicon Macs, with a SQLite ledger in the project; or a server with Postgres in Docker Compose | Release assets of `v0.7.0`: `hivemind-linux-x86_64.tar.gz`, `hivemind-linux-arm64.tar.gz`, `hivemind-macos-arm64.tar.gz`; `scripts/install.sh` puts the binary in `~/.local/bin`; the [Install](website/src/content/docs/getting-started/install.md) page for the Docker cell |
| AGPL-3.0; no hosted version; no account; nothing phones home | `LICENSE` in alexknips/hivemind; CHANGELOG v0.7.0, Breaking: "the hosted open beta is gone", self-hosting is the only install path; the privacy review of 2026-09-25 found no telemetry in the v0.7.0 code |
| The install and connect commands on the page | Verified against the v0.7.0 release binary in a throwaway home on 2026-09-25 (site PR #8) |
| The three screenshots show real Claude Code sessions, and everything they show is in v0.7.0 | `pitch-screens/README.md`: HiveMind built from commit `881412f` of 2026-09-23, which is an ancestor of the `v0.7.0` tag (`git merge-base --is-ancestor 881412f v0.7.0`); each session a fresh Claude Code process; raw captures in `pitch-screens/captures/` |

### Stated limits (also claims)

| Claim | Evidence |
|---|---|
| "Held up" today means contested or replaced, not an outcome score | Status derivation on the Decision Graph page; no outcome scoring is in a release (the v0.6.0 scorer's deductions are not shown on the site by decision of 2026-09-21) |
| In v0.7.0 the capture plugin does not ask up front what a decision rests on; HiveMind refuses the capture and names the four ways to answer | CHANGELOG v0.7.0, Breaking: "The capture plugins do not ask the question yet" |
| HiveMind is early; no known outside users | Company state of week 39: three GitHub stars, no known outside users |

## Coming next (built and merged, not yet in a release, or under way)

| Claim | Evidence, as of 2026-09-26 |
|---|---|
| A much simpler, decision-first UI: a decision list, newest first, as the front door; one decision's neighbourhood as the graph; arrows newer to older | All five children of the UI redesign are merged in the UI repository (design tokens, browser-mode tests, React Flow graph, decision page, decision list front door); the redesign is not published anywhere yet, and the site's `/demo/` still runs the previous UI. Deck slide "Where it is": "Next: a much simpler, decision-first UI. The redesign is under way." |
| The capture plugin asks up front what a decision rests on | Merged to hivemind master on 2026-09-25 after the `v0.7.0` tag; in the next release |
| A quality profile on seven dimensions, each line naming the facts it was read from; not a grade | The dimensions are `docs/DECISION_SCORING.md` in alexknips/hivemind; the engine that computes the profile merged to master on 2026-09-25 and `score_decision` returning it over the CLI and MCP on 2026-09-26, both after the tag; not in a release |
| Capture that runs all day inside the coding agent; pieces in the release, one-step setup not yet | CHANGELOG v0.7.0, Fixed: "Passive capture no longer drops the session"; Added: "Classification over HTTP and MCP" with a daily cap. The setup still takes the hook from the repository plus a classifier key or the keyless path; no single-step install exists |

## Planned (decided, not built)

| Claim | Evidence, as of 2026-09-26 |
|---|---|
| "Soon to come" (who it is for): teams, meaning several engineers and their agents on one shared record, a view for the team lead across everyone's decisions, later one across the organisation; not built yet | The founder's direction of 2026-09-28, in the review of the live page: "I rather want to explain: soon to come", replacing the "Not for, yet" block. The positioning in `vision/README.md` (company repository) is unchanged: one engineer and their agents first. Nothing for teams is built or scheduled, and the copy says "not built yet" |
| A disagreement travels: re-examine items on dependents, with "N of M re-examined" visible | Product rule set on 2026-09-21; the feature is defined and blocked on grounding; nothing merged |
| Detecting two tracks that contradict each other with no recorded link | Deferred on 2026-09-21 until real parallel-track data exists; what shipped earlier is the measuring harness and gold cases, not the detector |
| Speed, consistency and flexibility across decisions, side by side, never one number | Named by the founder on 2026-09-25; a research brief defines the measures; no product work yet |
| The same agent work with and without HiveMind, side by side | Planned since 2026-09-22; the design (task, prompts, run script, scoring) is done and a dry run of the without-HiveMind arm ran on 2026-09-25; the run waits for the product to be fully in daily use. Deck slide "Where it is": "Then" |
| The demo becomes the app itself, read-only, over example data, with 12 Angry Men kept | Decided by the founder on 2026-09-26 (option d: a purpose-built example database, nothing real); the example-data generator and the read-only build are filed and not started |

## Comparison claims

| Claim | Evidence |
|---|---|
| A hand-kept DECISIONS.md goes stale after a reversal and the agent follows the dead entry | The company's research brief of 2026-09-21 on what engineers do when an agent's decision goes wrong (public posts quoted in `vision/README.md` of the company repository: "the agent follows the dead one confidently") |
| Memory tools remember facts and preferences for the agent's next prompt; they do not keep the options that lost, the evidence, who decided, or whether it held up | The landscape brief of 2026-09-21; positioning locked on 2026-09-22 ("memory, but for decisions") |
| Where it is not different: capture over MCP, supersession, local-first under an open licence exist elsewhere; the combination has not been found elsewhere | `vision/README.md` (company repository), "Where HiveMind is different, and where it is not" |
| HiveMind does not claim to win on recall against memory tools, that anyone outside uses it, or that it makes decisions better | `vision/README.md`, "What we do not claim yet" |

## Use cases section of the landing page (`#showcase`)

One card per feature, in the order agreed on 2026-09-28 from the company's showcase draft
(`marketing/showcase.md` in the company repository, approved by the founder on 2026-09-26 with the
rule "no tracker ids, no changelog quotes, no internal names in the public copy"). The examples
(REST and gRPC, retries, the ORM, caching by record id) are illustrations, not recorded sessions;
the one with numbers says the numbers are made up. "Capture without typing anything" is left out:
the scheduled classification it needs is our own setup, not something a reader can install.
Each "In the demo" line was checked against the 12 Angry Men data in the demo bundle
(`website/public/demo/assets/index-*.js`, node ids `jm-*`) on 2026-09-28.

| Card | Status | Evidence |
|---|---|---|
| Change your mind, and the old decision says so: a replaced one reads superseded with what replaced it, a disputed one reads contested with both sides; nothing edited or deleted | Works today | CHANGELOG v0.7.0, Added, Fluent verbs (`supersede` and `disagree` take a description); Fixed, "Did it hold up?" works; status derived from edges on the [Decision Graph](website/src/content/docs/concepts/decision-graph.md) page. Demo: `jm-d00` "Opening ballot: 11–1 to convict" is `superseded`, `supersededBy` the verdict `jm-d01`; hypothesis `jm-h02` "The boy is guilty beyond reasonable doubt" is `refuted` |
| Who decided, a person or an agent, apart from who wrote it down; an agent deciding within what you handed it reads differently from one deciding alone | Works today | CHANGELOG v0.7.0, Added, Attribution: `--decided-by` (accepted by the human, `verify` shows both) and `--delegated-by` ("reads differently from an agent deciding alone"); Added, `why` answers why (`verify` shows the recorder and the decider as separate lines); Fixed, Attribution is honest. Demo: `jm-h01` held by "Juror 8 (Davis)", `jm-h02` by "Juror 3 (Cobb)", the verdict by "Jury (12 men)"; no agent actors |
| What a decision rests on: an earlier decision, something observed, an assumption, or a bet with a date to check; a replaced premise makes it read stale; asking why shows the premise and whether it holds | Works today | CHANGELOG v0.7.0, Breaking, Capture and supersede require grounding (the four answers, `--bet` with `--check-by`); Added, "Answers show what a decision rests on" (each premise with its state; a superseded or rejected premise makes the decision stale; an overdue bet reads unchecked and does not flip "still holds"). Demo: the verdict `jm-d01` `assumes` `jm-h01` "Reasonable doubt exists"; evidence `jm-e01` to `jm-e07` support or contradict `jm-h01` / `jm-h02` |
| Ask "why did we…" in a fresh session: the reason, the options that lost and why, who decided, whether it still holds | Works today | CHANGELOG v0.7.0, Added, `why` answers why (the brief: rationale, chosen and rejected options, who decided, whether it still holds); deck slide "A new session asks why". Demo: options `jm-o01` "Guilty verdict" (`rejected`, supports `jm-h02`) and `jm-o02` "Not guilty verdict" (`chose`, supports `jm-h01`) |
| A quality profile on seven dimensions, lines naming their facts, "not assessed" where nothing is recorded; not a grade. Example levels: alternatives solid, information partial, calibration not assessed | Coming next | As in "Coming next" above. The example follows the floors in `docs/DECISION_SCORING.md` on hivemind master: Alternatives `solid` when every rejected option carries its own description; Information `partial` when only an assumption counts; Calibration not assessed when no confidence was declared |
| Two projects drifting apart. Works today: a decision resting on a replaced one reads stale, and "what should I know" from one project also looks in the project it depends on. Planned: re-examine items on dependents; catching contradictions with no recorded link | Planned (the "works today" line is marked) | Works today: CHANGELOG v0.7.0, Added, "Answers show what a decision rests on" and Projects, "What should I know" asks from one project (`part_of` and `depends_on`, one hop). Planned: as the first two rows of "Planned" above |
| Speed, consistency and flexibility across decisions; consistency and flexibility side by side, never one number, no ranking | Planned | As in "Planned" above; the measures are defined in the company's research brief of 2026-09-25 on speed, consistency and flexibility. Demo line: the ballot `jm-d00` is replaced by the verdict and seven evidence nodes are on the graph; the demo computes no measures |
| The demo is the 12 Angry Men jury room as a decision graph: the question, the two verdicts, the hypotheses, seven pieces of evidence, the ballot the verdict replaced | Works today (the demo) | Demo: `jm-q01` "Is the defendant guilty of murder?", `jm-o01` / `jm-o02`, `jm-h01` / `jm-h02`, `jm-e01` to `jm-e07`, `jm-d00` superseded by `jm-d01`. Keeping the demo: the founder, 2026-09-25 ("let's keep it") |

## How to keep this file true

- After a hivemind release: re-read the release's CHANGELOG section, move items from "coming next"
  to "works today" only when they are in the tag, and bump "Last checked".
- When the plan changes: change the copy and this file in the same pull request.
- The generated reference (`reference/mcp-tools.md`, the tool counts) is checked by CI against the
  latest release and is not covered here.
