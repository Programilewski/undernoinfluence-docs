# Product Reference Database

**Status:** **Schema and panels exist, the catalog is nearly empty, tags do not exist at all.** **Verified against code 2026-08-18.** In the database: 12 products, 12 brands, 6 categories, 105 venue-authored custom drinks. **The `tags` table and `product_tag` pivot do not exist** — contrary to what [[product/features/Features Index]] claimed — and there is no `Venue::scopeWithTags()` either. The whole tag system is specification, not code. Product search and assignment work in both panels. What remains: the target ~50-100 catalog products, to be collected alongside the venues.

## Concept
A master database of known NoLo products with pre-assigned tags. When a venue adds "Heineken 0.0" to their listing, the product data and tags come automatically.

## Why This Matters
- Owners don't need to understand or apply tags — they just select products
- Tag data is consistent across all venues (Heineken 0.0 is always "Bezglutenowy" everywhere)
- Enables tag-based filtering from day one without depending on owner input
- Builds UNI's data authority — the product database itself is a defensible asset

## Data Per Product
- Name (e.g., "Heineken 0.0")
- Category (e.g., Piwo)
- Brand
- Tags (e.g., Bezglutenowy, Bez cukru)
- ABV (0.0% or <0.5%)
- Optional: image, description, country of origin

## How It's Built
1. Start manually — research the most common NA products available in Poland
2. Seed the database with ~50-100 products across all 6 categories
3. Grow it as venues add new products that aren't in the reference DB
4. When a venue adds a product not in the DB, it becomes "custom" and the owner provides details

## Owner Flow
1. Owner starts typing a product name
2. Autocomplete suggests matches from reference DB
3. Owner selects → product added with all pre-assigned tags and metadata
4. If no match → owner enters manually (similar flow to [[product/rules/Custom Drinks Rules]] but for branded products not yet in DB)

## Connection to Tags
Tags live on products in the reference DB. When tag filters launch (post-V1), filtering by "Bezglutenowy" queries the reference DB tags, not owner-provided data. This ensures accuracy.

Custom drinks get owner-assigned tags (see [[product/rules/Custom Drinks Rules#Tagging]]).
