# A venue's site that doesn't answer is tried twice more, then left

**Date:** 2026-11-18
**Status:** Decided by Paweł, 18.11: "retry in deferred time, but max 2-3 times… if the site is down permanently and we try to fetch it for a year, we waste time and resources". Then "go with 3 + 10 days".
**Executed:** 2026-11-18, `v0.1.15`. Source B searches again after 3 days, then 10, through a daily job at 05:00.
**Area:** Venues

---

## Problem

Source B looks for a website for each place on the permit register. On 17.11 Zoli Pizzeria's own site (its name was in the domain) timed out. The place was marked as searched and never picked again. A site can be down for an hour or for good, and one bad moment cost a real venue. A retry can't re-check the domains found earlier, because Brave's terms forbid keeping its results. So every retry is a new paid search.

## Options considered

1. Never retry, and leave it to "Szukaj mimo to" by hand.
2. Retry until the site answers.
3. Retry a fixed number of times at growing intervals.
4. Keep the earlier domain list and re-check it without searching. Brave's terms rule this out.
5. Retry whenever any result domain failed, not only the place's own.

## Decision

A place whose own site didn't answer is searched for again **3 days later, then 10 days after that, and then not again automatically**. Only a site whose domain carries the place's name triggers a retry. A dead directory or map link says nothing about whether the venue has a site. Three tries in about two weeks separates a bad moment from a dead site. The cost is at most two extra searches per place.

## Rules

- **What triggers a retry:** a retry is scheduled only when no domain was accepted, at least one domain carrying the place's name was unreachable, and no other candidate already holds the address.
- **The schedule:** the delays are 3 days, then 10 days, both editable in configuration. After the third failed try the place stops being searched automatically, and its note says so.
- **What the note shows:** the date of the next try and the try count, for example "próba 1 z 3".
- **Running the retries:** a daily job sends the retries that are due, under the same per-run cap as any search.
- **When a search fails:** if Brave itself fails, the retry stays due and goes out the next day. It is not lost.
- **A site found later:** a retry that finds the site resets the count. The place then goes on to have its menu looked for, like any found site.
- **Rejected places:** a rejected place is never retried.
- **Searching by hand:** "Szukaj mimo to" always searches again by hand, whatever the count.

## What this prevents

- **Losing venues to a timeout:** real venues are no longer lost to a server that was down for an afternoon.
- **Paying for dead sites:** a site that is gone for good doesn't cost a search a day for a year.
- **Retrying the wrong places:** retrying on any dead result domain would have re-searched almost every place, since directories and old links fail all the time.

## Revisit when

- **Retries find sites:** if retries regularly find the site on the third try, consider a longer last interval.
- **Retries never find anything:** if they never succeed, consider dropping to one retry.
- **Cost:** if per-place spend for a full register run becomes a real cost, revisit the number of retries.

*See also: [[decisions/product/a-registers-place-is-matched-by-name-and-address]] · [[decisions/product/a-search-query-sent-within-30-days-is-skipped]] · [[decisions/product/a-venue-page-is-read-with-its-metadata-not-its-javascript]]*
