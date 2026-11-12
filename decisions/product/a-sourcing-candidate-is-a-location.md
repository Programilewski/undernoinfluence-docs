# A sourcing candidate is a location, not a domain

**Date:** 2026-11-12
**Status:** Decided — Paweł, 12.11: "if it does handle it, build it now"
**Executed:** 2026-11-12 — candidates unique on domain + location page; *Dodaj lokalizacje* on Kandydaci; fetch and find resolve to the location; link and rejection per location; tests in `ChainLocationsTest` and `AdminSourcingCandidatesTest`
**Area:** Data Model | Venues

---

## Problem

The pipeline ([[decisions/adr/ADR-012-automated-venue-sourcing]]) keys a candidate by its domain, so a chain is one candidate: all of Semolino's locations are `semolino.pl`. In the application, fetching a second location's menu replaces the first location's as the candidate's current file (and deletes it), linking a menu to a venue moves *every* menu of the candidate to that venue, and the refresh follows one page. So a chain can get exactly one venue through the pipeline. The 11.11 briefing's workaround ("start from a location's page") does not work; the code was checked on 12.11. ADR-012 itself says "one private copy per venue", which the code does not do.

The real site settles the shape. On 12.11 Semolino had a page per location in its sitemap. Piastów and Ursus link the same `Menu-Kleszczowa.pdf`, while Wilanów links its own 2026 PDF. Locations of one chain sometimes share a menu and sometimes don't. Paweł added on 12.11 that a chain can also give each of its six locations its own menu; the design has to cover one shared file, one file per location, and any mix of the two.

## Options considered

The first option is to keep one candidate per domain and let chains be typed by hand. That is the cheapest, but a chain is exactly where the pipeline saves the most typing. The second is one candidate per domain, with the current menu and the venue link moved from the candidate to each menu. A chain then becomes a candidate holding several venues, which confuses the per-candidate approval, rejection and status. The third is a candidate per location: same domain allowed, told apart by the location's page, each with its own venue, current menu and refresh page.

## Decision

**A candidate is a location.** A candidate is what becomes one venue, so it carries one venue, one current menu and one page to refresh. Six locations with six menus each keep their own. Locations sharing one menu file each hold it as their current menu, and the file is stored once, deleted only when no location holds it any more. Paweł asked whether this covers both cases; it does, and he said to build it.

## Rules

Several candidates may share a domain, each told apart by its location page; a candidate without one stands for the whole site. A search result still creates at most one candidate per domain, the whole site. The admin adds a chain's locations with *Dodaj lokalizacje* on the site's candidate, pasting their pages, at most 20 at once. Each location inherits how the site was found, so a query's yield counts every venue it led to, and its menu is searched at once. A location's menu is searched from its own page only, never from the site's sitemap, which would offer the other locations' menus. A menu fetched by hand belongs to the location whose page it is on or linked from, otherwise to the whole site. Linking a menu to a venue links only that location; rejecting a location blocks only it. Once its locations are in, the site itself is rejected with the reason "Sieć — każda lokalizacja osobno", which leaves the locations open; any other rejection of the site blocks every location. A file shared by two locations is read once per location for now. Finding locations from the sitemap automatically is deferred until chains prove common.

## What this prevents

It stops a chain's second menu silently deleting the first, and stops a link to one venue moving another venue's menus. It also stops the pipeline proposing, under one name, venues whose offers differ, as Wilanów's does from Kleszczowa's.

## Revisit when

When adding locations by hand proves slow (then detect them from the sitemap), when chains turn out to share one menu almost always (then a menu serving several venues may be simpler), or when the first ~100 Brave candidates show chains are too rare to matter in Warsaw.

See also: [[decisions/adr/ADR-012-automated-venue-sourcing]], [[decisions/product/venue-data-acquisition-flow]].
