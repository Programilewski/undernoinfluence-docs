# Accordion Default-Open Priority Order

**Date:** 2026-06-17
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** UI/UX | Venue Profile

---

## Problem

The venue profile menu accordion auto-expands the top 3 categories by default. `VenuePresenter::accordionCategories()` sorts categories with piwo=priority 0, drinki=priority 1 (their business importance as the two most recognisable NA drink categories), then by item count for the rest. The open-by-default decision is made in the view by taking the first 3 slugs from this list. If the view re-sorts by count before taking 3, the piwo/drinki priority is silently defeated — a venue with 8 wines and 3 cocktails but only 2 custom drinks would open the wine accordion by default instead of drinki.

## Options considered

- Re-sort by count in the view before deciding which 3 to expand (old, buggy approach)
- Take the first 3 from the already-sorted presenter output (correct)
- Always expand all categories (too noisy for venues with 5+ categories)
- Always expand only piwo and drinki (breaks for venues with neither)

## Decision

The view takes the first 3 slugs from `accordionCategories()` output in the order VenuePresenter returns them — no re-sorting. VenuePresenter is the single source of truth for category display order; the view respects it. This ensures piwo is always first, drinki always second, regardless of item counts.

## Rules

`$topCategorySlugs` is derived as `collect($accordionCategories)->take(3)->pluck('slug')->all()` — no sort call. Any change to which categories open by default must be made in `VenuePresenter::accordionCategories()` sort logic, not in the view. The sort rule is: piwo=0, drinki=1, everything else by item count DESC.

## What this prevents

A venue owner who has worked hard to build a cocktail menu finding that the cocktail accordion is collapsed by default because another category had more items. The piwo/drinki priority reflects the product's core value proposition — these are the categories most users come to check.

## Revisit when

If user research shows that visitors consistently open a different category first (e.g. wine becomes the dominant category for a specific venue type), the priority order could be made configurable per venue or per venue type. Post-V1 when analytics data is available.
