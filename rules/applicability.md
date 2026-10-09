# Applicability & Scope — Level 2 Module

**Version:** v1.13.0 · **Canonical spec:** [HIG.md §0](../HIG.md#layer-0-applicability--scope) · **Archetype packs:** [archetypes/](./archetypes/)

> Resolve archetype **before** applying any other HIG rules. Load the matching archetype pack for default module set.

---

## 0.1 Page Archetypes

| Archetype | Examples | Pack file |
| --- | --- | --- |
| **Content / Marketing** | Landing pages, blogs, docs, campaigns | [archetypes/content.md](./archetypes/content.md) |
| **Commerce** | PDP, cart, checkout, product listings | [archetypes/commerce.md](./archetypes/commerce.md) |
| **Application / Dashboard** | Admin panels, authenticated tools, workflows | [archetypes/application.md](./archetypes/application.md) |
| **Auth / Account** | Sign-in, sign-up, recovery, settings | [archetypes/auth.md](./archetypes/auth.md) |

## 0.2 Applicability Matrix

| Capability | Content | Commerce | Application | Auth |
| --- | --- | --- | --- | --- |
| Layer 1 UX, motion & View Transitions | ✅ | ✅ | ✅ | ✅ |
| Layer 2 Document fundamentals | ✅ | ✅ | ✅ | ✅ |
| Layer 2 SEO / structured data | ✅ | ✅ | ⚪ | ⚪ |
| Layer 2 URL-as-state sync | ⚪ | ✅ | ✅ | ⚪ |
| Layer 2 Unsaved-changes protection | ⚪ | ✅ (checkout) | ✅ | ✅ (settings) |
| Layer 3 Tokens & Container Queries | ✅ | ✅ | ✅ | ✅ |
| Layer 4 State machine & streaming | ⚪ | ✅ | ✅ | ✅ |
| Layer 4 Optimistic mutation model | ❌ | ⚪ (cart) | ✅ | ⚪ |
| Layer 4 RBAC visibility | ❌ | ⚪ | ✅ | ✅ |
| Layer 2 Error / empty / loading taxonomies | ⚪ | ✅ | ✅ | ✅ |
| Layer 2 Forms contract | ⚪ | ✅ (checkout) | ✅ | ✅ (settings) |
| Layer 2 Search standard | ⚪ | ✅ | ✅ | ⚪ |
| Layer 2 Notifications taxonomy | ⚪ | ✅ | ✅ | ✅ |
| Layer 2 i18n / localization | ⚪ | ✅ | ✅ | ⚪ |
| Layer 3 Data density standards | ❌ | ⚪ | ✅ | ⚪ |
| Layer 5 WCAG 2.2 AA | ✅ | ✅ | ✅ | ✅ |
| Layer 5 Browser permissions UX | ⚪ | ⚪ | ✅ | ⚪ |
| Layer 6 Performance | ✅ | ✅ | ✅ | ✅ |
| Layer 9 Security & Privacy | ✅ | ✅ | ✅ | ✅ |
| Layer 1 Expressive surface baseline (**HIG-EXP-***) | ⚪ | ❌ | ❌ | ❌ |

Legend: ✅ Mandatory · ⚪ Conditional (when feature exists) · ❌ Not applicable.

**Expressive surface (⚪ on Content):** Mandatory when product scope declares `surface: hybrid` or `surface: experience`. Default `surface: document` if undeclared. See [expressive-surface.md](./expressive-surface.md).

**Universal (never optional):** Accessibility (Layer 5), tokens/typography (Layer 3), performance (Layer 6), security (Layer 9).

## 0.3 Expressive surfaces (content)

Resolve **surface** alongside archetype for content/marketing routes:

| Surface | When | Module |
| --- | --- | --- |
| **document** | Default; docs, blog, classic landing | [animation.md](./animation.md) only (**HIG-MOT-003** full) |
| **hybrid** | Expressive regions on a document spine | [expressive-surface.md](./expressive-surface.md) |
| **experience** | Motion/scroll/time as primary structure | [expressive-surface.md](./expressive-surface.md) |

Application, commerce checkout, and auth MUST use **document** surface.

## Agent workflow

1. Resolve archetype from product scope doc (`docs/hig-scope.md`).
2. Resolve **surface** for content routes (**HIG-EXP-001**); default **document**.
3. Load [HIG-QUICK.md](../HIG-QUICK.md) (Layer 1); open [HIG-LITE.md](../HIG-LITE.md) (Layer 2) when building features.
4. Load archetype pack → preload **default modules** for that archetype.
5. If `surface` is hybrid or experience, preload [expressive-surface.md](./expressive-surface.md).
6. Load additional modules on topic match via [manifest.yaml](./manifest.yaml).
7. Escalate to [HIG.md](../HIG.md) only for edge cases.
