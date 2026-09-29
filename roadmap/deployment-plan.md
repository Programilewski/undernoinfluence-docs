---
owner: Paweł Milewski
updated: 2026-09-28
status: plan — nothing here is executed yet. It executes the servers-are-built-and-deployed-from-the-pc-without-a-panel record, phase by phase
---

# Deployment plan — home server and production, side by side

**What this is.** The eight phases agreed on 28.09, written out step by step, with what happens on the home server and what happens on production in two columns next to each other. Where a cell says **same**, the step is identical on both — which is the point of the decision: most of this is written once and run twice. Where the columns differ, the difference is deliberate and the reason is in the cell.

**How to read it.** Every phase ends with a **Done when** line. Nothing in a phase starts until the phase before it passes. Hours are estimates, about 25–35 in total including learning Ansible. `PC` means your desktop PC; `the host` means the home-server laptop; `the container` means the new Incus container on it.

**What does not change.** Backups as decided on 16.09 (7 daily + 4 weekly, AES-256, Scaleway with object lock on production). Staging stays deferred until production holds data worth protecting. The outside monitor uses the ping URL that already exists.

---

## Findings raised while writing this

> **29.09 — the commands are in `deployment-runbook.md`**, step numbers matching this document. Where the two disagree the runbook is newer: its Findings 1–6 supersede this document's Finding 4 (no GitHub key on any server — Deployer uploads the tag from the PC) and step 2.3 (Ansible connects as a separate `admin` user; `deploy` keeps its one sudo line), and add the `/admin` allowlist this plan left out.

These were found by reading the application against the plan, not asked about. Ranked by consequence.

1. **`supervisor/uni-worker.conf` hard-codes the old layout.** Its `command` runs `/var/www/undernoinfluence/artisan` and its log goes to `/var/www/undernoinfluence/storage/logs/worker.log`. Under Deployer the code lives in `current/`, so the worker would fail to start on a fresh box — silently, which is what the file's own comments warn about. The playbook templates this file from inventory variables (Phase 2), and the copy in the repository is either deleted or reduced to a pointer to the template, so there is one source of truth rather than two that drift.
2. **The cron line in the docs has no umask.** `tech/scheduled-work.md` still prints `* * * * * cd /var/www/undernoinfluence && php artisan schedule:run …`, while the 25.09 umask record says the umask is set inline in the cron entry. Under the new plan cron runs as `www-data` (the same user as the worker and PHP-FPM), which removes the user split that caused the 25.09 lock-out — but the deploy user still runs `artisan` during every deploy, so the umask stays. The playbook writes the corrected line; the doc is updated with it.
3. **The home server must not run `APP_ENV=production`.** Demo data refuses to seed in production (`DemoData::isAllowed()`, 22.09), and backups default to Scaleway when `APP_ENV=production`. The home server keeps a non-production environment name (`preprod`, matching its database name), which gives it demo data and local backups with no override. The one thing it loses is `URL::forceScheme('https')`, which only production sets — acceptable, since Tailscale serves it over HTTPS anyway, but it is a real difference and is written here so it is not rediscovered.
4. **Each server needs its own read-only GitHub deploy key.** Deployer checks the tag out *on the server*, so the server reads the private repository. GitHub refuses the same deploy key on two repositories but allows several keys per repository — so two keys, one per server, each read-only. The home server's existing key (`uni-homeserver`) dies with the old container and is replaced, not copied.
5. **The pre-migration backup needs a trigger the deploy can read.** The decision record says production backs up before any deploy with pending migrations. `php artisan migrate:status --pending` lists them (checked on Laravel 13.25); the deploy step runs `backup:run --only-db` when that list is non-empty. That backup counts toward the 7-daily rotation like any other, so a day with three deploys does not push out a week of history — it adds archives the next 01:00 clean-up thins.
6. **The composer `test` script still cannot prove a build.** It runs `npm run build` but does not refuse to run while `public/hot` exists (checklist C3, proved on 28.09). Two lines fix it. It is Phase 1 below because CI will not catch it — CI never has a hot file — so only the local run is exposed.

