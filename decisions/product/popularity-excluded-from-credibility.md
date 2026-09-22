# Popularity signals excluded from credibility score

> **Superseded 04.09.2026.** `credibility_score` is not in the schema and the concept is not in the code — the score it describes no longer exists. Kept for its reasoning, which is still the reason not to rebuild it. See [[decisions/product/credibility-score-was-removed]].

**Date:** 2026-04-22
**Status:** Decided
**Executed:** superseded 2026-09-04 by [[decisions/product/credibility-score-was-removed]]; the principle — views never feed ranking — still holds in the code
**Area:** Scoring | Analytics

---

## Problem

View counts and click-through rates are tempting credibility inputs — a popular venue probably has good data, right? But mixing popularity into a trust score creates a self-reinforcing loop: popular venues rank higher, get more views, rank even higher. New venues with perfect data can never catch up. This systematically punishes early-stage listings and discourages venue owners from joining a platform where they'll always be buried.

## Options considered

**Include view count and navigate clicks** — more data points, correlates weakly with real-world popularity. Self-reinforcing ranking. Disadvantages new venues structurally.

**Include recency-weighted popularity** — decay the popularity signal so older views matter less. Partially mitigates the loop, but adds complexity and still disadvantages new venues at launch.

**Exclude popularity entirely** — credibility is a pure data-quality signal. A new venue with perfect freshness and complete profile scores identically to a long-standing popular venue with the same data quality.

## Decision

Popularity signals (views, navigate clicks, time on page, return visits) are excluded from the credibility score entirely. They are logged as analytics events for internal product decisions and the paid B2B tier, but they have zero weight in the formula that determines checkmark and default sort order.

## Rules

The `credibility_score` formula uses only: freshness aggregate, claimed status, profile completeness, flag rate, and product count. No view count column, no click count, no session time. Analytics events for views and clicks feed only into internal dashboards and the paid owner analytics tier — they are never piped back into sorting or scoring.

## What this prevents

Prevents the cold-start problem: a newly onboarded venue with excellent data should rank at or near the top immediately, not spend months climbing a popularity ladder. Prevents the rich-get-richer dynamic that makes discovery platforms fail for their supply side. Keeps credibility honest — it measures whether the data is trustworthy, not whether the venue is already popular.

## Revisit when

Post-V1, if user feedback shows that sort order feels random or arbitrary. At that point, consider a secondary "relevance" sort option that blends credibility with recency of activity — but keep credibility itself free of popularity.

---

*See also: credibility-formula-opacity.md*
