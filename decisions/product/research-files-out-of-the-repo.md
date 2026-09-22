# Venue research material never lives in the application repository

**Date:** 2026-08-24
**Status:** Decided
**Executed:** yes — 2026-09-22, step A3 of session A. All four subdirectories and both spreadsheets are at `~/uni-reference/`; the vault went from 102 MB to 9.4 MB. The note naming what went where is [[tech/reference-material]]. The `phone` column in the CSV never reaches a new clone because session B starts a repository with no history
**Amended:** 2026-09-21 — the destination is the laptop, not the homeserver, and the material leaves Syncthing as well as git
**Area:** Data Model | Compliance

---

## Problem

A venue research list sat committed in the repository root, open since 18.08, as both a spreadsheet and a CSV. Venue data is the actual launch constraint, so the list matters — but working material in an application repository is copied to every clone, survives in history after deletion, and cannot be verified as free of contact names or email addresses collected during research.

## Options considered

Leave it, since it is genuinely useful. Delete it and lose the research. Move it to the home server with the rest of the research material, keeping the repository to application code.

## Decision

Research material moves out of the repository. The repository holds the application; the research that feeds it lives elsewhere, where it can be updated without a commit and where its contents are not distributed to every clone.

**Amended 21.09 — the destination is `~/uni-reference/` on the laptop, and it leaves Syncthing too.** The original record said "the home server", which addressed git and left the material replicating to the phone forever. Git and Syncthing are separate containers and a decision about working material has to name both. Paweł, 21.09: *"I dont need these anymore in repo nor syncthing. I can keep it here locally on my pc and that is sufficient."* All four subdirectories go — `research/` (91 MB of NIQ and IWSR reports, the class of evidence ruled out on 10.09 as venue-operator material), plus `legal/`, `gus-api/` and `nominatim/`. The ten Syncthing conflict copies among them, 41.5 MB of five files saved twice, are deleted outright rather than moved.

## Rules

Files gathered during venue research, outreach lists, and any spreadsheet holding contact details are not committed. Before removing an already-committed one, its contents are read first: if it holds names or email addresses, removing it from the current commit is not sufficient and history has to be addressed as well. Data the application genuinely needs at runtime becomes a seeder or a migration, never a loose file at the repository root. A departure leaves a note in the workspace naming what existed and where it went, so nobody looks for it in git history later. The launch venue spreadsheet follows the same rule: it lives outside the tree from the start.

## What this prevents

Prevents personal data collected during research from persisting in git history where nobody looks for it, and prevents the ordinary rot where an uncommitted-by-convention file becomes stale, is still trusted because it is in the repo, and is eventually used.

## Revisit when

The project takes on a collaborator who needs shared access to research material, at which point the answer is a shared location outside the repo, not the repo.

See also: [[decisions/product/pre-launch-has-no-past-to-protect]]
