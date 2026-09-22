---
version: 1.0
owner: Paweł Milewski
updated: 2026-08-27
status: approved
---

# New notes — 25 to 27 August 2026

Three sessions in three days produced ten new documents and rewrote eleven existing ones. This
page is the reading order. It covers one window and then goes stale: `README.md` is the permanent
map of the vault, this is the temporary one. When the next batch of notes lands, replace the
contents or move it to `archive/`.

Nothing listed here is committed yet — every file below is untracked or modified in the working
tree.

## If you read only three things

1. **[[roadmap/audit-2026-08-27]]** — every map in the app currently renders "API KEY REQUIRED"
   across every tile. It has been true since CARTO changed its terms, and nobody noticed because
   nothing is public.
2. **[[tech/migration-lessons]]** — the nine rules the Fedora migration produced. Machine-agnostic;
   read before any environment move.
3. **[[tech/going-to-production]]** — the nine things a laptop-to-laptop move could not test, each
   of which starts mattering on the first real server.

## The ten new notes

### Technical — what the migration taught

| Note | What it says | Why it matters |
|---|---|---|
| [[tech/migration-lessons]] | The nine rules the 25.08 Ubuntu → Fedora move produced, with the diagnosis path for each. The username changed and nothing broke because the uid did not; every `/home/pawel` path did break, and all of them were in documentation | A migration stopped being an adventure and became a procedure. The procedure was corrected five times by contact with reality |
| [[tech/going-to-production]] | The same rules applied to a preprod and a production server, plus nine things a laptop move never tested: a real web server, SELinux, split file ownership, config caching, `public/hot`, the scheduler as a service, restore-half of backup, a production database with zero venues, the public internet | The dress rehearsal was free. This is the list of what the rehearsal did not cover |

### Decisions — four new records

| Record | Decision |
|---|---|
| [[decisions/product/pull-never-push-when-migrating]] | The destination does the copying, while it is running, from a source it cannot modify. Prevents files arriving without the security labels the destination expects, and ownership being guessed rather than assigned |
| [[decisions/product/no-machine-addresses-in-the-repo]] | No host, IP or machine path is committed. The dev server defaults to `localhost`; the tailnet is an explicit named mode. Prevents the failure that looks like nothing at all — a fast, correct page pointing at a machine that no longer exists |
| [[decisions/product/one-vendor-per-system-library]] | One supplier per system component, recorded per environment; distribution and vendor repositories are never mixed. Produced by the `libpq` incident, which took two wrong diagnoses to find |
| [[decisions/product/vector-basemap-on-openfreemap]] | The maps move to MapLibre GL JS on OpenFreeMap vector tiles, now, with no stopgap CARTO key. Two to four days. **Supersedes [[decisions/product/dark-map-tile-provider]]**, whose premise — CARTO is free, keyless and stable — no longer holds |

### Audit

| Note | What it covers |
|---|---|
| [[roadmap/audit-2026-08-27]] | The 27.08 phone note checked line by line against running code, the database, `.env` and the vendors' own pages. Contains the feature-to-version mapping you asked for, a verdict on each of the eight `INFRA-01`…`INFRA-08` records written by the other model — two of which contradict decisions already in force, one of which describes technology this project does not use — plus a verified cost comparison and what the note missed entirely |

### Journals

| Note | Session |
|---|---|
| [[journals/2026-08-26]] | Drawing the lessons out of the migration. Two new tech documents, three decision records, and six corrections to documents that were saying untrue things about the code — one of which changes the urgency of a top debt item in your favour |
| [[journals/2026-08-27]] | The phone note and eight decisions written by another model. No code changed, by instruction. The map discovery came out of this one |

### Raw capture

| Note | |
|---|---|
| [[Phone notes/27.08]] | Your own note: the feature-mapping request plus the pasted infrastructure log. The source the 27.08 audit works from. Not a source of truth — decisions move out of here into `decisions/` |

## Two findings that change the launch list

**The scheduler has never run, so nothing has been pruned.** Four documents claimed
`analytics:prune-events` was destroying analytics history daily. There is no cron entry on this
machine and there was none on the old one. The `events` table holds 482 rows, oldest 2026-06-17.
That turns a bleed into a **deadline of 2026-09-15** — switching the scheduler on and fixing the
rollup are one piece of work, in that order.

**Every map is watermarked.** All three tile styles were fetched and rendered during the 27.08
session. It is now item 11 on [[roadmap/pre-launch-checklist]], and the first code task that
genuinely blocks launch. Item 12 is its neighbour: the privacy policy names two data recipients
out of at least five.

## The eleven notes that changed

| Note | Change |
|---|---|
| [[roadmap/pre-launch-checklist]] | Two new items — the watermarked maps (11) and the incomplete recipient list (12). The event-pruning item rewritten from "bleeding" to "armed, fires 15.09" |
| [[roadmap/v1]] | New **exposure tiers** table answering the feature-mapping request: what is exposed at launch, what is built but deliberately dark, what is V2, what is V3. 465 tests re-run and verified on 27.08 |
| [[roadmap/next-session]] | The map migration added as the blocking code task; pruning corrected to a deadline |
| [[roadmap/audit-2026-08-24]] | The "destroys data every day" claim corrected in place |
| [[decisions/README]] | Four new records indexed; `dark-map-tile-provider` marked superseded |
| [[decisions/product/dark-map-tile-provider]] | Marked **Superseded 27.08**, with the reason and the re-checked fallback (Stadia: no commercial use free, $20/month paid) |
| [[tech/stack]] | Leaflet marked as being replaced; bundle cost stated (~42 KB → ~200 KB+ gzipped, clustering dropped) |
| [[tech/dependencies]] | Same, on the dependency inventory |
| [[tech/README]] | The three new tech documents indexed |
| [[tech/migrating-to-a-new-machine]] | Banner: executed 25.08 and corrected five times by the doing. The only document here proven by use. `/home/pawel` paths flagged historical; real end-state versions recorded (PHP 8.5.9, PostgreSQL 18.4) |
| [[product/spec.html]] | Two corrections: the retired machine's tailnet address replaced with `localhost`, and the "63 real active venues" claim corrected — 67 rows, of which 2 are canaries and 65 are local-only fixtures. A production seed produces no venues at all |
