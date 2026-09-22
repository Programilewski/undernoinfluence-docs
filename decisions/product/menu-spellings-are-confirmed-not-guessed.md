# Menu spellings are confirmed by a person, never guessed

**Date:** 2026-09-14
**Status:** Decided
**Executed:** 2026-09-14
**Area:** Data Model | Venues

---

## Problem

Cataloguing means 300–400 drinks copied from venue menus, and menus do not use catalogue names: "Heineken 0,0 but. 0,33", "Lech Free na kranie", "Crodino (butelka)". Attaching them one by one through the admin panel is the launch workload, and the same problem returns when owners manage their own menus. Resolving names automatically saves the work; resolving them wrongly publishes wrong facts — and the worst wrong fact this product can publish is a menu's alcoholic "Heineken" shown as Heineken 0.0.

## Options considered

Keep attaching by hand with product IDs. Import menus by product ID. Import menus by name with fuzzy matching that attaches the best match. Import by name, attach only on certainty, and let a person confirm every other spelling once, remembering the confirmation.

## Decision

**Menus are imported as written, and a row attaches only when it resolves with certainty: a spelling a person has already confirmed, or a unique exact product name.** Every other row fails with its closest candidates in the reason, so Filament's downloadable failed-rows file is the review list. Adding a spelling to a product ("Pisownie z kart") is the confirmation, and it is remembered in `product_aliases`. Site search reads the same spellings.

## Rules

A fuzzy match never attaches and never writes a spelling; only a person does. Normalising a name removes case, diacritics, punctuation, serving sizes and packaging words, and never removes a strength claim — "0,0", "0%", "zero", "free", "bezalkoholowe". A spelling may be confirmed for a product only if it repeats every strength claim the product's name makes, and a candidate that does not is never even suggested. Every row carries the menu's address and the date read ([[decisions/product/venue-data-acquisition-flow]]). Every attach goes through the shared follow-up ([[decisions/product/catalogue-links-change-through-one-path]]); a product already on the menu is re-confirmed, not attached twice. A row marked as a house drink creates or re-confirms a house drink instead of resolving a product. The spellings table records the kind of source, not the person.

## What this prevents

An alcoholic beer published as its 0.0 version because a matcher found the names close. A lookup table that teaches itself mistakes. And the slower failure: 400 hand attaches before launch, done again by every owner later.

## Revisit when

The owner panel opens — owners' unresolved rows become product proposals rather than failed rows — or confirmed spellings reach a size where matching in PHP is slow, at which point PostgreSQL's `pg_trgm` is worth installing.

---

*See also: [[decisions/product/abstraction-needs-a-second-user]] (the spellings serve the importer and site search) · [[decisions/product/catalogue-excludes-actual-alcohol]]*
