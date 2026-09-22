---
version: 6.0
owner: Paweł Milewski
updated: 2026-09-02
status: living
---

# Decisions waiting on you — v6, the part you ran out of time for

You answered A1, A2 and A3 on 02.09 and said you were out of time. Everything you answered
that was unambiguous is **built, tested and committed** — see §0. Everything from A3 onward
is here, in the same format: problem, what I'd do, then a blank line for your answer.

**Everything below was verified against running code on 02.09.** 557 tests green, up from 515.

> **Same filter as v5:** does it block the deploy, does it change what Google sees, or is it
> data we cannot recreate later. One thing has been added to that list this session:
> **is it a number somebody will be asked to pay for**, because three of today's findings
> were about numbers that would not have survived a buyer's first question.

---

## 0. Shipped today — no answer needed, listed so it leaves your list

Six commits on `v1`. All green.

| What | Why it mattered |
|---|---|
| **Search records presence** — the venues actually rendered as cards, in rank order | The missing denominator. Could never be backfilled |
| **Entry source, device, view surface** as closed-set buckets | The three questions every owner conversation opens with |
| **"Zarządza właściciel" badge suspended** behind one config flag | The only outright untruth left on the public site |
| **Consent cookie fixed** on non-HTTPS origins | Your mobile bug. Root cause found, see §8.2 |
| **`/jak-to-dziala` and `/o-nas` meta completed** | Canonical, robots, full OG card |
| Four decision records | Written *with* the code, not ahead of it |

**Three things you asked about turned out to be already correct**, so they need nothing:

- **A4, `seasonalForecast`.** You asked to see the code. It is four hardcoded sentences picked
  by month — but it already returns `status: 'editorial'` **and the panel already prints
  *"Wskazówka redakcyjna — prognoza oparta na danych w V2"* directly underneath it**
  (`venue-analytics.blade.php:255`). Nobody can reasonably feel misled. **Keep it. No change.**
  v5 got this one wrong; the code was more honest than the document claimed.
- **`regulamin` / `polityka-prywatnosci` `noindex`.** Correct and deliberate. Legal boilerplate
  that ranks dilutes the site and can outrank real content for brand queries. Now locked by a
  test so nobody "completes the meta" on them by symmetry later.
- **The `/analytics/events` endpoint you were worried about.** See §2.1 — it is better defended
  than you feared, and I found the one place that still needs a decision.

---

## 1. The batching walkthrough you asked for

> *"the batching seems smart, but I want you to walk me through it on how exactly we implement
> it and how we build raports using it."*

This is the largest single design decision left, because it determines the shape of what will
become the biggest table in the database. Nothing is built yet — deliberately, since you asked
to see it first.

### 1.1 Why batching at all

Impressions are the highest-volume event on the site by a wide margin. Every filter change
re-renders up to 24 cards. One visitor doing three searches generates up to 72 impressions.

| Daily visitors | Un-batched rows/day | Batched rows/day |
|---|---|---|
| 100 | ~7,200 | ~360 |
| 500 | ~36,000 | ~1,800 |
| 2,000 | ~144,000 | ~7,200 |

For scale: the `events` table holds **681 rows today, total, since April.** Un-batched
impressions at 500 visitors/day would add more rows in one day than the table has ever held,
every day, forever — because `raw-events-are-kept-not-pruned.md` says we never delete them.

### 1.2 How it works, concretely

The observer that decides what counts as *seen* **already exists and is already correct**
(`discovery.js:534`): a card must cross 50% of the viewport and stay there 500ms. It already
records position. Today it calls `capture()`, which goes to PostHog and returns early without
consent. Three changes:

1. **Collect instead of send.** When a card qualifies, push `{venue_id, position}` into an
   in-memory array instead of firing immediately. De-duplicate per page — a card scrolled past
   twice is one impression, which is what the existing `_impressedIds` set already does.

