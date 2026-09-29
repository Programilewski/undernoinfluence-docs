---
owner: Paweł Milewski
updated: 2026-09-28
status: assessment — nothing here is decided or executed yet; it is the input to the deployment decision
---

# Deployment research — assessment of the two reports

Two research LLMs answered the same prompt: `deployment_research_1.md` (Polish) and `deployment_research_2.md` (English, sourced). Every claim below that matters was checked against the application code, Laravel's own source, the nginx documentation or the Ubuntu archive on 28.09 — not against the reports' citations.

## What changed

**Ploi is out, and the reason is not the €8.** Both reports and my own research land on no server panel. Measured honestly, dropping Ploi costs more setup hours than its fee saves for years; it is still right because production then matches the home server exactly, no third party holds server access to personal data (no DPA, ROPA entry or privacy-policy line for it), tag deploys and zero-downtime come without paying for Ploi Pro, and one fix is applied to both servers instead of twice.

**Provisioning moves from a bash script to Ansible, run from the PC.** A playbook can be re-run safely, so a later change — an nginx rule, a PHP setting — reaches both servers rather than drifting. *Amended later on 28.09:* report 1's `community.general.incus` plugin (it exists) was dropped — Deployer needs SSH into the container regardless, so both tools reach it over SSH through the home-server host, the same way they reach production. The PC, not the home server, is the control node, so no production key ever lives on the box that may be broken freely.

**My time estimate was too low.** 12–15 hours became roughly 25–35 (an estimate, including learning Ansible). Report 1's 10–12 hours is optimistic; report 2's 42–67 hours counts backups and runbooks that already exist.

**Four things were missing from my plan and are now in it:** nginx passes `$realpath_root` to PHP so a symlinked release is never served from a stale OPcache entry; a rollback never reverses migrations, so schema changes go forward-only and risky ones are split across two releases; the deploy refuses to switch releases unless the manifest, the MapLibre `.mjs` files, Filament's assets and the absence of `public/hot` are all confirmed; and the tag is checked to still point at the commit that was tested.

**One step is now explicitly forbidden: `optimize:clear` in a deploy.** Laravel's source shows it includes `cache:clear`, and this application's cache store is the database — so it would wipe the scheduler heartbeat, the queue-restart signal and the login rate-limit counters on every release. `optimize` alone is enough, because `composer install` already clears the file caches.

## The current plan

**Servers.** Production is the OVH VPS on stock Ubuntu 26.04, which ships PHP 8.5.4 and PostgreSQL 18.6 — the same majors as the PC, no third-party repositories. The home-server container is rebuilt from the Incus `ubuntu/26.04` image so it matches production; the laptop host stays on 24.04.

**Provisioning.** One Ansible playbook, two inventories (home, production), run identically on both: nginx with the `.mjs` type added to `/etc/nginx/mime.types`, gzip types and cache headers; PHP-FPM; PostgreSQL on loopback only; supervisor with the queue worker; one cron line; certbot with a tested renewal on production; firewall; SSH keys only; unattended security upgrades. Two users: `deploy` owns the code, `www-data` runs PHP-FPM, the worker and the scheduler, with setgid storage and `umask 0002`.

**Every release.** Tests run locally and in GitHub Actions (tests and asset checks only; CI never deploys and holds no production keys). A green commit is tagged and pushed. Deployer 8 builds the assets once on the PC from a clean checkout of the tag, uploads that same build to each server, and on the server checks out the tag, links the shared `.env` and `storage`, runs `composer install --no-dev`, `migrate --force` and `optimize`, verifies the assets, switches the `current` symlink, reloads PHP-FPM and runs `artisan reload` (queue restart and scheduler interrupt). The home server receives every tag first; production receives the same tag after it has been used there.

**Rollback** is `dep rollback` to the previous release, valid only while the schema is still compatible; otherwise a forward fix.

**Unchanged.** Backups as decided on 16.09 (7 daily + 4 weekly, encrypted, Scaleway with object lock); staging deferred until production holds data worth protecting; external monitor through the existing ping URL, provider still to choose (healthchecks.io's free plan fits, and its software is BSD-3, so it can be self-hosted later).

## Report 1 — right conclusion, unreliable detail

| Claim | Verdict |
|---|---|
| `types { application/javascript mjs; }` inside the nginx `server` block | **Would break the site.** nginx's documentation shows a lower-level `types` block replaces the inherited map, so CSS and JS would fall back to `application/octet-stream`; the application sends `X-Content-Type-Options: nosniff` (`SetSecurityHeaders`), so browsers would refuse them — an unstyled, script-less site. This is the trap `a-deploy-needs-more-than-git-carries` already names |
| Add the PGDG repository for PostgreSQL 18 | Unnecessary — Ubuntu 26.04 ships 18.6 |
| `shared_buffers` to 1 GB | Pointless now: the database is 12 MB, and the 128 MB default already holds it ten times over |
| "Deployer 7" | Out of date — 8.0.5 is current |
| Backups use asymmetric encryption | Wrong — password-based AES-256 |
| One user for PHP-FPM, worker and cron, `umask 022` | Removes the umask problem, but lets the web process modify the code on a box holding personal data. Rejected |
| Build assets on the server | Defensible after the 28.09 measurement, but puts Node on production. Not adopted |
| Rollback cannot undo migrations; fix forward | **Adopted** |
| `$realpath_root`; Incus connection plugin for Ansible | **Adopted** |

The Polish reads as machine-translated, and the report names the founder's town, which was not in the prompt — the tool had other context.

## Report 2 — thorough and sourced, one harmful step, too much for now

| Claim | Verdict |
|---|---|
| `php artisan optimize:clear` on every deploy | **Harmful here** — clears the database-backed cache (see above). Rejected |
| Backups 14 daily / 8 weekly / 12 monthly | **Conflicts with the 16.09 decision** (`config/backup.php`): the cap exists because a backup is where personal data outlives its retention rule. Twelve monthly archives would break the published retention windows. Rejected |
| Defer object lock on backups | Already decided for `uni-backups-prod` (checklist A6). Rejected |
| 24–72 h rehearsal before OS updates; a long monitoring list; Better Stack | Fails the time rule. Security updates stay automatic; monitoring starts with the heartbeat, the ping and backup age |
| Asset preflight, tag-to-commit check, deploy lock, clean old releases only after old workers exit, never `cache:clear` after `queue:restart`, CI actions pinned to commits, `certbot renew --dry-run` | **Adopted** |
| Expand-contract migrations across two releases | **Adopted** |
| Ploi price and GitHub minutes "unverified" | Both were verified on 28.09: Ploi Basic €8/month without zero-downtime; 2,000 free minutes, blocked rather than billed |

## What the prompt got wrong

Neither model was told that backups were already built, rehearsed and bounded by a retention decision, or that object lock was decided — which is why report 2 proposed both. The next research prompt carries the settled rules, not only the open questions.

## Open before executing

Recorded as a decision on 28.09: `servers-are-built-and-deployed-from-the-pc-without-a-panel`, which also adds a database-only backup before any production deploy with pending migrations. Still open: the monitor provider; Deployer as a pinned phar or a Composer dev dependency; whether to buy a hardware security key.
