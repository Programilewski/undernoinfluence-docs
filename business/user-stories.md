# User Stories — Under No Influence (UNI)

> **Retired as a status document, 2026-09-17.** The checkboxes in this file are **not** maintained and never were: 301 of them are unticked, including acceptance criteria for work that shipped months ago — US-D01's map criteria are all built and all unticked. Read this file as a **specification of intent**, which is what it is good at, and never as a record of what exists.
>
> **What is not done lives in [`../roadmap/undone-inventory.md`](../roadmap/undone-inventory.md)**, compiled from the decision records, the deploy checklist and the code. **What exists** is answered by `php artisan route:list`, the test suite, and the `Executed:` line on each decision record.
>
> Descriptions here also age: one criterion below still names a CARTO basemap, replaced by MapLibre on OpenFreeMap on 01.09.2026. Corrections are welcome; ticking boxes to make this a tracker again is not — it was tried and it is the reason the inventory exists.


**Format**: `As a [persona], I want to [action], so that [benefit].`  
**Personas**: Visitor (anonymous), User (registered, V1.5+), Owner (venue, V2+), Admin (founder)  
**Status tags**: `[V1]` live at launch · `[V1.5]` light user features · `[V2]` owner activation · `[V3]` scale

Acceptance criteria use **Given / When / Then** where helpful.

---

## Table of Contents

