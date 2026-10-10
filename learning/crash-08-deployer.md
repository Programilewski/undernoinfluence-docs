---
description: "Crash course: Deployer as a way of thinking — atomic releases, the order of UNI's deploy steps and what each guard protects, failures by where they stop, and rollback's limits."
version: 1.0
owner: Paweł Milewski
updated: 2026-10-10
status: teaching document — holiday series, course 8. The line-by-line companion is deployer-explained.md
---

# Course 8 — Deployer

`deployer-explained.md` (30.09) walks `deploy.php` line by line and reads Deployer's own Laravel recipe from source. This course is the model behind it: why a deploy is shaped the way it is, what each of UNI's guards would have prevented, and how to reason about a deploy that stops halfway. It's written against `deploy.php` as of 10.10, which has one change the reference predates (the smoke test's `Host` header, §3).

## 1. The one idea: build beside, then switch

The naive way to update a site is to change files in place: `git pull` in the live folder, `composer install`, `npm run build`. For a minute or two, visitors are served a mix of old and new files, and if anything fails halfway, the live site *is* the broken half.

Deployer never touches the live code. Every deploy:

1. builds a **complete new release** in its own folder, `releases/N`, while the old one keeps serving;
2. then **switches a single symlink**, `current → releases/N`, in one atomic operation.

```
/var/www/undernoinfluence/
├── current → releases/7     ← nginx, PHP-FPM, cron and the worker all go through this
├── releases/3 … 7           ← the last five (keep_releases = 5)
└── shared/                  ← lives across releases: .env, storage/ (logs, sessions, uploads)
```

Three consequences you can lean on:

- **Until the switch, visitors see nothing of the new release.** Anything that fails before the switch leaves the site exactly as it was.
- **Rollback is just switching the symlink back** to the previous folder. Seconds, no rebuild.
- **`shared/` is the only state that crosses releases.** Anything that has to survive a deploy, like uploads, logs or the `.env`, must live there, and Deployer links it into each release.

## 2. A deploy as a story, in four acts

`dep deploy homeserver --tag=v0.1.7` runs the `deploy` task list in order. Grouped by purpose:

**Act 1: on the PC, before touching any server.**

