# Venue type filtering and absolute scoring

**Date:** 2026-04-22
**Status:** Decided
**Executed:** 2026-09-17 — the types matched this record from 2026-09-16 (`kawiarnia` and `hotel` added, a cocktail bar being a `bar` rather than its own class), and the filter itself now exists on `/mapa` as `typ`, multi-select, `Inne` deliberately not offered
**Area:** Scoring | UI/UX | Venues

---

## Problem

Różne typy venue (restauracje, bary, puby, kawiarnie) mają z natury różną pojemność na ofertę NoLo. Bar koktajlowy może mieć 15 pozycji, restauracja realistycznie 3–5. Przy jednym wspólnym rankingu restauracje zawsze toną na dole listy, co zniechęca ich właścicieli do uczestnictwa w platformie. Jednocześnie sztuczne podbijanie restauracji byłoby nieuczciwe wobec barów, które faktycznie inwestują w szeroki asortyment NoLo.

## Options considered

**Relative scoring per venue type** — breadth bars i badge'e liczone w ramach kategorii venue. Restauracja z 3 pozycjami dostaje mocny badge "w kontekście restauracji". Problem: w widoku ogólnym (bez filtra) użytkownik widzi restaurację z mocnym badge'em obok baru z mocnym badge'em i nie rozumie, dlaczego restauracja z 3 drinkami wygląda tak samo jak bar z 15.

**Absolute scoring + venue type filter** — jeden scoring dla wszystkich, ale użytkownik może filtrować po typie venue i wtedy widzi np. tylko restauracje posortowane między sobą.

**Oddzielne rankingi/leaderboardy per venue type** — osobne algorytmy, osobne strony. Duży scope creep na V1.

## Decision

Scoring, breadth bars i badge'e są zawsze absolutne — jedno kryterium, jeden system, niezależnie od typu venue. Filtr venue type pozwala użytkownikowi zawęzić listę do interesującego go typu lokalu (np. "restauracje"), a istniejący scoring sortuje wyniki w ramach tej zawężonej puli. Pub z 15 pozycjami zasłużenie jest wyżej niż restauracja z 3 w widoku ogólnym. Restauracja z 3 pozycjami jest wyżej niż restauracja z 1 po włączeniu filtra.

## Rules

Venue types na V1 to 3–4 kategorie: restauracja, bar/pub, kawiarnia/koktajlbar, hotel. Właściciel wybiera typ przy rejestracji. Nie tworzymy oddzielnych badge'y typu "najlepsza restauracja NoLo" — to dodaje złożoność i podważa zaufanie do systemu. Filtr venue type to prosty zawężacz listy, nie osobny algorytm rankingowy. Jeden scoring, jeden zestaw badge'y, filtry tylko zawężają widok.

## What this prevents

Zapobiega sytuacji, w której użytkownik traci zaufanie do badge'y — widząc mocny badge na restauracji z 3 drinkami i mocny badge na barze z 15, nie rozumie systemu. Zapobiega też scope creep — oddzielne algorytmy per venue type to osobna warstwa logiki do budowania, testowania i tłumaczenia właścicielom. Eliminuje kłótnie właścicieli restauracji ("dlaczego jesteśmy zawsze niżej") — filtr daje im uczciwy widok w ich kategorii, ale nie oszukuje systemu.

## Revisit when

Post-V1, jeśli właściciele restauracji zgłaszają, że platforma nie motywuje ich do poszerzania oferty NoLo. Wtedy rozważyć opcjonalne "best in category" wyróżnienia — ale dopiero po walidacji, że filtr venue type sam w sobie nie wystarczy.

---

*See also: kebab-rule.md*
