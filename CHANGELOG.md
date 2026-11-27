# Changelog

All notable changes to **The Web HIG contract** are documented here.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).  
Versioning policy: [VERSIONING.md](./VERSIONING.md).  
Expanded adoption notes: [RELEASE_NOTES.md](./RELEASE_NOTES.md).

## Unreleased

### Tooling

- Add `doctor`, scoped verification coverage, strict check preconditions, and a shared versioned evidence schema. Partial static checks never imply verified passes.
- Validate YAML settings and registry metadata; fix glob scope selection, automatic vendored-registry discovery, and configured severity gates.
- Make Quick installation usable by the CLI, generate initial project configuration, preserve user settings, reject incompatible pins and malformed merge blocks before writes, and resolve `init` through its declared installer dependency.
- Add metadata impact previews for upgrades, source-layout installation regressions, and a Windows/Linux/macOS tooling test matrix. Track remaining adoption and behavioral verification gates in [READINESS.md](./READINESS.md).

---

## [1.20.0] - 2026-11-27

### Added

- Informative guidance for [digital credentials](./HIG.md#digital-credentials-informative) and [resource adaptation](./HIG.md#66-resource-adaptation-informative). The audit fixture index includes manual and integration procedures for each.
- Agent product guidance for [user-visible authority and intervention](./HIG.md#75-user-visible-agent-control-boundaries-informative) and [review of generated records](./HIG.md#76-generated-drafts-and-records-informative).
- [27 November research disposition](./docs/research/2026-11-27-brief.md), including pointer-driven motion and optional Firefox 161 techniques.

---

## [1.19.0] - 2026-11-20

### Changed

- Agent execution review (§7.4) adds target verification before a state-changing operation and result verification after it. Resolve the target against live state at call time, validate the object and scope, and ask when the reference is ambiguous. Treat remembered tool use, skills, and memory as a hint and read the current definition. Read back the affected state, check the intended postcondition rather than the API success response, report completion only when verified, and distinguish attempted, accepted, queued, and completed. Scale verification to consequence. Informative review guidance, not a website audit rule.
- Embedded content and programmatic focus (§5.3): Chrome 158 adds the opt-in `focus-without-user-activation` Permissions Policy. When it is denied, `focus()`, `autofocus`, and dialog and popover focusing are blocked without transient user activation or focus already in the frame, and a dialog can still open without receiving focus. Do not assume automatic focus succeeded, and test it with an iframe fixture. Manual or integration test, not a static scan. **HIG-A11Y-008** is unchanged.
- Foldable devices (§3.2): informative Device Posture guidance. The continuous layout works with no signal, important controls stay off the fold, large content does not span it, no single posture is assumed, and significant layout changes are announced. Device Posture is Chromium-only and has no mandatory use.
- Location accuracy (§5.5): `coords.accuracy` is a 68% confidence radius, so describe it as approximate and test permission, timeout, cache, fresh acquisition, and error states per feature.
- Audit outcomes (§8.3) list embedded-frame focus, device posture, and text embedded in images as manual or integration review. New fixtures: [embedded-frame-focus](./examples/audit-fixtures/embedded-frame-focus/README.md) and [device-posture](./examples/audit-fixtures/device-posture/README.md). Consumption metadata for **HIG-A11Y-005** and **HIG-A11Y-008** has a 2026-11-20 source date.
- [20 November research disposition](./docs/research/2026-11-20-brief.md).

### Unchanged

- WCAG mappings, rule IDs, severities, conformance scores, and Core Web Vitals thresholds. The open WCAG PR #5446 on contrast for text in images, ARIA `listview`, CSS `text-autospace-size`, View Transitions `shadowRoots`, and the Web Install API are tracked and deferred. No new requirement for any of them.

---

## [1.18.0] - 2026-11-13

### Changed

- Accessibility, forms, motion, and performance rules now carry agent consumption metadata: maturity, minimum browser target, fallback, automated checks, manual checks, and source date ([rules/agent-consumption.yaml](./rules/agent-consumption.yaml)). Audits judge the observable result. A modern API is not a pass. When a rule defines a fallback, test the native branch and the fallback branch in different engines. Focus behavior, motion necessity, form-error timing, and assistive-technology announcements stay manual.
- Animated images stay on the existing outcome for every animation technology. `image-animation` from the 7 November 2026 Working Draft is an experimental technique for declarative images only. Presence of the property is not a pass. Static-image, video, or script fallbacks remain until cross-engine support is stable (**HIG-A11Y-001**).
- [13 November research disposition](./docs/research/2026-11-13-brief.md).

### Unchanged

- WCAG mappings, HIG conformance scores, Core Web Vitals thresholds, rule IDs, and severities. WAI’s 10 November ATAG note is tracked and does not add an AI-authoring requirement. Firefox 160 and the 9 November Media Session draft do not change guidance.

---

## [1.17.0] - 2026-11-06

### Changed

- Supported color schemes must be declared in the document head or initial CSS, before JavaScript. `light dark` is the usual declaration when both schemes are supported. `light only` is a narrow opt-out, not the default. Safari 27.3 Adaptive Dark Mode can repaint an undeclared light page, and computed styles still return authored colors. That repaint, and Safari’s 4.5:1 aim, are not WCAG conformance (**HIG-A11Y-002**).
- Long Animation Frames `styleDuration`, `layoutDuration`, `forcedStyleDuration`, and `forcedLayoutDuration` diagnose style cost separately from layout cost when the browser exposes them. Combined style-and-layout timing stays the fallback. No new pass/fail and no Core Web Vitals threshold change (**HIG-PERF-001**, **HIG-PERF-002**).
- [6 November research disposition](./docs/research/2026-11-06-brief.md).

### Added

- Informative HTML-in-Canvas note. Semantic DOM remains the preference. The Chromium feature may qualify only after names, roles, states, geometry, keyboard and screen-reader operation, zoom, reflow, forced colors, geometry sync, and a non-supporting-browser fallback are shown. No audit rule.
- [Safari 27.3 Adaptive Dark Mode matrix](./examples/audit-fixtures/safari-27-3-adaptive-dark-mode.md) for text, focus, hover, SVG logos, transparent bitmaps, and canvas, with and without a declared scheme. Execution pending.

### Unchanged

- Core Web Vitals thresholds, rule IDs, and severities. Safari Technology Preview 256 list-marker, nested-iframe, and text-zoom fixes do not change stable compatibility expectations. WCAG 3, ARIA 1.3, and WCAG2Mobile stay deferred until the announced documents are published. No new AI/agent-interface requirement.

---

## [1.16.0] - 2026-10-30

### Changed

- Stable Core Web Vitals remain the **HIG-PERF-001** gate. Experimental CrUX soft-navigation LCP, INP, and CLS variants (September 2026 dataset, published 13 October 2026) must be shown separately, with the dataset month and an experimental label, and must not share a pass/fail.
- Scroll-driven animations (`animation-timeline`, `scroll()`, `view()`, and script scroll/view timelines) are motion under **HIG-A11Y-001**. Shortening `animation-duration` does not stop them. The partial static check may flag a missing timeline reset. Necessity and distraction stay manual.
- [30 October research disposition](./docs/research/2026-10-30-brief.md). Reviewed earlier notes: they did not claim CrUX lacks soft-navigation data. Stable thresholds were and are unchanged.

### Added

- [Scroll-driven fixture](./examples/audit-fixtures/scroll-driven-motion/README.md) for reduced motion, keyboard scrolling, zoom, and programmatic scrolling. Browser execution pending.
- [Safari 27.2 VoiceOver matrix](./examples/audit-fixtures/safari-27-2-voiceover.md) for streamed append vs re-render, complex `aria-labelledby` / `aria-describedby` targets, and iOS date, time, and color inputs. This is a stable Safari release. Other browser/AT pairs remain in scope. Execution pending.

### Unchanged

- Core Web Vitals thresholds, Search Console's use of the stable series, WCAG baseline, rule IDs, and severities. Grid Lanes stays deferred: no examples used `flow-tolerance`, and no audit rule was added. No new AI/agent-interface requirement.

---

## [1.15.0] - 2026-10-24

### Added

- Informative [Content / Marketing guide](./examples/content-marketing/README.md) with optional composition examples, scoped responsive/enhancement comparisons, conditional metadata and exact requirement citations.
- [Manual review worksheet](./examples/content-marketing/review-worksheet.md) with pass/fail/not tested/not applicable evidence states; explicitly distinct from a full evaluator report.
- [Document and hybrid fixtures](./examples/audit-fixtures/content-marketing/README.md) for semantics, image alternatives, keyboard navigation, reflow and applicable reduced-motion/client-enhancement parity. The manual matrix starts untested; repository checks do not establish browser/AT results.

### Changed

- Content archetype pack and examples index link to the new guidance. Current version pins, package versions and release artifacts synchronized for this minor guidance release.
- README and GitHub Pages home, adoption and reference pages introduce the Content / Marketing resources and their evidence boundaries.

### Unchanged

- Existing requirement meaning, stable IDs, severity, archetype/surface applicability, motion permissions, WCAG baseline, Core Web Vitals thresholds, Quick imperatives and evaluator/CLI contracts. No universal no-JavaScript, page-composition or conversion requirement added.

---

## [1.14.0] - 2026-10-23

### Changed

- Clarified §2.5 error recovery for failed route/feature modules: meaningful errors, keyboard-operable recovery, preserved input and fallbacks outside failed modules. Same-URL import retry is not mandated.
- Added informative §7.4 review guidance for schema validation, fail-closed handling, constrained repair and redacted execution trails. No new website audit rule, stable ID or blocking gate.

### Added

- Runnable module-failure and dynamic native-control fixtures, plus recovery and Safari TP 255/VoiceOver review procedures. Browser/AT execution pending.
- [23 October research disposition](./docs/research/2026-10-23-brief.md) with primary sources and compatibility rationale.

### Unchanged

- WCAG baseline, Core Web Vitals metrics/thresholds/measurement policy and existing IDs/severities. Experimental CSS and MATF proposals remain deferred.

---

## [1.13.2] - 2026-10-22

### Fixed

- Corrected Layer 1 Quick ↔ rule ID mappings in [rules/quick-rule-map.yaml](./rules/quick-rule-map.yaml) after a section-by-section audit. Quick #93 (sanitize user content) and #94 (CSRF) no longer cite HIG-SEC-003 or HIG-SEC-004; both belong to HIG.md §9.2, which has no rule ID, and are quick_only pending canonical IDs (F4). Quick #31 (no longer HIG-LOD-001), #41 (no longer HIG-MUT-001), and #46 (no longer HIG-MUT-002) are quick_only pending canonical IDs (F4) because the linked rule states a different obligation. All other links are unchanged.

### Changed

- `npm run sync:quick-map` links Quick bullets by section and by IDs written in the bullet, never by position. Each linked bullet records a reviewed `hig_section`, and each reviewed row is anchored to its bullet text. `npm run sync:quick-map -- --check` reports a stale map.
- `npm run validate` fails when a linked ID's registry `hig_section` does not match the Quick bullet's `hig_section`. Cross-section links are allowed only through `section_exceptions` in the map, each with a reason.

---

## [1.13.1] - 2026-10-11

### Fixed

- Corrected Layer 1 Quick ↔ rule ID mappings in [rules/quick-rule-map.yaml](./rules/quick-rule-map.yaml). Quick #21 and #22 are quick_only pending canonical IDs (F4). Quick #29 maps to HIG-SEO-001, HIG-SEO-002, and HIG-SEO-003. Quick #83 maps to HIG-DOC-005.

---

## [1.13.0] - 2026-10-09

### Changed

- **§5.2 Accessible name and description** — Prefer the **platform AccName computation** / browser accessibility tree over a simplified attribute order. References [AccName 1.2 Working Draft](https://www.w3.org/TR/accname-1.2/) as documentation of the algorithm; WD wording is **not** an independent HIG conformance requirement ([HIG.md](./HIG.md), [rules/accessibility.md](./rules/accessibility.md)).
- **HIG-DOC-005** — Outcome-based image transfer-format guidance; JPEG XL and similar formats only via progressive enhancement (typically `<picture>` + broadly supported fallback). No automated fail for absence of JXL.

### Added

- [examples/audit-fixtures/](./examples/audit-fixtures/) — AccName edge-case HTML fixtures (slots, shadow DOM, hidden ID refs, `aria-description`, CSS generated content, prohibited-name roles) and Safari TP 254 / VoiceOver manual review matrix.
- Quick Reference and Lite cross-links for AccName tree verification and measured image formats.

### Deferred / unchanged

- No Core Web Vitals metric, threshold, or measurement-policy change.
- No new AI/agent-interface requirements (existing visible state, confirmation, reversibility, provenance, and accessible status guidance stand).
- Safari TP experimental CSS is watchlist-only — not HIG recommendations or audit rules.

---

## 1.12.5 - 2026-09-21

### Added

- Layer 1 ↔ rule ID map ([rules/quick-rule-map.yaml](./rules/quick-rule-map.yaml), `npm run sync:quick-map`) and **How Quick counts relate** guidance for agents.
- [examples/golden-path](./examples/golden-path/) consumer-layout fixture (pin, skill, planted `web-hig check` violation) with CI test.
- Manifest JSON Schema enforcement ([scripts/validate-manifest-schema.mjs](./scripts/validate-manifest-schema.mjs)) in `npm run validate`.
- Root npm **workspaces**, shared **ESLint** / **Prettier**, and Node **`>=20`** engines across `@web-hig/*`.
- `web-hig upgrade` pin comparison and `--dry-run` checklist; explicit experimental status for `web-hig audit`.

### Changed

- Contract validation expanded (Quick map, registry ↔ INDEX ↔ manifest drift).
- Documentation site split into a hub home page plus **Understand**, **Adopt**, **AI & agents**, and **Reference** pages (mobile nav, share UI on Adopt).
- [ROADMAP.md](./ROADMAP.md) and [README.md](./README.md) **Tooling today** table — shipped vs deferred (`eslint-plugin-hig`, full evaluator, runtime audit).

---

## 1.12.4 - 2026-09-20

### Added

- Documentation site **npm packages** section (`#npm-packages`): install/CLI/core table, nav and integration links, npm org settings for maintainers.

---

## 1.12.3 - 2026-09-20

### Added

- Detailed npm READMEs for `@web-hig/core`, `@web-hig/cli`, and `@web-hig/install` (usage, CI, `WEB_HIG_ROOT`, API summary).

---

## 1.12.2 - 2026-09-20

### Fixed

- Document npm publish **`EOTP`** in CI and require Classic **Automation** or granular **Bypass 2FA** tokens for GitHub secret `NPM_TOKEN` ([packages/PUBLISHING.md](./packages/PUBLISHING.md)).

---

## 1.12.1 - 2026-09-20

### Fixed

- Root `npm test` runs `npm ci` in `packages/cli` first so `@web-hig/core` resolves on clean CI runners.

### Added

- [packages/PUBLISHING.md](./packages/PUBLISHING.md) for npm `@web-hig` org setup; publish workflow preflight (`npm org ls web-hig`); normalized `repository.url` on npm packages.
- Contract validation for README and Dev.to **Current release** pins against [VERSION](./VERSION).

---

## 1.12.0 - 2026-09-20

### Added

- Machine-readable [rules/registry.yaml](./rules/registry.yaml) (76 rules) with `npm run sync:registry` and CI validation against INDEX and manifest.
- Initial [@web-hig/core](./packages/core/) and [@web-hig/cli](./packages/cli/) packages: `web-hig check`, `web-hig explain`, `web-hig init` (install wrapper); static checks for **HIG-MOT-001** and **HIG-A11Y-001**; [NPM-TOOLING.md](./NPM-TOOLING.md) architecture doc.
- GitHub Actions workflow to publish `@web-hig/core`, `@web-hig/cli`, and `@web-hig/install` to the npm registry when a GitHub Release is published.

---

## 1.11.1 - 2026-09-19

### Fixed

- `lychee.toml` now matches the lychee v0.24 configuration schema: `exclude_mail` renamed to `include_mail`, `timeout` and `retry_wait_time` expressed as integer seconds, and `include_fragments` set to the `"none"` mode value. The link-check and offline validation workflows failed to start before this fix.
- Synchronized version references across contract files, modules, manifests, examples, installer, and the documentation site.

---

## 1.11.0 - 2026-09-19

### Added

- Agent-ready distribution: canonical [`skills/web-hig`](./skills/web-hig/SKILL.md) skill, Windsurf and Copilot path-specific templates, and `npx @web-hig/install`.
- Discovery polish: benefit-focused description, GitHub topics, social preview image, README badges (version, license, CI, Pin me), and an empty [ADOPTERS.md](./ADOPTERS.md) community table ready for PRs.
- Quality gates on every push/PR: Markdown link checks, rule ID consistency, version bump rules, and `npm run validate`. Version tags draft GitHub Release notes from CHANGELOG + RELEASE_NOTES.
- Share badge and copy-paste markdown (`SHARE.md`, documentation site `#share`) with UTM parameters so inbound links can be attributed by source.
- Documentation site share metadata (canonical URL, Open Graph image, JSON-LD), generated sitemap/robots/404 artifacts, and a weekly GitHub Action that reports broken external links as issues.
- Standard repository documentation: rationale, specification index, profiles, roadmap, adopters, machine-readable roadmap, and changelog.

---

## 1.10.1 - 2026-09-15

### Fixed

- Synchronized explicit version headers across Level 2 modules, archetype packs, framework adapters, manifests, examples, and documentation surfaces.
- Aligned `schema/manifest.schema.json` with the actual `archetype_packs.default_modules` / `conditional_modules` manifest shape.
- Expanded `scripts/validate-hig.mjs` to fail on stale version headers, missing local Markdown links/anchors, and manifest-schema pack-key drift.
- Replaced broken repository-local Markdown links that pointed at consumer-repo paths.

### Added

- Stable rule IDs for document fundamentals (`HIG-DOC-001`–`006`), SEO/share metadata (`HIG-SEO-001`–`003`), search (`HIG-SRCH-001`–`006`), data density (`HIG-DEN-001`–`008`), and performance (`HIG-PERF-001`–`004`) so evaluator findings can cite rule IDs consistently.

---

## 1.10.0 - 2026-09-12

### Added

- **Expressive Surface Baseline** — **HIG-EXP-001** through **HIG-EXP-012** for content routes with `surface: hybrid` or `surface: experience` ([rules/expressive-surface.md](./rules/expressive-surface.md), HIG.md §0.3, §1.5).
- **Evaluator report contract** — multidimensional output (BLOCKING/WARNINGS/OBSERVATIONS + 8 dimensions); [EVALUATOR.md](./EVALUATOR.md), [schema/evaluator-report.schema.json](./schema/evaluator-report.schema.json), [rules/evaluator-dimensions.yaml](./rules/evaluator-dimensions.yaml).
- Motion tier **HIG-EXP-006** — surface × `motion_class` permission matrix; **HIG-EXP-013** / **HIG-EXP-014** taxonomy and classification; [rules/motion-tiers.yaml](./rules/motion-tiers.yaml) machine-readable registry.

### Changed

- Content archetype scope includes portfolios and studio sites; surface declaration in product scope (**HIG-EXP-001**).
- **HIG-CQ-001** softened to SHOULD (prefer `@container` for component-internal layout); **HIG-CQ-002** MUST when multi-context reuse would break on viewport breakpoints; **HIG-SIM-001** anti-pattern for artificial containers.
- **HIG-A11Y-007** / §5.4 — 24×24 labeled WCAG 2.5.8 normative floor; 44×44 labeled HIG ergonomic SHOULD (not mandatory).


---

## 1.9.0 - 2026-09-09

### Added

- [HIG-QUICK.md](./HIG-QUICK.md) Layer 1 Quick Reference (98 rules).
- Archetype rule packs under `rules/archetypes/`.
- [rules/applicability.md](./rules/applicability.md) Layer 0 extract.
- [VERSION](./VERSION) pin file and [scripts/validate-hig.mjs](./scripts/validate-hig.mjs).
- GitHub Actions contract validation workflow.

### Changed

- Three-layer consumption model documented across README, INTEGRATION, and agent templates.

---

## 1.8.0 - 2026-09-09

### Added

- 16 standalone Level 2 modules in `rules/`.
- Framework adapters: React, Next.js, Vue, Nuxt, Astro.

### Changed

- [rules/manifest.yaml](./rules/manifest.yaml) references module files instead of HIG.md section anchors only.

---

## 1.7.0 - 2026-09-09

### Added

- [HIG-CORE.md](./HIG-CORE.md), [HIG-LITE.md](./HIG-LITE.md), [rules/INDEX.md](./rules/INDEX.md), progressive loading manifest.

---

## 1.6.0 - 2026-09-09

### Added

- Layer 9 Security & Privacy.
- Product UX taxonomies (error, empty, loading, search, notifications), forms contract, i18n, data density, browser permissions UX.

---

## 1.5.1 - 2026-09-09

### Fixed

- WCAG classifications, lab vs field performance semantics, focus trapping, framework-neutral Layer 4.

### Added

- Normative vocabulary, exception system, expanded Layer 7 rule ID schema, Layer 8 gate classes.

---

## 1.5.0 - 2026-09-08

### Added

- Layer 1 functional micro-animations contract and motion tokens.

---

## 1.4.0 - 2026-09-07

### Added

- Server-driven UI / streaming standards, container-query layout engine, View Transitions guidance.

---

## 1.3.0 - 2026-09-07

### Added

- Layer 0 applicability matrix, public repository scaffolding.

---

## 1.2.0 - 2026-09-07

### Changed

- Multi-layer framework re-architecture; WCAG 2.2 AA mandatory.

---

## 1.1.0 - 2026-09-07

### Added

- Three-tier token architecture, optimistic UI, AI enforcement guardrails.

---

## 1.0.0 - 2026-09-07

### Added

- Initial base HIG release.

