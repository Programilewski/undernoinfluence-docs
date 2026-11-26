---
description: "When a drink's name carries no brand but the menu prints its producer beside it, as tap lists do ('Lager Bezalkoholowe · Browar Zamkowy Cieszyn'), the menu reader takes the producer as the brand and keeps the line; the brand-not-the-brewery rule still holds when the name has a brand."
---

# A producer printed beside a line is its brand

**Date:** 2026-11-26
**Status:** Decided
**Executed:** 2026-11-26
**Area:** Sourcing

---

## Problem

Taproom's tap list prints each beer as name, producer and strength: "Lager Bezalkoholowe · Arcyksiążęcy Browar Zamkowy Cieszyn · 0,0%", "Bezalkoholowe IPA · Browar Amber · 0,5%". When the page was read on 20.11, both runs dropped these two as lines without a brand, and said so in their notes. Unbranded lines don't count (decision 1), so they never reached the queue. They were the only two of the page's 25 alcohol-free entries the reading missed. The prompt told the model never to give the brewery as the brand, which is right for "Bavaria 0.0% · Royal Swinkels" and wrong when the brewery is the only brand there is.

## Options considered

Leave it, and let the person add such beers by hand. Drop the brand-not-the-brewery rule entirely, which would bring back "Royal Swinkels" and "Grupo Modelo" as brands. Keep the rule, but take the producer as the brand only when the name itself carries none.

## Decision

**When the name carries no brand and the menu prints the producer beside the drink, the producer is the brand, as a guest would say it ("Amber"), and the line is a branded product.** Paweł chose this on 26.11. A name that has a brand keeps it: Bavaria stays Bavaria, never Royal Swinkels.

## Rules

This is a change to the menu-reading prompt only. A line still counts only with a brand (decision 1); a producer printed beside it now gives it one. The brand is a guess like any other: the line goes through matching and approval, and an unknown brand lands in the brand queue as before.

## What this prevents

Real, branded alcohol-free beers silently missing from every menu printed as a table with a producer column, which is how Untappd-style tap lists are printed.

## Revisit when

A reading starts taking a group, an importer or a distributor printed beside a line for its brand, or a menu prints the producer beside a drink whose name already carries a different brand.

---

*See also: [[decisions/product/a-rotating-menu-is-checked-more-often]] · [[decisions/product/a-strength-printed-beside-a-line-vouches-for-it]]*
