# All animations fully disabled when OS reduced-motion preference is active

**Date:** 2026-06-22
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** UI/UX

---

## Problem

The homepage hero uses eight animation classes (floating cards, radar pulses, map pin float). These animations run indefinitely. Users with vestibular disorders (BPPV, Ménière's disease) and migraines can experience nausea, dizziness, or sensory overload from continuous on-screen motion. WCAG SC 2.2.2 requires that auto-playing animation lasting more than 5 seconds can be paused, stopped, or hidden. All eight animations exceed 5 seconds. The question: should animations be slowed or stopped when the user's OS preference says "reduce motion"?

## Options considered

Slow all animations to a very long duration (e.g. 20s instead of 6s) — still indefinite, so still fails SC 2.2.2. Add a pause button on the hero — visible UI clutter for a minority use case. Stop all animations completely via `prefers-reduced-motion: reduce` media query — clean, invisible, respects the user's stated preference.

## Decision

A `@media (prefers-reduced-motion: reduce)` block in `app.css` sets `animation: none !important` on all animation utility classes. When a user has enabled "Reduce Motion" in their operating system, every animation on the site stops silently — no alternative timing, no partial motion. The experience becomes fully static.

## Rules

Every animation class in `app.css` must be listed in the `prefers-reduced-motion: reduce` block. New animations added in future must be added to the block at the same time they are created — not retroactively. The `!important` flag is intentional: it overrides any inline `animation-delay` or `animation-duration` that Alpine.js or Tailwind utilities might apply.

## What this prevents

Slowing an animation to 20 seconds still means indefinite motion — it still technically violates SC 2.2.2 and still affects users with the most acute sensitivity. The complete disable approach is both legally correct and the only genuinely respectful response to a stated accessibility preference. It also costs zero design effort: the static layout looks intentional without the animations.

## Revisit when

If a specific animation serves a functional purpose (e.g. a loading indicator for screen state) rather than a decorative purpose, it may need a static replacement rather than a simple `none`. Decorative animations — which all current UNI animations are — should always follow the current rule.
