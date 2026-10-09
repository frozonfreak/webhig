# Versioning — The Web HIG

The Web HIG uses [Semantic Versioning 2.0.0](https://semver.org/) for the **contract**, not for application code in consumer repos.

---

## Single source of truth

| Location | Purpose |
| --- | --- |
| [VERSION](./VERSION) | Plain semver string — **pin this in product repos** |
| [HIG.md](./HIG.md) title | Must match `VERSION` |
| [HIG-QUICK.md](./HIG-QUICK.md), [HIG-LITE.md](./HIG-LITE.md), [HIG-CORE.md](./HIG-CORE.md) | Header version must match |
| [rules/manifest.yaml](./rules/manifest.yaml) | `version:` field must match |
| Git tag | `v{MAJOR}.{MINOR}.{PATCH}` (e.g. `v1.13.0`) |

CI runs `npm run validate` to enforce sync across these files.

On pull requests and pushes, `npm run check:version-bump` compares `VERSION` to the base branch:

- Changing `HIG.md`, `HIG-CORE.md`, `HIG-LITE.md`, `EVALUATOR.md`, `rules/`, `framework/`, or `schema/` **requires** a semver increase.
- Changing numbered rules in [HIG-QUICK.md](./HIG-QUICK.md) also requires a bump; onboarding copy in that file does not.
- A bumped version needs a [CHANGELOG.md](./CHANGELOG.md) heading (or Unreleased entries). Minor and major bumps also need [RELEASE_NOTES.md](./RELEASE_NOTES.md).

Tag `v{MAJOR}.{MINOR}.{PATCH}` to draft GitHub Release notes from those files.

---

## Semver semantics for the contract

| Bump | When | Consumer impact |
| --- | --- | --- |
| **MAJOR** | Breaking change to a MUST requirement, token semantics, or archetype mandatory matrix | Re-audit; update pins and CI gates |
| **MINOR** | New rules, modules, or backward-compatible guidance | Safe to upgrade pins; review RELEASE_NOTES |
| **PATCH** | Typos, clarifications that do not change meaning | Low risk; still run validate in consumer CI |

Adding a new **SHOULD** or optional module is typically **minor**. Tightening a **SHOULD** to **MUST** is **major**.

---

## Pinning in product repositories

Recommended layout:

```
docs/hig/
  VERSION
  HIG-QUICK.md
  HIG-LITE.md
  HIG.md
  rules/
  framework/
docs/hig-scope.md          # your routes → archetypes
```

**Pin strategies:**

| Strategy | Tradeoff |
| --- | --- |
| **Vendor copy** | Fastest; you merge upstream on upgrade |
| **Git submodule / subtree** | Pull upstream tags; path fixed in repo |
| **Release URL** | Agent rules reference `.../blob/v1.13.0/HIG-QUICK.md` |

Always record the pinned version in PR templates or `docs/hig/VERSION` so agents and CI agree.

---

## Upgrade procedure

1. Read [RELEASE_NOTES.md](./RELEASE_NOTES.md) for the target version.
2. Replace pinned files (or pull tag `vX.Y.Z`).
3. Run `npm run validate` in the HIG repo clone, or run equivalent checks on copied files if you vendor scripts.
4. Diff [CHANGELOG.md](./CHANGELOG.md) for rule ID or matrix changes.
5. Update agent rules under `.cursor/rules/`, `AGENTS.md`, etc. if Layer 7 YAML changed.

---

## Pre-release and draft work

Work on `main` represents the **next** published contract until tagged. For stability, product teams should pin **tags**, not floating `main`.

---

## Related documents

- [CHANGELOG.md](./CHANGELOG.md) — Keep a Changelog format
- [RELEASE_NOTES.md](./RELEASE_NOTES.md) — adoption-focused release write-ups
- [HIG.md §8.1](./HIG.md#81-version-history) — brief version history in the normative spec
