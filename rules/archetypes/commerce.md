# Archetype Pack — Commerce

**Version:** v1.13.0 · **Archetype:** `commerce` · **Matrix:** [applicability.md](../applicability.md)

Product listings, PDPs, cart, checkout. Conversion-critical, payment-sensitive.

---

## Default modules (load after HIG-QUICK)

| Module | Why |
| --- | --- |
| [ux.md](../ux.md) | URL-as-state, unsaved-changes (checkout), navigation |
| [states.md](../states.md) | Error, empty, loading taxonomies |
| [forms.md](../forms.md) | Checkout, address, payment fields |
| [tokens.md](../tokens.md) | Design tokens (universal) |
| [responsive.md](../responsive.md) | PDP layout, cart responsive |
| [animation.md](../animation.md) | Micro-feedback for cart actions |
| [architecture.md](../architecture.md) | Dynamic product views, streaming |
| [mutations.md](../mutations.md) | Cart mutations, idempotency for payments |
| [search.md](../search.md) | Product search, facets |
| [notifications.md](../notifications.md) | Cart toasts, order confirmations |
| [accessibility.md](../accessibility.md) | WCAG 2.2 AA (universal) |
| [performance.md](../performance.md) | LCP on PDP, conversion impact |
| [security.md](../security.md) | PII, cookies, CSP (critical for checkout) |

## Conditional modules (load when feature exists)

| Module | When |
| --- | --- |
| [i18n.md](../i18n.md) | Multi-currency, multi-locale storefront |

## Skip unless explicitly needed

`data-density`, `ai-enforcement`

## Mandatory rule IDs

All content defaults **plus:** HIG-SSR-001–003, HIG-MUT-001, HIG-MUT-002, HIG-ERR-001, HIG-EMP-001, HIG-LOD-001, HIG-FRM-001, HIG-NTF-001, HIG-SEC-004

## Typical tasks

| Task | Additional modules |
| --- | --- |
| Checkout flow | forms, mutations, security |
| Product filters/facets | search, ux (URL sync) |
| Cart optimistic updates | mutations, states |
