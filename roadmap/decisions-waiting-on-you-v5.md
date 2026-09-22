---
version: 5.0
owner: Paweł Milewski
updated: 2026-09-01
status: living
---

# Decisions waiting on you — v5, the launch-speed edition

Version 4 is a **status** document: what was settled, built and parked as of 31.08. It stays
where it is. This one is a **question** document again, in the format you answer on the commute:
problem, what I'd do, then a blank line for your answer.

**Everything in here was verified against running code and the database on 01.09.** 515 tests
green. Where a document and the code disagreed, I have said so and believed the code.

> **The filter for this version:** you said it plainly — *fewer features, 100% working, deploy
> fast, SEO right, events right.* So every question below is scored against one of three things:
> **does it block the deploy**, **does it change what Google sees**, or **is it data we cannot
> recreate later**. Anything that fails all three is in §7 and is not a launch question.

---

## 1. Settled by you on 01.09 — recorded here, no answer needed

| # | Decision | Consequence |
|---|---|---|
| **D-01a** | **The owner panel returns 404 in V1.** Built, tested, not shared. V2 is a toggle | Reverses `admin-recorded-claims-v1.md` (16.08). Needs its own decision record — that is work, not a question |
| **D-01b** | V1 is for promotion, indexing and event collection. Not for owners | The owner-report counter on the venue page is the V2 trigger, and it already works |
| **D-01c** | Stability over surface area | Applied below: three built features are proposed for *hiding*, not building |

**What the 404 buys you, verified:** product proposals are submitted from exactly one place —
`app/Filament/Owner/Resources/VenueResource/RelationManagers/ProductsRelationManager.php:112`.
There is no public route to them and never was. So with the panel 404, **no third party can post
anything to this site.** That is the whole of the DSA Art. 16 question answered: the obligation
attaches to services that host content other people submit, and V1 hosts none. It is a question
again the day the panel opens, and not before.

Same move closes: four ROPA entries, the owner erasure path, plan gating, and the price list.
**All of it is V2. You were right on both counts.**

---

## 2. Events — the only section where waiting destroys something

This is the part that cannot be fixed later, so it is first. Three findings, all verified today.

### A1 · The search event does not record which venues came back

`search-results-recorded.md` (24.08, marked **Decided**) says the first twenty returned venue ids
are stored on every search, in rank order, because *"you appeared in 340 searches and were tapped
12 times"* is the metric an owner would actually pay for. Version 3 of this file listed it under
**Shipped**.

It is not built. `DiscoveryAnalytics::searched()` stores `query`, `result_count`, `categories`,
`cities` — and no ids. `AnalyticsTracker::trackSearchCommitted()` is never handed the result
collection to pass on.

**This is the third time a decision record has described code that was never written** (after
CARTO as a named recipient, and E9). That pattern is worth a rule of its own, separate from this
question.

Without it there is no impression count, so there is no click-through rate, so the strongest
owner sentence — *"you were shown 340 times and tapped 12"* — cannot be said at any point in the
future about the launch period.

**What I'd do:** build it before the deploy. It is one collection passed through two methods and
a capped array in the properties column. Half a day including tests.
**Answer: "build it", "skip it", or "after launch".**

Answer: build it, but are we sure only top 20? What if there's 100 found in a search? Technically each venue is supposed to be counted as appeared in search. Unless we define the "you were shown x times in search" by whether the venue was viewed, not just present in the search.

### A2 · Five discovery events exist only in PostHog, behind consent

`venue_card_impressed`, `venue_card_clicked`, `venue_pin_focused`, `filter_applied`,
`map_toggled` are fired from `resources/js/discovery.js` through `capture()`, which returns early
unless the consent cookie says `granted`. They never reach our `events` table.

That means three things at once: they are lost for every visitor who does not consent; they are
governed by PostHog's retention and not ours; and they cannot feed an owner or producer report,
which reads `events`.

