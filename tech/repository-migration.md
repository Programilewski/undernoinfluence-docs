---
version: 5.1
owner: Paweł Milewski
updated: 2026-09-22
status: **session A executed 22.09.2026**. Revised 22.09 (5.1): B1 moves the old `.git` aside rather than deleting it, B4's scanner now exists, and the commute-document naming is applied to the whole folder — all ten steps done, with three deviations recorded below. Session B is not started. Revised 22.09: the Syncthing gate is replaced by `--separate-git-dir`, which removes the per-device configuration the gate depended on.
---

# Migrating to a fresh repository

Decided on 31.08: UNI moves to a **new repository with a single initial commit**, rather than rewriting the history of the existing one. The old repository is archived, kept private, and its address is recorded here so the history stays findable.

**Revised 20.09: it is now two repositories, not one.** The application repository is the thing that deploys and the thing that can be handed to a developer; the workspace repository is where the thinking lives. Version 2.0's scope decision — "`docs/` stays in the same repository" — is reversed, and the reasoning for the reversal is below.

**Revised 21.09: it is two sittings, not one.** Session A is cleanup and commits normally to the repository that exists today; session B creates the two repositories and cannot be interrupted. The split is below. The sweep of cited commit ids runs in session A, before either squash, because it cannot be redone after.

## What changed in this revision

**Two repositories, not one.** Version 2.0 kept `docs/` with the application because the journals reference application file paths on nearly every page. That is true and it is not the deciding consideration. The deciding consideration is what the repository *is*: a repository containing only the application can be handed to a developer, deployed, or audited without being read first; one that also contains journals, phone notes, pricing research and growth strategy cannot. The founder's words on 20.09: *"If I had to share the repo with someone, they'd see the docs folder with decisions, journals etc. If I keep a clean repo of the app code itself, I can share it, it goes cleanly to prod too."*

**Every step of version 2.0 was verified against the tree** rather than assumed. Step 0 is done. Steps 1, 3, 4 and 6 have not been started. Step 5 is half done — `.gitignore` already covers `.env.testing`, which version 2.0 warned it did not. Step 2's history sweep was stale by 74 commits and has been re-run.

**Step 4 is larger than recorded.** Version 2.0 counted 389 hex strings in 32 files. Today there are 195 unique seven-character candidates across 50 markdown files, and **76 of them resolve to real commits** in this history. Those 76 are the ones that break.

**The tree was classified, not only measured.** 1180 tracked files, 70.4 MB, in five sections. The weight is not "documentation" — it is three directories. Stripped of them, the entire documentation tree is 5.8 MB of plain text, less than the published Filament assets that have to ship.

**Four things version 2.0 did not know about:** `.understand-anything/` (2.1 MB of dead plugin output), the agent directories triplicated by `boost.json`, fourteen files in the application that cite documentation paths, and the absence of the pre-commit secret scanner that `secrets-never-in-tracked-files` says enforces the rule.

## Verified state, 20.09

| v2.0 step | Claim | Verified today |
|---|---|---|
| 0 | Push `v1` first | **Done.** `git rev-list --count origin/v1..v1` returns 0. 202 commits, up from 128 on 08.09 |
| 1 | Rotate the Postgres password | **Not done.** `phpunit.xml:44` still holds the live value, byte-identical to `.env` |
| 2 | Sweep the history | **Re-run 20.09 and clean.** The 74 commits added since 08.09 contain no credential. The only matches are vendored skill placeholders, `CreateAdmin.php:55` (an interactive prompt, no value) and a dummy passphrase in its test |
| 3 | Credential out of three documentation files | **Not done.** All three still contain it |
| 4 | Replace cited commit ids | **Not done.** 195 candidates across 50 files; **76 resolve to real commits** |
| 5 | `phpunit.xml` → `.env.testing` | **Half done.** `.gitignore:6` already covers `.env.testing`; the password is still in `phpunit.xml` |
| 6 | Decide what leaves the tree | **Not done.** Spreadsheets still tracked at the root; `docs/reference/` still 20 files and 52.2 MB |
| — | The application itself | **1038 tests pass**, 3023 assertions, 30.5s. All migrations ran, 62 routes resolve, both lock files tracked |

The code is ready. The repository is not.

## The section inventory

