# UNI — Implementation Plan

**Single source of truth for V1 build.**
Spec: `inspo/UNI_V1_SPEC_FINAL.md` — read that first for full product context.
This file tracks stages, what's done, what's next, and carry-over decisions.

**Stack:** Laravel 13, Filament v5, Livewire v4, Tailwind v4, PostgreSQL + PostGIS, Alpine.js
**Model IDs:** bigint everywhere (not ULID). Slugs used in all public URLs, IDs never exposed.
**Analytics:** PostHog only. No custom events table.
**Tags:** Deferred post-V1. No `tags` or `product_tag` tables in V1.
**Cities table:** Dropped. `venues.city` is a plain string. Warsaw only for V1.

---

## Stage Status

| Stage | Status | Notes |
|---|---|---|
| 1 — Schema & Models | ✅ Done | migrate:fresh --seed passes. 14 tables. cities/events/tags/product_tag dropped. |
| 2 — Admin Panel | ✅ Done | All 5 resources + StatsOverview widget. VenueController stub updated. |
| 3 — Discovery Page + PostHog base | ✅ Done | Livewire DiscoveryPage at /szukaj, Leaflet + markercluster, PostHog JS SDK, 3 events. |
| 4 — Venue Profile | ✅ Done | /miejsce/{slug} live. Nearby venues via scopeNearby (haversine, 1km). |
| 5 — Homepage & SEO Pages | ✅ Done | Search bar, category pills, featured grid, UNI explainer. /kategoria/{slug}, /warszawa, /warszawa/{district}. |
| 6 — B2B Owner Panel | ✅ Done | /panel live. Registration + claim form. Venue edit (limited). Products + freshness relation managers. Admin approve/reject with email notification. |
| 7 — Full Analytics & SEO | ✅ Done | All PostHog events (frontend + server-side PHP SDK). Spatie sitemap. OG tags on all pages. robots.txt dynamic. |

---

## Stage 1 — Schema & Models

**Goal:** Clean-slate schema aligned with spec. Verified by `migrate:fresh --seed` with zero errors.

### Migrations to create

**Modify existing tables:**
- `categories`: rename `icon_url` → `icon`, add `description` (string nullable), `sort_order` (integer default 0), `is_active` (boolean default true)
- `products`: add `country_code` (char 2 nullable), `abv` (decimal 3,1 default 0.0), `description` (text nullable), `image_path` (string nullable), `is_active` (boolean default true)
- `venues`: full overhaul:
  - Remove: `address` (single string), `city_id` (FK)
  - Add: `venue_type` (string — restauracja/bar_pub/kawiarnia/klub/hotel/inne), `description` (text nullable), `street_name` (string nullable), `street_number` (string nullable), `city` (string default 'Warszawa'), `district` (string nullable), `postal_code` (string nullable), `voivodeship` (string default 'mazowieckie'), `phone` (string nullable), `email` (string nullable), `website_url` (string nullable), `google_maps_url` (string nullable), `instagram_handle` (string nullable), `image_path` (string nullable), `opening_hours` (jsonb nullable), `is_verified` (boolean default false), `verified_at` (timestamp nullable), `last_menu_check_at` (timestamp nullable), `claimed_by` (FK → users nullable), `claimed_at` (timestamp nullable), `is_active` (boolean default true), `source` (string default 'manual')
  - Add PostGIS: `location` geography(Point, 4326) column + GiST index
- `venue_products`: add `added_by` (string default 'admin'), `confirmed_at` (timestamp nullable)
- `users`: add `role` (string default 'user') — values: admin, owner, user

**Tables to drop:**
- `cities` (no FK dependencies once venues.city_id removed)
- `tags`
- `product_tag`
- `events`

**New table:**
```
venue_claims
├── id (bigint, pk)
├── venue_id (FK → venues)
├── user_id (FK → users)
├── status (string) — pending, approved, rejected
├── verification_method (string) — email, phone
├── verification_token (string nullable)
├── message (text nullable)
├── admin_notes (text nullable)
├── reviewed_by (FK → users nullable)
├── reviewed_at (timestamp nullable)
├── created_at / updated_at
```

### Files to delete
- `app/Models/Event.php`
- `app/Models/City.php`
- `app/Http/Controllers/EventController.php`

### Files to update
- `routes/web.php`: remove `/api/track` route. Honeypot route: replace `Event::record(...)` with `Log::warning('bot.honeypot', [...])`
- `app/Models/Venue.php`: remove `city()` BelongsTo, remove `scopeInCity()`, remove `scopeWithTags()`, update `scopeSearch()` to use new address columns, add new relationships/casts
- `app/Models/Product.php`: remove `tags()` BelongsToMany, add new casts (abv)
- `app/Models/Category.php`: add casts for is_active

