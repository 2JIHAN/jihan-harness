#!/usr/bin/env node
// 1단계 — 프로필 현황을 먼저 읽고, 그 계정의 창이 데몬에 붙게 만듭니다.
//
// 앱이 떠 있는 것만으로는 부족합니다. 프로필이 다르면 탭이 하나도 보이지 않습니다.
// 사용법: node 01-ensure-window.mjs [계정]

import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { ask, ensureBridge, tailOf } from './lib.mjs';

const account = process.argv[2] || 'u1';

// 넘겨짚지 않기 위해 현재 상태를 먼저 출력합니다.
console.log(execFileSync(process.execPath, [join(import.meta.dirname, 'profiles.mjs')], { encoding: 'utf8' }));

if (!ensureBridge(account)) process.exit(1);
console.log(`${account} 브리지 정상입니다.\n`);

console.log('열려 있는 탭');
console.log(tailOf(ask(account, '열려 있는 탭의 URL만 줄바꿈으로 나열해 주십시오. 아무것도 클릭하지 마십시오.'), 20));
