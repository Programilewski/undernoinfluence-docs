# ADR-005: Layout Architecture

## Status
**Decided: 60/40 desktop split, FAB toggle mobile.**
**Executed:** yes — verified in the code 2026-09-14

## Context
The discovery page needs to show both a venue list and a map. Multiple patterns were considered.

## Options Considered
1. **30/70 hybrid** (map top 30%, list bottom 70%) — rejected. Scroll hijacking on mobile when thumb catches the map. Cramped cards.
2. **Map with bottom sheet** (Google Maps pattern) — rejected. Complex three-state gesture engineering in Alpine.js. Hides data-dense cards behind a peek state.
3. **List default + FAB toggle** (Pattern A) — chosen for mobile. Content-first, zero gesture conflicts, trivial to build.
4. **60/40 side-by-side** — chosen for desktop. Both panels visible, list is master.

## Decision
- **Mobile (< 1024px):** Full-screen list, FAB pill toggles to full-screen map
- **Desktop (>= 1024px):** 60% list left, 40% sticky map right, no FAB

## Key Technical Decisions
- Single map instance shared between mobile/desktop (moved between parents on breakpoint change)
- Map wrapped in `wire:ignore` — Livewire never touches map DOM
- Data flow: Livewire dispatches `venues-updated` → Alpine catches → updates Leaflet markers
- Default query is simple `ORDER BY credibility_score DESC` (cacheable)
- PostGIS bounding box only on explicit "search this area" click
- Bounding box queries have `LIMIT 60` ordered by credibility — low-scoring venues vanish at wide zoom

## Rationale
- List-as-master aligns with data authority positioning (evaluation mode, not navigation mode)
- Cacheable default queries reduce database load by orders of magnitude vs map-first
- B2B incentive alignment: users choose by credibility (improvable) not proximity (fixed)
- FAB toggle on mobile is trivially simple vs bottom sheet engineering

## Related
- [[product/features/Discovery Page]] for full UI spec
- Breakpoint transition details in desktop Claude Code prompt
