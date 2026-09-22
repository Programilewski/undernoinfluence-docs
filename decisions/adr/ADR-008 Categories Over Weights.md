# ADR-008: Categories Over Weights

## Status
**Decided: 6 flat categories, no scoring multipliers.**
**Executed:** yes — verified in the code 2026-09-14

## Context
Multiple weighting approaches were considered to differentiate venues: per-product rarity weights, per-category multipliers, scarcity-based dynamic weights.

## Options Rejected
1. **Per-product weights** (basic beer = 1x, rare beer = 5x, custom mocktail = 10x) — who decides what's rare? Editorial burden, gameable, hard to explain.
2. **Per-category multipliers** (beer = 1x, spirits = 1.5x, mocktails = 2x) — punishes beer specialists unfairly.
3. **Database scarcity** (fewer venues list a product = higher weight) — rewards venues that happen to list common products nobody else bothered adding, not actual quality.

## Decision
6 flat categories with equal visual treatment. No multipliers, no rarity scoring. Let breadth bars show raw product counts. Users decide what matters by filtering.

## Categories
1. Piwo
2. Wino
3. Spirytusowe
4. Koktajle / Mocktaile
5. Cydr
6. Napoje musujące / Toniki

## Rationale
- All weight systems were designed before having real user data
- Simpler to ship, easier to explain, impossible to game
- If users consistently filter by one category, that signals demand — no algorithm needed
- Complexity can be added later based on observed behavior

## When to Revisit
After V1 launch with real usage data showing what users actually value. If analytics show clear demand patterns, consider weighting then.
