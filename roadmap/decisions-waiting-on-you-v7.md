---
version: 7.0
owner: Paweł Milewski
updated: 2026-09-04
status: living
---

# Decisions waiting on you — v7, the session where you asked me to explain rather than decide

**This is a discussion document. Nothing in it is built.** You answered nineteen questions on v6. **Twelve were decisions and are recorded here, not in code.** Seven were not answers at all — they were *"I still don't understand this, explain it properly"* — and those are §5 to §8 below, which is most of this document. That was the right instinct: three of them (the scheduler, the queue worker, the backup) are things you will personally have to keep alive on a box you own, and agreeing to them without understanding them is how a site dies quietly at 4am on a Sunday.

**Everything below was verified against running code on 04.09.** 557 tests green — unchanged, because nothing was written. **Every external claim is sourced in §13**, after the research pass on 04.09 corrected two of them.

> **Filter unchanged from v5/v6:** does it block the deploy, does it change what Google sees, is it data we cannot recreate later, is it a number somebody will be asked to pay for. One addition this session: **can you keep it running yourself.** A capability you cannot operate is not a capability.

---

## 0. Nothing shipped — and that was your correction, mid-session

I started writing code for the two items that looked settled to a hundred percent, and you stopped me. The rule for the rest of the project, in your words:

> **After each revision from me, we discuss everything before implementing. If there is something where there is nothing to talk about since the decision is made, just say that.**

**Both commits were reverted and the history rewritten.** The repository is exactly where it stood before this session: **557 tests green, no changes under `app/`, `config/`, `resources/` or `tests/`.** The only commits from this session are this document and the journal.

**Two things are ready to write the moment you say go, and neither has anything left to discuss:**

- **Delete `resources/views/venues/_category-card.blade.php`.** You answered "delete it". Nothing includes it and it would throw on render — it calls `mb_strtolower()` on what is now a `BelongsTo` returning a `Brand` model. Nothing to talk about.
- **Exclude internal traffic from analytics writes.** You answered "exclude admin traffic". The shape is settled: a guard in `EventLogger::log()` and `VenueStat::track()`, the two chokepoints every analytics write passes, so a fifth call site cannot forget it. **One question inside it is genuinely open** and it is the only reason this is not a "nothing to talk about" item — see below.

### 0.1 The owner-exclusion question — researched, and it comes back clearly

You pinned this for external research. The findings are in [`research-results/analytics-self-exclusion.md`](research-results/analytics-self-exclusion.md). **They confirm the recommendation and add four things I did not have.**

**The recommendation stands: exclude admin *and* owner from the billed views metric.** The reasoning is now stronger than "it would end up in an invoice":

| Standard | What it says |
|---|---|
| **IAB/MRC Audience Reach Measurement Guidelines** | Internal traffic must be **disclosed separately** and, where material and not qualitatively similar to external users, **removed** from reported audience counts |
| **IAB Ad Impression Measurement Guidelines** | Company-internal traffic must be disclosed and removed where it does not represent real exposure; recommends using organisation-wide identifiers to make that filtration possible |
| **ABC Web Traffic / Website & App Reporting Standards** | Publishers must **"exclude all internal activity"** — traffic from anyone who maintains, develops or authors the site, including monitoring and automated checks |

An owner repeatedly opening their own profile is, economically, closer to internal monitoring than to external demand. **Inflating a metric that is directly monetised is precisely what these standards exist to prevent.**

#### The four things the research added

**1. The right word is "internal traffic", not "invalid traffic".** This matters because it changes what our published methodology should say. The standards keep two separate ideas:

- **Internal traffic** — the publisher's own people (development, testing, governance). Held out *upstream*, before counting. Human, but not audience.
- **Invalid Traffic (IVT)** — split into **GIVT** (list-detectable: bots, spiders, data-centre IPs, pre-fetch) and **SIVT** (spoofing, sophisticated fraud).

So the methodology sentence should be: **"internal traffic — UNI staff and venue owners — is excluded from paid view metrics; bots and crawlers are excluded as GIVT."** Calling our own browsing "invalid traffic" would be the wrong frame and would read badly to anyone who knows the terms.

**2. Yelp does the opposite, deliberately, and it is worth knowing why.** Yelp for Business is the **only** comparable product with public documentation on this, and it **counts owner views by default** — then gives owners a special path ("the square icon with the arrow next to your business name") to open their own page *without* incrementing the metric. So the alternative design is: count by default, provide an opt-out route.

**I would still not copy it.** It puts the burden on the owner to remember a special button, and the failure mode is silent inflation of the number they are paying for. But it means our choice is a real design decision with a real alternative, not the only sane option.

**3. Everyone else is silent.** Google Business Profile, Tripadvisor, OpenTable, Booking.com and Untappd for Business all document their metrics without ever saying whether owner views are counted. That is genuine silence, not evidence either way. **And PBI (Polskie Badania Internetu) has no publicly detailed methodology on internal traffic** — so it cannot be cited as support. Don't let it into the methodology page.

**4. A consideration I had not raised: comparative perception.** An owner will compare our number against Google Business Profile. **Ours will be lower** — partly because we exclude internal traffic and GBP may not, partly because GBP counts map impressions we have no equivalent of. Left unexplained, that reads as "UNI is not working". It has to be framed up front, in the dashboard and in the sales conversation, as *"wyświetlenia przez odwiedzających — bez Twoich własnych wizyt i bez ruchu zespołu UNI"*.

#### Two things this now requires that were not in the original plan

Both are small and neither is optional if we take the standards seriously:

- **A visible label in the owner dashboard.** The standards say internal traffic must be *disclosed*, not merely removed. One sentence under the views figure.
- **A line in the privacy policy.** The GDPR analysis is clean — reading the session to decide not to write a row is processing, but it is part of existing authentication, it *reduces* the data stored, and it aligns with data minimisation; the events table stays anonymous and outside scope. **But the behaviour should be documented in the privacy notice**, which it currently is not.

#### The one thing still genuinely open

The research offers a third pattern I had not considered: **a separate, non-billed counter** — *"wyświetlenia własne (nierozliczane)"* — that increments for an authenticated owner without writing a row to the events table. It keeps the no-identifier rule intact, it solves the *"is the tracking even working?"* worry, and it is honest.

**I would skip it for V1.** It is a second number to explain on a dashboard whose whole design problem is that owners already have too many numbers, and the dashboard label solves the same worry for free. But it is a fair call and it is yours.

**Answer 1: exclusion covers "admin + owner" (recommended, standards-backed), or "admins only".**

Answer: exclusion covers 'admin + owner'

**Answer 2: separate non-billed "your own visits" counter — "skip for V1" (recommended), or "build it".**

Answer: skip for v1

**Read of one ambiguous answer:** you wrote *"fallback PNG **nie**, per venue later"* for the og:image question. Since the option offered was *"fallback PNG **now**"* and "no fallback PNG, per-venue later" contradicts itself, I read this as a keyboard slip for **now**. Say so if not. 

You read it correctly

---

## 1. The four PostHog events, broken down by trigger and value — as you asked

> *"we need to think about value of these events and how they're triggered. If `venue_pin_focused` means it's just onmouseover then it's too many events… On the other hand, the map pin click is worthy of storing."*

**I have to correct the premise first, and the correction is more interesting than the question.**

Neither event is a mouseover. Both are clicks. But **the two names are swapped relative to what they actually do:**

| Event name | Where it fires | What the user physically did |
|---|---|---|
| `venue_pin_focused` | `discovery.js:446`, inside `onCardClick()` | **Clicked a card in the list.** The card then focuses the map pin — hence the name, which describes the *consequence* not the *action* |
| `venue_card_clicked` | `discovery.js:180`, inside `map.on('click', 'venue-pins')` | **Clicked a pin on the map.** Payload carries `source: 'map_pin'` |

So the event called "card clicked" is the map pin, and the event called "pin focused" is the card. That is a bug in naming that would have cost somebody an afternoon eventually, and it means the thing you correctly identified as worth storing — **the map pin click** — is currently called `venue_card_clicked` and lives only in PostHog.

Let us fix it then. We need the events name to correctly reflect the action. If it happens on map, its on map, if on venue tile, its tile (or card). Like if we have the focus, its natural to think of other ways than clicking the button on the tile. 
### 1.1 What the server already knows, and the exact hole in it

`venue_viewed` records `surface`, and `surface: discovery` increments the `CardClicks` counter ("Wejścia z mapy" in the dashboard). So **arrival from /mapa is already counted server-side.**

But the `ViewSurface` enum says the limit out loud, in its own docblock:

> *"Discovery is one value, not three, because the referrer cannot tell a click on a list card from a click on a map pin — /mapa is a single URL."*

**That is the whole finding.** The server knows somebody came from discovery. It cannot know whether they came off the list or off the map. And *"do people find me by scrolling the list or by spotting my pin?"* is a real owner question with a real answer attached — it tells a venue whether its **rank** matters or its **location** matters, which are two different things to fix.

### 1.2 The breakdown you asked for

| Event | Trigger | B2B value | Verdict |
|---|---|---|---|
| `venue_card_clicked` *(really: map pin click)* | Click on a map pin | **High.** "Twoja pinezka" is a discovery route no competitor measures. Currently invisible server-side | **Move** |
| `venue_pin_focused` *(really: list card click)* | Click on a list card | **High**, and it carries `position` implicitly via the card order | **Move** |
| `filter_applied` | Any filter chip change | **Low.** `discovery_searched`, `discovery_category_filtered`, `discovery_empty_results` and `map_area_searched` already carry the full filter set server-side. What this adds is *which chip was touched, in what order* — a UX question about our interface, not a fact about a venue | **Leave in PostHog** |
| `map_toggled` | Mobile list/map toggle button | **None to an owner.** Genuinely useful to *you* — "do mobile visitors prefer the map?" is a product decision — but nobody pays for it | **Leave in PostHog** |

