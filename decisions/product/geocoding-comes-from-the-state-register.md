# Coordinates come from the state address register, not from OSM or the statistical office

**Date:** 2026-09-12
**Status:** Decided
**Executed:** 2026-09-12
**Area:** Data Model | Venues | Compliance

---

## Problem

`VenueImporter` required a latitude and a longitude on every row. The only coordinates in existence for the launch worklist are the ones in `uni_filtered_venues.csv`, and they came out of the OSM export together with the address, the phone number, the amenity type and the `osm_id` — so the importer's own shape pushed the launch import toward storing exactly what [[decisions/product/osm-dropped]] forbids: *"No OSM venue attributes may be stored in the venues table."*

Dropping the requirement only helps if something else can fill the field. Two geocoders existed, and on 2026-09-12 both were checked against the real services rather than against their tests:

- **GUS FTS** (`geo.stat.gov.pl/api/fts/`) returned `relevance: 0.0, src: null` for every payload shape tried, **including the example in its own documentation**, which is vendored at `~/uni-reference/gus-api/` (moved out of the vault 22.09, see [[tech/reference-material]]). Its full-text endpoint returned HTTP 500 "Read timed out", and with the external fallback enabled the response came back `"xmessage": "timeout"`. Its autocomplete endpoint answered a malformed request with a correct HTTP 400, so the service is up and validating — its index is not answering. Separately, and regardless of the outage, `GusGeocodingService` never sent `miejsc_nazwa`: every request asked for a street name with no town attached, nationwide.
- **Nominatim** answers correctly, and [[decisions/product/osm-dropped]] permits it, because sending an address and getting a point back is a service call rather than a produced work. But every response carries *"Data © OpenStreetMap contributors, ODbL 1.0"*, and it matches by relevance over all object types — a lookup for Górczewska 124 resolved to the Auchan supermarket polygon rather than the address point.

Nine geocoding tests existed and none of this was visible from them, because every one of them fakes the HTTP layer.

## Options considered

**Keep the coordinate requirement and import the OSM values.** Fastest, and it breaks the decision that the entire seeding pipeline was dismantled to establish.

**Make coordinates optional and geocode with Nominatim.** Works today, and it keeps a licence question attached to the coordinate column of the core business asset forever.

**Make coordinates optional and repair GUS first.** The provider is not answering its own documented examples, so there is nothing to repair from this side.

**Make coordinates optional and geocode against GUGiK's address service.** The national address register, kept by the state mapping authority, published as open data. Verified live before choosing it: four addresses in two cities returned correct WGS84 points in about six milliseconds, with accuracy scores, postcodes and TERYT identifiers.

## Decision

**Coordinates are derived from GUGiK's Universal Address Service (`services.gugik.gov.pl/uug/`), and `VenueImporter` no longer requires them.** A worklist is imported without coordinates and geocoded afterwards with the bulk action, which already existed.

`GugikGeocodingService` implements the existing `Geocoder` contract, so it drops into the single and bulk actions on the venue resource with no other change. GUGiK leads the provider list; GUS and Nominatim stay as fallbacks, and the missing `miejsc_nazwa` in the GUS request is fixed so that if their index recovers, the request is at least well formed.

**Geocoding is never called inside the import job.** It couples a queued batch to an external service, turning an API hiccup into failed rows mid-run and one batched call into seventy separate ones.

## Rules

The score alone never decides a match. A result is accepted only when the city matched exactly, the returned street name contains the requested one after the register's type prefix is stripped and diacritics are normalised, the house number is the one asked for, and the point is within 60 km of the city centre. The Kraków probe is why: a query for Floriańska 3 returned Ariańska, Słowiańska and Loretańska at 0.52–0.65, while an exactly correct Warsaw address scored 0.79.

**A venue without coordinates cannot go live.** `Venue::activateIfReady()` requires a point, and `MapData::forVenues()` filters out venues that lack one, because the map payload casts coordinates with `(float)` and a null becomes a pin at 0,0.

**No government service supplies the Warsaw district.** `citypart` is null for every Warsaw address and the GUS equivalent is the gmina, which for Warsaw is "Warszawa". `district_id` therefore has to come from Nominatim's `suburb` or from a hand pass, and nothing should be written that assumes otherwise.

If GUS is ever used as a source in production, its terms require citing the source: *"wykorzystanie… w celach komercyjnych lub niekomercyjnych dozwolone jest bezpłatnie, pod warunkiem podania źródła"*. Attribution has a home already — [[decisions/product/map-attribution-lives-in-the-style]].

**An integration whose failure is invisible gets a live test.** `GeocodingLiveTest` calls the real services and sits in the `live` group, excluded from the default suite by `phpunit.xml`. Mocks assert that we parse a shape; only a live call asserts that anybody still sends it.

**Amended 2026-09-14 — every point names its provider, and the launch-day button is tested.** The `Geocoder` contract gained `source()` and a `matched_label` in each forward result, so `GeocodeVenueAction` writes `geocoded_by` and `geocoded_at` with the point and the edit page shows what matched. Pressing `bulk_geocode_gugik` in a test for the first time found it threw a lazy-loading violation outside production — each provider reads the venue's city — so the action now loads the cities first.

## What this prevents

It removes the licence question from the coordinate column of the venue table rather than arguing about it: a point derived from the state address register is not an OSM attribute and carries no share-alike clause. It also prevents the quieter failure, which is a launch import that silently stores nothing useful — a dead provider and a mocked test suite agreeing with each other while sixty venues end up unplaceable on a map.

## Revisit when

GUGiK changes its terms or its response shape, which the live test would surface. Or when a second city outside Poland is added, at which point the national register stops covering the catalogue and the provider list needs a non-Polish entry.

## See also

[[decisions/product/osm-dropped]] · [[decisions/product/venue-activation-gate]] · [[decisions/product/map-attribution-lives-in-the-style]] · [[decisions/product/no-machine-addresses-in-the-repo]]
