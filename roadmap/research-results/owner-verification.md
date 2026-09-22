The safest, realistic pattern for UNI is: verify that the claimant controls at least one official public channel of the venue (website, email, phone, or social profile), cross‑check the business they name via Polish registries, and reserve manual review for disputes and higher‑risk access like analytics. Documented practice on large platforms confirms that this “multi‑signal, risk‑based” approach is standard, with stronger checks only when stakes or risk are higher.

Below is a structured answer: how big platforms verify, what Polish registries can prove, a table of methods, a recommended ladder for UNI, role design, lifecycle (re‑verification, disputes), GDPR implications, and an evidence‑based view of fraud risk. Where claims are from documentation I mark them as Documented, where from industry or case descriptions as Observed practice, and where they’re my Reasoning.

1. How major platforms verify business ownership
Google Business Profile
Methods (Documented): Google offers verification via video recording, phone or SMS to the business number, email to a business address, postcard to the business address, live video call, instant verification via Search Console, and bulk verification for brands with 10+ locations.

What they check (Documented): Video focuses on three evidence groups: location (address, signage), operations (inventory, workstations), and affiliation (keys, POS access, business documents).

Cost and time (Observed): All methods are free but can take from minutes (phone/email/instant) to 5–14 days (postcard); video is typically reviewed in 1–5 days.

Fraud and hijacking (Documented/Observed): Google’s own and expert guides describe ownership hijacking: strangers or agencies claiming profiles, a 3–7 day window for owners to respond to requests, and recovery paths requiring business registration, utility bills, leases, and signage. Documentation admits that any user can suggest edits and that a non‑response to an ownership request can lead to someone else gaining control.

Apple Business Connect / Apple Business
Methods (Documented): Apple first verifies the company (business identity) via combinations of official documents, business IDs (D‑U‑N‑S / EIN), and domain validation (DNS TXT), then verifies locations either by tying them to the verified company or by a phone call to the business number with a 4‑digit code.

Cost and time (Documented/Observed): Verification is free but can take up to 5 business days for organization review; location phone calls are near‑instant once available.

Disputes (Documented): If a location is already managed, Apple shows “This location is already managed” and allows transfer requests or “ask to join their team”; Apple may reassign ownership after reviewing documents.

Fraud (Reasoning): Apple documentation emphasises stricter verification but does not publish fraud rates; the stricter org‑level step is clearly meant to reduce impersonation.

Bing Places
Methods (Documented): Bing offers phone call, SMS, email to a non‑public‑domain business email, postcard, web‑based Q&A, and import from Google Business Profile (which relies on Google’s prior verification).

Cost and time (Observed): All methods are free; phone/SMS/email are typically instant or same‑day, postcards 7–14 days, and Google import depends on GBP.

Fraud (Reasoning): Microsoft’s public guides do not quantify fraud; the import‑from‑Google feature implicitly trusts Google’s verification, making Bing vulnerable to any hijacks that already occurred in GBP.

Yelp for Business
Methods (Documented): Yelp verifies via phone call to the business number, sometimes SMS, and sometimes email to a work email on the business domain; in contested cases they may require business license, utility bill, tax document, lease, or storefront photos.

Cost and time (Observed): Verification is free; phone/email often complete within 24–48 hours, postcard when used 7–10 days.

Fraud (Observed/Reasoning): Industry write‑ups emphasise that Yelp blocks VOIP or call‑tracking numbers, prefers local numbers, and runs NAP (name‑address‑phone) consistency checks against aggregators and web data; Yelp admits to using human review for suspicious profiles. Documentation does not publish hijack statistics.

Tripadvisor (hotels and other venues)
Methods (Documented): Business representatives register, declare they’re authorized, then verify via phone or SMS to the hotel’s publicly listed phone, or via credit card authorisation (a small hold but no charge).

Cost and time (Observed): Phone and credit‑card checks are free or near‑free for the business; verification typically takes about 5 business days for new listings and 3–7 days for identity checks.

Fraud (Documented/Reasoning): Tripadvisor states that verification is explicitly designed to prevent fraud and to control who can access the Management Center, but it does not publish fraud rates.