2. **Flush on a boundary, not a timer.** Send the array when the viewport settles (about 1s of
   no new qualifying cards), and unconditionally on `pagehide` and `visibilitychange`. Both of
   those hooks are **already wired up** in `venue-analytics.js` for the menu dwell timer, so
   this is a pattern the codebase already runs, not a new one.

3. **One row per flush.** `POST /analytics/events` with
   `{event: 'discovery_impressions', venues: [{venue_id, position}, …], surface: 'search'}`.
   One `events` row holding an array, rather than 24 rows holding one pair each.

### 1.3 How a report reads it

This is the part that makes or breaks the choice, so here it is explicitly. Postgres `jsonb`
can unnest an array back into rows at query time, so **the array costs nothing analytically** —
you get the same numbers as one-row-per-impression, from 1/20th the storage:

- *"How many times was this venue's card seen?"* → count the array entries mentioning it.
- *"What was its average position?"* → average those entries' positions.
- *"Seen-rate"* → impressions ÷ presence (presence shipped today, §0).
- *"Click-through"* → `VenueMetric::CardClicks` ÷ impressions.

The one thing an array makes harder is *"how many distinct people saw it"* — and we cannot
answer that anyway, by design, because we store no identifier. So the array costs us nothing we
were ever going to have.

**The daily rollup is where this gets paid off.** There is already a `venue_category_stats` /
`search_stats` rollup running at 03:10. Impressions get the same treatment: a nightly job
collapses the arrays into one row per venue per day. Reports read the rollup, not the raw
events. That is the shape that stays fast at 100,000 venues-days.

### 1.4 The decisions inside it

**a) Flush trigger.** Viewport-settle + `pagehide` (my recommendation), or a fixed 5s timer, or
only on `pagehide`. Settle-based gives near-real-time data with few requests; `pagehide`-only is
one request per session but loses everything if the tab crashes.

**b) Rate limit.** `/analytics/events` currently allows **30 requests/minute per IP**. That was
sized for a menu dwell timer. A batched impression endpoint at 30/min × 24 venues is 720
fabricated impressions per minute from one address. My recommendation: a separate, tighter
limiter for this event type, plus a hard cap of 24 entries per payload validated server-side.

**c) Do we also batch, or drop, the other four PostHog events?**
`venue_pin_focused`, `filter_applied`, `map_toggled` are UX curiosities, not owner reports. I'd
leave them in PostHog. `venue_card_clicked` already has a server-side twin and needs nothing.

**Answer 1: flush trigger — "settle + pagehide", "pagehide only", or "timer".**

Answer:

**Answer 2: tighter rate limit for impressions — "yes, separate limiter", or "30/min is fine".**

Answer:

**Answer 3: leave the other four in PostHog — "yes", or "move them too".**

Answer:

---

## 2. Three open questions from your A2 and A3 answers

### 2.1 Your API abuse worry — mostly already answered

> *"wait, so we gather events via API call to /analytics/events? Should it not happen in
> controller? … some people could abuse the API and clutter the data"*

It *is* a controller — `AnalyticsEventController`, a normal POST route inside the `web`
middleware group. It is not a public API in the sense you were worried about. Some events
genuinely have no server-side moment (nothing hits the server when a card scrolls into view),
so a beacon is the only option. What defends it today, all verified:

| Layer | What it does |
|---|---|
| CSRF token | Requires a token from a rendered page of ours. Blocks naive scripting outright |
| Throttle 30/min per IP | `AppServiceProvider:59` |
| Event allowlist | Only three event names accepted; anything else is a 422 |
| Venue must exist | And be `is_active`, and not a canary |
| `BotDetector` | Dropped at the write, before anything is stored |
| Duration clamped | 1–900 seconds, so a crafted payload cannot inflate dwell time |

So the realistic attack is a determined person with a real browser session doing 30 requests a
minute. That would show up as an obvious outlier, and **it is worth saying that the same is
true of Google Analytics and every other client-side analytics product in existence** — this is
not a weakness specific to us.

**The one real gap is the rate limit sizing for batched impressions** — question 2 in §1.4
above. Everything else here is fine.

**No answer needed beyond §1.4 question 2.**

