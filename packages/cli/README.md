# @web-hig/cli

Command-line conformance tooling for [The Web HIG](https://github.com/frozonfreak/webhig). Evaluate a pinned HIG contract against your repository with **`web-hig check`**, inspect rules with **`web-hig explain`**, and onboard with **`web-hig init`**.

**Not a component library** — use your existing design system (React, Vue, Tailwind, MUI, shadcn, etc.). HIG defines **behaviour** you can cite, test, and enforce.

---

## Install

```bash
npm install -D @web-hig/cli
```

Run via `npx`:

```bash
npx web-hig --help
```

---

## Recommended workflow

### 1. Initialize the contract in your repo

```bash
npx web-hig init
# or: npx web-hig init --profile practical --editors cursor
```

This wraps [`@web-hig/install`](../install/) and pins `docs/hig/` (HIG-QUICK, VERSION, rules, agent skills).

Quick installations now include **`rules/registry.yaml`** for **`check`** and **`explain`**. Use the **practical** profile to add topic modules and framework guidance:

```bash
npx web-hig init --profile practical
```

### 2. Point the CLI at the pinned contract

Registry resolution automatically finds `docs/hig/rules/registry.yaml` or `rules/registry.yaml` while walking up from the current directory. An explicit **`WEB_HIG_ROOT`** overrides discovery; a broken override fails rather than silently switching contracts. Set it only for a custom layout:

```bash
# Linux / macOS
export WEB_HIG_ROOT=docs/hig

# Windows PowerShell
$env:WEB_HIG_ROOT = "docs/hig"
```

### 3. Add `web-hig.yaml` (optional but recommended)

The installer creates this file only when absent, choosing `src/**`, `resources/**`, `app/**`, or `**/*` based on existing directories. Review the scope and archetype; existing configuration is always preserved. Alternatively, start from [web-hig.example.yaml](https://github.com/frozonfreak/webhig/blob/main/examples/web-hig.example.yaml):

```yaml
version: "1.16.0"
profile: practical
archetype: application
framework:
  name: vue
scope:
  files:
    - src/**
  exclude:
    - src/legacy/**
gates:
  blocking: fail
  warnings: report
  observations: report
```

### 4. Run checks in CI and locally

```bash
npx web-hig check
npx web-hig check --json
npx web-hig doctor
npx web-hig check --strict
npx web-hig coverage --format json
npx web-hig explain HIG-A11Y-004
```

**package.json** scripts:

```json
{
  "scripts": {
    "hig:check": "web-hig check",
    "hig:explain": "web-hig explain"
  }
}
```

---

## Commands

| Command | Description |
| --- | --- |
| `web-hig init [options]` | Pin HIG docs and agent rules (delegates to `@web-hig/install`) |
| `web-hig check [options]` | Static evaluation against `web-hig.yaml` |
| `web-hig explain <rule-id>` | Print registry metadata for a `HIG-*` rule |
| `web-hig audit [url]` | Runtime evaluation (**experimental** — not shipped; use `check`) |
| `web-hig upgrade` | Compare pins to registry; `--dry-run` prints upgrade checklist |
| `web-hig doctor [--json] [--config path]` | Diagnose invalid configuration, mismatched pins, basic manifest structure, broken agent markers and missing referenced files |
| `web-hig coverage [--format json] [--profile name] [--config path]` | Inventory every applicable rule's declared verification modes and implemented coverage; does not execute checks |

### `web-hig check`

```text
web-hig check [options]

Options:
  --profile <quick|practical|full>   Override web-hig.yaml profile
  --config <path>                    Config file (default: web-hig.yaml)
  --json                             Evaluator JSON on stdout
  --strict                           Require valid configuration, matching versions and a nonempty source scope
  --help
```

**Exit code:** `1` for invalid inputs, strict precondition failures, or findings in any severity bucket configured as `fail`; otherwise `0`. `--strict` does not require full behavioral coverage. Zero findings means no detected violations in this static subset, not conformance.

JSON preserves the existing finding fields and adds `schema_version`, `assessments`, and `summary`, validated against [the versioned evidence schema](../core/lib/verification-report.schema.json). Each applicable rule is `failed`, `manual_review`, or `not_assessed`; the current partial detectors never establish `passed`. Findings are source-text heuristics and require review. This evidence envelope is separate from the draft multidimensional evaluator schema; no scores are invented.

`upgrade --dry-run` compares the existing pin to the resolved target registry (use `WEB_HIG_ROOT` for a separately installed target). It lists added, removed, and changed rule metadata when the old vendored registry exists, and explicitly reports unknown impact otherwise. It does not download releases or rewrite files. Registry metadata differences cannot substitute for a prose/release-note review.

**Example output:**

```text
Web HIG v1.16.0

Profile: Practical
Archetype: Application

BLOCKING        0
WARNINGS        0
OBSERVATIONS    0
```

### `web-hig explain`

```bash
npx web-hig explain HIG-A11Y-004
```

Shows requirement, severity, profiles, archetypes, evaluation methods, autofix policy, and HIG section from [rules/registry.yaml](https://github.com/frozonfreak/webhig/blob/main/rules/registry.yaml).

---

## Profiles and archetypes

**Profiles** (how much of the spec loads for evaluation — not the same as normative “layers”):

| Profile | Typical use |
| --- | --- |
| `quick` | Fast PR feedback, agent guardrails |
| `practical` | Default production CI |
| `full` | Formal review (+ manual / observational rules in future audit) |

**Archetypes:** `content` · `commerce` · `application` · `auth` — resolve from [hig-scope](https://github.com/frozonfreak/webhig/blob/main/examples/hig-scope.example.md).

Details: [PROFILES.md](https://github.com/frozonfreak/webhig/blob/main/PROFILES.md)

---

## Static checks (today)

Built-in checks grow over time; current deterministic rules include:

| Rule ID | What it detects |
| --- | --- |
| **HIG-MOT-001** | `transition: all` in application CSS |
| **HIG-A11Y-001** | Motion styles without `prefers-reduced-motion` handling, including scroll-driven `animation-timeline` / `scroll()` / `view()` whose reduced-motion style does not reset the timeline. Necessity stays manual. |

More rules will move into ESLint / Stylelint plugins; the CLI orchestrates the same registry and report format.

---

## Environment variables

| Variable | Purpose |
| --- | --- |
| `WEB_HIG_ROOT` | Path to pinned HIG tree (`docs/hig` after init) |

---

## CI example (GitHub Actions)

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
- run: npm ci
- run: npx web-hig doctor
- run: npx web-hig check --strict
```

Commit `docs/hig/` and `web-hig.yaml` so CI does not re-init every run.

---

## Monorepo / HIG development

From a clone of [github.com/frozonfreak/webhig](https://github.com/frozonfreak/webhig):

```bash
cd packages/cli && npm install
node bin/cli.mjs explain HIG-MOT-001
```

---

## Related packages

| Package | Role |
| --- | --- |
| [`@web-hig/core`](../core/) | Registry, config, report APIs |
| [`@web-hig/install`](../install/) | Low-level pin installer |

Design: [NPM-TOOLING.md](https://github.com/frozonfreak/webhig/blob/main/NPM-TOOLING.md) · Evaluator: [EVALUATOR.md](https://github.com/frozonfreak/webhig/blob/main/EVALUATOR.md)

---

## License

MIT · [The Web HIG](https://github.com/frozonfreak/webhig)
