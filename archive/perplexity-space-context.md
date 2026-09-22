# Under No Influence (UNI) — Full Project Context

## What UNI Is

Under No Influence is Poland's first dedicated NoLo (No/Low Alcohol) venue discovery platform. It answers one simple question: **"Where can I find good non-alcoholic drinks near me?"**

Not cheap 1-euro beer 0% from a dusty fridge. Real, curated, quality non-alcoholic drinks — the kind you'd choose because you want them, not because you're settling.

The platform has two sides:
- **Consumer side (B2C):** A map-based discovery tool where users search for venues by drink category, district, and freshness of data
- **Venue owner side (B2B):** A self-service panel where bar/restaurant/cafe owners claim their listing, manage their non-alcoholic drink menu, and access demand analytics

**Market:** Poland (Warsaw first, then Gdansk or Krakow). Polish language. HoReCa sector.

**URL:** undernoinfluence.pl

**Launch target:** Live with 50-60 real Warsaw venues by early June 2026.

---

## The Problem We Solve

### For consumers:
- There is no centralized, reliable source of which venues serve quality non-alcoholic beer, wine, spirits, cocktails, cider, or sparkling drinks
- Google Maps doesn't categorize venues by NA drink offerings
- Social media recommendations go stale instantly
- Existing food/drink apps treat "non-alcoholic" as an afterthought filter, not a primary discovery axis
- People end up at venues with one dusty Heineken 0.0 and nothing else — no way to know in advance what the actual selection looks like

