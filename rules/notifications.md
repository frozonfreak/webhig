# Notifications — Level 2 Module

**Version:** v1.13.0 · **Canonical spec:** [HIG.md §2.10](../HIG.md#210-notifications-taxonomy) · **Rule ID:** HIG-NTF-001

> Standalone extract for progressive loading. The complete normative contract remains in [HIG.md](../HIG.md).

---

## 2.10 Notifications Taxonomy

Notifications MUST use the defined taxonomy (**HIG-NTF-001**):

| Type | Duration | Use when |
| --- | --- | --- |
| **Toast / snackbar** | 4–10 s (dismissible) | Transient success/failure feedback; undo actions |
| **Inline status** | Persistent until resolved | Field-level or section-level status within context |
| **Banner** | Persistent until dismissed or resolved | System-wide alerts, maintenance, policy notices |
| **Modal** | Until user acts | Requires decision; blocks interaction |
| **System notification** | OS-managed | Background events when tab is inactive (requires permission — see [accessibility.md](./accessibility.md) §5.5) |

Toasts MUST NOT stack beyond 3 visible simultaneously. Critical errors SHOULD use banners or modals, not toasts alone.

Toast enter/exit timing follows [animation.md](./animation.md) micro-animation allowlist.
