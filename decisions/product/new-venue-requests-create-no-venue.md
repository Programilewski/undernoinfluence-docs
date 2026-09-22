# A request for a venue UNI does not list creates no venue

**Date:** 2026-09-19
**Status:** Decided
**Executed:** 2026-09-19 — the new-venue form behind owner access, `venue_claims.venue_id` optional for `new` requests, and the admin linking step before approval
**Amended:** 2026-09-19, later the same day — the form is now the second tab of `/zglos-lokal` ([[decisions/product/one-request-form-for-owners]]), `/dodaj-lokal` is gone, a listed venue is matched by name, city **and street** so a chain's next branch is not refused, and nobody is phoned ([[decisions/product/owner-requests-are-not-verified-by-phone]]). The text below is updated to match.
**Area:** Venues | Strategy

---

## Problem

An owner could take over a venue UNI lists, from its page ([[decisions/product/claim-requests-come-from-the-venue-page]]). An owner whose venue UNI does not list had no way in at all — no page to claim from, and a contact address for guests. `claim_type = 'new'` and the `submitted_*` columns existed from June, but the validation behind them was deleted on 13.09 without ever having been wired to anything, and `venue_claims.venue_id` was required, so a request for a venue that does not exist had nothing to point at.

Paweł: *"I want it, but make sure it asks the right question to then verify it in admin."*

## Options considered

**Create a draft venue when the form is sent.** The request would point at a real row from the start. But a public form would then write venues: every spam post and every refused request leaves one behind, and removing it is a hard delete of a venue.

**Store the venue's details on the request, create nothing, and let the admin add the venue after verifying.** The admin adds venues today anyway; this only means they do it from a verified request instead of from an e-mail.

## Decision

**The request stores what the owner says about the venue and creates no venue.** After verifying the request, the admin adds the venue in "Lokale", links it on the request and approves. Until it is linked, "Zatwierdź" is not offered and `ApproveVenueClaimAction` refuses.

**The questions are the ones verification needs.** About the person, exactly what a claim on a listed venue asks — name, role, e-mail, NIP and an optional phone — because both are verified the same way. About the venue: name, city, street and number (to find it and match it against the NIP's registered address), its website or social profile (proof it exists, and where its public phone number is), **what it serves without alcohol** (a venue with nothing to list never reaches the map, so this is asked before anyone checks it), and optionally a link to its menu (to catalogue it faster).

**It is for people who run the venue.** The page says so, and sends a guest who wants to recommend a venue to the contact address.

## Rules

A venue UNI already lists under that name, in that city, on that street is not requested twice: the form turns into a claim on it, keeping what the owner typed. A second request for the same name, city and street waits for the first. The form allows five posts a minute and has the same hidden field as the other public forms. `venue_claims_venue_named_check` holds that every `existing` claim names a venue and every `new` one without a venue names the venue it asks for. The route is behind owner access like the rest of the owner side and listed in [[decisions/product/owner-panel-ships-behind-one-switch]]. `zglos-lokal` is a reserved path.

## What this prevents

Venues written by a public form, and an owner whose venue is missing having nowhere to go but an e-mail address meant for guests.

## Revisit when

~~A general `/przejmij` entry point is built.~~ Done 19.09 as `/zglos-lokal`; this form is its second tab. Revisit when verification changes what a new-venue request must ask.

---

*See also: [[decisions/product/claim-requests-come-from-the-venue-page]] · [[decisions/product/admin-recorded-claims-v1]] · [[decisions/product/owner-panel-ships-behind-one-switch]]*
