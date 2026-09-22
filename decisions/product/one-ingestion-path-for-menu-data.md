# Menu data enters through one resolver, whatever the source is

**Date:** 2026-09-16
**Status:** Decided
**Executed:** partly — the rule holds for every path that exists today; `pos_sync` is reserved and unwritten
**Area:** Data Model | Venues | Catalogue

---

## Problem

Something has to decide which catalogue product a line of text means. A menu says `Heineken 0,0 but. 0,33`; the database holds a product called `Heineken 0.0`. The menu importer answers that with a deliberate procedure — **the resolver** — and the important thing about it is what it refuses to do:

- it attaches only when the text matches a spelling a person has already confirmed, or matches exactly one product name and only one;
- everything else fails, with the closest candidates named in the reason, and comes back as a review list;
- `0,0`, `0%`, `zero`, `free` and `bezalkoholowe` are never ignored, so a plain "Heineken" can never become Heineken 0.0;
- every attach runs through the same follow-up as the manual button — offer log, freshness, breadth score, activation gate.

**It never guesses.** That is not a performance characteristic, it is the product promise: a visitor can order what the page lists.

The risk is not that the resolver is wrong. It is that a later, separate route into the same tables gets written by somebody who finds it inconvenient. The concrete scenario: a future session builds the POS sync — a venue's till system posting its non-alcoholic range nightly instead of us reading a menu — needs to turn `HEIN 0.0 BUT` into a product, finds the resolver refuses too much to be practical at volume, and writes a quicker one with fuzzy matching. Six months later the catalogue holds guesses nobody made deliberately, indistinguishable from confirmed facts. That is the same failure `catalogue-links-change-through-one-path` was written about, arriving from outside the application instead of inside it.

## Options considered

Leave it until the sync is actually built. Write the rule now. Build an abstraction for future sources now — rejected outright, since `abstraction-needs-a-second-user` argues against designing for a caller that does not exist.

## Decision

**A new source of menu data is a new caller of the existing resolver, never a new resolver.** CSV upload, POS sync, a scraped feed, a partner API — each may differ in how bytes arrive, how often, and how failures are reported back. None may differ in how a line of text becomes a product link.

If the resolver is too strict for a new source, the answer is to change the resolver — once, for everybody, with tests — and never to route around it.

## Rules

Every ingestion path calls `RecordMenuItemAction` and goes through `VenueProductObserver`, so no import can produce products with no offer log, no breadth score and no activation.

Every path records **how the fact arrived**: `venue_products.added_by` and `venue_offer_logs.discovery_type`. `pos_sync` is reserved in both, unused, and documented as reserved — added on 16.09 while production was still empty, because after the first deploy the same change costs a migration, a deploy and a rollback plan.

**A machine's assertion is not a dated human check.** A synced fact may not inherit `is_verified` or the "Sprawdzona karta" badge by default. What a synced fact is allowed to claim is decided before the first sync runs, not after, and it belongs in `what-the-badges-claim.md` — the badge means *a person checked this menu within six months*, and a nightly machine post is a different claim that needs its own answer.

Confirmed spellings (`product_aliases`) are shared across every path. They are filled by the manual cataloguing happening anyway, which is why the integration's memory costs nothing to build.

## What this prevents

Prevents the catalogue quietly filling with machine guesses that look exactly like confirmed facts, and prevents the freshness badge — the one thing on a venue page that carries a date and a promise — from silently coming to mean two different things depending on which pipe wrote the row.

## Revisit when

A venue actually asks for a sync, or ten venues are catalogued and three share a POS. The protocol, authentication and scheduling are all genuinely V2+ and nothing about them is decided here.

---

*See also: [[decisions/product/catalogue-links-change-through-one-path]] · [[decisions/product/menu-spellings-are-confirmed-not-guessed]] · [[decisions/product/abstraction-needs-a-second-user]] · [[decisions/product/what-the-badges-claim]]*