### For venue owners:
- Venues investing in NA offerings have no way to reach customers actively seeking them
- The NA drink market in Poland is growing fast (Peroni 0.0%, Beavertown Lazer Crush, Lyre's, Seedlip, etc.) but venues can't signal their investment to the right audience
- No demand data exists — owners fill their NA menu blindly without knowing what people actually search for
- Owners can't justify expanding their NA selection to distributors/management without knowing how many people want it

---

## Who Uses UNI — Target Audience

UNI serves anyone who actively seeks out venues with quality non-alcoholic drink options. These are not people who "don't drink" — they're people who choose not to drink in a particular moment but still want the experience of a thoughtful, well-made beverage.

### Core Personas:

**The After-Work Professional (25-40)**
An accountant, developer, marketer who wants to unwind at a bar after work with colleagues but doesn't want alcohol tonight. They want a proper NA craft beer or a well-made mocktail — not sparkling water or Coca-Cola.

**The Designated Driver**
Part of a friend group going out. Everyone else is drinking. They don't want to sit there with a boring soft drink — they want a real drink experience without the alcohol. Where do they go?

**The Pregnant Woman**
Cares deeply about what goes into her body, but still wants to socialize at bars/restaurants with friends. Needs to know *exactly* what's available before making the trip.

**The Health-Conscious / Athlete**
Watches alcohol intake as part of a broader health or training regimen. Not anti-alcohol ideologically — just making a conscious choice today. Wants quality options, not afterthoughts.

**The Sober-Curious Explorer**
Experimenting with reducing alcohol. Discovering that "not drinking" doesn't mean "not going out." Wants to explore what's possible in the NA space.

### What unites them all:
They've already made the decision. They're not looking for reasons not to drink — they're looking for **where to go**. UNI is the answer, not the persuasion.

---

## How It Works — Consumer Side

### Discovery Page (`/szukaj`)
An interactive map (Leaflet.js) plus a filterable venue list. Users can:
- Filter by **6 drink categories:** Beer (Piwo), Wine (Wino), Spirits (Destylaty), Cocktails (Drinki), Cider (Cydr), Sparkling (Musujace)
- Filter by **district** (normalized Warsaw dzielnice: Mokotow, Srodmiescie, Praga Polnoc, etc.)
- Filter by **verified status** (show only venues confirmed by their owner)
- Sort by **breadth score** (how diverse the NA offering is), name, or distance

### Venue Profile (`/miejsce/{slug}`)
Each venue has a dedicated page showing:
- Address, map, venue type (bar, restaurant, cafe, pub)
- A visual **breadth chart** — colored squares per category showing exactly how many products they have in each drink category
- Full list of specific NA products (e.g., "Peroni Nastro Azzurro 0.0%, Paulaner Weissbier 0.0%")
- Custom house drinks (mocktails, virgin cocktails, NA spirit-based drinks created by the venue)
- **Freshness badge** — binary indicator showing whether the data has been confirmed within 90 days
- **Verified badge** — indicates the venue owner has claimed their profile and actively maintains it
- Nearby venues within 1km

### Programmatic SEO Pages
- **City page** (`/warszawa`) — stats, district grid with venue counts
- **District pages** (`/warszawa/mokotow`) — all venues in that district sorted by breadth score
- **Category pages** (`/kategoria/piwo`) — all venues with at least one product in that category

---

## How It Works — Venue Owner Side (B2B)

### Onboarding Flow
1. Owner discovers UNI (via `/dla-lokali` landing page, cold email with demand data, Instagram, or seeing their venue already listed)
2. Registers at `/panel/register` (free, 30 seconds)
3. Submits a **claim request** selecting their venue and verification method (email/phone)
4. UNI team reviews and approves within 1-2 business days
5. Owner gets full panel access to manage their listing

### Owner Panel Features
- **Product Management** — Attach products from a curated global catalog of NA drinks (organized by category). If a product isn't in the catalog, propose it for admin review.
- **Custom Drinks** — Add house-made cocktails/mocktails with name, description, and category (Mocktail, Virgin Classic, NA Spirit-Based, etc.)
- **Freshness Confirmation** — Periodically confirm that products are still available. This resets the 90-day freshness clock and maintains the "Verified" badge.
- **Analytics Dashboard** (Phase 2) — View counts, directions clicks, category demand in their area

### The Engagement Loop
The freshness model creates a natural engagement cycle:
1. Owner claims venue and adds products → gets "Verified" badge → higher visibility in search
2. After 90 days without confirmation → badge drops → visibility decreases
3. Owner logs back in, confirms products → badge restored instantly
4. This incentivizes owners to keep data current without UNI needing to nag them

### B2B Value Proposition
The core pitch to venue owners: **"Stop filling your 0% menu blindly."**

UNI gives venue owners:
- **Free visibility** to customers who are already looking for exactly what they serve
- **Demand intelligence** — what NA categories people search for in their district (Phase 2, but the data is being collected from day one)
- **Competitive context** — how their NA offering compares to others in their area
- **Zero cost, zero commission** — the basic listing is permanently free

### Cold Outreach Strategy (Planned)
Email template concept: data-led, not sales-led.

Example approach: *"82 people searched for NA wine in Mokotow this month. Your venue is listed on UNI but you don't have any wine 0% in your profile. Want to add your full offering? It takes 2 minutes and it's free."*

The insight drives the action. Not "please sign up for our platform" but "here's data about your customers that you're missing."

---

## The Scoring System

### Breadth Score
The core ranking signal. Measures how diverse a venue's NA offering is across all 6 categories:
- Counts total distinct products + custom drinks
- Each product counted once regardless of quantity
- Stored as a denormalized indexed column for fast sorting
- Auto-recalculated when products are added/removed

A venue with 5 beers, 3 wines, 2 cocktails, and 1 spirit (breadth=11, 4 categories) ranks higher than one with 11 beers (breadth=11, 1 category) — though category diversity is a tiebreaker, not part of the main score in V1.

### Freshness (Trust Signal)
- Binary: **Fresh** (confirmed within 90 days) or **Stale** (not confirmed)
- Driven by `offer_updated_at` timestamp, auto-touched when products/drinks change or when owner manually confirms
- Fresh venues get "Zweryfikowany" (Verified) badge
- Stale venues lose badge immediately but can restore it instantly by confirming

### Verified Badge
A manually-set admin toggle indicating UNI team has independently verified the venue exists and its data is accurate. Separate from freshness (automated) and claimed status (owner action).

---

## Key Product Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Badge system | Binary (Verified or nothing) | Simpler than tiers, can't be gamed, instantly understandable |
| URL structure | Polish slugs (`/miejsce/`, `/warszawa/`) | Polish SEO priority, no locale prefix needed |
| Venue images | None in V1 | Moderation burden, no demand signal, chunk visualization is the visual identity |
| Opening hours | Not stored | Google Maps is SSOT for this; stale hours damage trust more than missing hours |
| Scoring formula | Flat category count, no weights | Simple, not gameable, iterate based on real data |
| Freshness threshold | 90 days binary | Clear rule, creates urgency for owner updates |
| Language | Polish only for V1 | Focus on one market, avoid premature i18n complexity |
| Map markers | Color-coded dots (not inline chunk bars) | Mobile zoom makes small visualizations illegible |

---

## Monetization Strategy

### Phase 1 (Current — Data Accumulation, Free)
**Everything is free.** The goal is:
- Seed 50-60 carefully researched Warsaw venues with accurate NA drink data
- Get venue owners to claim and maintain their listings
- Build organic traffic via programmatic SEO (city/district/category pages)
- Build Instagram following with consistent content (3x/week)
- Establish data authority — the most complete, most current NA venue database in Poland

**Why free first:** The data flywheel must spin before monetization makes sense. Charging venues before the platform has user traffic gives them no reason to participate. Charging users before the database has comprehensive data gives them no reason to visit.

### Phase 1.5 (Transition — Low-Friction Revenue)
Before building a full premium tier, introduce small paid features that test willingness to pay:
- **Highlighted listing** — small monthly fee for a subtle visual boost on category/district pages
- **Priority freshness alerts** — notify owners via email/SMS when their badge is about to expire (free users get no reminder)
- **Custom badge/label** — "Specializes in NA Cocktails" or similar category emphasis on their listing

The goal: validate that venue owners will pay *anything* before investing in a full analytics dashboard.

### Phase 2 (After Product-Market Fit — Full Premium)

**B2B Premium Tier** (~50-200 PLN/month, pricing not final — based on average Polish HoReCa SaaS benchmarks, to be validated):
- Advanced analytics: views over time, directions clicks, saves, category demand in their neighborhood
- Comparative insights: "Your NA beer selection is top 3 in Mokotow"
- Demand signals: "47 users searched for NA wine in your district this month — you carry 0 wines"

**Promoted Placement** (pay-per-impression or flat monthly):
- Venues can pay for featured position within category/district pages
- Clearly marked as "Promowany" — transparency is brand-critical

**API Access** (B2B/enterprise, speculative — requires market validation):
- Sell access to the verified NA venue database for:
  - Delivery apps wanting to add "NA drinks nearby" features
  - NA drink brands wanting distribution intelligence ("Which Warsaw bars DON'T carry our product?")
  - Tourism/lifestyle apps wanting NoLo venue data

**Brand Sponsorships** (speculative — requires traffic volume):
- NA drink brands (Peroni 0.0%, Lyre's, Seedlip, etc.) sponsor category pages
- "Beer 0.0% brought to you by Peroni Nastro Azzurro" on the beer category page
- Natural fit: brands get visibility among their exact target audience

### Revenue Model Logic
The **data moat** is the monetization foundation:
1. Accurate venue data → consumer traffic → venue owners see value → owners pay for analytics/promotion
2. Comprehensive database → API value → enterprise customers pay for access
3. Category authority → brand attention → brands pay for sponsorship placement

---

## Promotion & Growth Strategy

### SEO (Primary Acquisition Channel)
- **Programmatic SEO:** Every combination of city x district x category generates a unique, indexable landing page with structured JSON-LD data
- **Long-tail keywords:** "piwo bezalkoholowe Mokotow", "bar z drinkami 0% Warszawa", "wino bezalkoholowe restauracja Srodmiescie"
- **Content authority:** The "How it works" and category pages establish topical authority for "napoje bezalkoholowe lokal" searches
- **Technical SEO:** XML sitemap auto-generated from all venues/districts/categories, clean canonical URLs, proper meta descriptions

### Instagram (Primary Social Channel)

**Content format: Carousel "Mini Reports"**

Data-driven carousel posts generated from the UNI database. Examples:
- "10 miejsc z piwem 0% w Warszawie — stan na 05.05.2026"
- "Gdzie w Mokotowie napijesz sie drinka bez alkoholu? 6 lokali"
- "Top 5: najwiecej kategorii NoLo w jednym miejscu"
- "Nowe w bazie: 3 lokale dodane w tym tygodniu"

**Execution:**
- **Month 1:** Manual creation in Canva. Test formats, see what resonates, iterate on visual style.
- **Month 2+:** If format proves successful, build automated generation in the admin panel (`/admin`) — pull data from DB, generate branded carousel images, export for posting.
- **Frequency:** 3x per week. Consistent, not spammy. Quality over quantity.
- **Purpose:** Drive traffic back to UNI. Every post links to the relevant category/district page on the platform.
- **Tone:** Informational, not promotional. "Here's what exists" not "Download our app!!!"

**Future content types (not immediate):**
- Venue spotlights (interview-style, once trust is built with owners)
- "Drink of the week" features
- New venue announcements
- "This week in NoLo Warsaw" round-ups

### TikTok (Under Consideration)
Seriously considering TikTok as a secondary channel. The NoLo/sober-curious community is active there. Short video formats could work well for venue walkthroughs, drink reveals, "I tried every NA beer at this bar" content. Not ruled out, but Instagram is the priority for launch.

### B2B Outreach (Venue Acquisition)
- **Cold email with data:** Lead with demand insights, not a sales pitch. "People in your area search for X and you don't sell it." Data creates curiosity → curiosity drives sign-up.
- **"Your venue is already listed":** Pre-seed venue data from public menus/websites, then notify owners their venue exists on UNI — creates urgency to claim and control their listing.
- **Industry events:** NoLo tastings, HoReCa trade shows, NA brand launch events — venue owners already interested in the category.
- **NA brand partnerships:** Partner with brands like Peroni 0.0%, Athletic Brewing, Lyre's — they have distribution lists of venues carrying their products.

### Community / Organic Growth
- **User submissions:** Users can suggest venues they've visited — each submission brings a new potential venue into the funnel
- **Word of mouth:** The "sober curious" and NA community in Poland is tight-knit — once a few venues validate the platform, others follow
- **Press/media:** "Poland's first NA venue map" angle for lifestyle press, health publications, HoReCa trade magazines

### Activation Metrics (What Success Looks Like)
- **Venues:** 50-60 at launch → 100+ within 3 months → 30 claimed → 20 maintaining freshness monthly
- **Users:** 5,000 monthly organic visits → 500 discovery page sessions → 200 directions clicked
- **Instagram:** Consistent 3x/week posting, measure click-throughs to platform
- **Retention signal:** Average venue owner logs in ≥1x/month to confirm freshness

---

## Competitive Landscape

### Direct Competitors in Poland
No major direct competitor exists at scale. The closest analog is **Untappd** — a beer-focused social app where users check in drinks and rate venues. However:
- Untappd is global, not Polish-focused
- Untappd is primarily alcoholic beer
- Untappd is user-review-based (subjective), UNI is data-based (objective: "this venue has these specific products")
- Untappd doesn't solve the "where do I go tonight for NA drinks" use case

There may be smaller Polish blogs, Facebook groups, or Instagram accounts covering the topic, but none offer structured, searchable, up-to-date venue data.

### International Analogs (for context, not direct competition)
- **Boisson** (NYC) — NA bottle shop + online store, not venue discovery
- **DrinkWell** (UK) — Low-alcohol drink discovery, brand-focused
- **Spirited Away** (NYC) — NA bottle shop

These validate the market but operate differently (retail, not venue discovery) and in different geographies. UNI's positioning is unique: **venue-level, data-first discovery for an underserved market in Poland.**

### Defensibility / Moat
- **Data network effect:** More venues → better for users → more users → more venues want to join
- **Freshness model:** Competitors can scrape static data but can't replicate owner-maintained freshness
- **Canary venues:** Honeypot data that proves scraping if copied
- **First-mover in Poland:** Being first with comprehensive data in a growing market creates switching costs (venues won't maintain two platforms)

---

## Brand & Identity

### Name
"Under No Influence" — a play on the legal phrase "under the influence." The name signals independence, clarity, and a conscious choice. It's memorable in English (international potential) while serving a Polish audience.

### Tagline / Positioning Statement
**To be finalized.** Working direction: "Pierwsza mapa napojow bezalkoholowych w Polsce" (Poland's first non-alcoholic drinks map) — functional, clear, SEO-friendly. May evolve into something more emotional once brand voice is defined.

### Visual Identity
- **Logo:** Exists (displayed in navigation bar of the app)
- **Color palette:** Defined in the project's CSS variables — dark mode default, category-specific colors for the 6 drink types (each category has its own color for chunks/badges)
- **Design language:** Dark, minimal, data-forward. The chunk visualization (colored squares per category) IS the visual identity of venue cards.
- **Brand guidelines:** Not yet formalized into a standalone document.

### Tone of Voice
**To be fully defined.** Current direction based on existing copy:
- Conversational Polish — "knowledgeable friend explaining over coffee"
- Direct and concrete — state facts, not hype
- Honest about uncertainty — "data not confirmed" instead of hiding gaps
- Never pushy — the platform is a tool, not a lifestyle brand preaching sobriety

The brand explicitly does NOT moralize about alcohol. It's not anti-alcohol. It's pro-choice. "Under No Influence" means making decisions clearly — including the decision of what to drink tonight.

---

## Launch Plan

### Timeline
**Target: Live by early June 2026** (within 30 days of May 5, 2026)

### Launch Sequence:
1. **Week 1-2:** Manually research and seed 50-60 real Warsaw venues with verified NA drink data. Thorough, accurate, no shortcuts — this IS the product.
2. **Week 2-3:** Configure production infrastructure (hosting, SMTP, domain, SSL). Deploy. Compile frontend. Smoke-test all flows.
3. **Week 3:** Start Instagram presence. First carousel posts with real venue data. 3x/week from day one.
4. **Week 4:** Begin B2B outreach to seeded venue owners. "Your venue is already on UNI. Claim it to manage your listing."
5. **Ongoing:** Monitor analytics, iterate on Instagram content format, respond to claim requests within 24h.

### Launch Type
**Soft launch.** No big press push or announcement. The strategy is:
- Get the data right (50-60 venues)
- Let SEO index the pages organically
- Build Instagram presence consistently
- Let venue owners discover their listings and claim them
- Scale outreach once the first 10 venues are claimed and active

A public "launch announcement" comes later — once there's proof (claimed venues, real traffic, engaged owners) to make the announcement credible.

### Geographic Expansion
- **City 1:** Warsaw (current, 50-60 venues at launch)
- **City 2:** Gdansk or Krakow (decision based on which has more NA-friendly venue density and founder access for data verification)
- **Trigger for expansion:** Warsaw reaches 100+ venues with 30+ claimed, organic traffic proves the model works, operational capacity exists to verify data in a new city

---

## Technical Architecture

| Layer | Technology |
|-------|-----------|
| Framework | Laravel 13 (PHP 8.4) |
| Reactivity | Livewire 4 + Alpine.js |
| Admin/Owner panels | Filament v5 (dual panel setup) |
| Frontend | Tailwind CSS v4, Leaflet.js for maps |
| Database | PostgreSQL |
| Analytics | PostHog (11 tracked events) |
| Testing | PHPUnit (196 tests, all passing) |
| Hosting | (TBD — likely Laravel Forge + DigitalOcean) |
| Email | (TBD — Resend or Postmark) |

### Data Model (Core Tables)
- `venues` — name, slug, city, district (FK), coordinates, type, contact info, claimed status, freshness timestamps, breadth_score
- `products` — global catalog of NA drinks (name, brand, category, ABV, country)
- `venue_products` — pivot: which venues carry which products
- `venue_drinks` — custom house drinks created by venue owners
- `categories` — 6 drink categories (Beer, Wine, Spirits, Cocktails, Cider, Sparkling)
- `cities` — supported cities with map bounds
- `districts` — normalized neighborhoods within cities
- `venue_claims` — claim request queue (pending/approved/rejected)
- `product_proposals` — owner-submitted products awaiting admin approval
- `venue_offer_logs` — immutable audit log of all product/drink changes

### Anti-Scraping Measures
- **Canary venues:** Fictional honeypot venues in the database that don't exist IRL. If these names appear in any competitor's dataset, it's proof of scraping.
- **Coordinate fuzzing:** GPS coordinates slightly randomized to prevent exact copy
- **robots.txt:** AI crawlers (GPTBot, CCBot, etc.) blocked

---

## Current State (May 2026)

### What's Built & Working:
- All consumer-facing pages (home, discovery, venue profiles, city, district, category pages)
- Venue owner panel with full claim → manage → confirm flow
- Admin panel for venue/product/category CRUD and claim approval
- Breadth scoring with denormalized column and auto-recalculation
- Binary freshness model with 90-day threshold
- Districts normalization (18 Warsaw dzielnice)
- Full test suite (196 tests passing)
- PostHog analytics tracking 11 events
- Authorization policies (owners can only access their own venues)
- Duplicate claim prevention
- Product proposal workflow (owners suggest products → admin approves)
- Immutable offer audit log

### What's Needed Before Launch:
1. **SMTP configuration** — Claim approval notifications currently don't send
2. **Real venue data** — Manually seed 50-60 actual Warsaw NA venues (the most critical task)
3. **CSS compilation** — Multiple sessions of frontend changes need `npm run build`
4. **Domain & hosting setup** — Deploy to production

### What's Explicitly Deferred to V2+:
- Multi-language support (i18n)
- Venue images/photos
- Opening hours display
- B2B analytics dashboard (premium)
- Pay-to-rank promoted placement
- API for third parties
- Community reporting / user trust levels
- Mobile app
- Automated Instagram carousel generation in admin panel
- TikTok presence

---

## Why UNI Matters — The Bigger Picture

The non-alcoholic drinks market in Poland is growing 15-20% annually. More venues are investing in NA selections, but there's no discovery infrastructure connecting them to the customers actively seeking them.

UNI creates a **data flywheel**:
1. Venues add accurate menu data (incentivized by verification badge + visibility)
2. Consumers trust the data (freshness model, verification badges, no stale info)
3. Traffic grows (SEO, Instagram, word of mouth)
4. More venues join (they see peers getting traffic, or receive data-led outreach emails)
5. Data gets richer → better consumer experience → more traffic → cycle repeats

The endgame is **becoming the data authority for NA venue offerings in Poland** — the place everyone checks first, the place brands look to for distribution intelligence, the place venue owners maintain because the cost of NOT maintaining is losing their verified badge and falling in rankings.

UNI doesn't sell drinks. It doesn't take commissions. It doesn't rank by payment (in Phase 1). It's a **neutral, transparent, data-first platform** where the most honest, well-stocked venues naturally rise to the top. That's the brand promise — Under No Influence means exactly what it says.

---

## Open / Unresolved Items

These are acknowledged unknowns — decisions not yet made:

| Item | Status | Notes |
|------|--------|-------|
| Tagline / positioning statement | To be defined | Working direction: functional Polish descriptor |
| Brand voice guidelines | To be defined | Current copy establishes direction but not codified |
| Exact premium pricing | To be validated | 50-200 PLN/month range, needs market testing |
| Phase 1.5 features | Conceptual | Need to define which small paid feature to test first |
| TikTok strategy | Under consideration | Likely, but Instagram is priority |
| City #2 choice | Gdansk or Krakow | Decision based on venue density + founder access |
| NA brand partnerships | Speculative | No conversations yet, validates after traffic |
| API access market | Speculative | Requires significant data volume first |
| SMTP provider | Resend or Postmark | Operational decision, not strategic |
