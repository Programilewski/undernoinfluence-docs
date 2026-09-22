# UNI — V1 Specification (Final)

**Under No Influence** — B2B SaaS directory platform for NoLo (no/low alcohol) beverages targeting HoReCa venues.

**V1 Goal:** Launch a functional directory with 50–100 manually-added Warsaw venues, drive initial end-user traction via Instagram content, validate product-market fit through PostHog analytics and direct user feedback.

**Tech stack:** Laravel monolith, Filament (admin + B2B as separate panels), Livewire 3 (B2C frontend), PostgreSQL + PostGIS, Tailwind CSS, Alpine.js.

**Brand:** Dark-mode UI, `#0D0F14` background, burnished copper `#B87A5E` accent, desaturated sage/slate-blue secondary, Syne Bold headings. Tone: premium, non-preachy, "blend in, not stand out."

---

## 1. Database Schema

### 1.1 Categories

6 categories. Fixed set, admin-managed.

```
categories
├── id (ulid)
├── name (string) — "Piwo", "Wino", "Destylaty", "Koktajle i Mocktaile", "Cydr", "Napoje musujące i Toniki"
├── slug (string, unique) — "piwo", "wino", "destylaty", etc.
├── icon (string) — Lucide icon name (e.g. "beer", "wine", "sparkles"). Rendered in frontend from the icon set. No file upload, no CDN dependency.
├── description (string, nullable) — shown as tooltip on filter pills and on category pages for SEO ("Bezalkoholowe piwa rzemieślnicze i lagerowe")
├── sort_order (integer) — controls pill display order
├── is_active (boolean, default true)
├── created_at / updated_at
```

**Tags are deferred post-V1.** Do not build a tags system, UI filters, or pivot table. At 50–100 venues and ~50 products, tag filtering adds no value for end users. When needed later, it will be a `tags` table with a `product_tag` pivot.

### 1.2 Products (Global Catalog)

Products exist independently of venues. Admin-managed in V1.

```
products
├── id (ulid)
├── name (string) — "Peroni Nastro Azzurro 0.0%", "Oddbird Sparkling Rosé"
├── slug (string, unique)
├── category_id (foreign key → categories)
├── brand (string) — "Peroni", "Oddbird"
├── country_code (char 2, nullable) — ISO 3166-1 alpha-2, e.g. "IT", "SE"
├── abv (decimal 3,1) — 0.0 or 0.5 typically
├── description (text, nullable) — short, shown on venue profile
├── attributes (jsonb, nullable) — category-specific data (beer style, wine color, volume_ml). Don't migrate to columns — too varied per category.
├── image_path (string, nullable) — stored on local disk, served via Laravel Storage
├── is_active (boolean, default true)
├── created_at / updated_at
```

**Notes:**
- No EAN/barcode in V1.
- `abv` allows filtering "0.0% only" vs "low alcohol (≤0.5%)" — useful differentiator.
- Image: one image per product, local filesystem with `public` disk.
- `attributes` JSONB is fine for V1. Filament JSON editor handles it. Example: `{"style": "lager", "volume_ml": 330}` for beer, `{"color": "białe", "grape": "Chardonnay"}` for wine.

### 1.3 Venues

Full address split from day one — no legacy data to migrate.

```
venues
├── id (ulid)
├── name (string) — "Barka Herbarium"
├── slug (string, unique)
├── venue_type (string) — "restauracja", "bar_pub", "kawiarnia", "klub", "hotel", "inne"
├── description (text, nullable) — admin-written or venue-owner-written
├── street_name (string) — "Marszałkowska"
├── street_number (string) — "1/2" (string, not int — handles "12A", "1/2")
├── city (string) — "Warszawa" (plain string, no FK. Cities table is unnecessary at V1 scale — Warsaw only.)
├── district (string, nullable) — "Mokotów", "Śródmieście" — critical for Warsaw UX, SEO, and analytics
├── postal_code (string) — "00-001"
├── voivodeship (string, default "mazowieckie") — needed for future multi-city expansion
├── latitude (decimal 10,7)
├── longitude (decimal 10,7)
├── phone (string, nullable)
├── email (string, nullable)
├── website_url (string, nullable)
├── google_maps_url (string, nullable) — "Otwórz w Google Maps" link on venue profile
├── instagram_handle (string, nullable) — handle only, no URL prefix. Display as link on profile.
├── image_path (string, nullable) — main venue photo
├── opening_hours (jsonb, nullable) — structured: {"pon": {"open": "10:00", "close": "22:00"}, "wt": null, ...}. Null day = closed.
├── is_verified (boolean, default false) — binary checkmark
├── verified_at (timestamp, nullable)
├── last_menu_check_at (timestamp, nullable) — when admin last verified menu data
├── is_claimed (boolean, default false) — venue owner has claimed this listing
├── claimed_by (foreign key → users, nullable)
├── claimed_at (timestamp, nullable)
├── is_active (boolean, default true)
├── source (string, default 'manual') — 'manual', 'claimed', 'imported'
├── created_at / updated_at
```

