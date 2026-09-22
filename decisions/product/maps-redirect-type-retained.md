# Keep the `maps` outbound-redirect type despite no UI link

**Date:** 2026-07-08
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** Venues

---

## Problem

The venue outbound-redirect handler supports four link types — directions, website, instagram, and `maps`. The `maps` type (a Google Maps *search-by-coordinates* link, i.e. "show this place on a map", distinct from *directions*/turn-by-turn navigation) is fully built and has three passing tests, but no button on any venue page or listing card actually generates it. So it looks like dead code. The question: delete it as cruft, or keep it as intentional infrastructure?

## Options considered

Delete it — remove the handler branch, the route constraint that allows `maps`, the analytics mapping entry, and the three tests. Keep it as-is — leave the tested backend in place, wire up a button later. Keep it with an inline reminder comment noting it has no UI link yet.

## Decision

Keep it. The `maps` type is deliberate, test-covered infrastructure that is one button away from being live. Deleting it would throw away the finished half of a feature (backend + tests done, only the UI link missing) and cost more to rebuild later than the ~10 lines it would save now. It carries no cost while dormant: nothing calls it, it is not a performance or security risk, and it does not confuse other code.

## Rules

`maps` means a Google Maps search link built from the venue's coordinates (a pin lookup), and is kept distinct from `directions`, which is a navigation route. The `maps` type records a `venue_maps_clicked` analytics event but intentionally does not increment a venue engagement stat (`stat` is null) — unlike website, instagram, and directions clicks, a map-pin open is not counted as owner-facing engagement. Do not remove the `maps` handler branch, its route constraint, its analytics entry, or its three tests without an explicit decision to drop the feature — treat the tests as the lock that keeps this behaviour intentional.

## What this prevents

Throwing away tested, working code because it is temporarily unreferenced, then paying to rebuild it. It also stops the recurring "why is `maps` here?" question from being answered by deletion instead of by this record.

## Revisit when

Finalising the venue-page call-to-action set, or if `maps` remains unlinked past launch — at that point either wire up a "Show on map" button or delete the type together with its three tests.

See also: inline-venue-map-data.md
