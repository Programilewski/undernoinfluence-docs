# Hide /dla-lokali route in V1

**Date:** 2026-06-18
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14 (no `/dla-lokali` route)
**Superseded:** in part, 2026-09-18 by [[decisions/product/owner-panel-ships-behind-one-switch]] and [[decisions/product/claim-requests-come-from-the-venue-page]] — true in V1, where the switch is off; once `UNI_OWNER_ACCESS` is on, a venue page offers the claim request form and owners manage their venues in `/panel`. `/dla-lokali` stays hidden either way
**Area:** UI/UX | Brand

---

## Problem

The /dla-lokali page described features that don't exist in V1: an owner self-service panel, demand analytics, verified badge via owner claim flow, and profile statistics. Every copy fix revealed another forward-looking claim. The page was creating a false promise to venue owners who might contact UNI expecting a self-service product.

## Options considered

Fix all the copy to be V1-accurate and keep the page live. Hide the route entirely and direct owners to email. Add a "coming soon" version with minimal copy.

## Decision

The route is removed in V1. Any link to /dla-lokali resolves to a 404. All internal links (nav, footer, about, how-it-works) that previously pointed to it now go directly to the contact email with a pre-filled subject. There is no "Dla lokali" destination in V1.

## Rules

Venue owners who want to be listed contact kontakt@undernoinfluence.pl. The verified badge is granted by the UNI team after manually checking the drinks menu — no owner claim flow exists. No page in the app should suggest that owners can self-manage anything.

## What this prevents

A venue owner landing on /dla-lokali, reading about an owner panel and analytics dashboard, and then contacting UNI expecting those features. That conversation damages credibility more than having no page at all.

## Revisit when

Post-V1 when a genuine owner onboarding flow exists — self-service claim, panel, or analytics. At that point the page should be rebuilt from scratch, not restored.
