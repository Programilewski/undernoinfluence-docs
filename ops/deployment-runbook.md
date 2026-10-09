---
description: "Every command for each deployment phase, on both servers."
owner: Paweł Milewski
updated: 2026-09-29
status: runbook — Phases 1, 2, 4 and 6 written and tested against an Ubuntu 26.04 container on 29.09; nothing has touched a real server yet. It is the "how" for deployment-plan.md; step numbers match that document
---

# Deployment runbook — every command, both servers

**What this is.** `deployment-plan.md` says *what* happens in each of the eight phases and why. This document says *how*: the exact commands, the full contents of every file that has to be written, and the check that proves each step worked. Step numbers match the plan (`2.14` here is `2.14` there), so the two can be read side by side. Where this document disagrees with the plan, this one is newer and the reason is in the findings below — the plan gets a one-line pointer rather than a second copy of the correction.

**Where each command runs.** Every code block is tagged. Getting this wrong is the easiest mistake in the whole runbook, and commands often *appear* to succeed in the wrong place.

| Tag | Machine | Prompt looks like |
|---|---|---|
| `# ==== PC ====` | your desktop PC, Fedora 44, in `/var/www/undernoinfluence` | `bub@…` |
| `# ==== HOST ====` | the home-server laptop, Ubuntu 24.04 | your user on the laptop |
| `# ==== CONTAINER (root) ====` | the new Incus container, before Ansible has run | `root@uni-next` |
| `# ==== VPS ====` | the OVH VPS | `deploy@…` or `admin@…` |

**Checked on 29.09 against the real tools, not from memory:** Deployer 8.0.5's source (its Laravel recipe, `update_code`, `writable`, `env`, `rollback`), ansible-core 2.21.4 on PyPI, Composer 2.10.3, the application's `composer.json`, `.gitignore`, `config/backup.php`, `vite.config.js` and `routes/console.php`, `php artisan migrate:status --pending` on Laravel 13.25, the PC's own `~/.ssh` and installed tools, and the GitHub Actions release tags pinned in Phase 6.

---

## Findings raised while writing this

Found by reading Deployer's source and the PC against the plan, not asked about. Ranked by consequence. **Findings 1–3 would each have broken the first deploy or made it unsafe.**

1. **If `shared/.env` is missing, Deployer quietly ships `.env.example` to the server — `APP_DEBUG=true` and an empty `APP_KEY`.** Deployer's `deploy:env` task copies `.env.example` to `.env` inside the release when none exists, and `deploy:shared` then moves that file into `shared/` because the shared one is missing. The result is a site with `APP_ENV=local` and `APP_DEBUG=true`, and the first error page it shows — very likely "No application encryption key" — prints the environment, including the database password. The plan's own order (create `.env` in 3.6, deploy in 4.16) avoids it only if nothing is forgotten. **Fix (in `deploy.php` below):** replace `deploy:env` with a task that *stops the deploy* if `shared/.env` is missing or still contains `APP_KEY=` with no value.
2. **Deployer's Laravel recipe would fail the second deploy with `Operation not permitted`.** The recipe makes `storage` writable with `chgrp -R`. `storage` is shared, and after the first day it holds files that `www-data` created — logs, sessions, compiled views. Only the owner of a file may change its group, so `deploy` cannot `chgrp` them. **Fix:** Deployer manages only `bootstrap/cache` (it lives inside each release and `deploy` owns it). Ansible owns the permissions on `shared/storage`: setgid directories plus the `0002` umask on every writer, which is the 25.09 umask decision already.
3. **Ansible cannot run as `deploy` if `deploy` may only reload PHP-FPM.** Plan step 2.3 gives `deploy` exactly one sudo line. That is correct for Deployer, but Ansible has to install packages and write to `/etc`, so it needs full root. **Fix:** two SSH users on each server. `admin` is the Ansible user, with full sudo *behind a password* (`ansible-playbook -K` asks for it), so the SSH key alone is not root. `deploy` is the Deployer user, with the one sudo line. Both are key-only.
4. **The servers never need to read GitHub at all.** Deployer 8 has an `update_code_strategy` of `local_archive`: the PC runs `git archive <tag>`, uploads the archive and unpacks it. The PC already holds the repository and already builds the assets from the same tag. **Recommended, and written that way below:** no deploy key on either server, so neither server holds any GitHub credential, and a compromised production box cannot read the source history. This replaces plan Finding 4 and steps 3.5, 7.4 and 5.4's key clean-up. The one cost: Deployer writes `archive.tar` into the repository root for a few seconds during every deploy, so it is added to `.gitignore` in Phase 1. Otherwise an aborted deploy leaves it there, and a hurried `git add -A` would commit a copy of the entire release.
5. **`dep rollback` switches the symlink and nothing else.** Read in its source: no PHP-FPM reload and no worker restart. So after a rollback the web would serve the old release, but PHP-FPM keeps serving the new code for up to 120 seconds and the queue workers keep running the new code for up to an hour. **Fix:** `after('rollback', 'uni:reload')` in `deploy.php`.
6. **The `/admin` allowlist decided on 16.09 is missing from the plan.** The admin-access-is-three-layers record: nginx allows `/admin` only from Tailscale addresses, before any application code runs. That needs Tailscale on the VPS, and it needs a way for your browser to reach `/admin` *from* a Tailscale address. Visiting `https://undernoinfluence.pl/admin` goes over the public internet, so it arrives from your home IP, not a Tailscale one. This is a real design choice — see open question 1. Phase 2 below is written so the allowlist is a single inventory variable whatever you choose. TOTP and the failure counter (the other two layers) are application work and are listed under Phase 7 as a gate.
7. **Four facts about the PC the plan assumed differently.**
   - It is Fedora 44, so Ansible comes from `pipx` installed with `dnf`, not `apt`.
   - It has no `gh` CLI, and the tag guard (4.4) needs `gh` to ask GitHub whether CI passed.
   - It already has an ed25519 key (`~/.ssh/id_ed25519`, the one GitHub knows) **with no passphrase**. The plan's step 0.3 said to create a new key. Adding a passphrase to the existing one is simpler and changes nothing on GitHub.
   - It has no `~/.ssh/config` yet.
