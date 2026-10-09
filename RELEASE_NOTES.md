# Release Notes

User-facing notes for each published version of The Web HIG. The brief machine-oriented summary lives in [`HIG.md` §8.1](./HIG.md#81-version-history); this file expands those entries with highlights, adoption guidance, and layer impact.

Versions follow [Semantic Versioning](https://semver.org/). Newest first.

---

## [v1.13.0](./HIG.md) — 2026-10-09

Minor guidance release from the **2026-10-09** research brief: AccName platform computation, outcome-based image formats, and audit fixtures. **No** Core Web Vitals threshold change and **no** new AI/agent-interface rules.

### Highlights

- **Accessible names** — §5.2 now tells authors and tools to match the **user-agent AccName** result (browser accessibility tree), not a simplified `aria-*` attribute checklist. Cites [AccName 1.2 WD](https://www.w3.org/TR/accname-1.2/); Working Draft wording is not a separate conformance bar.
- **HIG-DOC-005** — Keep image guidance outcome-based (sizing, quality, transfer cost, LCP). JPEG XL MAY appear only through progressive enhancement (`<picture>` + fallback); compare encodings on representative assets.
- **Audit fixtures** — [examples/audit-fixtures/](./examples/audit-fixtures/) for slotted/shadow names, hidden ID refs, `aria-description`, CSS generated content, prohibited-name roles, plus a Safari TP 254 VoiceOver manual matrix (engine fixes ≠ author failures).

### Upgrade from v1.12.5

1. Pin **[VERSION](./VERSION)** (`1.13.0`) or run `npx @web-hig/install` when you next refresh docs.
2. Re-check custom name heuristics and web-component labeling against the browser accessibility tree (especially slots/shadow DOM).
3. If you ship next-gen image formats, ensure a broadly supported `<picture>` fallback — do not treat JXL-only delivery as HIG-default.
4. Run `npm run validate` (or `npm test` if you vendor full tooling).

---

## [v1.12.5](./HIG.md) — 2026-09-21

Patch release: **contract clarity, validation, and adoption fixtures**. No normative rule was added, removed, or retightened.

### Highlights

- **98 Quick imperatives vs 76 `HIG-*` IDs** — documented everywhere agents look; [rules/quick-rule-map.yaml](./rules/quick-rule-map.yaml) validated in CI.
- **Stronger `npm run validate`** — manifest JSON Schema, Quick map, registry drift checks.
- **[examples/golden-path](./examples/golden-path/)** — copyable consumer layout; `npm test` ensures `web-hig check` fails on a planted violation.
- **Monorepo hygiene** — npm workspaces, ESLint/Prettier on `scripts/` and `packages/`, Node 20+ engines.
- **`web-hig upgrade`** pin report; **`web-hig audit`** marked experimental (use `check`).
- **Roadmap/README honesty** — what ships today vs deferred ESLint plugin / full evaluator / runtime audit.

### Upgrade from v1.12.4

1. Pin **[VERSION](./VERSION)** (`1.12.5`) or run `npx @web-hig/install` when you next refresh docs.
2. No rule ID changes — optional upgrade for tooling and agent clarity.
3. Run `npm run validate` (or `npm test` if you vendor the full repo tooling).

---

## [v1.12.4](./HIG.md) — 2026-09-20

Patch release: **documentation site npm discovery**. No normative rule was added, removed, or retightened.

### Highlights

- **[Documentation site — npm packages](https://frozonfreak.github.io/webhig/adopt.html#npm-packages)** — table and links to `@web-hig/install`, `@web-hig/cli`, and `@web-hig/core` on npm; nav, integration, and repo tree cross-links.

### Upgrade from v1.12.3

1. Pin **[VERSION](./VERSION)** (`1.12.4`) or run `npx @web-hig/install` when you next refresh docs.
2. No rule ID changes — optional upgrade for docs-site discovery only.
3. Run `npm run validate`.

---

## [v1.12.3](./HIG.md) — 2026-09-20

Patch release: **npm package documentation**. No normative rule was added, removed, or retightened.

### Highlights

- READMEs on npm for **`@web-hig/core`**, **`@web-hig/cli`**, and **`@web-hig/install`** — install workflow, `WEB_HIG_ROOT`, `web-hig.yaml`, commands, and maintainer publish notes.

### Upgrade from v1.12.2

1. Pin **[VERSION](./VERSION)** (`1.12.3`) or run `npx @web-hig/install` when you next refresh docs.
2. No rule ID changes — optional upgrade for npm readme content only.
3. Run `npm run validate`.

---

## [v1.12.2](./HIG.md) — 2026-09-20

Patch release: **npm CI token guidance**. No normative rule was added, removed, or retightened.

### Highlights

- **[packages/PUBLISHING.md](./packages/PUBLISHING.md)** — explains **`EOTP`** when `npm publish` runs in GitHub Actions and how to use **Automation** or granular **Bypass 2FA** tokens for `NPM_TOKEN`.

### Upgrade from v1.12.1

1. Pin **[VERSION](./VERSION)** (`1.12.2`) or run `npx @web-hig/install`.
2. If npm publish failed with `EOTP`, rotate `NPM_TOKEN` per PUBLISHING.md — no contract file changes required otherwise.
3. Run `npm run validate`.

---

## [v1.12.1](./HIG.md) — 2026-09-20

Patch release: **npm publish and CI tooling**. No normative rule was added, removed, or retightened — upgrading is safe for every existing pin.

### Highlights

- **[packages/PUBLISHING.md](./packages/PUBLISHING.md)** — how to create npm org `@web-hig`, configure `NPM_TOKEN`, and avoid **404** on first publish.
- **Publish workflow preflight** — verifies npm authentication and org access before `npm publish`.
- **CI tests** — `pretest` installs `packages/cli` dependencies so `web-hig check` tests pass on fresh runners.
- **Version pins** — `npm run validate` enforces README and Dev.to “current release” strings match [VERSION](./VERSION).

### Upgrade from v1.12.0

1. Pin **[VERSION](./VERSION)** (`1.12.1`) in `docs/hig/VERSION` and agent rules, or run `npx @web-hig/install`.
2. No rule IDs changed — no re-audit required.
3. Run `npm run validate`.

---

## [v1.12.0](./HIG.md) — 2026-09-20

Minor release: **executable conformance tooling**. No normative rule was added, removed, or retightened — upgrading is safe for every existing pin.

### Highlights

- **[rules/registry.yaml](./rules/registry.yaml)** — machine-readable catalog of all `HIG-*` rule IDs (severity, profiles, archetypes, evaluation methods, autofix). Validated in CI against [rules/INDEX.md](./rules/INDEX.md).
- **`@web-hig/core`** and **`@web-hig/cli`** — `web-hig check`, `web-hig explain`, and `web-hig init` (wraps `@web-hig/install`). See [NPM-TOOLING.md](./NPM-TOOLING.md).
- **npm publish** — publishing a GitHub Release runs [`.github/workflows/npm-publish-github-packages.yml`](./.github/workflows/npm-publish-github-packages.yml) (requires npm org `@web-hig` and GitHub secret `NPM_TOKEN`; see [packages/PUBLISHING.md](./packages/PUBLISHING.md)).

### Upgrade from v1.11.1

1. Pin **[VERSION](./VERSION)** (`1.12.0`) in `docs/hig/VERSION` and agent rules, or run `npx @web-hig/install`.
2. Optional: add `web-hig.yaml` from [examples/web-hig.example.yaml](./examples/web-hig.example.yaml) and run `npx @web-hig/cli check` after installing `@web-hig/cli`.
3. No rule IDs changed — no re-audit required for normative behaviour.
4. Run `npm run validate`.

---

## [v1.11.1](./HIG.md) — 2026-09-19

Patch release: link-check configuration repair. No normative rule was added, removed, or retightened — upgrading is safe for every existing pin.

### Highlights

- `lychee.toml` now matches the lychee v0.24 configuration schema. The link-check workflow and the offline link validation in CI aborted before checking anything, because `exclude_mail` no longer exists (it is `include_mail`), `timeout` and `retry_wait_time` take integer seconds rather than duration strings, and `include_fragments` takes a mode name (`none`, `anchor-only`, `text-only`, `full`) rather than a boolean.
- Version references synchronized across contract files, modules, manifests, examples, the installer, and the documentation site.

### Upgrade from v1.11.0

1. Pin **[VERSION](./VERSION)** (`1.11.1`) in `docs/hig/VERSION` and agent rules, or run `npx @web-hig/install`.
2. No rule IDs changed, so no re-audit is required.
3. Run `npm run validate`.

---

## [v1.11.0](./HIG.md) — 2026-09-19

Minor release: **distribution and adoption**. No normative rule was added, removed, or retightened — upgrading is safe for every existing pin.

### Highlights

#### Agent-ready distribution

- **[skills/web-hig/SKILL.md](./skills/web-hig/SKILL.md)** — canonical Agent Skill that works across Cursor, Claude, Copilot, and Windsurf instead of a hand-maintained rule per editor.
- **[examples/agent-rules/windsurf-hig.md](./examples/agent-rules/windsurf-hig.md)** and **[copilot-hig.instructions.md](./examples/agent-rules/copilot-hig.instructions.md)** — path-scoped templates so the contract loads only on UI and front-end files.
- **`npx @web-hig/install`** ([packages/install](./packages/install/)) — pins `HIG-QUICK.md`, `VERSION`, rules, and skills into `docs/hig/`. The installer is optional; vendoring by hand still works.

#### Quality gates

- Every push and pull request now runs Markdown link checks, rule ID consistency, version bump rules (`npm run check:version-bump`), and `npm run validate`.
- Tagging `vX.Y.Z` drafts GitHub Release notes from [CHANGELOG.md](./CHANGELOG.md) and this file.
- A weekly action reports broken external links as issues.

#### Discovery

- Documentation site share metadata (canonical URL, Open Graph image, JSON-LD) plus generated `sitemap.xml`, `robots.txt`, and `404.html` via `npm run build:docs`.
- [SHARE.md](./SHARE.md) and the site `#share` section provide copy-paste markdown with UTM parameters so inbound links can be attributed.
- [ADOPTERS.md](./ADOPTERS.md) community table is open for PRs.

### Upgrade from v1.10.1

1. Pin **[VERSION](./VERSION)** (`1.11.0`) in `docs/hig/VERSION` and agent rules, or run `npx @web-hig/install`.
2. Replace pinned contract files; no rule IDs changed, so no re-audit is required.
3. Optionally adopt the new skill or path-scoped editor templates in place of a hand-written rule.
4. Run `npm run validate`.

---

## [v1.10.1](./HIG.md) — 2026-09-15

Patch release: standards hygiene and machine-readable consistency.

### Highlights

- All explicit module, archetype pack, framework adapter, manifest, example, and documentation version headers now match [VERSION](./VERSION).
- The manifest schema now matches the actual `archetype_packs.default_modules` / `conditional_modules` shape.
- The validator now catches stale version headers, missing local Markdown links/anchors, and manifest-schema pack-key drift.
- Document fundamentals, SEO, search, data-density, and performance checks now have stable `HIG-*` rule IDs for evaluator findings.

### Upgrade from v1.10.0

1. Pin **[VERSION](./VERSION)** (`1.10.1`) in `docs/hig/VERSION` and agent rules.
2. Refresh `rules/INDEX.md`, `rules/manifest.yaml`, `rules/ux.md`, `rules/search.md`, `rules/data-density.md`, `rules/performance.md`, and `rules/evaluator-dimensions.yaml`.
3. Update any custom evaluator mappings to include `HIG-DOC-*`, `HIG-SEO-*`, `HIG-SRCH-*`, `HIG-DEN-*`, and `HIG-PERF-*`.
4. Run `npm run validate`.

---

## [v1.10.0](./HIG.md) — 2026-09-12

Minor release: **expressive content surfaces**, clearer **container-query** and **target-size** wording, and a **multidimensional evaluator** contract — without turning the HIG into a single-score Lighthouse clone.

### Highlights

#### Expressive Surface Baseline (~60–70% marketing/portfolio web)

- **[rules/expressive-surface.md](./rules/expressive-surface.md)** — **HIG-EXP-001** through **HIG-EXP-014** (parity, navigation, semantics, media, performance).
- **Surface model (HIG.md §0.3)** — per route in product scope: `document` (default) | `hybrid` | `experience`. App/commerce checkout/auth stay **document**.
- **[rules/motion-tiers.yaml](./rules/motion-tiers.yaml)** — machine-readable Motion Tier 0–3 + **ambient** class; surface × `motion_class` matrix (**HIG-EXP-006**). **HIG-MOT-003** remains full on document page-level and on **all controls**; hybrid/experience page motion is tier-governed.

#### Container queries (HIG-SIM-001–aligned)

- **HIG-CQ-001 (SHOULD)** — prefer `@container` for component-internal layout when parent width matters.
- **HIG-CQ-002 (MUST)** — container queries required when a component is reused across contexts and viewport `@media` would break a placement.
- Explicit anti-pattern: wrapper containers added only to satisfy CQ rules.

#### Target sizes (HIG vs WCAG)

- **24×24 CSS px — MUST (**HIG-A11Y-007**)** — normative floor aligned with WCAG 2.2 **2.5.8**; WCAG exceptions unchanged.
- **44×44 CSS px — SHOULD** — HIG ergonomic recommendation for primary touch; **not** enforced by **HIG-A11Y-007**.

#### Evaluator / CI reporting (Layer 8 §8.2)

- **[EVALUATOR.md](./EVALUATOR.md)** — tools MUST emit **BLOCKING / WARNINGS / OBSERVATIONS** plus eight **dimensions** (Accessibility, UX, Performance, Security, Architecture, Responsive, Motion, SEO) and rule-level **findings** — not `HIG Score: N/100` alone.
- **[schema/evaluator-report.schema.json](./schema/evaluator-report.schema.json)** · **[rules/evaluator-dimensions.yaml](./rules/evaluator-dimensions.yaml)** · [example report](./examples/evaluator-report.example.json).

### Layer impact

| Area | Change |
| --- | --- |
| Layer 0 | §0.3 expressive surfaces; applicability matrix row for **HIG-EXP-*** |
| Layer 1 | §1.5 expressive baseline; **HIG-MOT-003** carve-out for hybrid/experience page motion |
| Layer 3 | §3.2 **HIG-CQ-001** / **HIG-CQ-002** split |
| Layer 5 | §5.4 target-size labeling table |
| Layer 8 | §8.2 multidimensional evaluator contract |
| `rules/` | `expressive-surface.md`, `motion-tiers.yaml`, `evaluator-dimensions.yaml` |
| Agents | `resolve_content_surface`; **HIG-CQ-001** → warning, **HIG-CQ-002** → error |
| `scripts/validate-hig.mjs` | Validates motion-tiers + evaluator artifacts |

### Upgrade from v1.9.0

1. Pin **[VERSION](./VERSION)** (`1.10.0`) in `docs/hig/VERSION` and agent rules.
2. Extend **`docs/hig-scope.md`** with a **Surface** column for content routes ([example](./examples/hig-scope.example.md)).
3. For portfolio / fluid marketing UI, preload **`expressive-surface`** and declare `hybrid` or `experience`.
4. Refresh agent guardrails from [examples/agent-rules/](./examples/agent-rules/) (**HIG-CQ-002**, target-size notes, surface resolution).
5. Run `npm run validate` in this repo (or your vendored pin) on upgrade PRs.
6. **Non-breaking** for most app/commerce/auth work; **behavior change** for agents that previously treated all decorative motion as **HIG-MOT-003** violations on marketing pages — use surface + **HIG-EXP** instead.

### Adoption checklist (v1.10.0)

- [ ] VERSION pin and tag `v1.10.0`
- [ ] Archetype + **surface** in scope doc
- [ ] Agent rules updated (CQ severities, A11Y-007 note, content surface)
- [ ] CI/evaluator plan aligned with [EVALUATOR.md](./EVALUATOR.md) when building custom gates

---

## [v1.9.0](./HIG.md) — 2026-09-09

Progressive loading Phase 3 — archetype rule packs and contract validation.

### Highlights

- **[HIG-QUICK.md](./HIG-QUICK.md) (Layer 1)** — 98-rule Quick Reference (~5 min). Default agent context. Tell AI: *"Follow The Web HIG Quick Reference."*
- **Three consumption layers** — Quick Reference (Layer 1) → Practical docs (Layer 2: HIG-LITE + rules/) → Full spec (Layer 3: HIG.md).
- **Archetype packs** (`rules/archetypes/`) — content, commerce, application, auth bundles that preload the correct Layer 2 modules per page type.
- **[rules/applicability.md](./rules/applicability.md)** — Layer 0 extract with matrix and agent workflow.
- **[VERSION](./VERSION)** — single version pin file for product repos and CI.
- **[scripts/validate-hig.mjs](./scripts/validate-hig.mjs)** — validates VERSION sync, manifest file references, archetype packs, and rule ID consistency.
- **GitHub Actions** — `validate.yml` runs on every PR to `main`.

### Layer impact

| Area | Change |
| --- | --- |
| rules/archetypes/ | 4 archetype pack files |
| rules/applicability.md | Layer 0 module |
| manifest.yaml | `archetype_packs` + `applicability` module |
| CI | Contract validation workflow |

### Adoption notes

- After resolving archetype, load the matching pack before topic modules.
- Copy `VERSION` alongside HIG pins in product repos.
- Run `npm run validate` when upgrading pins.

---

## [v1.8.0](./HIG.md) — 2026-09-09

Progressive loading Phase 2 — standalone rule modules and framework adapters.

### Highlights

- **16 Level 2 rule modules** in `rules/` — accessibility, ux, states, forms, tokens, responsive, data-density, animation, architecture, mutations, performance, search, notifications, i18n, security, ai-enforcement.
- **5 framework adapters** in `framework/` — React, Next.js, Vue, Nuxt, Astro.
- **[rules/manifest.yaml](./rules/manifest.yaml)** updated to point to module files (not HIG.md section anchors).
- **HIG.md remains Level 3** — complete normative contract with module cross-links at each layer.

### Layer impact

| Area | Change |
| --- | --- |
| rules/ | 16 standalone topic modules extracted from HIG layers |
| framework/ | New adapter files for major frameworks |
| manifest | `file` field per module; `framework_adapters` section added |
| HIG.md | Module banners at layer headers; v1.8.0 |

### Adoption notes

- Pin `rules/*.md` and `framework/*.md` alongside existing HIG-LITE/HIG.md pins.
- Agents now load `rules/accessibility.md` (etc.) directly instead of parsing full HIG.md sections.
- When contributing, keep `rules/*.md` synchronized with `HIG.md` — modules are extracts, not divergent standards.

---

## [v1.7.0](./HIG.md) — 2026-09-09

Progressive loading architecture (Phase 1) — token-efficient agent workflows without weakening the standard.

### Highlights

- **[HIG-CORE.md](./HIG-CORE.md) (Level 0)** — Philosophy, normative vocabulary, archetype resolution, and HIG-SIM-001 (~500 tokens).
- **[HIG-LITE.md](./HIG-LITE.md) (Level 1)** — Compressed executable summary with canonical rule ID cross-links. Default agent context (~1–2k tokens).
- **[rules/INDEX.md](./rules/INDEX.md) + [rules/manifest.yaml](./rules/manifest.yaml) (Level 2)** — Topic-triggered loading index. Modules currently point to HIG.md sections; Phase 2 will extract standalone rule files.
- **HIG.md remains Level 3** — Complete normative specification. Existing pins to `HIG.md` continue to work.

### Layer impact

| Layer | Change |
| --- | --- |
| — | New layered file structure (CORE, LITE, rules/) |
| 7 | Agent workflow now defaults to HIG-LITE; manifest-driven Level 2 lookups |
| — | INTEGRATION.md, README, and all agent templates updated |

### Adoption notes

- Pin `HIG-LITE.md` and `rules/` alongside `HIG.md` in product repos.
- Update agent rules to reference Level 1 default context and `rules/manifest.yaml`.
- HIG-LITE is a summary of HIG — not a divergent standard. Every Lite bullet maps to a rule ID in the full spec.
- No breaking changes to mandatory requirements or token semantics.

---

## [v1.6.0](./HIG.md) — 2026-09-09

P2 capability expansion — product UX taxonomies, forms contract, i18n, data density, and a dedicated Security & Privacy layer.

### Highlights

- **Layer 9: Security & Privacy** — CSP, XSS/CSRF mitigation, secure cookies, PII masking, auth UX, session management, third-party script governance, and audit logging.
- **Error UX taxonomy (§2.5)** — 11 error categories with prescribed UI behavior (validation, auth, network, conflict, offline, etc.).
- **Empty-state taxonomy (§2.6)** — First-use, no results, filtered, permission, error, offline, and completed states.
- **Loading-state taxonomy (§2.7)** — Initial, background refresh, mutation pending, skeleton, progressive stream, pagination, infinite scroll.
- **Internationalization (§2.8)** — Pluralization, locale formatting, CJK typography, bidirectional text; logical layout properties mandatory.
- **Search standard (§2.9)** — Debounce → pending → results/no-results/error state machine with keyboard nav and URL sync.
- **Notifications taxonomy (§2.10)** — Toast, inline status, banner, modal, system notification with duration and stacking rules.
- **Forms contract (§2.11)** — Labels, validation timing, autocomplete, password managers, multi-step, draft persistence, error summary.
- **Data density standards (§3.3)** — Compact/default/comfortable row heights, numeric alignment, truncation, sticky headers, bulk actions, virtualization.
- **Browser permissions UX (§5.5)** — Camera, clipboard, geolocation, notifications, file system with graceful degradation.

### Layer impact

| Layer | Change |
| --- | --- |
| 0 | Matrix expanded for error/empty/loading, forms, search, i18n, data density, permissions, security |
| 2 | §2.5–2.11: error, empty, loading, i18n, search, notifications, forms |
| 3 | §3.3: data density standards for Application/Dashboard |
| 5 | §5.5: browser permissions UX |
| 7 | New rule IDs: HIG-ERR, HIG-EMP, HIG-LOD, HIG-FRM, HIG-I18N, HIG-NTF, HIG-SEC |
| 9 | New layer: Security & Privacy |

### Adoption notes

- Map existing error/empty/loading UI to the new taxonomies; gaps become actionable backlog items.
- Audit forms against §2.11 — especially checkout and settings flows.
- Review Layer 9 against your security posture: CSP headers, cookie attributes, PII in logs/analytics.
- Use logical CSS properties for all new layout work (§2.8).

---

## [v1.5.1](./HIG.md) — 2026-09-09

Corrections and clarifications to v1.5.0. This is a **standards-accuracy release** — it fixes incorrect WCAG classifications, performance metric semantics, focus-trapping guidance, and framework-neutral architecture without changing the overall 9-layer structure.

### Highlights

- **Normative vocabulary** — MUST/SHOULD/MAY keywords (RFC 2119) and exception governance with rule IDs, severity, applicability, and autofix safety.
- **Framework-neutral Layer 4** — Universal server-driven rendering reference architecture with separate React/Next, Vue/Nuxt, and Astro adapters. RSC is now correctly scoped as a React implementation detail.
- **Lab vs. field performance** — Synthetic interaction latency in CI; field INP as RUM/SLO monitoring (not a deterministic build gate). TTFB correctly classified as a supporting metric, not a Core Web Vital.
- **Accessibility precision** — WCAG 2.3.3 correctly classified as AAA; focus trapping requires actual containment (not just `aria-modal`); accessible name computation order; native HTML preferred over ARIA; keyboard interaction patterns; zoom/reflow requirements.
- **Expanded state architecture** — Stale data, network failure, conflict, idempotency, retry rules, and offline/degraded mode definitions.
- **CI gate classification** — Blocking, warning, and observation levels; security CI, visual regression, and cross-browser testing added to Layer 8.

### Layer impact

| Layer | Change |
| --- | --- |
| — | New normative vocabulary and exception system sections |
| 1 | WCAG 2.3.3 AAA fix; view-transition uniqueness; micro-feedback 300ms scope; application-authored `transition: all` |
| 2 | Archetype-aware metadata; navigation depth as SHOULD; destructive action models clarified |
| 3 | Contrast as combination verification; spacing/elevation/z-index tokens; theme selection; @container/@media roles |
| 4 | Framework-neutral architecture; streaming boundary nuance; stale/error/conflict/offline states |
| 5 | Focus trapping; accessible names; keyboard patterns; target size exceptions (24px min, 44px preferred) |
| 6 | Lab/field split; HIG Target/Acceptable thresholds; regression gates; performance budgets |
| 7 | Rule IDs, severity, applicability, autofix; prefer simplest compliant implementation |
| 8 | Blocking/warning/observation gates; security CI; visual regression; cross-browser testing |
| Appendix | P2 planned capabilities listed for v1.6+ |

### Adoption notes

- Update agent rules to reference v1.5.1 and the new rule ID schema (HIG-XXX-NNN).
- Replace "field INP fails build" CI gates with synthetic interaction latency for lab/CI and field INP for RUM/SLO monitoring.
- Review Layer 4 implementations against the universal reference architecture — RSC-specific language should map to framework adapters.
- Use the exception system when deviating from container-query or media-query rules.

---

## [v1.5.0](./HIG.md) — 2026-09-08

Functional micro-animations become a first-class Layer 1 contract: motion is feedback, not decoration.

### Highlights

- **Allowlisted micro-feedback** for hover/focus, press, toggles, inline validation, pending indicators, toasts, and modal open/close — each tied to duration tokens.
- **Deny list** bans decorative loops, parallax, scroll-jacking, >300 ms micro-motion, layout-property animation, and JS tween libraries when CSS suffices.
- **Motion tokens** in Layer 3 (`--duration-instant/fast/base/slow`, `--ease-out-momentum`) plus semantic aliases (`--motion-duration-*`).
- **Agent enforcement:** new `hig/micro-animation-budget` ESLint rule and Layer 7 YAML flags for tokenized timing, compositor-safe properties, and the 300 ms cap.

### Layer impact

| Layer | Change |
| --- | --- |
| 0 | Applicability matrix now lists micro-animations with motion & View Transitions |
| 1 | New §1.4 Functional Micro-Animations; Input Feedback Threshold prefers micro-motion when allowed |
| 3 | Motion duration/easing primitives added to the token system |
| 7 | Micro-animation budget rule and YAML enforcement keys |

### Adoption notes

- Replace hard-coded `transition`/`animation` millisecond values with `--duration-*` / `--motion-duration-*` tokens.
- Keep micro-feedback on `transform` and `opacity` only; continue to honor `prefers-reduced-motion`.
- Wire `hig/micro-animation-budget` into your ESLint pipeline alongside existing HIG rules.

---

## [v1.4.0](./HIG.md) — 2026-09-07

The contract expands for server-driven UI, container-first layout, and native page transitions.

### Highlights

- **RSC & streaming:** Server Components, Suspense skeleton boundaries, and Server Action / `useActionState` / `useOptimistic` mutation standards (Layer 4).
- **Container queries:** Component tokens and responsive rules shift from viewport `@media` to CSS `@container` (Layer 3).
- **View Transitions API:** Prefer `document.startViewTransition` for SPA/MPA route transitions; reduced-motion disables morphing (Layer 1).
- **New lint rules:** `hig/enforce-container-queries` and `hig/rsc-suspense-boundary`.

### Layer impact

| Layer | Change |
| --- | --- |
| 0 | Matrix updated for View Transitions, Container Queries, RSC streaming, and Server Actions |
| 1 | New §1.2 Native View Transitions API |
| 3 | Container-first responsive engine |
| 4 | RSC hydration boundaries and Server Action state model |
| 7–8 | Container-query and RSC Suspense enforcement in lint + CI gates |

### Adoption notes

- Wrap slow async server regions in layout-matching streaming boundaries with skeletons.
- Prefer `@container` for component-level breakpoints; reserve `@media` for viewport, preferences, and page-level concerns.
- Ensure `view-transition-name` values are unique within each transition capture context.

---

## [v1.3.0](./HIG.md) — 2026-09-07

First open-source contract release: a universal 9-layer HIG with explicit page-archetype scope.

### Highlights

- **Layer 0 Applicability & Scope** — Content/Marketing, Commerce, Application, and Auth archetypes with a mandatory/optional matrix.
- **Token contrast fixes** — corrected muted text and focus-ring values; status colors split into fill vs. text variants.
- **WCAG 2.2 AA** conformance requirement, optimistic UI reversibility, CSS logical properties, and field vs. lab Web Vitals definitions.
- Repo scaffolding: README, CONTRIBUTING, Code of Conduct, Security policy, and issue/PR templates.

### Adoption notes

- Start at Layer 0: pick an archetype, then apply only the mandatory rows in the matrix.
- Treat Accessibility, tokens/typography, and performance as universal — never optional.

---

## Earlier versions

These predate the public repository; summaries are retained for continuity with `HIG.md` §8.1.

### v1.2.0 — 2026-09-07

Re-architected into the multi-layer framework. WCAG 2.2 AA made mandatory; 16 ms rule redefined as visual acknowledgment; async state machines and Product IA standards added.

### v1.1.0 — 2026-09-07

Introduced the 3-tier token architecture, motion guidance, optimistic UI, mobile ergonomics, and AI enforcement guardrails.

### v1.0.0 — 2026-09-07

Initial base HIG release.
