# Safari 27.2 — VoiceOver review

Source: [WebKit features for Safari 27.2](https://webkit.org/blog/18515/webkit-features-for-safari-27-2/), 26 October 2026. This is a stable Safari release, unlike the Technology Preview notes for builds 254 and 255. The fixes do not create a new WCAG requirement and do not establish behavior in other browser and assistive-technology pairs.

Review these fixtures. Record the OS, Safari build, VoiceOver or other AT version, input method, accessibility-tree snapshot, and spoken output. Results start untested. Do not infer a pass from DOM attributes or from an automated scan.

| Scenario | Fixture | Procedure | What to record |
| --- | --- | --- | --- |
| Streamed response, append | [streamed-live-region.html](./streamed-live-region.html) | With VoiceOver on, activate “Append next sentence” twice. Do not use the re-render button in the same pass. | Whether each new sentence is announced once, and whether earlier text is spoken again. |
| Streamed response, re-render | Same page | Reset, then activate “Re-render next sentence” twice. That region replaces the full string and sets `aria-atomic="true"`. | Whether Safari 27.2 avoids repeating text it already announced. Then repeat both strategies in at least one other browser/AT pair. |
| List, table, tree, canvas in a referenced container | [accname/complex-referenced-content.html](./accname/complex-referenced-content.html) | Inspect the accessibility tree and listen to each button’s name or description. | Whether list items, table text, tree items, and canvas fallback content are included. Compare Safari 27.2 with another engine. Keep the content in the referenced container; do not treat an engine omission as an author failure by itself. |
| Date, time, and color on iOS | [safari-27-2-inputs.html](./safari-27-2-inputs.html) | On iOS with VoiceOver, focus each labeled control. | Whether VoiceOver identifies the native date, time, and color inputs as pop-up buttons. Record desktop announcements separately. Keep the native controls. |

Use both append and re-render when testing a product’s streamed AI responses. Safari 27.2 does not retire checks on Firefox/TalkBack, Chromium, or other AT combinations. See also the [Firefox 158 TalkBack checklist](./firefox-158-android-talkback.md) for incremental regions.
