---
version: 1.1
owner: Paweł Milewski
updated: 2026-08-18
status: approved
---

# Features Index

> **How to read this catalog (2026-08-18).** Every document in `features/` opens with a
> `**Status:**` line. All of those lines were rewritten on 18.08 after checking the code and the
> database — previously they described roughly the April state and **every single one was wrong**,
> some badly ("not started" on features that had been live for months). The prose below each status
> line is still the original specification: treat it as a design target, not as a description of the
> code. When the status and the specification disagree, **the status wins**.

## Categories & Tags

### Categories (6) — V1
1. **Piwo** — najdojrzalszy segment NoLo
2. **Wino** — białe, czerwone, różowe, musujące bezalkoholowe
3. **Spirytusowe** — alkohole mocne 0% (gin, whiskey, rum)
4. **Koktajle / Mocktaile** — RTD i autorskie (see [[product/rules/Custom Drinks Rules]])
5. **Cydr** — osobna kategoria
6. **Napoje musujące / Toniki** — premium toniki, kombucha, herbaty musujące, 0% szampan/prosecco

### Tags (13) — **specification, not code**
Skład: Funkcjonalny, Probiotyczny, Z CBD, Ziołowy, Proteinowy
Smak: Chmielowy, Wytrawny, Gorzki, Słodki
Dieta: Bez cukru, Bio, Wegański, Bezglutenowy

**Schema status — corrected 2026-08-18:** an earlier version of this paragraph claimed the `tags` table, the `product_tag` pivot, a `Tag` model and `Venue::scopeWithTags()` were all built. **None of it exists** — checked against the database schema and the code. The entire tag system is specification. Do not plan tag filters as "just the UI left to do"; it is a backend, a migration and data from zero.

Tags are cross-category product attributes. Known products get tags automatically from [[product/features/Product Reference Database]]. Custom drinks get tags from owner during submission.

Tag filters hidden behind "Więcej filtrów" expandable. See [[product/features/Discovery Page]] for UI details.

---

## V1 Features

### Discovery & Navigation
- [[product/features/Discovery Page]] — list + map, search, filters, sort
- [[product/features/Map View]] — pins, clustering, search this area, bounding box queries
- [[product/features/Venue Profile]] — breadth bars, product list, checkmark

### Trust & Data Quality
- [[product/features/Credibility Score]] — formula, inputs, storage, update frequency
- [[product/features/Freshness Decay]] — per-product decay bars, owner reconfirmation
- [[product/features/Verified Checkmark]] — binary trust signal, freshness + confidence combined
- [[product/features/User Flagging]] — product availability flags, activity-gated

### Owner Side
- [[product/features/Owner Dashboard]] — Filament, product management, freshness status
- [[product/features/Venue Claiming]] — proof-based claim flow, admin approval

### Pages
- [[product/features/Homepage]] — trust signal, city entry point, owner CTA
- [[product/features/SEO Landing Pages]] — auto-generated from venue data per city + category
- [[product/features/Static Pages]] — O nas, Kontakt, Regulamin, Polityka prywatności, Dla lokali

---

## Implementation Status at a Glance

| Feature | Status |
|---|---|
| Discovery page (search + city filter) | Live |
| Map with pins | Live (basic) |
| Analytics event capture | Live (5 event types) |
| AI scraping protection | Live (4 layers) |
| Canary venues | Live |
| SEO meta tags + JSON-LD on index | Partial |
| Venue profile page | Skeleton only |
| Credibility score | Not started |
| Verified checkmark | Not started |
| Freshness decay | Not started (schema missing) |
| User flagging | Not started |
| Owner dashboard (owner-facing) | Not started |
| Venue claiming | Not started |
| Homepage | Deferred (redirects to /venues) |
| SEO city+category landing pages | Not started |
| Static pages | Not started |
| Product reference database seed | Not started |
| Custom drinks | Not started |
| Tag filter UI | Post-V1 |
| User accounts / registration | Post-V1 |

---

## Deferred (Post-V1)
- [ ] Product rarity / quality weighting
- [ ] Bronze / Silver / Gold badge tiers
- [ ] Scoring multipliers by category
- [ ] Review system (NoLo-experience-specific)
- [ ] Rarity-based ranking
- [ ] Product tags UI (13 tags ready in backend)
- [ ] User accounts / registration
- [ ] Saved/bookmarked venues
- [ ] Venue type filter (pub, bar, restaurant)
- [ ] "Open now" filter
- [ ] E-commerce directory
- [ ] Multi-language (English)
- [ ] Meilisearch integration
- [ ] Mobile app (Sanctum API)
