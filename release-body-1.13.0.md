## Changelog summary

### Changed

- **§5.2 Accessible name and description** — Prefer the **platform AccName computation** / browser accessibility tree over a simplified attribute order. References [AccName 1.2 Working Draft](https://www.w3.org/TR/accname-1.2/) as documentation of the algorithm; WD wording is **not** an independent HIG conformance requirement ([HIG.md](./HIG.md), [rules/accessibility.md](./rules/accessibility.md)).
- **HIG-DOC-005** — Outcome-based image transfer-format guidance; JPEG XL and similar formats only via progressive enhancement (typically `<picture>` + broadly supported fallback). No automated fail for absence of JXL.

### Added

- [examples/audit-fixtures/](./examples/audit-fixtures/) — AccName edge-case HTML fixtures (slots, shadow DOM, hidden ID refs, `aria-description`, CSS generated content, prohibited-name roles) and Safari TP 254 / VoiceOver manual review matrix.
- Quick Reference and Lite cross-links for AccName tree verification and measured image formats.

### Deferred / unchanged

- No Core Web Vitals metric, threshold, or measurement-policy change.
- No new AI/agent-interface requirements (existing visible state, confirmation, reversibility, provenance, and accessible status guidance stand).
- Safari TP experimental CSS is watchlist-only — not HIG recommendations or audit rules.

---

## Release notes

Minor guidance release from the **2026-10-09** research brief: AccName platform computation, outcome-based image formats, and audit fixtures. **No** Core Web Vitals threshold change and **no** new AI/agent-interface rules.

### Highlights

- **Accessible names** — §5.2 now tells authors and tools to match the **user-agent AccName** result (browser accessibility tree), not a simplified `aria-*` attribute checklist. Cites [AccName 1.2 WD](https://www.w3.org/TR/accname-1.2/); Working Draft wording is not a separate conformance bar.
- **HIG-DOC-005** — Keep image guidance outcome-based (sizing, quality, transfer cost, LCP). JPEG XL MAY appear only through progressive enhancement (`<picture>` + fallback); compare encodings on representative assets.
- **Audit fixtures** — [examples/audit-fixtures/](./examples/audit-fixtures/) for slotted/shadow names, hidden ID refs, `aria-description`, CSS generated content, prohibited-name roles, plus a Safari TP 254 VoiceOver manual matrix (engine fixes ≠ author failures).

### Upgrade from v1.12.5

1. Pin **[VERSION](./VERSION)** (`1.13.0`) or run `npx @web-hig/install` when you next refresh docs.
2. Re-check custom name heuristics and web-component labeling against the browser accessibility tree (especially slots/shadow DOM).
3. If you ship next-gen image formats, ensure a broadly supported `<picture>` fallback — do not treat JXL-only delivery as HIG-default.
4. Run `npm run validate` (or `npm test` if you vendor full tooling).

---

---

Pin: [HIG-QUICK.md](https://github.com/frozonfreak/webhig/blob/v1.13.0/HIG-QUICK.md) · Contract: [VERSION](https://github.com/frozonfreak/webhig/blob/v1.13.0/VERSION)
