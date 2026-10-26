# Menu lines describe the style, not the brand

**Date:** 2026-10-26
**Status:** Decided in principle — the style list, draught vs bottle and one KCPU question are open
**Executed:** no — the record is a task, in the Launch backlog
**Area:** Venues | Data Model | Categories

---

## Problem

With brand names off every public label ([[decisions/product/no-brand-names-on-public-drink-labels]]), a venue's menu shrinks to category counts: "Piwo 0% ×3 · Wino 0% ×1". That falls below the value threshold, the point where a visitor finds enough to stay and use the site. The brand name was telling the visitor what kind of drink it is and how much choice there is; something without a trademark has to say that instead.

## Options considered

Category counts only. A single score in place of the menu (rejected in the 18.10 briefing: a number tells nobody what they can order). Free-text descriptions per product. A style chosen from a closed list, with the ABV certainty the catalogue already records.

## Decision

**A branded product shows as its category plus a style from a closed list, with 0,0% or ≤0,5%.** For example, "Piwo 0% · lager ×2 · pszeniczne · IPA, all 0,0%". A style such as "lager" belongs to no company and promotes no brand, and the same field drives the style landing pages ("lager bezalkoholowy Warszawa") that replace the brand-name searches UNI gives up.

## Rules

A descriptor must not let anyone work out the brand. Only styles from the closed list are allowed, with flavour only as part of a style ("radler cytrynowy"). Not allowed on a brand-stripped row: a brand's own product words ("Free", "Italian Spritz"), country or origin, packaging or colours, and praise or taste claims. The style is set by hand when a product is added, and arrives through the products import. A value outside the list is refused, the way `abv_status` is guarded.

## What this prevents

A menu that names nothing a visitor can picture, which was the original worry about bouncing. It also prevents a brand coming back in disguise: a free-text description slides into the brand's own words, and a precise enough combination ("Irish stout 0,0%") points to exactly one product.

## Revisit when

The stay metric after launch shows the style lines aren't enough, or KCPU reads generic style words as "a symbol referring to alcohol". In that case the same reading would hit the category names too, and the whole naming question reopens.

**Open, 26.10:** (1) the closed list. Proposed: lager, pils, pszeniczne, IPA, stout, radler, sour; wine: musujące, białe, czerwone, różowe; cydr. Spirit alternatives to be named. (2) Whether draught vs bottle is recorded: a strong signal, but a new fact per venue to keep current. (3) Whether a follow-up to KCPU asks about generic style words and cocktail-named recipes; the 18.10 e-mail asked neither.

---

*See also: [[decisions/product/no-brand-names-on-public-drink-labels]] · [[decisions/product/abv-trust-model]] · [[decisions/product/shared-recipes]] · [[decisions/product/one-ordering-for-every-venue-list]] · [[briefings/commute-2026-10-18]]*
