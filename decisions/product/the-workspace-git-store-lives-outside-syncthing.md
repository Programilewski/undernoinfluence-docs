# The workspace repository's object store lives outside the Syncthing folder

**Date:** 2026-09-22
**Status:** Decided
**Executed:** yes — 2026-09-22, step B2. The workspace repository was created with `--separate-git-dir`; `docs/.git` is a 31-byte pointer and the object store is at `~/uni-docs.git`, 3.7 MB, outside every Syncthing folder
**Supersedes:** the Syncthing ignore-pattern gate added to [[tech/repository-migration]] on 21.09, which stays as a second, cheaper defence
**Area:** Infrastructure | Process

---

## Problem

`docs/` becomes its own git repository at the migration, and `docs/` is a Syncthing folder replicated continuously to the homeserver and to a phone. A git object store is thousands of small files written in a particular order, and Syncthing replicates files as they settle, in arbitrary order, resolving simultaneous writes by keeping both copies under a `.sync-conflict` name. Three devices writing one object store with no locking produces refs that point at objects the device does not have, and a repacking `gc` on one device deleting loose objects another still needs. The thing corrupted would be the only copy of every journal, decision record and roadmap document UNI has.

The fix recorded on 21.09 was a gate: confirm `.git` is in the Ignore Patterns on all three devices before `git init` runs. Paweł, 22.09: *"why did we have to confirm .git there? What was the issue? Why isnt there a better solution?"*

The question is fair. The gate protects the folder only as long as every device has a pattern typed into it by hand — Syncthing does not sync `.stignore` — so it is a standing promise about configuration rather than a property of the thing being protected. A fourth device, or a folder re-added after a rebuild, silently loses the protection.

## Options considered

The ignore-pattern gate on every device. Moving the vault out of the Syncthing folder and symlinking it, which Android does not support and which changes the vault path. Dropping Syncthing for `docs/` and using git alone, which costs the phone its Obsidian access. Putting the object store somewhere Syncthing does not look.

## Decision

**The workspace repository is created with `git init --separate-git-dir`, so the object store is never inside the synced folder at all.**

```bash
git init --separate-git-dir="$HOME/uni-docs.git" docs
```

What remains inside `docs/` is a **117-byte text file** named `.git`, containing one line: `gitdir: /home/bub/uni-docs.git`. Everything else — objects, refs, index, packfiles — is at `~/uni-docs.git`, which is not in any Syncthing folder. Git behaves normally from inside `docs/`: `status`, `log`, `commit`, `push`, all of it. Verified in a scratch directory on 22.09 before this was written.

**The ignore pattern stays too**, because two cheap defences beat one and because the pointer file is noise on the other devices. It is no longer what the split depends on.

## Rules

A git repository is never created inside a continuously replicated folder. Where the working tree has to live in one — which is the case here, because the vault is the thing being synced — the object store goes outside it with `--separate-git-dir`, and the ignore pattern is added as well, not instead.

## What this prevents

Prevents the loss of the entire thinking record on three devices at once, and — the part the gate could not prevent — prevents that loss on the device where somebody forgot to type the pattern. It also removes a precondition from session B: B2 no longer waits on A10.

## Revisit when

Never for this folder. If the phone ever needs git in the vault, the pointer file's absolute path becomes wrong there and the answer is a per-device checkout, not a shared object store.

---

*See also: [[tech/repository-migration]] · [[tech/obsidian-sync]] · [[decisions/product/the-application-and-the-thinking-are-two-repositories]]*
