# Manual content-route review worksheet

**Informative evidence template.** Copy and edit for a product route. This is a selected review, not a full HIG evaluator report or comprehensive WCAG audit. See the [guide](./README.md) for scope and [EVALUATOR.md](../../EVALUATOR.md) for reporting requirements.

## Route and execution record

| Field | Value |
| --- | --- |
| URL / build identifier | Not recorded |
| HIG version / source revision | Not recorded |
| Archetype / profile | Not recorded |
| Surface declared in scope / default used | Not recorded |
| Scope document / exceptions | Not recorded |
| Present controls, images, media, forms and third-party scripts | Not recorded |
| Reviewer / date | Not recorded |
| Browser / version / OS / assistive technology | Not recorded |
| Viewport / text zoom / reflow conditions | Not recorded |
| Motion preference / enhancement state / network conditions | Not recorded |
| Evidence level and location (automated, manual, heuristic) | Not recorded |

## Selected checks

Every row starts **not tested**. Use **pass**, **fail**, **not tested**, or **not applicable**. Record the exact requirement tested, observed behavior, evidence and conditions. N/A needs a scope/capability rationale. Split rows when results differ by environment or requirement; a grouped pass must not imply untested coverage.

| Check / expected behavior | Existing reference | Applicability | Status | Evidence / N/A rationale |
| --- | --- | --- | --- | --- |
| Language, title, main landmark and native action semantics are correct | HIG-DOC-001/002/003 | Content routes; semantic regions/actions when present | not tested | — |
| Headings and meaningful content follow accessible reading order | HIG-A11Y-002; HIG-EXP-007 | WCAG universally; expressive rule where invoked | not tested | — |
| Actions have appropriate names, keyboard operation, visible focus and working destinations/outcomes | HIG-A11Y-002/003/004/006; HIG-DOC-002 | Controls present; 004 specifically icon buttons | not tested | — |
| Text zoom and reflow preserve accessible information/operation | HIG-A11Y-002; HIG.md §5.1 | Applicable WCAG criteria and exceptions | not tested | — |
| Primary purpose/actions remain understandable without a motion/scroll/timed performance | HIG-EXP-002 | Hybrid/experience; document spatial conditions when invoked by matrix | not tested | — |
| Reduced motion retains required hierarchy/actions; applicable motion is reduced | HIG-EXP-003; HIG-A11Y-001 | 003 where invoked; 001 universally | not tested | — |
| Primary semantic content/links/headings remain when enhancement is unavailable | HIG-EXP-010 | Hybrid/experience; not a blanket document no-JS gate | not tested | — |
| Navigation/scroll alternatives and any classified motion meet scoped permissions | HIG-EXP-004/005/006/009/013/014; relevant HIG-MOT-* | Split by surface, motion class and control capability | not tested | — |
| Images have appropriate alternatives, dimensions and delivery/loading choices | HIG-A11Y-005; HIG-DOC-005 | Images present | not tested | — |
| Media alternatives and motion/audio controls meet applicable requirements | HIG-A11Y-002; HIG-EXP-008 | Applicable media/capabilities and surface | not tested | — |
| Pricing/restrictions remain accessible without misleading clipping | HIG-A11Y-002; HIG-EXP-007 where applicable | Such content present; cite exact violated requirement | not tested | — |
| Metadata is accurate and provided where required | HIG-SEO-001/002/003 | Canonical where duplication possible; social for shareable routes; structured data where warranted | not tested | — |
| Third-party scripts are inventoried, privacy-safe and do not block rendering | HIG.md §9.6; relevant HIG-PERF-* | Scripts present; use section reference for obligations without a stable ID | not tested | — |
| Performance evidence preserves lab/field distinction and applicable targets/budgets | HIG-PERF-001–004 | Record measurement method and applicable project policy | not tested | — |

## Findings (repeat as needed)

- Requirement ID or exact normative section:
- Applicability and exception assessment:
- Expected / observed behavior:
- Environment, reproduction and evidence:
- Severity and dimension under existing contract/project gate policy:
- Execution status and remaining uncertainty:

## Advisory observations and coverage gaps

Record copy quality, persuasion, optional composition suggestions and untested capabilities here. Do not count them as HIG failures without a corresponding violated requirement. No conversion, trustworthiness, ranking or business-outcome claim is established by this worksheet.
