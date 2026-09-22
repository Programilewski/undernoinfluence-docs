# UNI — Feature Overview & Analysis Sheet

*For offline reading. Last updated 3 May 2026.*

---

## What UNI Is

A venue discovery platform focused on non-alcoholic drink offerings in Polish cities. The core premise: users can find bars, restaurants, and cafes based on the quality and diversity of their alcohol-free menu. Venue owners can claim their profiles and manage their offerings.

---

## 1. Public Discovery

### Search & Filtering (Livewire)
- Real-time search by venue name, street, district, product name
- Filter by drink categories (piwo, wino, spirits, drinki, cydr, musujace)
- Filter by district, verified-only toggle
- Sort: "best" (scoring-based), by name, nearest (geolocation)
- Interactive map with live-updating markers as filters change
- Map-bounds search (zoom into an area to filter)

### Venue Profile Pages
- Full details: address, contact, Instagram, opening hours
- Drink menu grouped by category with product names
- Freshness indicator: how current is this data?
- Nearby venues widget (1km radius)
- "Chunk" visualization on discovery tiles: one square per product, color-coded by category, overflow badge for 8+

### City & District Pages
- City overview with stats: total venues, verified venues, districts, categories
- District pages listing all venues sorted by product count

### Category Pages
- All venues with products in a given category
- Only shows fresh data (confirmed within 90 days)

---

## 2. Scoring System — The Core IP

### Breadth Score
How it works today: counts distinct products per category + custom drinks per base_category. Venues ranked by total breadth, then category diversity as tiebreaker.

**Key insight:** A bar with 2 beers, 2 wines, 2 spirits scores higher than one with 6 beers and nothing else. Diversity is rewarded.

### Category Bars / Chunks
Visual representation of breadth on venue cards. Each chunk = one product. Per-category colors from config. Max 8 visible + overflow badge.

**What's NOT built yet:** the bars represent raw product counts only. The spec calls for brand diversity to boost the score (2 products from different brands > 2 from the same brand). No cap on how many products count toward the score.

### Badge Tiers (SPEC ONLY — not implemented)
Defined in SCORING.md but not yet coded:
- **Gold** — claimed venue, data confirmed within 90 days, high diversity in at least one category, no stale products
- **Silver** — claimed OR UNI-verified within 180 days, meaningful diversity, max 20% stale
- **Bronze** — at least 1 confirmed product within 365 days
- **No badge** — new, unverified, or all-stale venues

**Open question:** SCORING.md says Gold/Silver/Bronze, but an earlier decision (ADR-004) chose binary badges. These contradict each other.

### Freshness Model
Freshness is driven by `offer_updated_at` — auto-touched whenever products or drinks change.

| State | Age | Meaning |
|---|---|---|
| Fresh | 0–30 days | Full weight, green dot |
| Aging | 31–90 days | Partial weight, amber dot |
| Stale | 91+ days | Shown but marked, red dot |
| Unknown | null | Hidden (no badge) |

**Why this matters for business:** Freshness creates urgency for venue owners to keep their data current. A stale profile looks bad. This is the engagement loop.

---

## 3. Venue Claiming Flow

1. Owner visits `/dla-lokali` (B2B landing page)
2. Registers at `/panel/register`
3. Goes to `/panel/claim-venue`, selects their venue from unclaimed venues
4. Chooses verification method (email or phone) + optional message
5. Admin reviews in Filament panel — approve or reject with notes
6. On approval: venue marked claimed, user promoted to "owner" role, gets dashboard access

**Known issue:** After registration, users get role='user' and hit 403 on the panel. They can't even submit a claim until an admin manually changes their role. This is a broken onboarding flow that needs a product decision.

**Another gap:** No duplicate claim prevention — two users can submit competing claims for the same venue.

---

## 4. Owner Panel (post-claim)

### Venue Dashboard
- Edit venue info: description, contact, hours, photo
- View and manage products

### Product Management
- Add existing products from global catalog (search by name/brand)
- Remove products from venue
- Each product has a confirmation timestamp (freshness tracking)

### Product Proposals
- Owner clicks "I don't see my product"
- Submits: name, producer, category, optional label photo
- Goes into admin review queue
- Approved → product created in global catalog + attached to venue
- Rejected → owner notified with reason

### Custom Drinks (Autorskie Drinki)
- Venue-specific house drinks (not in global catalog)
- Types: mocktail, koktajl nolo, drink spirytus 0%, virgin classic
- Name, description, photo
- Automatically count toward breadth score

### Audit Trail
Every product/drink add/remove/update is logged with who, when, what, and metadata. Foundation for future analytics dashboard ("your venue updated 3x this month").

---

## 5. Admin Panel (Filament)

### Dashboard Stats
- Active venues (verified vs unclaimed breakdown)
- Total products in catalog
- Venues with no products (data quality issue)
- Venues with stale menu data
- Pending venue claims count

