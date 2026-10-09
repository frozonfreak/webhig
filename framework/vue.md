# Vue Framework Adapter

**Version:** v1.13.0 · **Universal architecture:** [rules/architecture.md](../rules/architecture.md) · **Canonical spec:** [HIG.md §4.1](../HIG.md#41-server-driven--progressive-rendering-architecture)

> Framework-specific guidance for Vue 3 applications.

---

## Server-driven rendering

* Default to SSR for initial render when using a meta-framework (Nuxt) or custom SSR setup.
* Use `.client.vue` suffix or `<ClientOnly>` for components requiring browser APIs.
* Keep client islands small — only components needing reactivity, effects, or DOM listeners.

## Streaming boundaries

* Use Vue 3 `<Suspense>` with layout-matching skeleton fallbacks for slow async regions (**HIG-SSR-002**).

## Server mutations

* Form actions via server API routes or Nuxt server handlers.
* Forms MUST expose pending UI during submission (**HIG-SSR-003**).
* Optimistic updates only for reversible mutations; implement manually with rollback on failure.

## Accessibility

* Prefer native HTML; use Vue bindings on semantic elements.
* Never use `v-html` without sanitization — see [rules/security.md](../rules/security.md).
* Custom widgets MUST follow [rules/accessibility.md](../rules/accessibility.md) keyboard patterns.

## Styling

* Use design tokens; no raw hex outside token files (**HIG-TOK-001**).
* Prefer `@container` for component-internal layout (**HIG-CQ-001**); multi-context reuse (**HIG-CQ-002**).
* Respect `prefers-reduced-motion` (**HIG-A11Y-001**).

## Related

* [nuxt.md](./nuxt.md) — Nuxt-specific conventions
