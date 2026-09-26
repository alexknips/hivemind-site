---
title: Install
description: Install the hivemind binary in under a minute, or run your own cell with Docker — your data, your infrastructure.
---

Your instance, your data, nothing phones home. For local use with a coding agent, install the
`hivemind` binary. To share one decision graph across a team, run a self-hosted cell with Docker.

---

## Install the binary

Linux (x86_64, ARM64) and Apple Silicon Macs. The script downloads the latest release, checks its
SHA-256 and puts `hivemind` in `~/.local/bin`:

```bash
curl -fsSL https://raw.githubusercontent.com/alexknips/hivemind/master/scripts/install.sh | sh
```

If the next command says `hivemind: not found`, your shell does not have `~/.local/bin` on its
PATH yet. Add it, for this shell and in your shell's startup file (`~/.bashrc` or `~/.zshrc`):

```bash
export PATH="$HOME/.local/bin:$PATH"
```

Then check:

```bash
hivemind --version
```

**Build from source** (other platforms):

```bash
cargo install --git https://github.com/alexknips/hivemind --locked hivemind
```

Run a local MCP server over stdio — no HTTP, no auth required:

```bash
hivemind --hivemind-dir ./hivemind/ mcp
```

Add to Claude Code via `.mcp.json`:

```json
{
  "mcpServers": {
    "hivemind": {
      "command": "hivemind",
      "args": ["mcp"],
      "env": { "HIVEMIND_DIR": "./hivemind/" }
    }
  }
}
```

Run the HTTP API server directly:

```bash
HIVEMIND_DIR=./hivemind hivemind serve --port 8080
```

Set `HIVEMIND_API_KEY` to require bearer-token authentication.

---

## Run a cell with Docker

A self-hosted cell takes about five minutes on any machine with Docker.

**Prerequisites:** Docker 24+ with Compose v2 (`docker compose version`). Port 8080 must be available.

```bash
# 1. Fetch the compose cell
git clone https://github.com/alexknips/hivemind && cd hivemind

# 2. Create your config and set strong secrets
cp .env.example .env
# Linux:
sed -i "s/change-me-before-production/$(openssl rand -hex 32)/g" .env
# macOS: sed -i '' "s/change-me-before-production/$(openssl rand -hex 32)/g" .env

# 3. Start (builds the image on first run, ~5 minutes)
docker compose up --build -d
```

Confirm the cell is healthy:

```bash
docker compose ps
```

```
NAME        STATUS                   PORTS
hivemind    Up (healthy)             127.0.0.1:8080->8080/tcp
postgres    Up (healthy)
```

The port is published on `127.0.0.1`, so only this machine can reach the cell; to expose it deliberately, set `HIVEMIND_PUBLISH_ADDR` in `.env` to the interface address to publish on, or put a TLS reverse proxy in front (see [Exposing the cell deliberately](https://github.com/alexknips/hivemind/blob/master/docs/SELF_HOSTING.md#exposing-the-cell-deliberately)).

---

## Connect your agent

Provision a tenant to get your bearer token (shown once — save it):

```bash
ADMIN_KEY=$(grep HIVEMIND_ADMIN_KEY .env | cut -d= -f2)
curl -s -X POST http://localhost:8080/v1/tenants \
  -H "Authorization: Bearer $ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"tenant_id": "me", "display_name": "My Team"}'
```

The response includes `token_secret` — a value starting with `hm_tk_...`. Copy it now.

Add HiveMind to Claude Code by pasting this into `.mcp.json` in your project root:

```json
{
  "mcpServers": {
    "hivemind": {
      "url": "http://localhost:8080/mcp",
      "headers": {
        "Authorization": "Bearer hm_tk_..."
      }
    }
  }
}
```

Reload Claude Code. The HiveMind tools appear in your agent's tool list. Your instance is running.

:::note
**Your data stays on your machine.** The self-hosted cell never phones home.
Each deployment is separate, with its own data.
:::

---

## Going deeper

The [full self-hosting runbook](https://github.com/alexknips/hivemind/blob/master/docs/SELF_HOSTING.md)
covers production configuration, TLS setup, E2E verification, upgrading, and troubleshooting.

- [MCP Setup](../../guides/mcp-setup/) — agent configuration for all MCP clients
- [Quickstart](../quickstart/) — capture your first decision in one command