- `uni:guard:tag`: the tag must exist on GitHub pointing at the same commit as on your PC (not moved, actually pushed), CI must have a green run for that commit, and **on production, the home server must already be running that exact commit**. That last rule turns "test on the home server first" from a good intention into something the tool enforces.
- `uni:assets:build`: a clean checkout of the tag in a temporary worktree, `composer install` (Filament's theme needs vendor files to build CSS), `npm ci && npm run build`, packed into a tarball. The tarball is reused for the production deploy, so **production gets byte-identical assets to the ones the home server was tested with.**

**Act 2: build the new release beside the live one.**

- `deploy:prepare` creates `releases/N`, packs the tag on the PC with `git archive` and uploads it (`local_archive`: servers never hold a GitHub credential), links `shared/`, and checks `shared/.env` exists and has a key (UNI's `deploy:env` override).
- `deploy:vendors` runs `composer install --no-dev` on the server, then `uni:assets:upload` unpacks the PC's tarball.
- `uni:guard:assets` checks the Vite manifest, the MapLibre module and Filament's assets are present, and `public/hot` is absent (if it were there, the page would try to load assets from your PC's dev server).
- `uni:key` generates `APP_KEY` only with `--first-deploy`, and only if it's empty.

**Act 3: change the shared world, carefully.**

- `uni:backup:before-migrate`: on production, if any migration is pending, a database-only backup runs first.
- `artisan:migrate`: **the moment the database changes while the old code is still serving** (course 3, §5: why migrations must work with the previous release).
- `artisan:optimize` caches config, routes, views and events for the new release.

**Act 4: switch, wake everything up, prove it.**

- `deploy:symlink`: the atomic switch.
- `uni:reload`: reloads PHP-FPM (its OPcache and realpath cache would otherwise keep serving the old release for up to two minutes) and runs `artisan reload` (workers and scheduler pick up the new code). This is the deploy user's **one** sudo right.
- `uni:smoke`: `/up` must answer 200 and the MapLibre module must be served as `text/javascript`. If not, it fails with the exact rollback command in the error.
- `deploy:cleanup` keeps five releases and deletes older ones.

## 3. What each guard is protecting you from

Each UNI-specific step exists because of a concrete way deploys go wrong. Knowing the failure each one prevents is what lets you judge, one day, whether a guard is still needed:

| Guard | Without it |
|---|---|
| Tag must match origin | You deploy a tag you moved locally, so production runs code that matches nothing anyone can see on GitHub |
| CI must be green for the commit | You deploy a commit whose tests fail. Tests on the PC aren't enough: they can pass because of something only on your machine |
| Production must match the home server | The "rehearse first" rule erodes the first time you're in a hurry |
| Assets built once, from a clean checkout | Production gets assets built from your working directory, including uncommitted edits |
| `deploy:env` override | Deployer's stock recipe would copy `.env.example` (debug on, no key) into place on a new box, and the first error page would print the environment |
| Asset check, `public/hot` absent | A deploy that "worked" serves pages with no CSS or a missing map |
| Backup before migrate | A migration that damages data has no undo (migrations only go forward) |
| Reload after switch *and* after rollback | Old code keeps running in PHP-FPM for minutes and in the workers for up to an hour |
| Smoke test with the site's `Host` header | A broken release is declared a success. **New since 30.09:** the app answers only its own hostname (`trustHosts()`), so a bare request gets a deliberate 400. The smoke test reads the host from the box's own `.env` and sends it, so no machine address is written into the repository |

And the list of things **no task may ever do**, written above the task list: `optimize:clear` or `cache:clear` (the cache is the database, and holds the scheduler heartbeat, the queue-restart signal and the login rate limits), `migrate:rollback`, `db:seed`. `DeployRecipeKeepsTheRulesTest` pins these rules, so a future edit that breaks one turns CI red.

## 4. When a deploy fails: find where it stopped

The single most useful question after a red deploy: **did it stop before or after `deploy:symlink`?**

| Stopped in | State of the live site | What to do |
|---|---|---|
| Act 1 (`uni:guard:tag`, `uni:assets:build`) | Untouched. Nothing reached the server | Read the message (it says what's missing: push, CI, home first). Fix, re-run |
| Act 2 (prepare, vendors, assets, key) | Untouched: still the old release. A half-built `releases/N` is left for a later deploy to clean | Fix the cause, re-run |
| Act 3 (`artisan:migrate`, `artisan:optimize`) | **Old code, but the database may already be migrated** | Check whether the migration ran (`php artisan migrate:status` in `current`). If the old code breaks against the new schema, you're in the expand/contract situation. The pre-migration backup exists on production |
| After `deploy:symlink` (reload, smoke) | **New code is live.** The smoke test failed, so something's wrong with it | `dep rollback <host>` right away, then diagnose on the home server |

Two other states you might meet:

- **"Deploy is locked."** A deploy that crashed hard can leave a lock file. Deployer's failure hook unlocks on normal failures. If one remains, first make sure no other deploy is actually running, then `dep deploy:unlock <host>`.
- **A failed deploy is never a reason to edit files on the server.** Every fix goes through the PC and a new tag (course 9).

## 5. Rollback: what it does and doesn't do

`dep rollback production`:

1. picks the previous release, skipping any marked bad;
2. switches `current` to it (atomic);
3. marks the release you rolled away from as `BAD_RELEASE`, so a second rollback never lands back on it;
4. then UNI's hook runs `uni:reload`.

**It does not touch the database.** The schema stays as the newer release left it. So a rollback is only safe if **every release works against the schema of the release after it**, which is the expand-then-contract rule. When a migration has destroyed data (dropped a column, rewritten values), rollback can't help. The pre-migration backup is the way back, and restoring it means losing whatever was written since.

**Runbook 5.3** covers rollback *without the PC*: SSH in with the break-glass key and switch the symlink by hand. It's the same operation Deployer does, typed out.

## 6. Commands

```bash
dep deploy homeserver --tag=v0.1.7         # always first
dep deploy production --tag=v0.1.7         # only after the home server runs it and you've looked
dep deploy homeserver --tag=v0.1.N --first-deploy   # a brand-new box only: generates APP_KEY
dep rollback production                    # back one release, then reload
dep releases production                    # which releases exist, which is current
dep ssh production                         # a shell in the current release
dep deploy production --tag=… -v           # more detail; -vvv shows every remote command
dep deploy:unlock production               # only after checking no deploy is running
```

## Questions to bring back

1. **Update `deployer-explained.md` for 09.10.** It predates the smoke test's `Host` header and the "seed once after a first deploy" runbook step. Same as the Ansible doc: rewrite where it drifted.
2. **A post-deploy "look" step.** The smoke test checks `/up` and one asset. Would a short manual list after each production deploy (one venue page, `/mapa` draws, `/admin` heartbeat green) be worth writing down? It's the human half of the smoke test, and it takes a minute.
3. **The production deploy rhythm.** With the home-server-first guard, every production deploy has a rehearsal. How long should a tag sit on the home server before it goes to production: a fixed wait, or "once I've clicked through it"?
