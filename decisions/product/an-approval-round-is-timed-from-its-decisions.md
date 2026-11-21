---
description: "How a timed approval round is measured: from the seconds between consecutive menu_lines.decided_at, pauses over 3 minutes cut, the first line after a pause counted at the average; first baseline 21.11 = about 4.4 min per venue (venues #7–11)."
---

# An approval round is timed from its own decisions

**Date:** 2026-11-21
**Status:** Decided
**Executed:** standing rule — applied first on 2026-11-21 to venues #7–11
**Area:** Sourcing | Analytics

---

## Problem

Launch waits on how many minutes a person spends per approved venue, and the pipeline is tuned against that number. A stopwatch measures only what someone remembers to press, can't say which lines were slow, and breaks when a round is spread over two evenings, which is exactly what happened with the first batch (20.11 midday, then 21.11 evening, with a 65-minute break in the middle).

## Options considered

A stopwatch for the whole round; Paweł's three times plus notes; reading the gaps between the decision timestamps every line already stores; logging when each line is opened (not built).

## Decision

A round's review time is read from the database: the seconds between one decision and the next in the batch's menus, in `decided_at` order. Gaps longer than 3 minutes are pauses and are cut. The first decision after a pause has no start time, so it is counted at the round's average. Opening *Utwórz lokale* isn't logged yet, so Paweł's estimate stands in for it. Minutes per venue = (Utwórz lokale time + review time) ÷ venues in the batch.

## Rules

Every timed round reports minutes per venue, time per line, and time per decision kind (approve, correct to an existing product, create a product, reject), told apart by whether the product was created at the same second as the decision. A gap just over the cut-off is reported separately and named, never silently dropped, because some of them are real work (Martini Floreale, 4 min 36 s). With and without "Zapytaj AI" is compared only once each side has several cleanly timed lines; a line where AI was asked before a break has no usable time. Each new batch is measured the same way and compared against the previous one.

## The first baseline (21.11, venues #7–11, menus 47, 54, 61, 69, 76)

42 lines, all decided, all five venues active. About 20.5 minutes of review plus 1.5 minutes of Utwórz lokale: **about 4.4 min per venue**, or about 3.5 without the one 4.6-minute line. Approving a house drink, approving a certain match and correcting to an existing product took 7–8 s each; creating a product took 40 s on 20.11 (mostly wines, 45–76 s) and 11 s on 21.11 (mostly known beers); the one rejection took 55 s. Only one AI-assisted line has a clean time (29 s, answer included), so the AI comparison is still open.

## What this prevents

Tuning the pipeline against a number nobody can check, and blaming the wrong step: the numbers show that approving is already cheap and that the whole cost sits in creating products the catalogue doesn't know yet, wines above all.

## Revisit when

Utwórz lokale gets its own timestamp (then the estimate goes), or batches start being decided by more than one person.

See also: [[decisions/product/a-model-identifies-a-drink-on-request-and-a-person-decides]], [[decisions/product/a-venue-type-is-suggested-and-a-person-confirms-it]]
