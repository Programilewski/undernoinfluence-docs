# Discrepancy Report: Docs vs Implementation

> Generated 2026-04-30. Tracks gaps between vault specs / decision records and the actual codebase.

---

## 1. Badges: 3-tier system in docs, binary in code

**SCORING.md** describes Gold / Silver / Bronze tiers with detailed criteria (lines 37–81). **ADR-004** decided to simplify to a binary checkmark. **Implementation** matches ADR-004 — just `is_verified` boolean + `verified_at` timestamp.

**The problem:** SCORING.md still presents the 3-tier system as the "source of truth" and doesn't mention ADR-004's simplification. A new developer reading SCORING.md would think tiers are the plan.

**Action:** Update SCORING.md to reflect the ADR-004 decision, or explicitly mark §2 as "superseded by ADR-004."

---

## 2. SCORING.md claims `confirmed_at` is missing — it's not

SCORING.md §3 says: *"The current venue_products table has no confirmed_at or confirmed_by column."* But the migration `2026_04_22_111522_update_venue_products_table.php` already added `confirmed_at`. The doc is stale.

`confirmed_source` (enum: owner/uni_team/community/auto) is genuinely missing — that part is correct.

**Action:** Update SCORING.md §3 to reflect that `confirmed_at` exists. Add `confirmed_source` migration when scoring is built.

---

## 3. Breadth bars: spec says "diversity", code counts raw products

**SCORING.md** says bar width should reflect *"how broad and diverse the offering is"* — brand diversity should boost scores, same-brand products should count less. **Implementation** (`Venue::drinkAvailability()` at `app/Models/Venue.php:104`) is just `count * 25` capped at 100 — pure product count with no diversity factor.

**Action:** When real scoring is built, replace the placeholder with a formula that factors in brand diversity.

---

## 4. Breadth bars ignore `is_available` and freshness

**SCORING.md** says *"only `is_available = true` products count"* and stale products get partial weight. The actual `drinkAvailability()` method counts **all** products — it doesn't check `pivot.is_available` or `pivot.confirmed_at`. Unavailable and expired products inflate the bars.

**Action:** Filter by `is_available = true` (quick fix). Freshness weighting deferred to scoring rebuild.

---

## 5. Breadth cap: 4 products vs 5 products

**V1 spec** says breadth bar caps at 5 products. **Implementation** caps at 4 (`count * 25 = 100` at 4 products).

**Action:** Change multiplier from 25 to 20 to match spec, or update spec to match code. Decide which is correct.

---

## 6. Category names: spec vs implementation

| V1 Spec | config/drinks.php | Notes |
|---------|-------------------|-------|
| Destylaty | `spirits` (label: "Spirits") | English slug + label, spec used Polish |
| Koktajle | `drinks` (label: "Drinki") | Different naming entirely |

The other 4 (Piwo, Wino, Cydr, Musujące) match.

**Action:** Decide on canonical Polish names and update either spec or code. The platform is Polish-facing — English "Spirits" may not be appropriate.

---

## 7. Districts: free text, not normalized

`venues.district` is a free-text varchar. No `districts` table with city FK exists. Same district name in different cities (e.g., "Stare Miasto") can't be distinguished. No slugs for pSEO routes.

**Action:** Create `districts` table (id, city_id, name, slug), migrate existing data, replace `venues.district` with `venues.district_id` FK.

---

## 8. Custom drinks: no schema support

The vault has a `custom-drink-photo-gate.md` decision and Custom Drinks Rules defining the submission flow, photo requirement, and verification. **Zero of this is implemented:**

- No `is_custom` column on products
- No `venue_id` (owner) on products
- `brand` column is NOT NULL — custom drinks have no brand
- No custom drink submission UI or API
- The only "custom" indicator is `show.blade.php` checking if `brand` contains "receptura" — a fragile string convention

**Action:** Add `is_custom` bool + nullable `venue_id` FK to products, make `brand` nullable, build submission flow with photo gate.

---

## 9. Credibility Score: fully specced, zero implementation

The vault feature doc defines a precise 0.00–1.00 score with 5 weighted inputs (freshness 40%, claimed 20%, completeness 20%, flag rate 15%, product count 5%). **None of this exists in code:**

- No `credibility_score` column on venues
- No calculation logic
- No nightly recalculation job
- No checkmark threshold config

The current verified checkmark is a manual admin toggle, not computed from credibility.

**Action:** Implement after scoring rebuild. This blocks: verified checkmark automation, default sort order, discovery page ranking.

---

## 10. URL structure: spec vs implementation

| What | Spec | Implementation |
|------|------|----------------|
| Discovery | `/warszawa` | `/venues` |
| Venue profile | `/warszawa/lokal/{slug}` | `/venues/{slug}` |

pSEO-friendly URLs with city/district scoping don't exist.

**Action:** Decide URL structure before Google indexes the site. Pending decision noted in vault.

---

## 11. Hardcoded 90-day threshold in 8 places

The 90-day freshness constant is hardcoded in `Venue::freshnessState()`, the Filament relation manager, and blade templates. The 180-day stale threshold is also hardcoded.

**Action:** Extract to `config('uni.freshness_days', 90)` and `config('uni.staleness_days', 180)`.

---

## 12. User flagging: specced, not built

Vault has full feature specs (flag weighting, activity scores, abuse prevention, silent weight ramp). No flag model, no flag UI, no flag routes exist.

**Action:** Implement after credibility score is live. Depends on user registration system.

---

## Summary by severity

### Doc contradicts itself / is stale
- [ ] SCORING.md 3-tier badges vs ADR-004 binary
- [ ] SCORING.md claims `confirmed_at` missing

### Spec exists, implementation placeholder/wrong
- [ ] Breadth bars ignore diversity, `is_available`, freshness
- [ ] Breadth cap 4 vs 5
- [ ] Category naming mismatch (Destylaty/Koktajle)

### Spec exists, implementation zero
- [ ] Custom drinks system
- [ ] Credibility score
- [ ] User flagging
- [ ] Districts normalization
- [ ] pSEO URL structure
- [ ] Hardcoded freshness thresholds
