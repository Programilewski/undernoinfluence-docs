# Personal data expires; the rows holding it do not

**Date:** 2026-09-16
**Status:** Decided
**Executed:** 2026-09-16
**Area:** Data Model | Compliance | Analytics

---

## Problem

Four tables were treated as if retention meant deletion. `audit_logs` deleted whole rows at 12 months, `venue_offer_logs` at 24, and claim and inaccuracy-report contact details had no horizon at all — the privacy policy said they were kept "until the venue or account is deleted", which is a true sentence about the code and not a retention period.

Deleting the row was the wrong instrument, because every one of these rows is two facts glued together. A `venue_offer_logs` row says *"this venue carried Heineken 0.0 from March"* — which identifies nobody, and which is the commercial series that pairs with `venue_stats` — and also *"a named person typed it on 14 March"*, which is personal data with a purpose that ends. Deleting the row to satisfy Art. 5(1)(e) threw the first fact away with the second, and the consequence was concrete: `venue_stats` is never pruned, so at month 25 you could still say a venue's views rose and no longer say what it added. The sentence that sells a subscription stops being writable about anything older than two years, for no legal benefit at all.

## Options considered

Leave the windows alone and accept the mismatch. Grow the offer-log window to match `venue_stats` — which keeps the personal half longer for a purpose that has already expired, and is the one option that is actually worse under GDPR. Copy the anonymous half into a second table before deleting the row. Strip only the identifying column and keep the row.

## Decision

**Retention is anonymisation, not deletion.** No row in this application is deleted to satisfy a retention rule. `venue_offer_logs.user_id` and `audit_logs.actor_id` are set to `NULL` at 24 months and the rows are kept indefinitely; claim and report contact fields are emptied 12 months after the claim or report was decided, and those rows are kept too. `model:prune` is removed from the schedule and the `Prunable` traits are gone; `uni:anonymise-expired-data` runs daily in their place.

`audit_logs` moves from 12 months to 24. The argument `venue_offer_logs` already made for choosing 24 over 6 — *"a dispute arrives late, because a listing takes months to reach someone who disagrees with it"* — applies with more force to *"who approved this claim"*, and a venue ownership dispute surfaces well past a year.

## Rules

A retention rule names a **column**, never a table. Before adding one, the question is which part of the row identifies a person and which part the product needs; only the first gets a horizon. A row that has been anonymised stays queryable forever and no code may assume its identifying column was ever populated.

An approved owner's contact details are theirs for as long as they own the venue, so that clock starts when ownership ends rather than when the claim was decided — a claim whose venue is still `claimed_by` that user is left alone however old it is.

Tables carrying no identifier — `venue_stats`, `venue_category_stats`, `search_stats`, `events` — have no retention rule and must not acquire one. Nothing legally requires it and the counters are the only thing in this product that cannot be recreated after the fact.

Every window lives in `ropa.md` with the reason beside it, because Art. 30 asks for the period and a regulator asks why that period and not another.

## What this prevents

Prevents the product destroying its own irreplaceable history in the name of a rule that never asked for it, and prevents the opposite failure of keeping a stranger's e-mail address forever because deleting the row would lose the record that their report was handled. It also prevents the next retention decision being taken at the table level, which is what produced the mismatch in the first place.

## Revisit when

A table appears whose anonymous remainder is genuinely worthless — at which point deleting the row is right and this record should say so for that table specifically, not be reversed wholesale.

---

*See also: [[decisions/product/raw-events-are-kept-not-pruned]] · [[decisions/product/analytics-three-tiers]] · [[decisions/product/venue-data-acquisition-flow]]*
