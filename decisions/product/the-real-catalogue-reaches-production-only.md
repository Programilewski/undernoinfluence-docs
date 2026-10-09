# The real catalogue reaches production only, through the importers, once

**Date:** 2026-10-09 (decided in principle 2026-10-04, journal Decision Register 1; the rehearsal clause corrected 09.10)
**Status:** Decided
**Executed:** partly — the order and its failure handling are tested (`LaunchLoadTest`, 09.10); the load itself happens on launch day
**Area:** Venues | Data Model | Operations

---

## Problem

UNI's catalogue (products, brands, venues and their menus) has to reach production at some point, and there were three ways to do it: a seeder holding the real data, a copy of the home server's database, or the three CSV importers in the admin. The 04.10 journal recommended the importers and said the load would be **rehearsed on the home server with the same files**. That clause was wrong. The home server and the PC are for testing: they carry deliberately odd data (missing fields, strange addresses, broken rows) so the code is tried against what goes wrong. Putting the real 35 venues there would mix real and invented data in the one place where they have to be told apart.

## Options considered

- **A real-catalogue seeder run on production.** Rejected 04.10: two sources of truth the first time an ABV is corrected in the admin, a commit and a deploy for every new drink, hard-coded dates that look like checks nobody made, and it reverses `ProductSeeder` being demo-only.
- **Copying the home server's database.** Rejected: it carries demo data on purpose, and the staging-is-seeded-never-copied record refuses dumps in both directions.
- **The three importers, rehearsed with the real files on the home server first.** The 04.10 recommendation, corrected here.
- **The three importers on production only; the order and the failure handling rehearsed with test data.** Chosen.

## Decision

**The real catalogue goes into production only, once, through the admin importers.** The real files never run on the PC or the home server, and test environments never receive a copy of production's catalogue.

**The order:**

1. **Reference data** (cities, districts, categories, canaries) is there from one `php artisan db:seed --force` after the server's first deploy (runbook 4.17, 7.9; until 09.10 no step said so, and a deploy never seeds). On production it writes nothing else.
2. **Brands, by hand** in the admin (Marki). The products import finds a brand, never creates one (the brand check, 08.10).
3. **Products file.**
4. **Venues file**, with an explicit `slug` on every row (the menus file refers to venues by it).
5. **Coordinates and districts:** select the new venues, bulk action "Geokodowanie (GUGiK)"; the district comes from GUGiK's cadastre.
6. **Menus file.**
7. **Fix the failed rows and import them again**, until each import is clean.

**Nobody approves a venue.** Every imported venue starts as a draft, and the activation gate publishes the ones that end with a point and at least one drink (the venue-activation-gate record). The venues that remain drafts after step 7 are the to-do list: each lacks a point or a menu. Production therefore acts as its own staging area: nothing reaches a visitor half-loaded.

**After the load, the production admin is the only source of truth.** The spreadsheet keeps candidates and rejections. Venues and menus are edited in the admin, never re-imported from an old file.

## What replaces the rehearsal

- **The order and the failure messages** are rehearsed by `LaunchLoadTest`: it seeds what production seeds, runs each file through Filament's own import job and presses the real GUGiK button against the register's response shape. It proves that bad rows land in `failed_import_rows` with a reason, that a wrong order fails row by row and loads cleanly once corrected, that re-importing duplicates nothing, and that only a venue with a point and a menu goes live.
- **The test data on the PC and the home server** exercises the same importers with whatever is meant to break them.
- **The one thing neither can prove is that the real spreadsheet's columns match the importers.** That check is a deploy-checklist row: download each import's example file and compare its headers with the spreadsheet before launch day.

## Rules

- A real venue, menu or product is never imported anywhere but production.
- A row that fails is fixed at its cause (a brand, a product, a spelling, a slug) and re-imported. The importers match on slug, so a second run updates rather than duplicates.
- A venue is never switched on by hand to finish a load; if it is still a draft, it is missing a point or a menu (`tech/venue-visibility.md`).

**Amended 2026-10-09, the same day — no demo seeder on a deployed server.** `DemoDataSeeder` needs a development package that deploys leave out (`--no-dev`, as production), so the home server gets its venues by hand and through the same importers, which exercises them as well. Its one `db:seed` also brings the sample catalogue (about 30 products), which the demo-data-is-allowed-everywhere-except-production record allows there. Local development keeps its fake-data seeders, including twenty edge-case venues built to break things.

## What this prevents

A launch day spent re-typing venues that sat in a database nobody could carry over. Invented venues reaching production through a dump. Real venues becoming indistinguishable from test fixtures. A half-loaded venue, with no pin or no drinks, going public because a file said so.

## Revisit when

The catalogue grows past what one person loads by hand, or owners start supplying their own menus (V2): then imports become routine rather than a one-off, and this record gives way to the ordinary procedure in `ops/adding-a-venue.md`.

---

*See also: [[decisions/product/venue-activation-gate]], [[decisions/product/staging-is-seeded-never-copied]], [[decisions/product/updated-means-vouched-for]], [[decisions/product/venue-data-acquisition-flow]]*
