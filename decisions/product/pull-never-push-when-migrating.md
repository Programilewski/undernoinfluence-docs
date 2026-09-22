# A migration is pulled by the new environment, never pushed from the old one

**Date:** 2026-08-25
**Status:** Decided
**Executed:** 2026-08-25
**Area:** Infrastructure

---

## Problem

Moving the whole working environment from Ubuntu on an external disk to Fedora on the internal one could be done in either direction. Ubuntu was running, could mount the Fedora partition, and could copy files straight into it — which is the shorter path and the one that suggests itself, because the machine you are already sitting in front of is the one that knows where everything is.

## Options considered

Mount the destination from the running source and copy into it, which is fewer steps and needs no reboot before the work starts. Boot the destination, mount the source read-only, and copy out of it, which needs the new system to be usable first. Build a single archive on the source and unpack it on the destination, which needs somewhere to put a bundle.

## Decision

The destination does the copying, while it is running, from a source it cannot modify. The Fedora install was booted first, the Ubuntu disk was mounted read-only at `/mnt/ubuntu`, and every file was pulled across from there.

## Rules

Files are never written into a system that is not running. The source is mounted read-only for the duration, and it stays mounted and untouched until the destination has passed its verification checklist at least once, because it remains the only copy of everything that is not in git. Where an archive is unavoidable, it is unpacked by the destination rather than written by the source. The same direction applies to servers: a host clones from git and restores from a dump; a working directory is never pushed into a live tree from a laptop.

## What this prevents

Prevents files arriving without the security labels the destination expects, which on a system running SELinux enforcing produces a service that cannot read files whose permissions look perfectly correct. Prevents ownership being guessed rather than assigned — a copy only lands correctly if the destination user happens to share the source user's numeric id, and the Fedora user's name differs from the Ubuntu one. Prevents the one-shot quality of pushing, where anything forgotten is discovered after the source is gone; pulling leaves everything one command away for as long as the source stays mounted.

## Revisit when

The destination cannot be booted before the transfer, or the source is a system that cannot be mounted read-only — a managed database or a hosted service, where the export is the only interface. In that case the export becomes the read-only source and the rule is unchanged in substance.

## See also

- [[decisions/product/no-machine-addresses-in-the-repo]]
- [[tech/migration-lessons]] — the full set of rules this belongs to
- [[tech/migrating-to-a-new-machine]] — the runbook that executed it
