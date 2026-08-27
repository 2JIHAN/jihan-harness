# 3대 기둥: Rule, Skill, Hook (Three Pillars)

---

## 1. Rule (Always-on Context)

- **정의** — LLM 대화 컨텍스트에 매 턴마다 상시(Always-on) 주입되는 전역 행동 규약
- **수록 기준**
  - 전역 언어 및 어조 규약 ([`fluent-korean.md`](../rules/fluent-korean.md))
  - 출력 레이아웃 및 서식 표준 ([`terminal-response-format.md`](../rules/terminal-response-format.md))
  - 모든 턴에서 유지해야 하는 최소한의 안전 프로토콜
- **수록 금지 대상**
  - 특정 파일·작업 전용 지침 (문서 작성법, 기획서 서식 등)
  - 특정 도구 연동 절차
  - 200줄 이상의 대규모 매뉴얼
- **배치 및 배선**
  - 본체: `.agents/rules/*.md`
  - 마스터: `.agents/AGENTS.md` (내부에서 `@rules/*.md` 상대경로 임포트)

---

## 2. Skill (On-demand Progressive Disclosure)

- **정의** — 평소에는 이름과 설명 메타데이터(20~30 토큰)만 유지하다가, 해당 작업 시에만 본문 전체가 동적 로드되는 온디맨드 패키지
- **수록 기준**
  - 도구 연동 및 브라우저 제어 절차 ([`delegate-to-aside/`](../skills/delegate-to-aside/))
  - 조건부 작업 규약 ([`writing-docs/`](../skills/writing-docs/))
  - 디버깅 기법 및 특정 도메인 방법론
- **수록 금지 대상**
  - 모든 턴에서 지켜야 하는 전역 어조나 출력 서식
- **배치 및 배선**
  - 본체: `.agents/skills/<name>/SKILL.md`
  - Claude Code: `.claude/skills` 심링크 ➔ `../.agents/skills`

---

## 3. Hook (Deterministic Physical Gate)

- **정의** — LLM 컨텍스트를 소비하지 않고(0 토큰), OS/Git 런타임에서 강제하는 시스템 레벨 하드 게이트
- **수록 기준**
  - 커밋 메시지 규격 검증 (Conventional Commits, 72자 제한) ([`hooks/commit-msg/`](../hooks/commit-msg/))
  - AI 워터마크 및 서명 차단 (`🤖 Generated with`, `Co-Authored-By` 등)
  - 시크릿 누출 및 파괴적 쉘 명령 방어
- **수록 금지 대상**
  - 문맥 해석이나 코드 설계 평가 등 LLM의 정성적 판단이 필요한 영역
- **배치 및 배선**
  - 본체: `.git/hooks/*`
  - 우선순위 보장: `git config core.hooksPath .git/hooks`

---

## 4. 분류 결정 매트릭스

| 상황 | 판정 | 배치 위치 |
| :--- | :--- | :--- |
| 모든 대화 턴에서 상시 유지해야 하는가? | **Rule** | `rules/*.md` ➔ `.agents/AGENTS.md` |
| 특정 작업이나 도구를 다룰 때만 필요한가? | **Skill** | `skills/<name>/SKILL.md` |
| 모델의 판단을 배제하고 물리적으로 강제해야 하는가? | **Hook** | `hooks/<name>/` ➔ `.git/hooks/` |
