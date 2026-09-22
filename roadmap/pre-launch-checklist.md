---
version: 2.1
owner: Paweł Milewski
updated: 2026-08-20
status: approved
---

# Pre-launch Checklist

Things that are **cheaper to change now than after launch**, or that need a conscious sign-off
before traffic arrives. This is not a feature backlog — that lives in [v1.md](v1.md). This is the
list of things whose cost of change spikes on launch day.

Status: `TO CONFIRM` — needs a decision · `RESOLVED` — settled, with the date · `OK` — confirmed, stays

*Translated from Polish to English on 2026-08-18; content unchanged apart from the two new items 5 and 6.
Items 7-10 added 2026-08-20 from [`audit-2026-08-20.md`](audit-2026-08-20.md).*

---

## 1. Filter URL parameters — `PARTLY RESOLVED 2026-08-30`

> **Resolved 2026-08-30:** the question underneath this item — whether those addresses are
> *indexable* — is settled and shipped. Filtered views now emit `noindex, follow` with the
> canonical pointing at the plain city map; see item 13 below and
> [`discovery-filters-are-not-indexable`](../decisions/product/discovery-filters-are-not-indexable.md).
> The parameter **names** are still yours to sign off, but they no longer freeze on launch day in
> the way they would have, because none of those addresses will be in the index.

**Added:** 2026-08-15

Discovery filters persist into the URL through `#[Url]` in `app/Livewire/DiscoveryPage.php`:

| Property | Parameter | UI label |
|---|---|---|
| `categories` | `kategorie` | category names |
| `verified` | `sprawdzone` | Sprawdzona karta |
| `claimed` | `wlasciciel` | Zarządza właściciel |
| `strictZero` | `zero` | Tylko 0.0% |
| `freshness` | `aktualnosc` | Zaktualizowano |
| `sort` | `sortuj` | — |
| `search` | `szukaj` | — |

**Why this is here:** the `verified` parameter was called `zweryfikowane` while the label read
"Zweryfikowany". When the label became "Sprawdzona karta", the URL said something different from
the interface, so the parameter was renamed to `sprawdzone`. While there is no traffic, that kind of
change is free. After launch it costs every shared link, every saved filter and every position in
Google's index.

**To confirm before launch:**
- Does `wlasciciel` still match the label "Zarządza właściciel"?
- Is `zero` legible enough, or should it be `bez-alkoholu` / `0-procent`?
- One final review of all seven names at once — after launch they freeze.

**Note:** boolean values must be passed as `'true'`, not `1`. Livewire canonicalises booleans to
`true`/`false`, so `?zero=1` works but immediately rewrites the URL.

---

## 2. `is_verified` has no automation — `RESOLVED 2026-08-15`

**Added:** 2026-08-15

