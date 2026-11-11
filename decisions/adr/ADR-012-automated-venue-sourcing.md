# ADR-012 — Venues are found and read automatically, and published only by hand

**Date:** 2026-11-11
**Status:** Decided
**Executed:** no — design in the 10.11 briefing (next-session-2026-11-10), build order in its §9
**Area:** Venues | Data Model | Catalogue

---

## Problem

Every venue so far has been found by searching by hand, its menu opened by hand and its drinks typed in by hand ([[decisions/adr/ADR-002 Venue Seeding]], [[decisions/product/venue-data-acquisition-flow]]). That is the reason launch waits on ~30 venues, and it does not scale to a city, let alone a second one. The rule that kept it manual was never a product rule: it came from not knowing whether reading venues' pages automatically was allowed, and choosing the safe side until it was known.

## Options considered

Stay manual. Automate the whole chain including publishing. Automate finding and reading, and keep a person approving every venue and every change. Buy or license a venue dataset (Google Places, delivery platforms — excluded already by their terms and by [[decisions/product/osm-dropped]]).

## Decision

**Finding candidates and reading their menus is automated; publishing is not.** Candidates come from searches through the Brave Search API (source A, `brave_content`) and from Warsaw's public list of alcohol permits (source B, `licence_list`, only once A runs dry), plus `manual` and `submission`. Each candidate goes through one flow: the venue's own domain is found and verified, its menu link is found, the menu is fetched and the non-alcoholic lines are extracted by a model, the lines are matched against the catalogue, and the result waits in an approval queue in the admin panel. Paweł decided on 11.11.2026, overriding the manual-only rule: "It came from fear of doing something illegal. If the automated flow is legal, we are fine." The flow is built so that each step stays inside the rules below; those rules are the condition the override rests on.

## Rules

- **Nothing publishes itself.** The only automated way into the venue and menu tables is the approval action, and approval writes through the existing resolver and `RecordMenuItemAction` ([[decisions/product/one-ingestion-path-for-menu-data]]). A pipeline that writes a venue or a product link any other way breaks this record.
- **Menus are read only from the venue's own site (first-party).** Never from aggregators, delivery platforms, review sites, Google Maps, OSM or social media. An article listing venues may supply a venue's name as a lead; its text is never kept.
- **UNIbot honours every opt-out to the letter:** robots.txt, the `tdm-reservation` header and meta tag, and `/.well-known/tdmrep.json`. It identifies itself (`UNIbot/1.0 (+https://<domain>/bot)`, with a public `/bot` page) and fetches one page per request, without recursion. UNI asks AI crawlers to keep out of its own pages ([[decisions/adr/ADR-009 AI Scraping Protection]]); it gives others the same courtesy.
- **Brave results are not stored.** Only the final URL of UNI's own fetch is kept, and only after the venue's address or phone has been found on that page. Titles, snippets, rankings and raw responses are discarded after the run.
- **No personal data enters.** From the permit list only the point's address, its trade name, district, permit type and dates are kept; owner names, firm names, NIP and the application documents are never fetched or stored. From venue pages only general contacts are kept, never a named person's e-mail or mobile ([[decisions/product/venue-data-acquisition-flow]] still holds here).
- **Item names are facts; descriptions are not copied.** The model extracts names, category, strength as printed and the menu section; no prices, no written descriptions.
- **Rejected candidates are kept, with the reason** — they are what stops the pipeline proposing the same venue again (anonymisation, not deletion).
- **Every fact still carries where it was read and when** (`source_url`, `checked_at`).

## What this prevents

Prevents launch waiting indefinitely on hand-typing, without giving up the two things the manual rule actually protected: that a person stands behind every venue UNI shows, and that UNI takes from venues' sites nothing their owners have asked crawlers not to take.

## Revisit when

An opt-out, a terms change at Brave, or a venue's complaint shows a rule above is not enough; when the approval rate per source (measured after ~100 candidates each) says one source is not worth running; or when expanding beyond Warsaw, where source B needs that city's permit list.

---

*See also: [[decisions/adr/ADR-002 Venue Seeding]] · [[decisions/product/venue-data-acquisition-flow]] · [[decisions/product/one-ingestion-path-for-menu-data]] · [[decisions/adr/ADR-009 AI Scraping Protection]] · [[decisions/product/kebab-rule]]*
