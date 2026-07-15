---
title: "🦊 Technical Architecture and Operational Standards of Q-SE Harness"
description: "Architectural specification, safety guardrails, and self-learning engine mechanics of Q-SE Harness, a specialized IaC agent harness for secure Terraform and OpenTofu resource management."
pubDate: "2026-06-02"
heroImage: ""
categories: ["Infrastructure", "Terraform", "Security"]
---

This is the integrated technical specification sheet for **Q-SE Harness**, a specialized Infrastructure as Code (IaC) agent harness designed to securely and consistently manage AWS infrastructure resources via Terraform and OpenTofu. This harness features ticket-based task management, automated verification chaining, real-time guardrails, and a self-evolving instinct learning engine.

---

## 1. Technical Architecture

Each component of the Q-SE Harness operates organically. Real-time verification hooks and the self-learning module intervene at every infrastructure change step to guarantee stability.

```mermaid
graph TD
    User([User Request / Ticket]) --> Planner[Planner Agent]
    Planner -->|Create Checklist| Builder[Builder Agent]
    
    subgraph Verification Loop (Max 2 Turns)
        Builder -->|TF/YAML Done| AutoHook[tf-auto-hook]
        AutoHook -->|Lint/Validate PASS| QA[QA Agent]
        QA -->|FAIL: Request Rewrite| Builder
    end
    
    QA -->|PASS| Plan[Run tofu plan]
    Plan -->|Success| PlanCheck[tf-plan-check]
    PlanCheck -->|Safety PASS| Approval[Await User Approval]
    
    subgraph Self-Learning System (Instinct)
        QA -->|Log FAIL| AutoLearn[auto-learn]
        Plan -->|Log Error| AutoLearn
        AutoLearn -->|Save Error Patterns| ReliabilityDB[(q_reliability.csv)]
        ReliabilityDB -->|Pre-alarm Feedback| Planner
    end
    
    subgraph Real-time Guardrails (Guardrail)
        TofuCmd[tofu / terraform command] --> ProfileGuard[env-profile-guard]
        ProfileGuard -->|Env-Profile Mismatch| Abort[Abort Immediately & Alarm]
    end
```

---

## 2. Project Directory and Platform Specification

The harness is designed to maintain consistent verification policies across various development tools and platform environments (Kiro, Claude Code, and Antigravity).

### Deployment Configuration by Platform

| Platform | Target Directory | Installation & Application Method |
| :--- | :--- | :--- |
| **Kiro CLI** | `kiro/` | Copy agents (JSON), prompts, guides, and skills into the `.kiro/` folder. |
| **Claude Code** | `claude/` | Inject core guides into `CLAUDE.md` and apply skills under `.claude/`. |
| **Antigravity** | `agy/` | Define integration rules and agents in the `AGENTS.md` file, and mount the skill library in `.agents/`. |

### Detailed Directory Structure
```plain text
q-se-harness/
├── README.md
├── install.sh              # Script to automatically transplant agent rules via platform parameters
├── kiro/                   # Original Kiro CLI configuration (steering, agents, prompts, skills, guides)
├── claude/                 # Conversion documents and local configurations for Claude Code compatibility
├── agy/                    # Antigravity compatible AGENTS.md integrated specification file
│   ├── AGENTS.md           # Main context (system guides, agent, and skill lists)
│   └── .agent/
│       ├── skills/         # Markdown verification and guardrail skill files (.md)
│       └── rules/          # Duplicate guidelines for agents
└── shared/
    └── q_reliability.csv  # Mistake archiving database (date, severity, ticket number, etc.)
```

---

## 3. Agent Roles and Permission Architecture

Agents adhere to the Principle of Least Privilege, and file access and command execution are strictly controlled by role.

- **planner (Read-only)**
  - **Role**: Analyzes the scope of incoming requests to establish a concrete, exhaustive implementation plan (`checklist.md`).
  - **Trigger**: Triggered upon receipt of a ticket task or infrastructure change request.
- **builder (Write allowed)**
  - **Role**: Writes, edits, and modifies the actual HCL (Terraform/OpenTofu) and YAML configuration codes.
  - **Trigger**: Triggered upon approval of the task plan or start of the resource addition/modification step.
- **qa (Read & CMD execution)**
  - **Role**: Runs code linting and validates `tofu plan` results to check for policy and security violations.
  - **Trigger**: Triggered after code edits are completed or after `tofu plan` execution is finished.
