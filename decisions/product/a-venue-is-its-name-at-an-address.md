# A venue is its name at an address, and its URL is set once

**Date:** 2026-09-18
**Status:** Decided
**Executed:** 2026-09-18 — `Venue::slugFor()`, the importer's identity rule, the admin form; `venue-url-structure` amended
**Area:** Data Model | Venues

---

## Problem

Asked whether chains need anything done while it is cheap, a test import of three "Semolino" rows at three addresses produced two venues: the importer found venues by a slug made from the bare name, so each location overwrote the one before, without an error. The same code created venues under the bare name and renamed the slug the first time a street was saved, which after launch would break every shared link with nothing to redirect it.

## Options considered

Keep bare-name slugs and number the duplicates (`semolino-2`). Build slugs from name and street for every venue. Add a chain grouping table now.

## Decision

A venue is identified by its name at an address in a city, never by its name alone, and its URL is built once from name and street and never rewritten automatically. No chain table now: a grouping can be added later and filled from names in minutes, and nothing in V1 shows one.

## Rules

A new venue's slug is name plus street (`semolino-pulawska`). The number joins only when two locations share a street, a numbered suffix is the last resort, and a venue with no street yet is addressed by its name. Nothing renames a slug afterwards; an admin may, and the form says what that costs. The importer identifies a row by an explicit slug, or else by name, street, number and city, and anything that matches nothing is a new venue. A blank slug cell keeps an existing venue's address.

## What this prevents

Silent loss of a chain's locations during cataloguing, and unrelated same-name venues merging. URLs that change after they have been indexed or shared. Addresses like `semolino-2` that depend on the order venues were typed in.

## Revisit when

A chain-level page or chain pricing is wanted. That is when a grouping column earns its place, backfilled from names.

---

*See also: [[decisions/product/venue-url-structure]] (amended) · [[decisions/product/owner-panel-ships-behind-one-switch]]*
