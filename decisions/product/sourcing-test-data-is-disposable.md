# Sourcing test data is disposable until the pipeline works

**Date:** 2026-11-13
**Status:** Decided — Paweł, 13.11: "When we know its all working at least in 80%, i'd rather remove it and fetch again"
**Executed:** 2026-11-13 — *Wyczyść dane testowe* on Kandydaci, outside production; the PC reset the same day
**Area:** Venues | Data Model

---

## Problem

The pipeline is being tuned on real venues, so every round leaves candidates, menus, readings and venues made under rules that have since changed. Tidying them by hand costs time and leaves data that no longer matches what the pipeline would produce today.

## Options considered

Tidy and correct the test data as it goes. Wipe it with a one-off command each time. An admin action that starts the pipeline's data over, refused in production.

## Decision

Everything the pipeline stores on the PC and the home server is test data until it works in about 80% of cases; then it is wiped and fetched again from scratch. *Wyczyść dane testowe* does the wipe: every search, candidate, menu with its file, reading and line, and the venues the pipeline itself created.

## Rules

Seed venues that were only linked to a candidate stay, and so do the query templates, which are the tuning rather than the data. The action is hidden and refused in production. Each environment keeps its own data; nothing is copied between machines.

## What this prevents

Launch data shaped by early bugs, and time spent correcting records a fresh run would make correctly.

## Revisit when

The pipeline reaches the ~80% mark; after the final wipe, the data is real and the action stays a test-machine tool.

---

*See also: [[decisions/product/the-real-catalogue-reaches-production-only]] · [[decisions/adr/ADR-012-automated-venue-sourcing]]*
