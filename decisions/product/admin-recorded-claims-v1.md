# Venue claims are recorded by an admin in V1, and the owner panel stays live

**Date:** 2026-08-16
**Status:** Decided
**Executed:** yes — the machinery is built and tested; the panel itself is switched off, see Superseded
**Superseded:** 2026-09-19, in part — **the admin no longer phones the claimant**; the replacement check is being researched ([[decisions/product/owner-requests-are-not-verified-by-phone]]). The public request forms of the 18.09 amendment are now one page, `/zglos-lokal` ([[decisions/product/one-request-form-for-owners]]). The heart of this record stands: a request grants nothing, and approval is a separate, audited step taken by an admin.
**Superseded:** 2026-08-18 by note O-2 (journal 2026-08-18), built 2026-09-16 — the owner panel is built but **not exposed** in V1. This record's "the owner panel stays live in V1" no longer holds; everything else in it does
**Area:** Venues | UI/UX

---

## Problem

`browse-only-v1.md` says V1 ships with no accounts and no B2B self-service, and `hide-for-venues-v1.md` says no owner claim flow exists. But the owner panel was never actually removed — `/panel` is live with a public login form, and the claim and approval machinery is intact behind it. That gap hid two defects that made the only path to becoming an owner impossible to walk: the admin user form silently discarded the role, and the panel demanded an email verification it had no page to perform. Nobody could become an owner at all, and nothing signalled it.

## Options considered

Finish the browse-only strip and remove the owner panel from V1 entirely, matching the written decision. Open public self-service claiming now, matching what the panel implies. Keep the panel, keep it admin-driven, and correct the record to say so.

## Decision

> **Amended 2026-08-18, built 2026-09-16 — the panel is not live in V1.** Note O-2 overrode the first sentence below two days after this record was written, and the addendum it asked for was never added, so for four weeks this record read as current while a journal said the opposite. `/panel` now returns 404 unless `UNI_OWNER_ACCESS=true`. **Everything else here stands**: when the panel opens, owner accounts are still admin-created, recording a claim still grants nothing, and approval is still a separate audited step. The trigger to open it is an event, not a date — the first venue owner who asks for an account, which is the demand signal `browse-only-v1` exists to measure.

The owner panel stays live in V1 and owner accounts are created by an admin, not by the owner. An admin verifies the owner out of band — NIP, role, phone — then records the claim in the panel and approves it as a separate audited step. This is the middle ground the code already implemented but the documents denied: V1 has no *self-service* claiming, which is not the same as having no owner accounts. `browse-only-v1.md` remains correct about public registration and is amended only on this point.

> **Amended 2026-09-18 — complete behind the switch, so V2 is one line in `.env`.** Paweł wants the panel finished now and opened by `UNI_OWNER_ACCESS=true`, not built when V2 arrives (this supersedes `v2-work-is-not-built-early` for the panel). Built today, all behind the switch:
> - **Owners set their own password.** The admin makes the account without one (a random password nobody knows) and sends a set-password link from the user's page; the login offers "forgot password". The admin never chooses or passes on an owner's password. The send is audited (`owner_password_link_sent`).
> - **Optional two-factor sign-in** on the owner's profile page, never required (admin-access-is-three-layers). The e-mail there is read-only: it is what the admin verified.
> - **One owner, several venues.** The dashboard offers a choice of venue when there is more than one; the admin user list shows every venue an owner holds.
> - **The privacy policy** describes owner accounts, claims and their e-mails only while the switch is on.
>
> The owner-side "claim a venue" page stays unreachable, as this record intends: only owners enter the panel, and self-service claiming waits for its own verification design. `Venue::createFromClaimSubmission()` — a leftover of an earlier new-venue claim flow, called by nothing — was deleted.
>
> **On the day V2 opens:** first, the owner check must exist (added 19.09, [[decisions/product/owner-access-opens-only-once-owners-can-be-checked]]); then set `UNI_OWNER_ACCESS=true`; update the privacy policy's date line (its owner sentences appear with the switch); mail and a queue worker must be running (the set-password, claim and erasure e-mails are queued — deploy checklist A2, B2, B3); `/panel` stays outside the admin allowlist. To try it locally, set the same variable in `.env` and run `composer run dev`, which includes the queue listener; mail goes to the log.

> **Amended 2026-09-18, later the same day — a claim *request* form, behind the same switch.** Paweł: *"can we tick a request for a claim form already and be able to hide it before V2 in the same fashion? I want the flow, but hidden."* This supersedes, in part, the rule below that there is "no public claim form" and that public copy points owners only at the e-mail address — **once the panel is on.** What does not change is the heart of this record: **a request grants nothing, and approval is still a separate step taken by an admin after phoning the claimant and checking the NIP.** So this is not the self-service claiming the revisit clause defers; there is no automated verification to design.
> - **The form** lives at `/miejsce/{slug}/przejmij`, linked from the venue page as "Prowadzisz ten lokal? Przejmij profil" when the venue has no owner and no claim in progress. It asks for name, e-mail, phone, NIP (checksum-validated), role and an optional message; has the report form's hidden-field trap and its rate limit; and records a pending claim with **no account** (`venue_claims.user_id` became nullable) and `verification_method = phone`. With the switch off the page and the link do not exist (404).
> - **Approval** finds the owner's account by the request's e-mail — so a chain's second venue joins the account the owner already has — or makes one with a password nobody knows and sends the set-password link. It refuses an e-mail that belongs to an administrator, which would otherwise turn the admin into an owner. **Rejection** answers the request's own address.
> - **The privacy policy** (its owner sentences, behind the switch) now says claims arrive by form or by admin, that they carry the NIP and role, and when the contact data is cleared — 12 months after the decision, or after ownership ends — which the earlier sentence ("until the venue or account is deleted") had wrong.

## Rules

There is no public registration and no public claim form; the only route to an owner account runs through an admin. Recording a claim never grants anything — approval is a separate step, and it alone sets the owner on the venue and changes the account role. A venue that is already live stays live when claimed; approval never pulls it off the map. Deleting an owner account releases its venue, which clears the public badge and returns the venue to the claimable pool. Public copy still points venue owners at the contact email, never at a form. Every claim carries a NIP and a claimant role, because those are what the admin verified.

## What this prevents

An automated claim flow at fifty venues would need three independent verification signals to be trustworthy, and would still be slower and weaker than one phone call. It also prevents the failure that was already live: a documented "no owner flow" that was actually a half-built one, where nothing worked and nobody noticed because zero claims looked like zero demand rather than zero possibility.

## Revisit when

Inbound owner interest exceeds what one person can process by phone — that volume is now measurable for the first time, since the path finally works. Self-service claiming is a V2 feature gated on the three-signal verification test.

---

See also: [[decisions/product/browse-only-v1]], [[decisions/product/hide-for-venues-v1]], [[decisions/product/email-verification-deferred-to-v2]], [[decisions/product/venue-activation-gate]]

*18.09 decisions in their own records: [[decisions/product/owner-panel-ships-behind-one-switch]] and [[decisions/product/claim-requests-come-from-the-venue-page]].*
