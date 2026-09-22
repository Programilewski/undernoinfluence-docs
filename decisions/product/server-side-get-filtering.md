# Server-side GET filtering for shareable, indexable URLs

**Date:** 2026-04-22
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** UI/UX | Analytics

---

## Problem

The discovery page needs category filters, tag filters, city selection, and search. The modern default is client-side state management: filter state lives in JavaScript, the page never reloads, filtering feels instant. But client-side state produces URLs that don't reflect filter state — you can't share a "Warsaw, NoLo beer" search, and Google can't index filtered views. For a platform whose growth depends on SEO, invisible filter state is a structural problem.

## Options considered

**Client-side state (SPA-style)** — filter state in JS memory or URL hash. Fast, no page reloads. URLs not shareable in a useful way. Google can't index filtered results as distinct pages.

**Server-side GET form** — filter state in URL query parameters (`?city=warszawa&category=piwo&q=heineken`). Every filter combination is a real, bookmarkable, shareable URL. Slightly slower (page reload or Livewire roundtrip) but every state is indexable.

**Hybrid** — GET for major filters (city, category), client state for minor interactions (hover, sort). Reasonable, but adds complexity for marginal gain.

## Decision

All filtering (category pills, tag pills, city, search input) submits as GET parameters. `?city=warszawa&category=piwo&q=heineken` is a valid, bookmarkable URL that Google can index. Client-side Alpine.js handles only micro-interactions (card/pin hover sync, scroll-to-card highlight) that are independent of and don't conflict with the GET filtering mechanism.

## Rules

Category filter pills, tag pills, city selector, and search input all submit via GET form or Livewire query string binding. No filter state lives exclusively in JavaScript memory. URLs must reflect the full active filter state so they can be copied, shared, or bookmarked and reproduce the exact same view. Alpine.js micro-interactions (hover, highlight) are purely presentational and do not own any filter state.

## What this prevents

Prevents the SEO dead-end: client-side filtering means Google sees only one page regardless of what filters are active. For UNI, filtered pages (`/warszawa?category=piwo`) are the SEO surface — they need to exist as real URLs. Prevents "I can't share this search" friction for users who want to send a filtered venue list to a friend. Prevents analytics blindness — GET params are logged as real page views, not invisible JS state transitions.

## Revisit when

Post-V1, if server-side filtering proves too slow for acceptable UX (>300ms latency on filter change). At that point, consider Livewire's `wire:navigate` or partial page updates — but URL reflection of filter state must be preserved regardless of rendering approach.

---

*See also: venue-type-filtering.md*
