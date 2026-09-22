# V1 Copy Truth: Owner-Facing Pages Describe Email Workflow Only

**Date:** 2026-06-17
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** UI/UX | Brand

---

## Problem

The v1 branch is browse-only — no auth, no self-service owner panel. Several public-facing pages (home, regulamin, for-venues, about) described the owner panel as if it currently existed: "Po weryfikacji otrzymasz dostęp do panelu", "zalogować się do panelu i potwierdzić swoją kartę". A venue owner reading this reaches a dead end — the panel is not accessible, there is no registration flow, and the described workflow simply does not exist yet. The first interaction becomes a broken promise rather than an honest pitch.

## Options considered

Keep aspirational panel copy as-is, explaining the future product — but this presents a live product feature that does not exist, which is a trust liability, not a pitch.

Remove all forward-looking panel references entirely — accurate but undersells the roadmap.

Describe the actual v1 workflow (email-based) while marking the self-service panel explicitly as coming — honest about today, credible about tomorrow.

## Decision

All owner-facing copy in v1 must describe the email-based workflow that actually exists. Self-service panel capabilities must not be described in present tense. Forward-looking references to the panel are allowed only when explicitly marked as coming ("jest w przygotowaniu"), so owners know it is planned, not live.

## Rules

Every owner-facing FAQ, feature description, or explainer must pass this test: if a venue owner reads it and tries to follow the described steps today, can they complete them? If the answer is no, the copy must be rewritten. The word "panel" is acceptable only in future-tense constructions ("panel ... jest w przygotowaniu") or in admin-only contexts. The phrase "zaloguj się" must not appear on any page in v1. Deletion and data export requests must point to the email address, not to a profile page or panel.

## What this prevents

A venue owner who reads that a self-service panel exists and then cannot find it concludes either that the product is broken or that UNI is overpromising. Both outcomes damage the B2B relationship before it starts. The first 20 venue onboardings in v1 are critical social proof — each one needs to leave feeling the product delivered what it promised, so they become advocates rather than detractors.

## Revisit when

When the owner panel ships (v1.5 or later), all email-based copy must be updated to describe the self-service flow. The decision record `browse-only-v1.md` defines the scope of v1 — when that decision is superseded, this one is too.

See also: [[decisions/product/browse-only-v1]]
