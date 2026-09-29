# No server holds a GitHub credential

**Date:** 2026-09-29
**Status:** Decided
**Executed:** 2026-09-29 — `deploy.php` sets `update_code_strategy` to `local_archive`; proved against an Ubuntu 26.04 stand-in the same day. The home server's old `uni-homeserver` deploy key is deleted when its container is retired (deployment runbook 5.4)
**Area:** Infrastructure | Compliance

---

## Problem

The 28.09 plan had Deployer check each tag out on the server itself, which meant every server needed a read-only GitHub deploy key — one per box, since GitHub refuses the same key on two. That is a credential on a public-facing machine that reads the whole private repository, including its history, for no purpose the box itself has. Reading Deployer 8's source on 29.09 showed it does not need one.

## Options considered

A read-only deploy key per server, created on the box and registered on GitHub (the 28.09 plan). One key shared by both servers — GitHub refuses it. Deployer's `local_archive` strategy: the PC runs `git archive` on the tag and uploads the result.

## Decision

The PC archives the tag and uploads it; no server ever reads GitHub. The PC already holds the repository and already builds the assets from the same tag, so nothing new is trusted — the server simply stops needing a key it would only use to fetch what the PC could send.

## Rules

No server is given an SSH key, token or deploy key that GitHub accepts. The tag guard verifies on the PC that the local tag and `origin`'s agree before anything is archived, so an upload is always the tested commit. `archive.tar`, which Deployer writes briefly into the repository root, stays in `.gitignore`. When the old home-server container is deleted, its GitHub deploy key is deleted with it, and none replaces it.

## What this prevents

A broken-into production box that can read the full source history, and two credentials that would otherwise need creating, recording, rotating and deleting. It also removes the only reason a server ever made an outbound connection to GitHub.

## Revisit when

Deploys run from somewhere other than the PC — CI deploying, or a second person — since `local_archive` assumes the machine running Deployer holds a trusted clone.

---

*See also: [[decisions/product/servers-are-built-and-deployed-from-the-pc-without-a-panel]] · [[decisions/product/a-release-is-a-tag-deployed-from-git]] · [[decisions/product/secrets-never-in-tracked-files]]*
