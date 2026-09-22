---
version: 0.1
owner: Paweł Milewski
updated: 2026-07-24
status: review
---

# CIS Controls v8 (IG1) Security Audit

**Audited:** 2026-06-22
**Migrated to docs/ from the SSOT spec:** 2026-07-24 (this is now the canonical home)

Gap assessment against CIS Controls v8 Implementation Group 1 (IG1 — 56 safeguards). IG1 is
the correct scope for a solo-founder startup with limited IT staff.

**Assessment context:** local dev environment. `SESSION_ENCRYPT=false` and
`SESSION_SECURE_COOKIE=false` are expected dev settings, not active violations. All gaps are
measured against the production target state. IG2/IG3 gaps are flagged only where they
represent material business risk at current scale.

## Status summary

| ID | Control | Safeguard | Priority | Status | Finding |
| --- | --- | --- | --- | --- | --- |
| CIS1 | 7 — Vuln Mgmt | 7.4 | Critical | ✅ Done | Composer advisories cleared |
| CIS2 | 11 — Data Recovery | 11.1–11.2 | High | ⏳ Open | No backup strategy |
| CIS3 | 4 — Secure Config | 4.4 | Medium | ⏳ Open | No Content-Security-Policy header |
| CIS4 | 6 — Access Control | 6.3 (IG2) | Medium | ⏳ Open | No MFA on Filament admin |
| CIS5 | 8 — Audit Logs | 8.2 | Low | ◐ Partial | Log retention fixed; honeypot logs raw UA |
| CIS6 | 15 — Service Providers | 15.1 | Low | ⏳ Open | No service-provider / DPA inventory |

## Findings

### CIS1 · Control 7 (7.4) · Vulnerability management — Critical — ✅ Done
All composer advisories cleared 2026-06-28.
`composer update laravel/framework guzzlehttp/guzzle guzzlehttp/psr7 symfony/html-sanitizer`
run; `composer audit` now reports "No security vulnerability advisories found." All 407
tests pass post-update. Patched: CVE-2026-48019 (CRLF injection in Laravel framework),
CVE-2026-55767 (Guzzle HTTPS downgrade), CVE-2026-45753 (symfony/html-sanitizer XSS).

### CIS2 · Control 11 (11.1–11.2) · Data recovery — High — ⏳ Open
No backup strategy exists anywhere in the codebase, config, or docs. No
`spatie/laravel-backup` or equivalent, no scheduled `pg_dump`, no documented RPO/RTO. The
PostgreSQL database is a single point of failure — venue data, owner accounts, claims, and
audit logs are unprotected against server failure, accidental deletion, or ransomware.
**Action:** automated daily backups before launch. Minimum viable: scheduled `pg_dump` to a
different cloud provider (Scaleway Object Storage, `fr-par`). Preferred: `spatie/laravel-backup` with
encryption and a remote disk. **Test a restore at least once before launch.** (V1 launch
blocker; also see the At a Glance blockers in the SSOT.)

### CIS3 · Control 4 (4.4) · Secure configuration — Medium — ⏳ Open
No `Content-Security-Policy` (CSP) header. `SetSecurityHeaders` middleware sends
X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and HSTS
(prod only) — all good — but CSP is absent. A CSP allowlisting PostHog
(`eu.i.posthog.com`, `us-assets.i.posthog.com`), Bunny CDN, and inline scripts would block
XSS exfiltration even if a vulnerability were exploited. **Action:** add a CSP header in
`SetSecurityHeaders`, starting in report-only mode in staging. Core directives:
`default-src 'self'`, `script-src 'self' 'nonce-...' eu.i.posthog.com`,
`connect-src 'self' eu.i.posthog.com`. Livewire and Alpine.js require careful nonce handling.

### CIS4 · Control 6 (6.3, IG2) · Access control — Medium — ⏳ Open
No MFA/2FA on the Filament admin panel (`/admin/*`). The panel exposes all venue data, owner
accounts, claims (`contact_name`, `contact_email`, `contact_phone`, `business_nip`), and
erasure requests — a single compromised password grants full access. Safeguard 6.3 is
technically IG2, but the data sensitivity justifies it at IG1 scale. **Action:** install a
Filament 5 2FA plugin and enforce TOTP for all admin accounts before launch. Note: Tailscale
already restricts network-level access in production (see the SSOT Admin Security section);
2FA adds a second layer.

### CIS5 · Control 8 (8.2) · Audit log management — Low — ◐ Partial
(1) Log driver switched to `daily` with 30-day retention — done 2026-06-28.
`config/logging.php` stack channel now defaults to `daily` (was `single`); `LOG_DAILY_DAYS`
default raised from 14 to 30. (2) `HoneypotController` still logs raw `user_agent` strings —
open. Replace with a hash or omit entirely before production launch.

### CIS6 · Control 15 (15.1) · Service provider management — Low — ⏳ Open
No service-provider inventory. The DPA register ([`../dpa/README.md`](../dpa/README.md)) is
entirely TODO placeholders. Known processors: PostHog EU (analytics), hosting provider,
Bunny.net CDN, CEIDG API (read-only), Google Fonts (or alternative) — none with documented
signed DPAs. Also appears in the GDPR audit ([GD9](gdpr.md)). **Action:** complete the DPA
register. PostHog provides a DPA via their dashboard; the hosting-provider DPA must be
requested; Bunny.net has one available. Low urgency pre-revenue but required before handling
venue-owner PII in production.

## Confirmed good

Auth rate limiting (5 req/min per IP) ✔ · HSTS in production only ✔ · Laravel bcrypt
password hashing ✔ · rate limiting on analytics (30/min), reports (5/min), venue-redirect
(10/min) ✔ · `composer.lock` committed ✔ · `audit_logs` table with 12-month `model:prune` ✔
· PostHog consent-gated on both client and server ✔

## Related

- [`gdpr.md`](gdpr.md) — GD9 (DPAs)
- [`nis2.md`](nis2.md) — Art 21 voluntary measures mirror these gaps
- [`../dpa/README.md`](../dpa/README.md) — processor agreements register
