# Expressive Surface Baseline — Level 2 Module

**Version:** v1.13.0 · **Canonical spec:** [HIG.md §0.3, §1.5](../HIG.md#15-expressive-surface-baseline) · **Rule IDs:** HIG-EXP-001–014 · **Registry:** [motion-tiers.yaml](./motion-tiers.yaml)

> Standalone extract for progressive loading. Covers fluid, scroll-driven, and motion-forward **content** surfaces (~60–70% of public marketing and portfolio web). Not a visual pattern library — behavioral obligations only.

---

## Purpose

Many websites are not document-dominant scroll pages with discrete controls alone. They use motion, scroll, and time as structure. **HIG Core** still applies universally. This module adds the baseline for **hybrid** and **experience** surfaces so expressive work stays accessible, navigable, and performant without cataloguing every Awwwards technique.

**Out of scope:** bespoke art pieces, game-like canvas UIs, and one-off experiments with no reusable obligations — document exceptions in product scope.

---

## 0.3 Surface model (resolve with archetype)

After archetype resolution, declare a **surface** per route or route group in `docs/hig-scope.md` (or equivalent):

| Surface | Description | Typical examples |
| --- | --- | --- |
| **document** | Reading order equals visual structure; motion is functional micro-feedback only | Blog, docs, classic landing, incredibles-style conversion page |
| **hybrid** | Document spine plus expressive regions (hero, reel, pinned section, kinetic type) | Agency home, SaaS marketing, studio launch |
| **experience** | Structure revealed through scroll, time, or motion; fluid layout is primary | Portfolio index, campaign microsite, reel-first studio |

### HIG-EXP-001 — Surface declaration

Each route group in product scope MUST declare `surface: document | hybrid | experience`. If omitted, agents and reviewers MUST default to **document** (strict **HIG-MOT-003**).

Application, commerce checkout, and auth routes MUST use **document** surface regardless of visual styling elsewhere.

---

## 1.5 Baseline rules

### Content parity (non-motion)

**HIG-EXP-002:** Primary purpose, primary call-to-action, and core listings (projects, services, pricing entry point) MUST remain understandable without motion and without completing a scroll performance or timed sequence.

**HIG-EXP-010:** If client enhancement is delayed or unavailable, the user MUST still receive semantic headings, links, and primary content appropriate to the archetype — not an empty root mount or loader-only shell.

### Reduced-motion parity

**HIG-EXP-003:** Under `prefers-reduced-motion: reduce`, the user MUST receive **equivalent informational hierarchy** and access to the same primary actions as the enhanced path. Disabling motion MUST NOT leave broken layout, hidden-only content, or unreachable CTAs. Prefer a designed static or simplified path, not animation strip-only.

Works with **HIG-A11Y-001**; exceeds minimum WCAG animation guidance for marketing surfaces.

### Navigation & scroll integrity

**HIG-EXP-004:** **Hybrid** and **experience** surfaces MUST provide a keyboard-reachable, visibly labeled escape hatch to site navigation, a project/work index, or major sections (menu, nav landmark, or equivalent). Discovery MUST NOT rely on gestural exploration alone.

**HIG-EXP-005:** Programmatic scroll takeover on the main document (scroll-jacking, captured wheel/touch with no alternative) MUST NOT be the **only** way to reach destinations. The same destinations MUST be reachable via links, URL navigation, or an in-page index operable without the capture behavior.

**HIG-EXP-009:** Custom scroll interfaces (horizontal rails, virtualized lists, carousel-like project strips) MUST be keyboard operable with visible focus indicators (**HIG-A11Y-006**).

### Motion tier taxonomy (normative)

Every page-level motion effect MUST be classified before review or ship. **Interactive controls** on all surfaces are always **Motion Tier 1 — Functional** and remain fully subject to **HIG-MOT-003** on the deny list.

**HIG-EXP-013 — Tier definitions**

| Tier | Name | `motion_class` | Meaning |
| --- | --- | --- | --- |
| **0** | None | `none` | No page-level motion beyond UA defaults; controls only Tier 1 |
| **1** | Functional | `functional` | Input acknowledgment, state change, progress (**HIG-MOT** allowlist) |
| **2** | Spatial | `spatial` | Layout/transform motion without a timed story beat (hero enter, pinned reveal, bounded scroll-linked translate) |
| **3** | Narrative | `narrative` | Scroll-, time-, or step-driven sequences where motion carries structure or story |
| — | Ambient | `ambient` | Looping/environmental decoration that does not convey required meaning (not Tier 3) |

Ambient is a **motion class**, not Tier 3. Tier 3 narrative MUST communicate structure or intentional story beats; idle loops and grain are **ambient**.

**HIG-EXP-014 — Classification**

Each distinct page-level motion effect on hybrid or experience routes MUST be assigned exactly one `motion_class` (`functional`, `spatial`, `narrative`, `ambient`, or `none`). Implementations SHOULD expose `data-hig-motion-class` (and `data-hig-motion-tier` `0`–`3` where applicable) for review and future CI. Undocumented page-level motion MUST default to **denied** on **document** surface.

**HIG-EXP-006 — Surface permission matrix**

Page-level motion MUST comply with [motion-tiers.yaml](./motion-tiers.yaml) `surface_permissions`. Legend: **allowed** = MAY use subject to universal **HIG-EXP-**\* rules; **limited** = MAY use only if every constraint in `limited_constraints` for that class and surface is met; **denied** = MUST NOT use at page level.

| `motion_class` | document | hybrid | experience |
| --- | --- | --- | --- |
| **functional** (Tier 1) | allowed | allowed | allowed |
| **spatial** (Tier 2) | limited | allowed | allowed |
| **narrative** (Tier 3) | denied | limited | allowed |
| **ambient** | denied | limited | allowed |

**Limited** constraints (summary; authoritative list in YAML):

* **document + spatial:** transform/opacity only; one bounded expressive region per viewport unless excepted; no scroll-jacking as sole nav; **HIG-EXP-002**, **HIG-EXP-003**.
* **hybrid + narrative:** skip/pause; must not block primary CTA; prefer one primary sequence per route; **HIG-EXP-003**.
* **hybrid + ambient:** pausable; no autoplay audio; off/static under reduced motion; pause when tab hidden.
* **experience + narrative / ambient:** skip/pause (narrative); pausable + media rules (ambient); **HIG-EXP-002**, **HIG-EXP-003**.

**HIG-MOT-003 vs tiers:** On **document** surface, **HIG-MOT-003** applies to **all** page-level motion (only Tier 1 functional allowed). On **hybrid** and **experience**, **HIG-MOT-003** deny list applies to **controls only**; page-level motion MUST follow the matrix above — not a blanket decorative ban.

**HIG-MOT-004** (≤300 ms) applies to **micro-feedback on controls** only. Tier 2–3 and ambient sequences are not micro-feedback.

Scroll-jacking and parallax that violate **HIG-EXP-005** or **limited** spatial rules remain **denied** regardless of tier.

### Semantics & kinetic type

**HIG-EXP-007:** Information required to understand offerings, projects, pricing, or contact MUST appear in the HTML document in logical reading order — not only in canvas, WebGL, or video frames.

**HIG-EXP-011:** Duplicated or marquee text used for visual effect MUST expose **one canonical** text instance in document order. Purely decorative repetitions MUST be hidden from assistive technologies (`aria-hidden="true"`). The canonical instance MUST satisfy contrast and readability requirements.

### Sensory media

**HIG-EXP-008:** Audio or video with sound MUST NOT autoplay. User-initiated playback MUST be available. Decorative ambient media MUST pause when the document is hidden (`document.visibilityState === 'hidden'`). Under reduced motion, decorative ambient media SHOULD default off unless the user explicitly enables it.

### Performance

**HIG-EXP-012:** Expressive surfaces MUST meet the same Layer 6 Core Web Vitals targets as document surfaces. Motion assets and enhancement scripts MUST NOT block rendering of the LCP element. Full-viewport loading gates MUST NOT hide the LCP candidate beyond documented scope exceptions.

---

## Applicability

| Rule prefix | When mandatory |
| --- | --- |
| HIG-EXP-001 | All content routes (declaration); default document if missing |
| HIG-EXP-002–012 | Content archetype with `surface: hybrid` or `surface: experience` |
| HIG-EXP-006, **HIG-EXP-013**, **HIG-EXP-014** | All content routes (matrix on document too); classification mandatory on hybrid/experience |

Commerce, application, and auth routes: **document** surface only — full **HIG-MOT-003**, no narrative tier.

---

## Agent workflow

1. Resolve archetype → **content** (or other).
2. Read `surface` from product scope (**HIG-EXP-001**).
3. If `hybrid` or `experience`, preload this module before applying global decorative-motion bans to page-level motion.
4. Still enforce universal **HIG-A11Y-***, **HIG-TOK-***, **HIG-SEC-***, and Layer 6 performance rules.

---

## Typical content patterns (informative)

These patterns are covered by the baseline above; optional future extensions may add checklists per pattern:

| Pattern | Key rules |
| --- | --- |
| Work / portfolio index | **HIG-EXP-004**, **HIG-EXP-007**, **HIG-EXP-009** |
| Case study / campaign | **HIG-EXP-002**, **HIG-EXP-006**, **HIG-EXP-003** |
| Conversion landing (document surface) | **HIG-MOT-003**; use **forms** module when forms exist |
| Reel-first / cinematic home | **HIG-EXP-006**, **HIG-EXP-008**, **HIG-EXP-012** |

---

## Related modules

* [animation.md](./animation.md) — functional micro-motion, **HIG-MOT-***, reduced motion
* [ux.md](./ux.md) — document fundamentals, landmarks
* [accessibility.md](./accessibility.md) — WCAG 2.2 AA floor
* [performance.md](./performance.md) — Core Web Vitals
