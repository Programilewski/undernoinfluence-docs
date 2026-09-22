# Email verification enforcement for B2B venue owners

**Date:** 2026-05-18
**Status:** Superseded for V1 — see [[decisions/product/email-verification-deferred-to-v2]]
**Executed:** superseded for V1 by [[decisions/product/email-verification-deferred-to-v2]]
**Area:** UI/UX | Venues

> **2026-08-16:** this record assumes self-registration, which V1 does not have.
> Enforcement is off in V1 and returns with public registration. The reasoning
> below is unchanged and still applies from that point on.

---

## Problem

Venue owners can currently register, get approved, and access `/panel` without ever verifying their email. This means admin time can be spent reviewing claims that cannot be tied to a reachable address, and the entire communication channel with the owner — claim decisions, menu updates, dispute notices — may be a dead end from day one.

## Options considered

- Enforce verification before claim submission (user can fill form but cannot submit until verified)
- Enforce verification before the claim enters the admin review queue (submit allowed, but not queued)
- Enforce verification before `/panel` access is granted post-approval
- No change — rely on admin judgment during manual review

## Decision

Email verification is required at two points for B2B users: before a venue claim can be submitted, and before `/panel` access is granted. The `canAccessPanel` method must check `email_verified_at` for the `panel` panel, and the `/zglos-lokal` route already carries the `verified` middleware. No admin time should be spent reviewing a claim that cannot be communicated back to the claimant.

## Rules

Unverified users who attempt to submit a venue claim are redirected to the email verification notice. The `/panel` blocks access for any `owner` role user whose `email_verified_at` is null, regardless of claim approval status. The verification email is sent automatically on registration for all users.

## What this prevents

An approved owner with a mistyped or fake email has no way to receive account communications, cannot reset their password, and cannot be reached for disputes or compliance notices. It also prevents bad actors from claiming venues via disposable email addresses with no accountability.

## Revisit when

When introducing a B2B invite flow (e.g. team members added by a venue owner) — the enforcement point may differ for invited users vs self-registered owners.
