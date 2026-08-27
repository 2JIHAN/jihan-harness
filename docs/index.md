# 하네스 아키텍처 (Harness Architecture)

`jihan-workflow`는 AI 코딩 에이전트(Claude Code, Antigravity, Cursor 등)의 행동을 규율하고, 작업 품질을 보장하며, 시스템 제약을 강제하기 위한 모듈형 에이전트 하네스(Agent Harness)입니다.

하네스 시스템은 **3대 기둥(Three Pillars)**을 통해 에이전트의 제어 단계를 분리하고, **3대 불변식(Three Invariants)**을 통해 배포 및 운영의 안정성을 보장합니다.

---

## 1. 3대 기둥 (The Three Pillars)

에이전트 제어는 제약의 성격과 컨텍스트 비용에 따라 3개의 독립된 계층으로 분리됩니다.

| 기둥 (Pillar) | 실행 계층 | 컨텍스트 적재 | 목적 및 강제력 |
| :--- | :--- | :--- | :--- |
| [**Rule**](three-pillars.md#1-rule-always-on-context) | LLM Context | 상시 주입 (Always-on) | 모든 대화 턴에 필수적인 전역 표현 및 서식 표준 |
| [**Skill**](three-pillars.md#2-skill-on-demand-progressive-disclosure) | LLM Tooling | 온디맨드 (On-demand) | 특정 도구, 복잡한 워크플로우, 특정 작업 시에만 로드 |
| [**Hook**](three-pillars.md#3-hook-deterministic-physical-gate) | OS / Git | 컨텍스트 미적재 (0 토큰) | LLM 자율성을 배제하고 시스템 레벨에서 물리적 강제 |

상세 명세: [3대 기둥 명세서 (`docs/three-pillars.md`)](three-pillars.md)

---

## 2. 3대 불변식 (The Three Invariants)

하네스를 구성하는 모든 단위 요소(Rule, Skill, Hook)와 배포 도구는 다음 3가지 엔지니어링 원칙을 반드시 충족해야 합니다.

- [**멱등성 (Idempotency)**](invariants.md#1-멱등성-idempotency) — 설치 스크립트나 동기화 명령을 몇 번을 실행하더라도 항상 동일하고 안정된 상태를 유지하며, 중복 참조나 파일 훼손을 일으키지 않습니다.
- [**자동 배선 (Auto-wiring)**](invariants.md#2-자동-배선-auto-wiring) — 설치 즉시 여러 플랫폼(Claude Code, Antigravity)이 단일 설정 파일(`.agents/AGENTS.md`)을 바라보도록 자동 연결하며, 프로젝트 루트는 100% 클린하게 유지합니다.
- [**상호 무의존성 (Zero-dependency)**](invariants.md#3-상호-무의존성-zero-dependency) — 외부 패키지 설치를 요구하지 않으며, Rule, Skill, Hook 각 계층 및 구성 모듈 상호 간에도 종속성을 갖지 않아 단독 추출과 배포가 가능합니다.

상세 명세: [3대 불변식 명세서 (`docs/invariants.md`)](invariants.md)

---

## 3. 디렉터리 맵

```text
jihan-workflow/
├── docs/                                     # 하네스 아키텍처 및 시스템 문서
│   ├── index.md                              # 아키텍처 개요 (본 문서)
│   ├── three-pillars.md                      # 3대 기둥 (Rule, Skill, Hook) 상세 명세
│   └── invariants.md                         # 3대 불변식 (멱등성, 자동 배선, 무의존성) 명세
├── rules/                                    # [기둥 1] 상시 적용 규칙
│   ├── fluent-korean.md                      # 한국어 표현 규약
│   └── terminal-response-format.md           # 터미널 응답 서식 규격
├── skills/                                   # [기둥 2] 온디맨드 스킬
│   ├── delegate-to-aside/                    # Aside 브라우저 자동화
│   └── writing-docs/                         # 문서 작성 범위 규율 및 사족 배제
├── hooks/                                    # [기둥 3] 물리 하드 게이트
│   ├── commit-msg/                           # Conventional Commits + AI 서명 차단
│   └── install.sh                            # 훅 전용 설치기
├── install.sh                                # 통합 배포 스크립트 (3대 불변식 보장)
└── README.md                                 # 카탈로그 루트 문서
```