Facebook pages & Meta Business / Instagram business accounts
Methods (Documented):

Creating a Business Manager requires business name, address, and business email, then email verification.

Business verification for higher‑risk uses (e.g. WhatsApp API) demands official documents (business license, tax records, bank statement) and a domain‑based email matching a live website.

Page and Instagram access use roles in Meta Business Suite (Admin, Employee, asset‑level permissions), not in‑app roles.

What it proves (Documented/Reasoning): Meta’s process mainly proves business legitimacy and who controls the domain and Business Manager, not that a given person is the legal owner of a specific venue.

Fraud (Observed/Reasoning): Public guidance focuses on role hygiene (few admins, two‑factor auth, auditing access) to prevent takeovers, but Meta does not publish hijack rates.

Foursquare for Business
Methods (Documented): Claiming a venue requires: asserting ownership, then phone verification plus credit/debit card verification (US$20 fee for non‑US venues), followed by another business phone verification call and 4‑digit code.

Cost and time (Documented/Observed): Outside the US, claiming a venue incurs a one‑time US$20 fee; verification itself is quick once phone calls succeed.

Fraud (Reasoning): The card step mostly deters casual impersonation (someone unwilling to pay) but does not strongly prove authority to act for a specific business.

OpenTable, TheFork, Untappd for Business
OpenTable (Partial documentation): Available support material focuses on device verification (email to login address) for accessing guest data; detailed public steps for restaurant onboarding and ownership verification are limited. Documentation is silent on exact methods of verifying a new restaurant’s legal owner.

TheFork (Reasoning): Public onboarding information is sparse in Polish/CE markets; based on similar platforms, TheFork likely uses contract‑based onboarding with business documents rather than self‑service claims, but I could not find explicit documentation.

Untappd for Business (Partial documentation): Untappd has separate brewery and verified venue flows; public help articles mention claiming a brewery and adding verified venue locations, but do not detail the verification checks (documentation silent).

Polish / Central European platforms
ZnanyLekarz (Documented): Doctors and clinics must provide professional license numbers or qualification documents; ZnanyLekarz’s internal verification team cross‑checks against official medical registers and displays a green badge for verified profiles. This proves professional qualification and license, not venue ownership.

Booksy (Observed): Onboarding revolves around creating a Booksy Biz account, registering a business email, and then configuring the salon profile; public materials stress having a registered activity (CEIDG/KRS) but do not detail automatic registry checks, suggesting manual or KYC‑driven review.

Pyszne.pl (Documented): Joining as a restaurant requires a form, then submission of company documents, owners’ and representatives’ documents, bank account confirmation, menu, delivery zone, with human review before activation.

Wolt (Documented): Partnership agreements require KYC/KYB checks: extracts from commercial registers and documents to verify persons authorised to act, plus bank data; services start only after documents are supplied and checks passed.

Glovo (Documented): Glovo lets restaurants self‑register via a form with country, city, venue name, business data and invoicing details, then Glovo staff verify the information and activate the profile; the essential data are business registration details and contact for an authorised person.

Observed pattern: The food‑delivery platforms (Pyszne, Wolt, Glovo) rely heavily on contractual onboarding and document‑based KYC, not lightweight “claim‑this‑listing” flows; this is consistent but not spelled out step‑by‑step in public docs.

2. Polish public registries and what they actually prove
KRS (Krajowy Rejestr Sądowy)
What it contains (Documented): For companies registered in KRS, entries include legal name, NIP, REGON, registered address, board members, and commercial proxies (prokurenci), typically by name and sometimes PESEL.

Links it provides (Documented/Reasoning):

Person → company: board members and proxies are formally authorised to act for the company in most legal matters.

Company → address: registered seat and sometimes local branches, but not always the specific venue premises.

Access, API, cost (Documented): Direct KRS data is public; various commercial APIs (e.g. nip24, otwarteAPI wrappers) expose KRS fields via NIP or KRS as paid services, but the underlying registry data are free.

Gaps for hospitality (Reasoning):

Many small bars/cafés use sole traders (CEIDG) instead of KRS companies.

KRS does not model “this specific bar at this street” unless there is a separate branch entry; names often differ (e.g. “X Gastro sp. z o.o.” vs “Bar Pod Kogutem”).

