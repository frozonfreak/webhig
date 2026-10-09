# Next.js Framework Adapter

**Version:** v1.13.0 · **Base adapter:** [react.md](./react.md) · **Universal architecture:** [rules/architecture.md](../rules/architecture.md)

> Next.js App Router specifics. Normative requirements remain in the universal architecture module.

---

## App Router defaults

* Use the App Router (`app/`) for new projects. Default to React Server Components in `app/` routes.
* Colocate `'use client'` at the smallest interactive leaf — buttons, inputs, widgets — not page wrappers.
* Use `loading.tsx` for route-level streaming boundaries with layout-matching skeletons.

## Data fetching

* Fetch in Server Components with async/await — no client-side fetch for initial page data.
* Use `fetch` caching and revalidation semantics intentionally; document stale-while-revalidate behavior per [rules/states.md](../rules/states.md).

## Server Actions

* Server Actions MUST show pending UI on forms (**HIG-SSR-003**).
* Use `useFormStatus` for submit button disabled/pending states.
* Destructive Server Actions MUST NOT use optimistic confirmation without undo (**HIG-MUT-001**).

## Images and fonts

* Use `next/image` with explicit dimensions for CLS safety.
* Use `next/font` with `display: swap` or `optional`.
* Do not lazy-load the LCP image candidate.

## Metadata

* Use the Metadata API for `<title>`, Open Graph, and canonical URLs — see [rules/ux.md](../rules/ux.md) §2.1.

## Performance

* Monitor bundle size per route; client components increase JS payload.
* Field INP and LCP are SLO targets — see [rules/performance.md](../rules/performance.md).
