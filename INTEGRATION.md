# Integrating The Web HIG into your development workflow

This guide shows an **efficient** way to adopt The Web HIG in a product repo: progressive loading, thin agent rules, then lint/CI — without pasting the full contract into every prompt.

**Current contract:** [HIG.md](./HIG.md) v1.13.0 (see [VERSION](./VERSION)). **Profiles:** [PROFILES.md](./PROFILES.md) · **Adopters:** [ADOPTERS.md](./ADOPTERS.md).

---

## Three consumption layers

| Layer | File | Load when |
| --- | --- | --- |
| **1 — Quick Reference** | [HIG-QUICK.md](./HIG-QUICK.md) | **Every UI/CSS/front-end task** (default, ~5 min) |
| **2 — Practical** | [HIG-LITE.md](./HIG-LITE.md) + [rules/](./rules/) + [framework/](./framework/) | Building features — rule IDs, topic modules, archetype packs |
| **3 — Full specification** | [HIG.md](./HIG.md) | Edge cases, spec conflicts, normative detail |

**Preamble:** [HIG-CORE.md](./HIG-CORE.md) — session start (philosophy, vocabulary, archetypes).

**Do not** dump all of `HIG.md` into every system prompt. Agents work better with:

1. [HIG-QUICK.md](./HIG-QUICK.md) as default context (Layer 1) — *"Follow The Web HIG Quick Reference."*
2. [HIG-LITE.md](./HIG-LITE.md) + topic modules when building features (Layer 2)
3. A short always-on agent rule (archetype + Layer 7 YAML)
4. [HIG.md](./HIG.md) only for edge cases (Layer 3)
5. CI as the hard backstop (Layer 8)

---

## Efficient adoption path

| Stage | Effort | What you get |
| --- | --- | --- |
| **1. Agent rules** | Minutes | Agents use HIG-QUICK by default; escalate to HIG-LITE + modules on topic match |
| **2. Scope doc** | Minutes | Humans and agents share one archetype map for the product |
| **3. PR checklist** | Minutes | Reviewers catch HIG regressions without waiting on custom linters |
| **4. Lint + CI** | Hours | Layer 8 gates fail the build on a11y/perf/token violations |

Do stages 1–3 on day one. Add stage 4 when you can automate the Layer 7 rules (custom ESLint/Stylelint or equivalent).

---

## Fastest path — one command

```bash
npx @web-hig/install
```

Installs the Quick Reference profile: `docs/hig/VERSION`, `HIG-QUICK.md`, `HIG-CORE.md`, example `docs/hig-scope.md` if missing, always-on agent rules, and skills for Cursor, Claude Code, GitHub Copilot, and Windsurf.

```bash
npx @web-hig/install --profile practical   # also HIG-LITE.md, rules/, framework/
npx @web-hig/install --editors cursor      # one editor
npx @web-hig/install --dry-run
```

Package docs: [packages/install/README.md](./packages/install/README.md). Manual copy remains below.

---

## Step 1 — Pin the contract in your product repo

Pick one pinning strategy and stick to it:

| Strategy | When to use |
| --- | --- |
| **Vendor copy** | Fastest: copy `HIG-QUICK.md`, `HIG-LITE.md`, `HIG.md`, `VERSION`, `rules/`, and `framework/` into e.g. `docs/hig/` |
| **Git submodule / subtree** | You want upstream pulls without manual copy |
| **Raw URL pin** | Agent rules link to tagged release files (e.g. `.../blob/v1.13.0/HIG-LITE.md`) |

**Minimum pin set for agents:**

| File | Purpose |
| --- | --- |
| `HIG-QUICK.md` | Default daily context (Layer 1, ~5 min) |
| `HIG-LITE.md` | Practical guide with rule IDs (Layer 2) |
| `HIG.md` | Full specification (Layer 3) |
| `rules/manifest.yaml` | Topic-triggered loading |
| `rules/*.md` | Standalone topic modules |
| `framework/*.md` | Framework adapters (React, Next, Vue, Nuxt, Astro) |
| `rules/INDEX.md` | Human-readable rule index |

Copy the root [VERSION](./VERSION) file into your pin directory (e.g. `docs/hig/VERSION`) so upgrades are intentional.

---

## Step 2 — Declare page archetypes once

Create a short product-local scope file (example: `docs/hig-scope.md`):

