---
version: 3.0 (archived)
owner: Paweł Milewski
updated: 2026-08-30
answered: 2026-08-31
status: superseded by decisions-waiting-on-you.md v4 — kept for the answers written inline
---

> **Archived on 31.08.** This is version 3 with Paweł's inline answers, exactly as written on
> the commute of 30–31.08. It is kept unedited because the answers contain reasoning that the
> v4 summary compresses, and because several of them raise questions that are still open.
> **Do not answer in this file** — v4 is the live one.

# Decisions waiting on you

Everything here is blocked on your judgement, not on work. Each entry says what the question is,
what it costs to get wrong, and what I would do — so you can settle it with one word and I can act
on it next session.

Version 1 collected the open questions from the journals of 18–24 August; you answered it on the
commute of 24.08. Version 2 recorded those answers. **This version is the state after the four
sessions of 30.08**, which closed four of the previous entries outright, closed half of three
more, and opened a different kind of question: the earlier ones were about the product, most of
the new ones are about the business.

Every factual claim below was re-checked against running code, the database and `.env` on
**30.08** — not copied from another document. Where a claim is a verification, the file and line
are named so you can challenge it.

> **Section letters changed in this version.** Answer by the new ids (A1, B1, …); the old ones
> are listed in section D so you can see where each went.

> **If you only have ten minutes:** read **A** and **B1**. A is the last remaining place where
> waiting destroys something. B1 decides whether the pricing conversation is even pointed at the
> right customer.

---

## A. Armed — fires on the day the scheduler is switched on

**Verified 30.08: there is still no cron entry on this machine** (`crontab -l` is empty), so
nothing has been pruned, ever. That is the only reason this section is a decision and not a
post-mortem. The moment the scheduler is installed, `model:prune` runs daily and three tables lose
their tail on the first run:

| Table | Window today | What the rows are |
|---|---|---|
| `venue_offer_logs` | **6 months** | Your dispute record — who put a product in a venue, when |
| `audit_logs` | 12 months | Admin actions |
| `venue_stats` | 24 months | Daily per-venue counters |

Raw `events` are no longer on this list: retention is ten years since today
(`config/analytics.php:12`), so **the 15.09 deadline no longer exists.**


answer:
We do not prune, serverside analytics and events do not store any personal data, no identifiers, we can keep that as long as we want to. I'd say better to remove the pruning mechanism. If we needed it later, we will create it from scratch since the context might change in a way that will render the current implementation useless anyway. 
### A1 · The three prune windows, in one answer *(carried from v2 A2 — still unanswered)*

`venue_offer_logs` is the one that matters. It exists to answer "who added this and when" when an
owner disputes a listing — and that dispute arrives *later* than six months, not sooner, because
that is how long it takes a listing to reach someone who disagrees with it. Six months guarantees
the record is gone precisely when it is first needed.

Two second-order points, both verified today:

- Unlike `events`, these rows carry `user_id` and therefore **are** personal data. Whatever number
  you pick needs a written justification in the ROPA, and `EraseVenueAction` has to clear them.
- `audit_logs` at 12 months and `venue_stats` at 24 are defensible as they stand. I am listing
  them so the answer covers all three at once and never has to be revisited under time pressure.

**What I'd do:** `venue_offer_logs` to **24 months**, the other two unchanged.
**Answer: "24 months", another number, or "leave all three".**

Explain in greater detail each table, for example venue_offers_logs is a set of data regarding what did the venue add to their menu and when?

Answer:
If pruning is required, but we can still legally keep the data for 24 months, we do that. That mechanism is needed from V2 if not V3 since we don't allow accounts in v1, right?

### A2 · Do not install the cron until A1 is answered

Not really a question, but it is the order of operations that turns A1 from a decision into a
loss. The scheduler is otherwise ready — `analytics:roll-up` runs at 03:10, the pruner at 03:40,
in that order, which is the correct order and was the one thing session 1 caught in the 28.08 plan.
**Answer: nothing needed — this is a reminder, not a question.**

