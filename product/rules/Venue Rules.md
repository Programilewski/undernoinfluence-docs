# Venue Rules

## What Gets Listed

Venues must be **physical locations** where a customer can sit down and order a non-alcoholic drink. The core question: "Would a NoLo consumer specifically go here for drinks?"

### Allowed Venue Types
- Bars
- Pubs
- Restaurants (with meaningful drink menus, not just water and cola)
- Cocktail bars
- Wine bars
- Clubs
- Hotel bars (especially boutique with curated NoLo offerings)
- Cafés with NoLo cocktail/drink programs

### Not Allowed in V1
- Kebab shops, fast food chains — would clutter the app with irrelevant venues
- Grocery stores, supermarkets — retail, not HoReCa
- Online-only shops (e-commerce deferred entirely)
- Food trucks, pop-ups (too transient for freshness system)
- Catering services

### Grey Area (Case by Case)
- Restaurants like La Repubblica Warsaw — upscale dining with genuine cocktail programs → **allowed**
- Chain restaurants with a token Heineken 0.0 → **allowed but will naturally score low** on breadth
- Seasonal venues — allowed if they have `operating_months` defined in their profile

## Minimum Listing Requirements

A venue must have **at least 1 product** in **at least 1 category** to appear in search results. Empty profiles are hidden from users.

## Venue Data Sources

For V1 seeding in Warsaw:
1. CEIDG/KRS API — PKD codes 56.30.Z (bars) and 56.10.A (restaurants) as prospecting list
2. Manual enrichment via venue websites, social media, Google Maps browsing, Untappd
3. NoLo distributor client lists (partnership opportunity)
4. The venue's own online menu, its social media, or a visit — **never a phone call to the venue** (21.09; see [[decisions/product/owner-requests-are-not-verified-by-phone]])

See [[decisions/adr/ADR-002 Venue Seeding]] for full process.

## Claiming & Ownership

- Owners claim existing listings via proof of ownership
- Admin approves claims manually in V1
- Claimed venues get owner dashboard access
- Unclaimed venues exist as community-sourced data with lower confidence
