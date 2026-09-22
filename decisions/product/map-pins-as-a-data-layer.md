# Map pins are drawn as a data layer, so grouping stays possible

**Date:** 2026-08-30
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** UI/UX

---

## Problem

The record that moves the maps to MapLibre says pin grouping is dropped because the Leaflet
plugin has no equivalent. That reason is false — MapLibre groups pins itself. The reason it
matters is not today: fifty to eighty pins in one city genuinely do not need grouping, but the
catalogue is meant to grow, and at a hundred and fifty pins a Warsaw map is unreadable. Grouping
only works on one of the two ways of drawing pins, and the other way cannot be converted without
rewriting the pin layer.

## Options considered

Draw each pin as a piece of the page positioned over the map, which is easier to style with the
existing CSS but can never be grouped. Draw the pins from a single list of venue data and let
the map render them, which supports grouping as a setting. Ship grouping switched on from the
start. Ship it switched off but reachable.

## Decision

Pins are drawn from a single list of venue data handed to the map, not as separate pieces of the
page. Grouping ships switched off, because at fifty to eighty venues it adds nothing, and is
switched on when a single city passes roughly a hundred and twenty venues. This costs nothing
extra during the migration and turns a rewrite into a setting.

## Rules

No map surface positions individual pins over the map as page elements. Pin colour by category
is expressed as a rule in the map style rather than as a condition in JavaScript, which is the
second thing this drawing method makes possible. The venue data already placed directly into the
page is the source the map reads, so no new request is introduced. The grouping threshold is
recorded here rather than discovered when somebody complains the map is unreadable.

## What this prevents

Prevents a second map rewrite at the exact moment the catalogue is finally big enough to be
worth something, and prevents the false technical claim in the basemap record from being
inherited by whoever builds the map next. It also prevents the opposite mistake: treating
"grouping is possible" as "grouping must ship", which would grow a two to four day migration
that has to finish before launch.

## Revisit when

A single city passes roughly a hundred and twenty venues, at which point grouping is switched on
rather than re-evaluated. Also revisit if the map ever needs to show something a data layer
cannot draw, which would be the only reason to go back to page-positioned pins.

---

*See also: [[decisions/product/vector-basemap-on-openfreemap]] ·
[[decisions/product/inline-venue-map-data]] · [[decisions/product/single-palette-no-theming]]*
