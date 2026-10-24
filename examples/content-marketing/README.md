# Content / Marketing applied guide

**Status: Informative.** Examples of applying existing requirements, not a page template or a conversion method. [HIG.md](../../HIG.md) remains authoritative; pin [VERSION](../../VERSION) and resolve [archetype/surface](../../rules/applicability.md) first.

## Optional composition examples

| If the page has… | Example implementation | Existing basis |
| --- | --- | --- |
| An opening explanation | A semantic heading followed by text explaining the offering; no required slogan length or hero height | HIG-DOC-002; HIG-A11Y-002/003; HIG-EXP-007 where applicable |
| Navigation or actions | Descriptive links to real routes/sections; buttons for operations; visible keyboard focus | HIG-DOC-002; HIG-A11Y-002/003/004/006; HIG-EXP-004/005/009 where applicable |
| A useful screenshot or diagram | Explain relevant detail in text or an appropriate alternative; intrinsic dimensions; responsive delivery; avoid lazy-loading the LCP candidate | HIG-A11Y-005; HIG-DOC-005; HIG-PERF-001–004 |
| A demonstration | Keep essential meaning in semantic text; provide applicable media alternatives and controls; classify page-level motion | HIG-A11Y-002; HIG-EXP-002/003/006/007/008/010/013/014 where applicable |
| A signup or contact form | Load the forms module; review labels, validation, loading/error and completion states | [forms](../../rules/forms.md); [states](../../rules/states.md) |

The heading, explanation and image can be composed in many ways. None of these rows requires adding the illustrated feature. Reading-only pages need no sales CTA. Do not manufacture testimonials, screenshots, customer counts, or business outcomes as evidence.

## Review applicability before judging parity

- **All content surfaces:** document fundamentals, applicable WCAG 2.2 AA, tokens, performance, security and reduced-motion requirements remain in force. Undeclared content surfaces default to `document` (HIG-EXP-001).
- **Hybrid/experience:** use the existing expressive requirements for understandable primary purpose/actions without motion or timed/scroll sequences (HIG-EXP-002), reduced-motion hierarchy/actions (003), logical HTML order (007), and client-enhancement fallback (010).
- **Document with limited spatial motion:** follow the exact conditions in [motion-tiers.yaml](../../rules/motion-tiers.yaml), including its references to HIG-EXP-002/003. Do not treat all expressive requirements as universal merely because one is invoked.
- **Document without those conditions:** test existing semantic, keyboard, reflow and motion requirements. A no-JavaScript comparison may be useful evidence, but absence of content under that comparison is not automatically an HIG-EXP-010 failure.

At mobile sizes, text zoom and reflow, inspect the meaning and operation of what remains, not only the layout. Cite the actual accessibility or scoped parity requirement when reporting a failure. Reflow does not require identical visual presentation or forbid accessible disclosures. Record broader copy/composition comparisons as advisory if no existing requirement is violated.

Pricing, eligibility and restrictions, where present, are part of this review: inspect accessible text, reading order, clipping and applicable parity. The persuasiveness of the selling argument is outside HIG conformance.

## Metadata and discoverability

Use HIG-DOC-001–006 and HIG-SEO-001–003 rather than adding SEO IDs. Check a unique descriptive title and the existing description/canonical provision; require canonical where duplication is possible. Social metadata applies to shareable pages; structured data applies where warranted. Validate accuracy against the route, not a checklist that demands all fields everywhere. Metadata does not establish search ranking or conversion success.

## Security, motion and performance evidence

Third-party script review references [HIG.md §9.6](../../HIG.md#96-third-party-scripts--analytics): inventory, async/defer loading, privacy-safe analytics, consent preferences, and rendering impact. That section has no dedicated stable ID; do not mislabel it as HIG-SEC-004 (secure cookies). Use relevant HIG-SEC-* IDs only for their actual obligations and capability conditions.

Use HIG-MOT-* for applicable control/page motion and HIG-A11Y-001 for reduced motion. Preserve the surface permission matrix and exceptions; these examples do not resolve or amend the contract. Performance evidence distinguishes lab observations from field Core Web Vitals (HIG-PERF-001/002). A local image or small fixture does not establish a production performance pass.

## Evidence workflow

1. Copy the [manual worksheet](./review-worksheet.md), record scope and features, and choose applicable checks.
2. Use the [fixtures and test procedures](../audit-fixtures/content-marketing/README.md) to rehearse document and hybrid cases.
3. Record pass/fail/not tested/not applicable per check, with evidence and a reason for N/A. Untested is never a pass.
4. Report failures against an exact stable ID, or an exact normative section if no matching ID exists. Keep advisory content judgments distinct.

The worksheet supplies supporting evidence, not a complete evaluator report or a claim of route conformance. A full [EVALUATOR.md](../../EVALUATOR.md) report requires severity totals, all dimensions and their scores/counts, findings and evaluator/scope metadata under the [schema](../../schema/evaluator-report.schema.json). Do not invent scores from incomplete worksheet coverage. The current CLI minimal report is also distinct from that full target shape.
