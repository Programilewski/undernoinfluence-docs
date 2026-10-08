---
description: "Classic drinks versus a venue's own creations: both researches summarised (07.10 external, 08.10 own) and how it was settled 08.10 as shared recipes."
owner: Paweł Milewski
updated: 2026-10-08
status: decided and built 08.10.2026 — shared recipes; see the shared-recipes record
---

# Classics and house drinks

> **Settled 08.10.2026: "classics" are now called shared recipes** (`products.is_recipe`; a house drink's link is `recipe_product_id`). A, products: yes. B, slug: the Polish form, `mojito-bezalkoholowe`, with the menu name ("Virgin Mojito") stored beside it and shown on the page. C, list: created as launch menus need them. D, the admin's rule: confirmed. Also decided: a recipe's page says "Bez alkoholu, do 0,5%"; a venue's version links back to its recipe; owners get a plain picker now, behind the owner switch, and the suggestion step waits for V2. "Standard" was considered and dropped because inside the products table it reads as "an ordinary product". The record is [[decisions/product/shared-recipes]]; what follows is the history that led there, in the old vocabulary.

**What UNI needs:** a person can find every venue that serves a virgin mojito tonight, *and* a venue can show the drinks it created itself. Today the first is impossible: a classic is recorded as a free-text house drink, so forty virgin mojitos are forty unrelated rows that only show on their own venue's page.

## The principle, set 07.10.2026

**What an owner gains depends on how a drink is recorded, and that is the message UNI sends to owners.**

| Recorded as | Shows on the venue's page | Listed on the classic's shared page |
|---|---|---|
| **A classic** | yes | **yes**: the venue appears among the venues serving it |
| **The venue's own creation** (a house drink) | yes, under the venue's own name | no |

An owner who records a mojito as their own creation keeps it looking like a signature drink and gives up the listing; an owner who records it as a classic gets the listing. How the panel explains that choice decides how honest owners choose by default, so the wording is part of the rule, not decoration.

## Open

1. **The threshold**: what makes a drink a classic, and where variants go ("mojito z rabarbarem", "Nojito"). Possibly both at once: an own creation "based on" a classic. Sent to research: `research/prompts/classics-versus-house-drinks.md`.
2. **The list of classics**: fixed, growing, or external; and who adds to it.
3. **Owners recording a plain classic as their own creation**, or the reverse, to get the effect they want. A separate thread, to be worked out once the model is chosen.
4. **What exists in the code today, and goes either way:** house drinks have a fourth type, `virgin_classic`, which is the free-text route this note replaces; and a June workaround marks catalogue products as house recipes when their brand's name contains the word "receptura". Products can already exist without a brand: the database allows it, and the drink page and the venue page already show a product without one. Only the products import and the admin form insist on a brand.

## What the research found, and what UNI should take from it (07.10)

The result is `research/results/classics-versus-house-drinks.md` (in Polish). It is good evidence for the shape of the answer and over-built for UNI's size; the assessment below separates the two.

### Take

1. **The model: a venue's drink keeps its own name and description, and may link to a classic as `exact` or `variant`.** A classic is a curated layer of meaning over menu items, not a competing kind of record. This dissolves the either/or the principle above assumed: "Garden Mojito" stays the venue's creation on its page **and** appears on Virgin Mojito's page under "venue variants". **This changes the incentive set on 07.10:** an owner no longer trades prestige for the listing, because a variant keeps both, which removes the main reason to game the choice.
2. **Only UNI creates classics.** Owners pick from the existing list, or ask for a missing one with one click; the request never creates a public page. That fits the founder-review rule for community contributions, and it closes the cheapest SEO spam.
3. **The threshold, applicable in seconds:** the menu name is a known spelling of a classic and the description doesn't contradict its core → `exact`; the menu names the classic but adds a dominant flavour, swaps the base or uses its own name → `variant`; otherwise the venue's own creation. A classic is a recognisable name with a stable core ("fingerprint": Virgin Mojito = lime, mint, sweetness, fizz, no rum), backed by two independent sources or three unrelated Polish venues. The venue count only nominates; UNI decides. Thirty worked examples are in the result.
4. **A starting list of 15**, with the spellings to match: Virgin Mojito, Virgin Piña Colada, Virgin Mary, Shirley Temple, Spritz 0%, Hugo 0%, Negroni 0%, Gin & Tonic 0%, Whiskey Sour 0%, Gin Basil Smash 0%, Espresso Martini 0%, Pornstar Martini 0%, Mimosa 0%, Bellini 0%, Paloma 0% (the last two provisional). Brand names on menus ("Aperol Spritz 0") map to the generic classic (Spritz 0%), so UNI never confirms a brand that may not be in the glass.
5. **Owner wording: not "Klasyk / Autorski" as two equal options**, which reads as a choice of identity. Instead, after the owner types a name, one suggestion: *"To wygląda jak: Virgin Mojito — Tak / Nie, to inny drink"*, then "classic version / own variant" only after a yes. No new required field, which fits the rule that owners are not asked for more.
6. **For ranking** (relevant to the one-ordering decision of 07.10): the classic/variant link must not change a venue's score by itself; obvious duplicates don't count twice; further variants of the same classic count for less; and **an owner's edit or click time is never a ranking signal**. A separate "seen on the menu" date is.

### Leave, or not yet

- **One table replacing both products and house drinks** (`venue_menu_items`, with venue–product links migrated into it). Packaged products already have a canonical record, the product, and their menu line adds little. The result's own concern, losing the raw menu text, applies only to mixed drinks, and house drinks already keep it. For UNI the same model is reached by **extending house drinks**: a `canonical_drinks` table with its aliases, and two nullable columns on `venue_drinks`, the classic and the relation. That's a small migration, and it's the "safe start" the result itself describes.
- **Decision logs, a monthly candidate queue, confidence scores, risk queues, eleven metrics.** These are for hundreds of self-service owners, not 30 admin-entered venues. Revisit at V2, when owners edit.
- **The ABV question it raises** (0.0% literal or the 0.5% legal line) is already settled by catalogue-excludes-actual-alcohol: nothing above 0.5%, ever.
- **Search demand:** no city-level data was found. Keyword Planner before launch, Search Console after, is the cheapest test. Optional.

## The second research, 08.10: my own, and what it changes

Paweł asked for an independent pass on 08.10. The full result is `research/results/classics-versus-house-drinks-own-research.md` (English). It read what the first result could not: real Warsaw menus, Polish search behaviour, and the codebase. **Read both results before deciding; this section is the summary that the next session opens with.**

### What it found

1. **Half of what mocktail menus serve is a classic.** Nine Warsaw venues' own menus, read 08.10: of 31 mixed non-alcoholic lines, 17 are a classic as written (55%), 2 a variant (6%), 12 the venue's own creation (39%). **Mojito is on 4 of the 7 venues** that have mixed drinks; Spritz, Hugo and Piña Colada on two each; everything else on one. Two of the nine venues have no mixed drinks at all. Small, non-random sample: shape, not proportions.
2. **The list of 15 misses what menus carry:** Clover Club 0% and Garibaldi 0% were on menus, and Mule 0% is the parent of a "Winter Mule". Bellini 0% was on a menu; Paloma 0% was not. Hard case seen: "Torcello", an own name over a plain Negroni 0%. "Kombucha Spritz" appears at two unrelated venues: an own creation starting to repeat.
3. **Polish searches for a drink name are about recipes and shops** ("mojito bezalkoholowe przepis / lidl / w puszce"); **searches for a place are by category and city** ("drinki bezalkoholowe warszawa", "bar bezalkoholowy kraków"). No drink name came back with a city (Google autocomplete, Polish locale, about thirty probes; it shows popularity, not volume). So a classic's page answers people already on UNI and the long tail; it is not the main door from Google.
4. **The Polish form is "{name} bezalkoholowe/-y/-a"** for every classic tested; "virgin" is second. "Nojito" is not used in Poland: Google rewrites it to "mojito".
5. **Classic names collide with shop products**: canned "mojito bezalkoholowe", "Hugo bezalkoholowe" at Lidl, the soda "Kinley Virgin Mojito" on a menu. The resolver already attaches only confirmed spellings, so nothing new is needed.
6. **Menus name 0% spirits inside drinks and disagree on "0%"**: Martini Vibrante is "LOW ALC" on Hard Rock's list and inside Panorama's "Negroni 0.0%". So a classic's page never says "0.0%" and carries no ABV badge.
7. **The app has stored classics as products since June, under a workaround**: the demo data has "Virgin mojito" and "Aperol Spritz 0%" as products in `drinki` under a fake brand "Własna receptura", and `Brand::isHouseRecipe()` (a name check for "receptura") branches three views. Brandless products, `product_aliases` (read by the import and the site search), `/napoj/{slug}` and its sitemap entry all exist already.
8. **Thin classic pages are a Google spam risk** (doorway abuse, scaled content abuse). The district rule fits: fewer than 3 live venues → served, kept out of the index and the sitemap.
9. **The drink page orders venues by `confirmed_at`**: fine while only the admin enters menus, a click-to-rank signal once owners confirm. Belongs to the one-ordering formula (After launch), not to this item.

### What it recommends: a classic is a product

**A classic is a brandless product in `drinki`, marked `is_classic`, created only by UNI, with its page at `/napoj/{slug}`.** A menu line that *is* the classic (a known spelling, nothing added) is a `venue_products` row, matched like any catalogue drink. A venue's own creation stays a house drink under its own name, and may point at the classic it is built on through one nullable column on `venue_drinks`; it then shows on the classic's page under "wersje lokali". Exact versus variant is no longer an enum: it is which table the line is in.

**The rule an admin applies while reading a menu: the name decides the table, the description decides the link.** A known spelling of a classic → the classic. Anything else → a house drink, linked as a variant when it is built on a classic's core.

**Compared with the 07.10 assessment** (a new `canonical_drinks` table, an aliases table, two columns on `venue_drinks`): the page, aliases, import matching, site search, sitemap and category listing already exist for products, so the product route needs two columns and a classic branch on the drink page instead of a parallel stack. It also retires the "receptura" workaround with `virgin_classic`, and settles the URL by consequence. **What it gives up:** a plain classic line loses the venue's own description; when the description adds something real, the line is a variant anyway. **To check while building:** `abv_status = unknown` reads as doubt, so a classic needs its own wording ("bez alkoholu, do 0,5%"), not that status.

**Kept from the first result:** only UNI creates classics; a variant keeps the venue's name; one classic per drink; brand names on menus map to the generic classic; the owner sees a suggestion, not a choice of identity (V2); the link never changes a venue's rank by itself.

### The original five decisions, as they stand after both researches

1. **Adopt the model** → yes in both; the open part is *how*: decision A below.
2. **The starting list** → decision C below.
3. **The URL** → answered by decision A: `/napoj/` if classics are products; the open part is the slug, decision B.
4. **Retire `virgin_classic`** → yes in both. Production starts empty: one migration.
5. **Build before the load** → yes in both. With classics as products, exact lines need nothing new in the menu import (spellings met on launch menus go through the existing "Dodaj pisownię"); house-drink rows gain one optional column naming the classic.

### Still to decide

- **A. Classics as products (08.10) or a separate classics table (07.10)?** Recommended: products.
- **B. The slug:** `mojito-bezalkoholowe` (what Poles type) or `virgin-mojito` (what menus print)? Recommended: the Polish form, with both names in the page title: "Mojito bezalkoholowe (Virgin Mojito)". A public URL: decide before the first classic exists.
- **C. The list:** created as the launch menus need them, from 19 candidates (the 15 plus Clover Club, Garibaldi, Mule, Sex on the Beach, each in the "bezalkoholowe" form), or the fixed 15 up front? Recommended: as needed; expect 8 to 12.
- **D. Confirm the admin's rule:** the name decides the table, the description decides the link.

**Comes with it, no separate decision unless Paweł objects:** classic pages below 3 live venues are noindex and out of the sitemap; never "0.0%" and no ABV badge on a classic; the classic page lists "as written" and "wersje lokali" separately; the "receptura" workaround is removed in the same change.

**Then, in order (Launch item 1 continues):** build the classics change → the brand check in the products import → fault 9 (dates from the menu, not today).

**Why this sits in Launch:** the launch files record classics one way or the other. Deciding before the load means entering them once.

*See also: [[research/results/classics-versus-house-drinks-own-research]] (the 08.10 research) · [[research/results/classics-versus-house-drinks]] (the 07.10 research) · [[decisions/product/what-belongs-in-the-catalogue]] (test 3: the four house-drink types) · [[tech/badges-and-menu]] · [[product/rules/Custom Drinks Rules]]*
