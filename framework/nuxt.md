# Nuxt Framework Adapter

**Version:** v1.13.0 · **Base adapter:** [vue.md](./vue.md) · **Universal architecture:** [rules/architecture.md](../rules/architecture.md)

> Nuxt-specific conventions. Normative requirements remain in the universal architecture module.

---

## Rendering defaults

* Default to SSR/SSG for pages. Use `.client.vue` for browser-only interactivity.
* Use `<ClientOnly>` with skeleton fallback for client-only widgets.
* Leverage Nuxt server components where available for server-first data fetching.

## Data fetching

* Use `useAsyncData` / `useFetch` in setup for server-compatible data loading.
* Handle loading, error, and empty states per [rules/states.md](../rules/states.md) taxonomies.

## Forms and mutations

* Server routes (`server/api/`) for mutations; show pending UI on forms (**HIG-SSR-003**).
* Multi-step forms: preserve state between steps; auto-save drafts for long flows.

## SEO and document fundamentals

* Use `useHead` / `useSeoMeta` for title, description, Open Graph — see [rules/ux.md](../rules/ux.md) §2.1.
* Set `htmlAttrs: { lang, dir }` for i18n — see [rules/i18n.md](../rules/i18n.md).

## Performance

* Lazy-load heavy client components with `defineAsyncComponent`.
* Monitor client bundle; prefer server rendering for data-heavy views.
* Image optimization via `@nuxt/image` with intrinsic dimensions for CLS.

## Security

* Sanitize any `v-html` usage; configure CSP headers in production (**HIG-SEC-002**).
