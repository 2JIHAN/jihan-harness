#!/usr/bin/env node
// 0단계 — Aside 모든 프로필 계정에 시각 우선 조작 원칙을 영구 동기화합니다.
//
// 역할:
// 1. ~/.aside/u/* 모든 계정의 AGENTS.md 및 memory/MEMORY.md 에 시각 우선 원칙을 멱등하게 주입합니다.
// 2. 턴마다 무거운 지침을 반복 전송할 필요 없이, Aside 에이전트 두뇌 레벨에 기본 상식으로 각인합니다.

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const home = homedir();
const uBase = join(home, '.aside', 'u');

const RULE_SECTION_HEADER = '## 브라우저 인터랙션 및 조작 원칙 (Vision-First UI Simulation)';

const RULE_CONTENT = `${RULE_SECTION_HEADER}

- **시각 기반 조작 우선 (Vision-First)**: 대규모 HTML 덤프나 전체 DOM 트리를 통째로 파싱하지 마십시오. 항상 브라우저 화면(스크린샷 및 시각 레이아웃)을 관찰하여 실제 사용자처럼 **마우스 클릭과 키보드 입력**을 모사하여 조작하십시오.
- **시각 정보 판독**: 화면의 정보를 파악할 때도 DOM 소스를 긁는 대신, 화면에 시각적으로 렌더링된 요소(헤더, 텍스트, 버튼, 가격 등)를 기준으로 빠르게 판독하십시오.
- **제한적 폴백 (Fallback)**: CAPTCHA, 비가시적 네트워크 데이터 확인 등 시각적 조작이 불가능한 불가피한 상황에서만 fetch 또는 직접 DOM 쿼리를 최소한으로 허용합니다.
`;

export function syncAsideRules() {
  if (!existsSync(uBase)) {
    console.error('~/.aside/u 디렉터리를 찾지 못했습니다.');
    return [];
  }

  const accounts = readdirSync(uBase).filter((d) => !d.startsWith('.'));
  const updated = [];

  for (const acc of accounts) {
    const accDir = join(uBase, acc);
    const agentsMdPath = join(accDir, 'AGENTS.md');
    const memoryDir = join(accDir, 'memory');
    const memoryMdPath = join(memoryDir, 'MEMORY.md');

    // 1. AGENTS.md 갱신
    let agentsContent = existsSync(agentsMdPath) ? readFileSync(agentsMdPath, 'utf8') : '# Agent Rules\n\n';
    if (agentsContent.includes(RULE_SECTION_HEADER)) {
      const idx = agentsContent.indexOf(RULE_SECTION_HEADER);
      agentsContent = agentsContent.slice(0, idx).trimEnd() + '\n\n' + RULE_CONTENT;
    } else {
      agentsContent = agentsContent.trimEnd() + '\n\n' + RULE_CONTENT;
    }
    writeFileSync(agentsMdPath, agentsContent);

    // 2. memory/MEMORY.md 갱신 (메모리 브리핑 보완)
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
  console.log(`Aside 프로필 규칙 동기화 완료: ${synced.join(', ')} (총 ${synced.length}개 계정)`);
  console.log('이제 모든 세션에서 별도 프롬프트 주입 없이 시각 우선 인터랙션이 상시 적용됩니다.');
}
