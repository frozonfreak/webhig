# Safari Technology Preview 255 — dynamic control review

Source: [WebKit release notes, 22 October 2026](https://webkit.org/blog/18482/release-notes-for-safari-technology-preview-255/). Preview fixes do not establish stable Safari behavior or new WCAG requirements. Review the runnable [native control fixture](./dynamic-controls.html) with VoiceOver on macOS.

| Scenario | Procedure | Expected evidence |
| --- | --- | --- |
| Insert/remove list-box options | Navigate the native list box; use Add option, return to it, and inspect/announce the new option. Select the added option, use Remove added option and revisit the list box. Repeat updates while inspecting the accessibility tree. | Current options appear in the tree and VO navigation; removed options do not persist; selection and focus remain meaningful. |
| Required radio group | Navigate both radios in the fieldset. Only the first has `required`. Submit with no selection, then select the second radio and resubmit. | Group requirement is exposed; native validation rejects no selection and accepts either selection. Record announcement differences separately from validity. |
| AT-triggered activation | Use VO activation on Activate once. Compare keyboard Enter/Space and pointer click in separate runs. | Each action increments the count exactly once. Record `click` event detail as diagnostic evidence only; do not use detail or pointer origin to gate activation. |

Record macOS, Safari stable/TP build and VoiceOver versions, input method, tree snapshots, spoken output and activation counts. Compare stable Safari with TP 255 and other browser/AT combinations where available. Results are pending; do not infer an AT pass from DOM attributes or automated scans.

Keep correct native labeling, grouping and semantics ([HIG §5.2](../../HIG.md#52-native-html-over-aria)). Triage implementation defects separately: a WebKit tree/activation bug with correct author markup is not automatically an author WCAG failure. Document the affected browser/AT combination and user impact; do not require custom widgets solely to bypass a preview bug.
