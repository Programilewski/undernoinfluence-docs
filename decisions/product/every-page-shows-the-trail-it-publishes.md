# Every page shows the trail it publishes

**Date:** 2026-09-17
**Status:** Decided
**Executed:** 2026-09-17 — one component across all eight page types, parity asserted by test
**Area:** UI/UX | SEO

---

## Problem

Eight page types carried a breadcrumb and each built it its own way, so each was wrong in its own way. Two pages showed a trail that omitted the home page while publishing one that included it. One showed its trail under an English label on a Polish site. Two showed a "back" link instead of a trail. **The venue page — the most indexed page type in the product — showed a link to the map while publishing a trail naming its city and district**, and the new drink pages did the reverse, showing a trail that started at the map while publishing nothing at all.

## Options considered

Fix each page's trail in place and move on. Keep the structured data as the single source and drop the visible trails. Keep the visible trails and drop the structured data. Build the trail once per page and give it to both consumers.

## Decision

**A page builds its trail once and hands the same list to both the visible breadcrumb and the structured data.** Every trail starts at *Strona główna* and names only real parents — a page whose address a visitor could walk up to. A drink sits under its category, a venue under its district and city, a brand under nothing but the home page, because its drinks span several categories and naming one would be picking a favourite.

## Rules

Any page with a breadcrumb renders it through the shared component and publishes it through the shared structured-data component, from one array defined in the view or supplied by a presenter. The trail describes the site's hierarchy, never the route the visitor happened to take — the map is where somebody looks for a place, and it is not the parent of anything. The label a screen reader announces is Polish, like the rest of the interface. A trail with only one crumb is not rendered.

## What this prevents

Telling a reader one thing and a crawler another, on the page type that earns the most search traffic. It also prevents the slower failure: eight implementations of one idea, each drifting on its own schedule, with no way to notice except by reading all eight.

## Revisit when

A page type appears that genuinely has two parents — a drink belonging to two categories, say — at which point the rule needs a tie-break, not an exception.

*See also: [[decisions/product/brand-and-product-pages]] · [[decisions/product/seo-cluster-entry-points]] · [[decisions/product/venue-url-structure]]*
