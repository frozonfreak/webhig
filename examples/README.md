# Examples

Copy these into a **product** repository. They are not loaded when developing The Web HIG itself.

---

## Adoption paths

| Goal | Start here |
| --- | --- |
| **Golden path** (pin + skill + failing `web-hig check`) | [golden-path/](./golden-path/) |
| Fastest agent + PR workflow | `npx @web-hig/install` then [adoption/quick-profile-walkthrough.md](./adoption/quick-profile-walkthrough.md) |
| Route → archetype map | [hig-scope.example.md](./hig-scope.example.md) |
| Full pin list + CI stages | [INTEGRATION.md](../INTEGRATION.md) |
| Conformance levels | [PROFILES.md](../PROFILES.md) |
| PR checklist (copy-paste) | [conformance-checklist.md](./conformance-checklist.md) |
| AccName / AT audit fixtures | [audit-fixtures/](./audit-fixtures/) |
| Motion transition regression | [audit-fixtures/motion-transition-regression/](./audit-fixtures/motion-transition-regression/) |
| Public listing | [ADOPTERS.md](../ADOPTERS.md) |
| Share badge (UTM) | [SHARE.md](../SHARE.md) |

---

## Pin set (vendor copy)

| Source | Destination in product repo |
| --- | --- |
| [hig-scope.example.md](./hig-scope.example.md) | `docs/hig-scope.md` (edit routes) |
| [../HIG-QUICK.md](../HIG-QUICK.md) | `docs/hig/HIG-QUICK.md` |
| [../HIG-LITE.md](../HIG-LITE.md) | `docs/hig/HIG-LITE.md` |
| [../HIG.md](../HIG.md) | `docs/hig/HIG.md` |
| [../VERSION](../VERSION) | `docs/hig/VERSION` |
| [../rules/](../rules/) | `docs/hig/rules/` |
| [../framework/](../framework/) | `docs/hig/framework/` |

**Quick Reference profile minimum:** `VERSION`, `HIG-QUICK.md`, optional `HIG-CORE.md`, one agent rule.

---

## Agent rules

| File | Destination |
| --- | --- |
| [agent-rules/cursor-hig.mdc](./agent-rules/cursor-hig.mdc) | `.cursor/rules/hig.mdc` |
| [agent-rules/CLAUDE-hig.md](./agent-rules/CLAUDE-hig.md) | merge into `CLAUDE.md` |
| [agent-rules/copilot-instructions-hig.md](./agent-rules/copilot-instructions-hig.md) | `.github/copilot-instructions.md` |
| [agent-rules/copilot-hig.instructions.md](./agent-rules/copilot-hig.instructions.md) | `.github/instructions/hig.instructions.md` |
| [agent-rules/windsurf-hig.md](./agent-rules/windsurf-hig.md) | `.windsurf/rules/hig.md` |
| [agent-rules/AGENTS-hig.md](./agent-rules/AGENTS-hig.md) | `AGENTS.md` |

Canonical skill (copy to each editor’s `skills/web-hig/` path): [../skills/web-hig/SKILL.md](../skills/web-hig/SKILL.md) · destinations: [../skills/README.md](../skills/README.md)

**One command:** `npx @web-hig/install` ([../packages/install](../packages/install/))

---

## Reference implementations

See [ADOPTERS.md](../ADOPTERS.md) for the live demo and documentation site using these patterns.
