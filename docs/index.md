# 하네스 아키텍처 (Harness Architecture)

AI 코딩 에이전트의 작업 행동과 시스템 제약을 통제하는 모듈형 하네스 규격.

---

## 1. 3대 기둥 (The Three Pillars)

| 기둥 (Pillar) | 실행 계층 | 컨텍스트 적재 | 역할 및 강제력 |
| :--- | :--- | :--- | :--- |
| [**Rule**](three-pillars.md#1-rule-always-on-context) | LLM Context | 상시 주입 (Always-on) | 모든 대화 턴에 필요한 전역 표현 및 서식 표준 |
| [**Skill**](three-pillars.md#2-skill-on-demand-progressive-disclosure) | LLM Tooling | 온디맨드 (On-demand) | 특정 도구 연동이나 특정 작업 시에만 동적으로 적재 |
| [**Hook**](three-pillars.md#3-hook-deterministic-physical-gate) | OS / Git | 0 토큰 (컨텍스트 미적재) | LLM 자율성을 배제하고 시스템 수준에서 물리적으로 강제 |

---

## 2. 3대 불변식 (The Three Invariants)

- [**멱등성 (Idempotency)**](invariants.md#1-멱등성-idempotency) — 반복 실행해도 동일한 상태를 유지하며, 참조 라인 중복과 기존 파일 훼손을 방지한다.
- [**자동 배선 (Auto-wiring)**](invariants.md#2-자동-배선-auto-wiring) — 수동 조작 없이 루트 파일을 비워둔 채 숨김 폴더 내 상대경로 브릿지로 에이전트를 연결한다.
- [**상호 무의존성 (Zero-dependency)**](invariants.md#3-상호-무의존성-zero-dependency) — 외부 런타임 패키지 없이 동작하며, 계층 간 결합과 모듈 간 상호 참조를 배제한다.

---

## 3. 디렉터리 맵

```text
jihan-workflow/
├── docs/                                     # 아키텍처 문서
│   ├── index.md                              # 아키텍처 개요
│   ├── three-pillars.md                      # Rule, Skill, Hook 세부 명세
│   └── invariants.md                         # 멱등성, 자동 배선, 무의존성 명세
├── rules/                                    # [기둥 1] 상시 적용 규칙
│   ├── fluent-korean.md                      # 한국어 표현 규약
│   └── terminal-response-format.md           # 터미널 응답 서식 규격
├── skills/                                   # [기둥 2] 온디맨드 스킬
│   ├── delegate-to-aside/                    # Aside 브라우저 자동화
│   ├── writing-docs/                         # 영문 문서 작성 규약
│   └── writing-docs-in-korean/               # 한국어 문서 작성 규약
├── hooks/                                    # [기둥 3] 물리 하드 게이트
│   ├── commit-msg/                           # Conventional Commits + AI 서명 차단
│   └── install.sh                            # 훅 전용 설치기
├── install.sh                                # 통합 배포 스크립트
└── README.md                                 # 카탈로그 루트 문서
```
