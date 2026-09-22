# Empty SEO Landing Pages Are Noindexed, Not 404

**Date:** 2026-08-14
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** UI/UX | Venues | Analytics

---

## Problem

The city cluster generates roughly 300 landing pages (`/{city}`, `/{city}/{district}`, `/{city}/{category}`, `/{city}/{district}/{category}`), but only Warsaw has venues — 23 of 25 active cities have none, and Kraków holds only a canary. Every one of those empty combinations still resolves and returns HTTP 200. That looks like a thin-content liability: hundreds of near-identical pages with no substance is exactly the pattern search engines penalise. Get it wrong in the other direction and you 404 URLs that are legitimate, that users may reasonably type, and that must start working the day a city gets its first venue.

## Options considered

Return 404 whenever a page has no venues, treating emptiness as "does not exist". Return 200 with an empty state and a `noindex, follow` robots directive, keeping the URL alive but out of the search index. Return 200 with no directive at all and rely solely on sitemap exclusion. Redirect empty pages up to the nearest non-empty ancestor.

## Decision

Empty landing pages return 200 with an honest empty state and `<meta name="robots" content="noindex, follow">`, and are excluded from the sitemap. This is already the implemented behaviour and it is now confirmed as deliberate rather than accidental. A 404 was proposed during an audit and rejected: it breaks existing tested behaviour, discards a useful empty state, and would have to be un-built at expansion time.

## Rules

Every landing page view emits `noindex, follow` when its venue list is empty and `index, follow, noai, noimageai` when it is not — the condition lives in the view, alongside the canonical tag, not in the controller. The `follow` half is mandatory: crawlers must keep walking the internal links out of an empty page so link equity still flows through the cluster. Sitemap generation independently filters to entities that have at least one venue under the shared "active venue" definition, which excludes canaries, so a noindexed URL is never submitted to search engines. Controllers do not abort on empty result sets; emptiness is a rendering state, not an error. The one existing exception is the district page, which 404s on an empty district — a known inconsistency, left untouched because it is covered by tests.

## What this prevents

404ing empty cities would have created a cliff at expansion: the day Kraków gets its first venue, a URL that had been returning "not found" — possibly cached as such by crawlers and browsers — would have to start working. It would also delete a genuinely useful answer for a user who types `/wroclaw` ("we don't cover this city yet") and replace it with an error that reads like a broken site. Relying on sitemap exclusion alone would be the opposite failure: the pages stay indexable and a single external link is enough to get 160 empty pages into the index.

## Revisit when

The empty-state pages start attracting meaningful direct traffic, at which point they are worth turning into real "coming soon / suggest a venue" pages rather than dead ends. Also revisit if the district page's 404 behaviour causes confusion during multi-city expansion — the cluster should eventually pick one convention.

---

*See also: [[decisions/product/venue-url-structure]], [[decisions/product/city-agnostic-homepage]], [[decisions/product/block-all-ai-crawlers]]*
