# UNI Vault Review
**Date:** 2026-04-17
**Reviewer:** Claude (on behalf of Pawel Milewski)
**Purpose:** Cross-reference all vault documents against the actual running codebase and session journals. Identify what's accurate, what's stale, what's missing, and what needs rethinking.

---

## Overall Assessment

The vault is **strategically strong and tactically outdated**. The thinking behind the product — the business model, the growth strategy, the anti-gaming decisions — is excellent and holds up. The feature specs are detailed and well-reasoned. But the technical docs are already out of sync with the code after just two working sessions, and several critical systems that exist in the codebase have no vault representation at all.

The vault is best read as a **product vision document**, not a technical reference. Treat it accordingly.

---

## What's Very Good — Keep and Protect

### Strategic thinking

**Business Model** is airtight. No ads, no pay-to-rank, no data sales — the decision to avoid these isn't just ethical, it's the product's core value proposition. Data authority is hard to rebuild once compromised. The three-tier analytics approach (internal → free owner → paid B2B) gives a clear monetization ladder without paywalling anything that would hurt data quality. This document should not change without significant deliberation.

**Growth Strategy** is the most realistic growth plan for a solo founder-built B2B marketplace. Systems-based growth (SEO, venue-driven sharing, physical touchpoints) is exactly right — it scales without headcount. The explicit "NOT doing" list (social media, personal branding, paid ads, blog) is particularly valuable because it prevents context-switching. Every time you feel tempted to post something, the vault should push back.

**Cold Start Playbook** (CEIDG → enrichment → 50-80 venues → SEO → table cards) is a proper sequenced strategy. Importantly, it establishes a quality threshold: 80+ venues in one city before expanding. This prevents the "5 cities with 15 half-empty listings" failure mode that kills data directories.

**ADR-004 (Binary Checkmark)** and **ADR-006 (No Reviews V1)** are correct calls. Tiers add cognitive load you can't afford at low venue counts. Reviews need volume to be meaningful. Flagging works from day one. These should stay as-is.

**ADR-008 (6 Flat Categories)** is solid. The specific categories chosen (Piwo, Wino, Spirytusowe, Koktajle, Cydr, Napoje musujące) cover the actual NoLo market well. The decision to track the effectiveness of this taxonomy post-launch rather than guess upfront is correct.

### Feature specs

**Freshness Decay** is the most original and valuable feature in the product. The per-item reconfirmation (no batch "confirm all") is a smart friction design — it prevents the mental shortcut of tapping "done" on everything without thinking. Differentiating decay rates by product stability (staples 90d, seasonal 30-45d) is practical. This spec is thorough and should remain the reference implementation guide.

**Verified Checkmark** transparency design is smart: disclose inputs, hide weights. This makes gaming expensive without requiring the formula to be secret. The "absence, not failure" display principle (no "unverified" label, just no checkmark) is correct — you don't want to penalise venues that simply haven't been onboarded yet.

**User Flagging** — activity-gated weight is good anti-spam design. A brand new account's flag counts less than an established user's. This is worth keeping.

**Analytics Overview** — the GDPR approach is clean and correct. First-party server-side logging with ip_hash, no cookies, legitimate interest basis — this is compliant and cookieless without sacrificing data. The "zero problem" tracking (searches that return no results) is particularly valuable for venue recruitment prioritisation.

**Venue Rules** — the HoReCa definition is clear, the grey-area guidance is sensible, and the minimum listing requirement (1 product in 1 category) prevents empty profiles from polluting search results.

---

## What's Out of Sync — Needs Updating

### Tech Stack.md — multiple errors

**Livewire version is wrong.** The file says "Livewire 3" — the project runs **Livewire 4**. This matters because v4 has breaking changes in component syntax, event handling, and lifecycle hooks. Any developer reading this file will start with the wrong mental model.

**Fix:** Change "Livewire 3" to "Livewire 4" throughout.

---

**MaryUI** is listed as a key package but its actual presence in the project is unconfirmed. It appears in the vault but not in the session journals or installed packages. If it's not installed, remove it. If it's planned, mark it explicitly as "planned, not installed."

---

