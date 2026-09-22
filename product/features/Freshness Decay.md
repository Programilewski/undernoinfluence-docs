# Freshness Decay

**Status:** **Built in binary form; the per-product decay described below is V2.** **Verified against code 2026-08-18.** The `venue_products.confirmed_at` column **does exist**, contrary to the previous note. What does not exist, deliberately: `decay_rate`, a four-state per-product `status`, and shrinking bars next to individual items. D-14 collapsed all of that into one venue-level rule — `offer_updated_at` newer than `uni.freshness_days` (90) means fresh. The tile and profile show a relative date ("Zaktualizowano 12 dni temu"), and `uni:check-offer-freshness` guards against drift daily (hourly until 24.08). The user-facing recency filter has four ranges (7/30/90/180 days) — those are search ranges, not decay states.

## Required Schema Changes (not yet applied)

The current `venue_products` pivot has only: `id`, `venue_id`, `product_id`, `is_available`, `created_at`, `updated_at`.

Freshness requires adding:
- `confirmed_at` (timestamp, nullable) — when was this product last explicitly reconfirmed by the owner? Null means never reconfirmed since initial add.
- `decay_rate` (integer, days) — how many days until this product expires without reconfirmation. Defaults set per product stability type.
- `status` (enum: `fresh`, `decaying`, `expired`, `flagged`) — computed state, can be stored or derived from `confirmed_at` + `decay_rate`.

## Concept
Every product a venue lists has an invisible timer that starts at add/confirm date. Products that aren't reconfirmed eventually get hidden from users.

## Owner Experience
- Each product on the owner dashboard shows a visual bar that shrinks over time
- Owner taps "still in offer" per item to reset the timer (`confirmed_at` = now)
- **No batch "confirm all"** — item by item only, prevents mindless bulk tapping
- Owner is nudged when products approach decay threshold

## Decay Rates
Vary by product stability:
- Staple products (Heineken 0.0, Perła 0%) → slower decay (e.g., 90 days)
- Seasonal or custom items → faster decay (e.g., 30-45 days)
- Exact rates to be tuned after V1 launch based on real reconfirmation data

## Product States
1. **Fresh** — recently added or confirmed, fully visible to users
2. **Decaying** — timer running, owner nudged, still visible to users
3. **Expired** — fully decayed without reconfirmation, hidden from users until reconfirmed
4. **Flagged** — users reported as unavailable, enters "needs reconfirmation" state regardless of timer

## What Triggers Reconfirmation
- Timer reaching threshold (passive decay)
- User flags on the product (active community signal)

## Reconfirmation Update Timing
Credibility score should update on-demand when reconfirmation events happen, not on a nightly batch. If an owner reconfirms at 9am, their checkmark appearing at midnight is a broken incentive loop. The nightly job handles passive decay (products crossing the expiry threshold); explicit owner actions trigger immediate score recalculation.

## Impact on Other Systems
- Aggregate freshness across all products feeds into [[product/features/Credibility Score]]
- Owner reconfirmation speed logged as analytics event → [[tech/analytics|Analytics]]
- Products that expire reduce venue's overall trust signal
- High expiration rates across venues for a specific product may indicate product discontinuation

## Design Note
Decay bars use single accent color, same as breadth bars. Bar length communicates freshness — no red/green color coding. See [[brand/UNI-Brand-Book|Brand Book]] for color principles.
