# Scroll-driven animation fixture

Manual review for CSS scroll-driven animations after Firefox 159 enabled them by default on 27 October 2026. [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline) still marks `animation-timeline` limited availability, not Baseline. The live page is the guarded pattern. An unguarded sample belongs in the static-check test, not in this stylesheet.

Normative rule: [HIG.md §1.3](../../../HIG.md#13-reduced-motion--animation-safety) (**HIG-A11Y-001**). Page-level classification on hybrid or experience surfaces stays **HIG-EXP-006** / **HIG-EXP-013** / **HIG-EXP-014**. Necessity and distraction are manual. `web-hig check` may flag a missing timeline reset; that flag is not a purpose judgment and does not see `ScrollTimeline` or `ViewTimeline` script.

| Check | Procedure | Expected evidence |
| --- | --- | --- |
| Reduced motion before load | Emulate `prefers-reduced-motion: reduce`, then reload. | Marker and bar do not move with scroll. Marker text remains readable. |
| Reduced motion while open | Toggle the preference without a reload, then scroll. | Movement stops or never starts. Content and the scroll button remain usable. |
| Keyboard | Focus “Scroll container”. Use arrow keys, Page Down, and Space where the browser scrolls a focused region. | Focus is visible. The marker can be reached without a pointer. No focus trap. |
| Zoom | Set browser zoom to 200% and scroll. | Text and the marker remain available. No horizontal-only trap and no overlap that hides the heading or button. |
| Programmatic | Activate “Scroll the container”. | The region scrolls and keeps keyboard focus. Reduced motion still suppresses the timeline. |
| Unsupported browser | Open in a browser without `animation-timeline`. | The marker text, heading, and button are usable with no motion dependency. |

Record the browser, version, input method, zoom, and reduced-motion state. Do not treat support in Firefox 159 as Baseline or as permission to skip the reduced-motion path.
