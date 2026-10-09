# Example — Quick Reference profile in one afternoon

Informative walkthrough for a fictional product repo **Acme Dashboard**. Copy patterns into your own `docs/hig-scope.md` and pins.

---

## 1. Pin files

```bash
npx @web-hig/install --editors cursor
```

That writes:

```
docs/hig/
  VERSION                 # 1.13.0
  HIG-CORE.md
  HIG-QUICK.md
docs/hig-scope.md
.cursor/rules/hig.mdc
.cursor/skills/web-hig/SKILL.md
```

Manual copy: [agent-rules/cursor-hig.mdc](../agent-rules/cursor-hig.mdc). Profile: [PROFILES.md](../../PROFILES.md) — Quick Reference.

---

## 2. Scope document (excerpt)

```markdown
# HIG scope — Acme Dashboard

| Route prefix | Archetype |
| --- | --- |
| `/`, `/pricing` | content |
| `/app/**` | application |
| `/login`, `/settings/account` | auth |
```

Full template: [hig-scope.example.md](../hig-scope.example.md).

---

## 3. Agent instruction

In Cursor, the rule loads HIG-QUICK by default and escalates via `rules/manifest.yaml` when the task mentions modals, forms, or checkout.

Human prompt example:

> Build a delete-project dialog for `/app/projects`. Archetype: application. Follow The Web HIG Quick Reference; cite rule IDs if you decline a pattern.

Expected citations: `HIG-MUT-001`, `HIG-A11Y-008`, `HIG-A11Y-004`.

---

## 4. PR checklist (team)

- [ ] Archetype noted in PR description
- [ ] No raw hex in component CSS (tokens)
- [ ] Destructive action uses confirmation, not optimistic delete
- [ ] Focus visible on interactive controls

---

## 5. Upgrade path

When the team adds checkout:

1. Bump to **Practical profile** — vendor `HIG-LITE.md` + `rules/`.
2. Preload [rules/archetypes/commerce.md](../../rules/archetypes/commerce.md) for `/checkout`.
3. Read [RELEASE_NOTES.md](../../RELEASE_NOTES.md) before changing `VERSION`.

List the product on [ADOPTERS.md](../../ADOPTERS.md) when pins are public.
