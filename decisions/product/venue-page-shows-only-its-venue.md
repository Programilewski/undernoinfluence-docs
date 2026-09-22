# A venue's page shows only that venue

**Date:** 2026-09-19
**Status:** Decided
**Executed:** 2026-09-19 — the "W pobliżu" list, the neighbouring pins on the venue map, the nearby query and the `venue_nearby_clicked` event are removed
**Area:** Venues | UI/UX | Strategy

---

## Problem

Every venue page ended in "W pobliżu": up to five other venues within a kilometre, with links, and the same venues as grey pins on the page's map. The venue page is the page an owner is asked to claim, keep fresh and one day pay to understand — and it closed by sending the visitor to the competition. Paweł: owners *"will probably have a problem for 'promoting' the competition on their venue page"*, and it *"will anger the owners"*.

Against it stood the mission test in [[decisions/product/mission-is-the-healthy-choice]]: *does this help somebody find a healthier option they would otherwise have missed?* A visitor on a venue with a thin non-alcoholic menu, shown a better one around the corner, is exactly that person.

## Options considered

**Keep the list and the pins.** Best for the one visitor whose venue disappoints; worst for the relationship the product's revenue depends on, on the page that relationship is about.

**Remove the pins, keep the list.** Tried first on 19.09. It changed nothing an owner would notice — the list named and linked the same competitors below the menu.

**Remove both, and leave comparison to the neutral surfaces.** The map, the city and district pages, the category pages and the product pages already put venues side by side, and a visitor reaches all of them without the venue page recommending anyone.

## Decision

**No other venue is named, listed or pinned on a venue's page.** The page is about that venue: its offer, its freshness, how to get there.

Paweł: *"we need to balance between the user and the owner. If we focus 100% on the user and neglect the owner, we will not be able to financially sustain ourselves."* That is the mission record's own condition — *"the mission requires the project to survive, and survival requires revenue"*, and the revenue it names is selling venues honest information about their own visibility. An owner does not buy that from a product whose page about them advertises their neighbours.

The visitor loses a shortcut, not the option. Every venue in the list is still one tap away on the map, which is where comparing belongs: it shows everything in view, ranked by nothing a venue can influence. Exploration from the venue page continues through its own menu — a product leads to that product's page.

## Rules

A venue's page never names, lists, pins or links another venue. Navigation to neutral pages — breadcrumbs, the district and city links in the address, product and brand pages — is not a recommendation and is not covered by this rule; a product page listing where else that drink is served is the product's page, not the venue's.

`Venue::scopeNearby()` stays: the owner analytics use it for anonymous area counts ([[decisions/product/analytics-three-tiers]]), which name no venue.

This is not paid placement and does not become one: it holds for every venue, claimed or not, on every plan. Nothing an owner pays for changes what appears on their page or anyone else's ([[decisions/product/ranking-is-never-for-sale]]).

## What this prevents

The page an owner is asked to care about working against them — before the first owner has signed in. And the half-measure of 19.09 morning, where the pins went and the list that did the same thing stayed.

## Revisit when

Data shows visitors leaving venue pages with nowhere to go — exits from the venue page to nothing, where they used to reach another venue. The answer then is a better route back to the map, not a list of competitors on someone else's page.

---

*See also: [[decisions/product/mission-is-the-healthy-choice]] · [[decisions/product/analytics-three-tiers]] · [[decisions/product/ranking-is-never-for-sale]] · [[decisions/product/list-rows-show-the-place-not-a-map]]*
