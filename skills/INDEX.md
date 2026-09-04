# HarnessLake Skills Catalog (INDEX.md)

Always-on dispatch table. Only this file stays resident; every skill body is loaded on demand from the location below. Rows marked **mandatory** must be loaded and followed before the first file is touched, not after.

| Skill | Trigger / When to use | Location |
| :--- | :--- | :--- |
| **ponytail** | *Mandatory.* Writing, adding, refactoring code, or choosing a dependency. Climb the ladder of laziness: YAGNI, reuse, stdlib, native platform, one line over fifty | [SKILL.md](ponytail/SKILL.md) |
| **systematic-debugging** | *Mandatory.* Any bug, stack trace, test failure, build error, or unexpected runtime behaviour. The Iron Law: no fix without root-cause investigation first | [SKILL.md](systematic-debugging/SKILL.md) |
| **writing-docs-in-korean** | *Mandatory.* Writing or editing Korean READMEs, specs, ADRs, guides. Scope discipline, no tombstones, nominal endings for structured definitions | [SKILL.md](writing-docs-in-korean/SKILL.md) |
| **ponytail-review** | Reviewing a diff or PR for over-engineering. Tagged output, `net: -N lines possible` | [SKILL.md](ponytail-review/SKILL.md) |
| **ponytail-audit** | Repo-wide complexity and bloat audit, ranked by what to delete | [SKILL.md](ponytail-audit/SKILL.md) |
| **ponytail-debt** | Harvesting `ponytail:` shortcut comments into a debt ledger | [SKILL.md](ponytail-debt/SKILL.md) |
| **grill-me** | User says "grill me" or wants a plan stress-tested. Stateless: writes no files | [SKILL.md](grill-me/SKILL.md) |
| **grill-with-docs** | Same interview, but terminology lands in `CONTEXT.md` and trade-offs land in `docs/adr/` as it runs | [SKILL.md](grill-with-docs/SKILL.md) |
| **grilling** | The interview engine behind both `grill-*` entry points. Design tree, frontier asked in numbered rounds | [SKILL.md](grilling/SKILL.md) |
| **domain-modeling** | Discussing codebase terminology, or writing a `CONTEXT.md` or ADR. Loaded by `grill-with-docs` | [SKILL.md](domain-modeling/SKILL.md) |
| **delegate-to-aside** | Web work needing the user's logged-in sessions (cloud consoles, dashboards) or visual browser inspection. Vision-first, never DOM dumps | [SKILL.md](delegate-to-aside/SKILL.md) |
| **graph-artifact-builder** | Standalone HTML artifact with a node-edge network graph (backlinks, dependency maps, entity relationships) | [SKILL.md](graph-artifact-builder/SKILL.md) |
