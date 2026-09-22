# Registration age gate: 18, on civil law grounds

**Date:** 2026-06-15
**Status:** Decided
**Executed:** not applicable in V1 — there is no registration form for the checkbox to sit on ([[decisions/product/browse-only-v1]])
**Area:** UI/UX | Brand

---

## Problem

UNI requires users to confirm they are 18 at registration ("Mam ukończone 18 lat" checkbox). The threshold and its legal justification have been wrong twice: first 16 was used (based on GDPR Art. 8), then 18 was used but attributed to the wrong statute. Getting the legal basis right matters because if the gate is ever challenged, you need to be able to explain it accurately — and because the basis determines whether the gate is an obligation or a choice.

## Options considered

16, citing GDPR Art. 8 (minimum age for consent to information society services). 18, citing the Polish Civil Code (full contractual capacity). Remove the gate entirely, since no law mandates it for a venue directory. 13, citing the lower bound of limited civil capacity in Poland.

## Decision

The gate stays at 18, justified by the Polish Civil Code: full contractual capacity (*pełna zdolność do czynności prawnych*) begins at 18. UNI's registration creates a service agreement — the same basis used for GDPR Art. 6(1)(b) — so requiring a counterparty with full legal capacity is accurate and sufficient. GDPR Art. 8 never applied (it is consent-only, and UNI's legal basis is contract). The gate is not a legal obligation; it is a legitimate, defensible business decision.

## Rules

The checkbox reads "Mam ukończone 18 lat" and must not cite a specific law in the UI — the law does not need to be named, and citing the wrong one creates more exposure than citing none. The validation rule (`accepted`) is unchanged. No document-based age verification is required; the checkbox creates a contractual representation from the user.

## What this prevents

Two failure modes: (a) gating at the wrong age due to a misread of GDPR Art. 8, which only controls consent-based processing; (b) over-engineering a verification flow that has no legal mandate. The civil law basis is accurate, proportionate, and requires no additional implementation.

## Revisit when

UNI allows users aged 13–17 to use a restricted version of the service (read-only, no account). At that point, limited civil capacity rules would need to be applied and the terms of service updated accordingly.
