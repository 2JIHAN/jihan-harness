---
name: execution-discipline
description: Universal operational constraints for AI agents. Enforces no busy-polling, zero-blind verification, single-line progress cadence, and non-blocking execution.
---

# Execution Discipline (execution-discipline.md)

Universal operational discipline for executing commands, verifying tasks, and reporting progress.

## 1. No Busy-Polling (Context Preservation)

- **Never poll status in tight loops**: Do not repeatedly query background task status (`manage_task`, `sleep` loops, rapid retry loops). Yield execution and wait for the system's reactive completion notification.
- **Single-shot inspection over polling**: When checking server readiness or deployment status, make a single targeted inspection after an appropriate delay rather than flooding context with repeated retry checks.

## 2. Zero-Blind Verification (Evidence-First)

- **Exit code 0 is not proof of success**: Never report a task as completed or passed solely because a script or process exited with code 0.
- **Inspect actual data and visual artifacts**:
  - *UI & Frontend*: Inspect screenshots directly to verify element visibility, layout integrity, and absence of 404 errors.
  - *Backend & Database*: Query actual database records or response payloads to confirm state transitions before reporting success.
- **Never report what cannot be verified**: State unverified items explicitly rather than assuming success.

## 3. Single-Line Progress Cadence

- **Emit one line per step**: For multi-step workflows, report progress with a single concise line: `[m/n] Completed <step-name> (<duration>)`.
- **Do not re-print prior steps**: Never reprint completed history or full command output logs in subsequent conversational turns.

## 4. Execution Sizing & Direct Processing

- **Direct execution for lightweight tasks**: Execute 1–2 line modifications, configuration updates, and file reads directly without multi-step planning overhead.
- **Non-blocking heavy tasks**: Execute tasks taking longer than 30 seconds (full builds, end-to-end browser walkthroughs) in the background so the conversational turn remains responsive.
