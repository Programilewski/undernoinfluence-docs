# Email verification is deferred to V2, when self-registration returns

**Date:** 2026-08-16
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Amended:** 2026-09-19 — "by phone and by NIP" below no longer describes how an owner is checked: nobody is phoned, and the replacement is being researched ([[decisions/product/owner-requests-are-not-verified-by-phone]]). The decision stands: the owner is checked by a person before the account exists, and the approval's set-password link goes to the request's e-mail address.
**Area:** UI/UX | Venues

---

## Problem

Two decisions from 2026-05-18 require owners to verify their email before claiming and before `/panel` access, and both assume the verification email goes out "automatically on registration". V1 has no registration — an admin creates the account and hands over the password out of band. The requirement was still enforced in the panel with no page on which to satisfy it, so every admin-created owner hit a hard error on first login. The gate could not be passed by the owner, and the admin had no way to pass it for them.

## Options considered

Wire up the panel's built-in verification pages so the owner can request a link and verify themselves. Have the admin mark the address verified when creating the account, keeping the gate nominally intact. Drop the requirement for V1 and reinstate it with self-registration.

## Decision

Email verification is not enforced in V1. In V1 the owner's identity is established before the account exists — by phone and by NIP, by a person — so the email address is a notification channel, not a trust boundary. A gate the owner cannot pass and the admin cannot pass for them is friction with no security value. The 2026-05-18 records are not wrong; their premise simply does not exist yet, and they become live again the moment self-registration does.

## Rules

The owner panel does not require a verified email address in V1. An admin-created account can sign in immediately with the password the admin set. Enforcement returns together with public registration, at which point verification must gate claim submission and panel access exactly as the 2026-05-18 records specify, and the sending flow must exist before the gate does. The code carries a note at the point of removal saying so.

## What this prevents

Enforcing a check whose satisfying flow was never built is worse than not enforcing it: the account is created, the owner is told to log in, and the product fails in a way that looks like a broken site rather than a missing step. It also prevents the opposite shortcut — having an admin stamp addresses as verified — which would leave a verification field that means nothing and would quietly survive into V2, where it is supposed to mean something.

## Revisit when

Public registration is introduced. That is the trigger, not a date — verification without self-registration protects nothing.

---

Supersedes for V1: [[decisions/product/email-verification-enforcement]], [[decisions/product/email-verification-ux-flow]]
See also: [[decisions/product/admin-recorded-claims-v1]]
