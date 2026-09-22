# Business Requirements Document — Under No Influence (UNI)

**Version**: 1.0  
**Date**: 2026-06-19  
**Author**: Pawel Milewski (Solo Founder)  
**Status**: Pre-Launch (V1 Warsaw)  
**Review Cycle**: After each major phase gate (V1 live, V2 owner activation, V3 multi-city)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Business Objectives](#3-business-objectives)
4. [Market Context](#4-market-context)
5. [User Types & Personas](#5-user-types--personas)
6. [Business Assumptions & Risks](#6-business-assumptions--risks)
7. [Scope](#7-scope)
   - 7.1 [V1 In-Scope](#71-v1-in-scope)
   - 7.2 [V1 Out-of-Scope](#72-v1-out-of-scope)
8. [Functional Requirements](#8-functional-requirements)
   - 8.1 [Discovery (Browse)](#81-discovery-browse)
   - 8.2 [Venue Profile](#82-venue-profile)
   - 8.3 [Static Content Pages](#83-static-content-pages)
   - 8.4 [Venue Data Model](#84-venue-data-model)
   - 8.5 [Scoring & Credibility](#85-scoring--credibility)
   - 8.6 [Analytics Infrastructure](#86-analytics-infrastructure)
   - 8.7 [Admin Panel](#87-admin-panel)
9. [Non-Functional Requirements](#9-non-functional-requirements)
10. [Data Model](#10-data-model)
11. [Business Rules](#11-business-rules)
12. [Compliance & Legal](#12-compliance--legal)
13. [Success Metrics](#13-success-metrics)
14. [Roadmap](#14-roadmap)
15. [Pre-Launch Blockers](#15-pre-launch-blockers)
16. [Technical Debt Register](#16-technical-debt-register)
17. [Appendix](#17-appendix)

---

## 1. Executive Summary

**Under No Influence (UNI)** is a no/low-alcohol (NoLo) venue discovery platform for the Polish HoReCa (hotel/restaurant/café) market. It solves a dual problem: consumers cannot reliably find alcohol-free-friendly venues, and venues have no credible channel to communicate their NoLo offering.

UNI is a **browse-only directory** at launch (V1), serving anonymous users who want to find venues with verified alcohol-free menus in Warsaw. The platform is neutral — no advertising, no paid placements, no sponsor influence. Its credibility comes from data depth and freshness, not marketing claims.

**The long-term play is B2B**: venue owners who see search demand for their category become the paying customers, purchasing analytics and self-service tools. The public-facing directory is the demand aggregator that makes the B2B pitch credible.

| | |
|-|-|
| **Launch target** | June 2026 |
| **Launch market** | Warsaw, Poland |
| **V1 user flow** | Browse → Filter → View venue → Outbound click (directions / website / Instagram) |
| **Monetization** | Not in V1. Owner analytics tiers in V2 (2027). |
| **Founder** | Solo (technical + business) |
| **Tech stack** | Laravel 13, FilamentPHP, Livewire 4, Tailwind CSS 4, PostgreSQL |

---

## 2. Problem Statement

### Consumer Side

Consumers who actively reduce or avoid alcohol ("sober-curious" and "straight-edge" alike) have no reliable way to know whether a given venue has meaningful alcohol-free options before walking in. Existing tools — Google Maps, TripAdvisor, Yelp — answer "does this place serve food?" but not "how many 0% beers are on tap?" or "can I get a NA wine here?". The result: wasted visits, social friction (being the only person unable to order what you came for), and a chilling effect on going out at all.

**The core frustration**: "I don't know if they'll have anything I can drink, so I just don't go."

### Venue Side

Venues that invest in building NoLo menus have no cost-effective way to communicate this to the right audience. Standard social media posts about NA drinks reach their existing followers — not people actively searching for that offering. The demand signal exists (IWSR: 15-20% of consumers are actively NoLo) but the venue's investment goes mostly unnoticed.

**The core frustration**: "We have eight great 0% beers and barely anyone knows it."

### The Gap

No tool in Poland today maps verified, depth-scored NoLo offerings to venue discovery. UNI fills this gap.

---

## 3. Business Objectives

### Primary (V1)

| ID | Objective | Measurement |
|----|-----------|-------------|
| BO-01 | Validate consumer demand for NoLo venue discovery | >1,000 unique visits in first 6 weeks |
| BO-02 | Build a trusted, manually-curated venue database for Warsaw | 50–60 verified Warsaw venues at launch |
| BO-03 | Demonstrate the B2B value proposition to early venue owners | >5 inbound claim inquiries post-launch |
| BO-04 | Establish UNI as a credible data authority (no paid placements, no bias) | Zero complaints about neutrality; no advertising dependency |

### Secondary (V1 → V2 Bridge)

| ID | Objective | Measurement |
|----|-----------|-------------|
| BO-05 | Achieve SEO visibility for long-tail NoLo search queries | ≥1 keyword ranked page 1 within 3 months |
| BO-06 | Build social proof via Instagram content strategy | ≥500 Instagram followers; 3×/week carousel cadence maintained |
| BO-07 | Convert organic venue discovery into owner conversations | >30% of venues claimed within 6 months of launch |

### Phase Gate to V2

V2 (owner self-service + monetization) unlocks when: Warsaw has ≥100 venues, ≥30 are claimed, and there are ≥3 organic inbound requests from venues in a second Polish city.

---

## 4. Market Context

### NoLo Market in Poland

- **Global NoLo CAGR**: ~14% (IWSR 2024–2028 forecast)
- **Poland 2024 penetration**: 12–15% of adult consumers actively seeking NoLo options in on-premise settings
- **Dominant categories by consumer preference**: Beer (widest choice) → Wine (growing fastest) → Cocktails/mocktails
- **Demographic skew**: Gen Z and younger Millennials over-represented; not exclusively "non-drinkers" — includes designated drivers, pregnant women, fitness-focused consumers, and social drinkers managing intake
- **On-premise context**: Venues are the "experience" play; home NoLo consumption is growing but lacks social dimension UNI addresses

### Competitive Landscape

There is no direct Polish competitor for verified NoLo venue discovery. Indirect competitors:

| Competitor | What they do | UNI's edge |
|------------|-------------|------------|
| Google Maps | Points of interest, reviews | No NoLo filter; no menu depth; no freshness |
| TripAdvisor | Hospitality reviews | Menu data absent; no NoLo concept |
| Pyszne.pl / Bolt Food | Delivery from restaurants | Delivery-only; no sit-down discovery |
| Vivino / Untappd | Product discovery (bottles/cans) | No venue map; no location-based discovery |
| General venue directories | Lists bars/restaurants | No NoLo signal whatsoever |

**UNI's defensible position**: data depth (breadth score per category), freshness guarantee (decay-based trust), and owner verification make the dataset intrinsically hard to replicate at scale without the relationships UNI builds through the claim process.

---

## 5. User Types & Personas

### 5.1 Visitor (Anonymous, V1)

**Who they are**: Any adult who lands on UNI, likely via Google search ("bary bezalkoholowe warszawa"), Instagram, or word of mouth.

**What they need**:
- Find venues with their preferred NoLo category (beer, wine, cocktails)
- See whether the venue has real depth (not just "one token option")
- Navigate to the venue (directions, website, Instagram) without friction

**V1 journey**:
1. Land on homepage or city/category landing page
2. Arrive at interactive map/list
3. Filter by category (e.g., "piwo bezalkoholowe")
4. Click venue card → profile page
5. Tap outbound link (directions / website / Instagram)

**Not in V1**: Account creation, saved venues, submitting corrections.

---

### 5.2 End User (Registered, V1.5+)

**Who they are**: Returning visitors who want to save favourite venues, submit corrections, or set preferences.

**What they need**:
- Saved venue collections ("going out this Friday" shortlist)
- Ability to flag stale data
- Personalised history (visited, want to visit)

**Deferred rationale**: V1 validates whether demand exists before taking on GDPR complexity of user accounts.

---

### 5.3 Venue Owner (B2B, V2)

**Who they are**: Owner or manager of a venue listed on UNI who wants control over their profile and access to demand analytics.

**What they need**:
- Claim their venue (verified ownership)
- Update menu accuracy themselves (instead of relying on UNI admin)
- See how many people searched for their category in their district
- Use UNI demand data to justify expanding their NoLo menu

**V1 interim**: Email-only onboarding for first ~20–30 owners. No self-service panel.

**V2 requirements**: Claim form, owner login, analytics dashboard, menu editing, B2B pricing tiers.

---

### 5.4 Admin (Founder, Live)

**Who they are**: Pawel, operating the admin panel.

**What they need**:
- Full CRUD over venues, products, brands, categories
- Geocoding (auto-resolve address → coordinates)
- Analytics widgets (venue completeness, view counts, freshness status)
- Claim adjudication (approve/reject ownership requests)
- Moderation tools (inaccuracy reports, erasure requests)

**Panel**: FilamentPHP (`/admin`), Polish language, protected by auth + role check, IP-allowlisted in production.

---

## 6. Business Assumptions & Risks

| ID | Assumption | How to validate | Risk if wrong |
|----|------------|----------------|---------------|
| A-01 | Consumers actively search for NoLo venues locally (not just at home) | V1 organic traffic & discovery event volume | Core thesis fails; pivot to education or B2B-only |
| A-02 | Breadth scoring (8-dot bars) communicates offering depth better than text | CTR on category-filtered venues vs. unfiltered | UX redesign; add text "8 options" fallback |
| A-03 | Owner-verified badge drives trust and increases conversion | Save rate + outbound click rate on verified vs. unverified venues | Drop badge; rely on freshness alone |
| A-04 | Manual curation yields better data quality than bulk import | Inaccuracy report rate; post-visit feedback | Add light scraping layer for menu data augmentation |
| A-05 | Freshness decay (visual pill) reduces frustration | Inaccuracy report volume over time | Increase update cadence; automate freshness checks |
| A-06 | SEO captures long-tail demand better than paid ads at launch | Organic search share of traffic after 3 months | Run limited paid search experiment (PLN 500 test budget) |

---

## 7. Scope

### 7.1 V1 In-Scope

#### Consumer-Facing

- Interactive map and list discovery (`/mapa`, `/mapa/{city}`, `/mapa/{city}/{district}`)
- Category, verified badge, strict-zero, and freshness filters
- Sort by breadth, A–Z, or nearest
- Venue profile pages with menu accordion, freshness pill, breadth dots, and outbound links
- City landing pages, district landing pages, category landing pages (programmatic SEO)
- Static content: homepage, how-it-works, about, terms, privacy policy
- Sitemap (XML) and robots.txt (13 AI bots blocked)
- Silent analytics event capture (POST `/analytics/events`)

#### Data Infrastructure

- Full venue, product, and brand data model (see §10)
- 6 drink categories (piwo, wino, drinki, spirits, cydr, musujące) with SEO slugs, colours, SVG icons
- Canary venue detection (two fictional venues to detect scraping)
- First-party events table + PostHog server-side mirroring

#### Admin

- Filament admin panel (Polish) at `/admin`
- Venue CRUD with geocoding, is_active toggle, admin notes
- Product catalog with global products, brands, producers, ABV trust levels
- Category management (colours, icons, slugs)
- Analytics widgets: completeness dashboard, top venues, freshness status
- Audit log for all admin actions

---

### 7.2 V1 Out-of-Scope

| Feature | Why deferred | Target phase |
|---------|-------------|--------------|
| User accounts (registration, login, password reset) | Validate demand before GDPR burden | V1.5 |
| Saved venues (bookmarks) | Depends on auth; localStorage interim considered | V1.5 |
| Inaccuracy report (public UI) | Backend model ready; no public form in V1 | V1.5 |
| Venue claim form (owner self-service) | Email-only for first 20–30 owners | V2 |
| Owner analytics dashboard | No owners yet; no data to show | V2 |
| Multi-city support (Kraków, Gdańsk etc.) | Warsaw only; flip via env flag when ready | V2+ |
| Venue photos | Columns exist; Filament wiring not complete | V2 |
| Custom drink photos | Placeholder divs live; S3 wiring not complete | V2 |
| Opening hours display | Data model incomplete; call venue for now | V2 |
| Mobile app (iOS/Android) | No validated demand; responsive web first | V3 |
| Internationalization | Polish-only; no i18n framework added | V4+ |
| API access for partners | Build demand signal first | V3 |
| Rarity-weighted breadth scoring | Requires category popularity data | V3 |

---

## 8. Functional Requirements

### 8.1 Discovery (Browse)

**FR-01: Interactive Map**

- Leaflet.js with CARTO dark tile layer
- Renders all active venues as clustered map pins
- 500-venue cap on initial render; async expansion if exceeded
- Syncs with the venue list (pan/zoom updates list; list hover highlights pin)
- Nominatim geocoding for address search

**FR-02: Venue List**

- 24 cards on initial load; "Load more" pagination
- Each card: venue name, type badge, district, category breadth dots (top 2 categories), freshness pill, verified badge (if applicable)
- Click → venue profile

**FR-03: Filters**

| Filter | Type | Options |
|--------|------|---------|
| Category | Multi-select pill | piwo / wino / drinki / spirits / cydr / musujące |
| Verified | Toggle | UNI-verified only |
| Strict zero | Toggle | 0.0% ABV products only |
| Freshness | Select | All / Updated this month / Updated this quarter |

**FR-04: Sort**

| Sort | Logic |
|------|-------|
| Best breadth | Highest breadth score; when category filter active, score for that category |
| A–Z | Alphabetical by venue name |
| Nearest | Distance from user geolocation (permission-gated) |

**FR-05: URL Persistence**

- Filters and sort are reflected in URL query params (`?categories[]=piwo&sort=breadth`)
- Shareable filtered discovery URLs work on page load
- Back button restores filter state

**FR-06: Empty State**

- When filters return zero results, show "Nie znaleźliśmy pasujących miejsc" message
- Suggest removing one filter; do not redirect
- Fire `discovery_empty_results` event (category + city + district captured)

---

### 8.2 Venue Profile

**FR-07: Core Info**

- Name, venue type badge, address with district
- Map pin (static mini-map centred on venue coordinates)
- Phone, website, Instagram links (if present) — all as outbound links (tracked)
- Freshness pill: colour-coded (green = <30d, yellow = 30–90d, red = >90d since `last_menu_check_at`)
- Verified badge: shown only when `is_verified = true`

**FR-08: Menu Accordion**

- Grouped by the 6 drink categories
- Top 3 categories auto-expanded on page load (priority: piwo → drinki → other)
- Each product row: name, brand, ABV, house recipe badge (for `venue_drinks`)
- Products count shown in accordion header

**FR-09: Breadth Visualisation**

- 8-dot bar per category (filled dots = products stocked, up to 8)
- Shown on both venue card (top 2 categories) and venue profile (all categories)

**FR-10: Nearby Venues** — **Withdrawn 2026-09-19.**

A venue's page shows that venue only: no nearby list, no neighbouring pins on its map. Venues are compared on neutral surfaces — the map, city, district and category pages. See `../decisions/product/venue-page-shows-only-its-venue.md`.

**FR-11: Outbound Click Handling**

All outbound links route through `/miejsce/{slug}/go/{type}`:
- `type`: `website`, `instagram`, `directions`, `maps`, `phone`
- Server-side: logs `outbound_click` event then 302 redirects
- Ensures analytics capture without client-side JavaScript requirement

---

### 8.3 Static Content Pages

**FR-12: Homepage (`/`)**

- Hero with value proposition and CTA to discovery
- Problem framing (short, first-person voice)
- How UNI is different (verified data, not advertising)
- CTA to Instagram (social proof during early phase)
- No venue listing on homepage (discovery is behind `/mapa`)

**FR-13: How It Works (`/jak-to-dziala`)**

- Explains filters: what "verified" means, what the freshness pill means, how breadth dots work
- FAQ section covering top 5–7 questions anticipated from first-time users
- CTA to discovery

**FR-14: About (`/o-nas`)**

- Platform mission, not personal builder story
- Contact mechanism (email; no form in V1)
- Link to Privacy Policy and Terms

**FR-15: City / District / Category Landing Pages**

- Programmatic SEO pages targeting search intent like "bary bezalkoholowe warszawa" or "piwo bezalkoholowe mokotów"
- URL pattern: `/{city}`, `/{city}/{district}`, `/{city}/{seo-category-slug}`, `/{city}/{district}/{seo-category-slug}`, `/kategoria/{seo-slug}`
- Each page includes: H1 with location+category, short descriptive text, venue count, link to interactive discovery
- Soft 404 (200 with zero-result messaging) for combos with no venues yet — do not hard 404
- JSON-LD: `LocalBusiness` schema on venue profile; `SearchAction` on homepage

**FR-16: Sitemap & Robots**

- `/sitemap.xml`: venue URLs (dynamic) + city/district/category pages (static) + core static pages
- `/robots.txt`: Disallow all AI training crawlers (13 bots listed), allow standard search bots
- Honeypot: `/export/venues.json` — returns 403 but logs the request IP for scraper detection

---

### 8.4 Venue Data Model

See §10 for full table definitions.

**FR-17: Venue Lifecycle**

| Status | Meaning |
|--------|---------|
| `is_active = false` | Hidden from public. Visible in admin only. |
| `is_active = true` | Live on public site. |
| `is_canary = true` | Fictional venue; used to detect scraping. Never shown to users. |

**FR-18: Product Sources**

| `added_by` value | Meaning |
|-----------------|---------|
| `admin` | Added by UNI admin |
| `venue_owner` | Added by verified owner (V2+) |
| `proposal_approved` | User-submitted, admin-approved (V2+) |
| `seed` | Imported during initial data seeding |

---

### 8.5 Scoring & Credibility

**FR-19: Breadth Score (V1 Placeholder)**

Formula: `min(product_count * 25, 100)`

This is a placeholder. The full scoring model (V3) will incorporate:
- Category rarity weights (NA wine harder to find than NA beer → rarity bonus)
- ABV trust level (verified_zero > under_0.5 > unknown)
- Freshness multiplier (stale menus decay the score)
- Category diversity bonus

For V1, the formula is intentionally simple. Do not expose the raw score to users; only the dot visualisation is shown.

**FR-20: Verified Badge**

- Binary: either UNI team has confirmed the menu (badge shown) or not (no badge)
- Owner self-claim is NOT sufficient for the verified badge in V1
- In V2, owner-verified is a separate badge tier ("Owner Confirmed" vs "UNI Verified")

**FR-21: Freshness Pill**

| Colour | Condition |
|--------|-----------|
| Green | `last_menu_check_at` < 30 days ago |
| Yellow | 30–90 days ago |
| Red | > 90 days ago OR null |

The freshness pill signals to the user how recently someone from UNI checked the menu. It is not a guarantee — the Terms disclose this.

---

### 8.6 Analytics Infrastructure

**FR-22: First-Party Event Capture**

Events are captured server-side (via Livewire component actions and controller middleware) and stored in an `events` table. This is the canonical analytics source.

| Event | Trigger | Key properties |
|-------|---------|----------------|
| `venue_viewed` | Profile page load | venue_id, city, district, source (map/list/direct) |
| `outbound_click` | `/go/{type}` redirect handler | venue_id, type, category context |
| `discovery_search` | Filter applied or search submitted | filters, city, district, sort |
| `discovery_empty_results` | Filter returns zero venues | filters, city, district |
| `category_filter_applied` | Category pill toggled | category, previous filters |
| `map_area_searched` | Map pan/zoom beyond initial bounds | bounding_box |
| `city_viewed` | City landing page load | city |
| `district_viewed` | District landing page load | city, district |
| `venue_saved` | User bookmarks venue (V1.5+) | venue_id, user_id |
| `inaccuracy_report_submitted` | User flags stale data (V1.5+) | venue_id, category, note |
| `venue_claim_submitted` | Owner starts claim (V2+) | venue_id |
| `account_registered` | New user signs up (V1.5+) | user_id, source |

**FR-23: PostHog Integration**

- Server-side PostHog SDK enabled (no client-side JS, no cookie consent required)
- Mirrors all `events` table captures to PostHog for funnel analysis and session replay (post-consent)
- PostHog EU data residency (frankfurt.posthog.com) required for GDPR compliance
- DPA must be signed before public traffic

**FR-24: Venue Stats (Daily Aggregates)**

`venue_stats` table stores daily aggregates per venue:
- `views`: profile page loads
- `direction_clicks`, `website_clicks`, `instagram_clicks`, `maps_clicks`
- `shares`: (future) share button taps
- `card_clicks`: map card or list card clicks

These are the source for B2B owner dashboard in V2.

---

### 8.7 Admin Panel

**FR-25: Venue Management**

- Create / edit / delete venues
- Auto-geocode from address (Nominatim API, fallback to manual coordinate input)
- `is_active` toggle (single publish gate)
- `is_verified` toggle (manual confirmation after menu check)
- Admin notes field (internal; never shown publicly)
- Bulk actions: mass publish, mass archive, export CSV

**FR-26: Product Catalog**

- Global product table (not per-venue)
- Products linked to venues via `venue_products` pivot
- Fields: name, category, brand FK, ABV, `abv_status` (unknown / under_0.5 / verified_zero), country, description
- `is_active` / `is_approved` gates (only approved products appear on public profiles)

**FR-27: Analytics Widgets**

- Completeness dashboard: % of venues with ≥3 products per category
- Freshness status: count of venues by freshness colour bucket
- Top venues by views (last 7 days)
- Inaccuracy reports queue (V1.5+)

---

## 9. Non-Functional Requirements

### Performance

| NFR | Requirement |
|-----|-------------|
| NFR-01 | Discovery page (map + list) must load in < 2s on a 4G mobile connection |
| NFR-02 | Venue profile must load in < 1.5s |
| NFR-03 | Map with ≤500 venues: all pins render in < 500ms after Livewire hydration |
| NFR-04 | Analytics event POST must respond in < 200ms (fire-and-forget; user is not blocked) |
| NFR-05 | Inlined map data (GeoJSON) is acceptable up to ~300 venues; switch to async API beyond that |

### Availability

| NFR | Requirement |
|-----|-------------|
| NFR-06 | 99.5% uptime target (scheduled maintenance excluded) |
| NFR-07 | Admin panel downtime does not affect public site read availability |

### Scalability

| NFR | Requirement |
|-----|-------------|
| NFR-08 | Architecture must support 1,000 venues without code changes |
| NFR-09 | Must support multi-city with a single env flag change (`UNI_MULTI_CITY=true`) |

### Security

| NFR | Requirement |
|-----|-------------|
| NFR-10 | Admin panel IP-allowlisted in production (Tailscale or nginx allowlist) |
| NFR-11 | All HTML inputs sanitised; SVG uploads restricted to admin-controlled content |
| NFR-12 | No PII stored in `events` table; PostHog identify calls contain no sensitive data |
| NFR-13 | HTTPS enforced on all routes; HSTS header set |
| NFR-14 | Content Security Policy header set (no inline scripts; PostHog JS gated behind consent) |

### Accessibility

| NFR | Requirement |
|-----|-------------|
| NFR-15 | WCAG 2.1 AA compliance on all public-facing pages |
| NFR-16 | Map has a text/list fallback (the venue list panel); screen-reader navigable |
| NFR-17 | Colour is never the only conveyor of information (freshness pill has text label too) |

### SEO

| NFR | Requirement |
|-----|-------------|
| NFR-18 | All public pages have unique `<title>` and `<meta description>` |
| NFR-19 | Venue profiles have JSON-LD `LocalBusiness` markup |
| NFR-20 | Sitemap updated automatically when venues are published/unpublished |
| NFR-21 | Core Web Vitals: LCP < 2.5s, CLS < 0.1, FID/INP < 200ms |

---

## 10. Data Model

### Core Tables

#### `venues`

| Column | Type | Notes |
|--------|------|-------|
| `id` | ULID | Primary key |
| `slug` | string | Unique; URL-safe; never changes post-publish |
| `name` | string | Display name |
| `type` | enum | restauracja / pub / bar / inne |
| `city_id` | FK → cities | |
| `district_id` | FK → districts | Nullable |
| `latitude`, `longitude` | decimal | Required for map pin |
| `address` | string | Full street address |
| `phone` | string | Nullable |
| `website_url` | string | Nullable |
| `instagram_url` | string | Nullable |
| `description` | text | Nullable; public-facing |
| `is_active` | boolean | Public visibility gate |
| `is_verified` | boolean | UNI team confirmed the menu |
| `is_canary` | boolean | Scraper detection; never rendered |
| `breadth_score` | integer | 0–100; computed from product count (V1 placeholder) |
| `last_menu_check_at` | timestamp | Drives freshness pill colour |
| `freshness_streak_started_at` | timestamp | Continuous freshness tracking |
| `source` | enum | manual / claim_submission / imported |
| `admin_notes` | text | Internal; never shown publicly |

#### `categories`

| Column | Type | Notes |
|--------|------|-------|
| `id` | bigint | |
| `name` | string | Polish display name |
| `slug` | string | URL slug (e.g. `piwo`) |
| `seo_slug` | string | Long-form SEO slug (e.g. `piwo-bezalkoholowe`) |
| `colour` | string | Hex; used on UI pills and icons |
| `icon_svg` | text | Sanitised SVG |
| `sort_order` | integer | Display order |

#### `products`

| Column | Type | Notes |
|--------|------|-------|
| `id` | ULID | |
| `name` | string | Brand product name |
| `category_id` | FK → categories | |
| `brand_id` | FK → brands | Nullable (house recipes have no brand) |
| `abv` | decimal | Alcohol by volume (0.0–0.5 for NoLo) |
| `abv_status` | enum | unknown / under_0.5 / verified_zero |
| `country` | string | Country of origin |
| `description` | text | Nullable |
| `is_active` | boolean | Global catalog visibility |
| `is_approved` | boolean | Admin-approved before appearing on profiles |

#### `venue_products` (pivot)

| Column | Type | Notes |
|--------|------|-------|
| `venue_id` | FK → venues | |
| `product_id` | FK → products | |
| `is_available` | boolean | Currently stocked |
| `added_by` | enum | admin / venue_owner / proposal_approved / seed |
| `added_at` | timestamp | |

#### `venue_drinks` (house recipes)

| Column | Type | Notes |
|--------|------|-------|
| `id` | ULID | |
| `venue_id` | FK → venues | |
| `name` | string | House recipe name |
| `base_category` | enum | Same 6 categories |
| `description` | text | Nullable |
| `image_path` | string | Nullable; placeholder infrastructure |

#### `events` (append-only analytics)

| Column | Type | Notes |
|--------|------|-------|
| `id` | ULID | |
| `event` | string | Event name (e.g. `venue_viewed`) |
| `properties` | jsonb | Event-specific payload (no PII) |
| `session_id` | string | Anonymous session; no user FK in V1 |
| `occurred_at` | timestamp | |

#### `venue_stats` (daily aggregates)

| Column | Type | Notes |
|--------|------|-------|
| `venue_id` | FK → venues | |
| `date` | date | |
| `views` | integer | |
| `direction_clicks` | integer | |
| `website_clicks` | integer | |
| `instagram_clicks` | integer | |
| `maps_clicks` | integer | |
| `card_clicks` | integer | |

#### Supporting Tables

| Table | Purpose |
|-------|---------|
| `cities` | 25 Polish cities; `is_active` gates browsability |
| `districts` | Warsaw dzielnice (18); expandable per city |
| `brands` | Product brand with FK to producer |
| `producers` | Company behind brands (Poland/Europe focus) |
| `venue_claims` | Owner claim requests (status: pending/approved/rejected) |
| `venue_inaccuracy_reports` | User-flagged stale data |
| `venue_erasure_requests` | GDPR Art 17 right-to-be-forgotten |
| `venue_feature_flags` | Per-venue feature gates |
| `venue_offer_logs` | Audit trail for product add/remove events |
| `audit_logs` | All admin panel actions |
| `users` | Roles: admin / owner / user; auth fields reserved for V1.5+ |

---

## 11. Business Rules

### BR-01: Venue Visibility

A venue appears in public discovery if and only if `is_active = true` AND `is_canary = false`. No other conditions affect visibility in V1.

### BR-02: Freshness Pill Logic

```
if (last_menu_check_at is null OR > 90 days ago) → RED
if (last_menu_check_at 30–90 days ago)            → YELLOW
if (last_menu_check_at < 30 days ago)             → GREEN
```

### BR-03: Breadth Score (V1)

`breadth_score = min(COUNT(active venue_products for this venue) × 25, 100)`

Recalculated on every product add/remove for the venue.

### BR-04: Verified Badge

Only admin can set `is_verified = true`. No auto-verification. In V2, a separate `is_owner_confirmed` field will distinguish owner-claimed from UNI-verified.

### BR-05: Outbound Click Routing

All outbound links (website, Instagram, directions) are routed through `/miejsce/{slug}/go/{type}` for tracking. The redirect is a 302. The server logs the click before redirecting.

### BR-06: Canary Detection

Two canary venues (fictional) are seeded and never rendered. Their `venue_viewed` events or direct URL access is logged as a `canary_triggered` event. Repeated canary access from the same IP is flagged for review.

### BR-07: SEO Slug Stability

`venues.slug` is set on creation and never changed after `is_active = true`. Slug changes require admin override + confirmation. If a slug must change, a 301 redirect is created from the old slug.

### BR-08: Empty Category Page Behaviour

A city/district/category landing page that matches zero active venues returns HTTP 200 with a "no venues yet" message. It does NOT return 404 (to preserve crawl budget and avoid SEO penalties for valid future-use URLs).

### BR-09: AI Crawler Blocking

`robots.txt` disallows 13 AI training and citation crawlers. UNI data is proprietary; it is not available for LLM training or AI-generated citation. Standard search engine bots are allowed.

### BR-10: Age Gate

The platform does not gate by age for V1 (no alcohol is sold; it is a neutral directory). If a future feature requires age verification, the threshold is 18 (Polish Civil Code, contractual capacity), not 16.

---

## 12. Compliance & Legal

### GDPR (Regulation EU 2016/679 / RODO)

| Article | Requirement | Status |
|---------|-------------|--------|
| Art 13 | Inform users of all data processing at point of collection | ✅ Privacy policy live; cookie notice on first visit |
| Art 15 | Right of access to personal data | ✅ Disclosed in privacy policy; email contact provided |
| Art 17 | Right to erasure ("right to be forgotten") | ⚠️ Backend model ready; UI unreachable in V1; email-only |
| Art 20 | Right to data portability | ✅ JSON export at `/profil/dane` (V1.5 when accounts exist) |
| Art 28 | Data Processing Agreements with sub-processors | ⚠️ PostHog EU DPA must be signed before go-live |
| Art 32 | Appropriate technical security measures | ✅ HTTPS, IP-gated admin, no PII in analytics events |
| Art 33 | Breach notification to supervisory authority within 72h | ⚠️ Runbook needed before go-live |

### ePrivacy Directive (2002/58/EC)

| Requirement | Status |
|-------------|--------|
| Session cookies (strictly necessary) disclosed | ✅ Disclosed in privacy policy; no consent banner needed |
| PostHog client-side JS not loaded (no non-essential cookie) | ✅ Server-side only in V1 |
| Marketing emails require unsubscribe | ✅ Disclosed in privacy policy; soft opt-in compliant |

### Polish Law

| Area | Rule | Notes |
|------|------|-------|
| CEIDG cross-reference | Optional enrichment | Used to validate venue ownership for B2B claims; not mandatory |
| Consumer protection (UOKiK) | Standard disclosure | No deceptive commercial practices; neutrality is core brand promise |

### Data Moat Protection

- AI training crawlers blocked via `robots.txt`
- Scraper honeypot (`/export/venues.json`) logs access for detection
- Canary venues detect bulk data theft
- Manual curation (not OSM bulk import) keeps data legally clean post-2026-06-01

---

## 13. Success Metrics

### V1 Launch Metrics (First 6 Weeks Post-Launch)

| Metric | Target | Measured by |
|--------|--------|-------------|
| Unique visitors | > 1,000 | events table / PostHog |
| Venue views per day | > 50 | `venue_viewed` events |
| Outbound click rate | > 15% of venue views | `outbound_click` events |
| Inbound owner inquiries | > 5 | Email inbox / claim form submissions |
| Instagram followers | > 500 | Instagram Insights |
| Carousel cadence | 3× / week maintained | Content calendar |
| Category filter usage | > 40% of discovery sessions | `category_filter_applied` events |
| SEO rankings | ≥ 1 keyword on page 2 within 4 weeks | Google Search Console |

### Retention Metrics (Months 1–3)

| Metric | Target |
|--------|--------|
| Return visitor rate (week-over-week) | > 30% |
| Claimed venue ratio | > 30% of total active venues |
| Inaccuracy report rate | < 5% of venue views |
| Average session duration — discovery | > 2 minutes |
| Average session duration — venue profile | > 1 minute |

### Phase Gate to V2

All three must be true:
1. Warsaw active venues ≥ 100
2. Claimed venues ≥ 30
3. ≥ 3 organic inbound requests from venues in a second Polish city

---

## 14. Roadmap

### V1 — Browse-Only Discovery (June 2026)

Warsaw-only. Anonymous users. Manual curation. Silent analytics. SEO foundation. No auth.

### V1.5 — Light User Features (Q3 2026)

- User registration and login
- Saved venues (localStorage interim → DB)
- Public inaccuracy report form
- Account deletion self-service
- og:image social sharing cards

### V2 — Owner Activation (Trigger: 100 venues + 30 claimed)

- Venue claim form + adjudication workflow
- Owner login and self-service menu editing
- Owner analytics dashboard (impressions, saves, category demand)
- B2B pricing tiers: Basic (free) / Pro (PLN/mo) / Premium (PLN/mo + API)
- Multi-city support (env flag flip + city seed)

### V3 — Scale & Intelligence (Trigger: 3+ Polish cities active)

- Rarity-weighted breadth scoring
- Venue photos (Filament upload + S3)
- Opening hours display
- API access for venue partners
- Mobile app (PWA-first)
- Advanced B2B analytics (cohort, forecast, demand heatmap)

### V4 — Platform (Trigger: Validated B2B revenue, 500+ venues)

- Internationalisation (Czech, Slovak, Hungarian)
- Consumer reviews (separate from data accuracy flags)
- Events feature (NA-themed venue promotions)
- Venue gift cards / B2C marketplace

---

## 15. Pre-Launch Blockers

The following must be resolved before any production traffic is accepted.

| ID | Blocker | Owner | Status |
|----|---------|-------|--------|
| PL-01 | PostHog EU DPA signed | Pawel | ⚠️ Pending |
| PL-02 | Hosting provider DPA confirmed | Pawel | ⚠️ Pending |
| PL-03 | Admin panel IP-allowlisted (nginx / Tailscale) | Pawel | ⚠️ Pending |
| PL-04 | GDPR breach notification runbook created | Pawel | ⚠️ Pending |
| PL-05 | All uncommitted changes committed to git | Pawel | ⚠️ Pending (~43 files) |
| PL-06 | `migrate:fresh --seed` verified on clean DB | Pawel | ✅ Confirmed |
| PL-07 | Full test suite passing (403 tests) | Pawel | ✅ Passing |
| PL-08 | `npm run build` run; production assets committed | Pawel | ⚠️ Pending |

---

## 16. Technical Debt Register

Items accepted into V1 with known limitations. Each must be resolved before the phase that depends on it.

| ID | Item | Priority | Target |
|----|------|----------|--------|
| TD-01 | `map_area_searched` fires twice (server + client) | Low | V2 |
| TD-02 | Homepage mesh animation disabled | Low | V1.5 (if user feedback) |
| TD-03 | "produktów" vs "napojów" label inconsistency on venue tiles | Low | V1.5 label pass |
| TD-04 | Photo upload for custom drinks incomplete | Medium | V2 |
| TD-05 | SVG sanitiser is regex-only (CSS-based XSS not covered) | Low | V2 (if user uploads added) |
| TD-06 | Polish auth notification templates missing | Low | V2 (when auth re-enabled) |
| TD-07 | Brawler font loaded but unused | Low | Next performance audit |
| TD-08 | `venue_type` taxonomy not confirmed with real owner data | Low | Pre-launch data QA |
| TD-09 | Breadth score formula is placeholder (no rarity weighting) | Medium | V3 |
| TD-10 | Map data inlined in HTML (fine to ~300 venues; revisit at scale) | Low | V2 if >300 venues |

---

## 17. Appendix

### A — Route Map

| Method | Pattern | Handler | Auth |
|--------|---------|---------|------|
| GET | `/` | `HomeController@show` | None |
| GET | `/mapa` | `DiscoveryPage` (Livewire) | None |
| GET | `/mapa/{city}` | `DiscoveryPage` (Livewire) | None |
| GET | `/mapa/{city}/{district}` | `DiscoveryPage` (Livewire) | None |
| GET | `/miejsce/{slug}` | `VenueController@show` | None |
| GET | `/miejsce/{slug}/go/{type}` | `VenueController@go` | None |
| GET | `/{city}` | `CityController@show` | None |
| GET | `/{city}/{district}` | `CityController@district` | None |
| GET | `/{city}/{seo-category-slug}` | `CategoryController@cityCategory` | None |
| GET | `/{city}/{district}/{seo-category-slug}` | `CategoryController@districtCategory` | None |
| GET | `/kategoria/{seo-slug}` | `CategoryController@show` | None |
| GET | `/jak-to-dziala` | `PageController@howItWorks` | None |
| GET | `/o-nas` | `AboutController@show` | None |
| GET | `/regulamin` | `PageController@terms` | None |
| GET | `/polityka-prywatnosci` | `PageController@privacyPolicy` | None |
| GET | `/sitemap.xml` | `SitemapController@index` | None |
| GET | `/robots.txt` | `RobotsController@index` | None |
| POST | `/analytics/events` | `AnalyticsController@store` | None (throttled) |
| GET | `/export/venues.json` | Honeypot (logs + 403) | None |
| ANY | `/admin/*` | FilamentPHP | Admin role |

### B — Technology Decisions Log

| Decision | Chosen | Rejected | Reason |
|----------|--------|----------|--------|
| Venue data source | Manual curation | OSM bulk import | ODbL license incompatible with proprietary DB; OSM dropped 2026-06-01 |
| Geocoding | Nominatim (OSM API) | Google Maps Geocoding | Cost; tiles retained free under ODbL (API-only, no data copy) |
| Map tiles | CARTO Dark (OSM-based) | Google Maps, Mapbox | Cost; open license for display |
| Frontend framework | Livewire 4 + Alpine.js | React, Vue | No client-side framework overhead; SSR-first; matches team expertise |
| Admin panel | FilamentPHP | Custom-built | Speed; Polish l10n; Livewire-native |
| Analytics | First-party events + PostHog | Google Analytics | Data ownership; no third-party cookies; GDPR-cleaner |
| URL structure | Flat `/miejsce/{slug}` | `/{city}/miejsce/{slug}` | Avoids 301s on multi-city expansion |
| AI crawler policy | Block all | Allow | Data moat; UNI data not for LLM training |
| Multi-city gate | Env flag (`UNI_MULTI_CITY`) | Feature branch | One-line flip; no code change for expansion |
| Auth in V1 | Stripped (no auth) | Included | Validate demand before GDPR complexity |

### C — Glossary

| Term | Definition |
|------|------------|
| **NoLo** | No/Low Alcohol — beverages with 0.0–0.5% ABV |
| **Breadth score** | 0–100 score indicating depth of a venue's NoLo menu |
| **Freshness pill** | Colour indicator on venue cards showing how recently UNI verified the menu |
| **Verified badge** | Shown when UNI team has physically or digitally confirmed the venue's menu |
| **Canary venue** | Fictional venue seeded to detect bulk data scraping |
| **HoReCa** | Hotel / Restaurant / Café — the hospitality sector |
| **SSOT** | Single Source of Truth — the interactive feature spec at `docs/product/spec.html` |
| **DPA** | Data Processing Agreement — required under GDPR Art 28 for sub-processors |
| **UODO** | Polish data protection authority (Urząd Ochrony Danych Osobowych) |
| **RODO** | Polish name for GDPR (Rozporządzenie o Ochronie Danych Osobowych) |
| **pSEO** | Programmatic SEO — auto-generated landing pages for city/district/category combinations |
| **sober-curious** | Consumer trend: reducing alcohol intake without full abstinence |
