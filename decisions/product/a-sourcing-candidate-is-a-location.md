# A sourcing candidate is a location, not a domain

**Date:** 2026-11-12
**Status:** Open — recommended, waiting on Paweł
**Executed:** no
**Area:** Data Model | Venues

---

## Problem

The pipeline ([[decisions/adr/ADR-012-automated-venue-sourcing]]) keys a candidate by its domain, so a chain is one candidate: all of Semolino's locations are `semolino.pl`. In the application, fetching a second location's menu replaces the first location's as the candidate's current file (and deletes it), linking a menu to a venue moves *every* menu of the candidate to that venue, and the refresh follows one page. So a chain can get exactly one venue through the pipeline. The 11.11 briefing's workaround ("start from a location's page") does not work; the code was checked on 12.11. ADR-012 itself says "one private copy per venue", which the code does not do.

The real site settles the shape. On 12.11 Semolino had a page per location in its sitemap. Piastów and Ursus link the same `Menu-Kleszczowa.pdf`, while Wilanów links its own 2026 PDF. Locations of one chain sometimes share a menu and sometimes don't.

## Options considered

The first option is to keep one candidate per domain and let chains be typed by hand. That is the cheapest, but a chain is exactly where the pipeline saves the most typing. The second is one candidate per domain, with the current menu and the venue link moved from the candidate to each menu. A chain then becomes a candidate holding several venues, which confuses the per-candidate approval, rejection and status. The third is a candidate per location: same domain allowed, told apart by the location's page, each with its own venue, current menu and refresh page.

## Decision

Recommended: **a candidate is a location**. A candidate is what becomes one venue, so it carries one venue, one current menu and one page to refresh. Two locations sharing a menu file each hold it as their current menu; the file is stored once and deleted only when no location holds it any more (the application already deletes shared files this way).

## Rules

Several candidates may share a domain; each is told apart by its location page, and a candidate without one stands for the whole site. A search result still creates at most one candidate per domain. Locations are added by the admin with *Dodaj lokalizację* (the location page's address) on the candidate, or found from the sitemap when the domain's pages look like locations. Fetching or finding a menu from a page belongs to the location whose page it is under, otherwise to the whole-site candidate. Linking a menu to a venue links only that location. Rejecting the whole site blocks every location; rejecting one location blocks only it. A file shared by two locations is read once per location for now. Reusing the first reading is an optimisation for later, measured first.

## What this prevents

It stops a chain's second menu silently deleting the first, and stops a link to one venue moving another venue's menus. It also stops the pipeline proposing, under one name, venues whose offers differ, as Wilanów's does from Kleszczowa's.

## Revisit when

When chains turn out to share one menu almost always (then a menu serving several venues may be simpler), or when the first ~100 Brave candidates show chains are too rare to matter in Warsaw.

See also: [[decisions/adr/ADR-012-automated-venue-sourcing]], [[decisions/product/venue-data-acquisition-flow]].