8. **Found by running it, 29.09 — see Phases 1–2 and 4 for the detail.** A clean checkout of the tag cannot build its assets without `composer install` first, because the Filament theme imports its CSS from `vendor/`: the manual process only ever built inside a working copy that already had `vendor/`, so every future clean build (and the planned one in 4.5) would have failed. Deployer's upload needs `rsync` on the server. The playbook assumed that installing a package starts its service. **And no tag before `v0.1.5` can go through the new process at all:** the tag guard wants a green CI run on the tagged commit, and the workflow did not exist before 29.09 — so `v0.1.4` ships the old way (0.1) and `v0.1.5` is the first new-process release.
9. **Two smaller corrections to the plan.**
   - 2.6's `Unattended-Upgrade::Mail` needs a mail server on the box, and there isn't one, so the setting would do nothing without saying so. It is left out. Held packages show up in `apt list --upgradable` during the monthly look instead.
   - 2.14's nginx block must not `include snippets/fastcgi-php.conf` and then add `SCRIPT_FILENAME` again. PHP-FPM receives both, and which one wins is not something to rely on. The site template below writes the FastCGI parameters out itself.

---

## Phase 0 — Before any building (PC, ~1–1.5 h)

### 0.1 Ship `v0.1.4` with the current process

The tag exists (cut 28.09, "homepage mini map"). Deploy it to the *old* container with the manual runbook in `ops/home-server-setup.md` → "Updating to a new release", exactly as written there. **Check:** on your phone, the homepage shows the mini map and `/mapa` draws a map.

### 0.3 Put a passphrase on the PC's key

```bash
# ==== PC ====
ssh-keygen -p -f ~/.ssh/id_ed25519          # enter nothing for the old passphrase, then a new one
ssh-add ~/.ssh/id_ed25519                    # once per login; KDE's agent keeps it until logout
```

**Check:** `ssh-keygen -y -f ~/.ssh/id_ed25519` asks for the passphrase. `ssh -T git@github.com` still says "Hi Programilewski".

### 0.4 The backup key

```bash
# ==== PC ====
ssh-keygen -t ed25519 -C "uni-backup" -f ~/uni-backup-key        # with a passphrase, different from 0.3
cp ~/uni-backup-key.pub /var/www/undernoinfluence/ansible/files/keys/uni-backup.pub
```

`pawel-pc.pub` is already there (29.09), with the key's comment replaced by `pawel-pc` so your e-mail address is not in the repository. **The playbook refuses to start until `uni-backup.pub` exists**, because it is what lets you in when the PC is gone. Commit the file.

Put the **private** half (`~/uni-backup-key`) and its passphrase into the password manager as an attachment, then `shred -u ~/uni-backup-key`. Public keys are safe in the repository: they identify a key without granting anything.

**Check:** the password-manager entry opens, and `ls ~/uni-backup-key` says no such file.

### 0.5 First access

**Home:** from the PC, `ssh-copy-id <your user>@<laptop's Tailscale name>`. Today it answers `Permission denied`, which means password login is off on the laptop. If so, copy the key over from a session already on the laptop instead: `cat >> ~/.ssh/authorized_keys` and paste the contents of `~/.ssh/id_ed25519.pub`.

**Production:** OVH Control Panel → the VPS → *Reinstall* → Ubuntu 26.04 → attach the SSH key (paste `~/.ssh/id_ed25519.pub`). OVH creates the user `ubuntu`, with passwordless sudo and your key. Note the IPv4 (and IPv6) address from the panel. They go into `~/.ssh/config` below and nowhere else.

### 0.6 SSH aliases

Create `~/.ssh/config` on the PC (it does not exist yet). Addresses live here and never in the repository — the no-machine-addresses-in-the-repo record.

```sshconfig
# ==== PC: ~/.ssh/config ====
Host *
    IdentityFile ~/.ssh/id_ed25519
    AddKeysToAgent yes
    ServerAliveInterval 30

# The home-server laptop itself (Incus, Tailscale serve, the old container)
Host uni-home-host
    HostName <laptop's Tailscale name or 100.x address>
    User <your user on the laptop>

# The new container, reached through the laptop
Host uni-home
    HostName <uni-next's address on incusbr0 — filled in at 3.3>
    ProxyJump uni-home-host
    User deploy

# Production
Host uni-prod
    HostName <VPS IPv4>
    User deploy

# Production, OVH's first user — used once, in 7.2
Host uni-prod-bootstrap
    HostName <VPS IPv4>
    User ubuntu
```

`chmod 600 ~/.ssh/config`. Ansible uses the same aliases but overrides the user to `admin` in the inventory (Finding 3).

**Check:** `ssh uni-home-host true` returns silently.

### 0.7 Ansible, pinned

**Done 29.09**, without `sudo`: `pip install --user ansible-core==2.21.4 passlib ansible-lint` put `ansible`, `ansible-playbook` and `ansible-lint` in `~/.local/bin`, and the three collections from `ansible/requirements.yml` are installed in `~/.ansible/collections`. `passlib` is for the `password_hash` filter in `bootstrap.yml`. **Check:** `ansible --version` prints `ansible [core 2.21.4]`.

