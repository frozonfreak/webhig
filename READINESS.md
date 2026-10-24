# Tooling and adoption readiness

Web HIG remains a versioned standard. The CLI and agent integrations apply it in repositories; HIG Audit remains an independent evaluator. Tooling work should improve installation, trustworthy evidence, and incremental adoption before expanding the normative rule set.

This is an implementation plan and evidence ledger, not a readiness score or delivery commitment. No pilot results, browser coverage, or agent-quality improvements are inferred from feature counts.

## Implemented foundation

- Safe repeat installation: preserve project configuration and user instructions; fail before writes for incompatible pins or malformed managed blocks. Dedicated-file replacement requires explicit `--force`.
- Quick installation includes registry metadata and an initial `web-hig.yaml`; the CLI discovers the default vendored directory. Source-layout detection chooses an initial scope that the adopter must review.
- Validated YAML configuration: reject unknown settings, invalid profiles/archetypes, duplicate keys, invalid gates, and incorrect scope types. Explicit scope lists replace defaults.
- `doctor`: diagnose configuration, pin disagreements, basic manifest structure, stale agent pin references, broken managed blocks, skill frontmatter, and missing referenced files. Full manifest JSON Schema validation remains in the repository validation suite.
- `check --strict`: require configuration, matching contract versions, and at least one scoped source file. All configured severity gates are honored. Strict mode does not establish full conformance.
- `coverage --format json`: list all rules applicable to the selected profile/archetype, their declared modes, and implemented detector coverage. All loaded registry entries must declare valid verification modes.
- Shared, versioned [evidence schema](./packages/core/lib/verification-report.schema.json) for CLI and independent integrations. Retain the existing JSON fields while adding explicit assessments. No silent pass for an unimplemented or partial detector.
- `upgrade --dry-run`: compare available old/new registry metadata and disclose added, removed, and changed rules without writing. Missing prior metadata means unknown impact; prose changes require release-note review.
- Clean-project installer smoke tests for React/TypeScript, Vue, Next.js, Laravel/Livewire source layouts and plain HTML. These do not install/build those frameworks or verify runtime interactions.
- A [compatibility workflow](./.github/workflows/tooling.yml) runs tooling tests on Windows, Linux and macOS with Node 20 and 22. Adding the workflow does not establish that remote runs have passed.

## Evidence semantics

The existing registry uses `static`, `runtime`, `manual`, and `observation`. Browser-based and controlled runtime-behavior tests are both represented by `runtime` until a separately reviewed contract change distinguishes them. `not_assessed` is an outcome, not a verification technique.

| Result | Required meaning |
| --- | --- |
| `passed` | Affirmative evidence covering the applicable requirement; current CLI detectors never emit this |
| `failed` | Observed detector evidence of a potential violation, retained for review |
| `manual_review` | Human judgment is required; current CLI assigns this to manual-only rules |
| `not_assessed` | Unsupported mode, incomplete coverage, or insufficient evidence |

The two current static detectors cover portions of HIG-MOT-001 and HIG-A11Y-001. They inspect source text, not computed styles or application behavior. Comments, shared styles, and framework transforms can affect their accuracy. A clean scan is not proof of conformance. The evidence schema is tooling-owned and independently versioned; the normative specification and draft multidimensional evaluator schema remain unchanged. HIG Audit compatibility requires an explicit adapter and cross-tool contract tests before it can be claimed.

## Remaining program

The sequence below follows the proposed twelve-week outline. Weeks group dependencies; they are not a verified delivery estimate.

