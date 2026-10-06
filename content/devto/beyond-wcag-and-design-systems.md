---
title: "WCAG + your design system still leave a hole — The Web HIG fills the behavioral gap"
published: false
description: "Accessibility conformance and visual tokens are necessary, not sufficient. The Web HIG is a vendor-neutral contract for loading states, destructive flows, motion, and agent enforcement."
tags: accessibility, ux, webdev, design, opensource
canonical_url: https://github.com/frozonfreak/webhig
---

Most mature teams already have two pillars:

1. **WCAG 2.2** — accessibility conformance target
2. **A design system** — color, type, components, brand

Ship a product and you still argue about:

- When is optimistic UI allowed?
- What must an empty state contain?
- How should destructive deletes confirm?
- Which motion is decorative vs required feedback?
- What should an AI agent refuse to generate?

Those are **behavioral** questions. Neither WCAG nor Material/shadcn/your Figma kit answers them as a **versioned, citeable contract**.

That is the hole [The Web HIG](https://github.com/frozonfreak/webhig?utm_source=blog&utm_medium=article&utm_campaign=share) fills.

## Where it sits

```
Platform (HTML / CSS / ARIA)
        ↓
WCAG 2.2 AA (accessibility target)
        ↓
Your design system (look)
        ↓
The Web HIG (behavior, states, perf, security UX, agents)
        ↓
Application code
```

HIG does **not** replace WCAG. Where they overlap (focus visibility, etc.), HIG points at the same bar. It does **not** replace your design system — no component library, no mandated CSS framework.

## What “behavioral” means in practice

Concrete domains covered by rule IDs and topic modules:

- Loading / empty / error / stale / offline taxonomies
- Forms and validation timing
- Mutations and destructive confirmation
- Search, notifications, data density
- Tokens (no raw hex in app CSS), container queries, motion budgets
- Expressive marketing surfaces (`HIG-EXP-*`) without breaking document routes
- Security & privacy UX (CSP posture, auth flows, PII)
- Agent enforcement severity and autofix safety

## Scope first (or you will over-apply)

Layer 0 defines archetypes: **content**, **commerce**, **application**, **auth**. A blog does not need the same mutation state machine as an admin dashboard. Product repos declare scope in something like `docs/hig-scope.md`, then pin a profile (Quick / Practical / Full) — see [PROFILES.md](https://github.com/frozonfreak/webhig/blob/main/PROFILES.md).

## Production use today

Teams can pin **v1.12.5** as an internal standard now:

```bash
npx @web-hig/install
```

Tooling includes `@web-hig/cli` (`check`, `explain`, `upgrade` pin report). Runtime audit and a full ESLint plugin are still maturing — the **contract** is ahead of the full linter suite, which is fine if you use Quick Reference + PR checklist while automation catches up.

## Start here

| Need | Link |
| --- | --- |
| 5-minute rules | [HIG-QUICK.md](https://github.com/frozonfreak/webhig/blob/main/HIG-QUICK.md) |
| Why it exists | [RATIONALE.md](https://github.com/frozonfreak/webhig/blob/main/RATIONALE.md) |
| Wire agents / CI | [INTEGRATION.md](https://github.com/frozonfreak/webhig/blob/main/INTEGRATION.md) |
| Live audit | [hig.aruviflow.com](https://hig.aruviflow.com/) |

[![The Web HIG](https://frozonfreak.github.io/webhig/badge.svg)](https://github.com/frozonfreak/webhig?utm_source=blog&utm_medium=badge&utm_campaign=share)

Open source (MIT). Adopt the behavior; keep the look.
