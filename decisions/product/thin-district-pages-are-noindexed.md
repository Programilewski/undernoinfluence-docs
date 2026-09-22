# A district page needs three venues to be indexable

**Date:** 2026-08-31
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** UI/UX | Venues

---

## Problem

`empty-landing-pages-noindex.md` settled what happens to a landing page with nothing on it. It did not settle the more common case: a page with one or two venues on it. Warsaw's eighteen districts hold between one and eight venues each, so most district pages are thin rather than empty — a heading, a sentence and a single card, on a URL that is otherwise a near-duplicate of the city page. That is the thin-content pattern search engines penalise, and it is the pattern that reaches the index because nothing currently stops it.

## Options considered

Index everything and rely on search engines to sort it out. Pick a threshold and noindex below it. Use a word-count or content-richness rule rather than a venue count. Merge thin districts into their parent city page and redirect.

## Decision

A district page below three active venues is served normally and marked `noindex, follow`, and is excluded from the sitemap. Three is the lowest count at which the page answers the question it was found for: two venues is a list, three is a choice. It is deliberately not higher — against the current distribution, a threshold of five would index only the two largest districts and would exclude the districts with the most actual search demand while they hold real venues.

## Rules

The threshold lives in configuration, not in a view, so it can be raised as coverage improves without touching code. `follow` is mandatory on the noindexed variant, so link equity keeps flowing through the cluster. The sitemap applies the same threshold, because a submitted URL that is noindexed is a contradiction a crawler sees before it sees the page. The threshold gates the district page only: a district × category page is gated separately, on that pair having any venues at all, and extending the rule downwards is a larger change than this decision settles.

## What this prevents

It prevents the cluster's weakest pages from defining what the site looks like to a search engine, at exactly the moment when there are few enough strong pages that the average matters. It also prevents the opposite error of deleting or redirecting the URLs, which would have to be un-built the day a district gets its third venue.

## Revisit when

As soon as the real venue set replaces the seeded one — the current distribution is fake data, and three was chosen against it. Also revisit if district × category pages under thin districts start appearing in the index, since that inconsistency is known and deliberately left open.

---

*See also: [[decisions/product/empty-landing-pages-noindex]], [[decisions/product/seo-cluster-entry-points]], [[decisions/product/discovery-filters-are-not-indexable]]*
