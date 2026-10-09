# Archetype Pack — Auth / Account

**Version:** v1.13.0 · **Archetype:** `auth` · **Matrix:** [applicability.md](../applicability.md)

Sign-in, sign-up, recovery, settings. Security- and privacy-sensitive.

---

## Default modules (load after HIG-QUICK)

| Module | Why |
| --- | --- |
| [ux.md](../ux.md) | Unsaved-changes (settings), RBAC visibility |
| [states.md](../states.md) | Auth errors, loading, session states |
| [forms.md](../forms.md) | Login, signup, password, MFA, settings |
| [tokens.md](../tokens.md) | Design tokens (universal) |
| [responsive.md](../responsive.md) | Responsive auth layouts |
| [animation.md](../animation.md) | **No decorative motion** — functional feedback only |
| [architecture.md](../architecture.md) | Session handling, server mutations |
| [mutations.md](../mutations.md) | Account deletion, permission changes |
| [notifications.md](../notifications.md) | Session expiry warnings, auth feedback |
| [accessibility.md](../accessibility.md) | WCAG 2.2 AA (universal) |
| [performance.md](../performance.md) | Fast auth flows |
| [security.md](../security.md) | **Critical** — auth UX, cookies, PII, CSP |

## Conditional modules (load when feature exists)

| Module | When |
| --- | --- |
| [i18n.md](../i18n.md) | Multi-locale auth flows |

## Skip unless explicitly needed

`data-density`, `search`, `ai-enforcement`

## Mandatory rule IDs

All universal rules **plus:** HIG-SSR-001, HIG-SSR-003, HIG-MUT-001, HIG-FRM-001, HIG-ERR-001, HIG-LOD-001, HIG-NTF-001, HIG-SEC-001–004

## Typical tasks

| Task | Focus modules |
| --- | --- |
| Login / signup form | forms, security, states |
| Settings page | forms, ux (unsaved changes), security |
| Session timeout UX | security §9.5, notifications |
| Account deletion | mutations, ux §2.4, security |
