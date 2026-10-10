---
description: "Crash course: day-two operations — how the live box fits together, where to look when it breaks, and the habits that keep it boring."
version: 1.0
owner: Paweł Milewski
updated: 2026-10-10
status: teaching document — holiday series, course 2 of 6
---

# Course 2 — Running the live server

The runbook gets the box built. This course is about everything after: the day the site answers 502, the morning the disk-space e-mail arrives, the week Ubuntu wants a reboot. The goal isn't to make you a sysadmin. It's to give you a **mental model of the box** good enough that, faced with a symptom, you know which of five things to look at first.

Everything named here is what Ansible actually installs (`ansible/roles/`) and what `deploy.php` actually does, as of 10.10.

## 1. The box in one picture

A request to `https://undernoinfluence.pl/miejsce/foo` travels like this:

```
visitor ──DNS (OVH)──▶ VPS public IP
                         │
                    ufw firewall        (only 22, 80, 443 open)
                         │
                       nginx            TLS (certbot's certificate), static files,
                         │              /build and /vendor straight from disk
                         ▼
                      PHP-FPM 8.5       a pool of PHP processes, each runs Laravel once per request
                         │
                       Laravel          /var/www/undernoinfluence/current  → a release directory
                         │
                   PostgreSQL 18        on loopback only, same box
```

Beside that request path, three things run **without any visitor**:

- **The scheduler.** One cron line runs `php artisan schedule:run` every minute. It in turn runs the heartbeat (every 5 min, which also checks disk), the external health ping (every 5 min), cache pruning, the offer-freshness check (hourly), the analytics roll-up (03:10 UTC), anonymisation (daily), the waiting-claims reminder (08:00), failed-job pruning, and backups (clean 01:00, run 01:30, monitor 07:00, all UTC).
- **The queue worker.** Supervisor keeps two `queue:work` processes alive (`uni-worker`). Mail and the health ping go through it. If the worker dies, **mail stops and the external ping stops**, and that's deliberate (see §4).
- **Housekeeping by the OS.** Unattended-upgrades installs security updates by itself. Certbot's timer renews the certificate and reloads nginx.

**Times are UTC** on the box (the playbook sets it). 01:30 UTC is 03:30 in Warsaw in summer and 02:30 in winter. Keep that in mind when you read logs against a clock.

### Who is who

- **`admin`** is you with sudo. Use it for anything that touches the system.
- **`deploy`** owns the code. It can reload PHP-FPM and nothing else with sudo. Deployer logs in as this user.
- **`www-data`** is what nginx, PHP-FPM and the worker run as.
- **`root`** can't log in over SSH at all. That's intended.

### The release layout

```
/var/www/undernoinfluence/
├── current  → releases/7        the symlink nginx serves
├── releases/3 … 7               the last five releases (keep_releases = 5)
└── shared/
    ├── .env                     the secrets, written by hand, never in git
    └── storage/                 logs, sessions, uploads: survive every deploy
```

A deploy builds a new `releases/N`, links `shared/` into it, runs migrations (on production, **after a database-only backup** if any are pending: `uni:backup:before-migrate`), flips `current`, reloads PHP-FPM, tells the workers to restart, and smoke-tests `/up` and the map module. A **rollback** just points `current` back at the previous release. That's why a rollback takes seconds, and also why **a rollback doesn't undo a migration** (course 3, §5).

## 2. Symptom → first place to look

Most incidents are one of a few shapes. Learn the shapes and you'll rarely be lost.

| You see | It usually means | First look |
|---|---|---|
| Browser can't connect at all / times out | Box down, network, firewall, or nginx stopped | Can you `ssh uni-prod`? If not: OVH control panel (is the VPS running? any incident?). If yes: `systemctl status nginx` |
| Certificate warning | Certificate expired or renewal failed | `sudo certbot certificates` (expiry date); `journalctl -u certbot` or `systemctl list-timers` |
| **502 Bad Gateway** | nginx is fine, but PHP-FPM isn't answering | `systemctl status php8.5-fpm`; nginx error log |
| **504 Gateway Timeout** | PHP is answering too slowly: a slow query, a stuck external call | nginx error log; Postgres activity (course 3, §4) |
| **500 / Laravel's error page** | The app threw an exception | `shared/storage/logs/laravel-YYYY-MM-DD.log`, the newest lines |
| **419 Page Expired** on forms | Session or CSRF token lost, often after changing `APP_KEY` or a sessions-directory permissions problem | Laravel log; permissions on `shared/storage/framework/sessions` |
| Pages work, but mail never arrives | Queue worker down, or Scaleway TEM refusing | `sudo supervisorctl status`; `worker.log`; the `failed_jobs` table |
| Healthcheck alarm e-mail from outside | Server, worker or database down, **or** the scheduler stopped | Work down the list: can you SSH? `supervisorctl status`? `/admin` heartbeat? |
| Disk-space e-mail from UNI | Disk above the warning threshold | `df -h`, then §5 |
| Site slow but up | CPU, memory, or a heavy query | `htop`; `free -h`; Postgres activity |