**Address formatting:** Display as `ul. {street_name} {street_number}, {postal_code} {city}`.

**PostGIS:** Add a `location` geography column (POINT) derived from lat/lng for spatial queries. GiST index. Used for radius search, map bounds queries, and marker clustering.

**No `credibility_score` column.** Verification is binary (is_verified boolean), consistent with the "checkmark yes/no, weights secret" design decision. No numeric scoring.

**No `cities` table in V1.** Warsaw only. `city` is a plain string. When expanding to Kraków/Wrocław, add a cities table then.

### 1.4 Venue–Product Pivot

```
venue_product
├── id (ulid)
├── venue_id (foreign key → venues)
├── product_id (foreign key → products)
├── is_available (boolean, default true) — soft-removal without deleting the relation
├── added_by (string) — 'admin', 'venue_owner'
├── confirmed_at (timestamp, nullable) — last time availability was confirmed
├── created_at / updated_at

unique constraint on (venue_id, product_id)
```

**Freshness is simple.** No `decay_rate` per item, no `status` enum. Freshness is calculated on-the-fly:
- `confirmed_at` within 90 days → fresh (full opacity)
- `confirmed_at` 90–180 days ago → stale (dimmed, "ostatnio sprawdzono X dni temu")
- `confirmed_at` > 180 days or null → expired (strongly dimmed, warning)

One global 90-day threshold. No per-product overrides.

**No `price` column.** Price data requires constant maintenance across hundreds of records. Not worth the overhead in V1.

**No `notes` column.** Seasonal availability notes are a nice-to-have. Defer.

### 1.5 Users

```
users
├── id (ulid)
├── name (string)
├── email (string, unique)
├── password (hashed)
├── role (string, default 'user') — 'admin', 'owner', 'user'
├── email_verified_at (timestamp, nullable)
├── created_at / updated_at
```

**V1:** Single `role` column, no RBAC package. Filament guards handle admin vs owner panel access.

**Auth is owner-only in V1.** End users do not register or log in. Everyone browses freely. Login exists solely for venue owners (claim flow) and admin.

**Future:** When adding favorites, reviews, or social features, add end-user registration and a `user_profiles` table.

### 1.6 Venue Claims

Separate table for audit trail. Not just an `owner_id` on venues.

```
venue_claims
├── id (ulid)
├── venue_id (foreign key → venues)
├── user_id (foreign key → users)
├── status (string) — 'pending', 'approved', 'rejected'
├── verification_method (string) — 'email', 'phone'
├── verification_token (string, nullable)
├── message (text, nullable) — claimant's message to admin ("Jestem właścicielem od 2019")
├── admin_notes (text, nullable) — internal notes on decision
├── reviewed_by (foreign key → users, nullable)
├── reviewed_at (timestamp, nullable)
├── created_at / updated_at
```

On approval: set `venues.is_claimed = true`, `venues.claimed_by = user_id`, notify user by email.

---

## 2. Verified System

Binary checkmark. A venue is verified or not. Inputs disclosed (last menu check date, data source), weights secret.

**V1 implementation:** Manual admin toggle. A venue gets verified when:
- `last_menu_check_at` is within the last 90 days
- At least 3 products are linked
- Admin has manually reviewed the data

Automated scoring is post-V1.

