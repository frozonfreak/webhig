# Safari Technology Preview 254 — VoiceOver review matrix

**Source:** WebKit / Safari Technology Preview 254 (2026-10-08)  
**HIG action:** Audit-site / manual AT review only — **do not** encode WebKit bugs as author failures.  
**No new authoring rules** from these fixes. Prefer native controls and real browser/AT combinations.

Experimental CSS in this TP (`interpolate-size`, `calc-size()`, `symbols()`, linked parameters) is **out of scope** for HIG recommendations and automated audit rules until stable cross-browser.

## Scenarios

| # | Scenario | Setup | Pass signal | Notes |
| --- | --- | --- | --- | --- |
| 1 | Native **date** input | `<input type="date">` with visible `<label>` | VoiceOver announces control role/value without duplicated or missing labels | Prefer native control; do not fail authors for prior WebKit VO bugs |
| 2 | Native **time** input | `<input type="time">` with visible `<label>` | Same as date | Same |
| 3 | Native **color** input | `<input type="color">` with visible `<label>` | Role and value announced usefully | Same |
| 4 | `pointer-events: none` styling | Focusable control visually overlaid / styled with `pointer-events: none` on a decorative layer, not the control itself | Activation via VO still reaches the real control | Do not mark author fail if WebKit previously blocked activation |
| 5 | ARIA **menu item** state | `role="menuitem"` / `menuitemcheckbox` / `menuitemradio` with checked/disabled | State changes announced once, correctly | Compare Chromium + Firefox; platform differences ≠ automatic HIG fail |
| 6 | Compound **form error** text | Field + `aria-describedby` pointing at shared + field-specific errors | Errors announced in a stable order without harmful repetition | Aligns with existing form-error guidance; TP fix is engine-side |

## Review procedure

1. Safari Technology Preview 254+ (or the Safari train that absorbed these fixes).
2. VoiceOver on; use rotor / form controls / interaction as appropriate.
3. Record engine + OS + VO version with the result.
4. If behavior still fails after the TP fix train, file/track as a **browser** issue unless markup clearly violates AccName / HTML-AAM.

## Explicit non-actions

- Do **not** add automated audit failures that assume pre-254 WebKit bugs.
- Do **not** add HIG rules for TP-only CSS features.
- Do **not** require custom date/time/color widgets when native inputs meet the product need.
