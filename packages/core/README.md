# @web-hig/core

Shared evaluator engine for [The Web HIG](https://github.com/frozonfreak/webhig) — load the rule registry, parse project contracts, and build multidimensional conformance reports.

This package is **not** a UI library. It implements tooling around the HIG **behavioural contract** (accessibility, motion, SSR, tokens, and related rule IDs).

---

## Install

```bash
npm install @web-hig/core
```

Most teams install **`@web-hig/cli`** instead, which depends on this package. Use **`@web-hig/core`** when building custom CI, editors, or agent integrations.

---

## Prerequisites

The engine reads **`rules/registry.yaml`** from a HIG contract tree on disk. It does **not** embed the full registry in the npm tarball.

| Setup | `WEB_HIG_ROOT` |
| --- | --- |
| [ `@web-hig/install` ](../install/) with any profile | Automatically discovered `docs/hig` (contains `rules/registry.yaml`) |
| Git clone of [frozonfreak/webhig](https://github.com/frozonfreak/webhig) | repository root |
| Custom vendor layout | directory that contains `rules/registry.yaml` |

```bash
export WEB_HIG_ROOT=docs/hig   # typical product repo after init
```

If unset, `resolveHigRoot()` walks up from `process.cwd()` looking for `rules/registry.yaml` or `docs/hig/rules/registry.yaml`. An explicit invalid override returns null.

---

## Quick start

```javascript
import {
  resolveHigRoot,
  loadRegistry,
  loadProjectConfig,
  filterRulesByContract,
  createReport,
  printTerminalReport,
  severityBucketForRule,
} from '@web-hig/core';

const higRoot = resolveHigRoot(process.cwd());
if (!higRoot) throw new Error('Set WEB_HIG_ROOT or vendor docs/hig from @web-hig/install');

const registry = loadRegistry(higRoot);
const { config } = loadProjectConfig(process.cwd());
const profile = config?.profile ?? 'practical';
const archetype = config?.archetype ?? 'application';

const staticRules = filterRulesByContract(registry, { profile, archetype });

const report = createReport({
  higVersion: registry.version,
  profile,
  archetype,
  framework: config?.framework?.name ?? null,
  findings: [],
});

console.log(printTerminalReport(report));
console.log(`Applicable static rules: ${staticRules.length}`);
```

---

## API

### Registry

| Export | Description |
| --- | --- |
| `resolveHigRoot(startDir?)` | Find directory containing `rules/registry.yaml` |
| `loadRegistry(higRoot)` | Load parsed registry (`version`, `rules` Map) |
| `parseRegistryYaml(string)` | Parse registry YAML text |
| `filterRulesByContract(registry, { profile, archetype })` | Rules with `static` evaluation for profile + archetype |

**Profiles:** `quick` · `practical` · `full`  
**Archetypes:** `content` · `commerce` · `application` · `auth`

### Project contract

| Export | Description |
| --- | --- |
| `loadProjectConfig(cwd, fileName?)` | Parse `web-hig.yaml` (default name) |
| `defaultProjectConfig(higVersion)` | Defaults when no config file exists |
| `validateProjectConfig(input)` | Validate profile, archetype, version, scope and gates; reject unknown keys and wrong types |

See [web-hig.example.yaml](https://github.com/frozonfreak/webhig/blob/main/examples/web-hig.example.yaml).

### Reports (Layer 8 / evaluator)

| Export | Description |
| --- | --- |
| `createReport({ higVersion, profile, archetype, framework, findings })` | Report object with `severity_counts` |
| `printTerminalReport(report)` | Human-readable summary |
| `severityBucketForRule(severity)` | Maps `error` → `blocking`, `warning` → `warnings`, `info` → `observations` |

Finding shape aligns with [EVALUATOR.md](https://github.com/frozonfreak/webhig/blob/main/EVALUATOR.md):

```json
{
  "rule_id": "HIG-MOT-001",
  "dimension": "motion",
  "severity_bucket": "blocking",
  "message": "Application CSS uses transition: all.",
  "location": "src/app.css:12",
  "evaluation": "static"
}
```

### Verification evidence

`filterRulesByContract(registry, { profile, archetype, evaluation: null })` includes all applicable rules, including manual/runtime rules. The default remains the static subset for compatibility.

`createAssessments({ rules, checks, findings, files })` records each rule's declared modes, detector coverage, result, reason and evidence. `summarizeAssessments(assessments)` counts outcomes. Current static detectors are partial: they can identify a potential failure but never prove a pass from absence of findings. Manual-only rules require human review; unsupported or incompletely checked rules remain not assessed.

The tooling-owned, independently versioned [verification report schema](./lib/verification-report.schema.json) is exported as `@web-hig/core/verification-report.schema.json`. It requires affirmative evidence and full coverage for any future `passed` result. CLI `check --json` and `coverage --format json` are schema-tested. This additive evidence format does not replace the standard's draft multidimensional report or claim compatibility with a deployed HIG Audit version.

---

## Rule metadata

Each registry entry includes:

- `severity` — `error` | `warning` | `info`
- `requirement` — short normative summary
- `profiles`, `archetypes`, `evaluation` — applicability
- `autofix` — `safe` | `unsafe` | `none`
- `module`, `hig_section` — links into the spec
- `eslint_rule` — planned linter id (when present)

Normative source: [HIG.md](https://github.com/frozonfreak/webhig/blob/main/HIG.md) · Registry: [rules/registry.yaml](https://github.com/frozonfreak/webhig/blob/main/rules/registry.yaml)

---

## Related packages

| Package | Role |
| --- | --- |
| [`@web-hig/cli`](../cli/) | `web-hig check`, `explain`, `init` |
| [`@web-hig/install`](../install/) | Pin HIG docs and agent rules into your repo |

Architecture: [NPM-TOOLING.md](https://github.com/frozonfreak/webhig/blob/main/NPM-TOOLING.md)

---

## License

MIT · [The Web HIG](https://github.com/frozonfreak/webhig)
