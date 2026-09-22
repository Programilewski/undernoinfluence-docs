# The owner-managed badge is suspended until the panel behind it opens

**Date:** 2026-09-02
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Superseded:** 2026-09-16 by the badge-flag deletion (`commute-2026-09-16_7.md` §2) — `UNI_OWNER_MANAGED_BADGE` no longer exists. The badge follows `is_claimed`, which only claim approval sets and no importer maps; the copy explaining it appears once any venue qualifies (`Venue::anyOwnerManaged()`). The fourteen claimed rows that motivated the flag were local fixture output. Recorded 18.09: this record had kept describing the flag as current
**Area:** UI/UX | Venues

---

## Problem

Fourteen venues carried the "Zarządza właściciel" badge and the claims table held zero rows. V1 has
no path that can add one — the owner panel returns 404 and the claim flow is unreachable — so the
badge asserted that a named person was answerable for the offer on fourteen profiles where nobody
was. It was the only outright untruth left on the public site.

## Options considered

Clear `is_claimed` on the fourteen rows. Let the venue wipe take care of it. Leave the badge and
accept it as approximately true. Hide the badge in the view behind a flag and leave the data alone.
Remove the badge and its copy entirely and rebuild both for V2.

## Decision

The badge is hidden behind a configuration flag that is off, together with the filter that selects
on it and the two pieces of copy that explain it. The data is left untouched. Flipping one flag
brings all four back on the day the owner panel opens.

## Rules

The gate lives in the view, not in the data: `is_claimed` is a column the spreadsheet import can
set again, so cleaning rows would have hidden the problem until the next import re-created it, and
would have destroyed the flag V2 needs intact. The filter goes with the badge, because offering a
filter for a signal the results cannot display is worse than offering neither — the backend filter
stays, unexposed, exactly as the owner panel does. Copy that explains a badge is gated on the same
flag as the badge, so the site never describes something a visitor cannot go and find, and the
explanation returns with the thing it explains.

## What this prevents

Prevents the site making a promise about a specific venue that nothing in the product can honour —
the failure the copy-truth rule exists for — and prevents the more expensive version of it, where a
real venue owner reads the badge on their own profile and asks who has been managing it.

## Revisit when

The owner panel opens. The badge, the filter and both explanations return with one flag, and none
of them needs rebuilding.

---

*See also: [[decisions/product/v1-copy-truth]] · [[decisions/product/admin-recorded-claims-v1]] ·
[[decisions/product/hide-for-venues-v1]]*
