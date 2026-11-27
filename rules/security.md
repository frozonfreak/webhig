# Security & Privacy — Level 2 Module

**Version:** v1.20.0 · **Canonical spec:** [HIG.md §9](../HIG.md#layer-9-security--privacy) · **Rule IDs:** HIG-SEC-001–004 · **Archetypes:** Universal

> Standalone extract for progressive loading. The complete normative contract remains in [HIG.md](../HIG.md).

Cross-check permission, identity, and agent-authority guidance against the W3C TAG [Web Platform Design Principles](https://www.w3.org/TR/design-principles/) (Group Note, 24 November 2026). Do not imitate a trusted browser interface, and do not detect assistive technology. The note is not an audit rule.

---

## 9.1 Content Security Policy (CSP)

Applications MUST deploy a Content Security Policy (**HIG-SEC-002**):

* Restrict `script-src` to known origins; avoid `'unsafe-inline'` and `'unsafe-eval'` in production.
* Use nonces or hashes for any required inline scripts.
* Restrict `frame-ancestors` to prevent clickjacking.
* Report violations to a monitoring endpoint (CSP report-uri/report-to).

## 9.2 XSS & CSRF Mitigation

* **XSS:** All user-generated content MUST be sanitized before rendering. Use framework auto-escaping; never `dangerouslySetInnerHTML` / `v-html` / `{@html}` without sanitization.
* **CSRF:** State-changing requests MUST include CSRF protection (synchronizer token, SameSite cookies, or double-submit cookie pattern).
* **Output encoding:** Context-appropriate encoding for HTML, URL, JavaScript, and CSS contexts.

## 9.3 Secure Cookies & Storage

| Attribute | Requirement |
| --- | --- |
| `Secure` | MUST on all session/auth cookies in production |
| `HttpOnly` | MUST on session tokens (not accessible to JS) |
| `SameSite` | `Strict` or `Lax` for auth cookies; `Strict` for sensitive operations |
| `Max-Age` / `Expires` | Explicit expiry; session cookies MUST have server-side TTL |

**HIG-SEC-004:** Secure cookie attributes required for commerce, application, and auth archetypes.

Browser storage (`localStorage`, `IndexedDB`) MUST NOT store sensitive tokens, PII, or payment data. Draft form data in storage MUST be encrypted or scoped to non-sensitive fields.

## 9.4 PII & Sensitive Data Handling

**HIG-SEC-001:** No secrets in client code. **HIG-SEC-003:** PII masked in UI and logs.

* **Display masking** — partial values for sensitive fields (e.g. `••••4242` for card numbers).
* **Log sanitization** — PII MUST NOT appear in client-side logs, analytics events, or error reports to third parties.
* **Data minimization** — collect only fields required for the current operation.
* **Right to deletion** — provide UI path for account/data deletion where regulations require.

## 9.5 Authentication UX

* **Session expiry** — warn before timeout; offer extend-session action; redirect to login with return URL preserved.
* **Failed login** — generic error message (do not reveal account existence); rate-limit attempts.
* **Password requirements** — show requirements before submission; validate on blur and submit.
* **MFA** — support TOTP/WebAuthn where security policy requires; provide recovery codes.
* **Sign-out** — clear client state and invalidate server session; confirm on shared devices.

### Digital credentials (informative)

The [Digital Credentials API](https://www.w3.org/TR/digital-credentials/) (Working Draft, 25 November 2026) is not a Recommendation and not a required API. Check support by operation, browser, platform, protocol, and wallet. Keep an alternative verification path when the integration is unavailable.

Judge the site’s own controls. The site cannot repair an inaccessible native chooser. Name the launch control. Announce waiting, success, error, and cancellation that the site renders. Keep continue and cancel keyboard-operable. Move focus logically through a chooser the site renders. Give QR codes a text alternative and a path that does not depend on another device. Where accessible authentication applies, provide an alternative. Allow enough time and a retry. Say what will be shared before disclosure. A browser permission is not legal consent.

Use the draft’s WebDriver BiDi virtual wallet, where supported, for success, rejection, and pending requests. Exercise cancellation against the pending request. See [HIG.md §9.5](../HIG.md#digital-credentials-informative) and the [fixture](../examples/audit-fixtures/digital-credentials/README.md).

## 9.6 Third-Party Scripts & Analytics

* Third-party scripts MUST be inventory-tracked and loaded with `async`/`defer`.
* Analytics MUST be privacy-safe: no PII in event payloads; respect Do Not Track / consent preferences.
* Tag managers and ad scripts MUST NOT block core rendering — see [performance.md](./performance.md).

**SVG referrer policy (informative).** Firefox 161 supports `referrerpolicy` on SVG `image`, `script`, and `feImage`. Set it when an SVG fetch should limit its referrer. Optional. Not a new requirement.

## 9.7 Audit Logging (Application / Auth)

Operational applications SHOULD log security-relevant events: authentication success/failure, authorization denials, destructive mutations, permission changes, data export/download.

Logs MUST include timestamp, actor, action, and resource — but MUST NOT include secrets or full PII.
