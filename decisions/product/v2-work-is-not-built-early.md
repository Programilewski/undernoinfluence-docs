# V2 work is not built early, and a flag is not an exception

**Date:** 2026-09-17
**Status:** Decided
**Executed:** standing rule
**Superseded:** in part, 2026-09-18 by Paweł — **the owner panel is built complete behind `UNI_OWNER_ACCESS`, and V2 begins by switching it on.** Recorded in [[decisions/product/admin-recorded-claims-v1]]. Whether the same applies to other V2 features is open; until he says so, this rule stands for everything else.
**Area:** Brand | Strategy | UI/UX

---

## Problem

Asked whether it is better to leave V2 features unbuilt or to build them and keep them hidden behind a flag, the tempting answer is "build it, it's cheap, we'll switch it on later". It is not cheap, and the cost is invisible at the moment it is paid: hidden code still carries tests, documentation, every audit and every refactor it touches, while returning nothing until the day it is exposed.

## Options considered

Build V2 features now and hide them behind configuration until the trigger fires. Build nothing until the trigger fires. Build only the parts that are expensive to add later, and nothing else.

## Decision

**We do not build V2 features early, hidden or otherwise.** The one exception is *data*: a column, an enum value or a log field that is cheap to add now and impossible to backfill later is written before it is needed — `pos_sync`, reserved and unwritten, is the correct shape of that. The dividing line is simple: **if leaving it out means losing history that cannot be reconstructed, build it now; if leaving it out only means building it later, leave it out.**

## Rules

A feature is built when its trigger fires, not before, and the trigger is written into the record that defers it. A configuration flag is not a way to build something early — it is a way to turn something off, and anything behind it is maintained as if it were live. Reserved data values are allowed and must be documented as reserved and unwritten, so nobody mistakes them for a working path. When a flag does exist, the condition it stands in for is fixed rather than muted: a flag that hides a symptom is the thing to delete.

**Amended 2026-09-18 — the owner panel is the exception, chosen, not drifted into.** Paweł: *"have all the owner panel functionality working even before V1, but hidden, gated behind that env variable. Once we move to V2, I want it to be that ENV variable switch and it should all work instead of building it then"* — and the flexibility to switch it on in local development. What this record feared still applies, so the exception carries the rule's own condition: **anything behind the flag is maintained as if it were live.** In practice that means one switch and one reading of it — `EnsureOwnerAccessIsOpen` returns 404 for the whole panel, `OwnerAccessIsClosedInV1Test` pins the default, every owner-panel test runs with the switch on, and the privacy policy's owner sentences follow the same switch — so there is exactly one answer to "is the panel exposed?", and it is in `.env`.

## What this prevents

The owner panel, which was built, hidden, un-hidden and hidden again, and which between 16.08 and 16.09 held **three different positions in three documents** about whether it was exposed. On 16.09 the oldest was read as current and a security recommendation was built on it that would have locked every venue owner out of their own panel. That is the real cost of hidden code: not the maintenance, but that nobody can tell any more what is true.

## Revisit when

A specific feature has a demonstrable backfill cost — that is the exception clause, and it is decided per feature in that feature's own record, never as a general licence.

*See also: [[decisions/product/admin-recorded-claims-v1]] · [[decisions/product/one-result-tile]] · [[decisions/product/one-ingestion-path-for-menu-data]]*

*18.09 decisions in their own records: [[decisions/product/owner-panel-ships-behind-one-switch]].*
