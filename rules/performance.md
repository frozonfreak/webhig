# Performance & Web Vitals — Level 2 Module

**Version:** v1.13.0 · **Canonical spec:** [HIG.md §6](../HIG.md#layer-6-performance--web-vitals) · **Rule IDs:** HIG-PERF-001–004 · **Archetypes:** Universal

> Standalone extract for progressive loading. The complete normative contract remains in [HIG.md](../HIG.md).

---

Performance requirements split into **lab (CI)** and **field (RUM)** contexts (**HIG-PERF-002**). Synthetic lab tests are **not equivalent** to field Interaction to Next Paint (INP).

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

## 6.3 Field Performance (RUM)

Field monitoring/SLO gates SHOULD track INP, LCP, CLS, TTFB. Field INP MUST be treated as monitoring/SLO — not as deterministic build-failure from synthetic tests (**HIG-PERF-002**).

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

## 6.5 Regression-Based Gates

PRs that increase initial JS by >10% (or other project-defined thresholds) SHOULD fail unless explicitly approved — even when below the absolute limit (**HIG-PERF-004**).

## Practical guidance

* Avoid unnecessary JavaScript — default to server rendering (HIG-SSR-001).
* Lazy-load non-critical resources; optimize images with intrinsic dimensions.
* Avoid blocking critical rendering path; preload only critical fonts when evidence supports it.
* Protect interaction latency: prefer `transform`/`opacity` for micro-feedback — see [animation.md](./animation.md).