| Section | Files | Size | Destination |
|---|---|---|---|
| Application code — `app/ bootstrap/ config/ database/ routes/ resources/ tests/ lang/` | 508 | 2.03 MB | Application repository |
| Public assets — `public/` | 58 | 4.50 MB | Application repository. 4.0 MB of it is published Filament assets, regenerable with `php artisan filament:assets` |
| Ops config — `supervisor/ scripts/` | 5 | 0.02 MB | Application repository |
| Root config — `composer.*`, `package*.json`, `vite.config.js`, `artisan`, `phpunit.xml`, `.env.example`, linters | 30 | 0.55 MB | Application repository |
| `.ai/rules/` | 6 | 0.02 MB | **Application repository.** These map file globs to settled engineering decisions; a developer, or their agent, writes code that violates them without this file |
| `.claude/ .cursor/ .agents/` | 113 | 0.58 MB | Workspace repository. Three copies because `boost.json` lists three agents, and all three regenerate — kept (Q3). `GEMINI.md` and `.agents/skills/project-journal/` were deleted 21.09: no generator maintains either |
| `.understand-anything/` | 5 | 2.10 MB | **Deleted.** Dead plugin, not in use |
| `docs/` | 452 | 59.9 MB | Workspace repository, minus what leaves git entirely (below) |
| `uni_filtered_venues.csv` / `.xlsx` | 2 | 0.54 MB | Out of git — decided 24.08, never executed. OSM-derived, and carries a `phone` column across 2378 rows |

`docs/` opened up, since the destination is not uniform:

| Subdirectory | Size | Ages with the code? |
|---|---|---|
| `reference/` | 52.2 MB | No — third-party NIQ/IWSR PDFs and screenshots, plus two EU legal texts |
| `journals/` | 2.63 MB | No — the work record |
| `archive/` | 1.96 MB | No — old spec versions and two screenshots at 947 KB |
| `roadmap/` | 1.13 MB | No |
| `product/` | 0.60 MB | Yes |
| `decisions/` | 0.56 MB | Yes — 170 records |
| `business/ brand/ learning/ Phone notes/` | 0.71 MB | No |
| `tech/ compliance/` | 0.19 MB | Yes — `schema.md` and `ropa.md` are cited from the application |

## The two repositories

One working directory, two repositories. **Nothing about where you edit a file changes** — `docs/` stays at `/var/www/undernoinfluence/docs`, stays an Obsidian vault, stays synced. The only change is which git repository tracks it, and that the application repository cannot see it at all.

```
/var/www/undernoinfluence/              ◀── REPO 1: THE APPLICATION  (private, ~3.7 MB)
│                                            deploys to prod · shareable with a developer
├── app/ bootstrap/ config/ database/    tracked
├── routes/ resources/ tests/ lang/      tracked
├── public/                              tracked, MINUS public/{js,css,fonts}/filament  (Q4)
├── supervisor/ scripts/                 tracked — uni-worker.conf, the 4 node checks
├── database/schema.md                   ◀── moved here from docs/tech/  (Q1)
├── .ai/rules/  CLAUDE.md  AGENTS.md     tracked — the contributing guide
├── .cursor/  .agents/                   tracked — Boost-generated, kept  (Q3)
│
├── .gitignore ──────────────────────────┐  contains  /docs/
│                                        │
└── docs/   ◀══ THE OBSIDIAN VAULT ══════┘  invisible to repo 1
    │            Syncthing folder gzlwh-sf7go → homeserver + phone
    │
    ├── .git/                            ◀── REPO 2: THE WORKSPACE  (private, ~8 MB)
    │                                         ⚠ MUST be in Ignore Patterns on ALL THREE
    │                                            devices before `git init` runs — see below
    ├── CLAUDE.md                        the mission, the journal + roadmap rules
    ├── journals/   2.63 MB              tracked by repo 2
    ├── decisions/  0.56 MB              tracked by repo 2 — 170 records + 11 ADRs
    ├── roadmap/    1.13 MB              tracked by repo 2
    ├── product/    0.60 MB              tracked by repo 2
    ├── tech/ compliance/  0.19 MB       tracked by repo 2  (minus schema.md)
    ├── business/ brand/ learning/ Phone notes/   0.71 MB
    ├── archive/    1.96 MB
    │
    └── reference/                       ◀── LEAVES the vault entirely  (Q2)
        ├── research/    91 MB    → ~/uni-reference/research/ on the laptop.
        │                           Out of git AND out of Syncthing.
        ├── legal/      1.1 MB    → same. GDPR + ePrivacy PDFs
        ├── gus-api/    1.0 MB    → same
        └── nominatim/   68 KB    → same
```

