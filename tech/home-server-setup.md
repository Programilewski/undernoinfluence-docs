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
| **A web server** | nginx + PHP-FPM, both stock. TLS is not nginx's job here — Tailscale terminates it (step 5) |
| **Incus system container** | The application goes in a container so n8n and restic keep working untouched. Deliberately a system container, not Docker — production is bare Ubuntu under Ploi and parity is the point (INFRA-01's own instruction for the day it was revisited) |

## Before you start

**The host is Ubuntu 24.04.5 LTS and already runs Docker apps**, which stay where they are and are not touched.

**`supervisor/uni-worker.conf` is correct as shipped.** It sets `user=www-data`, which exists on Debian and Ubuntu; the file warns that it does not exist on Fedora or RHEL and fails silently there. The container is Ubuntu, so nothing needs changing — this is the first deploy where that line has ever mattered.

**The Tailscale address goes nowhere near a file** ([[decisions/product/no-machine-addresses-in-the-repo]]). It lives in `.env` on the box and in your head.

## The steps

### 1. Incus, and a container to put it in

**The box is Ubuntu 24.04.5 LTS and already runs Docker apps.** The application does not join them: it goes in an Incus **system container**, which behaves like a small Ubuntu server — systemd, cron, supervisor, several processes — where a Docker container is one process with no init and would make every later step look nothing like production. That is INFRA-01's own reasoning, and it is why this is worth five extra minutes.

**It also buys the thing you asked for.** `incus delete uni --force` and you are back to a clean box in seconds, so this environment can be broken on purpose. Your n8n and restic never see any of it.

On the host:

```bash
sudo apt update && sudo apt install -y incus
sudo adduser "$USER" incus-admin        # log out and back in, or: newgrp incus-admin
incus admin init --minimal
incus launch images:ubuntu/24.04 uni
incus exec uni -- bash                  # you are now inside the container
```

**Check:** `incus list` shows `uni` RUNNING with an IPv4 address. Note that address — the host reaches the container on it, and step 5 needs it.

Inside the container:

```bash
apt update && apt install -y \
  php8.3-fpm php8.3-cli php8.3-mbstring php8.3-xml php8.3-curl php8.3-zip \
  php8.3-bcmath php8.3-intl php8.3-pgsql php8.3-gd \
  postgresql nginx supervisor git unzip curl
curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
```

Everything there is stock Ubuntu 24.04 — **no third-party PHP repository is needed**, because the application requires `^8.3` and 8.3 is what 24.04 ships.

**Check:** `php -v` prints 8.3.x, `php -m | grep pdo_pgsql` prints a line, and `composer -V` works. If `pdo_pgsql` is missing nothing later will work, and the failure will present as a database problem rather than a missing extension.

**One difference from the laptop, deliberately accepted:** Ubuntu 24.04 ships PostgreSQL 16 and the laptop runs 18.6. For this environment that is fine — the schema uses nothing version-specific, no PostGIS, no extensions beyond `plpgsql`. Staging is where version parity has to be real, and staging will match whatever production runs.

### 2. The database and its role

Inside the container:

```bash
sudo -u postgres psql
```
```sql
CREATE ROLE preprod_uni_app LOGIN PASSWORD 'generate-one-here';
CREATE DATABASE preprod_uni OWNER preprod_uni_app;
\q
```

Two names, environment first — `preprod_uni` and `preprod_uni_app` — for the reason checklist A11 gives: `uni_production` and `uni_staging` differ by a suffix that is skimmed past in a terminal at night, while a connection string starting `preprod_` cannot be misread as production.

**Generate the password on the box and do not reuse the laptop's** (checklist A7). It lives only in this container's `.env`.

**Check:** `psql -U preprod_uni_app -h 127.0.0.1 -d preprod_uni -c 'select 1;'` returns a row.

### 3. The code

The repository is private, so the container needs its own read-only key rather than your personal one:

```bash
ssh-keygen -t ed25519 -C "uni-homeserver" -f ~/.ssh/id_ed25519 -N ""
cat ~/.ssh/id_ed25519.pub
```

Add that public key to **the `undernoinfluence` repository → Settings → Deploy keys**, read-only, *not* to your account. A deploy key reaches one repository; an account key reaches everything you own, and this box is the one that may be broken freely.

```bash
mkdir -p /var/www && cd /var/www
git clone git@github.com:Programilewski/undernoinfluence.git undernoinfluence
cd undernoinfluence
git checkout v0.1.0          # a tag, never a branch
composer install --no-dev --optimize-autoloader
```

**The tag, not the branch** ([[decisions/product/a-release-is-a-tag-deployed-from-git]]). If no tag exists yet, make one on the laptop first — that is what this environment is deploying, and "whatever `main` was at the time" is not a thing you can redeploy later.

**Check:** `git describe --tags` names the tag you meant.

### 4. `.env`

Copy `.env.example` and change only what the environment demands: `APP_ENV`, `APP_DEBUG`, `APP_URL` (the Tailscale name), the database values, and `APP_KEY` via `php artisan key:generate`.

**`UNI_OWNER_ACCESS` stays `false`** unless you are deliberately testing the owner side — `.env.example` is production and it ships off ([[decisions/product/owner-panel-ships-behind-one-switch]]).

**Check:** `php artisan --version` prints a version. **If it throws instead, read the error** — on 22.09 this exact step failed because `.env.example` shipped an empty value where a config default was expected, and every artisan command threw before doing anything. That is fixed and pinned by a test, but this is where that class of failure appears.

### 5. Assets, and reaching it from a phone

**Build on the laptop, from the same tag**, then copy across — never on the server (checklist C2):

```bash
# on the laptop, on the tag
npm ci && npm run build
incus file push -r public/build uni/var/www/undernoinfluence/public/     # or rsync via the host
```

**Confirm `public/hot` does not exist on the server.** If it does, Laravel emits asset URLs pointing at a Vite dev server that is not there, and every page renders unstyled **with nothing in the log** (checklist C3). This is the same fact that made the test suite lie on 22.09.

**Tailscale, on the host, not in the container:**

```bash
# on the host, where Tailscale already runs
tailscale serve --bg --https=443 http://<container-ip>:80
tailscale serve status
```

That publishes the container on your tailnet over **real HTTPS with a valid certificate**, which is not cosmetic here: the consent cookie is `Secure`, and a browser silently discards a `Secure` cookie over plain HTTP — the exact defect fixed on 02.09, where every consent decision was lost and the banner returned on the next page load. Testing over `http://` would reproduce a bug that no longer exists and hide the behaviour you actually want to check.

Set `APP_URL` in `.env` to that HTTPS name, and `SESSION_SECURE_COOKIE=true` with it.

**Check:** the site opens on your phone, over mobile data, at an `https://` address, and the consent decision survives a reload.

### 5a. nginx in front of PHP-FPM

```nginx
server {
    listen 80 default_server;
    root /var/www/undernoinfluence/public;
    index index.php;

    location / { try_files $uri $uri/ /index.php?$query_string; }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
    }

    # Nothing outside public/ is ever served.
    location ~ /\. { deny all; }
}
```

```bash
chown -R www-data:www-data /var/www/undernoinfluence/storage /var/www/undernoinfluence/bootstrap/cache
nginx -t && systemctl reload nginx
```

**`root` points at `public/`, not at the project directory.** Pointed one level up, `.env` is downloadable over HTTP — the single most common way a Laravel application leaks its database credentials.

**Check:** `curl -I http://127.0.0.1/` from inside the container returns 200, and `curl http://127.0.0.1/.env` returns 403 or 404 rather than a file.

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
