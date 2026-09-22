# Discovery searches record which venues came back

**Date:** 2026-08-24
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** Analytics

---

## Problem

The search event recorded the query and the number of results, not which venues were returned. Without the identities there is no way to compute visibility against tap-through — "you appeared in 340 searches and were tapped 12 times" — which is the Tier 3 metric an owner would actually pay for. The data cannot be reconstructed after the fact, so every day it is not stored is permanently lost. The hesitation was that owners might resent seeing who ranked above them.

## Options considered

Store nothing, and accept that no paid tier can be built later. Store every returned identity, which grows the event payload without bound on broad queries. Store a capped prefix of the result list in rank order.

## Decision

The first twenty returned venue identities are stored on each search event, in rank order. Storing them changes nothing about how results are ranked — ranking stays governed by credibility, permanently — so this is a storage question rather than a fairness or privacy one, and venue identifiers are not personal data.

## Rules

The stored list is capped at twenty and kept in rank order, so position is implicit and needs no second field. Recording what was returned never feeds back into how results are ordered; the two remain unconnected. What is derived from this data and sold to owners follows the existing three-tier split, meaning an owner sees their own visibility and anonymised area context, never a named ranking of competitors.

## What this prevents

Prevents the only genuinely sellable B2B metric from being unbuildable at the moment there is finally an owner willing to pay for it, since search history cannot be backfilled. The cap prevents an unbounded payload on broad queries, and the rank-order rule prevents a second stored field that could drift out of agreement with the first.

## Revisit when

The first paid tier is defined, or the stored searches show a pattern the current event shape cannot answer — such as repeated multi-product queries, which would decide whether a product-level filter is worth building.

See also: [[decisions/product/analytics-three-tiers]], [[decisions/product/no-pay-to-rank]], [[decisions/product/credibility-formula-opacity]]
