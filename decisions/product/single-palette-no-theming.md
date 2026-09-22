# One palette, no theming: the product ships dark only

**Date:** 2026-08-22
**Status:** Decided
**Executed:** 2026-08-22
**Area:** UI/UX

---

## Problem

The site shipped two palettes and a three-state switch (auto → light → dark), so every component had to be designed, reviewed and debugged twice, and half of all visitors met the product on white. A 0.0% product sells on evening, bar-adjacent atmosphere, and a white default builds none of it. The question is not only whether to drop light mode but how far to take the removal — forcing dark while keeping the second palette in the codebase is much cheaper, and looks identical to a user.

## Options considered

Keep the switch. Force dark by hardcoding the theme class and leave both palettes, the `dark:` variant and the theme-scoped rules in place, so light mode can return cheaply. Remove the switch and the second palette but keep the theme class as a styling hook. Remove every trace: switch, stored preference, system-preference detection, second palette, theme variant, theme-scoped CSS rules, and the light basemap the light theme used.

## Decision

We remove every trace. The single palette lives at the root of the stylesheet, applied unconditionally; there is no theme class on the page, no `dark:` variant registered, and no second value for any colour anywhere in the public site. The Filament admin and owner panels keep their own theme system, which is internal tooling and outside this decision.

## Rules

The public site has exactly one value per design token, defined once at the top of the stylesheet, and any component that needs a different palette re-points tokens on its own element rather than reintroducing a theme. Nothing in the public site may use a `dark:` utility, a theme class, or a `prefers-color-scheme` query — the variant is deliberately not registered, so such a class will behave differently than its author expects. Colour values that look light — the white skip-link on focus, the white toggle knob, the white mascot, amber admin badges — are intentional contrast choices, not leftovers, and stay. Any future request for a light appearance is treated as a new feature with its own record, never as restoring something that was removed. A test asserts the rendered page contains no stored theme preference, no theme control and no system-preference detection, so the switch cannot return unnoticed.

## What this prevents

Two palettes in one file is a trap that fires later, not now: someone edits the root colours, sees no change because a second block silently overrides them, and either reverts a correct change or patches the wrong layer. Keeping a theme class as a hook has the same shape — an inert-looking attribute that turns out to be load-bearing. The removal also drops the light basemap, which was the only reason the product ever contacted OpenStreetMap's tile servers, so the site now exposes visitor IP addresses to one map provider instead of two, and the privacy policy no longer describes a stored theme preference that does not exist.

## Revisit when

Accessibility work calls for a genuine high-contrast mode. That is a different feature with a different justification — it is about legibility thresholds, not about taste or time of day — and it should be specified as such rather than as the return of light mode.

See also: `discovery-tile-skin-tokens.md`, `dark-map-tile-provider.md`, `prefers-reduced-motion.md`
