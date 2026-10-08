# Only the owner can say a drink is "Nowe"

**Date:** 2026-10-08
**Status:** Decided
**Executed:** yes, 08.10.2026
**Area:** Venues | UI/UX

---

## Problem

"Nowe w karcie" (since 19.09) tagged a drink new when it was added after a venue's first cataloguing, either by an owner or by UNI finding it on a later check. Only the venue knows the day it started serving a drink; UNI knows only the day it noticed. So a venue loaded over two days, a drink the admin missed and added later, or a quarterly re-check all called years-old drinks new, and owners could keep a tag alive by removing and re-adding a drink.

## Options considered

Keep it and fix each false case one by one (a first-public date for loads; still false on corrections and re-checks). Remove the tag. An admin switch "Nowość w karcie?" on every add (the admin rarely knows either). Only an owner's own addition makes a drink new, with no renewal on re-adding.

## Decision

Only an owner's own addition makes a drink "Nowe", and a drink removed and added back within 180 days is not new again. Platforms that say "new" let the party that knows say it (Google from the business's opening date) or date their own knowledge and say so (Yelp's "first listed on Yelp"). In V1, with no owners, the tag and the strip show nothing. Founder, 08.10.2026: adopted after asking whether owners would abuse it.

## Rules

A drink is "Nowe" for 30 days after an owner adds it to their venue's menu. Anything UNI records, on a load, a correction or a re-check, is never "Nowe". A drink the owner removes and adds back within 180 days does not become "Nowe" again; one returning after that, such as a seasonal drink, does. "Nowe" appears only on the venue's own page and never affects ranking, discovery or any list. Admin-observed additions are still logged for internal trend data.

## What this prevents

A visitor told a years-old drink is new. The two-day-load problem, which disappears for visitors. The remove-and-re-add trick. The incentive to abuse what is left is low: the tag brings no visitor from anywhere else, and adding a drink one does not serve is a false offer whether or not a tag exists.

## Revisit when

Owners are live (V2) and it can be seen whether the tag drives anything; the 19.09 record already calls it cheap to remove. When the V2 owner trend reports are built, decide whether admin-observed additions count there (same weakness, aggregated, at least five venues per drink).

---

*Supersedes in part: [[decisions/product/new-in-the-menu-is-dated-by-the-offer-log]] (which counted additions UNI found, and counted re-adds as new). See also: [[research/results/is-nowe-w-karcie-worth-it]] · [[decisions/product/updated-means-vouched-for]] · [[decisions/product/nothing-false-is-published-to-a-visitor]]*
