# Compliance Audit — 2026-06-10

Law-compliance issues identified in the app, ranked by risk.

---

## Critical (fix before launch)

### 1. No self-service account deletion in the UI

Regular users can only request deletion by emailing `kontakt@undernoinfluence.pl`.
GDPR Art. 17 expects erasure to be as easy as signup was. The venue erasure flow
is excellent — extend that pattern to user accounts with a "Delete my account"
button on `/profil`.

### 2. PostHog identifies users by email + name when enabled

If `POSTHOG_PUBLIC_ENABLED=true` is set, the analytics script sends personal data
to PostHog without a consent UI. Either add a cookie/consent banner before enabling,
or strip PII from the `posthog.identify()` call.

---

## High (fix soon after launch)

### 3. No automated data export (GDPR Art. 20 — data portability)

Currently manual via email. For a small app this is legally acceptable at launch,
but plan a "Download my data" endpoint. Regulators increasingly expect self-service.

### 4. Session encryption disabled by default

`.env.example` ships `SESSION_ENCRYPT=false`. Production must use
`SESSION_ENCRYPT=true` + `SESSION_SECURE_COOKIE=true`. If production `.env`
already has these — good, but the example file should reflect the safe default.

### 5. Privacy policy date says "maj 2026"

If the policy text has changed since May, the effective date must reflect the
latest revision. Minor, but auditors check this.

---

## Medium (address within 3 months)

### 6. Image alt text on venue photos

No evidence that uploaded venue images get meaningful `alt` attributes.
WCAG 2.1 / EU Accessibility Act issue (EAA enforcement starts June 2025
for new services).

### 7. Audit log retention is 12 months

Longer than necessary post-redaction. Data minimisation principle (Art. 5(1)(e))
suggests shortening to 90 days after the record is redacted by an erasure request.

---

## Already solid

| Area | Status |
|------|--------|
| IP hashing (SHA-256) for analytics | Done |
| Analytics disabled by default (PostHog) | Done |
| EU-hosted PostHog (`eu.i.posthog.com`) | Done |
| Privacy policy citing correct GDPR articles | Done |
| Polish DPA (UODO) reference | Done |
| Database protection clause in regulamin | Done |
| Venue erasure with audit-log redaction | Done |
| Email verification (signed URLs, 60 min) | Done |
| No marketing email infrastructure | Done |
| Honeypot anti-scraping endpoint | Done |
| Accessibility: ARIA labels, skip-to-content, live regions | Done |
| All legal pages accessible (`/regulamin`, `/polityka-prywatności`) | Done |
| EU-friendly APIs only (Nominatim, GUS) | Done |
| Bcrypt password hashing (rounds=12) | Done |
