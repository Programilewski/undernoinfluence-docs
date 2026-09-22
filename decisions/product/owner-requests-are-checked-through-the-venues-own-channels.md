# Owner requests are checked through the venue's own channels, with the registries as background

**Date:** 2026-09-19
**Status:** Decided
**Executed:** 2026-09-19 — registry lookup, link and code paths, the admin's three actions and the approval gate, behind `UNI_OWNER_ACCESS`; the dispute flow stays manual
**Area:** Venues | Strategy

---

## Problem

The phone call that verified owners was dropped ([[decisions/product/owner-requests-are-not-verified-by-phone]]): it did not scale and proved little. Owner access cannot be switched on until something replaces it ([[decisions/product/owner-access-opens-only-once-owners-can-be-checked]]). Two research reports came back with a common core and three dangerous extras — approving automatically on a domain e-mail, rejecting automatically when a name is not on the KRS board, and handing a venue over when its owner does not answer within 72 hours.

## Options considered

Registries as proof (a NIP and a board member's name). Documents or identity (bank transfers, e-ID, video, uploads). Control of a channel the venue publishes. Automatic decisions on top of any of these.

## Decision

Paweł: *"build that check, but describe the process in some file. Also, what if we checked the NIP automatically on a venue claim so that I see the result of the registry lookup in the admin?"* **The proof is control of a channel the venue publishes and the claimant did not supply**; the registries are looked up automatically and shown, as background. A person approves every request. The process is in `docs/product/features/Owner Verification.md`.

## Rules

Every request is looked up by NIP in the VAT white list and, for a company, in KRS, in the background, and the result is kept on the request. A claimant whose e-mail is the venue's recorded e-mail, the company's KRS e-mail, or on the venue's or company's website domain (never a free mailbox) gets a link; opening it shows a button, and the button confirms. Anyone else gets a code to send from the venue's Instagram, and the admin confirms it only when it came from the account recorded on the venue — recorded from the venue's own presence, never from the request. A new venue's channels are recorded by the admin before any of this applies. Approval refuses an unconfirmed request unless the admin writes a reason, which is kept in the audit log; the refusal is in `ApproveVenueClaimAction`, so no button can skip it. Nothing is approved, rejected or handed over automatically; a claim on a managed venue is handled by hand, and silence is never a handover. The registry result is emptied with the contact details, 12 months after the decision. The phone field is gone from the form; the column stays.

## What this prevents

A venue owned by whoever knows its NIP. An employee or ex-employee with a mailbox on the venue's domain becoming its owner without a person looking. Legitimate managers turned away because they are not on the board. The Google hijack, where an owner who misses one e-mail loses the listing.

## Revisit when

Requests reach about ten a day — then match Instagram messages automatically through Meta's messaging API, and add the one-step path for chains. Disputes actually happen — then automate notifying the current owner. Many requests come from sole traders outside VAT — then add CEIDG.

---

*See also: [[decisions/product/owner-requests-are-not-verified-by-phone]] · [[decisions/product/owner-access-opens-only-once-owners-can-be-checked]] · [[decisions/product/an-owner-can-have-several-claims-waiting]] · [[decisions/product/one-request-form-for-owners]]*
