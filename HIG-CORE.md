# The Web HIG — Core (Level 0)

**Version:** v1.13.0 · **Quick Reference:** [HIG-QUICK.md](./HIG-QUICK.md) · **Practical:** [HIG-LITE.md](./HIG-LITE.md) · **Full spec:** [HIG.md](./HIG.md)

Session preamble: philosophy, vocabulary, archetype resolution, and simplicity rule. Load once per session alongside Layer 1 Quick Reference.

---

## Purpose

The Web HIG is a **web engineering contract** — not a decorative style guide. Every requirement is testable by humans, linters, or CI where possible.

## Normative vocabulary (RFC 2119)

| Keyword | Meaning |
| --- | --- |
| **MUST** | Mandatory — non-compliance is a defect |
| **MUST NOT** | Prohibited |
| **SHOULD** | Default recommendation — deviate only with documented justification |
| **MAY** | Permitted |

## Archetypes and surfaces (resolve first)

Before applying any rule, identify the page **archetype**:

| Archetype | Examples |
| --- | --- |
| **Content / Marketing** | Landing, blog, docs, campaigns, portfolios, studio sites |
| **Commerce** | PDP, cart, checkout |
| **Application / Dashboard** | Authenticated tools, admin, workflows |
| **Auth / Account** | Sign-in, recovery, settings |

For **content** routes, also declare **surface** in product scope ([HIG-EXP-001](./rules/expressive-surface.md)):

| Surface | Meaning |
| --- | --- |
| **document** | Default — strict functional motion (**HIG-MOT-003**) |
| **hybrid** | Document spine + expressive regions → load [expressive-surface.md](./rules/expressive-surface.md) |
| **experience** | Motion/scroll/time as structure → load [expressive-surface.md](./rules/expressive-surface.md) |

Application, commerce checkout, and auth MUST use **document** surface.

Apply only the mandatory and conditional rules for that archetype ([HIG.md §0.2](./HIG.md#02-applicability-matrix)). Accessibility, tokens, and performance are **universal** — never optional.

## Simplicity rule

**HIG-SIM-001:** The simplest implementation that satisfies applicable HIG requirements MUST be preferred. Do not satisfy a rule by introducing unnecessary complexity (extra Suspense boundaries, containers, animations, ARIA, or client components).

## Three consumption layers

| Layer | File | When to load |
| --- | --- | --- |
| **1 — Quick Reference** | [HIG-QUICK.md](./HIG-QUICK.md) | **Default** for all UI/CSS/front-end work and AI agents (~5 min) |
| **2 — Practical** | [HIG-LITE.md](./HIG-LITE.md) + [rules/](./rules/) + [framework/](./framework/) | Building features — rule IDs, topic modules, archetype packs |
| **3 — Full specification** | [HIG.md](./HIG.md) | Edge cases, spec conflicts, CI gate definitions |

**Preamble:** `HIG-CORE.md` (this file) — session start, philosophy, archetype context.

**Archetype packs:** [rules/archetypes/](./rules/archetypes/) — preload default modules after archetype is resolved.

**Topic lookup:** [rules/manifest.yaml](./rules/manifest.yaml) — load matching `rules/*.md` when the task requires depth beyond HIG-LITE.

Every Quick and Lite rule maps to a canonical section in [HIG.md](./HIG.md) — not a separate standard.
