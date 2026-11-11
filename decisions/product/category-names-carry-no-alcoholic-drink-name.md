# Category names carry no alcoholic drink's name

**Date:** 2026-10-27
**Status:** Decided
**Executed:** 2026-10-27 — "Szampan 0%" renamed "Musujące 0%" (slug and address unchanged); its description no longer says "prosecco i szampany"; the hidden spirits category no longer lists "giny, whisky"; glossary and terms follow
**Extended:** 2026-11-11 to shared recipes' names and descriptions — see "Extended to recipes" below; executed the same day (`App\Support\AlcoholicDrinkNames`, `App\Rules\NamesNoAlcoholicDrink` in the product form, `RecipeNamesCarryNoAlcoholicDrinkTest`)
**Area:** Categories | Brand | Catalogue

---

## Problem

A category is a public label on every page that lists it. "Szampan 0%" named a specific alcoholic drink and a protected name of origin, and its description added "prosecco". KCPU's 27.10 answer names exactly this as the problem: a product or service whose name resembles an alcoholic drink's designation. Brand stripping didn't touch it, because a category isn't a brand.

## Options considered

Keep the names, since they aren't trademarks. Ask KCPU. Rename to the generic word for the kind of drink.

## Decision

**A category name or description uses the generic word for a kind of drink, never the name of a specific alcoholic drink, a spirit or a protected origin.** "Musujące 0%" says what "Szampan 0%" said, without the name. Asking KCPU would have spent their time on a question whose answer was obvious.

## Rules

Allowed: piwo, wino, cydr, drinki, musujące, with "0%" or "bezalkoholowe". Not allowed in a category name or description: szampan, prosecco, cava, gin, whisky, rum, tequila, or any other name of a particular alcoholic drink or origin. A category's slug and address don't change when its name does. Whether the generic words themselves are fine is the open KCPU question about style words; if KCPU reads them as a symbol, this record reopens with the style list.

**KCPU's 10.11 answer (DP.44.237.2026) closes the open question.** It did not take the questions one by one; it restated the test: whether a name is a trademark or graphic mark of a specific alcoholic brand, or an ordinary, customary name. Generic style words are ordinary names, so the style list and the category names stand, and nothing here reopens.

## Extended to recipes, 11.11.2026

A shared recipe is the one product whose name and description UNI publishes (its drink page, the "Wariant klasyka" link, search), so it follows the same rule. Paweł decided it on 11.11.2026, choosing our stricter rule over KCPU's trademark-only test so that the two rules never disagree.

- **Allowed:** the customary cocktail name — mojito, piña colada, negroni, spritz, hugo, mule — with "bezalkoholowe".
- **Not allowed** in a recipe's name, its menu name (`alternate_name`) or its description: a spirit (gin, rum, wódka, whisky, tequila, wermut…), a protected origin (prosecco, szampan, cava) or an alcohol trademark (aperol, campari, martini…). "Gin 0%" is written "botaniczna baza 0%"; "bez rumu" is dropped, since everything on the site is alcohol-free.
- **One exception, decided by name:** "Espresso martini". It names the cocktail, not the vermouth brand, and it is what people and menus call it.
- **The cost, accepted:** "Gin z tonikiem bezalkoholowy" becomes "Botaniczny tonik bezalkoholowy", and its page gives up the search phrase people actually type. "G&T 0%" and "Gin & Tonic 0%" stay as menu spellings, which are internal, so menus still match.
- **Enforced in the form:** the admin product form refuses a recipe whose name, menu name or description contains a listed word, and names the word. The list lives in one class. A branded product's description is not checked, because it is never published.

## What this prevents

A label shown on every venue tile carrying the one kind of name KCPU singled out, and a protected origin name on a product that isn't from that origin.

## Revisit when

A new category is proposed, a recipe needs a word the list refuses, or KCPU's reading of customary names changes.

---

*See also: [[decisions/product/menu-lines-describe-style-not-brand]] · [[decisions/product/no-brand-names-on-public-drink-labels]] · [[decisions/product/catalogue-lists-every-category]]*
