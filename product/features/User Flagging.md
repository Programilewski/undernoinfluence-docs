# User Flagging

**Status:** **Backend exists, no public interface — and that is an inconsistency to resolve.** **Verified against code 2026-08-18.** What exists: the `VenueInaccuracyReport` table and model, an admin panel resource, and `StoreVenueInaccuracyReportRequest`. What does not: a public route, a controller, and a button on the venue page. There are 0 reports in the database. D-11 says do not build community reporting in V1 — but `/jak-to-dziala` **already promises** users that button. Pick one: build the button, or cut the sentence. The flag-weighting and trust-threshold system described below is still V2 — it depends on user accounts, which V1 does not have.

## Concept
Users report products that aren't actually available at a venue. This is UNI's lightweight alternative to a full review system — it captures the most actionable feedback without requiring user volume.

## User Experience
- Any user can tap "not available" on a specific product at a venue
- UI is identical for all users — no greyed-out states, no gatekeeping messages, no "be more active to review" hints
- New user flags are silently weighted at near zero
- Flag weight increases as user builds activity history on the platform

## Why No Visible Gating
- Revealing the activity threshold tells gamers exactly what to fake
- Greyed-out buttons are a hostile first impression for new users
- Silent weighting lets everyone feel heard while protecting data quality

## Activity Score
Defined in V1 as accumulated interactions:
- Venue profile views
- Category filter usage
- Map searches
- Time spent on platform

Exact thresholds for "meaningful activity" kept internal. No public-facing activity score or level.

## Impact of Flags
1. Enough valid flags on a product → product enters "needs reconfirmation" state
2. Owner notified, must reconfirm within set window
3. If owner doesn't reconfirm → product hidden from users
4. Accumulated flags across multiple products reduce venue's overall confidence score
5. Can cost venue its [[product/features/Verified Checkmark]]

## Abuse Prevention
- Flags only carry weight from users with activity history
- Competitor false-flagging requires multiple credentialed accounts with real activity — expensive to scale
- Flag patterns monitored internally for coordinated abuse → [[tech/analytics#Events by tier|Tier 1 analytics]]

## What Users CANNOT Do
- Cannot leave text reviews (V1)
- Cannot rate venues (V1)
- Cannot flag custom drink tags as inaccurate (deferred, comes with tag system)
- Cannot see other users' flags
