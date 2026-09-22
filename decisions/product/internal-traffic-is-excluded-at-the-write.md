# Our Own Traffic Is Excluded at the Write, Not Filtered Later

**Date:** 2026-09-09
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** Analytics

---

## Problem

Cataloguing a venue means opening its page repeatedly in one afternoon, and every one of those visits was being counted as a profile view for that venue. The first report a paying owner ever sees would have described our own working day as their demand. It cannot be corrected afterwards, because [[decisions/product/no-identifier-based-deduplication]] means no row carries anything that says which visits were ours — there is no address, no agent string and no flag to filter on later. Automated traffic had already been dropped at the write on 30.08; ours had not.

## Options considered

Storing something identifying on each row so internal visits could be subtracted later. Excluding only administrator accounts. Excluding a venue's own owner but only on that venue's page. An address allowlist alone. A browser cookie alone. Accepting the inflation on the grounds that it is small and we know about it.

## Decision

Internal traffic is dropped at the moment of writing, in the same place bot traffic is dropped, and nothing about the request is stored. Three signals mark a request as ours: any signed-in account, an opt-out cookie the visitor or we can set, and an optional list of configured addresses. `BotDetector` answers "was this a person at all"; this answers the second half of the same credibility question, "was this person a stranger".

## Rules

Any authenticated account is internal traffic, without exception. [[decisions/product/browse-only-v1]] forbids public registration, so every account that exists is one we created — an administrator, or a venue owner we onboarded — and neither is an ordinary visitor. An owner refreshing their own page is the most likely way a report inflates itself, so owners are excluded across the whole site rather than only on the venue they manage.

The opt-out cookie is offered from the privacy policy, with a button to set it and a button to clear it, and it is disclosed there in the same section as the consent cookie. It is a visitor's control as much as ours. It carries the `Secure` flag over HTTPS on the same rule as the consent cookie, rather than inventing a second rule for the same kind of cookie.

The configured address list is empty by default, because a wrong entry there fails silently in the direction of counting nothing at all, and the other two signals already cover every case we can be certain about.

Nothing about the request is written down in any of the three cases. The request is compared and forgotten, so the events table stays exactly as anonymous as it was, and the sentence "we hold nothing about anybody" stays true.

## What this prevents

It prevents the first B2B conversation from resting on a number we manufactured. Every alternative that filters after the fact requires storing something about the request, which would have cost the one claim this product's whole privacy posture is built on — and identification would have answered the owner's real question worse anyway, because a list of identifiers is as easy to fabricate as a counter.

## Revisit when

Public accounts are ever introduced, at which point "signed in" stops meaning "one of ours" and the first rule needs replacing rather than adjusting. Or if a real visitor is ever found arriving with an account we did not create.

---

*See also: [[decisions/product/browse-only-v1]] · [[decisions/product/no-identifier-based-deduplication]] · [[decisions/product/eventlogger-identifier-stripping]] · [[decisions/product/offer-logs-record-knowledge-not-authorship]]*
