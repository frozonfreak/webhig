# Device-posture review

Test design for a layout that adapts to a folded device, and for the continuous layout that every product needs. This is informative guidance. It is not a requirement to use device posture.

Normative text: [HIG.md §3.2](../../../HIG.md#foldable-devices-and-device-posture-informative). The [Device Posture API](https://www.w3.org/TR/device-posture/) is a Candidate Recommendation Draft (17 November 2026). It defines `navigator.devicePosture.type` (`continuous` or `folded`), a `change` event, the `device-posture` media feature, and WebDriver commands that simulate a posture. The draft says it is implemented in Chromium-based browsers. WebKit and Mozilla have published no formal positions. It is not a cross-browser baseline.

## Setup

1. Build one page twice: a continuous layout with no posture query, and an enhancement for `@media (device-posture: folded)` or a `change` listener.
2. Run the continuous layout in a browser with no posture support. It must be complete by itself.
3. Where the test browser supports it, use the WebDriver *Set device posture* command to switch between `continuous` and `folded`. Use a physical foldable when one is available, because posture changes there follow a physical action.
4. Include a centered dialog, a primary button row, a video or large image, and a content region that a posture change relocates.

## Procedure

| Check | Procedure | Expected evidence |
| --- | --- | --- |
| Continuous baseline | Load the page with no posture signal. | All content and controls work. No dependency on the enhancement. |
| Hinge area | In the folded posture, locate the fold. | No primary control, and no dialog button, sits on the fold. |
| Large content | Open the video or image in the folded posture. | It does not span the fold. Where it is placed on one side, the rest of the content stays reachable. |
| Focus order | Tab through the page in each posture. | Focus order follows a meaningful sequence in both. The focused control stays focused after a posture change. |
| Announcement | Move a content region by changing posture, with a screen reader running. | A significant move is announced through an accessible status message. Routine reflow is not announced. Record who judged significance. |
| User control | Look for a way to keep a preferred layout. | The person is not locked into a posture layout. The continuous layout remains available. |
| Reflow and zoom | Repeat 200% text zoom and reflow in the folded posture (§5.1). | No loss of content or function. |
| Assistive technology | Run the checks with a screen reader and keyboard, in each supported posture. | Name, role, state, and order stay correct. Record the AT, browser, and version. |

Record the browser, version, device or simulation method, posture sequence, and assistive technology. Execution pending. Simulation shows layout and event behavior. It does not show how a physical fold feels, so a person confirms that when a device is available. Do not treat a pass here as a requirement for products that never target foldables.
