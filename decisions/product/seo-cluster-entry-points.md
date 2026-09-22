# Entry Points Into the SEO City Cluster

**Date:** 2026-08-14
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** UI/UX | Venues

---

## Problem

The city landing pages were densely linked *among themselves* — breadcrumbs upward, cross-links between district and category — but nothing in the rest of the site pointed into them. Navigation, footer, homepage, the discovery map and venue profiles contained zero links to `/{city}` or anything below it, so the entire cluster was reachable only from `sitemap.xml` or by typing a URL. A sitemap gets pages discovered; internal links are what signal importance and pass authority, so ~300 landing pages were being built with no way to earn ranking and no way for a browsing user to ever find them.

## Options considered

Link from the venue profile to its own city and district. Add a city list to the footer so it appears on every page. Add a "Warsaw by district" block to the homepage. Link from the discovery map's result rows. Leave it and rely on the sitemap.

## Decision

Two entry points ship: the venue profile links to its own city and district from the address block, and the footer carries a list of cities that have venues. The venue profile is the primary route because it scales with the catalogue and the link is contextual rather than bolted on; the footer is the sitewide safety net. The homepage district block was considered and deferred, and the discovery map was rejected outright.

## Rules

Venue profiles link out to their district and city landing pages, and only when both relations are present — a venue that lives in a district guarantees that district's page is non-empty, so these links can never point at a dead end. The footer city list is generated from the database at render time and filtered to cities holding at least one venue under the shared "active venue" definition, which excludes canaries; it must never be a hardcoded list. Any future entry point follows the same guarantee: link only to landing pages that are known to have content, so no internal link ever lands on a noindexed empty state.

## What this prevents

Without inbound links, the cluster inherits nothing from the homepage's authority and gets minimal crawl priority — the pages exist but cannot realistically compete for the long-tail queries they were built for. It also prevents a second failure discovered while implementing this: two of the four page types were returning 500 errors, which nobody had noticed precisely because no link led there. Adding entry points without first clicking through would have routed users straight into a broken page.

## Revisit when

Search Console shows the cluster indexed but underperforming, at which point the homepage district block becomes the next lever — it would pass authority from the strongest page in the site. Also revisit at multi-city launch: the footer list grows automatically, but beyond four or five cities it needs a different treatment than a single comma-separated row.

---

*See also: [[decisions/product/empty-landing-pages-noindex]], [[decisions/product/venue-url-structure]], [[decisions/product/city-agnostic-homepage]]*
