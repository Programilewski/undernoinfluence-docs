---
version: 8.0
owner: Paweł Milewski
updated: 2026-09-04
status: living
---

# Decisions waiting on you — v8

You answered v7 and raised eleven new things. **Ten are product questions and are below. One is not a product question at all** — your instinct about product images and Polish alcohol advertising law — **and it turned out to be the most consequential thing in this document.** It is §3, it carries personal criminal liability, and there is pending legislation aimed squarely at it. Read that one first if you read nothing else.

**Everything below is verified against running code on 04.09 or sourced in §19.** 557 tests green — no code was written this session, as instructed.

**Revised after your feedback on the first draft.** §3 was under-called: I rated text-only brand names "very low risk" before reading the enforcement authority's own guidance, which says the opposite. §14, §15 and §17 — findings of my own, the launch question, and the forward plan — were missing entirely from the first draft and are the reason it read as a set of answers rather than a working document.

> **Filter unchanged:** does it block the deploy, does it change what Google sees, is it data we cannot recreate later, is it a number somebody will be asked to pay for, can you keep it running yourself. **v8 adds one: could it get you fined.**

---

## 0. Settled on v7 — recorded, no discussion needed

| § | Decision |
|---|---|
| 0.1 | Internal-traffic exclusion covers **admin + owner**. No separate non-billed counter in V1 |
| 2.3 | Campaign registry: **discard unregistered values**, bucket to `other` |
| 3.4 | Device / entry source: **all of §3.4** — 7 events gain both, 4 gain device, 13 gain nothing |
| 4.1 | **Producers stay internal.** Reasoning to be written into a decision record — see §14 |
| 4.6 | og:image: **fallback PNG now, per-venue later** (your "nie" read correctly as "now") |
| 5.1 | Scheduler: **cron + dashboard heartbeat** |
| 5.3 | **Keep the queue worker**, with `queue:restart` in a deploy checklist |
| 7 | Access logs **30 days**, enforced by logrotate, with the reasoning recorded per check |
| 9 | **Pull the permit register** into a candidates table next session |
| 1.3 | Move the two discovery click events server-side, **rename them**, keep `filter_applied` and `map_toggled` in PostHog |

Everything in that table goes into decision records and then into code, in the session it belongs to. Nothing there needs another word from you.

---

## 1. The event audit you asked for — and it found three bugs

> *"I want the audit of the events. Two separate ones actually, but they intertwine. One for posthog, one for B2B analytics. Verify the name and the action/the trigger and see if these make sense... few sessions ago I told you about reducing complexity and mental load in that domain."*

### 1.1 Your IP question first, because it is short

> *"do we blacklist any other IP besides ours when gathering events in POST /analytics/events?"*

**We blacklist no IP addresses at all, including our own. There is no IP blacklist anywhere in the system, and there cannot be one.**

The reason is structural rather than an oversight: `no-identifier-based-deduplication.md` forbids storing anything about a request, and **an IP address is personal data under GDPR**. A blacklist would require holding IPs to compare against, which is the exact thing the architecture rules out.

What actually exists at that endpoint, all verified:

| Layer | Mechanism | Keyed on |
|---|---|---|
| CSRF token | Requires a token from a page we rendered | — |
| Rate limit | 30/min (`AppServiceProvider:59`) | Authenticated user id, **falling back to IP** |
| Event allowlist | Three event names; anything else 422 | — |
| Venue must exist | Active, non-canary | — |
| `BotDetector` | User-agent substrings, dropped at the write | User agent |
| `InternalTraffic` (approved, not built) | Authenticated role | Session |
| Duration clamp | 1–900 seconds | — |

**The rate limiter uses the IP as a key, which is different from storing it.** Laravel hashes it into a cache key that expires in a minute; nothing is written to a table and nothing is retained. That distinction is worth keeping straight because it is the one an auditor will ask about.

**So the answer is: our own traffic is excluded by role, bots by user agent, and abuse by rate limit — none of it by address.**

### 1.2 The two catalogues, and why they overlap

You are right that they intertwine, and the overlap is deliberate — `analytics-split-posthog-and-events.md` says each event goes to **exactly one** of the two, never both, because sending from both ends counted anonymous visitors twice under two identities.

| | **PostHog** | **Our `events` table** |
|---|---|---|
| Written from | The browser | The server |
| Holds an identifier? | Yes — a PostHog distinct id | **No, by design** |
| Purpose | Product questions **you** ask | Numbers **an owner pays for** |
| Retention | PostHog's | Forever |
| Question it answers | "Do mobile users prefer the map?" | "How many people saw this venue?" |

**The mental-load rule that follows from that, and I think this is the thing you were reaching for:** a reader should be able to tell *which system an event lives in* from its name alone, without looking it up. Right now they cannot, because the two catalogues use the same naming style and three names are actively wrong.

### 1.3 Audit A — PostHog. Five events, two wrong

| Event | Fires where | What the user did | Name accurate? |
|---|---|---|---|
| `map_toggled` | `discovery.js:100,108` | Tapped the mobile list/map toggle | ✅ |
| `filter_applied` | `discovery.js:526` | Changed a filter chip | ✅ |
| `venue_card_impressed` | `discovery.js:534` | A card crossed 50% viewport for 500 ms | ✅ |
| `venue_card_clicked` | `discovery.js:180` | **Clicked a pin on the map** | ❌ **wrong** |
| `venue_pin_focused` | `discovery.js:446` | **Clicked a card in the list** | ❌ **wrong** |

The two are exactly swapped. `venue_pin_focused` was named after its *consequence* (the map pin gains focus) rather than its *action* (a card was clicked), and `venue_card_clicked` was named after the thing it opens rather than the thing that was clicked.

**Your rule is the right one and I would adopt it verbatim:** *"if it happens on map, it's on map; if on venue tile, it's tile."* Name the surface that was touched.

**Plus one you have not seen:** `venue_navigate_clicked` fires from `venue-tile.blade.php:151` via `window.__capture?.()`. It is a **sixth** PostHog event, undocumented in the split, and it is implicated in a bug below.

### 1.4 Audit B — our own events. 29 types, and the report queries a ghost

29 types write to the `events` table. Twenty-six are accurately named. Three findings:

**Finding 1 — `venue_navigate_clicked` is queried but never written.** `VenueAnalyticsReportService:666` filters the peak-hour analysis on:

```sql
AND type IN ('venue_directions_clicked', 'venue_navigate_clicked',
             'venue_website_clicked', 'venue_instagram_clicked')
```

`venue_navigate_clicked` **is never written to the events table.** It is a browser-only PostHog event. The condition matches nothing, forever — a legacy name left in an OR list.

**Finding 2 — the same line silently drops every maps click.** `venue_maps_clicked` **is** written to the table (`VenueAnalytics::OUTBOUND_EVENTS`) and **is missing** from that list. So the peak-hour chart in a paid report excludes an entire outbound click type.

