---
owner: Paweł Milewski
updated: 2026-09-22
status: runbook — written before the first run. Every step has a check; if a check fails, stop there rather than continuing
---

# Putting UNI on the home server

**What this environment is for.** Using the application on real devices over Tailscale — a phone, a tablet, someone else's laptop — rather than proving a deploy works. Nothing here is depended on and nothing here is protected, which is what makes it the environment where things may be broken freely. See [[decisions/product/three-environments-and-what-each-is-for]].

**It is also the first time anything scheduled has run on any machine this project has lived on.** That is the part worth doing carefully, because every failure it has is silent.

## What it needs, checked rather than assumed

| Requirement | Why, and what was checked |
|---|---|
| **PHP ≥ 8.3** | `composer.json` requires `^8.3`, not 8.5. Ubuntu 24.04's stock PHP 8.3 is enough — no third-party repository needed. Plus the extensions Laravel always needs: `mbstring`, `xml`, `curl`, `zip`, `bcmath`, `intl`, `pgsql`, `pdo_pgsql`, `gd` |
| **PostgreSQL** | Any recent version. **No PostGIS**: the migrations use `decimal(9,6)` for coordinates and the only extension in the live database is `plpgsql`. An earlier note assumed PostGIS parity was needed; it is not |
| **No Redis** | The queue driver is `database`. Sessions and cache can stay on the database or file driver here |
| **Node** | **Not on the server.** Assets are built off the box (checklist C2) and shipped. A Vite build competing with Postgres for memory is how a deploy kills a database |
| **A web server** | nginx or Caddy. Caddy is less work here because Tailscale can terminate TLS for you |
| **Incus system container** | The application goes in a container so n8n and restic keep working untouched. Deliberately a system container, not Docker — production is bare Ubuntu under Ploi and parity is the point (INFRA-01's own instruction for the day it was revisited) |

## Before you start

1. **Tell me the distro and version of the container.** One value depends on it: `supervisor/uni-worker.conf` ships `user=www-data`, which exists on Debian and Ubuntu and **not** on Fedora or RHEL. A wrong value there fails silently until a queued job never runs — the file says so in a comment, and this is the first time it matters.
2. **The address goes nowhere near a file.** [[decisions/product/no-machine-addresses-in-the-repo]].

## The steps

### 1. The container, and the stack inside it

```bash
incus launch images:ubuntu/24.04 uni
incus exec uni -- bash
apt update && apt install -y php8.3-{cli,fpm,mbstring,xml,curl,zip,bcmath,intl,pgsql,gd} \
    postgresql nginx git unzip
```

**Check:** `php -v` shows 8.3 or newer, and `php -m | grep pdo_pgsql` prints a line. If `pdo_pgsql` is missing, nothing else in this runbook will work and the failure will look like a database problem.

### 2. The database and its role

Two names, environment first — `preprod_uni` and `preprod_uni_app` — for the reason checklist A11 gives: `uni_production` and `uni_staging` differ by a suffix that is skimmed past in a terminal at night, while a connection string starting `preprod_` cannot be misread.

**Check:** `psql -U preprod_uni_app -h 127.0.0.1 -d preprod_uni -c 'select 1;'` returns a row.

### 3. The code

Clone the application repository — **the tag, not the branch** ([[decisions/product/a-release-is-a-tag-deployed-from-git]]). Then `composer install --no-dev --optimize-autoloader`.

**Check:** `git describe --tags` names the tag you meant to deploy.

### 4. `.env`

Copy `.env.example` and change only what the environment demands: `APP_ENV`, `APP_DEBUG`, `APP_URL` (the Tailscale name), the database values, and `APP_KEY` via `php artisan key:generate`.

**`UNI_OWNER_ACCESS` stays `false`** unless you are deliberately testing the owner side — `.env.example` is production and it ships off ([[decisions/product/owner-panel-ships-behind-one-switch]]).

**Check:** `php artisan --version` prints a version. **If it throws instead, read the error** — on 22.09 this exact step failed because `.env.example` shipped an empty value where a config default was expected, and every artisan command threw before doing anything. That is fixed and pinned by a test, but this is where that class of failure appears.

### 5. Assets, built elsewhere

Build on the laptop from the same tag, then copy `public/build/` across. Confirm `public/hot` does **not** exist on the server: if it does, Laravel emits asset URLs pointing at a dev server that is not there, and every page loads unstyled with no error in the log (checklist C3).

**Check:** `public/build/manifest.json` exists, `public/hot` does not.

### 6. Migrate, and make the first admin

```bash
php artisan migrate --force
php artisan uni:create-admin
```

The command prompts for the password rather than taking it as an argument, so it stays out of shell history. Filament's own `make:filament-user` creates role `user`, which `/admin` refuses — use ours (checklist A10).

**Check:** you can log in at `/admin` from your phone over Tailscale.

### 7. Cron — the thing that has never run

```cron
* * * * * cd /var/www/undernoinfluence && php artisan schedule:run >> /dev/null 2>&1
```

One line. It runs ten scheduled commands:

| Schedule | Command | What is untrue while it does not run |
|---|---|---|
| every 5 min | `uni:heartbeat` | The admin dashboard cannot tell you the scheduler stopped |
| every 5 min | `PingExternalHealthcheck` | The outside alarm hears nothing — dormant until `UNI_HEALTHCHECK_PING_URL` is set |
| hourly | `uni:check-offer-freshness` | **"Sprawdzona karta" keeps claiming a menu is fresh when it is not** |
| 03:10 | `analytics:roll-up` | Owner analytics stop advancing |
| 00:00 | `uni:anonymise-expired-data` | **The privacy policy's retention windows stop being kept** |
| 08:00 | `uni:remind-waiting-claims` | An owner request past 14 days is never flagged |
| 00:00 | `queue:prune-failed` | Failed jobs accumulate |
| 01:00 | `backup:clean` | Rotation stops |
| 01:30 | `backup:run` | **No backups** |
| 07:00 | `backup:monitor` | Nobody is told the backups stopped |

**Check:** wait six minutes, then open `/admin`. The dashboard reports how long ago the scheduler last ran and turns red after fifteen minutes. Green is the proof — this is the first time in the project's life it can be green.

### 8. The queue worker

`supervisor/uni-worker.conf`, with `user=` set to whatever the web server actually runs as in this container. Notifications implement `ShouldQueue`: without a worker, a claim e-mail is **lost, not delayed**.

**Check:** `supervisorctl status uni-worker` shows RUNNING, and a test notification arrives.

### 9. Mail

Scaleway TEM is decided and signed but was never configured. Until it is, `MAIL_MAILER=log` writes mail to the log — fine for this environment, and it means "did it send?" is answerable by reading a file.

**Check:** trigger one owner e-mail and find it in `storage/logs/laravel.log`.

### 10. What to actually do once it is up

This is the point of the environment, and it is the step most likely to be skipped:

- Open the site **on your phone, on mobile data** rather than wifi, and use the map and the filters with a thumb.
- Check the venue page and the discovery list at phone width, in the dark palette, outdoors if you can.
- Hand it to somebody who has never seen it and watch where they stop.

## What this environment must never have

Real personal data, anything production depends on, a backup that matters, or the outside monitor ([[decisions/product/the-alarm-rings-from-outside-the-building]] — an alarm in the same building cannot report the building being down).

---

*See also: [[tech/scheduled-work]] · [[roadmap/deploy-checklist]] · [[decisions/product/three-environments-and-what-each-is-for]] · [[decisions/product/a-release-is-a-tag-deployed-from-git]]*
