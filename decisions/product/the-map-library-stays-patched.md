# The map library stays on its patched version, and the extra weight is paid

**Date:** 2026-09-12
**Status:** Decided
**Executed:** 2026-09-12; unbundled and measured 2026-09-14
**Area:** UI/UX

---

## Problem

A critical advisory was published against the map library behind every map on the site, a way around its HTML sanitiser, and the fix exists only in the next major version. Our own exposure was low, because every popup escapes what it displays and every value comes from data an admin typed. But the new major version packages its background worker as a separate download, so a page that draws a map gets about 150 KB heavier on a first visit — on a product whose growth channel is search, where page speed is measured.

## Options considered

Stay on the unpatched version and rely on our own escaping. Upgrade and accept the extra download. Upgrade and write custom build tooling to share code between the library and its worker to win the weight back. Replace the map library.

## Decision

We upgrade and pay the weight. A known critical advisory in a library that renders on the core screen is not something we keep to save bytes, and "our code escapes everything" is a promise one future popup can break. The upgrade proved that it has to be verified properly: bumping the version alone blanked every map on the production build while every PHP test stayed green.

## Rules

A security fix for a shipped library is taken even across a major version, and its cost is written down rather than used as a reason to wait. Any change to the map library is checked with the map render check against a built production bundle as well as the dev server, because the two load the library differently and only the build shows what visitors get. The library is still loaded only when a map is about to be drawn, so pages without a map pay nothing. The weight of the discovery map is measured on a throttled phone profile before launch, and custom tooling to reduce it is built only if that measurement says it matters.

**Amended 2026-09-14 — measured, and the weight won back without a rollback.** The phone measurement this record required showed the library was 19% of the discovery map's bytes; tiles and the opening view were the rest. MapLibre is now served unbundled from `/vendor/maplibre-gl/<version>/` (copied by `vite.config.js`), so the worker imports the shared module the page already downloaded — 422 KB gzipped became 302 KB — and the discovery map opens on the venues instead of on Poland. **This depends on the server sending long cache headers for `/vendor/` and `/build/`**: without them the worker downloads the shared module a second time (measured). On a phone the library is prefetched only when the browser reports a good connection.

## What this prevents

Prevents shipping a public site with a known critical advisory in its most visible component, and prevents the quieter failure the upgrade exposed: a version bump that passes every test, deploys cleanly and shows every visitor a blank map.

## Revisit when

The phone measurement before launch shows the discovery map is too slow on a mobile connection, or the library ships a build that no longer needs a separate worker download.

---

*See also: [[decisions/product/map-correctness-needs-a-browser]] · [[decisions/product/vector-basemap-on-openfreemap]]*