`venue_card_clicked` in particular has a healthy server-side twin (`VenueMetric::CardClicks`,
written in `VenueAnalytics.php:62`), so that one is covered. **`venue_card_impressed` is the
one that hurts** — it is the same missing denominator as A1, from the list side instead of the
search side.

**What I'd do:** move impressions server-side and leave the other four in PostHog. Impressions
are a product signal; map toggles are a UX curiosity. If A1 is built, impressions may be
redundant — the search event already knows what it returned.
**Answer: "A1 covers it", "move impressions too", or "move all five".**

Answer: first thing is I would unify the naming maybe? If we got the impressions events with certain names meant for posthog, why not reduce the mental load and complexity by naming the events the same?
As for tracking impressions in search, we either just do that since it's still an impression, I'd be a separate funnel/raport, option B would be maybe adding a parameter to impressions when the impression is on search results saying something like "search: true" or "source:search | list" like an enum?
### A3 · What we are *not* recording, that costs nothing and is not personal data

You said: gather more rather than less, as long as it is server-side and holds nothing about a
person. Applying that rule honestly, here is everything missing. Each line is a signal a report
needs, not a feature.

| Signal | Why a report needs it | Personal data? | Cost |
|---|---|---|---|
| **Result position** of a venue in a list | "You were seventh for *piwo bezalkoholowe*" — the single most concrete thing we can tell an owner | No — rank order is implicit in A1's capped array | Free, comes with A1 |
| **Referrer bucket** (`google` / `instagram` / `direct` / `other`) on entry | Which channel actually works, per venue page. Google Search Console gives it per URL but stops at our property boundary and keeps 16 months | No, if bucketed to a handful of values and never stored raw | Small |
| **Device bucket** (`mobile` / `desktop`) | "Four in five people found you on a phone" is a real sales line, and it changes what we build next | No, as a two-value bucket. It becomes fingerprint-adjacent only if combined with more fields — so it must stay alone | Small |
| **Product-level menu attention** | We record `venue_category_viewed` (category + seconds) but never which *drink* was looked at. This is the producer line's core input, and the producer line is the one that does not depend on traffic | No | Medium |
| **Brand / product page views** | Cannot exist until those pages exist — see §3. The day they ship, this is the demand signal producers buy | No | Comes with the pages |

**What I'd do:** referrer bucket and device bucket before the deploy — they are cheap, they are
the two questions every first conversation asks, and neither can be backfilled. Product-level
attention after the deploy, because it changes the venue page.
**Answer: which of the five, and which before the deploy.**

Answer: referrer bucket means if we get traffic source from Instagram google etc we can see that?
Like if someone visits the venue show page from Google we can actually count it and show, am I correct? I'd try to build all of these before deploy. Also, how do we track the product level menu attention, most of the time a few drinks are in a viewport in the menu. How do we know the users is looking at the specific one?

### A4 · One question I cannot answer for you

`seasonalForecast()` is not a report. It is four hardcoded Polish sentences chosen by the current
month (`VenueAnalyticsReportService.php:276`). It is in the Basic bundle in the price list.

It is honest editorial advice and it may be genuinely useful. But it is the one thing in that
list of eighteen that a buyer could reasonably feel misled by, because everything around it is
computed. **Answer: "keep it, labelled as editorial", "cut it", or "make it real later".**

Answer: I need to see the code, I need more context to answer that.

---

## 3. SEO — what Google will actually find on day one

### B1 · The pages you decided are the main search surface do not exist

`brand-and-product-pages.md` (30.08, **Decided**) says brand pages and drink pages *"become a
primary search surface rather than supporting data"*, on the reasoning that five years of search
data show real demand for non-alcoholic beer and nothing measurable for non-alcoholic bars in
Warsaw. Version 4 lists it as settled.

**There are no such routes.** `php artisan route:list` returns 49 routes; the public ones are
home, `/mapa`, `/miejsce/{slug}`, `/kategoria/{slug}`, the four static pages, the city cluster,
sitemap and robots. No brand page, no product page, and nothing for them in the sitemap.

