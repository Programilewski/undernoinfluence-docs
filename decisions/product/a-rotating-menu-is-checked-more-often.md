---
description: "A venue whose card rotates (Taproom's tap list, 26.11) gets its own refresh interval, venues.menu_check_days, 7 to 90 days, empty meaning 28; the refresh runs daily and counts calendar days so a 7-day venue is checked every 7 days."
---

# A rotating menu is checked more often

**Date:** 2026-11-26
**Status:** Decided
**Executed:** 2026-11-26, `v0.1.22`
**Area:** Sourcing

---

## Problem

Taproom's tap list changes weekly, and the refresh checked every menu only after 28 days. On 26.11 the page was fetched again and compared with the copy read on 20.11: of 186 entries, 30 were new and 24 gone in six days. Its alcohol-free list went from 25 entries to 32, with seven new beers, one stout replaced by its nitro version, and nothing else removed. On a 28-day check UNI would show about 23 of 30-odd alcohol-free beers, and keep a replaced one listed for up to four weeks.

## Options considered

Keep 28 days for everyone, accepting that a rotating list is mostly under-listed. Shorten the interval for every venue, which multiplies reading cost and approval work for menus that change seasonally. Give each venue its own interval.

## Decision

**Each venue can have its own interval, set on the venue in the admin panel; empty means 28 days.** Paweł chose this on 26.11, with Taproom set to 7. The interval is 7 days at the shortest, so a site is never asked for its menu more than weekly, and 90 at the longest.

## Rules

The refresh job runs daily, not weekly, and a menu is due when its venue's interval has passed since it was last checked, counted in calendar days. Under a weekly run, a check made a few seconds after the run's start would miss the next week's run and drift to 14 days. The interval applies to menus read from the venue's own site. A changed menu is read again and its lines wait for approval as before: lines already on the offer match with certainty and clear with *Zatwierdź pewne*, and what left the card is offered for removal, never removed by itself. The daily batch of 50 bounds a day's reading cost.

## What this prevents

A taplist venue listed in UNI with a quarter of its alcohol-free beers missing, or with a beer that left the tap weeks ago, when the visitor needs to know what they can order tonight.

## Revisit when

A weekly check of a rotating venue costs more approval time than its lines are worth (more than about five minutes a week), or a venue's site asks UNIbot to fetch less often.

---

*See also: [[decisions/product/a-producer-printed-beside-a-line-is-its-brand]] · [[decisions/product/a-strength-printed-beside-a-line-vouches-for-it]]*
