---
version: 0.1
owner: Paweł Milewski
updated: 2026-07-24
status: review
---

# GDPR Compliance Audit — Regulation (EU) 2016/679

**Audited:** 2026-06-15 / 2026-06-22
**Migrated to docs/ from the SSOT spec:** 2026-07-24 (this is now the canonical home)

Full scrutiny against the GDPR Regulation text — lawful basis, transparency, data
subject rights, processor obligations, and internal governance.

- **Phase 1** (2026-06-15) — 3 code fixes.
- **Phase 2** (2026-06-15) — 5 privacy-policy updates + data portability.
- **Phase 3** (2026-06-22) — analytics data minimisation, endpoint consent gate, PII column drop.
- GD1–GD11 from the original audit; GD12–GD14 added 2026-06-22.

## Scope

Reviewed against Regulation (EU) 2016/679 full text. Processing basis: Art 6(1)(b)
contract for B2C accounts, Art 6(1)(f) legitimate interest for server-side analytics.
PostHog runs on the EU instance (`eu.i.posthog.com`) — no third-country transfer issue
under Art 44, but a DPA under Art 28 is still required. DPO not mandatory at this scale
(Art 37). DPIA not required at Phase 1 scale (Art 35). The Polish DPA (UODO) has
supervisory jurisdiction.

## Status summary

| ID | Article | Priority | Status | Finding |
| --- | --- | --- | --- | --- |
| GD1 | Art 8 | High | ✅ Done | Age confirmation at registration |
| GD2 | Art 17 | High | ✅ Done | Self-service erasure for B2C users |
| GD3 | Art 13 | High | ✅ Done | Privacy policy linked at collection point |
| GD4 | Art 6 + 13 | High | ✅ Done | B2C legal basis stated in privacy policy |
| GD5 | Art 5 + 13 | High | ✅ Done | Retention periods stated |
| GD6 | Art 20 | Medium | ✅ Done | Machine-readable data export |
| GD7 | Art 12 | Medium | ✅ Done | DSR one-month response deadline stated |
| GD8 | Art 13(2)(e) | Medium | ✅ Done | "Provision of data required" disclosure |
| GD9 | Art 28 | High | ⏳ Open | Data Processing Agreements with processors |
| GD10 | Art 30 | Medium | ⏳ Open | Records of Processing Activities (RoPA) |
| GD11 | Art 33 | High | ✅ Done | 72-hour breach notification runbook |
| GD12 | Art 25 | Low | ◐ Partial | Minimise PostHog `identify()` payload |
| GD13 | Art 6(1)(a) | High | ✅ Done | Server-side consent gate on analytics endpoint |
| GD14 | Art 5(1)(c) | High | ✅ Done | Drop nullified PII columns from `events` |

**Still open:** GD9 (DPAs), GD10 (RoPA — a draft now exists at [`../ropa.md`](../ropa.md);
confirm completeness), GD12 (confirm whether `{name}` falls within "cookies analityczne"
consent scope, or reduce to numeric user ID).

## Findings

### GD1 · Art 8 · Age confirmation at registration — High — ✅ Done
Art 8 sets 16 as the threshold for information society services. Added a mandatory age
checkbox (`age_confirmed`, validated with the `accepted` rule) before the submit button
on `register.blade.php`. The checkbox label links to both Regulamin and Polityka
prywatności.

### GD2 · Art 17 · Self-service erasure for B2C users — High — ✅ Done
Art 17 grants the right to erasure without undue delay. Implemented `DELETE /profil` in
`ProfileController::destroy()` with current-password confirmation. Cascade deletes: saved
venues and inaccuracy reports removed; venue `claimed_by` nulled (venue survives).
Owners/admins are blocked from self-service and directed to the support email. Alpine.js
confirmation modal added to `profile.blade.php`.

### GD3 · Art 13 · Privacy policy at collection point — High — ✅ Done
Art 13 requires providing information at the time personal data are collected. Added a
link to Polityka prywatności in the age-confirmation checkbox label on
`register.blade.php`, directly at the point of account creation.

### GD4 · Art 6 + 13 · B2C legal basis in privacy policy — High — ✅ Done
Art 13(1)(c) requires specifying the lawful basis for each processing purpose. Privacy
policy section 3 only covered B2B and analytics. Added an explicit "Konta użytkowników
(B2C) — wykonanie umowy (art. 6 ust. 1 lit. b RODO)" entry. Key distinction: contract
basis (not consent) means account processing cannot be challenged by consent withdrawal
under Art 7(3).

### GD5 · Art 5 + 13 · Retention periods — High — ✅ Done
Art 5(1)(e) storage limitation and Art 13(2)(a) require stating retention periods.
Section 5 only covered analytics (90 days). Added: account data retained for the lifetime
of the account, permanently deleted on erasure; anonymous aggregated analytics may be kept
longer without user identifiers.

### GD6 · Art 20 · Machine-readable data export — Medium — ✅ Done
Art 20 grants the right to receive personal data in a structured, commonly used,
machine-readable format. Implemented `GET /profil/dane` → `ProfileController::exportData()`,
returning a JSON download (`uni-moje-dane.json`) with account details and saved venues
(incl. city names). "Pobierz moje dane" button added to `profile.blade.php`; mentioned in
section 7 of the privacy policy.

### GD7 · Art 12 · DSR response deadline — Medium — ✅ Done
Art 12(3) requires responding without undue delay and within one month. Added to section 7
of `privacy-policy.blade.php`: "Odpowiadamy na żądania bez zbędnej zwłoki, nie później niż
w terminie jednego miesiąca od ich otrzymania."

