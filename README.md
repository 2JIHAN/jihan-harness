# Agent Skills Catalog

A collection of production-ready AI agent skills compatible with `npx skills`, Claude Code, Antigravity, Cursor, and other modern AI agent frameworks.

## Available Skills

### [`delegate-to-aside`](skills/delegate-to-aside/SKILL.md)
Automates the Aside AI browser by exchanging chat turns. Operates using the user's logged-in accounts directly, with real-time visual progress visible in the GUI.

- **Requirements**: Node.js 18+, `aside` CLI
- **Path**: `skills/delegate-to-aside/`

---

## Installation

Install into the current project directory or globally across your machine using `-g`.

```bash
# Interactive selection (choose from available skills)
npx skills add 2JIHAN/delegate-to-aside

# Install specific skill directly
npx skills add 2JIHAN/delegate-to-aside --skill delegate-to-aside

# Install globally (shared across Antigravity, Claude Code, Cursor, etc.)
npx skills add 2JIHAN/delegate-to-aside --skill delegate-to-aside -g
```

## Quick Start (`delegate-to-aside`)

```bash
cd skills/delegate-to-aside/scripts

node 00-check-model.mjs u1                      # Check configured model & proxy status
node 01-ensure-window.mjs u1                    # Verify running app & list open tabs
node 02-open-session.mjs "Task Name" u1 "URL"   # Create session & expose to GUI (once per task)
node 03-say.mjs "Instruction" u1                # Send conversation turn
node 04-interact.mjs click "Login Button" u1    # Vision-based UI interaction
```

Recommended initial setup: inject vision-first interaction principles into all Aside accounts' `AGENTS.md` so guidelines do not need to be repeated every turn:

```bash
node 00-sync-aside-rules.mjs
```

## Documentation

- [skills/delegate-to-aside/SKILL.md](skills/delegate-to-aside/SKILL.md) — Operational guidelines for agents. Contains empirically verified patterns including session ID formatting, ephemeral flag toggling, and profile alignment.

## License

MIT
