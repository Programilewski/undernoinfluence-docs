---
description: "Result: is the \"Nowe w karcie\" claim viable and worth keeping — what it promises, who can actually know a drink is new, where UNI's data makes it false, precedents, and the recommendation: keep it, but only an owner's own addition makes it."
---

# Is "Nowe w karcie" worth it?

Written 08.10.2026, at Paweł's request, after the two-day-load problem (choice b) showed the tag can call a years-old drink new. The feature exists since 19.09 (the new-in-the-menu-is-dated-by-the-offer-log record).

## What the tag claims

A "Nowe" tag on a drink, and a "Nowe w karcie" strip of the three newest, for anything added in the last 30 days, worded "Dopisane do karty w ciągu ostatnich 30 dni". It was built to give a returning visitor a reason to look again and an owner a visible reward for adding a drink. The same classification ("was this a real change?") feeds two owner-facing numbers: "what venues near you added" in the monthly report and the city's trending drinks.

## Who can actually know a drink is new

**Only the venue.** It knows the day it started serving something. UNI, reading menus, knows only the day it *noticed*: the 19.09 record already admits this with the "Dopisane" wording ("for a change we found on a later check, the date is when we saw it, not when the bar started serving it").

## Where UNI's data makes it false

| Case | What happens | How often in V1 |
|---|---|---|
| **A venue loaded over two days** | The second day's drinks are "new" for 30 days | Any multi-day load |
| **A drink the admin missed and adds later** | "New", though it was always there | Every correction |
| **A quarterly re-check** | Drinks that appeared any time in the last ~90 days are tagged "new" for 30 more days from the day we looked; one that appeared 85 days ago reads as new | Every re-check |
| **An owner adds a drink they just started serving** | True | V2 only (owners are behind the switch) |

With admin-only data, which is all of V1, **most "Nowe" tags would be noise or wrong**: the admin re-checks menus every few months and makes corrections, and neither produces a date the tag can honestly use. The hedge in the wording does not survive a visitor's reading: "Nowe" is the word they see.

## Precedents

Platforms that say "new" either let the business say it, or date their *own* knowledge and say so. Yelp's "Hot and New" marks businesses [first listed on Yelp within the last year](https://www.aol.com/2017-01-18-yelp-top-100-places-eat-2017-21657508.html), a claim about Yelp's listing, not about the restaurant. Google labels [newly opened places](https://folloagency.com/insights/news/google-places-label-new-businesses-gmb) from the opening date the business gives. No directory found claims "new on this venue's menu" from its own observation. Thin evidence, but consistent: **the "new" claim comes from the party that knows.**

## Is it worth the effort?

The feature is built; what costs effort is keeping it true. The options:

1. **Keep it as is, and fix the two-day load** (a first-public date). Still false on every correction and every re-check. Effort: small, and the falsehoods remain.
2. **Let only an owner's own addition make it** (`owner_reported`). In V1 the tag shows nothing, because there are no owners; from V2 it shows exactly what the owner said they added, which is the case the record itself names as making the dates exact. The two-day load and corrections stop mattering for the tag. Effort: one line (the venue page reads owner-reported additions only). Admin-observed changes keep being logged for internal trend data.
3. **Remove the tag.** Effort: small. Loses the owner reward that V2's paid reports are meant to sit beside.
4. **An admin switch, "Nowość w karcie?", on every add.** Moves the guess onto the admin, adds a field to every entry, and the admin rarely knows either.

## Recommendation: 2

**Keep "Nowe w karcie", but only an owner's own addition makes a drink "Nowe".** It is the only source that knows; it costs one line; it removes every false case above at once, including the two-day load (choice b becomes moot for the visitor). In V1 the strip and the tag simply never appear, which matches the 19.09 record's own exit: "cheap to remove" if it drives nothing, and "revisit when owners report their own additions".

**What stays to decide separately:** whether the owner-facing *trend* numbers (V2 reports) should count admin-observed changes at all. They have the same weakness, but they are aggregates over many venues and are not shown in V1; decide when the reports are built, with the first-public date as the likely fix for loads.

## Sources

- [AOL: Yelp's top 100 places to eat 2017 (Hot & New = first listed within the last year)](https://www.aol.com/2017-01-18-yelp-top-100-places-eat-2017-21657508.html)
- [Follo: Google labels new businesses](https://folloagency.com/insights/news/google-places-label-new-businesses-gmb)
- Code, read 08.10: `DiscoveryType::infer()` and `trendable()`, `VenuePresenter::newInMenu`, `VenueAnalyticsReportService`

*See also: [[decisions/product/new-in-the-menu-is-dated-by-the-offer-log]] · [[decisions/product/updated-means-vouched-for]] · [[decisions/product/nothing-false-is-published-to-a-visitor]] · [[research/results/one-click-refreshes-the-whole-venue]]*
