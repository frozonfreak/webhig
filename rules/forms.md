# Forms — Level 2 Module

**Version:** v1.13.0 · **Canonical spec:** [HIG.md §2.11](../HIG.md#211-forms-contract) · **Rule ID:** HIG-FRM-001

> Standalone extract for progressive loading. The complete normative contract remains in [HIG.md](../HIG.md).

---

## 2.11 Forms Contract

Forms MUST follow these standards (**HIG-FRM-001**):

| Concern | Requirement |
| --- | --- |
| **Field grouping** | Related fields grouped with `<fieldset>`/`<legend>` or visual grouping with programmatic association |
| **Labels** | Every input MUST have a visible, programmatically associated `<label>` |
| **Help text** | Supplementary guidance linked via `aria-describedby` |
| **Validation timing** | Inline on blur for field-level; on submit for form-level; never validate before interaction unless pre-filled |
| **Server validation** | Map server errors to specific fields; preserve all user input |
| **Autocomplete** | Use appropriate `autocomplete` tokens (name, email, address, cc-*) |
| **Password managers** | Do not block autofill; use `autocomplete="current-password"` / `"new-password"` |
| **Input types** | Use semantic types (`email`, `tel`, `url`, `number`) for mobile keyboard optimization |
| **Keyboard behavior** | Enter submits single-field forms; Tab order follows visual order |
| **Multi-step forms** | Show progress indicator; preserve state between steps; allow back navigation |
| **Draft persistence** | Auto-save drafts for forms >3 fields or multi-step flows |
| **Error summary** | On submit failure, focus error summary linking to first invalid field |

Server mutation forms MUST expose pending UI — see [architecture.md](./architecture.md) (HIG-SSR-003).
