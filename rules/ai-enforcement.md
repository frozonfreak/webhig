# AI & Agent Enforcement — Level 2 Module

**Version:** v1.13.0 · **Canonical spec:** [HIG.md §7–8](../HIG.md#layer-7-ai--agent-enforcement-contract) · **Rule ID:** HIG-SIM-001 + all Layer 7 IDs

> Standalone extract for progressive loading. The complete normative contract remains in [HIG.md](../HIG.md).

---

## Agent loading contract

1. **Layer 1 default:** [HIG-QUICK.md](../HIG-QUICK.md) for every UI task.
2. **Layer 2 on feature work:** [HIG-LITE.md](../HIG-LITE.md) + module from [manifest.yaml](./manifest.yaml).
3. **Layer 3 edge cases:** full [HIG.md](../HIG.md).
4. **Cite rule IDs** when declining conflicting requests.

## 7.1 Rule Schema

Every machine rule MUST include id, severity, requirement, archetypes, autofix safety, and exceptions.

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

## Layer 8: CI/CD Gates

| Level | Behavior | Examples |
| --- | --- | --- |
| **BLOCKING** | Fails build/PR | TypeScript errors, critical a11y, security, HIG MUST violations |
| **WARNING** | Reported, does not block | Performance regression, non-critical a11y |
| **OBSERVATION** | Logged for tracking | Field INP, field LCP, field CLS |

**Lab/CI blocking thresholds:**

* Synthetic interaction latency > 200 ms
* LCP > 2.5 s
* CLS > 0.10
* TTFB > 800 ms

Field INP is an SLO — not a deterministic CI gate from synthetic tests.

See [HIG.md §8](../HIG.md#layer-8-quality-assurance--cicd-gates) for the full CI pipeline diagram.

**Evaluator output:** Tools MUST emit multidimensional reports (severity buckets + dimensions + findings), not a single score alone — [EVALUATOR.md](../EVALUATOR.md), [evaluator-dimensions.yaml](./evaluator-dimensions.yaml).
