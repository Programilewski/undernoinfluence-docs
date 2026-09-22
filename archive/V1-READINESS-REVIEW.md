# V1 Readiness Review — Under No Influence

**Date:** 2026-04-29
**Reviewer:** Claude (paired with founder)
**Verdict:** Functionally complete. Not launch-ready yet.

All 7 build stages are done. The architecture is sound — city/district models are database-driven, routes are generic (`/{citySlug}/{districtSlug}`), and the CityController pulls everything dynamically. But there's a layer of hardcoded Warsaw copy in the templates that signals "this is a Warsaw-only app" to users, plus several operational gaps that would bite on launch day.

---

## 1. The Warsaw Problem

### What's already multi-city ready

The backend is prepared for expansion:
- `cities` table with 25 Polish cities seeded (`database/seeders/CitiesSeeder.php`)
- `city_id` FK on venues
- Generic `/{citySlug}` and `/{citySlug}/{districtSlug}` routes
- CityController and city/district views use `$city->name` dynamically
- District filter on discovery page is dynamically populated from `Venue::active()->withDistrict()->distinct()->pluck('district')` — no hardcoded district list in the UI

### What's hardcoded to Warsaw

12+ user-facing references to "Warszawie" / "Warszawa":

| File | Line(s) | What | Fix effort |
|---|---|---|---|
| `resources/views/home.blade.php` | 4, 7, 10, 11, 29 | Title, meta description, OG tags, hero tagline — all say "w Warszawie" | Medium |
| `resources/views/home.blade.php` | 212 | Category tile heading: `{{ $category->name }} bezalkoholowe w Warszawie` | Low |
| `resources/views/home.blade.php` | 291–298 | Hardcoded link to `route('city.show', 'warszawa')` with text "Przegląd Warszawy" | Low |
| `resources/views/categories/show.blade.php` | 3, 6, 10, 34 | Title, meta, OG, heading — all say "w Warszawie" | Medium |
| `resources/views/livewire/discovery-page.blade.php` | 5, 13 | Meta description, OG title — "w Warszawie" | Low |
| `app/Livewire/DiscoveryPage.php` | 115 | `City::active()->where('slug', 'warszawa')->first()` hardcoded default | Low |

### Recommended fix

