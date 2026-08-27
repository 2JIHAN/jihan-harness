---
name: skill-routing
description: Mandatory routing table that directs AI agents to load specific skills based on task context (coding, debugging, documentation, web automation).
---

# Skill Routing Table (skill-routing.md)

Always-on dispatch rules. You MUST load and strictly adhere to the designated skill before taking action in these scenarios:

## 1. Writing, Refactoring, or Adding Code

- **Mandatory Skill**: `.agents/skills/ponytail/SKILL.md`
- **When**: Writing new functions, implementing features, refactoring existing files, or choosing dependencies.
- **Directives**:
  - Load and follow the `ponytail` skill before generating code or modifying files.
  - Climb the ladder of laziness: check YAGNI, reuse existing codebase code, reach for standard library or native platform features before adding dependencies, and prefer one line over fifty.

## 2. Bugs, Test Failures, or Runtime Errors

- **Mandatory Skill**: `.agents/skills/systematic-debugging/SKILL.md`
- **When**: Encountering any bug, stack trace, test failure, build error, or unexpected runtime behavior.
- **Directives**:
  - Load and follow the `systematic-debugging` skill before modifying any file.
  - Obey The Iron Law: NO fixes without root-cause investigation first.
  - Complete Phase 1 (investigate, reproduce, trace call path) before proposing fixes. Never apply symptom patches (e.g. premature null guards).

## 3. Creating, Editing, or Pruning Documentation

- **Mandatory Skills**:
  - English documents: `.agents/skills/writing-docs/SKILL.md`
  - Korean documents: `.agents/skills/writing-docs-in-korean/SKILL.md`
- **When**: Writing or modifying READMEs, specifications, ADRs, user guides, or design documents.
- **Directives**:
  - Enforce strict scope discipline and eliminate introductory fluff.
  - Delete cleanly without tombstones or `<details>` blocks.
  - For structured Korean documents: use clean nominal endings for definitions rather than forcing repetitive `~이다.` endings.

## 4. Web Workflows with Authenticated Sessions

- **Mandatory Skill**: `.agents/skills/delegate-to-aside/SKILL.md`
- **When**: Tasks require logged-in sessions (cloud consoles, Slack settings, dashboards) or visual browser inspection.
- **Directives**:
  - Execute turn exchanges asynchronously or via subagents outside the main session turn.
  - Follow vision-first UI interaction (clicking and typing based on layout, not dumping huge DOM trees).
