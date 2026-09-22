# PostHog is additive, not the canonical analytics source

**Date:** 2026-06-19
**Status:** Decided
**Executed:** superseded in part 2026-08-30 by [[decisions/product/analytics-split-posthog-and-events]] — PostHog no longer mirrors server events
**Area:** Analytics

---

## Problem

PostHog was integrated on 2026-06-18 with both SDKs enabled in production (`POSTHOG_PUBLIC_ENABLED=true`, `POSTHOG_SERVER_ENABLED=true`). The SSOT simultaneously described PostHog as "not the V1 canonical analytics source" and had it config-gated off by default. These two statements contradicted each other, making it unclear whether PostHog was a real dependency or an optional experiment — and whether the first-party `events` table was still the authority for reporting.

## Options considered

Making PostHog the primary analytics layer and deprecating the first-party stack. Treating PostHog as entirely optional and off-by-default. Clarifying that both systems run in parallel with distinct responsibilities.

## Decision

PostHog is additive. It mirrors the same events as the first-party stack but serves a different purpose — session exploration, funnel analysis, and debugging user behaviour cheaply. The canonical source for all owner-facing reports and B2B analytics remains the first-party `events` table, `venue_stats`, and `AnalyticsGateway`. Both systems run in production. PostHog does not replace the first-party stack; it supplements it.

## Rules

The first-party `events` table is the source of truth for anything shown to venue owners or used in B2B decisions. PostHog data is used for internal session exploration and funnel debugging only — it must not be the source for any owner-facing metric. Before any large-scale marketing activation, privacy policy and GDPR consent posture must be validated for data sent to PostHog. The EU cloud endpoint is used; no data leaves the EU.

## What this prevents

This prevents the temptation to use PostHog as a shortcut for building owner-facing analytics (lower quality data, vendor lock-in, GDPR complexity) and prevents confusion about which system is authoritative when the two diverge due to ad blockers, bot traffic, or double-capture.

## Revisit when

PostHog proves significantly more reliable than the first-party stack (e.g., first-party event loss rate exceeds 10%), or if the first-party analytics layer becomes a maintenance burden that PostHog could replace cleanly.

See also: ADR-003 Analytics Architecture
