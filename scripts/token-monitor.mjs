// token-monitor.mjs — Real-time token consumption and cost tracking for Aside sessions.
//
// Features:
// 1. Parses session messages.jsonl in real time to calculate turn-by-turn and cumulative token usage and cost.
// 2. Easily toggled on/off via environment variable (ASIDE_DEBUG_TOKENS=0 to disable).

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { defaultAccount, sessionsDir, userDir } from './lib.mjs';

// Extract token statistics for a given session
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

// Single-line summary delta formatter
export function formatTokenDelta(beforeStats, afterStats) {
  if (!afterStats) return '[No token information]';
  const deltaTurns = afterStats.turns - (beforeStats?.turns || 0);
  const deltaTokens = afterStats.totalTokens - (beforeStats?.totalTokens || 0);
  const deltaInput = afterStats.inputTokens - (beforeStats?.inputTokens || 0);
  const deltaOutput = afterStats.outputTokens - (beforeStats?.outputTokens || 0);

  return `[📊 Token usage: +${deltaTokens} tok (input: ${deltaInput}, output: ${deltaOutput}) | total: ${afterStats.totalTokens} tok (${afterStats.turns} turns)]`;
}

// Higher-order function wrapping actions with token tracking
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

// CLI standalone runner
if (process.argv[1].endsWith('token-monitor.mjs')) {
  const account = process.argv[2] || defaultAccount();
  const sessionId = process.argv[3];
  if (!sessionId) {
    console.log('Usage: node token-monitor.mjs [account] <sessionId>');
    process.exit(0);
  }
  const stats = getSessionTokenStats(account, sessionId);
  if (!stats) {
    console.error(`Could not find token statistics for session "${sessionId}".`);
    process.exit(1);
  }
  console.log(`\n=== Session Token Usage Report (Session: ${sessionId}) ===`);
  console.log(`Total turns:        ${stats.turns}`);
  console.log(`Input tokens:       ${stats.inputTokens.toLocaleString()} tok`);
  console.log(`Output tokens:      ${stats.outputTokens.toLocaleString()} tok`);
  console.log(`Total tokens:       ${stats.totalTokens.toLocaleString()} tok`);
  if (stats.totalCost > 0) console.log(`Total cost:         $${stats.totalCost.toFixed(4)}`);
  console.log('\n[Turn Details]');
  stats.turnDetails.forEach((t) => {
    console.log(`  Turn ${t.turn} (${t.model}): input ${t.input} tok / output ${t.output} tok / total ${t.total} tok`);
  });
}
