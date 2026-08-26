#!/usr/bin/env node
// 이름 붙인 세션 목록을 봅니다. GUI 표시 여부도 함께 확인합니다.
// 사용법: node sessions.mjs [계정]

import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { loadSessions, userDir } from './lib.mjs';

const account = process.argv[2] || 'u1';
const db = join(userDir(account), 'state.db');
const all = loadSessions(account);
const names = Object.keys(all);

if (names.length === 0) {
  console.log('저장된 세션이 없습니다.');
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
  const shown = eph === '0' ? 'GUI 표시됨' : eph === '' ? '세션 없음' : 'GUI 안 보임';
  console.log(`${n.padEnd(24)} ${id}  ${shown}  (${updatedAt.slice(0, 16).replace('T', ' ')})`);
}
