# New search templates are worded from the menus UNI has read, and run for the whole city

**Date:** 2026-11-17
**Status:** Decided — Paweł, 17.11: "can you supply the list of templates yourself directly?"
**Executed:** 2026-11-17 — nine templates seeded on the PC and the home server (`v0.1.13`), each noted "untested"
**Area:** Venues | Analytics

---

## Problem

Source A had seven templates that were really one query in seven versions: a drink's name, "menu", a district, "Warszawa". A claude.ai review on 16.11 said so and proposed four directions; the 16.11 session agreed in one line and added nothing, so the set stayed thin while the best-looking template had been sent for one district only. More variants of the same query would cost money and find the same pages.

## Options considered

More drink-name variants of the existing form. The claude.ai conversation's own word list as it stood. A generator composing templates from lists of words and districts. A handful of hand-written templates using title and body operators, the words menus actually print (taken from the lines UNI has read), venue kinds instead of drinks, and the whole city instead of eighteen districts.

## Decision

New templates are hand-written, about ten at a time, from the words UNI's own menu lines print ("0%" on 34 of 69 lines, "Piwa bezalkoholowe", "Mocktaile", "Aperol Spritz 0%"), from venue kinds (winiarnia, multitap), and with title and body apart (`intitle:menu inbody:"0%"`). They run for the whole city, so each costs one request per run instead of eighteen. Each is kept or switched off on its measured yield, as every template already is.

## Rules

A new template carries a note with its date, where its words came from, and "untested" until one round has run. A template without "{district}" is sent once per run. A merged template does not switch off the ones it merges until its yield matches theirs (templates 3 and 4 stay on beside the merged PDF query). Brave's second page of results is not fetched until a whole-city template shows its venues run past the first page. No code composes templates; the admin's list is the whole set.

## What this prevents

Paying eighteen requests for each guess, searching for words menus don't print, and a generator producing hundreds of near-identical queries whose yield nobody can read.

## Revisit when

After one round of the nine on the home server (prune by yield), when source B makes source A a supplement rather than the main source, or for a second city.

---

*See also: [[decisions/product/search-queries-are-templates-measured-by-yield]] · [[decisions/product/a-search-query-sent-within-30-days-is-skipped]] · [[decisions/adr/ADR-012-automated-venue-sourcing]]*
