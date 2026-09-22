---
version: 1.1
owner: Paweł Milewski
updated: 2026-09-08
status: approved
---

# Going to production: what the Fedora migration changed

The move from Ubuntu to Fedora on 2026-08-25 was, without anybody planning it that way, the dress rehearsal for the move that actually matters. It proved a set of rules — those are in [`migration-lessons.md`](migration-lessons.md). This document applies them to the two moves still ahead, a **preprod server** and a **production server**, and records what those moves involve that a laptop-to-laptop migration could not test.

**This is not the deploy runbook.** The environment variable matrix, the four required code changes (PC1–PC4: forced HTTPS, trusted proxies, HSTS, robots), and the infrastructure checklist already live in the spec's **Production Readiness Audit** section (`../product/spec.html`, `#production-readiness-audit`). Where the two disagree, prefer this document: the spec section was written 2026-06-17 and its "Local Dev" column still names the retired Ubuntu machine.

---

## What carries over unchanged

Five of the nine rules apply to a server with no translation at all.

| Rule from the migration | On a production server |
|---|---|
| **The destination pulls, while running, from a source it cannot modify** | The server clones from git and restores from a dump. Nothing is ever pushed from a laptop into a live tree — no `rsync` of a working directory, no editing files over SSH. |
| **No machine address or absolute machine path in the repository** | The production host, the domain, and the database host all come from `.env` on the server. The grep in the lessons document belongs in the pre-deploy check. |
| **One vendor per system library, written down** | Decide once whether PHP and PostgreSQL come from the distribution or from a vendor repository (Remi, PGDG), record it in this document, and never mix. The `libpq` incident cost an evening on a machine where nothing was at stake. |
| **Keep the path** | The production checkout goes to `/var/www/undernoinfluence` as well, so every path written in this repository's documentation stays true on every machine. |
| **A runbook is a draft until executed once** | Preprod exists precisely so the production runbook gets its correction pass somewhere that an outage is not an outage. |

---

## What production adds that this migration never tested

Each item below was verified against the code and the machine on 2026-08-26.

### 1. The application has never been served by a real web server

Everything to date has run under `php artisan serve`, as an unconfined user, reachable only over a tailnet. Behind nginx or httpd with php-fpm, three things that have never mattered start mattering at once:

- **SELinux stops being a non-issue.** `artisan serve` runs unconfined; a web server does not. The app directory needs `restorecon -Rv /var/www/undernoinfluence`, `storage/` and `bootstrap/cache/` need a writable context, and a remote database needs the `httpd_can_network_connect_db` boolean. This is the one place where the "pull, don't push" rule stops being a convenience and becomes load-bearing.
- **File ownership splits in two.** Today one user owns everything. In production the deploy user owns the code and the web user writes to `storage/` — two identities where there has only ever been one.
- **The request path gets longer.** Proxy headers, the real client IP, and the original scheme all have to be trusted correctly, which is exactly what PC1–PC3 in the spec are for. None of it has run anywhere.

### 2. The repository still holds one Ubuntu assumption

`supervisor/uni-worker.conf` line 8 says `user=www-data`. That user exists on Debian and Ubuntu; on Fedora and RHEL the web user is `apache` or `nginx`. The file has never been loaded by a running supervisor, so nothing has ever complained.

This is the same fault as the hard-coded Vite host, in a slower form: **an assumption about a specific machine, committed to the repository, that fails only once it reaches a machine that does not match.** It needs to be either parameterised at deploy time or fixed to whatever the production host actually is, and the choice recorded.

### 3. The rule about secrets inverts

On the dev migration the correct move was to copy `APP_KEY` byte for byte — a different key cannot decrypt anything written with the old one. On the production move the correct move is the exact opposite: **production generates its own `APP_KEY` and its own database password on the server, and neither ever appears in git or in a laptop's `.env`.**

There is a specific reason this cannot be handled casually. The local database password sits in cleartext in `phpunit.xml`, committed, and is therefore in the history of every clone (debt item **T-25a**). It is not a candidate for the production password, and rotating it locally does not remove it from history. Settle that before the server exists, not after — as the 2026-08-25 journal notes, it is the same operation as removing the research files from history, so it should be done once.

### 4. Config caching has never been run

`bootstrap/cache/` holds only `packages.php` and `services.php` — no `config.php`, no route or view cache. Production runs `config:cache`, `route:cache` and `view:cache`, and config caching changes behaviour: any `env()` call outside a `config/` file returns `null` once the cache exists. That is a class of bug that appears **only** in a cached environment and never in development.

Preprod is where this runs for the first time. Not production.

### 5. `public/hot` is the production form of the Vite failure

If `public/hot` exists on a production server, Laravel serves asset URLs pointing at a dev server that is not there — a complete, fast, correct-looking page whose scripts hang forever, which is precisely the failure that cost an evening on 2026-08-25. The file is absent locally right now and `public/build/manifest.json` is present, which is the correct shape. A deploy must guarantee it, not assume it.

