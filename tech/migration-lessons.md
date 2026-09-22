---
version: 1.0
owner: Paweł Milewski
updated: 2026-08-26
status: approved
---

# What the Fedora migration taught us

On 2026-08-25 the entire working environment moved from Ubuntu on an external SSD to Fedora on the internal disk: code, database, uploads, the docs vault, and the AI context. It finished the same day. 465 tests pass, the data matches row for row, and the project no longer lives on a portable disk that was 99% full.

That is the small result. The larger one is that **a migration stopped being an adventure and became a procedure** — and the procedure was corrected five times by contact with reality. This document holds what generalises. It is the part worth reading before the next move, whatever the next machine is.

Three documents now cover this ground, and they do different jobs:

| Document | Job |
|---|---|
| [`migrating-to-a-new-machine.md`](migrating-to-a-new-machine.md) | The runbook that was executed. Step by step, with the corrections folded in. The only document in this repository proven by use. |
| **This one** | The rules the execution produced. Machine-agnostic. |
| [`going-to-production.md`](going-to-production.md) | What those rules mean for the move that actually matters — to a preprod and a production server. |

---

## What actually changed

| | Before (Ubuntu, external SSD) | After (Fedora, internal SSD) |
|---|---|---|
| Disk | Portable SSD on a cable, 99% full, 9.5 GB free | Internal Patriot P210, btrfs |
| PHP | 8.4.1, Herd Lite | 8.5.9, Fedora build |
| PostgreSQL | 16.15 (Ubuntu) | 18.4 (Fedora, single vendor) |
| Client library | Ubuntu's libpq | Fedora's libpq only; PGDG repository removed |
| Project path | `/var/www/undernoinfluence` | `/var/www/undernoinfluence` — deliberately unchanged |
| User | `pawel`, uid 1000 | `bub`, uid 1000 |
| Tests | 465 passing | 465 passing, 12.6 s |
| Dev server host | Hard-coded Tailscale address | `localhost` by default; tailnet is an explicit opt-in |

The username changed and nothing broke, because the **uid** did not. Ownership travels on the number, not the name. Every absolute path containing `/home/pawel` did break, and all of them were in documentation rather than code — which is the only reason it cost nothing.

---

## Nine lessons

### 1. A runbook written from imagination has holes you cannot see from the old machine

The guide was complete on paper. Execution turned up five gaps, and **none of them was a reasoning error** — each was something that is simply invisible until the new machine is the one running:

1. The **test database is in no backup**, because it is rebuilt from migrations on every run. The suite failed 421 times with a message that reads like catastrophe and was one missing `createdb`.
2. **`~/.config/git/ignore` travels with nothing.** It lives outside every repository, so neither the clone nor any file bundle carries it. Without it, `.claude/settings.local.json` starts showing up as a file waiting to be committed.
3. **The verification step could not work.** It said to confirm the uploads by looking at a venue image; no venue has an `image_path`, and the first venue in the list is a canary that returns 404 by design.
4. **Fedora's PostgreSQL client library is not the one that got installed** from a third-party repository — the longest problem of the day, lesson 5 below.
5. **The GitHub repository URL had changed**, and the old path worked only through a redirect that SSH treats as a courtesy rather than a guarantee.

> **The rule.** A migration document is a draft until it has been executed once. Budget a correction pass on the far side, and write the corrections down the same day — this is the only moment when the gaps are obvious. Any plan for production that has not been executed at least once is in exactly the same condition as this guide was on the morning of 2026-08-25.

### 2. Pull from the new machine. Never push from the old one

Ubuntu could see Fedora's disk and could have copied files onto it. Doing it the other way — Fedora running, the Ubuntu disk mounted read-only, and every file pulled across — was worth it for four reasons, and three of them are not about Fedora at all:

