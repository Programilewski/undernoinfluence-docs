# The first admin is made at the console, and the password never goes on the command line

**Date:** 2026-09-12
**Status:** Decided
**Executed:** 2026-09-12
**Area:** Infrastructure

---

## Problem

A fresh production database has no user at all: the seeder creates an admin only on the development machine. The framework's own command for creating a panel user prints "may now log in" while creating an account the admin panel refuses, which a production rehearsal on 12.09 confirmed. So on the first day of production there was no documented way into `/admin`, and the undocumented way was a one-line database command typed from memory on a live server.

## Options considered

Seed an admin in production from environment variables. Use the framework's command and fix the role by hand afterwards. Document a database one-liner. Write a small command of our own that asks for everything interactively. Let the command accept the password as an option so it can be scripted.

## Decision

A project command creates the first admin, run by a person over SSH after the first deploy. It asks for the e-mail, a name and the password twice, and the password is only ever typed at the prompt. If the e-mail already belongs to an account, it offers to promote that account rather than failing, and changes nothing unless the answer is yes.

## Rules

The password is never accepted as an argument or option, because anything on a command line lands in the server's shell history. It must be at least twelve characters. Promotion defaults to no, and the question says plainly when the account is a venue owner who would lose the owner panel. Promotion never changes the password. Every admin created or promoted writes an audit record saying so, with the previous role. Running it for an existing admin changes nothing. It is run by hand and never from a deploy script, and it is a step on the deploy checklist.

## What this prevents

Prevents being locked out of our own admin panel on launch day, and prevents the two worse ways out: an admin password sitting in an environment file or a seeder forever, or one sitting in the shell history of a machine a third-party panel operator also has access to. It also prevents an owner silently losing their panel because somebody typed the wrong e-mail.

## Revisit when

Two-factor authentication on `/admin` is built — the second factor has to be enrolled somewhere, and this command is where the first admin begins. Or when there is more than one person administering the catalogue, at which point admins should be invited from the panel rather than made at a console.

---

*See also: [[decisions/product/admin-recorded-claims-v1]] · [[decisions/adr/ADR-010-migration-squash]]*
