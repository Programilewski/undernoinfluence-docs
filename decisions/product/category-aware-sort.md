# Category-Aware Sort on Discovery Page

**Date:** 2026-06-10
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** Scoring

---

## Problem

When a user selects a category filter (e.g. "piwo"), the discovery page filters to venues carrying that category — but still sorts by overall `breadth_score`. A venue with 2 beers and 30 wines ranks above a venue with 15 beers and 16 total products. The user selecting "piwo" expects the best beer selection at the top, not the biggest overall menu.

## Options considered

1. **Keep overall breadth as the only sort signal.** Simple, but defeats the purpose of category filtering for ranking.
2. **Add a category-specific breadth as the primary sort when a category filter is active.** Count products in the selected categories and sort by that first, then fall back to overall breadth and diversity tiebreakers.
3. **Pre-compute per-category breadth scores as denormalized columns.** Fast reads, but adds migration complexity and sync overhead for every category change.

## Decision

We use option 2: a SQL subquery (`category_breadth`) computes the product count in selected categories at query time and sorts by it first when any category filter is active. The subquery handles both catalog products (joined through `categories.slug`) and custom drinks (when `drinki` is selected). When no category filter is active, sorting is unchanged — overall `breadth_score` remains the primary sort.

## Rules

When one or more category pills are active on the discovery page, venues are sorted by product count in those specific categories (descending), then by overall breadth score, then by catalog category diversity, then by custom drink diversity, then by venue name. Multi-category selections sum product counts across all selected categories. The `drinki` category counts `venue_drinks` rows instead of `venue_products`. Without category filters, the sort order is overall breadth score first, exactly as before.

## What this prevents

Prevents a confusing experience where selecting "piwo" shows a wine-heavy venue above a beer-specialist venue just because the wine place has more total products. Aligns ranking with user intent: "show me the best places for X."

## Revisit when

If per-category breadth queries become a performance bottleneck at scale (>1000 venues), consider denormalizing per-category counts. Also revisit if we add weighted scoring where category quality matters, not just quantity.