---

## B. Blocks the first money conversation

New in this version. Session 2's market research is the cause, and none of it is settled.

### B1 · The revenue lines are in the wrong order in three documents

Every company in the researched set that makes money from data of this shape makes it from
**producers**, on an annual subscription, on aggregates with no identifiers: Untappd Insights,
Vivino, Tastewise, Similarweb, Sensor Tower. **None of them sells analytics on its own to a single
small venue** — Untappd attaches it to a menu, Trustpilot to review invitations, HappyCow to
promotion, TheFork to bookings.

`business/model.md`, `pricing.md` and version 2 of this file all assume the opposite order.

The producer line has a second advantage I did not have in mind when the session started: **it is
the only one that does not depend on site traffic**, only on the catalogue. It is therefore the
only thing sellable *before* the cold-start problem is solved.

**What I'd do:** adopt **producers → chains → single owners**, and rewrite the three documents in
one pass. **Answer: "flip it", "keep the current order", or "separate session".**

Answer: As much as data for producers seems appealing, I'd want to prepare for each type of product we make. We don't know yet if we will strike gold with monthly subscriptions for venue owners or yearly reports for producers. We can lean a bit more towards producers, but we cannot abandon monthly subs for venue owners untill real market shows us when we launch. Also the current shape of the application is focused on venue owners, like the freshness cycle, incentive for b2b etc. We might have to think if we need some modifications to accommodate the reports for producers, maybe adding some new data gathering etc. 
### B2 · Three different prices are written down (T-30d)

79 PLN/mo for Basic in version 2 of this file, ~30 zł in the 28.08 note, and "Tier 2 permanently
free" in `analytics-three-tiers.md`. Three numbers cannot all be true, and the first sales
conversation held on the wrong one cannot be taken back.

**What I'd do:** settle it in a session of its own, and do the **event inventory** first — which
event lands in which tier, and what each one costs to produce. Pricing without that is guessing.
**Answer: "next session", a date, or "after the inventory".**

Answer:

"Next session"
### B3 · What is the panel we sell as methodology?

A producer's insights buyer asks about method in the first conversation. "67 venues across 25
cities" is not an answer; "300 venues in three Warsaw districts, audited monthly" is.

**What I'd do:** narrow deliberately — depth in a defined area beats thin national coverage, and it
also makes the seeding work finite. **Answer: "three districts, monthly", or your own shape.**

Answer:
We aim at seeding one city first to a greater degree rather than entire country with one venue per city. We aim at around 60 venues for v1, but hope it grows.
### B4 · Do we ever sell venue lists as sales leads?

OnTrade Insight does it in Benelux, and it is legal — company data, not personal data. But if
owners discovered their venue was sold to a brewery's sales rep, the trust position that the whole
product rests on is gone in one afternoon.

**What I'd do:** never, and write it down publicly on the venue-facing page when that page exists.
**Answer: "never, and say so" or "keep the option".**

Answer: 99% sure never sell it, but not 100%, sometimes ground shaking events might alter it.
### B5 · "Return visitor rate" is promised and cannot be built (T-30h)

`business/model.md` lists it in Tier 3 and `tech/analytics.md` still lists "Return visits:
pseudoID" under planned events. After the identifier decision there is nothing to compute it from.
It will surface in the first sales conversation, from a document we wrote.

**What I'd do:** drop it permanently and correct both documents.
**Answer: "drop it" or "keep it as a V2 promise".**

Answer:
Drop it
### B6 · The single-owner subscription needs a tool attached to it

The research is unambiguous that pure analytics does not sell to a small venue — Google Business
Profile gives them something similar for free, with real traffic behind it. What sells is a tool
with analytics attached: the menu card, the freshness badge, a gap report.

