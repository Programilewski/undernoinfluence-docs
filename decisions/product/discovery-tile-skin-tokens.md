# Discovery tile skins re-point design tokens, never duplicate the card

**Date:** 2026-08-17
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14 (the losing skin is still in the code — deploy checklist B5)
**Area:** UI/UX

---

## Problem

The homepage showcase list has a dark glass look the discovery list does not, and we wanted to try that look on the real product without losing anything the discovery card shows. The first attempt copied the homepage row into a second component and lost most of the card in the process — the dot grid, the badges, the product count and both action buttons all disappeared, because a compact row has no room for them. Any approach that keeps two tile components invites exactly that: the two drift, and the one nobody is looking at quietly loses detail.

## Options considered

A second, separately maintained tile component for the dark look. Conditional classes throughout the existing tile, branching on a variant prop at every colour. Descendant CSS overrides fighting the utility classes from a parent selector. Re-pointing the design tokens on the tile element itself so every utility inside resolves to a different palette.

## Decision

The dark skin re-points the design tokens on the tile root and changes nothing else. Because every colour utility in the app resolves its token at the point of use, overriding those tokens on one element restyles everything inside it without touching a single line of the detail markup. There is one tile component, one set of details, and a skin is a palette — never a different amount of information.

## Rules

A tile skin may only redefine design tokens, plus chrome that carries no information: border, shadow, blur, hover transform. It may never add, remove, or reorder anything the card displays. Category colours stay untouched under every skin, because they are data rather than decoration. Any new skin is selected by a validated config value with an unknown value falling back to the skin that already ships, so a typo in the environment degrades to the old look instead of an unstyled card. A test asserts that every skin emits identical detail; if that test needs changing to accommodate a skin, the skin is wrong.

## What this prevents

The failure this protects against already happened once in a single session: a second component was written, and it silently dropped the dot grid, the freshness pill, the owner and verification badges, the product count, and the tracked directions button — the strongest intent signal the product measures. With one component and a palette swap, a skin cannot remove information, because information is not something a skin can reach.

## Revisit when

A skin genuinely needs different structure rather than a different palette — a true compact density for mobile, say. At that point it is a layout decision, not a skin, and it needs its own record and its own justification for the detail it drops.

See also: `homepage-showcase-real-components.md`, `homepage-showcase-no-edge-fades.md`
