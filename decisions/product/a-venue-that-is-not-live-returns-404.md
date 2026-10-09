# A venue that is not live returns 404

**Date:** 2026-10-09
**Status:** Decided — revisit on a trigger
**Executed:** yes — the behaviour already in the code, verified 2026-10-09
**Area:** Venues | UI/UX

---

## Problem

A venue leaves the public site in four ways: it was never ready (a draft), its last drink was removed (the activation gate took it down), an admin switched it off, or it was erased. Its address may already be in a bookmark, a shared link or a Google result. Should that address say "not found", or keep a useful page?

## Options considered

404 for every case. 410 ("gone") for venues that were once public. A 200 page with `noindex, follow` for an emptied venue ("we can't currently confirm any non-alcoholic drink here", with nearby venues), and a "closed" page for one switched off by hand, which would need a reason recorded with the switch. A redirect to the district page.

## Decision

Every venue that is not live returns 404 in V1. For search the options are equivalent: Google treats 404 and 410 the same and drops a `noindex` page too, so the honest page serves only someone already holding the link — and at launch nobody holds one. A redirect to an unrelated page is what Google calls a soft 404, and a "closed" page shown for a venue switched off because its data is wrong would publish what was just judged wrong.

## Rules

Drafts, emptied venues, venues switched off by hand, erased venues and canaries all answer 404. The honest-page design above is the starting point when this is revisited; it needs a "was ever public" fact (`first_published_at`) to tell an emptied venue from a draft, and a reason on the admin switch before any "closed" page.

## What this prevents

Building pages for a problem no visitor has yet, and a page that keeps showing a name and address an admin has just decided are wrong.

## Revisit when

Search Console shows venue pages as a large share of landings, or its "Not found (404)" report lists `/miejsce/` addresses still being requested.

---

*See also: [[decisions/product/venue-activation-gate]], [[decisions/product/empty-landing-pages-noindex]], [[decisions/product/nothing-false-is-published-to-a-visitor]], `tech/venue-visibility.md`*