**Freshness display:** Each `venue_product` has `confirmed_at`. Products not confirmed within 90 days are visually dimmed. Breadth bar reflects only fresh products.

---

## 3. Breadth Bars

Per-venue visual indicator showing NoLo offering depth across categories.

**Calculation:** For each venue, count fresh products (confirmed_at < 90 days) per category.

**Display:**
- Horizontal stacked bar or segmented bar using category-associated colors
- All 6 category segments shown
- Filled = venue has ≥1 fresh product in that category
- Width proportional to product count (capped at 5 for visual balance)
- Stale/expired products shown in lighter shade

**V1:** Simple count-based. No weighting, no scoring algorithm.

---

## 4. Admin Panel (Filament)

Separate Filament panel at `/admin`. Requires `admin` role.

### 4.1 Resources

**Categories Resource**
- List: name, icon preview (render Lucide icon), product count, sort order, active toggle
- Create/Edit: name, slug (auto-generated), icon name (text + live preview), description, sort order, is_active
- No delete — only deactivate

**Products Resource**
- List: name, brand, category (filterable), country, ABV, image thumbnail, venue count, active toggle
- Create/Edit: name, slug, category (select), brand, country (select), ABV, description, attributes (JSON editor), image upload, is_active
- Filters: by category, by country, by ABV range (0.0% only / ≤0.5%)
- Bulk action: CSV import (name, brand, category_slug, country_code, abv) for initial data seeding

**Venues Resource**
- List: name, city, district, venue_type, product count, is_verified badge, is_claimed badge, last_menu_check_at, active toggle
- Create/Edit:
  - Basic: name, slug, venue_type (select), description
  - Address: street_name, street_number, city, district, postal_code, voivodeship
  - Coordinates: latitude, longitude + "Fetch from address" button (Google Geocoding API)
  - Contact: phone, email, website_url, google_maps_url, instagram_handle
  - Media: image upload
  - Hours: opening_hours — 7-day grid with open/close time pickers, null = closed
  - Products: relation manager — searchable product picker, add/remove, set confirmed_at
  - Verification: is_verified toggle, last_menu_check_at date picker
  - Metadata: source (read-only), is_claimed (read-only), claimed_by (read-only)
- Filters: by district, by venue_type, by verified status, by claimed status, by "stale data" (last_menu_check_at > 90 days), by "0 products"
- Bulk action: "Mark as checked today" — sets last_menu_check_at to now

**Venue Claims Resource**
- List: venue name, claimant email, status (filterable), created_at
- View/Edit: full claim details, approve/reject actions with admin_notes
- On approve: sets venue.is_claimed, venue.claimed_by, sends notification email

**Users Resource**
- List: name, email, role (filterable), linked venue (if owner), created_at
- Edit: role assignment, basic info
- No user creation from admin — users register via claim flow

### 4.2 Dashboard Widgets

- Total venues (active) / verified / claimed
- Total products (active)
- Venues with 0 products (data quality alert)
- Venues with stale data (last_menu_check > 90 days)
- Pending claims count
- Top 5 venues by product count

---

## 5. B2B Panel (Venue Owners)

Separate Filament panel at `/panel`. Requires `owner` role. Different layout/branding from admin.

### 5.1 Claim Flow

1. End user visits venue profile on B2C frontend
2. Sees "Czy to Twój lokal? Zarządzaj profilem" CTA
3. Clicks → redirected to `/dla-lokali` landing page explaining benefits
4. Registers account → submits claim form (selects verification method: email/phone)
5. Admin reviews in admin panel, approves or rejects
6. On approval: owner gets access to their venue in B2B panel, notification email sent

### 5.2 Available Features

- **Moje miejsce:** venue profile preview. Edit: description, opening hours, phone, email, website, instagram handle, image.
- **Produkty:** add/remove products from global catalog (searchable picker). Each change sets `added_by = 'venue_owner'` and `confirmed_at = now()`.
- **Świeżość:** per-product freshness indicators. "Nadal w ofercie?" per-item confirmation button — updates `confirmed_at`.

### 5.3 NOT in V1 B2B

- Analytics / statistics (no data to show)
- Promotional features
- Staff / multi-user accounts
- Competitor comparisons
- Flag review queue