So the site launches with the surface the same decision argues does not have demand behind it.

This is the largest gap in the whole document, and it is the one that most directly contradicts
your own priority — *"make sure SEO is implemented well"*.

**What I'd do:** build them before the deploy, text-only, exactly as the decision specifies:
a counted call to action naming a real number, locative inflection from the record, the word
"mocktail" never in a title. Two to three days. Launching without them means the indexing period
— the slowest thing in the whole plan, months not weeks — runs on the weaker surface.
**Answer: "before launch", "after launch", or "show me the traffic argument again".**

Answer:before launch 

### B2 · Four SEO pages decided "in" and not built

`/faq`, the glossary, `/kontakt`, `/suchy-styczen` were all answered **yes** in version 3 §G.
None exists. `/suchy-styczen` is seasonal and January is four months out, so it has a natural
deadline that is not launch day.

**What I'd do:** glossary and `/faq` before launch — they are definitional content, they rank
slowly, and slow-ranking content is exactly what you want indexed earliest. `/kontakt` before
launch because the DSA answer in §1 rests on a monitored address existing. `/suchy-styczen` in
November.
**Answer: confirm, or reorder.**

Answer: just build all of these I guess, didn't we decide dry January page is permanent? Let google index it right away? Or it's pointless?

### B3 · Small SEO gaps, no decision needed, listed so they are not forgotten

Verified today, all trivial:

- **No `og:image` anywhere in the app.** Every link shared to Instagram — the channel you
  committed to three times a week — renders a blank card.
- `/jak-to-dziala` and `/o-nas` have a description and nothing else: no canonical, no
  `og:title`, no robots directive. Both are in the sitemap.
- `regulamin` and `polityka-prywatnosci` correctly carry `noindex`.
- Venue, city, district and category pages are complete — canonical, robots, OG, JSON-LD,
  `noai`/`noimageai`. **The programmatic cluster is the strong part and it is genuinely done.**
- No Google Search Console or Bing verification token. That is a launch-day step, not a code one,
  but it needs an owner.

**No answer needed. This is work, and it is under a day for all of it.**

Answer anyway: what if we had an image, but in order to not get copyrighted, we generator some SVGs? I feel like we can capitalize on using that og:image, but how beneficial would it be?
As for jak to działa and o nas pages, let us implement what is lacking. The regulamin and polityka prywatności is supposed to be noindex, right?
What are google search console and bing verification tokens?

---

## 4. Stability — the "100% working" filter applied honestly

### C1 · Three things have never run outside this machine

| Thing | State | Risk on day one |
|---|---|---|
| **Laravel scheduler** | Correct in `routes/console.php`, three jobs. **No cron entry on any host** (T-25b, carried since 26.08) | Freshness badges silently stop matching reality. This is the mechanism the entire product claim rests on |
| **Queue worker** | `supervisor/uni-worker.conf` exists; no host has ever run it | Nothing queued is delivered. Smaller with the panel dark, but not zero |
| **Backups** | Do not exist | Blocks wiping the 67 generated venues, which blocks seeding the 30 real ones |

**What I'd do:** these three are the deploy, not a decision. But they are the reason "deploy
fast" and "100% working" are the same task rather than opposing ones.

Answer:
Scheduler, let us work on it, what exactly would we need?
Queue worker, is that needed? What is that for?
Backups: here we need a session for it, I want to educate myself more about it, including best practices in a technical domains and legal too, maybe some laws/documents require it on a cycle?

### C2 · A report from a real visitor reaches nobody

`VenueReportController` writes the row and logs the event. **It sends no notification**, and
`.env` has `MAIL_MAILER=log` regardless. Meanwhile `/jak-to-dziala` tells the visitor a person
reads it and replies by e-mail within a few working days.

