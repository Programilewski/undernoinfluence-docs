# Before launch there is no past to protect

**Date:** 2026-08-24
**Status:** Decided
**Executed:** standing rule — nothing to execute once; it binds future work
**Area:** Data Model

---

## Problem

The codebase had accumulated machinery whose only purpose is to defend a history the product does not have: migrations that erase data from a table that has never held any, a command to rewrite every venue slug without breaking live URLs, a cache tuned for crawler traffic, an hourly job repairing drift from an incident that never occurred. Each was individually reasonable to write and none of them is wrong — they are simply answers to questions nobody has asked yet. Left in place they cost attention at every review and, worse, they make the project look older and more fragile than it is.

## Options considered

Keep everything on the grounds that it will be needed once the product launches. Remove everything defensive and rebuild it at launch. Judge each piece by whether the thing it defends against can actually happen today, and keep the ones where it can.

## Decision

Machinery that exists to protect continuity — published URLs, accumulated data, crawler traffic, historical schema — is removed while there is no continuity to protect. Machinery that protects against something that can happen today stays, regardless of launch status. Security headers, rate limits, input validation and privacy enforcement all pass that test and are never in scope for this kind of cleanup.

## Rules

A change is in scope for pre-launch pruning when the failure it prevents requires an audience, published data, or accumulated history to occur. Redirect chains preserving old addresses, caches sized for crawler load, retention and pruning schedules, and data-erasure migrations against empty tables all qualify.

A change is out of scope when the failure it prevents can occur on a laptop with one user. Anything touching security, privacy, accessibility, input validation, or the correctness of data already entered stays untouched.

Reconciliation jobs that repair drift are treated as symptoms. The scheduled job may be reduced in frequency, never deleted, until the write path that causes the drift has been found and fixed. Deleting the job before fixing the cause hides the problem instead of removing it.

Every removal in this category must name the condition that brings it back, and that condition goes in the decision record and the technical debt log so it can be found at launch rather than rediscovered.

## What this prevents

Prevents a pre-launch codebase that reads like a post-incident one, where every layer implies a failure that never happened and a new reader cannot tell which defences are real. It also prevents the specific class of accident found on 24.08, where a one-off command written to migrate live URLs safely had drifted out of agreement with the live slug logic and would have rewritten all sixty-seven venue addresses if anyone had run it.

## Revisit when

The product reaches the home server as a preproduction environment with a stable address, or the first real visitor arrives — whichever comes first. At that point continuity begins to exist and each removed defence must be reconsidered on its own terms, starting with the sitemap cache and the retention schedules.

See also: [[decisions/adr/ADR-010-migration-squash]], [[decisions/product/abstraction-needs-a-second-user]]
