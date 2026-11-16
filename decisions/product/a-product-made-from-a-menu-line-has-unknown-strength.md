# A product created from a menu line starts with its strength unknown

**Date:** 2026-11-16
**Status:** Decided — part of the approval speed-ups Paweł asked for on 16.11
**Executed:** 2026-11-16 — `v0.1.12`, "Utwórz produkt" on a menu line
**Area:** Catalogue | Data Model

---

## Problem

In the home server's batch, 43 of 98 lines named a brand the catalogue doesn't have. Adding one meant leaving the menu page, so "Utwórz produkt" now creates the brand and product from the line in one form. The menu usually prints a strength, such as "0,0%", and it is tempting to save that as the product's verified strength.

## Options considered

Save the menu's printed strength as verified. Save it as unverified. Leave the strength unknown and check it at the product's own source later.

## Decision

The product is created with its strength unknown. Under the ABV trust model, a strength counts as verified only when it comes from the producer or the label; a venue's menu is not that source.

## Rules

The brand is matched ignoring capitals, or created. The printed spelling is kept as an alias, as "Popraw" does. If the product name claims a strength the menu doesn't print, the form refuses it. When the menu has a venue, the line is approved as the new product. The strength is checked later in the products list, from the producer or the label.

## What this prevents

It stops a misprint or a venue's shorthand ("0%" on a 0.5% beer) from becoming a verified "0.0" that strict-zero users rely on.

## Revisit when

The catalogue's strength checks fall far behind the lines being approved. Then a strength-checking queue, or the producer's own data, earns its place.

---

See also: [[decisions/product/abv-trust-model]] · [[decisions/product/one-ingestion-path-for-menu-data]]
