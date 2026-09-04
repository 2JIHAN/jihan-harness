---
name: graph-artifact-builder
description: Use ONLY when creating standalone HTML artifacts/dashboards that require interactive node-edge or network graph visualizations (e.g., Obsidian-style file backlinks, entity relationships, dependency graphs). Defaults to d3-force / D3.js (or high-performance canvas wrappers like force-graph). Do NOT use for standard markdown artifacts, simple charts (use Chart.js), or static flowcharts (use Mermaid).
---

# Graph Artifact Builder (d3-force & Network Visualizers)

Standards and boilerplate for building standalone, interactive HTML artifacts featuring node-edge network visualizations (file backlinks, dependency maps, entity relationship graphs) using `d3-force` (D3.js) and related graph engines.

---

## 🚦 Softgate Decision Protocol

Evaluate the following 2 gates before proceeding.

### Gate 1. Is this an interactive HTML artifact scenario?
- [ ] Can this be adequately represented with standard markdown tables or formatted text? → **[STOP]** Produce a standard Markdown artifact (`*.md`).
- [ ] Does it require direct browser manipulation (zoom/pan, dragging, node-focus highlights, interactive filtering)? → **Proceed to Gate 2**

### Gate 2. Is node-edge (network/relational) visualization required?
- [ ] Is it a linear or statistical chart (bar, line, pie, timeseries)? → **[Alternative]** Use `Chart.js`.
- [ ] Is it a static flowchart, sequence diagram, or small tree (< 5 nodes)? → **[Alternative]** Use Markdown `mermaid` blocks.
- [ ] Is it an interconnected network of nodes and edges (file links/backlinks, code dependencies, knowledge graphs)? → **[PASS] Apply graph visualization standard**

---

## 📚 Library Ecosystem & Selection Hierarchy

Based on comprehensive package registry and catalog rankings:

| Library | Role & Standing | Best For |
| :--- | :--- | :--- |
| **`d3-force` (D3.js)** | **Default Engine / Standard**<br>(108k+ Stars, De-facto industry standard) | Custom bespoke visualizations, full control over SVG/Canvas physics & rendering. |
| **`force-graph`** | **High-Performance Wrapper**<br>(Built on `d3-force` + Canvas/WebGL) | Instant Obsidian-like graph views, large node sets (1,000+ nodes) with minimal boilerplate. |
| **`vis-network`** | **Turnkey Interactive Network** | Out-of-the-box UI controls, node grouping, drag-and-drop editing. |
| **`Cytoscape.js`** | **Graph Theory & Analysis** | Biological/social network analysis, shortest path, centrality algorithms. |

---

## 🛠️ Implementation Protocol

### 1. Standard Data Schema
Inject data into the HTML payload matching the following JSON structure:
```javascript
const graphData = {
  nodes: [
    { id: "README.md", name: "README", group: "doc", val: 15 },
    { id: "core/engine.ts", name: "Engine", group: "core", val: 10 },
    { id: "utils/parser.ts", name: "Parser", group: "util", val: 6 }
  ],
  links: [
    { source: "README.md", target: "core/engine.ts", label: "references" },
    { source: "core/engine.ts", target: "utils/parser.ts", label: "imports" }
  ]
};
```
- `id`: Unique identifier (filepath, symbol name, or entity ID)
- `name`: Display label rendered on node or tooltip
- `group`: Categorical tag for color-coding
- `val`: Relative node weight (controls visual node size based on degree or lines of code)
- `source` / `target`: Node `id` references

### 2. Essential Interactivity Patterns
- **Neighbor Highlighting**: Clicking a node highlights its direct neighbors and incident links while dimming unrelated nodes (`opacity: 0.15`).
- **Responsive Viewport**: Bind `window.resize` to SVG/Canvas dimensions and update simulation center.
- **Dark Theme Default**: Use dark background (`#121212`) and high-contrast nodes/links.
- **Self-contained Execution**: Ensure the artifact runs locally in browser (`file:///...`) with zero external backend dependencies.

---

## 📋 Boilerplate Reference (D3.js / d3-force)

Use the ready-to-use template located at `resources/template.html`. Inject data into the placeholder and customize styles as needed.

```html
<script src="https://d3js.org/d3.v7.min.js"></script>
<svg id="graph-svg" width="100%" height="100%"></svg>
<script>
  const simulation = d3.forceSimulation(gData.nodes)
    .force("link", d3.forceLink(gData.links).id(d => d.id).distance(60))
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter(width / 2, height / 2));
</script>
```

---

## ⚠️ Anti-patterns
- Do not create heavy HTML graph artifacts when plain Markdown tables or Mermaid diagrams are sufficient.
- Do not add external server/API dependencies; keep artifacts 100% client-side.
- Ensure all `source` and `target` link endpoints reference valid, existing `id`s in `nodes`.
