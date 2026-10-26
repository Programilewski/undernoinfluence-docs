# No venue or drink photos in V1

**Date:** 2026-05-04
**Status:** Decided
**Executed:** 2026-10-26 — the last photo column, `venue_drinks.photo_path`, removed
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

**Amended 2026-10-26 — house drinks stay text only beyond V1, until this is revisited.** Confirmed in a claude.ai chat on 26.10. A house drink is a structured text line, its name and base ingredients ("Mojito 0% · limonka, mięta"), and a venue's value is how many such drinks it has, not a picture of them. Three reasons: an AI-generated image fakes a drink photo for free (the reason [[decisions/product/custom-drink-photo-gate-retired]] gave on 30.08), storage costs money, and every upload needs moderation. `venue_drinks.photo_path`, which nothing ever displayed, was removed from the create migration while production is empty; venue erasure no longer looks for drink files, and `SchemaHardeningTest` asserts the column does not exist. The owner's label photo on a product proposal remains the one upload. *A note on the record:* the claude.ai summary called this superseding "the May 2026 recommendation to allow photos for custom drinks only". No such recommendation stands: option 3 above rejected it on 04.05. The example line in that summary also carried a price ("22 zł"), which [[decisions/product/price-is-not-tracked]] rules out, so it is left out here.

## What this prevents

Moderation debt and infrastructure cost for an unvalidated feature. A venue with a bad photo is worse than a venue with no photo — and there's no moderation capacity to enforce quality.

## Revisit when

When claimed venue owners provide feedback showing strong demand for photos, and when moderation capacity exists (either automated or manual). **House drinks are not reopened by version alone (amended 26.10):** only an explicit decision that answers the faking problem reopens them.
