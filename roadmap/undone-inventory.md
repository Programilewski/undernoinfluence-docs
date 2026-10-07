---
description: "The backlog: every open item, sorted into Launch, After launch, V2 and V3."
version: 1.1
owner: Paweł Milewski
updated: 2026-10-07
status: living — the single list of what has not been done
---

# What is not done

**Compiled 2026-09-17 by sweeping the sources that record work directly, not by reading the checklists.** That distinction is the reason this file exists: a to-do list assembled from `v1.md`, `user-stories.md` and `next-session.md` inherits their blind spots, and on 17.09 it did — three decided-and-unbuilt pages were missing from it until they were asked about by name.

Everything here is checkable. The last section says how to regenerate the list, so the next sweep is a command rather than an act of memory.

---

## Sorted by when it's needed (07.10)

**The direction, 07.10:** launch V1 as soon as it's stable, so search engines start indexing it, and build V2 while it's live. V1 gets the minimum that keeps it stable and truthful; everything else waits for its version. **This section is the backlog.** The sections below it are the detail, and journals point here rather than copying it.

**The buckets:**
- **Launch**: the site doesn't go public without it.
- **After launch**: V1 stays live without it, but it's work for the live site, not for a later version. Each item has a rule to follow until it's done.
- **V2**: needed before `UNI_OWNER_ACCESS` is flipped, or before accounts and community contributions open.
- **V3**: before anything is sold, or before a second city.

"Cheap now, expensive later" isn't a bucket of its own. It's a reason something moves into Launch, and it's marked **⏳** where it applies.

**Every row says what the item is, and the Source column says where the full discussion lives.** Paths are relative to this workspace.

### Launch

| Item | Why it can't wait | Source |
|---|---|---|
| **The venues: about 30 catalogued, then launch.** Decided 07.10: launch at ~30 rather than 50–60, keep adding after launch; every eligible venue found is added (no "best first" filter); the 35 done so far are in your own file, so no exporter is needed. Before launch, each district to be indexed needs 3 live venues | The only thing that sets the launch date | `ops/adding-a-venue.md` (the procedure); `journals/2026-10-04.md`: Open Questions 16–18, Decision Register 1 and 2 |
| ⏳ **Brand spelling in the products import.** Decided 07.10: brands are created by hand; the import matches them ignoring capitals and refuses unknown ones. To build | A duplicate brand in production gets its own indexed `/marka/` page | `ops/adding-a-venue.md` §8 |
| ⏳ **Classic drinks versus a venue's own creations.** Research is in and assessed (07.10): a house drink keeps its own name and may link to a UNI-curated classic as `exact` or `variant`, so a variant gets both its own name and the classic's listing. Five decisions left: adopt the model, the starting list of 15, the classic page's URL, retiring `virgin_classic`, and whether the link is built before the launch load | The launch data is entered in one shape or the other | `product/rules/Classics and House Drinks.md`, "Still to decide"; `research/results/classics-versus-house-drinks.md` |
| **The launch-load record, rehearsed on the home server.** Products CSV → venues CSV → menus CSV through the admin importers; after that, the production admin is the only source of truth | A wrong order fails silently into `failed_import_rows` on launch day | `journals/2026-10-04.md`: Decision Register 1; Technical Debt Log, "No written plan for how real data reaches production" |
| ⏳ **Imports and admin adds stamp "today", not the menu's check date** (fault 9). `RecordMenuItemAction` and the admin "Dodaj produkt" / "Potwierdź" set `confirmed_at` and the venue's freshness date to now, whatever `checked_at` says | Load menus read in August and every venue reads "Zaktualizowano dziś", every drink "Potwierdzone dziś", and the 90-day clock starts at the import. Small before the load; after, it means rewriting dates on live rows | `tech/change-flows.md`: What looks faulty, row 9; checked in the code 07.10 |
| ⏳ **Nominatim geocoding check.** The admin still offers Nominatim as a fallback geocoder, and its data is ODbL-licensed, which UNI dropped | If the load geocodes through it, ODbL data is in production from day one. Cheaper to settle than to re-geocode | Section F below; the osm-dropped and geocoding-comes-from-the-state-register records |
| ⏳ **Search Console verified before the import** | The pre-launch baseline can't be recorded afterwards | `ops/deploy-checklist.md`, row A9 |
| ⏳ **Sign off the seven discovery filter parameter names** (`kategorie`, `sprawdzone`, `wlasciciel`, `zero`, `aktualnosc`, `sortuj`, `szukaj`) | Not indexed, but every shared link carries them. Free to rename now, never after | `roadmap/pre-launch-checklist.md`, item 1 |
| **Infrastructure.** The VPS (firewall, certificates, Tailscale, first-login script), cron, queue worker, secrets, backups with a rehearsed restore, healthcheck URL, mail (the disk-space and waiting-claim alarms reach the admin by e-mail), `/admin` on the `admin.` subdomain with allowlist and TOTP | The site has to run, be backed up and raise its alarms | `ops/deploy-checklist.md`, every `TODO` row; section B below; `journals/2026-09-30.md` for the 30.09 answers |
| **Phase 0, yours, about an hour.** Push both repositories, `gh auth login`, read the first CI run, tag a release, add the backup public key, `~/.ssh/config` and `ssh-add`, the backup password in the password manager | Deploys start from a green, tagged, pushed release | `journals/2026-10-06.md`: Next Session Backlog (Session 1), item 4 |
| **Privacy policy written from the app, plus the DPAs.** Includes two wording questions: does the inaccuracy report's `note` get cleared along with the e-mail, so that "anonymisation" is true? And does "no session identifier" mean none stored in analytics (recommended), or no session at all? | A published page making legal statements; PostHog is named without a DPA today | Section C below; `compliance/the-compliance-hour.md`; `journals/2026-10-03.md`: Open Questions 9 and 14 |

