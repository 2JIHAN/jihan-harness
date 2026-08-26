#!/usr/bin/env node
// 3단계 — 열어 둔 세션에 지시를 한 턴 보냅니다.
// 세션에 이어 붙으므로 앞 맥락을 다시 설명할 필요가 없습니다. (콜드 11초 → 웜 2초)
// 사용법: node 03-say.mjs "지시" [계정] [세션이름]

import { ask, resolveSession, tailOf } from './lib.mjs';

const message = process.argv[2];
const account = process.argv[3] || 'u1';
const name = process.argv[4];

if (!message) {
  console.error('사용법: node 03-say.mjs "지시" [계정] [세션이름]');
  process.exit(1);
}

console.log(tailOf(ask(account, message, resolveSession(account, name)), 12));
