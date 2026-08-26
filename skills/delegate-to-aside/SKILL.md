---
name: delegate-to-aside
description: Automates the Aside AI browser by exchanging chat turns. Use when web tasks require the user's logged-in accounts (e.g. Slack settings, AWS/GCP, internal dashboards) or real-time GUI visibility. Triggers include "aside", "aside browser", "delegate to aside", "open in aside", "web task with login", or "check aside session". Prefer this over headless browser automation or Computer Use when authenticated sessions in Aside are required.
---

# Aside Browser Automation

Aside is an AI browser with an embedded intelligent agent. This skill automates web tasks by **sending natural language instructions one turn at a time and receiving responses**.

The code lives in the `scripts/` directory of this skill. The upstream repository is `https://github.com/2JIHAN/jihan-workflow`.

## When to Use

Use this skill when web workflows require user logged-in sessions (e.g., Slack app settings, Google Cloud Console, Notion, internal dashboards) or when real-time visual progress monitoring in the Aside GUI is desirable.

## Basic Workflow

```bash
cd <this-skill-folder>/scripts

node 00-check-model.mjs                           # Check configured model & provider status
node 01-ensure-window.mjs                         # Verify app is running and list open tabs
node 02-open-session.mjs "Task Name" [URL]        # Create session & expose to GUI (once per task)
node 03-say.mjs "Do this next"                    # Send general conversation turn
node 04-interact.mjs click "Login Button"         # Vision-based mouse click
node 04-interact.mjs type "Search bar" "query"    # Vision-based keyboard typing
node 04-interact.mjs inspect "Read the status"    # Visual status inspection
```

Step `02` stores the session ID in `~/.aside/u/<account>/.last-session`, so subsequent commands do not require specifying the session ID.

## Execute Outside the Main Session

A single browser turn takes anywhere from a few seconds to tens of seconds. If the main agent session blocks waiting for it, conversation responsiveness degrades. Therefore, **sending instructions to Aside sessions and awaiting responses must be handled without occupying the main session's turn.**

Use one of two patterns:

- **Delegate to Subagent** — Delegate the entire browser workflow (from session opening to verification) to a subagent and return only the final conclusion to the main session. Best suited for multi-step tasks navigating across pages.
- **Run in Background and Read Logs** — Launch the command in the background, redirect output to a log file, and inspect the file when ready. Best suited for one-off checks.

```bash
node 03-say.mjs "Instruction" u1 > /tmp/aside-step.log 2>&1 &
```

Avoid having the main session block synchronously in front of `03-say.mjs` or `04-interact.mjs`. The user should be able to continue dialoguing in the meantime.

## Interaction Principles (Vision-First UI Simulation)

1. **Vision-First UI Interaction** — Do not dump or parse massive HTML sources or full DOM trees. Perceive screenshots and visual layouts, then simulate real user actions: **mouse clicks and keyboard typing**.
2. **Restricted Fallback** — Allow direct DOM queries or fetch only under unavoidable circumstances such as CAPTCHA detection or non-rendered network payload verification.
3. **Modular Execution** — Use dedicated functions in `04-interact.mjs` and `lib.mjs` (`visualClick`, `visualType`, `visualNavigate`, `visualInspect`, `visualScroll`).

## Minimize Tabs and Close Finished Ones

Accumulating tabs blurs context and causes the bridge to attach to the wrong tab. **Keep only the minimum required tabs open, and close completed tabs immediately.**

Include a tab closure step at the end of each work unit:

```bash
node 03-say.mjs "Close the tab we just verified. List remaining open tabs." u1
```

If that page is needed again later, **open a new tab and navigate back**. That minor overhead is far better than stale tabs stacking up and confusing target identification.

## Essential Facts (Verified Empirically)

The following behaviors have been verified empirically through actual execution. Deviating from them will cause failures:

### Strip Date Prefix from Session IDs

