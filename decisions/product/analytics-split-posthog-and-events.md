# PostHog is browser-only; the events table is the record we sell from

**Date:** 2026-08-30
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14 — amended 2026-09-13
**Area:** Analytics

---

## Problem

Four analytics paths grew up side by side and nobody had drawn the boundary between them.
PostHog receives events from both the browser and the server, so four events are counted twice
and one anonymous visitor carries several identities. Meanwhile the two events that measure how
long somebody reads a menu are refused unless the visitor accepted cookies, even though those
events name no person — so a consent-only sample sits inside the table we intend to call the
full record, with no way to tell them apart at query time.

## Options considered

Keep both PostHog paths and subtract the double counts when reading numbers. Keep the server
path and drop the browser one. Drop the server path and keep the browser one. Leave the consent
gate on menu-reading time and treat that data as sample. Remove the gate and treat the whole
events table as one population.

## Decision

PostHog is fed from the browser only, under consent, and is read only by us for funnel work.
The server writes to our own tables only — the events table and the daily counters — with no
consent gate and no identifier of any kind, and that is the record every owner-facing and
paid number is built from. The server-side PostHog switch is turned off, which also removes the
hashed session identifier the server was attaching to events. The consent gate on the
menu-reading endpoint is removed, because the event it carries is a venue id and a number of
seconds.

## Rules

No server code sends anything to PostHog. The four duplicated browser calls for venue views and
outbound clicks are deleted, since our own redirect already records every one of them
server-side. Nothing derived from a session, an address or a device is ever attached to a row
in the events table, and the existing test that enforces this stays. PostHog numbers and events
table numbers are never placed side by side or compared, because one is a sample of people who
accepted cookies and the other is everybody. When the menu-reading endpoint loses its consent
gate it gains robot filtering in the same change, never later.

**Amended 2026-09-13 — a server-side event may only be about the person making the request.** Server capture survived for signed-in panel users (switched off by `POSTHOG_SERVER_ENABLED=false`), and it checked consent on the current request while accepting any user id. So an admin approving a claim sent `claim_approved` attributed to the owner, allowed by the admin's own cookie — the owner was never asked. Consent is a cookie in the browser that gave it, so the only consent a request carries is its sender's. `PostHogService::recipientFor()` now drops any event about somebody else, and the `claim_approved` and `claim_rejected` server events are removed from the claims table, where they could no longer be sent.

## What this prevents

Prevents the first paying venue owner being shown a number that is twice as large, and prevents
us discovering after launch that half of a sellable metric only ever came from people who
accepted cookies. It also removes the strongest argument anyone could make that the events
table holds personal data — with no identifier written by any path, the question of a legal
basis does not arise rather than being answered.

## Revisit when

A question arises that genuinely needs to follow one person across visits, which is the only
thing this arrangement gives up. At that point the cost is a consent-gated identifier and the
loss of the claim that we hold nothing about anybody, and both go in the record before any code
changes.

---

*See also: [[decisions/product/eventlogger-identifier-stripping]] ·
[[decisions/product/posthog-analytics-role]] · [[decisions/product/analytics-endpoint-server-gate]] ·
[[decisions/product/maps-redirect-type-retained]]*
