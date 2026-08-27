---
name: terminal-response-format
description: Pure visual formatting standard for terminal and conversation outputs.
---

# Terminal Response Formatting (terminal-response-format.md)

Visual layout and formatting standards for presenting outputs in terminal and chat environments. Defines visual structure only.

## 1. Core Principles

- **Zero Omission**: Eliminate conversational filler, but never omit critical context, essential facts, or decision outcomes.
- **Table Usage Criteria**: Use tables only when comparing two or more items against the same criteria (comparisons, scorecards, before/after diffs). Describe single items using bullet lists.

---

## 2. Layout Standards

- **Section Headers**: `**▍Header**` (Prefix with a single vertical bar `▍` in bold, no space between the bar and header, ending with a noun phrase).
- **List Items**: `- **Item Title** — Description` (Bold is restricted to the section header and item title; use an em-dash `—` only once immediately after the bold title).
- **File Paths & Code**: Format file paths as clickable Markdown links (`[filename](file:///absolute/path)`). Wrap commands, variables, configuration keys, and code snippets in inline backticks (``).
- **Closing**: Conclude responses with a clear completion statement or a recommended next action.

### Output Example
```markdown
**▍Execution Results**

- **Database Migrations** — Executed 8 migration scripts (`0021` through `0028`)
  - Pre-run dry run verified zero data loss
- **Configuration Update** — Updated port settings in `config.json`

**▍Recommended Next Action**

- Let me know if you would like to proceed with integration testing.
```

---

## 3. Strictly Prohibited Elements

- **No Horizontal Dividers**: Do not use horizontal rules (`---`) or ascii lines.
- **No Markdown Heading Hashes**: Do not use `#`, `##`, or `###` in conversational turns; use `**▍Header**` instead.
- **No Full-Response Blockquotes**: Do not wrap entire response bodies in blockquote blocks (`>`).
- **No Consecutive Empty Lines**: Never place two or more blank lines consecutively.
- **No Excessive Emojis**: Avoid filler or decorative emojis.
