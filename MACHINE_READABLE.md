# Machine-readable rules — The Web HIG

Layer 7 defines how requirements become **deterministic** for linters, CI, and AI agents. This document describes what exists today and the path to a full rule registry.

**Normative source:** [HIG.md §7](./HIG.md#layer-7-ai--agent-enforcement-contract) · **Module:** [rules/ai-enforcement.md](./rules/ai-enforcement.md)

---

## Today (v1.13.0)

| Artifact | Format | Purpose |
| --- | --- | --- |
| [rules/manifest.yaml](./rules/manifest.yaml) | YAML | Progressive loading: layers, modules, triggers, rule ID lists per module |
| [rules/motion-tiers.yaml](./rules/motion-tiers.yaml) | YAML | Motion Tier 0–3 + ambient class; surface permission matrix (**HIG-EXP-006**) |
| Agent templates | Markdown + YAML | Layer 7 guardrails in [examples/agent-rules/](./examples/agent-rules/) |
| Agent skill | [skills/web-hig/SKILL.md](./skills/web-hig/SKILL.md) | Ready-to-copy Agent Skill for Cursor, Claude, Copilot, Windsurf |
| Installer | [packages/install](./packages/install/) | `npx @web-hig/install` pins HIG-QUICK + rules/skills |
| Rule IDs in prose | `HIG-*` in HIG.md and `rules/*.md` | Human and agent citation |
| [rules/registry.yaml](./rules/registry.yaml) | YAML | Rule registry: severity, profiles, archetypes, evaluation, autofix, module, HIG section |
| [rules/quick-rule-map.yaml](./rules/quick-rule-map.yaml) | YAML | Layer 1 Quick # ↔ `HIG-*` ID links (`npm run sync:quick-map`) |
| [scripts/validate-hig.mjs](./scripts/validate-hig.mjs) | JavaScript | Single source of truth: VERSION sync, registry ↔ INDEX ↔ manifest ↔ Quick map, docs/adopter pins |
| [@web-hig/core](./packages/core/) | JavaScript | Config + registry loader + evaluator report helpers |
| [@web-hig/cli](./packages/cli/) | JavaScript | `web-hig` — `init`, `check`, `explain` (audit/upgrade planned) |
| [rules/evaluator-dimensions.yaml](./rules/evaluator-dimensions.yaml) | YAML | Evaluator dimension ↔ rule prefix map |
| [schema/evaluator-report.schema.json](./schema/evaluator-report.schema.json) | JSON Schema | Multidimensional evaluator report shape |
| [EVALUATOR.md](./EVALUATOR.md) | Markdown | Evaluator contract (Layer 8 §8.2) |

### Manifest schema (draft)

[schema/manifest.schema.json](./schema/manifest.schema.json) validates `rules/manifest.yaml` on every `npm run validate` ([scripts/validate-manifest-schema.mjs](./scripts/validate-manifest-schema.mjs)).

---

## Rule record schema (normative intent)

Every machine-enforceable rule **should** eventually export these fields (see HIG §7.1):

```yaml
id: HIG-A11Y-004
severity: error          # error | warning | info
requirement: "Icon-only controls MUST have an accessible name."
archetypes: [application, commerce, auth, content]
autofix: safe            # safe | unsafe | none
exceptions:
  - documented_in: hig_exception_registry
hig_section: "§5.2"
module: rules/accessibility.md
```

Agent guardrails in product repos are **projections** of this schema — not a second standard.

---

## Rule registry (`rules/registry.yaml`)

**Status:** Shipped (initial) — see [NPM-TOOLING.md](./NPM-TOOLING.md).

- One record per rule ID in [rules/INDEX.md](./rules/INDEX.md)
- Regenerate: `npm run sync:registry` ([scripts/sync-registry.mjs](./scripts/sync-registry.mjs))
- Validated in CI against INDEX, manifest, and VERSION

Export formats (ESLint metadata, PR bots, MCP) remain on the [ROADMAP.md](./ROADMAP.md).

---

## `eslint-plugin-hig` — deferred

**Not shipped in this repository.** ROADMAP and HIG §7.2 describe a reference ESLint plugin; today enforcement is:

- Layer 7 guardrails in agent templates and `web-hig check` (static CSS subset)
- Full multidimensional reporting via [EVALUATOR.md](./EVALUATOR.md) + [schema/evaluator-report.schema.json](./schema/evaluator-report.schema.json)

A future `eslint-plugin-hig` would implement only a **static subset** of the contract — not a substitute for runtime audit or manual WCAG review.

---

## Intended linter surface (future plugin)

Reference list from [rules/ai-enforcement.md](./rules/ai-enforcement.md):

| Rule | Intent |
| --- | --- |
| `hig/enforce-container-queries` | Component layout uses `@container` |
| `hig/streaming-boundary` | Slow async regions have streaming boundaries |
| `hig/no-unlabeled-icon-buttons` | Accessible names on icon controls |
| `hig/micro-animation-budget` | Motion ≤300 ms, tokenized durations |
| `hig/no-optimistic-destructive` | No optimistic destructive mutations |
| `hig/no-transition-all` | Ban `transition: all` in app CSS |

Implementations may live in a separate `eslint-plugin-hig` repository to keep this repo specification-only.

---

## Validation in consumer repos

Minimum:

```bash
# In a clone of github.com/frozonfreak/hig at tag vX.Y.Z
npm run validate
```

Recommended when vendoring `docs/hig/`:

- Pin `docs/hig/VERSION`
- Run validate on upgrade PRs
- Add CI that fails when VERSION ≠ agent rule declared version

---

## Contributing machine-readable artifacts

See [CONTRIBUTING.md](./CONTRIBUTING.md). Changes to rule IDs or severity require:

1. HIG.md update
2. Matching `rules/*.md` module
3. [rules/manifest.yaml](./rules/manifest.yaml) / INDEX updates
4. [CHANGELOG.md](./CHANGELOG.md) entry under appropriate semver bump
