# One result tile, and the comparison that chose it is closed

**Date:** 2026-09-17
**Status:** Decided
**Executed:** 2026-09-17 — the dark glass skin, its stylesheet block, the `variant` prop and `UNI_DISCOVERY_TILE` are all deleted
**Area:** UI | Discovery

---

## Problem

Two skins for the discovery result card shipped behind `UNI_DISCOVERY_TILE` while the choice between them was open: `card`, the surface-coloured tile that had shipped all along, and `dark`, the glass panel borrowed from the homepage showcase. A third value, `split`, alternated them down the list so they could be judged side by side.

That was the right way to decide and the wrong way to stay. Every skin is a second code path: a palette to keep in step, a stylesheet block to maintain, a prop on the tile component, a validation branch in the Livewire component, and a test asserting the two render identical detail. The comparison mode was worse — it made **every fifth tile on `/mapa` look different**, which is fine for the person choosing and incoherent for a first-time visitor.

## Options considered

**Keep both and ship one**, leaving the loser available behind the flag. The flag costs nothing to leave, and the code behind it costs maintenance forever — this is the shape `UNI_OWNER_MANAGED_BADGE` had, a flag standing in for a decision nobody closed.

**Keep `dark`**, the glass panel. It matches the homepage showcase and the pure-white text is punchier.

**Keep `card`, delete the rest.** Chosen.

## Decision

**The discovery list has one tile: `card`, the lighter surface-coloured panel.** The dark skin is deleted — the CSS block, the `variant` prop, the config key and the environment variable with it. Rendered side by side at the same size, the lighter panel reads as a card on the page while the dark one reads as a hole in it, and the page is a list of places rather than a map overlay.

## Rules

A second skin comes back only with a reason that is not "we could". `DiscoveryPageTest::test_one_tile_skin_carrying_every_detail` inverts the test that used to prove the two variants matched: it now asserts there is one skin, and that it still carries the detail the variant was never allowed to drop — the dot tooltips, the product count and both action buttons.

## What this prevents

A comparison mode reaching a visitor, which was a live risk while `UNI_DISCOVERY_TILE=split` sat in a working `.env`. And the slower failure: two palettes drifting apart, each fixed separately, until the "identical detail" test is the only thing holding them together.
