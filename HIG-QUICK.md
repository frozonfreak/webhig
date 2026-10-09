# The Web HIG — Quick Reference

**Layer 1** · ~5 minutes · **Version:** v1.13.0

**Pin this file — that is the whole onboarding path.** You do not need the rest of the repository to start.

- **Pin:** copy `HIG-QUICK.md` and `VERSION` into `docs/hig/`, use the [current Quick Reference](https://github.com/frozonfreak/hig/blob/main/HIG-QUICK.md), or run the installer in [packages/install](./packages/install/).
- **Prompt:** *"Follow The Web HIG Quick Reference."*
- **Escalate only if needed:** [HIG-LITE.md](./HIG-LITE.md) for rule IDs · [HIG.md](./HIG.md) for edge cases.

Agent templates: [examples/agent-rules/](./examples/agent-rules/). Full walkthrough: [INTEGRATION.md](./INTEGRATION.md).

Ninety-eight imperative rules. For practical detail, open [HIG-LITE.md](./HIG-LITE.md) (Layer 2). For edge cases and normative depth, open [HIG.md](./HIG.md) (Layer 3).

> **Not a UI component library.** A governance contract for your existing design system.

### How Quick counts relate to rule IDs

| Count | What it is |
| --- | --- |
| **98** | Numbered imperatives in this file (Layer 1) — default agent context |
| **76** | Stable **`HIG-*` rule IDs** in [rules/registry.yaml](./rules/registry.yaml) — cite in PRs, CI, and disputes |

These counts measure **different layers**. Quick bullets are readable heuristics; many summarize several normative requirements or archetype-specific detail from Layer 2–3. A bullet **without** an inline **`HIG-*`** ID is **Quick-only guidance** at Layer 1 — still apply it, then escalate to [HIG-LITE.md](./HIG-LITE.md) or [rules/INDEX.md](./rules/INDEX.md) for canonical IDs and evaluation methods.

Bullets that name **`HIG-*` inline** use the canonical ID. Machine-readable Quick ↔ ID links: [rules/quick-rule-map.yaml](./rules/quick-rule-map.yaml) (validated by `npm run validate` in this repository).

---

## Before you start

1. Resolve the page archetype before applying rules: **content**, **commerce**, **application**, or **auth**; for **content**, also resolve **surface** (`document` default, `hybrid`, `experience`) — see **HIG-EXP-**\* ([expressive-surface.md](./rules/expressive-surface.md)).
2. Apply only rules mandatory for that archetype — not every rule applies to every page.
3. Accessibility, design tokens, motion safety, and performance are **universal** — never optional.
4. Prefer the simplest implementation that satisfies applicable rules (**HIG-SIM-001**).
5. When a rule has a canonical ID (e.g. **HIG-A11Y-003**), cite it when declining conflicting requests.

---

## UX & interaction

6. Every interactive element must have a clear affordance (looks clickable, tappable, or editable).
7. Every user action must produce immediate local feedback — never wait silently on the network.
8. One primary action per screen; secondary actions must not compete visually.
9. Never create dead ends — every state must offer a next step or recovery path.
10. Preserve user state across navigation where the task expects continuity.
11. Primary content and tasks belong at the reading-order start (block-start / inline-start).
12. Complex settings belong behind progressive disclosure — accordions, tabs, or drill-down panels.
13. Core features must be reachable in ≤3 navigation steps where practical.
14. Never make navigation behave like an action — links navigate; buttons act.
15. Spatial UI (modals, sheets) must originate from its logical trigger point.
16. Respect platform conventions: links underline on hover, buttons look like buttons.
17. Reuse existing components before inventing new ones.
18. Avoid unnecessary decoration — every visual element must earn its place.
19. Mobile-first: layouts must work on small viewports before large ones.
20. Touch and pointer targets must not overlap in ways that cause mis-taps.

---

## Navigation & information architecture

21. URL must be the single source of truth for tabs, filters, search, pagination, and sort.
22. Deep links must restore the same view state a user would get by navigating manually.
23. Unsaved changes on forms must warn before the user navigates away (commerce checkout, app settings, auth).
24. A command palette may supplement navigation but must never be the sole path to a feature.
25. Every document needs exactly one primary `<main>` landmark (**HIG-DOC-002**).
26. Set `<html lang="…">` correctly; set `dir` for RTL locales (**HIG-DOC-001**).
27. Every page needs a unique, descriptive `<title>` (**HIG-DOC-003**).
28. Use semantic landmarks (`header`, `nav`, `footer`, `aside`) when those regions exist.
29. SEO-critical pages must expose crawlable content and structured data where applicable (**HIG-SEO-001**–**003**).
30. Search results must be keyboard-navigable and announce result count to assistive tech (**HIG-SRCH-003**).

---

## States & feedback

31. Every asynchronous operation must have a defined state: idle, loading, success, error, or empty.
32. Loading states must use the loading taxonomy — skeleton for layout, spinner for inline action.
33. Empty states must explain why it is empty and offer a constructive next action.
34. Error states must say what failed, why (when known), and how to recover.
35. Never show a blank screen while data loads — use skeleton or progressive reveal.
36. Stale data must be labeled or refreshed — do not silently show outdated information.
37. Offline and network failures must be surfaced with retry or graceful degradation.
38. Disabled controls must look disabled; do not hide actions without explanation when RBAC blocks them.
39. Notifications must follow the taxonomy: toast for transient, banner for persistent, inline for field-level.
40. Success feedback must confirm what happened — not just that "it worked."

---

## Destructive actions & mutations

41. Every destructive action must provide appropriate confirmation proportional to severity.
42. Irreversible deletes require intentional multi-step confirmation (type resource name or `DELETE`).
43. Never use optimistic UI for destructive confirmation — wait for server acknowledgment.
44. Reversible destructive actions should offer undo instead of a blocking modal when practical.
45. Server mutations must show pending UI immediately — disable submit, show spinner.
46. Optimistic updates are allowed only for low-consequence, reversible changes (toggles, likes, cart counts).
47. Critical mutations should be idempotent to survive double-submit and network retries.
48. Concurrency conflicts must surface a clear resolution path — refresh, merge, or retry.
49. Role-restricted actions must be hidden or disabled with an explanation of required permissions.

---

## Forms & input

50. Every form field must have an associated visible label — placeholders are not labels.
51. Validation errors must appear inline at the field and in a summary for multi-field forms.
52. Use native input types and `autocomplete` attributes appropriate to the field purpose.
53. Do not validate on every keystroke for complex fields — validate on blur or submit.
54. Multi-step flows must show progress and allow backward navigation without data loss.
55. Required fields must be indicated accessibly — not by color alone.
56. Submit buttons must reflect form state: disabled while invalid or pending.
57. Error messages must be specific and actionable — not "Invalid input."

---

## Visual design & tokens

58. Use design tokens for color, spacing, typography, and motion — no raw hex in component code.
59. UI surfaces must use semantic or component tokens, not primitive palette values directly.
60. Never rely on color alone to communicate meaning — pair with icon, text, or pattern.
61. Text contrast: ≥4.5:1 for body text, ≥3:1 for large text and non-text UI elements.
62. Focus indicators must have sufficient contrast and must never be removed without a replacement.
63. Typography and spacing must come from the token system — no one-off pixel values.
64. Dark mode must re-verify contrast for every semantic token combination used.
65. Component-internal layout should use container queries when layout depends on parent width; must use them for multi-context reusable components where viewport breakpoints would lie (**HIG-CQ-001**, **HIG-CQ-002**). Do not add containers only to satisfy the rule (**HIG-SIM-001**).

---

## Accessibility

66. Target WCAG 2.2 Level AA — refer to the official spec; do not redefine criteria.
67. Use native HTML elements before reaching for ARIA — `<button>`, `<a>`, `<input>`, `<select>`.
68. Never use `<div onClick>` or `<span onClick>` for interactive controls.
69. Every control must have an accessible name — especially icon-only buttons. Prefer visible/`<label>` text; verify names against the browser accessibility tree (platform AccName), not a simplified attribute checklist — especially for web components, slots, and hidden ID refs.
70. Every informative image must have meaningful `alt` text; decorative images use `alt=""`.
71. All functionality must be operable by keyboard alone.
72. Focus must be visible on every interactive element — never `outline: none` without a custom ring.
73. Modals must trap focus inside and restore focus to the trigger on close.
74. Provide a "Skip to main content" link as the first tabbable element.
75. Interactive targets MUST be at least 24×24 CSS px (**HIG-A11Y-007**) — WCAG 2.5.8 AA baseline; WCAG exceptions apply. Primary touch actions SHOULD use 44×44 CSS px as an HIG ergonomic recommendation — not mandatory for conformance.
76. Respect `prefers-reduced-motion` — replace motion with instant state changes or minimal opacity fade.
77. Content must remain usable at 200% zoom without loss of functionality.
78. Dynamic content updates must be announced to screen readers (`aria-live` or focus management).
79. Do not disable browser zoom or pinch-to-zoom.
80. Form errors must be associated with fields via `aria-describedby` or equivalent.

---

## Performance & engineering

81. Default to server rendering — add client JavaScript only when interaction requires it.
82. Protect Core Web Vitals: LCP ≤2.5 s, INP ≤200 ms (field), CLS ≤0.1 (**HIG-PERF-001**, **HIG-PERF-002**).
83. Images must declare dimensions or aspect ratio to prevent layout shift. Choose formats by measured transfer cost and LCP; offer emerging formats (e.g. JPEG XL) only via `<picture>` progressive enhancement with a broadly supported fallback.
84. Lazy-load below-the-fold media; never lazy-load the LCP candidate.
85. Application CSS must not use `transition: all` — enumerate animated properties explicitly.
86. Micro-feedback animations must complete within 300 ms and serve exactly one purpose.
87. Use motion duration tokens — do not invent per-component millisecond values.
88. Datasets over 100 rows should use virtual scrolling; operational tables prefer pagination over infinite scroll (**HIG-DEN-007**, **HIG-DEN-008**).
89. Do not introduce dependencies or abstractions without justification.
90. Do not duplicate functionality that already exists in the codebase.

---

## Security & privacy

91. Never embed secrets, API keys, or credentials in client-side code.
92. Content Security Policy must be configured in production.
93. Sanitize all user-generated content before rendering — never unsanitized `dangerouslySetInnerHTML`.
94. State-changing requests must include CSRF protection.
95. Auth cookies must use `Secure`, `HttpOnly`, and appropriate `SameSite`.
96. Mask PII in the UI and logs — show partial values for sensitive fields.
97. Session expiry must be communicated before forced logout.
98. Browser permission prompts must explain why the capability is needed before requesting.

---

## When you need more

| Need | Open |
| --- | --- |
| Practical rules with rule IDs and checklists | [HIG-LITE.md](./HIG-LITE.md) — **Layer 2** |
| Topic deep-dives (forms, a11y, SSR, security…) | [rules/INDEX.md](./rules/INDEX.md) |
| Archetype-specific module sets | [rules/archetypes/](./rules/archetypes/) |
| Edge cases, normative detail, CI gates | [HIG.md](./HIG.md) — **Layer 3** |
| Agent integration | [INTEGRATION.md](./INTEGRATION.md) |

**Agent one-liner:** *Follow [The Web HIG Quick Reference](HIG-QUICK.md). Escalate to HIG-LITE for practical detail and HIG.md only for edge cases.*
