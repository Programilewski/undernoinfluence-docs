# Kebab rule — venue eligibility for V1

**Date:** 2026-04-22
**Status:** Decided
**Executed:** standing rule — enforced by the activation gate since 2026-09-13; restated as test 2 of [[decisions/product/what-belongs-in-the-catalogue]] on 2026-09-16
**Area:** Venues | Data Model

---

## Problem

Piwo 0% fizycznie istnieje w lodówce kebaba, ale nie jest w menu, nie ma nazwy, nie ma stabilnej ceny. Czy takie venue powinno trafić do UNI? Produkt sam w sobie jest valid (piwo 0%), ale kontekst venue nie daje wartości użytkownikowi szukającemu doświadczenia NoLo.

## Options considered

**Włączać wszystko, co ma produkt NoLo** — maksymalizuje pokrycie mapy, ale zalewa bazę miejscami typu żabka, stacja benzynowa, kebab. Dane są kruche (dziś jest to piwo, za tydzień inne), weryfikacja niemożliwa, breadth bars i verified checkmark nie mają na czym się oprzeć.

**Włączać tylko venue z NoLo w menu** — naturalnie filtruje do miejsc, gdzie oferta NoLo to świadoma decyzja lokalu. Mniejsze pokrycie, ale czystszy sygnał.

## Decision

Na V1 venue musi mieć produkt NoLo w menu lub w stałej, nazwanej ofercie napojowej. "Widziałem coś w lodówce" to za mało. Ta reguła naturalnie filtruje kebaby, żabki i stacje benzynowe, zostawiając restauracje, bary, kawiarnie i hotele — miejsca, gdzie oferta NoLo jest intencjonalna.

## Rules

Produkt musi być identyfikowalny: nazwa, cena, stała pozycja w ofercie. Venue bez menu napojowego (tylko "napój" w lodówce) nie kwalifikuje się na V1. Nie oznacza to, że kebaby nigdy — ale na V1 priorytetem jest wiarygodność danych i zaufanie do platformy.

## What this prevents

Chroni verified checkmark i breadth bars przed oparcie się na danych, które zmieniają się z dostawy na dostawę. Zapobiega rozwadnianiu platformy miejscami, do których nikt nie idzie "na NoLo". Utrzymuje spójność przekazu: UNI to nie "mapa każdej butelki 0% w Polsce" — to "gdzie wyjść, żeby mieć dobry wybór NoLo".

**Amended 2026-09-16 — this rule was cited backwards twice, so it is restated in English.** The requirement is a **named item in the venue's drinks offer, with a price** — on a menu, a board, or a standing list. A bottle seen in a fridge is not enough, and that is the case this rule is named after. Two commute documents (18.09, 19.09) cited it as admitting exactly that case; it excludes it. Nothing about the rule changed, only the confidence with which it can be quoted. It is now test 2 of [[decisions/product/what-belongs-in-the-catalogue]], which adds the place and the drink as tests 1 and 3.

**Amended 2026-09-13 — a house drink qualifies a venue as much as a catalogue product.** A named mocktail on the venue's own menu is a standing, named NoLo offer, so it counts towards the venue going live; until 13.09 the code looked only for catalogue products. See [[decisions/product/venue-activation-gate]].

## Revisit when

Post-V1, jeśli segment fast-casual/street food zacznie świadomie budować ofertę NoLo z nazwanym menu. Wtedy rozszerzyć eligibility o nowe typy venue.

---

*See also: [[decisions/product/what-belongs-in-the-catalogue]] · venue-type-filtering.md*
