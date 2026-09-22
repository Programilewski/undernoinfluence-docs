# Credibility formula opacity — inputs disclosed, weights secret

> **Superseded 04.09.2026.** `credibility_score` is not in the schema and the concept is not in the code — the formula it describes no longer exists. Kept for its reasoning, which is still the reason not to rebuild it. See [[decisions/product/credibility-score-was-removed]].

**Date:** 2026-04-22
**Status:** Decided
**Executed:** superseded 2026-09-04 by [[decisions/product/credibility-score-was-removed]] — there is no score left to keep opaque
**Area:** Scoring | Venues

---

## Problem

Venue owners need enough information to improve their listing, but if they know the exact formula weights, they'll optimize for the metric rather than the underlying behaviour. A venue owner who knows freshness is worth 40% will reconfirm products mechanically without caring about accuracy. The trust system only works if owners can't game it precisely.

## Options considered

**Full transparency** — publish the formula, weights, and threshold. Maximum owner trust, minimum mystery. Trivially gameable.

**Full opacity** — don't even tell owners what inputs exist. Owners have no idea how to improve. Creates frustration and churn.

**Inputs disclosed, weights secret** — owners know which behaviours matter (freshness, completeness, flags, claiming) but not how much each one counts. Formula stays internal.

## Decision

Inputs disclosed, weights secret. Owners see the message: "Your checkmark depends on how complete your listing is, how recently you've confirmed items, and whether users report issues." The raw `credibility_score` value is never shown to owners or users — only the earned/not earned checkmark state. Weights and threshold remain internal.

## Rules

The owner dashboard shows checkmark status (earned / not earned) only. No numeric score, no percentage, no progress bar toward the threshold. The four input categories (freshness, claimed status, profile completeness, flag rate) may be described in general terms in the owner dashboard UI. The exact formula, weight coefficients, and `checkmark_threshold` config value are never published or documented outside internal files.

## What this prevents

Prevents owners from optimizing for the metric instead of the outcome — the classic Goodhart's Law failure. If an owner knows freshness is 40% and claiming is 20%, they'll reconfirm every product on a timer and claim their listing purely for the score boost, ignoring completeness and flag resolution. Secret weights force owners to engage meaningfully with all inputs.

## Revisit when

Post-V1, if owner feedback shows widespread confusion about why they lost a checkmark. At that point, consider a dashboard breakdown showing which inputs are "healthy" vs "needs attention" — without revealing relative weights.

---

*See also: no-batch-confirm.md*
