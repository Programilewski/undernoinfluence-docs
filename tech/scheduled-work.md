---
version: 1.0
owner: Paweł Milewski
updated: 2026-09-21
status: active — read from `routes/console.php` and `supervisor/uni-worker.conf` on 21.09.2026. None of it has ever run on any machine this project has lived on
---

# Scheduled and queued work

**What this is.** Everything this application expects a machine to run for it without being asked: ten scheduled commands and one queue worker. Asked for on 21.09 because the answer was in three places and nowhere as one page — the schedule itself in `routes/console.php`, the requirement in [`../roadmap/deploy-checklist.md`](../roadmap/deploy-checklist.md) rows A1 and A2, and the consequences scattered across the journals.

**The one fact that matters most.** `crontab -l` returns *no crontab for bub*, and returned the same on the previous machine. **Nothing in the table below has ever run.** The application serves every page perfectly while none of it happens, which is the whole reason this page exists — see [`going-to-production.md`](going-to-production.md) and debt item **T-25b**.

## What the server needs

Two things, and only two.

**The cron line** — one entry, which runs Laravel's scheduler every minute and lets it decide what is due:

```
* * * * * cd /var/www/undernoinfluence && php artisan schedule:run >> /dev/null 2>&1
```

**The queue worker** — `supervisor/uni-worker.conf`, two processes of `queue:work database`, autostarted and autorestarting. `QUEUE_CONNECTION=database`, so the queue is a table and needs no Redis. **Set `user=` to the web user this host actually has before loading the file:** the conf says `www-data`, which exists on Debian and Ubuntu and not on Fedora or RHEL, and a wrong value fails silently until a queued job never runs (deploy checklist A3).

## The schedule, as it stands today

| When | Command | What it does | What is untrue while it does not run |
|---|---|---|---|
| every 5 min | `uni:heartbeat` | Writes the timestamp the admin dashboard's `SchedulerHeartbeatWidget` reads, red after fifteen minutes | **This is the alarm for everything else on this page.** Without cron it never writes, and the dashboard says so — it is the only row whose failure is visible from inside the product |
| every 5 min | `PingExternalHealthcheck` (queued job) | Pings an outside service, so a dead box, worker or database is noticed from outside. Inert until `UNI_HEALTHCHECK_PING_URL` is set (P41) | The heartbeat above can only be read on the machine it watches. This is the half that survives the machine going down |
| hourly | `uni:check-offer-freshness` | Repairs `offer_updated_at` drift left by raw queries and bulk operations | `offer_updated_at` is what the freshness pill on every venue page is computed from, so a day of drift is a day of a badge stating something false — see [`freshness-and-verification.md`](freshness-and-verification.md) and `what-the-badges-claim` |
| 03:10 | `analytics:roll-up` | Summarises raw events into `venue_stats`, `venue_category_stats`, `search_stats` | The owner dashboard's monthly views and every count an owner is shown stop advancing. Raw events are kept, so nothing is lost — it is recoverable by running the rollup late |
| 00:00 | `uni:anonymise-expired-data` | Nulls `venue_offer_logs.user_id` and `audit_logs.actor_id` at 24 months; empties `venue_claims` and `venue_inaccuracy_reports` contact fields 12 months after the decision. **Rows are kept** | **The privacy policy becomes untrue.** Four retention windows are enforced by this command and by nothing else — [`../compliance/ropa.md`](../compliance/ropa.md), `personal-data-expires-rows-do-not` |
| 08:00 | `uni:remind-waiting-claims` | E-mails the admins about owner requests that have waited more than 14 days, each request once | A request sits forever and nobody is told. Nothing is rejected automatically, by decision — `a-waiting-request-is-flagged-never-rejected-automatically` |
| 00:00 | `queue:prune-failed --hours=720` | Drops failed jobs older than 30 days | A failed mail job keeps the recipient's address in its payload and `failed_jobs` is otherwise never emptied, so addresses accumulate with no retention |
| 01:00 | `backup:clean` | Rotates to 7 daily + 4 weekly, before the new archive is written | The bucket grows without limit |
| 01:30 | `backup:run` | Database and uploaded files, AES-256 encrypted, to Scaleway in production. Runs after the midnight anonymisation so an archive never carries a field the live database has let go | **There are no backups.** Art. 32(1)(d) asks for a restore that has been tested; deploy checklist A6 tracks the server half |
| 07:00 | `backup:monitor` | Mails if the newest archive is over a day old | This is the alarm for the two rows above — an expired Scaleway key or a broken crontab is otherwise silent |

**Deliberately not scheduled.** `analytics:prune-events` exists as a command and is never run by the scheduler: raw events hold no identifier and are kept indefinitely (`raw-events-are-kept-not-pruned`). `model:prune` is gone with it. **Nothing in this application deletes a row to satisfy a retention rule** — retention here is anonymisation, which is what `uni:anonymise-expired-data` does. If `analytics:prune-events` is ever scheduled it belongs strictly *after* the rollup, so that lowering retention cannot silently delete a day that was never summarised.

## What depends on the queue rather than the schedule

Every notification in the application implements `ShouldQueue`. With no worker they are not delayed, they are **lost**: a claim approval, an owner invite, a password reset, an erasure response. The registry lookup's retries and `PingExternalHealthcheck` are queued too.

This is why `UNI_OWNER_ACCESS` cannot open before the home-server session. The owner check is a mail path and a lookup path, and on a machine with no worker **it sends nothing and looks up nothing while appearing to work** — the form submits, the record is written, and no one is ever told.

## How to prove it on a new machine

In order, and none of it takes long:

1. `php artisan schedule:list` — ten entries, with next-due times.
2. Install the cron line, wait five minutes, open `/admin` and read the scheduler widget. Green means the whole page above is live.
3. `supervisorctl status uni-worker:*` — two processes running. Reboot the box and check again; `autostart=true` is the thing being tested.
4. `php artisan uni:remind-waiting-claims` by hand — it writes only when a request has actually waited over 14 days, so it is safe to run.
5. `php artisan backup:run` once by hand and watch the archive arrive in the bucket, then restore it into an empty scratch database — never into staging (`staging-is-seeded-never-copied`).

## Keeping this true

A new `Schedule::` line in `routes/console.php` adds a row here in the same commit, with what is untrue while it does not run. That last column is the point of the page: a schedule anyone can read off the code, and a consequence nobody can.

---

*See also: [`../roadmap/deploy-checklist.md`](../roadmap/deploy-checklist.md) A1–A3 and A6 · [`going-to-production.md`](going-to-production.md) · [`../compliance/ropa.md`](../compliance/ropa.md) · the schema map, now at `database/schema.md` in the application repository*
