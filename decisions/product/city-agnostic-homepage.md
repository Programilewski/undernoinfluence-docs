# City-Agnostic Homepage Copy

**Date:** 2026-06-28
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** UI/UX | Venues

---

## Problem

The homepage hero had two hardcoded references to "Warszawie" (Warsaw's Polish locative case): the venue count badge ("47 lokali w Warszawie") and the subheadline. V1 launches in Warsaw only, so this feels harmless. But any hardcoded city name is a line of code that must be found and changed for every future city — and Polish grammar requires the locative case form ("Warszawie", not "Warszawa"), which varies per city.

## Options considered

Keep hardcoded "Warszawie" for V1 simplicity and fix at multi-city time. Replace with `$city->name_locative` from the first active city in the database. Add a generic fallback ("w Polsce") that avoids city-specificity entirely.

## Decision

The homepage reads the first active city from the database and uses its `name_locative` attribute for all city references. There are no hardcoded city strings in any public-facing view template — only in legal/address text (UODO's postal address) which is legitimately city-specific.

## Rules

City names in view templates must always come from the `City` model, never from string literals. The `City` model provides `name_locative` (locative case, for "w [city]") and `name_genitive` (genitive case, for "z [city]"). Any new city reference in a view must use one of these attributes. The homepage controller passes `$city = City::active()->first()` — this query is correct for V1 (one city) and multi-city (hero shows the first/primary city).

## What this prevents

Hardcoded city names create a find-and-replace problem at expansion time. More dangerously, they can survive an expansion: if a developer adds Kraków without auditing templates, the Warsaw-branded homepage would serve Kraków users. Using the database as the source of truth means the homepage is automatically correct for whichever city is active.

## Revisit when

Multi-city launch, if the hero needs to show *all* cities rather than the primary one. At that point the homepage controller logic needs to change (pass a collection of cities), but the principle — no hardcoded city strings — stays permanent.

---

*See also: [[decisions/product/osm-dropped]]*