### 2.2 Campaign parameters — yes, but they need one rule

> *"What about other params from sources? Like some 'campaigns', or tracking 'videos'? … or its
> too much complexity for v1?"*

**Not too much complexity — it's the same field parse, and `utm_campaign` is already part of the
UTM standard**, so you get it for free alongside `utm_source`, which shipped today. Practically
it's the difference between *"Instagram sent 200 people"* and *"the carousel about Lech Free
sent 180 of them and the Dry January one sent 20"* — which is the number that tells you what to
post next.

**But there is one real problem, and it's why I didn't just build it.** `utm_source` is safe
because it's matched against a closed allowlist — anything unrecognised becomes `other` and the
raw text is discarded. A campaign name has no allowlist by definition. That means
attacker-controlled free text going into a table we keep forever, and
`FreeTextScrubber` catches emails and phone numbers but not, say, a person's name.

Three ways to make it safe:

| Option | How | Cost |
|---|---|---|
| **A. Strict pattern** *(recommended)* | Accept `^[a-z0-9-]{1,40}$`, discard anything else | Free. You control your own links, so you always match it |
| **B. Registered campaigns** | A small table; unregistered names discarded | A few minutes per campaign, forever |
| **C. Hash it** | Store a hash, keep a private lookup | Same work as B with worse ergonomics |

Option A gets you 100% of the value at zero ongoing cost, and the pattern itself is the
guarantee — no name, email or sentence can survive `^[a-z0-9-]{1,40}$`.

**Answer: "pattern (A)", "registry (B)", or "skip campaigns for V1".**

Answer:

### 2.3 Should device and entry source be on *every* event, not just page views?

Today they land on `venue_viewed` and `discovery_viewed` — the two entry points. They are **not**
on searches, category views, or outbound clicks.

The argument for adding them everywhere: *"mobile visitors search differently"* becomes a
question you can answer, and no future writer can forget to include them.

The argument against, and it's why I stopped: putting them in `EventLogger` means **every** event
gets them, including `user_registered` and internal ones where they're meaningless. It also
reverses a tested design decision (`events.properties` is `NULL` when empty, deliberately, to
keep rows small). Reversing a tested decision without you seeing it first is exactly what I
should not do quietly.

**What I'd do:** add them to `discovery_searched` only — that is the one place where the
question is genuinely interesting — and leave the rest alone.

**Answer: "searches too", "every event", or "leave it as is".**

Answer:

---

## 3. SEO — the section where one finding changes your plan

### 3.1 B1 · Brand and product pages: you said "before launch". The blocker is not code.

You answered **before launch** and I agree. Three things I found that change the shape of it:

1. **`products` already has a `slug` column.** Product pages need routes, views and sitemap
   entries. No migration.
2. **`brands` has no slug column.** Brand pages need a migration first. Small, but it's there.
3. **The catalogue is 12 products, 12 brands, 0 producers — exactly one product per brand.**

That third one is the real issue. B1 as specified ships **24 pages, each thin, each brand page
listing exactly one drink** — and brand page ≈ product page when a brand has one product, so
they're near-duplicates competing with each other. On a brand-new domain with no authority, that
is the pattern Google ignores or soft-404s.

And the decision record's own argument is *"real demand for non-alcoholic beer"*. The demand is
for **Heineken 0.0, Lech Free, Żywiec 0.0, Warka 0.0, Perła Chmielowa 0.0, Karmi, Birell.**
We have Heineken, Lubelski Browar, Paulaner, Carlsberg. Four beer brands.

**So: build the routes and views before launch — agreed — but the launch-blocking work is
seeding the catalogue**, and it's the same species of manual work as the 30 venues. My estimate:
**40–60 products** across the NA beers, spirits and tonics actually sold in Poland.

**One structural suggestion**, mirroring logic already in the codebase: **product pages for
everything; brand pages only where a brand has ≥2 products.** Same threshold pattern as
`min_venues_for_indexable_district`, dissolves the duplicate problem, grows automatically as the
catalogue fills.

