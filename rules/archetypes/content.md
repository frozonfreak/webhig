# Archetype Pack — Content / Marketing

**Version:** v1.15.0 · **Archetype:** `content` · **Matrix:** [applicability.md](../applicability.md)

Landing pages, blogs, docs, campaigns, portfolios, and studio sites. Read-mostly, SEO-critical; may be document-dominant or expressive (resolve **surface** in scope).

---

## Default modules (load after HIG-QUICK)

| Module | Why |
| --- | --- |
| [ux.md](../ux.md) | Document fundamentals, SEO metadata, landmarks |
| [tokens.md](../tokens.md) | Design tokens (universal) |
| [responsive.md](../responsive.md) | Container queries, responsive layout |
| [animation.md](../animation.md) | Motion — functional micro-feedback; tiered on hybrid/experience |
| [accessibility.md](../accessibility.md) | WCAG 2.2 AA (universal) |
| [performance.md](../performance.md) | Core Web Vitals, LCP-critical for SEO |
| [security.md](../security.md) | CSP, third-party scripts (universal) |

## Conditional modules (load when feature exists)

| Module | When |
| --- | --- |
| [expressive-surface.md](../expressive-surface.md) | `surface: hybrid` or `surface: experience` in scope |
| [states.md](../states.md) | Async content regions, error/empty states |
| [architecture.md](../architecture.md) | Dynamic views with streaming |
| [forms.md](../forms.md) | Newsletter signup, contact forms |
| [i18n.md](../i18n.md) | Multi-locale content sites |

## Skip unless explicitly needed

`data-density`, `mutations`, `search`, `notifications`, `ai-enforcement`

## Mandatory rule IDs

HIG-TOK-001, HIG-TOK-002, HIG-CQ-001, HIG-CQ-002, HIG-MOT-001, HIG-MOT-004, HIG-A11Y-001–008, HIG-SEC-001–004, HIG-SIM-001

## Typical tasks

| Task | Additional modules |
| --- | --- |
| Landing page hero + CTA | (defaults sufficient); declare `surface` |
| Portfolio / fluid marketing site | expressive-surface + scope `hybrid` or `experience` |
| Blog post template | ux (SEO, structured data); `surface: document` |
| Docs with search | search (if site search exists) |
| Marketing form | forms |

## Applied content examples (informative)

Use the [content review guide](https://github.com/frozonfreak/webhig/blob/v1.15.0/examples/content-marketing/README.md) for optional landing-page examples, a scoped [manual worksheet](https://github.com/frozonfreak/webhig/blob/v1.15.0/examples/content-marketing/review-worksheet.md), and [document/hybrid fixtures](https://github.com/frozonfreak/webhig/blob/v1.15.0/examples/audit-fixtures/content-marketing/README.md). These upstream links match the contract pin so this pack remains usable when installed without `examples/`; in the source checkout, use those same paths under `examples/`. Release links become available when the version tag is published.

These examples do not prescribe a hero, screenshot, CTA, section count, palette, or conversion goal. A heading and supporting explanation can establish context; navigation and actions, where present, use native semantics and meaningful labels. Meaningful imagery can explain a product, with appropriate alternatives and measured delivery cost. Text-only pages are valid.

Resolve applicability before reviewing: retain document/accessibility requirements on document surfaces; apply expressive parity and client-enhancement fallback obligations only where the existing surface or motion conditions invoke them. The examples do not create a universal no-JavaScript requirement. The mandatory-ID summary above does not override individual rule conditions in [HIG.md](../../HIG.md).

For discoverability, use the existing [document and SEO rules](../ux.md): a descriptive title; description/canonical requirements under HIG-SEO-001, including canonical where duplication is possible; social metadata for shareable pages under HIG-SEO-002; structured data where warranted under HIG-SEO-003. Do not require every metadata feature on every route.
