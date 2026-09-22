# Vector basemap on OpenFreeMap, drawn by MapLibre

**Date:** 2026-08-27
**Status:** Decided
**Executed:** 2026-09-01
**Area:** UI/UX | Infrastructure

---

## Problem

Every map in the application is currently broken. CARTO now requires an API key on
`basemaps.cartocdn.com` and stamps keyless tiles with a repeating "API KEY REQUIRED" watermark —
verified today on all three styles the app uses (`dark_all` on discovery, `voyager` on the venue
page, `dark_nolabels` on the homepage showcase). Fixing it means choosing a basemap supplier
again, and the previous choice assumed CARTO raster was free, stable and permanent. It is none of
those: CARTO's own key page frames the free tier as *"intended for non-commercial use"*, and its
FAQ says the raster basemaps are being retired with no date given.

## Options considered

Request a free CARTO key — self-serve, 5 million tiles a month, commercial projects tolerated,
one file changed, but built on a product being retired. Geoapify's free plan — commercial use
explicitly allowed with attribution, 3,000 credits a day, still raster and still somebody's free
tier. Stadia Maps at $20/month or MapTiler Flex at $30/month — commercial use bought outright,
against a rule that V1 carries no recurring spend. OpenFreeMap with MapLibre GL JS — free,
commercial use explicitly allowed, no key, no stated limits, but vector tiles cannot be drawn by
Leaflet, so the map component is rewritten. A self-hosted Protomaps PMTiles extract of Poland
served from the application server.

## Decision

The maps move to MapLibre GL JS drawing vector tiles from OpenFreeMap, and they move now, without
taking a CARTO key first. There is no durable free raster option left — raster hosting has become
a paid product, and free-plus-commercial-plus-sustainable now exists only on the vector side.
The stopgap was rejected because nobody sees the broken map: there is no production, no DNS, and
access is over the tailnet, so an hour spent on a key, an environment variable and test updates
would be deleted within days. Doing the migration before launch costs two to four days; doing it
after means changing a live, indexed product.

## Rules

All three public map surfaces move together — discovery, venue profile and the homepage showcase —
because leaving one on Leaflet means maintaining two map stacks for one product. Pin clustering
ships switched off, because fifty to eighty pins in a single city do not need grouping.

> **Corrected 2026-08-30.** This paragraph previously said clustering was dropped because
> "`leaflet.markercluster` has no MapLibre equivalent". That is false — MapLibre groups pins
> natively on a GeoJSON source. Only the plugin is lost, not the capability. The product judgment
> in the second half stands, and the architectural consequence is recorded separately in
> [[decisions/product/map-pins-as-a-data-layer]]: pins are drawn as a data layer, so turning
> grouping on at roughly 120 venues in one city is a setting rather than a rewrite.

The basemap style is a JSON file kept in the repository and owned by us, kept dim and desaturated
so that `#7c3aed` pins are the only saturated thing on screen. The privacy-policy recipient entry changes in the same commit as the tile URL,
never afterwards. The admin mini-map stops pulling Leaflet from the unpkg CDN as part of the same
work. If OpenFreeMap becomes unavailable, the replacement is a self-hosted Protomaps PMTiles
extract of Poland served from the application server — one fewer third party receiving visitor IP
addresses.

> **Corrected 2026-08-30.** That fallback is not "same client code, a different URL". The style
> file we keep in the repository still points at OpenFreeMap for two things besides tiles: the
> glyph server that supplies map fonts, and the sprite sheet that supplies map icons. Executing
> the fallback means serving those as well, or the map renders with no labels and no symbols.

## What this prevents

Prevents paying twenty to thirty euros a month for a raster stack we would migrate off anyway,
and prevents the same migration landing after Google has indexed the site, when the map is a live
surface rather than a local one. Prevents a product whose entire pitch is being the trustworthy
source of venue data from shipping a basemap with "API KEY REQUIRED" written across it. And it
ends the recurring question of which free tile tier tolerates a commercial product, because the
answer stops depending on somebody else's wording.

## Revisit when

OpenFreeMap becomes unreliable or disappears, at which point the self-hosted PMTiles fallback is
executed rather than re-evaluated. Or when a city outside Poland needs a basemap, where the
extract-based fallback changes shape.

See also: [[decisions/product/dark-map-tile-provider]] — superseded by this record ·
[[decisions/product/carto-named-as-recipient]] · [[decisions/product/single-palette-no-theming]] ·
[[decisions/product/inline-venue-map-data]]
