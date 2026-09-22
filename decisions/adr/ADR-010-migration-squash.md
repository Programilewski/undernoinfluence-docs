# ADR-010 — Dev-Phase Migration Squash

**Date:** 2026-06-17
**Status:** Decided
**Executed:** 2026-06-17; revisited and re-executed 2026-09-12 (schema dump deleted)
**Area:** Data Model / Infrastructure

---

## Problem

64 migration files had accumulated since April, covering every schema experiment made during development. Many files existed in pairs: a `create_X_table` migration followed weeks later by an `add_column_to_X_table` or a `harden_schema_constraints` migration. Some tables were created and dropped; some constraints were added three different ways before reaching their final form. The practical effect was a messy `database/migrations/` directory where the final schema could only be understood by mentally executing every file in order — not by reading any single file.

This also meant `migrate:fresh` would replay months of dev churn, making it fragile and slow, and the stored schema dump (`pgsql-schema.sql`) encoded an intermediate state rather than the final one.

## Options considered

**Keep the migration history as-is.** Easier in the short term; no risk of introducing new errors. But the history has no value: the project was never in production, no external system depends on any intermediate schema state, and the audit trail is already in git.

**Squash to single create-table migrations (chosen).** Delete all 61 `2026_*` migrations and write 27 clean ones — one per table — each encoding the final schema in a single file. Inline all CHECK constraints, indexes, and FK semantics so the file is the complete specification for that table.

**Squash to a single SQL dump.** Use `schema:dump` as the only artifact. Rejected: a SQL dump is not readable or diffable in the same way; it cannot be understood without running it; and it does not survive future migration additions cleanly.

## Decision

All 61 app-specific migrations from the dev phase were deleted and replaced with 27 clean `create_*` migrations dated 2026-06-17. Each migration creates exactly one table (or one logical group for the core Laravel tables) with its final schema, all constraints, all indexes, and all FK semantics inline. The `database/schema/pgsql-schema.sql` schema dump was deleted and regenerated from the clean baseline. All 403 PHPUnit tests pass; `migrate:fresh --seed` completes in a single clean pass.

## Rules

Every constraint, CHECK expression, partial unique index, and FK semantic that existed in the old migration chain is preserved in the new single-file per table. No constraint was weakened or dropped during the squash.

Category data (names, slugs, sort orders, colours) lives only in `CategorySeeder`, not in migrations. Data in migrations is fragile — it couples schema and seed state and cannot be reset without running the full chain.

CHECK constraints belong in the same file as the table they constrain. There is no longer a separate "harden" migration.

All explicit `$table->index()` calls are placed at the end of the `Schema::create` block, never chained after `->constrained()`. This avoids a PostgreSQL constraint name collision that occurs when Laravel auto-names constraints for multiple FK columns in the same create block.

~~The schema dump must be regenerated with `php artisan schema:dump` any time migrations are squashed or new migrations are added.~~ **Replaced 2026-09-12 — there is no schema dump.** The migrations are the only description of the schema; see the revisit section below.

## What this prevents

A new developer (or a fresh staging deploy) would have to mentally execute 64 migration files to understand the schema — and would likely get the wrong picture because many intermediate states were dropped or renamed. The squashed state means the current schema can be understood by reading 27 files, each covering exactly one table. It also prevents `migrate:fresh` from failing in unexpected ways if a future migration references a column that no longer exists because a drop-table migration was skipped.

## Revisited 2026-09-12 — the dump is gone, and the squash was repeated

**What happened.** The rule above asked for the dump to be regenerated whenever migrations changed. It was not, twice. On 22.06 the dump still held the four `events` PII columns (caught 24.08). On 01.09 `venue_visits` and `user_venue_saves` were removed — `venue_visits` carried a `session_id` that `pii-columns-dropped` forbids — and their migrations were deleted, but the dump was not regenerated. Laravel loads the dump instead of the migrations on any empty database, so from 01.09 to 12.09 **every test ran against both removed tables, and the first production deploy would have created them.** Two tests depended on it without anyone knowing: one inserted into `venue_visits`, and the negative-count test on `venue_stats` inserted columns that no longer existed and passed on "column does not exist" rather than on the constraint.

**Decision.** `database/schema/pgsql-schema.sql` is deleted and not regenerated. With one file per table, replaying 27 migrations takes well under a second, so the dump bought nothing except a second description of the schema that has to be kept in step by hand — the exact thing that failed. The five additive migrations written since the first squash (provenance columns, `venue_stats` long form, the two rollup tables, guest inaccuracy reports, `discovery_type`) were folded into their tables' create files on the same principle this record already states, and the two rollup tables took the free `000014` and `000016` slots, so the sequence is contiguous: 27 files, one per table, Laravel's three framework groups unchanged.

**How it was verified.** A database built from the old chain and one built from the new files were compared column by column, constraint by constraint and index by index: identical, except that the old rename-and-recreate of `venue_stats` had left its primary key named `venue_stats_pkey1`, which the new file names `venue_stats_pkey`. A full `migrate:rollback` drops every table, and migrating again reproduces the same catalogue. The local development database already had this schema; only its `migrations` table rows were re-pointed at the new file names, so nothing in it was rebuilt.

**Guard.** `SchemaHardeningTest::test_fresh_database_is_built_from_migrations_without_removed_tables` fails if any file appears in `database/schema/`, if either removed table exists, or if any of the four `events` identifier columns comes back. It was checked against the old dump and fails on it.

**This record still expires on the same trigger.** Once production holds data, squashing stops: every change after that is a new additive migration, and the create files are never edited again.

## Revisit when

If the project ever reaches a state where production data exists in the database. At that point, the squash approach (migrate:fresh) is no longer safe — new schema changes must be additive migrations that can run against existing data without dropping anything.

---

*See also: [[decisions/product/browse-only-v1]] — the context in which this squash happened (V1 product scope locked, schema stable)*
