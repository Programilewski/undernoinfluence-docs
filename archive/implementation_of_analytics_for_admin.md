# Admin Per-Venue Analytics Page — All 16 SSOT Reports

## Context

The admin panel needs a dedicated per-venue analytics page showing ALL 16 report types from the SSOT spec — the same view a Premium plan subscriber would see, but for every venue. This gives admin full intelligence for manual gap report outreach (the V2 validation step), competitive monitoring, and platform health assessment.

The page lives at `/admin/venues/{id}/analytics`, accessible via an "Analytics" button on both the venue list and edit pages.

## Architecture

Three core artifacts:

1. **`VenueAnalyticsReportService`** — all 16 report computations as separate methods, unit-testable
2. **`VenueAnalytics` page** — thin Filament page class calling the service
3. **Blade template** — renders all reports grouped by tier

## Files

| Action | File |
|--------|------|
| Create | `app/Services/VenueAnalyticsReportService.php` |
| Create | `app/Filament/Resources/Venues/Pages/VenueAnalytics.php` |
| Create | `resources/views/filament/resources/venues/pages/venue-analytics.blade.php` |
| Modify | `app/Filament/Resources/Venues/VenueResource.php` — add `'analytics'` page |
| Modify | `app/Filament/Resources/Venues/Pages/EditVenue.php` — add "Analytics" header action |
| Modify | `app/Filament/Resources/Venues/Tables/VenuesTable.php` — add "Analytics" row action |
| Create | `tests/Feature/VenueAnalyticsReportServiceTest.php` |
| Create | `tests/Feature/AdminVenueAnalyticsPageTest.php` |

## Service: `VenueAnalyticsReportService`

Constructor injects `VenueScoring`. One public method `generateAll(Venue $venue): array` calls all 16 private report methods and returns a keyed array. Venue is eager-loaded with `products.category`, `drinks`, `districtRelation.city`, `offerLogs`.

---

### FREE TIER — Profile Health

**1. Verification Impact Report**
- If `claimed_at` is null → `['status' => 'not_claimed']`
- Else: sum `VenueStat` views for 30d before `claimed_at` vs 30d after
- Return multiplier (`views_after / views_before`), guard division by zero

**2. Catalog Completeness Score**
- Call `VenueScoring::calculate($venue)` → product_count, categories_used, total_categories
- Threshold: <4 = "low", 4-7 = "medium", 8+ = "high"
- Get total active categories from `Category::where('is_active', true)->count()`

**3. Blank Menu Warning**
- Days since `offer_updated_at` (use `$venue->freshness_days`)
- District comparison: `Venue::where('district_id', ...)->where('offer_updated_at', '>=', now()->subDays(7))->count()`
- Stale threshold: 30 days for warning

**4. Monthly View Count**
- Sum all VenueStat columns for trailing 30d (reuses existing pattern)
- Total outbound = direction + website + instagram clicks

### BASIC TIER — Demand Intelligence

**5. Gap Report** (ANCHOR FEATURE)
- Get venue's category slugs: `$venue->products->pluck('category.slug')->unique()`
- Query `discovery_empty_results` events, unnest `properties->'categories'` via `jsonb_array_elements_text`, scoped to venue's city, trailing 30d
- Group by category, count occurrences
- Filter to categories the venue does NOT carry
- Admin sees all results; annotate which fall below threshold (≥10 district, ≥25 city)

**6. Category Demand Ranking**
- Merge `discovery_category_filtered` + `discovery_empty_results` events for venue's city (30d)
- Unnest category arrays via `jsonb_array_elements_text(properties->'category_slugs')` and `jsonb_array_elements_text(properties->'categories')`
- Rank by count, cross-reference with venue's product categories (checkmark/cross)