**What I'd do:** treat the owner subscription as *"your card, kept correct"* with numbers included,
not as a numbers product. That also changes what the owner panel has to be.
**Answer: "attach it to the card", "analytics only", or "decide with the panel toggle".**

Answer:
So we're not sure the subscriptions sell or just the free tier is pointless? In paid I'd add suggestions, info like "add beer 0%, it's demand rised 50% this quarter". The higher the tier, the more info. Cheaper one recommends category, more expensive proposed actual items.
But if I understand correctly, we'd have to lean more towards adding more tools for the owners regarding that data?

---

## C. Legal and privacy, still open

### C1 · Web-server access-log retention is a `TODO` (T-30f) — highest-value item in this file

This is **the only thing that genuinely undermines the identifier decision.** The `events` table is
anonymous in isolation. It stops being anonymous if a production access log with IP, user agent and
timestamp sits next to it, because the two join on time and path. `compliance/ropa.md:113-121`
describes that log and leaves retention as `TODO`.

Nobody would notice the problem, because it lives in a different file from the analytics.

**What I'd do:** a short, enforced retention — **14 days** — written into the ROPA and configured on
the server the day hosting is chosen. It costs nothing and it is what keeps the whole privacy
position true. **Answer: "14 days", another number, or "decide with hosting".**
 Answer:
 So the logs are pruned after 14 days, and the legal basis here is legitimate interest? We need to research and make sure 14 days is not too long or too short of a period.
### C2 · Raw search text is kept for ten years (T-30g)

`properties->query` stores exactly what was typed. People type anything into a search box,
occasionally including something identifying, and retention is now ten years.

**What I'd do:** reject at write time — the same place `BotDetector` already runs — anything
matching an e-mail or phone-number shape, and cap stored query length. Small, and it keeps the
"there is no personal data in this table" claim literally true rather than nearly true.
**Answer: "add the filter" or "leave it".**

Answer: add the filter. While we're at the topic, currently the bounce is 300ms? Does it mean the search terms are in db in cut fashion? If someone types slowly "piwo bezalkoholowe wola" we might now store "piwo ", "piwo bezalko", "piwo bezalkoholowe", "piwo bezalkoholowe wola" for a single search. 
### C3 · The privacy policy still cannot be finished

Section 6 was rewritten today and now names Scaleway, OpenFreeMap and PostHog, with fonts served
from our own server and the ODbL attribution added. **The hosting provider and the panel operator
are still described generically, because neither has been chosen.** That sentence has to name them
before the first real visitor, so the hosting decision is now the last blocker on a launch-critical
document. **Answer: when you want to make the hosting decision.**

Answer: I'm 90% sure upcloud will be the hosting. The privacy policy will need it's own session.
### C4 · DSA Art. 16 is the owner-panel decision in disguise *(carried from v2 D6)*

Unchanged. Art. 16 binds hosting services; V1 is browse-only with admin-entered content, arguably
not hosting third-party content at all. That changes the moment the owner panel or product
proposals are exposed. The erasure mechanism is complete; what is missing is a front door for an
owner without an account — and e-mail is a working front door, since the obligation is a route and
a response, not a form. Not lawyer-verified.

**What I'd do:** publish a monitored address in the privacy policy, document the workflow and an
SLA, treat the form as an upgrade. **Answer: "address and workflow now" or "build the form".**

Answer: it's better to be prepared for that, but let us write down in detail the points where art. 16 comes in. Where exactly do we need to see the possibility of illegal content? In what exact ways do we allow for the workflow to exist? Just an email, or form? 
Product proposals are verified always, I understand art 16 is applied when users can post anything without moderation? Art 16 to prevent the illegal contents by moderating what is posted or required a mechanism for everyone to be able to report illegal contents?

---

## D. Settled since version 2 — listed so you can see it, not re-open it

