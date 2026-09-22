# A mock proves we parse a shape, not that anybody still sends it

**Date:** 2026-09-12
**Status:** Decided
**Executed:** 2026-09-12
**Area:** Analytics | Data Model

---

## Problem

Every test touching a third party fakes the HTTP layer, which is correct — a suite that calls other people's servers is slow, flaky and rude. But it means the suite cannot tell a working integration from a dead one. On 12.09 the statistical office's geocoding service was returning no matches for any input, including the examples in its own documentation, and its second endpoint was answering with a server error. Nine geocoding tests passed throughout. The same day, a map that was unreachable on every phone passed a check written specifically to catch invisible maps, because that check only ever ran at desktop width. In both cases every automated signal was green and the feature did not work.

## Options considered

Call the real services in the normal suite, which makes the build red whenever somebody else has a bad afternoon. Add more mocks with more shapes, which multiplies confidence without adding information. Check by hand before each session, which is what had been happening and is what failed. Keep the mocks and add a small, separate, deliberately-run set of tests that call the real thing.

## Decision

**Any integration whose failure would be invisible gets a live check that runs outside the default suite, and the first-visit path is part of what gets checked.** The live tests sit in their own group, excluded from the standard run, and are invoked deliberately before trusting an integration in production. Mocks stay exactly as they are: they assert that we parse a response correctly, which is the only thing they can assert.

A live check that finds somebody else's service broken reports it rather than failing, because that is information about them, not a defect in us.

## Rules

The live group is excluded by configuration rather than by naming convention, so it cannot be picked up by accident, and it is named in the deployment checklist as a step before cataloguing. Checks that need a browser answer the consent dialog first and run at both desktop and phone width, because a control that is unreachable on a phone is unreachable for most visitors — the map button under the consent panel was found this way and no other way. A check asserts the rendered result, not the absence of errors: a canvas with a real size, an address that resolves to the coordinates somebody verified by hand. When a provider is replaced, the live check for the old one is kept until the old one is removed from the code, so a fallback cannot rot unnoticed.

## What this prevents

The specific failure of building on a dependency that stopped working, and finding out during the one session that cannot be repeated — the first import of real data. It also prevents the false comfort of a growing test count: sixty tests that all mock the same dead endpoint are worth less than one that calls it.

## Revisit when

The live checks start being skipped because they are slow or noisy, which would mean they are testing too much. The right size is a handful of calls that answer "is this still there, and does it still return what we think".

---

*See also: [[decisions/product/map-correctness-needs-a-browser]] · [[decisions/product/geocoding-comes-from-the-state-register]] · [[decisions/product/the-scheduler-reports-that-it-ran]]*
