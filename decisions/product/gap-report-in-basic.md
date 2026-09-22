# Gap report in Basic tier — no standalone SKU, no premium gate

**Date:** 2026-05-12
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14 (`VenueFeature::tier()`)
**Area:** Analytics | Venues

---

## Problem

The gap report ("your competitors in Mokotow serve wine 0% but you don't") is the highest-value B2B analytics insight. Anchoring it in the Pro tier would maximize per-owner revenue. But at launch with fewer than 20 claimed venues, adoption feedback matters more than revenue optimization.

## Options considered

1. **Gap report in Pro tier** — maximizes revenue per owner but creates friction at a stage where adoption signal matters more.
2. **Gap report as standalone 39 PLN/month SKU** — rejected. Adds billing complexity for a single feature.
3. **Gap report in Basic tier** — lower friction, more owners paying, more pricing signal.
4. **Gap report in Free tier** — gives away the crown jewel, no monetization signal at all.

## Decision

Gap report lives in the Basic tier, not Pro. No standalone gap-report SKU. The Free tier contains zero detailed demand intelligence — at most 1-2 compact paid teasers per page (e.g., "Demand signals exist in your city" without category names, volumes, or trend details). Free must not become a locked-card nag wall.

## Rules

Free tier: profile performance and catalog health only. Basic tier: gap report, demand signals, category-level insights. Pro tier: advanced analytics, export, historical trends. The Free tier teasers show existence of data, never specifics.

## What this prevents

Over-optimizing revenue before having pricing signal. Charging 39 PLN/month for a single report when you have 5 paying owners teaches you nothing. Having 15 owners on Basic teaches you what they actually value.

## Revisit when

At 20+ active paid subscriptions. If Basic conversion is strong, consider moving gap report to Pro and introducing a lighter Basic tier. Do not make this move speculatively before real subscription data exists.