- **log-search (Read-only)**
  - **Role**: Analyzes CloudWatch log data during errors to identify and report the root causes.
  - **Trigger**: Triggered upon infrastructure failures and error log traceback requests.
- **script-builder (Write allowed)**
  - **Role**: Writes Python or Shell scripts to assist with task automation and deployments.
  - **Trigger**: Triggered when automation scripts are needed.
- **script-reviewer (Read-only)**
  - **Role**: Reviews scripts for integrity, security, and quality (adherence to patterns).
  - **Trigger**: Triggered upon completion of script generation and request for review.

---

## 4. Automated Verification Pipeline (Auto Chaining Engine)

```plain text
[Builder Done] ──> tf-auto-hook (fmt, validate)
                        │
                        ├─ (FAIL) ─> Reroute to Builder (Max 2 Turns)
                        └─ (PASS) ─> [Auto Call QA] (Security/Policy Static Verification)
                                          │
                                          ├─ (FAIL) ─> Reroute to Builder
                                          └─ (PASS) ─> [Auto Run tofu plan]
                                                            │
                                                            └─> tf-plan-check (Destroy/Replace Risk Check)
                                                                     │
                                                                     └─> [Await User Approval]
```

---

## 5. Absolute Safety Guardrails

Double-layered control guardrails that anchor the safety of the harness.

### ① Environment-Profile Guard (env-profile-guard)
A mandatory verification skill triggered immediately prior to executing any command associated with `tofu` or `terraform`.
1. **Identify Environment**: Detects the target environment (`01_dev`, `02_qa`, `03_prd`) from the execution directory path.
2. **Cross-Validation**: Compares the `profile` name inside `provider.tf` and the S3 backend database bucket name against the mapping table.
3. **AWS STS Verification**: Utilizes `aws sts get-caller-identity` to finally verify that the local active AWS Profile account ID matches the target environment's account ID.
4. **Block**: Instantly aborts operation and blocks command execution if a single item mismatches.

### ② Total Prohibition of Destructive Commands
Completely prohibits the agent from directly executing state-modifying or destructive commands (`tofu apply`, `terraform apply`, `tofu destroy`, `rm -rf`). Once safety validation passes, the agent displays the exact command to be executed by the user and immediately halts execution to wait for user intervention.

---

## 6. Self-Learning System (Instinct Engine)

A rule-based self-learning module that continuously evolves based on failures or mistake history.

```plain text
Error Occurs ──> Auto Log to CSV (Instinct)
                  │
                  ▼ (3 Occurrences of Same Category)
              Auto Generate & Suggest Evolution Rule (Candidate)
                  │
                  ▼ (User Approval)
              Permanently Apply to Existing Skill Rule (Skill)
                  │
                  ▼ (Review for Removal if Inactive for 30 Days)
              Register for Pruning (Prune)
```

### ① Auto Logging (Stage 1: Instinct)
- **Collection**: Captures error patterns upon `QA FAIL`, `tofu plan` errors, or `tf-auto-hook` failures.
- **Logging**: Appends a row to the `q_reliability.csv` database.
  - *Schema*: `Date, Severity, Ticket Number, Task Item, Mistake Details, Root Cause, Remediation Plan, Status`
  - *Status Values*: `active` (Active) | `candidate` (Candidate) | `promoted` (Promoted) | `pruned` (Pruned)

### ② Promoting Candidates (Stage 2: Candidate)
- **Detection**: If the same mistake category accumulates **3 or more** times, the agent automatically generates a lint rule or guidance to defend against it.
- **Feedback**: Displays a promotion proposal prompt to the user to decide whether to officially promote the rule.

### ③ Permanent Application and Optimization (Stages 3 & 4: Skill & Prune)
- **Promotion**: Upon user approval, merges the generated schema/rules into `tf-file-review` or `tf-auto-hook` skills as permanent code and changes the CSV row status to `promoted`.
- **Pruning**: If a promoted rule is not triggered once for 30 days, proposes its removal to prevent bloating the pipeline.

---

## 7. Operational Adherence Rules (Ponytail Rules)

Developer framework designed to lower maintenance complexity and realize "wisely lazy engineering" mode:
1. **YAGNI**: Reject premature architecture abstractions unless requested.
2. **Shortest Working Diff**: Seek minimal lines of change and simplicity.
3. **Deletions-First**: Proactively delete redundant boilerplates and unused modules.
