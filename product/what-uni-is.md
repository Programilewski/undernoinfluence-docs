---
description: "What UNI is today, in the present tense. The standing description."
version: 1.0
owner: Paweł Milewski
updated: 2026-09-25
status: standing description — what UNI is today, in the present tense. **No change history, deliberately.** Nothing here says what something used to be or when it changed; the journals and decision records hold that. Read from the code and the live schema on 25.09.2026, not from other documents — several of which describe a product that no longer matches. When this drifts, rewrite it rather than append to it.
---

# What Under No Influence is

## 1. In one paragraph

**UNI helps a person find a non-alcoholic drink they can actually order at a venue tonight.** It is a Polish, city-scoped directory of real places with a real 0% offer, and the answer it gives is *this bar, this street, these six drinks, checked this recently*. It is harm reduction rather than abstinence: two alcohol-free drinks alongside two alcoholic ones instead of four alcoholic ones is a success. Venues, brands and producers appear only as instruments of that answer. UNI takes no public position on alcohol policy — the subject is what a person can order tonight, and that is the only thing it speaks about publicly.

**The test every feature is measured against:** *does this help somebody find a healthier option they would otherwise have missed?* A feature that helps a brand more than a person is not a UNI feature.

## 2. Who it is for

| Side | What they get | What they pay |
|---|---|---|
| **A person looking for a drink** | the whole site, no account, no login | nothing, ever |
| **A venue owner** | their listing kept accurate, and analytics about demand they cannot see any other way | free tier, then a subscription |
| **The administrator** | the catalogue, the venues, the claims, the reports | — |

**There is no advertising, no paid placement and no pay-to-rank**, and that is a permanent rule rather than a launch simplification. The product's only asset is that a person believes the page. A promoted venue at the top of a list destroys that in one impression, and no revenue replaces it.

## 3. What a person actually does

They arrive on a city page or the map, narrow to what they feel like drinking, and open a venue.

- **`/`** — the homepage, city-agnostic.
- **`/mapa/{city?}`** — discovery: the list and the map together, with search, filters and sort. Filters are `noindex` — a filtered list is a tool, not a page anyone should land on.
- **`/miejsce/{slug}`** — the venue. Flat, with no city in the path, so a venue keeps its address forever and expanding to a second city creates no redirects.
- **`/napoj/{slug}`**, **`/marka/{slug}`** — a drink and a brand.
- **`/kategoria/{seo_slug}`** — a category across everywhere.
- **`/{city}`, `/{city}/{district}`, `/{city}/{category}`, `/{city}/{district}/{category}`** — the SEO surface, generated from venue data.
- **`/suchy-styczen`** — Dry January. The page exists all year and is linked from the footer all year; it joins the main menu only between **1 December and 31 January**, evaluated at render. A permanent menu entry would make UNI read as a Dry January site for the ten months it is not one.
- Static: **`/o-nas`**, **`/jak-to-dziala`**, **`/faq`**, **`/slownik`**, **`/kontakt`**, **`/regulamin`**, **`/polityka-prywatnosci`**.
- **`/zglos-lokal`** — a venue owner asking to be listed or to claim a listing.

The interface is Polish. It is **dark-only** — one palette, no theme switch, no light mode anywhere in the public views.

## 4. The six categories

These are the names on the site, and the SEO slug is deliberately a phrase people actually search rather than the internal one.

| Name shown | Internal slug | Public URL |
|---|---|---|
| **Piwo 0%** | `piwo` | `/kategoria/piwo-bezalkoholowe` |
| **Wino 0%** | `wino` | `/kategoria/wino-bezalkoholowe` |
| **Drinki 0%** | `drinki` | `/kategoria/drinki-bezalkoholowe` |
| **(Nie)mocne** | `niemocne` | `/kategoria/destylaty-bezalkoholowe` |
| **Cydr 0%** | `cydr` | `/kategoria/cydr-bezalkoholowy` |
| **Szampan 0%** | `musujace` | `/kategoria/napoje-musujace-bezalkoholowe` |

