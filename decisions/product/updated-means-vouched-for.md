# "Zaktualizowano" means the day someone vouched for the offer

**Date:** 2026-10-08
**Status:** Decided
**Executed:** yes, 08.10.2026
**Area:** Venues | Data Model

---

## Problem

Every venue shows "Zaktualizowano X dni temu", and after 90 days without one it counts as out of date. Fault 9 (change-flows, 07.10) read this as "the day the menu was read", so a menu read in August and loaded in November would wrongly say "dziś", and proposed carrying the reading date from the menus file into the badge. That made the date a manual entry on every row of every file, and it had no answer for an owner who read their menu a month ago and knows nothing changed.

## Options considered

The day the menu was read, typed into each file row or each import. The day someone vouched for the offer in the panel: an admin adding, confirming or importing, an owner clicking "Nadal w ofercie". An automatic check of the menu's web address (left for later).

## Decision

"Zaktualizowano" is the day someone vouched for the offer in the panel, and fault 9 is closed as working as intended. Founder, 08.10.2026: *"we say its zaktualizowane dziś because the action happened today"*, with *"a margin of trust and offset"*: whoever confirms a menu read three days ago, sure it is current, vouches for it today; an owner who knows nothing changed confirms today without dating anything. The menus import has no date column: every row is dated with the day of the import (*"I'd rather make the date automatic based on the date of the import"*).

## Rules

Every panel action that adds or confirms a drink dates it and the venue with the day it happened, admin and owner alike. Importing a menus file is such an action: whoever loads it vouches that it is current that day, so menus are loaded only when the loader is sure they still hold. A removal is a panel action and is dated the same way. The date stored on a drink (`checked_at`) and its web address remain the provenance record for a dispute or a re-check plan; in the import it is the import day, in the admin forms it defaults to today. Nothing asks anyone to type a date that the system already knows.

## What this prevents

A date column on every row of every file, and the stale or mistyped dates that come with it. An owner made to state when they last read their own menu. A badge that means one thing for an admin and another for an owner.

## Revisit when

When one click stops being enough to vouch for a whole venue: the backlog row "one click refreshes the whole venue's Zaktualizowano" asks whether confirming one item vouches for the whole menu, and must be settled before the owner switch. When an automatic check of menu addresses is built, it becomes a third way to vouch.

---

*See also: [[tech/change-flows]] (fault 9) · [[decisions/product/badges-are-rules-over-recorded-evidence]] · [[decisions/product/one-ordering-for-every-venue-list]] · [[ops/adding-a-venue]]*
