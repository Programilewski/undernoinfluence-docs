# Map pins are pre-rendered images, not circles and not page elements

**Date:** 2026-08-30
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** UI/UX

---

## Problem

Drawing pins from a data source is what keeps grouping available, but a data layer
cannot render arbitrary markup the way a page element can. The first attempt paid that
price by giving up the design: flat saturated circles with the count floating
underneath and no category icon at all. It read as a bubble chart rather than a map,
and it broke the rule that pins should be the only saturated thing on screen. The pin
is not decoration — its colour, icon and count are the product's whole claim, and a
plain dot says only "a venue is here", which any map says.

## Options considered

Circle layers coloured by category, which is what a data layer natively offers. Page
elements positioned over the map, which keeps the markup but can never be grouped.
Rendering each pin to an image and placing it on a symbol layer. Keeping two pin
implementations, one per surface.

## Decision

Each distinct pin is drawn once onto a canvas from the same measurements as the CSS,
registered with the map as an image, and placed by a symbol layer. The design survives
intact — dark pill, tail, bordered chip, category icon and count — and the layer can
still group, because grouping is a property of the source rather than of what the pins
look like.

## Rules

Pin geometry is read from the stylesheet rather than invented: the same radius,
padding, border and shadow values, so the map and the rest of the interface cannot
drift apart. Identical pins share one image, and only the combinations present in the
data are drawn. Selection is a second image with a lighter body and an accent border,
and it lives in the feature data rather than in feature state, because choosing an
image means writing a layout property and layout properties cannot read state. The
selected pin does not scale, for the same reason. Hover stays in feature state, since
only a paint property reacts to it and rewriting the whole source on every mouse move
would be waste. The homepage showcase is the one exception and keeps page elements: it
shows a fixed composition that never groups and never changes.

## What this prevents

Prevents the catalogue's one distinguishing surface degrading into a dot map the day
it moved to a technology chosen for a completely unrelated reason. It also prevents the
opposite failure — keeping page elements for the sake of the design and discovering at
a hundred and fifty venues that grouping requires rewriting the pin layer after all.

## Revisit when

A pin needs to show something a drawn image cannot hold, or the number of distinct
pin shapes grows past what an image atlas can carry — several hundred combinations
rather than the few dozen a city produces.

---

*See also: [[decisions/product/map-pins-as-a-data-layer]] ·
[[decisions/product/accent-only-map-clusters]] ·
[[decisions/product/vector-basemap-on-openfreemap]]*
