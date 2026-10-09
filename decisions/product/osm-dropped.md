# OSM dropped as venue data source

**Date:** 2026-06-01
**Status:** Decided
**Executed:** 2026-06-01
**Superseded:** 2026-10-09, in part — Nominatim is no longer "retained": it was removed from the application (amendment below)
**Area:** Data Model | Venues

---

## Problem

The venue seeding pipeline was built on OpenStreetMap data enriched with CEIDG cross-references. During multi-city expansion prep, the ODbL (Open Database License) was reviewed and found to be incompatible with UNI's commercial use: ODbL requires that any "produced work" derived from the database remain openly licensed, and the share-alike clause would taint venue records that mixed OSM fields with proprietary enrichment data.

## Options considered

1. **Keep OSM data and comply with ODbL** — open-license the UNI venue database. Unacceptable: the enriched data is UNI's core asset.
2. **Keep OSM data and argue "collective database" exemption** — legally risky, untested in Polish courts.
3. **Drop all OSM-sourced venue data, seed manually** — clean break, no legal exposure.
4. **Use a different open geodata source** — no viable alternative with comparable Polish venue coverage.

## Decision

Drop OSM entirely as a venue data source. All venue data is now manually curated: researched from venue websites, social media, delivery platforms, and direct contact. The seeding pipeline (triage queue, import commands, OSM dedup logic) was removed. CEIDG remains as an optional cross-reference for business verification. Geocoding via Nominatim is retained because service calls (sending an address, getting coordinates back) are not "produced works" under ODbL.

## Rules

No OSM venue attributes may be stored in the venues table. Map tiles from OSM/CARTO are permitted (tile rendering is explicitly allowed under ODbL). Nominatim and GUS geocoding services are permitted. Every venue must be manually verified before going live.

**Amended 2026-10-09 — Nominatim removed.** The decision above kept Nominatim as a permitted service call. On 09.10 it was taken out of the application entirely: its four admin buttons (geocode and reverse geocode, single and bulk), `NominatimGeocodingService` and its tests. Three reasons, none of them a new reading of the licence. **Nothing was left that only it provided:** GUGiK supplies the point (the geocoding-comes-from-the-state-register record) and, since 09.10, the Warsaw district through its cadastre, which was the last reason it was kept. **Its reverse lookup broke the rule of this record:** it wrote OSM's street, house number, postcode and district into the venue, which is an OSM venue attribute stored in the venues table. **It sat one click from GUGiK during the launch load**, so a mis-click would have put OSM-derived points into production on day one. The venue form keeps the label "Nominatim (OpenStreetMap)" in its `geocoded_by` list so a point placed with it earlier still says where it came from. Map tiles are untouched by this; the rule above on tiles stands.

## What this prevents

Legal exposure under ODbL share-alike. A competitor discovering that UNI's "proprietary" venue data is legally required to be open would be existential for the business model.

## Revisit when

Never for OSM specifically. If a non-ODbL venue data source with Polish coverage emerges, evaluate then.

## See also

This supersedes the OSM portions of ADR-002. The CEIDG + manual enrichment approach from ADR-002 remains valid.
