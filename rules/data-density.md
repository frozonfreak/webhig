# Data Density — Level 2 Module

**Version:** v1.13.0 · **Canonical spec:** [HIG.md §3.3](../HIG.md#33-data-density-standards-application--dashboard) · **Rule IDs:** HIG-DEN-001–008 · **Archetypes:** Application / Dashboard

> Standalone extract for progressive loading. The complete normative contract remains in [HIG.md](../HIG.md).

---

## 3.3 Data Density Standards

Data-heavy interfaces MUST use tokenized density levels (**HIG-DEN-001**):

| Token | Row height | Use case |
| --- | --- | --- |
| `--density-compact` | 32–36 px | Dense dashboards, admin tables |
| `--density-default` | 40–48 px | Standard application tables |
| `--density-comfortable` | 52–56 px | Primary workflows, touch-friendly |

Additional requirements:

* **HIG-DEN-002:** Numeric data MUST be right-aligned (`text-align: end`); text left-aligned (`start`).
* **HIG-DEN-003:** Long text MUST truncate with ellipsis and expose the full value on hover/focus or through an expand action.
* **HIG-DEN-004:** Horizontal scroll MUST be a last resort; prefer column hiding/reordering at container breakpoints.
* **HIG-DEN-005:** Table headers SHOULD stick on scroll for datasets >10 rows.
* **HIG-DEN-006:** Multi-select tables MUST show visible selection count and a batch action bar.
* **HIG-DEN-007:** Operational data requiring URL state SHOULD use pagination over infinite scroll; infinite scroll is permitted for feed/browse patterns.
* **HIG-DEN-008:** Datasets >100 rows SHOULD use virtual scrolling — see [performance.md](./performance.md).

Sortable tables MUST have keyboard-accessible sort controls — see [accessibility.md](./accessibility.md) §5.3.
