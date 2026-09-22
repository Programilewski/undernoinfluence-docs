# A data state only fixtures can produce is a fixture bug

**Date:** 2026-09-16
**Status:** Decided — standing rule
**Executed:** standing rule
**Area:** Data Model | Analytics

---

## Problem

The local database is fixtures. Production starts empty, and outside `local` the seeders write only cities, categories, districts and canaries. But fixture states get *observed*, and once observed they get written into comments, and a comment reads like a fact about the system rather than an observation about one laptop.

That is exactly how it went wrong. "Fourteen venues carried `is_claimed` with zero claims" was recorded in a config comment months ago. Read back later it became the case for a feature flag, then the case for changing a badge's condition from `is_claimed` to `claimed_by`, then a paragraph calling the flag "a workaround for a data defect". The venues were factory output. Worse, the change split the badge from the discovery filter, which reads `is_claimed` — so reasoning from fixtures put a real inconsistency into shipped code.

## Options considered

Treat any observed bad state as a defect and guard against it in the application. Clean the fixture rows and move on. Ask, before anything else, whether production can produce the state at all.

## Decision

**Before treating a data state as a defect, trace every writer and ask whether production can create it.** If only a factory or a seeder can, it is a fixture bug and the fix belongs in the factory — never a condition in an accessor, a guard in a view, or a configuration flag.

In the case that produced this record the answer was no, four times over, and every guard already existed: an observer releases venues before an owner is deleted, the approval action writes both columns in one update, the importer maps neither, and the factory refuses to generate the state at random with a comment saying why.

## Rules

A number found in a comment gets the same "could this happen in production?" check as a number measured today — being written down does not make it evidence about the system. A guard added for a state nobody has traced is scaffolding, and scaffolding on a public surface mutes correct rows along with wrong ones. When a display looks wrong, the question is **what it is reading**, not whether to stop displaying it. Fixture counts are never cited as launch blockers.

## What this prevents

Prevents the application accumulating defensive conditions against situations it cannot reach, each of which costs a reader's time forever and some of which — as here — introduce genuine inconsistencies between surfaces that were previously reading the same column.

## Revisit when

Never. The rule costs one question before a change and has already been paid for twice.

---

*See also: [[decisions/product/nothing-false-is-published-to-a-visitor]] · [[decisions/product/v1-copy-truth]] · [[decisions/product/what-the-badges-claim]]*