Two consequences: the copy makes a promise the system cannot keep (`v1-copy-truth.md`), and the
owner-report counter — **your stated V2 trigger** — accumulates unwatched in a panel you would
have to remember to open.

**What I'd do:** one queued notification to your own address, plus SMTP. That makes SMTP a
launch blocker again after all — not for owners, for you.
**Answer: "notification + SMTP before launch", or "I will check the panel by hand".**

Answer:notification + SMTP before launch

### C3 · Hosting

UpCloud at 90% as of 31.08. Everything downstream waits on it: backups, SMTP, the access-log
retention window, and the two generically-worded sentences in the privacy policy that must name
the host and the panel operator before the first real visitor.

**Answer: confirm UpCloud, or name the alternative.**

Answer: need a good research yet. I see right now in upcloud info "Prices exclude any applicable local taxes."

### C4 · Access-log retention — carried unanswered from v3 C1

You asked, correctly, whether 14 days is right and what the legal basis is. It is legitimate
interest (Art. 6(1)(f)) for security and abuse, and 14 days is not a legal number, it is a
common one. What matters is that **it is short and it is enforced**, because the `events` table
is only anonymous while no access log sits next to it that joins on time and path.

**What I'd do:** 14 days, written into the ROPA and configured the day the host is chosen.
**Answer: "14 days", another number, or "research it properly first".**

Answer: 14 days 90% sure, do a bit more research.

---

## 5. V1 feature inventory — verified against code on 01.09

Requested directly. **Status here means "does it work", not "is it written down".**

### Exposed to the public at launch

| Feature                             | Works | Note                                                                                                                                                                                                                                                   |
| ----------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Discovery map + list + 7 filters    | ✅     | MapLibre on OpenFreeMap since 30.08. `zero` parameter name still unconfirmed and free to rename                                                                                                                                                        |
| Venue profile with full menu        | ✅     | Canonical, JSON-LD `LocalBusiness`, OG, `noai`                                                                                                                                                                                                         |
| City / district / category cluster  | ✅     | Thin districts `noindex` under three venues; filtered views `noindex, follow`                                                                                                                                                                          |
| Sitemap + robots                    | ✅     | Matches the indexing thresholds. Nothing for brand/product pages, which do not exist                                                                                                                                                                   |
| Freshness badge                     | ✅     | 90 days, config. **Depends on a cron that has never run — C1**                                                                                                                                                                                         |
| "Sprawdzona karta" badge            | ✅     | Expires after 180 days against `last_menu_check_at`                                                                                                                                                                                                    |
| "Zarządza właściciel" badge         | ⚠️    | Works, but **14 venues carry it with 0 claims in the database.** Cleared by the wipe - that badge is to be suspended until V2, we cannot stare that untill owner panel is public                                                                       |
| Inaccuracy / owner report form      | ⚠️    | Form, throttle, honeypot, `reporter_type` all work. **Nobody is notified — C2** - let us work it out                                                                                                                                                   |
| Outbound redirects + counters       | ✅     | 7 metrics, all with server-side writers, bots filtered at the write                                                                                                                                                                                    |
| Anonymous analytics                 | ⚠️    | Solid, with the three gaps in §2 - let us talk about it too                                                                                                                                                                                            |
| Consent banner                      | ✅     | Gates PostHog only; our own events do not need it - seems broken when denying on mobile, let's tackle it to make it work 100%                                                                                                                          |
| AI-crawler blocking + canary venues | ✅     | 2 canaries, honeypot export route live - with time I'd add more canaries, 2 seem low                                                                                                                                                                   |
| Static pages                        | ⚠️    | Content fine. `/jak-to-dziala` promises the report button — **that one is now true**, built 30.08. Meta gaps in B3 - any work to do here or decisions to make?                                                                                         |
| `regulamin` says "Zweryfikowany"    | ❌     | The badge has been called **"Sprawdzona karta"** since 15.08. One-line copy fix, `regulamin.blade.php:42` - the regulamin needs it's own thorough review, but as a last item on the checklist since everything we build is to be reviewed before that  |

