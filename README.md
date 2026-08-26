# delegate-to-aside

An agent skill that automates web tasks by **sending natural language instructions one turn at a time and receiving responses** from the Aside AI browser's embedded agent. Operates using the user's logged-in accounts directly, with real-time visual progress visible in the GUI.

Zero external dependencies. Requires only Node.js 18+ and the `aside` CLI.

## Installation

Install into the current project directory or globally across your machine using `-g`.

```bash
# Install to a specific project
npx skills add 2JIHAN/delegate-to-aside

# Install globally (shared across Antigravity, Claude Code, etc.)
npx skills add 2JIHAN/delegate-to-aside -g
```

## Quick Start

```bash
cd skills/scripts

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

- [SKILL.md](skills/SKILL.md) — Operational guidelines for agents. Contains empirically verified patterns including session ID formatting, ephemeral flag toggling, and profile alignment.

## License

MIT
