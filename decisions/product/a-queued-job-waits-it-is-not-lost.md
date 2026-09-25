# A queued job waits; it is not lost

**Date:** 2026-09-25
**Status:** Decided
**Area:** Analytics

---

## Problem

Several documents state that with no queue worker running, a queued notification is *lost rather than delayed*. That is true of some queue drivers and it is not true of the one this application uses: the queue is a database table, so a dispatched job is a row that sits there until something consumes it. The wrong version leads directly to the wrong action during an incident — somebody who believes the mail was destroyed goes looking through the database to work out who was never told and sends it again by hand, on top of a backlog that is about to deliver itself.

## Options considered

Leave the wording, on the grounds that it conveys the right urgency. Change it everywhere to "delayed", which understates what the venue owner experiences and would make the checklist row look optional. Describe the mechanism and the recovery instead of choosing a single adjective.

## Decision

The documents say what actually happens: the work waits in a table, the owner has not been told, and starting a worker delivers the backlog in order. The urgency attached to having a worker is unchanged — from the owner's side, not yet delivered is indistinguishable from lost — but the recovery is now written down, because the recovery is where the wrong belief does damage.

## Rules

Wherever the queue is described, the phrasing is that queued work waits and is delivered when a worker runs, not that it is lost. The stated recovery when a worker is found to have been down is to start the worker and let the backlog drain, and never to re-send by hand, because both together send everything twice. The genuine loss cases are named rather than implied: work is destroyed by clearing the queue, by rebuilding an environment, and by exhausting its retries into the failed table, which is itself emptied after thirty days. Anything that must not be lost is not left to that chain alone.

## What this prevents

Duplicate mail to venue owners on the morning somebody discovers the worker has been down, which is worse than the original silence because it is the first thing the product does after failing them. It also prevents the opposite error, which is reading "delayed" as "harmless" and leaving a dead worker in place because the jobs are safe.

## Revisit when

The queue moves off the database driver. A driver that holds jobs in memory makes the original wording correct again, and that change would have to carry this record with it.

*See also: [[decisions/product/actions-own-their-side-effects]] · [[decisions/product/the-alarm-rings-from-outside-the-building]]*
