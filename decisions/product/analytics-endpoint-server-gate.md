# Analytics endpoint enforces consent server-side

**Date:** 2026-06-22
**Status:** Decided
**Executed:** superseded 2026-08-30 — the consent gate on the events endpoint was removed by [[decisions/product/analytics-split-posthog-and-events]]; the Status line above is stale
**Area:** Analytics | Compliance

---

## Problem

The `/analytics/events` POST endpoint receives dwell-time and interaction events from the browser. The client-side code (`venue-analytics.js`) already checks `isConsentGranted()` before firing. But client-side gates are enforced in the browser only — a technically motivated user, a browser extension, or a scraper could POST directly to the endpoint and write server-side event rows without going through the UI consent flow. The server had no independent check.

## Options considered

- **Client-side only** — already implemented; simpler; relies on the browser to honour the gate.
- **Server-side `abort_unless(cookie === 'granted', 403)`** — the controller checks the `uni_consent` cookie before any processing; returns 403 if absent or denied.
- **Rate limiting only** — already in place (`throttle:analytics-events`, 30/minute); does not address consent.

## Decision

We enforce consent server-side in `AnalyticsEventController` as the first line of the controller method. Any POST without a valid `uni_consent=granted` cookie returns 403 immediately, before any validation or processing. Both layers (client and server) are active simultaneously.

## Rules

The consent check (`abort_unless(cookie === 'granted', 403)`) must remain the first statement in the controller, before form request validation and before any database writes. Tests that send valid data to the endpoint must include the consent cookie in the request; tests that verify the 403 behaviour must use unencrypted cookies (the `uni_consent` cookie is excluded from Laravel's `EncryptCookies` middleware). Any new analytics endpoints that write personal-data-adjacent records must include the same gate.

## What this prevents

Without server-side enforcement, a user who clicks "Odrzuć" on the banner could still have dwell events written to the database if someone submitted the form data directly (e.g., via a browser extension, a mobile app spoofing the endpoint, or a test script). The server gate makes the consent promise unconditional — it cannot be bypassed by anything the client does.

## Revisit when

If the analytics endpoint is extended to serve different data types with different consent requirements. Or if a new consent tier is introduced (e.g., opt-in for personalisation vs opt-in for analytics) — the gate would need to check the relevant specific consent flag.

---

See also: `frontend-analytics-module.md`, `eventlogger-identifier-stripping.md`
