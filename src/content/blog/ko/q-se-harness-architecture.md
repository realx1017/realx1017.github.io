---
title: "🦊 Q-SE Harness 기술 아키텍처 및 상세 운영 표준"
description: "Terraform 및 OpenTofu 리소스를 안전하게 관리하는 IaC 전용 에이전트 하네스(Q-SE Harness)의 구조와 가드레일, 자가 학습 엔진 기술 명세"
pubDate: "2026-06-02"
heroImage: ""
categories: ["Infrastructure", "Terraform", "Security"]
---

AWS 인프라 자원을 Terraform 및 OpenTofu로 안전하고 일관성 있게 관리하기 위해 고안된 **IaC 전용 에이전트 하네스(Q-SE Harness)**의 통합 기술 명세서입니다. 본 하네스는 티켓 기반 작업 관리, 자동 검증 체이닝, 실시간 가드레일 및 자가 진화형 학습 엔진(Instinct)을 포함합니다.

---

## 1. 시스템 아키텍처 (Technical Architecture)

Q-SE 하네스의 각 구성 요소는 유기적으로 작동하며, 실시간 검증 훅과 자가 학습 모듈이 인프라 변경 단계마다 개입하여 안정성을 보장합니다.

```mermaid
graph TD
    User([사용자 요청 / 티켓]) --> Planner[Planner 에이전트]
    Planner -->|체크리스트 생성| Builder[Builder 에이전트]
    
    subgraph 검증 루프 (최대 2회)
        Builder -->|TF/YAML 작성 완료| AutoHook[tf-auto-hook]
        AutoHook -->|Lint/Validate PASS| QA[QA 에이전트]
        QA -->|FAIL: 재작성 요청| Builder
    end
    
    QA -->|PASS| Plan[tofu plan 실행]
    Plan -->|성공| PlanCheck[tf-plan-check]
    PlanCheck -->|안전 검증 PASS| Approval[사용자 최종 승인 대기]
    
    subgraph 자가 학습 시스템 (Instinct)
        QA -->|FAIL 기록| AutoLearn[auto-learn]
        Plan -->|에러 기록| AutoLearn
        AutoLearn -->|실수 패턴 저장| ReliabilityDB[(q_신뢰도.csv)]
        ReliabilityDB -->|사전 경고 피드백| Planner
    end
    
    subgraph 실시간 가드레일 (Guardrail)
        TofuCmd[tofu / terraform 명령] --> ProfileGuard[env-profile-guard]
        ProfileGuard -->|환경-AWS 프로필 불일치 시| Abort[작업 즉시 중단 및 경고]
    end
```

---

## 2. 프로젝트 디렉토리 및 플랫폼 구성 (Deployment Spec)

하네스는 다양한 개발 도구 및 플랫폼 환경(Kiro, Claude Code, Antigravity)에서 동일한 수준의 검증 정책을 유지하도록 설계되었습니다.

### 플랫폼별 배포 구성

| 플랫폼 | 타겟 디렉토리 | 설치 및 적용 방식 |
| :--- | :--- | :--- |
| **Kiro CLI** | `kiro/` | `.kiro/` 폴더 내에 에이전트(json), 프롬프트, 가이드 및 스킬 복사 |
| **Claude Code** | `claude/` | `CLAUDE.md` 내에 핵심 가이드 주입 및 `.claude/` 하위에 스킬 적용 |
| **Antigravity** | `agy/` | `AGENTS.md` 파일에 통합 규칙 및 에이전트 정의, `.agents/`에 스킬 라이브러리 탑재 |

### 상세 디렉토리 구조
```plain text
q-se-harness/
├── README.md
├── install.sh              # 플랫폼 인자를 통해 에이전트 규칙을 자동 이식하는 스크립트
├── kiro/                   # Kiro CLI 원본 구성 (steering, agents, prompts, skills, guides)
├── claude/                 # Claude Code 호환용 변환 문서 및 로컬 설정 파일
├── agy/                    # Antigravity 호환용 AGENTS.md 통합 규격 파일
│   ├── AGENTS.md           # 메인 컨텍스트 (시스템 가이드 및 에이전트/스킬 목록)
│   └── .agent/
│       ├── skills/         # 검증 및 가드레일 스킬 마크다운 파일 (.md)
│       └── rules/          # 에이전트용 가이드라인 복제본
└── shared/
    └── q_신뢰도.csv        # 실수 아카이빙 DB (날짜, 심각도, 티켓번호, 실수내용, 개선방안 등)
```

---

## 3. 에이전트 역할 및 권한 체계 (Agent Orchestration)

에이전트는 권한 최소 부여 원칙(Principle of Least Privilege)을 준수하며, 역할별로 실행 가능한 파일 접근 및 커맨드가 엄격히 통제됩니다.

- **planner (Read 전용)**
  - **역할**: 접수된 작업의 범위를 분석하여 구체적이고 누락 없는 구현 계획(`checklist.md`) 수립.
  - **트리거**: 티켓 작업 또는 인프라 변경 요청 접수 시.
- **builder (Write 가능)**
  - **역할**: 실제 HCL(Terraform/OpenTofu) 및 YAML 설정 코드를 작성, 편집 및 수정.
  - **트리거**: 작업 계획 승인 및 리소스 추가/변경 단계 시작 시.
- **qa (Read & CMD 실행)**
  - **역할**: 코드 린트 검증 및 `tofu plan` 결과를 분석해 규격 및 보안성 위배 검토.
  - **트리거**: 코드 수정 완료 후, 또는 `tofu plan` 수행 완료 시.