### After launch

| Item | Rule until it's done | Source |
|---|---|---|
| **Admin "Potwierdź" for house drinks.** Catalogue products have it; house drinks can only be refreshed by editing or re-importing. Decided 07.10 that it's needed | Edit the drink's date and source when you re-check a menu | `tech/badges-and-menu.md`, "What can be done to a menu" |
| **A retired product (`is_active` off) still shows on venue pages, counts in the score and keeps a venue live** (fault 3); **deleting a product writes no offer history** for the venues that carried it (fault 4) | Don't retire or delete a product that's on a menu; remove it from the menus first | `tech/change-flows.md`: What looks faulty, rows 3 and 4; Open Questions Q2, Q3 |
| **"Oznacz jako sprawdzone" renews the Sprawdzona karta badge in one unrecorded click** (fault 8) | Renew it only after an actual check | `tech/change-flows.md`: row 8; Open Questions Q4 |
| **Admin changes nobody records** (fault 10, admin side): slug edits (no redirect, so a changed slug loses its ranking), report decisions, role changes, feature-flag edits | Don't change a venue's slug once it's live | `tech/change-flows.md`: row 10 |
| **The freshness pill (90 days) and the badge (180 days) measure different windows.** Settled as "explain, don't converge"; the explaining sentence is in the FAQ but not on the venue page | — | Section E below |
| **Retire `RealVenueSeeder` and `warsaw-venues.json`**, a stale second import path with outdated category slugs. Recommended yes | Load through the importers only | `journals/2026-10-04.md`: Open Questions 19; Technical Debt Log |
| **Staging** | Built when its trigger arrives: the first migration that could damage real data | Section A below; the staging-is-seeded-never-copied record |

### V2

