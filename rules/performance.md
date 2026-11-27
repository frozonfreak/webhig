# Performance & Web Vitals — Level 2 Module

**Version:** v1.20.0 · **Canonical spec:** [HIG.md §6](../HIG.md#layer-6-performance--web-vitals) · **Rule IDs:** HIG-PERF-001–004 · **Archetypes:** Universal

> Standalone extract for progressive loading. The complete normative contract remains in [HIG.md](../HIG.md).

---

Performance requirements split into **lab (CI)** and **field (RUM)** contexts (**HIG-PERF-002**). Synthetic lab tests are **not equivalent** to field Interaction to Next Paint (INP).

**HIG-PERF-001** is the measured LCP, INP, and CLS result. A loading, scheduling, or image API is not that result. A vendor 50 ms main-thread example is not an extra threshold. See [agent-consumption.yaml](./agent-consumption.yaml).

## 6.1 Core Web Vitals & Supporting Metrics

### Core Web Vitals (field RUM / SLO monitoring)

Projects MUST protect Core Web Vitals thresholds for applicable routes (**HIG-PERF-001**):

| Metric | HIG Target | HIG Acceptable | Gate type |
| --- | --- | --- | --- |
| Interaction to Next Paint (INP) | ≤ 100 ms | ≤ 200 ms | Field SLO |
| Largest Contentful Paint (LCP) | ≤ 1.2 s | ≤ 2.5 s | Lab + Field |
| Cumulative Layout Shift (CLS) | ≤ 0.02 | ≤ 0.10 | Lab + Field |

### Supporting metrics

| Metric | HIG Target | HIG Acceptable | Gate type |
| --- | --- | --- | --- |
| Time to First Byte (TTFB) | ≤ 200 ms | ≤ 800 ms | Lab + Field |
| Synthetic interaction latency | ≤ 100 ms | ≤ 200 ms | Lab / CI |

TTFB is **not** a Core Web Vital.

## 6.2 Lab Performance (CI)

Lab/CI gates SHOULD enforce synthetic interaction latency (not field INP), LCP, CLS, TTFB (synthetic), JS execution time, and bundle size budgets (**HIG-PERF-002**).

### Long animation frame diagnostics

Chrome 157 can separate style time from layout time on Long Animation Frames. The fields are not in every major browser. Feature-detect them, and do not treat a missing field as zero.

| Field | What a high value suggests |
| --- | --- |
| `styleDuration` | Rendering-phase style. Inspect selector complexity, invalidation scope, and frequent class or custom-property changes. |
| `layoutDuration` | Rendering-phase layout. Inspect geometry, DOM size, and containment. |
| `forcedStyleDuration` | Synchronous style after a DOM or style write, such as `getComputedStyle()`. |
| `forcedLayoutDuration` | Synchronous layout after a DOM or style write, such as `getBoundingClientRect()` or `offsetWidth`. |

If the separate fields are absent, keep combined style-and-layout timing (`forcedStyleAndLayoutDuration` and the frame’s combined style-and-layout duration). Do not invent a split. This explains a poor INP. It does not add a pass/fail and does not change §6.1 or **HIG-PERF-001**. See [HIG.md §6.2](../HIG.md#long-animation-frame-diagnostics).

## 6.3 Field Performance (RUM)

Field monitoring/SLO gates SHOULD track INP, LCP, CLS, TTFB. Field INP MUST be treated as monitoring/SLO — not as deterministic build-failure from synthetic tests (**HIG-PERF-002**).

### Stable Core Web Vitals and experimental soft navigations

**HIG-PERF-001** judges the stable LCP, INP, and CLS thresholds in §6.1, the same series Search Console uses. Those thresholds are unchanged.

The September 2026 CrUX dataset (published 13 October 2026) adds experimental variants that include Chromium soft navigations: `experimental_largest_contentful_paint_with_softnavs`, `experimental_interaction_to_next_paint_with_softnavs`, and `experimental_cumulative_layout_shift_with_softnavs`. They are available in CrUX BigQuery, the CrUX API, and the CrUX History API, and CrUX Vis can chart that dataset. Detection is Chrome field data, not a cross-browser metric. Chrome aims to graduate them in May 2027, subject to feedback; that is not a HIG date. Search Console keeps the stable scores until then.

Reports that show these values, including HIG Audit, MUST present stable and experimental series separately, label the experimental series, record the dataset month (the collection period), and MUST NOT combine their pass/fail. An experimental result neither satisfies nor, by itself, fails **HIG-PERF-001**.

## 6.4 Performance Budgets

Projects SHOULD define performance budgets beyond Web Vitals (**HIG-PERF-003**).

| Budget | Purpose |
| --- | --- |
| Initial JS | First-load JavaScript weight |
| Total JS | Aggregate JavaScript |
| CSS | Stylesheet weight |
| Image weight | Per-page image payload |
| Font weight | Font file payload |
| Third-party JS | External script weight |
| Hydration time | Client island hydration duration |
| Long tasks | Main-thread blocking |
| DOM size | Node count limits |

**Shared compression dictionaries (informative).** Firefox 161 adds Compression Dictionary Transport. Chrome has supported it since version 130. Safari remains a compatibility limit. Optional transport only. Negotiate the dictionary and vary the cache. Measure the transfer and any LCP change. Support is not a conformance pass and not a Core Web Vitals result.

## 6.5 Regression-Based Gates

PRs that increase initial JS by >10% (or other project-defined thresholds) SHOULD fail unless explicitly approved — even when below the absolute limit (**HIG-PERF-004**).

## 6.6 Resource adaptation (informative)

The [Compute Pressure API Level 1](https://www.w3.org/TR/compute-pressure/) (Candidate Recommendation Draft, 21 November 2026) reports `nominal`, `fair`, `serious`, and `critical`. Chromium implements it. WebKit has published an opposing position. Mozilla’s position is pending. It is not a baseline.

Do not require the API. Do not score it as a Core Web Vital or as **HIG-PERF-001**.

When an application adapts to pressure, prioritize sign-language interpreter streams and other streams the person has pinned. If an essential stream cannot be sustained, explain what changed and offer an accessible recovery path. A load indicator needs more than color. A notice of restricted functionality is available to assistive technology and dismissible without an unnecessary interruption. The browser’s own observation notice is the browser’s control.

Test resource adaptation and the ordinary experience when a signal is unavailable. For Compute Pressure integrations, use virtual pressure sources where the browser supports them. See [HIG.md §6.6](../HIG.md#66-resource-adaptation-informative) and the [fixture](../examples/audit-fixtures/compute-pressure/README.md).

## Practical guidance

* Avoid unnecessary JavaScript — default to server rendering (HIG-SSR-001).
* Lazy-load non-critical resources; optimize images with intrinsic dimensions.
* Avoid blocking critical rendering path; preload only critical fonts when evidence supports it.
* Protect interaction latency: prefer `transform`/`opacity` for micro-feedback — see [animation.md](./animation.md).
