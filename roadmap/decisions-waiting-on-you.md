---
version: 4.0
owner: Paweł Milewski
updated: 2026-08-31
status: living
---

# Decisions waiting on you

> **Superseded for launch questions by [`decisions-waiting-on-you-v5.md`](decisions-waiting-on-you-v5.md)
> (01.09).** This file stays as the *status* record — what was settled, built and parked as of
> 31.08. v5 is the *question* file: the owner panel goes to 404, and everything left is scored
> against blocking the deploy, changing what Google sees, or being data we cannot recreate.

Version 3 was answered in full on 30–31.08. Those answers, in your own words, are archived
unedited in `decisions-waiting-on-you-v3-answered.md` — several contain reasoning this file
compresses, so read that one if a summary here looks thinner than you remember.

This version records **what was settled, what was built, what was parked and why**, and what
is left. Everything verified against running code on 31.08.

> **If you only have ten minutes:** read **§1** — it is the queue of sessions you booked, in
> the order they block each other. Nothing in this file is urgent in the way version 3's
> section A was; that one is closed.

---

## 1. Sessions you booked, in dependency order

Each of these you explicitly asked to handle separately. They are listed in the order that
unblocks the most work, not the order they were raised.

| # | Session | Why it is separate | Blocks |
|---|---|---|---|
| 1 | **Owner panel + GDPR scope in V1** | You want to understand what accounts cost before committing. The inventory in §3 says the cost is smaller than feared | DSA trigger, plan gating, `audit_logs` reality, B2 pricing |
| 2 | **`venue_offer_logs` and what we do with it** | It turns out to power two owner-facing recommendation features, not just disputes | B6, producer reports, the seeding trap in §4 |
| 3 | **`audit_logs` deep dive** | You want to understand it properly rather than take the summary | ROPA, session 1 |
| 4 | **The ROPA** | 66 `TODO`/`TBD` markers; not blocked on hosting, as previously claimed | Privacy policy, launch |
| 5 | **Freshness cron — is there something more elegant?** | The cron is a symptom of pivot tables not firing events | Nothing; pure quality |
| 6 | **Pricing (B2)** | Needs the event inventory first | First sales conversation |
| 7 | **Repository migration** | Plan written: `tech/repository-migration.md` | Anything touching git history |
| 8 | **Docs structure (F2)** | You agreed ~80%; docs feel scattered | Nothing; quality |
| 9 | **Plan gating (H)** | Bigger than it looked | Session 1 |

**Reference written for session 5 and general use:** `tech/freshness-and-verification.md` —
what both venue badges mean, which columns drive them, and the three columns that look like
them and are not. You said you would return to this regularly; that is what it is for.

---

## 2. Settled and shipped on 31.08

| Item | Decision | Record |
|---|---|---|
| Retention | Windows follow identifiers. `events` and `venue_stats` kept indefinitely and no longer prunable; `venue_offer_logs` 6 → **24 months**; `audit_logs` 12; events pruner unscheduled | `retention-follows-identifiers.md` |
| Search text (C2) | Contact shapes **redacted, not rejected**, at write time. Wording rule recorded — never claim search terms hold no personal data | `search-terms-are-scrubbed-not-rejected.md` |
| Country names (E3) | ICU in the app locale; the English list is gone | `country-names-come-from-icu.md` |
| District indexing (E8) | **Three** active venues, in config, sitemap included | `thin-district-pages-are-noindexed.md` |
| Venue lists (B4) | Never sold as leads; aggregates only, said publicly | `venue-lists-are-never-sold-as-leads.md` |
| Return-visit rate (B5) | Dropped from `business/model.md` and `tech/analytics.md`, with a note preventing its return | — |
| Two orphan tables | `venue_visits` and `user_venue_saves` deleted — empty, no code, and `venue_visits` carried a `session_id` the identifier decision forbids | — |
| Repository (F1) | Fresh repo, one initial commit, old one archived private. Plan written, not executed | `tech/repository-migration.md` |
| SEO pages (G) | `/faq`, glossary, `/kontakt`, `/suchy-styczen` in; mission page and blog out | — |
| Product photos (G1) | Not implemented — complexity with unproven return | — |
| Producer vs owner order (B1) | Lean producers, do not abandon owner subscriptions until the market says so | session 1 above |

---

## 3. The GDPR inventory — the answer to "does V1 with accounts delay launch?"

Verified 31.08 by tracing every writer. **With the owner panel off, V1 holds personal data in
exactly three places:** your own admin account, inaccuracy-report e-mails and notes, and
web-server access logs. Three ROPA entries with obvious legal bases.

The load-bearing finding: **every caller of `AuditLogger` is in the claim or proposal flow.**
Nothing else writes an audit log. So with the panel off, `audit_logs` and `venue_claims` never
receive a row, and `venue_offer_logs.user_id` only ever holds your own id.

With the panel on you add four more ROPA entries, an owner erasure path, and the DSA
hosting trigger. **That is the real cost of accounts in V1, and it is a session, not a delay.**

