# No machine's address or path is written into the repository

**Date:** 2026-08-25
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** Infrastructure | Frontend

---

## Problem

`vite.config.js` pinned the dev-server host to one machine's Tailscale address. After the move to a new machine, Laravel answered in 28 milliseconds with a complete and correct page whose script tag pointed at a computer that no longer existed. The browser received neither a response nor a refusal, so it waited indefinitely, and no error appeared in any log on either side. The failure was invisible precisely because nothing was broken: a correctly generated page pointing at a machine that is gone.

## Options considered

Write the new machine's address in place of the old one, which works until the next move and fails the same way. Derive the host from `APP_URL`, which removes the duplication but inherits the problem, because `APP_URL` is also a tailnet address and the site then cannot be opened with the network off. Detect at start-up whether the overlay network is up and switch automatically, which is magic that occasionally chooses wrong and never explains itself. Default to `localhost` and make the tailnet an explicit, separately named mode.

## Decision

The dev server defaults to `localhost`, which needs no network at all, and `npm run dev:tailscale` selects the tailnet address explicitly. That address is read from `tailscale ip -4` when the server starts, so it can never be stale, and it is never written down. `hmr.host` is deliberately left unset so the Vite client connects back to whatever address the page was loaded from, which is correct in both modes without configuration.

## Rules

No host name, IP address, or absolute path belonging to a particular machine is committed to this repository. Such a value is read from the environment, derived at start-up, or it does not exist. Where two environments genuinely differ, they become two named modes chosen by hand, never one mode that guesses. The same rule covers deployment files: a user name, service account, or directory that exists on one distribution and not another is parameterised at deploy time rather than hard-coded — `supervisor/uni-worker.conf` still names `www-data`, which is a Debian user, and is the outstanding example.

Before any deploy or migration, grep for the class as well as the instance:

```bash
grep -rnE '\b(10|172|192)\.[0-9]+\.[0-9]+\.[0-9]+\b' --exclude-dir={node_modules,vendor,.git,storage} .
```

## What this prevents

Prevents a category of failure that does not look like what it is: no error, no log line, a fast and complete response, and a client that hangs. In development it costs an evening. In production the same shape appears when a stale `public/hot` file survives a deploy and every visitor's browser is sent to fetch assets from a developer's laptop.

## Revisit when

A deployment target requires a fixed address that genuinely cannot be supplied by the environment. Even then the value belongs in `.env` on that machine, not in a tracked file.

## See also

- [[decisions/product/pull-never-push-when-migrating]]
- [[tech/migration-lessons]] — lesson 4
- [[tech/going-to-production]] — the production form of the same failure
