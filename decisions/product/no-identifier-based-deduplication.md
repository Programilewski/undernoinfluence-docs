# No identifier-based deduplication — the events table stays outside GDPR

**Date:** 2026-08-30
**Status:** Decided
**Executed:** standing rule — nothing to execute once; it binds future work
**Area:** Analytics | Compliance

---

## Problem

Anonymous events cannot be de-duplicated, so one person refreshing forty times reads as forty
searches. We can honestly say "searches" but never "people". For a paid B2B product that is a
methodology hole a competent brand-side insights manager finds in the first meeting, and it also
lets a single heavy user skew exactly the district-level demand figure we would be selling. The
industry answer is a daily-rotating salted hash of IP and user agent, which buys uniques, bounce
and bot filtering without any cookie or persistent identifier.

## Options considered

Rotating-salt daily hash, as Plausible and Fathom do it — recovers uniques and dedup, but
regulators treat a salted IP hash as pseudonymous rather than anonymous, so it drags the events
table back into GDPR scope. Consent-gated identifiers in the paid tiers only — loses 30-50% of
the signal and makes revenue depend on a banner. Keep identifiers out entirely and fix the
measurement noise at the emit site instead.

## Decision

We do not introduce identifiers of any kind for deduplication. The `events` table stays at six
columns with no identifier, genuinely anonymous and outside GDPR's scope, and that is what we
sell aggregates from. Measurement noise is fixed where it is actually generated — in the emit
cadence — not by identifying the people generating it.

## Rules

No rotating hash, no device fingerprint, no session key, no visitor cookie enters the analytics
path, including "temporary" or "in-memory only" variants. Owner-facing and buyer-facing metrics
are named for what they measure — *wyświetlenia*, *zapytania* — never *osoby* or *unikalni
użytkownicy*, and the methodology note says so plainly. Where a number can be expressed as a
ratio it is preferred over an absolute, because duplication inflates numerator and denominator
together and the ratio survives. Bots are dropped at the edge by evaluating the request and
discarding it, never by storing anything about it. Return-visitor rate is removed from the
premium feature list rather than reintroduced through a side door.

## What this prevents

It prevents buying a lawful basis, a legitimate-interest assessment, a ROPA entry, a retention
rule and a permanent DPIA line item in exchange for improving only the single-venue owner
subscription — the weakest of the three revenue lines. The manufacturer and chain products run on
catalog data, which is business data about companies and needs no user analytics at all, so the
identifiers would have bought nothing where the money is. It also keeps the promise the consent
banner makes without depending on anyone honouring it.

## Revisit when

If a buyer contract genuinely requires people-level reach rather than distribution and menu
penetration, and no aggregate substitute satisfies it. That is a new processing activity with its
own legal basis and its own table — never a change to `events`. Note separately that the events
table's anonymity depends on not holding a joinable web-server access log over the same period;
the production access-log retention is the control that protects this decision, and it is still
a `TODO` in the ROPA.

---

*See also: [analytics-fires-on-intent-not-on-keystroke.md](analytics-fires-on-intent-not-on-keystroke.md), [eventlogger-identifier-stripping.md](eventlogger-identifier-stripping.md), [posthog-analytics-role.md](posthog-analytics-role.md)*
