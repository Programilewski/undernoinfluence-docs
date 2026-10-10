---
description: "Crash course: PostgreSQL for the person who owns the only copy of the data — looking safely, migrations on live tables, backups, growth."
version: 1.0
owner: Paweł Milewski
updated: 2026-10-10
status: teaching document — holiday series, course 3 of 6
---

# Course 3 — PostgreSQL survival

Until launch, the database has been disposable: `migrate:fresh --seed` and it's back. The day the real catalogue is loaded on production, that stops being true. The venues you typed in by hand become the most expensive thing UNI owns, and the `venue_stats` counts become the one thing that "cannot be recreated after the fact". This course is about the change in habits that moment requires.

## 1. The words, quickly

- **Cluster** (or *instance*): one running Postgres server. Ubuntu calls it `18/main`. It holds several databases.
- **Database**: UNI's is one database inside that cluster, owned by the application's **role**.
- **Role**: Postgres's word for a user. There are two you care about. `postgres` is the superuser, reachable only as the OS user `postgres` ("peer" authentication: no password, Linux vouches for you). The **app role** has a password generated on the box once (`/etc/uni`, root only) and owns only UNI's database.
- **Schema**: a namespace inside a database. UNI uses only `public`. You can ignore schemas.

Postgres listens on **loopback only** (role `postgres`, "Listens on loopback only"). Nothing outside the box can even try to connect. To look at production data you SSH in first.

## 2. Looking without touching

```bash
ssh uni-prod
sudo -u postgres psql undernoinfluence      # name as in the production .env (DB_DATABASE)
```

The psql commands you need:

| Command | Does |
|---|---|
| `\dt` | list tables |
| `\d venues` | one table's columns, indexes, foreign keys |
| `\x auto` | wide rows display vertically. Turn it on once and leave it |
| `\timing on` | show how long each query took |
| `\q` | quit |

**The safety habit.** Before any session where you only mean to read:

```sql
SET default_transaction_read_only = on;
```

Now any accidental `UPDATE` or `DELETE` fails instead of running. And when you *do* mean to change something by hand (rare, and better done in the admin panel):

```sql
BEGIN;
UPDATE venues SET name = 'Foo' WHERE id = 42;   -- psql reports: UPDATE 1
SELECT name FROM venues WHERE id = 42;          -- look at the result
COMMIT;                                         -- or ROLLBACK; if the count wasn't 1
```

Inside `BEGIN … COMMIT` nothing is permanent until you say so, and `ROLLBACK` erases it. The row count Postgres reports after the `UPDATE` is your last chance to see that a missing `WHERE` just hit 3 000 rows instead of 1.

## 3. Postgres behaviours that surprise people

- **An `UPDATE` writes a new copy of the row**, and the old copy stays as a dead row until **VACUUM** reclaims the space. *Autovacuum* does this in the background by default. You don't need to run anything. Just know that a table which is updated a lot (the cache table, the jobs table) is physically bigger than its row count suggests, and that's normal.
- **Text comparison is case-sensitive.** `'Heineken' = 'heineken'` is false. You met this in the 08.10 brand-spelling work. `ILIKE` and `lower()` are the case-insensitive tools.
- **`NULL` isn't equal to anything, including `NULL`.** `WHERE confirmed_at = NULL` finds nothing. It must be `IS NULL`. Several of UNI's freshness queries depend on getting this right (`whereNull('confirmed_at')`).
- **A failed statement poisons its transaction.** Inside `BEGIN`, after any error, every following command fails with "current transaction is aborted" until you `ROLLBACK`. That isn't a second error, just the first one echoing.
- **The default `timestamp` type has no time zone.** UNI stores UTC (the box is UTC, the app is UTC). Reading production data, remember Warsaw is +1 or +2 hours.

## 4. When the site is slow because of the database

Two queries, in order.

**What is running right now:**

```sql
SELECT pid, now() - query_start AS running_for, state, left(query, 120)
FROM pg_stat_activity
WHERE datname = current_database() AND state <> 'idle'
ORDER BY running_for DESC;
```

