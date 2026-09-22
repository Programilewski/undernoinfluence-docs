# "Nowe w karcie" is dated by the offer log, for 30 days

**Date:** 2026-09-19
**Status:** Decided
**Executed:** 2026-09-19 — a "Nowe" tag on the item in the menu and a "Nowe w karcie" strip naming the three newest, on the venue page
**Area:** Venues | UI/UX

---

## Problem

A venue page gave a returning visitor no reason to look again, and gave an owner no visible reward for adding a drink. With the nearby list gone ([[decisions/product/venue-page-shows-only-its-venue]]), the page needed ways to explore that stay inside the venue. Marking what is new on the menu is one: it points at an option the visitor has not seen here before, and it is about this venue only.

The obvious date is wrong. `venue_products.created_at` is the day the row was written: the first time we catalogue a venue, its whole menu is dated to one afternoon and would read "new" for a month, and a drink detached and re-attached to correct a mistake starts again.

## Options considered

**The menu row's own timestamp.** Free, and false for exactly the case that happens first on every venue.

**The offer log, every addition.** Same problem: the first pass is logged too.

**The offer log, only additions whose date means something.** `venue_offer_logs.discovery_type` already separates the first pass (`initial_catalogue`) from a change we came back and found (`observed_change`) and one the owner reported (`owner_reported`). The owner analytics count trends on the last two for the same reason (`DiscoveryType::trendable()`).

## Decision

**An item is "Nowe" when it is on the menu now and has a `product_added` or `drink_added` log row of type `observed_change` or `owner_reported` from the last `uni.new_in_menu_days` — 30.** Catalogue products and the venue's own drinks both count. A drink removed and added back counts: it is back on the menu.

**30 days** because the owner reports use 30 for the same fact, so a visitor's "new" and an owner's "trending" agree; because it sits inside the 90-day freshness window, and an addition refreshes the offer date, so a "Nowe" tag can never stand on a menu marked stale; and because 14 would expire before a monthly visitor sees it while we still update menus by hand, and 60–90 would leave most of a quarterly re-check's additions "new" for most of the quarter.

**The wording is "Dopisane do karty w ciągu ostatnich 30 dni"** — written onto the card — not "appeared at the venue". For a change we found on a later check, the date is when we saw it, not when the bar started serving it. Once owners report their own additions the two coincide.

## Rules

The first cataloguing of a venue never produces a "Nowe" tag. The window is one number in `config/uni.php`, and the owner reports and this tag should not drift apart: if one changes, the other is looked at in the same change. Only items the menu shows can be new — a logged addition that has since been removed shows nothing.

## What this prevents

A newly listed venue announcing its entire menu as new, and a correction to the data reading as news.

## Revisit when

Owners report their own additions at scale — then the dates are exact and the "Dopisane" hedge can be weighed against plainer wording. Or when the tag is seen to drive nothing: it is cheap to remove.

---

*See also: [[decisions/product/venue-page-shows-only-its-venue]] · [[decisions/product/analytics-three-tiers]] · [[decisions/product/one-ingestion-path-for-menu-data]]*
