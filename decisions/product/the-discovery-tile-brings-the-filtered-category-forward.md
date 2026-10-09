# The discovery tile brings the filtered category forward (trial)

**Date:** 2026-10-09
**Status:** Decided as a trial — keep, adjust or revert once real venues are in
**Executed:** 2026-10-09, in two commits titled "Trial:"
**Area:** UI/UX

---

## Problem

With a category filter on, every venue tile still shows all its categories in the same order, so a person looking for wine has to find the wine row in each tile. The tile should answer "how much of what I asked for is here?" at a glance, without turning a quiet card into a loud one.

## Options considered

No change. A tinted background behind the matching row in the category's own colour (built first; on a wide tile it read as a heavy block). The matching row moved first with a bold name, the other rows stepping back. The category's colour on the matching name (rejected: some category colours are too dark to read as text on the card). A setting to switch variants (rejected: no visual variant switch reaches production, the 18.09 rule).

## Decision

With a filter on, each matching row moves to the front of the tile with a bold name and a note for screen readers; the other rows keep readable names in the muted text colour and fade only their dots. Several selected categories are all brought forward. Without a filter the tile is unchanged.

## Rules

Nothing that carries meaning relies on colour alone. Faded rows stay readable (the muted colour is about 8:1 on the card); only the dots fade. The trial lives in its two "Trial:" commits so it can be reverted whole.

## What this prevents

A filter that narrows the list but leaves every tile reading the same, and a highlight that shouts.

## Revisit when

The first real venues are in and the tiles can be judged with real menus, or anyone finds the moved rows confusing.