**`app/Domain/` services directory** is referenced ("Controllers are thin, business logic in `app/Domain/` services") but does not exist in the codebase. The project currently puts logic in controllers and models directly. Either create this structure intentionally or update the architecture principle to reflect what's actually being done.

---

### Discovery Page.md — URL structure is aspirational, not real

The spec says the URL is `/warszawa` (city-scoped). The actual implementation uses `/venues` with an optional city filter parameter. The venue profile spec says `/warszawa/lokal/{slug}` — the actual route is `/venues/{venue:slug}`.

This is not just a documentation issue — **the URL structure matters for SEO**. City-scoped URLs like `/warszawa` are more likely to rank for "lokale w Warszawie" queries than `/venues?city=warszawa`. The current implementation trades SEO power for simpler routing.

**Decision needed:** Commit to either the city-scoped URL structure (requires routing refactor now, before SEO indexing begins) or update the spec to document the current `/venues` approach. Do not leave this ambiguous — once Google indexes `/venues`, you'll pay a migration cost later.

---

**Credibility score doesn't exist yet.** The Discovery Page spec references `ORDER BY credibility_score DESC` as the default query. There is no `credibility_score` column in the `venues` table. The query currently has no meaningful ordering. Every venue appears in arbitrary order for users.

This is the most significant functional gap between spec and implementation. The credibility score is also referenced in:
- Discovery Page (default sort)
- Map View (bounding box query ordering)
- Venue cards (display on tiles)
- Verified Checkmark (feeds into checkmark calculation)

The entire trust signal system depends on a formula that hasn't been started. This should be the next major backend task after the venue detail page.

---

**Discovery Page interactivity is not Livewire-reactive.** The spec describes hover interactions (card hover highlights pin, pin hover scrolls list to card), category filter pills as live-updating, and a general reactive UI. The implementation uses a GET form — no Livewire, no live reactivity. Filters require a page reload.

The ADR-005 chose GET form for indexability, which was correct. But the spec still describes behaviours (hover interactions, smooth scrolling) that require JavaScript regardless of the form approach. These aren't mutually exclusive. The spec needs to distinguish between:
- Server-side reactivity (filters/search) → GET form, shareable URLs ✓
- Client-side micro-interactions (hover highlights, scroll-to-card) → Alpine.js, still possible with GET form

Update the spec to clarify that the interactive hover behaviours are Alpine.js driven, not Livewire reactive, and that the GET form decision doesn't eliminate them.

---

### Analytics Overview.md — model name and event schema differ

The vault shows `AnalyticsEvent::create(...)` with fields `event`, `properties`, `session_id`, `user_id`. The actual database table is called `events`, the model is presumably `Event`, and the fields are: `type`, `properties`, `session_id`, `user_id`, `venue_id`, `city_id`, `product_id`, `ip_hash`, `referrer`.

The spec also doesn't include the actual event types that are firing: `venue.list.viewed`, `venue.show.viewed`, `venue.map.pin.clicked`, `venue.navigate.clicked`, `bot.honeypot.triggered`.

Update Analytics Overview with the actual table/model name, field names, and the current event type catalog.

---

### Venue Profile.md — URL and missing schema columns

URL spec is `/warszawa/lokal/{slug}`. Actual: `/venues/{slug}`. Same URL structure issue as Discovery Page — same decision needed.

The header section mentions "Venue type label (Restauracja, Bar, Pub)" — there is no `venue_type` column in the database. This feature cannot be built until the column is added and the enum defined. The technical debt log in the journals acknowledges this.

---

### Homepage.md — page doesn't exist

The vault has a full Homepage spec (trust signals, city entry, owner CTA, one-screen design). The actual `/` route redirects to `/venues`. There is no homepage. This means:
- The first impression for someone landing on `undernoinfluence.pl` is a discovery list, not a value proposition
- There's no owner acquisition entry point
- No context for what the product is for new visitors

Whether this is intentional ("get users into the data immediately") or a deferral, it should be documented as a decision, not left as an implicit omission. The homepage spec is good — the "trust signal first, city entry second, owner CTA below the fold" structure is correct. But building it has been deprioritised by focusing on the core discovery mechanics first.

---

## What's Missing from the Vault Entirely

