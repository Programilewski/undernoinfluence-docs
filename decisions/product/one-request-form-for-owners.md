# One request form for owners, with two tabs and a search that picks between them

**Date:** 2026-09-19
**Status:** Decided
**Executed:** 2026-09-19 — `/zglos-lokal` behind owner access, replacing `/miejsce/{slug}/przejmij` and `/dodaj-lokal`; `VenueRequestController`, `StoreVenueRequest`, `resources/js/venue-request.js`
**Area:** Venues | UI/UX

---

## Problem

By the morning of 19.09 an owner had two forms: a claim form reached only from the venue's own page ([[decisions/product/claim-requests-come-from-the-venue-page]]), and a new-venue form reached from the footer ([[decisions/product/new-venue-requests-create-no-venue]]). They asked for the same things about the person, twice, in two places. And an owner arriving from search or Instagram rather than from the venue page had to know which of the two applied — whether UNI already lists their venue — before they could start.

Paweł: *"what if we just had one form for adding a new venue, but just have two tabs, one is for claiming an existing venue and second for adding a new one?"*

## Options considered

**Two tabs the owner chooses between.** Simple, but it asks the owner to guess. A wrong guess on "add new" means typing the whole venue section before the duplicate check sends them back.

**One page where a search decides.** The owner types their venue's name; picking a result makes the request a claim, and "not on the list" opens the new-venue fields. No tabs.

**Both: two tabs, with the search as the first tab's content.** Paweł: *"go with that one form with two tabs and the search you proposed."*

## Decision

**One page at `/zglos-lokal`, "Prowadzisz lokal?", with two tabs: "Przejmij profil" and "Dodaj nowy lokal".**

- **"Przejmij profil"** opens on a search over the venues UNI lists, by name or street. Each result shows the address — a chain's branches differ only there — and says when a venue already has an owner or a request in progress. Picking one fixes it on the form; "Zmień" goes back to the search. A search that finds nothing offers "Dodaj nowy lokal", carrying the typed name into the other tab.
- **"Dodaj nowy lokal"** asks what the new-venue form asked: name, city, street and number, website or social profile, what it serves without alcohol, and optionally a menu link.
- **The owner's own fields sit below both tabs**, typed once whichever tab is sent.
- **From a venue page** — the "Przejmij profil" link and the report modal's pointer — the owner arrives as `/zglos-lokal?lokal={slug}`, with the venue already picked. The footer's "Dla lokali" row links to it as "Zgłoś swój lokal".

## Rules

- One POST, with `request_type` `existing` or `new`. Validation drops the other tab's fields (`exclude_unless`), and the browser disables them, so a half-filled hidden tab is neither required nor stored.
- **A new-venue request for a venue already listed at the same name, city and street becomes a claim on it.** The page reopens on the first tab with that venue picked and everything typed kept. Name and city alone are not enough: they would turn away the next branch of a chain. "ul. Chmielna" and "Chmielna" are the same street, and the prefix is not stored.
- A pending new-venue request for the same name, city and street waits for the first.
- Search: at least two characters, eight results, active non-canary venues only, sixty searches a minute per address. It returns only what the map already shows, plus whether the venue can be taken over — which the venue page shows too.
- The form allows five posts a minute and keeps the hidden-field trap. The page is `noindex`.
- The claimant's phone number is **optional**. The column stays; see [[decisions/product/owner-requests-are-not-verified-by-phone]].
- `/miejsce/{slug}/przejmij` and `/dodaj-lokal` are removed, not redirected: both lived behind owner access, which has never been on in production, so no link to either exists outside this repository. `zglos-lokal` replaces `dodaj-lokal` in the reserved paths.
- Behind owner access like the rest of the owner side, and listed in [[decisions/product/owner-panel-ships-behind-one-switch]].

## What this prevents

An owner having to know how UNI's catalogue is organised before asking to join it. A duplicate listing from an owner who did not look. A chain's second branch refused because its first one is listed. The person's details asked for in two places, and two forms drifting apart.

## Revisit when

The catalogue is large enough that a name search returns pages of branches — then it needs a city filter. Or verification ([[decisions/product/owner-requests-are-not-verified-by-phone]]) changes what the form must ask.

---

*See also: [[decisions/product/claim-requests-come-from-the-venue-page]] · [[decisions/product/new-venue-requests-create-no-venue]] · [[decisions/product/a-venue-is-its-name-at-an-address]] · [[decisions/product/owner-panel-ships-behind-one-switch]]*
