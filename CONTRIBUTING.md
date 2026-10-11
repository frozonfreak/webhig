# Contributing to The Web HIG

Thank you for helping improve an **open behavioral standard** for the web. This repository holds the specification and supporting artifacts — not a reference UI library.

**Before you start:** [RATIONALE.md](./RATIONALE.md) (why we exist) · [SPECIFICATION.md](./SPECIFICATION.md) (where normative text lives) · [VERSIONING.md](./VERSIONING.md) (semver rules)

---

## Local setup

Node.js **20** or newer (`engines` in [package.json](./package.json)).

```bash
git clone https://github.com/frozonfreak/webhig.git
cd webhig
npm ci
```

`npm ci` is what CI runs (`npm ci --include=dev` in [Validate HIG](./.github/workflows/validate.yml)). It installs from the lockfile, including the root workspaces.

`npm test` includes a motion fixture that launches Chrome or Chromium. CI installs Google Chrome. Locally, `google-chrome`, `google-chrome-stable`, or `chromium` needs to be on your PATH.

---

## Checks

Run these before opening a pull request. The same commands run on every pull request to `main`.

| Command | What it covers |
| --- | --- |
| `npm run validate` | Local Markdown links and anchors, rule ID consistency, version headers, manifest schema |
| `npm run lint` | ESLint for `scripts/` and `packages/` |
| `npm test` | Installer, golden-path fixture, CLI report, and the motion fixture |
| `npm run check:version-bump` | Compares `VERSION` with the base ref. Locally that is `origin/main`. A contract-file diff without a semver increase fails. See [VERSIONING.md](./VERSIONING.md). |
| `npm run build:docs` | Regenerates `docs/robots.txt`, `docs/sitemap.xml`, and `docs/404.html`, and checks share metadata. Commit the generated files when they change. |

`npm run format` runs Prettier on JavaScript (`scripts/`, `packages/`, `eslint.config.js`). It is not a CI gate. Run it when you edit those files.

README and CONTRIBUTING edits do not, by themselves, require a `VERSION` bump. Contract files do: `HIG.md`, `HIG-CORE.md`, `HIG-LITE.md`, `EVALUATOR.md`, `rules/`, `framework/`, `schema/`, and numbered rules in `HIG-QUICK.md`.

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

## Editorial fixes and rule changes

**Editorial fixes** repair links, typos, contributor docs, or site copy without changing what a rule requires. They do not need governance review. Run the [checks](#checks) that apply. Skip a `VERSION` bump unless a contract file also changes.

**Rule changes** add a requirement or revise one: normative text, severity, applicability, a stable ID, or the meaning of a MUST / SHOULD. Every new or revised rule goes through **governance review before merging**.

### What a rule proposal must describe

Search [issues](https://github.com/frozonfreak/webhig/issues) for duplicates, then open a **[Spec change proposal](./.github/ISSUE_TEMPLATE/spec-change.yml)**. The proposal must describe:

- **User harm** — who is affected, and how, when the interface does not follow the guidance
- **Capability condition** — when the requirement applies (archetype, surface, or capability)
- **Evidence** — what you observed or measured
- **Alternative implementations** — other ways to address the same harm, and why this one was chosen
- **Test cases** — how a reviewer can check the requirement
- **Exceptions** — cases that stay out of scope, and why
- **Compatibility impact** — whether existing pins, severity, or behavior change (patch, minor, or major)

The template records affected layers, the problem, the proposed wording, and the expected version impact. Include the seven items above in that issue, or in the pull request that links it, even when a template field does not ask for them by name.

---

## How to open a pull request

1. Branch from `main`. Keep the change focused. Do not mix an editorial fix and a rule change in one pull request.
2. Run the [checks](#checks).
3. Open the pull request with [.github/PULL_REQUEST_TEMPLATE.md](./.github/PULL_REQUEST_TEMPLATE.md).

Commit subjects in this repository are imperative sentences that name the change (`Add …`, `Fix …`, `Document …`). Use the body to say why when the subject is not enough.

Contract file changes must bump [VERSION](./VERSION) (see [VERSIONING.md](./VERSIONING.md)).

### File sync checklist (substantive rule changes)

After the spec-change proposal is open, keep these files in sync in the pull request:

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

## Governance

- **Editorial fixes** can merge after CI passes and a maintainer review.
- **New or revised rules** wait for governance review before merging. The proposal must cover user harm, the capability condition, evidence, alternative implementations, test cases, exceptions, and compatibility impact. Start from the [spec change proposal](./.github/ISSUE_TEMPLATE/spec-change.yml).
- **Maintainers** merge pull requests that pass CI and align with [RATIONALE.md](./RATIONALE.md) non-goals.
- **Major semver** changes should include migration notes in RELEASE_NOTES.
- **Disputes** defer to full [HIG.md](./HIG.md) text; open an issue if Layer 1/2 extracts disagree with Layer 3.

Roadmap context: [ROADMAP.md](./ROADMAP.md)

---

## Documentation site

The public site is static HTML in [`docs/`](./docs/) — hub [`index.html`](./docs/index.html) plus [`understand.html`](./docs/understand.html), [`adopt.html`](./docs/adopt.html) (share UI), [`ai.html`](./docs/ai.html), and [`reference.html`](./docs/reference.html) — deployed to [GitHub Pages](https://frozonfreak.github.io/webhig/) on every push to `main` ([`.github/workflows/pages.yml`](./.github/workflows/pages.yml)).

```bash
npm run build:docs
```

regenerates `docs/robots.txt`, `docs/sitemap.xml`, and `docs/404.html`. Commit those files with your change. Share metadata (canonical URL, Open Graph, Twitter card, JSON-LD) lives in `docs/index.html`; the share image is `docs/social/og-image.png`. The weekly workflow [`.github/workflows/link-check.yml`](./.github/workflows/link-check.yml) checks **external** URLs and opens or updates a `broken-links` issue.

### Quality gates (every push/PR)

The [checks](#checks) above are the local equivalents. CI also runs an offline link check (`lychee --offline` on Markdown and `docs/**/*.html`) in the Validate HIG workflow.

On a version tag (`vX.Y.Z`), [`.github/workflows/release.yml`](./.github/workflows/release.yml) drafts a GitHub Release from [CHANGELOG.md](./CHANGELOG.md) and [RELEASE_NOTES.md](./RELEASE_NOTES.md).

[`.github/workflows/discovery.yml`](./.github/workflows/discovery.yml) syncs the GitHub description, homepage, topics, and social preview from [`.github/repo-discovery.json`](./.github/repo-discovery.json). Those calls need the **`REPO_ADMIN_TOKEN`** repository secret: a fine-grained personal access token with Administration read and write on this repo. When that secret is unset, the workflow prints a notice and skips the sync instead of failing.

---

## Code of conduct

All participants follow the [Code of Conduct](./CODE_OF_CONDUCT.md).

Security issues: [SECURITY.md](./SECURITY.md) — do not open public issues for sensitive reports.
