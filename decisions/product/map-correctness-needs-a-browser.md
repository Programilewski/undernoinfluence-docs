# Map correctness is checked in a browser, because nothing else can see it

**Date:** 2026-08-30
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14 (`npm run check:map`, `check:render`)
**Area:** Analytics | UI/UX

---

## Problem

Five map defects shipped in one session, and not one of them produced a failing test
or an error anybody would notice. An invalid expression made the map library reject a
paint property and drop the entire pin layer without throwing. A stylesheet ordering
change collapsed a container to zero height, so the map rendered perfectly into a box
that could not be seen. A duplicated credit ate two lines of a phone screen. Self-hosted
fonts returned 404 in development only, so the pins were measured in the wrong typeface.
Every one was found by a person looking at a screenshot, which is not a control.

## Options considered

Rely on the PHP suite, which cannot see rendering at all. Rely on manual review, which
is what failed. Add a full end-to-end browser suite covering the whole product. Add two
narrow checks aimed at exactly the failure modes observed.

## Decision

Two checks, both narrow and both run by hand rather than on every commit. One validates
the layer definitions against the map library's own specification, so an expression that
would be silently rejected fails loudly instead. The other loads every map surface in a
real browser and asserts the canvas has a non-zero size, the credit appears exactly
once, no request failed, and nothing was logged as an error.

## Rules

The definitions are kept separate from the code that installs them, so they can be
checked without a browser. Every generated expression is evaluated against real inputs
rather than only validated, because a generated expression can be perfectly valid and
still produce the wrong answer. The browser check uses whatever Chromium-family browser
is already on the machine and downloads nothing. **It runs every surface at two
viewports, 1280x900 and 390x844, and answers the consent dialog before looking for a
map** — amended 2026-09-12, after running at desktop width only let a completely
invisible mobile map pass cleanly for eleven days. On a phone the discovery map lives
behind the list and only builds when the toggle is tapped, so the check taps it; a check
that does not is checking the list. Warnings the upstream basemap style
produces on its own are ignored by name, never by silencing whole categories. Both run
before any change to a map surface is called finished, and neither is a substitute for
looking at the result. **A change to the map library itself is checked against a built production bundle, not only the dev server** — amended 2026-09-12, after a major-version upgrade that passed every PHP test drew no map on any surface of the built bundle, and the library documents that its dev and production loading differ; see [[decisions/product/the-map-library-stays-patched]].

## What this prevents

Prevents the specific and repeated failure of a map that is broken while every
automated signal says it is fine. The 12.09 case is the sharpest yet: the map was
correct, the container was full-sized, and the map was unreachable on every phone
because a modal covered the button that builds it — three green checks and a map
nobody could open. The zero-height container is the clearest case: the
style loaded, the tiles were fetched, the library logged nothing, and the map was
invisible. Only a check that measures the rendered canvas could tell the difference.

## Revisit when

The checks stop catching anything over several map changes, or the number of surfaces
grows enough that a proper end-to-end suite is worth its maintenance instead.

---

*See also: [[decisions/product/map-pins-are-pre-rendered-images]] ·
[[decisions/product/vector-basemap-on-openfreemap]]*
