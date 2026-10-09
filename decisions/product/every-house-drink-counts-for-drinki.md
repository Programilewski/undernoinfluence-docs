# A venue serves drinks if it has a Drinki product or any house drink

**Date:** 2026-10-09
**Status:** Decided
**Executed:** 2026-10-09
**Area:** Categories | Venues

---

## Problem

"Does this venue serve Drinki?" had three answers. The map's filter counted only house drinks, so a venue whose only drink was a shared recipe — a catalogue product in Drinki since 08.10 — vanished under its own category. The landing pages and the counts behind the sitemap counted only catalogue products, so a venue with only its own mocktails was on no Drinki page. The tile of both showed a Drinki row. On local data: 23 venues missing from the filter, 7 from the landing pages.

## Options considered

Keep each place's own definition. Count only catalogue products. Count only house drinks. One rule: a catalogue product in the category, or — for Drinki — any house drink.

## Decision

One rule everywhere: a venue serves a category when it carries a catalogue product of it, and every house drink counts for Drinki, because all three house-drink types (mocktail, NoLo cocktail, 0% spirit drink) are mixed drinks. The filter, the landing pages, the counts that decide the sitemap and indexing, and the ranking all ask the same question.

## Rules

A house drink counts for Drinki and for no other category. On landing pages a house drink is held to the same freshness window as a product, by the date it was last checked. Any new place that asks "does this venue serve X" uses the shared rule rather than its own query.

## What this prevents

The most common search on the map — drinks — hiding venues that serve one; classic-only venues becoming unfindable the day classics became catalogue products; and Google being told a Drinki page is thinner than it is.

## Revisit when

A house-drink type is added that is not a mixed drink, or house drinks gain categories of their own.

---

*See also: [[decisions/product/shared-recipes]], [[decisions/product/what-belongs-in-the-catalogue]], [[decisions/product/empty-landing-pages-noindex]]*
