# A list row shows the place, not a picture of it

**Date:** 2026-09-17
**Status:** Decided
**Executed:** 2026-09-17 — the block and the confirmation pill are live on every list of venues
**Area:** UI/UX

---

## Problem

The venue list on a drink page read as a wall: every row the same shape, every row opening with a line of text, nothing for the eye to land on. The obvious fix is a small map thumbnail per row, which is also what it asks for visually — a rectangle with the location in it.

## Options considered

A live map per row. A pre-rendered map thumbnail per venue. A leading block carrying the district as text. Nothing, and accept the density.

## Decision

**Each row opens with a block carrying a pin and the district — the place as a shape, not a picture of it.** Map thumbnails are rejected: at that size, with no labels, every venue in a city renders the same grey grid, so the picture adds weight and no information. Where a list is about one drink, each row also carries **when that drink was last confirmed at that venue**, which is the fact that differs row to row and the question the page is actually asked.

## Rules

A list row may carry a leading block only if the block says something the row does not repeat. On a page about a drink, the row carries that drink's own confirmation date, and the pill goes neutral once the date falls outside the freshness window — colour that says "fresh" over a date that says otherwise is the same defect as a badge nobody earned. Venue-led pages do not show a drink-specific date, because there the row is about the venue and the date would be ambiguous. If a map ever belongs on such a page, it is **one** map for the whole list, never one per row.

## What this prevents

A hundred-odd rendered images whose only content is an indistinguishable street grid, each needing regeneration when a venue's coordinates change and its own attribution wherever it appears — for a decoration. It also prevents the live-map version, which is not merely expensive: twenty-four map instances exceed the browser's limit on rendering contexts, so the bottom of the list would simply come out blank.

## Revisit when

A list is about places that are far apart enough for a thumbnail to distinguish them — a national list, or a list spanning several cities — where the picture would carry information rather than weight.

*See also: [[decisions/product/brand-and-product-pages]] · [[decisions/product/map-pins-are-pre-rendered-images]] · [[decisions/product/what-the-badges-claim]]*
