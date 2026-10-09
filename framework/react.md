# React Framework Adapter

**Version:** v1.13.0 · **Universal architecture:** [rules/architecture.md](../rules/architecture.md) · **Canonical spec:** [HIG.md §4.1](../HIG.md#41-server-driven--progressive-rendering-architecture)

> Framework-specific guidance for React applications. Normative requirements remain in the universal architecture module.

---

## Server-driven rendering

* Default to Server Components (React 19+ / Next.js App Router) for data fetching and static UI.
* Add `'use client'` only when the component needs state, effects, or browser event listeners.
* Do not mark entire page trees as client components to avoid thinking about boundaries.

## Streaming boundaries

* Wrap independently slow async regions in `<Suspense fallback={…}>` with layout-matching skeletons (**HIG-SSR-002**).
* Do not wrap fast or atomic regions in Suspense without justification.

## Server mutations

* Use Server Actions for form mutations where the framework supports them.
* Forms MUST expose pending UI via `useFormStatus` / `useActionState` (**HIG-SSR-003**).
* Optimistic updates via `useOptimistic` only for reversible, low-consequence mutations (**HIG-MUT-001**).

## Accessibility

* Prefer native HTML elements; avoid `div` + `onClick` for interactive controls.
* For custom widgets (combobox, dialog), follow [rules/accessibility.md](../rules/accessibility.md) keyboard patterns.

## Performance

* Minimize client bundle: push data fetching and rendering to the server.
* Lazy-load client components that are not needed for initial render.
* Avoid `dangerouslySetInnerHTML` without sanitization — see [rules/security.md](../rules/security.md).

## Related

* [next.md](./next.md) — Next.js App Router specifics
