# Invented data is allowed in every environment except production

**Date:** 2026-09-22
**Status:** Decided
**Executed:** yes — `App\Support\DemoData`, `DemoDataSeeder`, and three tests
**Area:** Data Model | Process

---

## Problem

[[decisions/product/nothing-false-is-published-to-a-visitor]] says nothing invented is published where an ordinary visitor can reach it, with no exception for defensive purposes. The seeders implemented that by checking `app()->environment('local')` — the laptop, and nowhere else.

That made the home server useless for the thing it exists for. A fresh database has no cities, so the venue form's city dropdown is empty and nothing can be created at all; no products, so no venue page has anything on it; no venues, so the map and the discovery list are blank. Paweł, 22.09: *"I want to test the app on homeserver without spending an hour creating everything by hand."*

The `local` check was never the rule. It was a stand-in for the rule, written when local was the only environment that existed.

## Options considered

Create the data by hand on each environment. Loosen the seeders to name `local` and `preprod` explicitly. Ask what the rule is actually protecting and gate on that instead.

## Decision

**The rule is about production, because production is the only environment an ordinary visitor reaches.** `App\Support\DemoData::isAllowed()` returns `! app()->isProduction()`, and that single decision replaces every scattered `environment('local')` check in the seeders.

**`DemoDataSeeder` is the one entry point**, run explicitly and never from `DatabaseSeeder`:

```bash
php artisan db:seed --force --class=DemoDataSeeder
```

It calls `ProducerSeeder`, `ProductSeeder` and `FakeVenueSeeder` — six producers, the catalogue products with their brands, and sixty Warsaw venues across every type and district. It **throws** in production rather than quietly doing nothing, because somebody who types it on the wrong box needs to be told.

`VenueTableSeeder` is deliberately not called: it creates twenty venues of its own with no districts and no coordinates, which duplicates `FakeVenueSeeder` and produces venues the activation gate would keep offline anyway.

## Rules

- Invented data may exist in local, on the home server, and on staging. It may never exist in production, and the guard is `isProduction()` rather than a list of environment names — a list is a thing somebody forgets to add to.
- A seeder that creates invented data calls `DemoData::isAllowed()` or `DemoData::guard()`. It does not read the environment name itself.
- Seeded venues carry coordinates, because a venue without a point never passes [[decisions/product/venue-activation-gate]] and a seeder that produces permanently offline venues is worse than no seeder.
- The canary venues are **not** demo data and keep their own seeder. They are a database-leak tripwire and they run everywhere.

## What this prevents

Prevents an environment that exists to be looked at being impossible to look at. Prevents the `local`-only check spreading further, when what it was standing in for was `not production`. And by making the entry point throw rather than no-op, prevents somebody concluding the seeder is broken when it is actually refusing.

## Revisit when

Staging exists and turns out to want a different fixture set from the home server — at which point this becomes two seeders, not a looser guard.

---

*See also: [[decisions/product/nothing-false-is-published-to-a-visitor]] · [[decisions/product/three-environments-and-what-each-is-for]] · [[decisions/product/staging-is-seeded-never-copied]] · [[decisions/product/venue-activation-gate]]*
