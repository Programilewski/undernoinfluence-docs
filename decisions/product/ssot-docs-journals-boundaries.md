# Where project knowledge lives: SSOT vs docs/ vs journals/

**Date:** 2026-07-24
**Status:** Decided
**Executed:** standing rule — nothing to execute once; it binds future work
**Area:** Documentation

---

## Problem

The interactive SSOT (`inspo/interactive_v1_feature_spec_SSOT.html`) had swollen to 693 KB by absorbing three kinds of content with completely different lifecycles: durable product-state, dated daily-work logs, and point-in-time audit reports. Nobody could tell what the file was *for*, half of it duplicated content that already had a home elsewhere, and a 693 KB HTML file is unusable on a phone. Get the boundaries wrong and the "single source of truth" becomes a place where every source contradicts a fresher copy somewhere else.

## Options considered

Leave everything in the SSOT and treat it as the one true document. Split by lifecycle across the three existing locations (SSOT, `docs/`, `journals/`). Collapse audits into a short status summary and drop the detail into git history. Replace duplicated SSOT sections with links to `docs/` — but this hit a wall because several `docs/` targets were *staler* than the SSOT.

## Decision

Content is sorted by lifecycle, not topic. The SSOT keeps only product-state, decisions, and version scope, plus pointers out. Dated session history lives in `journals/`. Canonical reference and audit material lives in `docs/` as markdown, and the SSOT links to it. Where a `docs/` target was staler than the SSOT (compliance especially), we *promoted* the fresh SSOT content into `docs/` rather than link to the stale file.

## Rules

Sort every piece of content by one test: if it describes the current or target state of the product it belongs in the SSOT; if it is dated session history (todos, bug logs, "what shipped today") it belongs in a `journals/` entry; if it is a canonical reference or audit with a `docs/` home it lives in `docs/` and the SSOT links to it. When `docs/` is staler than the SSOT, move the fresh SSOT content into `docs/` and update the draft — never link to a stale file. When a section is migrated out, leave a short pointer stub in the SSOT that keeps its anchor id so sidebar links still resolve. Prefer markdown in `docs/` and `journals/` over HTML so the material is readable on a phone through Obsidian or GitHub.

## What this prevents

It prevents the SSOT from becoming a dumping ground where product truth, daily noise, and frozen audit snapshots blur together and silently contradict each other. It also prevents the reverse failure we nearly caused: "cleaning up" by linking the SSOT to `docs/` files that were actually older, which would have degraded the record instead of improving it.

## Revisit when

Revisit if the SSOT starts re-accumulating audit or daily-log content, or if `docs/` and `journals/` diverge enough that the sorting test stops being obvious. Reassess the HTML SSOT's role entirely if `docs/` markdown becomes complete enough to regenerate or replace it.

## See also

- ADR-010-migration-squash (structural cleanup precedent)
- `docs/README.md` (declares `docs/` the operational source of truth)
- `journals/README.md` (daily session format)
