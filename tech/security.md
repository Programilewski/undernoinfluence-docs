---
version: 0.1
owner: Paweł Milewski
updated: 2026-08-18
status: draft
---

# Security

> **Stub — checked 2026-08-18.** Every line below is unfilled template text. It is not a statement
> that these controls are missing; several are built and audited elsewhere. Read instead:
> `../compliance/audits/cis.md` (CIS controls, substantive), `../decisions/adr/ADR-009 AI Scraping Protection`
> (4-layer bot protection, implemented), `../decisions/product/block-all-ai-crawlers.md`, and
> in code: `SetSecurityHeaders`, `HoneypotController`, `VenuePolicy`, `PreventRequestForgery`,
> and the panel `authMiddleware` stacks.
>
> **Genuinely open, and blocking launch:** no production hosting, no backups, no tested restore.

Cross-cutting security notes for the marketplace.

## Scope

Security applies across technology, business operations, analytics, and compliance.

## Authentication and Access

- User authentication: TODO
- Business account access: TODO
- Admin access: TODO
- Multi-factor authentication: TBD
- Password policy: TBD
- Session policy: TBD

## Authorization

TODO: Document authorization boundaries:

- users can access only their own account data,
- business users can manage only authorized business profiles,
- admins have scoped operational access,
- vendors have no direct access unless explicitly approved.

## Data Protection

- Encryption in transit: TODO
- Encryption at rest: TBD
- Secret management: TODO
- Backups: TBD
- Data minimization: TODO

## Logging and Monitoring

- Application logs: TODO
- Security logs: TBD
- Error monitoring: TBD
- Alerting: TBD
- Log retention: TODO

## Operational Security

- Deployment process: TBD
- Dependency update cadence: TODO
- Vulnerability monitoring: TBD
- Access review cadence: TODO
- Incident response: see `../compliance/incidents/README.md`.

## Security Checklist

- TODO: Confirm production hosting security controls.
- TODO: Confirm backup and restore process.
- TODO: Confirm admin access controls.
- TODO: Confirm vendor access rules.
- TODO: Confirm incident notification procedure.
