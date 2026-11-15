# A drink without a printed price still counts

**Date:** 2026-11-15
**Status:** Decided — Paweł, 15.11: "allow the lines with no price at all times. We dont show prices in v1 anyway, so dont discriminate against it."
**Executed:** 2026-11-15 — `v0.1.10`: a line with no price qualifies its venue, "Bez ceny w karcie" is no longer a rejection reason, the price stays recorded as information only
**Area:** Venues | Catalogue

---

## Problem

Test 2 of the catalogue rule asked for "a named item in the venue's drinks offer, with a price", and the sourcing pipeline enforced it from 11.11: a menu line with no price printed could not qualify a venue. On the 15.11 home-server round, Taproom Wilanów had 25 non-alcoholic beers on its tap list, which prints no prices. That made the best venue of the round fail the check. The price requirement was filtering out exactly the venues UNI most wants.

## Options considered

Keep the rule and let a person override it per venue. Allow no-price lines only when they come from the venue's own drinks list (a menu section on its own page), and keep the rule elsewhere. Allow them at all times.

## Decision

A line with no price printed counts the same as a priced one, everywhere. UNI shows no prices ([[decisions/product/price-is-not-tracked]]), so a rule that depends on whether a price is printed judges a venue on something UNI does not use. What test 2 really asks is whether the venue decided to sell this drink, and a drink named on its own menu, board or tap list answers that with or without a figure next to it.

## Rules

Test 2 of [[decisions/product/what-belongs-in-the-catalogue]] reads "a named item in the venue's drinks offer" with no price condition, and a bottle seen in a fridge is still out. The pipeline still records whether a price was printed, as information for the person approving, and it never blocks, flags or ranks a line. A missing price is not a reason to reject a line.

## What this prevents

Beer bars and taprooms, whose lists come from Untappd or a chalkboard and rarely print prices, failing the check while restaurants with two bottles on a priced card pass. It also prevents a rule that quietly weights the catalogue toward one menu format, which test 2's own history (the second attempt tested menu layout) had already rejected.

## Revisit when

Prices are ever shown or tracked, if [[decisions/product/price-is-not-tracked]] is reopened. Or if lines with no price turn out to be mostly drinks that are mentioned but not sold, such as event menus or promotional text, in which case the answer is a better test of where a line was printed, not the price.

---

*See also: [[decisions/product/what-belongs-in-the-catalogue]] · [[decisions/product/price-is-not-tracked]] · [[decisions/product/kebab-rule]] · [[decisions/adr/ADR-012-automated-venue-sourcing]]*
