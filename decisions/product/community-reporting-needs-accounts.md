# Community reporting waits for accounts, and weights reports by credibility

**Date:** 2026-08-24
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14 (the FAQ sentence is gone; the V2 half waits for accounts)
**Area:** Venues | Compliance

---

## Problem

The public FAQ told users to click a "Zgłoś nieaktualne dane" button on the venue page. No such button has ever existed. The backend behind it is finished — table, model, four-state workflow, full admin queue — and has never received a row. The sentence sits directly under the answer explaining what the "Sprawdzona karta" badge means, so it fires at the exact moment a user has begun to doubt the data, and it contradicts D-11, which says community reporting is not in V1.

## Options considered

Build the button now, which means resolving who the reporter is with no public accounts — either a nullable owner column or a session fingerprint, the second of which drags a new entry into the data map. Leave the copy and accept that a promised channel does nothing. Delete the sentence and build the feature properly later.

## Decision

The sentence is removed from the FAQ now. Community reporting is built in V2 **together with** public accounts, never before them, and each report is weighted by the credibility of the account that filed it rather than treated as one anonymous voice among many.

## Rules

Public copy may not name a control the product does not have; if a promised affordance is missing, the copy goes rather than a placeholder appearing. Reporting is not shipped before accounts exist, which keeps the reporter column non-nullable as designed and keeps a session fingerprint out of the data map entirely. When reporting ships, a report from a verified venue owner is triaged ahead of a report from an unverified account — two tiers, not a numeric karma score, until volume proves a score is needed.

## What this prevents

Prevents the worst version of a trust failure: a user who already suspects the data is wrong, told to press a button that is not there. It also prevents the cheaper mistake of solving reporter identity with a fingerprint, which would add a personal-data entry to the data map to support a feature that was explicitly deferred.

## Revisit when

V2 planning begins, at which point reporting and public accounts are scoped as one piece of work. Earlier only if a venue owner asks for a correction channel and email proves insufficient.

See also: [[decisions/product/browse-only-v1]], [[decisions/product/v1-copy-truth]]