CEIDG (sole traders and some civil partnerships)
What it contains (Documented): CEIDG stores sole trader identity (name), NIP, REGON, PKD codes, registered address, possibly place of business, and some status info (active, suspended).

Access, API, cost (Documented): The CEIDG DataStore / dane.biznes.gov.pl APIs provide access to public CEIDG data; they are free but require registration and API keys, with rate limits (e.g. 50 requests per 3 minutes, 1000 per hour).

Links it provides (Documented/Reasoning):

Person → business: for a sole trader, NIP essentially identifies the person themselves.

Business → addresses: registered address is often the owner’s home, but sometimes includes place of business.

Gaps for hospitality (Reasoning):

Many small venues operate from rented premises; CEIDG often lists the home address, not the café/bar address.

CEIDG does not list employees or managers, so it cannot prove an employee’s authority.

VAT white list (Wykaz podatników VAT)
What it contains (Documented): The VAT white list gives VAT status, company identifiers (NIP, REGON, sometimes KRS), address, and the list of registered bank accounts that belong to the taxpayer.

Access, API, cost (Documented): The official wl‑api.mf.gov.pl API is free, no key needed, and supports queries by NIP/REGON/account with daily limits; there is also a daily flat file (~200 MB) and many commercial mirrors.

Links it provides (Documented/Reasoning):

Company → bank accounts: strong binding; any payment from one of these accounts can be safely assumed to be controlled by the company.

Company → identity: cross‑checks NIP name vs other sources.

Gaps for hospitality (Reasoning):

Very small businesses may be VAT‑exempt and still have legitimate venues.

The registry says nothing about who can operate the account (owner, accountant, bookkeeper).

GUS REGON via BIR1 API
What it contains (Documented): BIR1 exposes full REGON registry data: legal name, NIP, KRS, form of business, PKD codes, status dates, and importantly local units (jednostki lokalne) with their own addresses.

Access, API, cost (Documented):

API is free but requires a USER_KEY requested by email; there are rate limits by time of day.

Multiple open‑source client libraries exist (Ruby, PHP, Node), making integration straightforward for a Laravel/PHP backend.

Links it provides (Documented/Reasoning):

Company → local unit address: if the venue address matches a REGON local unit for the given NIP, you have strong evidence that this company actually operates a business at that physical location.

Gaps for hospitality (Reasoning):

Not all small venues register separate local units; some operate under a single seat address.

Data are relatively current but may lag physical reality (changes in tenancy).

Summary (Reasoning): For UNI, registries can do real work mainly to:

Check that a claimed NIP corresponds to a real, active business, and that its name and sector are plausible.

Sometimes tie a company to the venue address via REGON local units.

In KRS cases, check that the claimant’s name matches a person formally authorised to act (board/prokurent).

None of them can independently prove that a random employee has authority or that a social‑media agency is legitimately empowered; they are supporting signals, not standalone decisions.

3. Verification methods: what they prove and how they fit UNI
High‑level method table
Reasoning: The table below focuses on methods mentioned in your question, plus a few adjacent ones used by major platforms. Effort and time are indicative, based on documented behaviour and observed practice of similar tools.

