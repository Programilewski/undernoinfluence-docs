# What every badge on a venue tile claims

**Date:** 2026-09-16
**Status:** Decided
**Executed:** 2026-09-16 — the table below is read from the code, not from intent. **Re-audited 2026-09-21** against `venue-tile.blade.php` line by line; two missing elements added and a `Ships in` column added. Every element on a tile today is V1
**Area:** UI/UX | Venues | Brand

---

## Problem

Six things appear on a discovery tile and nothing wrote down what any of them means. They accumulated one at a time, each with a sensible reason, and the reasons lived in the commit that added them. Two consequences were already live when this was written:

**The two date badges measure different windows and nothing says so.** The freshness pill turns from "Zaktualizowano dziś" to a day count past `uni.freshness_days` — **90 days**. "Sprawdzona karta" disappears past `uni.verification_valid_days` — **180 days**. A visitor reading a tile that says "Zaktualizowano 120 dni temu" *and* "Sprawdzona karta" is seeing two true statements that sound contradictory, and has no way to learn that one counts to 90 and the other to 180.

**And the question could not be answered for a machine.** Deciding what "sprawdzone" means for a fact posted by a venue's till system is impossible while what it means for a fact read by a person is only implied by a getter.

## Options considered

Leave the definitions in the code. Put them in the privacy policy or a public FAQ. Write an internal record of what each element claims, with its exact condition, and require new badges to add a row.

## Decision

One record, this one, holding every element a tile shows, the exact condition in code, and the claim it makes to a visitor. **A badge states a fact with a date or a count behind it, never a judgement.** Adding a badge means adding its row here in the same commit.

| Element | Exact condition | What it claims | Ships in | Where |
|---|---|---|---|---|
| **Freshness pill** — "Zaktualizowano dziś" / "N dni temu" | `breadth_score > 0` **and** `offer_updated_at` set; wording changes past `uni.freshness_days` (**90**) | When the offer was last confirmed. **Hidden entirely when the venue has nothing** — so its absence means "no menu", never "old menu"                | **V1** | `Venue::getFreshnessLabelAttribute()` |
| **"Sprawdzona karta"**                                    | `is_verified` **and** `last_menu_check_at` within `uni.verification_valid_days` (**180**)              | **A person checked this menu within the last six months.** Expires by itself — it is not a permanent tick and cannot be bought                      | **V1** | `Venue::getHasVerifiedMenuAttribute()` |
| **"Zarządza właściciel"**                                 | `is_claimed`                                                                                           | That a named, verified person is answerable for this offer. Follows real ownership: deleting an owner releases the venue and the badge goes with it | **V1** | `Venue::isOwnerManaged`, `venue-tile.blade.php` |
| **Venue type**                                            | `venue_type`, default `inne`                                                                           | What kind of place it is                                                                                                                            | **V1** | `VenueType` enum |
| **District**                                              | The related district's name                                                                            | Where it is                                                                                                                                         | **V1** | `districtRelation` |
| **Category dots**                                         | Up to 8 filled per category, by product count                                                          | **How much choice there is in that category** — a count, not a score                                                                                | **V1** | `VenuePresenter::categoryRows()` |
| **Total product count** — "N produktów" | `array_sum` of every category's count, with `PolishPlural::form()` | How many named drinks the venue's offer holds in total. **Uncapped**, unlike the dots | **V1** | `venue-tile.blade.php` footer |
| **Dot tooltip** | the `title` of the *n*th filled dot is the *n*th product's name | That this specific drink is on the offer — the only place a tile names a product | **V1** | `venue-tile.blade.php`, `$names[$d]` |

## Rules

**Audited 21.09 against `venue-tile.blade.php`, and two elements were missing.** The 16.09 table described six of the eight things a tile renders that make a claim. The two added above are the footer's total product count and the per-dot tooltip. Everything else on the tile is either a name (the venue's own) or an action (`Na mapie`, `Nawiguj`), and neither asserts anything about the venue.

**The dots cap and the footer does not, and both are true at once.** A venue with twelve drinks shows eight dots and a footer reading "12 produktów". That is the same shape of problem as the 90/180 windows — two true numbers that look like a contradiction. It is accepted rather than fixed: the cap is what stops the dots reading as a rating (see the rule below), and the footer is the honest total. **Revisit if a visitor ever asks.**

**The drinks category counts two tables, not one.** `categoryRows()` merges `$venue->drinks` — the venue's own named drinks — into the `drinki` category alongside `products`. The count and the tooltips cover both.

**A badge is a fact with a date or a count behind it.** Nothing on a tile may express an opinion, a rating, or a comparison between venues — the category dots are the closest thing to a comparison and are therefore capped, unlabelled and derived from a plain count, so they cannot be read as a star rating. `ranking-is-never-for-sale` covers position; this covers presentation.

**A badge must be able to expire.** Both date-based badges fall off on their own. No badge may be permanent once granted, because a permanent badge is a claim about the past presented as a claim about today.

**The absence of a badge must mean one thing.** The freshness pill is hidden when a venue has nothing to serve rather than showing a stale date, so absence always means "nothing to show" and never "something bad".

**A machine's assertion may not inherit a human badge.** "Sprawdzona karta" means a person checked. A fact posted by a venue's system is a different claim and needs its own status before any sync runs — see `one-ingestion-path-for-menu-data`.

**Two windows that a visitor sees together must be explainable together.** 90 and 180 are defensible separately and confusing side by side, so the venue page carries one sentence explaining what each date means. They are **not** converged — see Revisit when.

## What this prevents

Prevents the badge set drifting into a rating system one well-meaning addition at a time, and prevents the situation this record was written in: a question about what a badge should mean for a new data source being unanswerable because what it means for the existing source was never written down.

## Revisit when

**The 90/180 question is settled — explain, do not converge (16.09).** The two windows measure different things and the difference is worth keeping: the freshness pill is about the *data* — when anybody last confirmed this menu — while "Sprawdzona karta" is about an *act of verification*, which is heavier, deliberate, and reasonably stays valid longer. Converging them would either expire the verification faster than the work behind it deserves, or stop the freshness date meaning "recent". The venue page gains one sentence explaining both, with the pre-launch copy work.

**Settled 2026-09-16 — the `owner_managed_badge` flag is deleted.** It gated the badge globally because local fixtures had produced venues carrying `is_claimed` with nobody behind them. That was fake data in a database that has never been production, and the orphan state it feared is prevented at its four real sources: `UserObserver` releases venues before an owner is deleted, `ApproveVenueClaimAction` writes both columns together, `VenueImporter` maps neither, and the factory refuses to generate the state at random. The badge now simply follows `is_claimed` — the same column `VenueQuery` filters on, so the badge and the filter beside it cannot disagree. Nothing has to be flipped when the first claim is approved.

---

*See also: [[decisions/product/ranking-is-never-for-sale]] · [[decisions/product/v1-copy-truth]] · [[decisions/product/one-ingestion-path-for-menu-data]] · [[decisions/product/credibility-score-was-removed]]*
