# No batch "confirm all" for product reconfirmation

**Date:** 2026-04-22
**Status:** Decided
**Executed:** 2026-09-14
**Area:** Venues | Scoring

---

## Problem

The freshness system requires venue owners to periodically reconfirm that products are still on offer. A "confirm all" button is the obvious UX shortcut — one tap, everything resets. But if batch confirmation exists, owners will tap it without actually checking their menu, which makes freshness data meaningless as a trust signal.

## Options considered

**Batch "confirm all"** — one tap resets all timers. Maximum owner convenience. Zero friction. Zero signal value.

**Item-by-item only** — each product must be reconfirmed individually. Forces owners to scroll through and engage with each item. Higher friction, higher data quality.

**Category-level batch** — confirm all products in a category at once. Partial friction reduction.

## Decision

Item-by-item only. No batch confirm at any level — not per-product, not per-category, not platform-wide. The deliberate friction is the feature: an owner who clicks through 10 items is more likely to notice that one of them is no longer stocked. Reconfirmation only resets the timer for the specific product tapped.

## Rules

The owner dashboard must not expose any multi-select or "confirm all" control. Each product row has a single "still in offer" action that resets only that product's `confirmed_at` timestamp. Bulk operations on freshness are not permitted, even via the Filament admin panel in V1.

**Amended 2026-09-14 — the admin bulk action is gone.** The venue list had a bulk "Oznacz jako sprawdzone dzisiaj", which is exactly the unchecked confirmation this record forbids even in the admin panel. The single-venue action stays.

## What this prevents

Prevents the "mindless bulk tap" pattern that would make freshness data worthless. If owners can confirm everything in one tap, the freshness score becomes a measure of how recently the owner opened the dashboard, not how recently they verified their menu. The whole trust model depends on reconfirmation being a deliberate, product-level action.

## Revisit when

Post-V1, if owner churn data shows that reconfirmation friction is causing listings to expire en masse rather than be maintained. At that point, consider category-level batch as a compromise — but never platform-wide.

---

*See also: silent-flag-weighting.md*