**Finding 3 — and this is the one that explains both.** The day-of-week query **immediately above it** builds its filter from the enum:

```php
[...VenueMetric::inGroup(VenueMetricGroup::Navigation),
 ...VenueMetric::inGroup(VenueMetricGroup::Outbound)]
```

That one stays correct automatically. The hour-of-day query hardcodes four string literals. **So the two halves of the same report disagree about what a click is** — one counts maps, the other does not; one is a ghost-free list, the other is not.

**This is precisely the complexity you asked to reduce.** The fix is not to correct the literals — it is to delete them and derive the event names from the enum, the way the sibling query already does. Then a new outbound type is one enum case and nothing else, which is the same design `VenueMetric` was long-form for in the first place.

### 1.5 The renames I would make

| Now | Becomes | Why |
|---|---|---|
| `venue_card_clicked` (PostHog) | **`map_pin_clicked`** | Names the surface touched, per your rule |
| `venue_pin_focused` (PostHog) | **`venue_card_clicked`** | Frees the accurate name for the accurate action |
| `venue_navigate_clicked` (PostHog) | **`venue_directions_clicked`** | Matches its server-side twin — it *is* the directions click, under a different name |

**The middle row needs care in sequencing.** `venue_card_clicked` would mean the map pin until the rename and the list card after it, so PostHog history straddles the change. At the current volume that is an acceptable one-time break; at any real volume it would not be. **Do it now, before launch, or never.**

### 1.6 The rule worth writing down

> **An event name states the surface and the action, in that order, in the past tense.** `map_pin_clicked`, `venue_card_clicked`, `discovery_searched`. Never the consequence (`..._focused`), never the destination (`..._navigate_...`).
>
> **Every event lives in exactly one system, and where a fact exists on both sides, the server-side name is canonical and the browser-side one matches it.**

**Answer: adopt the three renames and the naming rule — "yes", or "yes but keep `venue_navigate_clicked`".**

Answer:

---

## 2. UTM abuse and your bookmark problem — both real, and one of them has no clean fix

> *"Do we fight any abuse from malicious users when it comes to query parameters, but most importantly utm? Like could someone abuse the utm_source=instagram and spam it? ... what if someone adds a bookmark with utm ... Are such issues handled by other companies, or it's a risk known, accepted and accounted for?"*

Two separate problems. You have correctly identified the second one, which is the harder of the two and the one the industry mostly does not solve.

### 2.1 Deliberate abuse — cheap to do, hard to profit from, and we have a partial defence

**Yes, anyone can visit `undernoinfluence.pl/?utm_source=instagram` as many times as the rate limiter allows.** There is no way to prevent it — the parameter is read from a URL a stranger controls, which is what makes UTM work at all.

What contains it today:

- The **closed allowlist** means the damage ceiling is low. They can inflate one of eight buckets. They cannot inject text, and after §2.3 of v7 they cannot inject a campaign name either.
- **`BotDetector`** drops anything that does not look like a browser, so automating it needs a real browser session.
- The **30/min rate limit** caps volume from one key.
- **`discovery_viewed` and `venue_viewed` are page views**, so inflating them means actually loading pages — visible as an obvious outlier in a table of a few hundred rows a day.

**The honest framing: this is not a security problem, it is a data-quality problem, and it is universal.** Google Analytics, Plausible, Fathom and Matomo all have exactly this hole, for exactly the same reason. Nobody solves it because the fix — identifying visitors — costs more than the problem.

**The one thing worth adding, and it is nearly free:** an outlier check in the daily rollup. If one entry source jumps more than, say, 10× its trailing 7-day average, flag it on the admin dashboard. That does not prevent anything, but it means you find out in a day instead of in a quarterly report.

### 2.2 The bookmark problem — you have found the real one

Your example is exact: someone bookmarks `?utm_campaign=top-hot-0-wine` in January and opens it every week until August. Every one of those visits reports the January campaign.

**And it is worse than the bookmark case, because the same mechanism has three other doors:**

| Route | How it happens |
|---|---|
| **Bookmark** | Your case. Persists indefinitely |
| **Share** | Someone copies the URL from their address bar and sends it to a friend — the friend arrives tagged with a campaign they never saw |
| **Browser autocomplete** | The tagged URL becomes the address-bar suggestion for "undernoinfluence", so *typing the domain* replays the campaign |
| **Someone else's site links the tagged URL** | Now it is a permanent inbound link attributing organic referral traffic to a campaign |

**Autocomplete is the sneakiest**, because the visitor believes they typed the domain directly, and so would you.

### 2.3 What everyone else actually does — and the answer is "accepts it, partially"

Researched, and the finding is unglamorous. **The industry does not solve this. It bounds it with a timeout.**

Google Analytics does not attribute a tagged visit forever; it holds the campaign for a **session**, and then for a **campaign timeout window** (six months by default) during which a returning visitor can still be credited to it. That window is a bound on the damage, not a fix — inside it, your August visit still says January.

The deeper industry answer is the opposite of what we can do: **persistent attribution**, capturing the source on first visit and tying it to a *visitor identity* across sessions. That requires the identifier we have refused to store, so it is not available to us and I would not want it to be.

**So: known, accepted, bounded. Not solved.**

### 2.4 What I would do — and our architecture makes one option unusually clean

Because we store **no identifier at all**, we already avoid the worst version of this. We never claim "this person came from Instagram and converted three weeks later" — we only ever say "this page view arrived carrying an Instagram tag". **The claim is narrower, so the error is narrower.** That is worth saying out loud in the methodology, because it is a genuine advantage of the privacy architecture and it turns a weakness into a scoping statement.

Three cheap mitigations, in order of value:

1. **Strip the UTM parameters from the URL after reading them**, with a `history.replaceState` on the first paint. The server has already read them; the address bar then shows the clean URL. **This kills the bookmark, the share and the autocomplete routes in one line** — the visitor never has a tagged URL to save, copy or have suggested back to them. It does not touch the inbound-link route.
2. **Give every campaign an end date in the registry** (§2 of v7). After it, tagged hits bucket to `other` rather than to the campaign. Your January carousel stops accruing August credit **by definition**, which is the closest thing to a real fix available to us.
3. **Report campaigns as a time series, never as a lifetime total.** "180 wejść w styczniu" is defensible. "180 wejść z kampanii Lech Free" is the sentence that goes wrong in August.

Number 1 is the highest-leverage thing in this section and it is genuinely one line of JavaScript.

**Answer: "strip params + campaign end dates + time-series reporting" (recommended), or a subset.**

Answer:

---

## 3. Removed

*Removed 07.09.2026 — the alcohol-law analysis was taken out of the repository by decision.*

## 4. Brand pages — the model you asked for

> *"I want some model written somewhere to which we can refer to. I want to know what sections are in the brand page... The products higher than the venues. Also the venues need to be sorted by breadth... I already hear b2b owners complaining 'why in brand X is sorting like that? I do not appear there!'... if a brand exists with no product, I feel like it's not supposed to have a public page... We need proper, thorough research here."*