| v2 id | Question | How it was settled on 30.08 |
|---|---|---|
| **A1** | Raw event retention vs. the 15.09 prune deadline | **Ten years**, and the deadline is gone. The table holds no identifier, so nothing legally required 90 days — `raw-events-are-kept-not-pruned.md` (D-30c). The rollup was built anyway, because it holds what `venue_stats` cannot: attention per drink category, and search terms with their zero-result counts |
| **B1** | Whether `discovery_searched` stores the venues it returned | Shipped — and the firing rule was fixed in the same pass: analytics fires on intent, never on a keystroke (`analytics-fires-on-intent-not-on-keystroke.md`) |
| **D2**, partly | Brand and product pages | **In, and they are now the main SEO surface** (D-30f). Search demand exists for products, not for venues. No photos at the start — a photo is a separate copyright from the product in it |
| **D3**, partly | Campaign tracking | Standard UTM confirmed; the server-side landing counter is now the default shape for everything, since consent no longer gates the backend |
| **D5** | Captcha vendor | Answered by shipping: own bot filtering, rejected at write time, no vendor, no new data recipient (D-30l). Turnstile stays a later swap if abuse appears |
| **D9**, partly | Provenance logging | `source_url` and `checked_at` added across four tables (T-30a closed). The remaining gaps are in E6 |
| — | Identifiers of any kind | **Never** — no rotating hash, no fingerprint, no session key (`no-identifier-based-deduplication.md`). The reasoning, and the CJEU ruling that supports the sales side of it, is in journal session 2 |
| — | Filter combinations in the index | `noindex, follow`, canonical to the plain city map (D-30g). This settles the *indexability* half of pre-launch item 1 |
| — | CEIDG | Stays outside the application as a prospect list; addresses come from the venue's own page (D-30h) |
| — | The photo requirement on custom drinks | Retired for V1 (D-30e) |
| — | PostHog region | Verified, not decided: `.env` says `eu.i.posthog.com` |
| — | `uni_filtered_venues.csv` | Out of the repo — untracked and ignored, verified today. The local copy is harmless research material; nothing left to do |

---

## E. Still open, cheap, and verified as still true today

### E1 · Search ranking — which venue is first for "Lech"? *(v2 C1)*

Unchanged, and re-verified: `VenueQuery.php:116-119` still orders by `breadth_score`, then category
diversity, then drink diversity, then **alphabetically by name**. So a 40-product venue holding one
Lech still outranks a smaller venue built around it, and the final tiebreak still quietly rewards
names starting with A.

**What I'd do:** rank by **count of matching products** when the term matches products, and replace
the alphabetical tiebreak with **most recently confirmed offer** — that one is defensible when an
owner asks why they are seventh. **Answer: "fix both", "matching count only", or "leave it".**

This gets sharper with B1 answered: selling *"you appeared in 340 searches"* invites *"so why am I
seventh?"*, and the answer has to exist before the first invoice.

Answer: I need to check the code how it is exactly implemented right now. It needs more attention and view of the code, right now I'm commuting and can't answer directly. 

### E2 · Does `verified_at` get a job or get deleted? *(v2 C2)*

Verified today: written by the admin edit action (`EditVenue.php:78`) and by `EraseVenueAction`,
read by nothing public. Still the genuinely dead column.
**What I'd do:** drop it, unless you would display *"weryfikowany od {date}"* publicly.
**Answer: "drop it" or "first verification, shown publicly".**
Answer: you provided little context, I can't even understand the problem clearly.
### E3 · Country names — `intl` or the hardcoded list *(v2 C3)*

Unchanged: `app/Support/CountryCodes.php` is still the list, used in seven Filament files (forms
and tables, for brands, producers and products) and zero public views. ICU 76.1 on this machine returns correct Polish names. ~15 lines plus an
override array, and the blast radius is you. **Answer: "use intl" or "keep the list".**


Answer: is intl going to be supported and running well on upcloud server? Which option is more future proof?

