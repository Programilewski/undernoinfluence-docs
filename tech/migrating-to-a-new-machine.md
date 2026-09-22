---
version: 2.1
owner: Paweł Milewski
updated: 2026-08-26
status: approved
---

# Migrating UNI from the Ubuntu SSD to Fedora

Rebuilding this working environment — code, database, uploads, the docs vault, and the Claude Code context — on the Fedora install on the internal SSD. Written on 2026-08-25 against the live state of both disks.

> **Executed 2026-08-25, and corrected five times by the doing.** This is the only document in the repository that has been proven by use rather than by review. The corrections are folded in below; what they taught in general is in [`migration-lessons.md`](migration-lessons.md), and what it all means for the preprod and production servers is in [`going-to-production.md`](going-to-production.md).
>
> Two details worth carrying forward when this runbook is next reused. The user name changed (`pawel` → `bub`) and nothing broke, because the numeric uid stayed 1000 — ownership travels on the number, not the name; but every absolute path containing `/home/pawel`, including the ones still written below, is now historical. And the machine ended on PHP 8.5.9 and PostgreSQL 18.4, not the versions named in §3.

## The two disks

| | Device | Contents |
|---|---|---|
| **Internal** (Patriot P210, 477 GB) | `sda1` 200 MB ESP · `sda3` 2 GB `/boot` · `sda4` 475 GB btrfs, label `fedora`, UUID `605d4070-c2bd-4816-bd38-58c7bf38b63c` | **Fedora — the destination.** Already installed. |
| **External** (Portable SSD, 1.8 TB) | `sdb2` 100 MB ESP · `sdb4` 924 GB ext4, UUID `46e8452f-87af-4853-9076-dc8200e59276`, mounted `/` | **Ubuntu — the source.** Everything below lives here. |

**Booting is already independent.** `efibootmgr` shows Fedora's `shimx64.efi` on the *internal* ESP (`sda1`, shared with Windows Boot Manager) and Ubuntu's on the *external* ESP (`sdb2`), with Fedora first in `BootOrder`. Unplugging the external SSD does not break Fedora.

---

## 0. Pull, don't push

You **can** mount `/dev/sda4` from this Ubuntu session and copy files into Fedora — the kernel has the btrfs module. **Don't.** Boot Fedora, mount the Ubuntu SSD read-only, and pull:

- **SELinux.** Fedora runs enforcing. Files written into its filesystem from Ubuntu arrive unlabelled and need a `restorecon` pass you will forget. Files created while Fedora is running get the right labels for free.
- **Ownership.** A straight copy only lands correctly if the Fedora user is also uid 1000. Copying as that user makes the question disappear.
- **Second chances.** The external SSD stays plugged in. Anything forgotten is one mount away instead of one reboot away.
- **Room.** This root filesystem is 99% full — 9.5 GB free. There is nowhere comfortable to stage a bundle here anyway.

Total to move: **≈262 MB** — 212 MB of project (minus `vendor/` and `node_modules/`) and 50 MB of Claude Code context.

---

## 1. Keep the same path

Put the project at **`/var/www/undernoinfluence`** on Fedora too.

Claude Code keys history and memory by absolute path — `~/.claude/projects/-var-www-undernoinfluence/` — and `~/.claude.json` stores per-project settings under the same key. Same path means the transcripts, the memory files, and the MCP config attach themselves with no editing. A different path means renaming directories and hand-editing JSON.

---

## 2. Before you reboot — two things, from Ubuntu

Everything else is a file on a disk that Fedora can read later. These two are not.

**Push the code.** As of 2026-08-25 11:30 `v1` and `main` are both fully pushed and the working tree is clean — but re-check right before you reboot, because anything committed after that point exists only on this disk:

```bash
cd /var/www/undernoinfluence
git status --short                      # must be empty
git rev-list --count origin/v1..v1      # must be 0, otherwise: git push origin v1
```

**Dump the database.** The cluster is running now; from a cold filesystem you would have to install PostgreSQL 16 *specifically* on Fedora to read its data directory. A dump taken now restores into any later version.

```bash
cd /var/www/undernoinfluence
export PGPASSWORD=$(grep '^DB_PASSWORD=' .env | cut -d= -f2-)
pg_dump -h 127.0.0.1 -U undernoinfluence_user -d undernoinfluence \
        --no-owner --no-privileges -f ~/uni-db-$(date +%F).sql
unset PGPASSWORD
grep -c 'CREATE TABLE' ~/uni-db-*.sql        # expect 33
```

Leave the dump in `~` — Fedora reads it off the mounted Ubuntu disk. ~11 MB, and the disk has room for that.

The agent worktree at `.claude/worktrees/agent-a18740379ce22b506` is now gitignored and will not appear on Fedora at all. Its commits are merged into `v1` and its two uncommitted files were checked and are duplicates of committed work. Nothing to save.

---

## 3. On Fedora — install the stack

Everything runs on the database driver: cache, sessions, and queue all use PostgreSQL. **Redis is configured in `.env` but is not installed and not running. Do not install it.**

