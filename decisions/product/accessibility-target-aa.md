# WCAG 2.2 AA is the target, and there is no separate accessibility mode

**Date:** 2026-08-24
**Status:** Decided
**Executed:** standing rule — no WCAG 2.2 AA audit is on record yet
**Area:** UI/UX | Compliance

---

## Problem

Light mode was removed and the product now ships one dark palette. The open question was whether light mode could return as a high-contrast accessibility mode — a different feature with a different justification from the preference-driven theme that was killed. Left unanswered, someone eventually rebuilds the theme switch under an accessibility banner, and the single-palette decision quietly reverses. "Accessible enough" without a definition is a phrase that gets argued about forever.

## Options considered

Allow a high-contrast mode in principle, with its own decision record, once a user needs one. Close the question permanently. Set a conformance target instead, and treat any contrast failure as a palette bug rather than a missing mode.

## Decision

The target is **WCAG 2.2 level AA**, and there is no separate high-contrast or accessibility mode. Public-sector products are held to near-perfect accessibility; this one is held to an acceptable and testable level, chosen so that the branding survives. Meeting AA on contrast is precisely what removes the need for a second mode.

## Rules

AA is the standard the interface is measured against, and a contrast failure in the dark palette is fixed in the palette rather than escaped into an alternative theme. Keyboard operation, focus visibility, and text alternatives are not traded away for visual effect, because they are cheap and their absence excludes people outright. A separate mode is introduced only if a legal obligation requires one, in which case that obligation is what the new decision record cites.

## What this prevents

Prevents the theme switch returning through the side door, and prevents the opposite failure of treating accessibility as unbounded, where every review reopens the question of how accessible is enough. A named conformance level makes the answer testable instead of a matter of taste.

## Revisit when

A legal requirement applies — an EAA obligation reaching this product, or a public-sector customer — or a real user reports that the dark palette is unusable for them despite AA conformance.

See also: [[decisions/product/single-palette-no-theming]], [[decisions/product/prefers-reduced-motion]]
