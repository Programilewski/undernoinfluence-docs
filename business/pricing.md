---
version: 0.1
owner: Paweł Milewski
updated: 2026-05-13
status: draft
---

# Pricing

Pricing assumptions and packaging for the marketplace.

## Pricing Goals

- TODO: Define target customer willingness to pay.
- TODO: Define whether pricing optimizes activation, revenue, retention, or supply growth.

## Packages

| Plan | Target customer | Price | Billing cycle | Included features | Limits | Status |
| --- | --- | --- | --- | --- | --- | --- |
| Free | TBD | TBD | TBD | TODO | TODO | draft |
| Pro | TBD | TBD | TBD | TODO | TODO | draft |
| Enterprise | TBD | TBD | TBD | TODO | TODO | draft |

## Paid Features

Paid analytics should be treated as entitlement modules, not only as plan-page sections.

- A plan is the commercial bundle: Free, Basic, Pro, Premium.
- A module is the runtime entitlement: one report, alert, export, or analytics capability.
- A trigger is why the module is active: subscription, manual admin override, beta access, partner deal, trial, comp, or future one-off purchase.

Runtime access should use feature entitlement checks such as `$venue->hasFeature(VenueFeature::GapReport)`. Raw plan checks should be reserved for pricing labels, packaging copy, upgrade prompts, and preview selection.

| Module | Included bundle | Manual trigger | Future payment trigger | Notes |
| --- | --- | --- | --- | --- |
| Gap Report | Basic+ | yes | subscription or add-on | Core paid demand signal. |
| Category Demand Ranking | Basic+ | yes | subscription or add-on | Shows demand order and whether the venue carries it. |
| Breadth Position | Basic+ | yes | subscription or add-on | Owner UI should prefer qualitative bands over raw internal scoring. |
| Competitor Gap | Pro+ | yes | subscription or add-on | Area counts of what nearby venues added, per category — never a venue or product name, and nothing for an area under three venues (analytics-three-tiers, amended 14.09). |
| Search Spike Alerts | Pro+ | yes | subscription or add-on | Can later support email/push delivery. |
| District Demand Map | Pro+ | yes | subscription or add-on | Strong visual report candidate. |
| Freshness Warning Emails | Premium | yes | subscription or add-on | Premium shifts from dashboard to proactive service. |
| Trending Product Alerts | Premium | yes | subscription or add-on | Also creates future distributor intelligence value. |
| Strongest Category Badge | Premium | yes | subscription or add-on | Shareable social proof asset. |
| Click Detail Report | Premium | yes | subscription or add-on | Engagement timing and outbound click detail. |

Other paid features to evaluate later:

- Featured placement: TBD
- Lead visibility: TBD
- Profile customization: TBD
- Multi-location management: TBD
- API or export access: TBD

## Billing and Compliance Notes

- Payment provider: TBD
- Invoicing process: TBD
- Refund policy: TODO
- Consumer/business distinction: TODO
- Related ROPA section: `../compliance/ropa.md`

## Open Questions

- TODO: Confirm first paid package.
- TODO: Confirm VAT/invoicing requirements with accounting or legal support.
