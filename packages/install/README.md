# @web-hig/install

Pin [The Web HIG](https://github.com/frozonfreak/webhig) into your product repository: **version file**, **HIG-QUICK** (and optional LITE / full spec), **rules/** modules, **framework/** adapters, and **agent rules** for Cursor, Claude Code, Copilot, and Windsurf.

**Not a component library.** You keep your stack and design system; this installs the **behavioural contract** agents and CI can reference.

---

## Install / run

No global install required:

```bash
npx @web-hig/install
```

Equivalent onboarding via the unified CLI:

```bash
npx @web-hig/cli init
```

---

## What gets written

Default target: current directory. Default pin directory: **`docs/hig/`**.

### Quick profile (default)

| Output | Purpose |
| --- | --- |
| `docs/hig/VERSION` | Semver pin (must match agent rules) |
| `docs/hig/HIG-QUICK.md` | Layer 1 — daily dev + AI default context |
| `docs/hig/HIG-CORE.md` | Archetypes, philosophy, simplicity rule |
| `docs/hig/rules/registry.yaml`, `manifest.yaml` | Rule inventory and progressive-loading metadata for CLI discovery |
| `web-hig.yaml` | Initial profile, version, and detected source scope; created only if absent |
| `docs/hig-scope.md` | Example scope map (only if missing) |
| Editor rules + `web-hig` skill | Cursor, Claude, Copilot, Windsurf, `AGENTS.md` |

### Practical profile

Everything in **quick**, plus:

| Output | Purpose |
| --- | --- |
| `docs/hig/HIG-LITE.md` | Rule IDs and checklists |
| `docs/hig/rules/` | Topic modules, archetype packs, **`registry.yaml`** |
| `docs/hig/framework/` | React, Next, Vue, Nuxt, Astro adapters |

Quick also supports **`web-hig check`** / **`@web-hig/core`**. Practical supplies the detailed module documents referenced by the manifest.

### Full profile

Everything in **practical**, plus:

| Output | Purpose |
| --- | --- |
| `docs/hig/HIG.md` | Complete normative specification |

---

## Options

```bash
npx @web-hig/install --dir ./my-app
npx @web-hig/install --editors cursor,claude
npx @web-hig/install --profile practical
npx @web-hig/install --profile full --force
npx @web-hig/install --dry-run
```

| Flag | Meaning |
| --- | --- |
| `--dir <path>` | Target project (default: cwd) |
| `--editors <list>` | `cursor`, `claude`, `copilot`, `windsurf`, `agents` (default: all) |
| `--profile <name>` | `quick` (default), `practical`, `full` |
| `--docs-dir <path>` | Pin directory (default: `docs/hig`) |
| `--force` | Overwrite existing dedicated HIG files |
| `--dry-run` | Print actions without writing |
| `--no-scope` | Skip `docs/hig-scope.md` |

---

## After installing

1. **Customize scope** — Edit `docs/hig-scope.md` (archetypes per route/product area).
2. **Tell agents** — e.g. *“Follow The Web HIG Quick Reference; pin is in docs/hig/.”*
3. **Optional conformance CLI** — Install [`@web-hig/cli`](../cli/) and run `web-hig doctor`, `web-hig check --strict`, and `web-hig coverage --format json`. The default pin directory is discovered automatically.
4. **Upgrade** — Preview the target installer with `--dry-run --force` after reviewing [RELEASE_NOTES.md](https://github.com/frozonfreak/webhig/blob/main/RELEASE_NOTES.md). An existing configuration or VERSION pin that differs from the payload stops installation before writes unless `--force` is explicit. Existing `web-hig.yaml` is preserved even with `--force`; update its version after reviewing changes.

Repeated installation preserves user instructions outside the managed HIG block. Broken or duplicate merge markers stop the entire plan before writes. Dedicated files remain unchanged without `--force`. Review generated scope and archetype before enforcement; source-layout detection is not a framework build or behavior check. With `--docs-dir`, also set `WEB_HIG_ROOT` to that directory and review agent references, which use the default layout.

Example agent contract line:

```text
Pinned contract: The Web HIG v1.16.0 · Practical profile · Application archetype
```

---

## Profiles vs npm tooling

| Concept | Meaning |
| --- | --- |
| **Install profile** (`quick` / `practical` / `full`) | How much documentation is **copied** into `docs/hig/` |
| **CLI profile** (in `web-hig.yaml`) | How much of the contract **`web-hig check`** evaluates |

See [PROFILES.md](https://github.com/frozonfreak/webhig/blob/main/PROFILES.md).

---

## Manual alternative

You can vendor files by hand instead of this package:

1. Copy [VERSION](https://github.com/frozonfreak/webhig/blob/main/VERSION) and [HIG-QUICK.md](https://github.com/frozonfreak/webhig/blob/main/HIG-QUICK.md) into `docs/hig/`.
2. Copy templates from [examples/agent-rules/](https://github.com/frozonfreak/webhig/tree/main/examples/agent-rules).

The installer keeps pins aligned with the published npm version’s bundled payload.

---

## Integration guide

Full adoption path: [INTEGRATION.md](https://github.com/frozonfreak/webhig/blob/main/INTEGRATION.md)

---

## Related packages

| Package | Role |
| --- | --- |
| [`@web-hig/cli`](../cli/) | `web-hig check`, `explain`, `init` |
| [`@web-hig/core`](../core/) | Programmatic registry and reports |

---

## Publish (maintainers)

From this directory, after contract [VERSION](https://github.com/frozonfreak/webhig/blob/main/VERSION) matches `package.json`:

See [packages/PUBLISHING.md](../PUBLISHING.md) for npm org `@web-hig`, **Automation** tokens, and CI.

```bash
node scripts/sync-vendor.mjs
npm publish --access public
```

`prepack` syncs `vendor/` automatically. Do not commit `vendor/`.

---

## License

MIT · [The Web HIG](https://github.com/frozonfreak/webhig)
