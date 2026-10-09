# HIG scope for this product (example)

Pinned contract: The Web HIG v1.13.0

| File | Purpose |
| --- | --- |
| `docs/hig/VERSION` | Version pin (currently 1.13.0) |
| `docs/hig/HIG-QUICK.md` | Quick Reference — default agent context (Layer 1) |
| `docs/hig/HIG-LITE.md` | Practical guide with rule IDs (Layer 2) |
| `docs/hig/rules/archetypes/*.md` | Archetype packs |
| `docs/hig/rules/*.md` | Topic modules (Layer 2) |
| `docs/hig/framework/*.md` | Framework adapters |
| `docs/hig/rules/manifest.yaml` | Topic-triggered loading index |
| `docs/hig/HIG.md` | Full specification (Layer 3) |

| Route / area | Archetype | Surface | Notes |
| --- | --- | --- | --- |
| `/`, `/pricing` | Content / Marketing | document | SEO + structured data mandatory |
| `/blog/*` | Content / Marketing | document | SEO + structured data mandatory |
| `/work`, `/work/*` | Content / Marketing | experience | **HIG-EXP-**\* baseline; portfolio index + case studies |
| `/` (marketing splash) | Content / Marketing | hybrid | Expressive hero/reel; document spine for offer + contact |
| `/products/*`, `/cart`, `/checkout` | Commerce | Facets/URL state; checkout unsaved-changes protection |
| `/app/*`, `/admin/*` | Application | Server rendering defaults, mutation state machines, RBAC |
| `/login`, `/signup`, `/settings` | Auth / Account | Security-sensitive; no decorative motion |

**Default for new UI:** Application unless this table says otherwise.

**Agent one-liner:** *Follow The Web HIG Quick Reference (`docs/hig/HIG-QUICK.md`).*