### AI Scraping Protection (needs a new doc)

The codebase has a four-layer scraping protection system that doesn't exist anywhere in the vault:
1. `robots.txt` blocking 11 named AI crawlers by name
2. `X-Robots-Tag: noai, noimageai` HTTP header via middleware
3. Coordinate fuzzing ±0.0005°/±0.0007° (~55m) in VenueController
4. Honeypot `/export/venues.json` — returns 404, fires `bot.honeypot.triggered` event

This is a meaningful defensive architecture decision and should be documented as ADR-009. The rationale (NoLo data is rare and labor-intensive to collect, its value depends on it not being freely bulk-exported to competitors or AI training sets) is worth capturing.

---

### Canary System (needs a new doc)

Canary venues are seeded in the database specifically to detect scraping. If their names appear in a competitor product, dataset, or AI-generated content, it constitutes proof of data theft. This is a legally meaningful design decision.

**The vault should not contain their names or slugs.** If this file is ever shared, exported, or indexed, the canary names must not be in it — that would defeat their purpose. The vault note should say: "canary venues exist, see journals/README.md for the register." The specifics stay in the journals only.

The canary venues must never be deleted, renamed, or publicised.

The journals README has a "Canary Register" section. The vault should link to that register or duplicate the critical warning.

---

### Security Architecture (needs a new doc or section in Tech Stack)

Beyond scraping protection, there are security decisions not captured anywhere:
- Rate limiting on `/api/track` (60 requests/minute)
- CSRF protection on the tracking endpoint
- IP hashing (not storing raw IPs) for GDPR compliance
- Honeypot endpoint as a canary rather than a wall

These are architectural choices, not implementation details, and belong in a new doc or a security section in Tech Stack.md.

---

### Session Journals (should be referenced in vault)

The journals system exists in `journals/` and captures every working session in detail. The vault has no pointer to it. New developers, future collaborators, or Pawel returning after a break should know to check the journals for the ground truth on what's actually been built vs what the vault specifies. Add a note in UNI Home.md.

---

## What Should Be Done Differently

### The vault needs a "spec vs implementation" status field

Right now, every feature spec reads as if it's implemented. None of them have a build status. Someone reading "Discovery Page.md" has no way to know which parts are live and which are aspirational.

**Proposed approach:** Add a status line to each feature spec:
```
Status: Partially implemented — search + city filter live, credibility_score sorting not started, hover interactions not started, tag filters UI not started
```

This prevents the vault from becoming misleading as the gap between spec and implementation widens over time.

---

### Tag status is confused

Tags are listed as "Post-V1" in Features Index. But the codebase has:
- `tags` table (migration exists)
- `product_tag` pivot table (migration exists)
- `Tag` model with `products()` relationship
- `Venue::scopeWithTags()` scope already written

The backend is ready. Only the UI is deferred. The vault should reflect this distinction — "tags backend: implemented, tags UI: Post-V1" — rather than treating tags as entirely deferred.

---

### Credibility Score needs a spec before implementation

The formula is referenced everywhere but defined nowhere. Before writing the algorithm, the formula needs to be explicitly specified:
- What inputs does it use? (product count, freshness aggregate, flag rate, is_claimed, view count, navigate clicks?)
- What are the weights?
- What's the range? (0-100? 0.0-1.0?)
- Is it computed on demand or stored in a column?
- How often does it update?

Writing a stored column that gets recomputed via a nightly job is different from computing it in a query on every page load. The choice has performance implications at scale. Write the spec in the vault before the implementation starts.

---

### The `venue_products.is_available` column is not enough for freshness

The current schema has `venue_products.is_available` (boolean) and `venue_products.created_at / updated_at`. But the Freshness Decay spec requires:
- `confirmed_at` — when was this product last explicitly reconfirmed by the owner?
- `decay_rate` — how many days until this item expires? (staple vs seasonal)
- A computed or stored freshness status (Fresh / Decaying / Expired / Flagged)

The current pivot table can't support the freshness system as specified. A migration is needed before freshness can be built. The Technical Debt Log in the journals flags this, but it's not reflected in the vault.

---

### Umami is referenced but not mentioned as installed

