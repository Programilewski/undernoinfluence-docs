# The venue form starts from the name and address on the venue's own site

**Date:** 2026-11-13
**Status:** Decided — Paweł, 13.11: "cant it be fetched from the website too?" and "yes" to the name
**Executed:** 2026-11-13 — read during *Znajdź menu*; *Utwórz lokal* pre-filled; *Źródło adresu* is the page it came from
**Area:** Venues | Data Model

---

## Problem

Creating a venue from a menu opened with an empty name and address, so every venue meant reading its site and typing both. The address check had already read the homepage and thrown the address away.

## Options considered

Keep typing by hand. Ask the model reading the menu (menus rarely print addresses, and it costs per venue). Read the venue's own pages: structured data first, then the printed address, the contact page when the homepage has none.

## Decision

The candidate's name and address are read from its own pages when its menu is searched, and the venue form starts from them. A person confirms them, and GUGiK must place the address with the same street and number before the venue gets a point.

## Rules

Only empty fields are filled, so a correction is never overwritten. A page printing two addresses equally often gives none; one printed at least twice as often as any other wins (a chain location's page). An address printed with a Warsaw district instead of the city counts. *Źródło adresu* records the page the address was read from, never a business register.

## What this prevents

A typing step on every venue, and an address source that names a menu file rather than the page that showed the address.

## Revisit when

Sites that render only with JavaScript become a large share of venues; their pages can't be read this way.

---

*See also: [[decisions/product/geocoding-comes-from-the-state-register]] · [[decisions/product/a-sourcing-candidate-is-a-location]]*