### 4.1 What the research says about why brand pages fail

The failure mode is documented and it is exactly the one we were circling. Google's own John Mueller, on category pages:

> *"When the ecommerce category pages don't have any other content at all, other than links to the products, then it's really hard for us to rank those pages."*

**A list of links is not content.** The guidance across sources converges on the same shape: **200–400 words of unique description**, a short answer to the page's core question near the top, an FAQ block, and something no competitor's version of the page has.

**That last one is where we win and it is worth being explicit about it.** Every other page about Lech Free on the Polish internet is a product description. **Only we can say where to drink it.** That is the differentiator, and it is why the venue list belongs on the page even though you are right that products come first.

### 4.2 The model — sections in order

Proposed as a spec you can hold me to. `/marka/{slug}`:

| # | Section | Content | Why it is there |
|---|---|---|---|
| 1 | **H1 + one-line answer** | "Lech Free — piwa bezalkoholowe. Dostępne w 14 lokalach w Warszawie." | The 30–60 word answer directly under the H1 that the research calls for. Also the meta description |
| 2 | **Brand description** | 200–400 words: what the brand is, country, what it makes, what to expect. Unique prose, not scraped | The single biggest anti-thin-content lever |
| 3 | **Products** — *above venues, as you asked* | Every product of this brand, as cards, with category, ABV and its `abv_status` | The brand's own substance. And it is what somebody searching the brand name wants first |
| 4 | **Where to drink it** | Venues serving any product of this brand, default-sorted by **breadth**, filterable | The part nobody else has. §4.3 covers the sorting complaint |
| 5 | **Related brands** | Same category, or same "if you like this" | Internal linking, and it keeps a visitor moving through the cluster |
| 6 | **FAQ** | "Czy Lech Free zawiera alkohol?", "Ile ma kalorii?", "Czy jest bezglutenowe?" | Research-recommended, and it is what the query volume actually looks like |

**Deliberately not on the page:** the producer (§4.1 of v7 — internal only), and any brand-supplied imagery until §3 is resolved.

### 4.3 The sorting complaint you predicted — you are right, and there is a clean answer

> *"I already hear b2b owners complaining 'why in brand X is sorting like that? I do not appear there!'"*

**This will happen, and it will happen on the day you first take money.** But notice what the complaint actually is — it is not "your sort is wrong", it is **"I cannot see why I am below them"**. Those need different fixes.

Three things together defuse it, and none of them is "let owners pay for position":

1. **Default sort by breadth, stated on the page in one line.** *"Sortowane według liczby pozycji bez alkoholu w ofercie."* An owner who can read the rule can act on it. `credibility-formula-opacity.md` deliberately hides *weights*; this is not a weight, it is a single visible count, so there is nothing to protect by hiding it.
2. **Offer the alternative sorts you already have** — nearest, freshest. An owner who is fourth by breadth is often first by proximity to the person searching, and "you are top of the map view for people in Mokotów" is a real answer to give.
3. **Never sell position, and say so.** The moment ranking is purchasable, every number in the report becomes suspect, and the trend block in §13 stops meaning anything. This should be a decision record in its own right — it is the kind of thing that gets quietly eroded later under revenue pressure.

**The filter question you raised: yes, but few.** Category, district, and "sprawdzona karta" only. A brand page with a full filter rail becomes a second discovery page competing with `/mapa` for the same query.

### 4.4 A brand with no products — you are right, no page

> *"if a brand exists with no product, I feel like it's not supposed to have a public page. We can't in that case show the products nor the venues serving the products/brand. So no page at all I'd say?"*

**Agreed, and your reasoning is exactly right.** Sections 3 and 4 are both empty, section 2 is the only content, and that is the definition of a thin page. But **404 is the wrong mechanism** — `empty-landing-pages-noindex.md` settled that for cities and districts and the same logic applies: the URL must start working the day the brand gets a product, without a deploy.

**So the gate has two levels rather than one, and they are different gates:**

| State | Behaviour |
|---|---|
| Brand has **0 products** | Page **not linked, not in the sitemap, `noindex, follow`**. It resolves for anyone who has the URL, and it starts indexing itself the day a product is attached |
| Brand has **≥1 product, 0 venues** | **Indexable.** Sections 1–3 and 6 are real content; "where to drink it" shows an honest empty state |
| Brand has **≥1 product, ≥1 venue** | **Indexable**, full page |

**Note this is a change from v7**, which gated on venues. Your framing is better: **products are what makes the page exist, venues are what makes it exceptional.** A brand with a product and no venues still answers "what is this drink" — which is a real query — and it self-heals into the full page.

**Answer: "adopt this model, gate on ≥1 product" (recommended), or changes to the sections.**

Answer:

---

## 5. Robots meta tags — what they are and which ones matter

> *"So for the district page we keep the noindex,follow for <3 venues, above that we get index,follow? Explain these index, follow and other metatags important for SEO."*

**Yes, exactly that** — verified in `city/district.blade.php:18-22`, gated on `config('uni.min_venues_for_indexable_district')`, which is 3.

### 5.1 The robots meta tag

`<meta name="robots" content="...">` is a set of instructions to crawlers. **Two independent switches, which is the part that confuses everyone:**

| Directive | Means | Does **not** mean |
|---|---|---|
| `index` | This page may appear in search results | — |
| `noindex` | Do not show this page in results | Do not crawl it. Google **must** crawl it to see the tag |
| `follow` | Follow the links on this page and pass value through them | — |
| `nofollow` | Do not follow the links on this page | Anything about this page's own indexing |

**They combine independently**, which is what gives the four states:

| Combination | Where we use it | Effect |
|---|---|---|
| `index, follow` | Every real page — venues, qualifying districts, cities | Normal |
| `noindex, follow` | Thin districts, `/mapa`, filtered views | **Do not list this page, but keep walking its links.** The page carries traffic through without competing in results |
| `noindex` (alone) | `/regulamin`, `/polityka-prywatnosci` | Legal boilerplate. `follow` is omitted deliberately — no ranking value to pass on |
| `index, nofollow` | Nowhere, and rightly | Almost never useful |

**The one counter-intuitive thing worth carrying:** `noindex` does not save crawl budget. Google has to fetch the page to read the tag. If you want a page *not fetched*, that is `robots.txt` — and a `robots.txt` block means Google never sees the `noindex`, which is how pages end up indexed with no description. **Never block a page in robots.txt that you also want deindexed.**

### 5.2 The others on our pages, and what each is for

