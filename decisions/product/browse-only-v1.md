# Browse-only V1 — no auth, no accounts, no B2B self-service

**Date:** 2026-06-15
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-16. The owner panel is closed again (O-2, built 16.09), so this record's "no B2B self-service" holds in full; `admin-recorded-claims-v1` narrows it only to the case of an admin-created account once the panel is opened. **The "no consent flows" clause remains contradicted by shipped code** — a cookie banner ships, because analytics were added after this was written · **18.09:** the privacy policy's sentences about owner accounts, claims and their e-mails render only while `UNI_OWNER_ACCESS` is on, so the V1 policy describes the V1 site
**Area:** UI/UX | Data Model | Venues

---

## Problem

The full V1 feature set — user registration, saved venues, B2B venue claiming, inaccuracy reports — carries significant compliance overhead before launch: GDPR Art 13/17/20 obligations, signed DPAs with every processor, a breach notification runbook, and session hardening. All of this protects users who do not yet exist. If no one uses the product, none of it matters. Building the compliance stack before validating demand inverts the startup risk equation.

## Options considered

Full auth at launch — register, saved venues, B2B claim flow, all live on day one. Maximum feature completeness but maximum compliance burden.

Browse-only with feature flags — keep all routes active but hide UI touchpoints behind flags. Less code deletion, but dead routes still need to be secured.

Browse-only as a separate branch, preserve everything on main — strip routing and UI entirely in `v1`, keep auth infrastructure intact on `main` for future re-activation.

## Decision

We ship `v1` as a pure browse product: no registration, no user accounts, no saved venues, no self-service B2B claiming. Venue owners who want to be listed email `kontakt@undernoinfluence.pl`. All auth controllers, Livewire components, and auth-related views are deleted from the `v1` branch; the database schema and all models are untouched. When demand is validated, features unlock from `main` without migrations.

## Rules

No auth routes are registered in `v1` — the routing file contains only browse, analytics, admin, and static page routes. B2B onboarding in `v1` is a `mailto:` link, not a form. The Filament admin panel remains active so venues can be managed internally. Server-side analytics (hashed IPs, no personal data) remain active to capture demand signals. No personal data is collected from public users, so no GDPR consent flows, DPAs, or cookie banners are required at launch.

## What this prevents

Spending weeks on compliance infrastructure for a product that hasn't proven anyone will use it. A GDPR-complete privacy policy, signed DPAs, a breach runbook, and hardened session config are all real obligations — but they are obligations triggered by processing personal data. Zero accounts = zero personal data = near-zero GDPR surface. This also prevents the team (solo founder) from being blocked on legal tasks when the highest-value activity is getting real users to the discovery page.

## Revisit when

When the discovery page shows consistent organic traffic and users are asking how to save venues or list their venue. The auth system, owner panel, and claim flow are all production-ready on `main` — activation is a merge and a deploy, not a build.

---

*See also: [[decisions/adr/ADR-006 No Reviews V1]]*