### Seeders

**CategorySeeder** (production-safe, always runs):
```
1. Piwo          | icon: beer          | "Bezalkoholowe piwa: lager, IPA, kraftowe i bezglutenowe"     | sort: 1
2. Wino          | icon: wine          | "Wino bezalkoholowe i low-alcohol: białe, czerwone, różowe"   | sort: 2
3. Destylaty     | icon: flask-conical | "Giny, whisky i destylaty bez alkoholu"                       | sort: 3
4. Koktajle      | icon: cocktail      | "Mocktaile i koktajle bezalkoholowe — proste i złożone"       | sort: 4
5. Cydr          | icon: apple         | "Cydr bezalkoholowy i napoje jabłkowe"                        | sort: 5
6. Musujące      | icon: sparkles      | "Kombucha, toniki, wody smakowe i napoje musujące"            | sort: 6
```

**ProductSeeder** (dev only — wrapped in `App::environment('local')`):
- 2–3 sample products per category for admin testing
- Not run in production

**No VenueSeeder.** Venues are added manually through the admin panel with real Warsaw data.

### Verification (run after migrate:fresh --seed)
```bash
php artisan migrate:fresh --seed
php artisan db:show --counts
```
Expected: all new tables present, categories table has 6 rows, no cities/tags/product_tag/events tables.

---

## Stage 2 — Admin Panel (Filament)

**Goal:** All Filament resources updated and working. Admin can manage all data.

### Resources to update/create
- **CategoryResource**: icon name field + Lucide preview hint, description, sort_order, is_active toggle
- **ProductResource**: abv field, country_code select (ISO), description, image upload, is_active; filters by category + ABV
- **VenueResource**: full address fields, venue_type select, opening_hours 7-day grid, products RelationManager (with confirmed_at), is_verified toggle, last_menu_check_at, all new fields
- **VenueClaimsResource** (new): queue view, approve/reject actions, admin_notes
- **UsersResource** (new): list + role assignment

### Dashboard widgets (6)
- Total active venues / verified count / unclaimed count
- Total active products
- Venues with 0 products (data quality alert)
- Venues with stale data (last_menu_check_at > 90 days or null)
- Pending claims count

---

## Stage 3 — Discovery Page + PostHog base

**Goal:** `/szukaj` working with map + list + filters. PostHog tracking pageviews.

### URL changes
- New route: `GET /szukaj` → discovery Livewire page
- Redirect: `GET /venues` → `/szukaj` (301)
- Keep `/venues/{slug}` working until Stage 4 is live

### Livewire component: `DiscoveryPage`
- Server-side GET filtering: category (multi), district (single), verified toggle
- Venue list with cards: name, venue_type badge, district, mini breadth bar, verified checkmark, product count
- Result count: "22 lokale"
- Sorting: "Najlepsza oferta" (product count desc), "Najbliżej" (requires geolocation), "Nazwa A-Z"

### Map (right pane / full-screen mobile)
- Leaflet.js + OpenStreetMap tiles (free, no Google Maps billing)
- Marker clustering (Leaflet.markercluster)
- Click marker → popup with mini venue card → link to profile
- PostGIS bounding box query for "Szukaj w tym obszarze"
- `wire:ignore` wrapper to protect map from Livewire DOM diffs

### Mobile
- Full-screen list default
- FAB pill: "🗺️ Mapa" / "📄 Lista"
- Filter drawer (slide from bottom)
- Map lazy-loads on first FAB tap

### PostHog base (do this in Stage 3, not Stage 7)
- Add PostHog JS SDK to `layouts/app.blade.php` `<head>`
- Automatic `$pageview` tracking
- Fire these 3 events manually: `venue_card_clicked`, `filter_applied`, `map_area_searched`
- Set up PostHog project, get API key, add to `.env` as `POSTHOG_KEY`

---

## Stage 4 — Venue Profile

**Goal:** `/miejsce/{slug}` fully built.

### URL changes
- New route: `GET /miejsce/{slug}` → VenueController@show
- Redirect: `GET /venues/{slug}` → `/miejsce/{slug}` (301)

