---
version: 1.0
owner: Paweł Milewski
updated: 2026-07-24
status: approved
---

# Business Model

B2B premium analytics subscription for venue owners. No ads, no pay-to-rank, no promoted
placement — these would destroy the data authority the product is built on.

## Marketplace sides

- **B2C users** — people looking for a genuine alcohol-free offer nearby. Free, no login required.
- **Venue owners (B2B)** — claim their venue, maintain their NoLo listing, buy premium analytics.
- **Administrators** — approve claims, moderate flags, control catalog data.

## Three analytics tiers

### Tier 1: Internal Only (You)

Never exposed to anyone. Exists for product decisions and growth strategy.

- App open patterns (when, where, device)
- Map viewport search heatmap (demand by area)
- Session flow funnels (drop-off analysis)
- User retention (DAU/WAU/MAU)
- Venue activation rate
- Geographic coverage gaps
- Flag abuse pattern detection
- Category growth trends

### Tier 2: Free Owner Dashboard

Basic insights every owner sees. Keeps them engaged and maintaining their listing.

- Profile views (weekly/monthly counter)
- Freshness status (decay bars, which products need reconfirmation)
- Checkmark status (earned or not, with general guidance)
- Flags received (which products, reconfirmation deadlines)
- Products listed (total count per category)

### Tier 3: Premium Owner Insights (Paid B2B Subscription)

Aggregated, anonymized data that helps owners make business decisions.

- Search demand in their area ("300 NoLo searches/week in your neighborhood")
- Visibility vs taps ("You appeared in 200 searches, 15 tapped your venue")
- Category interest ("Users view your beer section 3x more than mocktails")
- Peak search times ("Tuesday and Friday evenings are busiest")
- Filter trends ("Beer is most filtered in your district, but you don't carry it")
- Profile engagement (time spent vs area average, scroll depth)
- Competitive context ("You're one of 4 verified venues in your area" — no competitor names)
- Flag comparison (their rate vs platform average)
- Trend over time (all metrics with weekly/monthly trendlines)

Entitlement is per-feature, not per-plan-name — see [[tech/analytics#Analytics entitlement modules]].

## Pricing

Deferred until product-market fit is proven. Initial thinking:

- Free tier generous enough to keep owners engaged
- Premium priced to be accessible for small venues (PLN range TBD)
- No contracts, monthly subscription

Detail and open questions live in [`pricing.md`](pricing.md).

## B2B acquisition

Primary channel: [[business/Growth Strategy#Physical Touchpoints]] plus the
[[product/features/Static Pages#Dla Lokali]] landing page.

## What UNI will not monetize

- Selling user data to third parties
- Pay-to-rank or promoted placement
- Ads in the product
- Sponsored search results
- Premium badges that can be bought instead of earned

## Connection to incentive design

The entire scoring and display system is designed so that venue owners improve their NoLo
offering to gain visibility. See [[product/features/Verified Checkmark]] — owners cannot pay
for a checkmark, they earn it through data quality. This creates a virtuous cycle: better
listings → better user experience → more users → more valuable analytics → higher B2B
willingness to pay.

## Key risks

| Risk | Status |
|---|---|
| Demand liquidity — too few users to make owner analytics valuable | Open, gated on launch traffic |
| Supply quality — listings decay faster than owners reconfirm | Mitigated by freshness decay + flagging |
| Monetization timing — charging before the data is worth paying for | Deferred until PMF, see pricing |
| Platform trust — flag abuse or gamed checkmarks | Mitigated by [[decisions/product/silent-flag-weighting]] |
| Compliance overhead | Tracked in [`../compliance/`](../compliance/README.md) |

## Related

- [`pricing.md`](pricing.md) · [`metrics.md`](metrics.md) · [`competitors.md`](competitors.md)
- [[business/Growth Strategy]] — acquisition channels
- [[decisions/product/no-pay-to-rank]] — why placement is never for sale
