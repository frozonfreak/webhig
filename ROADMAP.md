# Roadmap — The Web HIG

This roadmap describes **contract and tooling** direction for the standard repository. Dates are intent, not commitments. Normative changes ship only through semver and [CONTRIBUTING.md](./CONTRIBUTING.md).

**Current version:** [VERSION](./VERSION)

---

## Shipped (foundation)

- [x] 10-layer normative specification ([HIG.md](./HIG.md))
- [x] Layer 0 archetypes and applicability matrix
- [x] Stable rule IDs and Layer 7 agent guardrails
- [x] Progressive loading: HIG-CORE, HIG-QUICK, HIG-LITE, `rules/`, `framework/`
- [x] [rules/manifest.yaml](./rules/manifest.yaml) topic triggers + **JSON Schema validation in CI**
- [x] [rules/registry.yaml](./rules/registry.yaml) + [rules/quick-rule-map.yaml](./rules/quick-rule-map.yaml) with drift checks
- [x] Contract validation (`npm run validate`) and CI
- [x] `@web-hig/core` / `@web-hig/cli` / `@web-hig/install` — `init`, `check`, `explain`, `upgrade` (pin report)
- [x] Static CSS checks in `web-hig check`; minimal `--json` evaluator output
- [x] Integration guide, agent templates, documentation site
- [x] Agent-ready distribution (`skills/web-hig`, editor templates, `npx @web-hig/install`)
- [x] Docs site GitHub Pages deploy, share metadata (Open Graph / JSON-LD), weekly external link check
- [x] Quality gates: Markdown links, rule ID consistency, version bump rules, tag release-note drafts
- [x] Consumer layout fixture: [examples/golden-path](./examples/golden-path/) (planted violation + CI test)
- [x] npm workspaces at repo root; shared ESLint / Prettier for `scripts/` and `packages/`

---

## Shipped — explicit limits (not oversold)

| Area | Today | Not promised yet |
| --- | --- | --- |
| **ESLint** | `web-hig check` static subset; agent YAML guardrails | In-repo **`eslint-plugin-hig`** ([MACHINE_READABLE.md](./MACHINE_READABLE.md)) |
| **Evaluator** | `web-hig check --json` minimal report; full schema + [example](./examples/evaluator-report.example.json) | Full multidimensional CLI matching [schema/evaluator-report.schema.json](./schema/evaluator-report.schema.json) on every run |
| **Runtime audit** | `web-hig audit` marked experimental / not shipped | Playwright + axe orchestration ([NPM-TOOLING.md](./NPM-TOOLING.md) Phase 5) |

---

## Near term

| Item | Outcome |
| --- | --- |
| **Conformance profiles** | Documented in [PROFILES.md](./PROFILES.md); optional badge/checklist for adopters |
| **Adopter registry** | [ADOPTERS.md](./ADOPTERS.md) — add rows by PR |
| **Spec change log discipline** | Tagged releases draft GitHub notes from [CHANGELOG.md](./CHANGELOG.md) + [RELEASE_NOTES.md](./RELEASE_NOTES.md) |
| **Expand static `web-hig check` rules** | More registry `evaluation: static` rules without waiting on ESLint plugin |

---

## Medium term

| Item | Outcome |
| --- | --- |
| **`eslint-plugin-hig` (separate or optional package)** | Reference rules from [rules/ai-enforcement.md](./rules/ai-enforcement.md) — static subset only |
| **Full evaluator CLI output** | Dimensions block + schema-valid JSON on every `check` / audit aggregation |
| **`web-hig audit`** | Runtime behavioural verification |
| **Archetype conformance packs** | Checklists generated from Layer 0 matrix per archetype |
| **Third-party adapter templates** | Svelte, Solid, Angular community adapters under `framework/` |

---

## Long term

| Item | Outcome |
| --- | --- |
| **Policy-as-code for agents** | Export registry to MCP/tool schemas for deterministic agent loading |
| **Field performance SLO templates** | RUM dashboards aligned with Layer 6 SLO definitions |
| **Formal working group** | Maintainers + adopters for major semver proposals |

---

## Research watchlist (2026-10-09)

Informational — not commitments. From the weekly Web HIG research brief:

| Topic | Status |
| --- | --- |
| Core Web Vitals | No material metric, threshold, or measurement-policy change |
| AI/agent interfaces | No new primary research strong enough to alter guidance; keep visible agent state, confirmation for consequential actions, reversibility, provenance, accessible status |
| Modern CSS (Safari TP experiments) | Track `interpolate-size`, `calc-size()`, `symbols()`, linked parameters — no HIG recommendation or automated rule yet |
| JPEG XL multi-engine + field evidence | Spec guidance landed in **HIG-DOC-005** (progressive enhancement only); consider a future informational audit for JXL-only delivery after stable multi-engine support |

## Explicit non-roadmap

- Shipping a component library in this repository
- Mandating a single CSS framework or design system
- Replacing WCAG or platform specifications

---

## How to influence the roadmap

1. Open a **[Spec change proposal](./.github/ISSUE_TEMPLATE/spec-change.yml)** for normative changes.
2. Open a **feature issue** for tooling (validate script, schema, eslint rules).
3. Send a PR to [ADOPTERS.md](./ADOPTERS.md) when your product pins the contract (see template there).
