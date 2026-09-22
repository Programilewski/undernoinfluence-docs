# No credential lives in a tracked file, and a hook enforces it

**Date:** 2026-08-30
**Status:** Decided
**Executed:** yes — 2026-09-22. The password was rotated, the `DB_PASSWORD` line removed from `phpunit.xml`, and the three documentation copies replaced with placeholders (session A, A1 and A4). The automatic check this record has always claimed now exists: `scripts/check-secrets.mjs`, the hook at `scripts/githooks/pre-commit`, `npm run check:secrets`, with a self-test over six credentials and eleven placeholders. It is live in this clone and sweeps all 1086 tracked files clean. **The one thing that does not travel is `core.hooksPath`**, which is per-clone — turning it on in each new repository is step B4
**Area:** Data Model

---

## Problem

A working database password has been in the test configuration file since the first commit of the
project. It was never leaked — the repository has always been private and nobody outside has
opened it — but it is committed, it is in every past version, and deleting it today would not
remove it from the history. The environment file was handled correctly from the start and has
never been committed, and no other tracked file holds a secret, so this is a single mistake made
once. The reason it happened is worth recording: the test configuration file is meant to be
shared, so nobody thinks of it as somewhere a secret could hide.

## Options considered

Leave it, since the repository is private. Remove it from the current version only. Rewrite the
whole history so it never existed. Start a fresh repository and archive the old one. Add an
automatic check that refuses commits containing anything that looks like a credential.

## Decision

No credential goes in any file that is committed, without exception, and an automatic check runs
before every commit to enforce it rather than relying on anyone remembering. Test configuration
reads its database settings from an ignored environment file or uses a temporary database with no
credentials at all. The password itself is changed, not because it leaked but because that cannot
be proven and changing it costs two minutes.

## Rules

Anything that would let somebody connect to something — a password, a key, a token — belongs in a
file that is ignored, and the committed file carries only the name of the setting. A secret
scanner runs as a pre-commit hook and refuses the commit when it finds one; it is installed
before the first commit of any repository this project uses, never afterwards. Removing a
credential from the current version is never treated as sufficient on its own: either the history
is dealt with or the repository is replaced. Production secrets are generated on the production
machine and never copied from a development machine.

## What this prevents

Prevents the ordinary version of this accident, where a private repository becomes public, gets a
collaborator, or is cloned onto a machine that is later lost, and the credential in its history
is still valid. The hook is the part that matters — the rule on its own has been broken once
already by people who knew it.

## Revisit when

Never as a rule. The specific tooling is revisited if the scanner produces enough false alarms
that anyone is tempted to skip it, which is how these checks usually die.

---

*See also: [[decisions/product/no-machine-addresses-in-the-repo]] ·
[[decisions/product/research-files-out-of-the-repo]] ·
[[decisions/product/pull-never-push-when-migrating]]*
