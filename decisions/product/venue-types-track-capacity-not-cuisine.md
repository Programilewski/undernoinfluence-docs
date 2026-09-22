# Venue types track NoLo capacity, not cuisine

**Date:** 2026-09-16
**Status:** Decided
**Executed:** 2026-09-16 — `kawiarnia` and `hotel` added, the form default removed
**Area:** Venues | Data Model | UI/UX

---

## Problem

`venue-type-filtering` named four V1 classes — restauracja, bar/pub, kawiarnia/koktajlbar, hotel — and the enum shipped with `restauracja`, `pub`, `bar`, `inne`. So every café and hotel landed in `inne`, and `venue_type` defaulted to `inne` as well, which made "nobody classified this" and "this really is other" the same value. A journal in June flagged it with a deadline written on it: *decide before importing, not after*. The filter exists so a restaurant with three items can be compared against other restaurants rather than sinking beneath a cocktail bar with fifteen — and that mechanism does nothing if a third of the catalogue is one bucket.

## Options considered

Leave the four values and accept `inne` as a catch-all. Add `kawiarnia` as a cuisine label. Add `kawiarnia_koktajlbar` as one compound class, matching the older record's hyphenated phrasing. Add `kawiarnia` and `hotel` as separate plain words.

## Decision

Six values: `restauracja`, `pub`, `bar`, **`kawiarnia`**, **`hotel`**, `inne`. The compound was rejected once written out — **a cocktail bar is already a `bar`**, so pairing it with "kawiarnia" made one lumpy class whose only justification was that both are drinks-led. What was genuinely missing was the café. **The form default is removed**, so `inne` becomes a deliberate answer rather than what a venue gets when nobody chose.

The list tracks **capacity for a non-alcoholic offer**, not what kind of food is served — that is what the filter compares, so that is what the values must mean.

## Rules

A new type is added only when it names a genuinely different capacity for a NoLo offer, never to describe cuisine. `inne` stays out of the public filter options and is reserved for places that really are other — a cinema bar, a bowling alley, a theatre foyer. **Adding a type admits nobody**: `venue_type` is a label and a filter, never an admission gate, and what a venue may enter on is decided by the catalogue scope rule alone.

## What this prevents

Prevents the venue-type filter being useless on arrival because the largest category is the one that means nothing, and prevents the type list drifting into a cuisine taxonomy — at which point it stops answering the only question it was built to answer, which is who is comparable with whom.

## Revisit when

Clubs appear often enough in real cataloguing to earn `klub`, which was deliberately left out of V1 as rare.

---

*See also: [[decisions/product/venue-type-filtering]] · [[decisions/product/what-belongs-in-the-catalogue]] · [[decisions/product/kebab-rule]]*
