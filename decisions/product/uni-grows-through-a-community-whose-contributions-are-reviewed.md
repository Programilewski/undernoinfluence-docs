# UNI grows through a community whose contributions are reviewed before they are published

**Date:** 2026-10-02
**Status:** Decided — the direction. Scope, timing and sign-in are Open until the community-reciprocity research (runs 1–3) is assessed
**Executed:** no — nothing built. V1 already has one community channel, the guest "Zgłoś coś w tym lokalu" report on every venue page
**Area:** Venues | Data Model | Brand

---

## Problem

Verifying every venue by hand works at 35 venues and stops working at 100 or 200, and a founder who doesn't phone venues can't keep that many current alone. The people who don't drink, or drink less, are a motivated niche likely to help. But a community can also turn the work into a second inbox, give brands a channel to fake demand, and push UNI toward accounts and personal data before anyone uses the product. Existing records (browse-only-v1, community-reporting-needs-accounts, ADR-006) put community features in V2, together with accounts.

## Options considered

Keep browse-only and verify everything alone. Let people add venues and drinks directly. Open reviews. Bring public accounts into V1 so contributions have an identity. Accept proposals and signals from anyone, without an account, and publish nothing until the founder has checked it.

## Decision

UNI becomes community-driven: people can propose venues and drinks and tell UNI when something has changed, and **nothing they send is published until the founder has reviewed it**. The community tells UNI where to look; it doesn't edit the map. This keeps accuracy, which the faceless brand rests on, in one pair of hands, while reducing how much checking that pair of hands has to do. What exactly ships in V1, when it goes live, and how accounts work later wait for the research, because it bears on producer sales, contributor trust and health data by inference.

## Rules

A contribution never changes a public page by itself: it lands in the founder's queue, and a signal such as "this drink is gone" can only move a venue up the recheck order. Contributing doesn't require an account. Anonymous signals are counted and described as signals, never as people. No reviews, in line with ADR-006. No points, streaks or leaderboards. No brand or producer can sponsor, reward or steer a contribution. Public copy never names a community control that doesn't exist yet, per v1-copy-truth.

## What this prevents

It prevents the data going stale once the venue count outgrows one person, without handing the map to whoever submits the most — including a competitor or a brand. It also avoids the opposite mistake of building accounts and their GDPR obligations before there is a community to justify them.

## Revisit when

The three research runs are assessed. That is when the V1 scope, the measured trigger for switching accounts on, and the sign-in method are decided, in their own records. Earlier only if proposals arrive faster than they can be reviewed within a published target.

---

See also: [[decisions/product/browse-only-v1]], [[decisions/product/community-reporting-needs-accounts]], [[decisions/adr/ADR-006 No Reviews V1]], [[decisions/product/mission-is-the-healthy-choice]], [[decisions/product/brand-outreach-waits-for-traction]]