**Three containers, and they are independent.** *Git* decides what a developer and the server get. *Syncthing* decides what the phone and the homeserver get. *The laptop filesystem* is where something can sit in neither. `reference/` is the only thing that ends up in the third.

**Sizes after the split:** application repository roughly 7 MB, or 3.7 MB if the published Filament assets are gitignored and regenerated on deploy. Workspace repository roughly 8 MB, or 60 MB if the reference material stays in it (open question 2).

**The one thing Syncthing must be told first — added 21.09, and version 3.0 had this wrong.** Version 3.0 said *"Obsidian and Syncthing are untouched."* The vault path does not move, which is the true half. But creating `docs/.git` puts a git object store inside a directory that Syncthing replicates continuously to the homeserver and the phone, and a git object store replicated file-by-file by three writers with no locking is a corrupted git object store.

`docs/.stignore` already carries the rule, and its comment was written in anticipation of exactly this:

```
// Git metadata. docs/ has none today (the repo root does), but a nested repo
// here would otherwise be replicated file-by-file and corrupted.
.git
```

**That file governs the laptop only.** [`obsidian-sync.md`](obsidian-sync.md) records that *"Syncthing does not sync `.stignore` between devices. Ignore patterns are per-device configuration… The homeserver and the phone each need the same patterns entered by hand (folder → Ignore Patterns)."* So the protection exists on one of three machines and has never been tested against a directory that actually contains `.git`.

**Better than the gate, found 22.09: put the object store outside the synced folder entirely.**

```bash
cd /var/www/undernoinfluence
git init --separate-git-dir="$HOME/uni-docs.git" docs
```

What this leaves inside `docs/` is not a directory but a **117-byte text file** called `.git`, whose entire contents are one line — `gitdir: /home/bub/uni-docs.git`. The objects, refs, index and packfiles live at `~/uni-docs.git`, which Syncthing has never heard of. Git behaves exactly as normal from inside `docs/`: `git status`, `git log`, `git commit`, all of it. Verified on 22.09 in a scratch directory before this was written.

**Why this is better than an ignore pattern.** The pattern has to be typed by hand on three devices, is not synced between them, and is the kind of thing that is forgotten on the fourth device in a year's time. `--separate-git-dir` needs no configuration anywhere: there is no object store in the folder to replicate, so there is nothing for Syncthing to corrupt. And if the 117-byte pointer file does replicate, it is harmless — the phone gets a text file naming a path that does not exist there, and nothing on the phone runs git.

**Keep the ignore pattern as well**, because two cheap defences are better than one and because the file is noise on the other devices. But it is no longer the thing the whole split depends on.

**Gate, reduced:** before `git init`, confirm `.git` is in the Ignore Patterns on the homeserver and on the phone. One minute. With `--separate-git-dir` this is tidiness rather than the last line of defence.

**Production never sees the workspace.** No sparse checkout, no deploy-script exclusion, no `export-ignore` — the directory simply is not in the repository that the server clones. Note in passing that the `export-ignore` lines already in `.gitattributes` do nothing today, because deployment pulls rather than running `git archive`.

**One hazard, worth knowing in advance.** `docs/` will be an ignored directory in the application repository that contains its own history. `git clean -xfd` skips a nested repository and prints a warning; `git clean -xffd` — with `-f` twice — deletes it, history included. Never run the second form in this working directory. The alternative, if that feels too sharp, is to keep the workspace as a sibling directory and symlink it in, at the cost of changing the Syncthing path on the laptop.

## What breaks in the split, and the fix

**Fourteen files cite documentation paths** — thirteen in application code, tests and config, and one in `.ai/rules/notifications.md`. The rule against doing it again is recorded at `.ai/rules/app.md` (21.09). Nine of them point at `docs/product/features/Owner Verification.md`; the others at `docs/compliance/ropa.md`, `docs/tech/analytics.md`, `docs/decisions/product/owner-panel-ships-behind-one-switch.md`, and — the one that matters most — `database/seeders/CanarySeeder.php` points at `docs/journals/README.md`. A seeder that runs on production should not name the journal index. The fix is to drop the path and keep the name: "see the Owner Verification feature record" reads the same and cannot rot.