### Resources
- **Venues** — full CRUD, verify toggle, view products
- **Products** — global catalog management (name, brand, ABV, category, country)
- **Categories** — drink category taxonomy (name, slug, sort order, icon, color)
- **Venue Claims** — review queue with approve/reject actions
- **Product Proposals** — review queue with approve/reject, badge count for pending
- **Users** — manage admins and owners

---

## 6. Data Model (Key Concepts)

| Concept | What it is |
|---|---|
| **Venue** | Physical location with address, coords, contact, type, claiming/verification status |
| **Product** | Global catalog item — a specific NA drink (brand, ABV, category, country) |
| **VenueDrink** | Venue-owned custom drink (house recipe, not in global catalog) |
| **Category** | Drink type: piwo, wino, spirits, drinki, cydr, musujace |
| **VenueClaim** | A claim request linking a user to a venue, pending admin review |
| **ProductProposal** | Owner-suggested new catalog product, pending admin review |
| **VenueOfferLog** | Audit trail of all product/drink changes per venue |
| **City** | Geographic container with map bounds and center point |
| **Canary Venue** | Fake venues seeded to detect scraping (is_canary flag) |

### Trust Hierarchy
1. Owner-confirmed (highest) — product managed via owner panel
2. UNI-team verified — staff checked the menu
3. Community reported — user submitted, unverified
4. Auto-imported (lowest) — scraped or bulk-added

---

## 7. Other Notable Features

### SEO
- Dynamic XML sitemap with priorities per page type
- Canonical tags and Open Graph on all pages
- Missing: `og:image` on homepage and B2B landing

### Honeypot / Anti-Scraping
- `/export/venues.json` — fake endpoint that logs bot activity
- Canary venues in database to detect data theft

### PostHog Analytics
Events tracked: product_added_by_owner, product_removed_by_owner, product_confirmed, venue_directions_clicked, venue_website_clicked, venue_instagram_clicked, venue_shared, venue_nearby_clicked, claim_cta_clicked

### Maps
- Leaflet-based interactive map on discovery page
- Per-venue lat/lng coordinates
- Haversine distance calculation for "nearest" sort
- City-level map bounds configuration

---

## 8. What's NOT Built Yet

| Feature | Status | Notes |
|---|---|---|
| Badge tiers (Gold/Silver/Bronze) | Spec written, not coded | Contradicts ADR-004 binary decision |
| Brand diversity in scoring | Spec written, not coded | Currently raw product count only |
| Breadth cap | Undecided | No max on products that count |
| Custom drinks on public venue page | Data exists, not rendered | `venue_drinks` don't show on show.blade.php |
| SMTP / email delivery | Not configured | Claim notifications can't actually send |
| Real venue data | No real data seeded | App has only dev/test data |
| Multi-city support | Schema ready, UI hardcoded to Warsaw | 12 hardcoded "Warszawie" strings |
| URL structure decision | Undecided | `/venues/{slug}` vs `/warszawa/lokal/{slug}` — blocks Google indexing |
| Owner panel onboarding | Broken | New registrants get 403 |
| VenuePolicy authorization | Missing | Owner panel uses query scoping only |
| Freshness config extraction | Not done | 30/90 day thresholds hardcoded in 5+ files |
| Owner analytics dashboard | Not started | "Your profile got X views this month" |
| Community reporting | Not started | Let users flag incorrect data |
| Score recalculation strategy | Undecided | On-demand vs nightly job |
| Downgrade grace period | Undecided | Does a gold venue drop immediately when stale? |

---

## 9. Key Open Decisions

1. **Badge system:** 3-tier (Gold/Silver/Bronze) vs binary (verified/not). Two docs disagree.
2. **URL structure:** Must decide before Google starts indexing.
3. **Registration flow:** What happens after a venue owner registers? Currently: 403.
4. **Breadth cap:** Should 50 beers count more than 8? Or cap at some point?
5. **Category naming:** "Spirits" (English) vs "Destylaty" (Polish) — mixed currently.
6. **`last_menu_check_at` fate:** Keep as admin audit date, merge into `offer_updated_at`, or remove?
7. **Multi-category bonus:** Should a venue covering 5+ categories get extra credit?

---

## 10. The Business Loops

### B2C Loop (User Acquisition)
User searches for NA options → finds venue on UNI → trusts freshness data → visits venue → tells friends → more users

### B2B Loop (Venue Engagement)
Owner sees their profile → claims it → updates products → freshness goes green → ranks higher in discovery → more visibility → owner stays engaged

### Data Flywheel
More venues claimed → more fresh data → more trustworthy platform → more users → more venues want to be listed → more data

### Monetization Lever (Future)
Stale profiles create urgency ("your competitors are green, you're red"). Premium features for venue owners could include: analytics, priority placement, custom drink showcases.
