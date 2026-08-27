# 3대 불변식: 멱등성, 자동 배선, 상호 무의존성 (Architectural Invariants)

---

## 1. 멱등성 (Idempotency)

1회 실행과 N회 반복 실행의 결과가 동일해야 한다.

- **참조 줄 중복 방지** — `AGENTS.md`에 `@` 참조를 추가할 때 `grep -qF` 검사를 통해 중복 라인 누적을 차단한다.
- **안전한 파일 갱신** — `cp` 또는 `ln -sf` 실행 시 기존 파일이 있어도 에러 없이 갱신한다.
- **기존 파일 보존** — 워크스페이스에 이미 존재하는 사용자 고유 파일은 덮어쓰거나 삭제하지 않는다.

---

## 2. 자동 배선 (Auto-wiring)

설치 즉시 추가 조작 없이 다중 에이전트 도구가 단일 설정을 바라보도록 연결한다.

- **루트 디렉터리 클린** — 프로젝트 루트에는 가이드 파일을 노출하지 않고 `.agents/`, `.claude/`, `.gemini/` 내부에 격리한다.
- **상대경로 가이드 배선**
  - 마스터 가이드 원본: `.agents/AGENTS.md`
  - Claude Code 브릿지: `.claude/CLAUDE.md` ➔ `@../.agents/AGENTS.md`
  - Antigravity 브릿지: `.gemini/GEMINI.md` ➔ `@../.agents/AGENTS.md`
- **스킬 심링크 배선** — `.claude/skills` ➔ `../.agents/skills` 심링크 자동 가설.
- **Git 훅 오버라이드** — `git config core.hooksPath .git/hooks`를 자동 설정하여 전역 설정을 덮어쓴다.

---

## 3. 상호 무의존성 (Zero-dependency)

외부 패키지 및 하네스 모듈 간 종속성을 배제한다.

- **런타임 무의존** — `npm install`, `pip install` 없이 OS 기본 도구(`bash`, `git`, `node`)로만 실행한다.
- **계층 간 무의존**
  - Rule은 Skill 존재 여부에 의존하지 않는다.
  - Rule 간 상호 참조를 하지 않는다 (`fluent-korean.md`와 `terminal-response-format.md`의 완전한 분리).
  - Hook은 에이전트 설치 여부와 무관하게 Git 환경에서 단독 실행된다.
- **단위별 독립 배포** — 전체 설치 외에 특정 단위만 독립 배포할 수 있다 (`--rules`, `--skills`, `--hooks`, `npx skills add`).
