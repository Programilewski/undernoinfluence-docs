# Venue lists are never sold as sales leads

**Date:** 2026-08-31
**Status:** Decided
**Executed:** partly — nothing sells lists; the public commitment is not yet written on the privacy policy (the venue-facing page does not exist)
**Area:** Brand | Venues | Analytics

---

## Problem

The catalogue is a list of venues that stock non-alcoholic drinks, with addresses, contact details and what each one carries. That is a qualified prospect list for any brewery or distributor with a field sales team, and selling it would be legal — a venue is a company, and company data is not personal data. OnTrade Insight already does exactly this in Benelux. The question is not whether it is allowed but what it costs, and the cost is not visible on a balance sheet.

## Options considered

Sell venue lists to producers as a lead product, which is the fastest revenue line available and needs no traffic. Keep the option open and decide when a buyer actually asks. Rule it out permanently and say so publicly on the venue-facing page. Sell only aggregate counts with no venue identified, which is the producer-insights line already planned.

## Decision

UNI does not sell venue lists as sales leads, and says so publicly. Producer revenue comes from aggregates — counts, trends, category demand, area-level coverage — never from a list a sales representative can work through. The distinction is that a producer may learn that 40% of Śródmieście venues carry a 0% lager; they may never learn which ones, in a form that lets them be called.

## Rules

No product, export, report or API surface identifies individual venues to a paying third party. Aggregates published to producers are anonymised at area level, in line with the small-bucket threshold already applied to owner reports. The commitment is written on the venue-facing page when that page exists, and in the privacy policy alongside the recipients section, because a promise that lives only in an internal document is not one an owner can rely on. An inbound request to buy a venue list is declined and recorded, since the volume of such requests is itself useful signal about the producer market.

## What this prevents

The trust position the entire product rests on is that a venue's listing exists to help people find non-alcoholic drinks, not to make the venue a target. An owner who discovers their venue was sold to a brewery's sales rep does not weigh the nuance — the product becomes a lead-generation scheme that was pretending to be a guide, and that judgement spreads faster than any correction. It also protects the aggregate line: a buyer who could have the list has no reason to pay for the trend.

## Revisit when

Only on a change of circumstance large enough to be written down as its own decision, not on a good offer. The founder's position is that this is 99% permanent and the remaining 1% is reserved for a ground-shaking change in the business, so any reversal requires a superseding record naming what changed.

---

*See also: [[decisions/product/no-pay-to-rank]], [[decisions/product/analytics-three-tiers]], [[decisions/product/no-identifier-based-deduplication]]*
