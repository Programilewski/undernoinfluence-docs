---
description: "A venue's menu hosted by a QR-menu vendor (ChoiceQR, eatbu, UpMenu) is the venue's own source: it is found, read and refreshed like any menu, and the vendor page is the venue's website only when the venue has no site of its own; UNI never publishes a vendor's full card or price list."
---

# A menu on a QR-menu vendor's page is the venue's own

**Date:** 2026-11-27
**Status:** Decided
**Executed:** standing rule — vendor pages already pass the website and address checks since 2026-11-17 (a venue page is read with its metadata); ChoiceQR menus became readable 2026-11-27, `v0.1.23`
**Area:** Sourcing

---

## Problem

Many venues keep their menu on a QR-menu vendor's page, at an address like `soul-lounge-bar.choiceqr.com`: the venue writes and updates it, the vendor hosts it, and the QR code on the table opens it. Some venues have no other website. The question had waited since 16.11. On 27.11 it turned out the code had already answered it by accident: since 17.11, a page drawn by JavaScript is checked with its schema.org data, and ChoiceQR's carries the name, street, postcode and phone, so vendor pages passed both checks. Nine such candidates were on the home server (six ChoiceQR, three eatbu). The only thing stopping them was that ChoiceQR menus could not be read.

## Options considered

A: accept them, after reading the vendors' terms; the vendor page is the venue's website only when the venue has no site of its own. B: use a vendor page only as the menu source, never as the website, so a venue without its own site is not listed. C: block vendor domains, losing for example Browar Warszawski's six 0% cocktails and Soul Lounge's alcohol-free section.

## Decision

**A.** Paweł chose it on 27.11, on the condition that the terms were read first. The menu is the venue's own text, published for its own guests, and it is the most current card the venue has. Dropping it would lose drinks a guest can order tonight over who hosts the file. The terms were read the same day. ChoiceQR's partner terms (6.4) say the menu content belongs to the venue. Its user terms (8.5) forbid robots used "with the aim of reusing substantial parts" of the content and publishing "lists of Products and their prices"; their "User" is someone who orders through the app, and UNI publishes only the few alcohol-free drinks it lists, never the card. eatbu's venue pages are the venue's own site built on DISH, with only a privacy notice linked and no visitor terms.

## Rules

A vendor page is found, verified, read and refreshed like any other menu. It becomes the venue's website only when the venue has no site of its own; when both exist, the own site is the website and the vendor page is the menu. UNI never publishes a vendor's full card or its price list, only the drinks it lists. Owner verification is unaffected: the e-mail route compares the full host, so nobody matches a vendor subdomain, and these owners use the Instagram code.

## What this prevents

Real venues with real alcohol-free drinks lost because their menu lives on a vendor's page, which source B found to be the largest fixable loss. A quiet rule in the code that nobody had decided.

## Revisit when

A vendor objects or changes its terms, a vendor's pages start refusing automated reading, or a venue with both its own site and a vendor page turns up as two candidates.

---

*See also: [[decisions/product/a-venue-page-is-read-with-its-metadata-not-its-javascript]] · [[decisions/product/a-page-drawn-by-javascript-is-read-from-its-published-menu]] · [[decisions/product/owner-requests-are-checked-through-the-venues-own-channels]]*
