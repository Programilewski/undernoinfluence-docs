# The homepage showcase renders the real product, not a drawing of it

**Date:** 2026-08-16
**Status:** Decided
**Executed:** 2026-09-14
**Area:** UI/UX | Brand

---

## Problem

The homepage section that is supposed to show what UNI does was a wireframe: grey bars for venue names, coloured dots for a map. A visitor arriving from search had to take on trust that something worth clicking sat behind it, and the homepage never showed a venue's drinks card at all. Any mockup also drifts — the first change to the map or the venue page leaves the homepage advertising a product that no longer exists.

## Options considered

Keep refining the wireframe until it looks convincing. Render the shipped components against real venues pulled from the database. Render the shipped components against invented venues. Take a screenshot of the live map and use it as an image.

## Decision

The showcase renders the components the product actually ships — the venue tile, the map pin styling, the menu rows — against venues that are entirely invented, and it runs the real map library on the real basemap rather than a drawn imitation. Three attempts at generating a street network as vector graphics all read as graph paper, because a real street network has topology that a jittered grid cannot fake. Invented data keeps the section from ever reading as a recommendation; real components keep it from ever drifting from the product.

## Rules

No real venue appears anywhere in a homepage showcase, and a test enforces it. Invented venues are never persisted and never seeded; only categories come from the database, so colours and icons cannot drift. The basemap uses the label-free tile style, so the showcase never names a city and the city-agnostic homepage decision holds. The map is inert — no dragging, no zooming, no popups — and loads only when scrolled into view. A drawn fallback stays behind it for a blocked tile provider. The menu card is a preview, not the venue page: a few rows per category, custom drinks first, and a count for the remainder. Demo venues never link to a venue page, since their slugs have none.

**Amended 2026-09-14 — the revisit below was executed: the real map is now a still image of itself.** The live showcase made every phone download the map library, a style, an icon sheet and tiles at first paint — the look-ahead fired before any scroll — and sent each visitor's address to the tile host, for a decoration that nobody can touch. It had also drifted to the labelled style, so it named Warsaw's streets. `scripts/render-showcase-map.mjs` renders the real basemap once, label-free; `<x-demo-map>` shows it with the same pin markup on top, lit by Alpine instead of map markers, with the OpenStreetMap credit visible. The render check asserts the image loads and that no map resource is requested. "Runs the real map library" in the Decision above is superseded; everything else stands.

## What this prevents

A wireframe teaches a visitor nothing and converts nobody, and a hand-maintained imitation becomes a lie the first time either view changes. Pulling real venues would have been worse in a different way: the homepage is the most visible surface in the product, so anything shown there reads as an endorsement, and a canary venue surfacing on it would put a fictional place in the single worst location.

## Revisit when

Self-service claiming ships and the homepage needs to convert venue owners as well as visitors — the showcase would then need to speak to two audiences instead of one. Also revisit if the third-party tile request on the landing page is ruled out on privacy grounds, in which case a static image of the real map replaces the live one.

---

See also: [[decisions/product/city-agnostic-homepage]], [[decisions/product/dark-map-tile-provider]], [[decisions/product/prefers-reduced-motion]], [[decisions/product/posthog-cdn-lazy-init]]
