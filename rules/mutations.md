# Mutations, Conflicts & Idempotency — Level 2 Module

**Version:** v1.13.0 · **Canonical spec:** [HIG.md §2.4, §4.5](../HIG.md#24-destructive-actions--permission-guardrails) · **Rule IDs:** HIG-MUT-001, HIG-MUT-002

> Standalone extract for progressive loading. The complete normative contract remains in [HIG.md](../HIG.md).

---

## Destructive Actions (§2.4)

See [ux.md](./ux.md) for full destructive action patterns.

**HIG-MUT-001:** Destructive mutations MUST NOT use conventional optimistic confirmation. Reversible deletion MAY use optimistic removal with undo window (5–10 s toast) when soft-delete semantics provide reversibility.

## 4.5 Concurrency, Conflict & Idempotency

**Conflict handling** (collaborative/operational applications):

```
User A updates → User B updates → Conflict detected → Resolve / merge / overwrite
```

**HIG-MUT-002:** Important mutations (payments, orders, deletes, publishes, invites) SHOULD use idempotency keys at the product/API layer to protect against double-clicks, retries, network failures, and mobile reconnection.

**Retry rules:**

| Mutation type | Retry policy |
| --- | --- |
| Idempotent reads | Safe to retry |
| Idempotent writes (with key) | Safe to retry |
| Non-idempotent mutations | MUST NOT blind-retry |
| Destructive actions | MUST NOT auto-retry |
| Payments | Idempotency key required; no blind retry |

Conflict UI MUST present diff/merge/overwrite options — see [states.md](./states.md) §2.5.
