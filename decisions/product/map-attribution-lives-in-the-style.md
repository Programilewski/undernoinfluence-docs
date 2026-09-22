# Map attribution is declared in the style file, not added by each map

**Date:** 2026-08-30
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** Legal | UI/UX

---

## Problem

The tiles are a Produced Work derived from OpenStreetMap, so the credit has to be
visible wherever a map is shown — the only place this product touches ODbL at all.
Each of the four maps added that credit from its own code, while the tile server was
already supplying one of its own. The result was two credits stacked together, which
on a phone took two lines of an already small map, and a rule that had to be
remembered separately in four places.

## Options considered

Add the credit from each map's code, as before. Rely entirely on whatever the tile
server sends. Declare it once on the source inside the basemap style file we keep.

## Decision

The credit is declared on the source in our own copy of the basemap style, and no map
adds one in code. A source's own attribution is used in preference to the tile host's,
so there is exactly one credit, its wording is ours, and it survives a change of tile
provider because it lives in our file rather than theirs.

## Rules

No map passes a custom attribution. Adding a map surface inherits the credit
automatically, with nothing to remember. Changing tile provider means checking the
credit still names OpenStreetMap before the change ships, because the obligation
follows the data and not the supplier. The browser check asserts the credit is present
and appears once.

## What this prevents

Prevents both halves of the same failure: a duplicated credit that wastes space on a
phone, and a missing one that puts the product in breach of the licence its basemap
depends on. Keeping it in the style file also prevents it quietly disappearing if the
tile host changes what its own metadata says.

## Revisit when

The basemap moves to a self-hosted extract, where the credit must be carried into the
new style file rather than assumed to come with the tiles.

---

*See also: [[decisions/product/vector-basemap-on-openfreemap]] ·
[[decisions/product/osm-dropped]] ·
[[decisions/product/map-correctness-needs-a-browser]]*
