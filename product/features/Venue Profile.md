# Venue Profile

**Status:** **Built.** **Verified against code 2026-08-18.** The URL is `/miejsce/{slug}`, not `/venues/{slug}` (D-02). The page has: categories in collapsible sections with a defined open-priority, the venue's custom drinks, both trust badges, the offer update date, a map, navigation and contact buttons with event tracking, and JSON-LD structured data. **No other venue appears on it** — the nearby list and neighbouring map pins were removed 19.09 ([[decisions/product/venue-page-shows-only-its-venue]]). Since 19.09 the menu also marks what is new — a "Nowe" tag and a strip naming the three newest ([[decisions/product/new-in-the-menu-is-dated-by-the-offer-log]]). **What it lacks:** the "Zgłoś nieaktualne dane" button promised on `/jak-to-dziala`, and a "Prowadzisz ten lokal?" link (note O-3 in [[roadmap/next-session]]).

## URL

**Spec:** `/warszawa/lokal/{slug}`
**Current implementation:** `/venues/{slug}`

Same URL structure decision as [[product/features/Discovery Page]] — city-scoped URLs are better for SEO. Resolve this before Google indexes venue profiles.

## Layout
Constrained width (`max-w-7xl`). Focused evaluation — no map on this page.

## Content

### Header
- Venue name
- Address (with copy button)
- Venue type label (Restauracja, Bar, Pub) — informational, not a filter. **Note:** `venue_type` column does not yet exist in the database. This element cannot be rendered until the column is added and the enum defined.
- Verified checkmark if earned (see [[product/features/Verified Checkmark]])

### Category Breadth Bars
- One horizontal bar per category the venue carries
- Only shown categories are displayed — no empty/greyed bars
- Bar length = product count relative to max in that category
- Small product count number at end of bar (e.g., "12")
- Single accent color, no red/green coding
- See [[brand/UNI-Brand-Book#6. Design Principles|Design principles]]

### Product List
- Grouped by category, listed below each breadth bar
- Each product shows: name, brand (if from [[product/features/Product Reference Database]])
- Custom drinks show photo thumbnail + description
- Decay status hidden from users (owner-side only)

### Actions
- "Nawiguj" — opens external navigation (Google Maps, Apple Maps)
- Share link — copyable URL to this profile
- Flag products — "not available" button per product (see [[product/features/User Flagging]])

### What's NOT Here (V1)
- Reviews or ratings
- Photos gallery (beyond custom drink photos)
- Opening hours (unreliable data)
- Price information
- Menu PDF upload

## SEO
- Each venue profile is an indexable page
- schema.org LocalBusiness structured data
- SEO title: "{Venue Name} — Napoje bezalkoholowe | Under No Influence"
- Meta description auto-generated from category breadth

## Owner View
When logged in as venue owner, the same page shows additional controls:
- Edit product list
- See freshness decay bars per product
- Reconfirm products
- See flag notifications
- Link to full owner dashboard in Filament