```bash
sudo dnf install -y git postgresql-server postgresql nodejs npm composer \
  php-cli php-pgsql php-mbstring php-intl php-gd php-zip php-bcmath php-sodium php-xml
sudo postgresql-setup --initdb
sudo systemctl enable --now postgresql
```

`composer.json` requires PHP `^8.3`, so whatever Fedora ships is fine. The `php` on the Ubuntu machine was actually **Herd Lite** (`~/.config/herd-lite/bin/php`, 8.4.1) rather than the distro build — either works; use Herd Lite from `php.new` if you want the versions identical.

Reference versions from Ubuntu: PHP 8.4.1, Composer 2.9.5, Node 22.22, npm 10.9, PostgreSQL 16.15. Fedora's PostgreSQL is 17 or newer; the 16 dump restores forward without trouble.

Also install, outside the app: **Tailscale** (add `pkgs.tailscale.com/stable/fedora/tailscale.repo`, then `dnf install tailscale && systemctl enable --now tailscaled && tailscale up`), **Syncthing** (`dnf install syncthing`, `systemctl --user enable --now syncthing`), **Obsidian**.

SELinux does not interfere with `php artisan serve` — it runs as your unconfined user. It would only matter if you later front the app with httpd or nginx, at which point `restorecon -Rv /var/www/undernoinfluence` is the fix.

---

## 4. On Fedora — mount the Ubuntu disk and pull

Mount by UUID, not by `/dev/sdb4` — device letters shift between boots.

```bash
sudo mkdir -p /mnt/ubuntu
sudo mount -o ro UUID=46e8452f-87af-4853-9076-dc8200e59276 /mnt/ubuntu
```

**Code:**

```bash
sudo mkdir -p /var/www && sudo chown $USER:$USER /var/www
git clone git@github.com:Programilewski/UnderNoInfluence.git /var/www/undernoinfluence
git checkout v1
```

Add the SSH key to GitHub first, or clone over HTTPS. (The old key is at `/mnt/ubuntu/home/pawel/.ssh/` if you want to reuse it rather than generate a new one — `chmod 600` after copying.)

**The four things git does not carry:**

```bash
SRC=/mnt/ubuntu/var/www/undernoinfluence
cp $SRC/.env .env                                     # gitignored: APP_KEY, DB password, PostHog key
cp $SRC/.claude/settings.local.json .claude/          # gitignored: tool permissions, MCP opt-ins
cp -a $SRC/storage/app/private storage/app/           # uploaded venue images
cp -a $SRC/storage/app/public  storage/app/           # public disk contents
```

**Edit `.env`:** `APP_URL` is the **old** machine's Tailscale address. Replace it with the new one (`tailscale ip -4`). Leave `APP_KEY` byte-for-byte as it is; a different key cannot decrypt anything written with the old one.

**Then grep for the old machine's address in code, not just config:**

```bash
grep -rn '<old-ip>' --exclude-dir={node_modules,vendor,.git,storage} .
```

A host baked into a build config survives the clone and fails in a way that looks nothing like a migration problem. `vite.config.js` pinned the Vite dev-server host to the old machine, so after the move Laravel answered in 28 ms with a complete page whose script tags pointed at a computer that no longer existed — the browser then hung forever, with no error anywhere. Assets are now served from `localhost` by default (`npm run dev`) with `npm run dev:tailscale` for testing on other devices, so nothing in the repository records a machine address any more.

**Database:**

```bash
sudo -u postgres createuser undernoinfluence_user --pwprompt    # password from .env
sudo -u postgres createdb undernoinfluence -O undernoinfluence_user
PGPASSWORD='<from .env>' psql -h 127.0.0.1 -U undernoinfluence_user \
  -d undernoinfluence -f /mnt/ubuntu/home/pawel/uni-db-2026-08-25.sql
```

**Dependencies:**

```bash
composer install
npm install
npm run build
php artisan storage:link
php artisan migrate            # should report nothing to migrate
```

**The test database.** `phpunit.xml` points at `undernoinfluence_test`, which is never dumped — it is rebuilt from migrations on every run — so it does not arrive with the restore and the whole suite fails with *"database undernoinfluence_test does not exist"* until it is created once:

```bash
PGPASSWORD='<from .env>' createdb -h 127.0.0.1 -U undernoinfluence_user undernoinfluence_test
```

**Fedora gotcha — the `pgsql` extension will not load.** If PostgreSQL came from the PGDG repository rather than Fedora's own, `ldconfig` resolves `libpq.so.5` to `/usr/pgsql-NN/lib/` while Fedora's `php-pgsql` is built against its own newer libpq, so every PHP command prints:

```
PHP Warning: Unable to load dynamic library 'pgsql' ... undefined symbol: PQservice
```

`pdo_pgsql` is unaffected and loads normally, which is the only one Laravel uses — the app is not broken, just noisy. The app calls no `pg_*` procedural functions, so the fix is to stop loading the extension nobody uses:

```bash
sudo sed -i 's/^extension=pgsql/;extension=pgsql/' /etc/php.d/20-pgsql.ini
```

