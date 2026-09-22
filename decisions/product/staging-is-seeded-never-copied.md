# Staging is seeded, never a copy of production

**Date:** 2026-09-16
**Status:** Decided
**Executed:** no — staging does not exist yet; this is written before it does, deliberately
**Area:** Compliance | Data Model

---

## Problem

Staging does not exist yet, which is the only reason this is cheap to decide. The moment it does, there is a shortcut that every project takes at least once: something behaves oddly in production, reproducing it on seeded data is fiddly, so somebody runs `pg_dump` on production and restores it into staging.

That single act creates a **second copy of every claim's `contact_name`, `contact_email`, `contact_phone` and `business_nip`** on a box with weaker access rules, a password chosen more casually, and no reason for anyone to treat it as sensitive. It doubles the surface area of a breach to save twenty minutes. It also makes staging's own numbers meaningless, because real events and test traffic end up in the same `events` table, and then nobody trusts a figure from either environment.

The shortcut is never taken in a planning session. It is taken at 11 pm by somebody debugging, which is precisely why the refusal has to be written down beforehand rather than reasoned out in the moment.

## Options considered

Copy production and anonymise it on the way in — better than a raw copy, but it is a script that has to be correct every time, and the failure mode is silent. Copy only non-personal tables — the same problem, with a list that goes stale. Seed staging with the same seeders the test suite uses.

## Decision

**Staging is always seeded and never restored from production.** It runs on its own database, with its own Postgres role, its own credentials, its own `APP_KEY`, and `MAIL_MAILER=log` so no test message can reach a real person.

If a production bug cannot be reproduced on seeded data, that is a signal the seeders are missing a case — and the fix is to add the case, which makes the test suite better permanently, rather than to import the data once and lose the lesson.

## Rules

Two databases and **two Postgres roles**, not one role with access to both: a single leaked credential from the less-secured site must not reach production. The staging role holds no rights on the production database.

**The names must not be confusable at a glance.** `uni_production` and `uni_staging` differ by a suffix that is easy to skim past in a terminal at night; the environment goes at the **front** of the name, where it cannot be missed, and the role matches the database. A connection string is read under exactly the conditions where a trailing character is not read at all.

A backup restore drill targets an **empty scratch database**, never staging — the drill proves the dump restores, and pointing it at staging would reintroduce the copy through the back door.

## What this prevents

Prevents a second, less-guarded copy of every venue owner's contact details existing for a reason nobody would defend if asked in advance, and prevents both environments' analytics becoming untrustworthy at the same time.

## Revisit when

Never on the copy itself. If reproducing production bugs turns out to be genuinely impractical, the answer is better seeders or a purpose-built anonymised generator — not a dump.

---

*See also: [[decisions/product/browse-only-v1]] · [[decisions/product/personal-data-expires-rows-do-not]] · [[decisions/product/internal-traffic-is-excluded-at-the-write]]*
