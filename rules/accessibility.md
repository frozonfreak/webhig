# Accessibility — Level 2 Module

**Version:** v1.13.0 · **Canonical spec:** [HIG.md §5](../HIG.md#layer-5-accessibility-a11y--keyboard-navigation) · **Rule IDs:** HIG-A11Y-001–008

> Standalone extract for progressive loading. The complete normative contract remains in [HIG.md](../HIG.md).

---

## 5.1 Standards Baseline

* **Conformance:** WCAG 2.2 Level AA mandatory (**HIG-A11Y-002**). Refer to the [official WCAG 2.2 specification](https://www.w3.org/TR/WCAG22/) — do not redefine criteria. AAA targeted where practical (e.g. reduced motion).
* **Text Contrast:** Standard text ≥4.5:1; large text ≥3:1. Non-text UI ≥3:1.
* **Zoom & reflow:** Usable at 200% text zoom; support 400% reflow without horizontal scrolling where applicable.

## 5.2 Native HTML Over ARIA

Native semantic HTML MUST be preferred over ARIA when equivalent semantics exist (**HIG-A11Y-003**). Example: `<button>` not `<div role="button">`.

**Accessible name and description** — Names and descriptions MUST match the **user-agent** computation ([AccName 1.2](https://www.w3.org/TR/accname-1.2/) Working Draft; [AccName 1.1](https://www.w3.org/TR/accname-1.1/)). Do not treat a simplified attribute order as authoritative when it disagrees with the browser accessibility tree. AccName 1.2 WD wording is not an independent HIG conformance bar.

**Authoring preference** (ergonomic — not a substitute for the algorithm):

1. Visible text / native labeling (`<label>`, button text, `<img alt>`)
2. `aria-labelledby` from existing visible text
3. `aria-label` when visible text is insufficient
4. Descriptions via `aria-describedby` (prefer) or `aria-description` where supported — verify in the accessibility tree

Watch divergence for shadow roots/slots, CSS-generated content, hidden ID references, embedded controls, and roles that prohibit naming. Prefer the browser accessibility tree in audits.

Icon buttons MUST have accessible names (**HIG-A11Y-004**). Images MUST have `alt` (**HIG-A11Y-005**).

## 5.3 Keyboard Focus & Interaction

* **Visible Focus Indicator:** Explicit, high-contrast indicator (`outline: 3px solid var(--focus-ring); outline-offset: 2px;`) (**HIG-A11Y-006**). Never `outline: none` without custom equivalent.
* **Focus Trapping:** Modal dialogs MUST implement actual focus containment (**HIG-A11Y-008**):
  * Focus moves into dialog when opened.
  * Focus MUST NOT escape while active (Tab/Shift+Tab cycle within).
  * Focus returns to originating control when closed.
  * `aria-modal="true"` does **not** itself create a focus trap.
* **Focus Restoration:** Closing dialog/popover MUST return focus to trigger.
* **Skip Links:** "Skip to main content" as first tabbable element.

**Keyboard interaction patterns:**

| Widget | Expected behavior |
| --- | --- |
| Dialog | Escape closes; focus trap; initial focus on first focusable or title |
| Menu | Arrow keys navigate; Escape closes; typeahead |
| Tabs | Arrow keys switch tabs; Tab moves to panel |
| Combobox | Arrow keys + typeahead; Enter selects |
| Listbox | Arrow keys navigate; multi-select with modifier |
| Accordion / disclosure | Enter/Space toggles; arrow keys between headers |
| Sortable table | Keyboard-accessible sort controls |
| Drag/drop | Keyboard alternative MUST exist |

## 5.4 Target Sizes

The Web HIG cites WCAG for conformance floors and adds ergonomic guidance beyond WCAG — do not treat both numbers as mandatory.

| Size | Normative level | Role |
| --- | --- | --- |
| **24×24 CSS px** | **MUST** (**HIG-A11Y-007**) | **Minimum normative baseline** aligned with WCAG 2.2 [Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) (Success Criterion 2.5.8 Level AA). Official [WCAG-defined exceptions](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) apply — the HIG does not redefine them. |
| **44×44 CSS px** | **SHOULD** (HIG ergonomic guidance) | **HIG ergonomic recommendation** for primary touch actions on mobile and touch-first surfaces. Improves accuracy and comfort; **not** a WCAG AA requirement and **not** enforced as **HIG-A11Y-007**. |

Pointer targets smaller than 24×24 CSS px MUST NOT be used unless a WCAG exception applies. Teams SHOULD use 44×44 CSS px (or equivalent spacing/hit slop) for primary touch controls where practical without violating **HIG-SIM-001**.

## 5.5 Browser Permissions UX

| Permission | UX requirement |
| --- | --- |
| **Camera / microphone** | Explain why before prompt; show active indicator; easy dismiss |
| **Clipboard** | Request only on explicit user action; show success/failure feedback |
| **Geolocation** | Explain benefit; offer manual location fallback |
| **Notifications** | Explain value; never request on first visit; respect OS denial |
| **File system** | Trigger only from file picker or drag-drop zone |
| **Downloads** | Confirm large downloads; show progress; handle blocked popups |

Permission prompts MUST NOT appear without prior in-app explanation. Denied permissions MUST degrade gracefully.