**So: two move, two stay** — not "leave all four", and not "move all four".

Answer: I agree, but now I want the audit of the events. Two separate ones actually, but they intertwine. One for posthog, one for B2B analytics. Verify the name and the action/the trigger and see if these make sense, like if the name actually reflect the action. I said intertwine since some events names will be similar/the same for both channels, few sessions ago I told you about reducing complexity and mental load in that domain.
### 1.3 How to move them without a fifth event type

Don't add two new events. Add **one**, and let it replace the guesswork inside `CardClicks`:

```
POST /analytics/events
{ event: 'discovery_venue_clicked', venue_id: 42, mode: 'map_pin' | 'list_card', position: 4 }
```

Three details that make it work:

1. **`navigator.sendBeacon`, not `fetch`.** The click is immediately followed by a navigation, which kills an in-flight `fetch`. `sendBeacon` is designed for exactly this and survives the page unload. It is also what the impression batching in §1 of v6 will use, so it is one pattern learned once.
2. **No query parameter on the link.** `RequestContext`'s docblock already rejected that route and the reasoning holds: a tracking parameter on internal links creates a second crawlable URL for every venue, which is a real SEO cost for a small analytics gain.
3. **It upgrades an existing number rather than adding one.** `CardClicks` stops meaning "came from /mapa somehow" and starts meaning "came off the map at position 4" — same counter, better provenance.

**Also worth doing while we're in there: rename the two events.** They will be wrong forever otherwise, and they are still only in PostHog, where a rename costs nothing.

**No answer needed** — this is a refinement of your own answer, and it goes into the impressions session alongside the batching. Say so if you want the two names left alone.

I agree with you recommendations, I want it implemented that way, but make sure we noted that in journals. also, do we blacklist any other IP besides ours when gathing events in POST /analytics/events?

---

## 2. Campaigns — yes, A and B merge, and merging fixes B's one weakness

### 2.0 What this is about, from the beginning

> *"here too, you answer the notes, but i want you to add more context here too, like what are you answering."*

**The starting point: UTM parameters.** When you post a link, you can append tags to it:

```
https://undernoinfluence.pl/?utm_source=instagram&utm_campaign=lech-free-karuzela-01
```

The visitor never sees them — they are stripped from the page they land on. But the server reads them on the way in, which is how you learn where somebody came from. It is a twenty-year-old convention that every analytics product understands.

**`utm_source` shipped on 02.09 and is safe.** It is matched against a closed allowlist — `google`, `instagram`, `facebook`, `tiktok`, `bing`, plus `internal`, `direct`, `other`. Anything unrecognised becomes `other` **and the raw text is thrown away.** Nothing a stranger types can reach the database.

**`utm_campaign` is the same field parse and comes free — except for one thing.** A campaign name has no allowlist *by definition*: the whole point is that you invent new ones. So the naive version means **attacker-controlled free text going into the `events` table, which `raw-events-are-kept-not-pruned.md` says we never delete.**

**Why that specific combination is the problem.** Anyone can visit `undernoinfluence.pl/?utm_campaign=<anything they like>`. It costs them nothing. If we store what they typed, they can write arbitrary text into a table we keep forever — someone's name, an insult, a phone number, a paragraph. `FreeTextScrubber` catches e-mails and phone numbers, but it cannot catch "Anna Kowalska", because that is just two words.

**What you actually get in return, so the risk is worth weighing against something.** Today you can learn *"Instagram sent 200 people"*. With campaigns you learn *"the Lech Free carousel sent 180 of them and the Dry January one sent 20"* — **which is the number that tells you what to post next.** Given Instagram three times a week is your entire distribution plan, that is not a nice-to- have.

### 2.1 Your question

> *"is it possible to merge option A and B? Like the pattern plus registered campaigns, like in a filament admin panel? In order to prevent abuse of random campaigns by a malicious user"*

**Yes — and they aren't really alternatives, they're two different guarantees that happen to apply to the same field.** v6 presenting them as a menu was the error.

| | What it guarantees | What it does not |
|---|---|---|
| **Pattern** `^[a-z0-9-]{1,40}$` | **Safety.** No name, e-mail, sentence or injected string can physically survive it. This is a hard boundary, enforced at the parse | Nothing about whether the value is *meaningful*. `?utm_campaign=asdf-asdf` passes |
| **Registry** (a `campaigns` table + Filament resource) | **Data quality.** Only campaigns you created are attributed; a pattern-valid but unknown value buckets to `other` | Nothing about safety — a registry with no pattern still needs the pattern for the unmatched path |

Stacked, the failure modes cancel: the pattern makes the *worst case* harmless, the registry makes the *normal case* meaningful. A malicious visitor spamming `?utm_campaign=xyz-123` produces rows that say `other` — indistinguishable from an untagged link, which is the correct answer.

### 2.2 The part that kills B's "a few minutes per campaign, forever" cost

Registration only feels like a chore if it is a *separate* chore. It isn't, if the Filament resource has a **link builder**: you create the campaign, and the form hands you the finished URL to paste into the Instagram bio or the story sticker.

```
Nazwa kampanii:  Lech Free — karuzela styczniowa
Slug:            lech-free-karuzela-01     ← validated against the pattern here
Kanał:           instagram

Gotowy link:     https://undernoinfluence.pl/?utm_source=instagram&utm_campaign=lech-free-karuzela-01
                 [Kopiuj]
```

You were going to need that URL anyway. Registration stops being an extra step and becomes the step that produces the thing you wanted. The registry maintains itself.

### 2.3 One thing to decide inside it

An unregistered-but-pattern-valid value can be handled two ways: **discard it** (bucket to `other`, lose the attribution), or **auto-register it as unconfirmed** so you can see what showed up and adopt it later. Auto-registering sounds helpful and is a trap — it is Option A wearing Option B's clothes, and it lets a visitor write rows into your campaigns table.

**My recommendation: discard, bucket to `other`.** If you forget to register a campaign you lose that campaign's attribution and learn the lesson once, which is cheap. The alternative is an attacker-writable table you keep forever.

**Answer: "discard unregistered" (recommended), or "auto-register as unconfirmed".**

Answer:discard unregistered

---

## 3. Device and entry source — the full inventory you asked for

### 3.0 What these two things are, and what they are for

> *"same as point 4, more context."*

**`device`** is one of two values: `mobile` or `desktop`. Not a model, not a screen size, not a browser — two buckets. It is read from the `Sec-CH-UA-Mobile` header where the browser sends one, and from a user-agent pattern otherwise.

**`entry_source`** is one of eight values: `google`, `instagram`, `facebook`, `tiktok`, `bing`, `internal`, `direct`, `other`. It answers *"what channel put this person on this page"* — read from `utm_source` first, falling back to the referrer header.

**Why they are buckets and not raw values.** The allowlist **is** the privacy mechanism, not a convenience. An unrecognised referrer host resolves to `other` and the host itself is discarded, so no raw string ever reaches a table we keep forever. It is the same construction as `BotDetector`, and for the same reason.

**Why this is worth spending a session on at all.** These are the two facts that turn a count into a sentence somebody will pay for:

| Without them | With them |
|---|---|
| "Twój profil miał 340 wyświetleń" | "Google przysłał 210 osób prosto na Twój profil, Instagram 90, reszta to nawigacja w serwisie" |
| "Kliknięto wskazówki dojazdu 40 razy" | "38 z 40 kliknięć w dojazd przyszło z telefonu" — czyli ludzie stali na ulicy |

**And they cannot be backfilled.** A referrer that was not read at the time is gone forever. That is why v6 shipped them on the two entry points immediately rather than designing the full thing first.

### 3.1 Your answer, and what it left open

> *"searches too as in add them to `discovery_searched`, also list events where these parameters are present. Check thoroughly if we would need to add them to other events."*

### 3.2 Where they are today — verified, all 24 event types

| Event | `entry_source` | `device` | `surface` |
|---|---|---|---|
| `venue_viewed` | ✅ | ✅ | ✅ |
| `discovery_viewed` | ✅ | ✅ | — |
| everything else (22 types) | ❌ | ❌ | ❌ |

That is the complete truthful picture: **two events out of twenty-four.**

### 3.3 The rule I'd write down, so this never needs re-deciding

Adding them everywhere was rejected in v6 for a good reason (`user_registered` with a device bucket is noise). But "add them case by case" means somebody forgets. A rule fixes both:

> **`entry_source` belongs on an event that can be the *first thing a session does*.** Anywhere else it structurally reads `internal` and tells you nothing.
> **`device` belongs on an event whose answer differs by screen size.** In practice: every entry point, plus outbound clicks.

The first half is not a preference, it is arithmetic. On a mid-session event the referrer is our own domain, so `entrySource()` returns `Internal` **every single time**. Putting it on `venue_menu_viewed` would add a column that is a constant — worse than absent, because it looks like data.

### 3.4 What the rule produces

**Add both** — these are pages a stranger can land on cold:

| Event                       | Why it earns them                                                                                                                                                              |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `discovery_searched`        | Your call, and right — a shared `/mapa?q=` link is a genuine entry                                                                                                             |
| `city_viewed`               | **"Is Google actually sending anyone to /warszawa?"** This is the B1 measurement question                                                                                      |
| `district_viewed`           | Same, and it is the number that tells you whether the district layer is worth the thin-page argument in §4.2                                                                   |
| `category_browsed`          | Same                                                                                                                                                                           |
| `city_category_browsed`     | Same                                                                                                                                                                           |
| `district_category_browsed` | Same                                                                                                                                                                           |
| `discovery_empty_results`   | **The strongest single addition.** "What did people arriving from Instagram search for and find nothing?" is the gap report (`gap-report-in-basic.md`) with a channel attached |
small interjection from me: Do we fight any abuse from malicious users when it comes to query parameters, but most importantly utm? Like could someone abuse the utm_source=instagram and spam it?
Also now that i am thinking about it, what if someone adds a bookmark with utm, then each new entry is taken as instagram or any other source, like we launch a campaign for 'top hot 0% wine' and someone bookmarks UNI's UTM based link in winter and visits even in summer, therefore we see like the campaign still takes people to us while in reality its not like that?
Are such issues handled by other companies, or it's a risk know, accepted and accounted for?

