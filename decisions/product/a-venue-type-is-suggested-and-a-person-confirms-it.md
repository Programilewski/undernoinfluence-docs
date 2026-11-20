# A venue's type is suggested from three signals, and a person confirms it

**Date:** 2026-11-20
**Status:** Decided by Paweł, 20.11: one set of strict venue-type rules for him and the menu reader alike, and "jeżeli to klub, to nie wrzucamy, ignorujemy kluby"
**Executed:** 2026-11-20, `v0.1.16`. `VenueType::guidelines()`, `VenueTypeHint`, a type per venue in *Utwórz lokale*, the "Lokal" column in Biblioteka menu; `menu_extractions.venue_type` and `venue_type_evidence`, `sourcing_candidates.schema_org_type`
**Area:** Venues | Sourcing | Data Model

---

## Problem

*Utwórz lokale* gave every selected menu one type, chosen for the whole batch (decision 6 of the 17.11 journal). Biblioteka menu showed a menu's domain but not the venue's name, and only source B knows the kind of place, from the permit register. So a batch from source A was chosen blind. The 17.11 decision rejected guessing a type from a site or a name because a wrong guess would be invisible: written to the venue, seen by nobody.

## Options considered

1. Keep one type per batch and add a name column, so a batch can be picked by hand.
2. Choose a type per venue in the batch, with no suggestion.
3. Suggest a type per venue from the signals UNI already has, showing where each came from, and let a person confirm it.
4. Write the suggested type straight to the venue.

## Decision

**Option 3.** Each menu in *Utwórz lokale* gets its own type field. The field is filled with the most trusted signal, and every signal is shown under it. Nothing is written until a person submits the form. That keeps what decision 6 was protecting: no guess reaches a venue unseen. Decision 6 is superseded.

**One set of rules, in one place.** `VenueType::guidelines()` holds the rules in Polish. The menu reader receives them inside its prompt, and the same text folds out on top of *Utwórz lokale*. They can never disagree. The rules follow the venue-types-track-capacity-not-cuisine record: the type says how large a non-alcoholic offer such a place realistically carries, not what food it serves. They are checked in order, and the first that fits wins: hotel, kawiarnia, restauracja, pub, bar, inne. The venue's name never decides; the menu does. Borderline cases have their own rules: a restaurant with a big bar, a gastropub, and bar versus pub.

**Clubs are not listed.** A club is a nightclub, a disco, or a music club with a dance floor. UNI does not add clubs, and test 1 of the what-belongs-in-the-catalogue record is amended to say so. A klubokawiarnia is not a club.

## Rules

- **The signals, most trusted first:**
  - **The permit register's first word.** `bar "Pinta"` means bar, `Pizzeria …` means restauracja, `klub …` means klub. Words that say nothing certain (lokal, sezonowy, klubokawiarnia, a hyphenated "Bar-restauracja") suggest nothing.
  - **The two readings of the menu, when both name the same type.** Each reading answers one of the codes, or null when it can't decide, and quotes the heading or line that decided it, for example "Piwa z kranu". Only the latest pair of readings counts. One reading alone, or two that differ, suggest nothing.
  - **The schema.org type the venue's own page declares.** `Restaurant` means restauracja, `CafeOrCoffeeShop` kawiarnia, `Hotel` hotel, `NightClub` klub. `BarOrPub` doesn't tell a bar from a pub, so it suggests nothing.
- **A club in a batch:** the field offers "Klub — odrzuć", and submitting it rejects the candidate with the reason "Klub — UNI nie dodaje klubów", so the pipeline never proposes it again. The single *Utwórz lokal* form never fills a club in as a type and says to reject the place.
- **Skipping:** "Pomiń" leaves a menu without a venue, for later.
- **No suggestion:** a menu with no suggestion must have its type chosen; the field is required.
- **Clubs and source B:** *Znajdź strony lokali* never searches for a register place whose entry starts with "klub", and "Kluby" is gone from its kinds. A search would only cost a request.
- **Menus read before 20.11** have no type from the menu reader. They are not read again for it, because reading a menu again re-queues its lines. They get the register's and the site's signals only.
- **Cost:** the rules add about 1,150 input tokens to each of a menu's two readings. On Haiku 5.5 ($0.10 per million tokens) that is about $0.00023 a menu.

## What this prevents

- **A blind batch:** a source A batch is no longer chosen by domain and typed as one.
- **An invisible guess:** a suggestion is always shown with its source and the line behind it, and confirmed by a person.
- **Two sets of rules:** the person and the model can't drift apart, because there is one text.
- **Clubs in the catalogue,** and paid searches for them.

## Revisit when

- **The menu reader's suggestion is often corrected** in *Utwórz lokale*: tighten the rules, or drop the menu signal.
- **A new type is proposed:** it goes through the venue-types record first, then into the rules.
- **Clubs:** if a club's offer turns out to be what people look for, the scope amendment is reopened.

*See also: [[decisions/product/venue-types-track-capacity-not-cuisine]] · [[decisions/product/what-belongs-in-the-catalogue]] · [[decisions/adr/ADR-012-automated-venue-sourcing]] · [[decisions/product/a-registers-place-is-matched-by-name-and-address]]*
