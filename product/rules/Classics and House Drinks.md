---
description: "Classic drinks versus a venue's own creations: what each gives an owner, and what is still open. Not yet decided."
owner: Paweł Milewski
updated: 2026-10-07
status: open — research in and assessed 07.10; five decisions left
---

# Classics and house drinks

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

### Still to decide

1. **Adopt the model** (house drinks gain an optional classic link, `exact` or `variant`; UNI curates the list)? Recommended yes.
2. **The starting list:** the 15 above, cut or extended.
3. **Where a classic's page lives:** under `/napoj/` beside products, or its own path. A public URL, so decide it once.
4. **The `virgin_classic` house-drink type:** retire it, since a link to a classic says the same thing better.
5. **The launch shape:** build the link before the load (the admin and the menu import pick the classic), or load classics as plain house drinks and link them right after. With 30 admin-entered venues, either is cheap; the first avoids touching the data twice.

**Why this sits in Launch:** the launch files record classics one way or the other. Deciding before the load means entering them once.

*See also: [[decisions/product/what-belongs-in-the-catalogue]] (test 3: the four house-drink types) · [[tech/badges-and-menu]] · [[product/rules/Custom Drinks Rules]]*
