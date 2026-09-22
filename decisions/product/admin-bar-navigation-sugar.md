# Admin bar is navigation sugar, never an editing surface

**Date:** 2026-06-02
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** UI/UX

---

## Problem

As a solo founder I constantly need to fix venue data, and jumping to the Filament panel for every edit is slow. A WordPress-style admin bar on public venue pages would save that hop — but bolting editing onto public pages risks introducing an auth hole if done carelessly.

## Options considered

A thin admin bar that only deep-links into the existing Filament admin panel. Inline editing directly on the public venue page (click a field, type, save). No bar at all, keep navigating to the panel manually.

## Decision

We add a WordPress-style admin bar that is purely navigation sugar for admins. Its visibility is gated on the admin role, and its "Edytuj" button deep-links into the Filament Venues resource, which independently re-checks the venue policy. We explicitly reject inline editing on public pages — editing always happens inside Filament, where the form, validation, and policy already exist.

## Rules

The bar renders only when the viewer is an admin, checked server-side on the role — not on edit permission (which owners also pass for their own venues) and never on a client-side flag. The bar introduces zero new write endpoints; every action it links to is an already-protected Filament page that re-verifies authorization on its own. No sensitive internal data is inline-rendered in the bar beyond what an admin already sees. The bar is global (lives in the shared layout) and shows the venue-specific edit link only when a venue is in scope.

## What this prevents

It keeps the bar from ever becoming a security boundary: spoofing the markup grants nothing because the destinations re-check auth. Choosing deep-links over inline editing avoids duplicating validation and authorization onto hand-rolled public endpoints — the classic place a solo founder ships an `is_admin` bug.

## Revisit when

Editing-in-Filament becomes a genuine bottleneck and inline editing is worth the added surface area — most likely post-V1 once venue-data churn is high and the panel round-trip is measurably slowing daily corrections.

See also: [[email-verification-enforcement]]
