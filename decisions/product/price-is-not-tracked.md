# Price is not tracked

**Date:** 2026-09-04
**Status:** Decided, with one narrower option open
**Executed:** yes — verified in the code 2026-09-14 (no price fields; the one remaining option was closed on 2026-09-10)
**Area:** Data Model | Venues

---

## Problem

Research on substitution found that a non-alcoholic beer displaces an alcoholic one only when it is **meaningfully cheaper**; at price parity it performs no better than juice. That made recording prices look like the highest-leverage idea available, since price is the one lever that appears independently in both the substitution literature and in evaluations of alcohol pricing policy.

## Options considered

Record full prices per product per venue and surface them. Record price bands rather than exact figures. Record a single relative flag per venue — non-alcoholic options cost less, about the same, or more than the comparable alcoholic ones. Record nothing.

## Decision

**We do not track prices.** Prices change faster than menus, and we already struggle to keep menus current — the whole freshness apparatus exists because that is hard. **A stale price is worse than no price: it is a specific, checkable claim that is wrong**, on a product whose single asset is being trustworthy about what a venue actually offers.

## Rules

No price field on products or on the venue–product relation, and no price displayed anywhere. The one remaining option is a **single enum on the venue** recording whether non-alcoholic options cost less, about the same, or more than comparable alcoholic ones, set during the same visit that records the drinks and never shown as a figure — this is left open rather than adopted. If it is not adopted, price is out entirely; a half-maintained field is worse than an absent one.

## What this prevents

A maintenance burden that would quietly degrade into wrong data, and with it the credibility of the freshness claim that everything else rests on. It also prevents a second, subtler failure: a price we cannot keep current would sit next to numbers we can, and one visibly wrong figure discredits the ones beside it.

## Revisit when

Venues can maintain their own data through the owner panel, which moves the cost of currency to the party who already knows the answer. Also revisit if the relative-price flag is adopted and turns out to age well.

---

*See also: [[decisions/product/mission-is-the-healthy-choice]], [[decisions/product/abv-trust-model]]*
