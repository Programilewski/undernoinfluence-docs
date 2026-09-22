# A filter that narrows the list is visible, counted, and cleared with the rest

**Date:** 2026-09-17
**Status:** Decided
**Executed:** 2026-09-17 — the map area is counted, shown outside the sheet, and cleared by "clear all"
**Area:** UI/UX | Analytics

---

## Problem

Tapping "Szukaj w tym obszarze" on the map narrows the list, which is what a person expects. But nothing on the list view said so: the chip that shows and clears the area lives inside a sheet the visitor has to open, the count beside "Filtry" did not include it, and the button labelled *clear all filters* left it in place. So the list quietly held fewer venues than before, with nothing on screen explaining why, and one control in the interface was telling a small lie.

## Options considered

Leave it — the behaviour is right and the indication is a detail. Show the area chip on the list view as well. Count the area among the active filters. Make "clear all" clear it. Treat the map area as something other than a filter.

## Decision

**Anything that narrows the list is a filter, and every filter obeys the same three rules: it is visible on the surface where its effect is felt, it is counted among the active filters, and "clear all" clears it.** The map area is a filter. So is the venue type, which had also been missing from the count since the morning it was built.

## Rules

A filter has exactly one control. A second control for the same filter is how "Sprawdzona karta" ended up with a pill floating in the corner of the map, on top of another control, apart from every other filter. When a filter is set on one surface and felt on another — the area, set on the map and felt in the list — its indicator belongs on both. A control whose label promises more than its behaviour delivers is a defect, not a simplification.

## What this prevents

A list that has silently lost rows, which is the one thing a directory cannot afford: a visitor who cannot tell the difference between "there are only four places" and "you are looking at four of them" has no reason to trust either number.

## Revisit when

A filter appears whose effect genuinely is not felt in the list — a purely cartographic control, say — which would be the first real exception rather than an oversight.

*See also: [[decisions/product/mobile-filter-bottom-sheet]] · [[decisions/product/discovery-filters-are-not-indexable]] · [[decisions/product/venue-type-filtering]]*
