# Venue URL structure — flat /miejsce/{slug}, no city prefix

**Date:** 2026-05-04
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Superseded:** in part, 2026-09-18 — the slug rule below. The code never did what it said: new venues got the bare name and were renamed the first time their name or street was edited, and the importer matched rows by that bare name, so a chain's locations overwrote each other. See the amendment under Rules.
**Area:** UI/UX | Data Model

---

## Problem

Venue profile URLs need to be stable across the platform's lifetime. If a venue moves cities or UNI expands to multi-city, city-prefixed URLs (`/warszawa/miejsce/bar-kufle`) would break or require 301 redirects. The URL structure also affects SEO — Polish slugs are important for Polish search.

## Options considered

1. **`/{city}/miejsce/{slug}`** — city context in URL, but breaks if venue moves or city slug changes.
2. **`/miejsce/{slug}`** — flat, stable, city-independent. Simpler routing.
3. **`/venues/{slug}`** — English path segment. Loses Polish SEO value.
4. **`/miejsce/{slug}` with `/pl/` locale prefix** — unnecessary for a Polish-only V1, creates ugly URLs.

## Decision

Flat `/miejsce/{slug}` with no city prefix and no locale prefix. Polish slugs for Polish SEO. City context comes from the venue data itself, not the URL. This means no 301 redirects needed during multi-city expansion — a venue's URL is permanent regardless of which city it's in.

## Rules

~~Venue slugs are generated from street name + number (with fallback to venue name). Slugs auto-update when street name changes via model hook, but only if the current slug is a bare-name slug (not already customized).~~ No `/pl/` prefix — unnecessary for a single-locale product.

**Amended 2026-09-18 — a slug is name + street, set once.** Asked on 18.09 whether chains need anything done while it is cheap; testing the importer with three "Semolino" rows at three addresses produced two venues, one location silently overwritten. The rule now, all in `Venue::slugFor()`:

- **At creation, the slug is name + street** — `semolino-pulawska`. The number joins only when two locations share a street (`semolino-pulawska-40`); a numbered suffix is the last resort; a venue with no street yet is addressed by its name. Every venue, not only chains: unrelated places sharing a name — in another city, say — are told apart the same way, and no address depends on the order venues were added in.
- **Nothing renames a slug afterwards.** The automatic upgrade on a street or name edit is gone: on a published venue it broke every link already shared, and nothing redirects an old address. An admin can still change it by hand; the form says what that costs.
- **The importer identifies a venue by an explicit slug, or else by name + street + number + city** — never by name alone. A blank slug cell keeps an existing venue's address. The menu importer already matched by exact slug and did not change.

The admin form no longer fills the slug from the name; left empty on create, the model builds it. Tests: `VenueImporterTest` (a chain, one street, another city, re-import, blank slug, explicit slug), `VenueModelTest`, `AdminCreatesVenueTest`.

## What this prevents

URL instability during multi-city expansion. A city-prefixed URL would mean every venue that changes cities (or every city that gets renamed) needs redirect management — an operational burden that compounds over time.

## Revisit when

Never for the base structure. Add `hreflang` middleware only if/when non-Polish cities are added.

*18.09 decisions in their own records: [[decisions/product/a-venue-is-its-name-at-an-address]].*
