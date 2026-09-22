# Search visibility is three numbers, not one

**Date:** 2026-09-02
**Status:** Decided
**Executed:** partly — match and presence are recorded (verified 2026-09-14); impression is still PostHog-only
**Area:** Analytics

---

## Problem

The search event stored a query and a count. "You were shown 340 times and tapped 12" — the one
metric an owner would pay for — had no denominator, and search history cannot be backfilled, so
every day without one was permanently lost. The harder question was what "shown" honestly means:
on a broad query most matching venues are past the list cap and never reach the page at all, so
counting matches as impressions would sell a number that inflates with catalogue size rather than
with visibility.

## Options considered

Store a match count only, and accept that no paid tier can be built. Store the first twenty
returned identities, as `search-results-recorded.md` specified. Store every returned identity.
Define visibility by whether a card was actually seen, and store only that. Keep several
definitions side by side under separate names.

## Decision

Three facts are recorded under three names that are never used interchangeably. **Match** is the
count of venues satisfying the filters. **Presence** is the list of venues rendered as cards, in
rank order. **Impression** is a card that actually crossed the viewport — a browser fact, still
PostHog-only, and the next thing to move. Presence is what "you were on the list" is sold from;
the gap between match and presence is itself the ranking signal, and it was previously invisible.

## Rules

Presence is bounded by whatever the discovery list actually rendered, never by a number chosen
separately — a second cap drifts out of agreement with the page, which is the flaw the original
twenty had, since the list has rendered twenty-four cards since June and neither decision knew
about the other. Presence is stored in rank order so position needs no second field. Match count
is kept even where presence is empty, because matched-but-never-listed is the more actionable of
the two. No owner-facing sentence may use the word "shown" for a match, and no report may sum the
three. Load-more extends the rendered list after the search event has fired, so those venues stay
matched and unrecorded as present until that gets its own event.

## What this prevents

Prevents a paid visibility metric that cannot survive a buyer's first question, which is the
failure that discredits the methodology rather than the number. It also prevents the opposite
failure of storing nothing until the definition is perfect, in a table that cannot be backfilled.

## Revisit when

Impressions move server-side — at which point presence becomes the denominator for a real
seen-rate and the naming has to hold across both. Also when a single search regularly returns more
than the rendered list, which is when the load-more gap starts to matter.

---

*See also: [[decisions/product/search-results-recorded]] · [[decisions/product/discovery-list-cap]] ·
[[decisions/product/analytics-three-tiers]] · [[decisions/product/no-pay-to-rank]]*
