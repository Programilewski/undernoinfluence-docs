# Custom Drinks Rules

**Status:** **Built without photos — and that is an unresolved contradiction.** **Verified against code 2026-08-18.** Custom drinks work (105 in the database, CRUD in the owner panel through `DrinksRelationManager`, counted into `breadth_score`). But [[decisions/product/custom-drink-photo-gate]] required a photo on every drink **as a barrier against inventing entries**, and D-04 removed photos from V1 entirely — nobody ever reconciled the two. Today there is no barrier at all. It does not hurt in V1, because one person enters the data; it starts hurting the day owners edit their own cards.

## The Problem

Custom/house mocktails are valuable signals of NoLo commitment but easy to exploit. A venue could claim 15 fake custom mocktails to inflate their breadth score.

## Requirements for Listing a Custom Drink

1. **Photo required** — no photo, no listing. This is the primary friction barrier against fakes.
2. **Short description required** — name, base ingredients, flavor profile.
3. **Listed as "unverified"** until community confirmed.

## Validation Flow

1. Owner submits custom drink with photo + description
2. Drink appears on venue profile as unverified
3. A user who visits the venue can confirm "yes, this exists"
4. Enough confirmations → drink becomes verified
5. Users can also flag "this drink wasn't available"
6. Enough flags → drink enters "needs reconfirmation" state

## Scoring

- Verified custom drinks count toward category breadth the same as branded products
- Unverified custom drinks also count (to incentivize adding them) but carry lower confidence weight
- No special scoring multiplier for custom drinks in V1
- Deferred: whether custom drinks should score higher than branded products

## Tagging

When submitting a custom drink, the owner selects applicable tags from the tag list (e.g., Funkcjonalny, Ziołowy, Wegański). Tags are shown as checkboxes with hints:
- "Probiotyczny" → hint: "np. kombucha, kefir, napoje fermentowane"
- "Funkcjonalny" → hint: "np. z adaptogenami, z elektrolitami"

This educates owners on what tags mean without being restrictive.

## Abuse Prevention

- Community flags from users with activity history can strip tags if inaccurate
- Owner over-tagging is mitigated by the same flag system that handles product availability
- Photo requirement is the primary anti-spam mechanism — high friction for fakers, low friction for honest venues

## Connection to Other Systems

- Custom drink flags feed into [[product/features/User Flagging]] system
- Custom drink verification feeds into [[product/features/Verified Checkmark]] confidence score
- Custom drink photos handled by Intervention Image (crop, resize, optimize)