#	Method	What it primarily proves	How it can be defeated	Owner effort	UNI effort/request	Direct cost	Typical time	Personal data UNI holds	Platforms using it (examples)	Evidence type
1	Email to venue‑published address (website / Google / social)	Control of published email channel (who reads mail sent there)	Shared inbox; agency or employee reading mail; compromised mailbox	Low (click link / copy code)	Low (send mail, record code)	~0	Minutes to hours	Email logs (to, from, time), request metadata	Google (email verification), Yelp (business email), Meta (business email), many SaaS tools.
Reasoning based on documented methods
2	Claimant email on venue’s domain (e.g. jan@barpodkogutem.pl)	Identity tied to domain; suggests deeper involvement, often owner/manager	Shared mailbox, IT provider, agency with domain email; forged if domain compromised	Low	Low (pattern match domain vs site)	~0	Instant	Email address, domain, NIP	Google & Meta favour domain emails; common trust pattern in B2B SaaS.
Reasoning
3	Code via DM from venue’s Instagram/Facebook account or in bio/website	Control of venue’s main social or site; strong channel control	Account hijack; rogue employee with login; agency with full access	Medium (log in, send DM / edit bio)	Medium (monitor inbox / scrape bio, match code)	~0	Minutes to hours	DM contents or bio snapshot; handle identifiers	Google sometimes uses website content; Meta uses page/admin roles but not code placement; social‑code patterns widely used in SEO and link‑ownership verification.
Reasoning
4	File or meta tag on venue’s website (Search Console‑style)	Technical control over website hosting/HTML, typically owner or agency	Hosting provider or developer acting alone; domain hijack	Medium (upload file or edit HTML)	Medium (HTTP check for file/tag)	~0	Minutes	URL, verification token, timestamp	Google Search Console, Apple Business domain validation.
Documented (pattern), Reasoning for UNI
5	Automated call or SMS to venue’s public phone number	Someone at the venue (or phone line) can receive codes; moderately strong for control of phone channel	Hostile staff; call forwarding; VOIP where business doesn’t control routing	Low–medium (answer call / SMS)	Medium (integrate telephony; retry; log)	~0.03–0.10 EUR per call/SMS depending on provider	Seconds–minutes	Phone number, call/SMS metadata, possibly recordings if stored	Google, Bing, Yelp, Tripadvisor, Apple all use phone PINs to public numbers.
Documented
6	Postcard/letter with code to venue street address	Physical presence and mailbox access at premises	Landlord or neighbour reading mail; misdelivery; delayed post	Low (no interaction beyond reading mail)	Medium–high (prepare mail batch, print, send, reconcile codes)	Poczta Polska: ~5–8 PLN per letter; EU post services similar (reasoning)	3–7 business days domestic; longer cross‑border (reasoning)	Address, mail logs, possibly postal confirmations	Google, Bing routinely use postcards.
Documented + Reasoning for PL specifics
7	Small bank transfer from VAT white‑list account with code in title	Control over company’s registered bank account AND link to NIP	Accountant/bookkeeper could send without owner’s knowledge; multi‑signatory accounts	Medium (instruct bank or finance staff)	Medium–high (reconcile incoming transfer, read reference, match to request; maybe via PSD2 AIS)	Transaction fees negligible; AIS provider ~0.03–0.10 EUR / call or small monthly fee (reasoning)	1–2 business days (standard transfer)	Bank account IBAN, transaction metadata, amount, code, NIP	Some EU platforms use micro‑deposits for KYC; PL tax guidance strongly links VAT white‑list accounts to identity.
Documented for registry; Reasoning for UNI
8	Polish e‑ID: mObywatel, Profil Zaufany, mojeID, qualified signature	Strong personal identity, sometimes binding to NIP/PESEL	Proves who the person is, not necessarily their authority for a venue	Medium–high (use e‑ID app or signature)	High (contract with e‑ID provider, integration, audits)	Varies; qualified signatures and e‑ID usually per‑transaction or monthly fees; often aimed at larger services (Reasoning)	Minutes	Identity attributes (PESEL, name, sometimes e‑signature artefacts)	Used widely for public services and high‑trust private services; Profil Zaufany is the common eID today.
Documented for eID; Reasoning for applicability to UNI
9	Video verification of premises	Physical presence at premises, operations, and affiliation (access to back office, keys, systems)	Could be staged (borrowed premises), but high effort; difficult for casual fraud	Medium–high (walk around, record guided video)	High (implement video flow, manual review, privacy controls)	~0 if using generic tools, but significant time; vendors charge per session (Reasoning)	Same day to several days depending on review	Video recording showing venue, staff, possibly documents	Google uses video and live calls as main methods; others use video for KYC.
Documented for GBP; Reasoning for UNI
10	Registry cross‑check: NIP → KRS/CEIDG/REGON/VAT	Business exists, is active, matches sector and sometimes address	NIP from unrelated company; shell companies; address mismatch	Low (no extra work for owner beyond providing NIP)	Low–medium (API queries, caching)	~0 for official APIs; some commercial wrappers paid.
Instant to seconds	NIP, REGON, company name, addresses, PKD codes, VAT status, bank accounts	Used by Pyszne, Wolt, Glovo and others in their KYC flows (documented at high level).
Documented for registries; Reasoning for platform usage
11	Upload official documents (KRS extract, CEIDG printout, lease, utility bill)	Business legitimacy and sometimes link between person and company	Forged documents; outdated data; stolen PDFs	Medium	Medium (review, maybe spot‑check)	0 direct; time cost	Hours–days	Copies of documents, identities on them, addresses, NIP/KRS	Used by Facebook Business, Yelp, Google appeals, Wolt, Pyszne.
Documented
12	Self‑declaration + checkbox (“I am authorized…”)	Contractual assertion, weak technical proof	Very easy to lie; common starting point for fraud	Very low	Very low	0	Instant	Name, email, declaration text	Used by Tripadvisor, Google, many platforms as baseline.
Documented; clearly weak
You could add niche methods (e.g. credit‑card verification with small authorisation holds) but these are less relevant to UNI’s non‑transactional, low‑revenue nature.

