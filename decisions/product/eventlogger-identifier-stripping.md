# EventLogger — Strip All Personal Identifiers

**Date:** 2026-06-22
**Status:** Decided
**Executed:** 2026-06-22
**Area:** Analytics

---

## Problem

The `EventLogger` service writes an event row to the internal `events` table on every venue view, search, click, and outbound redirect. Each row was storing four fields that qualify as personal data under GDPR: a salted SHA-256 hash of the user's IP address, the Laravel session ID (which links all requests in a browsing session), the authenticated user ID, and the sanitised referrer URL. This happened unconditionally — regardless of whether the user had accepted or declined the cookie consent banner. A user clicking "Odrzuć" correctly stopped PostHog from firing but had no effect on the internal event log. The banner was making a promise the code was not keeping.

## Options considered

**Option A — Strip all identifiers:** Remove `ip_hash`, `session_id`, `user_id`, and `referrer` from every event row. The data becomes genuinely anonymous (not pseudonymous). GDPR does not apply to anonymous data, so no legal basis is required and no consent gate is needed.

**Option B — Gate EventLogger behind `uni_consent` cookie:** Keep the identifier fields but only write events when the user has consented. Mirrors the PostHog gate already in place.

**Option C — Claim legitimate interest (Art. 6(1)(f)) and keep the current code:** Update the privacy policy to better describe the processing, add an opt-out mechanism, and run a Legitimate Interest Assessment.

## Decision

We strip all four identifier fields from every `EventLogger` write. The `events` table now contains only `type`, `venue_id`, `city_id`, `properties`, and `created_at`. Existing rows with identifiers were retroactively nullified via a data migration on 2026-06-22. The `events` table now holds genuinely anonymous data and falls entirely outside GDPR's scope.

## Rules

All event rows written by `EventLogger` contain no IP hash, session identifier, authenticated user ID, or referrer URL. These fields remain as nullable columns in the schema but are never populated by application code. Any future change to `EventLogger` that reintroduces identifier storage requires a product decision review, not just a code review. The test `event_logger_stores_no_personal_identifiers` enforces this at the test-suite level.

## What this prevents

Option B (consent gate) would mean losing all server-side behavioural analytics for users who decline — typically 30-50% of visitors. At V1 scale, the dataset would be so sparse it would not answer the core questions: which venues are getting views, what search terms yield zero results, which outbound links convert. Option C (legitimate interest) is legally defensible but contested; UODO has taken an increasingly strict position on analytics. Option A avoids both problems: the full analytical signal is preserved, the legal basis question disappears entirely, and the consent banner's promise is honoured in full.

## Revisit when

If we ever need individual-level session attribution in the first-party stack — e.g. to reconstruct a single user's journey for support or fraud purposes — we would need to introduce a separate, consent-gated session log distinct from the anonymous event log. That is a V2 or later decision, and it should be a separate table, not a change to `events`.

---

*See also: [analytics-three-tiers.md](analytics-three-tiers.md), [posthog-analytics-role.md](posthog-analytics-role.md), [frontend-analytics-module.md](frontend-analytics-module.md)*
