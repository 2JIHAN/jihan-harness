# delegate-to-aside

Aside 브라우저의 내장 에이전트에게 **자연어 지시를 한 턴씩 보내고 응답을 받는** 방식으로 웹 작업을 자동화하는 에이전트 스킬입니다. 사용자가 로그인해 둔 계정 그대로 동작하고, 진행 과정이 GUI에 실시간으로 보입니다.

외부 의존성이 없습니다. Node 18+ 표준 라이브러리와 `aside` CLI만 씁니다.

## 설치

대상 프로젝트 폴더에서 실행하거나, `-g` 플래그로 사용자 PC 전역에 설치합니다.

```bash
# 특정 프로젝트에 설치
npx skills add 2JIHAN/delegate-to-aside

# 사용자 PC 전역(Antigravity, Claude Code 등 공용)에 설치
npx skills add 2JIHAN/delegate-to-aside -g
```

## 빠른 시작

```bash
cd scripts

node 00-check-model.mjs u1                      # 모델과 프록시 상태 확인
node 01-ensure-window.mjs u1                    # 앱 실행 확인, 탭 목록
node 02-open-session.mjs "작업 이름" u1 "URL"    # 세션 생성 및 GUI 가시화 (한 번만)
node 03-say.mjs "자연어 지시" u1                # 대화 턴 전송
node 04-interact.mjs click "로그인 버튼" u1     # 시각 기반 조작
```

한 번만 실행해 두면 좋은 것이 하나 있습니다. 모든 Aside 계정의 `AGENTS.md`에 시각 우선 조작 원칙을 각인해, 턴마다 같은 지침을 다시 보내지 않아도 되게 만듭니다.

```bash
node 00-sync-aside-rules.mjs
```

## 문서

- [SKILL.md](SKILL.md) — 에이전트가 읽는 운용 규칙. 세션 ID 규칙, ephemeral flip, 프로필 정합성 등 실측으로 확인한 함정이 전부 여기 있습니다

## 라이선스

MIT