### 5.4 Permissions

- Venue owners see/edit only their own claimed venues
- Cannot change: address, coordinates, venue_type, verification status, name
- Admin can override all venue owner edits

---

## 6. B2C Frontend (Livewire 3 + Alpine.js)

### 6.1 Pages & Routes

```
/                                → Homepage
/szukaj                          → Search/discovery (map + list + filters)
/miejsce/{venue-slug}            → Venue detail profile
/kategoria/{category-slug}       → Category listing page
/warszawa                        → City page (Warsaw overview)
/warszawa/{district-slug}        → District page
/o-nas                           → About UNI
/kontakt                         → Contact form
/dla-lokali                      → Landing page for venue owners
/regulamin                       → Terms of service
/polityka-prywatnosci            → Privacy policy
/login                           → Auth (owner-only)
```

**URL decision: `/miejsce/{venue-slug}`** — venue slugs live under `/miejsce/` to avoid collision with category or district slugs under `/warszawa/`. Clean, unambiguous, SEO-friendly.

### 6.2 Page Details

**Homepage `/`**
- Hero: tagline + search bar (venue name or district autocomplete)
- Category quick-filters: 6 category icons/pills, clicking navigates to `/kategoria/{slug}`
- "Popularne miejsca w Warszawie" — featured venues grid (admin-curated via sort or by product count)
- Brief "Czym jest UNI?" explainer section
- Footer: about, kontakt, regulamin, polityka prywatności, Instagram link

**Search/Discovery `/szukaj`**
- Desktop: 60/40 split — venue list (left) / map (right)
- Mobile: list view default + FAB toggle to full-screen map with bottom sheet for venue cards
- Filters (sidebar on desktop, drawer on mobile):
  - Category checkboxes (multi-select)
  - District dropdown
  - "Tylko zweryfikowane" toggle
  - ABV filter: "Tylko 0.0%" / "Do 0.5%"
  - Sort: "Najlepsza oferta" (product count) / "Najbliżej" (requires geolocation) / "Nazwa A-Z"
- Venue cards in list:
  - Name, venue_type badge, district
  - Breadth bar (mini)
  - Verified checkmark if applicable
  - Product count: "12 napojów bezalkoholowych"
  - Distance if geolocation enabled
- Map:
  - Leaflet.js + OpenStreetMap tiles (free, no Google Maps cost)
  - Marker clustering (Leaflet.markercluster)
  - Click marker → popup with mini venue card → link to venue profile
  - PostGIS-powered: load venues within current map bounds via AJAX
  - "Szukaj w tym obszarze" button on map pan/zoom

**Venue Detail `/miejsce/{venue-slug}`**
- Venue name, venue_type badge, verified checkmark
- Address (formatted: ul. {street_name} {street_number}, {postal_code} {city})
- "Otwórz w Google Maps" link
- Opening hours (today highlighted, full week expandable)
- Instagram handle (linked)
- Description
- Main image
- Products section: grouped by category headers, each product shows name, brand, ABV. Stale products dimmed.
- Breadth bar (full version)
- "Ostatnio sprawdzono: {date}" — transparency
- "Czy to Twój lokal? Zarządzaj profilem" → link to `/dla-lokali`
- Share button (copy link + native Web Share API on mobile)
- Nearby venues: 3–5 within 1km radius (PostGIS query)

**Category Page `/kategoria/{category-slug}`**
- Category name, icon, description
- Venues that have ≥1 fresh product in this category
- Same card format as search results
- Filterable by district
- SEO title: "Bezalkoholowe {category} w Warszawie — gdzie znaleźć? | UNI"

**City Page `/warszawa`**
- Warsaw NoLo scene overview
- Venue count, category breakdown (how many venues per category)
- Featured venues
- District links (grid of Warsaw districts with venue counts)
- V1: Warsaw only. Schema ready for expansion.

**District Page `/warszawa/{district-slug}`**
- Scoped to district: venue list + map centered on district
- District name, venue count, popular categories here