### E4 · Which discovery tile wins *(v2 C4)*

Still comparing; `split` is still live in `config/uni.php:69`. Choosing kills three things at once —
the losing skin, `split`, and the toggle. No cost to leaving it.

Answer: need time to decide 
### E5 · Freshness cron cadence *(v2 A3)*

Still `daily` in `routes/console.php:7`, still unanswered. It is a repair job, not a producer job —
nothing user-visible expires because of it. **What I'd do:** keep `daily` and amend D-13 to add
*"run `uni:check-offer-freshness` immediately after any bulk import or direct-DB write"*, which is
strictly safer than hourly for the failure mode you actually have.
**Answer: "daily plus the import rule", "back to hourly", or "keep daily, nothing else".**

Answer: I need more context here, what does that cron exactly do?
### E6 · The `added_by` vocabulary is still corrupted

Verified: the check constraint on `venue_products` still allows `seed` **and** `seeder`,
`venue_owner` **and** `owner`. Today's data only uses one of each pair, so normalising costs one
migration now and costs a report that silently splits its own counts later. Also still missing:
row-level `added_by` on drinks, and an admin UI for the offer log — without which the promised
ten-second dispute answer does not exist. **Answer: "normalise and add the relation manager" or
"leave provenance alone".**

Answer: again too little context, what is they check constraint, what is it all about allowing seed and seeder etc? Describe it better.
### E7 · Final sign-off on the seven filter parameter names

Pre-launch item 1. Much cheaper than it was, because those addresses are now `noindex` and will
never be in the index — but shared links still break. Open questions: does `wlasciciel` still match
"Zarządza właściciel", and is `zero` legible or should it be `bez-alkoholu`?
**Answer: "they're fine" or the renames.**

Answer: there are still no links shared, so no links are broken, seems like you perceive the app as in prod, we have not yet launched. Is właściciel a part of url? Same with zero? Extend the context 
### E8 · Minimum venue count before a district page is indexable

`empty-landing-pages-noindex` handles empty pages, not thin ones. **Proposal: three.**
**Answer: "three" or another number.**

Answer: let us discuss it, do some research, we need a reason it's 3, why not 5, 10 or 2?

### E9 · One report button or two?

"This is my venue" vs "something is wrong" — the public form is at `/miejsce/{slug}/zglos` and the
tables behind it already exist. **What I'd do:** one form, one select, one column. Two buttons is
two queues and two habits to maintain. **Answer: "one" or "two".**

Answer: each one answers different need. You assume "something is wrong" is to be used by b2b, but such button could be used by end user because it's broad. Such button feels like problem report, like illegal content, it's not saying "menu is wrong". We need to think it thorough. Does DSA apply here? Do we need route for reporting to be compliant here?

---

## F. The repository decision — now blocking other work

### F1 · Fresh repository or rewritten history, and where the docs live

Two questions that have to be answered together, and they gate three other things: production
secrets (the credential has been in `phpunit.xml` since **29 April**, "First working version", and
entered the history three weeks earlier, on 5 April, through `.env.example` — two files, two dates,
both true. It sits in `DB_PASSWORD`, and it was not added later, which is the part that matters), the
commit ids cited across the journals (T-30e — every one of them dies in either operation), and
anything that touches history afterwards.

**What I'd do:** fresh repository, old one kept private as an archive with its address written into
the documentation; `docs/` stays in the same repository. Review the journals for cited commit ids
**before** the operation, not after. **Answer: "fresh" or "rewrite", and "docs stay" or "docs split".**

Answer: we start fresh, give me a guide on how to do it cleanly and properly 
### F2 · Splitting the docs by app surface *(v2 D8)*

Recommendation unchanged: **no directories** — decisions cut across surfaces, and filing under one
hides them from the other. Add a `surface:` front-matter field and generate a grouped index. The
real need underneath is not a docs need: *"does the admin panel do what V1 requires?"* is a
checklist — one file, every resource, needed-at-launch yes or no.
**Answer: "field plus checklist" or "split the directories".**

