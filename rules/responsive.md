# Responsive Layout & Container Queries — Level 2 Module

**Version:** v1.13.0 · **Canonical spec:** [HIG.md §3.2](../HIG.md#32-container-queries-engine) · **Rule IDs:** HIG-CQ-001, HIG-CQ-002

> Standalone extract for progressive loading. The complete normative contract remains in [HIG.md](../HIG.md).

---

## 3.2 Container Queries Engine

### Query roles

| Query type | Purpose |
| --- | --- |
| `@container` | Component-internal layout adaptation (allocated inline size) |
| `@media` (viewport) | Page layout, navigation structure, full-bleed shells |
| `@media` (preferences) | Accessibility (`prefers-reduced-motion`), `prefers-color-scheme`, print |
| `@media` (environment) | Viewport or device conditions when that signal is genuinely required (e.g. safe-area, orientation for page chrome) |

`@media (prefers-reduced-motion: reduce)` and similar preference queries are legitimate inside component stylesheets.

**HIG-CQ-001 (SHOULD):** Component-internal layout adaptation SHOULD use `@container` when layout depends on the space allocated by the parent — not the viewport width alone.

**HIG-CQ-002 (MUST):** When **all** of the following apply, the component MUST adapt via container queries (or equivalent container-size signal), not viewport breakpoints:

1. The component is **reused** in parent contexts with materially different inline sizes (e.g. main column, sidebar, modal, split pane, dense grid cell).
2. Its **layout structure** changes with available width (stack ↔ row, column collapse, toolbar wrap).
3. Viewport `@media` would produce **incorrect** layout in at least one valid placement.

**HIG-SIM-001:** MUST NOT introduce wrapper elements or `container-type` solely to satisfy **HIG-CQ-001** when viewport `@media`, intrinsic sizing, or a single-context layout is the simpler correct approach.

When adaptation genuinely depends on viewport or environment (page shell, global nav, safe-area, full-bleed hero), viewport or environment `@media` is appropriate — not a **HIG-CQ-002** violation.

```css
.component-container {
  container-type: inline-size;
  container-name: card-grid;
}

.product-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@container card-grid (min-width: 420px) {
  .product-card {
    flex-direction: row;
    align-items: center;
  }
}
```

**Anti-pattern:** Using shared viewport breakpoints (e.g. `768px`) for component layout that appears in both a 280px sidebar and a 1200px main column — use **HIG-CQ-002** container adaptation instead.

Content MUST remain usable at 200% text zoom with reflow support where applicable — see [accessibility.md](./accessibility.md) §5.1.