A query that has been running for minutes on a site like UNI is almost always a mistake (a missing index, an accidental full scan). `SELECT pg_cancel_backend(<pid>);` politely cancels it. `pg_terminate_backend` kills the whole connection and is the last resort.

**Why one query is slow:**

```sql
EXPLAIN ANALYZE SELECT … ;   -- runs it and shows the plan with real timings
```

Look for `Seq Scan` on a large table where you expected an index, and for the line where the actual time jumps. You don't need to read plans fluently. Paste one into a session and it can be explained. The habit that matters is *capturing the plan while it's slow*, because by the time you ask about it the problem may have passed.

The backlog already knows the most likely future culprit: discovery loads every matching venue on every render, which is measured fine at launch size and fails around 5 000 venues (trigger: 1 000 live venues). That's an application fix, not a database one.

## 5. Migrations against real data, the big change

### The rule that changes on launch day

Your current rule (edit-migrations-before-prod): *a change to an existing table means editing its create migration, then `migrate:fresh --seed`.* That works only while every database can be wiped. **From the first production import, it's dead.** Production records which migrations it has already run (the `migrations` table) and will never re-run an edited one. Editing an old migration after launch changes nothing on production and makes your local schema silently differ from it.

After launch: **every schema change is a new migration**, and old migrations are never touched again. It's worth recording the switch as a decision on the day it happens, because the old rule is in memory and in habits.

### What locks what

On a table with real traffic, the question for every migration is: *how long does it hold a lock, and what does that lock block?* `ALTER TABLE` takes the strongest lock there is, so while it holds it, **even reads of that table wait**. Usually that's milliseconds. Sometimes it's the whole duration of rewriting the table.

| Change | On PG 18 | Safe on a live table? |
|---|---|---|
| Add a nullable column | Instant (catalogue change only) | Yes |
| Add a column with a constant default | Instant since PG 11 | Yes |
| Add a column with a volatile default (`now()`, random) | Rewrites the table | Small tables only |
| Change a column's type | Usually rewrites the table | Small tables only; for big ones, add a new column and backfill |
| Make an existing column `NOT NULL` | Scans the whole table under lock | Small tables yes; for big ones there's a two-step `CHECK … NOT VALID` route |
| `CREATE INDEX` | Blocks writes for the duration | Small tables yes; big ones need `CREATE INDEX CONCURRENTLY` |
| Rename a column or table | Instant, but **breaks the old code still running** | See below |
| Drop a column | Instant, but **breaks the old code** if it still reads it | See below |

At UNI's size (hundreds of venues, thousands of offers), almost everything except `events` is small, and these all finish in milliseconds. **The table to be careful with is `events`**, the one that grows forever. Any index or column change on it later needs the concurrent or two-step version. A Laravel detail if that day comes: `CREATE INDEX CONCURRENTLY` can't run inside a transaction, and Laravel wraps Postgres migrations in one, so the migration must opt out (`public $withinTransaction = false;`).

### Why renames and drops break things: the deploy window

