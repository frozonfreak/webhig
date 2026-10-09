# Astro Framework Adapter

**Version:** v1.13.0 · **Universal architecture:** [rules/architecture.md](../rules/architecture.md) · **Canonical spec:** [HIG.md §4.1](../HIG.md#41-server-driven--progressive-rendering-architecture)

> Astro-specific conventions. Normative requirements remain in the universal architecture module.

---

## Islands architecture

* Default to `.astro` server components — zero JS shipped by default.
* Add interactivity via `client:*` directives only where needed:
  * `client:load` — immediate hydration (use sparingly)
  * `client:idle` — hydrate when browser idle
  * `client:visible` — hydrate when visible (preferred for below-fold widgets)
  * `client:media` — hydrate at breakpoint (page-level only)

## Server-first rendering

* Astro pages are server-rendered by default (**HIG-SSR-001**).
* Do not convert entire pages to client islands when server rendering suffices.

## Streaming

* Use slot streaming for slow async regions with skeleton fallbacks (**HIG-SSR-002**).

## Mutations

* Server endpoints for form mutations; island-level pending UI (**HIG-SSR-003**).
* Optimistic updates at island level only for reversible mutations.

## Content and SEO

* Astro excels at Content/Marketing archetype — implement full document fundamentals per [rules/ux.md](../rules/ux.md) §2.1.
* Static pages SHOULD still handle loading/error for dynamic islands.

## Styling

* Use design tokens in global CSS; `@container` per **HIG-CQ-001** / **HIG-CQ-002** (see [responsive.md](../rules/responsive.md)).
* Respect `prefers-reduced-motion` globally (**HIG-A11Y-001**).

## Performance

* Minimal JS by design — protect LCP and CLS budgets.
* Lazy-load images with explicit dimensions; avoid hydrating non-interactive content.
