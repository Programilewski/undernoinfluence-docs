# V1 Locked Decisions

Locked: 2026-05-04. Two cells corrected on 2026-08-18 after checking them against the code — see D-01 and D-14. The decisions themselves stand; the descriptions had drifted. **One cadence amended on 2026-08-24 — see D-13; it is the only place where shipped behaviour now differs from what this table locked, and it is waiting on your confirmation.** Produced from a structured review session with two LLMs cross-checking each other's analysis against the codebase.

These decisions are final for V1. Do not reopen them during implementation. If new information emerges that invalidates a decision, add a note to the "Revisit Triggers" column and continue — don't stall.

---

## Decision Table

| # | Decision | Choice | Rationale | Revisit Trigger |
|---|---|---|---|---|
| D-01 | Badge system | Binary: badge or nothing — **amended 15.08: two independent binary badges, not one.** "Sprawdzona karta" (`is_verified`, expires with `last_menu_check_at`) and "Zarządza właściciel" (`is_claimed`). The principle held; the single label did not, because one bit could not say both "we checked this" and "the owner runs this". | ADR-004 already decided this. SCORING.md tiers are aspirational spec, not V1 scope. Binary is one bit — no threshold tuning, no tier transition logic, no UI for 3 states. | Post-launch data shows owners want differentiation from competitors |
| D-02 | URL structure | Polish slugs, city-as-anchor: `/miejsce/{slug}`, `/{citySlug}`, `/{citySlug}/{districtSlug}`, `/kategoria/{slug}` | Already implemented this way in `routes/web.php`. Polish slugs win Polish SEO. City slug disambiguates locale. No `/pl/` prefix needed — add `hreflang` middleware when expanding to non-Polish cities. | Expansion to non-Polish-speaking country |
| D-03 | Images — venues | None in V1 | Moderation burden (every upload needs review), storage/CDN cost, quality control risk (bad photos hurt more than no photos). Chunk visualization IS the visual identity. | Owner feedback post-claim shows strong demand |
| D-04 | Images — drinks | None in V1 (neither catalog nor custom) | Same moderation/storage cost. Catalog products are known brands (name sufficient). Custom drinks photos are nice-to-have but add upload UX, moderation queue, and storage infra for a feature owners haven't asked for yet. | Claimed owners request it through panel feedback |
| D-05 | Opening hours | Not stored, not displayed | Complex schema (day-of-week, split shifts, holidays, exceptions). High maintenance burden for owners. Stale hours actively damage trust. Link to Google Maps/Instagram for hours. | Claimed owners self-manage hours through panel (V2+) |
| D-06 | Map markers | Color-coded dot (verified=accent, unclaimed=grey). Full chunk bar + venue name in popup on tap. | Chunk bars are illegible at marker size on mobile. Marker says "something here, tap me." Popup says "here's why." Render from flat JSON, build marker HTML client-side with Alpine. | User testing shows markers need more info at glance |
| D-07 | Scoring recalculation | Denormalized `breadth_score` column on `venues`, updated synchronously in observers | Eliminates N+1 on listing pages. `ORDER BY breadth_score DESC` with index = instant sorts. Current `VenueScoring::calculate()` loads all products per venue in PHP — doesn't scale. Observers already exist (`VenueProductObserver`, `VenueDrinkObserver`). | Data volume requires async queue jobs (unlikely in V1) |
| D-08 | Score formula | Flat category count, no weights (ADR-008) | 6 equal categories, no multipliers, no rarity scoring. Breadth = total distinct products across categories. Diversity tiebreaker = number of categories used. Brand diversity deferred. | Post-launch analytics show users value specific categories differently |
| D-09 | Districts | Normalize to `districts` table with FK on `venues` | Free-text `district` column causes duplicates, blocks clean pSEO slugs, prevents reliable filtering. Migration: mapping array for existing strings, unmappable → null + admin queue. | N/A — this is a prerequisite, not a choice |
| D-10 | Owner product-adding UX | Improve existing Filament experience, don't rebuild in Livewire | Category pre-filtering and better search within Filament. Custom Livewire product browser is V2, justified by real owner feedback. Don't rebuild what exists. | Owner engagement data shows adding flow is a bounce point |
| D-11 | Community reporting | Not built in V1, no schema pre-design | No users = no abuse patterns to design against. Trust-level gates depend on behavior patterns you can't predict. Build it when needed, not before. | User base reaches a point where data quality issues surface |
| D-12 | Locale / i18n | Polish only, no locale infrastructure | No `/pl/` prefixes, no translation tables, no multi-lang slugs. When expanding: add `hreflang` middleware + route segment translations. City slug = implicit locale anchor. | First non-Polish city added |
| D-13 | `offer_updated_at` integrity | Scheduled check, not DB trigger. **Cadence amended 24.08: daily, was hourly — pending your confirmation.** | Observers handle the Eloquent path. The job catches drift from raw queries or bulk operations. Query: `WHERE offer_updated_at < GREATEST(max product updated_at, max drink updated_at)`. Acceptable drift was stated as 1 hour max; at 67 venues with no public traffic nothing changes within an hour, so the cadence was relaxed to daily during the 24.08 cleanup. **The mechanism is unchanged — only how often it runs.** | Confirm or overrule the daily cadence; restore hourly before the first real traffic. Upgrade to event-driven if drift becomes user-visible |
| D-14 | Score recalculation — badge/freshness | Binary, ≤90 days. **Correction 18.08 — the original wording of this cell never matched the code.** Freshness is `offer_updated_at` within `uni.freshness_days` (90) and drives the date label and the recency filter. The check badge is a separate pair of columns entirely: `is_verified` + `last_menu_check_at` within `uni.verification_valid_days` (180). `is_claimed` feeds neither. | No staleness tiers in V1. Fresh (≤90 days) or not. Stale venues lose the checkmark. No grace period — owner can re-confirm products instantly to restore it. | Post-launch shows owners need warning period before badge drops |