4. Recommended risk‑based ladder for UNI
Design pattern (Documented/Reasoning)
Pattern from large platforms: Google, Bing, Yelp and others all use multiple methods with different strengths, sometimes requiring more than one method for suspicious or high‑risk cases, and escalating to document review or video when needed.

Reasoning for UNI: For a small, privacy‑aware service, you should copy the logic, not the entire stack: automatic light checks for low‑stakes actions (badge, email menu updates), stronger combined signals for panel access and visitor reports, and manual override for disputes or ownership changes.

Signal classes
Reasoning: A workable classification for UNI:

Strong signals (S):

S1: Email verification link clicked from venue‑published email address (website / Google / social profile), with matching NIP registry data.

S2: DM or bio code coming from venue’s official Instagram/Facebook profile already stored in UNI, plus NIP registry match.

S3: Website file/meta‑tag verified on venue’s official domain already in UNI, plus NIP registry match and REGON local unit address matching venue.

S4: Claimant’s name matches board member or prokurent in KRS for the claimed NIP, and one of S1–S3 also holds.

Medium signals (M):

M1: Claimant email domain matches venue website domain; NIP registry shows company with plausible PKD for hospitality.

M2: Automated phone call/SMS to venue’s public phone succeeds; claimant enters correct PIN; NIP registry match.

M3: REGON local unit with venue address linked to claimed NIP, but no strong channel control yet.

M4: CEIDG entry showing sole trader name matching claimant, plus reasonably matching address or social profile.

Weak signals (W):

W1: NIP passes checksum and registry says business exists (basic KRS/CEIDG/VAT).

W2: Claimant role self‑declared as “owner” or “manager” without any external proof.

W3: Claimant email is generic Gmail; no domain match; no registry tie beyond NIP.

W4: Facebook/Instagram handle supplied only by claimant, not seen in venue’s independent presence.

Ladder for today (badge + email menu changes)
Goal: 10 requests/day, <2 minutes of admin time each, with minimal burden for venues.

Reasoning, informed by patterns above:

Auto‑approve for badge and email‑based menu changes only when:

You have at least one Strong signal, OR

You have two independent Medium signals and no conflict flags.

Examples:

Email link clicked from venue‑published address + NIP registry match (S1).

DM code from official Instagram + REGON local unit match (S2+M3).

Website meta‑tag verified + NIP/VAT bank account match (S3+M3).

Require manual quick review when:

Only one Medium signal and otherwise weak signals, OR

Registries show mismatch (NIP belongs to different sector, city or legal name).

Manual review for now can be: glance at venue website/Instagram to confirm the person appears plausible (same name in “contact”, same email, etc.), then approve for badge only or reject if something is clearly off (e.g. NIP of a construction firm claiming a bar).

Reject outright when:

NIP is invalid or belongs to a company clearly unrelated to hospitality or the venue city, and no strong channel control is shown (only W signals).

Claimant tries to claim multiple unrelated venues across cities with one NIP where registries do not show multiple local units.

Every auto decision should have no single weak signal as its only basis (aligns with your “no automated decision on a single weak signal”).

