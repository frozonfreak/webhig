# Content / Marketing review fixtures

**Informative selected-check fixtures.** They add no requirements, stable IDs, severities or audit gates. [HIG.md](../../../HIG.md) remains authoritative. Copy the [manual worksheet](../../content-marketing/review-worksheet.md) for production review; see the [applied guide](../../content-marketing/README.md).

## Scope and design record

| Fixture | Scope declared for this test | Purpose |
| --- | --- | --- |
| [document.html](./document.html) | `content`, `surface: document`, no page-level motion | Headings, image alternative, real in-page link, keyboard and reflow |
| [hybrid.html](./hybrid.html) | `content`, `surface: hybrid`; illustration `spatial` / Tier 2 | Same document spine plus optional user-triggered movement; reduced-motion and enhancement-unavailable comparisons |

Map: produced — one fictional notebook with an observation, review comment and publication checklist; the workflow link targets the matching semantic section. Comparison navigation switches between two independent fixture documents.

Audience: maintainers rehearsing content checks, occasional use on keyboard/pointer and narrow/wide viewports. Errors could teach incorrect applicability, so the scope is explicit. Purpose: reading and comparison. Presentation: a single editorial column using local semantic/component tokens, system fonts, two heading levels and conventional underlined links. No theme or conversion pattern is prescribed. The labeled SVG is an illustration, not fabricated product evidence; as a vector it scales without raster resolution variants. No web fonts, third-party media, forms or async content are present.

Focus uses the project-style visible outline; no sticky overlays. Read-only workflow text needs no disabled/error states. The enhancement control stays hidden if initialization fails, while essential text and navigation are already in HTML. The 600ms movement is a page-level spatial effect, not control micro-feedback; its purpose is to make parity testable. It never hides content, blocks an action, loops or scroll-captures. Under reduced motion it is static. Use native HTML and the existing HIG requirements; Design Decision Method 2.1.0 informed this small fixture record.

These local fixtures are non-shareable/noindex test routes, with no duplication/canonical or warranted structured-data scenario. Their metadata is not a complete production SEO example. SVG text may become small at narrow widths: the independent HTML explanation/workflow retains the meaning.

## Procedure and expected results

Serve this folder with a local static HTTP server and open both pages. Repeat using the product's supported browser matrix. Record browser/OS, viewport, preference, zoom, enhancement state, evidence and date. Each row below is a procedure, **not a claim that it has been executed**.

| Test | Existing requirement / applicability | Expected result | Failure mode to detect |
| --- | --- | --- | --- |
| Inspect headings, landmarks and accessibility tree on both pages | HIG-DOC-002; HIG-A11Y-002/003; hybrid also HIG-EXP-007 | One main; logical h1/h2 and workflow list; illustration meaning available | Missing landmark, inaccessible primary copy, or visual-only reading order |
| Tab, Shift+Tab and Enter through skip link, navigation and workflow link | HIG-A11Y-002/006; HIG-DOC-002; hybrid also HIG-EXP-004 | Visible focus, no trap; real destinations; skip link reaches main; workflow action reaches section | Invisible focus, pointer-only action, dead link or unreachable section |
| Activate the hybrid replay button using keyboard | HIG-A11Y-002/003/006; HIG-EXP-006/014 | Native button, retained focus, brief bounded spatial effect, all primary content still usable | Inaccessible replay or movement gating the workflow |
| Emulate reduced motion before loading and while the page is open; activate replay | HIG-A11Y-001; hybrid also HIG-EXP-003 | Static illustration; equivalent headings, explanation, workflow and primary link | Hidden copy, broken layout, ongoing movement or lost primary action |
| Disable JavaScript or block fixture.js, then reload hybrid page | HIG-EXP-010 (hybrid) | Heading, explanation, image, workflow and primary link remain; enhancement-only replay control is absent | Empty mount, loader-only shell or primary content inserted only by script |
| Inspect document page with JavaScript disabled | Advisory comparison; do not universalize HIG-EXP-010 | Static page remains readable by construction | Record observations under actual document/a11y requirements, not an invented no-JS gate |
| Test narrow/wide viewports, 200% text zoom and 400% reflow | HIG-A11Y-002; HIG.md §5.1 with WCAG exceptions | No loss of accessible primary content/actions or unintended page-wide horizontal scrolling | Clipped explanation, off-screen actions, hidden restrictions |
| Inspect image and block notebook.svg | HIG-A11Y-005; HIG-DOC-005 | Descriptive alt; 640×320 intrinsic dimensions; HTML workflow retains meaning on image failure | Missing/irrelevant alt, missing reserved geometry, image-only meaning |
| Inspect network and image loading | HIG-DOC-005; HIG-PERF-001/002 measurement distinction | No lazy attribute on this immediately needed image; record measured behavior separately | Treating source inspection or a tiny local fixture as a production CWV pass |

For negative rehearsal, in a disposable copy remove `alt`, remove the focus style, or move the hybrid workflow into script-only insertion. Repeat only the corresponding check and record the expected failure. Do not ship those mutations or treat passing unrelated checks as evidence for the mutated behavior.

## Execution record

Manual browser/keyboard/assistive-technology execution: **not tested** at authoring. Automated repository checks, if run, validate repository integrity and existing tests; they do not execute this matrix. Record executed rows and environments here or in an attached worksheet before claiming a result. Production performance, media controls, third-party scripts, forms, other surfaces and business outcomes are outside this fixture's verified coverage.

### Implementation verification — 2026-10-24

- Repository validation, lint, full existing test suite, documentation build, Quick-map freshness and whitespace checks passed for v1.15.0. Windows workspace-link permissions required running dependency installation and the test suite outside the sandbox.
- Compared against baseline commit `628ccf3366c17eb69d36a393849615c42270ae0e` (v1.14.0): normative body, Quick/Lite/Core, evaluator and 36 tracked rule/framework/schema files are unchanged after normalizing version metadata and excluding the labeled informative content-pack addition. IDs, mappings, severity, applicability and motion permissions are preserved.
- The pre-commit version-bump command skipped because HEAD equaled its comparison ref; a separate baseline comparison confirmed 1.14.0 → 1.15.0 and the required changelog/release-note entries.
- The browser tool timed out reaching the local HTTP fixture server. No manual matrix row is marked passed. The existing motion browser regression passing does not establish execution of these new fixtures.