| Tag | Purpose |
|---|---|
| `<link rel="canonical">` | "This is the real address of this content." Consolidates ranking when the same content is reachable by several URLs. **Every page has one** |
| `noai, noimageai` | Non-standard, added alongside `index, follow` per `block-all-ai-crawlers.md`. Asks AI crawlers not to train on the page. **Voluntary — it works only for crawlers that choose to honour it** |
| `og:*` (Open Graph) | The link preview card on WhatsApp, Messenger, Slack, LinkedIn. **No ranking effect** — this is share appearance, not SEO |
| `<meta name="description">` | Not a ranking factor, but it is the snippet under your result, so it drives click-through. Google rewrites it when it disagrees |
| `<title>` | **Is** a ranking factor and the clickable line in results |
| `hreflang` | Language and region variants. Not needed while we are Polish-only |
| `<meta name="keywords">` | Ignored by every major engine since roughly 2009. **Do not add it** |

### 5.3 Why the district threshold is not just "some content is better than none"

To close the loop on your v7 question: Google's problem with a two-venue district page is not the *count*, it is that the page is a **near-duplicate** of the city page under a different heading. A pattern of near-duplicates is what feeds the site-wide quality assessment — which is what a domain with no authority can least afford. Three venues is where the page starts answering the question it was found for. That reasoning is already written into `config/uni.php` next to the value.

**No answer needed** — this is explanation, and the threshold is unchanged.

---

## 6. og:image — your question about doing it yourself

> *"what if I prepared the image myself, the static one/ fallback. Or its better to decide now, implement the automated image generation for future automated og:image generation per venue?"*

**Make it yourself. It is the better answer and it is not a compromise.**

Three reasons:

1. **It removes the whole TTF question.** The Poppins-in-the-repo decision from v7 §4.6 only exists because GD needs to *render text*. A finished PNG has the text baked in. **That question disappears entirely** rather than being answered.
2. **One image made in a design tool will look better than one generated by GD**, and this single file is what every share of the site looks like until per-venue generation ships. It is the most-seen image we will have.
3. **It does not block the automated path.** Per-venue generation is a *different* build — a template, a cache, an invalidation rule, an nginx route. The fallback is not a prototype of it, and building the fallback by hand does not cost you anything on the way to it.

**What I need from you:** a **1200 × 630 PNG**, text and logo inside the centre **1080 × 600**, under 1 MB. Drop it in and I will wire it as the site-wide default with a per-page override so venue pages can take theirs later without a rewrite.

**And the honest note about the automated version:** it is the *right* long-term answer — "Bar Kwitnąca, 12 pozycji bez alkoholu" as a share card is genuinely better than a generic one. But it is a launch-week nice-to-have, not a launch blocker, and per §3 it must never composite brand imagery.

**Answer: "I'll make the PNG" (recommended), or "build the generator now".**

Answer:

---

## 7. The scheduler — your understanding is right, and your point about local dev is fair

> *"we define cron in some php file, that is run once in prod on linux server, then each new cron is just updating the php file and it takes effect?"*

**Correct in every part.** To be precise about which half runs where:

- **On the server, once, ever:** one crontab line, `* * * * * php artisan schedule:run`. It fires every minute and asks Laravel "is anything due?"
- **In the repo, forever after:** `routes/console.php`. Adding, removing or re-timing a job is **an edit to that file and a deploy.** You never touch the server's crontab again.
- **The minute-by-minute wake-up is not the job frequency.** `->daily()` still runs once a day; Laravel just needs to be asked often enough not to miss the moment.

**One caveat worth knowing now rather than at 3am:** if the crontab line is missing or the path is wrong, **nothing errors.** The site serves perfectly and no job ever runs. That silence is the entire reason for the dashboard heartbeat you approved.

### 7.1 Your point about local dev — taken, and you are right

> *"we are not running cron since its local dev, PC is not on 24/7. Same with fake data on local dev, I feel like you treat local dev too much as a needed 100% reflection of prod."*

**Fair, and I will adjust.** Local dev needs to reproduce *behaviour*, not *state*. Nobody needs a scheduler on a machine that sleeps, and fake venues are the correct content for a machine whose purpose is checking that a page renders.

Where the distinction genuinely matters, and it is narrow:

- **A scheduled command must be runnable by hand** — `php artisan uni:check-offer-freshness` — so you can verify it does the right thing without waiting for 3am. That is already true.
- **The queue must be exercisable locally**, because `sync` and a worker behave differently on failure and that difference is the whole reason for §5.3 of v7. `php artisan queue:work` on demand is enough.
- **Fake data must not be indistinguishable from real data in the same database**, which is what the wipe-before-import is for.

Everything else — cron running, real venues, a live SMTP connection — is production's job. **I have been over-indexing on parity and I will stop.**

**No answer needed.**

---

## 8. Freshness and verification — the AS-IS you asked for

> *"We have made some significant changes across the timeline to the freshness, is_verified badges and other parts of the whole system... in the beginning we had 3 badges like silver, bronze, gold etc. Now it is all different. I want to see the exact AS-IS and then TO-BE with the reasoning."*

Read from the code today, not from the decision records, because the records are what we *intended* at various dates and you asked what is *true*.

### 8.1 The columns that exist

| Column | Type | Set by | Meaning |
|---|---|---|---|
| `offer_updated_at` | timestamp | Observers on product/drink attach and detach, `markOfferFresh()` | When the offer was last confirmed. **The single source of the freshness claim** |
| `freshness_streak_started_at` | timestamp | `markOfferFresh()`, if already fresh | When an unbroken run of freshness began |
| `is_verified` | bool | Admin, manually | An admin looked at the actual drinks card |
| `verified_at` | timestamp | Admin | When that flag was first set |
| `last_menu_check_at` | timestamp | Admin | When the card was last physically checked |
| `breadth_score` | int | `VenueScoring::recalculate()` | Total count of products + custom drinks |
| `is_claimed` | bool | Claim flow (dark in V1) | An owner has claimed the venue |

### 8.2 What the visitor actually sees

**Three things, and only three:**

1. **`Sprawdzona karta`** — shown when `is_verified` **AND** `last_menu_check_at` is within **180 days** (`verification_valid_days`). The two-part gate is deliberate: `is_verified` never expires by itself, so alone it would eventually mean *"an admin ticked a box once"*.
2. **The freshness line** — `Zaktualizowano dziś` / `Zaktualizowano N dni temu` up to **90 days** (`freshness_days`), then `Zaktualizowano N mies. temu`. **Suppressed entirely when `breadth_score` is 0**, so a venue with nothing in its offer makes no freshness claim.
3. **The venue-type badge** — kawiarnia / bar / restauracja. Not a trust signal.

**And one that is built but hidden:** `Zarządza właściciel`, suspended behind `config('uni.owner_managed_badge')` on 02.09 because no path to claiming exists in V1.

### 8.3 What is internal and never shown

- **`breadth_score`** — drives the default sort and gates the freshness label. Never displayed as a number.
- **`freshness_state`** — `fresh` / `stale` / `unknown`, binary at 90 days. Drives the discovery freshness filter.
- **`freshness_streak_months`** — computed on the model and **displayed nowhere.** Dead code, see §8.5.

### 8.4 The gold/silver/bronze system you remember is gone, entirely

