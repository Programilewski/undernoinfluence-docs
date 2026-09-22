# Homepage

**Status:** **Built.** **Verified against code 2026-08-18.** The previous description ("`/` redirects to `/venues`") is false — `/` is handled by `HomeController` and renders a full homepage: hero, a showcase section with a real map and venue list, a drinks-card preview, and entry points into the SEO cluster. The showcase is one layout since 18.09: the full-bleed strip with a still render of the real basemap and a cycling list floating over it (`components/home-showcase.blade.php`). The boxed-panel variant and `UNI_HOME_SHOWCASE` were deleted once the choice was made. The page is deliberately city-agnostic ([[decisions/product/city-agnostic-homepage]]).

## Purpose
Trust signal for first-time visitors. Legitimizes the platform for both users and venue owners. Not a dashboard, not a digest — a clean door.

## URL
`/` — redirects to `/warszawa` only when multi-city is irrelevant (pure V1). Once other cities exist, homepage becomes the entry point.

## V1 Content (One Screen, Five Elements)

1. **Headline + subline** — "Under No Influence" + "Znajdź lokale z najlepszą ofertą napojów bezalkoholowych."

2. **City entry point** — prominent button "Przeglądaj lokale w Warszawie" → `/warszawa`. When multi-city: city selector or search.

3. **Three value props** — icon + one line each:
   - "Sprawdzone menu 0%"
   - "Aktualne dane od właścicieli"
   - "Darmowe dla użytkowników"

4. **Owner CTA** — "Prowadzisz lokal? Dodaj swoją ofertę" → [[product/features/Static Pages#Dla Lokali]]

5. **Footer** — regulamin, polityka prywatności, kontakt

## What It Does NOT Have
- Hero images or stock photos
- Featured venues
- Recently added venues
- Blog posts or news
- Social proof / testimonials (no users yet at V1)
- Any content that requires maintenance

## Layout Context
Constrained width (`max-w-5xl`), centered. See [[tech/stack#Layout Contexts|Layout Contexts]].

## When to Evolve
When Warsaw is proven and second city launches, homepage becomes a city selector with optional social proof ("80+ lokali w Warszawie, 40+ w Krakowie"). Still minimal, still one screen.