**The same-commit rule for `schema.md` cannot survive two repositories.** CLAUDE.md requires that a migration adding, dropping or renaming a column updates `docs/tech/schema.md` in the same commit. Across two repositories that becomes two commits with no way to prove one was not skipped. The fix is to move `schema.md` (31 KB, 33 tables, 336 columns) into the application repository as `database/schema.md`, beside the migrations that change it — see open question 1.

**CLAUDE.md is two documents in one file.** The code conventions belong to the application repository; the mission, the database rule, the roadmap-document rules and the journal rules belong to the workspace, in a `CLAUDE.md` at the workspace root, which Claude Code picks up when work happens there.

## The credential

One value, the live `undernoinfluence_user` Postgres password, in four tracked files. `.env` holds it too and is correctly untracked. After the split the exposure divides: one file in the application repository, three in the workspace.

| File | In the repository since | Lands in |
|---|---|---|
| `phpunit.xml:44` | 29 April | Application repository |
| `docs/journals/2026-05-15_3.md` | 12 August (content from 15 May) | Workspace repository |
| `docs/product/spec.html` | 12 August | Workspace repository |
| `docs/archive/spec-versions/interactive_v1_feature_spec_SSOT_29_06.html` | 12 August | Workspace repository |

`.env.example` is clean — every non-empty value was read on 20.09 and none is secret. The value first entered history through `.env.example` in the first commit of 5 April, which is why a rewrite would touch the whole graph and a fresh repository is the cheaper operation.

**Both squashes must happen after the scrub, not before.** The workspace repository's first commit would otherwise start life with the password in three files, which is the exact mistake this migration exists to correct.

**On exposure:** the repository is private with a single collaborator. This is hygiene, not an incident. Rotate because it is free to rotate.

**Still missing:** `secrets-never-in-tracked-files` says an automatic check refuses commits containing a credential. There is no such hook — no `.git/hooks/pre-commit`, no `core.hooksPath`, nothing tracked. Two fresh repositories are two chances to make the same mistake on day one, so installing it belongs in this session rather than after it.

## Two sittings, not one — settled 21.09

Paweł, 21.09: *"let us focus on fixing everything else in that session so that later we can solely focus on the new repo."*

So the thirteen steps split at the point where the old repository stops being the source of truth. **Session A changes files and commits them normally, to the repository that exists today.** Nothing is irreversible, nothing is created, and if it is interrupted halfway the project is simply a bit tidier than it was. **Session B creates the two repositories and cannot be done in pieces.**

### Session A — the cleanup. **Executed 22.09.2026**

All ten steps are done. **1038 tests pass** (3023 assertions), Pint clean. Three things turned out differently from the plan, and they are marked **(deviation)** below.

**A1. Rotate the Postgres password. ✅** Done by Paweł. **(deviation)** The rotation left `~/.pgpass` holding the dead value, so `psql` and any GUI client using that file failed while the application itself worked from `.env`. Updated on 22.09; worth remembering that a rotation has more than one consumer.

*Original step:* `ALTER USER undernoinfluence_user WITH PASSWORD …`, then `.env` and, until A4 moves it, `phpunit.xml`. Run the suite to confirm both databases still connect. First, so the old value is dead before anything else is touched.

**A2. Delete what is dead. ✅**

