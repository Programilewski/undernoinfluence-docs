---
description: "Classic drinks versus a venue's own creations: what each gives an owner, and what is still open. Not yet decided."
owner: Paweł Milewski
updated: 2026-10-07
status: open — the principle is set; the threshold and the model wait on research
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

**Why this sits in Launch:** the launch files record classics one way or the other. Deciding before the load means entering them once.

*See also: [[decisions/product/what-belongs-in-the-catalogue]] (test 3: the four house-drink types) · [[tech/badges-and-menu]] · [[product/rules/Custom Drinks Rules]]*