Answer: I remember the problem through a fog, give me a bit more context here before deciding.

---

## G. SEO surface — the rest of the page decisions *(v2 D2)*

Brand and product pages are decided and are now the main surface (section D). These are the
remainder, and they are one decision about how much surface to add before launch. None is built:
verified today, the public surface is `/`, `/o-nas`, `/jak-to-dziala`, `/regulamin`,
`/polityka-prywatnosci`, `/mapa`, `/kategoria/{slug}`, the city cluster (`/{city}`,
`/{city}/{district}`, `/{city}/{category}`) and the venue pages with their report form.

| Page | My recommendation |
|---|---|
| **`/faq`** | **Yes.** It already exists buried inside `/jak-to-dziala` — move it out, add `FAQPage` structured data, leave a link behind |
| **Glossary — what NOLO means** | **Yes.** 0.0% vs ≤0.5%, mocktail, virgin, dealcoholised. Definitional content ranks well and ages slowly. Must match `abv-trust-model.md` and `category-taxonomy.md` exactly |
| **`/kontakt`** | **Yes** — one form, a subject selector routing to the report or erasure queue. It also gives C4 its front door, and it is where B4's promise gets published |
| **`/suchy-styczen`** | **Yes, permanent, not seasonal.** A permanent URL accrues authority all year; one published in December ranks in February. Check actual Polish search volume before committing to the slug |
| **Mission page** | **No.** `/o-nas` is the mission page. A separate `/misja` splits authority between two pages that drift apart |
| **Blog** | **No.** A blog is a commitment to publishing, not a feature. Your SEO need is structural, and Instagram and TikTok are already the cadence you committed to |

**Answer: which of these are in for V1.**

Answer: we will do as you proposed here 

### G1 · Product photography, when it comes

Own photography or written permission from the brands. Both are legal; they differ in effort, and
the decision record already forbids taking product shots from shops.
**Answer: "our own", "ask the brands", or "later".**

Answer: I lean towards not implementing images since it increases complexity with a risk of having no returns in here. We'd need to make sure there is something to gain. 

---

## H. Paused, listed so they are not forgotten

- **Poppins as the brand typeface** — open since 15.08. No cost to leaving it. ANSWER: I need to see the actual website with different fonts, but I'm 80% sure we stay with Poppins 
- **Owner panel exposure in V1** — now load-bearing for three things: the DSA question (C4), the
  "Tier 2 only" rule that removes the need to build plan gating at all, and B6. Turning it on later
  costs one flag; turning it off after owners have used it costs trust. - answer: off in v1, v1 is focused on gathering analytics data. If we see inquiries from owners for managing the venues, that triggers V2.
- **Plan gating** — leave it. The commercial risk is not the missing gate but the clawback. The
  cheaper protection while the panel is unexposed is to ship Tier 2 only. - answer: give me more context here, then I can decide 
- **Addendum to `admin-recorded-claims-v1.md`** — best written at the same time as the toggle. Answer: I need more context here too
- **Map polish** — the `dark` style is still an unmodified OpenFreeMap copy and the record calls for it darkened and desaturated; `/mapa` and the venue page have not been looked at on a phone. Both  are work, not decisions, so they live in the journal backlog — mentioned here only because they are the two things that would embarrass a launch. Answer: I will have a look. I want to try to adjust the maps to our branding now that it's possible. 

---

*Answers can be one word each. Capture them in `Phone notes/` if it's easier — they'll be turned
into decision records and acted on next session.*



Additional notes:
Feature idea for V2/V3, when we have end users accounts, let them click a button in the menu of a venue that sends a request to the venue asking if it is actually available, or if it undermines UNI since we're supposed to provide that info, some other way of interacting with each menu item. It's all for us to be able to track interest in each product of the menu within single venue. 