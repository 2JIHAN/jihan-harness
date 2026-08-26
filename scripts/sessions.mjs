#!/usr/bin/env node
// View list of saved named sessions and check their GUI visibility status.
// Usage: node sessions.mjs [account]

import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { loadSessions, userDir } from './lib.mjs';

const account = process.argv[2] || 'u1';
const db = join(userDir(account), 'state.db');
const all = loadSessions(account);
const names = Object.keys(all);

if (names.length === 0) {
  console.log('No saved sessions found.');
  process.exit(0);
}

for (const n of names) {
  const { id, updatedAt } = all[n];
  let eph = '?';
  try {
    eph = execFileSync('sqlite3', [db, `SELECT ephemeral FROM sessions WHERE id='${id}';`], {
      encoding: 'utf8',
    }).trim();
  } catch {}
  const shown = eph === '0' ? 'GUI Visible' : eph === '' ? 'Session Missing' : 'GUI Hidden';
  console.log(`${n.padEnd(24)} ${id}  ${shown.padEnd(16)} (${updatedAt.slice(0, 16).replace('T', ' ')})`);
}
