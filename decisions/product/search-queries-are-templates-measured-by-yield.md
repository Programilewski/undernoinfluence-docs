# Search queries are templates in the admin, measured by what each one yields

**Date:** 2026-11-13
**Status:** Decided — Paweł, 13.11: "do all of it"
**Executed:** 2026-11-13 — *Szablony zapytań*, yield per template, "Do wyłączenia?" flag, neighbourhoods in *Szukaj lokali*
**Area:** Venues | Analytics

---

## Problem

Source A's queries lived in a config file: changing one meant a deploy, nothing recorded why it was there, and the yield page split each query into one row per district, so no query could be compared with another. Every Brave search is paid, so which searches actually find venues has to be a number, not a feeling.

## Options considered

Keep the config list. A spreadsheet of queries kept by hand. Templates in the database, edited in the admin, with yield counted per template. (Another model advised against building metrics before trying one afternoon of PDF searches; the metrics were built anyway because they cost nothing to run, and the advice is followed from here: run, then tune.)

## Decision

Each query is a template with "{district}" where a run's districts and neighbourhoods go. Templates are added, edited and switched off in the admin with a note saying why, and never deleted, because the candidates a template found are its yield. The yield adds up per template: domains, candidates, venues, rejections and drops, with the per-district queries underneath.

## Rules

A template with 50 domains found and no venue is flagged "Do wyłączenia?"; nothing is switched off automatically. A run may name neighbourhoods as free text beside the districts. A new form of query is tested on Brave before it becomes a template: `intitle:` works, `inurl:` does not, `-site:` exclusions changed nothing, brand-name OR lists find shops.

## What this prevents

Paying for searches that only ever find reports and shops, and losing the reason a query was added or changed.

## Revisit when

Templates number in the dozens, or a second city needs its own set.

---

*See also: [[decisions/product/a-search-result-must-read-as-a-venue]] · [[decisions/adr/ADR-012-automated-venue-sourcing]]*