---

## Implementation Priority (Sequential)

This is the execution order. Each item depends on the ones above it being done or at least decided.

| Priority | Task | Depends On | Estimated Scope |
|---|---|---|---|
| **P1** | URL structure — already locked (D-02), verify sitemap reflects it | Nothing | Verification only |
| **P2** | Fix claim flow: remove 403 for new registrants, add CTA on venue pages, pending-state dashboard | D-02 | Routes, middleware, Livewire component, Filament claim resource |
| **P3** | Configure SMTP (Resend/Postmark/Mailgun) | Nothing | `.env` + mail config, claim notification mailable |
| **P4** | Render custom drinks (`venue_drinks`) on public venue pages | Nothing | Blade template change in `show.blade.php` |
| **P5** | Add `VenuePolicy` — authorization on all owner panel actions | P2 | Policy class, gate checks in Livewire/Filament components |
| **P6** | **Coupled batch** — plan and execute as one unit: | P1, P4 | |
| | 6a. Create `districts` table, seed Warsaw dzielnice (~18) | | Migration + seeder |
| | 6b. Add `district_id` FK to `venues`, migrate free-text data | 6a | Migration with mapping array |
| | 6c. Add `breadth_score` integer column + index to `venues` | | Migration |
| | 6d. Refactor `VenueScoring` to write `breadth_score` via observers | 6c | Service + observer changes |
| | 6e. Seed real Warsaw venues with correct district FKs + products | 6a, 6b | Seeder with real data |
| | 6f. Run scoring on seeded data, verify listing page sorts correctly | 6d, 6e | Verification |
| **P7** | Build programmatic SEO pages (city x district x category matrix) | P6 | Controllers, Blade templates, sitemap entries, JSON-LD |
| **P8** | Hourly `offer_updated_at` integrity check job | P6d | Scheduled command |

---

## Superseded Documents

These documents contain specs or decisions that conflict with the locked decisions above. The locked decisions win.

| Document | Conflict | Resolution |
|---|---|---|
| `SCORING.md` §2 (Badge Tiers) | Gold/Silver/Bronze tiers | D-01: Binary badges in V1. SCORING.md tiers are V2+ aspirational spec. |
| `SCORING.md` §3 (Staleness thresholds) | 4-tier staleness (Fresh/Aging/Stale/Expired) | D-14: Binary freshness in V1 (≤90 days or not). |
| `SCORING.md` §4 (Score recalculation) | "on-demand vs nightly" open question | D-07: Denormalized column, updated synchronously in observers. |
| `SCORING.md` §1 (Brand diversity) | Brand diversity boosts bar width | D-08: Flat category count, no brand diversity scoring in V1. |

---

## What This Document Does NOT Cover

- Schema DDL — that's in migrations, not decision docs.
- UI/UX specifics — wireframes and component design happen during implementation.
- Filament resource configuration — implementation detail.
- Test coverage — every change gets tests, that's a process rule, not a decision.
- Data seeding content — the actual list of Warsaw venues is operational data, not an architectural decision.
