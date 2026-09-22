# Doc 0: App-Wide Flow Overview

How the whole app fits together, before zooming into the discovery map specifically (docs 01-07 cover `/mapa` in depth — this doc is the wider context around it).

---

## The shape of the app

One Laravel 13 app, three "faces" sharing the same models:

1. **Public marketing/discovery site** — Blade + one big Livewire island, no auth.
2. **Owner panel** (`/panel`) — Filament, for venue owners. Not self-service in V1: accounts are created by an admin, there is no public registration and no public claim form (`../decisions/product/admin-recorded-claims-v1.md`).
3. **Admin panel** (`/admin`) — Filament, internal moderation/ops.

Everything funnels through a small set of domain services (`Discovery/*`, `Analytics/*`, `Actions/*`) so both the public controllers and the Filament panels call the same business logic instead of duplicating it.

---

## 1. Bootstrap (`bootstrap/app.php:14-64`)

Read this first — it's the skeleton everything else hangs off:

- Routing: only `web.php` + `console.php`, no `api.php` (this isn't a JSON API app).
- Global middleware: `SetSecurityHeaders` (`app/Http/Middleware/SetSecurityHeaders.php:9`) appends CSP-adjacent headers (HSTS, X-Frame-Options, an `X-Robots-Tag: noai` to opt out of AI-crawler training) to every response.
- `uni_consent` cookie is excluded from encryption — it's read as a plain string by `PostHogService::hasConsent()` and `AnalyticsEventController` to gate all analytics on consent.
- Exception handling: JSON rendering is forced for `/api/*`, `/analytics/*`, or `expectsJson()`; an `AuthorizationException` on `/admin/*` silently redirects home instead of showing a 403 (hides the panel's existence from probing).

---

## 2. Public request flow (`routes/web.php`)

Order matters — the catch-all city routes are deliberately **last** (`routes/web.php:38-48`), constrained by regex (`[a-z][a-z0-9-]*`) so they don't swallow `/mapa`, `/miejsce`, etc.

**`GET /` → `HomeController` (`app/Http/Controllers/HomeController.php:13`)**
Trivial: active categories + first active city + venue count, fires `home_viewed` to PostHog, renders `home`. Smallest controller in the app — good first read.

**`GET /mapa/{city?}` → `Livewire\DiscoveryPage`** — see docs 01-07.

**`GET /miejsce/{venue:slug}` → `VenueController::show` (`app/Http/Controllers/VenueController.php:13`)**
- Route-model-bound by slug.
- `abort_if(!is_active || is_canary, 404)` — canary venues (test/seed data) are invisible on the public site even if active.
- Detects `fromDiscovery` by sniffing the `Referer` header for `/mapa` — cheap attribution, no session state.
- Eager-loads `city`, `districtRelation`, `products.category`, `products.brand`, `drinks`.
- No other venue is loaded: the page shows its own venue only (`decisions/product/venue-page-shows-only-its-venue.md`). `Venue::scopeNearby()` (§5) survives for the owner analytics' area counts.
- Fires `venue.viewed` through `AnalyticsGateway` — wrapped in `AnalyticsFailureReporter::run()` (§4) so an analytics DB hiccup never 500s the page.

**`GET /miejsce/{slug}/go/{type}` → `VenueRedirectController` (`app/Http/Controllers/VenueRedirectController.php:13`)**
Outbound click tracker for `directions|website|instagram|maps`. Rate-limited per `ip|slug|type` (`AppServiceProvider.php:41-48` — comment explains route binding hasn't run yet at limiter time, so it's a raw string not a `Venue`). `resolveUrl()` builds the destination inline (no stored "canonical URL" field) and `safeWebsiteUrl()` guards against bad-scheme stored data. Fires `venue_{type}_clicked` then 302s.

**`GET /kategoria/{category:seo_slug}` → `CategoryController::show`**
Single-category, all-cities-default listing using `Venue::scopeWithFreshProductsForCategory()` (§5) — the shared scope that also powers the SEO city/district/category pages below.

**`GET /{citySlug}`, `/{citySlug}/{districtSlug}`, `/{citySlug}/{categorySlug}`, `/{citySlug}/{districtSlug}/{categorySlug}` → `CityController`**
Four SEO landing-page variants (`app/Http/Controllers/CityController.php`), all the same pattern: resolve city/district/category by slug, `firstOrFail()`/`abort_if(empty)`, query venues, `postHog->capture()`, render a `city.*` view. `category_seo_slug_pattern` in `config/uni.php:52` is a fixed whitelist of six Polish category slugs — this is what disambiguates `/{city}/{category}` from `/{city}/{district}` at the routing layer (`routes/web.php:41`).

**`POST /analytics/events` → `AnalyticsEventController` (`app/Http/Controllers/AnalyticsEventController.php:12`)**
Client-side beacon endpoint (dwell time on venue category tabs / menu). Hard `403` if `uni_consent` cookie isn't `granted` — consent is enforced server-side, not just hidden in the UI. Rate-limited 30/min per user-or-IP.

**`/regulamin`, `/polityka-prywatnosci`, `/jak-to-dziala`, `/o-nas` → `PageController` / `AboutController`**
Static Blade pages, skip these.

**`/sitemap.xml`, `/robots.txt` → `SitemapController` (`app/Http/Controllers/SitemapController.php`)**
Worth reading once: **built fresh on every request as of 2026-08-24** — the 1-hour cache and the `Venue::saved` listener that invalidated it were removed, because there is no crawler traffic yet and `CACHE_STORE=database` made the cache lookup its own query. Builds city×category and district×category pair sets with **two** aggregate queries instead of nested loops (`cityCategoryPairs`/`districtCategoryPairs`, lines 61-77) — a deliberate N+1 avoidance, a pattern worth recognizing elsewhere too.

**`/export/venues.json` → `HoneypotController`**
Fake endpoint, logs a SHA-256'd IP + UA to catch scrapers, always 404s.

---

## 3. `Livewire\DiscoveryPage` — pointer only

Covered in full by docs 01-07. One-line summary for context: `Filters` DTO → `Services\Discovery\VenueQuery::get()` → `MapData::forVenues()` shapes markers → the whole filtered set is fetched (not DB-paginated, since the map needs every matching pin) and sliced in PHP via `visibleLimit` for the list below it.

---

## 4. Analytics architecture — the recurring pattern

This exact triple appears everywhere (`VenueController`, `CategoryController`, `CityController`, `DiscoveryPage`, `AnalyticsEventController`, `ClaimVenue`):

```php
AnalyticsFailureReporter::run($label, fn() => $gateway->doThing(...), $logContext)
```

- **`AnalyticsGateway`** (`app/Contracts/AnalyticsGateway.php`) → two sub-gateways, `venue()` and `discovery()`, each an interface (`VenueAnalyticsGateway`, `DiscoveryAnalyticsGateway`) with one method per tracked event.
- Bound in `AppServiceProvider::register()` (line 27) to `DatabaseAnalyticsGateway` (`app/Services/Analytics/DatabaseAnalyticsGateway.php`) — the concrete implementation is a DB write, not PostHog. This is the swap point if that event stream ever needs to move elsewhere.
- **`AnalyticsFailureReporter`** (`app/Services/Analytics/AnalyticsFailureReporter.php:14`) — catches, logs via `Log::warning('analytics.failure', ...)`, calls `report()` (Laravel's exception reporter), and swallows. **Analytics can never break a page.**
- Separately, **`PostHogService`** (`app/Services/PostHogService.php`) is a *second*, independent analytics path used for simpler one-off `capture()` calls (`home_viewed`, `about_viewed`, `city_viewed`, `claim_submitted`, `user_registered`...). Self-gates on both a config flag and the same `uni_consent` cookie, self-swallows failures via the same `AnalyticsFailureReporter`. So: structured/queryable venue+discovery events → `AnalyticsGateway`/DB; everything else → PostHog directly.

---

## 5. The `Venue` model (`app/Models/Venue.php`) — the hub

Read this fully; almost everything references it.

- **`HAVERSINE_SQL` constant** (line 21) — raw distance-in-km SQL, reused identically in `scopeNearby()` (venue-show "nearby" list) and `VenueQuery`'s `'nearest'` sort. Same formula, two call sites.
- **`booted()` `updating` hook** (line 56): if `name`/`street_name` change and the slug is still the "plain" auto-slug, it silently upgrades the slug to `name-street` to disambiguate two venues with the same name — but only if that string doesn't already exist. This is why some venue URLs have a street suffix and others don't.
- **`is_canary`**: a first-class boolean, filtered out by `scopeActive()` everywhere on the public site (`VenueController`, `VenueRedirectController`).
- **`hasFeature(VenueFeature $feature)`** (line 209): plan-based feature gating with a per-venue override table (`featureFlags` relation) taking precedence over the plan default.
- **Freshness system** — `offer_updated_at` + `freshness_streak_started_at` drive `freshness_state` (`'fresh'|'stale'|'unknown'`, binary at `config('uni.freshness_days')` = 90 days) and `freshness_label` (Polish display string, hidden entirely if `breadth_score === 0`). `markOfferFresh()` is the single write path — called by both observers (§7) whenever a product/drink changes.
- **`breadth_score`**: persisted, not computed on read. Kept in sync by `VenueScoring::recalculate()` (§6), called from both observers and the daily `uni:check-offer-freshness` command as a repair pass (§8) — a "fast path" (observer, on every write) and a "slow path" (cron, catches anything the fast path missed, e.g. writes that bypassed Eloquent events).
- **Scopes** at the bottom are the real query vocabulary: `active`, `search`, `inDistrict`, `withCategories` (special-cases merging catalog products with the `drinki` custom-drinks table, lines 372-393), `withFreshProductsForCategory` (shared by `CategoryController` + all four `CityController` methods), `nearby`.

---

## 6. `Services/Actions/*` — the write-path layer

One invokable-style class per business operation, called from Filament pages/resources instead of putting logic in controllers or fat models.

- **`ApproveVenueClaimAction`**: `DB::transaction` wrapping claim status + venue ownership + user role promotion to `Owner` + audit log — four writes, one transaction, one place. Guards against double-claiming a venue mid-flight.
- **`AttachVenueProductAction`** delegates the actual side effects (freshness touch, audit log, score recalc, `activateIfReady()`) to **`VenueProductObserver`** — because pivot-table attach/detach doesn't fire Eloquent model events, so this observer is called manually rather than being a real Eloquent observer (its own docblock says so).
- **`SubmitProductProposalAction`**: duplicate-name check (case-insensitive, pending-only) before insert, `ValidationException::withMessages()` on conflict — same validation-inside-a-service pattern as `ClaimVenue::submit()` below.
- **`EraseVenueAction`** (GDPR erasure): the `complete()` method is the most defensive code in the app — `lockForUpdate()` inside the transaction, idempotency check (`isCompleted()` short-circuits), collects file paths *before* deleting the DB row so orphaned files can still be cleaned up after commit, and **redacts rather than deletes** audit logs (nulls out the actor/subject but keeps the row with a `redacted: true` marker) — deliberate compliance-vs-audit-trail tradeoff.
- **`GeocodeVenueAction`** — thin wrapper around the `Geocoder` contract (§7), single or batch, applies district lookup by name if the venue doesn't already have one.

---

## 7. Contracts — the swap points

- **`Geocoder`** (`app/Contracts/Geocoder.php`) — implementations `GusGeocodingService` (Polish government address DB) and `NominatimGeocodingService` (OSM). Normalizes both to the same array shape so `GeocodeVenueAction`/`ReverseGeocodeVenueAction` stay provider-agnostic.
- **`AnalyticsGateway`** — covered in §4.

---

## 8. Observers, Policy, Console

- **`VenueDrinkObserver`** — real Eloquent observer (`created`/`updated`/`deleted`), touches freshness + logs to `VenueOfferLog` + recalculates score on create/delete (not on plain update, since breadth doesn't change on an edit).
- **`VenueProductObserver`** — *not* a real observer (see §6), called manually for the pivot table.
- **`VenuePolicy`** (`app/Policies/VenuePolicy.php`) — `before()` short-circuits everything to `true` for admins; every owner-facing ability (`view`, `update`, `delete`, `attachProduct`, `detachProduct`) reduces to `$venue->claimed_by === $user->id`. One invariant to remember.
- **Console** (`routes/console.php` + `app/Console/Commands/`):
  - `uni:check-offer-freshness` (daily; hourly until 2026-08-24) — the repair-pass cron described in §5, three independent fixups (timestamp drift, streak clearing, breadth score drift), each logs a warning if it had to fix anything (so these show up in logs as a signal something upstream skipped the observer path).
  - `analytics:prune-events` (daily), `model:prune` (daily) — retention housekeeping.
  - `RegenerateVenueSlugs` — one-off/manual command, not scheduled.

---

## 9. Filament panels

Both panel providers (`app/Providers/Filament/{Admin,Owner}PanelProvider.php`) are declarative — `discoverResources()`/`discoverPages()`/`discoverWidgets()` auto-register everything under their respective directories, so new resources need no registration step, just the right namespace/folder.

**Admin** (`/admin`, `AdminPanelProvider.php`) — `->default()` panel, standard `Authenticate` middleware. Resources for every core entity (`Venues`, `Products`, `Brands`, `Producers`, `Categories`, `Users`) plus moderation queues: `VenueClaims`, `VenueErasureRequests`, `VenueInaccuracyReports`, `ProductProposals`. `VenueResource` has extra widgets (`VenueAnalyticsWidget`, `VenueMiniMapWidget`, `VenueQuickInfoWidget`) and a dedicated `VenueAnalytics` page, backed by `Services/Analytics/VenueAnalyticsReportService`.

**Owner** (`/panel`, `OwnerPanelProvider.php`) — note the **custom auth middleware**: `PanelAuthenticate` (`app/Http/Middleware/PanelAuthenticate.php:11`) extends Filament's own `Authenticate` and redirects logged-in admins to `/admin` before falling through to normal auth — prevents an admin accidentally sitting in the owner UI. Also requires `EnsureEmailIsVerified`, which the admin panel doesn't.

### The claim flow end-to-end

1. New user signs up → gets default `UserRole` (not owner).
2. `ClaimVenue` page (`app/Filament/Owner/Pages/ClaimVenue.php`) — only shows in nav if the user isn't already an owner and has no pending claim (`shouldRegisterNavigation()`, line 41). Options list explicitly excludes already-claimed venues and venues with a pending/approved claim (line 73-77).
3. `submit()` (line 110) — **re-validates the venue against the DB** rather than trusting the Livewire-bound `venue_id`, with a comment explaining why (client-side state can be tampered with). Wrapped in `DB::transaction`, catches `UniqueConstraintViolationException` for the race where two people claim simultaneously.
4. Admin approves via `ApproveVenueClaimAction` (§6) → user becomes `Owner`, venue gets `claimed_by`, and — notably — `is_active` is set to `false` on approval (`ApproveVenueClaimAction.php:33`), meaning a freshly claimed venue drops off the public site until the owner actively re-publishes/confirms products (`activateIfReady()` in `VenueProductObserver` flips it back on once products exist).
5. Owner manages drinks/products via `DrinksRelationManager`/`ProductsRelationManager`/`FreshnessRelationManager` under `Owner/Resources/VenueResource/`, gated by `VenuePolicy`.
6. Owner can request deletion via `EraseVenueAction::createSelfServiceRequest()` (§6), admin completes it via `EraseVenueAction::complete()`.

---

## Suggested reading order if doing this cold

1. `routes/web.php` + `bootstrap/app.php` (5 min, orients the whole app)
2. `app/Models/Venue.php` (the hub — everything else references it)
3. `app/Http/Controllers/VenueController.php` → `VenueRedirectController.php` (smallest complete request lifecycle)
4. `app/Livewire/DiscoveryPage.php` + `Services/Discovery/*` (the most complex single feature — then read docs 01-07)
5. `Services/Analytics/AnalyticsFailureReporter.php` + `Contracts/AnalyticsGateway.php` (recognize the pattern, then stop noticing it)
6. `Filament/Owner/Pages/ClaimVenue.php` → `Services/Actions/ApproveVenueClaimAction.php` (one full write-path, end to end)
7. `app/Console/Commands/CheckOfferFreshness.php` (the "what happens when the fast path is skipped" repair pattern, which recurs conceptually elsewhere)
