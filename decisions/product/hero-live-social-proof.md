# Hero uses live venue count and floating venue cards as social proof

**Date:** 2026-06-22
**Status:** Superseded
**Executed:** 2026-06-22, reversed 2026-08-15
**Superseded:** 2026-08-15 by the change that made the homepage city-agnostic and explained the filters, then [[decisions/product/homepage-showcase-real-components]] — the live venue-count badge and the four floating cards were removed from the hero; a showcase of invented venues rendered with the real discovery components now does the "this is a real, living directory" job. Written down 18.09: the reversal had no record for a month. That change gives the city-agnostic reason for the hero's text and none for the count and cards.
**Area:** UI/UX

**Worth reconsidering at launch.** The count was dropped while every venue in the database was fabricated, when a live number could only have been a false one. Once the catalogue is real, the original argument — a live number cannot go stale, a static claim can — holds again.

---

## Problem

A first-time visitor has never heard of Under No Influence. In the first 3–5 seconds they need to believe the directory contains real, current content. A headline and a button give them no reason to trust this. Static mock content (hardcoded "50+ venues") can go stale and looks fake. A screenshot of the UI is hard to parse at a glance. The question: what does the hero show to make a stranger believe the product is alive and worth exploring?

## Options considered

Showing a static "50+ venues" count (simple, never wrong, never impressive). Showing a screenshot of the discovery map (accurate but cognitively heavy). Showing a stock photo (off-brand, no information content). Showing floating venue cards from real data with a live count pulled from the database.

## Decision

The hero left column shows a live badge with the current active venue count from the database (`Venue::active()->count()` on every page load). The hero right column shows four floating venue cards with real category pills from `$categories`. The combination answers the first-visit question instantly: this is a real directory with real content, right now.

## Rules

The venue count badge must be driven by a live database query, never hardcoded. Category pills in the hero cards use the first, third-and-fourth, and fifth-and-sixth categories from the `$categories` collection — they reflect what the platform actually tracks. The third card ("Herbaciarnia") only renders if there are at least 5 active categories; below that the quadrant omits it rather than showing empty pills. Venue names in the hero are fictional placeholders ("Craft Room", "Bar na Mokotowie", "Herbaciarnia") — they are not linked and carry no SEO consequence.

## What this prevents

A static claim ("50+ venues") would be misleading the moment the count changes — either inflated before launch or stale six months in. A product screenshot would require visual design effort on every UI change. The live count + animated cards approach stays accurate automatically and demonstrates platform vitality without requiring marketing copy to explain it.

## Revisit when

If the venue count reaches a round milestone (100, 500) where a specific number is more compelling than a precise live count, consider a "100+ lokali" static badge instead. If animation performance becomes a concern on low-end mobile devices, revisit whether the right column should be hidden at a lower breakpoint than `lg`.
