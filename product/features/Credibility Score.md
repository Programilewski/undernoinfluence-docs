# Credibility Score

**Status:** **Superseded — will not be built in V1.** **Verified against code 2026-08-18.** There is no `credibility_score` column and there will not be one: ADR-004 and D-01 replaced the blended confidence score with three independent things — `breadth_score` (a flat product count, ADR-008), the "Sprawdzona karta" badge (`is_verified` plus expiry) and the "Zarządza właściciel" badge (`is_claimed`). Read this document as a V2+ target, not as V1 backlog. It is **not** a blocker for [[product/features/Verified Checkmark]] — that feature shipped without it.

## Purpose

The credibility score has two roles:
1. **Trust signal** — inputs feed into the [[product/features/Verified Checkmark]] threshold
2. **Default sort order** — venues sorted by credibility_score DESC on the discovery page

These roles can create tension: a new venue with perfect data quality should score high on trust, but a popular venue with more products might feel more useful to a user. In V1, a single score serves both purposes. If post-launch data shows they need to diverge (e.g., a separate "popularity" sort), that becomes ADR-010.

## Score Range

`0.00` to `1.00` stored as a decimal column on `venues`. This range avoids the temptation to display it as a percentage score to users — it's an internal value, never shown raw.

## Inputs

### What to use

**1. Freshness aggregate** (weight: high)
What fraction of the venue's products are in "fresh" state (not decaying, not expired, not flagged)?
`fresh_products / total_products`
A venue where 90% of products are freshly confirmed is more trustworthy than one where 50% are expired. This is the most meaningful signal because it requires ongoing owner engagement.

**2. Is claimed** (weight: medium, binary boost)
Owner-managed venues are more trustworthy than community-sourced data. A claimed venue gets a fixed score bonus. Unclaimed venues can still achieve a high score if freshness and completeness are strong, but claimed venues have a ceiling advantage.

**3. Profile completeness** (weight: medium)
Does the venue have: address, at least 1 product in at least 1 category, city assigned? Each missing field deducts from completeness. Simple checklist — not a count of optional fields.

**4. Flag rate** (weight: medium-low)
Ratio of open (unresolved) flags to total products. Lower is better. A venue with 0 flags on 10 products scores higher than one with 3 flags on 10 products. Flags that the owner has resolved (reconfirmed the product) do not count against the score.

**5. Product count** (weight: low)
More products = more engagement with the platform. But this should carry low weight to avoid penalising specialists. A bar with 10 NoLo beers and nothing else should not rank below a bar with 1 product in each of 6 categories.

### What NOT to use

**View count / navigate clicks** — these are popularity signals, not trust signals. A new venue with perfect data should score identically to a popular one with perfect data. Mixing popularity into credibility would make the sort self-reinforcing (popular venues rank higher → get more views → rank even higher) and would systematically disadvantage new venues.

**Number of categories covered** — penalises specialists. A wine bar that exclusively carries 12 NoLo wines is a high-value venue; it shouldn't rank below a restaurant that has 1 product in each category.

**Age / time on platform** — same problem as view count. New venues should be able to earn high scores quickly if their data is good.

## Formula Structure

A weighted average across the five inputs, clamped to `[0.00, 1.00]`:

```
score = (
    freshness_aggregate  * 0.40 +
    is_claimed           * 0.20 +
    profile_completeness * 0.20 +
    (1 - flag_rate)      * 0.15 +
    product_count_factor * 0.05
)
```

**Initial weights are provisional.** They should be tuned after 50+ venues have real data and real owner behavior is observable. The formula structure is more important to get right than the exact weights — those are empirical.

`product_count_factor` = `min(product_count / 20, 1.0)` — reaches max contribution at 20 products. Prevents a venue with 200 products from dominating solely on volume.

## Storage

Stored as a column `credibility_score DECIMAL(4,2)` on the `venues` table. Not computed on every query — this would make the discovery page query uncacheable.

## Update Triggers

Two mechanisms, both required:

**Event-driven (immediate):** When an owner reconfirms a product, adds a product, or a flag is submitted/resolved, the venue's credibility_score is recalculated immediately. This ensures the checkmark appears (or disappears) within the same request cycle, not hours later. A Queued Job dispatched from the relevant model events handles this.

**Nightly batch (passive decay):** A scheduled job runs overnight to decrement freshness for products crossing their decay threshold. This handles passive score degradation without requiring an HTTP request to trigger it.

## Checkmark Threshold

The [[product/features/Verified Checkmark]] appears when `credibility_score >= threshold`.

Store the threshold in `config/uni.php` (not hardcoded, not in a settings table). This allows tuning without a migration and without introducing a settings table for a single value. Initial value: `0.70`.

```php
// config/uni.php
'credibility' => [
    'checkmark_threshold' => 0.70,
    'product_count_max'   => 20,
],
```

## Venues With Zero Products

A venue with 0 products has `credibility_score = 0.00` and is hidden from search results entirely. The minimum listing requirement (1 product in 1 category) must be satisfied before a venue appears in the discovery list. This is enforced at the query level, not by setting the score to zero.

## Connection to B2B

The owner dashboard shows checkmark status (earned / not earned) but never the raw score. General guidance only: "Your checkmark depends on how complete your listing is, how recently you've confirmed items, and whether users report issues." The formula weights stay secret — owners must engage with all inputs, not just the highest-weighted one.
