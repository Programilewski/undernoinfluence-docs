---
description: "Licence-register places without a known website wait on their own admin page, Lista zezwoleń (load the register, search websites, reject); Kandydaci shows only candidates with a website, from either source, and a place moves there by itself when its website is found."
---

# Candidates are split by stage

**Date:** 2026-11-27
**Status:** Decided
**Executed:** 2026-11-27, built and committed; not yet on the home server
**Area:** Sourcing

---

## Problem

Kandydaci had grown to do two jobs. On the home server about 2,610 of its 2,650 rows were licence-register places still waiting for a website search, in one table with about 40 real candidates. The register's buttons (*Wczytaj listę zezwoleń*, *Znajdź strony lokali*) sat beside the web search's, so it was unclear which button worked on which rows. Paweł compared it to a class with too many responsibilities.

## Options considered

Split by source: one page for the web search, one for the register. Split by stage: one page for places without a website, one for candidates with one. Tabs on one page, which would leave every action in one class. Leave it and group the buttons.

## Decision

**Split by stage.** Paweł asked for it on 27.11. The two sources differ only in how a venue's website is found; once it is known they are the same thing and take the same steps. So the line is drawn where the work changes, not where the row came from.

## Rules

Lista zezwoleń shows licence-register places whose website is not known: load the register, search websites (with the cost shown first), reject, filter by status, kind of place and whether a search was run. Kandydaci shows every candidate with a website, from any source: web search, add by hand, find menu, add locations, reject. A place whose website is found moves to Kandydaci by itself and its menu search starts as before. Both pages read the same table; nothing in the data changes.

## What this prevents

Two thousand waiting register rows burying the forty candidates that need attention, and buttons that look as if they work on rows they ignore.

## Revisit when

A third source arrives, or a stage gets work of its own, such as a review step between a website found and a menu searched.

---

*See also: [[decisions/adr/ADR-012-automated-venue-sourcing]] · [[decisions/product/a-menu-on-a-qr-menu-vendors-page-is-the-venues-own]]*