**Add `device` only** — mid-session, but the answer genuinely differs by screen:

| Event | Why device, not entry source |
|---|---|
| `venue_directions_clicked` | "Wskazówki dojazdu" from a phone is somebody standing outside. From a desktop it is somebody planning. **Different products, same counter today** |
| `venue_website_clicked` | Desktop-skewed, and the contrast with directions is the sellable fact |
| `venue_instagram_clicked` | Mobile-skewed for the same reason |
| `venue_maps_clicked` | Same as directions |

`entry_source` on these would be `Internal` 100% of the time — the outbound redirect is always reached from our own venue page.

**Add nothing** — and each for a stated reason, so this list is auditable later:

| Event | Why not |
|---|---|
| `venue_menu_viewed`, `venue_category_viewed` | Browser beacons fired from a page whose `venue_viewed` row *already carries* the device. Adding it duplicates the same fact on the same page view |
| `venue_shared` | Same page view as above |
| `discovery_sort_changed`, `discovery_category_filtered`, `map_area_searched` | Mid-session interactions on /mapa; `discovery_viewed` already carried the entry for that session |
| `venue_report_submitted` | An action, not a visit |
| `claim_submitted/approved/rejected`, `product_proposal_*`, `user_registered`, `user_logged_in` | Account and admin lifecycle. A device bucket here is exactly the noise v6 warned about |

**Net: 7 events gain both, 4 gain device only, 13 gain nothing.** That is a good deal more than your "searches too" answer implies, so I am flagging the expansion rather than doing it quietly — the six landing-page events are the ones that turn "is the SEO working" from a guess into a number, which is why I'd include them.

**Answer: "all of §3.4", "just `discovery_searched` as I said", or "the entry points but not the outbound clicks".**

Answer: all of 3.4, but take into account my notes.

---

## 4. SEO

### 4.1 Producers, brands, and what we show publicly — properly researched this time

> *"your answer is so short, like not based on research or anything. Feel like its incomplete."*

Correct, it was. Here it is with the work done.

**What the three levels actually are.** `producers` → `brands` → `products`, verified in the schema. A producer is the legal company (Grupa Żywiec S.A.). A brand is what appears on the can (Żywiec, Warka, Heineken, Desperados). A product is the specific item (Żywiec 0,0). One producer typically owns many brands, deliberately positioned as if unrelated.

**Verified current state: nothing is exposed.** `producers` has **0 rows**, and the string `producer` appears in **zero** public Blade templates. Brand appears in exactly one place — a small grey chip under a product name on the venue page. So nothing needs undoing; this is a decision about what to build, not what to remove.

#### Is the relationship secret? No — it is legally mandated to be on the packaging

**Regulation (EU) No 1169/2011, Article 9(1)(h)** requires the **name or business name and address of the food business operator** on the label of every food sold to a consumer. A brand name, a website or a QR code does not substitute for it. Non-alcoholic beer (below 1,2% ABV) is fully in scope — it does not even get the partial exemptions that alcoholic drinks get on ingredients and nutrition.

**So the producer of every product in our catalogue is printed, by law, on the can the visitor is holding.** Beyond that it is in KRS, in annual reports, and on the corporate websites. There is no confidentiality argument available to anyone, and no legal exposure in publishing it.

#### Does anyone actually object in practice? Yes — but not to what you think

This is the part worth knowing, because it is specific. Brand-ownership charts are a **completely routine, widely republished genre** — VinePair, Overproof and The Mad Fermentationist all publish large "who owns which beer brand" infographics, updated for years, with no litigation attached to publishing the fact of ownership.

**Where objections do happen, they are about characterisation, not disclosure:**

- **BrewDog** publicly disputes being described as non-independent, on the grounds that TSG bought shares but exercises no control.
- **Boon** publicly objected to being listed as part of a Swinkels sale it says it was never part of.

**That is the actual risk profile, and it is a useful one:** nobody sues you for saying who owns a brand. People get angry when your data model **asserts a relationship that is wrong, or implies a degree of control that is not there.** A flat `producer_id` foreign key does exactly that — it renders "licensed by", "distributed by", "minority investor" and "wholly owned subsidiary" as one identical arrow.

**And we would be wrong often.** The Polish NA market is full of licensed production: a brand brewed under licence in Poland by a company that does not own it, imported brands with a Polish distributor, contract brewing. A single `producer_id` collapses all of that into "owns".

#### The three arguments that should actually decide it

1. **The search demand is not there.** Nobody types "Grupa Żywiec bezalkoholowe". They type "Żywiec 0.0", "Lech Free", "piwo bezalkoholowe Warszawa". A producer page would be a third page type chasing traffic that does not exist — and §4.2 and §3.5 of v6 both established that thin pages on a new domain are a liability, not a neutral.
2. **It is the only part of the catalogue that does not answer a visitor's question.** Somebody deciding what to order does not care who owns the brand. Every other page we build — venue, product, brand, district — answers something a person actually wondered.
3. **The data is worth more to you unpublished.** *"Which six brands do I reach with one e-mail?"* is a B2B outreach tool. Publishing the graph gives that structure away and gains you nothing, at exactly the moment those companies are your prospect list rather than your subject matter.

#### Recommendation

**Keep `producer` internal in V1.** Store it, use it in the admin panel for grouping and outreach, render it on no public page. **And model the link honestly even internally** — a nullable `relationship_type` (`owns` / `licenses` / `distributes` / `unknown`) costs nothing now and is the difference between a fact and an assertion if you ever do publish it.

**Revisit when producers become the customer rather than the subject.** At that point *"we list your entire portfolio in one place"* flips from exposure to a selling point, and you will want the pages — built on a relationship model that is already correct.

**Answer: "producers stay internal" (recommended), "public producer pages too", or "internal, and add `relationship_type` now".**

Answer: producers stay internal. I want our logic by which we directed the decision noted, like in journal and other fitting space so we do not forget. I believe the brands are created for a reason, if legal obligation make the producers write the info who produced what, it is still kind of 'frowned upon' because if not, they would just sell as a producer without multiple brands. 

### 4.2 Brand pages — your quirky-brand objection kills the ≥2 gate, and it deserves to

**Context, because this is three exchanges deep and the thread is easy to lose.**

`brand-and-product-pages.md` (decision record, already taken) says: build a page per product and a page per brand, because there is real search demand for non-alcoholic beer and those pages are how a brand-new domain earns its first rankings. You answered **"before launch"** on it in v6.

Then in v6 §3.1 I raised a problem with it: the catalogue is **12 products across 12 brands — exactly one product per brand.** So "a page per brand" would ship 12 pages that each list exactly one drink, sitting next to 12 product pages describing that same drink. **Near-duplicates competing with each other**, which on a domain with no authority is the pattern Google ignores or soft-404s. My proposed fix was a gate: **only give a brand a page once it has ≥2 products.**

**Your objection, and it is the one that matters:**

> *"I kinda wanna agree, but what if there's some quirky brands owning one product on purpose? We punish them in that option of filtering below 2 products"*

**You're right, and the objection exposes that I was measuring the wrong thing.** The count was never the problem. The problem was **duplication** — a brand page that says nothing its one product page doesn't say. A single-product brand with a real story is not thin; a five-product brand with nothing but a list is.

**So change what the brand page is for, and the gate becomes unnecessary.**

A product page answers *"what is Lech Free?"*. A brand page should answer something a product page structurally cannot:

> **"Which venues near you stock this brand?"**

That is a venue list. It is data no product page duplicates, it is data no competitor has, it changes as the catalogue grows, and it is the same species of content that makes the district pages work. A one-product quirky brand gets a substantive page on day one, because the substance comes from the venues, not from the catalogue.

**Then the only honest gate is the one that mirrors the district rule:**

- Brand has **≥1 venue stocking it** → `index, follow`
- Brand has **0 venues** → `noindex, follow`, same as an empty district, self-healing the same way

No brand is punished for having one product. A brand is only held back for being genuinely absent from every venue we know — which is the same thing an empty district page means, handled by the same mechanism, with the threshold living in config next to `min_venues_for_indexable_district`.

**Answer: "venue-list brand pages, gated on venues not products" (recommended), "≥2 products as originally proposed", or "every brand indexed unconditionally".**

Answer: I want some model written somewhere to which we can reffer to. I want to know what sections are in the brand page. We can have the venues, but we need individual products too. The products higher than the venues. Also the venues need to be sorted by breath (the default sort) and we'd need some filters there i guess? I already hear b2b owners complaining 'why in brand X is sorting like that? I do not appear there!' As for SEO itself, if a brand exists with no product, I feel like it's not supposed to have a public page. We can't in that case show the products nor the venues serving the products/brand. So no page at all i'd say? or for SEO add that? We need proper, thorough research here.

### 4.3 Thin districts — you're right about redirects, I'm withdrawing the suggestion

**Context, same reason.**

`empty-landing-pages-noindex.md` (decision record, already taken, 14.08) says: a district page with too few venues still returns 200 and still serves, but carries `<meta name="robots" content="noindex, follow">` and is kept out of the sitemap. It flips to `index, follow` automatically the moment it crosses `min_venues_for_indexable_district`, which is **3**. That is what is built today and it works.

