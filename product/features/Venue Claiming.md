# Venue Claiming

**Status:** **Rewritten 2026-09-19 to match the code.** Owners ask at `/zglos-lokal` (behind `UNI_OWNER_ACCESS`), or an admin records a claim in `/admin`. How a request is checked and approved is in [[product/features/Owner Verification]]. The decisions: [[decisions/product/one-request-form-for-owners]], [[decisions/product/owner-requests-are-checked-through-the-venues-own-channels]], [[decisions/product/new-venue-requests-create-no-venue]], [[decisions/product/an-owner-can-have-several-claims-waiting]].

## Flow
1. The owner finds their venue on its page ("To Twój lokal? Zarządzaj nim samodzielnie w panelu lokalu") or reaches `/zglos-lokal` from the footer.
2. **"Przejmij profil"**: they search for their venue and pick it. **"Dodaj nowy lokal"**: they describe a venue UNI does not list.
3. They give their name, role, e-mail and the NIP of the business. No account is created, no phone is asked.
4. The owner check starts: the NIP is looked up in the registries, and they are told how to confirm — a link if their e-mail belongs to the venue, a code to send from the venue's Instagram otherwise.
5. The admin approves in `/admin` → Zgłoszenia once a channel is confirmed (or writes why not).
6. Approval makes or finds the account by the request's e-mail; with owner access on, a set-password link follows and the owner reaches the [[product/features/Owner Dashboard]].

## If the venue doesn't exist
The request creates no venue. The admin finds the venue independently, adds it in "Lokale" with its own e-mail, website and Instagram, links it on the request, and only then can approve. A venue reaches the map once it has at least one non-alcoholic item.

## Claim Statuses
- `pending` — submitted, awaiting admin review
- `approved` — owner has full dashboard access
- `rejected` — proof insufficient, can resubmit

## What is deliberately manual
- Every approval and rejection — nothing is decided automatically
- A claim on a venue that already has an owner (see [[product/features/Owner Verification]])
- One owner per venue; one owner may hold many venues (chains)
- Unclaimed venues exist as catalogued data

## Anti-Abuse
- One account can hold several venues, and wait on several requests at once (chains)
- Rejected claims logged for pattern detection
- Admin can revoke ownership if abuse detected
