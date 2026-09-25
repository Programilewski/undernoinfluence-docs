# Every process that writes the application's logs shares a umask

**Date:** 2026-09-25
**Status:** Decided
**Area:** Analytics

---

## Problem

Three different processes write the application's daily log, and two of them run as different users: the queue worker and php-fpm run as the web user, while cron runs the scheduler as the deploy user. The log file is created fresh at midnight by whichever of them arrives first, and with the default umask a new file is readable but not writable by its group. So the first writer of the day locks every other writer out until the next midnight, and the ones locked out fail with no error anywhere — the pages keep serving, the scheduler keeps running, and its output simply stops existing.

## Options considered

Run everything as one user, which collapses the deploy user and the web user and gives the web server write access to the code it serves. Point each process at its own log file, which splits one day's story across three files and makes a timeline impossible to read. Fix the permissions after the fact with a scheduled `chmod`, which repairs the symptom every night while the cause survives. Have every writer agree on a umask that leaves the group write bit on.

## Decision

Every process that writes into `storage/` runs with umask 0002, set at each writer rather than assumed from the environment. The setgid bit already on the storage directories decides *which* group a new file belongs to; the umask decides whether that group may write to it. Both halves are required and either one alone is useless.

## Rules

The cron entry that runs the scheduler sets the umask inline, before changing directory, so it does not depend on the shell cron happens to use. The supervisor program that runs the queue worker sets `umask=0002` in its own configuration, which ships in the repository rather than being applied by hand on each machine. The web server's process manager gets the same value through its service configuration. Any new writer — a one-off command run over SSH, a deploy script, an import run by hand — is expected to match, and a file in `storage/` that is not group-writable is treated as a bug rather than tidied up individually.

## What this prevents

A day of missing log lines that nobody notices, discovered weeks later while investigating something else and mistaken for the scheduler having stopped. The failure is silent in both directions: nothing warns that a write was refused, and the surviving half of the log looks complete. It also prevents the tempting wrong fix — running everything as one user — which would hand the web server write access to the application's own code.

## Revisit when

A host arranges the deploy user and the web user differently, or a managed platform imposes its own umask. The rule is that the writers agree; the specific value follows from that.

*See also: [[decisions/product/three-environments-and-what-each-is-for]] · [[decisions/product/a-deploy-needs-more-than-git-carries]]*
