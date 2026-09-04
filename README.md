# Jihan HarnessLake

모든 AI 엔지니어링 하네스(Rules, Skills, Hooks)를 한곳에 집약하고 큐레이션하는 하네스 레이크(Harness Lake).
Compatible with `npx skills`, Claude Code, Antigravity, Cursor, and modern AI agent workflows.

## Architecture

This repository is governed by the **3 Pillars** (Rule, Skill, Hook) and **3 Invariants** (Idempotency, Auto-wiring, Zero-dependency). See [Harness Architecture Documentation](docs/index.md) for the complete engineering specification.

- **`rules/`** — AI behavioral and visual standards (`fluent-korean.md`, `task-execution-protocol.md`, `terminal-response-format.md`)
- **`skills/INDEX.md`** — The always-on skill catalog. The only resident pointer to the skill bodies below
- **`skills/`** — On-demand capabilities and agent workflows (`delegate-to-aside/`, `domain-modeling/`, `graph-artifact-builder/`, `grill-me/`, `grill-with-docs/`, `grilling/`, `ponytail/`, `ponytail-audit/`, `ponytail-debt/`, `ponytail-review/`, `systematic-debugging/`, `writing-docs-in-korean/`)
- **`hooks/`** — Git-level physical hard gates (`commit-msg/` for Conventional Commits & AI signature blocking, `pre-commit/` for config protection & secret guarding)

## Available Skills

### 1. [`systematic-debugging`](skills/systematic-debugging/SKILL.md)
Disciplined multi-phase debugging framework (`obra/superpowers`). Enforces root-cause investigation before proposing code edits. Prevents guess-and-check thrashing and symptom patching under pressure.

### 2. [`ponytail`](skills/ponytail/SKILL.md)
Minimalist coding philosophy by Dietrich Gebert. Enforces the "ladder of laziness": YAGNI, standard library first, native platform features before dependencies, and one line over fifty.

### 3. [`ponytail-review`](skills/ponytail-review/SKILL.md)
Specialized diff and PR review skill focused exclusively on over-engineering. Detects reinvented standard libraries, unneeded dependencies, speculative abstractions, and dead flexibility. Output is tagged per finding (`stdlib:`, `native:`, `yagni:`, `shrink:`, `delete:`) and concludes with `net: -N lines possible`.

### 4. [`ponytail-audit`](skills/ponytail-audit/SKILL.md)
Whole-repository audit for complexity and bloat. Scans the entire codebase tree to generate a ranked checklist of speculative abstractions and replacable custom code.

### 5. [`ponytail-debt`](skills/ponytail-debt/SKILL.md)
Harvests deliberate `# ponytail:` shortcut comments across the codebase into a tracked debt ledger so deferred items are never forgotten.

### 6. [`delegate-to-aside`](skills/delegate-to-aside/SKILL.md)
Automates the Aside AI browser by exchanging chat turns. Operates using the user's logged-in accounts directly, with real-time visual progress visible in the GUI.

### 7. [`graph-artifact-builder`](skills/graph-artifact-builder/SKILL.md)
Self-contained interactive HTML artifacts featuring Obsidian-style node-edge network graph visualizations (file backlinks, dependency maps, entity relationships) using `force-graph`.

### 8. [`writing-docs-in-korean`](skills/writing-docs-in-korean/SKILL.md)
Korean-specific documentation standards. Combines scope discipline and tombstone elimination with natural Korean technical style: clean nominal endings for structured definitions, omission of artificial symmetric pairs, and high-density factual narratives.

### 9. [`grill-me`](skills/grill-me/SKILL.md)
User-invoked entry point for a relentless planning interview (`mattpocock/skills`). Delegates to `grilling`. Stateless: it writes no files, and the only output is a sharpened plan.

### 10. [`grill-with-docs`](skills/grill-with-docs/SKILL.md)
Same interview as `grill-me`, but stateful (`mattpocock/skills`). Delegates to `grilling` and `domain-modeling`, so resolved terminology lands in `CONTEXT.md` and load-bearing trade-offs land in `docs/adr/` while the session runs.

### 11. [`grilling`](skills/grilling/SKILL.md)
The interview primitive behind both `grill-*` entry points. Maps the work as a design tree and asks the whole frontier (every question whose prerequisites are already settled) in numbered rounds, each with a recommended answer. Facts are researched by sub-agents; only decisions are put to the user.

### 12. [`domain-modeling`](skills/domain-modeling/SKILL.md)
Builds and sharpens the project glossary during a session. Challenges conflicting terms against `CONTEXT.md`, cross-references claims with the code, and offers an ADR only when the decision is hard to reverse, surprising without context, and the result of a real trade-off.

## Available Hooks

### 1. [`commit-msg`](hooks/commit-msg/README.md)
Deterministic commit message validation. Enforces Conventional Commits, restricts summary lines to 72 characters, and completely blocks AI signatures (`🤖`, `Co-Authored-By`, `Generated with`).

### 2. [`pre-commit`](hooks/pre-commit/README.md)
Deterministic pre-commit guard. Blocks AI agents from weakening linter/formatter configurations (`eslint.config.*`, `.prettierrc*`, `biome.json`, `ruff.toml`) and prevents staging secret files (`.env`, `*.pem`, `*.key`).

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
npx skills add 2JIHAN/jihan-harnesslake

# Install specific skill directly
npx skills add 2JIHAN/jihan-harnesslake --skill delegate-to-aside

# Install globally across all agent frameworks
npx skills add 2JIHAN/jihan-harnesslake --skill delegate-to-aside -g
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
