---
description: "When a venue is live: every path that publishes or hides it, what each public surface checks, and the gaps."
version: 1.0
owner: Paweł Milewski
updated: 2026-10-09
status: living — reference
---

# When a venue is live

One place for the whole answer to "why is this venue public, or why isn't it?". Read out of the code on 09.10.2026; every row names where it happens so it can be checked rather than trusted. The decision behind it is the venue-activation-gate record (18.05, amended 12.09–17.09) and its general rule, an-automatic-gate-runs-in-both-directions. `tech/change-flows.md` covers what each panel action sets off; this page follows one flag, `venues.is_active`, through all of them.

**How to keep it true.** A commit that adds a path which creates a venue, changes `is_active` or `switched_off_at`, or changes what a public surface checks, updates this page in the same commit. **Audit it** by re-reading the files named in each table against the rows; the last audit date goes in `updated`.

---

## The rule in one line

**A venue is public when it is ready and nobody has switched it off by hand.** The system decides "ready"; a person decides only the exception.

| Term | Meaning | Where |
|---|---|---|
| **Ready** | Coordinates (`latitude` and `longitude` not null) **and** something to serve: at least one catalogue product or one house drink | `Venue::activateIfReady()`, `Venue::hasSomethingToServe()` |
| **Live** | `is_active = true` and `is_canary = false` | `Venue::scopeActive()` |
| **The lever** | `switched_off_at` set: an admin switched the venue off in the form. The gate never re-publishes it; only switching it on by hand clears the mark | `EditVenue::mutateFormDataBeforeSave()`, `VenueForm` helper text |
| **Canary** | A database-leak tripwire. Never public, never touched by the gate | the nothing-false-is-published record |

Not part of "ready", deliberately or not yet: a district, a description, photos, "Sprawdzona karta", freshness. A stale menu changes what a page *says* (see `tech/freshness-and-verification.md`), never whether it is public.

## The states

| State | `is_active` | `switched_off_at` | How it gets there | What a visitor gets at `/miejsce/{slug}` |
|---|---|---|---|---|
| **Draft** — never public | false | null | Imported, created in the admin form, or not yet geocoded / given a menu | 404 |
| **Live** | true | null | The gate, or an admin switching it on | The venue page |
| **Emptied** — was live, menu now empty | false | null | The gate, on the last item removed, or the hourly net | 404 (decided 09.10, see below) |
| **Switched off** | false | a date | An admin moved the toggle off | 404 (decided 09.10, see below) |
| **Erased** | — (row deleted) | — | An erasure request completed (admin "Zrealizuj", admin "Usuń dane lokalu", owner "Usuń lokal i dane") | 404 (route model binding finds nothing) |
| **Canary** | any | any | Seeder | 404 |

**Draft and Emptied are the same row today.** Nothing records that a venue was ever public except the `audit_logs` visibility rows. Telling them apart (only needed if Decided 1 is revisited) needs a fact such as `first_published_at`.

## What moves a venue between states

### Into Live

| Trigger | What runs | Where |
|---|---|---|
| A catalogue product attached (admin, owner, product proposal approved, menus import) | Menu follow-up step 4 → `activateIfReady()` | `VenueProductObserver::productAttached()` (`:34`) |
| A house drink created | `activateIfReady()` | `VenueDrinkObserver` (`:17`) |
| Coordinates written by geocoding (single or bulk button, any provider) | `activateIfReady()` after the point and, if empty, the district are saved | `GeocodeVenueAction::applyResult()` (`:99`) |
| Hourly net: offline, not a canary, no `switched_off_at`, has a point and something to serve | `activateIfReady()` per venue (so the audit row is written) | `CheckOfferFreshness::activateReadyVenues()` |
| An admin switches the toggle **on** | `is_active` true, `switched_off_at` cleared. **Not gated**: an empty venue switched on goes offline at the next hourly run; one without a point is skipped by the map | `EditVenue::mutateFormDataBeforeSave()` |

`activateIfReady()` returns without doing anything if the venue is already live, carries `switched_off_at`, or lacks either coordinate.

### Out of Live

| Trigger | What runs | Where |
|---|---|---|
| The last catalogue product detached (admin, owner, bulk "Usuń zaznaczone", menus import removal) | Menu follow-up step 4 → `deactivateIfEmpty()` | `VenueProductObserver::productDetached()` (`:53`) |
| The last house drink deleted | `deactivateIfEmpty()` | `VenueDrinkObserver` (`:31`) |
| A catalogue product deleted: its venue links go in the database, where no observer runs | Caught by the hourly net within the hour | `CheckOfferFreshness::takeEmptyVenuesOffline()` |
| An admin switches the toggle **off** | `is_active` false, `switched_off_at` = now. A toggle nobody moved is ignored (the a-control-speaks-only-when-it-is-moved record) | `EditVenue::mutateFormDataBeforeSave()` |
| Erasure | The venue row and everything under it deleted | `EraseVenueAction` |