### Internal, exposed to you only

| Feature                                                              | Works | Note                                                                                                                                    |
| -------------------------------------------------------------------- | ----- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Admin panel — venues, products, brands, producers, categories, users | ✅     |                                                                                                                                         |
| Admin venue analytics — **all 18 reports**                           | ✅     | With Free/Basic/Pro/Premium preview buttons. This is where the reports live today                                                       |
| Claim queue, proposal queue, erasure requests, report queue          | ✅     | All four have no traffic and will have none in V1                                                                                       |
| Import / - export                                                    | ✅     | **Does not fire observers** — run `uni:check-offer-freshness` by hand after the xlsx - want check-offer-freshness supposed to be daily? |

### Built, and going dark behind the 404

Owner panel, claim flow, product proposals, owner drink CRUD, `VenuePlan` price list, all 17
feature entitlements. **Nothing to build and nothing to remove — one config flag and a decision
record.**

### Genuinely missing

Brand pages, product pages, `/faq`, glossary, `/kontakt`, `/suchy-styczen`, `og:image`,
search-result recording, referrer and device buckets.

---

## 6. The trap that must be disarmed before the import

Unchanged from 31.08 and still the most urgent single item in the repository.

`VenueAnalyticsReportService:545` counts distinct venues that added a product in 30 days. It
cannot distinguish *"eight venues adopted Lech Free"* from *"Paweł added Lech Free to eight
venues on a Tuesday"*. You have 30 real venues in a spreadsheet waiting to be imported.

**This must be guarded before the import, not after.** Otherwise the first trend report shown to
anyone describes a seeding session as Warsaw demand — and it discredits the methodology, not the
number.

**No answer needed.** Flagged because the import is next in the queue and this is ahead of it.

---

## 7. Confirmed V2 — listed so they stop appearing on launch lists

You answered these today; they are recorded so they do not resurface.

- **Plan gating.** `Venue::hasFeature()` is written and tested and **called nowhere in
  application code**. The 18 reports render only in the admin panel. There is no gate to build
  and none to leave — an owner has no access to anything. V2.
- **Pricing (79/129/199 PLN in `VenuePlan::label()`).** Blocks the first sales conversation, not
  the deploy. Its own session, after the event inventory.
- **DSA Art. 16.** Dissolved for V1 by the 404 — see §1. Live again the day the panel opens, and
  worth a lawyer's hour before that day, not before this one.
- **Public accounts, saves, likes, community reporting, affiliate links, `/dla-lokali`.**
  All V2 or later, all with recorded reasoning.

---

## 8. What I would do with the next three sessions

Not a question — a proposal, so you can reorder it on the train.

1. **Disarm the seeding trap (§6), then the events work (A1, A3 buckets).** Everything here is
   irreversible-if-skipped and none of it depends on hosting.
2. **Brand and product pages (B1), glossary and `/faq` (B2), the meta gaps (B3).** The SEO
   surface, in one pass, before anything is indexed.
3. **The 404 decision record and flag, the `regulamin` fix, the report notification, then
   hosting.** The deploy session.

Seeding the 30 real venues runs alongside all three and does not wait for any of them — except
the import itself, which waits on step 1.

---

*Answers can be one word. Anything answered here becomes a decision record and is acted on in
the session it belongs to.*



My notes:
As for "Thin districts `noindex` under three venues; filtered views `noindex, follow`", isn't it bad for SEO? If we publish a page with 2 venues, it has noindex, google sees it and "remembers" it as a no follow, it will stay like that untill a new indexing is undertaken by Google crawlers?

Also, I want to be able to add new venues, products, brands from my phone, when we launch it's possible via admin panel? Is it phone friendly?

Good source 
https://kalkulatoralkoholi.um.warszawa.pl/alkohole/cBIP_zezwolenia_lst.asp?str=10&wn_wr_id=7