During a deploy, for a few seconds, **the new schema and the old code coexist**. Migrations run before `current` flips, so old PHP processes are still serving requests. If the migration renames `venues.phone` to `venues.phone_number`, every old process reading `phone` throws until the flip. Worse: **a rollback restores the old code but not the old schema** (UNI's migrations only go forward, deliberately; `deploy.php` forbids `migrate:rollback`). After that rollback, the old code runs against the new schema and stays broken.

The standard answer is **expand, then contract**, over two deploys:

1. **Expand:** add the new column, and write the code so it works with both columns present. Deploy. Rollback is safe, because the old code ignores the new column.
2. **Contract:** once the new code is settled, a later migration drops the old column.

For a solo project at UNI's size you won't need this often, but use it whenever a migration would break the *previous* release, since that release is the one a rollback lands on.

## 6. Growth: how big will `events` get?

`events` has six columns, a `jsonb` of properties, and three composite indexes (`type, created_at`; `venue_id, type, created_at`; `city_id, type, created_at`). The indexes roughly double or triple the per-row cost. **A planning figure of ~0.5 KB per event including indexes** is pessimistic enough to be safe.

| Events per day | Per year | Disk per year (~0.5 KB each) |
|---|---|---|
| 2 000 (quiet launch) | 0.7 M | ~0.4 GB |
| 20 000 | 7.3 M | ~4 GB |
| 100 000 | 36 M | ~18 GB |

On a 40 GB disk, with the OS, backups being staged locally and logs, the first two rows are fine for years and the third becomes a decision within about a year. **Don't trust my figure.** After the first month on production, measure the real one:

```sql
SELECT pg_size_pretty(pg_total_relation_size('events')) AS with_indexes,
       count(*) AS rows,
       pg_total_relation_size('events') / greatest(count(*), 1) AS bytes_per_row
FROM events;
```

The 16.09 decision keeps raw events forever because they identify nobody, and that's a legal judgement, not a disk one. If disk ever forces the question, the options in order of preference are: a bigger VPS disk (cheap at OVH), moving old raw events to a compressed archive file (the rolled-up counts stay in the database), then pruning. The decision record already notes that any pruner must run strictly after the roll-up.

## 7. Backups: what you actually have

Three layers, each answering a different disaster:

| Layer | When | Covers | Doesn't cover |
|---|---|---|---|
| **OVH whole-machine backup** (included with VPS-1) | Daily, by OVH | The box itself dying | Restores *everything* to that moment. Can't pull back one table. Lives at the same provider |
| **`spatie/laravel-backup`** | 01:30 UTC daily, 7 daily + 4 weekly kept | Database + uploads, AES-256 encrypted, in Scaleway (`uni-backups-prod`, object lock planned) | Up to ~24 h of changes since the last run |
| **Pre-migration dump** (`uni:backup:before-migrate`) | Every production deploy with pending migrations | A migration that damages data | Anything not caused by a deploy |

Two concepts make this concrete:

- **RPO (recovery point objective)**: how much data you can afford to lose. With nightly backups it's up to 24 hours. For UNI today that's acceptable: the data written on any given day is mostly *your own admin work*, and you could redo a day of it. It stops being acceptable when owners write in V2, which is the moment to reconsider WAL archiving or point-in-time recovery. Not before.
- **RTO (recovery time objective)**: how long a restore takes. Unknown until rehearsed, which is why A6's step 7 (restore a real archive into an empty scratch database *on the server*) matters more than the backup itself. **A backup that has never been restored is a hope, not a backup.** The local rehearsal on 18.09 (all 34 tables' counts identical) proved the method. The server one proves the archive.

**Object lock**, step 1 of A6, protects against the scariest case: someone with your Scaleway key, or a compromised box, deleting the backups along with the database. With object lock in compliance mode, not even you can delete an archive before its retention ends. That's the point, and the reason the box's own credentials can't undo it.

**After the first rehearsal, write down the time it took.** That number is your RTO, and it's the one a future owner or partner will ask about.

## 8. Things you don't need yet

Read the names so they're familiar. Don't act on any of them in V1:

- **Tuning `shared_buffers` / `work_mem`.** Ubuntu's defaults are conservative and fine for a database this size on 4 GB. Revisit only with a measured slow query that tuning would fix.
- **Connection pooling (PgBouncer).** PHP-FPM's pool caps connections well below Postgres's default limit.
- **Replication / a standby server.** It's an availability feature. UNI's availability target doesn't need one.
- **Major version upgrades.** PG 18 is current on Ubuntu 26.04 LTS, and the next major isn't forced on you for years. When it comes: rehearse on the home server first (`pg_upgradecluster`), never on production first.

## Questions to bring back

1. **Record the end of "edit the create migration"** as a decision dated to the production import, so the old rule in memory and in habits has a visible end. Should it name the expand-then-contract rule as the replacement?
2. **The server restore rehearsal (A6 step 7).** Agree now that its time gets written into the deploy checklist as UNI's RTO?
3. **The events growth check.** A one-line entry in the first post-launch month's journal: actual bytes per row and rows per day, so the 0.5 KB guess gets replaced by a fact.
4. **A read-only database role.** For looking at production, a role with only `SELECT` rights would make the safety habit in §2 structural rather than a thing you have to remember. Worth adding to the Ansible `postgres` role?