In v6 §3.5 you asked whether Google "remembers" a page as noindexed even after it qualifies. The answer was: it self-heals, the sitemap is generated live and gains the URL the same instant the tag flips. **But** researching your question surfaced a second-order issue — Google has said a page left `noindex` *indefinitely* eventually gets crawled less, and its outbound links get treated as effectively nofollow. So I proposed replacing the thin page with a **redirect** to the city page until it qualifies.

**Your objection:**

> *"things is I don't trust redirects. I try to minimize them, I feel like it's a temporary solution that becomes permanent. Also doesn't google appreciate even two venues for a district rather than no content at all?"*

**First half: agreed, and I'm dropping it.** A redirect for a condition that flips back and forth is permanent machinery for a temporary state, and your read that temporary redirects become permanent is correct often enough to be a rule. Withdrawn.

**Second half needs a precise answer, because "thin" is the wrong word for what's wrong.**

Google does not dislike two venues. Google dislikes **near-duplicates**, and a district page showing 2 venues that also appear on the city page — same cards, same data, different heading — is one. The cost isn't that the page ranks badly; it's that a *pattern* of near-duplicates feeds the site-wide quality assessment. Which is exactly the reason to protect a domain with no authority yet.

So there are three positions, not two:

| | What it does | Verdict |
|---|---|---|
| Redirect below threshold | Removes the URL until it qualifies | **Withdrawn** — your objection stands |
| **Keep `noindex, follow` at 3** | Page serves, links flow, flips automatically at 3 | **Recommended — no change** |
| Index everything | Two venues indexed on day one | Rejected — that is the duplicate pattern |

**And here is the check that settles your decay worry**, which was the real reason v6 raised this at all.

**What Google actually said, verified.** John Mueller's statement is that a **long-term** `noindex, follow` eventually behaves like `noindex, nofollow` — not because the directive changes, but because Google stops crawling the page at all, and a page it never fetches is a page whose links it never sees. There is no published timeline; it depends on crawl frequency.

**So the decay affects links *out of* the stale page, and the damage case is an "isolated URL" — a page reachable only through a `noindex, follow` parent.** That is what the warning is about.

**We are not in that case, and I checked.** `city/show.blade.php:100` links **every** district, and the city page is indexable and in the sitemap. So:

- Crawl paths **into** a district page come from an indexed hub, not from another noindexed page. Nothing goes isolated.
- Everything a district page links **to** — the venue profiles — is independently in the sitemap and independently linked from the city page and `/mapa`. So even if Google stopped following links out of a thin district page entirely, **no venue would lose its only route in.**

The decay is real. It just has nothing to reach in our link graph.

**Verified numbers, so you're deciding on facts:** 65 active venues today, 18 districts, **11 pass the ≥3 threshold** (Wilanów 8, Białołęka 7, then six at 4, two at 3). After the wipe and the 30 real venues, expect **3–5 passing**. The district layer is mostly dark at launch either way, which is the independent argument for B1 carrying the early SEO load — already your decision.

**Threshold stays at 3.** Lowering it to 2 would add maybe two districts and weaken the duplicate defence at precisely the moment the domain has least authority to spend.

**No answer needed — this confirms your existing decision unchanged.** Say so if you want the threshold moved.

Answer: So for the district page we keep the noindex,follow for <3 venues, above taht we get index,follow? Explain these index, follow and other metatags important for SEO 

### 4.4 Dry January — what "properly" has to mean

You said **build it properly now**, and v6's condition was that it cannot be a stub for four months. Making that concrete so it is buildable rather than aspirational:

- **What Dry January is**, and the Polish framing. The UK-origin name has recognition here, but so does *"suchy styczeń"* — the page has to earn both queries.
- **Why people do it**, honestly. Not a health lecture; the actual reasons — a reset, a bet, a break, curiosity.
- **The venues.** A live list, not a static one. This is what makes it not-a-stub in September.
- **The drinks.** What to actually order, from the real catalogue, by category.
- **What it is not.** Nobody is telling you to quit anything. That is the brand (`faceless-brand.md`) and it belongs on the one page most likely to be mistaken for temperance.

Same URL forever, content refreshed each year, never deleted and recreated. Goes in session 2 with the rest of the SEO surface.

**No answer needed.**

### 4.5 Google Search Console — what it is, then the exact move

> *"What exactly is gsc?"*

**GSC = Google Search Console.** A free Google product for people who own a website. It is not analytics and it does not overlap with what we build — it is the only place you can see **your site from Google's side**:

| What it shows you | Why you cannot get it anywhere else |
|---|---|
| **Which queries you rank for**, at what average position, how many people saw you, how many clicked | Your own analytics can only see people who *arrived*. GSC shows the ones who saw you in results and **did not** click — which is the number that tells you a title is wrong |
| **Which pages Google has indexed**, and for the rest, why not | On a new site this is the difference between "slowly gaining traction" and "silently broken for three months". Without it you cannot tell those apart |
| **When something breaks** — a page that dropped out, a sitemap that stopped parsing, a manual penalty | Nothing else tells you |
| **Which sites link to you** | — |

**Why it matters specifically for the plan you already approved.** `brand-and-product-pages.md` says query data should decide which products earn real photographs later. **GSC is where that data comes from.** Without it, that part of the decision record is unimplementable — you would be guessing.

**"Verification tokens"** are just Google making you prove you own the domain before it shows you any of that. Nothing more.

**Data retention: 16 months.** So there is a cost to waiting — every month before verification is a month of query history that simply does not exist later. It is the same species of loss as the search-presence gap from 02.09.

**Bing Webmaster Tools** is the same idea for Bing's index.

Domain registered at OVH, DNS therefore at OVH. That unblocks it:

1. Search Console → **Add property** → **Domain** (the left box, not URL prefix)
2. Enter `undernoinfluence.pl`, take the TXT string it gives you
3. OVH manager → **Domains → undernoinfluence.pl → DNS zone → Add entry → TXT**
   - Sub-domain: **leave empty** (this is the apex record)
   - Value: the `google-site-verification=…` string
4. Verify. Propagation is usually minutes at OVH; give it up to an hour before worrying.
5. **Leave the record forever** — Google re-checks it, and removing it silently unverifies you.

Domain property (not URL-prefix) because it covers http and https, www and non-www, and every future subdomain in one go. A missed variant on a URL-prefix property is invisible to you, which is the failure mode that matters on a new site.

**Three verified details that make this "do it before you forget" rather than "do it eventually":**

- **The property type is permanent.** You cannot convert a URL-prefix property into a Domain property later. Picking wrong means starting a second property from zero history.
- **Domain properties can *only* be verified by DNS TXT.** The meta-tag and HTML-file methods are URL-prefix only. So this genuinely is the OVH DNS route or nothing.
- **The 16 months is a hard delete, not an archive.** Clicks, impressions, CTR and position are removed permanently once they age past sixteen months — no UI archive, no recovery, no extension. Year-on-year comparison beyond that requires exporting via the GSC API before it ages out. **Same species of loss as the search-presence gap from 02.09: a month not recorded is a month gone.**

**Bing: don't verify separately.** Import from Search Console — one click, ownership and sitemaps included. Worth it less for market share than because **ChatGPT and Copilot read Bing's index**, so it is an AI-visibility question now. **IndexNow** on top of it turns a new venue into minutes rather than weeks on that half of the web. **Verified participant list: Bing, Yandex, Naver, Seznam.cz and Yep — submit to one and they share with the rest. Google tested it in 2022 and declined**, and still does not participate, so IndexNow does nothing for your Google ranking. It is worth doing anyway for the Bing-derived surfaces, which now include ChatGPT and Copilot.

**No answer needed** — this is a task, not a decision. Goes with the deploy.

Answer anyway: Now that I think about the images, if we add images for products/brands, most of the time we can get these from marketing sets from brands. If we go for it, I feel like we don't have to wait for GSC. Also another thing to research well and thoroughly, if we'd get images, even if these are for NA/0.0% options, I feel like some autorities in Poland could alert or punish us for 'promoting alcohol' - my reasoning is that a 0% beer can many times looks identical as 5% beer can, just the alcohol content writting differs, therefore I feel like autorities could have a problem with it. For example in terms of 'ustawa o wychowaniu w trzeźwości' and other legal documents. 

---

### 4.6 og:image — the build constraints, verified

You answered **"fallback PNG now, per-venue later, add to roadmap"**. Nothing to re-decide; these are the facts so it is right first time rather than rebuilt.

- **SVG is not supported as `og:image` by any major platform** — nor are AVIF, WebP, GIF, BMP or TIFF. **PNG or JPEG only.** v6's original SVG plan fails on this, and the correction holds.
- **1200 × 630** is the size that works everywhere: Facebook, X's large card, LinkedIn, Slack, Discord, WhatsApp, iMessage.
- **Keep the headline and anything that must stay legible inside the centre 1080 × 600**, because platforms crop the edges differently.
- **Under 1 MB**, and WhatsApp prefers around 300 KB. A flat-colour branded PNG at this size lands well under that.

**One dependency you have to approve before this can be built, and it is why it did not ship with the deletion.** GD renders text from **TTF or OTF**. The repo contains **only `.woff2`** (`public/fonts/poppins/`, ten files). So a fallback image with real typography means **committing a Poppins TTF to the repository** — around 150 KB, OFL-licensed so redistribution is fine, and it needs the **latin-ext** subset or `ł ą ż ś ę ć ń ó ź` render as boxes.

**Answer: "commit the Poppins TTF" (recommended), or "no new binaries in the repo — use a text-free branded image".**

Answer: what if I prepared the image myself, the static one/ fallback. Or its better to decide now, implement the automated image generation for future automated og:image generation per venue?

---

## 5. The four things you asked me to explain properly

These four are grouped because they are the same kind of thing: **processes that must keep running on a machine you own.** None of them is hard. All of them fail silently, which is why they are worth understanding rather than approving.

### 5.1 The scheduler — what it actually regards