**7. Breadth Percentile Ranking**
- Get all `breadth_score` values in same district
- If <5 venues in district → fall back to city
- Percentile = count(venues with score < this venue's) / total * 100

**8. Seasonal Demand Forecast**
- V1: static editorial guidance (hardcoded string)
- Return note that data-driven version is V2

### PRO TIER — Competitive Intelligence

**9. Competitor Gap Alert**
- Use `Venue::nearby($lat, $lng, 1.0)` to find venues within 1km
- Query `VenueOfferLog` for `product_added` actions from those venues in 30d
- Load subjects (products) with category info
- Cross-reference with this venue's missing categories
- Requires lat/lng; return "no coordinates" if absent

**10. Search Spike Alerts**
- For each category in venue's city: compare 7-day count vs 28-day weekly average
- Source: `discovery_category_filtered` + `discovery_empty_results` events, unnest categories
- Spike threshold: ≥50% increase AND ≥15 absolute in 7d

**11. New Competitor Nearby**
- `Venue::nearby($lat, $lng, 0.5)` with `claimed_at >= now()->subDays(30)` and `breadth_score >= 3`
- Simple query, returns list with name/claimed_at/breadth_score

**12. District Demand Map**
- Monthly search volume by category for venue's city (30d + prior 30d)
- Trend = (current - prior) / prior * 100
- Supply overlay: for each category, count venues in district carrying it via `products.category`

**13. Month-over-Month Demand Trend**
- Total discovery events (all types) for current 30d vs prior 30d
- Scoped to city; district trend via properties->'districts' where available

### PREMIUM TIER — Engagement Detail

**14. Freshness Warning Status**
- `freshness_days`, `freshness_state` from model
- Days until 60-day warning, days until 90-day cliff
- Admin preview of what the email would say

**15. Trending Product Alerts**
- `VenueOfferLog::where('action', 'product_added')` in trailing 30d for same city
- Group by `subject_id` (product), `COUNT(DISTINCT venue_id)` HAVING count >= 5
- Cross-check if this venue carries them

**16. Strongest Category Badge**
- For each category the venue carries: rank venue by product count in district
- Use `DENSE_RANK() OVER (PARTITION BY category ORDER BY count DESC)` window function
- Badge-worthy if rank ≤ 2

**17. Outbound Click Detail Report**
- Day-of-week: aggregate VenueStat by `EXTRACT(DOW FROM date)` for 90d
- Hour-of-day: query events table with `EXTRACT(HOUR FROM created_at)` for click events
- Show peak day and peak hour

## Blade Template Layout

```
┌──────────────────────────────────────────────────────┐
│ Analytics — [Venue Name]     [Plan: Free] [← Edit]   │
├──────────────────────────────────────────────────────┤
│ FREE TIER: Profile Health                            │
│ ┌─────────────┐ ┌────────────┐ ┌────────┐ ┌───────┐ │
│ │ Verification │ │  Catalog   │ │  Menu  │ │Monthly│ │
│ │   Impact     │ │Completeness│ │Warning │ │ Views │ │
│ └─────────────┘ └────────────┘ └────────┘ └───────┘ │
├──────────────────────────────────────────────────────┤
│ BASIC TIER: Demand Intelligence                      │
│ ┌────────────────────────────────────────────────┐   │
│ │ Gap Report — table: category, searches, status │   │
│ ├────────────────────────────────────────────────┤   │
│ │ Category Demand Ranking — ranked list          │   │
│ ├─────────────────────┐ ┌────────────────────┐   │   │
│ │ Breadth Percentile  │ │ Seasonal Forecast  │   │   │
│ └─────────────────────┘ └────────────────────┘   │   │
├──────────────────────────────────────────────────────┤
│ PRO TIER: Competitive Intelligence                   │
│ ┌────────────────────────────────────────────────┐   │
│ │ Competitor Gap — nearby venue additions table   │   │
│ ├────────────────────────────────────────────────┤   │
│ │ Search Spike Alerts — category spikes table    │   │
│ ├────────────────┐ ┌─────────────────────────┐   │   │
│ │ New Competitors│ │ District Demand Map     │   │   │
│ └────────────────┘ │ + MoM Demand Trend      │   │   │
│                     └─────────────────────────┘   │   │
├──────────────────────────────────────────────────────┤
│ PREMIUM TIER: Engagement Detail                      │
│ ┌──────────────┐ ┌───────────────────────────────┐   │
│ │  Freshness   │ │ Trending Product Alerts       │   │
│ │  Warning     │ │ table                         │   │
│ ├──────────────┤ ├───────────────────────────────┤   │
│ │ Category     │ │ Click Detail Report           │   │
│ │ Badges       │ │ day-of-week + hour-of-day     │   │
│ └──────────────┘ └───────────────────────────────┘   │
└──────────────────────────────────────────────────────┘
```

Each tier section has a colored header from `VenuePlan::color()`. Reports that can't be computed show "Insufficient data — [reason]" in gray instead of hiding.

Visual style: follows existing admin widget pattern (inline styles, `color-mix` borders, monospace numbers, `system-ui` font family).

## Implementation Sequence

### Phase A: Foundation + FREE tier (reports 1-4)
1. Create `VenueAnalyticsReportService` with `generateAll()` + 4 FREE methods
2. Create `VenueAnalytics.php` Filament page
3. Register in `VenueResource::getPages()`
4. Create Blade template (header + FREE section)
5. Add "Analytics" action to EditVenue header + VenuesTable row
6. Write tests for reports 1-4 + page render test

### Phase B: BASIC tier (reports 5-8)
1. Add 4 BASIC methods to service (gap report is the complex one)
2. Extend Blade with BASIC section
3. Write tests for reports 5-8

### Phase C: PRO tier (reports 9-13)
1. Add 5 PRO methods (haversine + offer log queries)
2. Extend Blade with PRO section
3. Write tests for reports 9-13

### Phase D: PREMIUM tier (reports 14-17)
1. Add 4 PREMIUM methods
2. Complete Blade with PREMIUM section
3. Write tests for reports 14-17
4. Run full suite + Pint

## Edge Cases

- **No district_id**: Reports 3, 5, 6, 7, 12, 16 need district → show "No district assigned"
- **No coordinates**: Reports 9, 11 need lat/lng → show "No coordinates"
- **Not claimed**: Report 1 → show "Not claimed"
- **Zero events**: Gap report, demand ranking → show "No search data yet"
- **Division by zero**: Verification impact multiplier, trend percentages → show "N/A"

## Key Reusable Code

- `VenueScoring::calculate()` at `app/Services/VenueScoring.php` — for reports 2, 7
- `Venue::scopeNearby()` at `app/Models/Venue.php:262` — for reports 9, 11
- `Venue::HAVERSINE_SQL` at `app/Models/Venue.php:21` — haversine formula
- `DiscoveryInsightsWidget::getPopularCategories()` pattern at `app/Filament/Widgets/DiscoveryInsightsWidget.php` — for jsonb array unnesting
- `VenueStat::TRACKABLE_EVENTS` at `app/Models/VenueStat.php` — event type mapping
- Existing test patterns: `User::factory()->admin()`, `District::create([...])`, `VenueStat::factory()`

## Verification

1. `php8.4 artisan test --compact --filter=VenueAnalyticsReportService` — service tests
2. `php8.4 artisan test --compact --filter=AdminVenueAnalyticsPage` — page tests
3. `php8.4 artisan test --compact` — full suite regression
4. `php8.4 vendor/bin/pint --dirty --format agent` — style
5. Manual: admin login → venue list → click "Analytics" → verify all 16 reports render
