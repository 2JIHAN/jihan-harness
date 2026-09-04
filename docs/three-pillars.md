# 3대 기둥: Rule, Skill, Hook (Three Pillars)

---

## 1. Rule (Always-on Context)

- **정의** — LLM 대화 컨텍스트에 매 턴마다 상시(Always-on) 주입되는 전역 행동 규약
- **수록 기준**
  - 전역 언어 및 어조 규약 ([`fluent-korean.md`](../rules/fluent-korean.md))
  - 출력 레이아웃 및 서식 표준 ([`terminal-response-format.md`](../rules/terminal-response-format.md))
  - 모든 턴에서 일관되게 지켜야 하는 최소한의 작업 안전 수칙
- **수록 금지 대상**
  - 특정 파일이나 작업에만 국한되는 상세 지침 (문서 작성법, 기획서 서식 등)
  - 특정 외부 도구의 상세 사용 절차
  - 200줄을 초과하는 대규모 매뉴얼
- **배치 및 배선**
  - 본체: `.agents/rules/*.md`
  - 마스터: `.agents/AGENTS.md` (내부에서 `@rules/*.md` 상대경로 임포트)

---

## 2. Skill (On-demand Progressive Disclosure)

- **정의** — 평소에는 이름과 설명 메타데이터(약 20~30 토큰)만 유지하다가, 관련 작업 수행 시에만 본문 전체를 동적으로 불러오는 온디맨드 패키지
- **수록 기준**
  - 도구 연동 및 브라우저 제어 절차 ([`delegate-to-aside/`](../skills/delegate-to-aside/))
  - 조건부 작업 규약 ([`writing-docs-in-korean/`](../skills/writing-docs-in-korean/))
  - 체계적인 디버깅 기법 및 도메인 특화 방법론
- **수록 금지 대상**
  - 모든 턴에서 무조건 지켜야 하는 공통 언어 어조나 출력 서식
- **배치 및 배선**
  - 본체: `.agents/skills/<name>/SKILL.md`
  - Claude Code: `.claude/skills` 심링크를 통해 `../.agents/skills`에 연결

---

## 3. Hook (Deterministic Physical Gate)

- **정의** — LLM 컨텍스트를 소모하지 않고(0 토큰), OS 및 Git 런타임 환경에서 시스템 수준으로 강제하는 결정론적 검증기
- **수록 기준**
  - 커밋 메시지 규격 검증 (Conventional Commits, 72자 제한) ([`hooks/commit-msg/`](../hooks/commit-msg/))
  - AI 워터마크 및 서명 차단 (`🤖 Generated with`, `Co-Authored-By` 등)
  - 시크릿 정보 유출 방지 및 위험한 쉘 명령 차단
- **수록 금지 대상**
  - 문맥 해석이나 코드 품질 검토 등 LLM의 정성적 판단이 개입되어야 하는 영역
- **배치 및 배선**
  - 본체: `.git/hooks/*`
  - 우선순위 보장: `git config core.hooksPath .git/hooks` 설정을 통해 로컬 훅 우선 실행

---

## 4. 분류 결정 매트릭스

| 상황 | 판정 | 배치 위치 |
| :--- | :--- | :--- |
| 모든 대화 턴에서 상시 유지해야 하는가? | **Rule** | `rules/*.md` ➔ `.agents/AGENTS.md` |
| 특정 작업이나 도구를 다룰 때만 필요한가? | **Skill** | `skills/<name>/SKILL.md` |
| 모델의 판단을 배제하고 물리적으로 강제해야 하는가? | **Hook** | `hooks/<name>/` ➔ `.git/hooks/` |

---

## 5. 스킬 라우터 패턴 (Skill Dispatcher Pattern)

스킬 본문은 수백 줄에 달하므로 상시 컨텍스트(Rule)에 넣으면 토큰이 낭비된다. 반면 스킬에만 두면 모델이 필요한 순간에 스킬을 읽지 않고 자의적으로 코드를 수정할 수 있다.

이 모순을 해결하기 위해 **Rule에 가벼운 신호등(트리거 포인터)을 두고, 본문은 Skill에 격리하는 라우터 패턴**을 적용한다:

- **Rule (`skill-routing.md`)** — 작업 맥락별 필수 스킬(코딩 시 `ponytail`, 디버깅 시 `systematic-debugging`, 한국어 문서 작성 시 `writing-docs-in-korean`) 라우팅 지침만 상시 주입 (약 50토큰 소비).
- **Skill (`skills/*/SKILL.md`)** — 100~300줄에 달하는 구체적 방법론과 레퍼런스는 온디맨드로 유지.
- **효과** — 상시 컨텍스트 비용을 최소화하면서도, 특정 작업 발생 시 스킬을 반드시 거치도록 모델의 행동 순서를 강제한다.