> *"I still don't get the full context, describe what it actually regards and what it does, what are implications etc"*

**The problem it solves.** Some work has no visitor to trigger it. Nobody visits your site to cause last night's numbers to be summarised. That work needs something to say "it's 3am, do the thing" — and a web server never does, because a web server only ever reacts to requests.

**What cron is.** Every Linux server runs a service called `cron` that reads a table of "at time T, run command C". It is decades old, on every box, needs no installation, costs nothing.

**What Laravel does with it.** Instead of one cron line per job — which means SSHing into the server every time you add one — Laravel takes **one** cron line:

```
* * * * * php artisan schedule:run >> /dev/null 2>&1
```

That says "every minute, ask Laravel if anything is due". Laravel then reads `routes/console.php` — a file in your repo, in version control, deployed like any other code — and decides internally. **You touch the server's crontab exactly once, ever.** Adding a job later is a commit.

**What is actually scheduled right now** (`routes/console.php`, verified):

| Job | When | What it does | What breaks if it never runs |
|---|---|---|---|
| `uni:check-offer-freshness` | daily | §5.2 below | Freshness badges lie, and ranking drifts |
| `analytics:roll-up` | 03:10 | Collapses raw events into daily per-venue summaries | Owner dashboards read raw events — slow now, unusable later. **This is the table every report is built on** |
| `model:prune` | daily | Deletes `venue_offer_logs` past 24 months and `audit_logs` past 12 | **Your privacy policy becomes false.** Those tables carry user ids, so the retention horizon is a legal statement, not a preference |

That third row is the one that changes the character of this. Two of these are quality problems. `model:prune` not running is **a document you published that stops being true**, and you would never notice.

**Why "knowing when it stopped" is the part worth designing.** A dead scheduler produces no error, no email, no 500. The site serves perfectly. The freshness badge — the product's central claim — just quietly ages, and the retention promise quietly lapses. You find out weeks later.

**The heartbeat, concretely, under your no-recurring-spend rule.** `schedule:run` writes a timestamp somewhere cheap (cache or a one-row table) on every run. The admin dashboard renders *"Harmonogram: ostatni przebieg 4 min temu"* — green under 15 minutes, red past an hour. Zero cost, zero third party, and it sits on the page you already open daily. An external uptime service does the same job better and costs money forever; this is the version that fits your rule.

**Answer: "cron + dashboard heartbeat", or "cron only for now".**

Answer: cron + dashboard heartbeat. I just wanna note some stuff will be like that, like we are not running cron since its local dev, PC is not on 24/7. Same with fake data on local dev, I feel like you treat local dev too much as a needed 100% reflection of prod. If I understand correctly, we define cron in some php file, that is run once in prod on linux server, then each new cron is just updating the php file and it takes effect?

### 5.2 `check-offer-freshness` — what it repairs and why the frequency matters

> *"still little context. I need to understand it better"*

**Start from the product claim.** Every venue page shows how recently its offer was confirmed. That badge is the single thing UNI sells that Google Maps does not: *"this menu is current"*. It is driven entirely by one column, `venues.offer_updated_at`.

**How that column is normally maintained.** Eloquent observers. Add a product to a venue, the observer fires, `offer_updated_at` moves to now. Correct, automatic, invisible.

**How it breaks.** Observers only fire on model events. **Bulk operations bypass them entirely — and the xlsx importer is a bulk operation.** So during an import, products land in the database while `offer_updated_at` stays where it was. Concretely: you import 30 venues with fresh menus, and every one of them displays *"oferta nieaktualna"* on a page a visitor is looking at.

**What the command does** — three repairs, all verified in `app/Console/Commands/CheckOfferFreshness.php`:

1. **Timestamp drift.** One SQL query compares `offer_updated_at` against the newest `venue_products.updated_at` / `venue_drinks.updated_at`. Where products are newer than the timestamp claiming to describe them, it corrects the timestamp.
2. **Stale freshness streaks.** Clears `freshness_streak_started_at` on venues that no longer qualify — otherwise a venue keeps a "consistently fresh" credential it stopped earning.
3. **Breadth score.** Recalculates `breadth_score` where the stored value disagrees with a fresh calculation. **This one is not cosmetic: `breadth_score` feeds discovery ranking.** A venue with a wrong score sorts in the wrong place.

**So the frequency question is really: how long may a venue display a false badge and rank wrongly?**

- **Daily** → up to 24 hours. During a seeding session that is the entire session, plus the night.
- **Hourly** → up to 60 minutes. Three queries plus a chunked recalculation over ~100 venues. Trivial.

**And there is a live inconsistency to close either way.** The command's own description attribute says **"Runs hourly."** `routes/console.php` says **`->daily()`**. One of them is lying to the next person who reads the code.

**One thing to keep straight, because it changes what "fixed" means.** This command is a **repair**, not a fix. The fix is the importer touching `offer_updated_at` itself. Repair-plus- hourly is fine for V1 — but if the importer is ever fixed properly, this stays as the safety net, not as the mechanism.

**Answer: "hourly", or "daily and fix the description".**

Answer: I feel like hourly, but I am 90% sure. We have made some significant changes across the timeline to the freshness, is_verified badged and other parts of the whole system of menu verifications/holding the menu 'accountable'. Like in the beginning we had 3 badges like silver, bronze, gold etc. Now it is all different. I want to see the exact AS-IS and then TO-BE with the reasoning.

### 5.3 The queue worker — in detail, with the failure it prevents

> *"I still don't understand the role of that queue worker, explain it in detail and with context"*

**The situation it exists for.** A visitor submits a form. Your code needs to send an e-mail. Sending an e-mail means opening a network connection to another company's server and waiting for it to answer — typically 300ms, sometimes 5 seconds, occasionally never.

**Two ways to handle that:**

**`QUEUE_CONNECTION=sync` — do it now, inside the request.**

```
visitor clicks "Wyślij"
  → your code runs
  → connects to the mail provider ... waits ...
  → provider answers
  → page finally responds "Dziękujemy"
```

The visitor's browser spinner is spinning for the whole middle section. And if the provider is down, the exception is thrown *inside the request* → the visitor gets a 500 → **the report is gone.** Not delayed. Gone. They typed it, they sent it, and nothing exists anywhere.

**`QUEUE_CONNECTION=database` — write it down, do it separately.**

```
visitor clicks "Wyślij"
  → your code writes a row to the `jobs` table   (about 2ms)
  → page responds "Dziękujemy" immediately

meanwhile, a separate process that never stops running:
  → picks up the row
  → sends the mail
  → on failure, retries; after the last retry, moves it to `failed_jobs`
```

The visitor is served instantly. **The work is durable the moment it is written** — the `jobs` row survives a mail outage, a deploy, a reboot. A permanently failed job lands in `failed_jobs` where you can see it and replay it with `php artisan queue:retry`.

**"A separate process that never stops running"** is the queue worker: `php artisan queue:work`. Because it must never stop, it needs something to restart it if it crashes or the server reboots — that is supervisor (or a systemd unit). That is the entire operational cost.

**Where the app stands right now, verified.** Exactly four things are queued — `ClaimApproved`, `ClaimRejected`, `VenueErasureCompleted`, `VenueErasureRejected` — **all owner-panel, all dark behind the 404.** And `MAIL_MAILER=log`, so nothing is being sent at all. **In V1 as it stands the queue has literally nothing to do.**

**What changes it is C2 — the report notification you approved.** That is a public form, used by strangers, and it is the *only* channel by which somebody tells you a venue's data is wrong. Which makes the `sync` failure mode exactly backwards: the one message that exists to catch mistakes is the one that gets silently destroyed when the mail provider hiccups.

**The one gotcha nobody mentions, so you hear it now:** a queue worker holds your code in memory. **Every deploy must run `php artisan queue:restart`** or the worker keeps running the old code indefinitely. Put it in the deploy script the day you write the deploy script, not later.

| | `sync` | `database` + worker |
|---|---|---|
| Processes to run | 0 | 1, under supervisor |
| Visitor waits for SMTP | Yes | No |
| SMTP down | **Report lost, 500 shown** | Report saved, retried, visible in `failed_jobs` |
| Deploy step | none | `queue:restart` (mandatory) |

**My recommendation: keep the worker**, for the single reason that losing a report is the exact failure C2 exists to prevent. But it is a real trade — one more thing to keep alive.

**Answer: "keep the worker", or "sync for V1".**

Answer: keep the worker, let us make sure we have the need for restarting queue worker in some 'deploy checklist'. Also, in that case we need SMTP for v1, am I correct?

### 5.4 `pg_dump` — exactly how, on the box

> *"how would that pg_dump work exactly on production sever?"*

**First, a fact that simplifies this: there is no production server yet.** Hosting is still open (§8). The database you cannot afford to lose is the one on **this** box — `pgsql`, `127.0.0.1:5432`, database `undernoinfluence`, user `undernoinfluence_user`. So "the backup before the wipe" is a dump of this machine, and that is entirely sufficient for the thing that is actually blocking you.

**What `pg_dump` is.** A tool that ships with Postgres. It reads a database and writes a file that can recreate it. It takes a **consistent snapshot** — it does not lock the database, the app keeps serving, and the file reflects one single moment even if writes happen during the dump. Nothing needs stopping.

**Set up the password once, so it never lands in shell history:**

```bash
# ~/.pgpass  —  format: host:port:database:user:password
echo '127.0.0.1:5432:undernoinfluence:undernoinfluence_user:YOUR_PASSWORD' >> ~/.pgpass
chmod 600 ~/.pgpass        # Postgres refuses the file if it is readable by anyone else
```

**The dump — this is the command to run before you wipe the 67 venues:**

```bash
pg_dump -h 127.0.0.1 -U undernoinfluence_user -d undernoinfluence \
        -Fc -f ~/backups/uni-$(date +%F-%H%M).dump
```

