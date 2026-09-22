# ADR-006: No Reviews in V1

## Status
**Decided: Flagging only, no reviews.**
**Executed:** partly — no reviews exist; product-level "not available" flagging was not built, and a venue-level inaccuracy report took its place ([[decisions/product/community-reporting-needs-accounts]])

## Context
Reviews need critical mass to be useful. One 5-star and one 2-star review is worse than no reviews — it looks dead.

## Decision
Replace reviews with product-level flagging. Users tap "not available" on specific products. This captures the most actionable feedback without requiring volume.

## Rationale
- UNI isn't about "is this a good bar" — Google Maps handles that
- UNI is about "what NoLo drinks can I find here" — the catalog answers this
- Reviews create a second chicken-and-egg problem alongside venue supply
- Flagging is useful from the first flag; reviews need dozens to be credible
- Flagging feeds directly into the confidence system and [[product/features/Verified Checkmark]]

## Future Consideration
If reviews return post-V1, consider NoLo-experience-specific reviews only: "bartender knew how to make NA cocktails" or "great mocktail menu but felt judged ordering." Niche insight Google Maps will never surface.

## When to Revisit
When platform has enough active users (hundreds per city) to populate reviews meaningfully.
