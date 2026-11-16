# A search query sent in the last 30 days is not sent again

**Date:** 2026-11-16
**Status:** Decided — Paweł, 15.11 (after that day's wrap): skip it, 30 days, with a switch to search anyway
**Executed:** 2026-11-16 — `v0.1.11`, on Kandydaci's "Szukaj lokali" and source B's "Znajdź strony lokali"
**Area:** Venues

---

## Problem

Nothing stopped a Brave query from being sent again in a later run. On the home server's batch, 31 of 68 requests repeated a query already sent, and one whole run of 30 requests found nothing new. Brave's terms forbid storing results, so the obvious fix, reusing the earlier results, is not allowed.

## Options considered

Keep sending every query. Cache the results and reuse them. Never send a query twice. Skip a query sent within a window, with a way to override it.

## Decision

A query that a run sent successfully in the last 30 days is left out of a new run, and the run says how many it skipped. A "Szukaj mimo to" switch sends them anyway. Not sending is the only saving the terms allow, and a month is long enough for new venues to show up in results.

## Rules

A query counts as sent only if Brave answered it; one that failed is not skipped. Skipped queries don't use up the per-run limit. The form shows how many queries will be skipped before anything is sent, the run records the count, and a run with nothing left to send finishes without calling Brave. Source B's queries follow the same rule.

## What this prevents

It prevents paying again for an answer already received. It also prevents the two worse alternatives: storing results (against Brave's terms) or never searching again (new venues would never be found).

## Revisit when

If results visibly change faster than a month, or Brave's terms or prices change.

---

See also: [[decisions/adr/ADR-012-automated-venue-sourcing]] · [[decisions/product/a-search-result-must-read-as-a-venue]]
