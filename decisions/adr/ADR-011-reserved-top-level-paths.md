# ADR-011 — Top-level paths are reserved, and a city may not take one

**Date:** 2026-09-17
**Status:** Accepted
**Executed:** 2026-09-17 — `App\Support\ReservedPaths`, the `City` saving guard, `App\Rules\NotReservedPath`, `ReservedPathsTest`
**Area:** Routing | Data Model | SEO

---

## Problem

City pages live at `/{citySlug}` — a catch-all registered last in `routes/web.php`, under a comment saying it must stay there. That is correct and it has a consequence nobody had written down: **a static route always wins the match**, so a city created with the slug `faq`, `kontakt` or `mapa` has no page at all.

The failure mode is what makes this worth a record. Nothing errors. No log line appears. The city exists in the database, its venues exist, its districts exist, and every internal link to it resolves to a completely unrelated page that returns 200. It is discovered only by somebody looking for a city page that is not there — and by then the slug is in the sitemap, in the internal link graph and in Google's index, so fixing it is a rename plus redirects rather than an edit.

Three static top-level paths were added on 17.09 (`/faq`, `/kontakt`, `/suchy-styczen`), which is three more chances for the collision than existed the day before. Expansion adds cities; content adds paths; the two namespaces grow toward each other.

## Options considered

**Prefix city pages, e.g. `/miasto/{citySlug}`.** Removes the collision entirely and breaks the URL structure decided in `venue-url-structure` — `/warszawa` is the shape the SEO cluster is built on, and it is the reason there are no redirects to pay for at expansion.

**Derive the reserved list from the router at runtime.** Tempting, and wrong in the way that matters: a guard that reads the thing it is guarding cannot fail when that thing changes. It would also reserve every package's routes, including Livewire's per-install generated endpoint.

**A hand-written list, with a test that walks the real route table.** Chosen.

## Decision

`App\Support\ReservedPaths` holds the list of top-level paths this application owns. `City` refuses to save a model whose slug is on it, throwing rather than failing quietly, and `App\Rules\NotReservedPath` is the same check in the form a form can use.

`ReservedPathsTest` walks `Route::getRoutes()` and fails when any static first segment is missing from the list, skipping only `_`-prefixed development tooling and Livewire's generated update endpoint — addresses that are not ours to write down and that no city could plausibly take.

## Rules

**A new static top-level route is added to `ReservedPaths` in the same commit.** The test is what makes that non-optional; it fails on the next run otherwise.

**The guard throws.** Cities are created by seeders, imports and tinker, not by a form — a validation message nobody reads is not a guard. `NotReservedPath` exists for the day a city form does, and is the one piece here with no caller today.

**Second-level collisions are already closed and stay that way.** `/{citySlug}/{categorySlug}` is constrained by `uni.category_seo_slug_pattern`, an explicit list of six slugs, so a district can only be shadowed by being named exactly one of them. If that pattern ever becomes open-ended, districts need this same treatment.

## What this prevents

A city page that silently does not exist, found months after the slug is in the index — and the class of debugging where the request, the database and the logs all look correct because each of them is.
