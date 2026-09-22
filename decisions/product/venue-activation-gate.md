# Venue activation gate — not live until first product added

**Date:** 2026-05-18
**Status:** Decided
**Executed:** 2026-09-14
**Area:** Venues | Data Model

---

## Problem

When a venue owner claims a venue and gets approved, should the venue go live immediately? An empty venue profile (claimed but with zero products) damages the platform's credibility — users see a listing with nothing on the menu and lose trust.

## Options considered

1. **Activate on claim approval** — fast for the owner but creates empty public listings.
2. **Activate when first product is added** — ensures every public listing has at least one product.
3. **Activate after N products** — higher quality bar but slower onboarding.

## Decision

Venue stays inactive (`is_active = false`) when a claim is approved. It goes live automatically when the first product is added — either from the pre-validated catalog or via a reviewed product proposal. The `activateIfReady()` method on the Venue model is called from both product-adding paths (catalog selection and proposal approval).

## Rules

Claim approval sets the venue as claimed but does not set `is_active = true`. The `activateIfReady()` method checks for at least one product before activating. Both product paths (direct catalog add and proposal approval) trigger this check. Admin can override and activate manually if needed.

**Amended 2026-09-12 — a venue also needs coordinates.** `VenueImporter` stopped requiring latitude and longitude, so that a worklist can be imported and geocoded afterwards ([[decisions/product/geocoding-comes-from-the-state-register]]). That made a new state reachable: a venue with a drink attached and no point on the map. The map payload reads coordinates as numbers, so a missing one becomes zero — a pin off the west coast of Africa, and a "nearest" sort measuring every distance from there. So the gate now asks for a product **and** a point, and the map skips any venue lacking one even if an admin activates it by hand. An ungeocoded venue is not a bug to be hidden; it is a venue that is not ready.

**Amended 2026-09-13 — the gate works in both directions, house drinks count, and nothing outside it can switch a venue on.** Reading the code end to end found the gate only ever opened. Four changes, each with tests that fail on the old code:

- **A venue goes offline when its menu is emptied.** `Venue::deactivateIfEmpty()` runs when the last catalogue product is removed — by the owner, by an admin, or with the admin's bulk "Usuń zaznaczone", which until now skipped the offer log and the score as well — and when the last house drink is deleted. Canaries are never touched. Deleting a catalogue product removes its venue links in the database, where no code runs, so the hourly `uni:check-offer-freshness` also takes any live venue with nothing on its menu offline.
- **House drinks count.** A venue is ready with a point and at least one catalogue product *or* house drink (`hasSomethingToServe()`), because [[decisions/product/kebab-rule]] qualifies a venue by a NoLo item on its menu or in a standing, named drinks offer, and a house mocktail is exactly that. Adding the first house drink now activates a geocoded venue.
- **A CSV cannot make a venue live.** `VenueImporter` no longer has `is_active` or `is_verified` columns, and a new imported venue is set inactive before it is saved. This was worse than it looked: Filament fills only the columns a file maps, and `venues.is_active` defaults to true, so a launch CSV with no `is_active` column at all would have published every row with no point and no product. Re-importing leaves existing venues as they are.
- **Proposal approval goes through the same path as every other attach** — `VenueProductObserver` — so it writes the offer log and the score, not just the activation.

The admin's "Aktywny (widoczny dla użytkowników)" switch still works both ways, with one consequence worth knowing: a venue switched on by hand with nothing on its menu goes offline at the next hourly check. That is the gate doing its job — an empty listing is what it exists to prevent — and it is why the new-venue form's default of on no longer leaves an empty venue public for long. The map still skips any venue without a point.

**Amended 2026-09-14 — a venue switched off by hand stays off.** Switching a live venue off in the admin form records `switched_off_at`; `activateIfReady()` never re-publishes such a venue, so a drink added during cataloguing cannot bring back a place an admin marked closed or wrong. Switching it on by hand clears the mark. Venues the gate itself takes offline are not marked. The new-venue form now defaults to off: a venue goes live through the gate, not because a form said so.

**Amended 2026-09-17 — the gate re-checks when a point arrives, and a toggle nobody moved is not a switch-off.** Two ways a venue could hold everything the gate asks for and stay dark, both found from a real venue that went live for six seconds and then could not be republished:

- **Only the menu half had a trigger.** Readiness is a point *and* something to serve, but `activateIfReady()` ran only from `VenueProductObserver` and `VenueDrinkObserver` — never when the coordinates arrived. Geocode then catalogue and a venue publishes; catalogue then geocode and nothing is left to notice, which is exactly the order `VenueImporter` was changed to allow when it stopped requiring latitude and longitude. `GeocodeVenueAction::applyResult()` now calls the gate after it writes the point, so both the single and the bulk button go through it, and `uni:check-offer-freshness` gained `activateReadyVenues()` as the counterpart to `takeEmptyVenuesOffline()` — the hourly job only ever took venues down, so nothing under it could catch this class of bug. It calls `activateIfReady()` per venue rather than mass-updating, so the decision goes through one code path and lands in the audit log, and it skips canaries and anything carrying `switched_off_at`.
- **A stale toggle could stamp the permanent mark.** The admin form compared the submitted `is_active` against the record. A venue's visibility changes underneath an open form — the gate publishes it the moment a product is attached in the relation manager, which is a separate Livewire component and does not refill the parent — so saving any other field afterwards read as "the admin is switching this off", set `switched_off_at`, and left the venue unpublishable by any later product. `EditVenue` now remembers the value the toggle was rendered with and writes `is_active` only when somebody actually moved it. The switch still means what the 2026-09-14 amendment says it means; it just no longer speaks when nobody touched it.

**Also 2026-09-17 — the gate's own record keeping.** Two defects found while fixing the above, both in what the gate *reports* rather than what it does:

- **`takeEmptyVenuesOffline()` wrote no audit row.** It mass-updated, and a mass update does not fire the model observer, so every automatic deactivation the hourly job ever made left no `venue_visibility_changed` row. VenueObserver's premise is that a null `actor_id` on such a row separates a scheduler deactivation from one a person made — a distinction that did not exist in the data, because one side of it wrote nothing. It now calls `deactivateIfEmpty()` per venue, the same shape as `activateReadyVenues()`.
- **`venues.latitude` and `longitude` are `decimal(9,6)`; the model cast them as `decimal:7`.** The cast formatted a seventh decimal the column never stored, so a re-geocode compared an incoming seven-digit value against a stored six-digit one and recorded a move every time, on venues that had not moved a millimetre. The cast now matches the column. Six decimals is about 11 cm, already far past what a venue pin means, so the column is right and the cast was the outlier — widening the column would have bought precision nobody can use and cost a migration.

The second one matters beyond tidiness: `venue_location_changed` exists to answer *"you published an address I never gave you"*. A log that records a change on every geocode is a log in which the real change is harder to find.

## What this prevents

Empty venue profiles on the public-facing discovery page. A venue with "0 napojow" listed teaches users that UNI has incomplete data — the opposite of the trust signal the platform needs. Since the amendment, it also prevents the more embarrassing version: a venue that exists, has drinks, and is in the wrong hemisphere.

## Revisit when

If owner onboarding data shows significant drop-off between claim approval and first product addition, consider whether activation coaching (email nudges, guided flow) would help more than changing the gate.

See also: [[decisions/product/an-automatic-gate-runs-in-both-directions]] — the general rule the 17.09 amendments produced, and [[decisions/product/a-control-speaks-only-when-it-is-moved]] — why the admin switch no longer speaks for an admin who said nothing.
