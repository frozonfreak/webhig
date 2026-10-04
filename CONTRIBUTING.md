# Contributing to The Web HIG

Thank you for helping improve an **open behavioral standard** for the web. This repository holds the specification and supporting artifacts — not a reference UI library.

**Before you start:** [RATIONALE.md](./RATIONALE.md) (why we exist) · [SPECIFICATION.md](./SPECIFICATION.md) (where normative text lives) · [VERSIONING.md](./VERSIONING.md) (semver rules)

---

## What belongs here

Good contributions:

- Clarifying ambiguous **MUST** / **SHOULD** language or resolving contradictions
- New or refined rules with stable IDs, severity, and archetype applicability
- Layer 0 matrix updates for archetypes
- Synchronized updates across [HIG.md](./HIG.md), [HIG-QUICK.md](./HIG-QUICK.md), [HIG-LITE.md](./HIG-LITE.md), and [rules/*.md](./rules/)
- [rules/INDEX.md](./rules/INDEX.md) and [rules/manifest.yaml](./rules/manifest.yaml) registry entries
- After changing numbered rules in [HIG-QUICK.md](./HIG-QUICK.md), run **`npm run sync:quick-map`** (updates [rules/quick-rule-map.yaml](./rules/quick-rule-map.yaml))
- [framework/*.md](./framework/) adapter improvements
- Machine-readable artifacts ([MACHINE_READABLE.md](./MACHINE_READABLE.md), [schema/](./schema/))
- [INTEGRATION.md](./INTEGRATION.md), [examples/](./examples/), [skills/](./skills/), and agent templates
- Installer package ([packages/install](./packages/install/)) — keep its `version` in sync with [VERSION](./VERSION)
- Adopter entries ([ADOPTERS.md](./ADOPTERS.md)) with pinned semver evidence

Out of scope:

- Product-specific components or themes
- Breaking visual redesigns of the docs site without accessibility review
- Secrets or proprietary product code

---

## How to propose a spec change

1. **Search [issues](https://github.com/frozonfreak/webhig/issues)** for duplicates.
2. Open a **[Spec change proposal](./.github/ISSUE_TEMPLATE/spec-change.yml)** — describe problem, affected layers, and backward compatibility.
3. Fork, branch from `main`, implement focused edits.
4. Run **`npm install`** (root workspaces), then **`npm run validate`**, **`npm run lint`**, and **`npm test`** — CI rejects contract integrity failures (Markdown links, rule ID consistency, manifest schema, version headers).
5. Open a PR using [.github/PULL_REQUEST_TEMPLATE.md](./.github/PULL_REQUEST_TEMPLATE.md). Contract file changes must bump [VERSION](./VERSION) (see [VERSIONING.md](./VERSIONING.md)).

### File sync checklist (substantive rule changes)

| Step | File(s) |
| --- | --- |
| Normative text | [HIG.md](./HIG.md) |
| High-frequency imperatives | [HIG-QUICK.md](./HIG-QUICK.md) |
| Practical summary + IDs | [HIG-LITE.md](./HIG-LITE.md) |
| Topic depth | Relevant [rules/*.md](./rules/) |
| Index / triggers | [rules/INDEX.md](./rules/INDEX.md), [rules/manifest.yaml](./rules/manifest.yaml) |
| Version bump | [VERSION](./VERSION), title in HIG.md, manifest `version:`, [packages/install/package.json](./packages/install/package.json) |
| Agent skill / templates | [skills/web-hig/SKILL.md](./skills/web-hig/SKILL.md), [examples/agent-rules/](./examples/agent-rules/) (when Layer 7 YAML changes) |
| Release docs | [CHANGELOG.md](./CHANGELOG.md), [RELEASE_NOTES.md](./RELEASE_NOTES.md), [HIG.md §8.1](./HIG.md#81-version-history) |

Every Lite and Quick rule **must** map to a canonical rule ID in HIG.md.

---

## Versioning

Follow [Semantic Versioning](https://semver.org/) as documented in [VERSIONING.md](./VERSIONING.md):

| Bump | Examples |
| --- | --- |
| **PATCH** | Typos, non-meaning clarifications |
| **MINOR** | New rules, modules, backward-compatible guidance |
| **MAJOR** | Breaking MUST requirements, token semantics, mandatory matrix |

---

## Writing style

- Prefer **testable** requirements — verifiable by humans, linters, or CI
- Use RFC 2119 keywords consistently (see [HIG-CORE.md](./HIG-CORE.md))
- Tables and diagrams over long prose when they reduce ambiguity
- Mark archetype-specific rules explicitly
- Cite related rule IDs instead of duplicating normative paragraphs

---

## Governance (lightweight)

- **Maintainers** merge PRs that pass CI and align with [RATIONALE.md](./RATIONALE.md) non-goals
- **Major semver** changes should include migration notes in RELEASE_NOTES
- **Disputes** defer to full [HIG.md](./HIG.md) text; open an issue if Layer 1/2 extracts disagree with Layer 3

Roadmap context: [ROADMAP.md](./ROADMAP.md)

---

## Documentation site

The public site is static HTML in [`docs/`](./docs/) — hub [`index.html`](./docs/index.html) plus [`understand.html`](./docs/understand.html), [`adopt.html`](./docs/adopt.html) (share UI), [`ai.html`](./docs/ai.html), and [`reference.html`](./docs/reference.html) — deployed to [GitHub Pages](https://frozonfreak.github.io/webhig/) on every push to `main` ([`.github/workflows/pages.yml`](./.github/workflows/pages.yml)).

```bash
npm run build:docs
```

regenerates `docs/robots.txt`, `docs/sitemap.xml`, and `docs/404.html`. Commit those files with your change. Share metadata (canonical URL, Open Graph, Twitter card, JSON-LD) lives in `docs/index.html`; the share image is `docs/social/og-image.png`. The weekly workflow [`.github/workflows/link-check.yml`](./.github/workflows/link-check.yml) checks **external** URLs and opens or updates a `broken-links` issue.

### Quality gates (every push/PR)

| Check | How |
| --- | --- |
| Local Markdown links and anchors | `npm run validate` |
| Rule ID consistency (INDEX, manifest, HIG.md, modules, registry, Quick map) | `npm run validate` |
| Version header sync | `npm run validate` |
| Version bump rules | `npm run check:version-bump` |
| Offline Markdown/HTML link targets | GitHub Actions `lychee --offline` |
| Docs share artifacts | `npm run build:docs` |
| Manifest YAML vs JSON Schema | `npm run validate` |
| JavaScript (scripts + packages) | `npm run lint` |
| Installer + golden-path fixture | `npm test` |

On a version tag (`vX.Y.Z`), [`.github/workflows/release.yml`](./.github/workflows/release.yml) drafts a GitHub Release from [CHANGELOG.md](./CHANGELOG.md) and [RELEASE_NOTES.md](./RELEASE_NOTES.md).

---

## Code of conduct

All participants follow the [Code of Conduct](./CODE_OF_CONDUCT.md).

Security issues: [SECURITY.md](./SECURITY.md) — do not open public issues for sensitive reports.
