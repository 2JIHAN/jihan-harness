// token-monitor.mjs — Aside 브라우저 세션 토큰 사용량 추적 및 모니터링 모듈
//
// 특징:
// 1. 세션의 messages.jsonl 을 실시간 파싱하여 턴별/누적 토큰 사용량과 비용을 계산합니다.
// 2. 디버깅 단계에서 쉽게 활성화하고, 실제 운영 시에는 환경변수나 옵션 하나로 쉽게 끌 수 있습니다 (Pluggable).

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { sessionsDir, userDir } from './lib.mjs';

// 세션 토큰 통계 추출
export function getSessionTokenStats(account, sessionId) {
  const dir = sessionsDir(account);
  if (!existsSync(dir)) return null;

  const matchedDir = readdirSync(dir).find((d) => d.includes(sessionId));
  if (!matchedDir) return null;

  const file = join(dir, matchedDir, 'messages.jsonl');
  if (!existsSync(file)) return null;

  const lines = readFileSync(file, 'utf8').split('\n').filter((l) => l.trim().length > 0);

  let inputTokens = 0;
  let outputTokens = 0;
  let cacheReadTokens = 0;
  let cacheWriteTokens = 0;
  let totalTokens = 0;
  let totalCost = 0;
  let turns = 0;

  const turnDetails = [];

  for (const line of lines) {
    try {
      const msg = JSON.parse(line);
      if (msg.role === 'assistant' && msg.usage) {
        turns += 1;
        const u = msg.usage;
        const inTok = u.input || 0;
        const outTok = u.output || 0;
        const cRead = u.cacheRead || 0;
        const cWrite = u.cacheWrite || 0;
        const total = u.totalTokens || inTok + outTok;
        const cost = u.cost?.total || 0;

        inputTokens += inTok;
        outputTokens += outTok;
        cacheReadTokens += cRead;
        cacheWriteTokens += cWrite;
        totalTokens += total;
        totalCost += cost;

        turnDetails.push({
          turn: turns,
          model: msg.model || 'unknown',
          input: inTok,
          output: outTok,
          total,
          cost,
          timestamp: msg.timestamp,
        });
      }
    } catch {}
  }

  return {
    sessionId,
    turns,
    inputTokens,
    outputTokens,
    cacheReadTokens,
    cacheWriteTokens,
    totalTokens,
    totalCost,
    turnDetails,
  };
}

// 1줄 요약 출력용 포맷터
export function formatTokenDelta(beforeStats, afterStats) {
  if (!afterStats) return '[토큰 정보 없음]';
  const deltaTurns = afterStats.turns - (beforeStats?.turns || 0);
  const deltaTokens = afterStats.totalTokens - (beforeStats?.totalTokens || 0);
  const deltaInput = afterStats.inputTokens - (beforeStats?.inputTokens || 0);
  const deltaOutput = afterStats.outputTokens - (beforeStats?.outputTokens || 0);

  return `[📊 토큰 소모: +${deltaTokens} tok (입력: ${deltaInput}, 출력: ${deltaOutput}) | 누적: ${afterStats.totalTokens} tok (${afterStats.turns}턴)]`;
}

// 인터랙션 함수를 토큰 모니터링으로 감싸는 고차 함수 (쉽게 탈부착 가능)
export function withTokenTracking(account, sessionId, actionFn) {
  const enabled = process.env.ASIDE_DEBUG_TOKENS !== '0';
  if (!enabled) return actionFn();

  const before = getSessionTokenStats(account, sessionId);
  const result = actionFn();
  const after = getSessionTokenStats(account, sessionId);

  const report = formatTokenDelta(before, after);
  console.log(report);
  return result;
}

// CLI 직접 실행 시 세션 토큰 리포트 출력
if (process.argv[1].endsWith('token-monitor.mjs')) {
  const account = process.argv[2] || 'u1';
  const sessionId = process.argv[3];
  if (!sessionId) {
    console.log('사용법: node token-monitor.mjs [계정] <세션ID>');
    process.exit(0);
  }
  const stats = getSessionTokenStats(account, sessionId);
  if (!stats) {
    console.error(`세션 "${sessionId}" 의 토큰 통계를 찾지 못했습니다.`);
    process.exit(1);
  }
  console.log(`\n=== 세션 토큰 사용량 리포트 (세션: ${sessionId}) ===`);
  console.log(`총 턴 수:        ${stats.turns}`);
  console.log(`입력 토큰:       ${stats.inputTokens.toLocaleString()} tok`);
  console.log(`출력 토큰:       ${stats.outputTokens.toLocaleString()} tok`);
  console.log(`총 소모 토큰:    ${stats.totalTokens.toLocaleString()} tok`);
  if (stats.totalCost > 0) console.log(`총 비용:         $${stats.totalCost.toFixed(4)}`);
  console.log('\n[턴별 내역]');
  stats.turnDetails.forEach((t) => {
    console.log(`  턴 ${t.turn} (${t.model}): 입력 ${t.input} tok / 출력 ${t.output} tok / 합계 ${t.total} tok`);
  });
}
