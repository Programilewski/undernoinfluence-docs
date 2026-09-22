# The application and the thinking live in two repositories

**Date:** 2026-09-20, names and scope settled 2026-09-21
**Status:** Decided
**Executed:** no — session B of [[tech/repository-migration]]. Session A, the cleanup that precedes it, is also outstanding
**Area:** Data Model | Compliance | Brand

---

## Problem

UNI has one repository holding both the application and everything ever thought about it: journals, phone notes, pricing research, growth strategy, 170 decision records. Version 2.0 of the migration plan decided `docs/` would stay with the application, on the reasonable ground that the journals reference application file paths on nearly every page.

That ground is true and it is not the deciding one. A repository containing only the application can be handed to a developer, deployed, or audited without being read first. One that also contains the founder's commercial thinking cannot — so the choice is not "where do the docs feel like they belong" but "can this repository ever be shared". Paweł, 20.09: *"If I had to share the repo with someone, they'd see the docs folder with decisions, journals etc. If I keep a clean repo of the app code itself, I can share it, it goes cleanly to prod too."*

## Options considered

Keep one repository and exclude `docs/` at deploy time with sparse checkout, `export-ignore` or a deploy-script rule. Keep one repository and accept that it can never be shared. Two repositories with the workspace as a git submodule of the application. Two independent repositories, the workspace nested inside the application's ignored `docs/` directory. Three or more repositories, splitting journals from decision records.

## Decision

**Two independent repositories in one working directory.** `undernoinfluence` holds the application, the tests, the ops config and the rules for writing code, and is the thing that deploys and the thing that can be handed over. `undernoinfluence-docs` holds everything else and is never deployed. It lives at `docs/`, which the application repository gitignores, so the separation is a property of the repository rather than of a deploy script somebody has to remember.

**Nothing about how the documentation is written or synced changes.** The path does not move, the Obsidian vault does not move, Syncthing does not change. Only which git repository tracks the directory.

## Rules

Exactly one file crosses the boundary: the schema map moves to `database/schema.md`, beside the migrations, because it is the only document with a rule binding it to a code change in the same commit and that rule cannot be enforced across two repositories. Everything else in `tech/`, `compliance/`, `decisions/` and `product/` stays in the workspace, because it is read by the founder rather than by somebody building a feature.

Code never cites a `docs/` path — a comment names the record, never its location, since the path will not resolve in the application repository at all. The rule is recorded at `.ai/rules/app.md` and applies from 21.09.

The workspace is never split further. Deciding, every session, which of two private repositories a given thought belongs in costs more than it saves.

Production is kept clear of the workspace by absence, never by exclusion. No sparse checkout, no `export-ignore`, no deploy-script rule — the directory simply is not in the repository the server clones.

`git clean -xffd` is never run in this working directory. The second `-f` is what permits git to delete an untracked directory containing its own `.git`, and after the split that directory is the entire workspace. Syncthing then replicates the deletion to the homeserver and the phone.

Before the workspace repository is created, `.git` must be confirmed in the Syncthing ignore patterns on the homeserver and the phone. Ignore patterns are per-device and are not synced, so the rule existing on the laptop protects one machine of three, and a git object store replicated file-by-file by three writers is a corrupted git object store.

## What this prevents

Prevents the only repository UNI has from being one that can never be shown to a developer, an auditor or a buyer without first being read line by line for commercially sensitive material. Prevents a deploy-time exclusion, which is a rule that holds until the one time somebody changes the deploy script. And — via the last rule — prevents the split itself from destroying the thing it is protecting.

## Revisit when

Never for the split. The names are revisited only if the application is renamed.

See also: [[decisions/product/research-files-out-of-the-repo]] · [[decisions/product/secrets-never-in-tracked-files]] · [[decisions/product/journals-cite-dates-not-commit-ids]] · [[tech/repository-migration]]
