---
description: "Crash course: the whole cycle from a change on the PC to production — the normal loop, and the variants for hotfixes, migrations, .env changes, server changes, dependency updates and a new box."
version: 1.0
owner: Paweł Milewski
updated: 2026-10-10
status: teaching document — holiday series, course 9. Builds on courses 7 (Ansible) and 8 (Deployer); the commands are in ops/deployment-runbook.md
---

# Course 9 — The deployment cycle

Courses 7 and 8 explain the two tools. This one explains **the loop they sit in**: how a change travels from your PC to a visitor's phone, and what changes about that path when the change is a hotfix, a migration, a secret, a server setting or a whole new box. The goal is to always know which route a given change takes, because most deploy accidents come from sending a change down the wrong one.

## 1. First, sort the change: five kinds of thing live on a server

Every change you'll ever make to UNI belongs to one of these, and each has exactly one route:

| What changes | Lives in | Route to the server | Example |
|---|---|---|---|
| **Application code** (PHP, Blade, JS, migrations, seeders) | git | commit → CI → tag → **Deployer** | a new filter, a bug fix, a new column |
| **Server setup** (packages, nginx, firewall, users, cron, worker) | git (`ansible/`) | commit → **Ansible**, home then production | a new PHP extension, an nginx header |
| **Secrets and per-server settings** | `shared/.env` on each box, by hand | **SSH + editor**, never git | the Scaleway key, `UNI_HEALTHCHECK_PING_URL` |
| **Reference data** (cities, categories, districts, canaries) | seeders, in git | `db:seed --force` **once** after a first deploy, again only when the code adds a city or category | a second city |
| **Real catalogue** (venues, products, menus) | the production database | the **admin panel and its importers**, on production only | the ~30 launch venues |

The mistakes this table prevents: putting a secret in git, fixing nginx by hand instead of in the playbook, expecting a deploy to load data, re-running seeders and overwriting admin edits (`CategorySeeder` updates rows).

## 2. The normal loop, for application code

```
 PC                                  GitHub                    home server            production
 ──                                  ──────                    ───────────            ──────────
 change → tests → pint → commit
          └─ push main ───────────▶  CI (tests.yml)
                                       │ green
 git tag -a v0.1.N → push tag ────▶  CI on the tag
                                       │ green
 dep deploy homeserver --tag ──────────┼────────────────────▶  release N, smoke ✓
                                       │                         │
                                   you look (phone: pages, map, /admin heartbeat)
                                       │                         │
 dep deploy production --tag ──────────┴──────── guard: home runs this commit? ─────▶ release N, smoke ✓
                                                                                         │
                                                                         you look; journal entry
```

Step by step, with the reason for each:

1. **Change, on the PC**, with its test (the project rule: every change is tested). Run the affected tests, then the full suite before tagging.
2. **`vendor/bin/pint --dirty`.** Formatting is fixed here, never noticed in CI.
3. **Commit and push `main`.** CI runs the whole suite against PostgreSQL 18 and checks the assets a deploy needs exist.
4. **Tag**: `git tag -a v0.1.N -m "what it is"`, then `git push origin v0.1.N`. An annotated tag carries a date and a message, and the message is your release note. **Tags never move.** A fix is a new tag, never a re-pointed one. The guard refuses a tag that differs from origin precisely to catch this.
5. **Deploy to the home server.** Deployer checks the tag and its green CI run, builds the assets once on the PC, deploys, and smoke-tests.
6. **Look**, for real: on the phone, the pages you changed, the map, `/admin`'s heartbeat. The smoke test proves the site answers. Only you can tell whether it's *right*.
7. **Deploy the same tag to production.** The guard refuses unless the home server is running that exact commit. The assets tarball from step 5 is reused, so production gets byte-identical files.
8. **Look again**, then write the journal entry: which tag, what it changed, anything odd.

**What the loop costs:** the CI run time twice (on `main`, then on the tag), plus two deploys. That's the price of every change, including a one-word typo fix. It's deliberate: the cheapest route is the one with no exceptions, because exceptions are where accidents happen.

## 3. Variant: something is broken on production right now

**Rollback first, fix second.**

