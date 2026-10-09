# Design Tokens — Level 2 Module

**Version:** v1.13.0 · **Canonical spec:** [HIG.md §3.1](../HIG.md#31-design-token-architecture) · **Rule IDs:** HIG-TOK-001, HIG-TOK-002, HIG-MOT-002

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
