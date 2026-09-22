---
version: 0.1
owner: Paweł Milewski
updated: 2026-07-24
status: review
---

# ePrivacy Audit — Directive 2002/58/EC / PKE

**Audited:** 2026-06-15 / 2026-06-22
**Migrated to docs/ from the SSOT spec:** 2026-07-24 (this is now the canonical home)

Full scrutiny against the ePrivacy Directive (Cookie Directive) and its Polish
implementation (Prawo komunikacji elektronicznej — PKE). Most articles govern telecoms
operators and do not apply to UNI; this audit calls out what actually matters: Art 5(3)
terminal storage (cookie law), Art 13 unsolicited marketing, and the Polish age-gate
correction. EP1–EP6 from the original audit; EP7–EP8 added 2026-06-22.

> **Prawo komunikacji elektronicznej — kluczowa zasada:** zanim zapiszesz lub odczytasz
> informacje na urządzeniu użytkownika (cookies, localStorage itd.), musisz uzyskać zgodę,
> chyba że jest to technicznie niezbędne.

## Scope

Directive 2002/58/EC was written for telecom providers and ISPs. Articles 6 (traffic
data), 7 (itemised billing), 8–11 (calling line ID, location, call forwarding), and 12
(subscriber directories) do not apply to UNI as a content platform. The articles that do
apply reach UNI through Poland's national implementation — Prawo telekomunikacyjne
(Art 173 terminal storage) and the direct-marketing rules. The proposed ePrivacy
Regulation (not yet adopted) would extend these rules more explicitly to OTT services —
monitor for adoption (EP6).

## Status summary

| ID | Article | Priority | Status | Finding |
| --- | --- | --- | --- | --- |
| EP1 | Kodeks cywilny | High | ✅ Done | Age gate corrected to 18 with the right legal basis |
| EP2 | Art 5(3) | High | ✅ Done | Cookie consent banner (active, category-based) |
| EP3 | Art 5(3) | Low | ✅ Done | Session cookies disclosed in privacy policy |
| EP4 | Art 13 | Medium | ⏳ Open | Marketing-email consent (soft opt-in) mechanism |
| EP5 | Art 6 / 9 | N/A | — | Traffic/location data rules — not applicable |
| EP6 | Future | Medium | ⏳ Open | Proposed ePrivacy Regulation — monitor |
| EP7 | GDPR Art 5(1)(c) | High | ✅ Done | EventLogger stripped of personal identifiers |
| EP8 | Art 5(3) PKE | High | ✅ Done | PostHog CDN no longer loads before consent |

**Still open:** EP4 (build the unsubscribe/soft-opt-in mechanism before the first marketing
email), EP6 (re-audit when the ePrivacy Regulation enters into force).

## Findings

### EP1 · Kodeks cywilny · Age gate corrected to 18 — High — ✅ Done
The checkbox read "Mam ukończone 16 lat" — 16 came from GDPR Art 8 (information society
services / consent). But Art 8 only applies when processing is based on consent
(Art 6(1)(a)); UNI uses Art 6(1)(b) contract basis, so Art 8 was never relevant.
**Corrected basis for an 18 gate:** Polish civil law (_Kodeks cywilny_) — full contractual
capacity (_pełna zdolność do czynności prawnych_) begins at 18, and registration creates a
service agreement (consistent with the Art 6(1)(b) basis). Fixed:
checkbox now reads "Mam ukończone 18 lat" in `register.blade.php`; validation rule unchanged
(`accepted`).

### EP2 · Art 5(3) · Cookie consent mechanism — High — ✅ Done
**Source:** consent was absent across three layers — (1) the banner was a thin passive bar
(scrolling past counted as consent), (2) `posthog.init()` fired in `<head>` on every page
load, (3) no server-side gate on the analytics endpoint. **Legal basis:** PKE Art 5(3) — no
terminal storage without prior consent except where technically necessary; EDPB Consent
Guidelines — refusal must be as easy as acceptance and consent an unambiguous active
indication. **Fix:** (1) banner redesigned as a category-based bottom panel (slides up, 30%
overlay) with two toggle rows — "Funkcjonalne" (always on) and "Analityczne" (off by
default) — and three equal-prominence buttons: "Odrzuć wszystkie" | "Zapisz preferencje" |
"Zaakceptuj wszystkie"; (2) `analytics.js` exports `grantConsent()`, `revokeConsent()`,
`isConsentGranted()`, `applyStoredConsent()`, with the PostHog CDN deferred to lazy init
(EP8); (3) server-side gate added to the analytics endpoint (GD13). `venue-analytics.js`
checks `isConsentGranted()` before every server POST. Consent cookie `uni_consent` written
`Secure; SameSite=Lax`, 1-year expiry. Decision records: `consent-banner-design.md`,
`frontend-analytics-module.md`.