**Confirmed by reading the schema rather than the documents.** There is **no `credibility_score` column on `venues`** and **no `credibility` reference anywhere in `app/` or `config/`** apart from one word in a `BotDetector` comment. Two decision records still describe it in the present tense — `credibility-formula-opacity.md` and `popularity-excluded-from-credibility.md`, both 22.04 — and both are now **describing something that does not exist.**

So the trajectory was: a weighted opaque score with tiers → removed → **replaced by two independent, individually explainable facts** (a human checked the card; the offer was confirmed N days ago).

**And that was the right move, for a reason worth keeping.** A composite score cannot be defended to an owner who asks why theirs is lower. "An admin last checked your card 200 days ago" can be defended in one sentence and **acted on** in one action. `credibility-formula-opacity.md` exists precisely because the old design had a defence problem — the fix turned out to be deleting the score, not hiding its weights.

### 8.5 The AS-IS problems

1. **Two decision records describe a deleted system** and will mislead the next person, possibly you in four months.
2. **`freshness_streak_months` is computed and never rendered.** Either surface it — *"świeża oferta od 4 miesięcy"* is a genuinely good badge and the hardest one to fake — or delete it.
3. **`verified_at` and `last_menu_check_at` overlap** and nothing enforces a relationship between them.
4. **90 days for freshness and 180 for verification** are both plausible and neither is derived from anything. As the offer-confirmation flow gets cheaper, 180 should shorten, and nothing currently prompts that.
5. **The import bypasses the observers**, so `offer_updated_at` drifts and `uni:check-offer-freshness` repairs it — §5.2 of v7.

### 8.6 TO-BE — what I would change, and it is less than you might expect

**The system is in better shape than your memory of it suggests.** The badge inflation was already removed; what remains is tidying.

| # | Change | Reasoning |
|---|---|---|
| 1 | **Mark the two credibility records superseded**, with a short record saying the score was removed and what replaced it | The gap between documents and code is the thing that caused this question |
| 2 | **Decide the streak: surface it or delete it** | I would surface it. *"Świeża oferta od 4 miesięcy"* is the strongest honest signal we have and it is already computed |
| 3 | **Fix the importer to touch `offer_updated_at`**, keep the hourly check as the net | Repair-instead-of-fix is fine for V1 as long as we do not confuse the two |
| 4 | **Leave 90 and 180 alone for V1** | Changing a threshold with no data behind it swaps one arbitrary number for another. Revisit when there is re-check history to look at |
| 5 | **Do not reintroduce a composite score** | Worth writing down as a decision so it is not rediscovered as a good idea in six months |

**And your freshness frequency answer resolves itself given the above:** you said hourly, 90% sure. **Hourly is right**, and the reason is item 3 — the command is a *repair for a known bypass*, and a repair that runs daily leaves a venue displaying a false badge for up to a day while also carrying a wrong `breadth_score`, which affects ranking. Three queries.

**Answer: "hourly, and adopt the five TO-BE items", or changes.**

Answer:

---

## 9. Do we need SMTP for V1? Yes — and here is exactly why

> *"keep the worker, let us make sure we have the need for restarting queue worker in some 'deploy checklist'. Also, in that case we need SMTP for v1, am I correct?"*

**Correct, and the chain is short:** you approved the report notification (C2) → a stranger submitting the "coś się nie zgadza" form has to reach you → that is an e-mail → e-mail needs a sending path → `MAIL_MAILER=log` writes to a file nobody reads.

**Without SMTP, the report form is a hole in the ground.** The visitor gets "dziękujemy", the row is stored, and nothing tells you it happened. It is the only channel by which anyone can tell you a venue's data is wrong, so it is the last thing that should be silent.

**Worth being precise about what V1 actually needs**, because it is small: the report notification, and password reset if any account exists. That is a handful of messages a week — inside the free tier of every provider in §6 of v7. **The cost is zero; the work is DNS records and a decision.**

Deploy checklist in §10.

---

## 10. The deploy checklist you asked for, twice

> *"let us make sure we have the need for restarting queue worker in some 'deploy checklist'"* and *"add to deploy todo list to check the stack actually includes daily. Add the reasoning to that check in the deploy todo/checklist (same thing i refer to) for each check"*

Same artifact both times: **`docs/roadmap/deploy-checklist.md`**, with a reason attached to every line, because a checklist item without a reason is the first one somebody skips.

Contents as I would write it — **for your review, not built yet:**

| # | Check | Why it is on the list |
|---|---|---|
| 1 | Crontab has the single `schedule:run` line | Without it **nothing scheduled ever runs** and nothing errors. Freshness badges rot and `model:prune` stops deleting personal data, which makes the privacy policy untrue |
| 2 | Queue worker running under supervisor | A report submitted while SMTP is down is lost with `sync` |
| 3 | **`php artisan queue:restart` on every deploy** | A worker holds code in memory. Without this it runs the **old** code indefinitely — the single most common Laravel deploy bug |
| 4 | `LOG_CHANNEL` stack actually includes `daily` | `config/logging.php` already sets `days => 30`, but the default channel is `stack`. **If the stack is only `single`, one `laravel.log` grows forever** and the 30-day retention we published is fiction |
| 5 | `logrotate` config present for nginx | Same reason, for access logs. Enforces the 30 days you decided in v7 §7, and stops the disk filling |
| 6 | `pg_dump` cron + off-box copy + **restore drill done** | GDPR art. 32(1)(d) requires *testing* the restore, not merely having a backup |
| 7 | SMTP verified end to end with a real send | See §9 |
| 8 | `APP_ENV=production`, `APP_DEBUG=false` | `APP_DEBUG=true` in production leaks environment variables on any error page |
| 9 | Assets built **off** the box, deployed compiled | Vite spikes memory; on a 4 GB VPS it can OOM-kill Postgres mid-deploy |
| 10 | HTTPS live, and the consent cookie's `Secure` flag verified | The 02.09 fix makes the flag conditional; production must be the branch that sets it |
| 11 | Owner panel still returns 404 | V1 scope. It is dark by config and a deploy is when that quietly changes |
| 12 | `uni.owner_managed_badge` still off | Same — it was suspended on 02.09 for being untrue |
| 13 | Search Console TXT record present | Removing it silently unverifies you |
| 14 | Canary venues present and excluded from reports | Scrape detection only works if they are live |

**Answer: "write it as specified", or additions.**

Answer:

---

## 11. Ploi — good choice, with two gaps on the plan you picked

> *"I don't [know] if I mentioned it, But I will use ploi, the 10$ plan, i am 90% sure."*

You had not mentioned it. **It is a good fit and it changes several answers in v7 for the better.**

### 11.1 What it is, and why it matters more than it looks

Ploi is a server management panel: it connects to a VPS you own and configures and maintains it — nginx, PHP-FPM, MySQL/Postgres, SSL certificates and renewal, deploy scripts, **queue workers under supervisor**, **cron entries**, firewall.

