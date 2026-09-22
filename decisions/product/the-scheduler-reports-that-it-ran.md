# The scheduler reports that it ran, because its failure is silent

**Date:** 2026-09-12
**Status:** Decided
**Executed:** 2026-09-12
**Area:** Analytics | Data Model

---

## Problem

Everything UNI does on a schedule is invisible when it stops. A missing crontab line, a wrong path, a machine that was rebuilt — none of them produce an error. The site serves perfectly, every page is correct, and no job ever runs: freshness badges keep the date they had, and `model:prune` stops deleting the rows that carry user ids, which makes the retention the privacy policy promises untrue rather than merely stale. A healthy server with a broken crontab looks identical to a healthy server, so uptime monitoring cannot answer the question. The decision to have a heartbeat was taken on v7 §5.1 and recorded as settled in v8 §0 — and then it was never built, which is itself the point: nothing noticed for two weeks.

## Options considered

Buy the hosting panel's server monitoring, which was the original plan and costs five euros a month. Watch the log file and hope somebody reads it. Add an external uptime service pinging a health endpoint. Have the scheduler record its own runs and show the answer on the dashboard that is opened anyway.

## Decision

**The scheduler writes a mark every five minutes, and the admin dashboard says how long ago that was.** Fifteen minutes of silence is three missed runs rather than a blip, and the widget turns red at that point. The same job reports the volume's fill level and mails the admins once a day above eighty per cent, because a full disk is the likeliest quiet death here — logs, failed jobs and database indexes filling forty gigabytes — and it is the failure the paid monitoring tier was wanted for.

Paid monitoring stays a legitimate purchase for a month at a time when something is broken and a human answer is worth having. It is not the answer to this question: it reports that the server is up, and the question is whether the work happened.

## Rules

The mark lives in the cache store, which on this application is the database, so it survives restarts and deploys without a migration. A cleared cache loses the mark and the dashboard then says the scheduler has never run — a false alarm rather than false silence, which is the correct direction for this to fail in. The disk warning is throttled to one a day and goes only to administrators, through the same queued mail path as every other notification, so it cannot become the thing that fills the disk. The heartbeat runs more often than its own staleness window, and a test asserts both the schedule and that the window is at least ten minutes, so nobody can tune it into uselessness by changing one number.

**Amended 2026-09-14 — one signal leaves the server.** Everything above lives on the machine it watches, and the disk warning needs the queue and mail that may be what broke. `PingExternalHealthcheck` is dispatched every five minutes, checks the database and the site's own `/up` over its public address, and pings an outside dead man's switch (`UNI_HEALTHCHECK_PING_URL`); when the pings stop, the outside service e-mails. One ping proves scheduler, worker, database, nginx, certificate and PHP together. Dormant until the URL is set.

## What this prevents

Discovering by accident, weeks later, that nothing scheduled has run since the deploy. Every consequence of that is worse than the cause: badges that assert a freshness nobody checked, a published retention period that is not being honoured, and a queue of notifications nobody received. It also prevents paying a monthly fee for an alarm we can own, on a project whose spending rule is that recurring cost needs a stated reason.

## Revisit when

A second machine exists, at which point one heartbeat per host is needed rather than one per application. Or when the scheduler's silence starts being noticed by someone other than whoever opens the dashboard — that is when an external check earns its place.

---

*See also: [[decisions/product/retention-follows-identifiers]] · [[decisions/product/raw-events-are-kept-not-pruned]] · [[decisions/product/mocked-integrations-need-a-live-check]]*
