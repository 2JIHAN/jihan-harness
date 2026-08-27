# Jihan Workflow Catalog

A modular, production-ready AI engineering harness compatible with `npx skills`, Claude Code, Antigravity, Cursor, and modern AI agent workflows.

## Architecture

This repository is governed by the **3 Pillars** (Rule, Skill, Hook) and **3 Invariants** (Idempotency, Auto-wiring, Zero-dependency). See [Harness Architecture Documentation](docs/index.md) for the complete engineering specification.

- **`rules/`** — AI behavioral and visual formatting standards (`fluent-korean.md`, `terminal-response-format.md`)
- **`skills/`** — On-demand capabilities and agent workflows (`delegate-to-aside/`, `writing-docs/`)
- **`hooks/`** — Git-level physical hard gates (`commit-msg/` with AI signature block and 72-char limit)

## Available Skills

### 1. [`delegate-to-aside`](skills/delegate-to-aside/SKILL.md)
Automates the Aside AI browser by exchanging chat turns. Operates using the user's logged-in accounts directly, with real-time visual progress visible in the GUI.

### 2. [`writing-docs`](skills/writing-docs/SKILL.md)
Universal engineering standards for documentation. Enforces strict scope discipline, eliminates introductory fluff and tombstone records, focuses on high-density big flows, and clearly bifurcates human-facing vs model-facing writing.

---

## Installation

### 1. Unified Installer (`install.sh`)

Deploy all tiers or selected components into any target project:

```bash
# Install everything (Hooks + Rules + Skills) to current directory
./install.sh

# Install to a specific target project
./install.sh /path/to/my-project

# Selective installation
./install.sh --hooks              # Install Git physical hooks only (.git/hooks/)
./install.sh --rules              # Install AI rules (.agents/rules/ & hidden agent configs)
./install.sh --skills             # Install Agent skills (.agents/skills/)
./install.sh --link               # Symlink files instead of copying
```

### 2. Agent Skills CLI (`npx skills`)

Install individual agent skills on-demand using the open `skills` standard:

```bash
# Interactive selection
npx skills add 2JIHAN/jihan-workflow

# Install specific skill directly
npx skills add 2JIHAN/jihan-workflow --skill delegate-to-aside

# Install globally across all agent frameworks
npx skills add 2JIHAN/jihan-workflow --skill delegate-to-aside -g
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
