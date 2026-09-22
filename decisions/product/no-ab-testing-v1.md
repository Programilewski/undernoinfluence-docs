# No A/B testing in V1 — judgment and qualitative signals instead

**Date:** 2026-08-15
**Status:** Decided
**Executed:** standing rule — nothing to execute once; it binds future work
**Area:** Analytics

---

## Problem

V1 requires a long run of copy and UI judgment calls — badge labels, filter names, homepage section structure — and the instinct is to settle them with A/B tests rather than opinion. The setup looks ready for it: PostHog is integrated, the discovery funnel is instrumented, and events already cover impressions, clicks and conversions. The question is whether running experiments at launch would actually produce evidence, or only the appearance of it.

## Options considered

**A/B tests from launch via PostHog** — split traffic on each contested decision and let the numbers choose. Feels rigorous and removes argument from the process.

**Sequential shipping read as directional** — change one thing, watch the funnel over whole weeks, accept the result as a hint rather than proof.

**Qualitative signals** — session replay, heatmaps, and a handful of user interviews to find out what a label actually communicates.

**Feature flags as kill-switches** — flags used only to disable something quickly without a deploy, never to assign variants.

## Decision

No A/B testing in V1. The sample size required makes it arithmetically impossible at launch scale: detecting a 20% relative lift on a 10% baseline conversion at 80% power needs roughly 3,900 sessions per arm, so about 7,800 measured sessions per test. Analytics consent is opt-in and off by default, so the raw traffic requirement roughly doubles to around 16,000 sessions — quarters of work for one result against a target of 50-60 Warsaw venues growing through SEO. The experiment infrastructure also does not exist: `PostHogService` evaluates no flags, only captures events.

## Rules

V1 ships no experiment framework and `PostHogService` stays capture-only. Copy and UI decisions are settled by judgment against the brand book, supported by qualitative signals, and never presented internally as data-driven when they are not. Changes ship sequentially and any before/after comparison must span whole weeks, because a nightlife product has a strong weekday/weekend traffic cycle that will otherwise be mistaken for a variant effect. The `venue_feature_flags` table is entitlement gating for B2B analytics plans and must never be repurposed for variant assignment — different mechanism, different audience. If flags are introduced before V2 they exist as kill-switches only. `discovery_empty_results` is treated as the primary product-direction signal in V1, since it reports unmet demand without requiring any test.

## What this prevents

The real danger is not the absence of tests, it is underpowered tests that get believed. A result at a few hundred sessions per arm still produces a winner, still gets screenshotted, and still gets baked into the product — except it is noise wearing the costume of evidence, and it is far more expensive to unwind than an honest judgment call. Deferring also protects launch capacity from being spent on experiment plumbing, and avoids the SEO risk of swapping variants of indexable content client-side.

## Revisit when

A single surface reliably reaches roughly 5,000 measured sessions per month — realistically after multi-city expansion, which places it in V2 or V3 territory. Before the first test runs, four things must exist: server-side flag evaluation in `PostHogService` so Livewire renders a stable variant without flicker, a decision on whether UX experimentation is lawful under the current opt-in consent model and what bias the consenting subset introduces, one agreed primary metric (candidate: `venue_viewed` → `venue_directions_clicked`), and pre-registered sample sizes with no mid-flight peeking.

See also: posthog-analytics-role.md, analytics-three-tiers.md, consent-banner-design.md
