# The Web HIG

[![Version](https://img.shields.io/github/v/tag/frozonfreak/webhig?label=version\&color=1d4ed8)](https://github.com/frozonfreak/webhig/releases)
[![License: MIT](https://img.shields.io/github/license/frozonfreak/webhig)](./LICENSE)
[![CI](https://github.com/frozonfreak/webhig/actions/workflows/validate.yml/badge.svg)](https://github.com/frozonfreak/webhig/actions/workflows/validate.yml)
[![Pin me](https://img.shields.io/badge/Pin_me-HIG--QUICK.md-0f172a)](./HIG-QUICK.md)

**A practical standard for how modern web interfaces should behave.**

The Web HIG provides a common set of rules for building web applications that are usable, accessible, responsive, performant, predictable, and safe.

It does **not** tell you what your product should look like.

Keep your existing design system, framework, components, branding, and visual style. The Web HIG defines the expected **behavior and quality of the interface around them**.

For example, it covers questions such as:

* What should happen while data is loading?
* How should errors and empty states behave?
* When is optimistic UI appropriate?
* How should destructive actions be handled?
* What accessibility requirements should every interface meet?
* How should responsive layouts, forms, navigation, search, and notifications behave?
* What performance expectations should a production interface meet?
* How should AI coding agents apply these rules consistently?

The same standard can be used by **developers, designers, reviewers, CI systems, and AI coding agents**.

---

## Already have a website?

Use **[HIG Audit](https://hig.aruviflow.com/)** to evaluate an existing website against The Web HIG.

**The Web HIG** is the standard.
**HIG Audit** is a separate tool that applies the standard to an existing implementation.

```text
The Web HIG
    │
    │ defines the rules
    ▼
Your application / design system
    │
    │ can be evaluated with
    ▼
HIG Audit
```

[Open HIG Audit →](https://hig.aruviflow.com/)

---

## What The Web HIG is

The Web HIG is a **vendor-neutral, versioned web interface standard**.

It defines testable guidance for:

* interaction and UX behavior
* loading, empty, error, stale, and offline states
* navigation and information architecture
* forms and validation
* destructive actions and mutations
* accessibility, targeting WCAG 2.2 AA
* responsive layout and design tokens
* motion and animation
* search and notifications
* rendering and application architecture
* performance
* security and privacy UX
* AI-assisted development and enforcement

Rules can be referenced using stable `HIG-*` identifiers where applicable, allowing teams and tools to discuss the same requirement consistently.

---

## What it is not

The Web HIG is **not**:

* a component library
* a CSS framework
* a Figma UI kit
* a replacement for your design system
* a visual style or branding system
* a replacement for WCAG, HTML, CSS, or ARIA
* an automated audit tool

Your design system defines **what your interface looks like**.

**The Web HIG defines how the interface should behave.**

---

## Start in 5 minutes

You do not need to read the complete specification.

Start with **[HIG-QUICK.md](./HIG-QUICK.md)**.

It contains the practical rules most developers and AI coding agents need during everyday work.

### For a developer

Copy `HIG-QUICK.md` and `VERSION` into your project:

```text
docs/
└── hig/
    ├── HIG-QUICK.md
    └── VERSION
```

Or use the installer:

```bash
npx @web-hig/install
```

### For an AI coding agent

After installing or copying the standard, instruct your agent:

```text
Follow The Web HIG Quick Reference for this project.
```

Agent integrations are available for:

* Cursor
* Claude Code
* GitHub Copilot
* Windsurf
* multi-agent environments

See [skills/](./skills/) and [examples/agent-rules/](./examples/agent-rules/).

---

## Companion: Design Decision Method

You can use WebHIG with your existing design process. WebHIG and Design Decision Method (DDM) help with different parts of the work, and each stands on its own.

| | What it helps you do | Example |
| --- | --- | --- |
| WebHIG | Build interfaces that behave clearly, consistently and accessibly | Make errors understandable and preserve entered information when saving fails |
| Design Decision Method (DDM) | Choose an interface that fits the people and task | Decide whether a task needs one form or a step-by-step flow |

If you also want help choosing layouts, navigation and interaction patterns, [DDM](https://frozonfreak.github.io/DesignDecesionMethod/) gives you a structured way to make those decisions. DDM is optional.

---

## Which document should I read?

Most people only need **HIG-QUICK**.

| Need                                        | Start here                              |
| ------------------------------------------- | --------------------------------------- |
| I just want to understand Web HIG           | [HIG-QUICK.md](./HIG-QUICK.md)          |
| I want to use it in a project               | [INTEGRATION.md](./INTEGRATION.md)      |
| I use Cursor / Claude / Copilot / Windsurf  | [skills/](./skills/)                    |
| I need individual rule IDs                  | [HIG-LITE.md](./HIG-LITE.md)            |
| I need the complete normative specification | [HIG.md](./HIG.md)                      |
| I want to understand why HIG exists         | [RATIONALE.md](./RATIONALE.md)          |
| I want to audit an existing website         | [HIG Audit](https://hig.aruviflow.com/) |

**Current release:** [v1.13.0](./VERSION) · [Changelog](./CHANGELOG.md) · [Release notes](./RELEASE_NOTES.md)

**[Documentation site](https://frozonfreak.github.io/webhig/)** · **[HIG Audit](https://hig.aruviflow.com/)** · **[Integration guide](./INTEGRATION.md)** · **[Adopters](./ADOPTERS.md)**

---

## One standard, three levels

The Web HIG uses progressive disclosure so projects and AI agents only load the level of detail they need.

| Level         | Document                                          | Use it for                                  |
| ------------- | ------------------------------------------------- | ------------------------------------------- |
| **Quick**     | [HIG-QUICK.md](./HIG-QUICK.md)                    | Daily development, agents, PR review        |
| **Practical** | [HIG-LITE.md](./HIG-LITE.md) + [rules/](./rules/) | Features, rule IDs, modules, archetypes     |
| **Full**      | [HIG.md](./HIG.md)                                | Edge cases, CI gates, formal interpretation |

```text
                    THE WEB HIG
                         │
       ┌─────────────────┼─────────────────┐
       │                 │                 │
 HIG-QUICK.md      HIG-LITE.md          HIG.md
   Layer 1           Layer 2            Layer 3
  ~5 minutes        Practical          Normative
       │                 │
       │           rules/ + framework/
       └─────────────────┴──► Same standard
```

The Quick Reference currently contains **98 numbered imperatives**.

The practical rule registry contains **76 stable `HIG-*` rule IDs**.

These numbers intentionally describe different layers. Quick rules are concise development heuristics; canonical IDs represent individually citeable requirements.

Machine-readable mappings are available in [rules/quick-rule-map.yaml](./rules/quick-rule-map.yaml).

---

## Where Web HIG fits

Modern products already use several layers of standards and tooling.

The Web HIG does not try to replace them.

| Layer           | Examples                                                                      |
| --------------- | ----------------------------------------------------------------------------- |
| Web platform    | HTML, CSS, ARIA                                                               |
| Accessibility   | WCAG 2.2                                                                      |
| Design system   | Material UI, shadcn, Tailwind-based systems, custom components                |
| **The Web HIG** | **Product behavior, interface states, architecture, quality and enforcement** |
| Application     | Routes, data, business logic                                                  |

In simplified form:

```text
HTML / CSS / ARIA
        ↓
      WCAG
        ↓
Your design system
        ↓
   The Web HIG
        ↓
Your application
```

See [RATIONALE.md](./RATIONALE.md) for the full reasoning.

---

## Built for humans and AI

The Web HIG is intended to work as a shared interface contract between humans and development tools.

```text
Developer / Designer
        ↓
  Pinned Web HIG
        ↓
    AI agent
        ↓
      Code
        ↓
 Review / Validation
        ↓
       CI
```

Instead of every developer or coding agent making independent UX decisions, the project can reference the same version of the same rules.

### Agent integrations

| Tool           | Always-on rule                                                                                         | Skill                       |
| -------------- | ------------------------------------------------------------------------------------------------------ | --------------------------- |
| Cursor         | [examples/agent-rules/cursor-hig.mdc](./examples/agent-rules/cursor-hig.mdc)                           | `.cursor/skills/web-hig/`   |
| Claude Code    | [examples/agent-rules/CLAUDE-hig.md](./examples/agent-rules/CLAUDE-hig.md)                             | `.claude/skills/web-hig/`   |
| GitHub Copilot | [examples/agent-rules/copilot-instructions-hig.md](./examples/agent-rules/copilot-instructions-hig.md) | `.github/skills/web-hig/`   |
| Windsurf       | [examples/agent-rules/windsurf-hig.md](./examples/agent-rules/windsurf-hig.md)                         | `.windsurf/skills/web-hig/` |
| Multi-agent    | [examples/agent-rules/AGENTS-hig.md](./examples/agent-rules/AGENTS-hig.md)                             | —                           |

Canonical skill: [skills/web-hig/SKILL.md](./skills/web-hig/SKILL.md)

Skill installation map: [skills/README.md](./skills/README.md)

Machine-readable topic loading: [rules/manifest.yaml](./rules/manifest.yaml)

---

## Use it with an existing project

Adopting HIG does **not** require rebuilding your interface.

A typical project can:

1. keep its existing framework and components
2. pin a Web HIG version
3. give the Quick Reference to developers and coding agents
4. apply rules when building or modifying features
5. reference `HIG-*` IDs during reviews where applicable
6. progressively add automated checks

For a guided adoption path, see [INTEGRATION.md](./INTEGRATION.md).

For evaluating an existing interface, use **[HIG Audit](https://hig.aruviflow.com/)**.

---

## Tooling

The specification and its automated tooling intentionally remain separate concepts.

This repository contains the standard, machine-readable rules, agent integrations, and supporting developer tooling.

### Available today

* `npx @web-hig/install`
* `web-hig check`
* `web-hig check --json`
* `explain`
* `upgrade`
* agent rule templates
* agent skills
* machine-readable manifests
* validation fixtures

### Separate audit tooling

For website evaluation and conformance analysis, use:

**[HIG Audit →](https://hig.aruviflow.com/)**

### Planned / evolving tooling

See:

* [ROADMAP.md](./ROADMAP.md)
* [NPM-TOOLING.md](./NPM-TOOLING.md)
* [MACHINE_READABLE.md](./MACHINE_READABLE.md)
* [EVALUATOR.md](./EVALUATOR.md)

---

## Specification overview

The current specification contains:

**98 Quick imperatives · 76 rule IDs · 17 topic modules · 4 page archetypes · Layers 0–9**

| Layer | Focus                                       |
| ----- | ------------------------------------------- |
| 0     | Applicability & archetypes                  |
| 1     | UX, motion, density                         |
| 2     | IA, forms, search, notifications, i18n      |
| 3     | Tokens, container layout                    |
| 4     | Server-driven UI, state machines, mutations |
| 5     | Accessibility — WCAG 2.2 AA target          |
| 6     | Performance — lab & field                   |
| 7     | Rule IDs, agent guardrails                  |
| 8     | CI blocking / warning / observation         |
| 9     | Security & privacy UX                       |

Full index: [SPECIFICATION.md](./SPECIFICATION.md)

Module index: [rules/INDEX.md](./rules/INDEX.md)

---

## Page archetypes

Not every rule applies to every page.

Web HIG first identifies the type of surface being built:

* **Content**
* **Commerce**
* **Application**
* **Authentication**

Content surfaces can additionally be classified as:

* document
* hybrid
* experience

This prevents teams and agents from blindly applying every requirement everywhere.

See [SPECIFICATION.md](./SPECIFICATION.md) and [PROFILES.md](./PROFILES.md).

---

## Standard documentation

| Document                                     | Purpose                            |
| -------------------------------------------- | ---------------------------------- |
| [HIG-QUICK.md](./HIG-QUICK.md)               | Fast onboarding and everyday rules |
| [RATIONALE.md](./RATIONALE.md)               | Why the standard exists            |
| [SPECIFICATION.md](./SPECIFICATION.md)       | Normative layer and module index   |
| [HIG.md](./HIG.md)                           | Complete normative specification   |
| [HIG-LITE.md](./HIG-LITE.md)                 | Practical rule-ID reference        |
| [PROFILES.md](./PROFILES.md)                 | Quick, Practical and Full profiles |
| [VERSIONING.md](./VERSIONING.md)             | Semver, pinning and upgrades       |
| [CHANGELOG.md](./CHANGELOG.md)               | Version history                    |
| [RELEASE_NOTES.md](./RELEASE_NOTES.md)       | Adoption-focused release notes     |
| [ROADMAP.md](./ROADMAP.md)                   | Standard and tooling direction     |
| [MACHINE_READABLE.md](./MACHINE_READABLE.md) | Machine-readable contract          |
| [EVALUATOR.md](./EVALUATOR.md)               | Evaluator and CI report contract   |
| [INTEGRATION.md](./INTEGRATION.md)           | Project adoption guide             |
| [CONTRIBUTING.md](./CONTRIBUTING.md)         | Governance and contributions       |
| [ADOPTERS.md](./ADOPTERS.md)                 | Projects using the standard        |
| [skills/](./skills/)                         | AI coding-agent skills             |
| [packages/install](./packages/install/)      | `npx @web-hig/install`             |
| [examples/](./examples/)                     | Integration examples               |
| [SHARE.md](./SHARE.md)                       | Badges and sharing                 |

---

## Try it in one project

Install:

```bash
npx @web-hig/install
```

This pins the Quick Reference and installs appropriate agent guidance.

Then define the parts of your application that should follow the standard using:

[examples/hig-scope.example.md](./examples/hig-scope.example.md)

For deeper rule coverage:

```bash
npx @web-hig/install --profile practical
```

Complete walkthrough:

[examples/adoption/quick-profile-walkthrough.md](./examples/adoption/quick-profile-walkthrough.md)

Example consumer project:

[examples/golden-path](./examples/golden-path/)

---

## Share The Web HIG

Add the Web HIG badge to a project that follows the standard:

![The Web HIG](https://frozonfreak.github.io/webhig/badge.svg)

```markdown
[![The Web HIG](https://frozonfreak.github.io/webhig/badge.svg)](https://github.com/frozonfreak/webhig?utm_source=github_readme&utm_medium=badge&utm_campaign=share)
```

Additional badges and attribution options are available in [SHARE.md](./SHARE.md).

---

## Contributing

Contributions are welcome.

Read [CONTRIBUTING.md](./CONTRIBUTING.md) before proposing specification changes.

Code of conduct: [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)

---

## License

Licensed under the [MIT License](./LICENSE).
