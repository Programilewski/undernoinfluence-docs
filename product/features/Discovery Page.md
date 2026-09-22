# Discovery Page

**Status:** **Built and working.** **Verified against code 2026-08-18.** The previous description ("category pills render but are non-functional, no `venue_type` column, sorting not started") was months out of date. Today: `app/Livewire/DiscoveryPage.php` plus `app/Services/Discovery/`. Filters: categories (multi-select), "Sprawdzona karta", "Zarządza właściciel", "Tylko 0.0%", recency (7/30/90/180 days), city, district, map bounds. Sorting: best offer / nearest / name. Search covers venue name, district, catalog products and the venue's own custom drinks. Filter state lives in the URL (`kategorie`, `sprawdzone`, `wlasciciel`, `zero`, `aktualnosc`, `sortuj`, `szukaj`) — those names freeze on launch day, see [[roadmap/pre-launch-checklist]]. Card↔pin hover sync has worked since 17.08.

The core product page. Users find NoLo venues here.

## URL Structure

**Spec:** `/warszawa` (city-scoped, future: `/krakow`, `/wroclaw`)
**Current implementation:** `/venues` with optional `?city=warszawa` query param

**Decision pending:** This is the single most important routing decision before SEO indexing begins. City-scoped URLs (`/warszawa`) rank better for local queries, are cleaner for users, and match how every successful local directory structures URLs. Once Google indexes either structure, changing it costs redirects and lost link equity. Decide and implement before any SEO pages go live. See [[product/features/SEO Landing Pages]].

## Desktop Layout (>= 1024px)
60/40 split, full viewport width.

**Left pane (60%):**
1. Venue count — dynamic, updates with filters (e.g., "22 lokale")
2. Search input — searches venue names and product names. Placeholder: "Szukaj lokalu lub napoju..." Visually quiet, not dominant.
3. Category filter pills — 6 categories, multi-select, accent color fill when active
4. "Więcej filtrów" expandable — collapsed by default, reveals 13 tag pills when opened. Badge count "(2)" shown when tags active and section collapsed. Auto-expands if tags present in URL params.
5. Sort control — "Najlepsze" (credibility, default) only. "Najbliżej" (distance) appears only after user grants geolocation permission.
6. Scrollable venue card list

**Right pane (40%):**
- Sticky map, full height
- Wrapped in `wire:ignore` to protect from Livewire DOM updates
- Pins for venues currently in the list
- Data flows: Livewire → Alpine event → Leaflet marker updates
- "Search this area" button on explicit map pan (not automatic)
- Bounding box query with LIMIT 60, ordered by credibility_score

**Hover interaction:**
- Card hover → pin highlights (scale, color change)
- Pin hover (300ms delay) → list smooth-scrolls to card, card highlights
- Quick mouse movement across pins does NOT cause list bounce

## Mobile Layout (< 1024px)
Pattern A: list default + FAB toggle.

- Full-screen scrollable list as default
- FAB pill at bottom center: "🗺️ Mapa" / "📄 Lista"
- Map lazy-loads on first FAB tap, stays alive after
- Scroll position preserved when toggling back to list
- Tag pills wrap (flex-wrap) when expanded, no horizontal scroll

## Breakpoint Transition
- Single map instance shared between layouts
- On resize: map container moved to correct parent via JS + `map.invalidateSize()`
- FAB hidden on desktop (`lg:hidden`)

## Filtering Architecture

**Server-side filtering (GET form):** Category pills, tag pills, city, and search all submit as GET parameters. This is intentional — URLs are shareable and indexable by Google. `?city=warszawa&category=piwo&q=heineken` is a valid, bookmarkable URL.

**Client-side micro-interactions (Alpine.js):** Hover interactions (card↔pin sync, scroll-to-card, highlight) are independent of the filtering mechanism. They are Alpine.js enhancements that work regardless of how the list was populated. GET form filtering and Alpine micro-interactions are not in conflict — both can coexist on the same page.

## Default Query
```sql
SELECT * FROM venues
WHERE city_id = :id
ORDER BY credibility_score DESC;
```
Cacheable via Redis — same result for every user. PostGIS spatial queries only fire on explicit "search this area" in map view. Note: `credibility_score` column does not yet exist — see [[product/features/Credibility Score]] for the planned spec.

## Map Pins
- Default (no filter): show category count (e.g., "4")
- Single category filter: show product count in that category (e.g., "12")
- Multi category filter: show combined product count
- Checkmark displayed on pin if venue is verified
- Venues with zero matching categories hidden from map

## Connected Systems
- Every search/filter/tap logged as analytics event → [[tech/analytics|Analytics]]
- Pin rendering uses data from [[product/features/Verified Checkmark]]
- Sort by credibility uses scoring from [[product/features/Credibility Score]]
