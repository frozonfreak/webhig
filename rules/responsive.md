# Responsive Layout & Container Queries — Level 2 Module

**Version:** v1.19.0 · **Canonical spec:** [HIG.md §3.2](../HIG.md#32-container-queries-engine) · **Rule IDs:** HIG-CQ-001, HIG-CQ-002

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

### Foldable devices and device posture (informative)

The Device Posture API (Candidate Recommendation Draft, 17 November 2026) defines `navigator.devicePosture.type` (`continuous` or `folded`), a `change` event, and the `device-posture` media feature. It is implemented in Chromium-based browsers; WebKit and Mozilla have published no formal positions. It is not a baseline, and nothing here is a new requirement. The continuous layout MUST work with no posture signal.

* Keep important controls, especially buttons, out of the fold or hinge area. Watch centered dialogs on a symmetrical fold.
* Do not span a video or photograph across the fold when folded.
* Do not design for a single posture. Let people keep the layout they prefer.
* Announce a significant layout change with an accessible status message. Do not announce every reflow. Keep focus and DOM order logical in both postures.
* Test content placement, focus order, announcements, reflow, and assistive technology in both postures, using WebDriver posture simulation where supported.

Manual or integration review, not a static scan. See [HIG.md §3.2](../HIG.md#foldable-devices-and-device-posture-informative) and the [fixture](../examples/audit-fixtures/device-posture/README.md).

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