| Sequence | Priority | Deliverable | Acceptance evidence |
| --- | --- | --- | --- |
| Weeks 1–3: reliability | P0 | Packed-package installation/build tests on five real framework projects; filesystem failure/recovery tests | Published-tarball-equivalent installs, repeat installs and partial configuration tests on the OS matrix |
| Weeks 1–3: verification | P0 | Per-rule evidence obligations and detector coverage beyond the current subset | Positive and negative fixtures, unknown-state fixtures, documented false-positive boundaries |
| Weeks 4–6: browser behavior | P0 | Reusable Playwright helpers using application-supplied selectors and controlled states | Submission/validation, loading/error/empty, dialog focus, keyboard navigation, failed/repeated mutation fixtures |
| Weeks 4–6: agents | P0 | Controlled generation and review scenarios with compact progressive loading | Archetype selection, relevant rule loading, implemented states, verification disclosure, context/token cost; reproducible runs for supported agents |
| Weeks 4–6: shared evidence | P1 | HIG Audit adapter and round-trip schema fixtures | Same rule/version/result/evidence meaning across independent tools; unknown evidence never becomes passed |
| Weeks 7–9: CI | P1 | Versioned baseline, GitHub annotations and optional SARIF | Only new configured blocking violations fail; existing debt remains visible; stale baselines and scope/version differences are rejected |
| Weeks 7–9: examples | P1 | At least three complete reference apps, expanding to five stacks | Deliberately broken and corrected variants, behavior tests, exact rule references, commands to reproduce |
| Weeks 7–9: onboarding | P1 | Editor detection, profile recommendations, validated skill activation, richer migration impact | New-user timed installation sessions without manual troubleshooting; user choices preserved |
| Weeks 10–12: validation | P1 | Five independent pilots and reproducible case studies | Completed adoption, disclosed failures and limitations; results independently rerunnable |
| Release hardening | P1 | Deterministic package checks, packed-artifact tests and verified publishing | Stable artifact contents, installation from tarballs, least-privilege publish setup and provenance verified by maintainers |

For behavioral helpers, Web HIG defines expected outcomes while applications supply routes, selectors, fixtures and failure injection. Reuse Playwright rather than introducing a custom browser engine. Do not infer dialog or mutation correctness from static HTML.

For reference apps, prioritize React dashboards, Vue administration, Next.js commerce, Laravel/Livewire CRUD, and plain HTML content. Each needs before/after behavior and tests; source-layout smoke fixtures do not count as reference applications.

## Readiness gates

No gate is counted complete merely because an interface or document exists.

| Gate | Status / evidence needed |
| --- | --- |
| Five supported stacks install cleanly | Partial: source-layout smoke tests exist; real builds and packed-artifact installs remain |
| Repeated installation preserves user configuration | Regression-tested for managed instructions and generated configuration; broader failure cases remain |
| Every canonical rule declares mode and coverage | Registry modes are validated; scoped coverage output exposes missing detectors; per-rule evidence obligations remain |
| CI catches introduced violations without false passes | Known static fixtures pass locally; baseline-aware gating and broader false-positive fixtures remain |
| CLI and Audit have compatible evidence | Shared schema available; Audit integration and cross-tool tests remain |
| New user completes Quick install unaided | Automatic registry discovery and initial config implemented; independent onboarding sessions remain |
| Agent skills pass controlled generation tests | Pending; file installation is not proof of agent behavior |
| Three complete reference applications | Pending; existing golden-path/content fixtures do not establish this gate |
| Five external pilot projects complete adoption | Pending external participation |
| Published, reproducible quality evidence | Pending controlled benchmarking and independent results |

Benchmark comparable projects with and without Web HIG. Record behavioral requirements satisfied, introduced accessibility/usability defects, corrective iterations, agent tokens/cost, false positives, and unnecessary UI complexity. Publish unsuccessful results alongside successes. Do not claim an improvement percentage until supported by those runs.

## Try the foundation

From a project with the updated tooling installed:

```sh
web-hig init
web-hig doctor
web-hig coverage --format json
web-hig check --strict
```

Review generated `web-hig.yaml` for project scope and archetype. Start with Quick, add Practical for detailed topic guidance, then increase enforcement as coverage and team confidence grow. Installation does not require a different application framework.

Maintainer verification: `npm run test:tooling`, `npm run validate`, `npm run lint`, and the full `npm test` browser fixture suite. Hosted compatibility runs and external adopter results must be recorded separately from local checks.
