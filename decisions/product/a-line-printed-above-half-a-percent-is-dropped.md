# A drink printed above 0,5% never reaches the approval queue

**Date:** 2026-11-16
**Status:** Decided — Paweł, 16.11 ("do these", on the fixes from the home server's batch)
**Executed:** 2026-11-16 — `v0.1.11`, applied when the two readings of a menu are compared
**Area:** Catalogue

---

## Problem

The reading prompt already tells the model to leave alcoholic drinks out. Even so, a "Tucher Radler Cytrynowe" printed ">0,5%" reached the queue in the 16.11 batch. A person would have rejected it, but every such line costs review time, and one approved by mistake would list an alcoholic drink as non-alcoholic.

## Options considered

Leave it to approval. Mark such lines as rejected automatically. Drop them when the readings are compared.

## Decision

A line whose printed strength is above 0,5% is dropped when the two readings are compared, as if the model had followed its own instruction. Automatic rejection was ruled out, because a menu with decided lines can no longer be read again.

## Rules

A strength printed as above ("> 0,5%", "powyżej") or as a number over 0,5 drops the line. A pair such as "0,0% / 4,5%" is judged by its lowest value, so it stays. A line with no printed strength is not affected. If one reading drops a drink and the other keeps it, it is kept, and the difference in strength is shown.

## What this prevents

Alcoholic drinks sitting in the queue, and the risk of approving one as 0%. The catalogue's bound of 0,5% holds at the earliest step.

## Revisit when

A real 0% drink turns out to have been dropped because of a misprinted strength.

---

See also: [[decisions/product/catalogue-excludes-actual-alcohol]] · [[decisions/product/a-mocktail-with-a-spirit-is-flagged]]