### EP3 · Art 5(3) · Session cookies disclosed — Low — ✅ Done
The original section 4 implied UNI uses no cookies at all. Session cookies
(`laravel_session`, CSRF token) are strictly necessary and exempt from consent under
Art 5(3) but must still be disclosed. Updated section 4 of `privacy-policy.blade.php` to
describe: (a) strictly-necessary session cookies for logged-in users, (b) localStorage theme
preference as functional (necessity basis, not personal data), (c) the commitment to add
consent before enabling client-side PostHog. Privacy-policy date updated to June 2026.

### EP4 · Art 13 · Marketing-email consent — Medium — ⏳ Open
Art 13(1) prohibits sending marketing emails without prior explicit consent. Art 13(2)
allows a "soft opt-in": UNI may email existing users about its own similar services
(e.g. "new venue near you") without pre-consent, provided (a) the address was collected at
account creation, (b) every email carries a free unsubscribe link, and (c) users were
informed at collection. The soft opt-in is simpler for a solo founder — no consent checkbox
at registration. Currently UNI sends only transactional email (verification, reset), which
is not marketing. Action needed only when the first marketing email is built: design the
unsubscribe mechanism, put it in the footer, and describe the soft opt-in basis in the
privacy policy.

### EP5 · Art 6 / Art 9 · Traffic & location data — N/A
Art 6 (traffic-data erasure/anonymisation) and Art 9 (location data beyond traffic data)
apply only to providers of publicly available electronic communications services —
telecoms, ISPs, VoIP. UNI is an information society service; Art 3(1) scopes the Directive
to services conveying signals on a public communications network, which UNI does not. No
action required.

### EP6 · Proposed ePrivacy Regulation — Medium — ⏳ Open
The 2002 Directive is being replaced by a proposed ePrivacy Regulation (ePR) which, unlike
the Directive, would apply directly to OTT/content services like UNI and cover all metadata
from internet services. As of June 2026 it is not adopted. When it is, re-audit —
particularly server-side analytics metadata (headers, timing, referrer), any push
notifications, and the scope of "strictly necessary" storage. No action now; set a reminder
to re-audit when the ePR enters into force.

### EP7 · GDPR Art 5(1)(c) · EventLogger identifier stripping — High — ✅ Done
**Source:** `app/Services/EventLogger.php` — `log()` wrote `ip_hash` (SHA-256 of IP + app
key — pseudonymous), `session_id`, `user_id`, and `referrer` on every analytics event
regardless of consent. A user who clicked "Odrzuć" still had all four written to the
database. **Legal basis:** Art 5(1)(c) data minimisation — pseudonymous identifiers not
necessary for aggregate behavioural signal must not be collected; a SHA-256 hash of an IP
is pseudonymous personal data, not anonymous. **Fix:** all four fields removed from
`EventLogger::log()`; the `Request` constructor dependency and `sanitizedReferrer()`
deleted. Two migrations: nullify existing rows (morning), then DROP all four columns
(afternoon). The `events` table is now genuinely anonymous and falls outside GDPR scope.
Decision records: `eventlogger-identifier-stripping.md`, `pii-columns-dropped.md`. Test:
`event_logger_stores_no_personal_identifiers`. See also GD14.

### EP8 · Art 5(3) PKE · PostHog CDN fired before consent — High — ✅ Done
**Source:** `resources/views/layouts/app.blade.php` — `posthog.init(...)` was called in
`<head>` on every page load. Even with `opt_out_capturing_by_default: true` (which prevents
cookies/localStorage), `posthog.init()` triggered a network request to load `posthog.js`
from the CDN — a traceable event exposing the visitor's IP, User-Agent, and timing to
PostHog's EU infrastructure before any consent decision. **Legal basis:** PKE Art 5(3) —
consent required before accessing/storing information on a terminal device; loading a
third-party analytics CDN is not technically necessary (HTTP cache is part of terminal
storage). **Fix:** `posthog.init()` removed from Blade; a stub IIFE in `<head>` creates only
the queue object (no network activity). `posthog.init()` now runs exclusively from
`analytics.js::initPostHog()`, invoked only from `grantConsent()` and `applyStoredConsent()`
(the latter checks `isConsentGranted()` first). API key/host passed via `<meta>` tags. Zero
PostHog network activity on first visit until the user clicks "Zaakceptuj". Decision record:
`posthog-cdn-lazy-init.md`.

## Related

- [`gdpr.md`](gdpr.md) — GD13 (server-side consent gate), GD14 (PII column drop)
- [`../privacy-notice.md`](../privacy-notice.md) — cookie & session disclosure (EP3)
