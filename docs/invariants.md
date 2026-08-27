# 3대 불변식 명세: 멱등성, 자동 배선, 상호 무의존성 (Architectural Invariants)

하네스를 구성하는 모든 단위 요소(Rule, Skill, Hook)와 배포 스크립트(`install.sh`)가 준수해야 하는 시스템 엔지니어링 3대 불변식입니다.

---

## 1. 멱등성 (Idempotency)

### 정의
임의의 작업을 1번 실행한 결과와 N번 반복 실행한 결과가 **동일한 시스템 상태**를 보장해야 합니다. 반복 실행 시 파일의 오염, 중복 기재, 예외 발생이 없어야 합니다.

### 명세 및 구현 규칙
- **참조 줄 중복 방지** — `AGENTS.md`에 룰 파일을 등록할 때 파일 존재 여부 및 대상 라인(`grep -qF`)을 사전 검사하여 중복 라인이 추가되지 않도록 차단합니다.
- **안전한 파일 갱신** — 파일 복사(`cp`) 또는 심링크(`ln -sf`) 시 기존 대상이 존재하더라도 덮어쓰거나 링크를 갱신하며 에러를 발생시키지 않습니다.
- **기존 파일 보존** — 사용자가 기존에 작성해 둔 커스텀 파일(예: 프로젝트 고유의 `upstream-repos.md`, `.claude/settings.local.json`)이 있을 경우 이를 무단으로 삭제하거나 초기화하지 않습니다.

---

## 2. 자동 배선 (Auto-wiring)

### 정의
배포 스크립트 실행 후 사용자가 여러 에이전트 도구(Claude Code, Antigravity)를 위한 설정을 수동으로 손대지 않아도, 플랫폼별 탐색 규격에 맞춰 **단일 진실 공급원(SSOT)으로 자동 연결**되어야 합니다.

### 명세 및 구현 규칙
- **루트 디렉터리 순수성 (Clean Root)** — 프로젝트 루트에는 단 하나의 가이드 파일(`CLAUDE.md`, `GEMINI.md`, `AGENTS.md`)도 노출시키지 않습니다. 모든 설정은 숨김 전용 폴더(`.agents/`, `.claude/`, `.gemini/`) 내부에 격리합니다.
- **상대경로 단일 진실 공급원 (Relative SSOT)** — 
  - 마스터 가이드 원본은 [`.agents/AGENTS.md`](../docs/three-pillars.md#1-rule-always-on-context)에만 존재합니다.
  - `.claude/CLAUDE.md`는 `@../.agents/AGENTS.md` 1줄로 상대경로 참조합니다.
  - `.gemini/GEMINI.md`는 `@../.agents/AGENTS.md` 1줄로 상대경로 참조합니다.
- **스킬 심링크 배선** — Claude Code가 `.agents/skills`에 위치한 스킬들을 네이티브하게 탐색할 수 있도록 `.claude/skills` ➔ `../.agents/skills` 심링크를 자동으로 가설합니다.
- **Git 물리 훅 경로 오버라이드** — 개발 머신에 전역 `core.hooksPath`가 설정되어 있더라도, 프로젝트 로컬 훅이 우선하도록 `git config core.hooksPath .git/hooks`를 자동 주입합니다.

---

## 3. 상호 무의존성 (Zero-dependency)

### 정의
하네스의 각 계층(Rule, Skill, Hook) 및 개별 모듈은 외부 런타임 패키지에 의존하지 않으며, **하네스 내부의 다른 모듈에 대해서도 상호 종속성을 갖지 않습니다 (Coupling Zero).**

### 명세 및 구현 규칙

### 가. 런타임 외부 무의존
- `npm install`, `pip install`, `brew install` 등 무거운 외부 의존성을 요구하지 않습니다.
- macOS / Linux 표준 환경에 기본 탑재된 쉘(`bash`), `git`, `node`만을 사용하여 즉각 실행 가능해야 합니다.

### 나. 계층 간 무의존 (Cross-tier Decoupling)
- **Rule ➔ Skill 무의존**: `rules/`의 규칙 파일은 특정 스킬의 존재 여부에 의존하지 않습니다. 스킬이 없어도 룰은 독립적으로 작동합니다.
- **Rule ➔ Rule 무의존**: `fluent-korean.md`와 `terminal-response-format.md`는 서로를 참조하지 않는 완전한 독립 문서입니다.
- **Hook ➔ Agent 무의존**: `hooks/commit-msg`는 Claude Code나 Antigravity의 설치 여부와 무관하게 Git 환경 자체에서 단독 실행됩니다.

### 다. 모듈별 독립 배포 가능성
- 통합 설치(`install.sh`) 외에도 사용자가 원하는 특정 계층만 선택적으로 설치할 수 있습니다:
  - `./install.sh --rules` — 룰셋 및 브릿지만 독립 배포
  - `./install.sh --skills` — 스킬셋만 독립 배포
  - `./install.sh --hooks` — 물리 훅만 독립 배포
  - `npx skills add 2JIHAN/jihan-workflow --skill <name>` — 특정 단일 스킬만 오픈 표준으로 독립 배포
