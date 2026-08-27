# 3대 기둥 명세: Rule, Skill, Hook (Three Pillars)

AI 에이전트 하네스는 제약의 성격, 실행 주체, 컨텍스트 비용에 따라 책임을 3개의 기둥으로 엄격히 분리합니다.

---

## 1. Rule (Always-on Context)

### 정의 및 메커니즘
`Rule`은 LLM의 시스템 프롬프트 및 대화 컨텍스트에 **매 턴마다 상시(Always-on) 주입**되는 최상위 행동 규약입니다. 에이전트가 어떤 작업을 수행하든 항상 인지하고 준수해야 하는 기반 제약입니다.

### 수록 기준 (Criteria)
- **전역 언어 및 어조 규약** — 답변의 한국어 종결어미, 번역투 억제, 금지 어휘 등 전역 커뮤니케이션 표준 ([`fluent-korean.md`](../rules/fluent-korean.md))
- **출력 레이아웃 및 서식** — 터미널 UI 가독성을 위한 헤더 형식, 리스트 구조, 시각적 일관성 ([`terminal-response-format.md`](../rules/terminal-response-format.md))
- **공통 안전 프로토콜** — 모든 턴에서 모델이 주의해야 할 전역적 행동 수칙

### 수록 금지 대상
- 특정 작업이나 파일 종류를 다룰 때만 필요한 긴 매뉴얼 (예: 문서 작성법, API 스펙)
- 특정 도구 사용법 (Aside 브라우저 구동법 등)
- 200줄을 초과하는 대규모 지침 (컨텍스트 창 오염 및 모델 주의력 분산 유발)

### 배치 및 배선
- 저장 위치: `.agents/rules/*.md`
- 마스터 총괄: `.agents/AGENTS.md` (내부에서 `@rules/*.md` 상대경로 임포트)

---

## 2. Skill (On-demand Progressive Disclosure)

### 정의 및 메커니즘
`Skill`은 에이전트가 평소에는 이름(`name`)과 설명(`description`)으로 구성된 **카탈로그 메타데이터만 보유(20~30 토큰 수준)**하고 있다가, 사용자의 지시나 상황에 따라 **필요할 때만 전체 본문이 온디맨드로 동적 로드**되는 지식 및 실행 패키지입니다.

### 수록 기준 (Criteria)
- **전문 도메인 런북** — Aside 브라우저 제어, 리모션 비디오 제작, 데이터 분석 등 특정 도구 연동 절차 ([`delegate-to-aside/`](../skills/delegate-to-aside/))
- **조건부 작업 규약** — 문서를 작성하거나 편집할 때만 필요한 서식 및 사족 배제 지침 ([`writing-docs/`](../skills/writing-docs/))
- **사고 기법 및 방법론** — 문제 발생 시에만 가동되는 체계적 디버깅 절차

### 수록 금지 대상
- 모든 턴에서 무조건 지켜야 하는 언어 말투나 터미널 출력 서식 (이것들은 Rule의 영역임)

### 배치 및 배선
- 저장 위치: `.agents/skills/<skill-name>/SKILL.md`
- Claude Code 배선: `.claude/skills` 심링크를 통해 `../.agents/skills`에 연결되어 네이티브 탐색 지원

---

## 3. Hook (Deterministic Physical Gate)

### 정의 및 메커니즘
`Hook`은 LLM의 컨텍스트를 전혀 소비하지 않고(0 토큰), **LLM의 의사결정 체계 밖에서 OS/Git 물리적 런타임이 시스템 레벨로 강제(Hard Gate)**하는 결정론적 검증기입니다.

### 수록 기준 (Criteria)
- **AI 자율성 배제 영역** — 모델에게 "지키라"고 프롬프트로 부탁해서는 안 되고, 물리적으로 실패시켜야 하는 불변식
- **커밋 메시지 규격 검증** — Conventional Commits 형식 강제, 72자 초과 차단 ([`hooks/commit-msg/`](../hooks/commit-msg/))
- **AI 워터마크 및 서명 차단** — `🤖 Generated with`, `Co-Authored-By: Claude` 등 AI 서명 자동 차단
- **파괴적 명령 방어 및 시크릿 유출 차단** — 환경변수 누출, 무단 원격 푸시, 안전하지 않은 파일 삭제 차단

### 수록 금지 대상
- 코드 품질 평가, 문맥 기반 리팩토링 제안 등 LLM의 지능적 판단이 개입되어야 하는 영역

### 배치 및 배선
- 저장 위치: `.git/hooks/*` (로컬 Git 물리적 훅 디렉터리)
- 전역 오버라이드 보장: `git config core.hooksPath .git/hooks`를 통해 전역 설정에 무관하게 프로젝트 훅 실행 보장

---

## 4. 분류 결정 매트릭스 (Decision Matrix)

새로운 요구사항이나 제약이 발생했을 때 어느 기둥에 배치할지 결정하는 기준표입니다.

| 질문 (Decision Question) | 판정 기둥 | 조치 위치 |
| :--- | :--- | :--- |
| **"모든 대화 턴에서 항상 필요한가?"** | **Rule** | `rules/*.md` ➔ `.agents/AGENTS.md` |
| **"특정 상황/작업에서만 필요하며, 상세 지침이 필요한가?"** | **Skill** | `skills/<name>/SKILL.md` |
| **"모델의 실수를 허용할 수 없으며, 물리적으로 차단해야 하는가?"** | **Hook** | `hooks/<name>/` ➔ `.git/hooks/` |