*Original step:* `.understand-anything/` (2.1 MB, dead plugin) and `docs/reference/research/safetyline.local_wp-admin_site-editor.php.png` (3 MB, another project's WordPress admin). **Done 21.09:** `GEMINI.md` and `.agents/skills/project-journal/` — the two agent files no generator maintains (Q3).

**A3. Move what leaves git — and, for `reference/`, what leaves Syncthing too. ✅** The vault went from 102 MB to 9.4 MB. **(deviation)** The plan said the ten Syncthing conflict copies are "pairs byte-identical"; they are identical to *each other* but not to the originals, which are later re-saves of the same pages. Each was checked against its original before deletion and every one had one, so all ten went. [[tech/reference-material]] records what moved where.

*Original step:* The ten Syncthing conflict copies are deleted outright (41.5 MB, five files saved twice, pairs byte-identical). `docs/reference/` moves out of the vault to `~/uni-reference/` on the laptop — out of git *and* out of Syncthing (Q2). `uni_filtered_venues.csv` and `.xlsx` leave the tree, executing the 24.08 decision. Each departure leaves a note in the workspace saying what exists and where.

**A4. Take the credential out of the working tree. ✅** **(deviation)** No `.env.testing` was needed. Both databases use the same role, so removing the `DB_PASSWORD` line from `phpunit.xml` is enough — the value comes from `.env`, while `phpunit.xml` keeps `DB_DATABASE=undernoinfluence_test`, so a clone with no `.env.testing` still runs tests against the test database. One fewer file to create on a fresh machine. The three documentation copies became `[rotated 22.09.2026]` placeholders.

*Original step:* `DB_PASSWORD` out of `phpunit.xml` into a gitignored `.env.testing`; a placeholder in place of the value in the three documentation files, not a deletion — the journal line is a record of what was configured that day and should still read as one. Run the suite. Then `git grep` for the value across the whole tree and expect nothing.

**A5. Sweep the cited commit ids. ✅** All 76 removed from 37 files: five whole table columns dropped, two of those tables becoming lists, the rest rewritten in prose. The credential-origin trap was checked against the live history first — see the decision record.

*Original step:* 195 candidates across 50 files, 76 of them real. Where the description already stands beside the id — 48 of the 146 backticked ids are the first cell of a table row — the id is **deleted** and nothing is written. Where it stands alone in prose, a date and a description replace it. **This is the step that cannot be redone once the history is gone**, and the one most likely to be skipped. This document's own citations are in scope. See [[decisions/product/journals-cite-dates-not-commit-ids]], which also carries the credential-origin trap: the id goes, but the wrong "correction" in the 31.08 journal must be fixed in the same pass or it is left standing with nothing to disprove it.

**A6. Cut the code free of the documentation. ✅** **(deviation)** The plan counted fourteen files, all carrying a literal `docs/` prefix. There were **109 more citations across 89 files** in the relative form `decisions/product/<name>.md`, which breaks in exactly the same way once the folder is a separate repository. All of them now name the record instead of its path.

*Original step:* The fourteen citations lose their paths and keep the record's name — the rule is now recorded at `.ai/rules/app.md`. `database/seeders/CanarySeeder.php` is the one that matters most: a seeder that runs on production should not name the journal index.

**A7. Move `schema.md` to `database/schema.md`. ✅** Its own links into `docs/` were rewritten to name records, and CLAUDE.md's stale "336 columns" was corrected to 342, which is what the live database reports.

*Original step:* **Move `schema.md` to `database/schema.md`** (Q1), beside the migrations that change it, and update the same-commit rule in CLAUDE.md to name the new path.

**A8. Gitignore the published Filament assets. ✅** 37 files, 4.2 MB, untracked and proven to regenerate with `php artisan filament:assets`.

*Original step:* **Gitignore the published Filament assets** (Q4) — `/public/css/filament`, `/public/fonts/filament`, `/public/js/filament`, the three paths Filament's own installer adds. No deploy-script change is needed: `composer.json` already runs `@php artisan filament:upgrade` in `post-autoload-dump`, which republishes them on every `composer install`.

**A9. Split CLAUDE.md. ✅** Root keeps the Boost rules plus the database rule — which belongs with the code now that `schema.md` does — and gains a short section on where the rest of the project lives. `docs/CLAUDE.md` takes the mission, the roadmap-document rules and the journal rules. **(deviation)** The plan put the database rule in the workspace; it has to be in the application repository, because that is where the migrations and the schema map now are.

*Original step:* **Split CLAUDE.md**, application half at the root, workspace half at `docs/CLAUDE.md`.

**A10. Verify the Syncthing gate. — yours, and now optional.** `--separate-git-dir` removes the dependency. Still worth a minute.

*Original step:* On the homeserver and on the phone, open the folder's Ignore Patterns and confirm `.git` is listed. Last in session A, because it is the first precondition of session B.

At the end of session A everything is committed to the existing repository in the normal way, and it is still the source of truth. **That is where the project now stands.**

### Session B — the two repositories. One uninterrupted sitting

**Yours beforehand:** the two empty private repositories, `undernoinfluence` and `undernoinfluence-docs`. **Completely empty** — no README, no licence, no template `.gitignore`; anything GitHub adds becomes a commit the squash then has to fight.

**The name collision, settled 22.09 before it could bite.** GitHub treats repository names as case-insensitive, so the old `UnderNoInfluence` and the new `undernoinfluence` are **the same name** and cannot both exist. The old repository was therefore renamed to **`uni-archive`** first. GitHub redirects `clone`, `fetch` and `push` from a renamed repository's old URL — but **that redirect dies the moment the old name is reused**, which is exactly what creating `undernoinfluence` does. A clone still pointing at the old URL would then push into the new, supposedly single-commit repository, silently and with no error.

So the remote here was repointed at the archive explicitly the same day:

```bash
git remote set-url origin git@github.com:Programilewski/uni-archive.git
git fetch origin        # verified 22.09: 212 commits, 05.04 "initial state" to 22.09
```

**Anything else still holding the old URL** — another clone, a deploy config, a bookmark — will silently resolve to the new repository once it exists. There is only one clone today, and it is repointed.

**B1. Create the application repository.** Add `/docs/` to `.gitignore` in the working tree first, then:

```bash
git rev-list --count origin/v1..v1        # must be 0 — nothing exists only here
mv .git ../undernoinfluence-legacy.git    # NOT rm -rf: the old history is moved, not destroyed
git init && git add -A && git commit -m "…"
git remote add origin git@github.com:…/undernoinfluence.git && git push -u origin main
```

**The old history is never deleted, at any point in this migration.** Paweł, 22.09: *"we dont run rm -rf .git here, right? We need the history/legacy repo."* Correct, and versions 1.0 to 5.0 of this plan said `rm -rf .git`, which was sharper than it needed to be. **`mv` gets the identical result and is reversible.** After it there are three copies of the old history, not one: the archived GitHub repository (B6), `../undernoinfluence-legacy.git` on the laptop, and any other clone. Read it any time with `git --git-dir=../undernoinfluence-legacy.git log`.

The legacy directory is deleted only when B5 has proved the new repository builds from scratch, and even then only if you want the disk back — it is about 46 MB. Seed from `v1`, which is ahead of `main` and where all the work is.

**B2. Create the workspace repository in place.** `git init --separate-git-dir="$HOME/uni-docs.git" docs`, one commit, private remote, push. The object store lands outside the Syncthing folder, so this no longer depends on A10 having been done — A10 is now tidiness, not a precondition.

**B3. Verify both, and verify the separation.** `git log --oneline` shows exactly one commit in each. `git grep` for the old password returns nothing in either. `git ls-files docs` in the application repository returns nothing at all. `git count-objects -vH` reports roughly 3.7 MB for the application and roughly 8 MB for the workspace.

**B4. Turn on the pre-commit secret scanner in both.** The scanner itself was written on 22.09 — `scripts/check-secrets.mjs`, with `scripts/githooks/pre-commit` beside it and `npm run check:secrets` in `package.json`. It reads the *staged* content of staged files, refuses on an assigned credential, an `APP_KEY`, a private key block, an AWS key id or a Postgres URL carrying a password, and lets placeholders through. `node scripts/check-secrets.mjs --self-test` checks the patterns against six known credentials and eleven known placeholders; `--all` sweeps every tracked file.

In the application repository:

```bash
git config core.hooksPath scripts/githooks
node scripts/check-secrets.mjs --all     # expect: clean
```

In the workspace repository, which has no `scripts/` of its own, the hook is three lines pointing back at the application's copy — `docs/` sits inside that working directory, so the relative path resolves:

```bash
mkdir -p ~/uni-docs.git/hooks
printf '#!/bin/sh\nexec node ../scripts/check-secrets.mjs\n' > ~/uni-docs.git/hooks/pre-commit
chmod +x ~/uni-docs.git/hooks/pre-commit
```

**`core.hooksPath` is per-clone, not part of the repository**, so the one command has to be run again on the server and on any future clone. That is why it is also a line in the deploy checklist rather than only here.

**B5. Prove the application repository from scratch.** Clone it into a temporary directory, `composer install && npm install && php artisan test`. Until that passes, the old repository is still the source of truth and nothing about it changes.

**B6. Archive the old repository — renamed to `uni-archive` on 22.09.2026, at `Programilewski/uni-archive`.** GitHub's Archive setting, kept private, its URL written into the workspace `README.md`. **Archive last, not first:** the setting makes a repository read-only, and until B5 has proved the new repository builds from a clean clone the old one is still the fallback you may need to push to. Archived rather than deleted: the history is the only record of early decisions that never reached a journal. Decide about deletion separately, once the new repositories have been the working ones long enough to trust.

### The one command never to run here

`git clean -xffd`. Plain `git clean -fd` removes untracked files and directories; `-x` additionally removes **gitignored** ones, which after B1 includes all of `docs/`; and the second `-f` is what lets git delete an untracked directory that **contains its own `.git`**, which it otherwise refuses to touch with a warning. So `-xffd` in this working directory deletes the entire vault, its history, and — because Syncthing replicates deletions — the copies on the homeserver and the phone. The homeserver's Simple File Versioning (keep 10) is the only net, and it restores file by file, not as a snapshot.

## Open questions — all four answered 21.09

| # | Question | Answer |
|---|---|---|
| 1 | **Does any engineering documentation stay in the application repository?** | **`database/schema.md` only** (A7). It is the only file with a rule binding it to a code change in the *same* commit, which two repositories would make unenforceable. Everything else in `docs/tech`, `docs/compliance`, `docs/decisions` and `docs/product` goes to the workspace — they are read by the founder, not by a developer building a feature |
| 2 | **Where does the reference material go?** | **Out of the vault entirely**, to `~/uni-reference/` on the laptop (A3). Paweł, 21.09: *"I dont need these anymore in repo nor syncthing. I can keep it here locally on my pc and that is sufficient."* Out of git *and* out of Syncthing — 93 MB stops being replicated to the phone. A note in the workspace records what exists and where |
| 3 | **Which agent tooling is kept, and where?** | **`.claude/`, `.cursor/` and `.agents/` are all kept**, in the workspace — they are Boost-generated, listed in `boost.json`, and regenerate on demand. Only the two that no generator maintains were deleted (A2): `GEMINI.md`, frozen at 25.08 while `AGENTS.md` and `CLAUDE.md` moved on to 16.09, and `.agents/skills/project-journal/SKILL.md`, a second and shorter journal skill sitting beside `.claude/skills/wrap/SKILL.md`. Size was never the argument; a file that can only ever go stale was |
| 4 | **Does `public/js/filament` stay tracked?** | **No** (A8), and it is `css` and `fonts` as well. Filament's own documentation says these are generated and should not be committed, and the deploy hook that republishes them is already in `composer.json` |

## What this changes in the records afterwards

- **The decision record for the split was written 21.09** — [[decisions/product/the-application-and-the-thinking-are-two-repositories]]. It reverses a scope decision recorded in version 2.0 of this document, and a reversal that lives only inside a plan file is not a record.
- **`docs/tech/obsidian-sync.md`** gains a line: the vault is now a git repository in its own right, so the directory has both Syncthing and git history, and a Syncthing conflict file is now also a git working-tree change.
- **`decisions/product/research-files-out-of-the-repo.md`** moves from `Executed: no` to executed, at step 3.
- **`decisions/product/secrets-never-in-tracked-files.md`** moves to executed only when step 11 is done, not at step 4.
- **CLAUDE.md** is split at step 7, and its database rule is rewritten to name `database/schema.md` if open question 1 is answered as recommended.
- **The journals keep their commit ids** as dates and descriptions after step 5; the ids in this document go with them.

## Scope decisions already taken

**Two repositories, not one** (20.09, reversing version 2.0). The application repository holds the application and the rules for writing it; the workspace repository holds everything else.

**The workspace stays a single repository.** Splitting the journals from the decision records would mean deciding, every session, which of two private repositories a given thought belongs in.

**The names, settled 21.09:** `undernoinfluence` for the application and `undernoinfluence-docs` for the workspace. Paweł: *"The names need to be descriptive and that is that."* `-docs` rather than `-workspace` because the directory it tracks is literally `docs/`, so the repository name and the path agree and neither has to be remembered.

**Two sittings, settled 21.09.** Cleanup first and separately, so the sitting that creates the repositories has nothing else in it.

---

*See also: [[decisions/product/secrets-never-in-tracked-files]], [[decisions/product/no-machine-addresses-in-the-repo]], [[decisions/product/pre-launch-has-no-past-to-protect]], [[decisions/product/research-files-out-of-the-repo]], [[decisions/product/legal-analysis-stays-out-of-the-repo]], [[tech/obsidian-sync]]*
