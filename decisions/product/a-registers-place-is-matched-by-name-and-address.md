# A place from the permit register gets a site only when the page shows its name and its register address

**Date:** 2026-11-16
**Status:** Decided — built and tested on 20 bars on 16.11; Paweł agreed to keep the register's ids for re-uploads
**Executed:** 2026-11-16 — `v0.1.12`, "Wczytaj listę zezwoleń" and "Znajdź strony lokali" on Kandydaci
**Area:** Venues | Data Model

---

## Problem

Source B starts from Warsaw's permit register: a name and an address, but no website. One search per place returns mostly directories, review sites and company registers. In the first batch, a bar's own site came 16th in its results. A food hall's site (Hala Koszyki) gave a tenant's address and claimed the tenant (Bibimbar). A wrong match attaches another place's menu to a venue.

## Options considered

Accept any domain with a Warsaw address, as source A does. Accept a domain that gives the register's address. Require the address and the name together. Check the results in search order, or put domains carrying the place's name first.

## Decision

A domain becomes the place's site only if its homepage or contact page gives both the place's name and the register's street and number. Domains containing a word of the name are checked first, up to eight. On the same 20 bars this found 7 sites instead of 5, with no wrong match.

## Rules

Nothing of Brave's results is stored. A place with no match keeps only a note saying how many sites were checked. A site another candidate already holds is left to it, as a probable chain location. Once a site is found, its menu is looked for straight away, at no cost. The register's permit ids are kept, so a re-uploaded list adds only new places, and a rejected place stays rejected. Places with no name in the register, and stalls, banquet rooms and theatre or cinema buffets, are not imported.

## What this prevents

It stops one shared address (food halls, malls, hotels) from handing a place someone else's site and menu. It stops directories from ever being taken for a venue. And re-uploading the register never reopens a place that was already rejected.

## Revisit when

A larger batch shows the find rate stuck near a third for reasons other than "no site", such as JavaScript-only pages or addresses written differently. Or a venue's menu sits on a QR-menu vendor's subdomain, which is still an open question.

---

See also: [[decisions/adr/ADR-012-automated-venue-sourcing]] · [[decisions/product/a-sourcing-candidate-is-a-location]] · [[decisions/product/a-search-query-sent-within-30-days-is-skipped]]
