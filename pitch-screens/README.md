# The deck's screenshots

The three terminal screenshots on `/pitch/` (`website/public/pitch/img/`) are real Claude Code
sessions, not mock-ups. This folder keeps the raw terminal captures and the two scripts that turn
them into PNGs, so anyone can check that a screenshot shows what the session printed.

## How they were made (2026-09-24)

- **Project:** `~/code/pantry`, a small Flask demo app that stores its items in a JSON file.
  Its `CLAUDE.md` gives the owner's HiveMind identity as `human:you@example.com`, so no real
  address appears in the frames.
- **Agent:** Claude Code 2.1.281, Opus 5.5, in a 64-column tmux pane. The only MCP server was
  HiveMind, and Bash was turned off so the agent reached HiveMind only through MCP.
- **HiveMind:** built from `main` at `881412f` (`0.6.0+881412f`), with a fresh local ledger.
- **Sessions:** each one is a new Claude Code process, so there's no chat history between them.
  Only the ledger carries over.
  1. `capture.ansi`: the owner states the decision (SQLite, not Postgres or the JSON file)
     and asks the agent to record it. After this session the agent moved the code to SQLite
     and that was committed. Neither step appears in a screenshot.
  2. `why.ansi`: "Why is pantry on SQLite and not Postgres? What did we rule out?"
  3. `replace.ansi`: the owner changes the plan (Postgres, so the app can run from a phone
     too) and asks the agent to record that it replaces the SQLite decision. This one isn't
     on a slide.
  4. `held-up.ansi`: "Did the SQLite storage decision hold up?"

`captures/v0.6.0/` holds the same four sessions against the **v0.6.0 release**, which is what
the install script gives you today. They back the deck's "to be fair" note. In v0.6.0:
- the capture stays `proposed`, and the agent can't record the owner as the decider;
- a supersede from Claude is attributed to a Codex agent;
- `get_decision_outcome` fails with `graph projection error: unsupported query`.

## Re-render

```sh
python3 ansi2html.py captures/held-up.ansi held-up.html
node shoot.mjs held-up          # needs `npm i playwright`; writes held-up.png at 2x
```

`ansi2html.py` removes only terminal chrome: the Claude Code footer, the input box below the
turn's "done" line, and extra blank lines. Everything the session printed stays in the frame.
To capture a new session, run `tmux capture-pane -e -p -S - -t <pane> > name.ansi` once the
turn is done.
