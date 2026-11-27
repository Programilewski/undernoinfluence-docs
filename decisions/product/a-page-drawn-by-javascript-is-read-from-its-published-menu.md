---
description: "A menu page whose visible text is unusable, or names no number at all, is read from the menu it publishes as schema.org data (sections as headings, items with prices); with neither, the read fails visibly and nothing is sent to the model."
---

# A page drawn by JavaScript is read from its published menu

**Date:** 2026-11-27
**Status:** Decided
**Executed:** 2026-11-27, `v0.1.23`
**Area:** Sourcing

---

## Problem

Six menus on the home server, all on ChoiceQR, were read with zero lines. Their visible text was 375 characters of cookie banner. The whole card, with every section and price, sat in data the page's script draws from, which the text extractor drops. The model was paid to read a cookie banner, and the result looked like "no alcohol-free drinks here" when nothing had been read: Browar Warszawski had six 0% cocktails, Soul Lounge a 13-drink alcohol-free section.

## Options considered

1: a reader for ChoiceQR's own page data. 2: a generic reader for any embedded data with names and prices, guessing each vendor's price units and headings. 3: alongside either, a page with almost no text is shown as unread instead of being sent to the model. Building 1 showed that ChoiceQR also publishes the full card as standard schema.org data (Menu, MenuSection, MenuItem, prices in złoty), so 1 was built on that instead of the vendor's private data.

## Decision

**1 and 3.** Paweł chose them on 27.11. A page's visible text is still read first, so no page that worked changes. When that text is unusable, or names no number at all (no price, volume or strength), the schema.org menu is used, its section names written as headings because a heading that says alcohol-free vouches for its lines. With neither, the read fails with the reason ("no_numbers") and nothing is sent.

## Rules

Only text reaches the model, never markup. The approval view notes when a menu came from schema.org data. Any site publishing a schema.org menu is covered, not only ChoiceQR. On 27.11 the six menus were read again for about $0.02: Soul Lounge gave 8 lines, Browar Warszawski 6, and the other four had none for real reasons (wine lists, soft drinks, an unbranded cider).

## What this prevents

A menu the reader could not see passing as a venue with no alcohol-free drinks, and paying to read cookie banners.

## Revisit when

A real menu page with no numbers at all is refused, or a site's schema.org menu turns out older than the card it shows.

---

*See also: [[decisions/product/a-menu-on-a-qr-menu-vendors-page-is-the-venues-own]] · [[decisions/product/a-venue-page-is-read-with-its-metadata-not-its-javascript]] · [[decisions/product/a-menu-heading-vouches-for-its-own-lines-strength]]*