`deactivateIfEmpty()` does nothing to a venue that is already offline or is a canary.

### Never changes `is_active`

- **Claim approval.** A claimed live venue stays live; a venue created for a new-venue request starts as a draft and goes live through the gate (`ApproveVenueClaimAction`, `:60`).
- **The venues import on an existing venue.** Only a *new* row is forced offline (`VenueImporter::beforeCreate()`), so re-importing a file never takes a live venue down.
- **"Potwierdź" / "Nadal w ofercie" / freshness.** They date the menu; they never publish or hide.

### How a venue is created

| Path | Starts as | Where |
|---|---|---|
| Venues import (new row) | Draft, forced: `is_active` false, `is_verified` false, `source` imported | `VenueImporter::beforeCreate()` |
| Admin form "Utwórz" | Draft: the toggle defaults to off | `VenueForm` |
| A new-venue request from the public form | No venue at all: a `venue_claims` row with `venue_id` null, until an admin creates the venue (→ Admin form) | `VenueRequestController::storeNewVenue()` |
| Demo data | Live | `DemoVenues` (never on production) |

**The database default for `venues.is_active` is true.** Every path above sets it explicitly; any future path that does not will publish its venue unready.

## What each public surface checks

| Surface | Check | Where |
|---|---|---|
| Venue page `/miejsce/{slug}` | `is_active` and not canary, inline, else 404 | `VenueController` (`:22`) |
| Outbound redirects `/miejsce/{slug}/go/{type}` | Same, inline | `VenueRedirectController` (`:15`) |
| Inaccuracy report `POST /miejsce/{slug}/zglos` | Same, inline | `VenueReportController` (`:28`) |
| Map, lists, city / district / category pages, drink and brand pages, sitemap, home | `Venue::active()` | controllers, `SeoCluster`, `AppServiceProvider` |
| Map pins | Additionally skips any venue without coordinates (defence against a venue switched on by hand) | `MapData::forVenues()` |
| Claim search on the public form | `Venue::active()` | `VenueRequestController::storeClaim()` |
| Owner panel status | "Awaiting activation" when offline with nothing on the menu | `VenueStatusWidget` (`:75`) |
| Claim-approved e-mail | Links the public page only if live | `ClaimApproved` (`:66`) |

## What is recorded

Every change of `is_active` writes a `venue_visibility_changed` row in `audit_logs` through `VenueObserver`, with `switched_off_at` in the payload. **A null `actor_id` means the gate or the hourly net did it**; a user id means a person did. This is the only answer to an owner asking why their venue disappeared. The hourly net works venue by venue precisely so that this row exists (a mass update fires no observer).

## Gaps found while writing this

| # | Gap | Effect | Suggested fix |
|---|---|---|---|
| G1 | **Three controllers define "live" inline** instead of using `Venue::active()` | Today they agree; a change to the scope (say, adding a district) would leave the venue page reachable while every list hides it | One definition, used by all three |
| G2 | **`Venue::active()` does not check coordinates**; only the gate and the map do | A venue switched on by hand without a point is in lists and the sitemap with no pin, until the hourly net… which does not take it down, because it only checks the menu | Decide whether the lever may override readiness at all |
| G3 | **A retired product (`is_active` off) still counts as something to serve** — fault 3 in `change-flows.md` | A venue can stay live on a drink whose own page 404s | Covered by fault 3's decision |
| G4 | **District is not part of "ready"** | A live venue with no district is missing from district pages and their counts | Mostly closed 09.10: GUGiK geocoding now fills the Warsaw district from the cadastre. Left: a venue whose cadastre lookup failed. Decide when it is seen in real data |
| G5 | **Some analytics and the freshness score read raw `is_active`** (`VenueAnalyticsReportService`, `CheckOfferFreshness::fixBreadthScores()`), so canaries are counted | Internal numbers only | Use the scope when those files are next touched |
| G6 | **Nothing records that a venue was ever public** | Draft and Emptied cannot be told apart, so they cannot be shown differently | `first_published_at`, only if Decided 1 is revisited |

## Decided

1. **Every venue that is not live returns 404** — Draft, Emptied, Switched off, Erased, Canary alike (decided 09.10.2026; the a-venue-that-is-not-live-returns-404 record). Considered: a 200 page with `noindex, follow` for an Emptied venue (name, district, "we can't currently confirm any non-alcoholic drink here", nearby venues with drinks), and a "closed" page for a switched-off one, which would need a reason recorded with the lever. **Why not now:** for search the two are equivalent — Google drops a 404 and a `noindex` page alike — so the honest page serves only someone who already holds the link, and at launch nobody does. **Revisit when** Search Console shows venue pages as a large share of landings, or its "Not found (404)" report shows `/miejsce/` addresses still being requested. The design above is the starting point; it needs G6. The After-launch row in `roadmap/undone-inventory.md` carries the trigger.