**Answer 1: catalogue target before launch — "40–60 products", another number, or "ship with 12".**

Answer:

**Answer 2: brand pages gated at ≥2 products — "yes", or "every brand gets one".**

Answer:

### 3.2 B2 · Dry January — you were right, and here's why

> *"didn't we decide dry January page is permanent? Let google index it right away? Or it's
> pointless?"*

**Not pointless — your instinct is right, and the reasoning generalises.** Seasonal pages accrue
authority across years. A page created in December ranks in its first January with zero history,
zero links and zero crawl record. A page created in September has four months of age and internal
links before the query volume arrives. Same URL forever, content refreshed annually, **never
deleted and recreated** — a new URL each year throws the accumulated authority away.

**One condition.** It cannot be a stub for four months. Google forms its quality assessment on
what it first crawls, and a thin page that got indexed thin stays judged that way even after you
fill it in. So build it as a real page now — what Dry January is, why people do it, the venues,
the drinks — or don't build it yet.

**Answer: "build it properly now", or "November".**

Answer:

### 3.3 B3 · og:image — SVG will not work, but your instinct survives

**The correction first: SVG is rejected as `og:image` by Facebook, X, LinkedIn, Slack, WhatsApp
and Discord.** It must be PNG or JPEG, 1200×630. So the SVG plan fails as stated.

**But your actual instinct — generate rather than photograph, to dodge the copyright question —
is exactly right, and it survives intact:**

- **GD is installed** (verified: `php -m` shows `gd`, no imagick). We can render PNGs
  server-side with **zero new dependencies**, which matters under your no-new-spend rule.
- One catch: only `.woff2` fonts are in the repo, and GD needs TTF/OTF. Poppins is OFL-licensed,
  so the TTF (including latin-ext for `ł ą ż ś`) is free and legal to bundle.

**On how beneficial — the v5 argument was the weak one, and I should correct it.** Instagram
**does not render link previews** in posts or captions; your link is in bio or a story sticker,
where og:image barely shows. Where it genuinely pays off:

- **WhatsApp and Messenger** — the *"zobacz to miejsce"* peer share, which in Poland is how a
  discovery site actually spreads
- Slack, X, LinkedIn, Discord
- Google Discover eligibility

So build it — but for peer-to-peer sharing, not for Instagram.

**What I'd do:** one branded fallback PNG covering every page, **about an hour**. Per-venue
generated images with the venue name and drink count as a second pass after launch, cached to
disk.

**Answer: "fallback PNG now, per-venue later", "both now", or "skip for launch".**

Answer:

### 3.4 B3 · Google Search Console and Bing — what they actually are

> *"What are google search console and bing verification tokens?"*

**Google Search Console** is Google's free product for site owners. It is the only place you can
see **which queries you actually rank for**, at what position, with what click-through — which is
exactly the data `brand-and-product-pages.md` says should decide which products earn photographs
later. It also tells you when Google *can't* index something, which on a new site is the
difference between "slowly ranking" and "silently broken for three months". Verification is just
Google proving you own the domain before showing you that.

**Recommendation: use the DNS TXT method and create a Domain property**, not the meta tag. DNS
verifies http *and* https, www *and* non-www, and every subdomain at once. The meta tag verifies
one origin only, so a missed variant stays invisible to you. Leave the TXT record in place
forever — Google re-checks it.

