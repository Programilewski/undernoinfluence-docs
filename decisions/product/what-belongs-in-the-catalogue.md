# What belongs in the catalogue — three tests, all required

**Date:** 2026-09-16
**Status:** Decided — permanent scope rule
**Executed:** 2026-09-16 — written before the first real venue, which is the whole point
**Area:** Venues | Catalogue | Data Model

---

## Problem

`catalogue-excludes-actual-alcohol` settled **how alcoholic** a drink may be: nothing above 0,5%, ever, and 1–3% refused rather than deferred. It says nothing about **what kind of drink belongs here at all**, or **what kind of place**. That half was deferred on 04.09 to "the start of session 2 — before entering any products, because it decides what may be entered", and it stayed open.

Left unanswered it does not fail philosophically, it fails operationally: at venue four somebody enters a bottle of flavoured water, at venue nine decides those do not belong, and the first three venues are now wrong. Worse, it drifts one reasonable-looking row at a time — a kebab shop's soda, then a Żabka with 0,0% beer in the fridge, then a supermarket — until UNI is a stock checker for retail rather than a way to decide where to spend an evening. No rule about the *drink* can stop that, because the drink is identical in all three places.

Four attempts were needed. The first tested the drink's *purpose* ("an alternative to alcohol") and broke on purpose-built 0,0% beers like Lucky Saint, which are nobody's alternative to anything. The second tested the *menu's layout*, which made eligibility depend on how a bar happened to print its card. The third added the venue but still admitted every café through a house-drink clause loose enough to cover a signature latte. The fourth, here, is the founder's own formulation plus `kebab-rule` restored to what it actually says.

## Options considered

A rule about the drink alone — fails, because the same bottle sits in a bar and in a supermarket. A rule about the venue alone — fails, because it admits a restaurant's Coke. A `catalogue_status` enum instead of a written rule — solves a different problem (tracking which venues have been *assessed*) and can wait for the pace of real work. Three tests applied in order.

## Decision

**A row enters the catalogue only when all three tests pass.**

**1. The place.** A venue where drinks are consumed on the premises — a bar, café, restaurant, club, hotel, a kebab shop with tables. **Not** a shop, supermarket, petrol station, off-licence, or delivery-only kitchen. *Can you drink it there?*

**2. The offer.** The drink is a **named item in the venue's drinks offer, with a price** — on a menu, a board, or a standing list. **Not a bottle observed in a fridge.** *Did the venue decide to sell this?*

**3. The drink.** Either a **non-alcoholic member of a drinking category** — beer, wine, sparkling, cider, spirits, mixed drinks — **or a house drink in one of the four categories the schema already enforces**: `mocktail`, `koktajl_nolo`, `drink_spirytus_0`, `virgin_classic`. *Is this what somebody orders instead of alcohol?*

Test 2 is `kebab-rule` (22.04) restored. Its Polish reads *"«Widziałem coś w lodówce» to za mało"* and it names kebab shops, Żabkas and petrol stations as what the rule filters out — the opposite of how it was cited in two commute documents on 18.09 and 19.09.

## Rules

**The tests run in order and all three bind.** A qualifying place does not qualify a drink; a qualifying drink does not qualify a place.

**Test 3's house-drink route is closed, not open-ended.** It admits only the four `venue_drinks.base_category` values. This matters more than it looks: "a drink the venue makes and names itself" — the phrasing of the third attempt — would admit a café's signature latte, and therefore every café in Warsaw. A coffee is not what somebody orders instead of a beer, and the schema already knew that; the rule now says it.

**Retail is not a stricter case of this rule — it is a different product.** If a shop-facing catalogue ever happens it gets its own data, its own page and its own decision, never an exception inside this one. The mission test is why: nobody misses the fact that a supermarket sells Heineken 0.0, so listing it helps nobody find a healthier option they would otherwise have missed.

**No segment is banned; a menu is required.** A kebab shop with a printed drinks list including a 0,0% beer is **in**; the same shop with a fridge is **out**. This is `kebab-rule`'s own *"nie oznacza to, że kebaby nigdy"*, and it is what makes the data defensible — "I saw one once" cannot support a freshness date, a verified badge or a breadth score, because it changes with the next delivery.

**A terrace, a garden, or a *na wynos* counter alongside table service does not disqualify.** Test 1 asks whether the place is somewhere you can drink, not whether every individual sale is consumed there.

**Kombucha, craft soda, tonic and flavoured water are out**, at test 3, everywhere, however they are presented.

## What this prevents

Prevents the slow drift from a venue directory to a retail stock checker, which happens one defensible-looking row at a time and is expensive to reverse once venues are catalogued. Prevents eligibility depending on menu layout or on a cataloguer's mood at 11 pm. And prevents the specific hole that the café question exposed — a house-drink clause wide enough to admit a coffee shop on the strength of a named latte.

## Revisit when

Never on tests 1 and 2. Test 3's category list moves only if the catalogue's own category taxonomy moves — and if a house-drink category is added to `venue_drinks.base_category`, this record is amended in the same commit.

---

*See also: [[decisions/product/kebab-rule]] · [[decisions/product/catalogue-excludes-actual-alcohol]] · [[decisions/product/venue-type-filtering]] · [[decisions/product/mission-is-the-healthy-choice]]*