**For Venue Owners `/dla-lokali`**
- What is UNI, why claim your venue
- Benefits: manage your profile, keep menu fresh, verified checkmark
- How it works: 3 steps (register → claim → manage)
- CTA: "Zarejestruj się i dodaj swój lokal"
- This page provides context for the claim CTA on venue profiles

**Static Pages**
- `/o-nas` — mission, team (or faceless brand story), what UNI does
- `/kontakt` — contact form (sends email to admin), or simple email display
- `/regulamin` — terms of service (required for launch, RODO)
- `/polityka-prywatnosci` — privacy policy (required, RODO)

### 6.3 SEO

**Meta tags per page type:**
- Homepage: "UNI — Bezalkoholowe drinki w Warszawie. Znajdź najlepsze miejsca."
- Venue: "{Venue Name} — bezalkoholowe drinki | UNI"
- Category: "Bezalkoholowe {category} w Warszawie | UNI"
- District: "Bezalkoholowe drinki w {district}, Warszawa | UNI"

**Structured data:** LocalBusiness schema (JSON-LD) on venue pages — name, address, geo, openingHours, url.

**Sitemap:** Auto-generated XML sitemap including all venue, category, city, and district pages. Submit to Google Search Console on launch.

**Open Graph:** og:title, og:description, og:image (venue image or UNI default) on all pages for social sharing.

### 6.4 Mobile

- Mobile-first Tailwind (responsive prefixes, design mobile → up)
- Bottom sheet for venue cards on map view (Alpine.js gesture handling)
- FAB to toggle list ↔ map
- Touch-friendly filter drawer (slide from left/bottom)
- Web Share API for native share on mobile
- No PWA, no app install prompts in V1

---

## 7. Analytics — PostHog

**PostHog is the analytics layer. No custom events table in the database.**

PostHog free tier: 1M events/month — more than enough for V1 scale. Use PostHog JS SDK on frontend, PostHog PHP SDK for server-side events.

### 7.1 Frontend Events (JS SDK)

| Event | Trigger | Properties |
|---|---|---|
| `$pageview` | Auto-tracked | path, referrer, UTM params |
| `search_performed` | Search submitted | query (anonymized), filters, result_count |
| `filter_applied` | Filter changed | filter_type, filter_value |
| `sort_changed` | Sort order changed | new_sort |
| `map_toggled` | List ↔ map switch (mobile) | new_view: "map" or "list" |
| `map_area_searched` | "Szukaj w tym obszarze" | bbox, zoom_level, result_count |
| `venue_card_clicked` | Card click in list/map | venue_id, position, source |
| `venue_viewed` | Venue profile opened | venue_id, source (search/category/direct/map) |
| `venue_directions_clicked` | Google Maps link | venue_id |
| `venue_website_clicked` | Website link | venue_id |
| `venue_instagram_clicked` | IG handle link | venue_id |
| `venue_shared` | Share button | venue_id, method (copy/native) |
| `venue_nearby_clicked` | Nearby venue click | from_venue_id, to_venue_id |
| `category_page_viewed` | Category page | category_slug |
| `claim_cta_clicked` | "Czy to Twój lokal?" click | venue_id |

### 7.2 Server-Side Events (PHP SDK)

| Event | Trigger | Properties |
|---|---|---|
| `claim_submitted` | Claim form submitted | venue_id, user_id |
| `claim_approved` | Admin approves claim | venue_id, user_id |
| `claim_rejected` | Admin rejects claim | venue_id, user_id |
| `product_confirmed` | Owner confirms product | venue_id, product_id |
| `product_added_by_owner` | Owner adds product | venue_id, product_id |
| `product_removed_by_owner` | Owner removes product | venue_id, product_id |

### 7.3 User Properties (set on identify)

- `role` — admin / owner / user (anonymous until login)
- `city` — from geolocation or default "Warszawa"
- `venues_claimed_count` — for venue owners

### 7.4 Key Dashboards to Build

1. **Acquisition:** Traffic sources breakdown (referrer, UTM). Which IG posts drive clicks? Track UTM per post.
2. **Engagement:** Most viewed venues, most used categories, map vs list preference, filter usage.
3. **Retention:** Weekly cohorts — do users come back? Simple pageview-based.
4. **IG → Platform funnel:** IG post (UTM) → site visit → venue view → directions click. This measures whether social content converts.
5. **Venue owner funnel:** Claim CTA view → claim submit → claim approved.

