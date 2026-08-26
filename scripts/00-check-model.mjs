#!/usr/bin/env node
// 0단계 — 계정에 설정된 모델 상태와 프로바이더 통신을 확인합니다.
//
// 확인 항목:
//   설정값        settings.json 에 적힌 기본 모델
//   실제 쓰인 값   최근 세션 기록에 남은 모델 (파일로 설정을 고쳤을 때의 지연 확인용)
//   프로바이더     로컬 프록시(엔드포인트) 사용 시 연결 상태 확인
//
// 사용법: node 00-check-model.mjs [계정]

import { defaultModel, lastUsedModel, providerBaseUrl } from './lib.mjs';

const account = process.argv[2] || 'u1';
const set = defaultModel(account);
const used = lastUsedModel(account);

console.log(`설정값      ${set.provider}/${set.modelId}`);
if (used) {
  const t = used.at.toTimeString().slice(0, 8);
  const same = used.provider === set.provider && used.modelId === set.modelId;
  console.log(`실제 쓰인 값 ${used.provider}/${used.modelId}  (${t})${same ? '' : '  ← 설정과 다릅니다'}`);
  if (!same) console.log('  설정을 파일로 고쳤다면 데몬이 아직 읽지 않은 것입니다. 잠시 뒤 다시 확인하십시오.');
} else {
  console.log('실제 쓰인 값 (기록 없음)');
}

const base = providerBaseUrl(account);
if (base) {
  try {
    const res = await fetch(`${base}/health`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      console.log(`\n프로바이더 "${set.provider}" (${base}) 연결 정상`);
    } else {
      console.log(`\n프로바이더 "${set.provider}" (${base}) 응답 오류: HTTP ${res.status}`);
    }
  } catch {
    console.log(`\n프로바이더 "${set.provider}" (${base}) 에 연결할 수 없습니다. 로컬 서버가 켜져 있는지 확인하십시오.`);
  }
} else {
  console.log(`\n프로바이더 "${set.provider}" — Aside 내장 또는 클라우드 프로바이더 구성`);
}