### GD8 · Art 13(2)(e) · "Provision of data required" disclosure — Medium — ✅ Done
Art 13(2)(e) requires stating whether data provision is a statutory or contractual
requirement and the consequences of not providing it. Added to section 2 of
`privacy-policy.blade.php`: "Podanie imienia i adresu e-mail jest niezbędne do założenia
konta — bez tych danych rejestracja nie jest możliwa."

### GD9 · Art 28 · Data Processing Agreements — High — ⏳ Open
Art 28(3) requires a written contract with every processor binding them to
GDPR-equivalent terms. Processors to address: (1) hosting provider — check whether their
standard DPA covers UNI's data; (2) PostHog EU — sign their DPA (available in the PostHog
dashboard settings); (3) transactional email provider (Scaleway TEM) — sign their DPA.
_Admin / legal task — no code change required._ Track in [`../dpa/README.md`](../dpa/README.md).

### GD10 · Art 30 · Records of Processing Activities — Medium — ⏳ Open
Art 30 requires maintaining written records of all processing activities. Not mandatory
for organisations under 250 employees when processing is not high-risk — but best practice
to create now. Should document: processing purposes, categories of data, categories of
data subjects, retention periods, processors, and security measures. A draft register
exists at [`../ropa.md`](../ropa.md) (status: draft) — needs completion and sign-off.

### GD11 · Art 33 · 72-hour breach notification runbook — High — ✅ Done
Art 33 requires notifying UODO within 72 hours of becoming aware of a personal data
breach. Runbook at [`../breach-runbook.md`](../breach-runbook.md) documents: what
constitutes a breach for UNI's specific data tables, a severity assessment matrix, the
72-hour clock breakdown, containment checklist, UODO portal URL and filing template
(Polish), user-notification template, and a post-incident register pointer. Incident log
at [`../incidents/README.md`](../incidents/README.md).

### GD12 · Art 25 · Minimise PostHog `identify()` payload — Low — ◐ Partial
Art 25 requires data protection by design. **Finding:** `posthog.identify()` was sending
`{email, name}` for authenticated users, so the user's email was shared with PostHog EU on
every page load for opted-in users. The consent banner text ("cookies analityczne") does
not specifically disclose email sharing. **Source:** `resources/js/app.js` —
`window.__authUser` included `email`. **Legal basis:** Art 5(1)(c) data minimisation —
user ID alone provides person stitching; email adds no analytical value. **Fix:** `email`
removed from `window.__authUser` in `app.blade.php`; `identify()` now sends `{name}` only.
`distinctId` for anonymous users changed from the raw session UUID to
`hash('sha256', session_id . app.key)`, preventing correlation between PostHog and the
session store. **Open:** confirm with legal whether `{name}` is within the scope of
"cookies analityczne" consent, or reduce to numeric user ID only.

### GD13 · Art 6(1)(a) · Server-side consent gate on analytics endpoint — High — ✅ Done
**Finding:** `POST /analytics/events` processed and stored server-side analytics events
for any caller with a valid JSON request and venue ID — regardless of consent. The
client-side gate in `venue-analytics.js` (`isConsentGranted()`) existed only in the
browser; any tool POSTing directly (extension, automation, direct HTTP) would write rows
to the `events` table. **Source:** `app/Http/Controllers/AnalyticsEventController.php` — no
consent check before form-request validation. **Legal basis:** Art 6(1)(a) — no lawful
basis for processing analytics data about a user who has not consented. **Fix:**
`abort_unless($request->cookie('uni_consent') === 'granted', 403)` added as the first line
of the controller method, returning 403 before any validation or processing. Covered by
test `event_endpoint_requires_consent_cookie`. Decision record:
`analytics-endpoint-server-gate.md`.

### GD14 · Art 5(1)(c) · Drop nullified PII columns from `events` — High — ✅ Done
**Finding:** After the Session 2 nullification migration, columns `user_id`, `session_id`,
`ip_hash`, and `referrer` remained in the `events` table schema as nullable columns,
always `NULL`. The admin analytics widget (`VenueAnalyticsWidget`) was still issuing
`SELECT referrer` / `GROUP BY referrer` — code that returned empty results but would crash
if the column were ever re-populated. The columns' presence implied to any developer that
the data was live or intended to be. **Source:**
`app/Filament/Admin/Resources/Venues/Widgets/VenueAnalyticsWidget.php` (referrer query);
`database/migrations/…nullify_identifiers…` (left columns in place). **Legal basis:**
Art 5(1)(c) data minimisation. **Fix:** migration
`2026_06_22_131600_drop_pii_columns_from_events_table.php` dropped all four columns and the
foreign key. *(Updated 2026-08-24: that migration was folded into
`2026_06_17_000020_create_events_table.php`, which now never creates the columns at all. The
schema dump was regenerated at the same time — it still contained them, and would have
reintroduced them on any fresh environment.)* The "Źródła ruchu" traffic-sources panel was removed from the admin widget
and Blade view. Decision record: `pii-columns-dropped.md`.

## Related

- [`../ropa.md`](../ropa.md) — Records of Processing Activities (GD10)
- [`../privacy-notice.md`](../privacy-notice.md) — public privacy notice (GD3–GD8)
- [`../dpa/README.md`](../dpa/README.md) — processor agreements register (GD9)
- [`../breach-runbook.md`](../breach-runbook.md) — Art 33 breach runbook (GD11)
- [`../incidents/README.md`](../incidents/README.md) — incident log
