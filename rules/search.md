# Search — Level 2 Module

**Version:** v1.13.0 · **Canonical spec:** [HIG.md §2.9](../HIG.md#29-search-standard-commerce--application) · **Rule IDs:** HIG-SRCH-001–006 · **Archetypes:** Commerce, Application

> Standalone extract for progressive loading. The complete normative contract remains in [HIG.md](../HIG.md).

---

## 2.9 Search Standard

Search flows MUST follow this state machine (**HIG-SRCH-001**):

```
[input] ──debounce──> [pending] ──┬──> [results]
                                  ├──> [no results]
                                  └──> [error]
```

Requirements:

* **HIG-SRCH-002:** Debounce input (typically 200–400 ms); show pending indicator after debounce threshold.
* **HIG-SRCH-003:** Results MUST support keyboard navigation (arrow keys, Enter to select) — see [accessibility.md](./accessibility.md) §5.3.
* **HIG-SRCH-004:** Search query MUST sync to URL where search is a primary navigation pattern — see [ux.md](./ux.md) §2.3.
* **HIG-SRCH-005:** No-results and error states MUST follow [states.md](./states.md) taxonomies.
* **HIG-SRCH-006:** Recent searches MAY be persisted locally; persisted searches MUST respect privacy settings — see [security.md](./security.md).