---

## Phase 0 — Before any building (PC, ~1 h)

| # | Step | Home server | Production |
|---|---|---|---|
| 0.1 | Ship pending work with the current process first | Commit and tag `v0.1.4`, deploy it with the manual runbook ("Updating to a new release"). Keeps the four finished files out of the new process's blast radius | — nothing; production does not exist yet |
| 0.2 | Decision recorded | **Done 28.09** — servers-are-built-and-deployed-from-the-pc-without-a-panel | same |
| 0.3 | Your SSH key | One ed25519 key with a passphrase on the PC: `ssh-keygen -t ed25519 -C "pawel-pc"`. Loaded into the agent once per login | same key |
| 0.4 | The backup key | A second ed25519 key, generated once, private half stored only in the password manager. Registered on both servers by the playbook, so losing the PC never locks you out | same key |
| 0.5 | First access | Add the PC key to the **host** (`ssh-copy-id` from the PC; today it answers `Permission denied`). The container does not exist yet | **Reinstall the VPS from the OVH panel with Ubuntu 26.04 and the PC's public key attached**, so it is key-only from its first boot and no password ever exists. It is empty, so a reinstall costs nothing |
| 0.6 | SSH aliases in `~/.ssh/config`, never in the repo | `uni-home-host` → the laptop over Tailscale · `uni-home` → the container, `ProxyJump uni-home-host`, user `deploy` | `uni-prod` → the VPS, user `deploy` (and `uni-prod-bootstrap` with OVH's initial user, used once in Phase 7) |
| 0.7 | Pinned tools on the PC | `pipx install ansible-core==<exact version>` plus the `ansible.posix` and `community.general` collections pinned in `ansible/requirements.yml` | same tools |
| 0.8 | Deployer 8 | Open question 2: pinned phar outside the repo, or `composer require --dev deployer/deployer:8.0.5` (a dependency change, so your call) | same |

**Done when:** `ssh uni-home-host true` succeeds from the PC, `ansible --version` and `dep --version` print the pinned versions.

---

## Phase 1 — The repository (PC, ~2 h)

| # | Step | Home server | Production |
|---|---|---|---|
| 1.1 | Layout in the application repo | `ansible/inventories/home/hosts.yml` + `group_vars/all.yml` | `ansible/inventories/production/hosts.yml` + `group_vars/all.yml` |
| 1.2 | Shared files | `ansible/provision.yml`, `ansible/roles/{base,php,postgres,nginx,app,worker,tls}/`, `deploy.php`, `.github/workflows/tests.yml` — one copy, both servers | same |
| 1.3 | Inventory host | `uni-home` (the alias) | `uni-prod` (the alias) — **no address in the repo**, per no-machine-addresses-in-the-repo |
| 1.4 | `server_name` | the container's Tailscale-served name is not needed here: nginx listens on `default_server`, Tailscale fronts it | `undernoinfluence.pl` and `www.undernoinfluence.pl` (www redirects to apex) |
| 1.5 | `tls_mode` | `none` — Tailscale terminates HTTPS on the host | `certbot` |
| 1.6 | `db_name` / `db_user` | `preprod_uni` / `preprod_uni_app` (checklist A11) | `prod_uni` / `prod_uni_app` |
| 1.7 | `ssh_allow_from` | the Incus bridge subnet only — the container is reachable only through the host | anywhere (key-only); revisit if the logs show noise |
| 1.8 | Secrets | none in the repo, on either side; `.env` is created on the box (Phase 3/7) | same |
| 1.9 | Test guard (Finding 6) | `composer.json` `test` script refuses to run while `public/hot` exists, with a message saying to stop `npm run dev`. With a test | same — it is an application change |
| 1.10 | Worker config (Finding 1) | `supervisor/uni-worker.conf` becomes the Ansible template `roles/worker/templates/uni-worker.conf.j2`, paths under `current/` | same |

**Done when:** `ansible-inventory -i ansible/inventories/home --list` and the production equivalent both print the host alias and nothing else identifying.

---

## Phase 2 — The playbook (PC, ~10–14 h — the biggest block)

Written once, run against both. Every role ends with a check that **fails the run** rather than printing a warning.

| # | Role / step | Home server | Production |
|---|---|---|---|
| 2.1 | Base: apt | `Acquire::ForceIPv4 "true"` — the container has no IPv6 route (22.09) | not set; OVH gives the VPS working IPv6 — check with `curl -6 -sI https://archive.ubuntu.com` once, and set it only if that fails |
| 2.2 | Base: users | `deploy` (owns the code, in group `www-data`), both public keys in its `authorized_keys`. `www-data` runs PHP-FPM, the worker and cron | same |
| 2.3 | Base: sudo for deploy | exactly one NOPASSWD line: `systemctl reload php8.5-fpm`. Nothing else | same |
| 2.4 | Base: SSH | `PermitRootLogin no`, `PasswordAuthentication no`, `KbdInteractiveAuthentication no`. The handler runs `sshd -t` before reloading | same — and this is the run where OVH's root/initial login ends |
| 2.5 | Base: firewall (ufw) | allow 22 from the bridge, 80 from the bridge (Tailscale serve on the host reaches the container over it) | allow 22, 80, 443 from anywhere; deny the rest |
| 2.6 | Base: updates | `unattended-upgrades`, security pocket only, automatic reboot off (reboot is a thing you do) | same; `Unattended-Upgrade::Mail` to your address so a held package is not silent |
| 2.7 | Base: time and locale | timezone `UTC` (the schedule is in UTC), `pl_PL.UTF-8` generated | same |
| 2.8 | PHP 8.5 | stock Ubuntu 26.04 packages: `php8.5-fpm`, `-cli`, `-mbstring`, `-xml`, `-curl`, `-zip`, `-bcmath`, `-intl`, `-pgsql`, `-gd`. No PPA | same |
| 2.9 | PHP-FPM pool | `www-data`, `UMask=0002` via a systemd drop-in for `php8.5-fpm.service` (the umask record), OPcache at defaults | same |
| 2.10 | Composer | pinned version installed to `/usr/local/bin/composer`, checksum verified | same |
| 2.11 | `7zip` | installed — the restore path needs it even for local backups | same (checklist A6 step 5) |
| 2.12 | PostgreSQL 18 | stock package, `listen_addresses = 'localhost'`, database and role from inventory, password generated **on the box** and written to `/etc/uni/db-password` (root:root 0600) for Phase 3 to read. Default memory settings — the database is 12 MB | same |
| 2.13 | nginx: MIME | `.mjs` added to `/etc/nginx/mime.types` as `text/javascript` (the map fix, C7) — **never** a `types { }` block in `server` | same — Ubuntu 26.04's nginx lacks it too (checked 28.09) |
| 2.14 | nginx: site | `root /var/www/undernoinfluence/current/public`; `fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name` and `DOCUMENT_ROOT $realpath_root`; gzip for CSS/JS/JSON/SVG; `expires max` + `Cache-Control "public, immutable"` for `/build/` and `/vendor/` (C6); deny dotfiles. Handler runs `nginx -t` before every reload | same template; production adds the 443 server and the 80→443 redirect |
| 2.15 | App layout | `/var/www/undernoinfluence/{releases,shared}` owned `deploy:www-data`; `shared/storage/**` directories `2775` (setgid to `www-data`); `shared/.env` placeholder `0640 deploy:www-data` | same |
| 2.16 | Worker | supervisor with the templated `uni-worker.conf`: `current/artisan`, `user=www-data`, `umask=0002`, `--sleep=3 --tries=3 --max-time=3600 --backoff=30`, `numprocs=2`, `stopwaitsecs=3600` | same |
| 2.17 | Cron | `/etc/cron.d/uni`: `* * * * * www-data umask 0002; cd /var/www/undernoinfluence/current && php artisan schedule:run >> /dev/null 2>&1` (Finding 2) | same |
| 2.18 | logrotate for nginx | `/var/log/nginx/*.log` daily, 30 days, compressed (checklist A5 — the 30-day retention from v7 §7) | same |
| 2.19 | TLS | skipped (`tls_mode: none`) | certbot via `--webroot` (not the nginx plugin, which would rewrite the templated config and fight Ansible). First run serves HTTP only with `/.well-known/acme-challenge/`, obtains the certificate, then templates the 443 server. Renewal deploy hook: `systemctl reload nginx`. The role runs `certbot renew --dry-run` and fails if it does |
| 2.20 | Checks that fail the run | `php -v` is 8.5.x · every extension in 2.8 loaded (`php -m`) · `psql --version` is 18.x · `nginx -t` passes · `curl -s -o /dev/null -w '%{content_type}' http://127.0.0.1/<any>.mjs` is `text/javascript` (a static test file the role places and removes) | same, plus `curl -sI https://undernoinfluence.pl` returns a valid certificate |

**Done when:** a second run of the playbook against the same box reports `changed=0`.

---

## Phase 3 — Rebuild the home server (host + PC, ~2–3 h)

| # | Step | Home server | Production |
|---|---|---|---|
| 3.1 | New machine | On the host: `incus launch images:ubuntu/26.04 uni-next` **next to** the old `uni`, which stays as a fallback until Phase 5. The host stays on 24.04. Docker's `FORWARD` rules already cover `incusbr0` | — Phase 7 |
| 3.2 | First access, by hand, once | `incus exec uni-next -- bash`: `apt install -y openssh-server`, create `deploy` with the PC key in `authorized_keys`. The only manual server step in the whole plan | — Phase 7 |
| 3.3 | Point the alias | `uni-home` in `~/.ssh/config` now reaches `uni-next`; `ssh uni-home true` succeeds | — |
| 3.4 | Provision | From the PC: `ansible-playbook -i ansible/inventories/home ansible/provision.yml` | — |
| 3.5 | GitHub deploy key (Finding 4) | On the box as `deploy`: `ssh-keygen -t ed25519 -C "uni-home-deploy" -N ""`; add the public half to the repository's Deploy keys, **read-only**. Delete the old `uni-homeserver` key from GitHub in Phase 5.4 | — |
| 3.6 | `shared/.env` | Built from `.env.example` on the box. Set: `APP_ENV=preprod`, `APP_DEBUG=false`, `APP_URL=https://<tailscale name>`, `DB_*` from 1.6 with the password from `/etc/uni/db-password`, `MAIL_MAILER=log`, `SESSION_SECURE_COOKIE=true`, `UNI_OWNER_ACCESS=false`, `UNI_HEALTHCHECK_PING_URL=` empty (the monitor never watches this box). `BACKUP_*` left empty — the non-production default is `backups-local`. `APP_KEY` generated on the box in Phase 4.3 | — Phase 7.4 |

**Done when:** `ssh uni-home` lands as `deploy`, the playbook's second run is `changed=0`, and `shared/.env` exists with no value copied from the PC or the old container.

---

## Phase 4 — The deploy recipe (PC, ~4–6 h)

`deploy.php` extends Deployer's Laravel recipe. One file; the two hosts differ only in labels.

| # | Step | Home server | Production |
|---|---|---|---|
| 4.1 | Hosts | `host('homeserver')->setHostname('uni-home')->set('labels', ['env' => 'home'])` | `host('production')->setHostname('uni-prod')->set('labels', ['env' => 'prod'])` |
| 4.2 | Common settings | `deploy_path /var/www/undernoinfluence`, `keep_releases 5`, `shared_files ['.env']`, `shared_dirs ['storage']`, `writable_mode chgrp`, `http_group www-data`, `composer_options --no-dev --optimize-autoloader --no-interaction --prefer-dist` | same |
| 4.3 | First deploy only | `php artisan key:generate` against `shared/.env`, once, by hand | same |
| 4.4 | **Guard: the tag** (runs locally, first) | refuses unless `--tag` is given, the tag exists on `origin`, `git ls-remote` agrees with the local tag's commit (the tag was not moved), and `gh run list --commit <sha> --workflow tests.yml --status success` finds a green run | same — plus refuses unless the same tag is the one `homeserver` is currently running (read from `current/REVISION`). Every tag reaches the home server first, enforced rather than remembered |
| 4.5 | Build assets (locally, once per deploy) | `git worktree add` a clean checkout of the tag in a temp dir → `npm ci && npm run build` → tar `public/build` and `public/vendor/maplibre-gl` → remove the worktree. `public/map-styles` is tracked and arrives with the checkout | same build; when deploying both in one sitting, the same tarball (checked by its hash) |
| 4.6 | Standard steps | `deploy:prepare` (lock, new release dir, checkout of the tag with the server's deploy key, shared links, writable) → `deploy:vendors` | same |
| 4.7 | Upload assets | the tarball into `{{release_path}}/public`, extracted as `deploy` | same |
| 4.8 | **Guard: assets** | refuses to continue unless `public/build/manifest.json`, `public/vendor/maplibre-gl/*/maplibre-gl.mjs`, `public/js/filament` (republished by `filament:upgrade` during composer) exist, and `public/hot` does **not** | same |
| 4.9 | Pre-migration backup (Finding 5) | skipped — nothing here is worth restoring | if `php artisan migrate:status --pending` lists anything: `php artisan backup:run --only-db`, and the deploy stops if it fails |
| 4.10 | Migrate | `artisan migrate --force` | same |
| 4.11 | Cache | `artisan optimize` — **never `optimize:clear`** (it wipes the database-backed cache: heartbeat, queue-restart signal, login rate limits). Runs after composer because `filament:upgrade` clears the caches (C4) | same |
| 4.12 | Switch | `deploy:symlink` (atomic `current` swap) → `sudo systemctl reload php8.5-fpm` (the realpath cache is 120 s) → `artisan reload` (queue restart + scheduler interrupt) | same |
| 4.13 | Smoke test after the switch | `curl` on the box: `/up` is 200, the `.mjs` returns `text/javascript`. If either fails the task prints the rollback command and exits non-zero | same, against `https://undernoinfluence.pl` |
| 4.14 | Clean-up | `deploy:cleanup` keeps 5. Old workers have exited by then — `artisan reload` asked them to, and each finishes its current job first | same |
| 4.15 | **Never in any task** | `optimize:clear`, `cache:clear`, `migrate:rollback`, `db:seed` | same |
| 4.16 | First deploy | `dep deploy homeserver --tag=v0.1.4` | — Phase 7 |
| 4.17 | Once, by hand, over SSH | `php artisan uni:create-admin`; `php artisan db:seed --class=DemoDataSeeder` (allowed: not production) | — Phase 7 |
| 4.18 | Tailscale | On the host: `tailscale serve --bg --https=443 http://<uni-next address>:80`, replacing the old container's line | — |

**Done when:** on your phone, over mobile data: pages render, a map draws, the consent choice survives a reload, `/admin` shows the scheduler heartbeat green after six minutes, and a queued e-mail appears in `shared/storage/logs/`.

---

## Phase 5 — Prove it (~2 h)

| # | Step | Home server | Production |
|---|---|---|---|
| 5.1 | Rollback | `dep deploy homeserver --tag=v0.1.3`, then `dep rollback homeserver`. The site stays up throughout; the heartbeat stays green (proves `optimize:clear` is really absent) | — proven here, trusted there |
| 5.2 | Rebuild from nothing | `incus delete uni-next --force`, then Phase 3 and 4.16–4.18 again from scratch. If anything needed a hand fix, the fix goes into the playbook and this step is repeated | — this is why production is safe to touch |
| 5.3 | Emergency rollback by hand | Try the three lines from Phase 8.3 once, from a device that is not the PC, using the backup key | — |
| 5.4 | Retire the old | `incus delete uni --force`; remove the old `uni-homeserver` deploy key from GitHub. `.env.bak-20260925` goes with the container | — |

**Done when:** a container built only by the playbook and one `dep deploy` passes the Phase 4 phone check.

---

## Phase 6 — CI (~2–3 h, can run in parallel with Phases 3–5)

| # | Step | Home server | Production |
|---|---|---|---|
| 6.1 | Workflow | `.github/workflows/tests.yml` on every push and tag: PHP 8.5 with a PostgreSQL 18 service → `composer install` → `migrate` against the empty database → `php artisan test` → `npm ci && npm run build` → assert the manifest and the MapLibre `.mjs` exist and `public/hot` does not | serves both — 4.4 reads its result before either deploy |
| 6.2 | Pinning | every third-party action pinned to a full commit SHA, not a tag | same |
| 6.3 | What it never holds | no SSH key, no `.env`, no deploy step | same |
| 6.4 | Cost | 1,052 tests in ~28 s locally; a few minutes a run against 2,000 free minutes a month, blocked rather than billed if exceeded | same |

**Done when:** a push shows a green run, and a deliberately broken test on a branch shows a red one.

---

## Phase 7 — Production (~4–6 h, only after Phase 5 passes)

| # | Step | Home server | Production |
|---|---|---|---|
| 7.1 | DNS | — | At OVH: `A` (and `AAAA` if 2.1 found IPv6 working) for `undernoinfluence.pl` and `www` → the VPS. Wait for it to resolve before 7.3 — certbot needs it |
| 7.2 | First access | — | Key-only from the reinstall (0.5). Run the playbook once as OVH's initial user via `uni-prod-bootstrap`; the run creates `deploy` and ends that login (2.4) |
| 7.3 | Provision | — | `ansible-playbook -i ansible/inventories/production ansible/provision.yml`, then again: `changed=0` |
| 7.4 | GitHub deploy key | — | Same as 3.5 with `-C "uni-prod-deploy"`, read-only |
| 7.5 | `shared/.env` | — | From `.env.example` on the box: `APP_ENV=production`, `APP_DEBUG=false` (B1), `APP_URL=https://undernoinfluence.pl`, `DB_*` from `/etc/uni/db-password`, `SESSION_ENCRYPT=true`, `SESSION_SECURE_COOKIE=true`, `SESSION_DOMAIN=undernoinfluence.pl` (B7), `HSTS_MAX_AGE=300` (B6), `UNI_OWNER_ACCESS=false`, `LOG_STACK=daily` (A4). Mail and backup values in 7.6–7.7 |
| 7.6 | Mail | stays `log` | `MAIL_MAILER=smtp` against Scaleway TEM; SPF, DKIM, DMARC for `tx.undernoinfluence.pl` (B2, B3); **Scaleway DPA signed before the first real claim**; then the Polish-inbox test (B2a) |
| 7.7 | Backups | local disk, as today | Checklist A6 in order: object lock on `uni-backups-prod` → default retention via one S3 API call → lifecycle rules → `BACKUP_*` in `shared/.env`, password in the password manager |
| 7.8 | Deploy | — | `dep deploy production --tag=<the tag the home server runs>` — 4.4 refuses any other |
| 7.9 | Once, by hand | — | `php artisan uni:create-admin` (A10). **No demo seeder** — it refuses, and production starts empty by design |
| 7.10 | Backup proof | — | `php artisan backup:run` by hand, see the archive arrive in the bucket, restore it into an empty scratch database on the box (never staging), compare row counts (A6 steps 6–7) |
| 7.11 | Monitor | never | Choose the provider (open question 1), set `UNI_HEALTHCHECK_PING_URL`, see the first ping arrive (B9) |
| 7.12 | The rest of the checklist | — | B4, C7 against the real domain, D1 (`route()` emits `https://`), D7 (a manual geolocation prompt check), A9 (Search Console before the import), A13 is moot (no one commits on a server). HSTS is raised only after the first **unattended** certificate renewal, about 60 days in (B6) |
| 7.13 | Privacy policy (E5) | — | Name OVH as the host. No Ploi line is needed any more |

**Done when:** the whole deploy checklist is green or explicitly deferred with a reason, and the monitor has been seen to alert by stopping the worker once.

---

## Phase 8 — Documentation (~1–2 h, alongside each phase, not after)

| # | Document | Home server | Production |
|---|---|---|---|
| 8.1 | `tech/home-server-setup.md` | The manual install and "Updating to a new release" become: "run the playbook, then `dep deploy`". The 24.04 / PPA / PHP 8.4 history is kept as history, marked superseded | a new `tech/production-setup.md` is **not** written — the playbook is the setup, and a second runbook would drift from it |
| 8.2 | `roadmap/deploy-checklist.md` | C8 and C9 retired (Ploi rows); A3 points at the worker template; C2 settled: built on the PC, uploaded by Deployer; A8 rewritten for AppArmor or dropped; the 17.09 banner and the Ploi lines in A3, A6 and E5 removed | same file |
| 8.3 | Emergency rollback (three lines, for any device with the backup key) | `ssh deploy@<box>` → `cd /var/www/undernoinfluence && ln -sfn releases/<previous> current.new && mv -Tf current.new current` → `sudo systemctl reload php8.5-fpm && php current/artisan reload` | same |
| 8.4 | `tech/scheduled-work.md` | cron line updated to the 2.17 form (Finding 2) | same |
| 8.5 | `three-environments-and-what-each-is-for` | the "production is bare Ubuntu under Ploi" line updated | same |

---

## After this, every release is

```
composer run test          (dev server stopped)
git tag -a v0.1.N -m "…" && git push origin main v0.1.N
                            → CI goes green
dep deploy homeserver --tag=v0.1.N
                            → use it on your phone
dep deploy production --tag=v0.1.N
```

A rollback is `dep rollback production` while the schema is still compatible; otherwise a forward fix. A risky schema change is split across two releases (expand, then contract).

---

## Forward plan — what gates what

1. **This session or next:** Phase 0 (≈1 h) and the Ploi clean-up in the documents (journal backlog item 3). Neither depends on anything.
2. **Phase 1 + 6 together** — both are repository work on the PC, and CI is useful from the first push.
3. **Phase 2** in two or three sittings; it is the only large block. Test each role against `uni-next` as it is written rather than all at the end.
4. **Phases 3–5** in one weekend sitting if possible — the rebuild-from-nothing in 5.2 is the proof everything else rests on.
5. **Phase 7** only after 5.2 passes. The mail and backup rows (7.6, 7.7) can start in the Scaleway console any time before.
6. **Interleave the venues.** 35 of 70; they are still the only thing that moves the launch date, and every phase above stands alone, so a week of venues between phases costs nothing.

---

## Open questions

| # | Question | Recommendation |
|---|---|---|
| 1 | Which outside monitor? | healthchecks.io free plan — 20 checks, BSD-3, self-hostable later, and the ping already exists |
| 2 | Deployer as a pinned phar, or a Composer dev dependency? | Dev dependency — pinned in the lock with everything else, and `vendor/bin/dep` always matches the repo. It is a dependency change, so yours to approve |
| 3 | A hardware security key for the SSH key? | Yes eventually (~€30–50 once); not a blocker |
| 4 | Add the `public/hot` guard to `composer run test` (1.9)? | Yes — two lines, removes a whole class of false green runs |
| 5 | Reinstall the VPS with the key attached (0.5), rather than harden OVH's password login afterwards? | Yes — it is empty, and a server that never had a password cannot have one leaked |
| 6 | `fail2ban` on production? | Not now. Key-only SSH already makes password guessing pointless; add it only if the auth log shows it is worth the moving part |

---

*See also: [[decisions/product/servers-are-built-and-deployed-from-the-pc-without-a-panel]] · [[roadmap/research-results/deployment_research_assessment]] · [[roadmap/deploy-checklist]] · [[tech/home-server-setup]] · [[decisions/product/a-release-is-a-tag-deployed-from-git]] · [[decisions/product/every-process-that-writes-the-log-shares-a-umask]]*