Add `config('uni.default_city_slug', 'warszawa')` and pull the city model in routes/controllers that need it. Replace the 12 hardcoded strings with `$city->name` or a generic "w Polsce" where city context is unavailable (like category pages which aren't city-scoped). Estimated effort: ~2 hours.

This isn't about multi-city engineering — it's about not baking a single-city assumption into the user's mental model on day one.

---

## 2. Hardcoded Values That Should Be Config

### 90-day freshness threshold (HIGH priority)

The number `90` appears as a magic number in **8 places**:

| File | Line | Context |
|---|---|---|
| `app/Models/Venue.php` | 93 | `freshnessState()` — `$days <= 90 => 'fresh'` |
| `app/Http/Controllers/CategoryController.php` | 14 | `Carbon::now()->subDays(90)` |
| `app/Filament/Panel/Resources/VenueResource/RelationManagers/ProduktyRelationManager.php` | 56 | `$state->gt(now()->subDays(90))` |
| `app/Filament/Panel/Resources/VenueResource/RelationManagers/SwiezoscRelationManager.php` | 49, 61 | Freshness colour + label |
| `app/Filament/Widgets/StatsOverview.php` | 29, 52 | Stale venues count + description |
| `app/Filament/Panel/Widgets/VenueStatusWidget.php` | 32 | Stale products pivot query |
| `app/Filament/Resources/Venues/Tables/VenuesTable.php` | 56 | Last menu check colour |
| `app/Filament/Resources/Venues/RelationManagers/ProductsRelationManager.php` | 56 | Confirmed_at colour |

**Fix:** Create `config('uni.freshness_days', 90)` and `config('uni.staleness_days', 180)`. Replace all 8 occurrences. Single source of truth, adjustable without code changes.

### Other hardcoded values (LOW priority, fine for V1)

| Value | Where | Notes |
|---|---|---|
| 180-day stale threshold | `Venue::freshnessState()` | Extract alongside the 90-day fix |
| Poland map bounds `[[49.0, 14.1], [54.9, 24.2]]` | `discovery-page.blade.php` lines 312, 407 | Fine for V1 (Poland-only). Extract to config if going cross-border. |
| `drinkAvailability()` formula `min($count * 25, 100)` | `Venue.php:110` | Documented as placeholder in SCORING.md. Acceptable for V1. |
| Nearby radius 1.0 km | `VenueController.php:23` | Works for dense cities. May need config for smaller towns. |

---

## 3. Launch Blockers

Items that must be resolved before real users see the app:

### 3.1 No real venue data
**Status:** 30 fake + 5 dev venues. Spec says 50–100 real Warsaw venues.
**Impact:** The app is empty. No value for visitors.
**Fix:** Manual data entry through admin panel. This is an ops task, not a code task.

### 3.2 SMTP not configured
**Status:** Claim flow sends emails via `notify()` — they go nowhere.
**Impact:** Venue owners who register and claim can't receive approval emails. The entire B2B flow is broken.
**Fix:** Configure Mailgun/Postmark/SES in `.env`. Test with a real claim.

### 3.3 Frontend build not compiled
**Status:** Multiple sessions of CSS changes (drink colour renames, progress bar animation, category pill styles) not compiled to `public/build/`.
**Impact:** Production users would see stale CSS.
**Fix:** `npm run build`. May need `sudo chown` on `public/build/` first (EACCES error reported in session backlog).

### 3.4 No `og:image` social preview
**Status:** No image set on homepage, discovery page, or B2B landing page.
**Impact:** Social shares (Instagram, Facebook, WhatsApp) show no preview image. Bad first impression for a visual brand.
**Fix:** Design a 1200x630 social preview image. Set as default `og:image` in layout or per-page.

### 3.5 No VenuePolicy on owner panel
**Status:** Owner panel uses query scoping only (`$query->where('claimed_by', auth()->id())`). No Laravel Policy.
**Impact:** An owner could theoretically craft a URL to access another owner's venue edit page if the Filament resource doesn't guard properly.
**Fix:** `php artisan make:policy VenuePolicy` with `view`, `update` checks. Register in AuthServiceProvider.

---

## 4. Things That Are Fine for V1

These were reviewed and don't need changes before launch:

- **District filter UX** — dynamically populated from data, no hardcoded lists in the UI
- **Category system** — config-driven via `config/drinks.php`, slugs match DB after the koktajle->drinks / destylaty->spirits rename
- **Map implementation** — Leaflet + OSM, free, works well, dark/light tile swap
- **Scoring placeholder** — SCORING.md documents the real system, code has a simple formula. Honest V1 approach.
- **Honeypot/canary system** — clever, well-documented in journals and CanarySeeder
- **JSON-LD on venue pages** — good for SEO from day one
- **City/district routes** — generic `/{citySlug}/{districtSlug}` pattern scales to any city
- **PostHog analytics** — comprehensive frontend + server-side event tracking
- **Venue show page** — dynamic city name in meta (`$venue->city?->name`), JSON-LD, correct category colours
- **Claim flow** — functionally complete (pending SMTP)

---

## 5. Minor Issues / Doc Staleness

| Issue | Where | Priority |
|---|---|---|
| PLAN.md still references "Destylaty" / "Koktajle" slugs, but DB now uses "spirits" / "drinks" | `PLAN.md` Stage 1 seeder section | Low — doc-only |
| Spec says ULID, code uses bigint | `inspo/UNI_V1_SPEC_FINAL.md` vs `PLAN.md` decisions | Low — PLAN.md documents the decision, spec is outdated |
| `SCORING.md` references `confirmed_source` column that doesn't exist | `SCORING.md` section 3 | Low — noted as "Schema gaps" in the doc |
| Home route is a closure, not a controller | `routes/web.php:13` | Low — works but won't be cacheable with `route:cache`. Move to a controller before production. |
| Category page empty state | `CategoryController.php` | Low — a category with 0 venues serves thin content. Should 404 or redirect. |
| Competing claims not guarded | `ClaimVenue.php` | Medium — two users can submit pending claims for the same venue. Admin resolves manually for V1. |
| Claim notifications are synchronous | `VenueClaimsTable.php` | Medium — `notify()` blocks HTTP. Fix with `implements ShouldQueue` once queue worker runs. |

---

## 6. Prioritised Action Plan

| # | Action | Type | Effort | Impact |
|---|---|---|---|---|
| 1 | Remove 12 hardcoded "Warszawie" strings, add `config('uni.default_city_slug')` | Code | 2h | Sets multi-city signal from day one |
| 2 | Extract 90/180-day freshness thresholds to config | Code | 1h | Eliminates scattered magic numbers |
| 3 | Seed 50–100 real Warsaw venues with real data | Ops | 4–8h | **The actual launch blocker** — empty app has no value |
| 4 | Run `npm run build` + fix `public/build/` permissions | Ops | 15min | Unblocks all frontend changes from last 4 sessions |
| 5 | Configure SMTP (Mailgun/Postmark/SES) | Ops | 30min | Unblocks entire B2B claim flow |
| 6 | Design + add `og:image` social preview | Design | 1–2h | Required before any social sharing or press |
| 7 | Add `VenuePolicy` to owner panel | Code | 30min | Closes authorization gap |
| 8 | Move home route closure to HomeController | Code | 15min | Enables `route:cache` in production |
| 9 | Add category page empty state (404/redirect) | Code | 15min | Prevents thin content pages |
| 10 | Guard competing claims in `ClaimVenue::submit()` | Code | 30min | Prevents duplicate pending claims |
