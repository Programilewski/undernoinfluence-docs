# Dark Map Tile Provider: CARTO over OSM Inversion

**Date:** 2026-06-28
**Status:** Superseded 2026-08-27
**Executed:** superseded 2026-08-27 by [[decisions/product/vector-basemap-on-openfreemap]]
**Area:** UI/UX

---

## Problem

The map needs a dark tile layer for dark mode. Native OSM tiles (openstreetmap.org) have no built-in dark variant. The two realistic options are: use a third-party dark tile provider (CARTO), or use OSM tiles with a CSS inversion filter. The answer isn't obvious — CSS inversion is free, requires no CDN dependency, and works instantly. CARTO is a separate CDN with attribution requirements.

## Options considered

CSS `invert(100%) hue-rotate(180deg)` applied to the Leaflet tile pane, with standard OSM tiles underneath. CARTO `dark_all` tiles served from their CDN. Other providers (Stadia, Jawg) — not evaluated, require API keys.

## Decision

We use CARTO `dark_all` tiles for dark mode and continue using standard OSM tiles for light mode. The CSS inversion prototype was built and visually compared; CARTO is meaningfully better and the quality gap is not worth closing with a hack.

## Rules

The dark tile URL stays as `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`. No CSS filters are applied to the tile pane in either mode. If the CARTO CDN ever becomes unavailable or begins charging, the fallback is Stadia Stamen Dark (requires API key) — not CSS inversion.

## What this prevents

CSS inversion produces perceptually wrong colors: parks turn magenta, white roads become grey, and the hue-rotate compensation is imprecise for all hues simultaneously. For a venue discovery product, the map is a trust signal — a visually degraded map implies degraded data quality. A polished dark map reinforces that UNI is a professional directory, not a weekend project.

## Revisit when

CARTO changes their free tile policy or the CDN becomes unreliable. At that point evaluate Stadia (free tier with attribution) or Jawg (paid, clean API) before considering CSS inversion.

---

*Partially superseded 2026-08-22: the product ships dark only, so the light-mode half of this
record no longer applies — OSM tiles are not used anywhere. CARTO `dark_all` remains the discovery
basemap and the fallback plan stands. See [[decisions/product/single-palette-no-theming]].*

*See also: [[decisions/product/inline-venue-map-data]]*

---

*Superseded 2026-08-27 by [[decisions/product/vector-basemap-on-openfreemap]].* The premise of this
record — that CARTO tiles are free, keyless and stable — no longer holds. CARTO now requires an API
key and watermarks keyless tiles, its free tier is framed as intended for non-commercial use, and
it has said the raster basemaps are being retired. The fallback named here (Stadia Stamen Dark)
was also re-checked and rejected: Stadia's free tier forbids commercial use and its paid entry is
$20/month. The replacement is vector tiles from OpenFreeMap drawn by MapLibre GL JS.