### 6. The scheduler is a service and it has never run *(the deadline is gone — see below)*

`routes/console.php` defined three daily jobs **as of 26.08** — this block is a snapshot, not the current file (see the resolution note below):

```php
Schedule::command('uni:check-offer-freshness')->daily();
Schedule::command('analytics:prune-events')->daily();  // removed 30.08
Schedule::command('model:prune')->daily();
```

There is no crontab on this machine and there was none on the old one, so **none of these has ever run** (debt item **T-25b**). That answers the open question left in the 2026-08-25 journal about what the scheduler was supposed to contain — and it turns one of the answers into a dated warning.

`analytics:prune-events` deletes raw events older than `analytics.raw_event_retention_days`, which is **90**. The events table currently holds **482 rows, the oldest dated 2026-06-17**. The first day on which that job would delete anything is therefore **2026-09-15** — about three weeks from now.

> **Consequence.** Switching the scheduler on before **T-20a** (no aggregation ahead of the pruner) is fixed does not lose data today, and does lose it permanently from mid-September. Turning the scheduler on is not a neutral act of hygiene; it has a deadline attached, and the two work items are one item.

**Resolved 30.08, four days after this was written — the 15.09 deadline no longer exists.** `decisions/product/raw-events-are-kept-not-pruned.md` took the second of the two options this section's checklist offered: the pruner is not scheduled at all. `routes/console.php` now schedules `uni:check-offer-freshness`, `analytics:roll-up` and `model:prune`, and carries a comment explaining why `analytics:prune-events` is deliberately absent — raw events hold no identifier and are kept indefinitely. Retention is enforced by `model:prune` on the two tables that do point at a person: `venue_offer_logs` at 24 months and `audit_logs` at 12.

The scheduler still has never run, so **T-25b stands** and the rest of this section is current. What is no longer true is that switching it on is dangerous or dated. It is now an ordinary piece of setup.

*Verified against `routes/console.php` on 08.09 — this was carried as a live launch blocker for nine days after it had been resolved.*

### 7. Dump and restore is proven once, by hand. The other half is not

The migration performed this project's first successful database restore — 33 tables, row counts verified, across two major PostgreSQL versions. That is real evidence and it is worth banking: the dump/restore path works, and `pg_dump` of an 11 MB database is cheap.

What does not exist is any of the rest of a backup: a schedule, off-machine storage, retention, and — the part everybody skips — **a rehearsed restore into an empty server**. An untested backup is not a backup, and the spec's own infrastructure checklist already flags the absence of a backup strategy as unaddressed.

The tool is already chosen: `spatie/laravel-backup` targeting **Scaleway Object Storage**, marked a V1 launch blocker in [`dependencies.md`](dependencies.md), and it is in [`../roadmap/undone-inventory.md`](../roadmap/undone-inventory.md) under the machine, because everything that touches data waits on it. Backblaze B2 was the earlier target and is superseded — see [`../decisions/product/backup-storage-provider`](../decisions/product/backup-storage-provider.md). **The destination now exists**: bucket `uni-backups-prod` in `fr-par`, in its own Scaleway Project, reachable by one credential that can do nothing else. The region question that used to sit here is closed — it is EU, and Scaleway is already a processor for this project through TEM, so there is no new recipient to disclose. What is left is the half that keeps getting skipped: install the package, encrypt before upload, and **do the restore rehearsal, not just the backup job** — the migration's evidence is that the restore half works, but by hand, once, with somebody watching.

### 8. The database that arrives in production is not this one

The 2026-08-24 audit already established this — the 24.08 audit listed the data layer as "67 venues, all fabricated" and put wiping them third, after backups — though production seeds none of them, so the wipe is a local matter (deploy checklist E2). It is repeated here because it is the item the *migration* makes concrete: what moved to Fedora was a database of fixtures, and a production server that runs the seeders comes up with none of them.

Verified again on 2026-08-26:

- The database holds **67 venues: 2 canaries and 65 others**, all with `source = 'manual'`.
- The 65 are **fixtures, not real places.** The names repeat — "Winiarnia Nolo" five times, "Botanic Bar" five times, "Dreamland Lounge" four times — because they come from a fixed pool in `FakeVenueSeeder` and `DatabaseSeeder::seedDevVenues()`, both gated to the `local` environment.
- The same 67 rows are in the pre-upgrade dump from 2026-08-25, so **nothing was lost in the migration.** The database has held fixtures the whole time.
- `DatabaseSeeder` in a non-local environment seeds cities, categories, districts and canaries — and **no venues at all**.

The spec's readiness snapshot says "63 real active venues in the database" (2026-06-17). Against the current data, that is not true, and it should be corrected there rather than carried forward.

The real research lives in `uni_filtered_venues.csv` at the repository root: 2 378 rows with genuine Warsaw names, addresses and coordinates, of which **20 are marked `Has_0% = yes`**. That file carries `osm_id` columns, which puts it in the path of two standing decisions — [`osm-dropped`](../decisions/product/osm-dropped.md) (no OSM attributes in the `venues` table) and [`research-files-out-of-the-repo`](../decisions/product/research-files-out-of-the-repo.md) (research material does not live in the repository, and *"data the application genuinely needs at runtime becomes a seeder or a migration, never a loose file at the repository root"*).

