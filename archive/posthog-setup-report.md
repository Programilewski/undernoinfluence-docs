# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into Under No Influence across multiple sessions. The `posthog/posthog-php` SDK, `PostHogService`, client-side snippet, and server-side event infrastructure were already in place. This session (session 3) expanded top-of-funnel coverage — adding tracking for the home page, about page, how-it-works page, and the discovery map entry point — and filled two CityController gaps (category-filtered city/district views). It also promoted `map_area_searched` from EventLogger-only to full PostHog capture, and created a new analytics dashboard.

## All tracked events

| Event | Description | File |
|---|---|---|
| `home_viewed` | User visited the home page — top of the conversion funnel | `app/Http/Controllers/HomeController.php` |
| `how_it_works_viewed` | User visited the 'Jak to działa' page, signalling intent to understand the product | `app/Http/Controllers/PageController.php` |
| `about_viewed` | User visited the 'O nas' page, indicating brand interest | `app/Http/Controllers/AboutController.php` |
| `discovery_viewed` | User loaded the interactive map/discovery page — entry to venue browsing | `app/Livewire/DiscoveryPage.php` |
| `city_viewed` | User views a city overview page | `app/Http/Controllers/CityController.php` |
| `district_viewed` | User views a district venue listing | `app/Http/Controllers/CityController.php` |
| `city_category_browsed` | User browsed a specific drink category filtered to a city | `app/Http/Controllers/CityController.php` |
| `district_category_browsed` | User browsed a specific drink category filtered to a district | `app/Http/Controllers/CityController.php` |
| `category_browsed` | User browses a global category page (mocktails, coffee, etc.) | `app/Http/Controllers/CategoryController.php` |
| `venue_viewed` | User views a venue detail page — key conversion step | `app/Http/Controllers/VenueController.php` |
| `venue_directions_clicked` | Outbound click to Google Maps directions | `app/Services/Analytics/VenueAnalytics.php` |
| `venue_website_clicked` | Outbound click to venue website | `app/Services/Analytics/VenueAnalytics.php` |
| `venue_instagram_clicked` | Outbound click to venue Instagram profile | `app/Services/Analytics/VenueAnalytics.php` |
| `venue_maps_clicked` | Outbound click to Google Maps pin | `app/Services/Analytics/VenueAnalytics.php` |
| `discovery_searched` | User types a search query on the discovery page | `app/Services/Analytics/DiscoveryAnalytics.php` |
| `discovery_category_filtered` | User selects a category filter on the discovery page | `app/Services/Analytics/DiscoveryAnalytics.php` |
| `discovery_sort_changed` | User changes sort order (best/nearest/name) | `app/Services/Analytics/DiscoveryAnalytics.php` |
| `discovery_empty_results` | Discovery search/filter returns zero results — churn risk signal | `app/Services/Analytics/DiscoveryAnalytics.php` |
| `map_area_searched` | User dragged/zoomed the map to search a custom bounding box | `app/Services/Analytics/DiscoveryAnalytics.php` |
| `user_registered` | New user registers via the owner panel | `app/Providers/AppServiceProvider.php` |
| `user_logged_in` | Existing user logs in via the owner panel | `app/Providers/AppServiceProvider.php` |
| `claim_submitted` | Venue owner submits a claim request — B2B funnel entry | `app/Filament/Panel/Pages/ClaimVenue.php` |
| `claim_approved` | Admin approves a venue claim | `app/Filament/Resources/VenueClaims/Tables/VenueClaimsTable.php` |
| `claim_rejected` | Admin rejects a venue claim | `app/Filament/Resources/VenueClaims/Tables/VenueClaimsTable.php` |
| `product_added_by_owner` | Owner adds a product to their venue's offer | `app/Filament/Panel/Resources/VenueResource/RelationManagers/ProduktyRelationManager.php` |
| `product_removed_by_owner` | Owner removes a product from their venue's offer | `app/Filament/Panel/Resources/VenueResource/RelationManagers/ProduktyRelationManager.php` |
| `product_confirmed` | Owner confirms a product is still in their offer (freshness) | `app/Filament/Panel/Resources/VenueResource/RelationManagers/SwiezoscRelationManager.php` |

## Next steps

We've built a dashboard and five insights to monitor user behaviour based on the events instrumented in this session:

- **Dashboard — [Analytics basics (wizard)](https://eu.posthog.com/project/172709/dashboard/758207)**
  - [Discovery funnel: Home → Discovery → Venue](https://eu.posthog.com/project/172709/insights/HFl0FTdz)
  - [Venue outbound clicks by type](https://eu.posthog.com/project/172709/insights/8Z6T1wmq)
  - [Discovery search & filter usage](https://eu.posthog.com/project/172709/insights/ur2Wtq2C)
  - [City & district browsing](https://eu.posthog.com/project/172709/insights/Q5GqvEpb)
  - [Venue → outbound conversion rate](https://eu.posthog.com/project/172709/insights/wnuEq4hg)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_KEY`, `POSTHOG_HOST`, `POSTHOG_PUBLIC_ENABLED`, and `POSTHOG_SERVER_ENABLED` to `.env.example` so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `posthog.identify()` — the current client-side snippet identifies on page load when authenticated; users who log in via Filament admin and then navigate to the public site may sit on an anonymous distinct ID until the next full page load.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-laravel/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
