# A venue's page is read with its metadata, never by running its JavaScript

**Date:** 2026-11-17
**Status:** Decided — found by the diagnostic of source B's first home-server run, built the same day
**Executed:** 2026-11-17 — committed, ships with `v0.1.14`
**Area:** Venues

---

## Problem

Source B found a site for 8 of 20 places. Of 9 misses checked one by one, one was a venue's own site: Salute 21's page is drawn by JavaScript, so its visible text is empty and the name-and-address check failed, although the page states "ul. Marcina Kasprzaka 24A" in its description and its schema.org data. Every site built this way is a real venue lost, and its menu with it.

## Options considered

Leave such sites out. Run each page's JavaScript in a headless browser on the server. Read what the page already says about itself for search engines: its meta descriptions and its schema.org (JSON-LD) values, alongside the visible text.

## Decision

The text a venue's page is checked against is its visible text plus its meta description, `og:description`, `og:title` and its schema.org values. UNIbot does not run JavaScript. The name and the register's street and number must still both be found, so the check is no looser, only less blind.

## Rules

The same text is used by source B's name-and-address check and by source A's Warsaw-address check. Web addresses inside schema.org data are left out of the text. A page with nothing in its body and nothing in its metadata is still unreadable, and that is accepted.

## What this prevents

Losing venues whose sites are drawn by JavaScript, without putting a browser engine on the server: a heavy, slow process and a new attack surface for a crawler that fetches pages UNI does not control.

## Revisit when

Misses on sites with no metadata at all are measured to be a meaningful share of venues with their own site (1 of 9 misses on 17.11 was a site of any kind read wrongly).

---

*See also: [[decisions/product/a-registers-place-is-matched-by-name-and-address]] · [[decisions/product/a-search-result-must-read-as-a-venue]] · [[decisions/adr/ADR-012-automated-venue-sourcing]]*
