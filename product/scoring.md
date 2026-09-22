---
version: 1.1
owner: Paweł Milewski
updated: 2026-08-18
status: archived-in-part
---

# UNI Scoring Specification

> **Largely superseded — checked in code 2026-08-18.** Two things below are simply false now:
> scoring in code is **not** `$venue->id % 4` (that placeholder is long gone), and the tiered /
> weighted system described here was **decided against**, not deferred. What actually ships:
> `venues.breadth_score`, a flat count of distinct products with no weights and no brand-diversity
> boost (ADR-008, D-08), written synchronously by observers (D-07), plus two independent binary
> badges (D-01, D-14 — see `../decisions/v1-locked.md`).
>
> Read this document as the V2+ target for a richer score. Where it disagrees with
> `../decisions/v1-locked.md`, the locked decisions win — that file lists the four specific
> sections of this spec it supersedes.

This document defines what badges and category bars mean, what inputs drive them,
and what rules govern data confidence.

---

## 1. Category Bars

### What they represent
The bar width signals **how broad and diverse the offering is within a category** —
not a raw product count, and not a percentage of anything numerical that users should
be able to reverse-engineer.

A venue with 2 products that are genuinely different (different style, brand, origin)
should score higher than one with 4 products that are essentially the same thing from
the same supplier.

### What affects bar width
- Number of distinct products in the category (primary driver)
- Diversity of brands/producers (boosts score)
- Availability: only `is_available = true` products count
- Data confidence (stale products don't contribute fully — see §3)

### What does NOT affect bar width
- Whether other categories have products (categories are scored independently)

### Absence of a bar
A category bar only renders when `drinkAvailability > 0`. Absence means the venue
genuinely doesn't offer that category — it is **not a penalty**. A venue specialising
in NA cocktails with no beer is not worse for lacking the beer bar.

---

## 2. Badge Tiers

Badges are a **combined signal of offering quality and data trustworthiness**.
A venue can only reach gold if both are high. Breadth across categories is not required.

### Gold
> *Wysoka jakość w oferowanych kategoriach, potwierdzona aktualnymi danymi od lokalu.*

Criteria (all must be true):
- Venue is `is_claimed` (owner has verified and taken ownership of the profile)
- Data has been confirmed within the last **90 days**
- At least one category has a high diversity score (not just token products)
- No products flagged as stale (see §3)

Example that qualifies: a cocktail bar with 12 distinct NA cocktails from different
spirit bases, confirmed by the owner last month. No beer, no wine — still gold.

Example that does NOT qualify: a restaurant with 6 categories but the last data
confirmation was 8 months ago, and the owner has never claimed the profile.

### Silver
> *Dobra oferta bezalkoholowa z wiarygodnymi danymi.*

Criteria:
- Either `is_claimed`, OR data confirmed within the last **180 days** by UNI team
- At least one category with meaningful product diversity (more than a token 1–2 options)
- No more than 20% of products flagged as stale

### Bronze
> *Lokal z potwierdzoną ofertą bezalkoholową.*

Criteria:
- At least one `is_available` product in any category
- That product has been confirmed as real at some point (not auto-imported without verification)
- Data is not entirely stale (at least one product confirmed within **365 days**)

### No badge
Anything that does not meet Bronze. Reasons a venue has no badge:
- Newly added, not yet verified
- All products are stale/unconfirmed
- Profile was imported but never validated

**No badge is not a verdict.** It means "we don't know enough yet." The venue card
still appears; users can still navigate there. The absence of a badge should be read
as "unrated", not "bad".

---

## 3. Data Confidence & Staleness

The scoring system is only as good as the data underneath it. Confidence decays over time.

### Confirmation sources (ranked by trust)
1. **Owner-confirmed** (`is_claimed = true`, product updated via owner panel) — highest trust
2. **UNI team verified** — staff manually checked the menu
3. **Community reported** — user submitted, not independently verified
4. **Auto-imported** — scraped or bulk-added, lowest trust until verified

### Staleness thresholds
| Last confirmed | Status |
|---|---|
| < 90 days | Fresh — full weight in scoring |
| 90–180 days | Aging — partial weight, no badge upgrade possible |
| 180–365 days | Stale — products still shown, but marked visually; Bronze still possible |
| > 365 days | Expired — products hidden from bars/counts; venue may lose badge |

### Schema gaps (not yet implemented)
The current `venue_products` table has no `confirmed_at` or `confirmed_by` column.
Both are needed before real scoring can be built. Suggested migration:

```
venue_products.confirmed_at      — timestamp, nullable
venue_products.confirmed_source  — enum: owner, uni_team, community, auto
```

---

## 4. Open Questions

- **Category diversity score**: needs a formula. Options: unique brands count,
  unique `attributes->style` values, or a manual curator rating per product.
- **Score recalculation**: on-demand at request time (simplest), or nightly job
  writing a `score` column to `venues` (better for filtering/sorting).
- **Downgrade behaviour**: if a gold venue goes stale, does the badge drop immediately
  or after a grace period? Suggest: 30-day grace with a visual "data aging" hint before
  the badge changes.
- **Multi-category bonus**: should a venue with verified offerings in 5+ categories
  get a bump? Current spec says no — but worth revisiting when data volume is larger.