### Page content
- Header: name, venue_type badge, verified checkmark (if is_verified)
- Address formatted: `ul. {street_name} {street_number}, {postal_code} {city}`
- "Otwórz w Google Maps" link (google_maps_url)
- Opening hours: today highlighted, full week expandable
- Instagram handle as link
- Description
- Main venue image
- Products grouped by category (only present categories — no greyed-out)
- Breadth bar per category: width ∝ product count, single accent color (#B87A5E), fresh products only
- Freshness: products with confirmed_at > 90 days visually dimmed + "ostatnio sprawdzono X dni temu"
- "Ostatnio sprawdzono: {last_menu_check_at}" line at bottom of products
- Nearby venues: 3–5 within 1km, PostGIS `ST_DWithin` query
- Share button: copy link + Web Share API
- "Czy to Twój lokal? Zarządzaj profilem" CTA → `/dla-lokali`

---

## Stage 5 — Homepage & SEO Pages

**Goal:** All B2C pages live except owner flow.

### Pages
- **`/`** — hero + search bar, 6 category pills, featured venues grid (top by product count), UNI explainer
- **`/kategoria/{slug}`** — venues with ≥1 fresh product in category; SEO title "Bezalkoholowe {category} w Warszawie | UNI"
- **`/warszawa`** — city overview: venue count, category breakdown, district grid with counts
- **`/warszawa/{district-slug}`** — scoped list + map for that district
- **Static pages cleanup**: `/o-nas`, `/dla-lokali`, `/jak-to-dziala`, `/regulamin`, `/polityka-prywatnosci`

---

## Stage 6 — B2B Owner Panel

**Goal:** Venue owners can claim and manage their listing.

### Filament panel: `/panel` (separate from `/admin`)
- Guard: `owner` role only
- Resources:
  - **Moje Miejsce**: venue edit (limited fields: description, hours, phone, email, website, instagram, image). Cannot edit: name, address, venue_type, is_verified.
  - **Produkty**: add/remove from global catalog (searchable picker), sets added_by='venue_owner', confirmed_at=now()
  - **Świeżość**: per-product freshness bars, "Nadal w ofercie?" per-item button → updates confirmed_at

### Claim flow
1. Venue profile → "Czy to Twój lokal?" CTA
2. `/dla-lokali` landing page
3. Register account → submit claim form (venue selection, verification method: email/phone, message)
4. Admin reviews in VenueClaimsResource → approve/reject
5. On approve: `venues.is_claimed = true`, `venues.claimed_by = user_id`, `venues.claimed_at = now()`, email notification
6. Owner now has access to `/panel`

---

## Stage 7 — Full Analytics & SEO

**Goal:** Complete PostHog instrumentation + SEO ready for Google indexing.

### PostHog — remaining frontend events
All events from spec §7.1:
- `venue_viewed`, `venue_directions_clicked`, `venue_website_clicked`, `venue_instagram_clicked`, `venue_shared`, `venue_nearby_clicked`
- `search_performed`, `sort_changed`, `map_toggled`
- `category_page_viewed`, `claim_cta_clicked`

### PostHog — server-side events (PHP SDK)
- `claim_submitted`, `claim_approved`, `claim_rejected`
- `product_confirmed`, `product_added_by_owner`, `product_removed_by_owner`

### SEO
- Meta tags (title, description, og:*) on all page types
- JSON-LD LocalBusiness on venue pages
- XML sitemap via Spatie Sitemap (venues + categories + districts)
- robots.txt
- Google Search Console setup

---

## Key Decisions Log (don't re-debate these)

| Decision | Choice | Reason |
|---|---|---|
| ID type | bigint (not ULID) | Slugs in URLs, bigint in DB, no public ID exposure |
| Analytics | PostHog only | No custom events table — redundant, less capable |
| Tags V1 | Dropped entirely | Dead schema = tech debt from day zero |
| Cities table | Dropped | Warsaw only, `venues.city` plain string |
| Verified system | Binary admin toggle | No automated scoring in V1 |
| Address | Split columns | District enables Warsaw analytics/SEO |
| Venue seeding | None | Real data added manually through admin |
| Tag tables | Dropped | Not deferred-but-kept — actually removed |
| Events table | Dropped | PostHog replaces entirely; honeypot → Log::warning() |
| PostHog timing | Stage 3 base, Stage 7 full | Don't lose testing data during Stage 3–6 |
| B2B auth | Owner-only login | End users browse anonymously in V1 |
| Pay-to-rank | Never | Core integrity commitment, not a V1 constraint |

---

## Carry-over Tech Debt (post-V1)

- ULID migration for all tables
- Tags system (tags table, product_tag pivot, UI filters)
- End-user registration (favorites, history)
- Automated credibility scoring (replace manual is_verified toggle)
- Per-product decay rates (currently one global 90-day threshold)
- Custom mocktail submission flow
- B2B analytics tier (PostHog data → owner dashboard)
- Multi-city expansion (cities table returns when needed)
- Price data on venue_product
- Push notifications / PWA

---

*Last updated: 2026-04-23 | All 7 stages complete — V1 build done*
