# Digital credential flow review

Use this procedure for a product that initiates a digital credential flow. Review the website’s controls and fallback under [HIG §9.5](../../../HIG.md#digital-credentials-informative). The [25 November 2026 Working Draft](https://www.w3.org/TR/2026/WD-digital-credentials-20261125/) describes an optional WebDriver BiDi virtual wallet.

1. Use test credentials in a secure test origin. Record the browser, operating system, operation, wallet or stub, and assistive technology.
2. Where supported, configure `digitalCredentials.setVirtualWalletBehavior` to respond, reject, or stay pending. Exercise the site’s cancel action while the request is pending. A stub at the credential boundary can exercise site-owned states when virtual wallet support is unavailable.
3. Repeat keyboard and screen-reader checks on a supported browser with its native chooser. Also run the fallback in an environment without the required browser capability or wallet.

| Scenario | Expected evidence |
| --- | --- |
| Start and disclosure | The launch control has an accessible name and works by keyboard. Before disclosure, the site explains the information it requests and offers the applicable alternative. |
| Pending and success | Site-owned waiting and success updates are conveyed to assistive technology. The user can continue with a meaningful focus position afterward. |
| Rejection, cancellation, and timeout | Status and the available recovery are understandable. The user can retry or switch paths using the keyboard. An abandoned response cannot advance the flow. |
| QR or unsupported environment | Where the site renders a QR code, it explains the code’s purpose and provides a path that can be completed without a second device. The fallback remains usable when the credential integration is unavailable. |

Record the expected and observed result for each case. Attribute native browser or OS behavior to that component and evaluate the site’s fallback separately. Virtual-wallet or stub results cover the website’s handling. Native chooser accessibility requires an actual browser and assistive-technology run. Execution pending.
