# The Web HIG — npm Tooling and Conformance CLI Design

**Status:** Phase 1–3 started in this repository (v1.13.0).  
**Related:** [MACHINE_READABLE.md](./MACHINE_READABLE.md) · [PROFILES.md](./PROFILES.md) · [EVALUATOR.md](./EVALUATOR.md)

## Implementation map (this repo)

| Design phase | Artifact | Status |
| --- | --- | --- |
| 1 — Rule registry | [rules/registry.yaml](./rules/registry.yaml), [scripts/sync-registry.mjs](./scripts/sync-registry.mjs), CI validation in [scripts/validate-hig.mjs](./scripts/validate-hig.mjs) | **Shipped (initial)** |
| 2 — Core engine | [@web-hig/core](./packages/core/) — config, registry, report model | **Initial** |
| 3 — Unified CLI | [@web-hig/cli](./packages/cli/) — `init`, `check`, `explain`, `upgrade` (pin report); `audit` experimental | **Initial** |
| 4 — Static rules | Built-in checks in CLI; ESLint/Stylelint plugins | **Partial** (2 CSS checks) |
| 5 — Runtime audit | Playwright + axe orchestration | Planned |
| 6 — CI reporting | JSON via `web-hig check --json` | **Initial** |
| 7 — Agent integration | Registry metadata + evaluator JSON | **Initial** |

Example project contract: [examples/web-hig.example.yaml](./examples/web-hig.example.yaml).

---

## 1. Purpose

The Web HIG npm tooling turns the HIG specification from a document that developers and AI agents read into an **executable conformance system** that can be installed, checked, audited, and enforced inside real projects.

The npm tooling is not a UI component library and does not replace a project’s design system.

> Apply, evaluate, and enforce a pinned version of The Web HIG against a project.

Projects remain free to use any framework or design system.

---

## 2. Core model

```text
HIG Version → Profile → Archetype → Framework → Scope → Evaluation Method → Findings
```

**Profiles** (CLI consumption levels — not normative spec layers):

| Profile | Artifacts | Command example |
| --- | --- | --- |
| **quick** | HIG-CORE + HIG-QUICK | `web-hig check --profile quick` |
| **practical** | + HIG-LITE, rules/*, framework/*, archetype packs | `web-hig check` (default in web-hig.yaml) |
| **full** | + HIG.md, manual/observational reporting | `web-hig audit --profile full` |

See [PROFILES.md](./PROFILES.md) for documentation profiles; CLI profile names align with those labels.

---

## 3. Project configuration

Recommended file: **`web-hig.yaml`** at the repository root ([example](./examples/web-hig.example.yaml)).

```yaml
version: "1.13.0"
profile: practical
archetype: application
framework:
  name: vue
scope:
  files:
    - src/**
  routes:
    - /**
gates:
  blocking: fail
  warnings: report
  observations: report
```

- `web-hig check` — static evaluation against this contract.  
- `web-hig audit` — runtime evaluation (**experimental / not shipped** — use `check`).  
- `web-hig upgrade` — compare pinned `web-hig.yaml` / `docs/hig/VERSION` to registry (`--dry-run` checklist).  
- Flags may override config for one-off runs.

---

## 4. CLI surface

Package: **`@web-hig/cli`** · Executable: **`web-hig`**

| Command | Purpose |
| --- | --- |
| `web-hig init` | Onboard project (wraps `@web-hig/install` today) |
| `web-hig check` | Static analysis |
| `web-hig audit` | Runtime analysis (**experimental** — not shipped) |
| `web-hig explain <rule-id>` | Rule documentation from [registry.yaml](./rules/registry.yaml) |
| `web-hig upgrade` | Outdated pin report + `--dry-run` upgrade checklist |

**Developer workflow (target):**

```bash
npm install -D @web-hig/cli
npx web-hig init
npm run hig:check    # before release: hig:audit
npx web-hig explain HIG-A11Y-004
```

From a clone of this repository (before publish):

```bash
cd packages/cli && npm install
node bin/cli.mjs check   # set WEB_HIG_ROOT to repo root if needed
```

---

## 5. Check vs audit

Check and audit are **evaluation methods**, not profiles. Any profile may use either method.

```text
                    HIG Contract
                         │
            ┌────────────┴────────────┐
          CHECK                    AUDIT
     Static (source)          Runtime (rendered app)
```

---

## 6. Rule registry

Canonical machine-readable catalog: **[rules/registry.yaml](./rules/registry.yaml)**.

Each rule includes: `severity`, `requirement`, `profiles`, `archetypes`, `evaluation` (`static` | `runtime` | `manual` | `observation`), `autofix`, `module`, `hig_section`, and optional `eslint_rule`.

Regenerate after INDEX or Layer 7 guardrail changes:

```bash
npm run sync:registry
```

CI ensures registry ↔ [rules/INDEX.md](./rules/INDEX.md) ↔ [rules/manifest.yaml](./rules/manifest.yaml) ↔ HIG.md stay aligned.

---

## 7. Package boundaries

| Package | Role |
| --- | --- |
| `@web-hig/cli` | User-facing CLI |
| `@web-hig/core` | Config, registry, applicability, reports |
| `@web-hig/rules` | *(future)* npm export of registry |
| `eslint-plugin-web-hig` / `stylelint-plugin-web-hig` | *(future)* AST/CSS rules |

**Non-goal:** `@web-hig/components` — HIG stays design-system independent.

**Compatibility:** `npx @web-hig/install` remains supported; long term `web-hig init` is the primary onboarding path.

**npm publish (404 on CI):** Scoped packages need org **`@web-hig`** on npmjs.com plus GitHub secret **`NPM_TOKEN`**. See [packages/PUBLISHING.md](./packages/PUBLISHING.md).

---

## 8. Evaluator output

Tools emit Layer 8 buckets (**BLOCKING**, **WARNINGS**, **OBSERVATIONS**) and structured findings — see [EVALUATOR.md](./EVALUATOR.md) and `web-hig check --json`.

---

## 9. Design principles

1. **HIG remains the authority** — tooling implements the standard; it does not silently redefine it.  
2. **Configuration is explicit** — version, profile, archetype, framework, scope.  
3. **Determinism over coverage** — automate only reliable rules first.  
4. **Progressive evaluation** — quick → practical → full.  
5. **Reuse existing engines** — ESLint, Stylelint, Playwright, axe; HIG orchestrates and interprets.  
6. **Human review remains valid** — full profile reports distinguish manual and observational rules.

---

## 10. Milestone

> **The Web HIG becomes executable.**

Concrete expression:

1. `web-hig check` against a versioned `web-hig.yaml` contract.  
2. `web-hig audit` for runtime behavioural verification (next major tooling milestone).

This document is the architecture contract for npm tooling evolution; normative behaviour remains in [HIG.md](./HIG.md).

---

## 11. Publishing `@web-hig/*` (maintainers)

Happy path (automated in [`.github/workflows/npm-publish-github-packages.yml`](./.github/workflows/npm-publish-github-packages.yml)):

1. Tag release `vX.Y.Z` with `VERSION` and all package.json files aligned (`npm run validate`).
2. Publish GitHub Release (triggers workflow).
3. Workflow runs `npm run validate` + `npm test`.
4. Publish `@web-hig/core`, then `@web-hig/cli` with `dependencies.@web-hig/core` set to the release version (replacing monorepo `file:../core`).
5. Publish `@web-hig/install`.

Token, scope, and first-publish 404 troubleshooting: [packages/PUBLISHING.md](./packages/PUBLISHING.md). Consumer install path: [INTEGRATION.md](./INTEGRATION.md#npm-packages-consumer-vs-maintainer).
