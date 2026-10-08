# Shared recipes

**Date:** 2026-10-08
**Status:** Decided
**Executed:** yes, 08.10.2026
**Area:** Data Model | Venues

---

## Problem

A person should be able to find every venue serving a non-alcoholic mojito tonight, and a venue should be able to show the drinks it created itself. Until now a well-known drink was a free-text house drink (`virgin_classic`), so forty mojitos were forty unrelated rows, and a June workaround stored some as products under a fake brand "Własna receptura". Two researches (07.10 external, 08.10 own) found that about half of the mixed lines on Warsaw mocktail menus are such drinks as written, with Mojito on four of seven menus.

## Options considered

Keep free text. A separate classics table with its own aliases (the 07.10 assessment). One menu-items table replacing products and house drinks (the external research, rejected as over-built). The well-known drink as a brandless catalogue product, with a venue's own versions linked to it (the 08.10 research). For the name, "classic" (implies old and famous), "standard" (reads as "an ordinary product" inside the products table), "generic" (sounds cheap), "canonical" (opaque), and "recipe".

## Decision

A well-known drink is a **shared recipe**: a brandless product in `drinki`, marked as a recipe and created only by UNI, with its page at `/napoj/{slug}`. A menu line that is the recipe as written is attached like any product; a venue's own drink keeps its own name and may point at the recipe it is built on, which lists it on the recipe's page. "Recipe" was chosen because inside the products table it names the one thing that separates these rows, a recipe rather than something manufactured, and it pairs with the venue's own recipe (the house drink). Founder, 08.10.2026: "lets go with recipe".

## Rules

The admin reading a menu applies one rule: the name decides the table, the description decides the link. A known spelling of a recipe is the recipe itself; anything with its own name is a house drink, linked as a version when it is built on a recipe's core, and the venue's own creation otherwise. Only UNI creates recipes; they are created as launch menus need them, from the candidate list in the product note. A recipe has no brand and states no figure of its own: its page says "Bez alkoholu, do 0,5%" and never "0.0%", because each venue's recipe decides and venues label the same 0% ingredient differently. A recipe is named in the Polish form people search ("Mojito bezalkoholowe", slug `mojito-bezalkoholowe`) with the menu name beside it ("Virgin Mojito"). Its page lists venues serving it as written ("Podają") and the venues' own versions under their own names ("Wersje lokali"); a venue's version carries a bordered label under its description, "WARIANT KLASYKA | Negroni ↗", the recipe's short name linking to its page. Founder, 08.10, after three rejected attempts: the full name ("Mojito bezalkoholowe" beside "Mojito rabarbarowe" read as if the venue's drink were the alcoholic one), a "na bazie: mojito" tag (hard to see, and "na bazie" names an ingredient in Polish), and the sentence "Odmiana klasycznego Mojito" (still confusing, and it needed a genitive for every recipe). A label and a value keep the name in the nominative. Every recipe's name ends in "bezalkoholowe/-y/-a", which the product form enforces, so the short name is the name without it. The public word is "klasyk"; "shared recipe" is the internal one. Below three live venues, counting both lists and a venue once, the page is served but kept out of the index and the sitemap, as districts are. Linking to a recipe never changes a venue's rank by itself. Brand names on menus map to the generic recipe ("Aperol Spritz 0" is the spritz). `virgin_classic` and the "Własna receptura" workaround are retired.

## What this prevents

Forty unrelated mojitos nobody can search. An owner trading the listing for the look of a signature drink: a version keeps both its name and the listing, which removes the main reason to game the choice. A parallel classics stack rebuilding the page, aliases, import matching, search and sitemap that products already have. Thin one-venue pages that read as doorway pages to Google. A page claiming a strength UNI cannot know.

## Revisit when

Owners edit menus (V2): the owner-facing step should become a suggestion ("To wygląda jak: Mojito bezalkoholowe — Tak / Nie, to inny drink") rather than the plain picker built now behind the owner switch. When an own creation starts repeating across unrelated venues ("Kombucha Spritz"), consider it for a recipe. If a venue's own description on an exact line turns out to matter, a description on the venue's product link brings it back.

---

*See also: [[product/rules/Classics and House Drinks]] · [[research/results/classics-versus-house-drinks-own-research]] · [[research/results/classics-versus-house-drinks]] · [[decisions/product/what-belongs-in-the-catalogue]] · [[decisions/product/catalogue-excludes-actual-alcohol]] · [[decisions/product/one-ordering-for-every-venue-list]] · [[decisions/product/brand-and-product-pages]]*
