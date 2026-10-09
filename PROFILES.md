# Conformance profiles — The Web HIG

The Web HIG is one standard with **multiple consumption profiles**. Profiles describe how much of the contract you load day to day; they do not grant permission to ignore universal MUST requirements.

**Universal (all profiles):** Layer 0 archetype resolution; accessibility, token, and performance requirements applicable to the page; documented exceptions only via the HIG exception system.

---

## Profile comparison

| Profile | Primary artifacts | Typical audience | Audit depth |
| --- | --- | --- | --- |
| **Quick Reference** | [HIG-CORE.md](./HIG-CORE.md) + [HIG-QUICK.md](./HIG-QUICK.md) | Developers, designers, AI agents (default) | PR review, agent guardrails |
| **Practical** | Quick + [HIG-LITE.md](./HIG-LITE.md) + [rules/](./rules/) + [framework/](./framework/) | Feature teams shipping UI | Topic modules + archetype packs |
| **Full specification** | Practical + [HIG.md](./HIG.md) | Staff engineers, QA, compliance | CI gate definitions, disputes |

Tell an AI agent: *"Follow The Web HIG Quick Reference profile"* or *"Follow The Web HIG Quick Reference."*

---

## Quick Reference profile (lightweight)

**Goal:** Maximum leverage per token — daily coding and code review.

**Include in product repo:**

- `docs/hig/VERSION`
- `docs/hig/HIG-QUICK.md`
- `docs/hig/HIG-CORE.md` (optional but recommended for archetypes)
- Agent rule from [examples/agent-rules/](./examples/agent-rules/) (or `npx @web-hig/install`)

**Does not replace:** Archetype map (`docs/hig-scope.md`), accessibility testing, or performance monitoring.

**When to escalate:** Open [HIG-LITE.md](./HIG-LITE.md) or a topic module when the task matches [rules/manifest.yaml](./rules/manifest.yaml) triggers (forms, modals, checkout, etc.).

---

## Practical profile

**Goal:** Feature-complete guidance with rule IDs without loading the full spec.

**Add:**

- [HIG-LITE.md](./HIG-LITE.md)
- Full `docs/hig/rules/` (INDEX, manifest, modules, archetypes)
- Relevant [framework/](./framework/) adapter for your stack

**Workflow:**

1. Resolve archetype from `docs/hig-scope.md`.
2. Preload [rules/archetypes/{archetype}.md](./rules/archetypes/).
3. Load manifest modules on topic match.

---

## Full specification profile

**Goal:** Normative completeness for CI authoring, security review, and exception documentation.

**Add:**

- [HIG.md](./HIG.md) pinned to [VERSION](./VERSION)
- Layer 8 blocking/warning/observation gates implemented in pipeline where feasible
- Layer 9 security review for application/commerce/auth surfaces

Use [SPECIFICATION.md](./SPECIFICATION.md) as the layer index.

---

## Profile selection guide

| Situation | Start profile |
| --- | --- |
| New repo, AI-heavy workflow | Quick Reference |
| Established product team | Practical |
| Regulated environment or formal audit | Full specification |
| Marketing site only | Quick + content archetype pack |
| Checkout or admin tools | Practical minimum; Full for mutations and security |

---

## Claiming conformance

Public claims should state:

1. Pinned semver ([VERSION](./VERSION))
2. Profile(s) in use
3. Archetypes in scope (link to your `hig-scope.md` or ADOPTERS entry)

Example: *"Acme App pins Web HIG v1.13.0 Practical profile for Application and Auth archetypes."*

List public adoptions in [ADOPTERS.md](./ADOPTERS.md).

---

## PR review checklist & badge text

Copy the markdown checklist from [examples/conformance-checklist.md](./examples/conformance-checklist.md) into your PR template or `.github/pull_request_template.md`.

**Suggested README badge line** (edit version, profile, archetypes):

> This project pins **The Web HIG v1.13.0** · **Practical** profile · **Application** and **Auth** archetypes. Scope: `docs/hig-scope.md` (product repo path).

No official logo is required; state pinned semver and profile honestly.

To *spread* the standard (not claim conformance), copy the share badge from [SHARE.md](./SHARE.md).
