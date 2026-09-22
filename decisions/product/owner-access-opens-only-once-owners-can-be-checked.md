# Owner access is switched on only once there is a way to check owners

**Date:** 2026-09-19
**Status:** Decided
**Executed:** standing rule — the check was built later the same day ([[decisions/product/owner-requests-are-checked-through-the-venues-own-channels]]); what remains before the switch is the checklist in `docs/product/features/Owner Verification.md` (UNI's Instagram account and `UNI_INSTAGRAM_HANDLE`, mail and a queue worker, one end-to-end try)
**Area:** Venues | Strategy

---

## Problem

V2 was meant to be one switch: `UNI_OWNER_ACCESS=true` ([[decisions/product/owner-panel-ships-behind-one-switch]]). The same day the phone call that verified every owner was dropped ([[decisions/product/owner-requests-are-not-verified-by-phone]]), which left the switch able to open a request form with nothing agreed for deciding who is who. With it on, requests arrive, and an approval gives the person the venue's drinks to edit and its reports to read.

## Options considered

Switch on when the rest of V2 is ready, and approve on trust or let requests wait until a check exists. Switch on only once a check exists.

## Decision

Paweł: *"switch on is turned after having a way to check owners."* The switch stays off until the replacement check is built and tested. V2 is still one switch; it now has one more condition before it is pulled.

## Rules

The replacement check is chosen from the two research reports in `roadmap/research-results/` and gets its own record. The switch is not flipped while that record's `**Executed:**` line says anything other than done. The "On the day V2 opens" list in [[decisions/product/owner-panel-ships-behind-one-switch]] carries this as its first step. Owner access stays switchable locally, as before, so the flow can be built and tried against it.

## What this prevents

Approving owners on trust — a competitor taking over a venue to empty its menu, or an agency reading another venue's reports. And the other failure: owners who asked and heard nothing, on the first day V2 is visible.

## Revisit when

The check is built. This record then closes, and the switch goes back to depending only on the V2 opening list.

---

*See also: [[decisions/product/owner-requests-are-not-verified-by-phone]] · [[decisions/product/owner-panel-ships-behind-one-switch]] · [[roadmap/research-prompts/owner-verification]]*
