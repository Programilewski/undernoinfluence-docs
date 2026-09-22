# Mobile filter surface collapses into a bottom-sheet

**Date:** 2026-07-03
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** UI/UX

---

## Problem

On the discovery list view, the full filter surface (category pills, city/district selects, verified, 0.0%, freshness) sat always-open above the venue list. On a ~375px phone this pushed the first venue card far below the fold and ate most of the initial screen — the user had to scroll past a wall of controls before seeing a single result. Filters and results were competing for the same scarce vertical space.

## Options considered

Keep everything always-visible and accept the scroll cost. Shrink or truncate the filter controls to fit. Move filters into a top drawer. Collapse the whole surface into a bottom-sheet behind a single toggle. Split filters between a mobile map overlay (already exists) and hide them entirely from the list view.

## Decision

On mobile, the list-view filters collapse into a bottom-sheet overlay opened by a "Filtry" toggle. The toggle sits in a compact row directly above the list, next to the result count, a dedicated mobile sort control, and a clear-all button that only appears when filters are active. Desktop is unchanged — filters stay inline and always visible. Results win the default screen; filtering is one tap away.

## Rules

The bottom-sheet is mobile-only; at the `lg:` breakpoint the same panel renders static and inline with an ordinary "Sortuj" label + select. The "Filtry" toggle always shows, but the adjacent clear-all button appears only when the active-filter count (categories + cities + districts + verified + strictZero + freshness) is greater than zero. The sheet and the inline desktop panel share one set of Livewire-bound controls — no duplicated filter state. The mobile map view keeps its own separate quick-filter overlay; the two surfaces do not merge.

**Amended 2026-09-17 — one filter, one control.** "Sprawdzona karta" had a second control of its own: a pill fixed at the bottom-left of the map view, apart from every other quick filter, which sat in the same corner as the consent re-open button and partly covered it. The map overlay's own filters live together in one bar; a single filter floating in a corner is neither that bar nor the sheet. **The pill is deleted and the filter is not replaced on the map** — it stays in the filter panel, where every other filter is, and a visitor filtering by it switches to the list. Nothing else about the two surfaces changes: they still do not merge.

`DiscoveryPageTest::test_the_verified_filter_has_exactly_one_control` asserts the count, because a second control for one filter is how this happened in the first place.

## What this prevents

The alternative — a permanent filter wall — buries results below the fold on the exact screens most people use, making the product feel like a form instead of a map. Truncating controls would have hidden filters users need; a full-screen filter page would have lost the result count context. The bottom-sheet keeps results primary while leaving every filter reachable in one tap.

## Revisit when

Post-V1 if analytics show low filter engagement on mobile (toggle discourages use) or if the active-filter count row proves confusing. Revisit the desktop split too once filter count grows beyond what fits inline.

See also: [[decisions/product/discovery-list-cap]], [[decisions/product/category-aware-sort]], [[decisions/product/server-side-get-filtering]]
