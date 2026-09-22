# Silent flag weighting for new users

**Date:** 2026-04-22
**Status:** Decided
**Executed:** not applicable in V1 — there is no public flagging to weight
**Area:** UI/UX | Venues

---

## Problem

User flags are the primary quality signal for product availability, but new accounts could spam flags to sabotage competitors. If we gate flagging visibly (greyed-out button, "earn the right to flag" message), we create a hostile first impression for genuine users. If we allow all flags equally, a single bad actor can corrupt venue data.

## Options considered

**Visible gating** — greyout the flag button until a user reaches an activity threshold. Show a message explaining why. Protects data quality but reveals the mechanic and signals distrust to new users.

**Full open flagging** — all flags count equally from account creation. Simple, friendly, but trivially gameable.

**Silent zero-weighting** — UI is identical for all users; new user flags are logged but carry near-zero weight. Weight increases with real platform activity. No UI difference between new and seasoned users.

## Decision

Silent weighting. Every user sees the same "not available" button and gets the same confirmation feedback. Flag weight starts near zero and grows with genuine platform activity (views, searches, time on platform). The threshold for "meaningful activity" is never published.

## Rules

The flag UI must be identical for all users — no disabled states, no lock icons, no explanatory copy about activity requirements. Flag weight is an internal value only, never exposed in any UI or API response. Activity score inputs (views, searches, map interactions) are logged but never surfaced to users as a score or level.

## What this prevents

Prevents two failure modes at once: the hostile new-user experience of visible gating, and the data corruption of open flagging. Revealing the threshold tells bad actors exactly what activity to fake — silence removes that attack surface. A competitor running a fake-flag campaign needs multiple accounts with real, sustained activity, which is expensive to scale.

## Revisit when

Post-V1, if analytics show coordinated flag abuse patterns that silent weighting isn't catching. At that point, consider rate limits or CAPTCHA for flagging — but not visible gating.
