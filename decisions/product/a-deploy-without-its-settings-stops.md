# A deploy without its settings stops

**Date:** 2026-09-29
**Status:** Decided
**Executed:** 2026-09-29 — `deploy.php` replaces Deployer's `deploy:env`; `DeployRecipeKeepsTheRulesTest` pins it, and on the Ubuntu 26.04 stand-in a deploy with an empty key was refused before anything went live
**Area:** Infrastructure | Compliance

---

## Problem

Deployer's Laravel recipe copies `.env.example` into place whenever a server has no `.env`, and the next step makes that copy the shared, permanent one. On a box where the real settings were forgotten, the site would start with `APP_ENV=local`, `APP_DEBUG=true` and no encryption key — and the first error page, very likely "no application encryption key", prints the environment, database password included. Nothing in the deploy would have looked wrong.

## Options considered

Trust the runbook's order (write `.env` in step 3.6, deploy in 4.16). Have Ansible write a starter `.env` so one always exists. Replace Deployer's task so a missing or keyless `.env` stops the deploy.

## Decision

The deploy stops. It refuses to continue if `shared/.env` is missing, and refuses if `APP_KEY` is empty unless the deploy is explicitly the first one (`--first-deploy`), which generates the key once. Settings are written by hand on the box from secrets generated there; the tool never fills the gap with defaults.

## Rules

`deploy.php` always overrides `deploy:env`; restoring Deployer's version is a regression. `--first-deploy` is used once per box and never as a habit. Ansible never writes `.env`, so secrets are never assembled on the PC. `.env.example` stays the production-safe template it already is, but it is read by a person filling in the real file, never copied by a tool.

## What this prevents

A production site that leaks its credentials on its first error because one step was skipped — the kind of silent default this project keeps paying for (the missing cron line, the empty environment value that stopped every command on 22.09).

## Revisit when

Settings move into a secrets manager or into the playbook with an encrypted vault, at which point the check moves with them.

---

*See also: [[decisions/product/servers-are-built-and-deployed-from-the-pc-without-a-panel]] · [[decisions/product/secrets-never-in-tracked-files]] · [[decisions/product/a-deploy-needs-more-than-git-carries]]*