Ladder for future owner panel (menu editing + visitor reports)
Reasoning: Because menu and analytics change what visitors see and market intelligence that may later be sold, require stronger combinations:

Auto‑approve owner panel only when:

S1 or S2 or S3 is present AND

Either S4 (claimant in KRS as board/prokurent), OR M3/M4 (REGON/CEIDG address match) AND no clear conflicts.

Otherwise:

Approve badge‑only and keep owner panel “pending”; invite venue to complete stronger verification (e.g. website tag or social DM) at their convenience.

This builds a bridge: venues can get immediate value (badge, easier menu updates via email) with light signals, but full self‑service editing and reports wait for solid evidence.

Scaling from 10 to 50 requests/day
Reasoning:

At ~10/day:

Implement registry lookups and basic email/social verifications, manual review for edge cases and disputes.

Use a simple score (S/M/W) and show it in your admin UI to support quick decisions.

At ~50/day:

Consider automating the “low‑risk badge approvals”: if S1–S3 hold and no conflict flags, auto‑approve badge; admin only reviews panel access and conflicts.

Integrate a telephony provider for occasional PIN calls to venue public numbers for edge cases (M2).

Start logging risk features (multiple venues claimed, mismatched addresses) to auto‑route suspicious requests to manual review.

5. Should approval differ by what is granted?
Roles and scopes (Documented/Reasoning)
Patterns from major platforms:

Google uses Owner vs Manager vs Primary Owner, limiting who can add users or transfer ownership.

Meta uses portfolio‑level Admin/Employee and asset‑level roles (content, messages, ads, insights).

Tripadvisor and Yelp treat claiming a listing as distinct from editing it, with higher friction for initial claim.

Reasoning for UNI:

Badge + email menu changes:

This is low‑stakes: menu errors affect experience but are still manually mediated, and analytics are not exposed.

A combination of Medium signals can suffice, with owner vs manager vs agency not fully distinguished yet.

Owner panel (editing public drinks + seeing visitor reports):

This is higher‑stakes—affects UNI’s core promise and provides potentially sensitive business insight.

Require strong signal combinations (S1–S4) and treat this role as “Owner” in platform terms.

Employees and agencies:

Mirror Google/Meta: UNI should let the verified Owner add Managers (employees who can edit menus but not analytics) and Agencies (accounts that only see visitor reports and maybe insights, but cannot edit drinks).

UNI itself should not approve agencies directly; instead, it approves the Owner, and the Owner delegates. This keeps responsibility with the venue and aligns with patterns recommended for GBP and Meta.

So: yes, approval should differ by what is granted. The owner panel merits stronger checks than the badge, and delegated roles for employees/agencies should be narrower and controlled by the owner, not UNI.

6. Lifecycle: re‑verification, changes of hands, disputes, revocation
How big platforms handle it (Documented)
Ownership transfer & disputes (Google):

Request‑access flows send emails to current owners; they get 3–7 days to respond, after which the requester can escalate with documentation.

Google can reassign ownership after reviewing business registration, utility bills, leases, signage photos.

Already‑claimed listings (Apple, Yelp, Tripadvisor):

Apple: “This location is already managed” → request transfer or join team; Apple may step in.

Yelp: “Already claimed” listings require contacting the current owner or Yelp support for help.

Tripadvisor: verification codes go to hotel’s public phone; support can help with disputed verification.

Minimum for UNI at day one
Reasoning:

Re‑verification trigger conditions:

Significant changes: venue name, city, or NIP changes in your data; multiple ownership claims over months.

Regulatory triggers: if you later add paid reports, you may want to re‑verify owners of paid panels.

Ownership change flow:

When a new claim arrives for an already owner‑managed venue, automatically:

Notify current owner by email (and ideally by in‑panel notification) with a 7‑day window to respond—approve, contest, or ignore (mirroring Google).

If the current owner approves, treat it as a handover; if they contest, route to manual review; if they ignore, require strong signals and documentation from the new claimant before overriding.

Disputes:

For small venues, manual review is acceptable: compare NIP registry data, signage, website, social profiles, and ask for documents (lease, registration extract) before deciding.

