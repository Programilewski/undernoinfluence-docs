# Only a shared recipe is named publicly

**Date:** 2026-10-27
**Status:** Decided
**Executed:** 2026-10-27 — `Product::isNamedPublicly()`; the venue page, tiles, structured data, sitemap, search and the homepage demo all read it; guarded by the no-brand-name test
**Area:** Brand | Data Model | Venues

---

## Problem

The brand decision says no product of any brand is named publicly, but the code needs one question to decide whether a given product's name may appear. The obvious question, "does this product have a brand?", has a hole: an approved owner proposal is brandless and can still carry a brand's name, typed by the owner as "Lech Free". So can any product saved before its brand was entered.

## Options considered

Hide the name when a brand is set. Keep a list of brand words and scrub names that contain them. Show the name only when the product is a shared recipe, the one kind of product UNI alone creates and names.

## Decision

**A product's own name is public only when it is a shared recipe.** Everything else shows as its style, or as its category when no style is recorded yet. The rule fails closed: missing data hides a name instead of publishing it. A word list would need the same never-ending upkeep the strip-all decision was made to avoid.

## Rules

Every public surface asks the one question and nothing else, including pages, tiles, structured data, the sitemap, search, social content and any page added later. Only a recipe has a drink page, and a recipe has no brand and no style. House drinks keep their names: they belong to the venue, not to a brand. The admin and owner panels show full names. A new public surface is added to the no-brand-name test in the same change.

## What this prevents

A brand reaching Google through a gap in the data rather than a gap in the code: a brandless proposal, an import row without its brand, a product entered in a hurry. It also prevents a rule that depends on someone remembering to fill a field.

## Revisit when

When the brand decision is revisited (the stay metric, or KCPU on brands with no alcoholic line). Any brand that comes back gets an explicit, dated flag; the default stays closed.

---

*See also: [[decisions/product/no-brand-names-on-public-drink-labels]] · [[decisions/product/menu-lines-describe-style-not-brand]] · [[decisions/product/shared-recipes]]*