Session folder names follow `~/.aside/u/1/sessions/2026-08-20_jcjC8qrCxx7biICU`. However, pass **only `jcjC8qrCxx7biICU`** to `--session`. Passing the full directory name produces `Session not found`.

### Flip ephemeral=0 to Expose in GUI

Sessions created via the CLI default to `ephemeral: true`. In this state, they do not appear in the app's Chats list and vanish upon process termination. Flip the database flag directly:

```sql
UPDATE sessions SET ephemeral=0, title='Task Name' WHERE id='<session_id>';
```

Target file: `~/.aside/u/<account>/state.db`. **Visibility and session persistence share the exact same mechanism.**

### Reusing Sessions is 5x Faster

| Mode | Duration per Turn |
| --- | --- |
| Cold `aside exec` (new session each turn) | 11s |
| Warm `--session` (session reuse) | **2s** |

Reusing sessions preserves conversation memory and the current browser viewport, eliminating the need to repeat prior context.

### Profile Alignment Enables the Bridge

If `aside repl` returns an empty array from `listBrowserTabs()` or `attachActiveBrowserTab()` fails, **the CLI account and the running window's profile directory do not match**. Launch the app with that specific profile:

```bash
/Applications/Aside.app/Contents/MacOS/Aside --profile-directory="Profile 1"
```

Do not guess profile numbers. The `profiles: Profile N` output shown by `aside account list` is an ordinal index, not the folder name.

### Pass Provider Alongside Model Name

When overriding models via CLI flags, pass the provider flag `-p`:

```bash
aside exec -p <provider> -m <model-id> "instruction"
```

Passing the model name alone results in `not available for this account`. Check default models and configured providers per account using `node 00-check-model.mjs`.

### Send Instructions One Step at a Time

Batching multiple complex steps into a single prompt frequently causes connection timeouts or dropped turns. Short, discrete instructions succeed reliably. When visual verification is required, ask the agent to capture a screenshot and report the file path. Screenshots reside in `~/.aside/u/<account>/sessions/<session>/tmp/` and can be inspected directly.

## Account Discovery

Aside profiles are isolated under `~/.aside/u/<n>`. Run `node profiles.mjs` to discover available accounts on your machine and their linked Chrome profile directories:

```bash
node profiles.mjs
```

All scripts automatically resolve the default or active window's account (or respect `ASIDE_ACCOUNT=<account>` environment variable). You can also pass the account explicitly (e.g. `u0`, `u1`).

## File Reference

| File | Responsibility |
| --- | --- |
| `lib.mjs` | Core bridge utilities, session persistence, visual UI simulation helpers, CLI execution |
| `00-check-model.mjs` | Validate configured model and proxy connectivity |
| `00-sync-aside-rules.mjs` | Idempotently inject vision-first principles into all Aside accounts |
| `01-ensure-window.mjs` | Ensure app and profile window are running, list active tabs |
| `02-open-session.mjs` | Create session, flip ephemeral to 0, save session ID |
| `03-say.mjs` | Send a conversational turn to an active session |
| `04-interact.mjs` | Vision-first click, type, inspect, scroll actions |
| `profiles.mjs` | Query mapping between accounts and Chrome profile directories |
| `sessions.mjs` | List saved named sessions and check GUI visibility |
| `token-monitor.mjs` | Real-time session token consumption and cost tracking |

## Troubleshooting

| Symptom | Cause & Remedy |
| --- | --- |
| `Session not found` | Verify date prefix `YYYY-MM-DD_` was stripped from session ID. |
| Empty tab list | Profile mismatch. Launch the window with `--profile-directory="<Folder>"`. |
| `exceeded rate limit` | Temporary limit. Automatically handled by the local proxy router or retry shortly. |
| `not available for this account` | Missing provider flag. Pass `-p <provider>` together with `-m <model>`. |
| Session not visible in Chats | `ephemeral` was not flipped. Check `state.db` and set `ephemeral=0`. |
| Multi-step prompt hangs | Decompose complex tasks into discrete, single-step prompts. |
