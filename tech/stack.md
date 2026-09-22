---
version: 1.3
owner: Paweł Milewski
updated: 2026-08-27
status: approved
---

# Technology Stack

## Core: TALL stack

- **T**ailwind CSS v4 — utility-first styling, dual Vite/Tailwind configs for B2C and B2B
- **A**lpine.js 3 — bridge between Livewire and Leaflet, map state management, UI micro-interactions
- **L**ivewire 4 — server-rendered reactive components, list updates, filter handling
- **L**aravel 13 — monolith, single codebase for all interfaces, PHP 8.5 (`composer.json` requires `^8.3`; the machine ran 8.4.1 until the Fedora move on 2026-08-25 and runs 8.5.9 now)

## Database

- **PostgreSQL 18.4** — primary database, entirely from the distribution's repositories. Was 16.15 on Ubuntu; moved to 18 by dump and restore during the 2026-08-25 migration, deliberately not with `pg_upgrade` (11 MB database, crossing a packaging boundary). Mixing a vendor repository with the distribution's is what broke the `pgsql` PHP extension that day — see [`one-vendor-per-system-library`](../decisions/product/one-vendor-per-system-library.md).
- **No PostGIS.** Corrected 2026-08-18: `PostGIS_version()` does not resolve on this database. Distance and "search this area" queries run on plain `latitude` / `longitude` columns with a haversine expression in SQL (`Venue::HAVERSINE_SQL`) and a bounding-box `whereBetween`. At Warsaw scale this is fine; PostGIS becomes worth installing when a query needs real spatial indexes, not before.
- **Redis is configured but unused.** `.env` defines `REDIS_HOST` etc., but `CACHE_STORE`, `QUEUE_CONNECTION` and `SESSION_DRIVER` are all `database`. Treat Postgres as the cache and queue backend until something measurably needs Redis.

## Map

- **Leaflet.js + leaflet.markercluster** — current map rendering and pin clustering. **Being replaced.**
- **CARTO `dark_all` / `voyager` / `dark_nolabels`** — current raster tile layers. **Broken as of 2026-08-27:** CARTO requires an API key and stamps keyless tiles with an "API KEY REQUIRED" watermark on all three styles.
- **Decided 2026-08-27 — [`vector-basemap-on-openfreemap`](../decisions/product/vector-basemap-on-openfreemap.md):** the maps move to **MapLibre GL JS** drawing **vector tiles from OpenFreeMap**, with the style JSON owned in the repository. Pin clustering is dropped. Fallback if OpenFreeMap fails: a self-hosted Protomaps PMTiles extract of Poland served from the app server — same client code, different URL. Not yet implemented; see `../roadmap/v1.md` critical path item 5.
- Map container wrapped in `wire:ignore` to prevent Livewire DOM updates

## Admin / B2B

- **FilamentPHP v5** — owner dashboard, admin panel
- Filament uses its own layout (full-width, native design system)

## Key packages (installed)

**Corrected 2026-08-18** — verified against `composer.json`. The previous list named five packages
that are not installed (Spatie Permissions, Media Library, Sluggable, Intervention Image, Telescope).
The app is deliberately thin on dependencies: roles, slugs and audit logging are all in-house.

| Package | What it does here |
|---|---|
| `filament/filament` v5 | Admin panel and owner panel |
| `livewire/livewire` v4 | Discovery page reactivity |
| `spatie/laravel-sitemap` | Generated sitemap for the SEO cluster |
| `posthog/posthog-php` | Server-side analytics capture |
| `blade-ui-kit/blade-heroicons` | Icon components |

Roles are a plain `role` enum column on `users` (`UserRole::Admin` / `Owner` / `User`) — there is no
permissions package. Slugs are generated in `Venue::booted()`.

**Image uploads: partly.** Venue photos and house-drink photos do not exist (D-03, D-04, and the
photo requirement for house drinks was retired on 2026-08-30 — see
[`custom-drink-photo-gate-retired`](../decisions/product/custom-drink-photo-gate-retired.md)).
Product images **do** exist and are wired up in both panels: `products.image_path` with a
`FileUpload` field in `Filament/Admin/Resources/Products/Schemas/ProductForm.php`, and
`label_image_path` on owner product proposals. This paragraph previously claimed uploads did not
exist at all, which is what made the brand-page image question look already-settled when it was not.

Brand and drink pages ship without images at launch, by decision rather than by absence of
machinery — see [`brand-and-product-pages`](../decisions/product/brand-and-product-pages.md).

Full dependency inventory with compliance notes: [`dependencies.md`](dependencies.md).

## Key packages (planned, not installed)

- MaryUI — Livewire UI components for B2C (evaluate when building public interactive components)
- Przelewy24 — Polish payments (when the B2B subscription launches)
- Meilisearch — not needed at V1 scale, simple DB search is sufficient
- Sanctum — when a mobile app is needed
- Sentry + UptimeRobot — monitoring, add when traffic justifies

## Development tooling

- Tests: PHPUnit 12
- Formatting: Laravel Pint
- Static analysis / refactoring: Rector
- Build: Vite
- Documentation: Markdown in `docs/`

## Layout Contexts

| Page | Width | Why |
|---|---|---|
| Discovery (list + map) | `w-full` | Map needs space in 60/40 split |
| Venue profile | `max-w-7xl` | Focused evaluation, premium feel |
| Blog / SEO / Legal | `max-w-4xl` | Reading comprehension |
| B2B Dashboard | `w-full` | Filament native, data tables |

Implementation: Blade layout aliases in `AppServiceProvider`.

## Interface structure

All interfaces share the same backend, database, and domain models.

| Interface | Purpose | Layout |
|---|---|---|
| Public website | SEO, map, search — no login required | Discovery / Content |
| Owner dashboard | Product management, analytics, freshness | Filament (full-width) |
| Admin panel | Full content control, approvals | Filament (full-width) |

## Architecture principles

- Controllers are thin; business logic lives in models, scopes, and service classes. A formal
  `app/Domain/` directory is planned but not yet introduced — follow this direction as the
  codebase grows.
- Single map instance shared between mobile and desktop layouts
- List is master — filters query the list, the map receives coordinates as secondary visualization
- PostGIS spatial queries only on explicit "search this area", never on default page load
- Default list queries are cacheable via Redis (identical for every user in a city)

## Deferred

- `app/Domain/` services directory — planned structure for business logic as the codebase grows
- Meilisearch, Sanctum, Sentry + UptimeRobot (see planned packages above)
- Stripe — international payments, post-MVP

## Open questions

These are tracked with their consequences in [`going-to-production.md`](going-to-production.md).

- Production hosting target and region — EU residency required, pay-as-you-go preferred for V1
- Object storage provider
- Transactional email provider
- Payment provider integration timing (Przelewy24, gated on B2B launch)

Related: [`architecture.md`](architecture.md) · [`analytics.md`](analytics.md) · [`security.md`](security.md) · [`going-to-production.md`](going-to-production.md)
