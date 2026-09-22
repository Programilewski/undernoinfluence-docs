# A release is a tag, and every environment deploys it from git

**Date:** 2026-09-22
**Status:** Decided
**Executed:** no — it governs the first home-server deploy and every one after it
**Area:** Infrastructure | Process

---

## Problem

With three environments, the obvious question is how code gets from one to the next. Paweł, 22.09: *"what would be the flow of deploying to prod? We deploy to staging and from that to prod?"*

Promoting by copying is genuinely appealing, and that is what makes it dangerous: what you copy is *literally the thing you tested*, which sounds like the strongest possible guarantee. It is the opposite. A running environment is not its source code — it is the source code plus everything that has happened to it. Its `.env`, its `storage/`, its caches, the file someone edited at 11 pm to get a deploy finished, the assets built on that box by whichever Node version it happened to have. Copy that into production and production becomes a state no commit describes.

Two records already govern the other two directions: data never moves production → staging ([[decisions/product/staging-is-seeded-never-copied]]), and a machine migration is pulled by the destination, never pushed from the source ([[decisions/product/pull-never-push-when-migrating]]). Neither covers code, which is the direction actually being asked about.

## Options considered

Copy the verified tree from staging to production. Deploy each environment from git independently at whatever `main` happens to be. Deploy every environment from git at the same immutable tag.

## Decision

**A release is a git tag. Every environment deploys that tag, from git, independently. Nothing is ever copied from one environment to another.**

```
   commit, push  →  tag v1.0.0
                        │
      ┌─────────────────┼─────────────────┐
      ▼                 ▼                 ▼
 home server         staging          production
 deploys v1.0.0   deploys v1.0.0   deploys v1.0.0
```

**What moves between environments is a version identifier, never files.** "Staging is on `v1.0.0` and it is good, put production on `v1.0.0`" — production then fetches that tag from git exactly as staging did. The two are identical because they were built from the same source, not because one was copied from the other.

**A tag rather than a branch**, because a branch moves. `main` at the moment staging deployed and `main` twenty minutes later when production deploys are not necessarily the same tree, and nothing records that they differed. A tag is immutable and says what production is running in a form a person can act on. Tags also survive the repository squash, which is why [[decisions/product/journals-cite-dates-not-commit-ids]] still permits citing one.

## Rules

- Production deploys a tag. Never a branch, never a copied directory, never an rsync from another environment.
- **Built assets are produced off the box** (deploy checklist C2) from the tagged commit, and the same artifact is shipped to each environment — not staging's copy of it. A Vite build on a 4 GB VPS can OOM-kill Postgres mid-deploy, which is why it never happens there.
- `.env` is per environment, is never copied between them, and its secrets are generated on the box that uses them (checklist A7).
- **A rollback is deploying the previous tag**, not restoring a directory. If a rollback cannot be expressed as a tag, the deploy was not a release.
- Nothing is hand-edited on a server. A fix is a commit, a tag, and a deploy, even when that feels slower at the time — especially then.
- The tag that production is running is written down where it can be read without SSH.

## What this prevents

Prevents a production tree that no commit describes and no one can reproduce. Prevents the drift where staging carries a hand-fix production never gets, or the reverse. Prevents staging's seeded test data and its `.env` reaching production inside a copied directory. And it makes rollback a defined operation rather than an improvisation during the one hour when improvising is most expensive.

## Revisit when

There is a build step that cannot be reproduced from a tag alone, or a second person deploys — at which point this stops being a convention and needs automation to hold it.

---

*See also: [[decisions/product/three-environments-and-what-each-is-for]] · [[decisions/product/staging-is-seeded-never-copied]] · [[decisions/product/pull-never-push-when-migrating]] · [[roadmap/deploy-checklist]]*
