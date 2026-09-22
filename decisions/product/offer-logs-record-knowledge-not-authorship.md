# An Offer-Log Row Records What Kind of Knowledge It Is, Not Who Typed It

**Date:** 2026-09-09
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** Data Model

---

## Problem

Trend reporting counts how many venues in a city started carrying a product recently. Importing thirty venues on one Tuesday writes thirty "started carrying" rows dated that Tuesday, none of which happened that Tuesday — so the first seeding session would be sold back to venues as a wave of city-wide demand. The obvious fix, ignoring anything an administrator typed, throws away real signal: walking into a bar six weeks later and finding a new tap is a genuine trend data point that an administrator recorded.

## Options considered

Suppressing all administrator-entered rows. Suppressing rows written during a date range flagged as an import. Requiring a minimum gap between a venue's first row and any row that counts. Recording who wrote each row and filtering on that. Recording what kind of knowledge each row represents.

## Decision

Each offer-log row records **what kind of knowledge it is** — first-time cataloguing, an observed change, or something the owner reported — and never who typed it. "Who typed it" and "is it true" are different questions, and only the first was ever the problem: the date is what a bulk import makes untrue, not the fact. Trends count observed changes and owner reports and ignore first-time cataloguing, whoever wrote the row.

## Rules

Three kinds exist and they mean specific things. First-time cataloguing is the pass where we record what a venue already has, and its date says when we found out rather than when anything changed. An observed change is the offer changing since we last looked and us seeing it. An owner report is the owner telling us, and its date is as close to the real change as this product can get.

Where nobody states the kind, it is inferred: an owner's own edit is an owner report; everything recorded on the day we first catalogue a venue is the first pass, however many rows that is; a row written on a later day is a change we came back and found. Cataloguing one venue across two sittings therefore records the second sitting as an observed change, which is the known edge of the rule — the importer and the quick-add page state the kind explicitly rather than relying on inference.

The stored default is first-time cataloguing, the kind trends ignore. Any writer that has not been taught about this distinction fails towards "not a trend" rather than towards a fabricated one.

Every reader that reports change over time applies the filter, not just the trend block. The "venues near you added" section had the identical flaw and carries the identical filter.

## What this prevents

It prevents the report we intend to sell from describing our own data-entry calendar as market movement, which would be discovered by the first owner who knows what their neighbours actually stock — and that is the kind of error that ends a commercial conversation rather than starting one. Suppressing administrator rows instead would have been safe and lossy: at V1 volume almost every true observation is one we made in person, so that version of the fix would have left the trend permanently empty while looking correct.

## Revisit when

Owners maintain their own offers at scale, at which point owner reports dominate and the inference rule matters much less. Or if cataloguing routinely spans several days per venue, which would make the day-boundary inference wrong often enough to replace rather than override.

---

*See also: [[decisions/product/internal-traffic-is-excluded-at-the-write]] · [[decisions/product/analytics-event-naming]] · [[decisions/product/producers-stay-internal]]*
