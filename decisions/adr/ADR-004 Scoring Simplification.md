# ADR-004: Scoring Simplification

## Status
**Decided: Binary checkmark, no tiers, no complex formulas.**
**Executed:** yes — verified in the code 2026-09-14 (`Sprawdzona karta` plus the freshness line; product flagging was not built — see ADR-006)

## Context
Original spec had three metrics (Breadth 1-100, Confidence with gold/silver/bronze, Freshness), user ratings affecting breadth with percentage tables, owner caps at 65%, and originality scoring requiring a reference DB.

## What Changed
- Breadth → visual per-category bars (no composite 1-100 score)
- Confidence + Freshness → merged into single binary checkmark
- User ratings → removed entirely, replaced by product flagging
- Owner caps → removed, owner data is the baseline, community validates
- Originality scoring → deferred, revisit when usage data shows if users value rarity
- Bronze/Silver/Gold → removed, binary checkmark only

## Rationale
- Old system would take months to build and tune
- Three visible metrics cause decision paralysis for users
- Complex scoring is gameable once owners reverse-engineer it
- Binary checkmark (present/absent) is instantly understandable
- Bar length per category communicates breadth without a number

## What's Preserved
- Breadth concept (category bars show what a venue offers)
- Confidence concept (community validation affects trust signal)
- Freshness concept (decay system keeps data current)
- Owner input is weighted lower than community signals

## When to Revisit
After V1 launch, when real user behavior data shows what metrics users actually look at, filter by, and act on. If users ignore the checkmark, it needs rethinking. If they want more granularity, consider tiers.
