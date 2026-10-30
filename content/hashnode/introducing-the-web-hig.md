---
title: "Your design system covers the look. The Web HIG covers the behavior."
seoTitle: "The Web HIG: How Modern Web Interfaces Should Behave"
seoDescription: "The Web HIG is an open standard for how web interfaces behave: loading states, destructive actions, WCAG 2.2 AA, and rules AI coding agents can cite."
subtitle: "A versioned, vendor-neutral contract for loading states, destructive actions, accessibility, and the AI agents writing your UI."
slug: introducing-the-web-hig
tags: webdev, ai, accessibility, ux, opensource
coverImage: ./hashnode-cover-introducing-the-web-hig.png
isPublished: false
---

You ask a coding agent to add “delete project.” It ships a modal that removes the row before the server answers, traps no focus, drops a hex color into the stylesheet, and toasts “Success!” without saying what succeeded.

Your design system already decided the button radius. WCAG already decided the contrast ratio. Neither of them decided that flow.

That missing layer is [The Web HIG](https://github.com/frozonfreak/webhig?utm_source=hashnode&utm_medium=article&utm_campaign=share) (v1.16.0): an open, MIT-licensed standard for how a modern web interface should behave. You keep your components, your framework, and your visual language. You pin one version of the same rules, and you cite them with stable IDs such as `HIG-MUT-001` and `HIG-A11Y-003`. People, reviewers, CI, and agents are reading the same contract.

> Design systems define what the interface looks like. The Web HIG defines how it behaves.

## Where it sits in the stack

Each layer you already have still has a job. The Web HIG does not take any of them over.

| Layer | Owner | What it decides |
| --- | --- | --- |
| Platform | HTML, CSS, ARIA | What the browser can do |
| Accessibility | WCAG 2.2 AA | The conformance bar the HIG points at |
| Visual language | Your design system | Color, type, components, brand |
| **Behavior** | **The Web HIG** | States, mutations, tokens-in-use, motion, agent enforcement |
| Product | Your application | Routes, data, business logic |

A checklist can cover the behavior row once. It cannot tell two repositories which version is in force, it cannot map a rule to block / warn / observe in CI, and it cannot fit in an agent’s context window. The full spec uses RFC 2119 language. Layer 8 assigns gate classes. [`rules/manifest.yaml`](https://github.com/frozonfreak/webhig/blob/v1.16.0/rules/manifest.yaml) tells a tool to load forms, mutations, or accessibility instead of the entire standard. The reasoning is in [RATIONALE.md](https://github.com/frozonfreak/webhig/blob/v1.16.0/RATIONALE.md). The rendered docs are at [frozonfreak.github.io/webhig](https://frozonfreak.github.io/webhig/).

## How to read it

You do not open the whole specification on day one. Three documents describe the same contract at different depths. The two counts are intentional: Quick rules are short heuristics, and the 76 IDs are what you cite. [`rules/quick-rule-map.yaml`](https://github.com/frozonfreak/webhig/blob/v1.16.0/rules/quick-rule-map.yaml) links them. Open the next document only when the current one is not enough.

| When you are… | Open | What you get |
| --- | --- | --- |
| Writing code, prompting an agent, or reviewing a PR | [HIG-QUICK.md](https://github.com/frozonfreak/webhig/blob/v1.16.0/HIG-QUICK.md) | 98 imperatives, about five minutes |
| Building a feature or citing a requirement | [HIG-LITE.md](https://github.com/frozonfreak/webhig/blob/v1.16.0/HIG-LITE.md) and `rules/` | 76 stable `HIG-*` IDs, topic modules, archetypes |
| Settling an edge case, a CI gate, or a dispute | [HIG.md](https://github.com/frozonfreak/webhig/blob/v1.16.0/HIG.md) | The normative specification |

Before any of those rules apply, name the page. A landing page does not inherit the mutation and streaming defaults of a logged-in app shell.

| Archetype | Surfaces |
| --- | --- |
| **content** | Marketing, docs, blog. Also document, hybrid, or experience. Portfolio and campaign pages use the `HIG-EXP-*` baseline so they can move without weakening the others. |
| **commerce** | Catalog, cart, checkout |
| **application** | Dashboards, settings, tools |
| **auth** | Login, signup, account recovery |

These are the rules that show up constantly in generated UI. Citing the ID in a review is a shared reference. “I don’t love this” is a preference.

| If the change… | The expectation | Cite |
| --- | --- | --- |
| Loads or submits data | Idle, loading, success, error, or empty. The error names what failed and how to recover. | states rules in the Quick Reference |
| Deletes or destroys something | Confirmation matches severity. Irreversible deletes take an extra intentional step. The UI waits for the server. | `HIG-MUT-001` |
| Reaches for ARIA | Prefer the native control when HTML already provides the behavior. | `HIG-A11Y-003` |
| Adds color in component CSS | Semantic or component tokens. Raw hex stays in the token file. | `HIG-TOK-001` |
| Animates | Honor `prefers-reduced-motion`. | `HIG-A11Y-001`, `HIG-MOT-*` |
| Opens a dialog | Focus stays inside until it closes. An icon-only button has an accessible name. | `HIG-A11Y-008`, `HIG-A11Y-004` |

v1.16.0 is **98** Quick imperatives, **76** rule IDs, **17** topic modules, and **4** archetypes, across layers 0–9 (applicability, UX, information architecture, tokens, server-driven UI, accessibility, performance, agent guardrails, CI gates, and security UX). The index is [SPECIFICATION.md](https://github.com/frozonfreak/webhig/blob/v1.16.0/SPECIFICATION.md). Notes for React, Next, Vue, Nuxt, and Astro live under [`framework/`](https://github.com/frozonfreak/webhig/tree/v1.16.0/framework). None of them are required.

## Wire it up this afternoon

The loop is the same for a person and an agent: pin the HIG, generate the change, review it, then let CI see the same rules.

**1. Install the Quick profile.** This writes a version pin, `HIG-QUICK.md`, a scope file, and agent guidance for Cursor, Claude Code, GitHub Copilot, and Windsurf.

```bash
npx @web-hig/install
```

Add rule IDs and topic modules when you are past the first afternoon:

```bash
npx @web-hig/install --profile practical
```

**2. Map routes to archetypes.** Start from [`examples/hig-scope.example.md`](https://github.com/frozonfreak/webhig/blob/v1.16.0/examples/hig-scope.example.md) and save it as `docs/hig-scope.md`.

**3. Point the agent at the Quick Reference.** Templates are in [`examples/agent-rules/`](https://github.com/frozonfreak/webhig/tree/v1.16.0/examples/agent-rules). The skill is [`skills/web-hig`](https://github.com/frozonfreak/webhig/tree/v1.16.0/skills/web-hig). A prompt with enough context to cite rules:

```text
Build a delete-project dialog for /app/projects.
Archetype: application.
Follow The Web HIG Quick Reference.
Cite rule IDs if you decline a pattern.
```

You are looking for `HIG-MUT-001` on the delete, `HIG-A11Y-008` on focus inside the dialog, and `HIG-A11Y-004` on the icon button’s name.

**4. Review the next UI pull request against four checks.**

- [ ] The archetype is named in the description
- [ ] Component CSS has no raw hex
- [ ] Destructive actions wait for the server
- [ ] Interactive controls show a visible focus style

The longer path is the [quick-profile walkthrough](https://github.com/frozonfreak/webhig/blob/v1.16.0/examples/adoption/quick-profile-walkthrough.md), then [INTEGRATION.md](https://github.com/frozonfreak/webhig/blob/v1.16.0/INTEGRATION.md) for a team rollout. A copyable consumer layout is [`examples/golden-path`](https://github.com/frozonfreak/webhig/tree/v1.16.0/examples/golden-path).

If the site already exists, [HIG Audit](https://hig.aruviflow.com/) reads an implementation against the standard. The repository defines the rules. The auditor applies them. `web-hig check` can validate a pin today. A broader evaluator and lint rules are on the [roadmap](https://github.com/frozonfreak/webhig/blob/v1.16.0/ROADMAP.md). They are not implied by the version number.

## Adopt it without a rewrite

Pin the contract. Wire the agent. Add CI when a rule is worth gating. If that is the shared UX contract you want, star [frozonfreak/webhig](https://github.com/frozonfreak/webhig?utm_source=hashnode&utm_medium=article&utm_campaign=share) and add the project to [ADOPTERS.md](https://github.com/frozonfreak/webhig/blob/v1.16.0/ADOPTERS.md). Specification changes go through [CONTRIBUTING.md](https://github.com/frozonfreak/webhig/blob/v1.16.0/CONTRIBUTING.md).

[![The Web HIG](https://frozonfreak.github.io/webhig/badge.svg)](https://github.com/frozonfreak/webhig?utm_source=hashnode&utm_medium=badge&utm_campaign=share)

If you have already cited a rule ID in review or CI, say which one. Those are the useful stories.
