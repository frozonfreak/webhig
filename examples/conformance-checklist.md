# The Web HIG — PR review checklist (copy-paste)

Informative checklist for **Quick Reference** and **Practical** profiles. Adjust for your archetypes and pinned [VERSION](../VERSION).

```markdown
## HIG PR checklist

- [ ] **Archetype** matches `docs/hig-scope.md` for affected routes
- [ ] **Content surface** declared when route is content (`document` | `hybrid` | `experience`)
- [ ] **States** — loading, empty, error, success designed (not blank UI)
- [ ] **Tokens** — no raw hex in app CSS (**HIG-TOK-001**)
- [ ] **Motion** — no `transition: all`; `prefers-reduced-motion` respected (**HIG-MOT-001**, **HIG-A11Y-001**)
- [ ] **A11y** — native HTML first, visible focus, names on icon buttons verified in the accessibility tree, alt on images (**HIG-A11Y-003**–**008**)
- [ ] **Targets** — interactive targets ≥ 24×24 CSS px (**HIG-A11Y-007**)
- [ ] **Layout** — `@container` when component reuse spans contexts (**HIG-CQ-002**)
- [ ] **Mutations** — no optimistic destructive confirm (**HIG-MUT-001**)
- [ ] **SSR forms** — pending UI on server mutations (**HIG-SSR-003**)
- [ ] **Simplicity** — smallest change that satisfies applicable rules (**HIG-SIM-001**)
```

**Badge text (README / site):** *This project pins The Web HIG vX.Y.Z · Practical profile · Application + Auth archetypes.*

See [PROFILES.md](../PROFILES.md) for profile definitions and public conformance claims.
