# Animation & Motion — Level 2 Module

**Version:** v1.20.0 · **Canonical spec:** [HIG.md §1](../HIG.md#layer-1-universal-ux-principles) · **Rule IDs:** HIG-MOT-001–005, HIG-VT-001, HIG-A11Y-001

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
    /* Scroll and view timelines ignore time duration. */
    animation-timeline: auto !important;
  }

  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation: none !important;
  }
}
```

A very small `animation-duration` does **not** stop scroll-linked progress. `animation-timeline: auto` returns those animations to the document timeline. Browsers without `animation-timeline` ignore that declaration.

#### Scroll-driven animations

`animation-timeline` (`scroll()`, `view()`, or a named scroll/view timeline) and script-created `ScrollTimeline` / `ViewTimeline` objects are motion (**HIG-A11Y-001**). Firefox 159 (27 October 2026) enables the CSS feature by default. [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline) still marks it limited availability, not Baseline. Keep a usable non-animated path for browsers that lack it.

The browser does not decide whether the movement is decorative or necessary. On document surfaces and on controls, **HIG-MOT-003** still applies. On hybrid or experience surfaces, classify page-level effects with **HIG-EXP-006**, **HIG-EXP-013**, and **HIG-EXP-014**.

Under `prefers-reduced-motion: reduce`, disable the animation or set `animation-timeline` to `auto` or `none`, and keep the same information and actions. A `no-preference` wrapper around the scroll-driven rule meets the same obligation. Verify keyboard scrolling, 200% zoom, and programmatic scrolling. A static check MAY flag a missing timeline reset; it does not judge necessity or distraction, and it does not see Web Animations API timelines.

#### Pointer-driven animations (informative)

Pointer-driven Animations Module Level 1 (Working Draft, 24 November 2026) ties progress to pointer position, in CSS and in the Web Animations API. It is not a baseline and not an automated rule. Treat it as motion (**HIG-A11Y-001**). Pointer position must not be the only way to reach essential information. Provide a keyboard and touch equivalent. Under reduced motion, disable or neutralize the effect; shortening duration is not enough when progress follows the pointer. Decorative movement must not interfere with reading, focus, or interaction. Presence of a pointer timeline is not a pass. See [HIG.md](../HIG.md#pointer-driven-animations-informative).

#### CSS `random()` (informative)

[Firefox 161](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/161) adds CSS `random()`. Use a deterministic fallback and check the project’s browser matrix before enabling it. Use it for decorative variation only. Do not use it for essential layout, or for text and control colors that can fail contrast. Keep visual regression captures deterministic. No new requirement.

#### Animated images (informative)

The outcome covers every animation technology, including GIF, animated PNG, animated WebP, external SVG, video, canvas, and inline SVG. The duration override above does not pause a declarative image. When WCAG 2.2.2 applies, the pause or stop control is visible and keyboard-operable. [CSS Image Animation Level 1](https://www.w3.org/TR/css-image-animation-1/) (Working Draft, 7 November 2026) is an experimental technique for declarative images only. `image-animation` is supporting evidence, never a pass. Do not copy the draft’s example that leaves `img` animations running under reduced motion. Until cross-engine support is stable, keep a static image, video controls, or a script control. See [HIG.md](../HIG.md#animated-images-informative).

* Replace transform/momentum animations with instant state changes or a minimal opacity fade.
* Disable parallax, auto-playing carousels, native View Transitions morphing, decorative looping motion, and unguarded scroll-driven animation.

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
