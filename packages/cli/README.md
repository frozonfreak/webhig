# @web-hig/cli

Command-line conformance tooling for [The Web HIG](https://github.com/frozonfreak/hig). Evaluate a pinned HIG contract against your repository with **`web-hig check`**, inspect rules with **`web-hig explain`**, and onboard with **`web-hig init`**.

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

For **`check`** and **`explain`**, the CLI needs **`rules/registry.yaml`**. Use at least the **practical** profile:

```bash
npx web-hig init --profile practical
```

### 2. Point the CLI at the pinned contract

Registry resolution looks for `rules/registry.yaml` under **`WEB_HIG_ROOT`** or by walking up from the current directory.

```bash
# Linux / macOS
export WEB_HIG_ROOT=docs/hig

# Windows PowerShell
$env:WEB_HIG_ROOT = "docs/hig"
```

### 3. Add `web-hig.yaml` (optional but recommended)

Copy [web-hig.example.yaml](https://github.com/frozonfreak/hig/blob/main/examples/web-hig.example.yaml) to your repo root:

```yaml
version: "1.13.0"
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

### `web-hig check`

```text
web-hig check [options]

Options:
  --profile <quick|practical|full>   Override web-hig.yaml profile
  --config <path>                    Config file (default: web-hig.yaml)
  --json                             Evaluator JSON on stdout
  --help
```

**Exit code:** `1` when `gates.blocking` is `fail` and there are blocking findings; otherwise `0`.

**Example output:**

```text
Web HIG v1.13.0

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

Shows requirement, severity, profiles, archetypes, evaluation methods, autofix policy, and HIG section from [rules/registry.yaml](https://github.com/frozonfreak/hig/blob/main/rules/registry.yaml).

---

## Profiles and archetypes

**Profiles** (how much of the spec loads for evaluation — not the same as normative “layers”):

| Profile | Typical use |
| --- | --- |
| `quick` | Fast PR feedback, agent guardrails |
| `practical` | Default production CI |
| `full` | Formal review (+ manual / observational rules in future audit) |

**Archetypes:** `content` · `commerce` · `application` · `auth` — resolve from [hig-scope](https://github.com/frozonfreak/hig/blob/main/examples/hig-scope.example.md).

Details: [PROFILES.md](https://github.com/frozonfreak/hig/blob/main/PROFILES.md)

---

## Static checks (today)

Built-in checks grow over time; current deterministic rules include:

| Rule ID | What it detects |
| --- | --- |
| **HIG-MOT-001** | `transition: all` in application CSS |
| **HIG-A11Y-001** | Motion styles without `prefers-reduced-motion` handling |

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
- run: npx web-hig init --profile practical --editors none --no-scope
  env:
    # init is usually committed once; skip in CI if docs/hig is vendored
- run: npx web-hig check
  env:
    WEB_HIG_ROOT: docs/hig
```

Commit `docs/hig/` and `web-hig.yaml` so CI does not re-init every run.

---

## Monorepo / HIG development

From a clone of [github.com/frozonfreak/hig](https://github.com/frozonfreak/hig):

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

Design: [NPM-TOOLING.md](https://github.com/frozonfreak/hig/blob/main/NPM-TOOLING.md) · Evaluator: [EVALUATOR.md](https://github.com/frozonfreak/hig/blob/main/EVALUATOR.md)

---

## License

MIT · [The Web HIG](https://github.com/frozonfreak/hig)
