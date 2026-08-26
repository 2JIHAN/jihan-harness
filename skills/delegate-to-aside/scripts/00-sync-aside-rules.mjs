#!/usr/bin/env node
// Step 0 — Synchronize vision-first interaction rules into all Aside profiles idempotently.
//
// Purpose:
// 1. Injects vision-first simulation principles into AGENTS.md and memory/MEMORY.md across all ~/.aside/u/* accounts.
// 2. Imprints visual interaction guidelines at the agent brain level, avoiding repeated prompts per turn.

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const home = homedir();
const uBase = join(home, '.aside', 'u');

const RULE_SECTION_HEADER = '## Browser Interaction & Manipulation Principles (Vision-First UI Simulation)';

const RULE_CONTENT = `${RULE_SECTION_HEADER}

- **Vision-First UI Interaction**: Do not dump or parse massive HTML trees. Always inspect browser screenshots and visual layouts, then simulate user actions via **mouse clicks and keyboard typing**.
- **Visual Information Reading**: Extract visible details (headings, labels, buttons, pricing) from rendered screenshots rather than querying raw DOM sources.
- **Restricted Fallback**: Allow direct DOM queries or fetch calls only under unavoidable circumstances (e.g. CAPTCHA, invisible network payloads).
`;

export function syncAsideRules() {
  if (!existsSync(uBase)) {
    console.error('Directory ~/.aside/u not found.');
    return [];
  }

  const accounts = readdirSync(uBase).filter((d) => !d.startsWith('.'));
  const updated = [];

  for (const acc of accounts) {
    const accDir = join(uBase, acc);
    const agentsMdPath = join(accDir, 'AGENTS.md');
    const memoryDir = join(accDir, 'memory');
    const memoryMdPath = join(memoryDir, 'MEMORY.md');

    // 1. Update AGENTS.md
    let agentsContent = existsSync(agentsMdPath) ? readFileSync(agentsMdPath, 'utf8') : '# Agent Rules\n\n';
    if (agentsContent.includes(RULE_SECTION_HEADER)) {
      const idx = agentsContent.indexOf(RULE_SECTION_HEADER);
      agentsContent = agentsContent.slice(0, idx).trimEnd() + '\n\n' + RULE_CONTENT;
    } else {
      agentsContent = agentsContent.trimEnd() + '\n\n' + RULE_CONTENT;
    }
    writeFileSync(agentsMdPath, agentsContent);

    // 2. Update memory/MEMORY.md
    mkdirSync(memoryDir, { recursive: true });
    let memoryContent = existsSync(memoryMdPath) ? readFileSync(memoryMdPath, 'utf8') : '# Memory Briefing\n\n';
    if (memoryContent.includes(RULE_SECTION_HEADER)) {
      const idx = memoryContent.indexOf(RULE_SECTION_HEADER);
      memoryContent = memoryContent.slice(0, idx).trimEnd() + '\n\n' + RULE_CONTENT;
    } else {
      memoryContent = memoryContent.trimEnd() + '\n\n' + RULE_CONTENT;
    }
    writeFileSync(memoryMdPath, memoryContent);

    updated.push(`u${acc}`);
  }

  return updated;
}

if (process.argv[1].endsWith('00-sync-aside-rules.mjs')) {
  const synced = syncAsideRules();
  console.log(`Aside profile rules synchronized: ${synced.join(', ')} (Total: ${synced.length} accounts)`);
  console.log('Vision-first interaction is now active across all accounts without extra prompt injection.');
}
