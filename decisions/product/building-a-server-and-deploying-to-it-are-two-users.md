# Building a server and deploying to it are two users

**Date:** 2026-09-29
**Status:** Decided
**Executed:** 2026-09-29 — in the playbook (`roles/base`, `bootstrap.yml`) and the inventories; the `deploy` side proved on an Ubuntu 26.04 stand-in, the `admin` password path not yet exercised
**Area:** Infrastructure | Compliance

---

## Problem

The 28.09 plan gave the `deploy` user exactly one sudo right — reloading PHP-FPM — and also had Ansible provision the box. Ansible installs packages and writes system files, so it needs full root; the two cannot be the same user without giving the everyday deploy key full control of production.

## Options considered

One user with full passwordless sudo for both tools. One user with full sudo behind a password. Two users: `admin` for Ansible and `deploy` for Deployer, `admin`'s sudo either passwordless or behind a password.

## Decision

Two users on every server. `admin` is what Ansible connects as, with full sudo behind a password typed on each run (`ansible-playbook -K`); `deploy` is what Deployer connects as, with one passwordless right: `systemctl reload php8.5-fpm`. Both are key-only and both accept the PC key and the backup key.

## Rules

`deploy` never gains a second sudo line; anything a deploy needs beyond reloading PHP-FPM belongs in the playbook, not the deploy. `admin`'s password lives in the password manager and is created by `bootstrap.yml` on a fresh VPS, or by hand in the one manual step on a new container. SSH allows only these two users; the provider's first user is locked after the first provision. The playbook's `verify` role fails the run if `deploy` holds any other sudo right.

## What this prevents

A stolen PC key, or a compromised deploy, being root on a box that holds claimants' contact details: with the password, the key alone reaches `admin`'s shell but not root, and `deploy` never could. It also prevents the tool that runs on every release from being the most powerful one.

## Revisit when

A hardware security key holds the SSH key (the password then guards less), or a second person needs to provision servers.

---

*See also: [[decisions/product/servers-are-built-and-deployed-from-the-pc-without-a-panel]] · [[decisions/product/admin-access-is-three-layers]] · [[decisions/product/every-process-that-writes-the-log-shares-a-umask]]*
