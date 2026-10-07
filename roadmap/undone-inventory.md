---
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

**The direction, 07.10:** launch V1 as soon as it's stable, so search engines start indexing it, and build V2 while it's live. V1 gets the minimum that keeps it stable and truthful; everything else waits for its version. The sections below this one stay as the detail; this is the order.

**The buckets:**
- **Launch**: the site doesn't go public without it.
- **After launch**: V1 stays live without it, but it's work for the live site, not for a later version. Each item has a rule to follow until it's done.
- **V2**: needed before `UNI_OWNER_ACCESS` is flipped, or before accounts and community contributions open.
- **V3**: before anything is sold, or before a second city.

"Cheap now, expensive later" isn't a bucket of its own. It's a reason something moves into Launch, and it's marked **⏳** where it applies.

### Launch

| Item | Why it can't wait |
|---|---|
| **Venues: answer 16 and 17**, then catalogue (best offer first, the 04.10 guardrails) | The only thing that sets the launch date. 16: where the 35 venues live (only you know). 17: what counts as "best" (recommended: at least 3 named NA items across at least 2 categories, from the venue's own menu). 18: recommended no district quota |
| **The launch-load record, rehearsed on the home server** (products → venues → menus) | A wrong order fails silently into `failed_import_rows` on launch day |
| ⏳ **Fault 9: imports and admin adds stamp "today"**, not the menu's check date | Checked 07.10: `RecordMenuItemAction` and the admin "Dodaj produkt" / "Potwierdź" set `confirmed_at` and the venue's freshness date to now. Load menus read in August and every venue reads "Zaktualizowano dziś", every drink "Potwierdzone dziś", and the 90-day clock starts at the import. Fixed before the load it's a small change; after, it means rewriting dates on live rows |
| ⏳ **Nominatim geocoding check** (§F) | If the load geocodes venues through Nominatim, ODbL data is in production from day one. Cheaper to settle before the load than to re-geocode after |
| ⏳ **Search Console verified before the import** (deploy-checklist A9) | The pre-launch baseline can't be recorded afterwards |
| ⏳ **Sign off the seven filter parameter names** (pre-launch-checklist item 1) | Not indexed, but every shared link carries them. Free to rename now, never after |
| **Infrastructure: deploy-checklist rows A and B, and the VPS** (firewall, certificates, Tailscale, first-login script, cron, queue worker, secrets, backups with a rehearsed restore, healthcheck URL, `/admin` on the `admin.` subdomain with allowlist and TOTP) | Section B of this file. Mail is needed too: the disk-space and waiting-claim alarms go to the admin by e-mail |
| **Phase 0** (push both repositories, `gh auth login`, read the first CI run, tag, backup key, SSH config) | The deploy path starts from a green, tagged, pushed release |
| **Privacy policy written from the app, plus the DPAs** (§C; the compliance hour) | It's a published page making legal statements; PostHog is named without a DPA today. The inputs already decided (logs, rate limiting) plus two open wording questions from 03.10: **9** (does `note` get cleared with the e-mail, so "anonymisation" is true) and **14** (recommended: "no session identifier" means none stored in analytics) |

### After launch

| Item | Until it's done |
|---|---|
| **Fault 3: a retired product stays on venue pages**, and **fault 4: deleting a product leaves no offer history** | Don't retire or delete a product that's on a menu; remove it from the menus first |
| **Fault 8: "Oznacz jako sprawdzone" is one unrecorded click** | Renew the badge only after an actual check |
| **Fault 10, admin side**: slug edits (no redirect, so a changed slug loses its ranking), report decisions, role changes, feature flags unrecorded | Don't change a venue's slug once it's live |
| **The 90-day pill vs the 180-day badge**: the explaining sentence is in the FAQ, not yet on the venue page | — |
| **Retire `RealVenueSeeder` and `warsaw-venues.json`** (question 19) | Load through the importers only |
| **Staging** | Its trigger stands: the first migration that could damage real data |

### V2

| Item | Note |
|---|---|
| **Fault 1 and the evidence model** (E1–E3, the badge and ordering rules, provenance on the page: question 15) | Can't occur while the switch is off. Reference: `tech/badges-and-menu.md` |
| **Faults 2, 5, 6, 7 and the owner side of 10** | Every one of them needs an owner in the panel. Q1 (release, not delete, on self-erasure) belongs here |
| **The owner-access checklist** (UNI's Instagram, `UNI_INSTAGRAM_HANDLE`, one request on each path), the soft-delete window on self-erasure, owner-side follow-ups | §E |
| **Which V2 features are built now behind a switch** (the ⭐ question below) | A V2 planning decision |
| **The 01.10 community-driven idea, and 03.10 questions 1–5, 7, 8, 12** | Decided 06.10: contributions stay founder-reviewed. The guest proposal form (question 2) is sorted here, not into Launch: it adds moderation work to the launch weeks |
| **Hard-coded `instagram_clicks`** | Checked 07.10: it is recorded, through the venue page's Instagram redirect (`VenueAnalytics`). It only feeds owner reports, so if anything is left it's a V2 check |
| **The community-reporting record's drift**, silent-flag-weighting | Before accounts |

### V3

| Item | Note |
|---|---|
| **03.10 questions 6, 10, 11**: producer aggregates, the minimum count, open-licensing the data; "Trending Product Alerts" in `business/pricing.md` | Before any data or report is sold |
| **`venue-lists-are-never-sold-as-leads` on the privacy policy** | Nothing sells lists. Write it into the policy at Launch if it costs one sentence; otherwise before the first sale |

**Not in any version:** renaming research files, fixing misdated commute documents, `Growth Strategy.md`, re-running the model test. Housekeeping, done whenever.

---

## ⭐ First, when asked "what needs to be done" — a decision waiting on Paweł

*Sorted into V2 on 07.10; see above.*

**Which V2 features get built now, complete, behind a switch?** On 18.09 the owner panel was built complete behind `UNI_OWNER_ACCESS`, so that V2 is a switch and not a build — which superseded `v2-work-is-not-built-early` *for the owner panel only*. Paweł asked for the rest to be put to him as a table: every V2 feature, what it would take, what it touches, and a recommendation, and he decides one by one.

The source list is [`v2.md`](v2.md) — V2-F1 post-visit confirmation, F2 saves and collections, F3 owner analytics dashboard, F4 community data reporting, F5 tiered badges, F6 owner-managed opening hours, F7 moderated venue images — plus anything the decision records defer to V2 (email verification with self-registration, the soft-delete window on self-service erasure). Check each against the records before recommending: several were narrowed or overtaken since `v2.md` was written (no photos in V1, opening hours, analytics tiers). Until he answers, `v2-work-is-not-built-early` stands for everything but the owner panel.

**Prepared 19.09:** the table, checked against the records, with a recommendation per feature, is §1 of [`next-session-2026-09-20.md`](next-session-2026-09-20.md).

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

Not repeated here; [`deploy-checklist.md`](deploy-checklist.md) is the list and it is run line by line. What matters for planning:

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
grep -nE 'TODO|BLOCKED' docs/roadmap/deploy-checklist.md

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

*See also: [`deploy-checklist.md`](deploy-checklist.md) · [`../compliance/the-compliance-hour.md`](../compliance/the-compliance-hour.md) · [`../decisions/README.md`](../decisions/README.md)*
