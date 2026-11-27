# Compute Pressure and accessible adaptation review

Use this procedure for a product that adapts under resource pressure. See [HIG §6.6](../../../HIG.md#66-resource-adaptation-informative) and the [Compute Pressure Level 1 draft](https://www.w3.org/TR/2026/CRD-compute-pressure-20261121/).

1. Choose a scenario with an essential item, a user-pinned item, and optional work that the application can reduce. In a video call, these can be an interpreter, another pinned participant, and unpinned thumbnails.
2. In a test browser that implements the draft’s WebDriver extensions, create a virtual `cpu` pressure source before the page begins observing it. Set each sample and wait for observation and application adaptation before moving to the next one. Delete the source during cleanup. A stub can exercise application behavior when the native simulation is unavailable.
3. Review with keyboard and screen reader. Record the browser, version, signal source, assistive technology, state sequence, and observed behavior.

| Scenario | Expected evidence |
| --- | --- |
| Rising pressure | Drive `nominal`, `fair`, `serious`, and `critical`. Confirm the application reduces optional work according to its policy while preserving essential and pinned content. |
| Essential content is interrupted despite prioritization | When the product has a degradation path for this case, exercise it. Confirm the message identifies the impact and the user can reach an accessible recovery action. |
| Restricted functionality | The site conveys meaningful status without color alone, keeps focus in the task, and makes any dismissible notice keyboard-operable. |
| Recovery | Return to `nominal`. Check how the product restores functionality and whether it retains the user’s pin and focus. |
| Missing signal | Test with the API absent or observation unavailable. The ordinary experience remains usable. |

Record browser-owned observation notices separately. These checks cover adaptive behavior. Core Web Vitals are measured through their existing procedures. Execution pending.
