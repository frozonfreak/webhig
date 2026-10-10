# Expected results

Illustrative fixture. These outcomes are acceptance checks for the example, not new Web HIG requirements.

| Check | Expected | Method |
| --- | --- | --- |
| Positive CSS | Computed `transition-property` on the conforming button is `background-color, transform`. It does not include `all`, `width`, `height`, or `inline-size`. Duration is the fast motion token (100ms). | Source rule plus computed style |
| Normal-motion press | Pointer press changes background and applies a scale transform. No bounce keyframes. | Browser input, computed style during press |
| Post-validation width | Conforming button changes from 140px to 240px with no intermediate widths and no `inline-size` or `width` transition event. | In-page frame samples and `transitionrun` |
| Negative example | The comparison button’s computed `transition-property` is `all`. Seeking across that dimension transition yields a used width strictly between the 140px and 240px endpoints. The momentum curve is near the end at half the duration, so the spec searches the timeline rather than assuming a linear midpoint. | Expected failure of unscoped transition; browser measurement |
| Reduced motion | Emulated `prefers-reduced-motion: reduce`. Press transform is `none`. Background still changes. Width snaps. Error remains understandable. | CDP media emulation plus the same width watch |
| Keyboard and focus | Tab reaches each button. Enter activates the conforming check. Space activates the comparison. Focus outline is at least 3px and not `none`. | Synthetic keyboard and computed outline |
| Validation semantics | After a check, the field is `aria-invalid="true"`, `aria-describedby` points at the error, the error text is “Error: Enter the 6-digit reference code.”, focus is on the field, and there is no live region or alert. | DOM plus accessibility tree |
| Layout | The isolated fixture intentionally changes button size and inserts the error. Frame samples must not show the size animating on the conforming control. | Width samples. Full-page CLS and a screen-reader pass are not claimed by this spec. |

## Not claimed

- Screen-reader speech. The accessibility tree is checked; a human screen-reader pass is still required before treating announcement behavior as verified.
- Core Web Vitals field data. The fixture deliberately changes layout.
- Conformance of any third-party squash-and-stretch reference. That reference is deferred and is not loaded.

## Last automated run

10 October 2026, this workspace, system Edge (headless), `regression.spec.mjs`.

| Observation | Result |
| --- | --- |
| Conforming button at rest | 140px. Computed transition properties: `background-color, transform`. Duration `0.1s`. |
| After validation | 240px on the next frames. No `width` or `inline-size` transition event. No sample strictly between the endpoints. |
| Comparison control | Computed transition property `all`. Seeking the width transition found an interior used width of 168.09375px (rest 140px, end 240px). The same interior width was measured for the Space-key activation. |
| Reduced motion | Emulated `prefers-reduced-motion: reduce`. Press transform was `none`, background still changed, width snapped, error stayed associated with the field. |
| Keyboard | Tab, Enter, and Space activated the labeled controls. Focus outline was at least 3px. |
| Accessibility tree | Reference code textbox was invalid and described by the 6-digit error. No alert or status role. |

Screen-reader speech was not observed in this run. Core Web Vitals were not measured.
