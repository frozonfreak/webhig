# Audit fixtures — AccName & AT review

Fixtures and manual review notes for **[HIG Audit](https://hig.aruviflow.com/)** and local assistive-technology checks. They are **not** a substitute for the normative contract in [HIG.md](../../HIG.md).

Sourced from the **2026-10-09** Web HIG research brief.

| Item | Action in this folder |
| --- | --- |
| AccName 1.2 Working Draft (2026-10-02) | HTML fixtures under [`accname/`](./accname/) |
| Safari Technology Preview 254 (2026-10-08) | Manual review matrix in [`safari-tp-254-voiceover.md`](./safari-tp-254-voiceover.md) |
| JPEG XL (Chrome 155) | Spec-only — see **HIG-DOC-005**; no automated failure here |
| Scoped transitions vs `transition: all` | [motion-transition-regression/](./motion-transition-regression/) — illustrative; not a normative rule change |

## How to use

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