> **Consequence.** Production comes up with zero venues, and the path from research to seeded venue rows does not exist yet. It is a launch blocker, not a deployment detail, and it needs a product decision about the CSV before it can be built. The estimate in the roadmap — collecting venues by hand over two to three weeks — is the current plan; whether the 20 triaged rows in that CSV can shorten it is one of the open questions below.

One further note the spec should be corrected against: its readiness snapshot still says "63 real active venues in the database" (2026-06-17). Against the current data that is not true.

### 9. Nothing has ever faced the public internet

Every access so far has been over a tailnet. DNS, a TLS certificate and its renewal, HSTS (which hard-blocks the site for a year if the certificate later lapses), the admin gate described in the spec, and rate limiting under real traffic are all untested surfaces. They are not hard; they are simply unexercised, and the pattern from 2026-08-25 is that unexercised steps are the ones with the holes.

---

## What preprod is for

Preprod is not a smaller production. Its job is to be the machine where each item above fails for the first time, cheaply, and gets written into the runbook.

| Preprod must prove | You know it passed when |
|---|---|
| The app runs behind a real web server | A page renders through nginx/php-fpm with SELinux enforcing and no `restorecon` run by hand afterwards |
| The deploy is reproducible from git plus a dump | A second, empty machine reaches the same state using only the written runbook |
| Config, route and view caching are safe | The suite and a manual pass both work with the caches warm, not just cold |
| Assets are built, not proxied | `public/hot` is absent, `public/build/manifest.json` present, no request leaves for port 5173 |
| The queue worker runs as a service | `supervisor/uni-worker.conf` (with the user corrected) starts on boot and survives a reboot |
| The scheduler runs — and is safe to run | The cron entry fires. **The safety half is already satisfied:** `analytics:prune-events` is not scheduled (30.08), so only the cron entry itself remains |
| A backup restores | An empty database is rebuilt from last night's dump and the row counts match |
| Secrets are generated, not copied | `APP_KEY` and the DB password on preprod exist nowhere else, least of all in git |
| Venue data can be seeded | A documented path produces real venue rows in an empty database |
| HTTPS end to end | `route()` and `url()` emit `https://`, the proxy headers are trusted, HSTS is set outside local |

Anything that fails there gets fixed in the runbook the same day, while the reason is still obvious. That is the single most transferable finding from 2026-08-25.

---

## Decisions still open before the first deploy

These are genuine open questions, not omissions. They are listed so the first deploy does not become the moment they get answered by default.

1. **Hosting target and region.** EU residency is required and pay-as-you-go is preferred for V1 — recorded in `stack.md` and still unanswered. It determines almost everything below it.
2. **Distribution and package source.** Which OS, and whether PHP and PostgreSQL come from the distribution or a vendor repository. Pick one supplier per component and write it down here (rule 5).
3. **One server or two.** Preprod as a separate machine, or a second virtual host on the same one. Cheaper is not obviously wrong at this stage, but it changes what preprod can actually prove.
4. **Where the database lives.** On the app server or as a managed service. Managed changes the backup answer and the SELinux answer at the same time.
5. **How secrets reach the server.** Generated on the box, or held in something that can also rotate them.
6. **What happens to `uni_filtered_venues.csv`** — the source of the only real venue data, sitting in a repository that a standing decision says it should leave, with an OSM lineage that a second decision constrains. One decision, three consequences.
7. **What "deploy" means as a command.** A shell script in the repository is enough for V1 and is worth more than nothing, because it is the runbook in executable form.

---

## Sequence

The launch order — backups first, then hosting, then collecting real venues — is carried in [`../roadmap/undone-inventory.md`](../roadmap/undone-inventory.md), and nothing here displaces it. What the migration adds is three items that slot into it, two of them dated.

1. ~~**Before the scheduler is switched on, fix T-20a.** Deadline **2026-09-15** (§6).~~ **Done differently, 30.08:** the pruner was unscheduled instead of the rollup being built, so there is no deadline and nothing gates the scheduler. See §6.
2. **Settle the repository history in one pass** — the `phpunit.xml` password and the research files (§3, §8). Easier while the repository exists in two places rather than ten, and it has to precede any deploy that generates production secrets.
3. **Record the packaging decision here before preprod is built** (open question 2), so the `libpq` evening is not repeated on a machine where it costs more than an evening.
4. Then the roadmap's own order, with **preprod running the table above** before production, and the restore rehearsal completed before either.

Related: [`migration-lessons.md`](migration-lessons.md) · [`migrating-to-a-new-machine.md`](migrating-to-a-new-machine.md) · [`stack.md`](stack.md) · [`security.md`](security.md) · `../product/spec.html#production-readiness-audit`