- `-Fc` — custom format: compressed, and it lets you restore *one table* later instead of everything. Plain SQL (`-f file.sql`) is human-readable but bigger and all-or-nothing.
- The timestamped filename means running it twice never overwrites the first one.

**Verify it before you trust it** — an unverified backup is a feeling, not a backup:

```bash
ls -lh ~/backups/                                    # not zero bytes
pg_restore -l ~/backups/uni-2026-09-04-1430.dump | head -30   # lists what is inside
```

**Restoring, if the import goes wrong:**

```bash
dropdb   -h 127.0.0.1 -U undernoinfluence_user undernoinfluence
createdb -h 127.0.0.1 -U undernoinfluence_user undernoinfluence
pg_restore -h 127.0.0.1 -U undernoinfluence_user -d undernoinfluence \
           ~/backups/uni-2026-09-04-1430.dump
```

**Or restore just one table**, which is the reason for `-Fc`:

```bash
pg_restore -h 127.0.0.1 -U undernoinfluence_user -d undernoinfluence \
           -t venues --data-only ~/backups/uni-2026-09-04-1430.dump
```

**On production later**, the same command becomes a scheduled job with three additions: gzip, encrypt (`gpg --symmetric`), and push to EU-resident object storage pay-as-you-go. Retain 7 daily
+ 4 weekly. **And one documented restore drill before launch, one per quarter after** — that drill is the enforceable half of GDPR Art. 32(1)(d), and "we have backups" without it does not satisfy the article.

**Do the manual dump now.** It takes about a minute and it is the only thing standing between you and an irreversible wipe. The policy is its own session.

**No answer needed** — you asked how, and this is how. The command above is the one to run before the import.

---

## 6. SMTP — what "transactional" means, and the other kinds

> *"pick an EU transactional provider. Btw what is transactional exactly? What are other types and what for?"*

**The word describes *why* the message exists, not what is in it.**

| Type | Triggered by | Recipient's expectation | Example for UNI | Consent needed? |
|---|---|---|---|---|
| **Transactional** | One thing one person just did | They are **waiting for it** | Password reset. "Twoje zgłoszenie zostało przyjęte". "Wniosek o zarządzanie lokalem zatwierdzony" | **No** — it performs the service they asked for |
| **Notification / lifecycle** | A change in their data | Signed up for it | "Ktoś zgłosił błąd w Twoim lokalu". Monthly report digest | No, *if* it is service information and not promotion |
| **Marketing / bulk** | **You decided to send it** | Consented, or it is spam | Newsletter, a campaign about a new feature, an offer | **Yes, prior consent** |

**The Polish line — and I had this wrong in the first draft, so here it is corrected.** I cited **art. 10 ustawy o świadczeniu usług drogą elektroniczną**. That article was **repealed.** Since **10 November 2024** the rule lives in **art. 398 ustawy z 12 lipca 2024 r. — Prawo komunikacji elektronicznej (PKE)**, which also replaced Prawo telekomunikacyjne.

Two things in PKE that matter more than the renaming:

1. **Consent is required per channel, separately.** Under the old regime a single broad "zgoda marketingowa" was commonly treated as covering everything. **Art. 398 requires consent for each means of communication** — e-mail consent does not cover SMS, and vice versa. So if you ever collect a marketing consent, collect it as a named channel, not as a blanket tick.
2. **It applies regardless of the technology used** — automated calling systems or not, the requirement is the same.

Transactional mail sent in performance of a service the person requested is outside this and needs no consent. **The test is not "does it have a discount code" — it is "did they trigger this, or did I decide to send it".** A "monthly report" e-mail that also mentions the paid tier has crossed the line.

**Practical consequence for V1, which is small and good:** everything the app sends today and everything C2 adds is transactional. **You do not need a marketing consent for any of it.** You need one the day you send a newsletter — and on that day it must be an e-mail-specific consent collected at the point of sign-up, not inferred from account registration.

**Why providers separate them, which is the operational reason you care:** they are different deliverability problems. Transactional needs speed and inbox placement and is sent to people who just interacted with you. Bulk needs list hygiene, unsubscribe handling and reputation warm-up. **Sending bulk through a transactional stream is how accounts get rate-limited or suspended** — so if you ever start a newsletter, it goes on a separate stream or a separate product, not through the same key.

**Why not self-host on the VPS.** A brand-new IP address has no sending reputation, and the major providers treat unknown IPs as guilty. You would also be running SPF, DKIM, DMARC, reverse DNS, bounce handling and blocklist delisting yourself, forever, for a handful of messages a week. It is the worst possible ratio of operational burden to volume.

**Candidates that fit your rule** (EU-resident, pay-as-you-go, no contract):

| Provider | Why it fits | Watch out for |
|---|---|---|
| **Scaleway TEM** | French company (Iliad), own European data centres, developer-first, per-call pricing with a small free tier | Smaller ecosystem, fewer integrations |
| **Brevo** (ex-Sendinblue) | Paris HQ, EU residency, generous free tier, good API docs | Prices on **contacts**, not volume — a poor shape for pure transactional |
| **Mailgun EU region** | Mature, EU data centre in Germany | US-incorporated (Sinch group). The data sits in the EU but the controller relationship is with a US company — worth a moment's thought given you have already gone out of your way to avoid that |

**Recommendation: Scaleway TEM**, on your own stated rule — it is the one that is European in ownership as well as in data location, which is the distinction that made you drop OSM and prefer EU-resident hosting. **Verify current pricing at the point of decision**; I am not going to quote numbers that may have moved.

**Whichever you pick, two non-optional follow-ons:** it is an Art. 28 processor, so it needs a **signed DPA** and a **ROPA entry naming it as a recipient** — exactly what was already done for Carto (`carto-named-as-recipient.md`).

**Answer: "Scaleway TEM", "Brevo", "Mailgun EU", or "research further".**

Answer:research further. Ask me for screenshots of pricings. 

---

## 7. `logrotate` — what it is

> *"30 days, also, what is legrotate config?"*

**30 days recorded.** On the tool:

**The problem.** A log file only ever grows. Nginx appends a line per request; Laravel appends on every error. Left alone, `access.log` reaches gigabytes and eventually **fills the disk, at which point the site stops** — Postgres cannot write, PHP cannot write sessions, and the failure looks like nothing you would connect to logs.

**What logrotate is.** A standard Linux utility, already installed on every Debian/Ubuntu/Fedora server. Once a day it reads `/etc/logrotate.d/` and, for each file it is told about:

1. renames the current file (`access.log` → `access.log.1`)
2. tells the writing process to start a fresh one
3. shifts the older ones along (`.1` → `.2` → …)
4. compresses them
5. **deletes anything past the count you set**

**Step 5 is your retention policy.** This is the whole reason it appears in this document: you are about to write *"logi dostępowe przechowujemy 30 dni"* in a privacy policy. That sentence is true only if something deletes them on day 31. `logrotate` is that something. **An unenforced retention statement is worse than a long one** — it is a published claim you are not meeting.

**What the config looks like** — a file at `/etc/logrotate.d/undernoinfluence`:

```
/var/log/nginx/*.log {
    daily              # rotate once a day
    rotate 30          # keep 30 → 30 days of history, then delete
    compress
    delaycompress      # keep yesterday's uncompressed, so it is still greppable
    missingok          # do not error if the file is not there yet
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        [ -s /run/nginx.pid ] && kill -USR1 `cat /run/nginx.pid`
    endscript
}
```

The `postrotate` block matters: without telling nginx to reopen its file, it keeps writing to the renamed one and the "new" log stays empty forever. That is the classic way this is set up wrong.

**One thing that is *not* logrotate's job.** Laravel's own log is handled by Laravel: `config/logging.php` already has a `daily` channel with `'days' => env('LOG_DAILY_DAYS', 30)` — **already 30, already matching your decision.** But `LOG_CHANNEL` defaults to `stack`; check on the production box that the stack actually includes `daily` rather than the single ever-growing `laravel.log`. Two mechanisms, two places, same number — write both into the ROPA.

**No answer needed.** 30 days is recorded; this is how it gets enforced.

Asnwer: add to deploy todo list to check the stack actually includes daily. Add the reasoning to that check in the deploy todo/checklist (same thing i refer to) for each check

---

## 8. OVH — the VAT question is closed, and the VPS is the right one

### 8.1 VAT: confirmed, and it is the good outcome

You confirmed the invoicing entity is **OVH Sp. z o.o., ul. Powstańców Śląskich 9** — the Wrocław company, Polish NIP. **That closes it, and closes it in the best possible way.**

This is an **ordinary domestic purchase**. 23% Polish VAT printed on the invoice. As a non-VAT-registered sole trader you have:

- **no VAT-R to file** (no part C.3, no NIP-UE)
- **no VAT-UE registration**
- **no monthly VAT-9M**
- **no self-accounting of anything**

You pay the gross price and that is the end of it. The whole reverse-charge apparatus in v6 §4.6 applied to UpCloud and is now irrelevant. **The screenshot confirms it independently:** the footer says *"ceny brutto wyświetlane domyślnie zawierają stawkę podatku VAT na terenie Polski"* — a foreign entity invoicing under reverse charge would not be displaying Polish VAT.

**Note the screenshot's own footer says "© OVH SAS"** — that is the group's copyright line on a shared website template and does **not** determine the invoicing entity. Your invoice does, and it says Sp. z o.o.

### 8.2 The VPS you picked: yes, it is enough — with one caveat

**VPS-1 2027 — 2 vCore, 4 GB RAM, 40 GB SSD NVMe, 500 Mbps, Warszawa, 19,20 zł netto/m-c.**

