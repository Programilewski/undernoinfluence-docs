# SSOT Document Structure: Dependency-Ordered, Summary-First

**Date:** 2026-06-29
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14 (`docs/product/spec.html`)
**Area:** Documentation

---

## Problem

The interactive SSOT (`inspo/interactive_v1_feature_spec_SSOT.html`) had grown to 51 sections but its reading order contradicted its own logic: it presented the Decision Registry and Assumption Registry *before* the Market Evidence and User Personas those decisions rest on, and defined Scoring eleven sections after the Discovery/Filters/SEO features that depend on it. The "Reference" group was physically torn apart (FAQ and BRD stranded mid-way through the audit run), the 20-section audit pile was ordered by date rather than theme, and there was no top-of-document summary, a stale title date, and a horizontally-overflowing mobile layout. A source-of-truth nobody can read top-to-bottom stops being a source of truth.

## Options considered

Leave it and rely on the sidebar/search to jump around. High-impact-only fixes (just evidence-before-decisions + Scoring + un-stranding FAQ/BRD). A full reorder into dependency order with a regrouped audit appendix and a new summary panel. Writing the plan up for later review instead of acting.

## Decision

We did the full reorder. The document now opens with an **At a Glance** summary panel (identity, canonical "last updated", key metrics, what-it-is, and the live launch blockers), then flows in strict dependency order: Foundations (Personas → Market Evidence → Decisions → Assumptions → Scoring) → Product (B2C → B2B → System) → Future (V2/V3) → Reference → a themed Audit appendix (Status → Engineering → UX & Localization → Legal & Compliance). The redundant hero was merged into the At a Glance panel.

## Rules

Anything a section depends on must appear before it — evidence before decisions, shared concepts (e.g. Scoring) before the features that use them. The At a Glance panel is the single canonical place for current status, the launch-blocker list, and the document's "last updated" date; other sections defer to it rather than duplicating status. Reference material stays grouped in Reference, never interleaved with audits. The audit appendix is grouped by theme (Status, Engineering, UX & Localization, Legal & Compliance), not by audit date. The document must read top-to-bottom with no horizontal overflow on a phone, and the sidebar reading order must mirror the body order. Large structural edits to this file are done with a validated script that asserts every section block survives exactly once, not by hand.

## What this prevents

A source-of-truth that only works as a random-access lookup is one most readers — a new collaborator, a future developer, the founder six months from now — will never actually read in order, so they miss the *why* behind decisions. Dependency-ordered reading means each concept is defined before it's used, so the document teaches rather than just records. The summary-first panel means anyone gets the essence in ten seconds without scrolling 6,800 lines, and the single canonical status block stops the launch-blocker list from drifting out of sync across three different sections.

## Revisit when

The document outgrows a single HTML file (consider splitting into linked pages), or a new top-level domain of work appears that doesn't fit the Foundations → Product → Future → Reference → Audits arc. Re-audit the order whenever several new sections are added at once.

---

*See also: [[decisions/product/transactional-email-provider]]*
