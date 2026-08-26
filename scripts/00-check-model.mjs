#!/usr/bin/env node
// 0단계 — 모델 상태를 확인합니다.
//
// 세 가지를 따로 봅니다. 서로 다를 수 있기 때문입니다.
//   설정값        settings.json 에 적힌 것
//   실제 쓰인 값   최근 세션 기록에 남은 것 (설정을 파일로 고치면 반영이 늦습니다)
//   서빙 목록      프로바이더가 지금 실제로 돌리고 있는 모델
//
// 사용법: node 00-check-model.mjs [계정]

import { defaultModel, lastUsedModel, liveModels, pickModel, providerBaseUrl } from './lib.mjs';

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
if (!base) {
  console.log(`\n프로바이더 "${set.provider}" 는 로컬 설정이 없습니다. Aside 제공 모델로 보입니다.`);
  console.log('사용량 제한에 걸리기 쉽습니다.');
} else {
  const ids = await liveModels(account);
  if (ids.length === 0) {
    console.log(`\n프로바이더 "${set.provider}" (${base}) 가 응답하지 않습니다.`);
    console.log('설정이 이 프로바이더를 가리키므로 실행이 실패합니다.');
  } else {
    console.log(`\n프로바이더 "${set.provider}" (${base}) 정상 — 모델 ${ids.length}개`);
    if (!ids.includes(set.modelId)) {
      console.log(`경고: 설정된 ${set.modelId} 가 목록에 없습니다. 권장: ${await pickModel(account)}`);
    }
  }
}
