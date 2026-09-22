---
version: 0.1
owner: Paweł Milewski
updated: 2026-05-13
status: draft
---

# Data Map

Internal map of how data enters, moves through, and leaves the marketplace.

## Systems

- Laravel application: TODO
- PostgreSQL database: TODO
- File storage: TBD
- Email provider: TBD
- Payment provider: TBD
- Analytics provider: TBD
- Error monitoring/logging: TBD
- Admin tooling: TBD

## Data Ingress

TODO: Document entry points:

- public website forms,
- account registration,
- business profile or listing forms,
- payment checkout,
- support channels,
- newsletter signup,
- admin import or manual entry,
- analytics events,
- server logs.

## Storage

TODO: List where each data category is stored, including database tables where known.

| Data category | System | Location | Encryption | Retention | Notes |
| --- | --- | --- | --- | --- | --- |
| Account data | Laravel/PostgreSQL | TBD | TBD | TODO | TODO |
| Business listings | Laravel/PostgreSQL | TBD | TBD | TODO | TODO |
| Billing data | Payment provider/accounting | TBD | TBD | TODO | TODO |
| Analytics events | Analytics provider | TBD | TBD | TODO | TODO |
| Technical logs | Hosting/logging | TBD | TBD | TODO | TODO |

## Access

TODO: Define who can access each system:

- founder/admin,
- support,
- business account owner,
- vendor support,
- developers,
- external accounting or legal support.

## Data Flows

TODO: Add flow summaries or BPMN diagrams where useful.

| Flow | Source | Destination | Trigger | Data | Notes |
| --- | --- | --- | --- | --- | --- |
| Registration | User browser | Laravel app | Form submit | TODO | TODO |
| Payment | Laravel app | Payment provider | Checkout | TODO | TODO |
| Analytics | Browser/server | Analytics provider | Event | TBD | See `../tech/analytics.md` |
| Email | Laravel app | Email provider | Notification | TODO | TODO |

## Deletion and Export

TODO: Describe how data is exported, corrected, anonymized, or deleted for GDPR requests.

## Open Questions

- TODO: Confirm production hosting and region.
- TODO: Confirm analytics provider and retention.
- TODO: Confirm payment provider and DPA status.
