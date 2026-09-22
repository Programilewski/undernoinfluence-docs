# UNI — Scoring System Implementation (Update, NOT Greenfield)

This is a modification of an existing Laravel project (TALL stack: Laravel + FilamentPHP B2B + Livewire 3 B2C + Tailwind). The project already has some structure — review what exists before writing anything. Do NOT scaffold new projects or reinstall dependencies.

## Step 0: Reconnaissance

Before any code changes:
1. Read the existing database migrations, models, and relationships.
2. Read the existing FilamentPHP resources/pages.
3. Read the existing Livewire components for B2C.
4. Map out what already exists vs what needs to change.
5. Ask me if anything is unclear before proceeding.

---

## What to implement

### 1. Closed Product Catalog

**Database:**
- `catalog_products` table: id, name, producer, category (enum: piwo, wino, spirytusy, koktajle_mocktaile, cydr, musujace_toniki), sku, image_path, is_approved (bool, default true for admin-added), timestamps.
- `venue_products` pivot table: venue_id, catalog_product_id, timestamps. Unique constraint on (venue_id, catalog_product_id).
- `product_proposals` table: venue_id, proposed_name, proposed_producer, proposed_category, label_image_path, status (enum: pending, approved, rejected), reviewed_at, timestamps.

**If these tables already exist in some form, migrate/alter — don't drop and recreate.**

**FilamentPHP (B2B admin):**
- CatalogProductResource: CRUD for catalog products. Filterable by category.
- ProductProposalResource: moderation queue. List shows pending proposals, one-click approve (creates catalog_product + notifies venue), reject with optional reason.

**FilamentPHP (B2B venue panel):**
- Venue owner picks products from catalog (searchable select, filtered by category).
- "Nie widzę mojego produktu" button → proposal form (name, producer, category select, label photo upload).
- Venue cannot add freeform products to their active offer.

### 2. Custom Drinks (Separate System)

**Database:**
- `venue_drinks` table: id, venue_id, name, description (nullable), photo_path (nullable), base_category (enum: mocktail, koktajl_nolo, drink_spirytus_0, virgin_classic), timestamps.

**This is completely separate from catalog_products/venue_products.**

**FilamentPHP (B2B venue panel):**
- Venue manages own drinks: CRUD, mandatory base_category select, optional description and photo.
- No moderation — self-service.

### 3. Scoring (Linear Breadth Count)

**Implement as a service class `App\Services\VenueScoring`:**

```php
class VenueScoring
{
    // Returns per-category breadth counts + total + categories_used
    public function calculate(Venue $venue): VenueScore;

    // Sorts a collection of venues: primary key = totalBreadth, no secondary key in V1
    public function sort(Collection $venues): Collection;
}
```

**Scoring logic:**
- Count venue_products per category (from catalog_products.category).
- Count venue_drinks per base_category.
- Total breadth = sum of all.
- Category diversity = number of distinct categories with at least 1 product/drink.
- Linear: every product = 1 point. No weights, no multipliers, no caps.
- Natural cap = catalog size (not visible to user).

**Do NOT implement rarity — that's V2.**

### 4. Checkmark (Claimed Profile)

**Database:**
- Add to venues table (if not exists): `claimed_at` (nullable timestamp), `claimed_by` (nullable, foreign to users).
- Venue is "verified" if claimed_at is not null.

**No self-confirmation mechanic, no periodic re-verification. V1 is claim-only.**

### 5. Freshness

**Database:**
- Add to venues table (if not exists): `offer_updated_at` (nullable timestamp).
- Updated whenever: venue_products or venue_drinks are added/removed/modified.

**Use an Eloquent observer or model event to auto-update offer_updated_at on venue_products/venue_drinks changes.**

**Freshness states (computed, not stored):**
- Fresh: offer_updated_at within 30 days → green
- Aging: 30-90 days → amber
- Stale: 90+ days → red
- Unknown: offer_updated_at is null (unclaimed/no data)

**Implement as accessor on Venue model or in VenueScoring service.**

### 6. Audit Trail

**Database:**
- `venue_offer_logs` table: id, venue_id, user_id, action (enum: product_added, product_removed, drink_added, drink_removed, drink_updated), subject_type, subject_id, metadata (json, nullable), timestamps.

**Log every offer change silently. No UI for this in V1 — it's infrastructure for future use.**

### 7. B2C Data Layer (Livewire)

**Expose scoring data to existing B2C components — do NOT touch existing design, CSS, colors, layout, or Tailwind classes.**

Provide Livewire properties/methods that the frontend can consume:
- Per-category breadth counts + product/drink lists for a venue.
- Total breadth + category diversity count.
- Freshness state (fresh/aging/stale) + days since last update.
- Claimed status (bool).
- Sorted venue collection (by total breadth desc, then category diversity desc).
- Per-category product list capped at 8 items with overflow count (for chunk display logic).

**I will handle all visual/design changes myself.**

---

## What NOT to do

- Do NOT implement rarity scoring (V2).
- Do NOT implement user reporting / "menu się zgadza" (V2).
- Do NOT implement freshness decay based on user activity (V2).
- Do NOT implement penalty/punishment systems.
- Do NOT create a new Laravel project or run `laravel new`.
- Do NOT change existing auth/user system unless strictly necessary.
- Do NOT over-engineer — simple, readable code. No abstraction layers beyond VenueScoring service.
- Do NOT touch existing design, CSS, colors, Tailwind classes, Blade layouts, or visual styling. Backend and data layer only.

---

## Order of implementation

1. Database migrations (catalog_products, venue_products, product_proposals, venue_drinks, venue_offer_logs, venue table alterations).
2. Models + relationships + observers (audit trail auto-logging, offer_updated_at auto-update).
3. VenueScoring service.
4. FilamentPHP resources (catalog management, proposal queue, venue product picker, venue drinks CRUD).
5. B2C data layer — Livewire properties/methods exposing scoring, freshness, claimed status. No visual changes.

**After each step, show me what you've done before moving to the next.**
