---
description: "Crash course: the GDPR you need to write UNI's privacy policy from the app, and to close the DPAs — what must be in it, how to inventory, where people slip."
version: 1.0
owner: Paweł Milewski
updated: 2026-10-10
status: teaching document — holiday series, course 4 of 6. Not legal advice
---

# Course 4 — GDPR for writing the privacy policy

The Launch bucket has one row that's pure writing: *privacy policy written from the app, plus the DPAs*. The current page is a draft and isn't the starting point (privacy-policy-is-a-draft). The policy is to be written from what the app actually does. This course gives you the frame for that: the handful of GDPR ideas that matter, what Article 13 requires the page to say, a method for inventorying UNI's processing, and the mistakes that make a policy untrue.

**This isn't legal advice.** It's enough to write a competent first draft and to know which questions are worth paying a lawyer for. Check details against the sources (GDPR text, UODO guidance, the vendors' current DPAs) before publishing.

## 1. Five ideas that carry the whole regulation

1. **Personal data is anything that relates to an identifiable person**, directly or indirectly. That includes an e-mail address, a name, **an IP address** (the CJEU said so in *Breyer*, 2016), and a **salted hash of an IP** (pseudonymised data is still personal data, because somebody holding the salt can link it). Data that truly identifies nobody, like `events` with no identifier, is outside GDPR. That's why UNI's analytics design is strong.
2. **Controller and processor.** The *controller* decides why and how data is processed. That's you (or your business, see question 1). A *processor* handles data on your instructions: OVH hosting it, Scaleway sending mail and storing backups, PostHog storing analytics. Every processor needs a contract with the Article 28 terms in it, which is the **DPA**. Most vendors publish theirs as part of their terms, and "signing" means accepting it and filing a copy.
3. **Every processing needs one lawful basis** (Article 6), chosen before you start and named in the policy. The ones UNI will use: **consent** (6(1)(a)), **performance of a contract** or steps at the person's request (6(1)(b)), **legal obligation** (6(1)(c)), and **legitimate interests** (6(1)(f)), which needs a short written balancing test: your interest vs the person's expectations.
4. **Purpose limitation, minimisation, storage limitation** (Article 5). Collect only what the purpose needs, use it only for that purpose, keep it identifying only as long as that purpose lives. UNI already implements this unusually well. The compliance hour's retention table is the proof, and anonymisation-not-deletion is a legitimate way to meet storage limitation.
5. **Transparency** (Articles 12–14). Tell people, in clear and plain language they'll actually understand, what you do. That's what the privacy policy *is*: a transparency document, not a contract and not a legal shield. A policy that's accurate and boring is a good policy.

## 2. What Article 13 requires the page to say

When you collect data from the person themselves, you must give them all of this. Use it as the policy's checklist:

| Must say | UNI's answer comes from |
|---|---|
| Who the controller is, with contact details | Question 1 below: you, or your business |
| Contact for a DPO, *if* one is appointed | UNI isn't required to appoint one (no large-scale monitoring or special categories). Say nothing, or say there isn't one |
| **Purposes, and the lawful basis for each** | The inventory in §3, one row per purpose |
| The legitimate interest pursued, where 6(1)(f) is the basis | The balancing notes in §4 |
| **Recipients or categories of recipients** | The processors in §5, plus OpenFreeMap |
| Transfers outside the EEA and the safeguard used | §5 (PostHog is the one to check) |
| **How long data is kept**, or the criteria | The compliance hour's retention table, already written |
| The person's **rights**: access, rectification, erasure, restriction, objection, portability | §6 |
| The right to **withdraw consent** at any time | The cookie banner's withdrawal path |
| The right to **complain to the supervisory authority** | UODO (Prezes Urzędu Ochrony Danych Osobowych, ul. Stawki 2, Warszawa) |
| Whether providing data is required, and what happens if not | E.g. the report form's e-mail is optional, so say so |
| Automated decision-making / profiling | None, so say so in one line |

**Language:** the audience is Polish, so the policy must be in Polish, in plain language. Write it the way UNI's FAQ is written, not the way policy templates are.

## 3. The method: inventory first, prose last

"Written from the app" means you build a table of **data flows** first, from the code and `database/schema.md`. Then the policy is mostly a translation of that table into sentences. Each row answers: *what data, from whom, why, lawful basis, who else sees it, how long.*

Here's my first pass at **V1's** flows, from reading the code on 10.10. With `UNI_OWNER_ACCESS` off, the claim flow (`/zglos-lokal`) and owner accounts aren't live, so they aren't in a V1 policy. They get added on the day of the switch, which is exactly what "V2 = flip + policy date" means.

| # | Flow | Personal data | Purpose | Likely basis | Retention |
|---|---|---|---|---|---|
| 1 | Any visit (nginx access log) | IP address, user agent, URL, time | Security, abuse, diagnosing faults | Legitimate interest | 30 days (Ansible sets it) |
| 2 | Rate limits on reports, redirects, the analytics endpoint | A key derived from the IP (`ClientNetwork::rateLimitKey`), in the cache table | Preventing abuse | Legitimate interest | Minutes (cache expiry, pruned every 5 min) |
| 3 | Session and CSRF cookies | Session id; **no IP stored** (sessions-hold-no-ip-address) | Making forms work | Strictly necessary: no consent needed (§7); GDPR basis legitimate interest | Session lifetime |
| 4 | The consent cookie (`uni_consent`) | The choice itself | Proving consent (Art. 7(1)) | Legal obligation / legitimate interest | Cookie life |
| 5 | **PostHog**, only after consent | Pseudonymous device id, pages, clicks; `person_profiles: 'identified_only'` | Product analytics | **Consent** | PostHog's retention, which you set in its project settings. State the number |
| 6 | UNI's own `events` | **None** | Counting demand | Outside GDPR | Indefinite |
| 7 | Inaccuracy report (`/miejsce/{slug}/zglos`) | Optional e-mail, free-text note | Fixing the listing, replying | Legitimate interest (or steps at request) | E-mail emptied 12 months after closing; see question 3 on the note |
| 8 | E-mail to kontakt@ | Whatever the sender writes | Answering | Legitimate interest / steps at request | Decide a rule for the inbox. Today there is none |
| 9 | Admin accounts | Name, e-mail, password hash, 2FA secret | Running the site | Legitimate interest (it's you) | While the account exists |
| 10 | Honeypot (`/export/venues.json`) | Hash of IP + app key, user agent, referrer, written to the Laravel log | Detecting scrapers | Legitimate interest | 30 days (the daily log's retention) |
| 11 | **Map tiles** | The visitor's **browser** sends its IP to OpenFreeMap when the map loads | Showing the map | Legitimate interest | OpenFreeMap's own practice |
| 12 | Backups | Copies of all of the above in the database | Restoring after loss | Legitimate interest / Art. 32 | 7 daily + 4 weekly rotation |

Rows 10 and 11 are the kind the "written from the app" method exists to catch. Neither shows up if you write the policy from a template.

## 4. Legitimate interest, done properly

When the basis is 6(1)(f), the regulator's question is: *did you weigh it?* The written answer is a **legitimate interests assessment** (LIA). For UNI it can be a paragraph per row, in `compliance/`:

1. **Purpose:** what's the interest? ("Keeping the site secure and finding faults.")
2. **Necessity:** could you do it with less data? ("Logs need the IP to block an attacker. Kept 30 days, not forever.")
3. **Balance:** would a reasonable visitor expect it, and could it hurt them? ("Every website logs requests. Nothing is used for profiling or shared.")

And in the policy, **name the interest** for each such row. "Legitimate interest" on its own, without saying which interest, is one of the commonest audit findings.

## 5. Processors, DPAs and transfers

The compliance hour lists the work. Here's what each item means:

| Vendor | Role | DPA | Transfer issue |
|---|---|---|---|
| **OVH** | Processor: hosts everything | Part of OVH's contract terms. Download and file it | None: EU company, EU data centre |
| **Scaleway** | Processor: transactional mail (recipient addresses, message content) and backup storage | Published in its terms. Record it | None: EU company, `fr-par` region |
| **PostHog** | Processor: product analytics | Self-serve form in the PostHog dashboard. **Named in the live draft already** | You use the EU cloud (`eu.i.posthog.com`), but PostHog is a US-headquartered company. Check whether its DPA covers access from the US, and under which mechanism (EU–US Data Privacy Framework certification and/or Standard Contractual Clauses). The policy then states it in one sentence |
| **OpenFreeMap** | Arguably a separate recipient rather than your processor: the visitor's browser contacts it directly | Probably no DPA on offer. Disclose it as a recipient, with a link to its policy | Check where it's hosted |
| **Healthchecks.io** | Receives pings with no personal data | Not needed | — |
| **Your mailbox provider** for kontakt@ | Processor for inbound mail | Check under your provider's terms | Depends on provider |

The rule from the compliance hour is the one to keep: **a new processor goes into `vendors/` before it processes anything, and into the policy in the same pass.**

## 6. Rights requests: what you'll actually have to do

Sooner or later someone writes: "what do you hold about me?" or "delete my data". The essentials:

- **You have one month** to answer (extendable by two more for complex cases, but you must say so within the first month). It's free.
- **Verify identity in proportion.** If someone writes from the address they want erased, a reply to that address is usually enough. Don't demand an ID scan for an e-mail address.
- **Know where to look.** For V1, a person's data can only be in: `venue_inaccuracy_reports.contact_email` and `note`, the kontakt@ inbox, PostHog (only if they consented, and keyed to a device, not a name), and logs keyed by IP. A short internal "where personal data lives" checklist, generated from `schema.md`'s *Personal data* lines, turns a request into ten minutes of work.
- **Erasure has limits.** You can refuse where you still need the data for a legal claim, for instance. The anonymise-not-delete design usually lets you erase the identifying column and keep the row, which satisfies the request.
- **Log every request and its answer.** It's your evidence that the process works.

Breaches are covered by `compliance/breach-runbook.md` (72 hours to UODO when there's a risk to people). Know that it exists before you need it.

## 7. Cookies: the Polish rule, not just GDPR

Cookie consent in Poland comes from the **Prawo komunikacji elektronicznej** (PKE, in force since 10.11.2024; it replaced the old telecoms law's article 173 with **art. 399**). The rule in short: storing or reading anything on the user's device needs **prior, informed consent**, *except* what's strictly necessary for the service the user asked for.

- **No consent needed:** the session cookie, the CSRF token, the consent cookie itself.
- **Consent needed:** PostHog. UNI already starts PostHog only after `uni_consent=granted` (`resources/js/analytics.js`). That's the right design.
- **Withdrawal must be as easy as giving.** "Odrzuć wszystkie" exists on the banner, and after it closes a persistent "Ustawienia cookies" button (`partials/cookie-consent.blade.php`) brings the choice back. That's the right shape. Worth checking on the phone that it's findable on every page (question 4).
- The policy (or a separate cookie section) lists each cookie: name, purpose, lifetime, first or third party.

## 8. Where policies go wrong

- **Promising more than the code does.** "We never store your IP" is false the moment nginx logs exist. Every absolute statement in the policy should be one you can point at code for.
- **"Anonymised" when it's only pseudonymised.** If the e-mail is emptied but the free-text `note` still contains the person's name or phone number, the row isn't anonymous. This is the open question already in the backlog, and it decides whether the word "anonymisation" may appear on the page.
- **Missing recipients.** The compliance hour already found this: the draft names no host and no storage provider.
- **Describing features that aren't live**, or failing to describe ones that are. Tie the policy's version date to a release, and re-read it on every flow added. The owner switch is the next such moment.
- **Copied template language**, like "we may share your data with partners". UNI has no partners, and a vague sentence is worse than none.

## 9. A skeleton for the Polish page

1. Kto jest administratorem danych i jak się z nim skontaktować
2. Co robimy z danymi, w skrócie (three sentences: no account needed, analytics only with consent, own statistics without identifiers)
3. Jakie dane, w jakim celu, na jakiej podstawie i jak długo (the §3 table, in plain Polish)
4. Komu przekazujemy dane (the §5 list)
5. Przekazywanie danych poza EOG (PostHog, if applicable)
6. Pliki cookies (the §7 list, plus how to change your choice)
7. Twoje prawa i jak z nich skorzystać (one e-mail, one month, UODO)
8. Zmiany polityki (version date, what changed)

## Questions to bring back

1. **Who is the controller?** You as a person, or a registered business (JDG)? The policy has to name it with contact details, and it also decides which name goes on every DPA. If there's no JDG yet, is one planned before launch?
2. **PostHog's transfer mechanism.** Check the DPA's wording (DPF and/or SCCs) and the data retention you've set in its project settings, so the policy can state both.
3. **The report's `note` field** (already an open backlog question): clear it along with the e-mail, so that "anonymised" is true? I'd recommend yes. Free text is the most likely place for identifying data to hide.
4. **The "Ustawienia cookies" button exists.** Is it visible enough on mobile, and does withdrawing consent actually stop PostHog *and* clear its cookies? Worth one test on the phone before launch.
5. **The kontakt@ inbox** has no retention rule. Pick one (e.g. 24 months after the conversation ends), so the policy can state it.
6. **The honeypot's `ip_hash`** goes to the general Laravel log for 30 days. A salted hash is still personal data (§1), so it needs its row in the policy. Fine as it is, as long as it's disclosed.
