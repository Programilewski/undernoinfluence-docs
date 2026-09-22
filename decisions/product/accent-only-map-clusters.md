# Grouped pins stay the accent colour

**Date:** 2026-08-30
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14 (clustering itself ships switched off)
**Area:** UI/UX | Brand

---

## Problem

Grouping pins costs information: a pin says "beer, four items" and a group says "five
venues", which is the one thing this map has over any other map. Colouring each group
by the category it mostly holds was built to win some of that back — a beer-heavy
street would read orange rather than generic purple.

## Options considered

Colour each group by its dominant category, aggregated as the group is built. Colour
groups by the accent alone. Split a group into several coloured arcs. Do not group at
all.

## Decision

Groups are painted in the accent colour whatever they contain. The dominant-category
version was built, worked, and was rejected on sight: six saturated circle colours
sitting among six category-coloured pins reads as noise. The palette's job is to make a
category legible on a single pin, not to be spread across the map.

## Rules

The palette is applied to pins, never to groups, clusters, or any surface that
represents more than one venue. A group carries a count and nothing else. If grouping
is switched on and the loss of category information proves to matter, the answer is to
reconsider the grouping threshold rather than to colour the groups.

## What this prevents

Prevents a map where saturation no longer means anything, because it is used both for
"this venue serves beer" and for "several venues are near here". It also prevents the
subtler failure of a group's colour being read as a claim about every venue inside it.

## Revisit when

Grouping is switched on permanently and owners or users are observed asking what is
inside a group before clicking it.

---

*See also: [[decisions/product/map-pins-are-pre-rendered-images]] ·
[[decisions/product/map-pins-as-a-data-layer]] ·
[[decisions/product/single-palette-no-theming]]*
