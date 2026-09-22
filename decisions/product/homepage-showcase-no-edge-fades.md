# The homepage map strip gets no edge fades

**Date:** 2026-08-17
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** UI/UX

---

## Problem

The full-bleed map strip on the homepage meets the page background with a hard horizontal edge at its top and bottom. The instinct is to soften that with a gradient, and we tried two ways of doing it. Both cost something: a fade drawn inside the strip covers the map, and the map is the thing the section exists to show.

## Options considered

Fades painted inside the strip, over the map, from the page background colour. The same fades in black rather than the page colour. Approach bands sitting outside the strip so the page darkens into it and the map stays untouched. No fades at all.

## Decision

No fades. The strip meets the page with a clean edge on both sides. The inner version was rejected because it dimmed the top and bottom of a map we had just spent a session making real, and the outer version added two full-width bands of chrome that earned nothing once the map was no longer being covered.

## Rules

The map strip renders edge to edge with nothing painted over it. Nothing is layered above the basemap except the floating result list, which is the product being demonstrated. If the hard edge ever needs softening, it is solved with spacing or with the section's own background, never with a gradient over the map.

## What this prevents

Decoration obscuring the demonstration. The section's entire job is to show a real map with a real result list on it; a gradient that dims a quarter of that map to smooth a transition nobody complained about trades the point of the section for polish.

## Revisit when

The strip sits against a background it clashes with badly enough that the seam reads as a rendering fault rather than a deliberate edge.

See also: `homepage-showcase-real-components.md`, `city-agnostic-homepage.md`
