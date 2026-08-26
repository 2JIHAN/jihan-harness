---
name: delegate-to-aside
description: Aside 브라우저를 채팅 세션의 턴을 주고받는 방식으로 자동화합니다. 로그인된 계정으로 웹 작업을 시켜야 할 때, 진행 상황을 사용자가 GUI에서 실시간으로 보아야 할 때 사용합니다.
---

# Aside 브라우저 자동화

Aside는 브라우저 안에 에이전트가 들어 있는 AI 브라우저입니다. 이 스킬은 그 에이전트에게 **자연어로 지시를 한 턴씩 보내고 응답을 받는** 방식을 다룹니다.

코드는 이 스킬 폴더의 `scripts/`에 있습니다. 원본 저장소는 `https://github.com/2JIHAN/delegate-to-aside` 이며, 고칠 때는 그곳에서 고친 뒤 재배포합니다.

## 언제 쓰는가

사용자가 로그인해 둔 계정으로 웹 작업을 해야 할 때 씁니다. 슬랙 앱 설정, 구글 클라우드 콘솔, 노션처럼 로그인 상태가 필요한 곳이 해당합니다.

## 기본 흐름

```bash
cd <이 스킬 폴더>/scripts

node 00-check-model.mjs u1                      # 모델과 프록시 상태 확인
node 01-ensure-window.mjs u1                    # 앱 실행 확인, 탭 목록
node 02-open-session.mjs "작업 이름" u1 "URL"    # 세션 생성 및 GUI 가시화 (한 번만)
node 03-say.mjs "자연어 지시" u1                # 범용 대화 턴 전송
node 04-interact.mjs click "로그인 버튼" u1     # 시각 기반 마우스 클릭 모사
node 04-interact.mjs type "검색창" "단어" u1    # 시각 기반 키보드 타이핑 모사
node 04-interact.mjs inspect "결과 확인" u1     # 화면 시각적 상태 판독
```

`02`가 세션 ID를 `~/.aside/u/<계정>/.last-session`에 저장하므로, 이후 명령은 세션을 지정하지 않아도 됩니다.

## 실행은 메인 세션 밖에서 돌린다

브라우저 한 턴은 짧아도 몇 초, 길면 수십 초가 걸립니다. 그동안 메인 세션이 멈춰 서 있으면 대화가 브라우저 속도에 묶입니다. 그래서 **aside 세션에 지시를 보내고 응답을 읽는 일은 메인 세션의 턴을 점유하지 않는 자리에서 처리합니다.**

두 가지 방식 중 하나를 씁니다.

- **서브에이전트에 위임** — 브라우저 작업 전체(세션 열기부터 검증까지)를 하나의 서브에이전트에 맡기고, 메인 세션은 결론만 돌려받습니다. 여러 페이지를 오가는 다단계 작업에 적합합니다.
- **백그라운드 실행 후 로그 읽기** — 명령을 백그라운드로 띄우고 출력 파일에 흘린 뒤, 필요한 시점에 그 파일만 읽습니다. 단발성 확인에 적합합니다.

```bash
node 03-say.mjs "지시" u1 > /tmp/aside-step.log 2>&1 &
```

메인 세션이 `03-say.mjs`나 `04-interact.mjs`의 완료를 앞에서 기다리는 형태는 피합니다. 사용자는 그 시간 동안 다른 이야기를 이어갈 수 있어야 합니다.

## 페이지 인터랙션 원칙 (Vision-First UI Simulation)

1. **시각 기반 조작 우선** — 대규모 HTML 소스나 DOM 트리를 통째로 읽지 않고, 화면 스크린샷과 시각 레이아웃을 인지하여 실제 사용자의 **마우스 클릭과 키보드 입력을 모사**합니다.
2. **제한적 폴백(Fallback)** — CAPTCHA 우회 확인, 비가시적 네트워크 데이터 확인 등 불가피한 상황에서만 fetch나 DOM 직접 조회를 수행합니다.
3. **모듈화 유지** — 상호작용은 `04-interact.mjs` 및 `lib.mjs`의 독립 함수(`visualClick`, `visualType`, `visualNavigate`, `visualInspect`)를 활용합니다.

## 탭은 적게 쓰고, 다 쓴 탭은 닫는다

탭을 늘려 두면 어느 탭이 지금 대상인지 흐려지고, 브리지가 엉뚱한 탭에 붙어 조작이 빗나갑니다. 그래서 **한 번에 필요한 최소한의 탭만 띄우고, 목적을 다한 탭은 그 자리에서 닫습니다.**

작업 단위마다 마지막에 닫는 스텝을 하나 넣습니다.

```bash
node 03-say.mjs "방금 확인을 끝낸 탭을 닫아줘. 남은 탭 목록도 알려줘." u1
```

나중에 그 페이지가 다시 필요해질 수 있습니다. 그때는 **새 탭을 열어 필요한 데이터까지 다시 찾아 들어갑니다.** 다시 접근하는 수고가 들더라도, 열어 둔 탭이 쌓여 대상이 모호해지는 것보다 낫습니다. 탭을 남겨 두는 판단은 같은 페이지를 곧바로 여러 번 오갈 때만 합니다.

## 반드시 알아야 할 사실

아래는 전부 실측으로 확인한 것입니다. 어림짐작으로 다르게 하면 실패합니다.