Document decisions and keep an internal audit trail (who, when, what evidence).

Revocation:

Remove owner status when:

Owner asks to close venue or relinquish;

Your own evidence shows venue closed;

Proven fraud (e.g. competitor impersonation).

Day‑one features can be simple: request‑access email to current owner, a 7‑day waiting period, and manual admin ability to switch owner or revoke panel access.

Features that can wait:

Automated detection of suspicious patterns (multiple venues per NIP, repeated disputes).

Scheduled re‑verification (e.g. every 2–3 years) unless a major change is detected.

Complex appeal procedures; for now, UNI can be informal but clearly documented in its terms.

7. GDPR consequences of each method
Lawful basis and minimisation
Reasoning with light support from public data:

Lawful basis:

UNI’s verification is part of providing the service and protecting visitors and venues against fraud, so legitimate interest (Art. 6(1)(f)) is appropriate: interest in accurate listings and preventing impersonation and misuse of analytics.

For any paid reports later, contract (Art. 6(1)(b)) may apply to processing needed to fulfil that contract.

Data minimisation (Art. 5(1)(c)):

Each method should collect only what is needed to decide whether the claimant can manage the venue.

Registries: NIP, REGON, names, addresses, PKD, VAT bank accounts — all public anyway, but you should not store more than necessary (e.g. no need to duplicate full registry dumps; cache minimal fields).

Communications: store only codes and timestamps, not full DM bodies, if feasible; or strip content after verification.

Method‑specific implications (Reasoning)
Email and domain checks:

Data: email addresses, domain, logs of verification clicks.

Minimisation: store the address and verification status, not the content of emails beyond technical metadata.

Social DMs and bio codes:

Data: social handle, code, timestamp, possibly DM content.

Minimisation: design flows where the DM is structured (“send code XYZ”), so UNI does not need to retain personal chat content; or delete DM content after marking verification success.

Website tags/files:

Data: URL and token; no personal data if done properly.

GDPR impact is minimal; mainly IP addresses in logs, which are standard.

Phone calls/SMS:

Data: phone number, call/SMS logs, possibly recordings.

Minimisation: keep numbers and verification events, delete any call recordings not needed; avoid collecting call content unless necessary.

Postcards:

Data: postal address, code.

Minimisation: necessary to prove presence; retention can be short (you can discard lists of sent codes after a verification window).

Bank micro‑transfers:

Data: bank IBAN, transaction metadata, amount, code.

Minimisation: this is heavier and introduces financial data; you’d need a robust lawful‑interest balancing test and to ensure flows are secure and limited. Privacy impact is substantial compared to your low‑stakes use.

Polish e‑ID / signatures:

Data: identity attributes (name, PESEL), e‑signature data.

Minimisation: strong identity is likely overkill for UNI’s purpose and would impose more obligations (data‑protection impact assessments, stronger security). Use only if you have a compelling reason, which at present you do not.

Video verification:

Data: images of premises, possibly staff and customers, documents visible in frames.

Minimisation: you should avoid capturing faces where possible and set strict retention (e.g. keep video only as long as necessary to rule on the claim). Google advises avoiding faces in video partly for privacy reasons.

Your specific phone‑number question
Reasoning, grounded in typical GDPR practice:

You collect an optional claimant phone number whose declared purpose is contact about the request, not verification.

This is justified if:

You actually use it sometimes to contact claimants about clarifications, disputes, or changes (even if rare).

You document the purpose in your privacy notice.

Retention is limited (your plan to empty contact columns 12 months after decision is a good minimisation measure).

So your preference to keep the optional phone field is defensible provided you document its purpose clearly and use it occasionally (or at least keep open the option to move some verification steps to phone later). You do not need to remove and rebuild it now purely for GDPR reasons.

8. How common is ownership fraud, and what does it look like?
Evidence from Google and others
Hijacks via ownership requests (Documented/Observed):

Guides and community posts describe attackers submitting ownership requests for GBP listings, waiting out the 3–7 day window, and gaining control when owners ignore emails.

Once in control, they can change phone numbers, websites, hours, or even mark the business closed.

Unauthorised edits (Documented):

