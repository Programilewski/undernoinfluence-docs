# Owner Verification — how a request to manage a venue is checked

**Status:** Built 2026-09-19, behind `UNI_OWNER_ACCESS`. Owner access is switched on only once this exists and the checklist at the end is done ([[decisions/product/owner-access-opens-only-once-owners-can-be-checked]]). The decision behind it: [[decisions/product/owner-requests-are-checked-through-the-venues-own-channels]]. The research it rests on: `roadmap/research-results/owner-verification.md` and `owner-verification-other-llm.md`, assessed in the 19.09 journal.

---

## The one idea

**A request is approved when the person proves they control a channel the venue itself publishes — one they did not type into our form.** The venue's own e-mail, an e-mail on the venue's own website domain, the e-mail the company registered in KRS, or the venue's Instagram account. Nobody is phoned.

The public registries (the VAT white list and KRS) are **background, never proof**. A NIP is public, and so are the names of a company's board. What the registries do well is show a contradiction: a business that was removed, a NIP from another city, a claimant who is nowhere near the company.

**A request grants nothing.** You approve, every time. Nothing is approved or rejected automatically.

---

## What happens when a request arrives — automatic

An owner sends the form at `/zglos-lokal` (either tab). Three things happen on their own:

1. **The NIP is looked up** in the background. The VAT white list gives the business's name, VAT status, address and, for a company, its KRS number; KRS then gives the company's registered e-mail and website, and its board and proxies — with names **masked** (first letter and length, e.g. "A*** N****"). The result is saved on the request. If a registry does not answer, it is asked again over about an hour; the form never fails because of it.
2. **The claimant gets one e-mail**, and the page they land on says the same thing:
   - **Path A — a link.** If their e-mail is the venue's recorded e-mail, or on the venue's recorded website domain, they get a link: *"Potwierdź zgłoszenie"*. Opening it shows a button; pressing the button confirms. (The button exists because mail scanners open every link in a message — a link that confirmed on opening would confirm requests nobody read.) The link lasts 7 days.
   - **Path B — a code.** Otherwise they get a code such as `UNI-4821` and are asked to send it as a message **from the venue's Instagram** to UNI's Instagram account. If the venue has no Instagram, they are told to write to kontakt@undernoinfluence.pl.
3. **The request appears in `/admin` → Zgłoszenia**, with two badges: **"Kanał lokalu"** (confirmed or waiting) and **"Rejestr"** (what the registries said).

**After 14 days still pending**, its status reads **"Czeka ponad 14 dni"** (there is a filter for them), and the next morning at 08:00 every admin gets one e-mail naming it — once per request. Nothing is rejected automatically ([[decisions/product/a-waiting-request-is-flagged-never-rejected-automatically]]).

Free mailboxes — Gmail, WP, Onet, Interia, o2, Outlook and the like — never count as "the venue's domain", whatever the venue's website is.

---

## What you do — about a minute per request

Open the request. The **"Weryfikacja właściciela"** section shows everything in one place: the channel status, how this claimant can confirm, the business in the registry, its address (and whether it matches the venue's street), whether the claimant appears among the people who can act for it, the company's KRS e-mail and website, and the people the registry lists.

### If they took path A (the link)

Nothing to do until they click. When they do, "Kanał lokalu" turns green: *"E-mail lokalu zapisany w UNI"*, *"E-mail w domenie strony lokalu"* or *"E-mail firmy z KRS"*.

### If they took path B (the Instagram code)

1. Open UNI's Instagram inbox (message requests included — a first message from an account you don't follow lands there).
2. Find the message with their code.
3. **Check who sent it.** It must be the account recorded on the venue in UNI — the request page shows it (e.g. *"@semolino.bar"*). An account with a similar name is not enough.
4. Press **"Potwierdź wiadomość z Instagrama"**, tick the box saying the message came from the recorded account, confirm.

If the venue has **no Instagram recorded**, the button is greyed out. Find the venue's Instagram yourself — on its own website or its Google Maps listing, **never from the request** — save it on the venue in "Lokale", and the button works.

### If the registry reveals a match later

Sometimes the claimant's address turns out to be the company's own KRS e-mail, which is only known after the lookup. Then **"Wyślij link potwierdzający"** appears on the request: press it, and they get path A's link.

### Deciding

| What you see | What to do |
|---|---|
| Channel confirmed, registry consistent (business active, plausible address or name) | **Approve** |
| Channel confirmed, registry says "Zgłaszającego brak" | Usually **approve** — a manager or employee is rarely on the board. The channel is the proof |
| Channel confirmed, but the registry contradicts (business removed, a construction company, another city) | **Ask** before approving — write to the claimant |
| **"Czeka ponad 14 dni"** — flagged in the list, and you get a morning e-mail about it once | If the channel is still unconfirmed: **look in UNI's Instagram inbox first** — the code may have arrived and not been matched. If it hasn't, **reject** by hand: *"Nie udało się potwierdzić, że zgłoszenie pochodzi z lokalu."* They can send a new one. If the channel is confirmed, it is waiting on your decision |
| NIP unknown to the registry | Check the NIP by hand; a typo is common. Reject if it doesn't resolve |
| "Rejestr nie odpowiedział" | Press **"Sprawdź NIP w rejestrach"** later. The white list allows 100 lookups a day |