**Read that list against §5 of v7.** The scheduler cron, the supervisor-managed queue worker, `queue:restart` on deploy, Let's Encrypt renewal, automatic server updates — **those were four separate operational burdens and Ploi collapses them into a web form.** For someone running their first production Linux box, that is worth more than the price.

**And it satisfies your own EU rule without you having to check:** Ploi is a **Dutch company**. Server, panel and — per §6 of v7 — mail provider can all be EU-resident.

### 11.2 Reading your screenshot: two things Basic does not include

| | Free | **Basic $10** | Pro $16 |
|---|---|---|---|
| Servers / sites | 1 / 1 | 5 / unlimited | 10 / unlimited |
| **Deployments** | **5 per month** | Unlimited | Unlimited |
| Automatic **database** backups | ✗ | **✗** | ✓ |
| **Zero-downtime deployment** | ✗ | **✗** | ✓ |
| Server + site monitoring | ✗ | **✗** | ✓ |
| **Access to support** | ✗ | **✗** | ✓ |
| Cron, queues, databases, SSL, firewall, auto server updates | partial | **✓** | ✓ |

**Free is not viable** — 5 deployments a month is less than one week of a seeding sprint.

**Basic gives you everything operationally essential.** The four gaps and what each actually costs you:

1. **No automatic database backups.** **This one does not matter**, because you should not use them anyway. §5.4 of v7 has you running `pg_dump -Fc` to off-box storage with a tested restore — that is the GDPR art. 32(1)(d) obligation, and a panel-managed backup you have never restored does not satisfy it. **You were already building the better thing.**
2. **No zero-downtime deployment.** Deploys have a brief window mid-update. At V1 traffic, nobody will see it. It becomes worth $6/month when a deploy landing on a live visitor is a real cost — not yet.
3. **No monitoring.** Note this does **not** replace the dashboard heartbeat you approved. Ploi would tell you *the server is up*; the heartbeat tells you *the scheduler ran*. **A perfectly healthy box with a broken crontab looks identical to a healthy box.** Different questions.
4. **No support access.** **This is the one I would actually think about.** You are running your first production server, and Basic means docs and community only. Not a reason to change plans — but a reason to know that upgrading for one month while something is broken is a legitimate move.

### 11.3 The cost note worth seeing plainly

**$10/month ≈ 36 zł ≈ 435 zł/year.** Your VPS is **283 zł/year**. **The management panel costs more than the server it manages.**

That is not an argument against it — the panel is buying your time and your first production box being configured correctly, which is worth more than 435 zł. But your V1 rule is *no recurring spend without a reason*, so the reason should be stated: **you are paying for correctly-configured infrastructure maintenance, not for convenience.** If you ever conclude you could maintain the box yourself, that is the moment to drop to Free or off it entirely — and Ploi's own FAQ confirms cancelling stops nothing on your servers.

**One thing to add to the ROPA:** Ploi has credentialed access to a server holding personal data. That is very likely a **processor relationship under GDPR art. 28** — so it needs a **DPA and a ROPA entry**, exactly as done for Carto. Dutch, so no transfer question.

**Answer: "Basic $10, confirmed", or "Pro $16 for support and monitoring".**

Answer:

---

## 12. Naming and designing the seeding process

> *"Now I want to address the process of adding new venues by me, like in prod. Let's settle an appropriate name for that process, seeding maybe? As for that process, I currently keep the venues to add to the app in xlsx file..."*

### 12.1 The name — not "seeding"

**"Seeding" is the wrong word and it will cost you later.** In Laravel, *seeding* means `database/seeders/` — fake data generated for development. **Using the same word for real venues entered in production guarantees a conversation where two people mean opposite things**, and it undermines the fake-vs-real distinction the wipe exists to enforce.

Options, with my recommendation first:

| Name | For | Against |
|---|---|---|
| **Katalogowanie / cataloguing** *(recommended)* | Describes it exactly: building the catalogue. Polish word is natural, no collision with any technical term | — |
| **Kartowanie** | Evocative — "carding", from *karta napojów* | Slightly obscure |
| **Onboarding** | Familiar | Means signing up *users*. Collides with the owner claim flow |
| **Seeding** | Familiar to you | **Collides with Laravel's meaning.** No |

**And the venue's own state should carry the same vocabulary:** `kandydat` → `szkic` → `opublikowany`. A candidate is from the permit register and nobody has visited it. A draft has been visited and partly filled. Published is live.

### 12.2 The workflow — replacing the xlsx

The xlsx is doing three different jobs at once, which is why it feels wrong: **a worklist**, **a staging buffer**, and **an import format**. Splitting them makes each one better.

| Job | Today | Proposed |
|---|---|---|
| **Worklist** — where do I go next | Your memory + the file | `venue_candidates` from the permit register (§9 of v7), filtered `gastronomia`, with status |
| **Capture** — standing in the venue | Notes, later typed in | **Quick-add page** — 5 fields, GPS button, drink picker |
| **Completion** — the other 28 fields | The same file | Normal Filament venue form, at a desk |
| **Publication** — going live | `is_active` flips on first product | Explicit, with a checklist |

**The key change is that a venue exists in the database from the moment it is a candidate, not from the moment it is complete.** That is what kills the xlsx: there is nowhere else for a half-known venue to live.

### 12.3 Your hardest question, and it needs its own decision

> *"what about venues that we can add, but have not 0% options, but are in DB and once the NA option is there, it is visible. It comes two way i think, some venues could initially serve NA options, then stop doing so."*

**This is a genuinely important product question and it is bigger than the workflow.** Right now the model is binary and implicit: `activateIfReady()` sets `is_active` the moment a venue gets its first product, and nothing ever sets it back.

**Three distinct states are being conflated:**

| State | Meaning | Today |
|---|---|---|
| **Never checked** | We have the address from the permit register. Nobody has looked | Not in `venues` at all |
| **Checked, nothing to offer** | Somebody stood there and confirmed: no NA options worth listing | **Cannot be expressed.** Same as never checked |
| **Had options, stopped** | It was listed and the offer went away | **Cannot be expressed.** Would just go stale, or be deleted |

**Why the second row matters more than it looks.** *"We checked, there is nothing"* is real, expensive, non-recreatable knowledge — it stops you re-walking the same street next quarter. And in aggregate it is the honest denominator behind any claim about Warsaw: **"of 340 licensed venues we checked, 51 have a real NA offer"** is a far stronger sentence than "we list 51 venues", and it is the kind of number that gets an article written about you.

**Why the third row matters.** A venue that drops its NA offer and simply goes stale is a lie with a 90-day fuse. Worse, deleting it loses the history — and *"three venues in Śródmieście dropped their NA taps this quarter"* is a genuine market signal.

**What I would do:** a `catalogue_status` enum — `candidate` / `assessed_empty` / `active` / `lapsed` — separate from `is_active`, which stays a pure publication switch. `assessed_empty` and `lapsed` are never public but both count in the denominator, and `lapsed` keeps its history.

