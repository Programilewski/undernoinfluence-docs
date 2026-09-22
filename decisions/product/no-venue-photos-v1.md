# No venue or drink photos in V1

**Date:** 2026-05-04
**Status:** Decided
**Executed:** 2026-09-14
**Area:** Venues | UI/UX

---

## Problem

Venue profiles and drink listings look more trustworthy with photos. But photos require upload UX, storage infrastructure (S3/CDN), moderation queues, quality control, and ongoing maintenance. For a solo founder pre-launch, this is a significant surface area.

## Options considered

1. **Owner-uploaded venue photos** — moderation burden, storage/CDN cost, quality control risk.
2. **Google Places API photos** — session-expiring URLs, per-request API costs, ToS restrictions, attribution clutter.
3. **Allow photos for custom drinks only** — creates inconsistency (drink photos but no venue photos), still requires upload infra.
4. **No photos at all** — clean, fast, no moderation overhead.

## Decision

No venue images and no drink images in V1. The platform communicates venue quality through data: breadth score, category counts, freshness, verification status. Photos are deferred entirely.

## Rules

No image upload fields in the owner panel. No image display on public venue profiles or drink listings. No Google Places API integration for photos.

**Amended 2026-09-14 — the column is gone, and one upload is allowed by name.** `venues.image_path` was removed from the create migration while the table is empty; nothing displayed it, and the structured data no longer offers an image. The owner panel's label photo on a product proposal stays: it is moderation evidence that the product exists, shown to an admin and never published.

**Amended 2026-09-18 — the product image field is gone too.** The admin product form still had a "Zdjęcie produktu" upload writing `products.image_path`, which nothing ever displayed and no record covered — the same leftover `venues.image_path` was until 14.09. Paweł: *"V1 is supposed to not have any."* The field and the column were removed the same way, from the create migration while production is empty, and `SchemaHardeningTest` asserts the column does not exist. The owner's label photo on a proposal remains the one upload, for the reason above. One orphan file from the venue-photo upload removed on 04.05 was deleted from the laptop's storage.

## What this prevents

Moderation debt and infrastructure cost for an unvalidated feature. A venue with a bad photo is worse than a venue with no photo — and there's no moderation capacity to enforce quality.

## Revisit when

When claimed venue owners provide feedback showing strong demand for photos, and when moderation capacity exists (either automated or manual).
