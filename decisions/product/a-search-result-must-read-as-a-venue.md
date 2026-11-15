# A search result becomes a candidate only when its site reads as a venue

**Date:** 2026-11-13
**Status:** Decided — Paweł, 13.11: "proceed as you recommend"
**Executed:** 2026-11-13 — the venue check after the address check; "Nie lokal" counted per run and per query; seven guides and platforms blocked
**Area:** Venues

---

## Problem

The first real Brave batch made seven candidates and four were not venues: a trade journal, a brewers' association, a think tank and a Ukrainian site. The check asked only whether the homepage carries a Warsaw address, and every Warsaw institution has one. Each false candidate costs a person a look, and a search that only finds institutions looks productive in the counts.

## Options considered

A blacklist of institution words (fundacja, instytut, związek…). A list of blocked domains only. Positive signs that a guest comes to the place. Asking a model to classify each site.

## Decision

The homepage, or its contact page, must also show a place a guest comes to: opening hours, a reservation, or a schema.org restaurant, bar, café or hotel type, alongside a word about food or drink. A page declaring a language other than Polish or English fails. Guides and platforms that still pass are blocked by domain as they appear. **An online shop fails too** (amended 15.11.2026, Paweł: "proceed as you recommended"): a "dodaj do koszyka" or "add to cart" button, "regulamin sklepu", a Shopify storefront, or a schema.org shop type. The 15.11 round made five shops candidates, because each had opening hours, a Warsaw address and a wine word. A restaurant, bar, café or hotel type still outranks a shop sign, and the word "koszyk" alone does not count, because restaurants with online ordering use it.

## Rules

A dropped domain is counted as "Nie lokal" in its run and against the query that brought it, never stored as a candidate. The check never decides alone that a site is a venue: every candidate still waits for a person. A domain is blocked only after checking what it is (wieszcozjesz.pl looked like a guide and is a restaurant).

## What this prevents

Candidate lists dominated by institutions, and query statistics that reward searches finding reports about alcohol-free beer rather than places serving it. Tested on the batch and on 45 domains from venue searches: the four non-venues, a magazine and a city portal dropped, no venue lost. The shop rule was checked on the 15.11 round's 17 real homepages: the five shops and a whisky shop with a Gdańsk bar dropped, and all eleven venues still passed.

## Revisit when

The "Nie lokal" count jumps for a template that used to find venues (a real venue may be failing the check), or guides keep passing faster than they can be blocked.

---

*See also: [[decisions/adr/ADR-012-automated-venue-sourcing]] · [[decisions/product/search-queries-are-templates-measured-by-yield]]*
