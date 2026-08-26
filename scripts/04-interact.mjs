#!/usr/bin/env node
// 4단계 — 시각 기반(Vision-First) 브라우저 인터랙션 모듈 CLI
//
// 원칙:
// 1. 대규모 HTML 덤프나 전체 DOM 조회를 지양하고, 스크린샷 기반 시각 인지와 마우스/키보드 입력을 모사합니다.
// 2. 불가피한 상황(CAPTCHA, 비가시적 데이터 확인 등)에서만 fallback 모드를 사용합니다.
//
// 사용법:
//   node 04-interact.mjs goto <URL> [계정] [세션]
//   node 04-interact.mjs click <대상설명> [계정] [세션]
//   node 04-interact.mjs type <입력칸설명> <입력값> [계정] [세션]
//   node 04-interact.mjs inspect <질문> [계정] [세션]
//   node 04-interact.mjs scroll [down|up] [계정] [세션]
//   node 04-interact.mjs fallback <지시> [계정] [세션]

import {
  ask,
  resolveSession,
  tailOf,
  visualClick,
  visualInspect,
  visualNavigate,
  visualScroll,
  visualType,
} from './lib.mjs';
import { withTokenTracking } from './token-monitor.mjs';

const [action, ...rest] = process.argv.slice(2);

if (!action) {
  console.log(`사용법:
  node 04-interact.mjs goto <URL> [계정] [세션]
  node 04-interact.mjs click <클릭대상> [계정] [세션]
  node 04-interact.mjs type <입력칸> <입력값> [계정] [세션]
  node 04-interact.mjs inspect <질문> [계정] [세션]
  node 04-interact.mjs scroll [down|up] [계정] [세션]
  node 04-interact.mjs fallback <지시> [계정] [세션]`);
  process.exit(0);
}

// 인자 파싱 도우미 (계정 u0, u1, u2 등 자동 감지)
function parseTargetAndAccount(args) {
  let account = 'u1';
  let session = undefined;
  const filtered = [];

  for (const a of args) {
    if (/^u\d+$/i.test(a) && !account_set) {
      account = a.toLowerCase();
      var account_set = true;
    } else {
      filtered.push(a);
    }
  }

  // 마지막 인자가 저장된 세션 이름일 수 있음
  return { account, filtered };
}

async function run() {
  const act = action.toLowerCase();

  switch (act) {
    case 'goto':
    case 'navigate': {
      const url = rest[0];
      const account = rest[1] && /^u\d+$/i.test(rest[1]) ? rest[1] : 'u1';
      const sessionName = rest[2] || (rest[1] && !/^u\d+$/i.test(rest[1]) ? rest[1] : undefined);
      const session = resolveSession(account, sessionName);
      if (!url) {
        console.error('URL을 입력하십시오. 예: node 04-interact.mjs goto https://example.com');
        process.exit(1);
      }
      const out = withTokenTracking(account, session, () => visualNavigate(account, url, session));
      console.log(tailOf(out, 10));
      break;
    }

    case 'click': {
      const target = rest[0];
      const account = rest[1] && /^u\d+$/i.test(rest[1]) ? rest[1] : 'u1';
      const sessionName = rest[2] || (rest[1] && !/^u\d+$/i.test(rest[1]) ? rest[1] : undefined);
      const session = resolveSession(account, sessionName);
      if (!target) {
        console.error('클릭 대상을 입력하십시오. 예: node 04-interact.mjs click "로그인 버튼"');
        process.exit(1);
      }
      const out = withTokenTracking(account, session, () => visualClick(account, target, session));
      console.log(tailOf(out, 10));
      break;
    }

    case 'type':
    case 'input': {
      const target = rest[0];
      const text = rest[1];
      const account = rest[2] && /^u\d+$/i.test(rest[2]) ? rest[2] : 'u1';
      const sessionName = rest[3] || (rest[2] && !/^u\d+$/i.test(rest[2]) ? rest[2] : undefined);
      const session = resolveSession(account, sessionName);
      if (!target || text === undefined) {
        console.error('입력 칸과 값을 입력하십시오. 예: node 04-interact.mjs type "검색창" "검색어"');
        process.exit(1);
      }
      const out = withTokenTracking(account, session, () => visualType(account, target, text, session));
      console.log(tailOf(out, 10));
      break;
    }

    case 'inspect':
    case 'check': {
      const question = rest[0];
      const account = rest[1] && /^u\d+$/i.test(rest[1]) ? rest[1] : 'u1';
      const sessionName = rest[2] || (rest[1] && !/^u\d+$/i.test(rest[1]) ? rest[1] : undefined);
      const session = resolveSession(account, sessionName);
      if (!question) {
        console.error('질문을 입력하십시오. 예: node 04-interact.mjs inspect "현재 보이는 제목이 무엇인가"');
        process.exit(1);
      }
      const out = withTokenTracking(account, session, () => visualInspect(account, question, session));
      console.log(tailOf(out, 10));
      break;
    }

    case 'scroll': {
      const dir = rest[0] === 'up' ? 'up' : 'down';
      const account = rest[1] && /^u\d+$/i.test(rest[1]) ? rest[1] : 'u1';
      const sessionName = rest[2] || (rest[1] && !/^u\d+$/i.test(rest[1]) ? rest[1] : undefined);
      const session = resolveSession(account, sessionName);
      const out = withTokenTracking(account, session, () => visualScroll(account, dir, session));
      console.log(tailOf(out, 10));
      break;
    }

    case 'fallback': {
      const instruction = rest[0];
      const account = rest[1] && /^u\d+$/i.test(rest[1]) ? rest[1] : 'u1';
      const sessionName = rest[2] || (rest[1] && !/^u\d+$/i.test(rest[1]) ? rest[1] : undefined);
      const session = resolveSession(account, sessionName);
      if (!instruction) {
        console.error('폴백 지시를 입력하십시오.');
        process.exit(1);
      }
      const prompt = `[폴백 모드]: ${instruction}`;
      const out = withTokenTracking(account, session, () => ask(account, prompt, session));
      console.log(tailOf(out, 10));
      break;
    }

    default:
      console.error(`알 수 없는 액션: ${action}`);
      process.exit(1);
  }
}

run().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
