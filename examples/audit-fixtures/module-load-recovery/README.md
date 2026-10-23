# Route and feature module recovery review

Review the existing [error recovery contract](../../../HIG.md#25-error-ux-taxonomy). Serve this folder over HTTP with a JavaScript MIME type for `.mjs` and open [index.html](./index.html). The initial dynamic import deliberately requests a missing module; Retry loads the available [feature.mjs](./feature.mjs). This illustrates recovery using a different module URL, not browser support for repeating the same failed import.

## Fixture procedure

1. Type a distinctive draft in the Notes field; activate Load feature with the keyboard.
2. Verify that a real failed `import()` produces meaningful error text, a visible Retry button and no unhandled rejection or blank screen. The draft must remain unchanged.
3. Tab to Retry, verify visible focus, and activate it with Enter or Space. Confirm the feature loads, completion is announced and the draft remains intact. Focus must remain on a useful control.
4. Block `feature.mjs` in browser network tools and retry again after reloading the fixture. Confirm repeated failure returns to the error state and permits another recovery attempt.

## Product audit procedure

Intercept a lazy route or feature request in the product and fail its first dynamic import. Keep a draft populated before triggering the load. Assert meaningful visible error text, keyboard-operable recovery, retained input and a terminal success or error state. Repeat with continued failure, then restore the resource and verify recovery. Ensure recovery never replays a pending write, payment or delete.

Run in the project's supported Chromium, Firefox and Safari versions; record browser/OS versions, failed URL, recovery strategy, focus and draft evidence. Test a real route boundary as well as an isolated feature where both exist. If recovery reloads the document, verify draft restoration before asserting a pass.

Chrome's [milestone 156 notes](https://chromestatus.com/release-notes/156) describe manual retries of failed module loads (scheduled stable date 20 October 2026, still labeled Preview when checked). This is not a universal platform guarantee. Test same-URL retries separately if the product uses them. Other implementations may need a refreshed/versioned URL or reload with draft restoration; an endless retry of a cached failure is not recovery.

Status: fixture and review procedure provided; browser, keyboard and AT execution pending. These checks require controlled runtime evidence and do not introduce a static website audit heuristic.
