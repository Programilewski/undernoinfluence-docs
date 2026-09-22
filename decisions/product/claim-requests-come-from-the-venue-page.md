# Claim requests come from the venue page; ownership still comes from a phone call

**Date:** 2026-09-18
**Status:** Decided
**Executed:** 2026-09-18 — `/miejsce/{slug}/przejmij`, behind `UNI_OWNER_ACCESS`; approval makes or finds the owner's account by e-mail
**Superseded:** 2026-09-19, in two parts — the form moved to `/zglos-lokal`, first tab, with the venue page linking to it as `?lokal={slug}` ([[decisions/product/one-request-form-for-owners]]); and **nobody is phoned** — the call in this record's title is dropped and its replacement is being researched ([[decisions/product/owner-requests-are-not-verified-by-phone]]). What still holds: a request grants nothing, creates no account, and approval makes or finds the account by e-mail.
**Area:** Venues | UI/UX

---

## Problem

`admin-recorded-claims-v1` allowed no public claim form: an owner e-mailed, an admin phoned them, checked the NIP and recorded the claim. That keeps verification human, but it means the owner's first contact is an e-mail address rather than the venue they are looking at. Self-service claiming was deferred because it would need automated verification that does not exist.

## Options considered

Keep the e-mail route only. Self-service claiming with automated verification. A request form on the venue page, with approval still done by an admin after a call.

## Decision

A request form, behind the same switch as the rest of the owner panel. Paweł: *"I want the flow, you know, but hidden."* A request grants nothing. It records who is asking, and the admin still phones, checks the NIP and approves, so no automated verification needs to be designed.

## Rules

The link appears on a venue with no owner and no claim in progress: "Prowadzisz ten lokal? Przejmij profil". The form asks for name, e-mail, phone, NIP, role and an optional message, and says plainly that nothing changes until someone calls. A request creates no account. The account is made on approval from the request's e-mail — or, if that address already has an account, the venue joins it, which is how a chain's owner keeps one login. An administrator's address is refused. A rejection is answered at the request's own address. One active claim per venue, as before. With the switch off, neither the form nor the link exists.

## What this prevents

Accounts created by anyone who fills in a form, which would be registration under another name. Accounts left behind by rejected requests. A second login for every venue in a chain. And an approval that silently turns the admin into an owner.

## Revisit when

Requests arrive faster than one person can phone. That is the point at which automated verification — self-service approval — is worth designing.

---

*See also: [[decisions/product/admin-recorded-claims-v1]] · [[decisions/product/owner-panel-ships-behind-one-switch]] · [[decisions/product/hide-for-venues-v1]]*