| Resource | Verdict for UNI |
|---|---|
| **2 vCore** | Comfortable. You are serving cached pages and light Postgres queries to hundreds of visitors a day, not thousands per second |
| **4 GB RAM** | Comfortable. nginx + PHP-FPM + Postgres + one queue worker fits in about 1–1,5 GB at your traffic. **With one exception, below** |
| **40 GB NVMe** | Fine for years. Your whole database is a few hundred megabytes at 100 venues. **This is the number that forces backups off the box, which is where they belong anyway** |
| **500 Mbps unlimited** | Irrelevant at your scale, which is the correct kind of irrelevant |
| **Bez umowy terminowej** | **Right call, and it matches your own rule.** 12 months saves 15% — about 35 zł a year — in exchange for locking a V1 validation project into a contract. Not worth it |

**The one caveat: don't build frontend assets on this box.** `npm run build` with Vite is memory-hungry and briefly spikes well past what the rest of the stack leaves free. On 4 GB it can OOM-kill Postgres mid-deploy, which is a genuinely unpleasant way to learn this. **Build assets locally or in CI and deploy the compiled output** — which you want anyway, because it makes deploys atomic.

**On the free backup option** (*Automated Backup Standard, 1,50 zł → 0,00 zł*): take it, it is free. But **it is not a substitute for `pg_dump`.** It snapshots the whole virtual machine. Restoring it rolls back *everything* — including the thirty venues you entered after the snapshot. It is insurance against "I destroyed the server". `pg_dump` is insurance against "I destroyed the data". You need both and they are not interchangeable.

**Total cost of ownership:** 19,20 zł netto → **23,62 zł brutto/month → about 283 zł/year.** Plus the domain, plus pay-as-you-go object storage for backups (pennies), plus transactional e-mail (likely free at your volume). That is the entire infrastructure bill.

### 8.3 Your fear about the Polish location — worth naming, but it is low-impact

> *"that is the cheapest one, first one, last 3 of the 4 vps plans had only UK as vps, today they are not available. My fear is polish could dissapear soon."*

**What you observed is real and worth taking seriously as a signal — but it is a capacity signal, not a closure signal.** Locations going in and out of "available now" on the order form is OVH running out of stock in a datacentre for a given plan size, not a datacentre being shut. Warsaw (WAW) is an established OVH region, not a pilot.

**But the more useful point is that it barely matters if you are wrong:**

1. **Legally, nothing changes.** Poland, Limburg (NL) and Gravelines (FR) are all EU. Your ROPA, your privacy policy and your GDPR position are identical in all three. There is no transfer question, no SCCs, no adequacy decision needed. **This is the whole reason the EU-resident rule exists, and all four listed locations satisfy it.**
2. **Technically, it is imperceptible.** Warsaw → Polish visitor is maybe 5–15 ms. Gravelines or Limburg → Polish visitor is roughly 25–40 ms. On a page that takes 300+ ms to render and paint, nobody notices. It matters for high-frequency trading; it does not matter for a discovery site.
3. **The real cost of moving is rebuilding the box, not the latency.** Which is an argument for something you should do anyway: **write the server setup as a script from day one**, not as a sequence of remembered SSH commands. If provisioning is a file in the repo, moving datacentre is an afternoon. If it lives in your head, it is a lost weekend — and that is true whether you move for capacity, for price, or because something broke.

**So: take Warsaw, it is available and it is the best latency. Treat the location as replaceable rather than as a commitment**, and buy that replaceability with a setup script rather than by choosing differently.

**One thing genuinely worth checking before you order:** whether OVH lets you change VPS location later without rebuilding. My understanding is that a VPS is pinned to its datacentre and a move means a new instance plus a restore — which is exactly the case the setup script covers. Worth a question to their sales chat if you want it confirmed, since you have the tab open.

**No answer needed — this confirms your choice.** Order it when the seeding session is done and you know what you are deploying.
Answer: I dont if I mentioned it, But I will use ploi, the 10$ plan, i am 90% sure.

---

## 9. The Warsaw permit register — your filters make this much better than I assumed

> *"thing is I can actually filter it, so no shop is there, filters are: detal, gastronomia, jednorazowy, na wyprzedaż, organizacja przyjęć. I can also filter by A / B / C."*

**That removes my main objection.** v6's caveat was that the register would be full of `sklep monopolowy` entries. The **`gastronomia`** filter is precisely the on-premise/off-premise split, so the noise is gone before you start. This moves from "worth a look" to "worth building a worklist from".

**How to use the A/B/C axis, which is more interesting than it first looks:**

- **A** (do 4,5% + piwo) — beer-and-cider-only venues. **This is arguably the highest-signal segment for UNI:** a place whose entire alcohol offer is beer is a place where *"and what do you have without alcohol?"* is a live, frequently-asked question, and where one NA tap changes the answer.
- **A+B+C** — full bars. Cocktail-led, which is where the interesting NA work happens (the `receptura własna` house recipes the catalogue already models).
- **B or C without A** — spirit-led, likely restaurants.

**What to build, and it compounds with something you already approved:**

1. Pull `gastronomia`, per district, into a **`venue_candidates` staging table** — name, address, district, permit categories, permit validity dates.
2. **Nothing from it is ever published.** It is a worklist, not content. A permit says a venue exists and sells alcohol; it says nothing about NA offerings, and permits outlive businesses, so a meaningful share of entries are closed venues.
3. **The quick-add page (§5.1 of v6, which you approved) reads from it.** That is the compounding part: seeding stops being "think of a bar, type its name and address" and becomes "tap the next candidate, confirm you're standing in it, add three drinks". Name and address are pre-filled from the register; GPS fills the coordinates; you type only what only you can know.

**On licensing — verified, and it is as good as it looked.** The governing act is the **ustawa z dnia 11 sierpnia 2021 r. o otwartych danych i ponownym wykorzystywaniu informacji sektora publicznego** (Dz.U. 2021 poz. 1641, in force 8 December 2021), which implements **Directive (EU) 2019/1024** on open data.

- **Art. 17 sets free re-use as the general rule** — public-sector information is made available for re-use at no charge by default.
- Re-use is permitted **commercially**, which is the part that matters here.
- The obliged body may attach conditions, most commonly **attribution** of the source and the date.
- **It is not ODbL.** No share-alike, so none of the contamination that made you drop OSM. Nothing we derive from it obliges us to publish our own database under any licence.

**Still check that specific BIP page's stated conditions before anything derived from it ships** — the act sets the default, and the publisher is allowed to add conditions on top of it.

**Answer: "pull it into a candidates table next session", or "park it until after the 30 venues".**

Answer:let us pull it into a candidates table next session. Now I want to address the process of adding new venues by me, like in prod. Let's settle an appropriate name for that process, seeding maybe? As for that process, I currently keep the venues to add to the app in xlsx file. I feel like we can have a better workflow for it in filament. Like quick add and that register would be a part of it. Like having drafts of the venue. Also what about venues that we can add, but have not 0% options, but are in DB and once the NA option is there, it is visible. It comes two way i think, some venues could initially serve NA options, then stop doing so. 

---

## 10. The trend guard — full context, and I found something today that changes it

> *"I do not understand the problem at all here, give me more context please."*

Fair — v6 and v7 both described this in one paragraph as if you already had the picture. Here it is properly, including three facts I only checked today.

### 10.1 What the feature is

Inside the **premium** owner report there is a block called *trending products*. It is meant to tell a venue owner:

> *"Osiem lokali w Warszawie dodało Lech Free do oferty w ostatnich 30 dniach. Ty go nie masz."*

That is a genuinely valuable sentence. It is competitive intelligence a venue cannot get anywhere else, and it is one of the strongest reasons for a venue to pay for the premium tier rather than the free one. It is also a **claim about the Warsaw market**, which is exactly what makes it dangerous.

### 10.2 How it is computed — the actual query

`VenueAnalyticsReportService::trendingProducts()`:

```sql
SELECT vol.subject_id, COUNT(DISTINCT vol.venue_id) AS adopter_count
FROM venue_offer_logs vol
JOIN venues v ON v.id = vol.venue_id
WHERE vol.action = 'product_added'
  AND v.city_id = ?
  AND vol.created_at >= (now - 30 days)
GROUP BY vol.subject_id
HAVING COUNT(DISTINCT vol.venue_id) >= 5
```

In words: **count how many different venues in this city gained this product in the last 30 days, and report it if that number is at least five.**

### 10.3 The problem, stated plainly

**That query cannot tell the difference between two completely different events in the world:**

| What actually happened | What the query sees |
|---|---|
| Eight independent bars each decided, separately, over four weeks, that Lech Free was worth stocking. **Real market signal.** | `adopter_count: 8` |
| You sat down on a Tuesday and typed Lech Free into eight venue records because you were seeding the database. **Your own data entry.** | `adopter_count: 8` |

**Identical rows. Identical number. Opposite meaning.**

And the second one is not hypothetical — it is *literally your next task*. You are about to enter thirty venues, and a popular NA beer will land on far more than five of them, because that is what "popular" means.

### 10.4 Why this is worse than a wrong number

A wrong view count is a wrong number. **This is a wrong number wearing the clothes of a research finding.** The sentence a venue owner reads is *"the Warsaw market is moving toward Lech Free"* — and the honest version is *"the operator of this website typed some things in".*

If a single owner ever works out that the trend was a seeding session — and they will, because the person who runs a bar knows what the bar next door actually stocks — **it does not discredit that one number. It discredits the method.** Everything else in the report becomes "and what else did you make up?" That is a much more expensive failure than being wrong about views.

### 10.5 Three things I checked today, and they change the shape of the fix

**a) The table is completely empty.** `venue_offer_logs` has **0 rows.** So the trending block shows nothing at all right now — this is a loaded gun, not a firing one. You have time.

**b) `user_id` is already recorded on every row.** `VenueProductObserver::productAttached()` writes `'user_id' => auth()->id()` on every single addition. **The raw material to tell "who did this" already exists in the table.** v6 and v7 both implied this needed new data collection. It does not.

