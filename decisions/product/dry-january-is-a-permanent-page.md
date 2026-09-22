# Dry January is a permanent address, refreshed yearly and never rebuilt

**Date:** 2026-09-17
**Status:** Decided
**Executed:** 2026-09-17 — `/suchy-styczen` live, `DryJanuaryController` + `resources/views/dry-january.blade.php`
**Area:** SEO | Content | Public site

---

## Problem

Dry January is the most seasonal query this product will ever see, and the one date in the project that comes from outside it: traffic arrives in the last week of December and is gone by February. A page published in January has already missed the January it was written for, because ranking takes weeks the season does not have.

The obvious shape — a seasonal page created each December and taken down in February — is the expensive one. A URL that appears and disappears accrues nothing: every year it starts from zero authority, and any link anyone gave it is dead for ten months of the twelve.

The second problem is the stub. `decisions-waiting-on-you-v6` set the condition plainly: this cannot be a placeholder sitting empty for four months waiting for its season. A page with a heading and three sentences is worse than no page, because it gets indexed as thin and then has to earn its way out of that.

## Options considered

**A seasonal page, built each December.** Rejected — no accumulated authority, and it puts the build inside the four weeks when there is least time for it.

**A blog post.** Rejected — a post is a dated artefact and reads as one; the useful half of this page is a live venue list, which a post cannot carry.

**A permanent URL with a live venue list, content refreshed each year.** Chosen.

## Decision

**`/suchy-styczen` exists all year**, at the same address forever. Content is refreshed each autumn; the URL is never deleted, never recreated and never given a year in its path or its title.

It carries five things, and the third is what makes it a page rather than an article:

1. **What Dry January is**, in both framings — the English name has recognition in Poland, *"suchy styczeń"* has the searches, and the page has to earn both queries.
2. **Why people do it**, honestly — a reset, a bet, a break, curiosity. Not a health lecture.
3. **The venues** — a live query against the catalogue, not a written list.
4. **The drinks** — what to actually order, by category, from the real catalogue.
5. **What it is not** — nobody is being told to quit anything.

## Rules

**The venue list is a query, never copy.** It answers "where do I go tonight" with whatever the catalogue holds that day, which is why the page is worth having in September and not only in January.

**The empty state follows `empty-landing-pages-noindex`.** No venues means `noindex, follow`, an honest empty state, and no entry in the sitemap — the same rule every other page carrying a live list obeys, enforced in the view rather than the controller.

**Section five is written against the mission, and stays there.** Harm reduction, not abstinence: two non-alcoholic drinks alongside two alcoholic ones is stated as the success it is. **No position on alcohol policy appears on this page**, in either direction — it is the page most likely to be mistaken for temperance, which makes it the page where `mission-is-the-healthy-choice` costs the most if it lapses.

**The clock, restated so it is not rediscovered every autumn:** the page must be indexed *weeks before* January, not during it. That is what makes an end-of-November launch a date rather than a preference.

## What this prevents

A page that starts from zero every year. A stub indexed as thin in September and still carrying that reputation in January. And the failure the mission record was written after — a harm-reduction product opening its most-read seasonal page with a sentence about what other people should be allowed to drink.
