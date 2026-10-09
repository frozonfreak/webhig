---
applyTo: "**/*.{css,scss,less,html,js,jsx,ts,tsx,vue,svelte,astro,mdx}"
---

# The Web HIG — path-specific Copilot instructions

Follow The Web HIG v1.13.0 on UI and front-end files.

- **Quick Reference:** `docs/hig/HIG-QUICK.md` (Layer 1) — *Follow The Web HIG Quick Reference.* Do not load full HIG unless needed.
- **Practical guide:** `docs/hig/HIG-LITE.md` + `docs/hig/rules/manifest.yaml` (Layer 2) — load matching `rules/*.md` on topic match; `framework/*.md` when stack-specific
- **Full spec:** `docs/hig/HIG.md` (Layer 3) — edge cases only
- **Archetype map:** `docs/hig-scope.md`

## Workflow

1. Resolve page archetype first; for **content**, resolve **surface** (`document` | `hybrid` | `experience`) from scope (**HIG-EXP-001**), then apply Layer 0 matrix (`rules/applicability.md`).
2. Read HIG-QUICK for the 98-rule Quick Reference; open HIG-LITE when you need rule IDs; cite rule IDs on conflicts.
3. Load archetype pack (`rules/archetypes/<archetype>.md`) → preload default modules.
4. Match task keywords against manifest.yaml → open referenced `rules/*.md` module.

## Essential rules (from HIG-LITE)

- Use design tokens only (no raw hex outside token files) — HIG-TOK-001
- Application-authored CSS MUST NOT use `transition: all`. Micro-feedback ≤300ms; prefer `transform`/`opacity`; functional not decorative — HIG-MOT-001, HIG-MOT-004
- Prefer `@container` for component-internal layout (**HIG-CQ-001**, warning); must use when multi-context reuse breaks on viewport MQ (**HIG-CQ-002**, error); `@media` for page, environment, preferences — do not add containers only for CQ (**HIG-SIM-001**)
- Content **hybrid** / **experience** surfaces: parity, nav escape hatch, motion tiers — **HIG-EXP-001**–**014** (`docs/hig/rules/expressive-surface.md`)
- Use logical properties (`margin-inline`, `inset-inline-start`, etc.) — HIG-UX-001
- Respect `prefers-reduced-motion` (mandatory HIG requirement) — HIG-A11Y-001
- Default to server rendering; add client interactivity only for state/effects/listeners — HIG-SSR-001
- Slow async server regions SHOULD have streaming boundaries with layout-matching skeletons — HIG-SSR-002
- Server mutation forms MUST expose pending UI — HIG-SSR-003
- WCAG 2.2 AA conformance (reference official spec, do not redefine criteria) — HIG-A11Y-002
- Prefer native HTML over ARIA; accessible names from visible text first, verified against the browser accessibility tree (platform AccName) — HIG-A11Y-003
- Icon buttons need accessible names; images need `alt`; visible focus; min 24×24px targets (44px preferred for touch) — HIG-A11Y-004–007
- Modals MUST implement actual focus containment (not just `aria-modal`) — HIG-A11Y-008
- Destructive mutations MUST NOT use optimistic confirmation without undo/soft-delete — HIG-MUT-001
- Prefer the simplest compliant implementation — HIG-SIM-001
