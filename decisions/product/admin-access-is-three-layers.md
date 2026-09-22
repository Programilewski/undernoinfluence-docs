# Admin access is three layers, and the owner panel is behind none of them

**Date:** 2026-09-16
**Status:** Decided
**Executed:** partly — the owner panel's optional TOTP is built (18.09: `->profile()`, recoverable app authentication, never required), behind the panel's switch; on `/admin` the nginx allowlist, required TOTP and the failure counter are still deploy and pre-launch steps — the two `users` columns TOTP needs now exist, so `/admin` needs only its panel configuration
**Area:** Venues | Compliance

---

## Problem

`/admin` reaches every venue, every claim's contact details and every erasure request, and today a password is the only thing in front of it — Filament counts failed logins per address, so a distributed attempt is not slowed at all. A Tailscale-plus-nginx allowlist was decided in May, written into the BRD as a launch requirement, and then dropped four months later inside one clause of a working document, with no record. Two compliance audits still describe it as protecting production in the present tense.

## Options considered

2FA alone, treating the allowlist as superseded. The allowlist alone, on the grounds that an unreachable login form cannot be attacked. Both, applied to `/admin` and `/panel` together. Both, applied to `/admin` only.

## Decision

Three layers on `/admin`, in this order: an **nginx IP allowlist** restricted to Tailscale addresses, then **TOTP** with recovery codes and `isRequired`, then a **per-account failure counter that slows rather than locks**. They are not alternatives. The allowlist is enforced before any application code runs, so a Filament authentication bug is not reachable from the internet; TOTP is what stops a compromised laptop being enough; the counter is what OWASP asks for, because addresses are cheap and accounts are not.

**`/panel` is never allowlisted** — not in V1, not in V2. Owners sign in from their own devices from the first owner onwards, so an allowlist there locks out exactly the people it exists to serve.

## Rules

The nginx rule is written per location block from the first deploy, so `/admin` can be as tight as you like without ever touching `/panel`. Recovery codes live somewhere that is neither the laptop nor the same password-manager entry as the password, or one compromise takes both factors. The owner panel gets `->profile()` so an owner *may* enable TOTP, but never `isRequired` while accounts are hand-verified by phone. `cis.md` and `nis2.md` stop describing the allowlist in the present tense until it exists.

## What this prevents

Prevents the only realistic attack on this product's most sensitive surface — a credential-stuffed password against a publicly reachable login form — and prevents the subtler failure that produced this record: a decided control being dropped in a table cell, so that the documents you would hand to somebody asking about security describe a protection nobody built.

## Revisit when

A second person needs an admin account. `VenuePolicy::before()` grants any admin everything, which is right for one founder and is the thing to reconsider the day it is two.

---

*See also: [[decisions/product/admin-recorded-claims-v1]] · [[decisions/product/the-first-admin-is-made-at-the-console]] · [[decisions/product/browse-only-v1]]*
