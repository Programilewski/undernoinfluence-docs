# CARTO is named in the privacy policy as a recipient

**Date:** 2026-08-24
**Status:** Decided
**Executed:** superseded 2026-08-27 — CARTO is no longer used; the policy names OpenFreeMap. The Rule about naming every recipient stands
**Area:** Compliance | UI/UX

---

## Problem

The map loads its tiles from CARTO's servers, so CARTO receives every visitor's IP address. The privacy policy did not mention this, which makes CARTO an undisclosed recipient of personal data — a gap in substance, not in style. Naming a recipient costs one sentence; failing to name one is what an audit records as a finding.

## Options considered

Name CARTO in the privacy policy. Ask a lawyer before writing anything. Self-host tiles to remove the recipient altogether, which is real infrastructure spend against a V1 that is meant to validate rather than scale.

## Decision

CARTO is named in the privacy policy as a recipient of visitor IP addresses for the purpose of serving map tiles. A disclosed recipient is a sentence; an undisclosed one is a finding, and the removal of light mode already reduced this to a single provider rather than two.

## Rules

Every third party that receives visitor data because a public page loads their resource is named in the privacy policy before that page goes live. Services called only from the admin panel are a different case: they are recorded in the ROPA rather than the visitor-facing privacy policy, because no visitor data reaches them. Adding a new external resource to a public view requires the policy entry in the same change, not afterwards.

## What this prevents

Prevents the standard audit finding of an undeclared processor, and prevents the slower failure where each new frontend convenience quietly adds a recipient nobody records until someone asks for the full list and it has to be reconstructed from the source.

## Revisit when

A second tile or map provider is introduced, or tiles move to self-hosting, at which point the entry changes rather than disappears.

See also: [[decisions/product/dark-map-tile-provider]], [[decisions/product/single-palette-no-theming]]
