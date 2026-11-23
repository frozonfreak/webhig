# Design Tokens — Level 2 Module

**Version:** v1.19.0 · **Canonical spec:** [HIG.md §3.1](../HIG.md#31-design-token-architecture) · **Rule IDs:** HIG-TOK-001, HIG-TOK-002, HIG-MOT-002

> Standalone extract for progressive loading. The complete normative contract remains in [HIG.md](../HIG.md).

---

## 3.1 Design Token Architecture

Tokens follow a **true three-tier structure**: **Global (Raw) → Semantic → Component**. Raw scale values live in Tier 1; components consume Tier 3, which maps to Tier 2.

**No raw hex outside token files** (**HIG-TOK-001**). UI surfaces MUST use semantic or component tokens (**HIG-TOK-002**).

**Contrast verification** applies to semantic foreground/background and UI-state **combinations** — not raw tokens in isolation. All semantic combinations MUST be contrast-verified using WCAG 2.2 algorithms for:

* Text/background combinations
* Interactive states (hover, active, disabled)
* Focus indicators
* Meaningful graphical objects

```css
:root {
  /* Tier 1: Global Primitive Tokens */
  --pr-blue-500: #2563eb;
  --pr-slate-900: #0f172a;
  --space-4: 1rem;
  --duration-fast: 100ms;
  --duration-base: 180ms;
  --duration-slow: 250ms;
  --ease-out-momentum: cubic-bezier(0.16, 1, 0.3, 1);

  /* Tier 2: Semantic Tokens */
  --surface-base: #ffffff;
  --text-primary: var(--pr-slate-900);
  --brand-primary: var(--pr-blue-500);
  --focus-ring: var(--pr-blue-600);

  /* Tier 3: Component Tokens */
  --button-bg: var(--brand-primary);
  --button-fg: var(--surface-base);
  --input-border: var(--text-muted);
  --card-surface: var(--surface-raised);
}
```

Motion tokens (**HIG-MOT-002**): reference `--duration-*` and `--ease-out-momentum` — do not invent per-component millisecond values.

Applications SHOULD support system preference by default, with application-level theme selection (`system` / `light` / `dark`) where appropriate. See [HIG.md §3.1](../HIG.md#31-design-token-architecture) for the full token reference including dark mode overrides.

### Supported color schemes

Declare supported schemes in the initial document, before JavaScript. Use a `color-scheme` meta element, `color-scheme` on `:root` or `body` in first-paint CSS, or both. When both appearances are supported, declare `light dark` and author the dark tokens. That declaration is what keeps Safari 27.3 Adaptive Dark Mode from repainting the page.

`color-scheme: light only` is a narrow opt-out, not the default. Safari 27.3 beta 1 did not support the `only` keyword.

Adaptive Dark Mode can change CSS colors, gradients, some SVG and simple bitmap logos, and some masks or blend effects. It leaves canvas content unchanged, and computed styles keep the authored colors. Automated contrast can stay green while the screenshot fails. When Safari is in the matrix, reviewers MUST capture text, focus, hover, SVG logos, transparent images, and canvas content visually. The procedure is the [Safari 27.3 fixture](../examples/audit-fixtures/safari-27-3-adaptive-dark-mode.md).

Safari’s 4.5:1 aim after transformation is not WCAG conformance and does not satisfy **HIG-A11Y-002**. Re-verify authored combinations, including focus and hover. Detail: [HIG.md §3.1](../HIG.md#supported-color-schemes).