- **Labels and metadata.** Files written into a system that is not running arrive without SELinux labels and need a `restorecon` pass you will forget.
- **Ownership.** A straight copy only lands correctly if the destination user happens to have the same uid. Copying *as* that user removes the question.
- **Second chances.** The source stayed mounted and read-only. Everything forgotten was one `cp` away instead of one reboot away.
- **Room.** The source disk had 9.5 GB free. There was nowhere to stage a bundle even if pushing had been the better idea.

> **The rule.** The destination does the copying, while it is running, from a source it cannot modify. This survives the jump to production intact — a server pulls from git and from a dump, it never receives a directory tree shoved at it from a laptop.

### 3. The dangerous inventory is everything that is neither in git nor in the database

Code is in git. Data is in the dump. Everything that is in *neither* is invisible right up to the moment it is missing, and it is never a short list:

`.env` · `.claude/settings.local.json` · `storage/app/private/` and `storage/app/public/` · the SSH key · `~/.config/git/ignore` · the test database · the AI transcripts and memory under `~/.claude/projects/` · the Syncthing folder pairing · anything under `~` that a script writes to.

> **The rule.** Before any move, enumerate the third category explicitly and write it into the runbook as a checklist. "Everything important is in git" is true of the code and false of the environment.

### 4. A machine's address in the repository is a fault with a delayed fuse

`vite.config.js` pinned the dev-server host to the old machine's Tailscale address. After the move, Laravel answered in **28 milliseconds with a complete, correct 174 kB page** — whose script tag pointed at a computer that no longer existed. The browser got neither a response nor a refusal; the packets went nowhere, so it waited forever. There was no error in any log, on either side.

That is the shape of this failure: **not a broken server, but a correctly generated page pointing at a machine that is gone.** It looks nothing like a migration problem, which is why it cost an evening.

The first fix — read the host from `APP_URL` — removed the symptom and moved the problem, because `APP_URL` is *also* a tailnet address, so working offline still failed. The real fix accepted a fact about Laravel rather than working around it: `Vite::hotAsset()` writes the host into the HTML server-side, so it cannot follow the browser and must be chosen when the dev server starts. Hence two deliberate modes: `npm run dev` on `localhost`, working with no network at all, and `npm run dev:tailscale`, which reads the address from `tailscale ip -4` at start-up so it can never go stale.

> **The rule.** No host, IP address, or absolute path belonging to a machine goes into the repository. It is read from the environment, or derived at start-up, or it does not exist. The same rule kills the production version of this bug, where a stale `public/hot` file makes a production server serve asset URLs pointing at somebody's laptop.

**Checked 2026-08-26 and worth re-checking:** the working tree currently carries `hmr: { host: '100.71.247.39' }` in `vite.config.js` — the new machine's address, uncommitted, reintroducing exactly this class of fault one day after it was removed. The grep that catches it belongs in the pre-deploy checklist, not in anybody's memory:

```bash
grep -rnE '\b(10|172|192)\.[0-9]+\.[0-9]+\.[0-9]+\b' --exclude-dir={node_modules,vendor,.git,storage} .
```

### 5. One vendor per system library

Every PHP invocation printed a warning that the `pgsql` extension could not load: `undefined symbol: PQservice`. Two diagnoses were wrong before the third was right, and the wrong ones are instructive.

- **Wrong once:** "the PostgreSQL 17 server from the third-party repository is shadowing Fedora's library." Removing the server changed nothing — the problem was the *client* library, which is a separate package.
- **Wrong twice:** `dnf swap libpq5 libpq` ran, reported success, and **did nothing.** The third-party package declares `Provides: libpq`, so dnf concluded the requested package was already installed and reinstalled the very thing that was supposed to disappear.
- **Actually:** the PGDG `libpq5` installs into `/usr/lib64/` — where the distribution's own library lives — and carries no symbol versioning. Fedora's `php-pgsql` is built against Fedora's library, which does have it (`PQservice@RHPG_18`). Same filename, same directory, different contents.

The fix was `dnf --disablerepo='pgdg*' swap libpq5 libpq`, then deleting the PGDG repository definition outright.

