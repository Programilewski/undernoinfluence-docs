# Analytics fires on user intent, never on keystroke or render

**Date:** 2026-08-30
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** Analytics

---

## Problem

Discovery search is bound live with a 300ms debounce, and the analytics emit rode on that binding.
One person typing *piwo bezalkoholowe* recorded a separate search for every prefix — `piw`,
`piwo bez`, `piwo bezalkoholowe` — so the shortest and least meaningful string would win any
"top searches" ranking we ever sell or act on. `discovery_empty_results` was worse: it fired on
*every* render that returned nothing, including scrolling and map pans, so the zero-results
signal that is supposed to drive venue recruitment counted renders instead of dead ends. Both
defects are invisible in the numbers and cannot be corrected after the fact.

## Options considered

Leave it and correct for inflation later in reporting — rejected, because the prefix rows are
indistinguishable from real short queries once written. Raise the debounce to ~1s for everything
— reduces the problem but slows the result list, which is the product. Deduplicate per user with
an identifier so repeated events collapse — rejected separately, see
[[no-identifier-based-deduplication]]. Separate the analytics cadence from the UI cadence, so
results stay live and events fire once per finished intent.

## Decision

We separate the two cadences. Results keep updating at 300ms; a search is recorded only when the
user has finished it — typing settles for one second, or Enter is pressed — and an identical
consecutive query is not recorded twice. Empty results are reported once per distinct filter
state rather than once per render.

## Rules

A search is one event per committed query, not per keystroke. Clearing the search box resets the
committed query, so searching the same term again later is a new intent and is recorded again.
Empty-result reporting is de-duplicated on the discrete filter selections — categories, cities,
districts, verified, claimed, strict-zero, freshness, sort, search — and deliberately excludes
continuous map geometry, because viewport bounds change on every pan and would defeat the
de-duplication entirely. Any new analytics emit placed inside a render path must state why the
render is the intent; if it cannot, it belongs on an explicit user action instead.

## What this prevents

It prevents the search-demand data — the basis of the gap report, the district demand signals and
any manufacturer report — from being dominated by half-typed strings. It prevents the zero-results
dashboard from pointing venue recruitment at the wrong districts, since a filter state that
returns nothing while the user scrolls would otherwise look like many separate dead ends. Both
would have been discovered only after months of unusable history had accumulated.

## Revisit when

If search moves to a submit-button or server-rendered results page, the commit signal becomes the
submit itself and the settle timer can go. If empty-result recruitment ever needs geographic
granularity, add a separate coarse map-area event rather than putting bounds back into the
fingerprint.

---

*See also: [no-identifier-based-deduplication.md](no-identifier-based-deduplication.md), [eventlogger-identifier-stripping.md](eventlogger-identifier-stripping.md), [analytics-three-tiers.md](analytics-three-tiers.md)*
