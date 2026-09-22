# No opening hours displayed in V1

**Date:** 2026-05-04
**Status:** Decided
**Executed:** 2026-09-14
**Area:** Venues | UI/UX

---

## Problem

Users want to know if a venue is open before visiting. But opening hours are deceptively complex: day-of-week schedules, holiday exceptions, seasonal changes, temporary closures. Stale hours are worse than no hours — a user who shows up to a "closed" venue that UNI said was open will not return.

## Options considered

1. **Structured opening hours table** (day-of-week, open/close, exceptions) — complex schema, high maintenance burden, stale data risk.
2. **Free-text hours field** — simpler but still goes stale, no structured filtering possible.
3. **Link to Google Maps / Instagram** where owners already maintain hours — zero maintenance, always current.
4. **No hours at all** — simplest but loses useful info.

## Decision

Don't store or display opening hours. Link to Google Maps and Instagram where venue owners already maintain this data. The external link is always current because the owner maintains it at the source.

## Rules

No opening hours columns in the venues table. Venue profiles link to Google Maps (for navigation and hours) and Instagram (for current status). No "is this venue open now?" filtering.

**Amended 2026-09-14 — the column is gone.** `venues.opening_hours` existed unused; it was removed from the create migration while the table is empty ([[decisions/product/pre-launch-has-no-past-to-protect]]). `SchemaHardeningTest` fails if it returns.

## What this prevents

Stale hours destroying trust. A structured hours table that's wrong 20% of the time is worse than no hours at all — the damage from a wasted trip outweighs the convenience of checking hours on UNI vs Google Maps.

## Revisit when

In V2 if claimed owners want to self-manage hours through the panel and commit to keeping them updated.