Correction to carry forward: "V1 has no accounts" is not what the code or the decisions say.
`admin-recorded-claims-v1.md` decided owner accounts exist in V1, created by an admin — no
public *registration*, which is not the same thing. Turning the panel off reverses that record
and needs its own decision, which is session 1's first output.

---

## 4. Open, and cheap, and nobody is blocked

**Freshness columns (E2).** Two dead columns, not one. `verified_at` is written twice and read
nowhere. **`freshness_streak_started_at`** is computed, maintained by the cron, exposed as
`freshness_streak_months` — and displayed nowhere; only a test reads it. A streak says
something neither badge does: *"kept current for four months"*, which is the freshness
incentive made visible. **Decide: display the streak and drop `verified_at`, or drop both.**
Full context in `tech/freshness-and-verification.md`.

**The seeding trap.** The trending-products report counts distinct venues that added a product
in 30 days. It cannot tell "8 venues adopted Lech Free" from "Paweł added Lech Free to 8
venues in one afternoon". **This must be guarded before the 30 real venues are imported**, or
the first report will confidently call a seeding session a city trend.

**Import and freshness.** A bulk import does not fire the observers, so run
`uni:check-offer-freshness` by hand immediately after loading the xlsx.

**`added_by` vocabulary (E6).** The check constraint allows seven values for four meanings —
`seed`/`seeder` and `owner`/`venue_owner` are duplicates, and both halves of both pairs are
written by different code paths. Live data uses `admin` (106), `community` (61), `seeder` (60),
`owner` (48) while application code writes `venue_owner`, `proposal_approved` and `seed`. One
migration now, or a report that silently halves its own counts later.

**The two provenance gaps (E6).** `venue_drinks` has `source_url` and `checked_at` but no
`added_by`, so a custom drink — the entry most likely to be disputed — has no record of who
created it outside the offer log. And there is no admin interface over `venue_offer_logs` at
all, so the promised ten-second dispute answer currently requires a SQL client.

**District × category consistency.** The three-venue threshold gates the district page only. A
district × category page under a thin district stays indexable. Known, deliberate, recorded in
`config/uni.php`; extending it downwards is a bigger SEO change than E8 settled.

**Search ranking (E1).** Unchanged and unread by you. `VenueQuery.php:116-119` ranks by global
`breadth_score` and never learns what the search matched, then breaks ties alphabetically. A
40-product venue holding one Lech outranks a Lech-focused bar. Ten minutes with the file open.

**Filter parameter names (E7).** Parked until the map works. `zero` is the weak one — as a URL
token it could mean anything; `bez-alkoholu` is unambiguous. Free to rename before launch.

**Poppins.** Still open since 15.08, still costs nothing. You are 80% on keeping it and want to
see it live first.

**Map polish.** The `dark` style is still an unmodified OpenFreeMap copy; the record calls for
it darkened and desaturated to match the brand. You said you want to try this now that it is
possible. Work, not a decision.

---

## 5. DSA — agreed, not yet built

Agreed on 31.08: publish a monitored address plus a documented workflow and SLA **now**, cheap
and ready before the trigger. Add a third `reporter_type` value (`illegal_content`) **at the
same time** the panel or proposals are exposed, not before, so the queue does not grow a
category with nothing in it.

The applicability analysis — that V1 is not a hosting service because everything public is
admin-entered, and that Art. 16 has no small-business exemption once it does apply — **is not
lawyer-verified**, and is the part worth paying someone to confirm before the panel ships.

Correction carried forward: the report form is already one form with one required select
(`owner` | `guest`). E9's "one button or two" was answered by the code before it was asked. The
real gap is that neither value means "this content is illegal".

---

## 6. V2/V3 ideas, parked with reasoning

**Likes on products.** Works, and gives brand- and product-level demand independent of any
venue. But likes require accounts — without one you cannot deduplicate, and
`no-identifier-based-deduplication.md` closes the fingerprinting route. So the decision is
"accounts", not "likes".

**The cheaper version you may already have.** Brand and product pages are now the main SEO
surface. A product page's traffic *is* a demand signal — views, dwell, the searches that led
there, the zero-result searches for products we do not carry. Anonymous, already flowing
through `events`, producer-grade. What likes add is *intent strength*: a like is deliberate, a
view is an accident of navigation. Real difference, worth accounts eventually, not in V1.

**Affiliate links to e-commerce.** Noted, not recommended. It reverses the neutrality position
B4 just took, carries visible disclosure obligations under EU consumer law, and points users
away from the core use case — finding a drink in a venue you are standing near, not buying one
online. The revenue is also traffic-dependent, so it does not solve the cold-start problem the
producer line does. Revisit when product pages have traffic and a click can be priced.

**"Is this actually available?" on a menu item.** Two versions. A request forwarded to the
venue undermines UNI — we are the ones promising the menu is right. A signal we capture
(*"I'd order this"*, *"wasn't there"*) does not, and gives per-product interest within a single
venue, which nothing else currently produces. Collides with
`community-reporting-needs-accounts.md`; the "I'd order this" variant is closer to a vote than
a report and may not need the same identity guarantees.

---

*Answers can be one word each. Anything answered here becomes a decision record and is acted
on in the session it belongs to.*
