# An automatic gate runs in both directions, and records the moves it makes

**Date:** 2026-09-17
**Status:** Decided
**Executed:** 2026-09-17
**Area:** Venues | Infrastructure

---

## Problem

The venue activation gate decides whether a place is public from its data: a point on the map, and something to serve. But it only ever ran when a *menu* item arrived, and the other precondition had no trigger at all — so a venue geocoded after it was catalogued held everything the gate asks for and stayed invisible forever, with nothing left to notice. That is exactly the order the importer was changed to allow on 12.09, when it stopped requiring coordinates so a worklist could be imported and geocoded later. The hourly job was no help: it had a pass that took venues *offline* and no counterpart that put them back, so it could only ever make the population smaller. **A gate like this fails silently in one direction.** There is no error, no failed row and no log line — only a number in the panel that does not match the number on the map, which nobody compares.

## Options considered

Trigger the gate from every place a precondition can change, and keep a list of those places correct as the application grows. Re-check the whole population on a schedule and forget about triggers. Do both — call the gate wherever a precondition lands, and give the scheduled job a pass in each direction as the floor under it. Leave the second direction to an admin noticing and switching venues on by hand.

## Decision

**Every automatic gate is built in both directions, and the scheduled job that maintains it has a pass for each.** Triggers stay where a precondition changes, because they make the common case immediate; the scheduled pass exists because triggers are a list somebody has to keep correct, and the day it goes stale is the day nothing reports it. The manual override still outranks both — a venue an admin marked closed stays closed however complete its data becomes — which is what keeps the gate automatic without making it stubborn.

**An automatic change leaves the same record a manual one does.** A bulk database update is not a cheaper way to do the same thing: it bypasses the model, so no observer runs and no audit row is written, and an automatic deactivation that writes nothing is indistinguishable from one that never happened.

## Rules

A gate whose condition has more than one part is called wherever any part of that condition can change, not only from the part that happened to be written first. The scheduled job that maintains it has one pass per direction, each skipping records under a manual override, and the two passes select disjoint sets so their order never matters. Both passes go through the model one record at a time and call the gate's own method rather than issuing a bulk update — slower, and the only way the transition goes through a single piece of logic and lands in the audit trail. An automatic transition carries a null actor, which is what distinguishes it from one a person made; this only works if the row exists, so it is what the bulk update quietly cost. A test asserts each direction, and a test asserts that the record is written.

## What this prevents

A population that silently shrinks. Every failure this gate has produced looks the same from outside: venues that exist, are complete, and simply are not there — no error to read and nothing to count. The alternative was an admin noticing, which is exactly what did not happen for the two ways this went wrong, and which does not scale past the number of venues one person can hold in their head. It also prevents the worse version, where the audit trail is used to answer *"why did my venue disappear"* and has no row for the disappearance.

## Revisit when

A second gate of this shape appears and the pattern can be shared rather than repeated. If the scheduled passes ever become expensive at volume — they load records rather than issuing one statement — the answer is to narrow what they select, not to return to bulk updates.

See also: [[decisions/product/venue-activation-gate]], [[decisions/product/actions-own-their-side-effects]], [[decisions/product/the-scheduler-reports-that-it-ran]], [[decisions/product/a-control-speaks-only-when-it-is-moved]]
