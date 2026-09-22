# A deploy needs more than git carries, and the difference is written down

**Date:** 2026-09-22
**Status:** Decided
**Executed:** yes — the home-server runbook ships three directories and checks the content type
**Area:** Infrastructure | Process

---

## Problem

`public/vendor/maplibre-gl/<version>/` holds the map library. Vite's `vendorMapLibre` plugin copies it out of `node_modules` at build time, and it is gitignored — correctly, because it is generated. So no clone has it, and the first asset transfer to the home server shipped only `public/build`.

The result was a site where **every page rendered perfectly and every map was blank.** `map-loader.js` requested the library, got a 404, and that appeared in the browser console and nowhere else — not in the Laravel log, not in nginx's error log, and not in any check that looked for `manifest.json`.

Fixing it produced the same symptom again from a different cause: the file then returned **200**, and the browser still refused it, because Ubuntu's nginx has no `mime.types` entry for `.mjs` and a dynamic `import()` rejects a module that is not served as JavaScript.

## Options considered

Track the built artifacts in git. Build on the server so they are regenerated. Enumerate what a deploy needs beyond the repository, and check it.

## Decision

**What git carries and what a deploy needs are two different sets, and the difference is enumerated in the runbook rather than remembered.** For UNI that difference is three directories — `public/build`, `public/vendor/maplibre-gl/` and `public/map-styles` — shipped together as one bundle.

**And a 200 is not proof that an asset works.** The check curls the `Content-Type`, because a file served with the wrong type succeeds at every layer except the one that matters.

## Rules

A gitignored path that the running application reads at runtime is named in the deploy runbook, in the same step that ships it. A check for shipped assets verifies the thing the browser verifies — presence *and* content type — never presence alone. Where a failure is visible only in a browser console, the symptom is written into the runbook beside the fix, because nothing on the server will ever report it. And the `.mjs` type is set with `default_type` in a location matching only that extension, never a `types { }` block, which inside `server` replaces the inherited map rather than adding to it and would silently drop every other MIME type on the site.

## What this prevents

Prevents a catalogue whose maps are blank while every health check passes — the failure mode with no server-side symptom at all. It is now deploy-checklist **C7**, because production runs the same nginx against the same three files and would have found it the same way, on the day of launch.

## Revisit when

Assets are built on the server as part of the deploy, which regenerates the vendored library and makes the enumeration unnecessary — a live tension, since checklist C2 forbids building on a 4 GB box and that is the shape of the hosting decision this waits on.

---

*See also: [[decisions/product/a-deploy-is-proved-by-a-clean-clone]] · [[decisions/product/the-map-library-stays-patched]] · [[decisions/product/vector-basemap-on-openfreemap]] · [[roadmap/deploy-checklist]]*
