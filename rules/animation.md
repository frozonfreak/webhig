# Animation & Motion — Level 2 Module

**Version:** v1.13.0 · **Canonical spec:** [HIG.md §1](../HIG.md#layer-1-universal-ux-principles) · **Rule IDs:** HIG-MOT-001–005, HIG-VT-001, HIG-A11Y-001

> Standalone extract for progressive loading. The complete normative contract remains in [HIG.md](../HIG.md).

---

## 1.1 Direct Manipulation & Motion Ergonomics

* **Spatial Origin:** UI elements MUST originate from their logical trigger point (modals expand out from the clicked button; slide-overs anchor to the active edge).
* **Physics-Based Curves:** Use non-linear cubic-bezier momentum curves (`cubic-bezier(0.16, 1, 0.3, 1)`) rather than linear or basic `ease-in-out` transitions. Application-authored CSS MUST NOT use `transition: all` — enumerate the specific properties being animated. (**HIG-MOT-001**; external/vendor CSS is out of scope.)
* **Input Feedback Threshold:** Every user interaction MUST produce an immediate local visual acknowledgement (hover, active press state, focus ring, or pending loader) without waiting for asynchronous network I/O. Prefer functional micro-animations (§1.4) over instant jumps when motion is allowed.

## 1.2 Native View Transitions API

For SPA route navigation and MPA document transitions, use the native View Transitions API (`document.startViewTransition`) rather than mounting heavy JS wrapper libraries:

```css
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: var(--duration-base);
  animation-timing-function: var(--ease-out-momentum);
}

.card-hero {
  view-transition-name: hero-card-active;
}
```

* **Rule (HIG-VT-001):** A `view-transition-name` MUST uniquely identify an element within a single transition capture unless an intentional grouping strategy is being used.

## 1.3 Reduced Motion & Animation Safety

Motion is an enhancement, never a dependency. Respect `prefers-reduced-motion: reduce` as a **mandatory HIG requirement** (**HIG-A11Y-001**).

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation: none !important;
  }
}
```

* Replace transform/momentum animations with instant state changes or a minimal opacity fade.
* Disable parallax, auto-playing carousels, native View Transitions morphing, and decorative looping motion.

## 1.4 Functional Micro-Animations

Micro-animations are **functional feedback only** — never decorative flourish.

### Allowlist

| Interaction | Duration token | Typical duration | Notes |
| --- | --- | --- | --- |
| Hover / focus affordance | `--duration-fast` | 100–150 ms | MUST NOT block pointer travel |
| Press / active acknowledgment | `--duration-fast` | 100–150 ms | Tied to Input Feedback Threshold |
| Toggle / checkbox / switch | `--duration-base` | 150–200 ms | Show state transition clearly |
| Inline validation appear/dismiss | `--duration-base` | 150–200 ms | Prefer opacity; avoid layout shift |
| Pending / loading indicator | continuous only while pending | — | MUST stop when settled |
| Toast / snackbar enter | `--duration-slow` | 200–250 ms | Exit faster than enter |
| Modal / overlay open | `--duration-slow` | 200–250 ms | Close at `--duration-base` |

### Deny list (**HIG-MOT-003**)

Applies in full to **document** surfaces (page-level) and to **interactive controls** on all surfaces. On content routes declared **hybrid** or **experience**, page-level motion MUST be classified (**HIG-EXP-013**, **HIG-EXP-014**) and permitted only per [motion-tiers.yaml](./motion-tiers.yaml) (**HIG-EXP-006**), subject to parity (**HIG-EXP-003**) and navigation (**HIG-EXP-005**).

* Decorative loops, idle wiggles, continuous brand ornaments, autoplay attention-grabbers.
* Parallax, scroll-jacking, large-field oscillations.
* **Micro-feedback** MUST NOT exceed **300 ms** unless documented (**HIG-MOT-004**).
* JS main-thread animation libraries when CSS suffices.
* Animating layout properties (`width`, `height`, `top`, `left`, `margin`, `padding`, `border-width`) for micro-feedback.

### Implementation rules

* Micro-feedback SHOULD use `transform` and `opacity` (**HIG-MOT-005**).
* Use motion duration tokens (**HIG-MOT-002**) — do not invent per-component millisecond values.
* CSS-first: prefer CSS transitions/animations over `requestAnimationFrame` or JS tween libraries.
* Reduced motion: §1.3 still applies.
* One job: a micro-animation MUST communicate exactly one of: affordance, acknowledgment, state change, or progress.
