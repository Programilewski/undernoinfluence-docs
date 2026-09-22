---
version: 0.3
owner: Paweł Milewski
updated: 2026-08-18
status: draft
---

# Dependencies

Technical dependency inventory for the Laravel marketplace.

## Composer Dependencies

Complete list, verified against `composer.json` on 2026-08-18. This is everything — the app runs on
nine production packages, and that is deliberate.

| Package | Version | Purpose | Risk | Notes |
| --- | --- | --- | --- | --- |
| php | 8.4 | Runtime | low | |
| laravel/framework | 13.x | Backend framework | low | |
| filament/filament | 5.x | Admin + owner panels | low | Only surface behind auth |
| livewire/livewire | 4.x | Discovery page reactivity | low | |
| spatie/laravel-sitemap | — | SEO sitemap generation | low | |
| posthog/posthog-php | — | Server-side analytics | **compliance** | Data processor — needs a DPA, see `../compliance/vendors/` |
| blade-ui-kit/blade-heroicons | — | Icon components | low | |
| laravel/tinker | — | REPL | low | |

Dev-only: `laravel/boost`, `laravel/pail`, `laravel/pint`, `rector/rector`, `phpunit/phpunit` 12.x,
`mockery/mockery`, `fakerphp/faker`, `nunomaduro/collision`, `laramint/laravel-brain`.

**Not installed, despite what older docs claimed:** Spatie Permissions, Spatie Media Library,
Spatie Sluggable, Intervention Image, Laravel Telescope, PostGIS, Redis-as-cache. Roles are an enum
column, slugs are generated in the model, and there is no image handling anywhere in V1.

## NPM Dependencies

| Package | Version | Purpose | Risk | Notes |
| --- | --- | --- | --- | --- |
| alpinejs | 3.x | Frontend behaviour, map state | low | |
| tailwindcss | 4.x | Styling | low | |
| maplibre-gl | 6.x | Map rendering on OpenFreeMap vector tiles — the three public maps and the admin location preview | medium | Replaced Leaflet on 27.08, see [`vector-basemap-on-openfreemap`](../decisions/product/vector-basemap-on-openfreemap.md). **Upgraded 5.24 → 6.9 on 12.09** for GHSA-jrc7-96c5-q579 (sanitiser bypass), which has no 5.x fix. Version 6 is ES modules only with no default export, and its worker is a separate file Vite has to be told about: `resources/js/map-loader.js` does both. Bumping the version without that blanked every map, and only `npm run check:render` against a **built** bundle shows it. Cost: the worker is now its own download, so a page that draws a map fetches about 423 KB gzipped on first visit against 270 KB on 5.x; pages without a map load none of it. Tile requests carry the visitor's IP to OpenFreeMap, which is why it is a named recipient in the privacy policy |
| prettier | 3.x | Formatting | low | dev |
| vite | — | Build | low | dev |

## Proposed / Candidate Packages

Dependency candidates reviewed against the current app shape, not package popularity.
Migrated from the SSOT spec on 2026-07-24 — this is the canonical home.

**Selection principle:** the app already has focused custom implementations for role
access, audit logs, analytics, feature entitlements, sitemap generation, discovery
filtering, and Filament admin workflows. New dependencies should only be added when they
reduce operational risk, improve developer feedback, or unlock a concrete roadmap
workflow. Popularity alone is not enough.

### Recommended Now — high fit

Match current risks in the codebase; add value without changing product behavior.

- **`nunomaduro/larastan`** — dev dependency for static analysis. The app has enums, custom Eloquent scopes, analytics services, Filament resources, and report-generation code where type regressions are worth catching before runtime.
- **`beyondcode/laravel-query-detector`** — local/dev N+1 detection. Discovery pages, venue profiles, analytics widgets, and Filament tables are relationship-heavy.
- **`opcodesio/log-viewer`** — operational support if production lacks strong external log browsing. Imports, claims, notifications, queues, analytics, and audit logs benefit from quick log inspection.
- **`spatie/laravel-backup`** — **installed 18.09** (10.3), with `league/flysystem-aws-s3-v3` (3.35) for the Scaleway disk. Nightly database + uploaded files, AES-256 inside the archive, 7 daily + 4 weekly, failure-only mail. See `decisions/product/backup-storage-provider.md` and deploy checklist A6.
- **`spatie/laravel-health`** — public-launch fit for monitoring database, cache, queue, disk, schedule, and other app health checks.
- **`spatie/laravel-failed-job-monitor`** — valuable once imports, notifications, analytics aggregation, or owner reports depend on queues.

### Good If Roadmap Needs It — conditional

Reasonable candidates, but wait for a specific feature or measured bottleneck.

- **`Intervention/image`** or **`spatie/image-optimizer`** — add when venue/product photos become a real workflow requiring resizing, thumbnails, validation, or optimization.
- **`spatie/laravel-pdf`** — if owners need downloadable analytics reports, venue summaries, invoices, claim confirmations, or compliance exports.
- **`geocoder-php/GeocoderLaravel`** — if venue onboarding accepts plain addresses needing lat/lng enrichment. Largely covered already by the in-house GUS + Nominatim geocoding services used during manual venue entry.
- **`spatie/laravel-responsecache`** — possible fit for public city/category/venue SEO pages, but only after measuring response times. Keep dynamic discovery, owner panel, admin, and personalized routes out of full-response caching.
- **`spatie/laravel-honeypot`** — if claim, report, or registration forms attract spam. Current throttling and custom safeguards make this non-urgent.

### Avoid For Now — low fit

Duplicate working local concepts or would make the current domain model less explicit.

- **`spatie/laravel-permission`**, **`JosephSilber/bouncer`**, **`santigarcor/laratrust`** — the current `UserRole` enum and Filament panel access are enough for admin/owner authorization.
- **`spatie/laravel-activitylog`**, **`owen-it/laravel-auditing`** — the app already has `audit_logs` and `AuditLogger`; replacing them would add migration and behavior risk without obvious benefit.
- **`spatie/laravel-query-builder`** — current discovery querying includes custom geo bounds, freshness, ABV status, category matching, and ranking logic. A generic request query builder could make this domain behavior less visible.
- **`spatie/laravel-tags`**, **`aliziodev/laravel-taxonomy`** — current categories, districts, venue types, products, and SEO category slugs already cover V1 taxonomy needs. Revisit only if hierarchical tagging becomes a product requirement.
- **Alternative admin panels, CRUD generators, starter kits, generic API builders** — Filament is already the canonical admin/owner UI, and the app has domain-specific workflows that should remain explicit.

## Review Process

- TODO: Define how dependencies are approved.
- TODO: Define update cadence.
- TODO: Define license review owner.
- TODO: Link vendor/compliance-relevant packages to `../compliance/vendors/README.md`.
