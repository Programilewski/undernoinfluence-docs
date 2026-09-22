# Frontend Analytics Centralization

**Date:** 2026-06-22
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** Analytics

---

## Problem

Client-side analytics were scattered across four files: `analytics.js` exposed a single `capture()` function; `consent.js` called `window.posthog` directly for opt-in/opt-out; `app.blade.php` contained an inline IIFE that re-applied consent on page load and a Blade-level `posthog.identify()` call; and `venue-analytics.js` sent dwell-time events to the server with no consent check at all. Answering "what exactly fires when a user declines analytics?" required reading all four files — and the answer was wrong, because dwell events still reached the server for declined users.

## Options considered

Keep the existing split across files with better documentation. Extract all analytics logic into a single ES module with named exports. Create a JS class with static methods. Expose a `window.__analytics` global object with all methods.

## Decision

`analytics.js` is the single analytics authority. It exports `capture`, `grantConsent`, `revokeConsent`, `isConsentGranted`, `identify`, and `applyStoredConsent`. All other files import from it — nothing calls `window.posthog` directly except through this module. The `window.__capture` global remains as a thin pointer for Blade inline usage only.

## Rules

Every call that touches PostHog or the consent state must go through `analytics.js`. `consent.js` calls `grantConsent()` and `revokeConsent()` — it does not call PostHog directly. `venue-analytics.js` calls `isConsentGranted()` before every server POST. `app.js` calls `applyStoredConsent()` at module load and `identify()` if `window.__authUser` is set. No Blade template calls `posthog.*` directly — they use `window.__capture?.()` which is a pointer to the module export.

## What this prevents

A user who clicks Decline still being tracked by `venue-analytics.js`, which was posting dwell events to the server regardless of consent state. It also prevents consent logic becoming duplicated as the product grows — adding a new analytics provider or changing the consent cookie name is a single-file change.

## Revisit when

If the analytics layer is split into multiple providers (e.g. PostHog for behavioral, a separate tool for A/B testing) and their consent postures differ. The current module assumes a single consent gate governs all client-side tracking. A multi-provider future would need the module to map consent types to providers.

---

*See also: posthog-analytics-role.md*