Google explicitly allows any user to suggest edits; one study notes that about 20% of suggestions go through without owner approval, leading to unwanted changes in hours or phone numbers.

Agency and employee issues (Observed):

Articles highlight cases where agencies or ex‑employees retained primary owner status and refused to transfer, effectively holding the listing hostage until Google intervenes.

Patterns on Yelp and others (Observed):

Academic work focuses more on fake reviews than on listing hijacks, but operational guides emphasise phone‑verification and document checks to prevent fraudulent listings.

Sizing the risk for UNI (Reasoning)
UNI is niche, Polish‑language, and focused on non‑alcoholic drinks, which reduces the incentive for sophisticated fraud compared to GBP or Yelp.

However, the local competitor / grudge scenario is realistic: someone could claim a venue to worsen its menu or read visitor reports for intelligence.

Given documented GBP issues where hijacks are serious but not endemic, treating fraud as a real but moderate risk is reasonable: worth defending against, but not requiring biometrics or heavy KYC for all venues.

9. What to build first, and what to add later
Launch phase: 60–70 venues, few claims per week
Reasoning tailored to UNI and your constraints:

Build:

Registry layer (low effort, high value):

On every claim, automatically query VAT white list, REGON (BIR1), and CEIDG/KRS by NIP to confirm: business exists, active, plausible PKD, and addresses reasonably match venue city.

Channel‑control verification via email and social:

For each venue you already list, scrape/record its official email, website, and social handles from its public presence at data‑entry time.

On claim: send a verification link or code to the venue‑published email (not the claimant’s typed email); optionally offer a social‑code flow (put code in Instagram bio or send DM to UNI account).

Mark claims with S/M/W signals based on results.

Simple admin UI with scoring:

Show NIP registry results, channel‑control outcomes, and claimant details.

Use a clear label: “Strong / Medium / Weak”; require at least Medium+Medium or Strong for approvals even at low volume.

Ownership dispute flow (basic):

For already owner‑managed venues, on new claim send an email to current owner with a 7‑day response window before you consider changing ownership.

Leave for later:

Telephony (PIN calls/SMS) and postcards; they add complexity and cost that you don’t need at a handful of claims per week.

Bank micro‑transfers and e‑ID; disproportionate to the stakes and privacy constraints.

Growth phase: ~10 owner requests per day
Add:

More automation:

Automatically approve badge when S1–S3 or S+M combos hold and there are no conflict flags (duplicate NIPs, mismatched addresses).

Automatically reject clearly mismatched NIPs (wrong sector or region).

Owner panel gating:

Require S1–S3 plus either S4 or M3/M4 before enabling menu editing and visitor reports.

Implement delegated roles: Owner (full panel), Manager (menu only), Agency (analytics only), all created by the Owner, not UNI.

Light telephony for edge cases:

Use a pay‑as‑you‑go EU telephony API to send PINs to venue public numbers for puzzling claims (e.g. Gmail claimant, no website, Instagram‑only presence).

Policies and documentation:

Publish a clear verification and ownership policy in Polish, describing signals, dispute flow, and privacy handling.

Internally, document how you score signals and when you escalate to manual review.

At 50+ requests/day, consider:

Tightening auto‑approval rules;

Adding simple machine‑aided risk scoring (e.g. number of venues claimed per NIP per month);

Possibly partnering with a light KYC/KYB provider that wraps Polish registries in a simpler API, if your own implementation becomes burdensome.

10. Things you haven’t asked about but should consider
Reasoning:

Terms of service & liability: Clearly state that UNI is not a transactional platform and that owners are responsible for truthfulness of menus; this limits your exposure if fraudulent claims slip through.

Audit trails: Store who changed what when in venue menus and analy­tics access; this is vital if a venue later contests a change or you need to investigate abuse.

Abuse of reports: Decide whether visitor reports show comparisons with nearby venues; this may raise competitive‑intelligence concerns. Consider limiting competitor data or aggregating.

Abandoned accounts: Implement measures for inactive owners (no login for X months) where you may downgrade access or require re‑verification before re‑opening the panel.

International expansion: If UNI extends beyond Poland, your registry‑based methods will need updating; design the verification layer with pluggable country modules.

