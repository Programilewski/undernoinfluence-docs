# A consent decision has to persist on the origin it was made on

**Date:** 2026-09-02
**Status:** Decided
**Executed:** 2026-09-02
**Area:** UI/UX

---

## Problem

The consent cookie was written with `Secure` unconditionally. A browser discards a `Secure` cookie
set over plain HTTP silently — no error, no warning — so on any non-HTTPS origin the decision was
never stored and the banner returned on the next page load. "Odrzuć wszystkie" looked broken while
doing exactly what it was asked. Every test on a phone hits the dev server over a LAN address, so
the one surface where the banner most needed checking was the one where it could not work.

## Options considered

Leave it, since production is HTTPS. Serve the development server over HTTPS with a local
certificate. Drop `Secure` everywhere. Set `Secure` only where it can be honoured. Store the
decision somewhere other than a cookie.

## Decision

`Secure` is set wherever it can be honoured and omitted where it cannot. Production behaviour is
unchanged; development stops silently discarding the answer. The cookie string is built by one pure
function so both branches can be asserted without a browser.

## Rules

A privacy control must be verifiable on the device a real visitor uses, which for this product is a
phone, so no control may depend on a transport that development does not have. Refusal is the
branch that gets tested first — an accepted consent that fails to persist merely re-asks, while a
refusal that fails to persist re-asks somebody who has already said no. Failures a browser swallows
without an error get a check that runs outside the browser, following the precedent set for map
layer definitions, because nothing server-side can see them.

## What this prevents

Prevents shipping a consent banner whose refusal path was never actually observed working, and
prevents the wider pattern of dismissing a development-only symptom that is hiding a real defect in
the one interaction the visitor is legally entitled to have respected.

## Revisit when

The development server gains HTTPS, at which point the conditional is harmless but no longer
load-bearing, and the check stays as a regression guard.

---

*See also: [[decisions/product/consent-banner-design]] ·
[[decisions/product/analytics-split-posthog-and-events]] ·
[[decisions/product/map-correctness-needs-a-browser]]*
