# Discovery list capped at 24 cards — map keeps all venues

**Date:** 2026-06-02
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** UI/UX | Data Model

---

## Problem

The discovery page was rendering every matching venue as a card in the HTML, producing ~1.31 MB responses with the full dataset. This hurt first-load performance and Lighthouse scores. But the map needs all matching venues as pins — cutting map results would break the core discovery experience.

## Options considered

1. **Render all venues as cards** — current approach, 1.31 MB HTML responses.
2. **Cap rendered cards, keep all map pins** — reduces HTML size while preserving the map as the primary discovery surface.
3. **Paginate both list and map** — complex, users lose the "see everything on the map" mental model.
4. **Virtual scroll / infinite scroll** — JS complexity, accessibility concerns, SEO implications.

## Decision

Initial HTML renders 24 venue cards. The map still receives all matching venues (up to the 500-venue safety cap). A "Pokaz kolejne lokale" button loads the next 24. Search, filter changes, geolocation, and map-bounds changes reset the visible count to 24. This reduced the local response from ~1.31 MB to ~675 KB.

## Rules

The visible limit is 24 cards per page. The map payload always includes all matching venues regardless of the list cap. Filter/search changes reset the visible count. The "load more" copy explicitly states how many are shown vs total, and notes that the map shows all results.

## What this prevents

Slow first loads on the main consumer entry point. The map is the primary discovery surface — users scan pins, then drill into cards. Capping cards without capping pins preserves this flow while cutting HTML weight by ~50%.

## Revisit when

If the map payload itself becomes a performance issue (500+ venues with category data), consider lazy-loading map data too. Current analysis (2026-06-09) shows the map JSON is ~15-20 KiB at 71 venues — not a concern. See also: inline-venue-map-data.md.
