# One vendor supplies any given system component, and which one is written down

**Date:** 2026-08-25
**Status:** Decided
**Executed:** 2026-08-25 on the development machine; applies again when the server is installed
**Area:** Infrastructure

---

## Problem

Every PHP invocation on the new machine printed a warning that the `pgsql` extension could not be loaded because of an undefined symbol, `PQservice`. The cause took two wrong diagnoses to find. The PostgreSQL client library had been installed from the PGDG vendor repository into the same system directory where the distribution's own library lives, under the same filename, without symbol versioning — while the distribution's `php-pgsql` was built against the distribution's library, which has it. Removing the vendor's *server* package changed nothing, because the problem was the *client* library, a separate package. Swapping the package with `dnf swap` reported success and did nothing, because the vendor package declares `Provides: libpq` and the package manager therefore concluded the requested package was already present.

## Options considered

Keep the vendor repository and silence the PHP extension that fails to load, which works in one line and leaves a second supplier of a system library in place. Keep the vendor repository and rebuild the PHP extension against it, which is maintenance forever. Remove the vendor repository so that one supplier provides the whole stack.

## Decision

PostgreSQL — server, client library, and the PHP extensions that link against it — comes entirely from the distribution's own repositories. The PGDG repository definition was removed from the system, not merely disabled.

## Rules

For any component with a system-wide library, one supplier is chosen and recorded, and repositories are never mixed for that component. The choice is written into `docs/tech/going-to-production.md` for every environment that is stood up, so the next machine inherits the decision rather than rediscovering it. A package manager reporting success is not evidence that a package changed; verify with `rpm -qa` or the equivalent that the vendor's packages are actually gone.

## What this prevents

Prevents two files with the same name and different contents occupying the same system directory, where a program built against one of them fails under the other while the library appears to be correctly installed. Prevents the failure recurring silently at the next routine update, when the vendor repository would have quietly reinstated its own package.

## Revisit when

The distribution's version of a component is too old for something the application genuinely needs. At that point the vendor repository is adopted for that component in full — server, client, and every extension linked against it — rather than partially.

## See also

- [[tech/migration-lessons]] — lesson 5, with the full diagnosis path
- [[tech/going-to-production]] — where the choice is recorded per environment