**c) The log is only written from one place, and it is the admin panel.** The observer's own docblock says it is *"Called manually from Filament relation managers since pivot tables don't fire Eloquent events"*, and the only callers are `ProductsRelationManager.php:79` and `:98`. The **xlsx importer does not touch it at all.**

That third point is the one that reframes everything:

- **If you import the 30 venues via xlsx**, zero `venue_offer_logs` rows are created, and the trending block stays empty. The trap does not fire — **but the log is now silently incomplete, which is its own problem for every future 30-day window.**
- **If you add products through the admin panel** — which is what the quick-add page (§5.1 of v6, which you approved) will do — every addition writes a row **with your admin user id on it**, and the trap fires exactly as described.

**So the quick-add page and this trap are the same conversation.** Approving one without fixing the other is what would actually cause the failure.

### 10.6 The options, and why this needs you rather than me

| Option                                                  | What it does                                                                                                                          | Cost                                                                                                                                                                                  |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A. Only count additions made by an owner**            | `JOIN users u ON u.id = vol.user_id WHERE u.role = 'owner'`                                                                           | Honest and one line. **But the owner panel is dark in V1, so the trending block would show nothing for the whole of V1** — you would ship a premium feature that is permanently empty |
| **B. Suppress the block until the data is independent** | Return `status: 'insufficient_independent_data'` instead of a number, same pattern as the existing `no_city` / `no_district` statuses | Honest, cheap, reuses a pattern already in the code. The block says "not enough independent data yet" instead of lying                                                                |
| **C. Change what the number claims**                    | Stop calling it a *trend*. Say **"12 lokali w Warszawie ma ten produkt w ofercie"** — a stock fact, true no matter who typed it in    | Keeps the feature useful in V1. Loses the "moving toward" framing, which is the part that sells                                                                                       |
| **D. Exclude bulk sessions heuristically**              | Ignore rows where the same user added the same product to many venues inside a short window                                           | **I would not do this.** A heuristic that is wrong sometimes, in a number you sell, is the same failure with more machinery                                                           |

**My recommendation: B and C together.** Present the honest stock fact — *"ilu lokali w Warszawie ma ten produkt"* — permanently, because it is always true. Keep the *trend* framing behind option B's gate, so it appears only once additions are genuinely coming from more than one hand. That way the premium block is useful on day one and the strong claim arrives when it is earned.

**But this is a product decision about what you are willing to sell, not a technical one**, which is exactly why I am not choosing it for you.

**Answer: "B + C" (recommended), "B only", "C only", "A", or something else.**

Answer: Let us go over that feature and the problem again while having in mind we do not lauch owner panel in V1. We care about gathering enough and proper events. You said in option A that the cost is "Honest and one line. **But the owner panel is dark in V1, so the trending block would show nothing for the whole of V1** — you would ship a premium feature that is permanently empty", but trending block would show nothing for the whole of V1 is not a problem i guess? Let's talk about it.

### 10.7 The separate, quieter problem

Whichever you choose, **the importer not writing `venue_offer_logs` is a hole.** The table is supposed to be the record of how a venue's offer changed over time — it feeds the trend block, and `model:prune` keeps it for 24 months as personal data with a justified horizon. An import that silently writes nothing to it means the history has a thirty-venue gap that can never be reconstructed.

Same species as the `offer_updated_at` drift in §5.2: **the repair exists, the fix does not.**

**No answer needed — flagged so it is not a surprise when the first 30-day window looks wrong.**

Answer: so if we got a problem, why no answer needed? Why not base the trends on the venue_offer_logs where the would be some column with adding_method or some better fitting name that say if its import, owner added it manually or admin added it manually. If admin adds manually, its still a trend if it reflects the new product in some venue, isn't that correct?

While we're at it, as for the 'top products this month', what if that feature was 'top products this X' where X is 30 months, 7 days, quarter etc? Research that idea, assess it and address it. Then tell me about it without coding yet.

---

## 11. What I'd do with the next three sessions

Reordered from v6 given today's answers.

1. **Both guards, the dump, then the import.** The internal-traffic exclusion (§0) and §10's trend guard, then `pg_dump` (§5.4), then wipe and import the 30 real venues. **Pull the quick-add page (§5.1 of v6, approved) in front of the import** — it changes how fast every subsequent seeding session goes, and §9's candidate list makes it compound.
2. **The SEO surface, in one pass.** Product pages, venue-list brand pages (§4.2), `/faq`, glossary, `/kontakt`, `/suchy-styczen` built properly (§4.4), the fallback og:image, GSC verification (§4.5). **The catalogue is the long pole, not the code.**
3. **Impressions and the deploy.** The batching from §1 of v6, the two moved discovery events (§1.3) plus the rename, campaigns (§2), the device/entry-source expansion (§3), the report notification and SMTP (§6), the scheduler cron and heartbeat (§5.1), then hosting.

---

## 12. Open questions, collected

Everything that still needs you, in one place:

| § | Question | My recommendation |
|---|---|---|
| 0.1 | Exclusion: admins only, or admins **and** owners? | **Both** — IAB/MRC and ABC both back it |
| 0.1 | Separate non-billed "your own visits" counter? | **Skip for V1** |
| 4.6 | Commit a Poppins TTF for og:image rendering? | **Yes** |
| 2.3 | Unregistered campaign values: discard, or auto-register? | **Discard** |
| 3.4 | Device/entry-source scope: all of §3.4, just searches, or entry points only? | **All of §3.4** |
| 4.1 | Producer relations public — and add `relationship_type`? | **Internal only, with the type field** |
| 4.2 | Brand pages: venue-list gated on venues, ≥2 products, or unconditional? | **Venue-list, gated on venues** |
| 5.1 | Scheduler: cron + heartbeat, or cron only? | **Cron + heartbeat** |
| 5.2 | Freshness check: hourly, or daily? | **Hourly** |
| 5.3 | Queue: worker, or sync? | **Keep the worker** |
| 6 | SMTP provider? | **Scaleway TEM**, verify pricing |
| 9 | Permit register: pull next session, or park? | **Pull it** |
| 10.6 | Trending products: what do we do about the seeding trap? | **B + C** |

---

*Answers can be one word. Anything answered here becomes a decision record and is acted on in the session it belongs to.*

---

## 13. Sources

Everything in this document is either verified against our own code (file and line given inline) or sourced below. **Two claims in the first draft were wrong and are corrected above:** the Polish marketing-consent statute, and the IndexNow participant list.

**Analytics and measurement standards** — via the external research pass, [`research-results/analytics-self-exclusion.md`](research-results/analytics-self-exclusion.md): IAB/MRC Audience Reach Measurement Guidelines; IAB Ad Impression Measurement Guidelines; ABC Web Traffic and Website/App Reporting Standards; MRC Invalid Traffic Detection and Filtration Guidelines (GIVT/SIVT); Yelp for Business support documentation on page visits and owner views. **PBI (Polskie Badania Internetu) has no publicly detailed internal-traffic methodology** and is deliberately not cited.

**Polish law**
- [Ustawa z 11 sierpnia 2021 r. o otwartych danych i ponownym wykorzystywaniu informacji sektora publicznego, Dz.U. 2021 poz. 1641](https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20210001641) — in force 8.12.2021, implements Directive (EU) 2019/1024; art. 17 sets free re-use as the general rule
- [Prawo komunikacji elektronicznej — art. 398, marketing consent per channel, in force 10.11.2024](https://www.prawo.pl/biznes/prawo-komunikacji-elektronicznej-zgoda-na-dzialania-marketingowe,534839.html) — replaced art. 10 UŚUDE, which is repealed ([practitioner summary](https://mojafirma.infor.pl/biznes/prawo/rodo-w-firmie/7518377,zgody-marketingowe-po-10-listopada-2024-r-co-zmienia-prawo-komunikacji-elektronicznej.html))

**EU law**
- [Regulation (EU) No 1169/2011 on food information to consumers](https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=celex%3A32011R1169) — art. 9(1)(h), mandatory name and address of the food business operator on the label

**SEO**
- [Verify your site ownership — Search Console Help](https://support.google.com/webmasters/answer/9008080?hl=en) — Domain property is DNS-TXT only; property type cannot be changed later
- [Google: long-term noindex will lead to nofollow on links](https://www.seroundtable.com/google-long-term-noindex-follow-24990.html) — Mueller; and [Sitebulb on the isolated-URL failure case](https://sitebulb.com/hints/indexability/isolated-url-only-found-via-a-noindex-follow/)
- [Which search engines support IndexNow](https://indexnowtool.com/indexnow/supported-search-engines) — Bing, Yandex, Naver, Seznam.cz, Yep; [Google tested and declined](https://pressonify.ai/blog/indexnow-instant-indexing-press-releases-2026)
- [OG image formats and dimensions](https://previewog.com/og-image-guide/) — SVG/AVIF/WebP unsupported; 1200×630; centre safe zone

**Brand ownership disclosure precedent**
- [Tracking brewery purchases — The Mad Fermentationist](https://www.themadfermentationist.com/2019/12/tracking-brewery-purchases-crafty-beer.html) — BrewDog and Boon objections are to characterisation of control, not to disclosure
- [VinePair craft brewery ownership chart](https://vinepair.com/booze-news/craft-brewery-ownership-chart/) — the genre is routine and long-running

**Transactional e-mail providers**
- [European transactional email providers compared](https://eualternative.eu/categories/transactional-email/)
- [Scaleway TEM as a European alternative](https://eurotools360.eu/en/2026/04/02/analysis-and-opinion-about-scaleway-tem-as-a-european-alternative/) — French, Iliad group, own EU datacentres

**Polish VAT** — settled by your own OVH invoice (OVH Sp. z o.o., Polish NIP, 23% shown), which is better evidence than any of the general guidance consulted earlier.