**This deserves a proper design conversation rather than a paragraph in §12**, because it touches the data model, the discovery query, the report denominators and the seeding workflow at once. **I would put it at the front of the catalogue session.**

**Answer: "katalogowanie, and design the status model next session" (recommended), another name, or "keep it simple, binary for V1".**

Answer:

---

## 13. Trending products — you are right, and it reopens cleanly

> *"trending block would show nothing for the whole of V1 is not a problem I guess? Let's talk about it."*

### 13.1 You are right and my framing was wrong

I presented "the trending block shows nothing for all of V1" as a **cost** of option A. **It is not a cost. It is the correct behaviour**, and I should have seen that.

The reasoning I missed is the one you supplied: **the owner panel is dark in V1.** So the trending block has **no audience**. There is no owner to disappoint with an empty block, because no owner can open the page it sits on. Its only job during V1 is **to accumulate correct data for the day the panel opens.**

**Which reframes the whole question.** It is not *"what do we show?"* — nobody is looking. It is *"what do we record, so that the day someone does look, the history behind the number is honest?"*

**That is a much easier question**, and it makes your §10.7 idea the actual answer rather than a refinement.

### 13.2 Your `adding_method` idea — yes, and it is better than any of my four options

> *"why not base the trends on the venue_offer_logs where there would be some column with adding_method or some better fitting name that say if its import, owner added it manually or admin added it manually. If admin adds manually, its still a trend if it reflects the new product in some venue, isn't that correct?"*

**Yes on both counts, and the second sentence is the important one.**

You have separated two things I had collapsed. **"Who typed it" and "is it true" are different questions, and only the first one was ever the problem.** If you walk into a bar, see Lech Free on the tap, and record it — **that is a true fact about the world discovered on that date.** The venue really did start stocking it. The record is honest.

**The problem was never the source. It was the timing.** Three cases, and they are genuinely different:

| Case | Does the record's date reflect a real-world change? |
|---|---|
| Owner adds a product the day they start stocking it | **Yes.** Date of record ≈ date of change |
| You visit a bar and record what you find | **No.** The bar may have stocked it for two years. The date is *when we found out* |
| Bulk import of thirty venues | **No.** Thirty "changes" on one Tuesday, none of which happened that Tuesday |

**So the column should not record *who*. It should record *what kind of knowledge this is*** — and there is a much better name available:

```
discovery_type:  initial_catalogue   -- first time we recorded this venue's offer
                 observed_change     -- the offer changed and we saw it
                 owner_reported      -- the owner told us
```

**That is the distinction the trend query actually needs.** A trend counts **`observed_change` and `owner_reported`** and ignores **`initial_catalogue`** — regardless of whether an admin, an owner or an importer wrote the row. Your seeding session produces `initial_catalogue` rows and is correctly invisible to the trend. Your *second* visit to the same bar, six weeks later, finding a new tap, produces `observed_change` — **and that is a real trend data point that my option A would have thrown away because an admin typed it.**

**Your instinct was better than my four options.** All four of mine were ways of *suppressing* admin data; yours **classifies** it, and it keeps the signal.

Two consequences worth naming:

- **Add a `discovery_type` column to `venue_offer_logs`**, defaulting to `initial_catalogue` for anything that cannot say otherwise. The importer sets it explicitly. The quick-add page sets it. The relation manager asks, or infers it from whether the venue already had a recorded offer.
- **This also fixes §10.7 of v7** — the importer writing nothing to `venue_offer_logs`. It should write, with `initial_catalogue`. That way the history is complete and the trend is still honest, instead of the history having a thirty-venue hole.

### 13.3 "Top products this X" — researched and assessed

> *"as for the 'top products this month', what if that feature was 'top products this X' where X is 30 months, 7 days, quarter etc? Research that idea, assess it and address it."*

**The idea is right in one direction and wrong in the other, and the split is worth understanding.**

**Where it is right — long windows.** The current 30 days is arbitrary, and for a catalogue this size it is *too short*. A quarter or a year over the same data gives you **seasonality**, which is the single most valuable thing this dataset will ever produce: *"piwa bezalkoholowe rosną od kwietnia do sierpnia; koktajle bezalkoholowe w grudniu i styczniu"*. Nobody in Poland has that number. It is worth more than the venue-level trend and it is a much better story for press and for Instagram.

**Where it is wrong — short windows.** 7 days over this data produces **noise that looks like signal**, and that is the dangerous kind of wrong. The existing threshold is 5 distinct venues; in 7 days at V1 volume you will either get nothing or you will get five venues that all happen to be ones you visited on Thursday. **A number that flickers weekly teaches an owner to distrust the report** — and this is the same class of failure as the seeding trap.

**The related mechanism already in the codebase:** `analytics.small_bucket_threshold` is **5**, used by `AnalyticsBucketPrivacy`. So the concept of "too small a bucket to report" already exists and is already configured. A shorter window should not lower it; if anything a shorter window needs a *higher* one.

**What I would build, and it is less than "X can be anything":**

| Window | Audience | Verdict |
|---|---|---|
| **30 days** | Owner report | Keep. Enough to move, short enough to act on |
| **90 days / quarter** | Owner report + your own analysis | **Add.** Where the real signal is at V1 volume |
| **12 months** | Editorial, press, Instagram | **Add.** Seasonality. The most valuable output of the whole dataset |
| **7 days** | — | **Do not.** Noise at this volume |
| Arbitrary user-chosen range | — | **Do not.** Every window a person can pick is a window you have to be able to defend |

**And the reason not to make X free-form is the one that runs through this whole document:** every number in the report is a number somebody might be asked to pay for. **Three defensible windows you have thought about beat an infinite set you have not.** Fixed windows also mean the daily rollup can precompute them, which is the difference between a report that loads instantly at 100,000 venue-days and one that does not.

**Answer 1: "`discovery_type` on `venue_offer_logs`, trends count observed + owner-reported" — yes, or a different split.**

Answer:

**Answer 2: windows — "30d / 90d / 12m, no 7-day, no free-form" (recommended), or something else.**

Answer:

---

## 14. What I found that you did not ask about

v8's first draft answered your eleven notes and stopped. That was a failure of the format — every previous version carried findings I raised myself, and this one did not. Five, in order of consequence.

### 14.2 Standalone NA brands are where a directory adds most value

The five standalone non-alcoholic brands — Seedlip, Lyre's, Oddbird, Crodino, Fever-Tree — are where a directory adds most value. **Everyone knows Heineken has a 0.0. Nobody knows which Warsaw bar pours Lyre's.** They also have a commercial reason to work with us: no brewery shelf space behind them, so discovery is the whole problem. Worth cataloguing first for that reason alone.

### 14.4 The report has no dispute process, and the first paying owner will need one

Every document in this series has worked on making the numbers *correct*. None has asked what happens when an owner says **"that number is wrong"**.

