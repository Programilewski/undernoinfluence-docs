# Retention windows follow identifiers, not habit

**Date:** 2026-08-31
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** Analytics | Compliance | Data Model

---

## Problem

Four tables had retention windows set at different times for different reasons, and the reasons had stopped matching the data. Raw events were scheduled for pruning although they hold no identifier and nothing requires a limit. `venue_stats` was capped at 24 months although it holds only a venue id, a date, a metric name and a count. `venue_offer_logs` was capped at six months although it is the record that answers an ownership dispute — and disputes arrive later than six months, not sooner. The windows read as if someone had reasoned about each one; nobody had, and the scheduler had never actually run, so nothing had been lost yet.

## Options considered

Remove pruning everywhere, on the grounds that the analytics tables hold no personal data. Keep every window as it stands and write a justification for each. Set each window from a single test — whether the rows identify a person — and accept that the answer differs per table.

## Decision

Retention is decided by whether a table carries an identifier, and by nothing else. Tables with no identifier are kept indefinitely, because no law sets a horizon and inventing one destroys history for nothing: `events` and `venue_stats` are no longer pruned at all, and the events pruner is no longer scheduled. Tables carrying a user id are personal data and keep a justified window: `venue_offer_logs` moves from six to twenty-four months, `audit_logs` stays at twelve. "Remove the pruning mechanism" was the starting proposal and turned out to be right for exactly half the tables — the half that has no user id.

## Rules

A retention window exists only where rows identify a person, and every such window is justified in the ROPA rather than left to the code. `venue_stats` keeping its full history is a product capability as well as a compliance position, because year-on-year comparison in the owner dashboard is impossible without it. The events pruner is kept as a command but not scheduled, and if it is ever scheduled again it runs strictly after the rollup so that lowering retention cannot silently delete a day that was never summarised. Adding a `user_id` to any currently anonymous table makes it subject to this rule and requires a window and a ROPA entry in the same change.

## What this prevents

Six months on `venue_offer_logs` guaranteed the dispute record was gone precisely when it was first needed — the failure would have arrived as an owner asking who listed their venue and being told we no longer know. On the other side, pruning anonymous counters imposes a cost with no benefit: a limit nobody requires, deleting evidence nobody could misuse, in the name of a compliance obligation that does not apply.

## Revisit when

When the owner panel is exposed, because that is when `audit_logs` and `venue_offer_logs` begin receiving rows attributed to people other than the administrator, and twelve and twenty-four months start describing real exposure rather than a hypothetical one.

---

*See also: [[decisions/product/raw-events-are-kept-not-pruned]], [[decisions/product/eventlogger-identifier-stripping]], [[decisions/product/no-identifier-based-deduplication]]*
