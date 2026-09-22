# Where a visit came from is stored as a bucket, never as a referrer

**Date:** 2026-09-02
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** Analytics

---

## Problem

The three questions every first conversation with a venue owner opens with — which channel brought
people, what were they holding, which of your pages converted them — had no answer in the data, and
none of the three can be reconstructed later. The tension is that the obvious way to answer them is
to store a referrer and a user agent, which is exactly what the `events` table promises it never
holds.

## Options considered

Store the raw referrer and user agent and filter at read time. Store nothing and rely on Search
Console. Store a hash of either. Collapse each to a small bucket before the write, so there is no
raw material to leak. Read only tagged links and ignore headers entirely.

## Decision

Each request is collapsed to one value from a closed set before anything is written: a channel
(**entry source**), a two-value **device**, and which of our own pages linked here (**view
surface**). The allowlist is the privacy mechanism, not a convenience — an unrecognised host or tag
resolves to "other", so no raw host and no attacker-supplied string ever reaches a table that is
kept indefinitely. A tagged link is read before the referrer header, because the header is the part
we do not control.

## Rules

Every method returns a closed-set value; no caller ever receives a raw header to store by accident.
Tagged links win over referrers, because Instagram's in-app browser strips or rewrites the header
and Instagram is the channel published to three times a week — a tagged link is the only thing that
survives it. A tag we do not recognise is "other" and never "direct", since somebody clicked
something. The buckets stay coarse: two device values and a single-digit source list is a handful
of combinations shared by thousands of rows, and a third ambient dimension multiplies them towards
a fingerprint, so adding one is a decision and not a chore. Entry source is only meaningful on the
request that enters the site — with no session identifier, a visitor who arrives from Instagram and
then opens a venue is internal on that view, and no report may imply otherwise.

## What this prevents

Prevents both failure modes at once: launching blind to which channel works, and answering that
question by putting request-identifying material into the one table whose entire claim is that it
holds none. The allowlist specifically prevents a crafted query string from being stored forever.

## Revisit when

A fourth ambient dimension is proposed, which requires re-examining the combination count rather
than adding to it. Also when campaign-level tagging is wanted, since a campaign name is free text
from a URL and needs its own rule before it can be stored.

---

*See also: [[decisions/product/no-identifier-based-deduplication]] ·
[[decisions/product/eventlogger-identifier-stripping]] ·
[[decisions/product/raw-events-are-kept-not-pruned]] ·
[[decisions/product/analytics-split-posthog-and-events]]*
