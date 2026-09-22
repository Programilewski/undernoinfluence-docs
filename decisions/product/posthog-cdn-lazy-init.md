# PostHog CDN loads only after consent is granted

**Date:** 2026-06-22
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** Analytics | Compliance

---

## Problem

The standard PostHog integration puts `posthog.init()` in the `<head>`, which triggers a network request to load `posthog.js` from the CDN on every page load. Even with `opt_out_capturing_by_default: true` (which prevents PostHog from writing cookies or localStorage), the CDN request itself is a network event — PostHog infrastructure can see the visitor's IP, User-Agent, and timing before any consent decision has been made. Under PKE Art. 5(3), even reading from a user's terminal device requires prior consent unless strictly necessary.

## Options considered

- **`opt_out_capturing_by_default: true` + CDN in `<head>`** — PostHog sets no cookies before consent, but the CDN request still fires. Legally ambiguous: the request is observable by PostHog's EU infrastructure before consent.
- **CDN lazy init** — keep the stub IIFE in `<head>` (no network request, just sets up a queue object), and defer `posthog.init()` (which triggers the actual CDN download) until after the user grants consent.
- **Remove PostHog entirely** — eliminates the question but loses session exploration and funnel analysis capability.

## Decision

We use CDN lazy init. The `<head>` contains only the PostHog stub IIFE, which creates a queue object with no network activity. `posthog.init()` is called inside `analytics.js::grantConsent()` and nowhere else. This means zero PostHog network requests on the first visit until the user clicks "Zaakceptuj wszystkie" or returns as a previously-consenting user.

## Rules

`posthog.init()` must never be called from Blade templates, from `app.js`, or from any context that runs before consent is verified. The only entry points are `grantConsent()` and `applyStoredConsent()` (which itself checks `isConsentGranted()` before calling `grantConsent()`). The PostHog API key and host are passed via `<meta>` tags so they're available to `analytics.js` without embedding them in a `<script>` block that could be confused with an initialisation call.

## What this prevents

Sending a CDN request before consent violates the spirit of PKE Art. 5(3) and may constitute "reading" from terminal storage (HTTP cache) without consent. It also exposes the visitor to PostHog's EU infrastructure fingerprinting before any consent has been given. Lazy init closes this gap completely — PostHog is completely invisible to the network layer until the user actively consents.

## Revisit when

If PostHog introduces a privacy-mode CDN (edge-hosted, no fingerprinting) that removes the pre-consent observable network event concern. Or if UNI moves PostHog to a self-hosted instance where the CDN request goes to UNI's own servers.

---

See also: `frontend-analytics-module.md`, `posthog-analytics-role.md`, `consent-banner-design.md`
