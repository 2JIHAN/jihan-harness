#!/usr/bin/env node
// 2단계 — 새 채팅 세션을 만들고, GUI 에 보이도록 flip 한 뒤 이름을 붙여 저장합니다.
//
// ephemeral=1 세션은 앱 Chats 에 뜨지 않고 프로세스가 끝나면 사라집니다.
// state.db 에서 0 으로 바꿔야 GUI 에 보이고 --session 으로 이어 쓸 수 있습니다.
//
// 사용법: node 02-open-session.mjs <이름> [계정] [열어둘URL]

import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { ask, ensureBridge, saveSession, sessionsDir, userDir, tailOf } from './lib.mjs';

let account = 'u1';
let name = '';
let url = '';

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('사용법: node 02-open-session.mjs <이름> [계정] [URL]');
  console.error('또는:   node 02-open-session.mjs [계정] <이름> [URL]');
  process.exit(1);
}

if (/^u\d+$/i.test(args[0])) {
  account = args[0].toLowerCase();
  name = args[1] || `작업_${new Date().toISOString().slice(11, 19).replace(/:/g, '')}`;
  url = args[2] || '';
} else {
  name = args[0];
  if (args[1] && /^u\d+$/i.test(args[1])) {
    account = args[1].toLowerCase();
    url = args[2] || '';
  } else {
    url = args[1] || '';
  }
}

if (!ensureBridge(account)) process.exit(1);

const db = join(userDir(account), 'state.db');
const dir = sessionsDir(account);
mkdirSync(dir, { recursive: true });
const before = new Set(readdirSync(dir));
const sql = (q) => execFileSync('sqlite3', [db, q], { encoding: 'utf8' }).trim();

// openTab 으로 열어야 대화에 묶여서 사이드 패널에 보입니다.
const prompt = url
  ? `openTab 으로 ${url} 을 열고 페이지 제목만 한 줄로 답해 주십시오. 다음 지시가 이어서 옵니다.`
  : '준비되었다고 한 줄로만 답해 주십시오. 아무것도 클릭하지 마십시오. 다음 지시가 이어서 옵니다.';

const out = ask(account, prompt);

const created = readdirSync(dir).filter((d) => !before.has(d));
if (created.length === 0) {
  console.error('새 세션을 찾지 못했습니다.');
  process.exit(1);
}

// 폴더 이름은 <날짜>_<ID> 인데 --session 에는 ID 만 넘겨야 합니다.
const id = created[0].replace(/^\d{4}-\d{2}-\d{2}_/, '');

sql(`UPDATE sessions SET ephemeral=0, title='${name.replace(/'/g, "''")}' WHERE id='${id}';`);
if (sql(`SELECT ephemeral FROM sessions WHERE id='${id}';`) !== '0') {
  console.error('flip 실패 — 앱 Chats 에 뜨지 않습니다.');
  process.exit(1);
}

saveSession(account, name, id);
console.log(tailOf(out, 5));
console.log(`\n세션 "${name}" 준비됨 (id=${id}, ephemeral=0)`);
console.log('앱 Chats 목록에서 실시간으로 보실 수 있습니다.');
console.log(`이어서: node 03-say.mjs "지시" ${account} ${name}`);
