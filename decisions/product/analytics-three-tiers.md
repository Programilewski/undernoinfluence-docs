# Analytics three-tier split — internal vs free owner vs paid premium

**Date:** 2026-04-22
**Status:** Decided
**Executed:** 2026-09-14
**Area:** Analytics | Brand

---

## Problem

UNI collects valuable data: what users search for, which venues they tap, what categories trend in which neighborhoods. This data has three potential audiences — internal product team, venue owners (who have a legitimate interest in their own performance), and the general public. Giving everything to everyone destroys competitive advantage and privacy. Giving nothing to owners removes the B2B incentive to maintain good listings. The wrong boundary placement breaks either the business model or user trust.

## Options considered

**Full owner transparency** — owners see all analytics UNI has on their venue, including how they compare to competitors by name. Raises privacy concerns, removes competitive intelligence value.

**No owner analytics** — owners see only their own listing. No engagement data. Low incentive to maintain listings. No paid tier possible.

**Three-tier split** — strict separation between internal data (competitive intelligence, abuse detection), free owner tier (basic engagement, keeps them engaged), and paid tier (actionable market intelligence that doesn't reveal competitors).

## Decision

Three tiers with strict boundaries. Tier 1 (internal only): session flows, heatmaps, retention, abuse patterns, geographic gaps — never exposed. Tier 2 (free owner dashboard): profile view counts, freshness status, checkmark status, flags received — enough to motivate listing maintenance. Tier 3 (paid B2B subscription): aggregated demand data, visibility vs tap-through, category interest trends, competitive context anonymized at area level — actionable for business decisions.

## Rules

No Tier 1 data ever crosses into owner-facing surfaces. Tier 3 competitive context must be anonymized — "you're one of 4 verified venues in your area" is allowed; naming competitors is not. No raw user-level data is ever visible to owners. Tier 2 is permanently free — removing it would break the owner engagement loop. Tier 3 pricing and exact feature set are deferred until post-product-market-fit.

**Amended 2026-09-14 — the code follows this record.** `competitor_gap` and `new_competitor_nearby` had returned nearby venue names and product names, and the owner analytics preview rendered them. Both are now area counts — how many of the N venues within 1 km added something in a category, how many within 500 m were taken over — and an area with fewer than `analytics.owner_report_min_area_venues` (3) other live venues reports nothing, because a count over one or two venues names them in all but words. `docs/business/pricing.md` said the opposite and is corrected.

## What this prevents

Prevents the privacy failure of owners seeing individual user behavior. Prevents the business model failure of giving away Tier 3 insights for free (which removes the primary revenue lever). Prevents the owner churn problem of giving them nothing — Tier 2 creates a weekly reason to open the dashboard, which is also the primary freshness maintenance touchpoint. Prevents a pay-to-win interpretation: Tier 3 gives intelligence, never ranking advantage.

## Revisit when

Post-V1, when enough owners have real data to validate that Tier 3 insights are compelling enough to pay for. Pricing, packaging, and exact Tier 3 features should be defined based on observed owner behavior on the free tier, not hypothetically.

---

*See also: no-pay-to-rank.md, popularity-excluded-from-credibility.md*
