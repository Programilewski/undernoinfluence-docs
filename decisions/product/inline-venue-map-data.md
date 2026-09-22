# Keep venue map data inlined in HTML

**Date:** 2026-06-09
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** UI/UX | Data Model

---

## Problem

Lighthouse scores the discovery page at 78 performance on localhost with dev assets. The `@js($venuesForMap)` call serializes all venue data directly into the HTML document. The question: does moving this to an async API endpoint meaningfully improve load performance, or is the complexity not worth it?

## Options considered

1. **Keep inlined `@js()`** — current approach, zero additional requests, map renders immediately with data.
2. **Async API endpoint** — fetch venue data after page load via `/api/venues/map`, reduce initial HTML size.

## Decision

Keep the data inlined. At 71 venues with ~13 fields each, the JSON payload is roughly 15-20 KiB — trivial. Even at the 500-venue cap it would be ~100-150 KiB. The Lighthouse "document request latency" flag (439 KiB) is driven by server response time and dev-mode asset size, not the venue JSON. The real performance gains come from `npm run build` (minifies 618 KiB JS + 30 KiB CSS), production server hardware (better TTFB), and server config (HTTPS, HTTP/2).

## Rules

The map data stays inlined via `@js($venuesForMap)` in the Blade template. No API endpoint for map markers. The 500-venue cap in `MapData::forVenues()` remains as a safety rail. If venue count grows past ~300 and LCP regresses, revisit this decision.

## What this prevents

An API endpoint would introduce auth requirements (or an abuse surface without auth), a race condition where the map loads empty before the fetch completes, and CORS/caching complexity — all for moving ~15 KiB out of the HTML. Classic over-engineering for a 5% theoretical gain.

## Revisit when

When venue count exceeds ~300 and a production Lighthouse test shows LCP above 2.5s attributable to document size (not TTFB or JS bundle).
