# Raw events are kept, not pruned at ninety days

**Date:** 2026-08-30
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** Analytics

---

## Problem

A scheduled job deletes every event older than ninety days. The scheduler has never run, so
nothing has been lost yet, but the first run after 15 September 2026 would start destroying the
only history we have. The ninety-day figure was written as privacy hygiene, and the record that
justifies it says the opposite of what it is used to justify: the events table holds no
identifier and falls outside data protection law entirely, so nothing legally requires the
deletion.

## Options considered

Keep the ninety-day deletion and build a summary table before it runs, which is the plan the
pre-launch checklist assumes. Raise the retention to two years. Raise it to effectively forever.
Delete nothing and drop the pruning job altogether.

## Decision

We keep the raw events. Retention is raised to ten years by configuration, which removes the
September deadline in one line and with no code. The pruning job stays in place, switched to a
retention value it will not reach, so the mechanism exists if a reason to use it ever appears.
The summary table is still built — not to survive a deletion any more, but because the shape of
the table we sell reports from freezes on launch day and it is free to change now.

## Rules

Retention is set by configuration, never hard-coded, and the value lives with the other
environment settings so it can be changed without a deploy. The pruning job is never run by hand
with a lower value while a summary table does not exist. Seasonality and year-over-year figures
are built from the summary table, not from raw rows, so that the retention value can change
later without a sellable feature depending on it. The reason we may keep this data indefinitely
is that it names nobody, and any change that puts an identifier into a row cancels this decision
automatically.

## What this prevents

Prevents deleting the only twelve months of history that make a seasonal forecast possible,
which is a feature already promised in a paid tier and which cannot be rebuilt from anything.
It also prevents the more expensive version of the same mistake: building a summary table in a
hurry against a calendar deadline, before we can tell robot traffic from human traffic, and
permanently baking that pollution into the one table we intend to sell from.

## Revisit when

Storage becomes a real cost, which at the current rate of a few hundred rows a month is not a
foreseeable problem, or if a future change puts anything identifying into an event row — at
which point retention becomes a legal question rather than a preference.

---

*See also: [[decisions/product/eventlogger-identifier-stripping]] ·
[[decisions/product/analytics-split-posthog-and-events]]*
