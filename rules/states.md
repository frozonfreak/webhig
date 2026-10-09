# UI States — Level 2 Module

**Version:** v1.13.0 · **Canonical spec:** [HIG.md §2.5–2.7, §4.3–4.6](../HIG.md#25-error-ux-taxonomy) · **Rule IDs:** HIG-ERR-001, HIG-EMP-001, HIG-LOD-001

> Standalone extract for progressive loading. The complete normative contract remains in [HIG.md](../HIG.md).

---

## 2.5 Error UX Taxonomy

Every error state MUST map to a defined category (**HIG-ERR-001**):

| Category | UI behavior |
| --- | --- |
| **Validation** | Inline field errors; focus first invalid field; preserve input |
| **Authentication** | Clear re-auth prompt; do not expose account existence |
| **Authorization** | Explain insufficient permissions; offer escalation |
| **Network** | Retry action; preserve form state; indicate connectivity |
| **Timeout** | Retry with backoff; show elapsed wait if helpful |
| **Conflict** | Present diff/merge/overwrite options |
| **Rate limit** | Inform wait period; disable submit until eligible |
| **Server (5xx)** | Generic error; retry; log correlation ID internally |
| **Offline** | Degraded mode indicator; queue actions where supported |
| **Partial failure** | Per-item error states; summarize success/failure counts |
| **Unknown** | Fallback error with retry and support contact |

Errors MUST NOT rely on color alone. Each error MUST include text and, where applicable, an icon or pattern.

## 2.6 Empty-State Taxonomy

Empty states MUST be categorized (**HIG-EMP-001**):

| Type | Purpose | Required elements |
| --- | --- | --- |
| **First-use** | Onboard new users | Explanation, primary CTA |
| **No results** | Search/filter returned nothing | Clear message, suggest broadening |
| **Filtered empty** | Active filters exclude all | Show filters; offer clear-filters |
| **Permission empty** | User lacks access | Explain permission; no misleading CTAs |
| **Error empty** | Data failed to load | Error message with retry |
| **Offline empty** | No connectivity | Offline indicator; queued actions |
| **Completed** | All tasks done | Positive confirmation; suggest next action |

## 2.7 Loading-State Taxonomy

Loading states MUST be differentiated (**HIG-LOD-001**):

| Type | When | UI pattern |
| --- | --- | --- |
| **Initial loading** | First page/data fetch | Full-page or region skeleton matching layout |
| **Background refresh** | Stale-while-revalidate | Subtle indicator; preserve content |
| **Mutation pending** | Form submit / action in flight | Disable trigger; inline spinner |
| **Skeleton** | Known layout, unknown content | Layout-matching placeholders |
| **Progressive stream** | Streaming server render | Incremental reveal at boundaries |
| **Pagination loading** | Next/previous page fetch | Inline loader in pagination control |
| **Infinite-scroll loading** | Scroll-triggered fetch | Bottom sentinel; preserve scroll position |

## 4.3 Data Freshness & Stale States

| State | UI behavior |
| --- | --- |
| **Fresh** | Display current data; no indicator needed |
| **Stale** | Show data with subtle staleness indicator; background refresh permitted |
| **Refreshing** | Non-blocking refresh indicator; preserve existing data |
| **Failed refresh** | Retain stale data with error indicator and retry |

## 4.4 Network & Error States

| Failure type | Minimum UI |
| --- | --- |
| **Offline** | Degraded mode indicator; queue local mutations where supported |
| **Timeout** | Retry with backoff; preserve user input |
| **Server error (5xx)** | Error message with retry; do not lose form state |
| **Rate limited (429)** | Inform user; suggest wait/retry |
| **Authorization failure (401/403)** | Redirect or inline permission message |
| **Conflict (409)** | Present conflict resolution UI |
| **Partial failure** | Per-item error states; do not fail entire view silently |

## 4.6 Offline & Degraded Mode

```
online → degraded → offline → local pending mutation → sync → conflict → resolved
```

Applications supporting offline operation MUST define sync, conflict resolution, and user-visible status for each stage.