1. `dep rollback production`. Seconds. The previous release is live and reloaded.
2. Confirm the symptom is gone. If it isn't, the cause wasn't the latest release (look at course 2's symptom table).
3. Reproduce on the PC or the home server, fix with a test that fails without the fix, then the **normal loop**, with a new tag.

There's deliberately **no fast path** that skips CI or the home server. If a fix feels too urgent to wait for CI, that's the moment a rollback has already made it non-urgent.

If you're away from the PC: runbook 5.3, the manual symlink switch with the break-glass key.

## 4. Variant: the change includes a migration

From launch onward (course 3, §5), every schema change is a **new** migration, and it must work with **both** the old and the new code, because:

- during the deploy, the migration runs while the old release still serves (Act 3 comes before the switch);
- after a rollback, the old code runs against the new schema.

So a breaking schema change is split across **two tags**:

| Tag | Migration | Code | Rollback safe? |
|---|---|---|---|
| v0.1.N (expand) | add the new column / table | writes both, reads new with fallback to old | yes: the old code ignores the new column |
| v0.1.N+1 (contract) | drop the old column | uses only the new | yes, to v0.1.N, which no longer needs the old column |

On production, a deploy with pending migrations takes a database-only backup first, automatically. For a migration that rewrites data, take a full `php artisan backup:run` by hand as well, and note the time. That's your restore point.

## 5. Variant: changing `shared/.env` on a live box

**This is the one route the runbook doesn't cover yet, and it has a trap.**

Each deploy runs `artisan:optimize`, which **caches the configuration**: Laravel reads `.env` once, at deploy time, and saves the result. After that, editing `shared/.env` changes **nothing** until the cache is rebuilt. Worse, if config is cached, any code calling `env()` outside a config file gets `null`.

The safe sequence, as `deploy` on the box:

```bash
cd /var/www/undernoinfluence
nano shared/.env                                      # make the change
php current/artisan config:cache                      # re-read .env into the cache
sudo /usr/bin/systemctl reload php8.5-fpm             # web requests see it (deploy's one sudo right)
php current/artisan reload                            # workers and scheduler see it
```

Or: **redeploy the same tag**. A new release runs `optimize` and the reloads. It's slower, but it's the route you already know.

Two more rules for `.env`:

- **Change one value, then check the thing it affects** (send a test mail after a mail setting, run a backup after a `BACKUP_*` change).
- **Keep a copy in the password manager**, updated on every change. `shared/.env` exists only on the box, and the backups may not include it. Rebuilding production needs it.

## 6. Variant: changing the server itself

Anything in `ansible/`:

1. Commit the change on the PC.
2. `ansible-playbook -i inventories/home provision.yml -K`, then **run it again: the second run must be `changed=0`**.
3. Deploy the current tag to the home server again if the change could affect the app (PHP settings, nginx rules), and look.
4. The same on production.

If the change touches the PHP version, `DeployRecipeKeepsTheRulesTest` makes CI fail until `deploy.php` and CI agree with the playbook. That's the one seam between the tools that's tested.

## 7. Variant: updating dependencies

Composer and npm updates are **application code changes**, so they take the normal loop: update on the PC, full suite, commit (`composer.lock`, `package-lock.json`), tag, home, production. Your rule from 06.10 sets the rhythm after launch:

| Kind | When |
|---|---|
| Security fix | As soon as it's known, through the normal loop |
| Patch and minor | Batched, e.g. one dependency tag a month |
| Major (Laravel, Filament, Livewire, Tailwind) | Deliberately: own branch, read the upgrade guide, longer on the home server |

Ubuntu's own packages are different: unattended-upgrades applies security updates itself, and reboots are yours (course 2, §6).

## 8. Variant: a brand-new box

The rarest cycle, and the one that proves all the others. The runbook has every command, Phases 3–4 for home and Phase 7 for production. The shape:

```
bootstrap.yml (production only, as OVH's user: creates admin)
  → provision.yml, twice (second run changed=0)
  → write shared/.env by hand (copy kept in the password manager)
  → dep deploy <host> --tag=… --first-deploy        (generates APP_KEY)
  → db:seed --force, once                            (reference data + canaries; never sample products on production)
  → uni:create-admin
  → restart the worker                               (it FATALed before `current` existed)
  → production only: mail test, backup:run by hand, restore it into a scratch database, healthcheck ping seen
```

**Phase 5.2, rebuilding the home server from nothing using only the runbook**, is the test of this whole course. If the rebuild needs anything you had to remember rather than read, that's a gap in the runbook. Fix it before production depends on it.

## 9. The cycle as a habit, in four lines

1. **Sort the change first** (§1). The route follows from the kind.
2. **Everything goes home first.** Code, server config and dependencies alike.
3. **Nothing is fixed on a server by hand** except `shared/.env`, which has no other home.
4. **Every production change leaves a trace**: a tag message, a journal line, a password-manager update for `.env`.

## Questions to bring back

1. **Add §5 to the runbook.** "Changing `shared/.env` on a live box" isn't written anywhere, and the config-cache trap would make the first attempt look like it failed. Recommended as a short runbook section. (Checked 10.10: no code in `app/`, `routes/` or the views calls `env()` directly, so the `null` half of the trap doesn't bite today. A test pinning that would keep it true.)
2. **`shared/.env` isn't in the backups, by design.** Checked 10.10: `config/backup.php` includes only the database and `storage/app/{public,private}`, and rightly so, since `.env` holds the backup password itself. **So the password-manager copy is the only off-box copy.** Make "update the password-manager copy" an explicit line of the §5 sequence and of runbook 7.5?
3. **Version numbers at launch.** Tags are `v0.1.N`. Mark the public launch as `v1.0.0`, so the tag list shows where V1 begins and the V2 work can be `v1.x`? Purely a naming choice, but easier to make before launch than after.
4. **A changelog from tag messages.** `git tag -n9` lists every tag's message. If tag messages are written for a reader ("Brand spelling checked on import"), that list *is* the release history, with no extra document. Worth a convention?