**Every category is listed even when a city has nothing in it.** A missing category reads as "this does not exist" rather than "nobody here stocks it", and the second is the useful fact.

## 5. What the site claims, and what backs each claim

This is the part that matters most, because every badge is a promise and a promise nothing enforces is a lie with a delay on it.

| What a visitor sees | What it actually means | The number behind it |
|---|---|---|
| **Fresh / stale menu** | the venue's offer was confirmed inside the window. Binary — there are no decay bars | **90 days** |
| **"Sprawdzona karta"** | a human checked this menu against the venue, and that check is still inside its validity window | **180 days.** The flag alone is not enough: a verified venue whose last check has aged out loses the badge, so it cannot come to mean "an admin ticked a box once" |
| **"Nowe"** | this drink was added to this menu recently | **30 days**, which is the same window an owner's "trending" is counted over, so the visitor's *new* and the owner's *new* are the same fact |
| **Order in the list** | breadth: how many distinct drinks the venue carries, then across how many categories | `breadth_score`, recomputed when the menu changes |

**There is no credibility score and no earned checkmark.** Ranking is breadth and category diversity; trust is freshness plus a human check. Nothing computes a hidden number that decides who is good.

**The freshness figure is repaired hourly** by a scheduled command, because bulk operations and raw queries can leave the stored date behind. A day of drift is a day of a badge stating something untrue, which is why it runs every hour rather than every night.

## 6. What UNI knows

**33 tables, 342 columns** — 26 carry the product, 7 are framework plumbing. The shape in plain words:

- **Reference lists:** cities, districts, categories, producers, brands.
- **The catalogue:** products, their aliases, and proposals for new ones.
- **The venue:** the place itself, the products on its menu, its own custom drinks, a log of offer changes, and per-venue feature flags.
- **People and requests:** users, venue claims, inaccuracy reports, erasure requests.
- **Numbers:** raw events, and three rollup tables.
- **Records:** audit log, imports, exports, failed import rows, notifications.

**A venue is its name at an address.** It carries coordinates, a type (`restauracja`, `pub`, `bar`, `kawiarnia`, `hotel`, `inne`), a plan (`free`, `basic`, `pro`, `premium`), business contact details, and the freshness and verification timestamps above. Venue contact details are **business** contact details, not personal data — unless a sole trader uses their own name or number.

**The permanent scope rule:** the catalogue holds only drinks that are genuinely non-alcoholic — 0,0%, and products up to 0,5%. Not 1%, not a 2% shandy, not "low alcohol". A directory that lists a shandy has quietly become a drinks directory, and the person who came here to drink less can no longer trust a single line on the page without checking it themselves. This is not deferred; it is refused.

**Producer names never render as brands.** A producer is an internal fact about who owns what; the reader sees the brand they would recognise on a shelf.

## 7. What UNI measures, and what it never shows

Three tiers, and the separation is deliberate.

1. **Internal only** — demand by area, funnels, retention, coverage gaps, category growth. Never exposed to anyone, and it exists to decide what to build and where to expand.
2. **Free owner dashboard** — profile views, freshness status, what needs reconfirming, how complete their catalogue is.
3. **Paid owner insights** — gap reports, category demand ranking, breadth percentile, competitor and district demand, trend alerts. Seventeen named features across four tiers.

Raw events hold **no identifier** and are kept indefinitely; they are summarised nightly into per-venue, per-category and per-search rollups. **Nothing in this application deletes a row to satisfy a retention rule** — retention here is anonymisation. The identifying column is nulled and the row is kept: user references in offer logs and the audit log at 24 months, claim and report contact fields 12 months after the decision.

## 8. How the data defends itself

The catalogue is the asset, so scraping it is the threat.

- **All AI crawlers are blocked**, by decision, through `robots.txt` served by the application rather than from disk — a static file on disk would be read by the web server before PHP ever ran, and would silently override the rules.
- **Canary venues** — decoy records excluded from every public path. If they appear somewhere else, the source is known.
- **A honeypot export** at `/export/venues.json` that looks like the prize.
- **Bot detection** on the analytics endpoint, so the numbers are about people.

