---
name: writing-docs
description: Universal standards for creating, refactoring, or reviewing documentation (READMEs, specs, ADRs, design docs, guides, notes). Enforces scope discipline, elimination of fluff and tombstones, focus on core flows, and clear separation between human-facing vs model-facing writing. Activate when writing, updating, or reviewing markdown documents, documentation, specs, or guidelines.
---

# Documentation Craft & Scope Discipline (writing-docs)

Documentation exists to communicate operational truth, decisions, and system boundaries with maximum density and zero noise. Apply these rules whenever creating, modifying, or pruning documentation.

---

## 1. Scope Discipline & Zero Fluff

- **Serve the section's exact job**: Write only what the file—and the specific section—is strictly about. Any detail that is true, interesting, but outside the immediate flow is fluff: cut it out.
- **Delete wrong claims outright without excuses**: Removing an outdated or incorrect claim is the entire fix. Never replace it with an explanation of why it was wrong or how it changed. Explaining past errors merely replaces one piece of noise with another.
- **One home per fact**: Never restate facts or create redundant cross-references "for convenience." Every piece of information belongs in exactly one canonical location.
- **No introductory filler**: Never begin documents or sections with meta-announcements (e.g., *"In this document, we will explore..."*, *"This file serves as a guide for..."*). State the content directly.

---

## 2. Clean Deletions (No Tombstone Records)

- **Delete cleanly without traces**: When shrinking, refactoring, or deprecating documentation or backlog items, delete them completely.
- **No tombstone blocks**: Do not preserve deleted text inside `<details>` blocks, write essays on why something was canceled, or leave "Merged/Deprecated on YYYY-MM-DD" memorial notes. Version control (`git log`) already preserves historical diffs and commit reasons.
- **Prune dangling references**: When removing a section or concept, immediately clean up any links or references pointing to it elsewhere.

---

## 3. High-Density Narrative (Big Flows & Core Outcomes)

- **Record big flows, omit the struggle**: Document what was achieved and the final architecture. Omit trivial intermediate debugging steps, temporary workarounds, and discarded dead-ends unless a specific failure mode must never be repeated.
- **Tables for multi-dimensional data**: Use tables when comparing two or more entities across consistent dimensions (comparisons, checklists, scorecards, state transitions). Use concise bullet lists for single items.
- **Avoid artificial symmetry**: Do not artificially split concepts into mirrored dual columns (e.g., "What stays" vs "What goes") just for aesthetic symmetry. Group information into natural, cohesive blocks.

---

## 4. Human-Facing vs Model-Facing Documents

Always determine who will read the document before drafting:

| Aspect | Human-Facing Docs (Specs, ADRs, Guides, READMEs) | Model-Facing Docs (Skills, Instructions, Prompts) |
| :--- | :--- | :--- |
| **Primary Goal** | Human comprehension, scannability, clarity | Deterministic instruction-following, rapid keyword lookup |
| **Style** | Plain language, clear bullet hierarchy, accessible explanations | Strict imperative directives (`do`, `do not`), zero editorializing |
| **Structure** | Visual tables, progressive summaries | One rule per line, condition-first (`When X, do Y`) |
| **Refactoring** | Smooth out clumsy phrasing and improve flow | **Never merge bullets into prose**; preserves rule addresses |

### Specific Rules for Model-Facing Docs (`SKILL.md`, Prompts)
1. **Never editorialize**: Do not merge bulleted rule items into paragraphs. Bullets provide discrete addressable tokens for the LLM.
2. **One rule per line**: Never combine multiple distinct constraints into a single bullet point.
3. **Condition-first syntax**: Frame rules as `When [condition], do [action]` rather than trailing conditions.
4. **Reserve rationale for ambiguity only**: Explain "why" only when the rule requires adaptive judgment in novel edge cases. Adding explanations to self-evident rules generates noise.
