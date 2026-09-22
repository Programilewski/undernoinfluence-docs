# ADR-002: Venue Seeding

## Status
**Decided: CEIDG prospecting + manual enrichment.**
**Executed:** no, and overtaken — the register never entered the app; [[decisions/product/venue-data-acquisition-flow]] keeps it as a prospect list outside the repository
**Updated 2026-06-01:** OSM was dropped entirely as a data source due to ODbL license incompatibility. The CEIDG + manual enrichment approach remains valid. See [[decisions/product/osm-dropped]] for the full decision record.

## Context
Need initial venue data for Warsaw launch. Can't scrape Google Places API commercially.

## Decision
1. Pull bars (56.30.Z) and restaurants (56.10.A) from CEIDG API filtered by Warsaw
2. Enrich manually: venue websites, social media, Untappd, a visit — **not phone calls** (amended 21.09)
3. Contact NoLo distributors for pre-qualified client lists
4. Only create profiles for venues with confirmed NoLo offerings — no empty shells

## Rationale
- CEIDG is public government data, free to use commercially
- Google Places can be browsed manually for research but data cannot be stored
- Empty profiles are worse than no profiles — sparse data kills first impressions
- Distributor partnerships give highest-quality leads with least effort

## Sources for Enrichment (Priority Order)
1. Venue's own website (menu PDFs, drink lists)
2. Facebook/Instagram (menu posts, bar photos)
3. Untappd (NA beer check-ins per venue)
4. Delivery platforms (Pyszne.pl, Uber Eats — drink sections)
5. Google Maps reviews mentioning "bezalkoholowe"
6. Tripadvisor reviews mentioning NA drinks
7. NoLo distributor client lists
8. ~~Direct phone calls~~ — **withdrawn 21.09.** UNI does not ring venues, for menus or for anything else

## When to Revisit
When expanding beyond Warsaw — same playbook, new CEIDG filters by municipality.
