# ABV trust model — verified tiers and strict-zero filter

**Date:** 2026-05-18
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14 (a fourth state, `verified_exact`, was added later)
**Area:** Data Model | UI/UX | Venues

---

## Problem

Not all "alcohol-free" products are truly 0.0% ABV — many are "up to 0.5%". Users who need absolute zero (drivers, pregnant women, medical reasons) need a way to distinguish. But requiring exact ABV verification for every product would block venue onboarding. The platform needs a trust model that's honest about what it knows.

## Options considered

1. **Binary: alcohol-free or not** — simple but misleading. A 0.5% beer and a 0.0% beer look identical.
2. **Exact ABV for every product** — accurate but impractical. Most venue owners don't know exact ABV.
3. **Trust tiers with unknown state** — honest about uncertainty, lets strict users filter.

## Decision

Three ABV trust states: `verified_zero` (confirmed 0.0%), `verified_under_0_5` (confirmed under 0.5% but not zero), and `unknown` (ABV unconfirmed, displayed as "ABV do potwierdzenia"). The discovery page has a "Tylko 0.0%" strict-zero toggle that filters to only `verified_zero` products and products with `abv = 0.0`. V1 scope includes 0.0% and products up to 0.5%; broader low-alcohol (e.g., 1-3%) is deferred.

## Rules

The strict-zero filter uses `verified_zero` status AND numeric `abv = 0.0` — both conditions. Unknown ABV products are never included in strict-zero results. The "ABV do potwierdzenia" label is shown on venue profiles for unknown-ABV products so users can make informed choices. Venue owners can update ABV status through the owner panel.

## What this prevents

False confidence. Users who need true zero won't accidentally consume 0.5% products. And the platform doesn't gate all products behind ABV verification, which would kill onboarding velocity.

## Revisit when

If user feedback shows demand for broader low-alcohol inclusion (1-3% ABV), or if ABV data quality improves enough to remove the "unknown" state.
