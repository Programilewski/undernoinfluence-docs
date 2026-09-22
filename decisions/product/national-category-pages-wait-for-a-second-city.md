# National Category Pages Wait For A Second City

**Date:** 2026-09-08
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** UI/UX | Venues

---

## Problem

`/kategoria/piwo-bezalkoholowe` and `/warszawa/piwo-bezalkoholowe` were shipping byte-identical `<title>` tags — "Bezalkoholowe Piwo 0% w Warszawie | UNI" — because the national page borrowed the default city's name for its title and heading while listing venues from everywhere. Both were `index, follow`, both were self-canonical, both were in the sitemap, and with one city live both listed exactly the same venues. Two of our own addresses were bidding on one phrase, which splits the ranking signal for the query the whole cluster was built to win, and neither page could accumulate the authority the other was taking.

## Options considered

Redirect `/kategoria/{category}` permanently to `/{default-city}/{category}`. Canonicalise the national page to the city page while a single city is live. Make the national page genuinely national and index it anyway. Make it genuinely national and hold it out of the index until it has more than one city to aggregate. Delete the national route.

## Decision

The national page becomes a real aggregate — titled "w Polsce", never naming a city, listing every city that has the category with a counted link into `/{city}/{category}` — and it is `noindex, follow` until at least two cities have venues in that category. It is held out of the sitemap in the same state. The redirect was rejected because `venue-url-structure` commits to no 301s at expansion; a cross-page canonical was rejected because it would have to be removed later and canonical tags that flip are the slowest kind of change for a crawler to absorb.

## Rules

The national category page never takes a city's name into its title, heading, description or Open Graph card, whatever the default city is set to. Its indexability is derived, not configured: it counts the cities with venues in that category under the shared freshness rule and indexes only above one. The sitemap reads the same count, so the page is submitted exactly when it is indexable. The city page's category pills link to `/{city}/{category}`, never to the national page — the city-scoped address is the one that can win "piwo bezalkoholowe Warszawa" — and the national page keeps its inbound links from the city × category pages that sit under it.

## What this prevents

It stops the site competing with itself on its highest-intent phrase, and it does so without inventing a redirect that would have to be unwound at the second city. It also removes the failure mode underneath the duplication: a page whose title asserted a city while its content ignored that city was wrong for every reader who arrived on it, not only for the crawler. The state resolves itself — no dated flag, no manual step at expansion; the second city's first venue flips the page into the index.

## Revisit when

A second city launches and Search Console shows how the two page types actually split impressions. If the national page then cannibalises the city pages in the other direction, the threshold moves up rather than the page being deleted.

---

*See also: [[decisions/product/empty-landing-pages-noindex]], [[decisions/product/seo-cluster-entry-points]], [[decisions/product/venue-url-structure]]*
