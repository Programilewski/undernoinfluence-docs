# Three environments, and what each one is actually for

**Date:** 2026-09-22
**Status:** Decided
**Executed:** partly — the home server is next; staging and production do not exist yet
**Supersedes:** INFRA-01 in the 27.08 phone note, *"Local development plus production. No preprod for now"*, and with it the line that kept the home server *"dedicated to n8n, restic backups, and Metabase later"*
**Area:** Infrastructure

---

## Problem

INFRA-01 settled on two environments in August, and the reasoning was sound at the time: a staging environment is worth what a bad deploy costs, and at zero users that is one wasted evening. On 18.09 the order of work changed to *"local project clear and working → new repository → test on the home server → production"*, which quietly made a third environment real without saying what it was for. A carried-forward list still reads *"deliberately not doing: the homeserver as monitor or preprod"*, which by then was half wrong.

Three environments with no stated purpose each is how drift starts: something gets fixed on one, is never fixed on the others, and nobody can say which one is right.

## Options considered

Two environments, as INFRA-01 decided — local and production, with migrations rehearsed against a local copy. Three, with the home server as a second production-like box. Three, with each one given a different job rather than a different fidelity.

## Decision

**Three environments, and they differ by purpose, not only by how production-like they are.**

**1. Local — the laptop.** Where code is written and the suite runs. Fedora, `artisan serve`, the Vite dev server. Deliberately not production-like: it is fast, and nothing about it is trusted.

**2. The home server — where it is used, not just tested.** Reached over Tailscale, so it can be opened from a phone, a tablet and someone else's laptop on real hardware over a real network. **This is the only environment where UNI is used the way a visitor would use it**, and for a mobile-first Polish site that is not a small thing: a map that behaves on a desktop browser at 1400px tells you very little about a thumb on a phone in a bar. It is also where things may be broken freely — nothing here is protected and nothing depends on it.

**3. Staging — production's rehearsal.** The same host and the same shape as production, existing to answer one question: *will this deploy work?* Migrations, the queue worker, cron, mail and the caches, on the stack production actually uses. It is seeded, never copied from production ([[decisions/product/staging-is-seeded-never-copied]]).

**4. Production.** The only one with real venues and real visitors.

**The home server keeps its existing roles.** n8n and restic are working and are not disturbed: the application goes in an Incus **system container**, deliberately not Docker, which is what INFRA-01 itself prescribed for the day it was revisited — production is bare Ubuntu under Ploi, and parity is the point.

**Staging is not built yet, and does not need to be for the home server to happen.** Its trigger is the first migration that could damage real data — which is to say, once production has venues worth protecting. Before that, the home server catches the same class of problem for nothing, since it already exists and runs continuously.

## Rules

- Each environment has one stated job. A thing that can be caught on a cheaper one is caught there.
- The home server is **not** the monitor. An alarm in the same building cannot report the building being down — [[decisions/product/the-alarm-rings-from-outside-the-building]] is unaffected by this record.
- Nothing on the home server is depended on. No real data, no backups that matter, no service another environment needs.
- Staging waits for its trigger rather than a date, and the trigger is production having data worth protecting.

## What this prevents

Prevents three environments nobody can tell apart, and the drift that follows. Prevents the specific waste of building staging before it can catch anything the home server cannot. And it keeps the home server's working roles — n8n, restic — out of the blast radius of a Laravel install.

## Revisit when

A second person deploys, or production has paying venues. Both change what a bad deploy costs, which is the number INFRA-01 was right to reason from.

---

*See also: [[decisions/product/a-release-is-a-tag-deployed-from-git]] · [[decisions/product/staging-is-seeded-never-copied]] · [[decisions/product/admin-access-is-three-layers]] · [[tech/going-to-production]]*
