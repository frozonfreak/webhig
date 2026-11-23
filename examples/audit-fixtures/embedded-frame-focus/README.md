# Embedded-frame focus review

Manual or integration review for a dialog or popover opened by script in an embedded frame, such as an authentication, payment, or application widget. The outcome is the existing one: focus moves into the dialog, stays there while it is modal, and returns to the trigger.

Normative text: [HIG.md §5.3](../../../HIG.md#embedded-content-and-programmatic-focus-informative) (**HIG-A11Y-008**, **HIG-A11Y-006**). This fixture does not add a rule or change **HIG-A11Y-008**. It is not a static HTML scan: the header or `allow` attribute lives on a different document from the code under test.

Chrome 158 (17 November 2026) adds the `focus-without-user-activation` Permissions Policy. The default allowlist is `*`, so the policy is opt-in. When it is denied for the frame that starts a focus change, `element.focus()`, `window.focus()`, `autofocus`, and the focusing steps of dialogs and popovers are blocked. Transient user activation, focus already inside the frame, and focus delegated by a focused parent are exceptions. Click and Tab are never blocked. A dialog or popover still opens. No Safari or Firefox support is claimed.

## Setup

1. Host the widget on a second origin, or use a second origin on another port.
2. Embed it twice from a parent page: once with `allow="focus-without-user-activation 'none'"` on the `iframe`, and once with no restriction. A `Permissions-Policy: focus-without-user-activation=()` response header on the parent is a third variant.
3. In the widget, provide a button that opens a `<dialog>` with `showModal()` and another that opens a `popover`, each with a text field and a close button. Add a variant that opens the same dialog from a `setTimeout` and from a `postMessage` handler, so that no transient user activation applies.
4. Add a link or field before and after the iframe so the Tab sequence around it can be observed.

## Procedure

| Check | Procedure | Expected evidence |
| --- | --- | --- |
| Open from a click | Activate each trigger with the keyboard and with a pointer, policy denied. | Record where focus lands. A click or key press supplies transient activation, so focus is expected to enter the dialog. Record the browser and version. |
| Open without activation | Trigger the timer and `postMessage` variants, policy denied. | The dialog or popover opens. Record whether focus entered it. If it did not, the widget keeps a visible way to proceed or dismiss, and every control remains reachable with Tab and Shift+Tab. |
| User-initiated focus | Click into the frame, and Tab into and out of it, policy denied. | Not blocked. Focus indicator visible and not obscured (**HIG-A11Y-006**). |
| Escape and close | With the dialog open, press Escape and use the close control. | The dialog closes. Where focus never entered the dialog, record how a keyboard user closes it. |
| Focus return | Close the dialog opened from a click. | Focus returns to the trigger. |
| Delegation | From the parent, after a user action, move focus into the frame (for example `iframe.focus()`), then repeat the open and close checks. | The frame can move focus inside itself once it has focus. |
| Baseline | Repeat the click and no-activation checks with the policy allowed, and in a browser that does not implement the policy. | Dialog behavior is unchanged from the existing requirement. |

## Recording

Record the browser, version, operating system, input method, policy source (header or `allow`), the opening path (click, key, timer, `postMessage`), where focus landed, and whether a keyboard user could reach and dismiss the dialog. Execution pending. Do not encode a blocked focus move as an author failure when the embedder denied the policy and the widget kept the dialog reachable. Do not treat a visible dialog as proof that focus entered it.
