# Cookie consent banner design

**Date:** 2026-06-22
**Status:** Decided
**Executed:** 2026-09-18 — the overlay, the scroll lock and `aria-modal` removed (P38), so the panel is the middle ground this record chose rather than the blocking modal it rejected. Panel, buttons, equal weight and the cookie icon were built before
**Area:** UI/UX | Compliance

---

## Problem

The original cookie notice was a thin bar fixed at the bottom of the screen. Users could scroll past it without making a choice. Under GDPR Art. 7 and the EDPB Consent Guidelines, consent must be an unambiguous, freely given, active indication — passive scrolling past a banner does not qualify. Equally, the design must not nudge users toward accepting: refusing consent must be as easy as granting it.

## Options considered

- **Full-page modal** (blocking, can't use site without deciding) — forces a choice but feels aggressive for a venue discovery app; harms first impressions.
- **Original thin bottom bar** — low friction but legally insufficient (passive acceptance pattern).
- **Category-based bottom panel with overlay** — slides up from the bottom, backed by a translucent overlay; requires an active click to dismiss; shows toggle categories; three equal-prominence buttons.

## Decision

We use a category-based bottom panel — **with no overlay since 18.09**; the original 30% black overlay is what grew into a blocking modal, see the amendment below. It shows two toggle rows — "Funkcjonalne" (always on, grayed out, informational message if user tries to disable) and "Analityczne" (off by default). Three buttons with equal visual weight: "Odrzuć wszystkie" | "Zapisz preferencje" | "Zaakceptuj wszystkie". A persistent cookie icon in the corner reopens the panel at any time.

## Rules

The "Odrzuć" button must always be present and must be at least as prominent as "Zaakceptuj" — same size, same weight, same position row. Refusing consent must require exactly one click, same as accepting. The panel must appear on every page load until a decision is stored. After a decision, the panel must not reappear automatically — only via the cookie icon. Functional cookies (session, CSRF) must be explained as technically necessary, never framed as optional.

**Amended 2026-09-12 — nothing may be visible under the panel that looks tappable.** The panel is `role="dialog" aria-modal="true"` and on a 390px screen it is 435px of an 844px viewport, so anything anchored to the bottom of the page ends up inside it. The discovery map button sat directly on top of "Zaakceptuj wszystkie": a tap aimed at the map granted analytics consent and did not open the map, which is the exact nudge this record exists to prevent — and it is not consent at all, because it is not an indication of the visitor's wishes. Fixed controls hide themselves while `body.consent-open` is set, and `scripts/check-map-render.mjs` exercises the first-visit flow at phone width.

**And closing the panel must not depend on the analytics library.** `rejectAll()` called into PostHog before setting `visible = false`, and the CDN stub throws when a method is called before the library arrives — so a TypeError left an aria-modal dialog open over the whole page while the decision had already been stored. The decision is recorded and the dialog closed first; the vendor is told afterwards.

**Amended 2026-09-18 — the panel asks; it does not block (P38, agreed 16.09).** The overlay this record chose grew into the option it rejected: a 30% backdrop over the whole page that took every tap, a scroll lock on `<body>`, and `aria-modal="true"`. On a phone that meant half a screen of cookie language and nothing else reachable — the strictest treatment landing on the visitor with the least patience, who is most of the traffic, because the use case is standing outside a bar. All three are gone. The panel keeps `role="dialog"`, the three buttons in one row at the same size and weight, the cookie icon and the first-button focus, and **fixed controls still hide under it** — `body.consent-open` stays, because it is not a lock but the 12.09 fix, and a map button sitting on "Zaakceptuj wszystkie" would return without it.

**Not equal in colour — kept as it is for now (Paweł, 18.09).** "Zaakceptuj wszystkie" is filled in the primary violet; "Odrzuć wszystkie" and "Zapisz preferencje" are grey outlines. Size, weight and row match the rule above; colour does not. Raised on 18.09 against the *at least as prominent* rule and deliberately left unchanged. The EDPB cookie-banner taskforce (January 2023) treats contrasting button colours as a case-by-case question rather than an automatic breach, so this is a judgement, not a known violation. Revisit if a regulator, a complaint or a consent audit raises it — the fix is one class on one button.

**Why this is enough legally.** EDPB 05/2020 forbids treating *inaction* as consent; it nowhere requires a blocking banner. Nothing is stored and no analytics runs until a button is pressed, so a visitor who scrolls past the panel has granted nothing. **The cost:** fewer PostHog acceptances, because some people will simply use the site. No owner-facing number depends on PostHog — every figure in an owner report comes from our own `events` table — so what is lost is our own product analytics, not a report and not revenue.

**Guarded in three places, because the lock lived in three.** `tests/Feature/Analytics/ConsentPanelTest` asserts the markup (a dialog, not `aria-modal`, nothing laid over the page). `npm run check:consent` asserts that opening the panel adds `consent-open` and not `overflow-hidden`. `npm run check:render` loads every map surface as a first-time visitor at 390×844 and 1280×900 and asserts a tap at the top of the page reaches the page, the scroll is not locked by the panel, and the map button is hidden while it is open. That last check had been sharing one browser context across surfaces, so after the first "Odrzuć" the panel never appeared again — the phone-width flow the 12.09 amendment cites had not actually been exercised since. Each surface now gets a context of its own.

## What this prevents

A thin bar allows passive acceptance — users scroll past without deciding, and their continued use of the site is logged as implicit consent. EDPB has explicitly rejected this. A full modal blocks the product experience before any value is delivered, which increases bounce rate and gives a bad first impression. The panel is the middle ground: present, unavoidable as a choice, but not blocking content.

## Revisit when

If A/B data shows a dramatically higher bounce rate from the panel vs alternatives, revisit the format. Do not revisit the requirement for equal prominence of Odrzuć and Zaakceptuj — that is a hard legal constraint.

---

See also: `frontend-analytics-module.md`, `posthog-cdn-lazy-init.md`
