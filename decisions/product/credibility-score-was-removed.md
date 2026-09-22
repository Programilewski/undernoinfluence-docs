# The credibility score was removed and is not coming back

**Date:** 2026-09-04
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14 (no `credibility_score` anywhere in the code)
**Area:** Scoring | Venues

---

## Problem

Two decision records from 22.04 — `credibility-formula-opacity.md` and `popularity-excluded-from-credibility.md` — describe a `credibility_score` in the present tense, with weights, a threshold and an earned checkmark. **That column is not in the schema and the concept is not in the code.** Paweł asked for an AS-IS of the freshness and verification system precisely because the documents had drifted from reality, which is the second time in one session a record caused a wrong belief.

## Options considered

Leave the old records and rely on people checking the code. Delete them, losing the reasoning. Mark them superseded and record what replaced the score. Rebuild the score.

## Decision

**The composite credibility score is gone and will not be rebuilt.** It was replaced by **two independent, individually explainable facts**: a human checked the drinks card (`Sprawdzona karta`, gated on `is_verified` plus a check within 180 days), and the offer was last confirmed N days ago (the freshness line, binary at 90 days). The two 22.04 records are superseded, not deleted — their reasoning is still the reason not to rebuild it.

## Rules

No composite quality score is reintroduced for venues. Trust signals stay separable, so that each one can be explained to an owner in a sentence and acted on in a single action. `breadth_score` remains an internal ranking input and is never shown as a number. The two superseded records must carry a note pointing here, since anyone reading them today would build against a system that does not exist.

## What this prevents

A score that cannot be defended to the owner who asks why theirs is lower. `credibility-formula-opacity.md` exists because the original design already had that problem, and it tried to solve it by hiding the weights — **the actual fix turned out to be deleting the score, not concealing it.** Rebuilding it would recreate the defence problem and, worse, would do so in a number people are asked to pay for.

## Revisit when

Never on the score itself. Revisit the *documents* whenever a record is found describing something the code no longer does — that class of drift is the real defect here, and it has now caused two wrong beliefs.

---

*See also: [[decisions/product/credibility-formula-opacity]], [[decisions/product/popularity-excluded-from-credibility]], [[decisions/adr/ADR-004 Scoring Simplification]]*