They will, and often they will be right — an offer that changed, a district misassigned, a duplicate listing, a neighbour's venue counted as theirs. Today there is no route: no contact path from the report, no record of a dispute, no way to mark a figure contested.

**Why it matters more than it sounds:** the whole credibility argument here rests on answering *"how do you know?"*. **A methodology with no correction mechanism is not a methodology, it is a claim.** The fix is small now — an action on the report, the existing report table, a note on the affected figure — and expensive once numbers are in invoices.

**It belongs with the owner panel, not V1**, but as a recorded gap rather than a discovery.

### 14.5 Two decision records describe a system that does not exist

Repeated from §8.4 because it belongs on this list. `credibility-formula-opacity.md` and `popularity-excluded-from-credibility.md` (both 22.04) describe `credibility_score` in the present tense. **The column is not in the schema; the concept is not in the code.**

Why it is a finding rather than a chore: **you asked for the AS-IS precisely because the documents had drifted from the code.** That is the second time this session a document was the source of a wrong belief — the first was my own §3. **These records are load-bearing, so their drift is a defect, not untidiness.**

---

## 15. The question underneath all of this: what is launch?

Every document in this series sequences work against **"before launch"**. §10 is a pre-launch checklist. v7 §11 planned three sessions ending at launch.

**There is no launch date.** June 2026 was the target, it was missed, and no new one was set.

**This is not a scheduling complaint. It is a design problem, because "before launch" is doing real work as a priority filter and it currently points at nothing.** Three symptoms visible in this document alone:

- **The catalogue has no size target any more.** v6 said 40–60 products; you said the data is fake and will be filled. Filled to what, by when?
- **§3 has no deadline attached.** "Get an opinion before launch" is not actionable. With a date it is calendar work.

**What launch probably needs to be is a checklist, not a date:** the 30 real venues imported and verified, the SEO surface live, and the §10 deploy checklist green. **Everything in these documents is either inside that list or after it.**

**Answer: "the four-item checklist, dated once the catalogue session is done" (recommended), a specific date, or "let's talk about this separately".**

Answer:

---

## 16. Decision records to write

You asked twice for reasoning to be recorded so it is not lost. **The first three constrain code and should be written before any of it.**

| Record | Captures |
|---|---|
| `catalogue-excludes-actual-alcohol.md` | Turns "1–3% deferred" into a refusal; records `unknown` ABV as an unverified claim |
| `event-naming-surface-then-action.md` | §1.6, the three renames, one-system-per-event |
| `producers-stay-internal.md` | §4.1 of v7 — labelling law, characterisation risk, and your point that brands exist separately for a reason |
| `ranking-is-never-for-sale.md` | §4.3. Written now, while there is no revenue pressure to erode it |
| `catalogue-status-is-not-is-active.md` | §12.3, after the design conversation |
| `credibility-score-was-removed.md` | §14.5. Supersedes two records describing a deleted system |
| `campaign-attribution-is-per-visit.md` | §2. The bookmark problem, why we do not solve it, the three mitigations |

---

## 17. What I'd do with the next four sessions

Reordered from v7 §11, which had three and did not know about §3.

**Session 1 — the guards, then the import.** Nothing here depends on hosting.
1. Internal-traffic exclusion (approved, §0)
2. `discovery_type` on `venue_offer_logs` (§13.2) — **before** any bulk product entry, because it cannot be backfilled
3. Delete `_category-card.blade.php` (approved)
4. The three event renames (§1.5) — free now, expensive after launch
5. Fix the ghost and the missing metric in `clickDetailReport` (§1.4)
6. Manual `pg_dump`, then wipe, then import the 30 venues

**Session 2 — catalogue and the process around it.** The long pole, and §14.2 reorders it.
1. `catalogue_status` design conversation (§12.3), then build
2. Quick-add page, reading from `venue_candidates`
3. Pull the permit register (`gastronomia`) into candidates
4. **Standalone NA brands first**, then beer variants (§14.2)

**Session 3 — the SEO surface.** Content-shaped; none of it needs the server.
1. Product pages and brand pages to the §4.2 model
2. `/faq`, glossary, `/kontakt`, `/suchy-styczen` built properly
3. Category illustrations — fills the visual gap
4. Your fallback og:image wired in; GSC domain property verified

**Session 4 — infrastructure and deploy.** The first session that spends money.
1. Campaign registry, device/entry-source expansion, impression batching from v6 §1
2. Report notification + SMTP; queue worker; scheduler cron + heartbeat
3. OVH + Ploi provisioned against the §10 checklist, **written as a script** (v7 §8.3)
4. Restore drill, documented

---

## 18. Open questions, collected

| § | Question | My recommendation |
|---|---|---|
| **15** | **What is launch?** | **The four-item checklist, dated after the catalogue session** |
| 1.6 | Three event renames and the naming rule? | **Yes** |
| 2.4 | UTM: strip params + campaign end dates + time-series reporting? | **All three** |
| 4.4 | Brand page model as specified, gated on ≥1 product? | **Yes** |
| 6 | og:image: you make the PNG, or build the generator? | **You make it** |
| 8.6 | Freshness: hourly + the five TO-BE items? | **Yes** |
| 10 | Deploy checklist as specified? | **Yes** |
| 11.3 | Ploi Basic $10 or Pro $16? | **Basic** |
| 12.3 | "Katalogowanie", and design the status model next session? | **Yes** |
| 13.2 | `discovery_type` on `venue_offer_logs`? | **Yes — your design, not mine** |
| 13.3 | Windows: 30d / 90d / 12m only? | **Yes** |
| 14.3 | Turn "1–3% deferred" into a stated refusal? | **Yes** |
| 14.4 | Report dispute process — record as a gap for the owner panel? | **Yes, record now, build with the panel** |

---

## 19. Sources

Own code is cited inline by file and line. External claims:

**Attribution**
- [UTM parameters: a complete guide](https://cxl.com/blog/utm-parameters/) and [UTM tracking limitations](https://www.cometly.com/post/utm-parameter-tracking-limitations) — session scope, campaign timeout, drop-off
- [UTM tracking vs persistent attribution](https://www.madlitics.com/articles/utm-tracking-vs-persistent-attribution-key-differences) — why the industry fix requires an identifier we do not store

**SEO**
- [Ahrefs on ecommerce category pages](https://ahrefs.com/blog/seo-ecommerce-category-pages/) and [Digital Commerce Partners](https://digitalcommerce.com/ecommerce-category-page-seo/) — Mueller on link-only category pages; 200–400 words; FAQ blocks
- [Baymard on category page design](https://baymard.com/learn/ecommerce-category-page)

**Hosting**
- [Ploi pricing](https://ploi.io/pricing) and [Laravel documentation](https://ploi.io/documentation/laravel); [Dutch company, unlimited servers from €8](https://madewithlaravel.com/ploi); [Forge comparison](https://deploynix.io/blog/deploynix-vs-laravel-forge-vs-ploi-an-honest-comparison)
