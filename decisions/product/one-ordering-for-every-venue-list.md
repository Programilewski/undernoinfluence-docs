---
description: "Every list of venues is ordered by one rule that rewards a generous offer and a confirmed one, combined; the formula is open."
---

# One ordering for every list of venues

**Date:** 2026-10-07
**Status:** Decided (direction); the formula is open
**Executed:** no
**Area:** Scoring | Venues

---

## Problem

Venues are listed on the discovery page, city, district and category pages, drink pages and brand pages, and each orders them by its own rule. Discovery and city pages order by breadth of offer, category pages by count in that category, and drink and brand pages by the most recent confirmation date alone. That last rule lets an owner who presses "Nadal w ofercie" once a day hold first place on every drink page they serve, with nothing on their menu having changed. Several rules also make "the best venue" mean different things on different pages.

## Options considered

Keep a rule per page. Order drink and brand pages by breadth like the rest. Order everything by confirmation date. One rule everywhere that combines how generous the offer is with whether its availability is confirmed.

## Decision

Everywhere venues are listed, one ordering pushes the best venues to the top. Founder, 07.10.2026: *"In discovery page, district ones and anywhere there are venues, we need one sorting, we try to push the best ones to the top. We want to reward venues that confirm the availability and the ones with the more generous offer, we'd have to combine it somehow."* How the two are combined is not decided yet.

## Rules

The same rule orders venues on every page that lists them; a page may narrow what "the offer" counts to its own subject (a category page counts that category, a drink page that drink, as category-aware-sort already does) but never swaps in a different rule. Confirmed availability is rewarded as a state, such as confirmed within the freshness window, not as recency: a click today must not outrank one from last week, so no daily action can buy position (ranking-is-never-for-sale). An owner's edit or click time is never itself a ranking signal. A generous offer is rewarded with diminishing returns, so near-duplicates and further variants of the same drink add less than a new kind of drink. Sorts a visitor chooses, such as nearest or by name, stay as they are; this governs the default order. Nothing paid enters the rule, ever.

## What this prevents

It prevents the daily-click lever on drink and brand pages, the one place today where an owner's effort alone buys first place. It prevents pages contradicting each other about which venue is best, and it prevents freshness or breadth alone from being gamed by doing more of one thing.

## Revisit when

When the formula is chosen, this record is amended with it in the same commit. It must be in place before `UNI_OWNER_ACCESS` is switched on, since only owners can pull the lever it closes. Revisit the weights after launch, once real venues show how breadth and confirmation are distributed.

---

*See also: [[decisions/product/category-aware-sort]] · [[decisions/product/ranking-is-never-for-sale]] · [[decisions/product/no-pay-to-rank]] · [[decisions/product/badges-are-rules-over-recorded-evidence]] · [[tech/badges-and-menu]] · [[product/rules/Classics and House Drinks]]*
