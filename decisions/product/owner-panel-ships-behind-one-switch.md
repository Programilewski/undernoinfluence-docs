# The owner panel is built complete now, and V2 begins by switching it on

**Date:** 2026-09-18
**Status:** Decided
**Executed:** 2026-09-19 — built 18.09, extended 19.09 (see "What the switch governs"); `UNI_OWNER_ACCESS` is off in V1
**Area:** UI/UX | Venues | Strategy

---

## Problem

The owner panel had been built, hidden, un-hidden and hidden again, and on 17.09 `v2-work-is-not-built-early` concluded that V2 features should not be built early, flag or no flag. But opening V2 as a fresh build means the first owner who asks waits for one, and the panel had quiet gaps nobody would meet until then: the admin had to choose and hand over every owner's password, the dashboard showed a single venue, and the privacy policy described owner accounts that V1 does not have.

## Options considered

Build owner features when V2 arrives, as the 17.09 rule says. Build them now and hide them behind `UNI_OWNER_ACCESS`. Build only what cannot be backfilled.

## Decision

Paweł: *"have all the owner panel functionality working even before V1, but hidden, gated behind that env variable. Once we move to V2, I want it to be that switch and it should all work."* Everything an owner needs is built now and reads one switch, so that V2 is `UNI_OWNER_ACCESS=true`, not a project. It must also be switchable in local development for testing.

## Rules

Every owner surface reads the same `App\Support\OwnerAccess::isOpen()`: the panel itself, the claim request form and its link, and the privacy policy's sentences on owner accounts, claims and their e-mails. With it off they do not exist: a 404, not a 403, and no text. Anything behind the switch is maintained as if it were live, so its tests run with the switch on and `OwnerAccessIsClosedInV1Test` pins the default. On the day V2 opens: **first, the owner check must exist** ([[decisions/product/owner-access-opens-only-once-owners-can-be-checked]], added 19.09); then switch it on, update the policy's date line, have mail and a queue worker running, and keep `/panel` outside the admin allowlist. Other V2 features are not covered by this until Paweł decides them one by one.

## What the switch governs

**Renamed 2026-09-19:** `UNI_OWNER_PANEL` became `UNI_OWNER_ACCESS` (`config('uni.owner_access')`), because by then it governed the forms, links, policy text and e-mails as well as the panel. Code reads it only through `App\Support\OwnerAccess::isOpen()`, so the name lives in one place. A server `.env` still carrying the old name reads as off — the rename fails closed.

Amended 2026-09-19 — the list the Rules above promise, in one place. Anything owner-facing that is added later goes into this table in the same change, and reads the same switch.

| Surface | Switch off | Switch on | Where it reads the switch |
|---|---|---|---|
| The owner panel, `/panel` — sign-in, password reset, dashboard, venues, profile, two-factor | 404 | Open | `EnsureOwnerAccessIsOpen`, first middleware of the owner panel |
| The owner request form, `/zglos-lokal` — both tabs, and its venue search `/zglos-lokal/szukaj` | 404 | Open | Same middleware, on the routes in `routes/web.php` |
| The confirmation link's page, `/zglos-lokal/potwierdz/{claim}` (signed) | 404 | Open | Same route group |
| The e-mail telling a claimant how to confirm (`ClaimReceived`) | Not sent — nothing can send a request | Sent on every request, and by "Wyślij link potwierdzający" | Sent only from the form and the admin |
| Privacy policy: the registry lookup, the Instagram confirmation, and the Ministries and Meta as recipients | Absent | Present | `privacy-policy.blade.php` |
| The owner line above a venue page's "Coś się nie zgadza?" ([[decisions/product/owner-line-comes-before-corrections]]) | "To Twój lokal? Napisz, co zmienić w karcie" — opens the report form with "To mój lokal" chosen | "To Twój lokal? Zarządzaj nim samodzielnie w panelu lokalu" on a venue with no owner and no claim in progress; nothing on the others | `VenueController::show` (`isClaimable`) and `OwnerAccess::isOpen()` in `venues/show.blade.php` |
| The report modal's pointer to the request form, for "To mój lokal" | Absent | Same venues as above | `isClaimable`, passed to `x-venue-report-modal` |
| "Dla lokali: Zgłoś swój lokal · Panel lokalu" in the footer | Absent | Links to the form and the panel's sign-in | `partials/footer.blade.php` |
| The owner card on `/jak-to-dziala` | "Zgłoszenie przez e-mail" | "Zgłoszenie lub przejęcie profilu" | `how-it-works.blade.php` |
| Privacy policy: owner accounts, claim data and its retention, the claim-handling purpose, owner e-mails | Absent | Present | `privacy-policy.blade.php`, five places |
| Admin: "send a set-password link" on a user | Hidden | Shown for accounts that can use the panel | `Admin/Resources/Users/Pages/EditUser.php` |
| The claim-approval e-mail | Says what changed on the venue page and where menu changes go; no panel, no password | Sends the owner into the panel | `ClaimApproved::toMail()` |
| The set-password e-mail after approving a request | Not sent | Sent when approval made the account | `ApproveVenueClaimAction` |

**Not governed, deliberately:** recording a claim in the admin and approving it ([[decisions/product/admin-recorded-claims-v1]]), and the "Zarządza właściciel" badge, which follows an approved claim, not the switch.

## What this prevents

The first owner waiting for a build that could have been done. And the August failure, where the panel's state lived in three documents that disagreed: here there is exactly one answer to "is it exposed?", and it is in `.env`.

## Revisit when

Paweł has decided which other V2 features, if any, get the same treatment. That question is at the top of `docs/roadmap/undone-inventory.md`. Or if hidden code starts costing more than a switch saves: tests that go unmaintained behind the flag are the signal.

---

*See also: [[decisions/product/v2-work-is-not-built-early]] (superseded for the panel) · [[decisions/product/admin-recorded-claims-v1]] · [[decisions/product/claim-requests-come-from-the-venue-page]] · [[decisions/product/admin-access-is-three-layers]]*
