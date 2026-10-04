---
title: "The Web HIG: a versioned behavioral contract for humans, CI, and AI agents"
published: false
description: "Design systems define what UI looks like. The Web HIG defines how it behaves — 98 pin-able rules, stable IDs, and agent templates without swapping your stack."
tags: webdev, ai, accessibility, ux, opensource
cover_image:
canonical_url: https://github.com/frozonfreak/webhig
---

Your design system probably nails color, type, and button variants. WCAG covers accessibility conformance. Your framework docs cover routing and data fetching.

Then you ask an AI agent to “add a delete project flow,” and you get a modal that optimistically removes the row, no focus trap, hex colors sprinkled in the CSS, and a toast that says “Success!” without telling anyone *what* succeeded.

That gap — **portable, testable product behavior** — is what [The Web HIG](https://github.com/frozonfreak/webhig) is for.

## Not a component library

The Web HIG is an open, MIT-licensed **behavioral standard** for the modern web:

- Vendor-neutral requirements for interaction, states, tokens, motion, performance, and security UX
- Stable rule IDs (`HIG-A11Y-003`, `HIG-MUT-001`, …) you can cite in PRs, audits, and agent prompts
- Progressive disclosure: a ~5 minute quick reference, practical modules, and a full normative spec

You keep MUI, shadcn, Tailwind, or a home-grown token file. You keep React, Vue, or Astro. The HIG does not replace WCAG or HTML — it sits **between** your design system and application code, the way a platform HIG does, but for the web and without locking you to one vendor.

> **Design systems define *what* it looks like.** **The Web HIG defines *how* it behaves.**

Current release: **v1.12.5**. [Quick Reference](https://github.com/frozonfreak/webhig/blob/main/HIG-QUICK.md) · [Live demo](https://hig.aruviflow.com/) · [Documentation site](https://frozonfreak.github.io/webhig/)

## Why “just use a checklist” fails at scale

Informal checklists and blog posts help once. They do not:

- Pin **semver** when you upgrade the contract across repos
- Map rules to **CI severity** (block vs warn vs observe)
- Compose cleanly with **agent context windows** (load topics on demand, not a 200-page PDF)

The Web HIG is built for **testable behavior**: RFC 2119 vocabulary in the full spec, Layer 8 gate classes for automation, and a manifest ([`rules/manifest.yaml`](https://github.com/frozonfreak/webhig/blob/main/rules/manifest.yaml)) so tools (and agents) can load only the module they need — forms, mutations, accessibility, and so on.

## One standard, three levels

You do not have to read everything on day one.

| Level | Document | When |
| --- | --- | --- |
| **Quick** | [HIG-QUICK.md](https://github.com/frozonfreak/webhig/blob/main/HIG-QUICK.md) — 98 rules | Daily work, agents, PR review |
| **Practical** | [HIG-LITE.md](https://github.com/frozonfreak/webhig/blob/main/HIG-LITE.md) + `rules/` | Features — IDs, modules, archetypes |
| **Full** | [HIG.md](https://github.com/frozonfreak/webhig/blob/main/HIG.md) | Edge cases, CI gates, disputes |

Same rule IDs at every layer. Escalate only when you need to.

## Scope before rules (Layer 0)

Not every rule applies to every page. Before enforcing anything, resolve a **page archetype**:

- `content` — marketing, docs, blog (plus **surface**: `document` · `hybrid` · `experience` for expressive pages)
- `commerce` — catalog, cart, checkout
- `application` — dashboards, settings, tools
- `auth` — login, signup, account recovery

A landing page should not inherit the same mutation and streaming defaults as a logged-in app shell. Archetypes keep agents and humans from “HIG-maximalism” on simple routes. v1.10 adds an **expressive surface baseline** (`HIG-EXP-*`) for portfolio and campaign-style content without weakening document or app routes.

## Rules agents (and reviewers) can actually cite

Quick Reference rules are imperative and short. A few that show up constantly in AI-generated UI:

**States & feedback**

- Every async operation needs idle, loading, success, error, or empty — never a blank screen while data loads.
- Error copy must say what failed and how to recover, not “Something went wrong.”

**Destructive actions**

- Confirmation must match severity; irreversible deletes need intentional multi-step confirmation.
- **Never** use optimistic UI for destructive confirmation — wait for server acknowledgment (`HIG-MUT-001` territory).

**Accessibility & tokens**

- Prefer native HTML over ARIA when the platform already gives you the behavior.
- No raw hex in application CSS — semantic or component tokens only.
- Respect `prefers-reduced-motion`; cap decorative micro-motion.

When you push back on a shortcut, citing `HIG-MUT-001` or `HIG-A11Y-003` is clearer than “our team doesn’t like that.”

## Where it sits in your stack

```
┌──────────────────────────────────────┐
│  HTML, CSS, ARIA (platform)          │
└──────────────────┬───────────────────┘
                   │
┌──────────────────▼───────────────────┐
│  WCAG 2.2 (accessibility target)     │
└──────────────────┬───────────────────┘
                   │
┌──────────────────▼───────────────────┐
│  Your design system (visual language)│
└──────────────────┬───────────────────┘
                   │
┌──────────────────▼───────────────────┐
│  The Web HIG (behavior & enforcement)│
└──────────────────┬───────────────────┘
                   │
┌──────────────────▼───────────────────┐
│  Your product code                   │
└──────────────────────────────────────┘
```

More background: [RATIONALE.md](https://github.com/frozonfreak/webhig/blob/main/RATIONALE.md).

## Built for the AI-assisted workflow

A typical loop:

```
Developer → pinned HIG → AI agent → code → review → CI
```

Pin **`HIG-QUICK.md`** (and optionally **`HIG-CORE.md`**) under something like `docs/hig/`. Add a scope file that maps routes to archetypes. Drop in one agent rule file:

| Tool | Template in repo |
| --- | --- |
| Cursor | `examples/agent-rules/cursor-hig.mdc` |
| Claude Code | `examples/agent-rules/CLAUDE-hig.md` |
| GitHub Copilot | `examples/agent-rules/copilot-instructions-hig.md` |
| Multi-agent | `examples/agent-rules/AGENTS-hig.md` |

**Default agent prompt:** *“Follow The Web HIG Quick Reference.”*

Human prompt with teeth:

> Build a delete-project dialog for `/app/projects`. Archetype: application. Follow The Web HIG Quick Reference; cite rule IDs if you decline a pattern.

You should see citations like `HIG-MUT-001`, `HIG-A11Y-008`, and `HIG-A11Y-004` instead of vibes-based UX.

## Try it in one afternoon

1. **Pin** — copy `VERSION`, `HIG-QUICK.md`, and optional `HIG-CORE.md` to `docs/hig/` ([profiles guide](https://github.com/frozonfreak/webhig/blob/main/PROFILES.md)).
2. **Scope** — adapt [`examples/hig-scope.example.md`](https://github.com/frozonfreak/webhig/blob/main/examples/hig-scope.example.md) to `docs/hig-scope.md`.
3. **Agents** — one file from [`examples/agent-rules/`](https://github.com/frozonfreak/webhig/tree/main/examples/agent-rules).
4. **Upgrade safely** — vendor the repo and run `npm run validate` when you bump the pinned version.

Walkthrough: [quick-profile walkthrough](https://github.com/frozonfreak/webhig/blob/main/examples/adoption/quick-profile-walkthrough.md).  
Team adoption: [INTEGRATION.md](https://github.com/frozonfreak/webhig/blob/main/INTEGRATION.md).

Minimal PR checklist once the HIG is pinned:

- [ ] Archetype noted in the PR description  
- [ ] No raw hex in component CSS  
- [ ] Destructive actions use proportional confirmation, not optimistic delete  
- [ ] Visible focus on interactive controls  

## What’s inside (v1.9.0 snapshot)

- **98** quick rules  
- **16** topic modules (forms, mutations, performance, security UX, …)  
- **4** page archetypes  
- Layers covering applicability, UX, IA, tokens, server-driven UI, a11y, perf, CI gates, and security UX  

Index: [SPECIFICATION.md](https://github.com/frozonfreak/webhig/blob/main/SPECIFICATION.md).  
Roadmap for machine-readable registries and linters: [MACHINE_READABLE.md](https://github.com/frozonfreak/webhig/blob/main/MACHINE_READABLE.md).

## Open standard, your stack

The Web HIG is deliberately **adopt, don’t rewrite**: pin the contract, wire your agents, optionally gate CI later. Framework notes live under [`framework/`](https://github.com/frozonfreak/webhig/tree/main/framework) (React, Next, Vue, Nuxt, Astro) without mandating any of them.

If you are standardizing how your team — and your coding agents — handle loading states, destructive flows, and token discipline, **[star or pin the repo](https://github.com/frozonfreak/webhig)** and tell us what you are building in [ADOPTERS.md](https://github.com/frozonfreak/webhig/blob/main/ADOPTERS.md) or a GitHub issue.

Contributions welcome: [CONTRIBUTING.md](https://github.com/frozonfreak/webhig/blob/main/CONTRIBUTING.md).

---

*Questions or adoption stories? Drop a comment — especially if you have wired this into CI or a custom agent rule set.*
