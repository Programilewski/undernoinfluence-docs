---
version: 0.3
owner: Paweł Milewski
updated: 2026-08-18
status: draft
---

# Compliance Documentation

This folder contains privacy, RODO/GDPR, vendor, and incident documentation for a B2C/B2B marketplace operating in Poland.

> **Which file is real — checked 2026-08-18.** Three documents here are unfilled template stubs and
> must not be read as the current position:
>
> | File | State | Read instead |
> |---|---|---|
> | `privacy-notice.md` | Stub, 14 × TODO, controller name still blank | The **live** policy in the app: `resources/views/privacy-policy.blade.php`, served at `/polityka-prywatnosci` |
> | `ropa.md` | Stub, 66 × TODO/TBD | `audits/gdpr.md` for the actual Art. 30 analysis |
> | `data-map.md` | Stub, 25 × TODO | `audits/gdpr.md`, `tech/analytics.md` |
>
> `compliance.md` (2026-06-10 risk-ranked snapshot) and `audits/` are the substantive documents.
>
> **Known gap carried since 16.08:** the live privacy policy names PostHog as the only recipient of
> user data. In reality a page view also sends the visitor's IP to CARTO (map tiles) and Bunny Fonts,
> and will soon add Scaleway (mail) and whoever hosts the app. This is a launch blocker, not a nicety —
> it is in `../roadmap/undone-inventory.md`.

## Documents

- `privacy-notice.md` - public privacy notice written in plain language for users.
- `ropa.md` - record of processing activities under Article 30 GDPR.
- `data-map.md` - internal map of data flows, storage, access, and retention.
- `vendors/` - subprocessors, third-party services, dependency licenses, and DPA status.
- `dpa/` - data processing agreements and related notes.
- `dpia/` - data protection impact assessments.
- `incidents/` - security and privacy incident records.
- `compliance.md` - risk-ranked compliance audit (2026-06-10 snapshot).
- `audits/` - framework-by-framework compliance audit records (migrated from the SSOT spec 2026-07-24): `gdpr.md`, `eprivacy.md`, `cis.md`, `nis2.md`.

## Working Rules

- Do not mix public notices with internal audit records.
- Use one processing activity per section in `ropa.md`.
- Reference analytics, technology, and security documents instead of duplicating their details.
- Keep all open legal assumptions marked as `TODO` or `TBD` until reviewed.
