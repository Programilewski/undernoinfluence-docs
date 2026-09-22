# Show only what's present, never grey out what's absent

**Date:** 2026-04-22
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** UI/UX | Brand

---

## Problem

A venue profile needs to show category coverage. The obvious approach — show all 6 categories, grey out the ones with no products — tells users exactly what a venue is missing. This creates a visual penalty for partial coverage and discourages venue owners who carry only 1–2 categories from feeling proud of their listing.

## Options considered

**Show all categories, grey out absent ones** — maximum information density. User immediately sees gaps. Standard approach in most directory apps.

**Show only present categories** — cleaner profile, no "missing" visual signal. Absence is neutral, not a failure. Consistent with the "show what's there, not what isn't" design principle.

**Show all categories with a count of 0 for absent** — hybrid. Still visually penalises absence.

## Decision

Only present categories are rendered. If a venue carries beer and mocktails, only two breadth bars appear. There are no greyed bars, no empty rows, no "0 products" counts. Absence is invisible to the user.

## Rules

Breadth bars are rendered only for categories where the venue has at least 1 product. No empty state UI for absent categories on venue profiles. The same rule applies to map pins — categories with 0 matching products are excluded from the count shown on the pin. No "this venue doesn't carry X" language anywhere in the B2C UI.

## What this prevents

Prevents the discouraged-owner problem: a craft beer bar with 10 NoLo beers shouldn't feel like a failure because they have no mocktail section. Prevents user confusion from comparing absence across venues — one venue's missing mocktail bar versus another's says nothing about quality. Keeps profiles visually clean and scannable regardless of how many categories a venue covers.

## Revisit when

Post-V1, if user research shows people want to know what categories a venue *doesn't* carry before visiting. At that point, consider an optional "filter: this venue doesn't carry wine" exclusion filter — but still not greyed-out UI on the profile itself.

---

*See also: venue-type-filtering.md*
