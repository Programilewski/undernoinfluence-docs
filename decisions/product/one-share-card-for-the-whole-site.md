# One Share Card For The Whole Site

**Date:** 2026-09-08
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** Brand | Infrastructure

---

## Problem

No page carried a share image, so every link pasted into a message, sent in B2B outreach or passed on by a venue owner rendered as bare text. Link sharing is the cheapest distribution the product has and the one the growth plan actually leans on, which makes a missing card a direct loss of clicks. The tempting answer — a card generated per venue and per city, naming the place and its offer — is also the expensive one.

## Options considered

Generate a card per page at request time. Generate cards in a background job and store them. Commission a designed image. Build one card for the whole site from assets already in the repository. Keep shipping without one.

## Decision

One card serves every page, built from the wordmark paths already in the site's own icon file, so it is the brand's typography rather than an approximation of it. Per-page cards were rejected on cost: they need image rendering, a queue and somewhere to store the output, which is recurring infrastructure V1 has deliberately not taken on. Downloading a font into the repository was unnecessary once it was clear the logotype is already vector art.

## Rules

The share card is generated from assets in the repository, never from an external service, and is regenerated from the logotype if the logotype changes. It carries no claim that varies by page, so it can never be wrong about the page it accompanies. Every page inherits it from the layout, and no page overrides it until there is per-page artwork worth showing. The social title tracks the page title rather than being written twice, so the two cannot drift.

## What this prevents

Links that look broken or untrustworthy at exactly the moment someone is passing them on. It also prevents V1 taking on an image-rendering pipeline for a cosmetic gain, against the standing rule that validation-stage work avoids recurring infrastructure.

## Revisit when

Venue photographs exist. A card showing a real place is worth per-page generation in a way that a card showing a venue's name is not — and that is the same moment the storage question has to be answered anyway.

---

*See also: [[decisions/product/faceless-brand]], [[decisions/product/single-palette-no-theming]], [[decisions/product/brand-and-product-pages]]*
