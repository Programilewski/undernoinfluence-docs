---
version: 1.0
owner: Paweł Milewski
updated: 2026-06-28
status: active
---

# Data Breach Notification Runbook

GDPR Art. 33 requires notification to UODO within **72 hours** of becoming aware of a personal data breach. This document defines what counts as a breach, the decision process, and the exact steps to file.

---

## 1. What Counts as a Breach

A personal data breach is any security incident that leads to accidental or unlawful:
- **Destruction** of personal data (e.g. database wiped, backup lost)
- **Loss** of personal data (e.g. laptop stolen with a DB dump)
- **Alteration** of personal data (e.g. attacker modifies user records)
- **Unauthorised disclosure** — data sent to the wrong person, scraped by a bot, exposed in a public URL
- **Unauthorised access** — admin panel accessed by an unauthorised party, credentials leaked

### UNI-specific data that triggers a breach assessment

| Table / system | Personal data present |
|---|---|
| `users` | email, name, hashed password, role |
| `venue_claims` | user_id, venue link, admin notes; the claimant's name, e-mail and NIP; what the VAT list and KRS say about that NIP (`registry_lookup`) |
| `venue_erasure_requests` | user_id, reason |
| `venue_inaccuracy_reports` | user_id, free text |
| `user_venue_saves` | user_id, venue_id |
| `audit_logs` | user_id, action, payload |
| Laravel session store | session data for authenticated users |
| PostHog (EU servers) | hashed session distinctId, numeric user_id (consented users only) |

**Not a breach** (genuinely anonymous data):
- `events` table — no user identifiers (confirmed by migration 2026-06-22)
- Aggregate analytics numbers

---

## 2. Severity Assessment

| Severity | Criteria | UODO notification | Affected-user notification |
|---|---|---|---|
| **Critical** | Passwords exposed, bulk user data leaked, admin panel breached | Required within 72h | Required unless data was encrypted/hashed and risk is low |
| **High** | Small number of user records exposed, claim data leaked | Required within 72h | Assess per-case |
| **Medium** | Internal metadata accessed, no direct PII | Likely required | Unlikely |
| **Low** | Attempted breach, no confirmed access | Document only | No |

When in doubt, **notify UODO** — late notification is worse than over-notification.

---

## 3. The 72-Hour Clock

The clock starts when **you** (the controller) become **aware** that a breach has *likely* occurred. "Likely" means you have reasonable grounds to believe — not certainty.

- **Hour 0** — Incident detected (alert, user report, server log, security scan)
- **Hour 0–4** — Contain the incident (revoke credentials, take affected system offline if needed)
- **Hour 4–24** — Assess scope (which data, how many users, how exposed)
- **Hour 24–48** — Draft UODO notification
- **Hour 48–72** — File notification, begin user notification if required
- **Hour 72** — Hard deadline. File even if investigation is incomplete — UODO accepts "ongoing investigation" notifications

---

## 4. Containment Checklist

- [ ] Revoke any compromised credentials (admin panel, DB, server SSH keys)
- [ ] Rotate `APP_KEY` if session tokens may be compromised (`php artisan key:generate` — invalidates all sessions)
- [ ] If DB credentials leaked: change PostgreSQL password + update `.env` on server
- [ ] If admin panel was accessed: review `audit_logs` table for actions taken
- [ ] Take a snapshot of relevant logs before they rotate
- [ ] If attacker had write access: compare DB against latest backup to identify modifications
- [ ] Block the attack vector (patch, close port, revoke token)

---

## 5. UODO Notification

**Portal:** https://uodo.gov.pl/p/formularz-naruszen  
**Alternative (email):** kancelaria@uodo.gov.pl — include "Zawiadomienie o naruszeniu ochrony danych osobowych" in the subject  
**Phone (for guidance only):** +48 22 531 03 00

### Required information (Art. 33(3))

1. **Nature of the breach** — what happened, categories and approximate number of records affected
2. **Contact details** — your name, email, phone as the controller
3. **Likely consequences** — what harm could result for affected individuals
4. **Measures taken** — what you did to address the breach and mitigate its effects

### Filing template (Polish)

```
Administratorem danych jest: Under No Influence, Paweł Milewski
Kontakt: pawel.milewski00@gmail.com

1. Opis naruszenia:
[Opisz co się stało, kiedy, jakie dane zostały naruszone]

2. Kategorie i przybliżona liczba osób, których dane dotyczą:
[np. użytkownicy zarejestrowani — X osób; dane obejmują: imię, email]

3. Możliwe konsekwencje:
[np. ryzyko nieautoryzowanego dostępu do konta, spam, phishing]

4. Środki zaradcze:
[np. zmieniono hasła dostępowe, powiadomiono użytkowników, załatano lukę]

Dochodzenie jest w toku / zakończone [wybierz].
```

---

## 6. User Notification

Required when breach is **likely to result in high risk** to individuals (Art. 34). This typically means: passwords, financial data, health data, or data enabling identity theft were exposed.

For UNI, the threshold is: **email addresses + any combination of name/password/claim data exposed to an unauthorised party**.

Notification must be:
- **Direct** — email to each affected user
- **Plain language** — describe what happened, what data, what they should do
- **Timely** — as soon as reasonably feasible (no hard deadline after UODO is notified)

Draft email template:

```
Temat: Ważna informacja dotycząca bezpieczeństwa Twojego konta w Under No Influence

Drogi/Droga [imię],

Informujemy Cię o incydencie bezpieczeństwa, który mógł dotyczyć Twoich danych osobowych.

Co się stało:
[Krótki opis incydentu — kiedy, co zostało naruszone]

Jakie dane mogły zostać dotknięte:
[np. adres email, imię]

Co zrobiliśmy:
[np. zabezpieczyliśmy systemy, zmieniliśmy klucze dostępowe]

Co możesz zrobić:
[np. zmień hasło, zachowaj ostrożność wobec podejrzanych wiadomości]

Przepraszamy za zaistniałą sytuację. W razie pytań odpiszemy na ten email.

Paweł Milewski
Under No Influence
pawel.milewski00@gmail.com
```

---

## 7. Post-Incident

- Log the incident in `docs/compliance/incidents/README.md`
- If the breach was caused by a code vulnerability, file a technical post-mortem in `docs/compliance/incidents/`
- Review and update this runbook if the process had gaps
- If UODO requests follow-up information within their investigation window (typically 30 days), respond promptly

---

## 8. Quick Reference

| Action | Where |
|---|---|
| UODO notification portal | https://uodo.gov.pl/p/formularz-naruszen |
| Incident register | `docs/compliance/incidents/README.md` |
| Audit log (admin actions) | `/admin` → Audit Log, or `audit_logs` table |
| Rotate APP_KEY | `php artisan key:generate` (invalidates all sessions) |
| Check for DB modifications | Compare against latest `pg_dump` backup |
