# Firefox 158 Android — TalkBack asynchronous update review

**Status:** Informative manual checklist; device testing pending.  
**Sources:** [Firefox 158 release notes](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/158#accessibility), [WAI-ARIA 1.2 `aria-busy`](https://www.w3.org/TR/wai-aria-1.2/#aria-busy).  
**HIG basis:** Existing [WCAG 2.2 AA baseline](../../rules/accessibility.md); no new mandatory attribute, browser matrix or automated conformance rule.

Use an actual Android device with Firefox 158 or later and TalkBack. Record the device, Android, Firefox and TalkBack versions, live-region markup, announcement settings and steps. Test a product's incrementally updated live region or streamed response with an explicit, repeatable way to complete, cancel and fail the operation.

| Scenario | Review evidence |
| --- | --- |
| Completion | For an implementation using `aria-busy`, it becomes true during updates and false when complete. TalkBack delivers the intended final content or completion status without moving focus unexpectedly. |
| Cancellation | Busy state clears; the cancelled state is exposed and the intended cancellation status is announced. A late response does not announce stale success. |
| Error | Busy state clears; useful error/recovery information is exposed and the intended error status is announced. |
| Retry / repeated run | The next operation can enter and exit busy state normally; prior content is not replayed as a new result. |
| Incremental delivery | Announcement frequency fits the intended interaction. Verify that deferred updates do not remain silent after completion or produce an unusable announcement backlog. |

Inspect both state transitions and audible output. An attribute-presence check is insufficient. Releasing `aria-busy` does not by itself guarantee an announcement: live-region setup, timing and browser/AT behavior also matter. These scenarios do not prescribe that every product announce its entire response or suppress every intermediate update.

Record each scenario as pass, fail or not tested, with the actual spoken output and timing. If testing is unavailable, report **not tested**, never a pass inferred from Firefox support. Compare a minimal reproduction in another relevant browser/AT combination when diagnosing a failure; distinguish authoring defects from browser/AT defects before assigning a HIG violation.

This checklist is available for audit-site adoption; it is not evidence that the separate audit site has implemented the checks.
