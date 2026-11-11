# A house drink's description is an internal note, never published

**Date:** 2026-11-11
**Status:** Decided
**Executed:** 2026-11-11 — `venues/show.blade.php` and `VenueSchema` no longer print it; the admin and owner forms call it "Notatka wewnętrzna"; `NoBrandNameIsPublishedTest::a_house_drinks_description_is_never_published`
**Area:** Venues | UI/UX | Catalogue

---

## Problem

A house drink (a venue's own mocktail) had a free-text description, printed under its name on the venue page and sent to Google as the `MenuItem` description. Real menus put alcohol brands in exactly that text: the 10.11 prototype runs found "Martini Vibrante lub Floreale & Kinley Tonic" on Pandan's card. Copied across, it names an alcoholic drink's brand on a public page, which [[decisions/product/no-brand-names-on-public-drink-labels]] forbids and KCPU's test (a brand's mark, not a customary name) catches. The brand guard covered catalogue products only, and [[decisions/product/venue-data-acquisition-flow]] already said written descriptions are not copied. The automated pipeline ([[decisions/adr/ADR-012-automated-venue-sourcing]]) and, later, owners typing their own would make it a constant risk.

## Options considered

Hide the description in V1 and keep it as an internal note. Keep it public as a brand-free ingredient list written by hand. Keep it public and refuse text containing a known brand from the `brands` table.

## Decision

**Hidden.** Paweł chose it on 11.11.2026. The field stays, as "Notatka wewnętrzna" in the admin and owner forms, because it has an internal job: the menu's description is how the admin decides whether a house drink is a version of a shared recipe ("the name decides the table, the description decides the link"). The public line is the drink's name, plus "Wariant klasyka" and the recipe's name when it is one.

## Rules

- No public surface prints `venue_drinks.description`: not the venue page, not its JSON-LD, not a recipe page, not a discovery tile. `NoBrandNameIsPublishedTest` puts a fixture brand into a description and checks all of them.
- The pipeline does not extract descriptions at all (its schema drops them, 10.11 briefing §6); a description in the database is typed by a person.
- The rejected options stay rejected for a reason worth keeping: hand-written discipline does not survive owners typing their own, and a check against `brands` misses every brand UNI never catalogued — alcoholic brands and mixers, which are exactly the ones menus name.

## What this prevents

Prevents a brand reaching a public page through the one free-text field a menu feeds, whoever types it and however careful they are.

## Revisit when

A house drink needs more than its name to be understood by a visitor — and then with text UNI writes, never text copied from a menu.

---

*See also: [[decisions/product/no-brand-names-on-public-drink-labels]] · [[decisions/product/venue-data-acquisition-flow]] · [[decisions/adr/ADR-012-automated-venue-sourcing]] · [[decisions/product/shared-recipes]]*