1. [Discovery & Search](#1-discovery--search)
2. [Venue Profile](#2-venue-profile)
3. [Filters & Sorting](#3-filters--sorting)
4. [Navigation & Outbound Links](#4-navigation--outbound-links)
5. [Static & SEO Pages](#5-static--seo-pages)
6. [User Accounts & Saved Venues](#6-user-accounts--saved-venues)
7. [Data Quality & Reporting](#7-data-quality--reporting)
8. [Venue Owner — Claim & Profile](#8-venue-owner--claim--profile)
9. [Venue Owner — Analytics](#9-venue-owner--analytics)
10. [Admin — Venue Management](#10-admin--venue-management)
11. [Admin — Product Catalog](#11-admin--product-catalog)
12. [Admin — Analytics & Moderation](#12-admin--analytics--moderation)
13. [Compliance & Privacy](#13-compliance--privacy)

---

## 1. Discovery & Search

### US-D01 `[V1]`
**As a Visitor**, I want to see all verified NoLo-friendly venues on an interactive map, so that I can quickly get a geographic sense of what's available near me.

<details>
<summary>Acceptance Criteria</summary>

- [ ] Given I load `/mapa`, all active non-canary venues render as pins on the dark basemap (MapLibre on OpenFreeMap since 01.09.2026)
- [ ] Map is centred on Warsaw by default
- [ ] All pins load in < 500ms after the page hydrates
- [ ] Clicking a pin opens a venue card with name, type, category dots, and a "See profile" link
- [ ] Canary venues (`is_canary = true`) are never rendered as pins regardless of `is_active` state

</details>

**Expected Result:** The map displays all active Warsaw venues as pins, grouped visually, with no canary venues visible.

---

### US-D02 `[V1]`
**As a Visitor**, I want to see a scrollable list alongside the map, so that I can browse venues without relying solely on the map.

<details>
<summary>Acceptance Criteria</summary>

- [ ] 24 venue cards are shown on initial load
- [ ] A "Load more" button appends the next 24 cards without a full page reload
- [ ] On mobile the list and map are in separate tabs; on desktop they are side-by-side
- [ ] Hovering a list card highlights the corresponding map pin
- [ ] The total venue count is shown in the results header (e.g. "Znaleźliśmy 47 miejsc")

</details>

**Expected Result:** Visitor can browse venues in both map and list form, with 24 cards initially visible and more loadable without a full page reload.

---

### US-D03 `[V1]`
**As a Visitor**, I want the discovery URL to reflect my active filters and sort, so that I can share a specific filtered view with a friend.

<details>
<summary>Acceptance Criteria</summary>

- [ ] Applying any filter or sort updates the URL query params (e.g. `?categories[]=piwo&sort=breadth`)
- [ ] Loading a URL with query params restores the same filter and sort state without any user interaction
- [ ] The browser back button returns to the previous filter state without a full page reload
- [ ] A URL with an unrecognised filter param degrades gracefully (ignores unknown params, does not throw an error)

</details>

**Expected Result:** Sharing the URL with filters applied opens the exact same filtered view for the recipient, with no extra interaction required.

---

### US-D04 `[V1]`
**As a Visitor**, I want to see a helpful message when my filters return no results, so that I know the search worked but the supply gap is real — not a bug.

<details>
<summary>Acceptance Criteria</summary>

- [ ] Given filters are active and zero venues match, show "Nie znaleźliśmy pasujących miejsc"
- [ ] The empty state message suggests removing one specific filter (the most restrictive one)
- [ ] The page returns HTTP 200 — not a 404 or redirect
- [ ] A `discovery_empty_results` analytics event is fired with the full active filter state (categories, city, district, freshness, sort)
- [ ] The map is still visible with no pins rather than being hidden or replaced

</details>

**Expected Result:** Visitor sees a clear message explaining no venues match, with a suggestion to adjust filters — without assuming the site is broken.

---

### US-D05 `[V1]`
**As a Visitor**, I want to search for venues in a specific district, so that I can find places near where I'm going tonight.

<details>
<summary>Acceptance Criteria</summary>

- [ ] `/mapa/warszawa/mokotow` scopes the map and list to Mokotów venues only
- [ ] The district name is displayed as an active filter chip in the filter bar
- [ ] Removing the district chip returns to the city-wide view (`/mapa/warszawa`)
- [ ] An unrecognised district slug returns HTTP 404
- [ ] A district with zero venues shows the empty state from US-D04 (not a 404)

</details>

**Expected Result:** Only venues in the selected district appear on the map and list, with the district name visible as an active filter chip.

---

## 2. Venue Profile

### US-V01 `[V1]`
**As a Visitor**, I want to see a venue's core details on its profile page, so that I can decide whether it's worth visiting before I travel there.

<details>
<summary>Acceptance Criteria</summary>

- [ ] Profile shows: name, venue type badge, full street address, and district name
- [ ] A static mini-map pin is centred on the venue's lat/lng coordinates
- [ ] Phone, website, and Instagram links are shown only when the corresponding field is non-null
- [ ] Page load time is < 1.5s on a simulated 4G mobile connection (Chrome DevTools throttling)
- [ ] A `venue_viewed` analytics event is fired on page load with venue_id, city, and district
- [ ] An inactive venue (`is_active = false`) returns HTTP 404 for anonymous users

</details>

**Expected Result:** Visitor has enough information to decide whether to make the trip — name, location, contact links, and a map pin all load within 1.5 seconds.

---

### US-V02 `[V1]`
**As a Visitor**, I want to see the full NoLo menu broken into drink categories, so that I can find something specific (e.g. "do they have a 0% wine?").

<details>
<summary>Acceptance Criteria</summary>

- [ ] Menu is grouped into the 6 fixed categories: piwo, wino, drinki, spirits, cydr, musujące
- [ ] The top 3 categories that have at least one product auto-expand on load; piwo is always first if present
- [ ] Each product row shows: product name, brand name, ABV value, and a "przepis własny" badge for house recipes
- [ ] Categories with zero products are shown collapsed with a "(0)" count — they are not hidden entirely
- [ ] Expanding and collapsing an accordion section does not trigger a Livewire re-render or page reload
- [ ] House-recipe drinks (`venue_drinks`) appear in their `base_category` accordion section

</details>

**Expected Result:** Visitor can browse the full NoLo menu by category, with the most relevant categories already expanded on load — no hunting required.

---

### US-V03 `[V1]`
**As a Visitor**, I want to see a freshness indicator on every venue, so that I know how recently the menu was verified and can judge how much to trust it.

<details>
<summary>Acceptance Criteria</summary>

- [ ] Green pill: `last_menu_check_at` is within the last 30 days
- [ ] Yellow pill: `last_menu_check_at` is between 30 and 90 days ago
- [ ] Red pill: `last_menu_check_at` is more than 90 days ago or is null
- [ ] The pill displays a text label alongside the colour: e.g. "Sprawdzono 12 dni temu" or "Brak danych"
- [ ] Colour alone is never the only conveyor of freshness state (WCAG 1.4.1 compliance)
- [ ] The freshness pill appears on both venue cards in the discovery list and on the full venue profile

</details>

**Expected Result:** Visitor can immediately assess how recently the menu was verified and calibrate how much to trust the data before making the trip.

---

### US-V04 `[V1]`
**As a Visitor**, I want to see a "UNI Verified" badge on venues where the team confirmed the menu personally, so that I can trust the data before I make the trip.

<details>
<summary>Acceptance Criteria</summary>

- [ ] The badge is visible only when `is_verified = true` on the venue record
- [ ] Hovering or tapping the badge shows a tooltip: "Menu potwierdzone przez zespół UNI"
- [ ] The badge is absent (not hidden via CSS) when `is_verified = false` — no empty placeholder space
- [ ] Verified venues are filterable in discovery via the "Tylko zweryfikowane" toggle (see US-F02)
- [ ] The badge appears on both the venue card in discovery and on the full profile page

</details>

**Expected Result:** Visitor can instantly identify UNI-verified venues and understand what the badge means — trust is established before the trip is planned.

---

### US-V05 `[V1]`
**As a Visitor**, I want to see how broad a venue's NoLo selection is, so that I can tell at a glance whether it has "a few token options" or a real menu.

<details>
<summary>Acceptance Criteria</summary>

- [ ] An 8-dot bar is shown per category: filled dots represent products stocked, capped at 8 dots maximum
- [ ] A venue with 3 products in a category shows 3 filled dots and 5 empty dots
- [ ] A venue with 8 or more products in a category shows all 8 dots filled
- [ ] On the venue card in discovery, only the top 2 categories (by product count) are shown
- [ ] On the full venue profile, all 6 categories show their dot bar
- [ ] Dot count is derived live from active `venue_products` records; there is no manually overridable field

</details>

**Expected Result:** Visitor can see at a glance how deep a venue's NoLo selection is, without reading individual product names.

---

### US-V06 `[V1]` — **Withdrawn 2026-09-19**

> Built, then removed: a venue's page never sends its visitor to a competitor. The visitor's need below is met by the map, not by the venue page. See `../decisions/product/venue-page-shows-only-its-venue.md`.

**As a Visitor**, I want to see nearby venues on a venue's profile, so that I can plan alternatives in the same area without going back to the map.

<details>
<summary>Acceptance Criteria</summary>

- [ ] Up to 10 active, non-canary venues within ~2 km of the current venue are shown
- [ ] Results are sorted by distance ascending (closest first)
- [ ] Each nearby venue uses the same card format as the discovery list (name, type, breadth dots, freshness pill)
- [ ] The "Nearby" section is not rendered at all if fewer than 2 qualifying venues exist
- [ ] The current venue itself is excluded from the nearby list

</details>

**Expected Result:** Visitor can discover alternative venues in the same area without navigating back to the discovery map.

---

## 3. Filters & Sorting

### US-F01 `[V1]`
**As a Visitor**, I want to filter venues by drink category, so that I only see places that serve the specific type of NoLo drink I'm looking for.

<details>
<summary>Acceptance Criteria</summary>

- [ ] Six category pills are shown: piwo, wino, drinki, spirits, cydr, musujące
- [ ] Multiple categories can be selected simultaneously; the logic is OR (venues matching any selected category appear)
- [ ] Deselecting all category pills returns to the unfiltered full list
- [ ] Selecting a category fires a `category_filter_applied` analytics event with the category name and previous filter state
- [ ] The venue count in the results header updates reactively without a full page reload
- [ ] Category pills display the category colour from the `categories` table

</details>

**Expected Result:** Discovery list shows only venues that stock at least one product in the selected category or categories, with the count updating instantly.

---

### US-F02 `[V1]`
**As a Visitor**, I want to filter to only UNI-verified venues, so that I can limit results to places where the data has been personally confirmed.

<details>
<summary>Acceptance Criteria</summary>

- [ ] A toggle labelled "Tylko zweryfikowane" is present in the filter bar
- [ ] When active, only venues with `is_verified = true` are shown in both the map and the list
- [ ] Deactivating the toggle restores all venues matching other active filters
- [ ] The toggle state is reflected in the URL query params (e.g. `?verified=1`)

</details>

**Expected Result:** Discovery list shows only venues personally verified by the UNI team, with unverified venues hidden from both map and list.

---

### US-F03 `[V1]`
**As a Visitor**, I want to filter to venues with strictly 0.0% products, so that I can be confident nothing on the menu contains any alcohol whatsoever.

<details>
<summary>Acceptance Criteria</summary>

- [ ] A toggle labelled "Stricte 0.0%" is present in the filter bar
- [ ] When active, only venues with at least one product where `abv_status = verified_zero` are shown
- [ ] A tooltip (or info icon) explains the difference between "verified_zero" and "under 0.5%"
- [ ] The toggle state is reflected in the URL query params (e.g. `?strict_zero=1`)
- [ ] Venues where all products are `under_0.5` or `unknown` are excluded when the toggle is active

</details>

**Expected Result:** Discovery list shows only venues confirmed to stock at least one product with zero alcohol content, with a clear explanation of what "strictly 0.0%" means.

---

### US-F04 `[V1]`
**As a Visitor**, I want to filter by data freshness, so that I only see venues whose menus have been recently verified.

<details>
<summary>Acceptance Criteria</summary>

- [ ] A select control offers three options: "Wszystkie" (default) / "Aktualizowane w tym miesiącu" / "Aktualizowane w tym kwartale"
- [ ] "W tym miesiącu" filters to venues where `last_menu_check_at` < 30 days ago
- [ ] "W tym kwartale" filters to venues where `last_menu_check_at` < 90 days ago
- [ ] The thresholds match exactly those used to calculate the freshness pill colour (single source of truth)
- [ ] Selecting a freshness option fires a `discovery_search` analytics event with the chosen value

</details>

**Expected Result:** Discovery list shows only venues whose menus have been verified within the chosen window, giving visitors confidence in the data they're acting on.

---

### US-F05 `[V1]`
**As a Visitor**, I want to sort venues by menu breadth, so that the places with the most extensive NoLo selection appear first.

<details>
<summary>Acceptance Criteria</summary>

- [ ] Default sort is "Najlepsze menu" — descending by `breadth_score`
- [ ] When a single category filter is active, sort uses the product count for that specific category (not the overall breadth score)
- [ ] "A–Z" sort orders alphabetically by `venues.name` ascending
- [ ] "Najbliżej" sort prompts the browser for geolocation permission and orders by distance ascending
- [ ] If geolocation permission is denied or unavailable, the sort falls back to "Najlepsze menu" and shows a toast: "Nie można ustalić lokalizacji"
- [ ] The active sort is reflected in the URL (e.g. `?sort=az`) and restored on page load

</details>

**Expected Result:** Venues are reordered so those with the most extensive NoLo selection (or the closest, or alphabetically first) appear at the top of both the list and the map.

---

## 4. Navigation & Outbound Links

### US-N01 `[V1]`
**As a Visitor**, I want all outbound links (website, Instagram, directions) to open in a new tab, so that I don't lose my place on UNI.

<details>
<summary>Acceptance Criteria</summary>

- [ ] All external links have `target="_blank"` and `rel="noopener noreferrer"`
- [ ] Each click is routed through `/miejsce/{slug}/go/{type}` before the 302 redirect to the destination
- [ ] The server logs an `outbound_click` event with venue_id, link type, and timestamp before redirecting
- [ ] If the destination URL is null or empty, the link is not rendered (no dead links)

</details>

**Expected Result:** Visitor can follow any outbound link without losing their place on UNI, and all clicks are recorded for analytics without any user-visible delay.

---

### US-N02 `[V1]`
**As a Visitor**, I want tapping "Nawiguj" to open directions in my phone's native maps app, so that I don't have to copy and paste the address.

<details>
<summary>Acceptance Criteria</summary>

- [ ] On mobile (iOS/Android): tap opens the native OS maps intent using a `geo:` URI or `maps://` deep link
- [ ] On desktop: "Nawiguj" opens Google Maps in a new tab with the venue's coordinates pre-filled
- [ ] An `outbound_click` event is logged with `type = directions` and the venue's lat/lng
- [ ] The button is only shown when the venue has valid lat/lng coordinates

</details>

**Expected Result:** Visitor is taken directly to turn-by-turn navigation on mobile, or Google Maps with the venue pre-loaded on desktop — no address copying required.

---

### US-N03 `[V1]`
**As a Visitor**, I want the nav to show my current section (discovery, about, how-it-works), so that I can orient myself within the site.

<details>
<summary>Acceptance Criteria</summary>

- [ ] The active nav item has a visually distinct state (e.g. underline, colour change) compared to inactive items
- [ ] The active state is determined by the current route, not client-side JavaScript
- [ ] The nav is visible on all public pages
- [ ] On mobile (< 768px), the nav collapses to a hamburger icon; tapping it reveals the full nav
- [ ] The hamburger menu closes when tapping outside it or navigating to a new page

</details>

**Expected Result:** Visitor always knows which section of the site they're on and can navigate to any other section from any page, on both mobile and desktop.

---

## 5. Static & SEO Pages

### US-S01 `[V1]`
**As a Visitor arriving from Google**, I want a city landing page (e.g. `/warszawa`) to explain what UNI offers in that city, so that I can quickly decide to explore the map.

<details>
<summary>Acceptance Criteria</summary>

- [ ] The page has an H1 that includes the city name and a value proposition (e.g. "Bezalkoholowe bary i restauracje w Warszawie")
- [ ] The page displays the count of currently active venues in that city
- [ ] A prominent CTA button links to the city-scoped discovery map (`/mapa/warszawa`)
- [ ] The page returns HTTP 200 even if the venue count is zero — showing a "coming soon" message
- [ ] The page has a unique `<title>` tag and `<meta name="description">` distinct from other city pages
- [ ] An unrecognised city slug returns HTTP 404

</details>

**Expected Result:** Organic search traffic for city-level NoLo queries lands on a relevant, indexable page with a clear path to the discovery map.

---

### US-S02 `[V1]`
**As a Visitor searching for "piwo bezalkoholowe warszawa"**, I want a dedicated city×category landing page, so that I land on a relevant page and not a generic homepage.

<details>
<summary>Acceptance Criteria</summary>

- [ ] URL pattern `/warszawa/piwo-bezalkoholowe` resolves to a city×category page
- [ ] The H1 explicitly names both the city and the category (e.g. "Piwo bezalkoholowe w Warszawie")
- [ ] The page lists venues in that city that have at least one product in that category
- [ ] JSON-LD `ItemList` schema is included for Google rich results eligibility
- [ ] The page links to the discovery map pre-filtered on that city + category
- [ ] A combination with zero venues returns HTTP 200 with an empty-state message (not a 404)

</details>

**Expected Result:** Organic traffic for specific drink-type queries lands on a page tailored to that intent, with a venue list and a direct path to the pre-filtered discovery map.

---

### US-S03 `[V1]`
**As a Visitor**, I want a "How It Works" page that explains the verified badge and freshness pill, so that I trust the data before relying on it.

<details>
<summary>Acceptance Criteria</summary>

- [ ] The page explains what "UNI Verified" means and the process by which it is awarded
- [ ] The page explains what each freshness pill colour (green / yellow / red) means in plain Polish
- [ ] The page explains how the 8-dot breadth bars are calculated (product count per category)
- [x] A FAQ section covers at minimum: "Czy mogę dodać swój lokal?", "Co jeśli menu jest nieaktualne?", "Jak UNI zarabia?", "Skąd pochodzi ta baza danych?" — all four answered since 17.09, on `/faq` rather than in this page, see [[decisions/product/faq-gets-its-own-page]]
- [x] Each FAQ item is implemented as an accessible accordion (keyboard-navigable, ARIA attributes correct)
- [ ] The page has a CTA linking to the discovery map

</details>

**Expected Result:** Visitor understands exactly what UNI's data signals mean and how to use them — trust is built before a venue choice is made.

---

### US-S04 `[V1]`
**As a search engine crawler**, I want a complete XML sitemap, so that all public venue, city, district, and category URLs are indexed.

<details>
<summary>Acceptance Criteria</summary>

- [ ] `/sitemap.xml` returns `Content-Type: application/xml`
- [ ] All active, non-canary venue URLs are included (`/miejsce/{slug}`)
- [ ] City, district, and category landing page URLs are included
- [ ] Admin routes (`/admin/*`), API routes (`/analytics/*`), and the honeypot (`/export/venues.json`) are excluded
- [ ] The sitemap updates automatically when a venue's `is_active` status changes — no manual regeneration needed
- [ ] Each URL entry includes a `<lastmod>` timestamp derived from `updated_at`

</details>

**Expected Result:** All indexable public content is discoverable by search engines without manual intervention, and stale or empty URLs are excluded automatically.

---

### US-S05 `[V1]`
**As an AI training crawler**, I want to be explicitly blocked by robots.txt, so that UNI's proprietary venue data is not used for LLM training without consent.

<details>
<summary>Acceptance Criteria</summary>

- [ ] `robots.txt` disallows 13 named AI crawlers including: ChatGPT-User, PerplexityBot, GoogleExtended, ClaudeBot, Applebot-Extended, CCBot
- [ ] Standard search engine bots (Googlebot, Bingbot, Applebot) are explicitly allowed
- [ ] `robots.txt` is served as `Content-Type: text/plain`
- [ ] The honeypot at `/export/venues.json` returns HTTP 403 and logs the accessing IP for scraper detection
- [ ] Canary venues (`is_canary = true`) are never rendered in any public HTML response, API response, or sitemap entry

</details>

**Expected Result:** AI crawlers are denied access to UNI's venue data, protecting the manually curated database from unauthorised extraction, with canary venues in place to detect and prove scraping.

---

## 6. User Accounts & Saved Venues

### US-U01 `[V1.5]`
**As a returning Visitor**, I want to create an account with my email and password, so that I can save venues across devices and sessions.

<details>
<summary>Acceptance Criteria</summary>

- [ ] Registration form requires: email address (format-validated), password (minimum 12 characters), and password confirmation
- [ ] Passwords shorter than 12 characters show a specific error: "Hasło musi mieć co najmniej 12 znaków"
- [ ] Email verification is required before the account is active; unverified users cannot save venues
- [ ] Verification email is sent within 60 seconds of registration
- [ ] Attempting to register with an already-registered email shows: "Ten adres e-mail jest już używany"
- [ ] Registration fires an `account_registered` analytics event with the traffic source (e.g. venue profile, discovery)
- [ ] All form error messages are in Polish

</details>

**Expected Result:** Visitor can create a verified account in under two minutes and immediately access save and submission features across all devices.

---

### US-U02 `[V1.5]`
**As a User**, I want to save a venue to my list, so that I can find it again without re-searching.

<details>
<summary>Acceptance Criteria</summary>

- [ ] A "Zapisz" button (heart icon) is shown on every venue profile page
- [ ] Authenticated users see the heart in a filled state if already saved, empty state if not
- [ ] Tapping the button toggles the saved state immediately (optimistic UI) and persists to the `venue_saves` table
- [ ] A `venue_saved` analytics event is fired with venue_id and user_id
- [ ] Saved venues are accessible at `/profil/zapisane` in a list sorted by date saved (newest first)
- [ ] Unauthenticated users who tap "Zapisz" are redirected to the login page with a redirect-back param so they land on the same venue after login
- [ ] A user can unsave a venue from either the venue profile or the `/profil/zapisane` list

</details>

**Expected Result:** User can build a personal shortlist of venues that persists across devices and sessions, with saves and removals reflected instantly.

---

### US-U03 `[V1.5]`
**As a User**, I want to delete my account and all associated data, so that I can exercise my GDPR right to erasure.

<details>
<summary>Acceptance Criteria</summary>

- [ ] Account deletion is available at `/profil/ustawienia` under a "Usuń konto" section
- [ ] A confirmation step requires the user to re-enter their current password before deletion proceeds
- [ ] On confirmation: the user row is deleted, `venue_saves` records are anonymised (user_id nulled), and inaccuracy reports are anonymised
- [ ] An `account_deleted` analytics event is fired before the user record is removed
- [ ] A link to the data export (US-C02) is shown on the deletion confirmation screen with the copy: "Zanim usuniesz konto, możesz pobrać swoje dane"
- [ ] The user is logged out and redirected to the homepage with a confirmation message after deletion
- [ ] Deletion is irreversible; no grace period or soft-delete in V1

</details>

**Expected Result:** User's personal data is fully removed from UNI's systems after a single confirmed action, with no residual identifiable records, satisfying the GDPR Art 17 right to erasure.

---

## 7. Data Quality & Reporting

### US-Q01 `[V1.5]`
**As a Visitor**, I want to report an inaccuracy on a venue profile, so that UNI can correct stale menu data.

<details>
<summary>Acceptance Criteria</summary>

- [ ] A "Zgłoś nieaktualność" button is visible on every active venue profile
- [ ] The report form captures: affected category (select from 6 categories), description of the issue (optional, max 500 chars), and reporter contact email (optional)
- [ ] On submit, a `venue_inaccuracy_report` record is created with status `pending`
- [ ] An `inaccuracy_report_submitted` analytics event is fired with venue_id, category, and whether a description was provided
- [ ] A confirmation message is shown: "Dziękujemy! Sprawdzimy to przy następnej aktualizacji."
- [ ] Duplicate detection: if an open (non-resolved) report for the same venue already exists from the same session or email, show: "Twoje zgłoszenie już czeka na review"
- [ ] The form is accessible without a user account in V1.5

</details>

**Expected Result:** Inaccuracy is recorded and queued for UNI team review, with the reporter confident their feedback was received and will be acted on.

---

### US-Q02 `[V1.5]`
**As a Visitor**, I want to suggest a venue that's missing from UNI, so that the directory stays comprehensive.

<details>
<summary>Acceptance Criteria</summary>

- [ ] A "Zaproponuj lokal" link is visible in the site footer on all public pages
- [ ] The suggestion form captures: venue name (required), city (required, select from active cities), approximate address (optional), submitter contact email (optional), and a free-text reason field
- [ ] On submit, an internal suggestion record is created and the admin is notified (email or Filament notification)
- [ ] A confirmation message is shown: "Dziękujemy! Rozejrzymy się za tym miejscem."
- [ ] This is not a public claim form — the submission does not create a `venue_claim` record

</details>

**Expected Result:** A new venue lead is submitted to the UNI team for evaluation, with the suggester informed their tip will be reviewed.

---

## 8. Venue Owner — Claim & Profile

### US-O01 `[V2]`
**As a Venue Owner**, I want to claim my venue's listing, so that I can manage its accuracy myself instead of waiting for UNI to update it.

<details>
<summary>Acceptance Criteria</summary>

- [ ] A "Przejm kontrolę nad profilem" CTA is visible on the venue profile page when `venue_claims` has no approved claim for that venue
- [ ] The claim form captures: full name (required), role at venue (required), business email (required), NIP (optional), and a free-text message
- [ ] On submit, a `venue_claim` record is created with `status = pending` and `submitted_at` timestamped
- [ ] The admin panel shows a notification of the new pending claim
- [ ] The owner receives an automated confirmation email: "Otrzymaliśmy Twoją prośbę o przejęcie profilu [Venue Name]. Odezwiemy się w ciągu 3 dni roboczych."
- [ ] Submitting a second claim for the same venue while a pending one exists shows: "Twoja prośba już czeka na rozpatrzenie"

</details>

**Expected Result:** Owner has submitted a verified claim request and is awaiting admin review, with a confirmation email proving their request was received.

---

### US-O02 `[V2]`
**As a Venue Owner**, I want to receive a notification when my claim is approved or rejected, so that I know when I can start managing my profile.

<details>
<summary>Acceptance Criteria</summary>

- [ ] On claim approval: the owner receives an email with a login link, their panel URL, and a brief onboarding summary
- [ ] On claim rejection: the owner receives an email explaining the reason for rejection and the steps to re-submit
- [ ] The `venue_claims` status is updated to `approved` or `rejected` with an `admin_notes` field capturing the reason
- [ ] An approved claim sets `venue.claimed_by_user_id` and creates the owner user account if one does not already exist
- [ ] Approval and rejection actions are logged in `audit_logs` with the admin's user ID

</details>

**Expected Result:** Owner is notified of the claim decision within 3 business days and gains panel access immediately upon approval — no chasing required.

---

### US-O03 `[V2]`
**As a Venue Owner**, I want to edit my venue's menu in the owner panel, so that the information on UNI is always current.

<details>
<summary>Acceptance Criteria</summary>

- [ ] The owner panel allows adding products from the global catalog to their venue's `venue_products` pivot
- [ ] The owner panel allows removing products from their venue (sets `is_available = false` on the pivot, does not delete the product from the global catalog)
- [ ] The owner can add house-recipe drinks: name (required), base category (required), description (optional)
- [ ] All changes are logged in `venue_offer_logs` with `added_by = venue_owner` and a timestamp
- [ ] Changes are reflected on the public venue profile on the next page request — no admin approval gate
- [ ] Saving any menu change resets `last_menu_check_at` to the current timestamp, turning the freshness pill green

</details>

**Expected Result:** Owner's menu changes are live on the public profile immediately and the freshness pill turns green — reflecting their active management without waiting for UNI.

---

### US-O04 `[V2]`
**As a Venue Owner**, I want to update my venue's contact details (phone, website, Instagram), so that customers reach the right place.

<details>
<summary>Acceptance Criteria</summary>

- [ ] The owner panel has an editable form for: phone number, website URL, and Instagram handle
- [ ] URL format is validated on save; an invalid URL shows: "Podaj prawidłowy adres URL (np. https://...)"
- [ ] Changes do not require admin approval — the owner's verified ownership is sufficient
- [ ] Changes take effect on the public profile on the next page request
- [ ] All field changes are logged in `audit_logs` with the owner's user ID and the old and new values

</details>

**Expected Result:** Updated contact details are live on the public profile immediately, with all changes auditably logged without requiring UNI team intervention.

---

### US-O05 `[V2]`
**As a Venue Owner**, I want the "Owner Confirmed" badge to appear on my profile once I've verified the menu, so that visitors know the data is accurate.

<details>
<summary>Acceptance Criteria</summary>

- [ ] An "Owner Confirmed" badge is distinct from the "UNI Verified" badge — different icon, different tooltip
- [ ] The badge is not awarded automatically upon claim approval; the owner must actively edit or confirm at least one product after claiming
- [ ] Hovering or tapping the badge shows: "Menu potwierdzone przez właściciela lokalu"
- [ ] The badge appears on both the venue card in discovery and on the full profile page
- [ ] If a venue has both "Owner Confirmed" and "UNI Verified" statuses, both badges are shown

</details>

**Expected Result:** Visitors can distinguish between team-verified and owner-confirmed venues, increasing trust in owner-managed profiles and incentivising owners to actively maintain their listings.

---

## 9. Venue Owner — Analytics

### US-A01 `[V2]`
**As a Venue Owner**, I want to see how many people viewed my venue profile this month, so that I know whether UNI is driving interest in my business.

<details>
<summary>Acceptance Criteria</summary>

- [ ] The owner dashboard shows total profile views for the last 30 days, sourced from `venue_stats.views`
- [ ] A 7-day trend sparkline is shown alongside the total (bar chart or line chart)
- [ ] A comparison to the previous 30-day period is shown: e.g. "+12% vs ostatnie 30 dni"
- [ ] Data is refreshed at most once per hour (no stale daily batch)
- [ ] The dashboard is only accessible to the owner of the claimed venue — other owners cannot see it

</details>

**Expected Result:** Owner can see whether UNI is driving measurable interest in their venue and track month-over-month trends to justify their continued participation.

---

### US-A02 `[V2]`
**As a Venue Owner**, I want to see which outbound links people click most (directions, website, Instagram), so that I know what action my visitors take after viewing my profile.

<details>
<summary>Acceptance Criteria</summary>

- [ ] The dashboard shows a breakdown of click counts per link type: directions, website, instagram, maps, phone
- [ ] Results are sorted by count descending
- [ ] The default date range is the last 30 days; a toggle switches to the last 90 days
- [ ] Link types with zero clicks are still shown with a "0" count — not hidden
- [ ] Data is sourced from the first-party `events` table filtered by venue_id and event type `outbound_click`

</details>

**Expected Result:** Owner can see which conversion action (directions, website, Instagram) their visitors prefer — informing decisions about which contact details to keep up to date.

---

### US-A03 `[V2]`
**As a Venue Owner**, I want to see demand data for my drink category in my district, so that I can justify expanding my NoLo menu to my supplier.

<details>
<summary>Acceptance Criteria</summary>

- [ ] A "Popyt w Twojej dzielnicy" widget shows how many discovery sessions in the owner's district included the venue's primary category as an active filter
- [ ] Data is sourced from the `events` table: `category_filter_applied` events scoped to the venue's district and primary category
- [ ] The framing is aggregate and non-individual: "X osób szukało piwa bezalkoholowego na Mokotowie w tym miesiącu"
- [ ] No individual-level data is exposed — the widget shows only aggregated counts
- [ ] If the venue's district has fewer than 5 data points for the period, show "Za mało danych — sprawdź ponownie za kilka tygodni"

</details>

**Expected Result:** Owner has a concrete, data-backed figure to show a supplier or business partner when justifying investment in expanding their NoLo selection.

---

### US-A04 `[V2]`
**As a Venue Owner on the Pro tier**, I want to download a monthly PDF report, so that I can share the demand data with my business partner or supplier.

<details>
<summary>Acceptance Criteria</summary>

- [ ] A "Pobierz raport (PDF)" button is visible on the analytics dashboard for Pro and Premium tier owners
- [ ] The button is visible but disabled (with a tooltip: "Dostępne w planie Pro") for Basic tier owners
- [ ] The PDF includes: venue name, report period, total profile views, outbound click breakdown, category demand count in district
- [ ] The PDF footer states: "Dane szacunkowe, pierwszopartyjne. UNI nie gwarantuje ich dokładności."
- [ ] The PDF carries UNI branding (logo, colour palette) consistent with the brand book
- [ ] PDF generation completes within 10 seconds; a loading spinner is shown during generation

</details>

**Expected Result:** Owner can share a branded, data-backed PDF summary with business partners or suppliers without giving them access to the UNI panel.

---

## 10. Admin — Venue Management

### US-AD01 `[V1]`
**As an Admin**, I want to create a new venue with automatic geocoding, so that I don't have to look up coordinates manually.

<details>
<summary>Acceptance Criteria</summary>

- [ ] Entering a street address and city in the Filament venue form and clicking a "Geokoduj" button triggers a Nominatim API lookup
- [ ] On success, latitude and longitude fields are populated automatically and confirmed with a success toast
- [ ] On geocoding failure (API timeout, no results), an error toast is shown and manual coordinate fields remain editable
- [ ] New venues are created with `is_active = false` by default — they must be explicitly published
- [ ] The venue creation form requires: name, type, address, and city; all other fields are optional
- [ ] Creating a venue fires an `audit_log` entry with the admin's user ID and the venue ID

</details>

**Expected Result:** Admin can create a fully geocoded venue record ready for product linking and publishing, without manual coordinate lookup or external tools.

---

### US-AD02 `[V1]`
**As an Admin**, I want to publish or unpublish a venue with a single toggle, so that I can control public visibility without deleting data.

<details>
<summary>Acceptance Criteria</summary>

- [ ] An `is_active` toggle is present on the venue edit form in Filament
- [ ] The toggle change takes effect immediately with no intermediate confirmation dialog
- [ ] The toggle change is logged in `audit_logs` with: admin user ID, venue ID, previous value, new value, and timestamp
- [ ] Unpublishing a venue causes it to disappear from public discovery and the sitemap — all within one request cycle
- [ ] An unpublished venue at its direct URL (`/miejsce/{slug}`) returns HTTP 404 for anonymous users

</details>

**Expected Result:** Admin can instantly control public venue visibility in a single action, with the change reflected across discovery, sitemap, and nearby sections — and all data preserved for re-activation.

---

### US-AD03 `[V1]`
**As an Admin**, I want to add internal notes to a venue, so that I can record context (e.g. "owner said menu refreshed in March") that isn't shown publicly.

<details>
<summary>Acceptance Criteria</summary>

- [ ] An `admin_notes` textarea field is present in the Filament venue edit form
- [ ] The field content is never rendered in any public-facing HTML response, Blade template, or API response
- [ ] The field is visible only to users with the `admin` role in the Filament panel
- [ ] Notes are saved as plain text; no markdown rendering is applied
- [ ] The `admin_notes` field has no character limit but is intended for short operational notes, not documentation

</details>

**Expected Result:** Admin can record operational context against a venue that is never exposed to the public, supporting data quality decisions without cluttering the public profile.

---

### US-AD04 `[V1]`
**As an Admin**, I want to set the `last_menu_check_at` date when I verify a venue's menu, so that the freshness pill shows the correct colour to visitors.

<details>
<summary>Acceptance Criteria</summary>

- [ ] A date picker field for `last_menu_check_at` is present in the Filament venue edit form
- [ ] Saving the form with a new date updates `last_menu_check_at` immediately
- [ ] The freshness pill colour on the public venue profile reflects the new date on the next page request
- [ ] A `venue_offer_log` entry is created on save with action `menu_confirmed`, the admin user ID, and the new timestamp
- [ ] The date picker defaults to today when the field is empty and the admin clicks it

</details>

**Expected Result:** The freshness pill on the public profile reflects the actual verification date immediately after the admin confirms the menu — no stale green pills after a real check.

---

### US-AD05 `[V1]`
**As an Admin**, I want to bulk-archive inactive venues, so that I can clean up the list without editing venues one by one.

<details>
<summary>Acceptance Criteria</summary>

- [ ] The Filament venues table supports checkbox multi-select on each row
- [ ] A bulk action "Archiwizuj zaznaczone" is available in the bulk actions dropdown
- [ ] Executing the action sets `is_active = false` for all selected venues
- [ ] Each affected venue generates a separate `audit_log` entry — one per venue, not one aggregate log
- [ ] A success toast confirms: "Zarchiwizowano X lokali"
- [ ] The action does not delete venues — they remain in the database and are recoverable via the `is_active` toggle

</details>

**Expected Result:** Multiple venues are archived in a single action, with all changes auditably logged per venue and no data permanently deleted.

---

## 11. Admin — Product Catalog

### US-AD06 `[V1]`
**As an Admin**, I want to add a new product to the global catalog, so that it can be linked to any venue that stocks it.

<details>
<summary>Acceptance Criteria</summary>

- [ ] The product creation form in Filament requires: name, category (select from 6), ABV (decimal), and `abv_status`
- [ ] Brand is selectable from existing brands or creatable inline with a modal
- [ ] New products are created with `is_approved = false` by default
- [ ] A product with `is_approved = false` cannot be linked to venues and does not appear on any public profile
- [ ] Approving a product (setting `is_approved = true`) makes it immediately linkable to venues
- [ ] Product creation is logged in `audit_logs`

</details>

**Expected Result:** A new product is available for venue linking once approved, with no duplicate catalog entries and a full audit trail from creation to approval.

---

### US-AD07 `[V1]`
**As an Admin**, I want to set a product's ABV trust status (unknown / under_0.5 / verified_zero), so that visitors know how reliable the 0% claim is.

<details>
<summary>Acceptance Criteria</summary>

- [ ] `abv_status` is a required select field on the product form with options: unknown, under_0.5, verified_zero
- [ ] `verified_zero` can only be set by an admin role — venue owners cannot set it in V2 without admin review
- [ ] The ABV value and `abv_status` label are both displayed on the venue profile product row
- [ ] Changing `abv_status` on an existing product propagates immediately to all venue profiles that stock that product
- [ ] The "Stricte 0.0%" discovery filter (US-F03) respects this field as its single source of truth

</details>

**Expected Result:** Visitors and the 0.0% filter always reflect the correct, admin-verified ABV trust status for every product — with one change propagating instantly across all venues.

---

### US-AD08 `[V1]`
**As an Admin**, I want to link an existing product to a venue, so that I don't duplicate product records across the catalog.

<details>
<summary>Acceptance Criteria</summary>

- [ ] The venue edit form has a "Dodaj produkt" relationship manager (Filament repeater or table action)
- [ ] The product selector offers a searchable autocomplete over all `is_approved = true` products in the global catalog
- [ ] Selecting a product creates a `venue_products` pivot record with `added_by = admin` and `is_available = true`
- [ ] Linking a product that is already linked to the venue shows a validation error: "Ten produkt jest już przypisany do tego lokalu"
- [ ] Removing the link sets `is_available = false` on the pivot — it does not delete the product from the global catalog

</details>

**Expected Result:** The product appears on the venue's public profile in its correct category, linked from the shared global catalog rather than as a duplicate entry.

---

## 12. Admin — Analytics & Moderation

### US-AD09 `[V1]`
**As an Admin**, I want a dashboard widget showing which venues haven't been menu-checked in over 90 days, so that I can prioritise my next verification calls.

<details>
<summary>Acceptance Criteria</summary>

- [ ] The Filament dashboard includes a "Wymagają aktualizacji" widget
- [ ] The widget lists venues where `last_menu_check_at` is null or more than 90 days in the past
- [ ] Results are sorted by overdue duration descending (longest overdue first)
- [ ] Each row shows: venue name, district, and the number of days since last check (or "Nigdy" if null)
- [ ] Clicking a venue row opens that venue's edit form directly
- [ ] The widget count is shown as a badge on the Filament admin nav item for Venues

</details>

**Expected Result:** Admin has a prioritised, always-current list of venues overdue for menu verification — without running manual queries or remembering which venues were last checked.

---

### US-AD10 `[V1]`
**As an Admin**, I want to see how many times each venue profile was viewed this week, so that I can focus my enrichment effort on high-traffic venues.

<details>
<summary>Acceptance Criteria</summary>

- [ ] The Filament venues table has a "Wyświetlenia (7d)" column showing the sum of `venue_stats.views` for the last 7 calendar days
- [ ] The column is sortable — clicking it sorts the table by view count descending
- [ ] The count updates on each page load from the database; no stale cache is served
- [ ] Venues with zero views in the period show "0", not a blank or dash
- [ ] The column is visible by default and is not hidden behind a column toggle

</details>

**Expected Result:** Admin can focus enrichment and verification effort on high-traffic venues, directing limited time where it will have the greatest user impact.

---

### US-AD11 `[V1.5]`
**As an Admin**, I want to review inaccuracy reports submitted by users, so that I can decide whether to update the venue's menu or dismiss the report.

<details>
<summary>Acceptance Criteria</summary>

- [ ] A Filament resource for `venue_inaccuracy_reports` is accessible at `/admin/inaccuracy-reports`
- [ ] The table shows: venue name (linked to venue edit), affected category, user description, submitter email (if provided), and `submitted_at`
- [ ] Reports are filterable by status: pending / resolved / dismissed
- [ ] A "Rozwiąż" (Resolve) action marks the report as resolved and updates `last_menu_check_at` on the venue to today
- [ ] A "Odrzuć" (Dismiss) action marks the report as dismissed without updating the venue
- [ ] Both actions log to `audit_logs` and update the report's `resolved_at` timestamp

</details>

**Expected Result:** Inaccuracy reports are triaged efficiently from a single queue, with resolved reports automatically updating the venue's freshness date and closing the feedback loop.

---

### US-AD12 `[V2]`
**As an Admin**, I want to review venue claim requests and approve or reject them, so that only legitimate owners gain access to the owner panel.

<details>
<summary>Acceptance Criteria</summary>

- [ ] A Filament resource for `venue_claims` is accessible at `/admin/venue-claims`
- [ ] The table has a status filter: pending / approved / rejected; default view shows pending only
- [ ] Each row shows: venue name, claimant full name, role, business email, NIP, submitted_at
- [ ] An "Approve" action: sets `status = approved`, creates or links an owner user account, sets `venue.claimed_by_user_id`, and sends the approval email
- [ ] A "Reject" action: opens a modal prompting for a rejection reason, sets `status = rejected`, and sends the rejection email with the reason
- [ ] Both actions are logged in `audit_logs` with the admin's user ID, the claim ID, and the action taken

</details>

**Expected Result:** Only verified owners gain access to the owner panel, with a complete audit trail of who approved or rejected each claim and why.

---

## 13. Compliance & Privacy

### US-C01 `[V1]`
**As a Visitor**, I want to read a clear privacy policy explaining what data UNI collects and why, so that I can make an informed decision about using the site.

<details>
<summary>Acceptance Criteria</summary>

- [ ] `/polityka-prywatnosci` is linked in the footer of every public page
- [ ] The policy covers all processing activities: session cookies, first-party analytics events, PostHog (EU-hosted), and email contact
- [ ] For each processing purpose the policy states: data collected, legal basis (Art 6 GDPR), retention period, and whether a DPA with a sub-processor applies
- [ ] The policy discloses that PostHog is used and that it is hosted in the EU (Frankfurt)
- [ ] GDPR Art 13 compliance: controller identity, DPO contact (or "no DPO appointed"), and right to lodge a complaint with UODO are all present
- [ ] The document is written in plain Polish — no legal jargon without explanation
- [ ] The `<title>` and `<meta description>` on the page are unique and descriptive

</details>

**Expected Result:** Visitors can make an informed, GDPR-compliant decision about using the site, and UNI can demonstrate accountability to regulators if audited.

---

### US-C02 `[V1.5]`
**As a User**, I want to download a copy of all personal data UNI holds about me, so that I can exercise my GDPR right to data portability.

<details>
<summary>Acceptance Criteria</summary>

- [ ] A "Pobierz moje dane" button is available at `/profil/dane` for authenticated users
- [ ] The generated JSON file contains: account fields (name, email, created_at), saved venues (venue_id, name, saved_at), and submitted inaccuracy reports (venue_id, category, submitted_at)
- [ ] Raw analytics event data is excluded — those events are anonymised and not attributable to the user
- [ ] The download is triggered immediately on button click; no email is sent and no delay is imposed
- [ ] The action is logged with the user's ID and timestamp
- [ ] The JSON file is named `uni-moje-dane-YYYY-MM-DD.json`

</details>

**Expected Result:** User receives a complete, machine-readable export of their personal data within seconds, satisfying the GDPR Art 20 portability right without requiring admin involvement.

---

### US-C03 `[V1]`
**As the site operator**, I want all session cookies to be classified as strictly necessary and disclosed in the privacy policy, so that UNI does not require a cookie consent banner.

<details>
<summary>Acceptance Criteria</summary>

- [ ] The only cookies set in V1 are: `laravel_session` (session management) and the CSRF token cookie
- [ ] PostHog client-side JavaScript is not loaded in any page response — no PostHog cookie is set
- [ ] The privacy policy explicitly names both cookies, their purpose, and their expiry
- [ ] No third-party marketing or tracking cookies are set from any page on the public site
- [ ] No consent management platform (CMP) or cookie banner is shown to users in V1
- [ ] If PostHog client-side JS is ever added in future, a consent gate must be implemented before that change goes live

</details>

**Expected Result:** No cookie consent banner is required on the public site in V1, reducing friction for visitors and satisfying ePrivacy Directive requirements without a CMP.

---

### US-C04 `[V1]`
**As a Visitor**, I want a way to request erasure of venue data about my business, so that I can exercise the right to be forgotten if my venue is listed without my consent.

<details>
<summary>Acceptance Criteria</summary>

- [ ] The privacy policy discloses a contact email address for erasure requests (Art 17 GDPR)
- [ ] The backend `venue_erasure_requests` table exists and is ready to store requests
- [ ] In V1, the public UI is email-only — there is no self-service erasure form on the public site
- [ ] Erasure requests received by email are processed within 30 days per GDPR Art 17
- [ ] A self-service erasure request form at `/lokal/usun` is a V1.5 deliverable
- [ ] The privacy policy notes the 30-day processing window and the right to escalate to UODO if the deadline is missed

</details>

**Expected Result:** Venue owners can request removal of their listing via a disclosed email address, with a clear 30-day timeline and an escalation path to UODO if UNI doesn't respond.

---

### US-C05 `[V1]`
**As the site operator**, I want AI training and citation crawlers explicitly blocked in `robots.txt`, so that UNI's proprietary venue data cannot be used without authorisation.

<details>
<summary>Acceptance Criteria</summary>

- [ ] `robots.txt` contains `Disallow: /` blocks for at minimum these 13 user-agents: ChatGPT-User, PerplexityBot, GoogleExtended, ClaudeBot, Applebot-Extended, CCBot, GPTBot, anthropic-ai, Bytespider, omgili, Diffbot, Timpibot, YouBot
- [ ] Standard search bots are explicitly allowed: Googlebot, Bingbot, Applebot (non-extended), DuckDuckBot
- [ ] `robots.txt` is served with `Content-Type: text/plain` and HTTP 200
- [ ] The honeypot endpoint `/export/venues.json` returns HTTP 403 for all requests and logs the requesting IP and User-Agent to a dedicated `scraper_detections` log
- [ ] Canary venues (`is_canary = true`) are never included in any public HTML, JSON response, or sitemap entry — even when directly requested by slug

</details>

**Expected Result:** UNI's manually curated venue database is protected from AI extraction, with canary venues in place to detect, attribute, and prove scraping if it occurs.
