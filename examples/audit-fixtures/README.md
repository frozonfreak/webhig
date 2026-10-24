# Audit fixtures — runtime recovery & AT review

Fixtures and manual review notes for **[HIG Audit](https://hig.aruviflow.com/)** and local assistive-technology checks. They are **not** a substitute for the normative contract in [HIG.md](../../HIG.md).

Sourced from the **2026-10-09**, **2026-10-16** and [**2026-10-23**](../../docs/research/2026-10-23-brief.md) Web HIG research briefs.

| Item | Action in this folder |
| --- | --- |
| AccName 1.2 Working Draft (2026-10-02) | HTML fixtures under [`accname/`](./accname/) |
| Safari Technology Preview 254 (2026-10-08) | Manual review matrix in [`safari-tp-254-voiceover.md`](./safari-tp-254-voiceover.md) |
| Safari Technology Preview 255 (2026-10-22) | [Dynamic-control matrix](./safari-tp-255-voiceover.md) and [native fixture](./dynamic-controls.html); browser/VO execution pending |
| Failed route/feature dynamic import | [Module recovery fixture and audit procedure](./module-load-recovery/README.md); browser execution pending |
| Firefox 158 Android `aria-busy` (2026-10-13) | Manual review checklist in [`firefox-158-android-talkback.md`](./firefox-158-android-talkback.md); device testing pending |
| JPEG XL (Chrome 155) | Spec-only — see **HIG-DOC-005**; no automated failure here |
| Scoped transitions vs `transition: all` | [motion-transition-regression/](./motion-transition-regression/) — illustrative; not a normative rule change |

## How to use

For landing-page semantics, responsive review and scoped enhancement/reduced-motion parity, use the [Content / Marketing fixtures](./content-marketing/README.md). These are a separate informative guidance addition; their execution status is recorded in that folder.

1. Open each AccName fixture in Chromium, Firefox, and Safari/WebKit.
2. Inspect the **accessibility tree** (or AX API) for name and description — prefer that over attribute heuristics.
3. For Safari TP scenarios, follow the VoiceOver matrix; do **not** encode WebKit bugs as author failures.
4. AccName 1.2 remains a Working Draft — fixtures probe implementation alignment, not an independent HIG conformance bar.

## AccName fixtures

| File | Probes |
| --- | --- |
| [`accname/slotted-label.html`](./accname/slotted-label.html) | Label text via `<slot>` |
| [`accname/shadow-dom-content.html`](./accname/shadow-dom-content.html) | Name from shadow-tree content |
| [`accname/hidden-id-reference.html`](./accname/hidden-id-reference.html) | Hidden `aria-labelledby` / `aria-describedby` subtrees |
| [`accname/aria-description-precedence.html`](./accname/aria-description-precedence.html) | `aria-describedby` vs `aria-description` |
| [`accname/css-generated-content.html`](./accname/css-generated-content.html) | CSS `::before` / `::after` in name computation |
| [`accname/prohibited-name-role.html`](./accname/prohibited-name-role.html) | Roles that prohibit naming |
