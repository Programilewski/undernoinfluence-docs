# Email verification UX flow post-registration

**Date:** 2026-05-18
**Status:** Superseded for V1 — see [[decisions/product/email-verification-deferred-to-v2]]
**Executed:** superseded for V1 by [[decisions/product/email-verification-deferred-to-v2]]
**Area:** UI/UX

> **2026-08-16:** describes the flow after registration, and V1 has no
> registration. Applies again when self-registration ships.

---

## Problem

Currently all users — B2C and B2B — are redirected to an email confirmation wall immediately after registration, before they have gotten any value from the product. For B2C users whose core features (browsing, saving venues) require no verification, this friction is disproportionate and likely causes abandonment.

## Options considered

- Keep current: immediate redirect to confirmation page for all users after registration
- Send verification email on registration for everyone, no redirect, surface the prompt only when the user hits a gated action
- Differentiate at registration: redirect B2B users immediately, skip redirect for B2C

## Decision

The verification email is sent to all users immediately on registration, but no user is redirected to the confirmation page after signup. The prompt to verify surfaces contextually — for B2B users this is when they attempt to submit a venue claim; for B2C users it is when they attempt a gated action such as reporting an inaccuracy. The moment of need is a stronger motivator than an upfront wall.

## Rules

After registration, all users land on the page they were heading to (or the default landing page). The verification email is dispatched in the background. No user sees a confirmation redirect screen unless they have triggered an action that requires a verified email. A persistent banner or notice inside any gated flow must clearly explain what action is blocked and why.

## What this prevents

Forcing a confirmation wall before first value causes B2C users to abandon registration when they only wanted to browse or save a venue. Dropping the wall preserves activation while keeping the verification mechanism intact — the email exists and the link works whenever the user needs it.

## Revisit when

If bounce or abandonment data shows a significant portion of B2B users are not verifying before attempting to claim (e.g. they lose the email), consider adding a persistent banner inside the claim flow or a resend prompt earlier in the journey.

---

See also: [[decisions/product/email-verification-enforcement]]
