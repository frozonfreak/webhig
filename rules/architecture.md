# Server-Driven Architecture — Level 2 Module

**Version:** v1.13.0 · **Canonical spec:** [HIG.md §4.1–4.2](../HIG.md#41-server-driven--progressive-rendering-architecture) · **Rule IDs:** HIG-SSR-001–003

> Standalone extract for progressive loading. The complete normative contract remains in [HIG.md](../HIG.md). Framework-specific adapters: [framework/](../framework/).

---

## 4.1 Server-Driven & Progressive Rendering Architecture

Modern hybrid web applications MUST separate server rendering from interactive client islands. This is a **framework-neutral reference architecture**.

```
[Incoming Request] → [Server Rendering] → [Progressive / Streaming Rendering]
        → [Hydration Boundaries] → [Interactive Client Islands]
        → [Server Mutation] → [Pending] → [Optimistic (when eligible)] → [Confirmed / Failed]
```

**Universal standards:**

1. **Server First** (**HIG-SSR-001**): Default to server rendering. Add client interactivity only when attaching state, browser event listeners, or lifecycle effects.
2. **Streaming boundaries** (**HIG-SSR-002**): Every independently slow, progressively renderable, or failure-isolatable async UI region SHOULD have an explicit loading/streaming boundary with a layout-matching skeleton. Do not add meaningless wrappers around fast or atomic regions.

### Framework Adapters

| Universal concept | React / Next.js | Vue / Nuxt | Astro |
| --- | --- | --- | --- |
| Server rendering | React Server Components | SSR / server components | `.astro` server components |
| Client interactivity | `'use client'` directive | `<ClientOnly>` / `.client.vue` | `client:*` islands |
| Streaming boundary | `<Suspense fallback={…}>` | `<Suspense>` (Vue 3) | slot streaming |
| Server mutation | Server Actions | server API routes + form actions | server endpoints |
| Pending state | `useFormStatus`, `useActionState` | form pending refs | island pending UI |
| Optimistic update | `useOptimistic` | manual optimistic state | island-level state |

See framework-specific guidance: [react.md](../framework/react.md), [next.md](../framework/next.md), [vue.md](../framework/vue.md), [nuxt.md](../framework/nuxt.md), [astro.md](../framework/astro.md).

RSC is the React/Next.js implementation — not a universal label for all hybrid rendering.

## 4.2 Async Mutation & Server Action State Model

Server-driven mutations MUST follow an explicit status wrapper (**HIG-SSR-003**):

```
[idle] → [submitting / pending] → [optimistic_render] ─┬→ [confirmed / revalidated]
                                                        └→ [failed] → [rollback + toast_retry]
```

* **Form pending states:** Forms executing server mutations MUST handle native pending states and supply immediate visual feedback (disabling submit triggers, displaying pending spinners) without waiting for server response round-trips.
* **Optimistic eligibility:** Optimistic rendering allowed **only for low-consequence, reversible mutations** (toggles, likes, cart item counts). Destructive mutations MUST NOT use conventional optimistic confirmation — see [ux.md](./ux.md) §2.4 (HIG-MUT-001).