```markdown
# HIG scope for this product

Pinned contract: The Web HIG v1.13.0
- Quick Reference: `docs/hig/HIG-QUICK.md`
- Practical guide: `docs/hig/HIG-LITE.md`
- Full spec: `docs/hig/HIG.md`
- Topic index: `docs/hig/rules/manifest.yaml`

| Route / area | Archetype | Surface | Notes |
| --- | --- | --- | --- |
| `/`, `/blog/*` | Content / Marketing | document | SEO mandatory |
| `/work/*` | Content / Marketing | experience | Preload `expressive-surface` module |
| `/products/*`, `/cart`, `/checkout` | Commerce | — | Checkout = unsaved-changes protection |
| `/app/*`, `/admin/*` | Application | — | Server rendering + mutation state machines |
| `/login`, `/settings` | Auth / Account | — | No decorative motion |

**Surface** applies to **content** routes only (`document` default · `hybrid` · `experience`). See [rules/expressive-surface.md](./rules/expressive-surface.md) and [examples/hig-scope.example.md](./examples/hig-scope.example.md).

Default for new UI: Application unless the route map says otherwise.
```

Agents and humans should resolve archetype **before** applying Layers 1–9 (see HIG Layer 0).

---

## Step 3 — Wire coding agents

Copy the templates under [`examples/agent-rules/`](./examples/agent-rules/) and the canonical skill under [`skills/web-hig/`](./skills/web-hig/) into your product repo — or let `npx @web-hig/install` do it. Keep the always-on rule **short**; default to HIG-QUICK, not the full HIG.

### Loading workflow for agents

1. **Always:** Read `HIG-QUICK.md` (Layer 1) + resolve archetype (and **content surface** when applicable) from scope doc
2. **On feature work:** Open `HIG-LITE.md` (Layer 2) for rule ID links and checklists
3. **Archetype pack:** Load `rules/archetypes/<archetype>.md` → preload default modules
4. **Content surface:** When archetype is content, read `surface` from scope; for `hybrid` or `experience`, preload `rules/expressive-surface.md`
5. **On topic match:** Consult `rules/manifest.yaml` → open matching `rules/*.md` module; load `framework/*.md` when stack-specific
6. **On edge case:** Open `HIG.md` (Layer 3)
7. **Always:** Apply Layer 7 YAML guardrails from the agent rule file
8. **Cite rule IDs** when declining conflicting requests (e.g. `HIG-A11Y-003`)

### Cursor

1. Copy `examples/agent-rules/cursor-hig.mdc` → `.cursor/rules/hig.mdc`
2. Copy `skills/web-hig/SKILL.md` → `.cursor/skills/web-hig/SKILL.md`
3. Set `alwaysApply: true`, or use globs such as `**/*.{tsx,jsx,css,scss}`
4. Point the rule at your pinned `HIG-QUICK.md`, `HIG-LITE.md`, `HIG.md`, `rules/manifest.yaml`, and `docs/hig-scope.md`

### Claude Code

1. Copy `examples/agent-rules/CLAUDE-hig.md` into your project `CLAUDE.md` (merge if you already have one)
2. Copy `skills/web-hig/SKILL.md` → `.claude/skills/web-hig/SKILL.md`
3. Keep the Layer 7 YAML block intact

### GitHub Copilot

1. Copy `examples/agent-rules/copilot-instructions-hig.md` → `.github/copilot-instructions.md`
2. Copy `examples/agent-rules/copilot-hig.instructions.md` → `.github/instructions/hig.instructions.md`
3. Copy `skills/web-hig/SKILL.md` → `.github/skills/web-hig/SKILL.md`
4. Merge with existing Copilot instructions if present

### Windsurf

1. Copy `examples/agent-rules/windsurf-hig.md` → `.windsurf/rules/hig.md`
2. Copy `skills/web-hig/SKILL.md` → `.windsurf/skills/web-hig/SKILL.md`
3. The rule uses `trigger: always_on`

### Generic / multi-agent (`AGENTS.md`)

1. Copy `examples/agent-rules/AGENTS-hig.md` → `AGENTS.md` at the repo root
2. Useful when several tools (Cursor, Claude Code, Codex, Windsurf, etc.) share one instruction file

### Per-task prompt pattern (optional)

When starting a UI task, prepend:

```text
Follow The Web HIG Quick Reference (docs/hig/HIG-QUICK.md) — Layer 1.
Open docs/hig/HIG-LITE.md (Layer 2) when building features or you need rule ID links.
Archetype pack: docs/hig/rules/archetypes/<content|commerce|application|auth>.md.
Load docs/hig/rules/<module>.md from manifest.yaml when task matches a topic.
Load docs/hig/framework/<stack>.md when framework-specific.
Archetype: <content|commerce|application|auth> per docs/hig-scope.md.
Apply Layer 0 matrix + Layer 7 guardrails. Cite rule IDs on conflicts.
Prefer simplest compliant implementation (HIG-SIM-001).
Escalate to docs/hig/HIG.md (Layer 3) only for edge cases.
```

---

## Step 4 — Human PR checklist (until linters exist)

Add to your PR template (or use as a review checklist):

```markdown
### HIG checklist
- [ ] Archetype identified (Content / Commerce / Application / Auth)
- [ ] Layer 0 matrix applied (no mandatory rules skipped)
- [ ] No raw hex outside token files; semantic/component tokens used
- [ ] No `transition: all` in application-authored CSS; micro-feedback uses duration tokens; ≤300ms
- [ ] Components use `@container` for layout; `@media` only for viewport/preferences/page-level
- [ ] Slow async server regions have streaming boundaries + skeleton; server mutations show pending UI
- [ ] Native HTML preferred over ARIA; icon buttons have accessible names verified against the browser accessibility tree (platform AccName); images have `alt`
- [ ] Modals implement focus containment (not just `aria-modal`); focus ring visible with sufficient contrast
- [ ] Reduced-motion path respected; targets ≥24×24px (**HIG-A11Y-007**, WCAG 2.5.8); 44×44px touch is HIG SHOULD ergonomics only
- [ ] No optimistic confirmation on destructive mutations without undo/soft-delete
- [ ] Error/empty/loading states use HIG taxonomies (§2.5–2.7)
- [ ] Forms have labels, error summary, and appropriate autocomplete (§2.11)
- [ ] No secrets/PII in client code or logs; CSP configured (Layer 9)
```

---

## Step 5 — Lint and CI (Layer 8)

When ready to automate:

1. Encode Layer 7 constraints as ESLint/Stylelint rules (see HIG §7.2 for the intended `eslint-plugin-hig` rule set)
2. Run axe-core / Playwright a11y at WCAG 2.2 AA on critical routes
3. **Lab/CI gates (blocking)** — synthetic interaction latency, LCP, CLS, TTFB from HIG Layer 6 / 8:
   - Synthetic interaction latency > 200 ms
   - LCP > 2.5 s
   - CLS > 0.10
   - TTFB > 800 ms
4. **Field RUM (observation/SLO)** — field INP, LCP, CLS monitored but not treated as deterministic CI results
5. **Security CI (blocking)** — dependency audit, secret scanning, SAST, CSP/header checks
6. **Visual regression (warning)** — layout, responsive, dark-mode screenshot diffs

Until a shared `eslint-plugin-hig` package is available in your stack, approximate with existing rules (no raw colors, a11y plugin, ban `transition: all` in app CSS) and keep the PR checklist as the gap-filler.

---

## What “done” looks like

A product repo is integrated when:

1. **Pinned** `HIG-QUICK.md`, `HIG-LITE.md`, `HIG.md`, and `rules/` exist
2. **`hig-scope.md`** (or equivalent) maps routes → archetypes
3. At least one **agent rule file** (and optional editor skill) defaults to Layer 1 (Quick Reference) and loads Layer 2 on topic match
4. PRs use the **HIG checklist** (and CI gates when automated)

That sequence keeps agent context small, enforcement deterministic, and upgrades explicit.

---

## Step 6 — Validate contract integrity (optional)

When upgrading HIG pins in a product repo, run validation from the pinned copy:

```bash
node docs/hig/scripts/validate-hig.mjs
# or, if you vendor the full repo tooling:
npm run validate
```

The HIG repository runs this automatically via GitHub Actions on every PR to `main`.

---

## npm packages (consumer vs maintainer)

**Consumers** install published tools when the `@web-hig` scope is on npm:

```bash
npm install -D @web-hig/cli
npx web-hig init
npx web-hig check
```

Keep **`web-hig.yaml` `version`** and **`docs/hig/VERSION`** aligned with the vendored contract. Preview bumps with `web-hig upgrade --dry-run`.

**Maintainers** publishing from this monorepo: [packages/PUBLISHING.md](./packages/PUBLISHING.md). On release, CI runs `npm run validate` and tests, publishes `@web-hig/core`, rewrites `@web-hig/cli` to depend on the released core semver (not monorepo `file:../core`), then publishes CLI and install.

Optional consumer CI: [examples/github/workflows/web-hig-check.yml](./examples/github/workflows/web-hig-check.yml). Full Layer 8 report shape: [schema/evaluator-report.schema.json](./schema/evaluator-report.schema.json) and [examples/evaluator-report.example.json](./examples/evaluator-report.example.json).
