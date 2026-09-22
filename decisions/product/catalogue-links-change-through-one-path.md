# Every change to what a venue serves goes through one path

**Date:** 2026-09-13
**Status:** Decided
**Executed:** 2026-09-13
**Area:** Venues | Data Model

---

## Problem

When a product is linked to or removed from a venue, four things must follow: the offer is marked fresh, a line goes into the offer history, the breadth score is recalculated, and the venue is switched on or off. The link lives in a joining table, and changes to a joining table fire no events, so nothing happens automatically — each place that links a product has to ask for the follow-up. On 13.09 two of six places did not: the admin's bulk remove button did none of it, and approving an owner's proposal skipped the history and the score. Both looked like they worked.

## Options considered

Replace the joining table with a full model that fires its own events. Recalculate everything on a schedule and accept stale numbers between runs. Keep one shared follow-up and require every path to call it, backed by the hourly check for changes made where no code runs.

## Decision

**Every path that links or unlinks a catalogue product calls the same follow-up, and the hourly check repairs what reaches the database without code — a deleted product, a manual query.** Converting the joining table to a model would change every relation and query touching the menu for a problem six call sites already solve. House drinks are full records and trigger the same follow-up by themselves.

## Rules

A new way to add or remove products from a venue — an import, a bulk action, a command, an owner feature — must call the shared follow-up for each product it touches, and its test asserts the offer history line and the venue's state, not only the link. A change whose source is the owner is recorded as reported by the owner whoever clicks the final button. The hourly check takes live venues with nothing on their menu offline and repairs drifted offer dates and scores; it is a safety net, not a substitute for calling the follow-up.

## What this prevents

An offer history with holes in it, which is what an owner's dispute and every trend report rely on; a breadth score that ranks a venue by what it used to serve; and an emptied venue left on the map — each of them silent, because the link itself is always written correctly.

## Revisit when

A venue's menu starts being changed by more than a handful of paths, or the joining table grows fields of its own that need rules — at which point it becomes a model with events and the follow-up moves there.

---

*See also: [[decisions/product/venue-activation-gate]] · [[decisions/product/offer-logs-record-knowledge-not-authorship]] · [[decisions/product/actions-own-their-side-effects]]*
