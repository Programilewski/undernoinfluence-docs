# Verified Checkmark

**Status:** **Built — but differently from what this document describes.** **Verified against code 2026-08-18.** Instead of one threshold on a credibility score, V1 has **two independent binary signals**, split apart on 15.08: "Sprawdzona karta" = `venues.is_verified`, set manually by an admin **and** expiring once `last_menu_check_at` passes `uni.verification_valid_days` (180 days); "Zarządza właściciel" = `venues.is_claimed`, set by `ApproveVenueClaimAction`. Neither depends on the other, neither factors in freshness or user reports, and neither needs [[product/features/Credibility Score]]. Blending freshness and confidence into a single threshold, as described below, is a V2+ target.

## Concept
A single binary trust signal combining freshness and confidence. Either displayed or absent — no tiers, no badges, no warnings.

## How It Works
- **Freshness** = how recently the venue has reconfirmed its products (see [[product/features/Freshness Decay]])
- **Confidence** = how well the listing matches reality per user reports (see [[product/features/User Flagging]])
- Both scores blended behind the scenes into a single threshold via [[product/features/Credibility Score]]
- Pass the threshold → checkmark appears on profile and map pin
- Below threshold → nothing shown. No "unverified" label, no greyed-out badge, just absence.

## Transparency to Owners
- **Inputs disclosed:** "Your checkmark depends on how complete your listing is, how recently you've confirmed items, and whether users report issues."
- **Weights secret:** exact formula and threshold never revealed
- This makes gaming expensive — owners don't know which lever matters most
- Shown on owner dashboard as earned/not earned

## Checkmark Threshold
A single configurable value (e.g., 0.70 on a 0.0–1.0 credibility scale) above which the checkmark appears. Stored in config, not hardcoded, so it can be tuned without a deployment. See [[product/features/Credibility Score#Checkmark Threshold]].

## Why Not Tiers (Bronze/Silver/Gold)?
Considered and deferred. Three tiers + breadth bars + category counts = too much cognitive load for users choosing where to get a drink. Binary is cleaner:
- User sees checkmark → "this data is reliable"
- No checkmark → venue might still be good, just hasn't earned verification yet

Tiers may return post-V1 if data shows users want more granularity.

## Display Locations
- Venue profile page (next to venue name)
- Map pins (small icon overlay)
- Venue cards in discovery list

## Connection to B2B
Checkmark status is visible on the free owner dashboard ([[business/model#Tier 2: Free Owner Dashboard|Tier 2]]). Losing a checkmark is a strong incentive for owners to maintain their listing — it's the most visible trust signal on the platform.
