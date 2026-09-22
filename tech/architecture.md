---
version: 0.1
owner: Paweł Milewski
updated: 2026-08-18
status: draft
---

# Architecture

> **Stub — do not read this for answers (checked 2026-08-18).** Everything below is unfilled
> template text left over from a generic "Laravel marketplace" scaffold: every section says TODO
> and none of it describes UNI. It is kept only as an outline to fill in later.
>
> **What actually documents the architecture today:**
> - `../learning/00-app-flow-overview.md` — how the three faces of the app fit together. Accurate.
> - `../learning/01`–`07` — the discovery map in depth.
> - `stack.md` — what is installed and what runs it (corrected 2026-08-18).
> - `../decisions/adr/` — why the structural choices went the way they did.

Working architecture notes for the Laravel marketplace.

## System Context

TODO: Describe the main actors:

- visitor,
- registered user,
- business account owner,
- marketplace admin,
- external vendors.

## Application Boundaries

- Public marketplace: TODO
- Business account area: TODO
- Admin panel: TODO
- API surface: TBD
- Background jobs: TBD

## Core Domain Areas

- Accounts and authentication: TODO
- Listings, venues, products, or marketplace inventory: TODO
- Claims or ownership verification: TODO
- Payments and billing: TBD
- Analytics and reporting: TBD
- Compliance workflows: TODO

## Data Ownership

TODO: Map important models/tables to domain ownership and related compliance processes.

| Domain | Data owned | Related docs | Notes |
| --- | --- | --- | --- |
| Accounts | TODO | `../compliance/ropa.md` | TODO |
| Marketplace listings | TODO | `../business/model.md` | TODO |
| Billing | TBD | `../compliance/ropa.md` | TODO |
| Analytics | TBD | `analytics.md` | TODO |

## Runtime Architecture

TODO: Add deployment diagram or prose covering:

- request lifecycle,
- database access,
- queues,
- scheduled jobs,
- external service calls,
- logging and monitoring.

## Security Boundaries

See `security.md`.

TODO: Document authentication, authorization, admin access, and data isolation assumptions.
