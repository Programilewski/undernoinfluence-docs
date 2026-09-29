# Servers are built and deployed from the PC, without a panel

**Date:** 2026-09-28
**Status:** Decided
**Executed:** no — the plan is in Phases 0–8 of the next session's deployment plan
**Supersedes:** the Ploi half of the 14.09 hosting choice (OVH VPS-1 stays)
**Area:** Infrastructure | Process

---

## Problem

Ploi Basic was chosen on 14.09 to manage the production server, and on inspection it fights every rule already decided. Its documented deploy script pulls a branch rather than a tag and omits `--no-dev`, zero-downtime deployment is only on the paid Pro tier, its nginx config has to be hand-amended anyway (the `.mjs` type, gzip, cache headers), and it runs PHP and workers under its own user and layout — so every row where production differed from the home server was caused by Ploi. It would also hold server access to personal data, which makes it a processor needing a DPA, a ROPA entry and a privacy-policy line.

## Options considered

Keep Ploi Basic, or pay for Pro. An open-source panel: CloudPanel (proprietary licence, does not run in a container), HestiaCP (unclear Ubuntu 26.04 support), Coolify (Docker). No panel: provision with a bash script, or with Ansible; deploy with Deployer, Envoy or a shell script. Run the provisioning from the home server or from the PC. Two research LLMs were asked independently and both landed on no panel, Ansible and Deployer.

## Decision

**No panel. Ansible provisions both the home-server container and the VPS from the same playbook; Deployer 8 deploys tags to both; the PC is the only machine that runs either.** Both servers run stock Ubuntu 26.04, which ships PHP 8.5.4 and PostgreSQL 18.6 — the same majors as development. The reason is not Ploi's €8 a month: measured honestly, the setup (about 25–35 hours) costs more than the fee saves for years. It is that production becomes a copy of the home server, no third party holds access, tags and zero-downtime come free, and one fix reaches both servers.

## Rules

Provisioning and deploys run only from the PC, with pinned Ansible and Deployer versions; the home server never holds a key that opens production, and a second SSH key kept in the password manager is registered on each server. Machine addresses live in `~/.ssh/config` aliases, never in the repository. Nothing is edited on a server by hand — a change is a playbook run or a tag. Assets are built once on the PC from a clean checkout of the tag and the same build is uploaded to each server. A deploy verifies the tag still points at the tested commit and refuses to switch releases unless the manifest, the MapLibre `.mjs` files, Filament's assets and the absence of `public/hot` are confirmed. nginx passes `$realpath_root` to PHP and every deploy reloads PHP-FPM, because PHP's realpath cache (120 s) and OPcache (`revalidate_path` off) can keep serving the previous release through the `current` symlink even with timestamp checks on. A deploy runs `optimize`, never `optimize:clear`, which would wipe the database-backed cache — the scheduler heartbeat, the queue-restart signal and the login rate limits. Migrations only go forward; a rollback never runs `migrate:rollback`, a risky schema change is split across two releases, and production takes a database-only backup before any deploy with pending migrations. CI runs tests and asset checks only, never deploys, and holds no production key. Every tag reaches the home server first.

## What this prevents

Prevents production drifting from the one environment where deploys are rehearsed, a paid tier becoming the price of atomic releases, and a processor relationship that exists only to run a deploy script. The rules prevent the specific failures found on 28.09: a stale release served through a symlink, a deploy that silently clears the heartbeat and rate limits, and a rollback that cannot undo a migration with nothing to restore from.

## Revisit when

Someone other than the founder has to operate the server, a second server is added, or server administration measurably exceeds three to four hours a month — the point where a paid panel starts to pay for itself under the time-versus-money rule.

---

*See also: [[decisions/product/a-release-is-a-tag-deployed-from-git]] · [[decisions/product/three-environments-and-what-each-is-for]] · [[decisions/product/a-deploy-needs-more-than-git-carries]] · [[decisions/product/every-process-that-writes-the-log-shares-a-umask]] · [[roadmap/research-results/deployment_research_assessment]] · [[roadmap/deploy-checklist]]*
