# AI & Agent Enforcement — Level 2 Module

**Version:** v1.20.0 · **Canonical spec:** [HIG.md §7–8](../HIG.md#layer-7-ai--agent-enforcement-contract) · **Rule ID:** HIG-SIM-001 + all Layer 7 IDs

> Standalone extract for progressive loading. The complete normative contract remains in [HIG.md](../HIG.md).

---

## Agent loading contract

1. **Layer 1 default:** [HIG-QUICK.md](../HIG-QUICK.md) for every UI task.
2. **Layer 2 on feature work:** [HIG-LITE.md](../HIG-LITE.md) + module from [manifest.yaml](./manifest.yaml).
3. **Layer 3 edge cases:** full [HIG.md](../HIG.md).
4. **Cite rule IDs** when declining conflicting requests.

## 7.1 Rule Schema

Every machine rule MUST include id, severity, requirement, archetypes, autofix safety, and exceptions.

Accessibility, forms, motion, and performance rules also carry consumption metadata: maturity, minimum browser target, fallback, automated checks, manual checks, and source date ([agent-consumption.yaml](./agent-consumption.yaml)). That record is packaging. It does not add a rule ID or a conformance score. A modern API is not a pass. See [HIG.md §7.1](../HIG.md#agent-consumption-metadata).

| Severity | CI behavior |
| --- | --- |
| `error` | Blocking — fails build/PR |
| `warning` | Advisory — reported, does not block |
| `info` | Observation — logged for tracking |

## 7.2 AI Coding Agent Guardrails

**HIG-SIM-001:** Prefer the simplest implementation that satisfies applicable HIG requirements.

Key enforceable rules (full YAML in [HIG.md §7.2](../HIG.md#72-ai-coding-agent-guardrails)):

| Prefix | Domain |
| --- | --- |
| HIG-DOC-* | Document fundamentals |
| HIG-SEO-* | SEO and share metadata |
| HIG-TOK-* | Design tokens |
| HIG-MOT-* | Motion and micro-animations |
| HIG-EXP-* | Expressive content surfaces (hybrid / experience) |
| HIG-CQ-* | Container queries |
| HIG-UX-* | Logical properties |
| HIG-A11Y-* | Accessibility |
| HIG-SSR-* | Server rendering |
| HIG-MUT-* | Mutations |
| HIG-ERR/EMP/LOD-* | State taxonomies |
| HIG-SRCH-* | Search |
| HIG-DEN-* | Data density |
| HIG-PERF-* | Performance |
| HIG-FRM-* | Forms |
| HIG-SEC-* | Security |

Copy-paste agent templates: [examples/agent-rules/](../examples/agent-rules/).

## 7.3 Programmatic Linter Specifications

Intended `eslint-plugin-hig` rules:

* `hig/enforce-container-queries`
* `hig/streaming-boundary`
* `hig/no-unlabeled-icon-buttons`
* `hig/micro-animation-budget`
* `hig/no-optimistic-destructive`
* `hig/no-transition-all`

## 7.4 Agent tool-schema review (informative)

Review validation against the current tool names and argument schemas before execution and after repair. Reject unknown/renamed tools and invalid arguments without side effects. A repair must stay within authorized intent and must not silently substitute a consequential action, target or scope; changed actions return to the existing confirmation flow. Record the original call, validation failure, repair and final execution/rejection with correlated, redacted evidence (§9.4).

For state-changing operations, verify the target before execution and the result after it. Resolve the target against live environment state at call time, not the model's description or a remembered identifier. Validate the object and scope, and ask for clarification when the reference is ambiguous. Treat remembered tool use (skills, persistent memory, earlier calls) as a hint and read the current definition first. After execution, read back the affected state and check the intended postcondition, not only the API success response. Report completion only when verified, and distinguish attempted, accepted, queued, and completed. Scale verification to consequence (**HIG-SIM-001**).

Test interface drift with renamed/removed tools, distractor candidates, schema changes and invalid repairs. Also test a silent change behind an unchanged success response, an ambiguous reference, a stale identifier, and an accepted-but-not-applied write. See [HIG.md §7.4](../HIG.md#74-agent-tool-schema-review-informative) for the complete review guidance. This does not add an automated website audit rule or require a repair layer.

## 7.5 User-visible agent control boundaries (informative)

A person who delegates work should be able to understand and control, in ordinary language: what the agent may do; which resources and accounts it can access; which actions need another approval; which actions can be reversed; whether it is executing, waiting, blocked, or finished; how to pause, cancel, or intervene; and what actually happened. Do not satisfy this with raw JSON schemas or model reasoning. Show the current scope and approval points before delegation, the effect of pause or cancellation during execution, and completed actions and remaining effects afterward. Use the state distinctions from §7.4. This is interaction review, not a website audit rule. The WebAgents Community Group report (23 November 2026) is background only. Do not adopt a protocol from it as a requirement. See [HIG.md §7.5](../HIG.md#75-user-visible-agent-control-boundaries-informative).

## 7.6 Generated drafts and records (informative)

Where model output can become a record someone relies on, keep the draft distinct from the verified record, keep source and provenance available where showing them is appropriate, and let a person review and correct the draft before a consequential commitment. Give control over source capture and retention in products that capture a source. Make cancellation stop pending work where possible and show any effects already applied. Apply deletion to the stated content and disclose retention limits. Recording controls from the 25 November 2026 care-work study are not universal requirements for every AI interface. See [HIG.md §7.6](../HIG.md#76-generated-drafts-and-records-informative).

## Layer 8: CI/CD Gates

| Level | Behavior | Examples |
| --- | --- | --- |
| **BLOCKING** | Fails build/PR | TypeScript errors, critical a11y, security, HIG MUST violations |
| **WARNING** | Reported, does not block | Performance regression, non-critical a11y |
| **OBSERVATION** | Logged for tracking | Stable field INP, field LCP, field CLS. Experimental CrUX soft-navigation variants are a separate series and are not a combined pass/fail. |

**Lab/CI blocking thresholds:**

* Synthetic interaction latency > 200 ms
* LCP > 2.5 s
* CLS > 0.10
* TTFB > 800 ms

Field INP is an SLO — not a deterministic CI gate from synthetic tests. Experimental soft-navigation LCP, INP, and CLS variants are observation-only and stay separate from the stable SLO. Long Animation Frames style and layout durations, when the browser exposes them, are diagnostic detail for that INP. They are not an additional threshold.

See [HIG.md §8](../HIG.md#layer-8-quality-assurance--cicd-gates) for the full CI pipeline diagram.

**Evaluator output:** Tools MUST emit multidimensional reports (severity buckets + dimensions + findings), not a single score alone — [EVALUATOR.md](../EVALUATOR.md), [evaluator-dimensions.yaml](./evaluator-dimensions.yaml).