---

## 8. What is NOT in V1

Explicitly deferred:

- **Product tags** — no tags table, no tag UI, no tag filters
- **End-user accounts** — no registration, no login for browsers
- **Favorites / saved venues** — requires user accounts
- **Reviews / ratings** — complex moderation
- **Custom mocktails** — post-V1
- **User flags** (activity-gated) — post-V1
- **Flag review system** — no flags UI or queue
- **Push notifications** — no PWA/native
- **Multi-language** — Polish only
- **Multi-city** — Warsaw only (schema supports expansion)
- **Social media image generator** — manual Canva for 2–3 weeks, then reassess
- **Automated verified scoring** — manual admin toggle
- **B2B analytics for owners** — no data to show
- **Payment / subscription** — free for all
- **API for third parties**
- **Dark/light mode toggle** — dark mode only
- **Price data on venue_product** — maintenance overhead too high
- **Per-product decay rates** — one global 90-day threshold
- **Cities table** — plain string, Warsaw only
- **Venue notes / seasonal availability** — defer

---

## 9. Infrastructure & Deployment

- **Hosting:** Single VPS (Hetzner or DigitalOcean) — sufficient for V1 scale
- **Database:** PostgreSQL 16+ with PostGIS extension
- **Search:** Eloquent full-text search on venue name + district. No Meilisearch/Algolia at this scale.
- **Maps:** Leaflet.js + OpenStreetMap tiles (free). Google Geocoding API for admin address→coordinates only (low volume, free tier).
- **Images:** Local storage (`storage/app/public`). No S3/CDN at V1 scale.
- **Email:** Transactional only — claim notifications, contact form. Mailgun or Postmark free tier.
- **SSL:** Let's Encrypt via Certbot
- **CI/CD:** GitHub Actions — tests + deploy. `php artisan migrate --force && php artisan config:cache && php artisan route:cache`.
- **Monitoring:** Laravel logs, basic health endpoint. PostHog for user-facing analytics. No Sentry in V1 unless free tier covers it.

---

## 10. V1 Launch Checklist

### Data
- [ ] 50–100 venues manually added with real Warsaw data
- [ ] Product catalog populated across all 6 categories
- [ ] All venues have lat/lng coordinates
- [ ] Districts assigned to all Warsaw venues

### Frontend
- [ ] Homepage functional with search, category pills, featured venues
- [ ] Search/discovery page: list + map, filters, sorting
- [ ] Venue detail page: full profile, products by category, breadth bar, nearby venues
- [ ] Category pages with venue listings
- [ ] City and district pages
- [ ] Mobile responsive: FAB toggle, bottom sheet, filter drawer
- [ ] `/dla-lokali` landing page for venue owners

### Admin
- [ ] All Filament resources: categories, products, venues, claims, users
- [ ] Dashboard widgets: counts, data quality alerts, pending claims
- [ ] CSV product import working

### B2B
- [ ] Claim flow end-to-end: register → claim → admin review → approval → panel access
- [ ] Owner can edit profile, manage products, confirm freshness

### Analytics
- [ ] PostHog JS SDK integrated, core events firing
- [ ] UTM tracking set up for Instagram links
- [ ] Key dashboards created in PostHog

### SEO & Legal
- [ ] Meta tags on all page types
- [ ] Structured data (LocalBusiness JSON-LD) on venue pages
- [ ] XML sitemap generated and submitted to Google Search Console
- [ ] Open Graph tags for social sharing
- [ ] robots.txt configured
- [ ] `/regulamin` page live
- [ ] `/polityka-prywatnosci` page live (RODO compliant)

### Performance & Quality
- [ ] Page load < 2s
- [ ] Lighthouse score > 80
- [ ] Tested on Chrome, Safari, Firefox (mobile + desktop)

### Launch
- [ ] Instagram content started (manual Canva, brand-consistent, UTM-tagged links)
- [ ] Google Search Console set up
- [ ] Feedback mechanism: link to Google Form or simple contact form
- [ ] Error monitoring: Laravel logs + health check endpoint