### Approving without a confirmed channel

Sometimes you know the owner by other means — a chain writing from its headquarters' domain, an owner you met in person. **"Zatwierdź"** then asks *"Dlaczego zatwierdzasz bez potwierdzenia?"* and will not proceed without an answer. The reason is stored in the audit log with the approval. Use it for real exceptions: every one is a request nobody proved.

---

## A venue UNI does not list yet

A new-venue request arrives with **no venue** and always on path B (the code), because UNI has no recorded channels for a venue it has never seen. Everything the claimant typed — including the website or Instagram they gave — proves nothing on its own.

1. **Find the venue yourself**: its own website, its Google Maps listing, its Instagram. Check it exists and serves something without alcohol.
2. **Add it in "Lokale"** from what you found — including its e-mail, website and Instagram, taken from its own presence.
3. **Link it on the request** ("Lokal" field) and save.
4. Now the request behaves like any other: the Instagram button works against the account you recorded, and if the claimant's e-mail matches what you recorded, "Wyślij link potwierdzający" appears.

---

## A venue that already has an owner

The form refuses a second request for a venue that is managed or has a request in progress, and tells the person to write to kontakt@undernoinfluence.pl. **Handled by hand, for now:**

1. Write to the current owner at their account's e-mail: someone says they run the venue — is that right?
2. Wait **7 days**.
3. **Whatever the answer — or no answer — you decide.** Silence is never a handover: letting a listing change hands when the owner ignores an e-mail is exactly how Google listings get hijacked.
4. The new person goes through the same check (their channel, the registry) before anything changes.

Automating this — the form accepting such a request and notifying the owner itself — is deferred until disputes actually happen.

---

## Chains

One account may have any number of requests waiting, and a venue joins an existing owner's account on approval ([[decisions/product/an-owner-can-have-several-claims-waiting]]). For a chain that contacts you directly: record the claims in the admin, and approve each with the reason *"Sieć — e-mail z domeny centrali, …"* once you have confirmed the headquarters' domain against KRS. A one-step bulk path waits for the first real chain.

---

## What the registries can and cannot tell you

| Registry | What it gives | Limits |
|---|---|---|
| **VAT white list** (Ministry of Finance, `wl-api.mf.gov.pl`) | Business name, VAT status (active / exempt / removed), address, REGON, KRS number; partners of a civil partnership by name | Free, no key. **100 lookups a day**, then locked until midnight. A sole trader's business name usually includes their own name — that is where "Zgłaszający w rejestrze: Tak" comes from |
| **KRS** (Ministry of Justice, `api-krs.ms.gov.pl`) | For companies: registered e-mail and website, address, board and proxies | Free, no key. **Names are masked** — first letter and length only — so the best it can say is "Możliwe" |
| CEIDG, REGON (not used yet) | Sole traders' details; a company's local units with their own addresses | Both need a key (CEIDG through Profil Zaufany, REGON by e-mail). Worth adding if many requests come from sole traders outside VAT, or if linking a company to the venue's street becomes important |

The registry result is personal data (it names the business and the people who may act for it) and is emptied together with the request's contact details, 12 months after the decision.

---

## Before switching owner access on

- [ ] **UNI's Instagram account exists**, and `UNI_INSTAGRAM_HANDLE` is set on the server (without the @). Without it, path B sends people to the contact address instead — it works, but slowly.
- [ ] **Mail and a queue worker are running** — the lookup and the e-mails are queued.
- [ ] Try it once end to end on the home server: a request with the venue's own e-mail (path A), and one with a Gmail address (path B).
- [ ] The rest of the V2 opening list in [[decisions/product/owner-panel-ships-behind-one-switch]].

---

## Where it lives

| Piece | File |
|---|---|
| The lookup | `App\Services\Registry\VatWhiteList`, `KrsRegistry`, `App\Support\RegistryFindings`, `App\Services\Actions\LookUpClaimRegistryAction`, `App\Jobs\LookUpClaimRegistry` |
| Which e-mail counts as the venue's | `App\Support\ClaimChannels` |
| The e-mail to the claimant | `App\Notifications\ClaimReceived` |
| The link's page | `App\Http\Controllers\VenueRequestConfirmationController`, `venues/request-confirm.blade.php` |
| Recording a confirmation | `App\Services\Actions\ConfirmClaimChannelAction` |
| The admin | `VenueClaimForm` ("Weryfikacja właściciela"), `EditVenueClaim` (the three buttons), `VenueClaimsTable` (badges, approval) |
| The gate | `ApproveVenueClaimAction` — refuses an unconfirmed request without a reason, whoever calls it |
| Waiting too long | `VenueClaim::scopeWaitingTooLong()`, the status badge and filter in `VenueClaimsTable`, `uni:remind-waiting-claims` (`RemindWaitingClaims`, daily 08:00), `WaitingClaimsReminder` |
| Tests | `tests/Feature/Owner/OwnerCheckTest.php`, `WaitingClaimsTest.php` |