**Bing: don't verify separately.** Bing Webmaster Tools **imports from Search Console in one
click**, ownership and sitemaps included. Worth doing for a newer reason than market share:
**ChatGPT and Copilot read Bing's index**, so this is an AI-visibility question now. And
**IndexNow** (Bing, Yandex, Seznam — Google doesn't participate) pings the index the moment a
page changes, turning a new venue into minutes rather than weeks on that half of the web.

**This is blocked on one thing I don't know:**

**Answer: is the domain registered, and where is its DNS? (It gates GSC verification *and*
hosting.)**

Answer:

### 3.5 Your noindex worry — you're half right, and the self-healing already exists

> *"If we publish a page with 2 venues, it has noindex, google sees it and 'remembers' it as a
> no follow, it will stay like that untill a new indexing is undertaken by Google crawlers?"*

Four things, in order:

1. **`noindex, follow` is not `nofollow`.** Links on the page are followed today; equity flows
   through the cluster, exactly as `empty-landing-pages-noindex.md` intended.
2. **But your instinct is right on a longer horizon.** Google has said a page left `noindex`
   indefinitely gets crawled less and less, and its links eventually get treated as effectively
   nofollow. So `noindex, follow` is a *temporary* state that decays if it's permanent.
3. **The flip is already automatic and you don't need to do anything.** The sitemap is generated
   live (`SitemapController@index`) and a district enters it the instant it crosses 3 venues —
   the same threshold the view checks. Tag flips and sitemap gains the URL in the same moment,
   with no deploy, and the sitemap *is* the recrawl signal. That part is well built.
4. **Recrawl lag after the flip:** days to a few weeks on a new domain, given it's in the sitemap.

**Here is the number that should worry you more.** With the current 67 generated venues, **11 of
18 districts pass the threshold.** After the wipe and the 30 real venues, real NA venues cluster
hard in Śródmieście, Mokotów and Praga — I'd expect **3–5 indexable districts and 13+ noindexed
on day one.** The district layer is mostly dark at launch regardless of the tag. That's an
independent argument for B1 carrying the early SEO load, which is what you already decided.

**And there's a cleaner option worth deciding on.** Instead of serving a thin district page with
`noindex`, **don't publish it below threshold at all** — redirect to the city page filtered to
that district. No thin URL to crawl, no `noindex` to decay, no flip to wait for. The URL starts
existing the day it deserves to, and gets indexed from a clean slate with no prior "this was
thin" judgement attached. Cost: the URL redirects for a while, which is free — nothing links to
it yet.

This reverses part of an existing decision, so it needs your call.

**Answer: "keep noindex as is", or "redirect thin districts until they qualify".**

Answer:

---

## 4. Stability — your C1 to C4 questions, answered

### 4.1 Scheduler — exactly what you need

> *"Scheduler, let us work on it, what exactly would we need?"*

**One cron line on the production host:**

```
* * * * * cd /var/www/undernoinfluence && php artisan schedule:run >> /dev/null 2>&1
```

That's the whole thing. Laravel runs it every minute and decides internally what's due.
`routes/console.php` is already correct and needs no change.

**The part worth actually designing is knowing when it stops**, because a dead scheduler is
silent and the freshness badge is the product's central claim. Under your no-recurring-spend
rule, the cheapest honest answer isn't an uptime service: the scheduler writes a timestamp on
each run, and the admin dashboard shows *"ostatni przebieg: 4 min temu"*, in red past an hour.
Zero cost, zero dependency, visible where you already look daily.

**Answer: "cron + dashboard heartbeat", or "cron only for now".**

Answer:

### 4.2 `check-offer-freshness` — you asked, and there's an inconsistency

> *"want check-offer-freshness supposed to be daily?"*

The command's own description says **"Runs hourly."** The schedule says **`->daily()`**. They
disagree, and one of them is wrong.

It should be **hourly**. It repairs `offer_updated_at` drift caused by observers being bypassed —
**and the xlsx import bypasses observers**. So during a seeding session, daily means up to 24
hours of wrong freshness badges on live pages. It's three queries.

**Answer: "hourly", or "daily and fix the description".**

Answer:

### 4.3 Queue worker — what it's for, and whether you need it

> *"Queue worker, is that needed? What is that for?"*

A queue defers slow work out of the visitor's request, so a page doesn't hang while an email
sends. Right now the app has exactly **four** queued things — `ClaimApproved`, `ClaimRejected`,
`VenueErasureCompleted`, `VenueErasureRejected` — **all owner-panel, all dark behind the 404.**

So in V1 as it stands, **the queue has literally nothing to do.** It becomes needed only because
of C2, the report notification you approved. Which gives you a real choice:

| Option | Cost |
|---|---|
| `QUEUE_CONNECTION=sync` | No supervisor, one less process. But if SMTP is slow the visitor waits, and **if SMTP is down the report submission errors and the report is lost** |
| Keep `database` + supervisor | One more process to run and watch |

I'd keep the worker, for one reason: losing a report because SMTP hiccupped is the exact failure
C2 exists to prevent. But it's a genuine judgement call.

**Answer: "keep the worker", or "sync for V1".**

Answer:

### 4.4 Backups — the shape, so the session you asked for is short

> *"here we need a session for it, I want to educate myself more … maybe some laws/documents
> require it on a cycle?"*

**The legal answer.** No law prescribes a frequency or a retention count. GDPR **Art. 32(1)(b)–(c)**
requires ongoing availability and the ability to restore access to personal data in a timely
manner after an incident. The part everyone skips is **Art. 32(1)(d): a process for regularly
testing that the restore works** — that is the enforceable obligation, and "we have backups"
without a tested restore does not satisfy it. Polish tax law's 5-year rule applies to invoices and
accounting records, **not** to this database — that becomes your accounting software's problem
when you start selling, not the app's.

**The practical shape, no contracts:** nightly `pg_dump` → gzip → encrypt → push to EU-resident
object storage, pay-as-you-go. Retain 7 daily + 4 weekly. **One documented restore drill before
launch, one per quarter after.** That's a paragraph in the ROPA and it satisfies 32(1)(d).

**Separate the urgent half from the session.** What actually blocks you today is that you can't
wipe the 67 generated venues without an undo. That's not compliance, it's "can't reverse a
mistake" — and **a single manual `pg_dump` to your own machine solves it in five minutes** and
unblocks the import.

**Answer: "do the manual dump now, policy in its own session" (recommended), or "wait for the
full session".**

Answer:

### 4.5 C2 · SMTP — one decision rides along

You said **notification + SMTP before launch** and I have no argument. One thing needs deciding
with it: **which SMTP.** Self-hosting mail on a fresh VPS IP means deliverability problems from
day one — a brand-new IP with no reputation lands in spam. Use a transactional provider with an
EU-resident, pay-as-you-go tier.

**Answer: "pick an EU transactional provider" (recommended — I'll research options), or "self-host
on the box".**

Answer:

### 4.6 C3 · UpCloud and "prices exclude any applicable local taxes"

> *"I see right now in upcloud info 'Prices exclude any applicable local taxes.'"*

**This shouldn't slow the hosting decision at all.** UpCloud is a **Finnish** company. For a
Polish business buying cross-border services this is **reverse charge** (art. 28b): with a valid
VAT-UE number in your billing details, **UpCloud invoices you net, 0%.** Then two branches:

- **If you are a VAT payer:** you self-account 23% output VAT and deduct the same 23% as input
  VAT. Net effect zero. **The list price is the price.**
- **If you are not a VAT payer** (below the 200k PLN threshold): you must still register for
  VAT-UE on **VAT-R** (registration only — it does not make you a VAT payer), file **VAT-9M**, and
  pay 23% you **cannot deduct.** Your real cost is **list × 1.23**.

Which branch you're in is the only thing that matters, and **it is identical for Hetzner,
Scaleway or any other non-Polish provider** — so it is not an argument against UpCloud. It's an
accounting question, not a hosting one. Budget with ×1.23 until you know.

**Answer: are you VAT-registered? And: confirm UpCloud, or name the alternative.**

Answer:

### 4.7 C4 · Access logs — I'd nudge you from 14 days to 30

You said 14 days, 90% sure, and asked for more research. Done.

**The legal side is solid and boring.** No law sets a number. The basis is Art. 6(1)(f), and
**Recital 49 explicitly names network and information security as a legitimate interest** — about
as clean as legitimate interest gets. As for length: **CNIL's guidance on traceability data
recommends up to 6–12 months as an outer bound.** Fourteen days is far inside what any DPA would
question. **There is zero compliance risk in being short.**

**The risk of 14 days is operational, and it's real.** GDPR Art. 33 gives you **72 hours from
becoming aware** of a breach to notify. Breaches are typically discovered weeks after they happen.
If you find something on day 20 with 14-day logs, you cannot reconstruct what happened — and
*"we cannot determine the scope"* is a materially worse position in front of UODO than a slightly
longer retention would have been.

So I'd revise my own v5 recommendation: **30 days.** Still trivially defensible under storage
limitation, still far below any ceiling, costs a few hundred megabytes, and it survives the
"found out two weeks later" case that 14 days does not.

Whatever the number: **enforced by logrotate config** (an unenforced retention is worse than a
long one), written into the ROPA, and stated in the privacy policy.

**Answer: "30 days", "14 days as decided", or another number.**

Answer:

---

## 5. Your two closing questions from v5

### 5.1 Adding venues from your phone

> *"I want to be able to add new venues, products, brands from my phone … Is it phone friendly?"*

**Technically yes.** Filament v5 is responsive out of the box — sidebar collapses to a hamburger,
form sections stack to one column, tables scroll horizontally. It works on a phone.

**Practically, no.** The venue form is **33 fields across 6 sections**, and `Współrzędne` is
`latitude` and `longitude` as **raw text inputs**. Typing decimal coordinates into a text box
while standing on a street is roughly the worst mobile data-entry task that exists.

What you'd actually want, standing in a bar: name, address, three drinks. That's a five-field task
trapped inside a 33-field form.

**My suggestion, and I think this one earns its own decision record: a "Szybkie dodanie" page in
the admin panel.** One screen, five fields, a **geolocation button that fills lat/lng from the
phone's GPS** instead of you typing them, and a drink picker from the existing catalogue.
Everything else gets filled in later from a desk. **Roughly half a day.**

That turns seeding from a desk task into a walking-around task — plausibly the difference between
30 venues and 100. And it compounds with §3.1, because the product catalogue needs the same kind
of growth.

Two one-liners while we're there: `->spa()` on the panel makes phone navigation feel native, and
Filament panels work as an add-to-home-screen PWA with a manifest (polish, not needed).

**Answer: "build the quick-add page", "later", or "the full form is fine".**

Answer:

### 5.2 The Warsaw alcohol permits register you linked

Good find, and potentially a significant one. **I have to flag that the domain doesn't resolve
from my sandbox**, so I could not open it — everything below is from the URL shape and the
surrounding BIP documentation, not from the data itself.

- It's the **City of Warsaw's alcohol-sales permit register**, published through BIP. The
  `wn_wr_id=7` and `str=10` parameters suggest per-district filtering with pagination, likely
  name + address per licensed point.
- **The licensing story is much better than OSM's.** This is Polish public-sector information
  under the *ustawa o otwartych danych i ponownym wykorzystywaniu informacji sektora publicznego*
  — generally re-usable, often with an attribution condition, and **crucially not ODbL.** No
  share-alike, so none of the contamination that made you drop OSM. That difference alone makes
  it worth a proper look.
- **But it's a candidate list, not a seed list.** A permit register tells you a venue exists and
  sells alcohol. It says nothing about NA offerings, and it will be full of `sklep monopolowy`
  entries that aren't venues. The signal for UNI is *negative-qualifying*: a place with an
  on-premise permit is a bar, i.e. exactly where "does it have decent NA options?" is worth
  answering. It gives you name + address for essentially every licensed venue in Warsaw, which
  turns discovery into filtering — and filtering is much cheaper.

**Answer: "pull it and assess it properly next session", or "park it".**

Answer:

---

## 6. New findings from today's implementation — three need you

These came out of actually building things today. None was known when v5 was written.

### 6.1 Your own venue views count as real views in the reports

Nothing distinguishes you browsing your own venue pages from a visitor doing it. `BotDetector`
filters crawlers, not you. Every time you check a profile from the admin panel, that venue gets a
`Views` increment and a `venue_viewed` row.

**Why it matters now rather than later:** you are about to seed 30 venues and check each one.
That's 30+ views on 30 venues, in a database that currently has 681 events total. The first
report anyone sees would be substantially your own browsing — the same class of failure as §7's
seeding trap, from a different direction.

**What I'd do:** exclude requests carrying a logged-in admin session from analytics writes. Small,
and it has to land *before* the seeding session to be worth anything.

**Answer: "exclude admin traffic", or "leave it and filter later".**

Answer:

### 6.2 Dead code that would crash if anyone used it

`resources/views/venues/_category-card.blade.php` is not included anywhere, and it calls
`mb_strtolower($product->brand)` against what is now a `BelongsTo` relation returning a `Brand`
model — so it would throw the moment someone rendered it. The live page
(`venues/show.blade.php:338`) uses `$product->brand?->name` correctly.

I didn't delete it, because you didn't ask. It should go.

**Answer: "delete it", or "leave it".**

Answer:

### 6.3 The presence gap on "load more"

Documented in today's commit but worth your awareness. `commitSearch` fires once when typing
settles, at which point 24 cards are rendered. If a visitor then clicks "Pokaż kolejne lokale",
those extra venues became present but the search event already fired — so they count as *matched*
and not as *present*.

At the current catalogue size almost no search reaches 24 results, so this is near-zero data loss
today. It becomes real as the catalogue grows. Closing it means a second event whose shape isn't
settled, which is why I left it.

**No answer needed — flagged so it isn't a surprise later.**

---

## 7. Unchanged and still the most urgent thing before the import

`VenueAnalyticsReportService:545` counts distinct venues that added a product in 30 days. It
cannot distinguish *"eight venues adopted Lech Free"* from *"Paweł added Lech Free to eight venues
on a Tuesday"*. You have 30 real venues waiting to be imported.

**This must be guarded before the import, not after.** Otherwise the first trend report shown to
anyone describes a seeding session as Warsaw demand — and that discredits the methodology, not
the number.

**No answer needed.** It sits ahead of the import in the queue, and §6.1 now sits next to it.

---

## 8. Small items, no decision needed

- **Canaries:** 2 is low, you're right. They're already excluded from the report path, so they
  cost nothing analytically. I'd go to 5–8, deliberately spread across districts and categories so
  a scraper can't pattern-match them by clustering.
- **Your consent bug — root cause found.** `consent.js` wrote the cookie with `Secure`
  unconditionally. `APP_URL` is `http://100.71.247.39:8000` — plain HTTP. **Browsers silently
  discard `Secure` cookies over HTTP**, so the decision was never stored and the banner returned
  on every page load. It would have worked in production over HTTPS, but the fix is one line and
  it makes local mobile testing tell the truth. **Fixed and committed today**, with a check that
  fails if anyone puts the unconditional flag back.
- **Import bypassing observers:** `uni:check-offer-freshness` is a *repair*, not a fix. The fix is
  the importer touching `offer_updated_at` itself. Repair-plus-hourly is fine for V1 — just don't
  mistake it for the fix.
- **`regulamin` review last:** agreed with your sequencing. Everything gets built first, then the
  regulamin gets reviewed against what actually exists.

---

## 9. What I'd do with the next three sessions

Reordered from v5 given today's findings.

1. **The seeding session's guards, then the import.** §7's trend guard and §6.1's admin
   exclusion, then the manual `pg_dump` (§4.4), then wipe and import the 30 real venues.
   Everything here is irreversible-if-skipped and none of it depends on hosting.
2. **The SEO surface, in one pass.** Product pages, brand pages, `/faq`, glossary, `/kontakt`,
   `/suchy-styczen`, the fallback og:image — **and the 40–60 product catalogue, which is the
   long pole, not the code.**
3. **Impressions and the deploy.** The batching decisions from §1, the report notification and
   SMTP, the scheduler cron, then hosting.

The **quick-add page (§5.1)** is the one item I'd consider pulling forward into session 1,
because it changes how fast every subsequent seeding session goes — both venues and products.

---

*Answers can be one word. Anything answered here becomes a decision record and is acted on in the
session it belongs to.*
