# Badge copy doesn't say who checked

**Date:** 2026-10-27
**Status:** Decided
**Executed:** 2026-10-27 — home, how it works, FAQ, glossary and terms reworded; "Zespół UNI sprawdził" and "ktoś od nas" are gone
**Area:** Brand | Venues | UI/UX

---

## Problem

The public copy said "Sprawdzona karta" means the UNI team went through the menu. That's true in V1, where only the admin checks menus. It stops being true when owners manage their own menus: on 07.10 you set the target meaning as "a venue its owner manages counts as checked". You raised it in the 27.10 commute notes: verified, but not necessarily by UNI, and the badge fades if nobody confirms freshness.

## Options considered

Keep "zespół UNI" until V2 and rewrite then. Write the V2 meaning now. Describe what the badge guarantees without naming who did the checking.

## Decision

**The copy says what the badge guarantees, not who provides it:** the menu was checked item by item within the configured window, and the badge lapses after that. The same words are true in V1 and in V2, so flipping the owner switch doesn't make them false.

## Rules

Public copy about the badge names the check and its window ("sprawdzona pozycja po pozycji w ciągu ostatnich N dni"), never the checker. The window is read from configuration, not written in by hand where the page can render it. Copy that does depend on the owner switch reads the switch, as the switch record requires.

## What this prevents

A claim that becomes false the day the owner panel opens, and the opposite failure: making the V2 claim on V1 pages.

## Revisit when

The V2 badge step revises the what-the-badges-claim record, or the badge gets a different meaning from the current item-by-item check.

---

*See also: [[decisions/product/what-the-badges-claim]] · [[decisions/product/badges-are-rules-over-recorded-evidence]] · [[decisions/product/owner-panel-ships-behind-one-switch]] · [[decisions/product/v1-copy-truth]]*
