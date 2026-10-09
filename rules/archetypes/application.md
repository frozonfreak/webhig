# Archetype Pack — Application / Dashboard

**Version:** v1.13.0 · **Archetype:** `application` · **Matrix:** [applicability.md](../applicability.md)

Authenticated tools, admin panels, data workflows. Write-heavy, state-heavy, RBAC-governed.

---

## Default modules (load after HIG-QUICK)

Load **all** topic modules except those marked conditional below:

| Module | Why |
| --- | --- |
| [ux.md](../ux.md) | Navigation, RBAC, destructive actions, URL-as-state |
| [states.md](../states.md) | Error, empty, loading, stale, offline |
| [forms.md](../forms.md) | Settings, data entry, multi-step workflows |
| [tokens.md](../tokens.md) | Design tokens (universal) |
| [responsive.md](../responsive.md) | Container queries for dense layouts |
| [data-density.md](../data-density.md) | Tables, dashboards, virtualization |
| [animation.md](../animation.md) | Functional micro-feedback only |
| [architecture.md](../architecture.md) | SSR, streaming, server mutations |
| [mutations.md](../mutations.md) | Optimistic UI, conflicts, idempotency |
| [search.md](../search.md) | Global search, filters |
| [notifications.md](../notifications.md) | Toasts, banners, inline status |
| [accessibility.md](../accessibility.md) | WCAG 2.2 AA + browser permissions |
| [performance.md](../performance.md) | Bundle budgets, virtualization thresholds |
| [security.md](../security.md) | RBAC, audit logging, PII |
| [ai-enforcement.md](../ai-enforcement.md) | CI gates, linter rules |

## Conditional modules (load when feature exists)

| Module | When |
| --- | --- |
| [i18n.md](../i18n.md) | Multi-locale admin or user-facing app |

## Framework adapter

Load matching [framework/*.md](../../framework/) when stack-specific (React, Next, Vue, Nuxt, Astro).

## Mandatory rule IDs

Full Layer 7 set for application archetype — see [INDEX.md](../INDEX.md). Key additions beyond universal: HIG-SSR-001–003, HIG-MUT-001, HIG-MUT-002, HIG-ERR/EMP/LOD-001, HIG-FRM-001, HIG-NTF-001

## Typical tasks

| Task | Focus modules |
| --- | --- |
| Data table with bulk actions | data-density, accessibility, states |
| Accessible combobox | accessibility |
| Server mutation form | architecture, forms, mutations, states |
| Offline-capable workflow | states, architecture, mutations |
