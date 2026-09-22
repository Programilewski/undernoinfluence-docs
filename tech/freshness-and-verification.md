---
version: 1.0
owner: Paweł Milewski
updated: 2026-08-31
status: living — reference
---

# Freshness and verification, exactly as implemented

Two badges on a venue card look similar and mean different things. This is the reference
for what each one is, which column drives it, where it appears, and what it promises. Every
claim here was read out of running code on 31.08; file and line are named so it can be
challenged rather than trusted.

> **Why this file exists.** The original freshness design was more elaborate and was
> narrowed. What survived is simple, but it is spread across a model, a config file, two
> views and a filter, so it is easy to misremember. It is also the thing the paid owner
> product is built on, so a wrong memory here becomes a wrong sentence in a sales
> conversation.

---

## The two signals, side by side

| | **Freshness** | **Verification** |
|---|---|---|
| Question it answers | *Was this menu data touched recently?* | *Did a human confirm this card against the venue?* |
| Public label | "Zaktualizowano 12 dni temu" | "Sprawdzona karta" |
| Column(s) | `offer_updated_at` | `is_verified` **and** `last_menu_check_at` |
| Window | 90 days (`uni.freshness_days`) | 180 days (`uni.verification_valid_days`) |
| Set by | any product or drink change | an admin, explicitly |
| URL filter | `aktualnosc` | `sprawdzone` |
| Who can cause it | anyone with edit rights, as a side effect | an admin, as a deliberate act |

The distinction that matters: **freshness is a by-product, verification is an assertion.**
Editing a venue makes it fresh whether or not anyone checked anything. Only an admin
pressing "mark checked" makes it verified.

---

## Freshness in detail

**The column.** `venues.offer_updated_at`. Written by `Venue::markOfferFresh()`
(`app/Models/Venue.php:332`), which is called from `VenueProductObserver`,
`VenueDrinkObserver`, `ApproveProductProposalAction`, two Filament relation managers, and
the repair cron.

**The rule.** Binary, not graded — `Venue::computeFreshnessState()` returns `fresh` within
90 days, `stale` beyond it, and `unknown` when the timestamp is null. This is decision
D-14; an earlier design had more states and was narrowed to two because a three-state badge
could not be explained in the space a badge occupies.

**The label.** `Venue::getFreshnessLabelAttribute()` renders one of three forms: *"Zaktualizowano
dziś"* at ≤1 day, *"Zaktualizowano N dni temu"* inside the window, *"Zaktualizowano N mies.
temu"* beyond it. It returns `null` — hiding the badge entirely — when `breadth_score` is 0,
so a venue with nothing listed never advertises how recently its nothing was updated.

**Where it appears.** The venue tile (`components/venue-tile.blade.php:19-20`), the venue
page (`venues/show.blade.php:51-52`), and the demo menu. Filterable on `/mapa` via
`aktualnosc`, with 7/30/90/180-day segments.

**What it does not mean.** It does not mean the data is correct, and it does not mean anyone
looked at the venue. A typo fix on a description marks a venue fresh.

---

## Verification in detail

**The columns.** Two, and both are required. `venues.is_verified` is a boolean an admin
sets; `venues.last_menu_check_at` is when the check happened, set by the "mark checked"
action in the admin venues table (`VenuesTable.php:118`, with a bulk variant at `:126`).

**The rule.** `Venue::getHasVerifiedMenuAttribute()` (`Venue.php:302`) requires
`is_verified` **and** `last_menu_check_at` inside 180 days. The pairing is deliberate and
documented in `config/uni.php`: `is_verified` never expires on its own, so alone it would
eventually promise a check nobody redid — the badge would decay into meaning "an admin
ticked a box once".

**Why 180 days.** Set to what one person can realistically re-check across the launch venue
count. It is a capacity number, not a quality number, and it should shorten as the re-check
process gets cheaper.

**Where it appears.** The venue tile, the list row, the venue page, the owner status widget,
and the city page's verified count (`CityController.php:20`). Filterable via `sprawdzone`;
also a query scope, `Venue::verifiedMenu()`.

---

## The three columns that look like these and are not

**`venues.verified_at` — dead.** Written in exactly two places, both erasure-related
(`EditVenue.php:78`, `EraseVenueAction.php:39`), and read by nothing outside the admin form
that displays it. It has no stated meaning. It is a candidate for deletion unless it is
given the job below.

**`venues.freshness_streak_started_at` — computed, maintained, never shown.** Set by
`markOfferFresh()`, cleared by the repair cron when a streak stops being true, and exposed
as `Venue::freshness_streak_months`. **Nothing in the application displays it.** The only
reader is `tests/Feature/Venues/FreshnessStreakTest.php`.

This is the interesting one. A streak says something neither badge does: not *"someone
touched this recently"* and not *"someone checked this once"*, but ***"this venue has been
kept current for four months"***. That is the freshness incentive made visible, and it is
already computed. **Open decision:** display it, or delete it and `verified_at` together.

**`venues.is_verified` on its own** — never use it as a badge condition. It is half of a
pair and means nothing alone. `has_verified_menu` is the only correct read.

---

## The repair job

`uni:check-offer-freshness` (`app/Console/Commands/CheckOfferFreshness.php`), scheduled
daily. It produces nothing; it only repairs. Three passes: fix `offer_updated_at` where a
product or drink was changed more recently than the venue timestamp says, clear freshness
streaks that are no longer true, and recalculate `breadth_score` where the stored value
disagrees with a fresh calculation.

**Why drift happens at all.** `venue_products` is a pivot table and Eloquent fires no model
events on it, so both columns are kept correct by call sites remembering to call the
observer — see the comment at the top of `VenueProductObserver`. Any write that does not go
through a Filament relation manager silently skips it.

**The operational rule:** run it by hand immediately after any bulk import or direct
database write. That is the failure mode it actually exists for, and a nightly schedule
means a day of wrong badges in between.

---

## Deciding what to keep

The public surface needs three columns: `offer_updated_at`, `is_verified`,
`last_menu_check_at`. Everything else is a choice:

- Want a **consistency** signal on the public page? Keep `freshness_streak_started_at` and
  display it. Then drop `verified_at`.
- Want a **"verified since"** date? That is what `verified_at` could become — but it
  overlaps with the streak story and is the weaker of the two, because it says something
  about us rather than about the venue.
- Want neither? Drop both columns and the streak-clearing pass of the cron with them.

---

*See also: [[decisions/product/abv-trust-model]], [[decisions/product/venue-activation-gate]],
[[decisions/product/admin-recorded-claims-v1]], [[tech/analytics]]*