### 0.8 Deployer, and `gh`

**Deployer: done 29.09 as the phar**, `~/.local/bin/dep`, 8.0.5, downloaded from `https://github.com/deployphp/deployer/releases/download/v8.0.5/deployer.phar` (the `deployer.org/releases/…` address the first version of this runbook gave returns 404). The phar keeps it out of the application's dependencies, which change only with your approval. Open question 2 is whether to move it into `composer.json` instead; the commands below work either way, with `vendor/bin/dep` in place of `dep`.

`gh` is used only by the tag guard (4.4), to ask GitHub whether the tagged commit's CI run passed:

**Installed 29.09** to `~/.local/bin/gh` (2.101.0, from GitHub's release, checksum verified — no `sudo` needed). What is left is the login, which needs you in a browser:

```bash
# ==== PC ====
gh auth login                                  # GitHub.com → SSH → the existing key → browser login
gh auth status
```

**Phase 0 is done when:** `ssh uni-home-host true` succeeds, `ansible --version` prints 2.21.4, `dep --version` prints 8.0.5, and `gh auth status` is logged in.

---

## Phase 1 and Phase 2 — The repository and the playbook — **written and tested 29.09**

**Both are done, in the application repository, and this document no longer copies them.** The files are the source of truth; a second copy here would drift from them, which is the reason the plan gave for not writing a production runbook. What each part is and where it lives:

| Step | What | Where in the application repository |
|---|---|---|
| 1.1–1.3 | Layout, `ansible.cfg`, pinned collections (ansible.posix 2.2.2, community.general 13.4.0, community.postgresql 5.0.0) | `ansible/`, `ansible/requirements.yml` |
| 1.4–1.8 | What differs per server: env name, TLS mode, database names, firewall sources, `/admin` allowlist, Tailscale | `ansible/inventories/{home,production}/group_vars/all.yml` |
| — | What is the same on both: PHP 8.5, paths, users, Composer 2.10.3 | `ansible/group_vars/all.yml` (beside the playbook, so every inventory reads it) |
| — | The hosts — aliases only, connecting as `admin` (Finding 3) | `ansible/inventories/*/hosts.yml` |
| 1.9 | `composer run test` refuses to run while `public/hot` exists | `composer.json`, proved by `TestScriptRefusesADevServerTest`, which runs the guard in a scratch directory with and without the file |
| 1.10 | The worker config moved into the playbook; `supervisor/uni-worker.conf` deleted | `ansible/roles/worker/templates/uni-worker.conf.j2`, pinned by `WorkerConfigIsDeployableTest` (now also: runs `current/artisan`, logs to `shared/`) |
| — | `/archive.tar` ignored (Finding 4); Ploi removed from the comments in `.env.example` and `bootstrap/app.php` | `.gitignore`, `.env.example`, `bootstrap/app.php` |
| 2.1–2.7 | Users, keys, the one sudo line, SSH, updates, UTC, locale, firewall | `ansible/roles/base/` |
| — | Tailscale package on production | `ansible/roles/tailscale/` |
| 2.8–2.10 | PHP 8.5 from stock Ubuntu, FPM umask drop-in, pinned Composer | `ansible/roles/php/` |
| 2.12 | PostgreSQL 18 on loopback, password generated on the box into `/etc/uni/db-password` | `ansible/roles/postgres/` |
| 2.13, 2.14, 2.18 | `.mjs` in `mime.types`, the site with `$realpath_root`, cache headers, gzip, the `/admin` allowlist, 30-day logrotate | `ansible/roles/nginx/`, template `uni.conf.j2` |
| 2.15 | The deploy tree, setgid, owned `deploy:www-data` | `ansible/roles/app/` |
| 2.16, 2.17 | Supervisor worker and the one cron line, as `www-data` with `umask 0002` | `ansible/roles/worker/`, pinned by `SchedulerCronLineIsDeployableTest` |
| 2.19 | certbot by webroot, the 443 server added once the certificate exists, `renew --dry-run` | `ansible/roles/tls/` |
| 2.20 | The checks that fail the run | `ansible/roles/verify/` |
| 7.2 | Creating `admin` on a fresh VPS as OVH's user | `ansible/bootstrap.yml` |

### What was actually run on 29.09, and what it found

The playbook was run against a throwaway **Ubuntu 26.04.1** container on the PC (podman, with systemd), built to look like `uni-next` after step 3.2: an `admin` user with the PC key and nothing else. Then `deploy.php` deployed real tags to it.

- **First run: failed at the database role.** Installing a package does not guarantee its service is running; in the container PostgreSQL was installed and stopped. Every service the box needs (PostgreSQL, PHP-FPM, nginx, supervisor, cron) now has an explicit *started and enabled* task. On a normal Ubuntu box apt starts them anyway, so this is belt and braces there — but "it works because of a default nobody wrote down" is the failure class this project keeps paying for.
- **Second run: 44 tasks, green. Third run: `changed=0`** — Phase 2's "done when", met.
- **After a deploy the playbook still reports `changed=0`**, so running it again later never disturbs a live release.
- `ansible-lint` passes at its strictest (`production`) profile.

**Not exercised in the container, so still unproven:** `ufw` (a rootless container cannot load netfilter — it is proven on `uni-next` or not at all), the `tls` role (needs real DNS), the `tailscale` role, and `bootstrap.yml` (needs OVH's user). The container's sudo was passwordless, so `-K` was not exercised either.

### Running it

```bash
# ==== PC ====
cd /var/www/undernoinfluence/ansible
ansible-galaxy collection install -r requirements.yml          # once; already done on this PC 29.09
ansible-playbook -i inventories/home provision.yml -K          # -K asks for admin's sudo password
```

**If ufw will not start inside the Incus container:** set `firewall_enabled: false` in the home inventory and write down why. The container is reachable only through the host anyway, so the difference from production is recorded rather than hidden.

**Tailscale on production** is installed by the playbook, but joining the tailnet needs a login, so it is by hand, once: on the VPS `sudo tailscale up --ssh=false`, open the printed URL, and in the Tailscale admin console **disable key expiry** for the machine — or it drops off the tailnet after 180 days and `/admin` becomes unreachable. What comes after depends on open question 1.

**The worker is `FATAL` after the first playbook run, and that is expected:** `current/` does not exist until the first deploy. Restart it once after the first deploy (4.17).

---

## Phase 3 — Rebuild the home server (host + PC, ~2–3 h)

### 3.1 The new container, next to the old one

```bash
# ==== HOST ====
incus launch images:ubuntu/26.04 uni-next
incus list                                   # uni-next RUNNING, note its IPv4 on incusbr0
incus network get incusbr0 ipv4.address      # the subnet for ssh_allow_from / http_allow_from
```

The old `uni` keeps running and keeps serving until 4.18 moves Tailscale over. Docker's `FORWARD` rules from 22.09 already cover `incusbr0`, so the container has internet access from the first boot. **Check:** `incus exec uni-next -- curl -sSI https://archive.ubuntu.com | head -1` prints a status line.

### 3.2 The only manual server step

```bash
# ==== HOST ====
incus exec uni-next -- bash
```

```bash
# ==== CONTAINER (root) ====
echo 'Acquire::ForceIPv4 "true";' > /etc/apt/apt.conf.d/99force-ipv4
apt update && apt install -y openssh-server python3 sudo
adduser --gecos "" admin                     # set a strong password: this is the -K password. Into the password manager
usermod -aG sudo admin
install -d -m 700 -o admin -g admin /home/admin/.ssh
# paste the PC's public key (cat ~/.ssh/id_ed25519.pub on the PC) into:
nano /home/admin/.ssh/authorized_keys
chown admin:admin /home/admin/.ssh/authorized_keys && chmod 600 /home/admin/.ssh/authorized_keys
exit
```

Only `admin` is created by hand. Ansible creates `deploy`.

**Check, before leaving the container:** `id -nG admin` lists `sudo`. On 09.10 it did not, and the first playbook run would have stopped at "not in the sudoers file"; `incus exec uni-next -- usermod -aG sudo admin` from the host fixed it.

### 3.3 Point the alias

Fill `uni-home`'s `HostName` in `~/.ssh/config` with `uni-next`'s address from 3.1, and replace the `ssh_allow_from` / `http_allow_from` subnets in the home inventory with the one from 3.1.

**Check:** `ssh -l admin uni-home true` succeeds from the PC.

### 3.4 Provision

```bash
# ==== PC ====
cd /var/www/undernoinfluence/ansible
ansible-playbook -i inventories/home provision.yml -K
ansible-playbook -i inventories/home provision.yml -K        # the second run: changed=0
```

**Check:** `ssh uni-home true` now lands as `deploy`, with no password prompt.

**Learned 09.10, first run:**
- **Ubuntu 26.04's `sudo` is `sudo-rs`,** and Ansible timed out waiting for its password prompt ("Timeout (12s) waiting for privilege escalation prompt"), although the password was right. `ansible/group_vars/all.yml` now sets `ansible_become_exe: sudo.ws`, the original sudo, which 26.04 still ships and which reads the same sudoers. Production needs it too.
- `ufw`'s systemd unit reads `inactive` after the first run, because the package arrived after boot. The firewall is on: `ufw status verbose` says `active`, and `systemctl is-enabled ufw` says `enabled`. Check those, not `is-active`.
- Run 1: `changed=35`. Run 2: `changed=0`.

### 3.5 GitHub deploy key — **not needed** (Finding 4)

### 3.6 `shared/.env`, written on the box

```bash
# ==== PC ====
ssh -l admin uni-home
```

```bash
# ==== on uni-next, as admin ====
sudo -u deploy nano /var/www/undernoinfluence/shared/.env      # nano: in the playbook since 09.10; the image had only vi
# DB_PASSWORD straight from the file, never on screen (it is 40 letters and digits):
sudo sh -c 'k=DB_PASSWORD; v=$(cat /etc/uni/db-password); sed -i "s|^${k}=.*|${k}=${v}|" /var/www/undernoinfluence/shared/.env'
```

Paste `.env.example` from the tagged release (open it on GitHub at the tag), then change exactly these lines:

```dotenv
APP_ENV=preprod
APP_DEBUG=false
APP_URL=https://<the Tailscale name the host serves>
LOG_LEVEL=info

DB_DATABASE=preprod_uni
DB_USERNAME=preprod_uni_app
DB_PASSWORD=<from /etc/uni/db-password>

MAIL_MAILER=log
SESSION_SECURE_COOKIE=true
UNI_OWNER_ACCESS=false
UNI_HEALTHCHECK_PING_URL=
BACKUP_ARCHIVE_PASSWORD=<a new one, into the password manager — the home box's own>
```

`APP_KEY` stays empty for now. It is generated in 4.3.

**Check without showing either secret** (09.10: the backup password had gone into both lines):

```bash
# ==== uni-next, as deploy ====
f=/var/www/undernoinfluence/shared/.env
db=$(grep '^DB_PASSWORD=' $f | cut -d= -f2-); bk=$(grep '^BACKUP_ARCHIVE_PASSWORD=' $f | cut -d= -f2-)
[ "$db" = "$bk" ] && echo SAME || echo differ
PGPASSWORD="$db" psql -h 127.0.0.1 -U preprod_uni_app -d preprod_uni -tAc 'select current_user'
```

```bash
# ==== on uni-next, as admin ====
sudo chown deploy:www-data /var/www/undernoinfluence/shared/.env
sudo chmod 640 /var/www/undernoinfluence/shared/.env
```

**`BACKUP_ARCHIVE_PASSWORD` is set even here**: `BackupEncryptionGuard` fails any backup run without it, and the 01:30 schedule would otherwise send a failure every night.

**Phase 3 is done when:** `ssh uni-home` lands as `deploy`, the playbook's second run is `changed=0`, and `shared/.env` exists, contains nothing copied from the PC or the old container, and is `-rw-r----- deploy www-data`.

---

## Phase 4 — The deploy recipe — **written and tested 29.09**

### 4.1–4.15 `deploy.php`

**`deploy.php` is in the application repository root**, and `DeployRecipeKeepsTheRulesTest` pins its rules: no step clears the database cache or rolls back a migration, `local_archive` and `--no-dev`, the tag guard first, the replaced `deploy:env`, the asset check before the symlink, the reload right after the switch and after every rollback, the backup before migrations, and `writable_dirs` limited to `bootstrap/cache`. What each task does:

| Task | Plan step | What it does |
|---|---|---|
| `uni:guard:tag` | 4.4 | Refuses unless the local tag and `origin`'s agree, `gh` finds a green `tests` run for that commit, and on production the home server's `current/REVISION` is that commit |
| `uni:assets:build` | 4.5 | On the PC, in a `git worktree` of the tag: `composer install --no-dev --no-scripts`, `npm ci && npm run build`, tar `public/build` and `public/vendor/maplibre-gl`. Reuses the tarball if the same tag was built earlier |
| `deploy:env` (replaced) | Finding 1 | Stops if `shared/.env` is missing, or its `APP_KEY` is empty and `--first-deploy` was not given |
| `uni:assets:upload`, `uni:guard:assets` | 4.7, 4.8 | Unpacks the build into the release; refuses unless the manifest, the MapLibre `.mjs`, Filament's CSS and JS exist and `public/hot` does not |
| `uni:key` | 4.3 | With `--first-deploy` only: `key:generate` into `shared/.env` |
| `uni:backup:before-migrate` | 4.9 | Production only: `backup:run --only-db` when `migrate:status --pending` lists anything |
| `artisan:migrate`, `artisan:optimize` | 4.10, 4.11 | Forward only; `optimize`, never `optimize:clear` |
| `deploy:symlink`, `uni:reload` | 4.12 | Atomic switch, then `sudo systemctl reload php8.5-fpm` and `artisan reload`. Also hooked after `rollback` (Finding 5) |
| `uni:smoke` | 4.13 | `curl` on the box: `/up` is 200 and the MapLibre module is `text/javascript`, or it fails with the rollback command |
| `deploy:cleanup` | 4.14 | Keeps 5 releases |

### What was actually run on 29.09, and what it found

`deploy.php` deployed to the same Ubuntu 26.04 container, through a test file that changed only the host address and skipped the GitHub CI check (there is no CI run to find yet — Phase 6). Everything else ran exactly as committed.

- **Found: the asset build cannot run on a clean checkout.** The Filament panel theme (`resources/css/filament/panel/theme.css`) imports its CSS from `vendor/filament`, so `npm run build` fails without the PHP packages. The manual process never saw it because it built inside a working copy that already had `vendor/`. The build step now runs `composer install --no-dev --no-scripts` in the worktree first. CI was unaffected — it installs Composer packages before building.
- **Found: Deployer's upload needs `rsync` on the server.** Added to the playbook's base packages.
- **Found: Deployer's `test()` treats a command that prints anything as false**, so the MapLibre check failed on a file that was there. Its output is now discarded.
- **Proved, in order:** a deploy with an empty `APP_KEY` and no `--first-deploy` **stops** (Finding 1's guard) → the first deploy of `v0.1.4` with `--first-deploy` succeeds end to end, including the smoke test → both workers `RUNNING` as `www-data` after the restart in 4.17 → cron ran `schedule:run` as `www-data` and the scheduler heartbeat appeared in the cache table within a minute → `/`, `/mapa` and `/admin/login` 200 through nginx, `/.env` 403 → a **second** deploy (`v0.1.3`) over session files `www-data` had created succeeds (Finding 2's fix — Deployer's default would have failed here) → `dep rollback` returns to `v0.1.4`'s commit, the workers come back with new process ids (Finding 5's fix), and the site answers 200.

**Not exercised:** the tag guard's `gh` and `origin` checks, and the production-only paths (the home-server check inside the tag guard, the pre-migration backup). Both need real hosts; the first deploy to `uni-next` exercises the guard.


### 4.16 First deploy

```bash
# ==== PC ====
dep deploy homeserver --tag=v0.1.5 --first-deploy
```

**Done 09.10.** The first attempt failed only its smoke test: `/up` answered 400 to a bare `127.0.0.1`, which is `trustHosts()` working. `uni:smoke` now sends the `Host` header read from the box's own `APP_URL`, and the second deploy passed end to end. The tag guard passed on its first real run.

**The first tag the new process can deploy is `v0.1.5`**, not `v0.1.4`: the tag guard needs a green `tests` run on the tagged commit, and no commit before 29.09 contains the workflow, so no older tag can ever have one. `v0.1.5` is the first commit that does — cut it once its CI run is green.

### 4.17 Once, by hand

```bash
# ==== PC ====
ssh uni-home
```

```bash
# ==== uni-next, as deploy (plain `ssh uni-home`, not -l admin: admin cannot write the logs) ====
cd /var/www/undernoinfluence/current
php artisan uni:create-admin
exit
```

```bash
# ==== PC ====
ssh -t -l admin uni-home sudo supervisorctl restart 'uni-worker:*'  # -t: sudo asks only on a terminal. The worker FATALed before current existed (2.16)
```

**No demo seeder** (corrected 09.10): `DemoDataSeeder` needs `fakerphp/faker`, a dev dependency, and every deploy installs with `--no-dev`. The home server gets its test data by hand and through the admin's CSV importers, which also exercises them (the-real-catalogue-reaches-production-only record).

### 4.18 Tailscale moves to the new container

```bash
# ==== HOST ====
tailscale serve status                                  # the old line, pointing at uni's address
tailscale serve --bg --https=443 http://<uni-next address>:80
tailscale serve status                                  # now uni-next
```

**Learned 09.10:** `tailscale serve` needs `sudo` on the laptop (`ssh -t uni-home-host sudo tailscale serve …`); run as `pawel` it is refused with "Access denied" and nothing changes, so read `tailscale serve status` afterwards. The first page then rendered without CSS and JS: links were http on an https page, fixed in `v0.1.6` (the links-follow-the-site-address record).

**Phase 4 is done when**, on your phone over mobile data: pages render, a map draws, the consent choice survives a reload, `/admin` shows the scheduler heartbeat green six minutes later, and after you trigger an owner e-mail it appears in `shared/storage/logs/laravel-<today>.log`.

---

## Phase 5 — Prove it (~2 h)

### 5.1 Rollback

```bash
# ==== PC ====
dep deploy homeserver --tag=v0.1.6        # any later green tag; a one-line change is enough
dep rollback homeserver                   # back to v0.1.5
ssh uni-home cat /var/www/undernoinfluence/current/REVISION
```

**Check:** the site stays up throughout. `/admin`'s heartbeat stays green, which proves no deploy step cleared the database cache. `ps -o lstart= -C php` shows the workers restarted after the rollback, which proves Finding 5's fix.

### 5.2 Rebuild from nothing

```bash
# ==== HOST ====
incus delete uni-next --force
```

Then 3.1 → 3.4, 3.6, 4.16 → 4.18 again, **reading only this document**. Anything that needed a hand fix goes into the playbook or this runbook, and 5.2 is repeated. This is the step that makes production safe to touch.

### 5.3 Emergency rollback without the PC

From another device (the laptop itself, or a phone with an SSH app), with the backup key from the password manager:

```bash
ssh -i <backup key> deploy@<box>
cd /var/www/undernoinfluence
ls -1t releases | head -3                            # the second line is the previous release
ln -sfn releases/<previous> current.new && mv -Tf current.new current
sudo systemctl reload php8.5-fpm && php current/artisan reload
```

### 5.4 Retire the old container

```bash
# ==== HOST ====
incus delete uni --force                             # takes .env.bak-20260925 with it
```

In GitHub, repository → Settings → Deploy keys: delete `uni-homeserver`. With Finding 4 there is no replacement key.

**Phase 5 is done when:** a container built only by the playbook and one `dep deploy` passes the Phase 4 phone check.

---

## Phase 6 — CI — **written 29.09**

**`.github/workflows/tests.yml` is in the application repository.** PHP 8.5 and a PostgreSQL 18 service matching `phpunit.xml` (`undernoinfluence_test` as `undernoinfluence_user`) → `composer install` → `.env` from `.env.example` → `npm ci && npm run build` → the manifest, the MapLibre `.mjs` and Filament's assets exist and `public/hot` does not → `php artisan test`. It runs on pushes to `main`, on `v*` tags and on pull requests.

**6.2** — every action is pinned to the commit its release tag pointed at on 29.09, read from the actions' own repositories: `actions/checkout` v7.0.1, `shivammathur/setup-php` 2.37.2, `actions/setup-node` v7.0.0. **6.3** — it holds no secret and has `permissions: contents: read`, so it could not push or deploy if it tried.

**Phase 6 is done when:** a push shows a green run, and a deliberately broken test on a branch shows a red one. The first push happened 29.09 with the Phase 1 commit; its result is what the tag guard reads.

---

## Phase 7 — Production (~4–6 h, only after 5.2 passes)

### 7.1 DNS

At OVH → Domains → `undernoinfluence.pl` → DNS zone: `A` records for `@` and `www` to the VPS's IPv4. Add `AAAA` records only if `curl -6 -sI https://archive.ubuntu.com` works on the box. **Check:** `dig +short undernoinfluence.pl` from the PC prints the VPS address. Wait for it before 7.3.

### 7.2 Bootstrap — the one run as OVH's user

`ansible/bootstrap.yml` creates `admin` with a sudo password (it prompts, twice) and both keys.

```bash
# ==== PC ====
cd /var/www/undernoinfluence/ansible
ansible-playbook -i uni-prod-bootstrap, bootstrap.yml         # the trailing comma makes it a one-host inventory
ssh -l admin uni-prod true                                     # admin works before anything else changes
```


### 7.3 Provision

```bash
# ==== PC ====
ansible-playbook -i inventories/production provision.yml -K
ansible-playbook -i inventories/production provision.yml -K    # changed=0
ssh uni-prod-bootstrap true                                    # must now FAIL: AllowUsers ended ubuntu's login
```

Afterwards, lock the `ubuntu` account for good: `ssh -l admin uni-prod sudo usermod --lock --expiredate 1 ubuntu`.

### 7.4 GitHub deploy key — **not needed** (Finding 4)

### 7.5 `shared/.env`

The same procedure as 3.6. The values that differ:

```dotenv
APP_ENV=production
APP_DEBUG=false
APP_URL=https://undernoinfluence.pl
LOG_LEVEL=warning
LOG_STACK=daily

DB_DATABASE=prod_uni
DB_USERNAME=prod_uni_app
DB_PASSWORD=<from /etc/uni/db-password on the VPS>

SESSION_DRIVER=file
SESSION_ENCRYPT=true
SESSION_SECURE_COOKIE=true
SESSION_DOMAIN=undernoinfluence.pl

HSTS_MAX_AGE=300
UNI_OWNER_ACCESS=false
```

Mail in 7.6, backups in 7.7, the monitor in 7.11.

### 7.6 Mail — Scaleway TEM

1. **Sign the Scaleway DPA** (console → Organization → Contracts) before anything else here — before the first real claim.
2. Scaleway console → Transactional Email → *Add domain* → `tx.undernoinfluence.pl`. It prints SPF, DKIM and DMARC records.
3. In OVH's DNS zone: the three records exactly as printed (checklist B3). **Check:** the Scaleway console shows the domain as verified.
4. Generate SMTP credentials. In `shared/.env`: `MAIL_MAILER=smtp`, `MAIL_HOST=smtp.tem.scaleway.com`, `MAIL_PORT=587`, `MAIL_USERNAME=<project id>`, `MAIL_PASSWORD=<key>`, `MAIL_FROM_ADDRESS=powiadomienia@tx.undernoinfluence.pl`.
5. B2a: send the real claim-approval template to wp.pl, o2.pl, interia.pl, onet.pl and gmail.com. Record inbox or spam for each, in the checklist row.

### 7.7 Backups — checklist A6 in order

1. Scaleway console → Object Storage → `uni-backups-prod` → enable **object lock** (only possible when the bucket is created; if it exists without it, create a new bucket with lock on).
2. Default retention — the console cannot set it, so one S3 API call from the PC:
   ```bash
   # ==== PC ==== (aws CLI, `sudo dnf install awscli2`)
   aws s3api put-object-lock-configuration --endpoint-url https://s3.fr-par.scw.cloud \
     --bucket uni-backups-prod \
     --object-lock-configuration '{"ObjectLockEnabled":"Enabled","Rule":{"DefaultRetention":{"Mode":"COMPLIANCE","Days":35}}}'
   ```
   Compliance mode, 35 days, as the backup-storage-provider record decides: governance mode can be bypassed by a key with the writer's permissions, compliance mode cannot — **not even by you**, so check the JSON twice before pressing Enter. The record says this call is made from the server. Making it from the PC with the same `uni-backup-writer` key does the same thing without installing the aws CLI on production.
3. Lifecycle rules, as the record specifies: expire non-current versions after 1 day, expire current versions after 45 days (the backstop above the longest retention), abort incomplete multipart uploads after 1 day. Put a reminder in the calendar about six weeks after the first upload to check the version list, as the record asks.
4. `shared/.env`: `BACKUP_ARCHIVE_PASSWORD` (new, production's own, into the password manager), `BACKUP_S3_KEY` and `BACKUP_S3_SECRET` (the `uni-backup-writer` application's key only).

### 7.8 Deploy

```bash
# ==== PC ====
dep deploy production --tag=<the tag uni-home runs> --first-deploy
ssh -l admin uni-prod sudo supervisorctl restart 'uni-worker:*'
```

### 7.9 First admin (A10)

```bash
ssh uni-prod
cd /var/www/undernoinfluence/current && php artisan uni:create-admin
```

No demo seeder. It refuses to run in production, and production starts empty by design.

### 7.10 Backup proof (A6 steps 6–7)

```bash
# ==== VPS, as deploy ====
cd /var/www/undernoinfluence/current
php artisan backup:run                        # then see the archive in the Scaleway console
php artisan backup:list
```

Restore it into an empty scratch database on the same box (never staging), using the procedure rehearsed on 18.09: download, `7z x` with the password, `createdb scratch_restore`, `psql scratch_restore < db-dumps/…sql`, compare row counts table by table, `dropdb scratch_restore`.

### 7.11 Monitor

Healthchecks.io was chosen on 16.09, in the-alarm-rings-from-outside-the-building record, so that decision is already settled. Create one check with a 5-minute period and a 10-minute grace, and set `UNI_HEALTHCHECK_PING_URL` in `shared/.env`. Then run `php artisan config:cache`, or deploy again. **Check:** the first ping arrives within five minutes. Then prove the alarm works: `sudo supervisorctl stop 'uni-worker:*'`, wait for the alert, and start the workers again.

### 7.12 The rest of the checklist

```bash
# ==== PC ====
curl -sI https://undernoinfluence.pl | head -1                                        # 200, valid certificate
curl -sI https://undernoinfluence.pl/vendor/maplibre-gl/6.9.0/maplibre-gl.mjs | grep -i content-type   # text/javascript (C7)
ssh uni-prod "cd /var/www/undernoinfluence/current && php artisan tinker --execute 'echo route(\"home\"), PHP_EOL, json_encode(config(\"logging.channels.stack.channels\"));'"   # https://… and ["daily"] (D1, A4)
ssh uni-prod "ps -eo user,comm | grep -E 'php|nginx' | sort | uniq -c"                # www-data for FPM workers and queue workers (A3)
```

Plus by hand: the "najbliżej" geolocation prompt in a real browser (D7), and Search Console verification before any venue import (A9). HSTS goes up only after the first **unattended** certificate renewal, about 60 days in (B6). A13 no longer applies, because no server holds a clone.

### 7.13 Privacy policy (E5)

Section 6 names OVH as the host. No Ploi line is needed.

### Gates before going public — outside this plan, and not optional

- **The admin-access-is-three-layers record:** the allowlist (open question 1), **required TOTP on `/admin`**, and the **per-account failure counter**. The last two are application work, done on the PC and shipped as a tag like anything else.
- **DPAs filed** for OVH, Scaleway (mail + backups) and PostHog, and the vendors register updated with real entries.

**Phase 7 is done when:** the whole deploy checklist is green or explicitly deferred with a reason, and the monitor has been seen to alert when the worker stopped.

---

## Phase 8 — Documentation (alongside each phase)

| # | Document | Change | With which phase |
|---|---|---|---|
| 8.1 | `ops/home-server-setup.md` | Steps 1–9 and "Updating to a new release" become history marked superseded; the live text is "Phase 3 and 4 of the deployment runbook" | after 5.2 |
| 8.2 | `ops/deploy-checklist.md` | C8, C9 retired; A3 → the worker template; C2 settled (PC build, uploaded by Deployer); A8 → AppArmor, or dropped; the 17.09 banner and the Ploi text in A3, A6, E5 removed; A13 marked not applicable to servers | **done 29.09** |
| 8.3 | Emergency rollback | The five lines in 5.3, copied into the password-manager entry beside the backup key, where they are needed | 5.3 |
| 8.4 | `tech/scheduled-work.md` | The cron line becomes the 2.17 form, and the worker paragraph points at the template | **done 29.09** |
| 8.5 | the three-environments-and-what-each-is-for record | "production is bare Ubuntu under Ploi" → "provisioned by the same playbook as the home server" | **done 29.09** |
| 8.6 | `deployment-plan.md` | One line under its findings: "Findings 4 and step 2.3 are superseded — see deployment-runbook Findings 3–4" | **done 29.09** |
| 8.7 | compliance hour, items 1, 5, 9 | Ploi removed; item 1 is now the OVH DPA | **done 29.09** |

---

## Forward plan — what gates what

1. **Done 29.09:** the 28.09 docs committed; Phase 8's document rows; Phases 1, 2, 4 and 6 written, and the playbook and the deploy recipe proved against an Ubuntu 26.04 container; Ansible and Deployer installed on the PC.
2. **Yours, about an hour, any time:** Phase 0 — 0.1, the passphrase, the backup key into `ansible/files/keys/`, the key onto the laptop, `~/.ssh/config`, `gh`. And cut `v0.1.5` once the first CI run is green.
3. **Phases 3–5 in one sitting, together:** you type the sudo passwords and the `.env` secrets; the rest can be run from this session once your key is in the agent. The playbook and recipe are already proved, so the sitting is about the Incus-specific parts — ufw in the container, Tailscale serve — and 5.2, the rebuild from nothing, which is the proof everything after it rests on.
4. **Phase 7**, only after 5.2. The Scaleway steps 7.6.1–7.6.3 and 7.7.1–7.7.3 can be done in the console at any point before then, and DNS propagation (7.1) can start a day early.
5. **Open question 1 has to be answered before 7.3.** It decides what the `tailscale` role does.
6. **Venues are still at 35 of 70**, and they are still the only thing that moves the launch date. Every phase above stands alone, so a week of venues between two phases costs nothing.

---

## Open questions

| # | Question | Recommendation |
|---|---|---|
| 1 | **How does your browser reach `/admin` from a Tailscale address?** (Finding 6.) (a) An `admin.undernoinfluence.pl` DNS record pointing at the VPS's Tailscale `100.x` address — reachable only on the tailnet — with its certificate issued by DNS challenge through an OVH API token limited to that zone. (b) `tailscale serve` on the VPS with the `ts.net` name — breaks the session cookie (`SESSION_DOMAIN`) and `trustHosts()`, so it needs application changes. (c) Allowlist your home IP instead — it changes whenever your ISP reassigns it. (d) Defer the allowlist and launch with TOTP plus the counter. | **(a).** It keeps the admin on the same registered domain, so cookies and trusted hosts work unchanged, and nginx sees your `100.x` address. It costs one extra DNS record, the `python3-certbot-dns-ovh` plugin and an OVH token. (d) is defensible for a soft launch, but it means going back on a recorded decision, and that should be a new record rather than something that happens by drift |
| 2 | Deployer as a Composer dev dependency or a pinned phar? | The **phar is installed** (29.09) and works; nothing needs changing to proceed. A dev dependency would pin it in the lock file so any clone gets the same version — worth it the day a second machine deploys, not before. Your call either way |
| 3 | `local_archive` (no GitHub key on any server) instead of a deploy key per server? | **Yes** (Finding 4) — one fewer credential per server, and no server can read the source history |
| 4 | `admin`'s sudo behind a password (`-K` on every Ansible run)? | **Yes** — the PC key alone is then not root on production. It costs one password prompt per playbook run |
| 5 | Keep the PC's existing key and add a passphrase, rather than making a new one? | **Yes** — GitHub already trusts it, and the passphrase closes the actual gap |
| 6 | A hardware security key? | Later (~€30–50 once). Not a blocker |
| 7 | `fail2ban`? | Not now — SSH is key-only. Revisit if `/var/log/auth.log` shows it would be worth having |

---

*See also: [[ops/deployment-plan]] · [[decisions/product/servers-are-built-and-deployed-from-the-pc-without-a-panel]] · [[decisions/product/admin-access-is-three-layers]] · [[ops/deploy-checklist]] · [[ops/home-server-setup]] · [[decisions/product/the-alarm-rings-from-outside-the-building]] · [[decisions/product/backup-storage-provider]]*
