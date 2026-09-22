# Country names come from ICU, not from a list in the repository

**Date:** 2026-08-31
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** Data Model | UI/UX

---

## Problem

Country names for brands, producers and products came from a 249-entry array checked into `app/Support/CountryCodes.php`. The array was in English. The admin panel is Polish-only, so seven Filament forms and tables offered "Germany", "Czechia" and "United Kingdom" to a Polish operator, and had done since the file was written. The list was also a maintenance liability of the dullest kind: a country renames itself every few years and nothing in the repository would notice.

## Options considered

Translate the existing array into Polish by hand and keep maintaining it. Add a translation package as a dependency. Use PHP's `intl` extension, which ships ICU and its CLDR names, and keep only the codes. Leave it, on the grounds that the audience is one person who reads English.

## Decision

The codes stay in the repository; the names come from ICU at render time, in the application locale. `CountryCodes` keeps the same two-method public interface and gains a small override array for the rare case where CLDR renders a name in a way we would not — currently empty, and an entry in it is a claim that CLDR is wrong for our audience rather than a matter of taste. Options are sorted by the displayed name rather than by code, so the select reads correctly in Polish.

## Rules

There is no fallback to English if `intl` is missing: the extension is required, because a silent fallback is exactly the bug this replaced. Adding a country means adding its ISO 3166-1 alpha-2 code and nothing else. The override array is for names, never for codes, and every entry in it needs a reason recorded beside it. The unit test asserts Polish output and name-ordering, so a locale or ICU change that breaks either is caught rather than shipped.

## What this prevents

It prevents the visible failure — an English word in a Polish interface, in the part of the product used to enter the catalogue that everything else is built on — and the invisible one, which is a hand-maintained list of countries slowly drifting out of date with nobody assigned to notice. It also removes English as a second language the admin panel half-speaks.

## Revisit when

If the application ever serves more than one locale, this becomes free rather than merely correct — the same call returns the right name per locale with no further work. Revisit the override array if a name ICU renders proves confusing in the panel.

---

*See also: [[decisions/product/polish-only-v1]], [[decisions/product/one-vendor-per-system-library]]*