- **log-search (Read 전용)**
  - **역할**: 에러 발생 시 CloudWatch 로그 데이터를 분석하여 장애의 원인을 식별 및 리포트.
  - **트리거**: 인프라 장애 발생 및 에러 로그 역추적 요청 시.
- **script-builder (Write 가능)**
  - **역할**: 작업 효율화 및 배포 보조용 Python/Shell 스크립트 작성.
  - **트리거**: 관리 작업 자동화 스크립트 생성 필요시.
- **script-reviewer (Read 전용)**
  - **역할**: 스크립트의 무결성, 보안성 및 품질(패턴 준수 여부) 검수.
  - **트리거**: 스크립트 코드 생성 완료 및 리뷰 요청 시.

---

## 4. 자동 검증 파이프라인 (Auto Chaining Engine)

코드가 작성된 시점부터 최종 승인 단계까지 자동 검증 훅과 에이전트가 끊김 없이 연속 호출되는 파이프라인을 운영합니다.

```plain text
[Builder 완료] ──> tf-auto-hook (fmt, validate)
                        │
                        ├─ (FAIL) ─> Builder로 재루팅 (최대 2회)
                        └─ (PASS) ─> [QA 자동 호출] (보안/정책 정적 검증)
                                          │
                                          ├─ (FAIL) ─> Builder로 재루팅
                                          └─ (PASS) ─> [tofu plan 자동 실행]
                                                            │
                                                            └─> tf-plan-check (Destroy/Replace 위험 체크)
                                                                     │
                                                                     └─> [사용자 승인 대기]
```

---

## 5. 절대 가드레일 (Safety Guardrails)

하네스의 안전을 지탱하는 이중의 통제 가드레일입니다.

### ① 환경-프로필 가드 (env-profile-guard)
`tofu` 혹은 `terraform` 관련 모든 인프라 조회/반영 명령어 실행 직전 강제로 트리거되는 검증 스킬입니다.
1. **환경 식별**: 현재 명령어가 실행되는 디렉토리 경로 상에서 대상 환경(`01_dev`, `02_qa`, `03_prd`)을 감지합니다.
2. **교차 검증**: `provider.tf` 내부의 `profile` 명칭 및 `backend`의 S3 백엔드 버킷명이 매핑 테이블과 일치하는지 대조합니다.
3. **AWS STS 검증**: `aws sts get-caller-identity` 결과를 활용하여 실제 기기 로컬에 적용된 Active AWS Profile 계정 ID와 대상 환경 계정 ID가 일치하는지 최종 확인합니다.
4. **차단**: 단 하나의 항목이라도 불일치할 경우 즉시 동작을 정지시키고 쉘 명령 실행을 무산시킵니다.

### ② 위험 명령어 원천 금지
에이전트가 직접 상태 변경 및 리소스 파괴 명령(`tofu apply`, `terraform apply`, `tofu destroy`, `rm -rf`)을 호출하는 것을 원천 금지합니다. 에이전트는 안전 검증 완료 후, 사용자가 실행해야 할 정확한 명령어(CLI 명령문)를 화면에 가이드한 뒤 작업을 멈춥니다.

---

## 6. 자가 학습 시스템 (Instinct Engine)

장애나 실수 이력을 기반으로 지속해서 진화하는 규칙 기반 자가 학습 모듈입니다.

```plain text
실수 발생 ──> csv 자동 기록 (Instinct)
                  │
                  ▼ (동일 카테고리 3회 누적)
              진화 규칙 자동 생성 및 제안 (Candidate)
                  │
                  ▼ (사용자 승인)
              기존 스킬 규칙에 영구 반영 (Skill)
                  │
                  ▼ (30일간 비활성 시 제거 검토)
              정리 대상 등록 (Prune)
```

### ① 자동 기록 (Stage 1: Instinct)
- **수집**: `QA FAIL`, `tofu plan 에러`, `tf-auto-hook 실패` 이벤트 발생 시 오류 패턴을 캡처합니다.
- **기록**: `q_신뢰도.csv` 데이터베이스에 행을 추가합니다.
  - *Schema*: `날짜, 심각도, 티켓번호, 작업항목, 실수내용, 원인분석, 개선방안, 상태`
  - *상태값*: `active` (활성) | `candidate` (후보) | `promoted` (승격 완료) | `pruned` (정리 완료)

### ② 승격 후보 제안 (Stage 2: Candidate)
- **감지**: csv 스캔 결과 동일 카테고리 실수가 **3회 이상** 누적되면 에이전트가 이를 방어하기 위한 린트 규칙(Lint Rule)이나 가이드를 코드로 자동 생성합니다.
- **피드백**: 사용자에게 승격 여부를 묻는 진화 제안창을 노출합니다.

### ③ 영구 반영 및 최적화 (Stage 3 & 4: Skill & Prune)
- **승격**: 사용자 승인 시 해당 스키마와 규칙을 `tf-file-review` 또는 `tf-auto-hook` 스킬에 영구 코드로 병합(Merge)하고 csv 상태를 `promoted`로 변경합니다.
- **정리**: 승격된 검증 규칙이 30일 동안 한 번도 작동하지 않아 불필요해진 경우, 사용자에게 정리를 제안하여 파이프라인의 군더더기를 방지합니다.

---

## 7. 운영 준수 규칙 (Ponytail Rules)

"지혜롭게 게으른 엔지니어" 모드를 실현하여 코드 유지보수 복잡성을 낮추기 위한 개발 프레임워크입니다.
1. **YAGNI**: 요청되지 않은 과도한 아키텍처 추상화 배제
2. **최소의 코드 차이 (Shortest Working Diff)**: 가장 적은 라인 수정 및 간결성 추구
3. **코드 삭제 지향**: 불필요한 보일러플레이트와 불필요 모듈 즉시 삭제
