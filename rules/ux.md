# UX & Information Architecture — Level 2 Module

**Version:** v1.13.0 · **Canonical spec:** [HIG.md §2.1–2.4](../HIG.md#layer-2-information-architecture--product-standards) · **Rule IDs:** HIG-DOC-001–006, HIG-SEO-001–003, HIG-MUT-001, HIG-SIM-001

> Standalone extract for progressive loading. The complete normative contract remains in [HIG.md](../HIG.md).

---

## 2.1 Document Fundamentals

### Universal (all archetypes)

Every page MUST ship:

* **HIG-DOC-001 — Language:** `<html lang="…">` set correctly (and `dir` where relevant).
* **HIG-DOC-002 — Landmarks:** Exactly one primary `<main>` landmark. Use `<header>`, `<nav>`, `<footer>`, `<aside>` when corresponding regions exist. Interactive elements MUST use native semantics (`<button>`, `<a>`), never `<div onClick>`.
* **HIG-DOC-003 — Title:** A unique, descriptive `<title>`.
* **HIG-DOC-004 — Viewport:** Responsive viewport meta tag.
* **HIG-DOC-005 — Responsive images (CLS-safe):** Every `<img>` declares intrinsic `width`/`height` or `aspect-ratio`; use `srcset`/`sizes`. Lazy-load non-critical images; avoid lazy-loading the LCP candidate. Choose transfer formats by measured outcome (sizing, quality, transfer cost, LCP)—not format fashion. Emerging formats such as JPEG XL MAY be offered only via progressive enhancement (normally `<picture>` with a broadly supported fallback). Compare encodings on representative images; do not ship JXL-only as the sole source while multi-engine support and field evidence remain incomplete.
* **HIG-DOC-006 — Fonts:** `font-display: swap` or `optional`. Preload only critical fonts when evidence supports it.

### SEO / shareable (Content, Commerce — where applicable)

* **HIG-SEO-001:** Meta description and canonical URL where duplication is possible.
* **HIG-SEO-002:** Open Graph and social metadata for shareable pages.
* **HIG-SEO-003:** JSON-LD structured data (`Article`, `Product`, `BreadcrumbList`, `Organization`) where warranted.

## 2.2 Container-Aware Component Layouts

* **Primary Content Prominence:** Primary tasks occupy the **block-start / inline-start** region.
* **Navigation Depth:** Core features SHOULD be reachable in ≤3 navigation steps where practical. Command palette MAY supplement but MUST NOT be the sole path.
* **Progressive Disclosure:** Complex settings SHOULD defer to accordions, secondary tabs, or drill-down sheets.

## 2.3 Navigation Architecture, Command Palette & Deep-Linking

* **URL as Single Source of Truth:** Every distinct layout view, active tab, filter, search query, and pagination offset MUST sync bidirectionally with URL query parameters.
* **Command Palette:** `Cmd/Ctrl+K` permitted as documented exception. MUST activate only when document has focus and no input captures text; MUST NOT be sole path; MUST provide visible trigger.
* **Unsaved Changes & Data-Loss Protection** (Commerce/App/Auth):
  * Track form dirty state dynamically.
  * Use SPA route guards or framework navigation blockers as primary interception.
  * Use `beforeunload` as secondary backstop for tab close / external reload.
  * Implement `localStorage`/`IndexedDB` auto-save drafts for multi-step forms.

## 2.4 Destructive Actions & Permission Guardrails

* **Role-Based Visibility** (App/Auth): Hide or disable actions exceeding RBAC permissions; explain required privileges on focus/hover.
* **Destructive Flow Friction:** Irreversible operations MUST require multi-step modal with explicit confirmation (typing resource name or `DELETE`).

```
User requests delete → Soft delete / reversible state → Undo window → Permanent commit
```

| Type | Pattern |
| --- | --- |
| **Reversible deletion** | MAY use optimistic removal with reliable rollback or soft deletion |
| **Soft deletion** | Hide from UI; retain recoverable state server-side |
| **Irreversible deletion** | Multi-step confirmation; MUST NOT use conventional optimistic confirmation |
| **Financial / legal action** | Explicit confirmation; idempotency protection required |

Destructive mutations MUST NOT use conventional optimistic confirmation (**HIG-MUT-001**). Reversible deletion MAY use optimistic removal with undo window (5–10 s toast) when soft-delete semantics provide reversibility.