The "Sprawdzona karta" badge and the filter of the same name both read `venues.is_verified`. That
column is set **only** by a manual toggle in the admin panel
(`app/Filament/Admin/Resources/Venues/Schemas/VenueForm.php`, helper text: *"Włącz dopiero po
ręcznej weryfikacji karty napojów"*) or by CSV import, where it defaults to `false`.

Nothing kept that flag honest. A venue marked once stayed marked forever, no matter how many months
passed since the check.

**Resolved 15.08 — the badge expires.** `Venue::getHasVerifiedMenuAttribute()` requires
`is_verified` **and** a `last_menu_check_at` newer than `uni.verification_valid_days` (180 days,
`config/uni.php`). After that the badge disappears on its own, while `is_verified` stays in the
database as the record that a check once happened. The manual admin toggle is still the only way to
grant the badge — there is no automation for granting it, and there should not be.

**What is left of this item:** at a hundred venues, 180 days means three re-checks a week. The
threshold sits in config precisely so it can be shortened once the re-check process gets cheaper.

The separate `is_claimed` column is set automatically by `ApproveVenueClaimAction` and never had
this problem.

---

## 3. `v1.md` described the badge incorrectly — `RESOLVED 2026-08-18`

**Added:** 2026-08-15

[v1.md](v1.md), in the "Public Discovery Platform" table, used to say:

> Verified badge (binary) — "Zweryfikowany" checkmark for **claimed + fresh venues**

In the code the badge has nothing to do with claiming or with freshness — it is an independent,
manually set `is_verified` (see item 2). "Claimed" and "fresh" are two different columns,
`is_claimed` and `offer_updated_at`, handled separately.

**Corrected 18.08.** `v1.md` now describes two independent signals: "Sprawdzona karta"
(`is_verified` plus expiry against `last_menu_check_at`) and "Zarządza właściciel" (`is_claimed`,
set by `ApproveVenueClaimAction`). Neither depends on the other, and neither depends on freshness.

---

## 4. Font loading — `RESOLVED 2026-08-30`

> **Done.** Poppins is self-hosted at five weights, latin and latin-ext only (80 KB total), with
> the two faces the first paint needs preloaded. The four unused families and the render-blocking
> stylesheet against fonts.bunny.net are gone, and Bunny.net has been removed from the recipient
> list in the privacy policy. Whether Poppins is the right face at all is still an open question,
> but it is now a design question rather than a performance one.

**Added:** 2026-08-15

`resources/views/layouts/app.blade.php` pulls **five families with every weight and italic** from
Bunny Fonts: `actor`, `alata`, `alexandria`, `asap`, `poppins`. Exactly one is used — Poppins
(`--font-sans` in `resources/css/app.css`). Across all of `resources/views/` there are five weights
in play: 400, 500, 600, 700, 900. No italics at all.

That is a render-blocking stylesheet declaring roughly 50 faces of which we use five. It hits LCP,
which hits SEO directly — and SEO is the main growth channel in V1.

**To do before launch:** narrow it to one family and five weights. While you are there, settle
whether Poppins is the right face at all — the wordmark is a compact grotesque, and Poppins is a
geometric sans of the wellness-app school.

---

## 5. `/jak-to-dziala` promises a button that does not exist — `RESOLVED 2026-08-30`

> **Done, and the button was built rather than the sentence cut.** One form with one required
> choice — "to mój lokal" or "coś się nie zgadza" — stored in separate columns so the count of
> owner reports is readable on its own. That count is the trigger for owner self-service in V2.
> No accounts, no verification, no self-service: the copy now says the message is read by a person
> and answered by e-mail in a few working days, which is what actually happens.

**Added:** 2026-08-18

`resources/views/how-it-works.blade.php:268` states plainly:

> Jeśli coś się nie zgadza, kliknij przycisk **Zgłoś nieaktualne dane** na stronie lokalu.
> *("If something is wrong, click the Report outdated data button on the venue page.")*

There is no such button on the venue page. There is no public route and no controller either — only
the admin panel resource (`VenueInaccuracyReportResource`) and an unused
`app/Http/Requests/StoreVenueInaccuracyReportRequest.php`. In the database: 0 reports.

**Why this is here rather than in the backlog:** it is the only place in the public copy that
promises a feature which does not exist in the code, and `decisions/product/v1-copy-truth.md` says
that must not happen. After launch, every user who goes looking and finds nothing learns that the
text on this site cannot be trusted — and that is precisely the credit a product built on data
reliability cannot afford to lose.

**Two routes, both cheap:**
- Build the button — the `Request` already exists; a route, a controller and a modal are missing. A few hours.
- Cut the sentence from `/jak-to-dziala` and leave the contact email. A few minutes.

Beyond the copy problem, user reports are a signal V1 has no other source for: with fifty venues
maintained by hand by one person, they are the only outside indication that a menu has drifted.

---

## 6. Owner panel at a known URL — `RESOLVED 2026-09-16` (supersedes the 30.08 resolution below)

> **Superseded 2026-09-16 — O-2 was built, and this item's 30.08 answer was the wrong one.**
> The 30.08 resolution kept the panel live and relied on the robots exclusion alone, citing
> the 16.08 decision. It did not know that note **O-2** of 18.08 had already overridden that
> decision — *"panel zbudowany, nieodsłonięty, przełącznik w kodzie"*. Three positions ended
> up in the repository at once, and on 16.09 the oldest was read as current.
> **`/panel` now returns 404 unless `UNI_OWNER_ACCESS=true`.** The robots exclusion stays as a
> second layer. The trigger to open it is the first venue owner who asks for an account.
> See [`../decisions/product/admin-recorded-claims-v1.md`](../decisions/product/admin-recorded-claims-v1.md)
> and the `Superseded:` rule in [`../decisions/README.md`](../decisions/README.md).

### The 30.08 resolution, kept for the record

> **Done.** `/panel/` is excluded in `robots.blade.php`. The panel stays live, as the 16.08
> decision intended.

**Added:** 2026-08-18

Nothing in the app links to `/panel`, but the URL answers with a login form and is not excluded in
`robots.blade.php`. The 16.08 decision deliberately keeps the panel live (admin-created owners have
to log in somewhere), so this is not a defect — but before launch, pick one of two: exclude `/panel`
from indexing, or add the switch from note O-2 in `next-session.md` (replaced 18.09 by [`undone-inventory.md`](undone-inventory.md)) and keep the
panel off until the first real owner is ready.

---

## 7. Analytics history is destroyed daily, with no rollup — `RESOLVED 2026-08-30`

> **Done, and the framing changed.** Retention is now ten years, because the events table holds no
> identifier and nothing legally required ninety days — see
> [`raw-events-are-kept-not-pruned`](../decisions/product/raw-events-are-kept-not-pruned.md). The
> 15.09 deadline no longer exists. The rollup was built anyway (`analytics:roll-up`, scheduled
> before the pruner) because it holds the two things `venue_stats` cannot: attention per drink
> category, and search terms with their zero-result counts.

**Added:** 2026-08-20

`analytics:prune-events` is *scheduled* daily and hard-deletes every row in `events` older than
90 days. There is no aggregation before the delete and no copy.

> **Corrected 2026-08-26.** The Laravel scheduler has never been running — there is no cron entry
> on this machine and there was none on the old one (debt item T-25b), so **nothing has been pruned
> yet.** The events table holds 482 rows, the oldest dated 2026-06-17, which is inside the 90-day
> window. The loss described below is armed, not occurring: it fires on the first scheduler run
> after **2026-09-15**. That makes this a deadline rather than a bleed, and it ties this item to
> T-25b — switching the scheduler on and fixing the rollup are one piece of work, in that order. `venue_stats` survives 24 months but holds
six integers per venue per day and nothing category- or search-level.

**Why this is here and not just in the backlog:** it is the only item in the whole 20.08 audit
whose cost of change is not flat. Today the database holds 477 events and zero customers, so the
rollup costs one migration and one command. After twelve months of real traffic it costs those
twelve months, permanently — year-over-year, seasonality and "you were top 10% last summer" become
impossible to ever produce.

Keep the 90-day prune on raw rows — `decisions/product/eventlogger-identifier-stripping.md` and the
whole GDPR posture depend on not hoarding them. Add a daily job that rolls events up before the
pruner runs: venue × day × category × counter. Small table, no personal data, indefinite retention.

Detail: [`audit-2026-08-20.md`](audit-2026-08-20.md) §9. **The pruner has no dry-run mode — do not
run it manually with a lower `--days` until the rollup exists.**

---

## 8. PostHog counts four events twice — `RESOLVED 2026-08-30`

> **Done.** The four browser calls were deleted, and the whole server-side PostHog path for
> anonymous visitors went with them — including the hashed session identifier, which also settles
> the "one visitor, three identities" defect carried since 14.08. Server-side capture survives only
> for authenticated panel actions, where the id is a real user id.

**Added:** 2026-08-20

`venue_website_clicked`, `venue_instagram_clicked`, `venue_directions_clicked` and `venue_viewed`
fire once from the browser via `window.__capture` and again server-side in `VenueAnalytics`. The
`events` table and `venue_stats` are clean; only PostHog inflates. **Every outbound number seen in
PostHog so far is 2×.**

It sits here with the identity defect carried since 14.08 — an anonymous visitor has three
different identifiers. Both are cheap now and unfixable retroactively: launch traffic recorded
under a broken identity or a doubled count cannot be reconstructed afterwards.

---

## 9. Two numbers in the owner's dashboard can never be true — `RESOLVED 2026-08-30`

> **Done, one each way.** "Udostępnienia" got a writer: the share button now posts to our own
> endpoint instead of only to PostHog. "Zapisy" was removed — `user_venue_saves` cannot get a
> writer while `browse-only-v1` forbids public accounts, so the tile was a promise the product
> cannot keep.

**Added:** 2026-08-20

`venue_stats.shares` is summed and rendered as "Udostępnienia" in both analytics widgets, and
nothing in the codebase ever writes it — `venue_shared` goes only to PostHog. "Zapisy" in
`VenueStatusWidget` reads `user_venue_saves`, which has no writer either and cannot get one while
`decisions/product/browse-only-v1.md` forbids public accounts.

**The first paying owner opens a report containing two confident, prominent falsehoods.** Cheap to
settle now, expensive to explain later — it is the credibility of every other number on that screen.

Pick per metric: remove the tile, or give it a writer. Do it in the same pass as the `venue_stats`
reshape (item 10) — same files.

---

## 10. Event names and `venue_stats` shape freeze on launch day — `RESOLVED 2026-08-30`

> **Done.** `venue_stats` is now `(venue_id, date, metric, count)`, one row per metric. The 32 wide
> rows became 67 long ones with nothing lost. Metrics are a PHP enum with a group, and navigation
> (`direction_clicks`, `maps_clicks`) is kept apart from social clicks by a test rather than by a
> comment — "somebody was on their way to your bar" must never be summed into a bucket with a tap
> on an Instagram link. `maps_clicks` gained a counter it never had: the wide table had no column
> for it.

**Added:** 2026-08-20

`venue_stats` is wide: one column per click type, with a check constraint naming each. Adding a
platform (TikTok, Facebook) touches nine places including raw SQL; removing one is worse, because
the column cannot be dropped without destroying history. Event names carry the same rigidity —
`venue_instagram_clicked` instead of a type parameter, and three coexisting naming conventions
across 36 names.

**Today the table holds 30 rows from internal clicking and can be truncated without a thought.**
After launch the same change is a backfill of real data. Decided direction (D-20c/D-20d/D-20e in
[`../journals/2026-08-20.md`](../journals/2026-08-20.md)): move to a long shape
`venue_stats(venue_id, date, metric, count)`, parameterise event names — but keep navigation
(`directions`, `maps`) separate from socials, because "someone was on their way to your bar" is the
single most sellable B2B signal and must not be buried in a bucket.

Do items 9 and 10 in one pass: same six files, one migration, one set of tests.

---

## 11. Every map shows "API KEY REQUIRED" — `RESOLVED 2026-08-30` (work done)

**Added:** 2026-08-27

CARTO now requires an API key on `basemaps.cartocdn.com` and stamps keyless requests with a
repeating watermark. All three styles used by the app were fetched and rendered during the 27.08
session and all three are watermarked: `dark_all` (discovery), `rastertiles/voyager` (venue page),
`dark_nolabels` (homepage showcase).

**Why this belongs here rather than in the backlog:** it is invisible today only because nothing is
public. On launch day it is the first thing a visitor sees on the homepage hero, on a product whose
whole claim is being the trustworthy source of venue data. And the fix is a basemap migration whose
cost is flat before launch and rises afterwards, once Google has indexed the pages that carry it.

**Settled the same day.** The maps move to MapLibre GL JS drawing vector tiles from OpenFreeMap —
[`../decisions/product/vector-basemap-on-openfreemap.md`](../decisions/product/vector-basemap-on-openfreemap.md).
A CARTO API key as a stopgap was considered and rejected: nobody sees the broken map, so an hour of
work that gets deleted within days buys nothing. The one condition that reverses that — someone
outside seeing the app first, such as a venue owner shown the product during an enrichment call.

The implementation is two to four days and touches three public map surfaces plus the admin
mini-map. Detail and the verified provider comparison: [`audit-2026-08-27.md`](audit-2026-08-27.md).

---

## 12. The privacy policy names two recipients out of at least five — `PARTLY RESOLVED 2026-08-30`

> **Section 6 was rewritten once**, in the same change as the map migration, as the decision
> requires. It now names Scaleway, OpenFreeMap and PostHog, states that fonts are served from our
> own server, and adds the ODbL attribution. CARTO is gone from the codebase entirely, so it is
> correctly absent. Section 5 was corrected too: it claimed events are deleted after twelve months,
> which is no longer true.
>
> **Still open:** the hosting provider and the panel operator are described generically because
> neither has been chosen. That sentence has to name them before launch.

**Added:** 2026-08-27

Section 6 of `resources/views/privacy-policy.blade.php` (**Odbiorcy danych**) names PostHog and
Scaleway SAS. It does not name CARTO, although
[`../decisions/product/carto-named-as-recipient.md`](../decisions/product/carto-named-as-recipient.md)
is dated 24.08, marked **Decided**, and states that it does — the record describes code that was
never written. Bunny Fonts, loaded on every page from `layouts/app.blade.php:20`, is not named
either. Hetzner, Ploi and the object-storage provider will join the list as soon as the hosting
decision is executed.

**Why this is here:** an undisclosed recipient is the standard audit finding, and the cost of the
omission starts on the day the first real visitor loads a page — not on the day someone asks. The
rule already exists in the CARTO record: *every third party that receives visitor data because a
public page loads their resource is named in the privacy policy before that page goes live.*

**To do before launch:** rewrite section 6 once, after the hosting decision, naming every recipient
in one pass — tile vendor, font host, hosting provider, server panel, object storage, e-mail
provider, analytics. Do it in the same change as the basemap migration (item 11), because that
migration changes which tile vendor is named.

---

## 13. Filter combinations are indexable, and nothing said so — `RESOLVED 2026-08-30`

**Added and resolved 2026-08-30.** This item did not exist on any list, which was the finding.

`server-side-get-filtering` puts every filter into the web address so links can be shared. That
also makes every combination of them a page a search engine can index: seven filters over fifty
venues is thousands of near-identical pages, and free-text search and sort order are unlimited.
Fixing that after the pages are indexed is a slow manual de-indexing job rather than a decision,
which is exactly the shape of thing this list exists for.

**Done:** the map emits `noindex, follow` whenever any filter is present, with the canonical
pointing at the plain city map. `follow` is deliberate — the crawler must keep walking through to
the venue pages. The search surface stays the city cluster that already exists, because city,
district and category are the shapes people actually type.

**Related and still open:** a minimum venue count before a district page is indexable.
`empty-landing-pages-noindex` handles empty pages; it does not handle thin ones. Proposal: three.

---

## 14. Nothing separates robots from people in the numbers — `RESOLVED 2026-08-30`

**Added and resolved 2026-08-30.** Also on no previous list.

The credibility question a venue owner actually asks is not "who were these people" but "were
these people at all". Identification would have answered it worse — a list of ids is as easy to
fabricate as a counter — and would have cost the claim that we hold nothing about anybody.

**Done:** automated requests are dropped at the write, in `EventLogger` and in `VenueStat::track`,
by matching the User-Agent against a published list in `config/analytics.php`. Nothing about the
request is stored — no address, no agent string, no flag — so the events table stays as anonymous
as it was. Crawlers still receive the page; they are excluded from the count, not from the site.

**This had to happen before the rollup, not after.** A summary table built while robots are still
being counted is contaminated permanently, because the raw rows it came from can be deleted.