---

## 5. On Fedora — pull the AI context

This is what makes Claude Code resume **this conversation** rather than start cold.

```bash
U=/mnt/ubuntu/home/pawel
mkdir -p ~/.claude/projects ~/.claude/plugins
cp -a $U/.claude/projects/-var-www-undernoinfluence ~/.claude/projects/   # 49 MB
cp    $U/.claude.json ~/
cp    $U/.claude/settings.json $U/.claude/history.jsonl ~/.claude/
cp -a $U/.claude/skills ~/.claude/
cp    $U/.claude/plugins/installed_plugins.json \
      $U/.claude/plugins/known_marketplaces.json ~/.claude/plugins/
```

| Item | What it carries |
|---|---|
| `projects/-var-www-undernoinfluence/` | Every session transcript **and** `memory/` — `MEMORY.md` plus the twelve memory files. This is the context. |
| `~/.claude.json` | Per-project config: MCP approvals, trust flags, recent commands. |
| `settings.json` | Model, effort level, enabled plugins, marketplace list. |
| `history.jsonl` | Prompt history for arrow-key recall. |
| `plugins/*.json` | The two manifests; Claude Code re-downloads the plugins themselves. |

Deliberately **not** copied: `plugins/cache` and `plugins/marketplaces` (506 MB, re-fetched from the manifests on first run), `.credentials.json` (log in again instead — ten seconds, and no stale token), and `file-history` / `session-env` / `shell-snapshots` / `paste-cache` (scratch).

The project-side AI configuration — `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `.claude/skills/`, `.mcp.json`, `boost.json`, `skills-lock.json`, `.cursor/`, `.codex/`, `.gemini/`, `.agents/` — is committed and arrives with the clone.

```bash
cd /var/www/undernoinfluence && claude       # log in, then /resume
```

The other six projects under `~/.claude/projects/` are still on the mounted disk if you want them later.

**Machine-local git config.** `~/.config/git/ignore` is git's global ignore file and lives outside every repository, so nothing carries it:

```bash
mkdir -p ~/.config/git && cp $U/.config/git/ignore ~/.config/git/ignore
```

Without it `.claude/settings.local.json` shows up as untracked in every `git status` and can be committed by accident. Check `git config --get core.excludesFile` on the old machine too, in case it points somewhere else.

---

## 6. Reconnect the docs vault

`docs/` is a Syncthing folder as well as a git directory — see [`obsidian-sync.md`](obsidian-sync.md). Tracked notes arrive with the clone. The third-party reference material is not in either container any more — it lives at `~/uni-reference/` on the laptop alone, so a new machine does not get it and does not need it ([[tech/reference-material]]).

Pair the Fedora machine with the **homeserver** (folder ID `gzlwh-sf7go`, label **UnderNoInfluence**), local path `/var/www/undernoinfluence/docs`, Send & Receive. The homeserver is the introducer, so the phone needs nothing. Then open `docs/` — not the repo root — as the Obsidian vault.

Let the first sync settle before running `git status` in the repo, or you will be reading a half-synced tree. Do not copy `docs/.obsidian/` across by hand; it syncs.

---

## 7. Verify, then unmount

```bash
php artisan about                    # environment, DB connection, cache driver
php artisan test --compact           # full suite
composer run dev                     # server + queue + logs + vite
```

Load the site over the new Tailscale address and open a venue page. Use an **active, non-canary** venue — the two canary venues correctly return 404 on public routes, which looks like a broken migration and is not one:

```bash
psql ... -tAc "select slug from venues where is_active and not is_canary limit 1;"
```

Note that no venue currently has an `image_path`, so image rendering cannot be used to prove the uploads came across; check `storage/app/private/venues/` on disk instead.

Only then `sudo umount /mnt/ubuntu`. Keep the external SSD intact until the whole checklist above has passed at least once; it is the only copy of anything that turns out to have been missed.

---

## 8. Do not copy

`vendor/`, `node_modules/`, `public/build/`, `bootstrap/cache/`, `storage/framework/views/`, `storage/logs/` (23 MB of local logs), `.phpunit.result.cache`, `database/database.sqlite` (empty, unused — the app is on PostgreSQL), `packages/` (a separate repository, no longer a dependency), and the agent worktree.

Nothing else on the Ubuntu machine belongs to this project: the only crontab entry points at an unrelated koel install, `supervisor/uni-worker.conf` is a file in the repo that no running supervisor ever loaded, and the two Apache vhosts serve other sites. **The Laravel scheduler is not running** — if you expected the daily jobs to be firing, they are not, and Fedora will not change that.

---

## 9. Decide before you clone, not after

`uni_filtered_venues.csv` and `uni_filtered_venues.xlsx` are **still committed at the repository root**, which contradicts [`../decisions/product/research-files-out-of-the-repo.md`](../decisions/product/research-files-out-of-the-repo.md), decided 2026-08-24. Cloning onto Fedora copies them and their full history. If they hold contact details, deleting them now still leaves them in history — that has to be handled in the same pass, and it is easier while the repository exists in one place.
