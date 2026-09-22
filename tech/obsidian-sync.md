---
version: 1.1
owner: Paweł Milewski
updated: 2026-08-10
status: approved
---

# Obsidian Vault & Syncthing

How `docs/` is opened as an Obsidian vault and kept in sync between the dev laptop, the homeserver, and the phone.

## The vault is `docs/`, not the repo root

Open **`/var/www/undernoinfluence/docs`** as the vault. Not the repo root.

The wikilinks in these notes are written root-relative — `[[decisions/product/abv-trust-model]]`, not `[[abv-trust-model]]`. All 89 of them resolve when `docs/` is the vault root and break when it isn't. Opening the repo root would also make Obsidian index `node_modules/` and `vendor/`.

Obsidian → **Open folder as vault** → pick `docs/`. It creates `docs/.obsidian/` on first open.

## Topology

One Syncthing folder per vault. The **Folder ID** is shared across devices; the **local path is set per device**. That is what lets this vault live inside the git repo on the laptop and next to the other vaults on the homeserver.

| Device | Local path | Folder type |
|---|---|---|
| Laptop | `/var/www/undernoinfluence/docs` | Send & Receive |
| Homeserver | `<vaults-root>/uni-docs` | Send & Receive, file versioning on |
| Phone | `/storage/emulated/0/Documents/uni-docs` | Send & Receive |

Folder ID `gzlwh-sf7go`, label **UnderNoInfluence**. The ID is Syncthing's own and is identical on every device; only the label and the local path are per-device. Directory names above are the local paths, not the ID.

The homeserver is the always-on hub — it is what lets the phone and the laptop sync when they are never awake at the same time. Set **Introducer** on the homeserver device entry so future devices only need to be paired once.

## Why this is not merged into the existing homeserver vault

The existing vault stays a separate vault with its own Folder ID. Two reasons:

- **Wikilinks are root-relative.** Nesting `docs/` inside a larger vault reparents every link target and breaks them. Merging would mean rewriting all 89 links, and re-breaking them on every future doc move.
- **`docs/` is a git working tree.** Its contents change when a branch changes. That churn must not be able to touch unrelated notes.

They are still "merged" in every way that matters: both folders land under the same parent directory on the homeserver, so one backup job covers both, and Obsidian on the phone and laptop holds both vaults and switches between them.

## Setup order

1. **Laptop** — install Syncthing, add folder `docs/` with the label **UnderNoInfluence**, share it with the homeserver device.
2. **Homeserver** — accept the folder and set its local path as a **sibling of the existing vault, never inside it**; two Syncthing folders with overlapping paths both claim the same files and fight over them. Do not pre-create the directory — Syncthing creates it and its marker with the right ownership, whereas a hand-made directory owned by the wrong user is the usual cause of permission errors. Enable **Simple File Versioning** (keep 10) here only; the server is the safety net, the other devices do not need it.
3. **Phone** — see below. iOS has no working Syncthing client; on iOS this setup does not apply, use Obsidian Sync or a git-based plugin instead.

## Phone (Android)

Install **Syncthing-Fork** (`com.github.catfriend1.syncthingandroid`), not "Syncthing" — the original Syncthing-Android was discontinued in 2024.

Grant it **All files access** and **disable battery optimization** for it. Without the first it cannot write to `/storage/emulated/0/`, the only place Obsidian can read from; without the second Android kills it in the background.

Pair the phone with the **homeserver, not the laptop** — the server is always on, so sync does not wait for the laptop to wake.

Shares are always offered by the device that holds the folder; a phone cannot pull a folder it has never been told about. So the second half happens on the server: Folders → **UnderNoInfluence** → Edit → Sharing → tick the phone → Save. The phone then shows a pending-share prompt (recoverable from the drawer → Web GUI if dismissed). **Set the local path on that prompt before accepting** — `/storage/emulated/0/Documents/uni-docs`. Changing it afterwards is painful.

Let the first sync finish, then Obsidian → *Open folder as vault* → `Documents/uni-docs`. `.obsidian/` arrives over sync, so plugins and settings are already configured.

## Ignore rules

**Syncthing does not sync `.stignore` between devices.** Ignore patterns are per-device configuration — `docs/.stignore` in this repo governs the laptop only. The homeserver and the phone each need the same patterns entered by hand (folder → Ignore Patterns), or `workspace.json` conflicts across all three devices. Copy them from `docs/.stignore`.

What the patterns do: keep per-device Obsidian UI state out of sync — `workspace.json` and `workspace-mobile.json` change on every pane you drag. The rest of `.obsidian/` **is** synced deliberately, so plugins and settings stay identical everywhere.

`.gitignore` excludes what Syncthing and Obsidian drop inside the repo: `.obsidian/`, `.stfolder`, `.stversions/`, and `*.sync-conflict-*`. Without these they show up in `git status` and eventually get committed.

## Known sharp edge: branch switches propagate

`docs/` is tracked by git on the laptop. Checking out another branch rewrites files in place, Syncthing sees ordinary file changes, and those changes propagate to the phone and the homeserver.

This is accepted, not solved. `docs/` rarely differs across branches, and the homeserver's file versioning makes it recoverable. Two things follow from it:

- Do not do long-lived doc rewrites on a feature branch that you are not about to merge.
- Edits made on the phone land as uncommitted changes on whatever branch the laptop is on. Commit them deliberately rather than letting them ride along with a code commit.

## Conflicts

Syncthing does not merge — it keeps both versions as `<name>.sync-conflict-<date>-<device>.md`. If one appears, diff it against the original, keep the right content, delete the conflict file. They are gitignored, so they will not reach a commit, but they are also easy to miss for the same reason. `git status --ignored docs/` lists them.

---

*See also: [[README]] for the docs layout and the sorting rule.*
