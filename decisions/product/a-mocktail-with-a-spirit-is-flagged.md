# A drink called alcohol-free that lists an alcoholic ingredient is flagged, never approved as clean

**Date:** 2026-11-13
**Status:** Decided — Paweł, 13.11: "tackle the mocktail"
**Executed:** 2026-11-13 — each reading lists the ingredients; the line keeps both readings' lists; never in *Zatwierdź pewne*; *Zatwierdź* asks first
**Area:** Venues | Data Model

---

## Problem

The Roof's World Cup menu prints "Zapata's Fire Mocktail — Padron cordial · fleur · sotol · lime". The venue calls it a mocktail and lists a spirit in the same line, and both readings kept it as a house drink. The September card had more of the same: Suze (a 15% aperitif) in "Crumb", Lagg (also an Arran whisky) in "Too Hot to Handle". Publishing an alcoholic drink as alcohol-free is the worst error UNI can make, and no word list can catch it: only knowing what the ingredient is can.

## Options considered

Trust the venue's label. Drop any drink whose ingredients mention a spirit. Have the model list the normally alcoholic ingredients not marked 0%, keep the drink and flag it for a person.

## Decision

The model names every printed ingredient that is normally alcoholic and not itself marked alcohol-free or a known 0% product, and the drink is still listed. A line with such an ingredient is never a clean case: bulk approval skips it, and approving it alone asks for a confirmation that names the ingredient. A person decides, because some flags are 0% products of the same name (Giffard's bitter syrup).

## Rules

The ingredient is copied as printed; an ingredient either reading names counts, so one reading missing it changes nothing. Lucano 0%, Sober Rum 0%, Seedlip and Martini Vibrante are not flagged. The confirmation says to reject as "Napój z alkoholem" unless the ingredient is a 0% version here. The approval table shows the ingredient, sorts flagged lines last and can filter them.

## What this prevents

A sotol "mocktail" published as alcohol-free because the venue named it so. Dropping silently would have been the other failure: a drink with a 0% syrup of a spirit's name lost without anyone seeing it.

## Revisit when

Approvals show flags that are almost always wrong (then tighten the instruction), or a flagged drink slips through approved and later reported.

---

*See also: [[decisions/product/catalogue-excludes-actual-alcohol]] · [[decisions/adr/ADR-012-automated-venue-sourcing]] · [[decisions/product/what-belongs-in-the-catalogue]]*