### The log files, in one place

| Log | Path | Holds |
|---|---|---|
| Laravel | `/var/www/undernoinfluence/shared/storage/logs/laravel-*.log` | Exceptions, app warnings. Daily files, 30 days |
| Audit | same folder, its own daily channel, 90 days | What the audit channel records |
| Queue worker | `shared/storage/logs/worker.log` | Every job processed or failed |
| nginx | `/var/log/nginx/access.log`, `error.log` | Every request; upstream (PHP) errors. 30 days |
| PHP-FPM | `journalctl -u php8.5-fpm` | Pool crashes, "server reached max_children" |
| PostgreSQL | `/var/log/postgresql/postgresql-18-main.log` | Connection errors, slow or failed statements |
| System | `journalctl` (with `-u <service>`, `--since "1 hour ago"`) | Everything systemd starts |

## 3. The ten commands that cover 90% of it

```bash
systemctl status nginx php8.5-fpm postgresql supervisor cron   # is everything running?
sudo systemctl restart php8.5-fpm                              # restart one service
journalctl -u php8.5-fpm --since "30 min ago"                  # a service's own log
tail -n 100 -f /var/www/undernoinfluence/shared/storage/logs/laravel-$(date +%F).log
sudo tail -n 50 /var/log/nginx/error.log
sudo supervisorctl status                                      # are both workers RUNNING?
df -h                                                          # disk per filesystem
sudo du -sh /var/* | sort -h                                   # what's eating it
free -h                                                        # memory, incl. swap
htop                                                           # live CPU / memory per process (q to quit)
```

Plus one for "is it the app or the network?": on the box, `curl -sI -H "Host: undernoinfluence.pl" http://127.0.0.1/up`. If that answers 200, PHP and Laravel are fine, and the problem is in front of nginx (DNS, TLS, firewall, OVH). The smoke test does exactly this, which is why it sends the `Host` header. The app only answers its own hostname (`trustHosts()`), and a bare request gets a deliberate 400.

**`restart` vs `reload`.** `reload` asks a service to re-read its configuration without dropping connections. Use it for nginx after a config change, and for PHP-FPM after a deploy. `restart` kills and starts again, so visitors in flight get an error. When something is *broken*, restart. When something *changed*, reload.

## 4. The alarms you have, and the one blind spot

UNI has three alarms, designed in layers:

1. **The external healthcheck** (Healthchecks.io, checklist B9). Every 5 minutes, the scheduler queues a job, and the worker runs it and pings an outside URL. If pings stop, the outside service e-mails you. A single ping proves the box, cron, the scheduler, the queue, the worker and the database are **all** alive, because the ping can only happen if every link in that chain works. That's the meaning of "the alarm rings from outside the building": a dead server can't send its own alarm.
2. **The disk warning** (`uni:heartbeat`), sent by e-mail once a day while the disk is above the threshold.
3. **The backup monitor**, which mails if the newest archive is over a day old.

**The blind spot:** alarms 2 and 3 need *mail*, which needs the worker. And alarm 1 tells you *that* something is wrong, never *what*. So the first move after a healthcheck alarm is always the same three questions: can I SSH in? Is supervisor showing both workers RUNNING? Does `/admin` show the heartbeat green? Their answers separate "box dead" from "worker dead" from "scheduler dead" in one minute.

What there is **no** alarm for yet: the site returning 500s while the box is otherwise healthy (the ping job doesn't load pages), and certificate expiry (certbot's renewal test runs at provisioning, not continuously). An uptime check on the public URL is the cheap fix for both. Healthchecks.io doesn't do HTTP checks. A separate free uptime monitor would, and it's in the questions at the end.

## 5. Disk: the slow-motion incident

On a 40 GB VPS, disk is the resource most likely to run out, and it runs out slowly enough to be prevented. What grows:

