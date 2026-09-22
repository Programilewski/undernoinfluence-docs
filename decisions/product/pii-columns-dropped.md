# PII columns dropped from events table (not left as nullable)

**Date:** 2026-06-22
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** Data Model | Compliance

---

## Problem

After stripping personal identifiers from `EventLogger` (see `eventlogger-identifier-stripping.md`), the columns `user_id`, `session_id`, `ip_hash`, and `referrer` remained in the `events` table schema as nullable columns — always `NULL`, never written. An initial decision was made to leave them in place to avoid a potentially disruptive `ALTER TABLE`. But as long as the columns existed, the admin analytics widget was still SELECTing `referrer`, and any developer encountering the schema would reasonably assume the data was live or would be live again.

## Options considered

- **Leave as nullable** — avoids a schema migration; columns are empty but present; low operational risk.
- **Drop columns** — removes the schema artefact entirely; forces all code that references them to be updated immediately; the data model matches the compliance intent permanently.

## Decision

We drop all four columns. The migration runs `dropForeign(['user_id'])` then `dropColumn(['user_id', 'session_id', 'ip_hash', 'referrer'])`. The admin "Źródła ruchu" panel in `VenueAnalyticsWidget` was removed as a consequence, as it depended on the `referrer` column. The events table final schema contains only: `id`, `type`, `venue_id`, `city_id`, `properties`, `created_at`.

## Rules

No migration may add `user_id`, `session_id`, `ip_hash`, or `referrer` back to the `events` table without a documented legal basis change and a corresponding privacy policy update. If referrer-equivalent traffic attribution is needed in the future, it must be implemented using UTM parameters (explicitly disclosed, stored in `properties` jsonb, not as a separate identifying column). The admin widget must not show a "Źródła ruchu" section until a privacy-clean referrer mechanism exists.

## What this prevents

Leaving columns in place creates a false expectation: future developers see the schema and assume the data exists or will exist. It also left live code (the admin widget) querying a column that appeared populated but was always NULL — leading to silent data loss in the UI. Dropping the columns makes the truth unambiguous: this data does not exist and was not designed to.

## Revisit when

If UNI implements UTM parameter tracking (no personal data, no per-session linkage) and wants to show traffic source attribution in the owner analytics product. At that point, a `utm_source` or similar column in `properties` jsonb would be the correct approach, not a dedicated nullable column.

---

See also: `eventlogger-identifier-stripping.md`, `analytics-three-tiers.md`
