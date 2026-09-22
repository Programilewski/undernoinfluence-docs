---
version: 0.1
owner: Paweł Milewski
updated: 2026-07-24
status: review
---

# NIS2 Applicability Assessment — Directive (EU) 2022/2555

**Audited:** 2026-06-22
**Migrated to docs/ from the SSOT spec:** 2026-07-24 (this is now the canonical home)

Scoping assessment against NIS2 Annex I & II sectors to determine regulatory obligation,
plus a voluntary Art 21 security-measure checklist as best-practice guidance regardless of
formal applicability.

## Applicability finding: NIS2 does NOT apply to UNI as a regulated obligation

NIS2 Art 2 limits scope to entities in Annex I (essential: energy, transport, banking,
health, water, digital infrastructure, public administration, space) and Annex II
(important: postal/courier, waste, chemicals, food, manufacturing, online marketplaces,
search engines, social networks — the last three only above 50 employees **or** €10M annual
turnover). A Warsaw venue directory for non-alcoholic drinks falls into none of these
categories. **No NIS2 compliance obligation exists today.**

Re-assess when: (a) expanding to 3+ countries, (b) reaching 50+ employees or €10M revenue,
or (c) if CERT Polska extends scope via sector-specific guidance.

## Art 21 security measures — voluntary best-practice checklist

These measures are not legally required for UNI now. They are tracked voluntarily because
(1) they are genuine security best practice for any internet-facing service, and (2) they
provide pre-compliance readiness if NIS2 scope expands. Gaps here mirror the
[CIS Controls audit](cis.md).

| Art 21(2) measure | Current state | Status |
| --- | --- | --- |
| (a) Risk analysis & IS policies | No formal documentation. Risk implicit in audit findings and the SSOT decisions log. | ⏳ Not done |
| (b) Incident handling | No documented IR plan. Acceptable at solo-founder stage but needed before handling venue-owner PII at scale. | ⏳ Not done |
| (c) Business continuity & backups | No backup strategy. See [CIS2](cis.md). | ❌ Gap |
| (d) Supply-chain security | No supplier register or DPA register. See [CIS6](cis.md) and [GD9](gdpr.md). | ⏳ Not done |
| (e) Security in procurement & dev | `composer.lock` ✔, PHPUnit ✔, Pint ✔, Rector ✔. `composer audit` runnable but not on CI; npm audit not verified. | ◐ Partial |
| (h) Cryptography & encryption | HTTPS enforced in production ✔. Session encryption off in dev only (expected). Bcrypt for passwords ✔. No encryption at rest for the DB. | ◐ Partial |
| (j) MFA / continuous authentication | Admin panel has no MFA (see [CIS4](cis.md)). Tailscale provides network-layer auth in production. | ❌ Gap |

## Related

- [`cis.md`](cis.md) — CIS Controls v8 IG1 audit (the operational security gaps)
- [`gdpr.md`](gdpr.md) — GD9 (DPAs / supply chain)
