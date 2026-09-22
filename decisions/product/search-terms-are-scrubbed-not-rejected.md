# Contact details are redacted from search terms, not rejected with the row

**Date:** 2026-08-31
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** Analytics | Compliance

---

## Problem

The `events` table is anonymous by construction — no IP hash, no session id, no user id — and that is what lets it be kept indefinitely with no legal basis and no consent gate. One field breaks the construction: `properties->query` stores exactly what a visitor typed into the search box. People occasionally type an e-mail address or a phone number into a search box, and with retention now measured in years, a single such row would make the "no personal data in this table" claim false for as long as the table exists.

## Options considered

Leave it, on the grounds that it is rare. Reject the whole event when the query matches a contact shape, at the same write-time point where automated requests are already dropped. Redact the matching substring and keep the row. Stop storing the query text at all and keep only its length and result count.

## Decision

Contact-shaped text is redacted from event properties at write time and the row is kept. `FreeTextScrubber` replaces e-mail addresses and runs of nine or more digits with a marker and caps the stored value at 100 characters; `EventLogger` calls it on every write, so the guarantee is structural rather than dependent on each call site remembering. Rejecting the row was the earlier proposal and was rejected in turn: it would also discard the count of the search, which is the half with analytical value, and it would do nothing for a query that merely contains an address alongside a real search term.

## Rules

Every write to `events` passes through the scrubber, including nested property arrays; a new event type gets the protection without doing anything. The filter matches shapes, not meaning, so public wording says that contact details are filtered out of stored search terms and never that search terms contain no personal data — that rule binds the privacy policy, producer methodology sections and owner-facing copy alike, and is recorded in `tech/analytics.md`. Redaction is destructive by design and the original text is not recoverable anywhere. Any change that would reintroduce unfiltered free text into the table is a product decision, not a code review.

## What this prevents

It prevents the slow version of a privacy failure: not a breach, but a claim that was true when written and quietly stopped being true, discovered by someone reading the table years later. It also prevents the opposite mistake — over-claiming in the privacy policy on the strength of a filter that cannot catch a name, which would be worse than having no filter at all, because it converts an honest limitation into a false statement.

## Revisit when

If free-text fields other than the search query are ever written to `events`, the patterns should be reviewed against what those fields actually receive. Also revisit if a legitimate search term is ever found to be redacted — no product, brand or venue name currently contains an `@` or nine consecutive digits, but a future catalogue might.

---

*See also: [[decisions/product/eventlogger-identifier-stripping]], [[decisions/product/no-identifier-based-deduplication]], [[decisions/product/raw-events-are-kept-not-pruned]], [[decisions/product/analytics-fires-on-intent-not-on-keystroke]]*
