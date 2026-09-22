# ADR-003: Analytics Architecture

## Status
**Decided: Own event capture + optional PostHog for internal use only.**
**Executed:** yes — verified in the code 2026-09-14 (own `events` table and counters; PostHog browser-only since 2026-08-30)

## Context
UNI needs analytics for internal product decisions AND for B2B premium insights sold to venue owners. The architecture choice affects vendor dependency, GDPR compliance, and profit margins.

## Options Considered
1. **PostHog for everything** — captures events, builds funnels, serves owner dashboards
2. **Own event capture for everything** — full control, zero vendor dependency
3. **Hybrid** — own capture for B2B-facing data, PostHog for internal analysis

## Decision
Option 3 (Hybrid). Own Laravel event capture writes to PostgreSQL `analytics_events` table. This data feeds the B2B premium dashboards directly — no vendor in the revenue path. PostHog Cloud free tier optionally used for internal funnel analysis and retention curves — tools that are hard to build from scratch but don't affect customer-facing features.

## Rationale
- If PostHog raises prices or shuts down, B2B revenue is unaffected
- Own data in PostgreSQL means Metabase can build owner dashboards directly
- PostHog's 1M free events/month is enough for internal analysis at V1 scale
- Server-side event capture requires no cookies and no consent banner (GDPR clean)
- Identified events in PostHog cost ~4x anonymous events — another reason to keep B2B data in own DB

## Web Traffic
Umami (self-hosted) for public website analytics. Separate concern from product event tracking.

## When to Revisit
If PostHog free tier is insufficient for internal analysis, evaluate self-hosted PostHog vs building custom funnel queries in SQL.
