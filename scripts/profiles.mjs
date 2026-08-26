#!/usr/bin/env node
// 프로필 현황을 읽습니다. 어떤 작업이든 이것을 먼저 확인하고 이어갑니다.
//
// 계정 번호와 프로필 폴더 이름은 일치하지 않습니다. u1 은 "Profile 1" 이 아닙니다.
// 넘겨짚지 말고 여기서 나온 값을 쓰십시오.
//
// 사용법: node profiles.mjs [계정]     계정을 주면 그 계정의 브리지까지 확인합니다.

import { browserReachable, getProfiles, isAppRunning, profileFor } from './lib.mjs';

const appRunning = isAppRunning();
const rows = getProfiles();

console.log(appRunning ? 'Aside 실행 중' : 'Aside 꺼져 있음 (창 칸은 다음 실행 시 복원될 목록입니다)');
console.log('계정  프로필 폴더    표시 이름      이메일                          창     최근활동');
console.log('----  ------------  ------------  ------------------------------  -----  --------');
for (const r of rows) {
  console.log(
    `${r.account.padEnd(6)}${r.folder.padEnd(14)}${r.label.padEnd(14)}${r.email.padEnd(32)}${(r.open ? '열림' : r.restore ? '복원대상' : '-').padEnd(9)}${r.lastActive}`
  );
}

const account = process.argv[2];
if (account) {
  const folder = profileFor(account);
  console.log(`\n${account} → 프로필 "${folder}"`);
  console.log(`브라우저 접근: ${browserReachable(account) ? '정상' : '닿지 않음 (01-ensure-window.mjs 로 띄우십시오)'}`);
}
