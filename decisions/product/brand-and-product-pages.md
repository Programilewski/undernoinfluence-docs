# Brand and drink pages become a search surface, without pictures at launch

**Date:** 2026-08-30
**Status:** Decided
**Executed:** 2026-09-17 — `/napoj/{slug}` and `/marka/{slug}` live, text-only, each with the counted call to action. Venue pages link every catalogue drink and its brand. Drinks and brands nobody serves render `noindex, follow` and stay out of the sitemap
**Area:** Venues | Brand

---

## Problem

Search demand for the thing we built the site around does not appear to exist. Five years of
search data show a real and growing curve for non-alcoholic beer, five years of flat zero for
"mocktails", and nothing measurable at all for phrases about non-alcoholic bars in Warsaw.
Meanwhile the catalogue of brands and drinks was treated as supporting data with no pages of its
own. If people search for products and not for venues, the site has no door.

## Options considered

Keep venue and city pages as the only search surface and write more of them. Build pages for each
brand and each drink and lead from them to the venues that serve them. Build them with product
photographs. Build them text-only. Wait for the catalogue to be complete before building any.

## Decision

Brands and drinks get their own pages, and they become a primary search surface rather than
supporting data. Traffic enters through the product and converts to a venue: a page about a
non-alcoholic beer ends with a counted link to the places in Warsaw that serve it. They launch
without photographs, because the ranking value of these pages is in the words and photographs are
the one part that carries both a storage cost and a copyright question.

## Rules

**The venue list on both page types is ordered by the freshest confirmation of that drink**, not by how broad the venue's whole offer is. Breadth is the map's question — which place is best overall; a drink page is asked a narrower one — where can I get *this* tonight — and the most recently confirmed listing is the best answer available. Breadth breaks ties, then id, so the order is stable between requests. On a brand page the date is the most recent confirmation of any of that brand's drinks at the venue.

**A venue with no confirmation date sorts last, never first.** Postgres orders nulls first on `DESC`, so "newest first" written the obvious way puts the listings nobody has ever checked at the top — the exact inverse of the intent. `NULLS LAST` is load-bearing and `DrinkAndBrandPageTest` asserts it.

Every brand page and every drink page carries a counted call to action naming a real number —
"served in fourteen places in Warsaw" with a link to that filtered list — never a generic
invitation. Grammatical inflection uses the locative name that already exists on the record, so
titles and headings read naturally in Polish. The word "mocktail" never appears in a page title,
heading, address or any piece of writing, whatever the internal database label says. Images are
added later, by hand, only for the products that prove they earn traffic, and only from a
photograph we took ourselves or one a brand has given us permission to use in writing — never
copied from a shop or a brand's site, because the photograph is a separate copyright from the
product in it.

## What this prevents

Prevents building the whole search strategy on phrases that five years of data say nobody types,
and prevents the opposite failure of having the demand arrive at a page that does not exist. The
image rule prevents a library of a few hundred pictures whose origin nobody can account for, at
the exact moment the product's entire claim is that its data can be accounted for.

## Revisit when

Search Console shows which product pages actually earn traffic, at which point images are worth
requesting from those specific brands. Also revisit if a brand asks us to remove its page, which
is a conversation worth having early rather than a policy worth guessing at.

---

*See also: [[decisions/product/seo-cluster-entry-points]] · [[decisions/product/venue-url-structure]] ·
[[decisions/product/no-venue-photos-v1]] · [[decisions/product/abv-trust-model]] ·
[[decisions/product/discovery-filters-are-not-indexable]]*
