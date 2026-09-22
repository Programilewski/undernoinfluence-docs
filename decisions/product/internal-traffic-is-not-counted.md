# Our own sessions are not counted

**Date:** 2026-09-04
**Status:** Decided — not yet implemented
**Executed:** superseded 2026-09-09 by [[decisions/product/internal-traffic-is-excluded-at-the-write]], which is built; the "not yet implemented" in the Status line is stale
**Area:** Analytics | Venues

---

## Problem

Nothing distinguishes the founder browsing venue profiles from a visitor doing it. `BotDetector` drops traffic that is not a person; it has no opinion about traffic that is a person but not a customer. Thirty real venues are about to be entered and each one checked, into a table holding a few hundred events — **so the first report anyone sees would be substantially a record of our own browsing.**

## Options considered

Record everything and filter at report time. Exclude by IP address. Exclude via a cookie set from the admin panel. Exclude by authenticated role at the write. Do nothing and subtract mentally.

## Decision

**Requests carrying an authenticated session whose role is `admin` or `owner` are dropped at the write**, in the same shape `BotDetector` already uses. Ordinary `user` accounts are visitors and are counted. External research settled the owner half: **IAB/MRC guidelines require internal traffic to be disclosed and removed where material, and ABC's standard says "exclude all internal activity" outright** — and an owner's own views are the one kind of self-inflation that ends up inside an invoice.

## Rules

The guard lives at the two chokepoints every analytics write passes, not at the call sites above them, so a new call site cannot forget it. The session is read and discarded — no flag, no role, no marker reaches a stored row, keeping the no-identifier rule intact. The excluded roles are configuration rather than a constant, so a staging box can count its own clicks. **The standards require internal traffic to be *disclosed*, not merely removed**, so the owner dashboard needs a line saying the figure excludes their own visits and UNI staff, and the privacy policy needs a sentence describing the behaviour. No separate "your own visits" counter in V1. No IP blacklist, ever — an IP is personal data and breaks the moment somebody switches network.

## What this prevents

A first owner conversation opening on a view count that is mostly us, and a methodology that cannot survive "does this include your own visits?". Filtering later was never an alternative: a row would have had to carry something identifying to be filterable, so the write is the only place this decision could be made.

## Revisit when

Public accounts exist and a signed-in `user` is common enough that role stops being a clean proxy for "not a customer". Also worth revisiting the disclosure wording once an owner has actually read it and compared our number to Google Business Profile, which will be lower.

---

*See also: [[decisions/product/no-identifier-based-deduplication]], [[decisions/product/analytics-split-posthog-and-events]], [[decisions/product/eventlogger-identifier-stripping]]*