- **The `events` table and its indexes.** Kept indefinitely by decision (raw-events-are-kept-not-pruned). Each row is small, but every page view writes one. Course 3, §6 shows how to measure it.
- **Local backup staging.** `spatie/laravel-backup` builds the archive locally before uploading. During the run, you need free space for a full archive.
- **Logs**, kept 30 days (nginx, Laravel) or 90 (audit). Bounded, but a burst of errors can write gigabytes in a day.
- **Old releases.** Five are kept, each with its own `vendor/`. Bounded.
- **The system journal and apt caches.** `sudo journalctl --vacuum-size=200M` and `sudo apt clean` are safe.

When the warning arrives: `df -h` to see how bad it is, `sudo du -sh /var/* | sort -h` and drill down. **Never delete files inside `/var/lib/postgresql` by hand.** That's how databases die. If Postgres is the large thing, the answer is in course 3, not `rm`.

## 6. Updates and reboots

Ansible configured **"security updates stay automatic, reboots stay yours"** (role `base`, 2.6). Ubuntu installs security patches nightly. Kernel and some library updates only take effect after a reboot, and the box tells you by creating `/var/run/reboot-required`. The login banner says so too.

A good rhythm:

- **Weekly**, glance at the login banner when you SSH in. If a reboot is required, do it at a quiet hour (early morning Warsaw time): `sudo reboot`, wait a minute, then check the site and `supervisorctl status`. Every service is enabled at boot, so it should come back on its own. **The first reboot is worth doing deliberately soon after launch**, while you're watching, to prove that.
- **Monthly**, `sudo apt update && apt list --upgradable` to see non-security updates waiting. Per your own rule (newest-versions-before-prod): after launch, security goes in immediately, patch and minor updates in batches, majors deliberately.
- **Never** do a PHP or Postgres *major* upgrade on production directly. Rehearse it on the home server, which mirrors production for exactly this.

## 7. Habits that make incidents short

- **Never edit code on the server.** A hot-fix made in `current/` vanishes on the next deploy and was never tested. The fix path is PC → test → tag → `dep deploy`. If production is broken *now*, `dep rollback production` first, fix calmly second.
- **Change one thing at a time**, and write down what you changed. Two simultaneous changes make every later symptom ambiguous.
- **Rollback first, diagnose second**, whenever a deploy is the most recent change. A rollback is seconds and reversible. Debugging on a broken live site is neither.
- **Keep the incident note while it's happening.** Times (in UTC, matching the logs), what you saw, what you did. GDPR's breach register wants exactly this if personal data was ever involved (`compliance/breach-runbook.md`, 72 hours to UODO). For plain outages, it's what makes the journal entry honest.
- **Don't run `optimize:clear` or `cache:clear` on production.** `deploy.php` already warns about this: the cache store is the database, and it holds the scheduler heartbeat, the queue-restart signal and the login rate limits.

## 8. A worked example

*It's Saturday, 09:00. Healthchecks.io e-mails: "UNI is DOWN" (no ping for 15 minutes).*

1. Open the site on your phone. **It loads.** So nginx, PHP and Postgres answer, and the problem is in the background chain.
2. `ssh uni-prod`, then `sudo supervisorctl status`. Both `uni-worker` processes show **FATAL**.
3. `tail -n 50 shared/storage/logs/worker.log`: the worker crashed on start with a database permission error after last night's deploy.
4. The deploy is the most recent change, so `dep rollback production` from the PC, then `sudo supervisorctl restart uni-worker:*`.
5. Within 5 minutes the ping arrives and the alarm clears. Mail queued during the outage is still in the `jobs` table, and the worker sends it now.
6. Note: what failed, when, what fixed it. Then fix the real cause on the PC, test, re-tag, deploy.

Twenty minutes, mostly reading. Any incident that follows the shape *alarm → narrow it down → undo the latest change → fix properly later* stays small.

## Questions to bring back

1. **A public-URL uptime check.** Nothing alerts on "pages return 500 while the box is healthy", or on an expiring certificate. A free external HTTP monitor (checking `/up` and one real venue page every few minutes, plus certificate expiry) would close both. Add it to the deploy checklist next to B9?
2. **`LOG_LEVEL` on production.** Check the production `.env` template in runbook 7.5 sets `LOG_LEVEL` to something like `warning`, not `debug`. Debug logging on a live site fills disk faster and can write request details you'd rather not keep. I didn't verify what 7.5 writes.
3. **The first deliberate reboot.** Put "reboot production once, watch everything come back" into Phase 7 as an explicit step, so the first reboot isn't an unplanned one?
4. **Where you are when it breaks.** The rollback runs from the PC. Runbook 5.3 (emergency rollback without the PC) covers the "away from home" case. Worth reading 5.3 again with this course in mind, since this trip is exactly the scenario.
