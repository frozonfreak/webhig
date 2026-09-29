---
title: "Stop dumping 200-page guidelines into your AI agent — pin The Web HIG Quick Reference"
published: false
description: "AI coding agents write UI at scale. Informal checklists do not. Here is how The Web HIG gives agents a versioned behavioral contract that fits a context window."
tags: ai, webdev, productivity, opensource, ux
canonical_url: https://github.com/frozonfreak/hig
---

AI coding agents are excellent at scaffolding screens. They are also excellent at inventing *different* loading states, confirmation patterns, and toast copy in every PR.

The usual fix is to paste a giant design-system PDF or an internal wiki into the prompt. That burns tokens, drifts across repos, and still does not give you a **citable rule ID** when the agent skips confirmation on delete.

[The Web HIG](https://github.com/frozonfreak/hig?utm_source=blog&utm_medium=article&utm_campaign=share) is built for that workflow.

## What to put in the agent context

Default load:

1. **[HIG-CORE.md](https://github.com/frozonfreak/hig/blob/main/HIG-CORE.md)** — philosophy, vocabulary, archetype resolution
2. **[HIG-QUICK.md](https://github.com/frozonfreak/hig/blob/main/HIG-QUICK.md)** — 98 imperative rules (~5 minutes)

Tell the agent:

> Follow The Web HIG Quick Reference. Resolve the page archetype first. Escalate to HIG-LITE only when the task needs rule IDs or topic modules.

Do **not** dump the full [HIG.md](https://github.com/frozonfreak/hig/blob/main/HIG.md) into every session. Layer 3 is for edge cases and CI gate disputes.

## Why this works better than a checklist gist

| Informal checklist | The Web HIG |
| --- | --- |
| No semver | Pin `v1.12.5` (or whatever you adopt) |
| No stable IDs | Cite `HIG-MUT-001`, `HIG-A11Y-003`, … |
| One blob of text | Load topics via [`rules/manifest.yaml`](https://github.com/frozonfreak/hig/blob/main/rules/manifest.yaml) |
| Same rules for blog and admin | Layer 0 archetypes: content / commerce / application / auth |

Agents get a **small default** and a **path to escalate**. Humans get the same language in PR review.

## Five-minute install

```bash
npx @web-hig/install
```

Or copy `HIG-QUICK.md` + `VERSION` into `docs/hig/` and add a one-line agent instruction in Cursor / Claude Code / Copilot / `AGENTS.md`. See [INTEGRATION.md](https://github.com/frozonfreak/hig/blob/main/INTEGRATION.md).

## What the agent should do before writing UI

1. Resolve **archetype** (and for content, **surface**: document / hybrid / experience)
2. Apply only mandatory + conditional rules for that archetype
3. Prefer the simplest compliant implementation (`HIG-SIM-001`)
4. Never optimistic-delete; wait for server ack on destructive mutations

## Try it

- Spec + Quick Reference: [github.com/frozonfreak/hig](https://github.com/frozonfreak/hig?utm_source=blog&utm_medium=article&utm_campaign=share)
- Docs: [frozonfreak.github.io/hig](https://frozonfreak.github.io/hig/)
- Audit an existing site: [hig.aruviflow.com](https://hig.aruviflow.com/)

MIT licensed. Keep your design system. Pin the behavior.

[![The Web HIG](https://frozonfreak.github.io/hig/badge.svg)](https://github.com/frozonfreak/hig?utm_source=blog&utm_medium=badge&utm_campaign=share)