> **The rule.** Pick the distribution's packages or the vendor's repository for a given component, never both, and write down which one you picked. A second supplier of the same file in the same system directory is not an edge case; it is the ordinary outcome of mixing repositories, and it fails at a distance from its cause.

### 6. A permanent warning taxes every future diagnosis

Through all of it, **the application worked.** Laravel talks to PostgreSQL through `pdo_pgsql`, which needs no symbol the broken extension was missing. All 465 tests passed with the warning printing on every single command. It was noise, not failure.

Noise is not free. A warning that is always there is a warning that every future investigation has to rule out first, at the exact moment when attention is scarcest.

> **The rule.** A working system emits no permanent warnings. Fix it or silence it deliberately and record why — but do not learn to read past it.

### 7. A verification step that cannot fail for the right reason is not a verification step

The guide's checklist told you to confirm the uploads had arrived by loading a venue image. No venue has an `image_path` — verified again on 2026-08-26: zero venues, zero products. It also implied taking the first venue off the list, which is a canary that deliberately 404s on public routes. Both steps would have "failed" on a perfect migration.

> **The rule.** Every verification step needs a known-good expected result, checked against the real data before the step is written down. A checklist that reports failure on a healthy system is worse than no checklist: it teaches you to ignore it.

### 8. The path is the cheapest thing to keep

The project stayed at `/var/www/undernoinfluence`. Claude Code keys its history, memory and per-project configuration by absolute path, so the transcripts, the twelve memory files and the MCP settings reattached themselves with no editing at all. Changing the path would have meant renaming directories and hand-editing JSON, for no benefit.

> **The rule.** Keep the path unless there is a real reason to change it, and if you must change it, change it once and early. The same applies on the server: the production checkout goes to `/var/www/undernoinfluence` too, so that every path in this repository's documentation stays true.

### 9. The dev migration was the production dress rehearsal, and it was free

Standing up a production server is a launch blocker. Half that work has now been done and written down at zero risk, on a machine where being wrong costs an afternoon rather than an outage: dumping and restoring the database across two major versions, reconstructing the environment from a checklist, discovering which files were not in git, and finding out what a missing host looks like from the browser's side.

> **The rule.** Treat every environment rebuild as a rehearsal for the one that matters, and write it down as though someone else will run it. Preprod exists for the same reason, and it is the last rehearsal you get.

---

## What the guide got right, and what only execution found

Worth keeping as a calibration on how much to trust a plan written in advance.

| Got right in advance | Only found by doing it |
|---|---|
| Boot safety checked before anything moved — Fedora's loader on the internal ESP, Ubuntu's on the external, so unplugging the disk could not brick the machine | The test database exists in no dump |
| Pull rather than push, with the reasons written out | `~/.config/git/ignore` travels with nothing |
| Same absolute path, and why | The verification steps could not pass |
| The database dumped from a *running* cluster, before the reboot | Two vendors of `libpq` in one directory |
| The explicit "do not copy" list — 506 MB of caches skipped | The GitHub URL had changed |
| The four things git does not carry | A hard-coded host in a build config |

Six of six on structure. Six of six misses on detail. That ratio is the useful takeaway: **the shape of a migration can be reasoned out in advance; the specifics cannot.**

---

## The rules, as a list

1. A migration document is a draft until it has been executed once.
2. The destination pulls, while running, from a read-only source.
3. Enumerate everything that is neither in git nor in the database.
4. No machine address or absolute machine path in the repository, ever.
5. One vendor per system library, written down.
6. A working system emits no permanent warnings.
7. Every verification step must be able to fail for the right reason.
8. Keep the path.
9. Every rebuild is a rehearsal; write it as though someone else will run it.

Rules 2, 4, and 5 are recorded as decisions: [`pull-never-push-when-migrating`](../decisions/product/pull-never-push-when-migrating.md), [`no-machine-addresses-in-the-repo`](../decisions/product/no-machine-addresses-in-the-repo.md), [`one-vendor-per-system-library`](../decisions/product/one-vendor-per-system-library.md).

Applied to the production move: [`going-to-production.md`](going-to-production.md).
