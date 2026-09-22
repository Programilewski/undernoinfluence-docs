# Nothing false is published where a visitor can reach it

**Date:** 2026-09-16
**Status:** Decided — standing rule
**Executed:** 2026-09-16 — the honeypot carries the bait; the canary seeder's docblock is corrected
**Area:** Venues | Brand | Data Model

---

## Problem

The two canary venues seeded since April cannot do the job their own docblock claimed. Every public path excludes them — the venue page 404s on `is_canary`, the sitemap and discovery use the `active()` scope, the analytics endpoint refuses them — so a crawler reading every page UNI publishes never encounters either name. The project believed it could prove a public scrape and could not.

The obvious fix is to make a canary visible. Three shapes were considered and each fails on a person rather than on a scraper:

- **A canary venue page.** Someone finds it through a search result or a guessed URL and travels to a place that does not exist.
- **A canary product on a real venue.** Somebody orders a drink the bar has never stocked; the owner opens their own listing and finds a product they do not serve; and — the objection that settles it — **an extra product inflates that venue's `breadth_score`, which is the ranking input.** A defence mechanism would silently change where a real venue sits on `/mapa`, which is `ranking-is-never-for-sale` broken from the inside.
- **A canary district or category.** A visitor uses it as a filter and finds it empty.

**Every canary a scraper can see is a canary a person can see.** That is not a design flaw to engineer around; it is what "public" means.

## Options considered

Publish canary venues and accept that a few people are misdirected. Publish canary products and accept the ranking distortion. Put the bait somewhere only a prober reaches. Give up on detection entirely.

## Decision

**Nothing invented is published where an ordinary visitor can reach it.** Not a venue, not a product, not a category, not a coordinate on a page — no exceptions for defensive purposes, because the harm lands on the person the product exists to help.

Bait goes to the **honeypot** instead. `/export/venues.json` is linked from nowhere, disallowed in `robots.txt`, and named as the export an automated collector would guess at, so every request to it is a deliberate probe. It now returns **eight invented venues across four cities** — Warszawa, Kraków, Gdańsk, Poznań — instead of the 404 it used to return. They live in `App\Support\HoneypotVenues`, never touch the database, and therefore cannot reach a visitor, cannot embarrass an owner, and cannot enter a ranking calculation.

Eight rather than two, and spread across four cities, because coverage must match the shape of the thing protected: a competitor who cleans by district, or who only takes one city, must not end up holding a copy containing no marker.

The two seeded canary venues stay as what they actually are — a **database-leak tripwire**. Their docblock is corrected to say so.

## Rules

A defensive mechanism may not degrade the product it defends. If catching a scraper requires misleading a visitor, distorting a ranking, or putting a fact on an owner's listing that the owner would dispute, **the scrape is accepted instead.**

Invented data is kept in code, never seeded, and never written to a table the public site reads. A test asserts that no honeypot venue exists in the database.

**Canaries are never rotated.** The evidence is that a name has been continuously present since a fixed date; a rotated canary turns a claim about somebody else's database into an argument about our own records. The Canary Register in `docs/journals/README.md` keeps the live-from dates, and that register is the evidence.

**Public-page scraping is accepted as undetectable.** Somebody who crawls the site and rebuilds a directory from what visitors see takes no honeypot bait and is caught by none of this. That gap is closed only by publishing something false, which this record refuses. What remains — `robots.txt`, the `noai` header, the honeypot log, rate limits, and §5 of the terms — is the defence, together with the fact that a stolen snapshot is stale within weeks while the daily counts that make the product valuable cannot be copied at all.

## What this prevents

Prevents the product's anti-scraping defence becoming the thing that damages it: a visitor sent to a bar that does not exist, an owner shown a drink they have never served, or a ranking quietly altered by a marker nobody can see. It also prevents the milder version of the same trade being re-proposed, because each shape has been tried and named here.

## Revisit when

Someone demonstrably copies the catalogue and the honeypot did not catch them — at which point the question is what else can be marked without a visitor ever seeing it, not whether to start publishing fictions.

---

*See also: [[decisions/product/block-all-ai-crawlers]] · [[decisions/product/ranking-is-never-for-sale]] · [[decisions/product/homepage-showcase-real-components]] · [[decisions/product/v1-copy-truth]]*
