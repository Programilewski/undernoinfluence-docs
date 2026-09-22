# Owner Dashboard

**Status:** **Built and working** at `/panel`. **Verified against code 2026-08-18.** `VenueStatusWidget` and `VenueAnalyticsWidget`, product management (`ProductsRelationManager`), custom drinks (`DrinksRelationManager`), freshness reconfirmation (`FreshnessRelationManager`), authorization through `VenuePolicy`. **Owner accounts are created by an admin** — there is no public registration and no public claim form ([[decisions/product/admin-recorded-claims-v1]]). Nothing on the public site links to the panel; see note O-2 in [[roadmap/next-session]].

## Technology
FilamentPHP. Full-width layout (native Filament design system). Accessed after [[product/features/Venue Claiming]] approval.

## V1 Features (Free Tier)

### Product Management
- Add/remove products per category
- Known products: autocomplete from [[product/features/Product Reference Database]]
- Custom drinks: photo + description + tag selection (see [[product/rules/Custom Drinks Rules]])
- Per-product freshness decay bars visible here (hidden from public users)
- "Still in offer" reconfirmation button per product — no batch confirm

### Freshness Status
- Visual overview of all products with their decay state
- Notifications when products approach decay threshold
- Notifications when products get flagged by users

### Checkmark Status
- Earned / not earned indicator
- General guidance: "Your checkmark depends on completeness, recency, and user reports"
- No detailed breakdown of the formula (weights secret)

### Basic Stats
- Profile views (weekly/monthly)
- Products listed (count per category)
- Flags received (which products, deadlines)

## Future: Premium Tier
See [[business/model#Tier 3: Premium Owner Insights (Paid B2B Subscription)|Tier 3]] for full list of premium analytics. Built on Metabase querying own PostgreSQL analytics tables, not PostHog.

## Design Notes
- Filament's native UI — don't fight the framework
- Sharp corners, data-dense tables — appropriate for B2B admin context
- No need to match B2C brand aesthetic here
