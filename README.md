# Jihan Harness Catalog

A modular AI engineering harness compatible with `npx skills`, Claude Code, Antigravity, Cursor, and modern AI agent workflows.

## Architecture

This repository is governed by the **3 Pillars** (Rule, Skill, Hook) and **3 Invariants** (Idempotency, Auto-wiring, Zero-dependency). See [Harness Architecture Documentation](docs/index.md) for the complete engineering specification.

- **`rules/`** — AI behavioral, routing, and visual standards (`execution-discipline.md`, `fluent-korean.md`, `skill-routing.md`, `terminal-response-format.md`)
- **`skills/`** — On-demand capabilities and agent workflows (`delegate-to-aside/`, `ponytail/`, `systematic-debugging/`, `writing-docs/`, `writing-docs-in-korean/`)
- **`hooks/`** — Git-level physical hard gates (`commit-msg/` with AI signature block and 72-char limit)

## Available Skills

### 1. [`systematic-debugging`](skills/systematic-debugging/SKILL.md)
Disciplined multi-phase debugging framework (`obra/superpowers`). Enforces root-cause investigation before proposing code edits. Prevents guess-and-check thrashing and symptom patching under pressure.

### 2. [`ponytail`](skills/ponytail/SKILL.md)
Minimalist coding philosophy by Dietrich Gebert. Enforces the "ladder of laziness": YAGNI, standard library first, native platform features before dependencies, and one line over fifty. Includes `lite`, `full`, and `ultra` intensity levels.

### 3. [`delegate-to-aside`](skills/delegate-to-aside/SKILL.md)
Automates the Aside AI browser by exchanging chat turns. Operates using the user's logged-in accounts directly, with real-time visual progress visible in the GUI.

### 4. [`writing-docs`](skills/writing-docs/SKILL.md)
Universal engineering standards for documentation. Enforces strict scope discipline, eliminates introductory fluff and tombstone records, focuses on high-density big flows, and clearly separates human-facing vs model-facing writing.

### 5. [`writing-docs-in-korean`](skills/writing-docs-in-korean/SKILL.md)
Korean-specific documentation standards. Combines scope discipline and tombstone elimination with natural Korean technical style: clean nominal endings for structured definitions, omission of artificial symmetric pairs, and high-density factual narratives.

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
npx skills add 2JIHAN/jihan-harness

# Install specific skill directly
npx skills add 2JIHAN/jihan-harness --skill delegate-to-aside

# Install globally across all agent frameworks
npx skills add 2JIHAN/jihan-harness --skill delegate-to-aside -g
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

## License

MIT