Analytics Overview.md says "Umami (self-hosted) for public-facing website." The journals don't mention Umami being set up. Either it's installed and not mentioned, or it's planned but not started. Clarify in the vault.

---

### Przelewy24 is listed under Key Packages

Tech Stack.md lists Przelewy24 as a key package "when B2B subscription launches." Listing a payment provider as a "key package" when it's not installed and monetisation hasn't started is misleading. Move it to a "Planned/Future" section.

---

## Summary Table

| Document | Status | Priority Fix |
|---|---|---|
| **UNI Home.md** | Accurate overview | Add journals pointer |
| **Tech Stack.md** | Livewire version wrong, MaryUI unconfirmed, `app/Domain/` doesn't exist | Fix Livewire version immediately |
| **Brand Overview.md** | Accurate | No changes needed |
| **Business Model.md** | Accurate and excellent | No changes needed |
| **Analytics Overview.md** | Model name, field names, event catalog all differ from actual code | Update to match actual implementation |
| **Discovery Page.md** | URL wrong, credibility_score unimplemented, interactivity model needs clarification | Add implementation status line |
| **Freshness Decay.md** | Schema not ready to support this | Note that `confirmed_at` and `decay_rate` columns are missing |
| **Verified Checkmark.md** | Excellent spec, credibility_score dependency not implemented | No changes to thinking; note dependency |
| **Homepage.md** | Page does not exist in codebase | Add deferral status |
| **Map View.md** | Generally accurate, CartoDB dark layer may not be active | Verify in browser |
| **Venue Profile.md** | URL wrong, `venue_type` column missing, page is skeleton | Add implementation status |
| **Venue Claiming.md** | Not started | Add "Not started" status |
| **Owner Dashboard.md** | Not started | Add "Not started" status |
| **User Flagging.md** | Not started | Add "Not started" status |
| **Product Reference Database.md** | Not started | Add "Not started" status |
| **SEO Landing Pages.md** | Partially started (meta tags, JSON-LD on index) | Add partial status |
| **Static Pages.md** | Not started | Add "Not started" status |
| **Features Index.md** | Tag status confused (backend done, UI deferred) | Clarify per-component status |
| **Growth Strategy.md** | Accurate, excellent | No changes needed |
| **All ADRs** | Accurate, decisions still stand | No changes needed |
| **Venue Rules.md** | Accurate | No changes needed |
| **Custom Drinks Rules.md** | Not started | Add "Not started" status |
| **Decisions Log.md** | Missing ADR-009 (scraping protection) | Add new ADR |

---

## Recommended Immediate Actions

1. **Fix Livewire version in Tech Stack.md** — change "Livewire 3" to "Livewire 4" everywhere.

2. **Add implementation status to every feature spec** — a single line at the top of each feature doc. This takes 20 minutes and prevents the vault from becoming misleading.

3. **Write ADR-009: AI Scraping Protection** — the decision exists in the codebase, the reasoning is sound, it should be documented.

4. **Write a Credibility Score spec** — before any implementation starts. Define inputs, weights, range, update frequency, and storage strategy.

5. **Make the URL structure decision** — `/warszawa` vs `/venues?city=warszawa` is a fork with SEO consequences. Decide before Google indexes either structure.

6. **Add `confirmed_at` and `decay_rate` to `venue_products`** — the freshness decay system is specified and valuable, but the schema can't support it yet.

7. **Add a vault note about the journals system** — so future readers know where to find ground truth on what's actually been built.

---

## What This Vault Does Well That Most Products Don't

For the record: having this vault at all, at this stage, is unusual and valuable. Most early-stage projects make decisions by accident. UNI has documented why it chose binary checkmarks over tiers, why it doesn't do social media, why it captures analytics first-party, why it uses GET forms for search. When something feels wrong six months from now, you'll be able to re-examine the reasoning rather than guess.

The ADR format in particular is worth continuing. Every major decision going forward should get its own ADR. The architectural decisions made in sessions (defer() vs queue, GET form vs Livewire, coordinate fuzzing location) should be added retroactively as ADRs — they're the same quality of decision as what's already documented.

Keep the vault. Keep the journals. Keep them in sync.
