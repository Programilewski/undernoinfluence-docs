# NIS2 does not apply to UNI; Art. 21 measures tracked voluntarily

**Date:** 2026-06-22
**Status:** Decided
**Executed:** standing assessment — re-assess on the triggers below
**Area:** Compliance

---

## Problem

The EU NIS2 Directive (2022/2555) imposes significant security obligations on regulated entities. These include formal risk analysis, incident reporting to national authorities within 24–72 hours, mandatory supply-chain security requirements, and significant fines (up to €10M or 2% of global turnover). If UNI is in scope, these are not optional. The question: does NIS2 apply, and what is UNI's obligation?

## Options considered

Treating UNI as potentially in-scope and building toward full NIS2 compliance as a pre-launch requirement. Assessing scope formally and acting only on confirmed obligations. Ignoring NIS2 entirely.

## Decision

Under No Influence is not regulated by NIS2 as a current legal obligation. UNI is not in any Annex I sector (energy, transport, banking, health, water, digital infrastructure, public administration, space) and is not an Annex II digital provider above the size threshold (50+ employees or €10M turnover). No compliance burden exists today. The Art. 21 security measures are tracked voluntarily in the SSOT because they represent sound practice for any internet-facing service and because scope can change.

## Rules

NIS2 applicability must be re-assessed if any of the following occur: UNI expands to operate in 3+ EU member states simultaneously, the team reaches 50+ employees, annual revenue reaches €10M, or if CERT Polska issues sector-specific guidance that extends scope. Until then, NIS2 items are labelled "voluntary" in the audit register, not "required". The Art. 21 voluntary checklist in the SSOT tracks backups (21(2)(c)), MFA (21(2)(j)), and supply-chain documentation (21(2)(d)) as the highest-priority gaps even without a legal obligation.

## What this prevents

Treating NIS2 as in-scope prematurely would trigger obligations that do not yet exist (formal incident reports to national authorities, mandatory DPIAs for all new processing, supply-chain audits of every tool). This would divert significant founder time from V1 launch without any legal necessity. The voluntary tracking of Art. 21 measures captures the genuine security intent without the regulatory overhead.

## Revisit when

At 50 employees or €10M revenue, whichever comes first. Also revisit if the Polish KSC (Krajowy System Cyberbezpieczeństwa) amendment expands sector definitions to include digital venue directories, or if a regulatory authority issues guidance that changes the scope analysis.