## 9. The owner side — built, tested, and deliberately closed

The owner panel lives at **`/panel`**: a dashboard, their venues, the claim flow, their profile. It is complete and covered by tests, and **it is not reachable.** One switch, `UNI_OWNER_ACCESS`, governs all of it — the panel, the claim and new-venue forms, the links that point at them, the privacy-policy sentences about owners, and the emails.

**Why it is closed.** V1 processes no personal data. An open owner panel is a login, a session, and a claim flow holding a contact name, email, phone and NIP — whether anyone uses it or not. Closed, the compliance surface is genuinely zero rather than nominally small.

**What opens it is an event, not a date: the first venue owner who asks for an account.** That is the demand signal worth waiting for, and it is where V2 begins.

**How an owner proves a venue is theirs.** If their email is tied to the venue, they get a confirmation link valid for **7 days**. If it is not, they send a code from the venue's own Instagram to UNI's account and an administrator matches it. A request still waiting after **14 days** is flagged in the admin list and mentioned once in a morning email. **Nothing is ever rejected automatically** — a claimant may have done everything right and be waiting on us.

## 10. The administrator side

**`/admin`**, behind three layers of access. Resources for venues, products, brands, producers, categories, product proposals, users, claims, inaccuracy reports and erasure requests, plus a per-venue analytics page.

The first admin account is created **on the server** by a dedicated command that prompts for the password rather than taking it as an argument, so it never enters shell history. Filament's own user command creates the wrong role and the panel refuses it.

The dashboard carries one widget that is not about the product at all: **when the scheduler last ran.** It turns red after fifteen minutes of silence. A healthy box with a broken crontab looks exactly like a healthy box from every other angle.

## 11. What runs without being asked

**Ten scheduled commands and one queue worker.** Every notification is queued, so a claim approval, an owner invite, a password reset and an erasure response all depend on the worker existing.

| When | What | What is untrue while it does not run |
|---|---|---|
| every 5 min | heartbeat | nothing can tell you the scheduler stopped |
| every 5 min | outside healthcheck ping | a dead box is noticed only from inside the building |
| hourly | offer freshness repair | the freshness badge states something false |
| 03:10 | analytics rollup | owner numbers stop advancing |
| 00:00 | anonymise expired data | **the privacy policy stops being true** |
| 08:00 | remind about waiting claims | a request past 14 days is never flagged |
| 00:00 | prune failed jobs | recipient addresses accumulate with no retention |
| 01:00 / 01:30 / 07:00 | backup clean, run, monitor | **there are no backups**, and nothing says so |

## 12. Where it runs

| | Laptop | Home server (preprod) | Production |
|---|---|---|---|
| Purpose | building | using it on real devices, breaking it freely | the live site |
| Reachable | locally | your tailnet only | the public internet |
| Scheduler and worker | no | **yes** | not yet — it does not exist yet |
| Personal data | none | none, ever | all of it |
| Owner access | off | off | off until V2 |

**Production is decided but not built:** OVH VPS-1 in a Polish datacentre, clean Ubuntu, Ploi Basic with staging, Postgres on the same box, mail through Scaleway, backups encrypted to Scaleway object storage.

## 13. What is deliberately not in V1

Not "not yet" — decided against, for reasons worth keeping:

- **User accounts, registration, saved venues.** Nothing on the visitor side needs an identity, and an identity is the entire compliance surface.
- **Community reporting.** It needs accounts to be worth anything.
- **The owner panel being reachable**, until an owner asks.
- **Tags.** Thirteen are specified across composition, taste and diet. None exist in the database. It is a backend, a migration and data from zero, not a UI task.
- **A second city.** The multi-city switch is off and the city selector is hidden. Warsaw first, and the venue list is what sets the date.
- **English.** The product is Polish.
- **Anything that ranks a venue for money.**

---

*The mission and the product rules that follow from it are the first thing to read before building anything that touches brands, producers or placement. The structural map of every table and column is `database/schema.md`, in the application repository beside the migrations that change it.*
