# Category taxonomy — Drinki 0% merge, SEO slugs, hidden categories

**Date:** 2026-05-12
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** Categories | UI/UX | Data Model

---

## Problem

The initial category set had overlapping entries (mocktajle, drinki, koktajle) that confused both users and data entry. Category slugs needed to work for both UI display and SEO landing pages. Some categories existed in the data model but weren't ready for public display.

## Options considered

1. **Keep all granular subcategories** (mocktajle, koktajle, drinki separately) — confusing, venues would struggle to categorize correctly.
2. **Merge related categories into broader groups** — cleaner UX, simpler data entry.
3. **Multi-tag system** (products belong to multiple categories) — deferred, overkill for V1.

## Decision

Merge mocktajle/drinki/koktajle into a single "Drinki 0%" category. Six main categories for V1: Piwo 0%, Wino 0%, Drinki 0%, Szampan 0% (sparkling), Cydr 0%, Alkohole mocne 0% (spirits). Category display names use "0%" suffix. SEO slugs use `-bezalkoholowe` suffix (e.g., `piwo-bezalkoholowe`) for Polish search optimization. The "(Nie)mocne" experimental category is hidden at launch via `is_visible = false` — present in the database but not shown publicly.

## Rules

Category slugs are stable — even when display names change, slugs stay the same (this affects SEO URLs). Each product belongs to exactly one primary category; multi-tag is deferred. Edge cases like grzaniec or aperol (spanning categories) use single primary category assignment. Hidden categories can be activated later without migration.

## What this prevents

User confusion from overlapping categories and SEO fragmentation from unstable slugs. A venue owner who can't figure out where to put their mocktail will add it to the wrong category or give up.

## Revisit when

Multi-tag categorization may be needed if product diversity grows beyond what single-category assignment can handle. The (Nie)mocne category activates when there's enough product variety to justify it.
