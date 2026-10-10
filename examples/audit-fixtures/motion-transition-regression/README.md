# Motion transition regression fixture

Illustrative audit fixture for application control motion. It is **not** a normative change to The Web HIG, and it does not add a Quick imperative, a `HIG-*` id, or a conformance claim.

Repository [VERSION](../../../VERSION) is the current pin (1.13.0). This fixture does not change that contract. The behaviors under test are already required.

## What it demonstrates

A check button keeps a short press acknowledgement on `background-color` and `transform`. The same action reveals an error on the reference code and changes that button’s inline size from 140px to 240px. The size change snaps. A second, labeled control uses an unscoped transition shorthand so the size change animates. That comparison is planted and is not shippable application CSS.

Under `prefers-reduced-motion: reduce`, neither control scales or interpolates its size. The error and the background change still appear immediately.

The width change exists so the test can observe a layout property on the control that owns the transition. Do not copy it as application layout.

## Normative guidance

| Topic | Where |
| --- | --- |
| No `transition: all` | [HIG-QUICK.md](../../../HIG-QUICK.md#performance--engineering) item 85, [HIG.md §1.1](../../../HIG.md#11-direct-manipulation--motion-ergonomics), [rules/animation.md](../../../rules/animation.md) (`HIG-MOT-001`) |
| Brief, purposeful press feedback | [HIG-QUICK.md](../../../HIG-QUICK.md#performance--engineering) items 86–87, [HIG.md §1.4](../../../HIG.md#14-functional-micro-animations) |
| Reduced motion | [HIG-QUICK.md](../../../HIG-QUICK.md#accessibility) item 76, [HIG.md §1.3](../../../HIG.md#13-reduced-motion--animation-safety) (`HIG-A11Y-001`) |
| Field error and announcement | [HIG-QUICK.md](../../../HIG-QUICK.md#forms--input) items 51 and 57, [HIG-QUICK.md](../../../HIG-QUICK.md#accessibility) items 78 and 80 |
| Tokens | [HIG-QUICK.md](../../../HIG-QUICK.md#visual-design--tokens) items 58 and 63 |

Item 51’s error summary applies to multi-field forms. This fixture has one field, so the error is inline only.

Production stylesheets should still include the document-wide reduced-motion block in [HIG.md §1.3](../../../HIG.md#13-reduced-motion--animation-safety). This page scopes that override to the two buttons so a regression can attribute the result to those controls. Nothing else on the page animates.

## Run

From the repository root:

```bash
node examples/audit-fixtures/motion-transition-regression/regression.spec.mjs
```

`npm test` runs the same file. The executable spec is JavaScript because the repository test runner is Node, and Node 20 (the CI version) does not execute TypeScript without a new toolchain.

Set `WEB_HIG_BROWSER` to a Chrome, Edge, or Chromium executable if discovery fails. The spec checks source text and then drives the page: computed transition properties, press feedback, width samples, keyboard activation, reduced motion, and the accessibility tree.

A screen reader was not part of the automated run. Confirm the field error is spoken once when focus moves to the reference code, with no second live announcement.

## Design record

Map: produced. One page. Objects are the reference code, the conforming check, the labeled comparison check, and the field error. No extra routes.

| Choice | Why |
| --- | --- |
| Audience | Maintainers and agents reviewing application CSS. Occasional task, high cost if `transition: all` or a silent error ships. Keyboard and pointer. |
| Visual system | Restrained. Tokens follow Layer 3 roles already in `HIG.md`. This fixture does not define a new style. |
| Motion | Press uses `background-color` and `transform` for 100ms on the momentum curve. Validation does not animate `inline-size`. |
| Error | One actionable sentence, associated with the field, focus moved to the field. No live region, so the announcement is not duplicated. |
| Comparison | Isolated on `.fixture-button--negative` and labeled non-conformant. |
| Third-party squash-and-stretch reference | Deferred. Not bundled, not linked, and not evidence of conformance until source and rights are checked. |

Adaptations, which are fixture choices and not upstream rule changes:

- [HIG.md §1.3](../../../HIG.md#13-reduced-motion--animation-safety) shows a universal reduced-motion rule. This page applies `transition: none` and `transform: none` to the two buttons under test.
- Quick item 56 keeps submit controls disabled while invalid. These checks stay available so the comparison can be repeated. The error is deterministic instrumentation, not a production validator.
- Quick item 63 avoids one-off pixel sizes. 140px and 240px are fixture tokens used only to expose the layout-property anti-pattern.

## Files

| File | Role |
| --- | --- |
| `index.html` | Semantic fixture page |
| `fixture.css` | Tokenized conforming rules, planted comparison, reduced motion |
| `fixture.js` | Reveals the error and switches button size |
| `regression.spec.mjs` | Source and browser assertions |
| `expected-results.md` | Acceptance matrix |