| Item | Note | Source |
|---|---|---|
| **House drinks: an owner's "Nadal w ofercie", and a limit on how many count.** Decided 07.10: unlimited house drinks are not a V1 problem; owners are never asked for a menu link or a justification, since every owner action is recorded as theirs. The owner's confirmation is built with the evidence model | Needs owners in the panel | `tech/badges-and-menu.md`, "Set by the founder" |
| **Fault 1, reframed 07.10: the ranking lever, and "Sprawdzona karta" redefined.** A daily "Nadal w ofercie" keeps a venue first on every drink page; the badge's target meaning is "the owner manages it", which reverses the what-the-badges-claim record. Then the evidence model (E1–E3), re-read against that | Can't occur while the switch is off | `tech/badges-and-menu.md`, "Set by the founder" and "Open" |
| **Owner-side faults.** Demoting an owner leaves the venue claimed (2); owner self-erasure deletes the venue instead of releasing it (5, and Q1); approving a proposal always creates a new product (6); the owner never hears the outcome of a proposal (7); owner contact edits unrecorded (10) | Every one needs an owner in the panel | `tech/change-flows.md`: What looks faulty, Open Questions Q1 |
| **The owner-access checklist** (UNI's Instagram account, `UNI_INSTAGRAM_HANDLE`, one request on each path), a soft-delete window on self-erasure, owner-side follow-ups | Before the switch | Section E below; `product/features/Owner Verification.md` |
| **Which V2 features are built now, behind a switch** | A planning decision | The ⭐ section below; `briefings/next-session-2026-09-20.md` §1 |
| **Community contributions.** The 01.10 idea of a community-driven UNI, and seven questions from 03.10: what people can do first, when it goes live (incl. the guest proposal form, sorted here rather than Launch: it adds moderation to the launch weeks), sign-in, proposal evidence, brand framing, silent-flag-weighting, direct owner edits with a marker, accountless contribution | Decided 06.10: contributions stay founder-reviewed | `inbox/Some idea from 01.10.2026.md`; `journals/2026-10-03.md`: Open Questions 1–5, 7, 8, 12; `journals/2026-10-06.md` Session 2, Decision Register 2 |
| **The community-reporting record has drifted** from what was decided since | Before accounts | `journals/2026-10-04.md`: Technical Debt Log |
| **"Hard-coded `instagram_clicks`"** | Checked 07.10: it is recorded, through the venue page's Instagram redirect (`VenueAnalytics`). Feeds owner reports only; nothing needed unless a V2 check finds otherwise | `journals/2026-10-06.md`: Technical Debt Log |

### V3

| Item | Note | Source |
|---|---|---|
| **Selling data.** Can producers ever buy aggregates (recommended: category and area only, ≥10 venues, ≥30 events, 90 days' delay)? The minimum count (records say 3 venues, research says 5 then 10)? Open-license the venue data (recommended no)? "Trending Product Alerts" in the pricing doc | Before any data or report is sold | `journals/2026-10-03.md`: Open Questions 6, 10, 11; `business/pricing.md` |
| **The public commitment that venue lists are never sold as leads** | Nothing sells lists. One sentence in the privacy policy at Launch if it fits; otherwise before the first sale | The venue-lists-are-never-sold-as-leads record; section A below |

**Not in any version:** renaming research result files, fixing misdated commute documents, `business/Growth Strategy.md`, re-running the model test. Housekeeping, done whenever. Source: `journals/2026-10-04.md`, Technical Debt Log and Next Session Backlog.

---

## ⭐ First, when asked "what needs to be done" — a decision waiting on Paweł

*Sorted into V2 on 07.10; see above.*

**Which V2 features get built now, complete, behind a switch?** On 18.09 the owner panel was built complete behind `UNI_OWNER_ACCESS`, so that V2 is a switch and not a build — which superseded `v2-work-is-not-built-early` *for the owner panel only*. Paweł asked for the rest to be put to him as a table: every V2 feature, what it would take, what it touches, and a recommendation, and he decides one by one.

The source list is [`v2.md`](v2.md) — V2-F1 post-visit confirmation, F2 saves and collections, F3 owner analytics dashboard, F4 community data reporting, F5 tiered badges, F6 owner-managed opening hours, F7 moderated venue images — plus anything the decision records defer to V2 (email verification with self-registration, the soft-delete window on self-service erasure). Check each against the records before recommending: several were narrowed or overtaken since `v2.md` was written (no photos in V1, opening hours, analytics tiers). Until he answers, `v2-work-is-not-built-early` stands for everything but the owner panel.

**Prepared 19.09:** the table, checked against the records, with a recommendation per feature, is §1 of [`next-session-2026-09-20.md`](../briefings/next-session-2026-09-20.md).

## A. Decided and not built

The canonical list: decision records whose `Executed:` line is not a date. Twelve of them.

| Record | State | What is actually left |
|---|---|---|
| `secrets-never-in-tracked-files` | **executed 22.09** | Password rotated and out of the tracked tree (A1, A4), and the pre-commit scanner written, self-tested and live: `scripts/check-secrets.mjs`. Left only `git config core.hooksPath scripts/githooks` in each new clone — B4, and a deploy-checklist line |
| `research-files-out-of-the-repo` | **executed 22.09** | Done in session A, step A3. Both spreadsheets and all four `reference/` subdirectories are at `~/uni-reference/`, out of git and out of Syncthing; ten conflict copies deleted. [[tech/reference-material]] records what went where |
| `transactional-email-provider` | **no** | Scaleway TEM decided 29.06, never configured. Deploy checklist B2, B3 |
| `backup-storage-provider` | **partly** | Job, encryption guard, 7 + 4 rotation, schedule and monitor built 18.09; restore rehearsed on the laptop. Left: object lock + its default retention + lifecycle rules on the bucket, the `BACKUP_*` values in Ploi, the first upload from the server, a restore from a real archive. Deploy checklist A6 |
| `staging-is-seeded-never-copied` | **no** | Staging does not exist, and 22.09 gave it a trigger rather than a date: the first migration that could damage real data, i.e. once production has venues worth protecting. Until then the home server catches the same class of problem for nothing. [[decisions/product/three-environments-and-what-each-is-for]] |
| `admin-access-is-three-layers` | **partly** | Panel closed; nginx allowlist, TOTP and the failure counter are deploy and pre-launch steps |
| `search-presence-and-impression-are-different-numbers` | **partly** | Match and presence recorded; impression still PostHog-only |
| `venue-lists-are-never-sold-as-leads` | **partly** | Nothing sells lists; the public commitment is not on the privacy policy |
| `one-ingestion-path-for-menu-data` | **partly** | Holds for every path that exists; `pos_sync` reserved and unwritten, deliberately |
| `the-alarm-rings-from-outside-the-building` | dormant | Code built 14.09; goes live when `UNI_HEALTHCHECK_PING_URL` is set. Checklist B9 |
| ADR-006 `No Reviews V1` | **partly** | Product-level "not available" flagging never built; the venue-level inaccuracy report took its place. Effectively closed — worth saying so in the record |
| ADR-002 `Venue Seeding` | overtaken | The register never entered the app; `venue-data-acquisition-flow` supersedes it |

*Two rows that were records disagreeing with reality — ADR-007 and `hero-live-social-proof` — were written up on 18.09 and have left this table.*

## B. The machine — deploy checklist

Not repeated here; [`deploy-checklist.md`](../ops/deploy-checklist.md) is the list and it is run line by line. What matters for planning:

- **Eight rows still read `BLOCKED` on a hosting decision made on 14.09.** They are `TODO`. A note at the top of that file says so; the row-by-row rewrite is still owed.
- **A1 — no `schedule:run` cron on any machine this project has lived on.** `crontab -l` returns *no crontab for bub*. Nothing scheduled has ever run.
- **A6 — no backups, and no restore ever rehearsed into an empty database.** Art. 32(1)(d) wants the restore *tested*.
- A2 queue worker · A7 secrets on the box · A8 (rewrite: the box is Ubuntu, so AppArmor, not SELinux) · A9 Search Console **before** the import, for a baseline · A10 first admin · A11/A12 two databases, two roles, staging seeded · B2/B2a/B3 mail and the Polish-inbox test · B9 healthcheck URL · C4 first cached run · C6 nginx cache headers · D1 HTTPS confirmation · E5 privacy policy names the host.

## C. Compliance

[`../compliance/the-compliance-hour.md`](../compliance/the-compliance-hour.md) — nine items, about 75 minutes, **deferred five times and still without a date.** Two of them close gaps that are live on a published page: PostHog is named in the privacy policy with no DPA, and no host, panel operator or storage provider is disclosed.

**Inputs for the privacy policy, decided 06.10** — the policy is a draft and gets written from the app's state, never the other way round:

- **nginx access and error logs: kept and disclosed, briefly.** Ubuntu's default stays (the Ansible nginx role sets no `access_log`): full IP, time, page, referrer and user agent per request, rotated daily, about 14 days. Disclosed in one or two sentences, only as much as the law requires: server logs including the IP address, for security and diagnosing faults, legitimate interest, about 14 days. No detailed description.
- **Rate limiting: IP processed for minutes.** Rate-limiter keys are an MD5 of the IP (or IPv6 /64) in the `cache` table; expired rows are pruned every five minutes since 06.10. Disclosed the same way: abuse prevention, legitimate interest, minutes.

Also open, and not in that file: `ropa.md` carries **43 `TODO`s** while the code enforces four real retention windows, and the three registers (`vendors/`, `dpa/`, `incidents/`) are still literal placeholder rows reading "Hosting provider / TODO / TBD".

## D. Repository — **closed 22.09.2026**

**Done.** The migration ran in two sittings and every one of its sixteen steps is executed. `Programilewski/undernoinfluence` holds the application — 687 files, 5.3 MB, one initial commit, no credential, no journals. `Programilewski/undernoinfluence-docs` holds this vault, 410 files, its object store at `~/uni-docs.git` outside Syncthing. `Programilewski/uni-archive` holds the 213-commit history, private and archived, with a second copy at `../undernoinfluence-legacy.git`.

The four things this section tracked are all resolved: the credential is rotated and out of every tracked file, the 93 MB of research is at `~/uni-reference/` outside git and Syncthing, all 76 real commit ids became dates and descriptions before the squash, and a pre-commit scanner now refuses any commit that would add a credential. See [[tech/repository-migration]] for what each step actually involved, including the three places the plan turned out to be wrong.

**Left over, and small:** `core.hooksPath` is set in these two clones and nowhere else — deploy-checklist A13. [`../tech/repository-migration.md`](../tech/repository-migration.md).

## E. Product — what a visitor would notice

| Gap | Where it stands |
|---|---|
| **Owner panel: no e-mail verification, 2FA optional** | Optional two-factor sign-in built 18.09 (never required, by decision). E-mail verification belongs with self-registration, which does not exist — owners are admin-created and their e-mail is read-only |
| **Self-service venue erasure needs only the password** | V2. Worth a soft-delete window before real owners exist |
| **Owner access cannot open until the owner check's checklist is done** (19.09) | The check is built. Left: UNI's Instagram account and `UNI_INSTAGRAM_HANDLE`, mail and a queue worker on the server, one request on each path. `product/features/Owner Verification.md` |
| **Owner-side follow-ups, each with its own trigger** (19.09) | Disputes over a managed venue are handled by hand; Instagram codes are matched by eye; chains are recorded one venue at a time; owners cannot add managers. Each record names when to build it |
| **No history of a venue's own record** | `VenueObserver` records four disputable changes since 16.09; the rest of the record is still timestamps only |
| **Freshness pill and "Sprawdzona karta" measure different windows** (90 vs 180 days) | Settled as *explain, do not converge*; the explaining sentence is written into the FAQ but not yet on the venue page |
| **Panel flow faults found 06.10** (`tech/change-flows.md`, findings 2–10; finding 1 is being worked on) | Each one is described there with a likely fix, taken one at a time. **2** demoting an owner in the user form leaves their venue claimed, and there is no way to take a venue from an owner short of deleting the account · **3** a retired product (`is_active` off) still shows on venue pages, counts in the score and keeps a venue live, and can still be attached · **4** deleting a product writes no offer history for the venues that carried it · **5** owner self-erasure deletes the venue listing outright instead of releasing it (Q1) · **6** approving a proposal always creates a new product, never links an existing one · **7** the owner is never told the outcome of a proposal · **8** "Oznacz jako sprawdzone" renews the badge in one unrecorded click · **9** admin attach marks a venue fresh "today" even for a menu read months ago · **10** owner contact edits, report decisions, feature flags, role changes, slug edits and claim edits are unrecorded |

## F. Small and cheap

- **Verify the Nominatim geocoding in the admin panel** (added 06.10). It is still offered in the venue resource as a fallback provider, and every Nominatim response carries "Data © OpenStreetMap contributors, ODbL 1.0". Check what it writes and where against the osm-dropped and geocoding-comes-from-the-state-register records before deciding whether it stays. Not discussed yet.

- **`.env` runs `SESSION_DRIVER=database`** while the decision record and `.env.example` both say `file`. Local drift only — production built from the example is correct — but it means 27 rows of `ip_address` are sitting in the local database against a record saying nothing stores one.
- **No code-level debt markers at all** — zero TODO/FIXME/HACK across `app/`, `resources/`, `config/`, `routes/`, `database/`, `tests/`. The debt in this project lives in documents, not in the code.

## G. Closed

Recorded so the next sweep does not re-raise them.

**2026-09-18.** The consent panel asks and no longer blocks — overlay, scroll lock and `aria-modal` removed per P38, guarded by `ConsentPanelTest`, `npm run check:consent` and `npm run check:render` · the 17.09 work committed (four commits, 868 tests) · `home-mesh.blade.php` deleted · the showcase closed on v2, v1 and `UNI_HOME_SHOWCASE` deleted · every count agrees with its number (`PolishCountsTest`), the English pluralizer gone · `products.image_path` and its upload removed · 15 Syncthing conflict copies and a May orphan photo deleted; 10 research `.mhtml` conflict copies kept to travel with the research · ADR-007 and `faceless-brand` superseded by faceless Instagram + TikTok, `hero-live-social-proof` marked superseded (15.08) · a chain imports as one venue per address, slugs set once from name + street, the importer takes all six venue types · the owner panel complete behind `UNI_OWNER_ACCESS`: password reset and set-password links, optional 2FA, several venues per owner, the privacy policy following the switch · a claim request form on the venue page, behind the same switch — approval makes or finds the owner's account.

**2026-09-17.** `/kontakt`, `/faq`, `/suchy-styczen` and `/slownik` built · brand pages and drink pages built, with venue pages linking to them · the venue-type filter built · the discovery tile comparison closed on the lighter card, the loser deleted · reserved top-level paths guarded · `brands.slug` added.

---

## How to regenerate this list

```bash
# A — decided and not built. The canonical source.
grep -rn '^\*\*Executed:\*\*' docs/decisions --include=*.md \
  | grep -viE 'yes|standing rule|standing assessment|superseded|not applicable|\*\* *202[0-9]-'

# B — the machine.
grep -nE 'TODO|BLOCKED' docs/ops/deploy-checklist.md

# C — compliance.
grep -c 'TODO' docs/compliance/ropa.md
grep -rn 'TBD' docs/compliance/vendors/README.md

# F — code-level debt, and skipped tests.
grep -rnE '(TODO|FIXME|HACK|XXX|@todo)' app/ resources/ config/ routes/ database/ tests/
grep -rn 'markTestSkipped\|markTestIncomplete' tests/

# Pages promised in the record but missing from the router.
grep -rhoE '`/[a-z0-9-]{3,30}`' docs/roadmap docs/decisions docs/business --include=*.md \
  | tr -d '`' | sort -u
php artisan route:list --except-vendor --method=GET
```

**What this sweep does not catch**, and what still needs a person: work described only in prose, a record whose `Executed:` line is a date but whose code was later reverted, and anything nobody ever wrote down. The second of those is the reason `hero-live-social-proof` sat wrong for weeks.

---

*See also: [`deploy-checklist.md`](../ops/deploy-checklist.md) · [`../compliance/the-compliance-hour.md`](../compliance/the-compliance-hour.md) · [`../decisions/README.md`](../decisions/README.md)*
