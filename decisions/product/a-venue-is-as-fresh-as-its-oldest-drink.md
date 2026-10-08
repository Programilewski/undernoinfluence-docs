# A venue is as fresh as its oldest confirmed drink

**Date:** 2026-10-08
**Status:** Decided; to build before the owner switch
**Executed:** no
**Area:** Venues | Scoring

---

## Problem

"Zaktualizowano" is the day someone vouched for the offer (the updated-means-vouched-for record). But every venue has one date, and any single action moves it to today: confirming one drink, an owner's "Nadal w ofercie" on one item, editing one house drink. A venue with 29 drinks unconfirmed since spring reads "Zaktualizowano dziś" because one was clicked; once owners can click, one click a quarter keeps a venue looking fresh forever.

## Options considered

Keep it (any action moves the venue). Only an explicit whole-menu confirmation moves the venue. The venue's date is its oldest confirmed drink. The date by which a share (say 80%) of drinks were confirmed.

## Decision

A venue's "Zaktualizowano" is the oldest confirmation among its current drinks, and owners and the admin get a "Wszystko nadal w ofercie" action that confirms every item at once. It is the vouching definition applied to the whole menu: the venue was updated on the day by which everything on it had been vouched for. Precedents: OpenStreetMap's still-unresolved argument over whether `check_date` means "everything checked" or "it exists" shows a date must say what was checked; HappyCow's "last update" by any edit is the weak pattern UNI had. Founder, 08.10.2026: "I'd do all as you recommended", noting it may need a slight rework later (V1, V2 or further).

## Rules

Confirming one drink moves only that drink, and moves the venue only if it was the oldest. "Wszystko nadal w ofercie" confirms every item and is recorded on each. A newly added drink is vouched for the day it is added, and never makes the older drinks fresher. A removed drink simply stops holding the venue's date back. A menus import confirms the lines it lists; drinks the file did not list keep their date. House drinks count with their own date. The owner panel names the drink holding the date back ("Najstarsze potwierdzenie: Crodino, 84 dni"). Nothing paid and no single click moves a venue's freshness.

## What this prevents

One click buying a whole venue's freshness, the badge counterpart of the one-ordering rule that no click buys position. A badge that overstates what was checked.

## Revisit when

Before the owner switch, when it is built: it changes how the admin's own re-checks move a venue (confirm everything, or use the whole-menu action), so it was kept out of V1. After launch, if owners find the oldest-drink rule harsh (one forgotten drink holding a venue back), weigh a share-based rule or a reminder. Paweł expects a possible slight rework.

---

*See also: [[research/results/one-click-refreshes-the-whole-venue]] · [[decisions/product/updated-means-vouched-for]] · [[decisions/product/one-ordering-for-every-venue-list]] · [[decisions/product/badges-are-rules-over-recorded-evidence]]*