### 세션 ID에서 날짜 접두사를 뗀다

세션 폴더 이름은 `~/.aside/u/1/sessions/2026-08-20_jcjC8qrCxx7biICU` 형태입니다. 그런데 `--session`에는 **`jcjC8qrCxx7biICU`만** 넘겨야 합니다. 폴더 이름을 그대로 넘기면 `Session not found`가 납니다.

### ephemeral=0 으로 flip해야 GUI에 보인다

CLI가 만드는 세션은 `ephemeral: true`로 고정되어 있습니다. 이 상태에서는 앱 Chats 목록에 뜨지 않고 프로세스가 끝나면 사라집니다. 만든 뒤에 데이터베이스를 직접 고쳐야 합니다.

```sql
UPDATE sessions SET ephemeral=0, title='작업 이름' WHERE id='<세션ID>';
```

대상 파일은 `~/.aside/u/<계정>/state.db`입니다. **가시성과 세션 유지가 같은 장치입니다.** 하나를 얻으면 다른 하나도 따라옵니다.

### 세션을 이어 쓰면 5배 빠르다

| 방식 | 한 턴 소요 |
| --- | --- |
| 콜드 `aside exec` (매번 새 세션) | 11초 |
| 웜 `--session` (세션 이어 쓰기) | **2초** |

앞 맥락을 다시 설명할 필요도 없습니다. 브라우저 화면과 대화 기억이 그대로 남아 있습니다.

### 프로필이 맞아야 브리지가 붙는다

`aside repl`이 `listBrowserTabs()`에서 빈 배열을 돌려주거나 `attachActiveBrowserTab()`이 실패하면, 대개 **CLI 계정과 실제로 떠 있는 창의 프로필이 다른 것**입니다. 브라우저가 망가진 것이 아닙니다. 해당 프로필로 앱을 띄우면 붙습니다.

```bash
/Applications/Aside.app/Contents/MacOS/Aside --profile-directory="Profile 1"
```

계정과 프로필 번호를 넘겨짚지 마십시오. `aside account list`가 보여 주는 `profiles: Profile N`은 폴더 이름이 아니라 순번입니다.

### 모델을 지정할 때는 프로바이더를 함께 넘긴다

```bash
aside exec -p antigravity -m claude-sonnet-4-6 "지시"
```

이름만 넘기면 `not available for this account` 오류가 납니다. 계정별 기본 모델은 `~/.aside/u/<계정>/settings.json`의 `defaultModel`에 있습니다.

`antigravity`는 로컬 프록시(`127.0.0.1:8317`)에 의존하므로, 그 프로세스가 꺼져 있으면 동작하지 않습니다. `00-check-model.mjs`가 이것을 확인합니다.

### 지시는 한 번에 한 단계씩 보낸다

여러 단계를 한 프롬프트에 몰아넣으면 중간에 연결이 끊겨 실패합니다. 짧고 단일한 지시는 안정적으로 성공합니다. 확인이 필요하면 스크린샷을 찍고 경로를 알려 달라고 하십시오. 그 파일은 `~/.aside/u/<계정>/sessions/<세션>/tmp/`에 남으므로 직접 열어 검증할 수 있습니다.

## 계정

| 계정 | 이메일 | 용도 |
| --- | --- | --- |
| u0 | tndgud12@gmail.com | 개인 |
| **u1** | doesstudio.official@gmail.com | **더즈 업무** |
| u2 | Local Account | 로그인 없음 |

## 파일 구성

| 파일 | 하는 일 |
| --- | --- |
| `lib.mjs` | exec 호출, 세션 보관, 시각 UI 모사 공통 함수 |
| `00-check-model.mjs` | 기본 모델 및 프로바이더 연결 상태 점검 |
| `00-sync-aside-rules.mjs` | 모든 계정의 `AGENTS.md`/`MEMORY.md`에 시각 우선 원칙 각인 |
| `01-ensure-window.mjs` | 앱 실행 확인, 없으면 실행, 탭 목록 |
| `02-open-session.mjs` | 세션 생성, ephemeral flip, 세션 ID 저장 |
| `03-say.mjs` | 열린 세션에 지시 한 턴 전송 |
| `04-interact.mjs` | 시각 기반 click/type/inspect 조작 |
| `profiles.mjs` | 계정과 Aside 프로필 번호 매핑 조회 |
| `sessions.mjs` | 저장된 세션 목록 조회 |
| `token-monitor.mjs` | 턴별 토큰 사용량 추적 |
| `references/repl-surface.md` | repl 저수준 API 설명 (이전 문서 보존본) |

## 실패했을 때

| 증상 | 원인과 조치 |
| --- | --- |
| `Session not found` | 날짜 접두사를 뗐는지 확인합니다. |
| 탭 목록이 비어 있음 | 프로필이 다릅니다. 해당 프로필로 앱을 띄웁니다. |
| `exceeded rate limit` | 일시적입니다. 프로바이더/프록시 레벨에서 자동 폴백 처리되거나 잠시 뒤 재시도합니다. |
| `not available for this account` | 모델만 넘겼습니다. `-p`를 함께 넘깁니다. |
| 앱 Chats에 안 보임 | flip이 안 됐습니다. `state.db`에서 `ephemeral` 값을 확인합니다. |
| 여러 단계 지시가 중간에 죽음 | 지시를 단계별로 쪼갭니다. |
