---
description: "Every menu operation by admin and owner, every badge and ordering, and what moves them."
version: 1.0
owner: Paweł Milewski
updated: 2026-10-07
status: living — reference
---

# Badges, menus and what moves them

What can be done to a venue's menu and by whom, which badge each action moves, and which orderings it moves. Read out of the code on 07.10.2026. It's the starting point for fault 1 in `change-flows.md` (an owner's word looks the same as a UNI check) and for the evidence model (E1–E3 in the 06.10 journal, Session 2).

**Parked on 07.10 until V2.** With `UNI_OWNER_ACCESS` off, every menu write in production is an admin's, made with a source URL and a check date, so the problem this page describes can't occur in V1. It becomes real the day the switch is flipped, and must be solved before that. See the sorted list in `roadmap/undone-inventory.md`.

---

## What can be done to a menu

A menu has three operations: **add**, **remove**, **confirm it's still there**. A catalogue product on a menu has no edit: changing it means removing one and adding another. House drinks are the other way round: they can be edited, and they have no confirm.

| Operation | Admin | Owner | What it writes | Moves |
|---|---|---|---|---|
| **Add catalogue product** | "Dodaj produkt" (source URL and check date required), or the menu CSV import ("Importuj karty") | "Dodaj produkt" (pick from the catalogue, **no source**) | Link row, `confirmed_at` = now, `added_by` = admin / venue_owner | Freshness date, score, the gate (publish if first item), offer log |
| **Product not in the catalogue** | Creates the product, then adds it | "Nie widzę mojego produktu" → proposal → admin approves → a **new** product is always created, `added_by` = proposal_approved, no source | As add | As add |
| **Remove catalogue product** | "Usuń" / bulk | "Usuń" | Link row deleted | Freshness date, score, the gate (offline if empty), offer log |
| **Confirm still on the menu** | "Potwierdź" (new source URL and check date), or the menu import finding a row already there | "Nadal w ofercie", **once a day per product, no source** | `confirmed_at` = now | Freshness date, the drink-page order. **No offer log** |
| **Add house drink** | Create (source and date), or the menu import | Create (**no source, and nothing on the row says the owner added it**) | `venue_drinks` row | Freshness date, score, the gate, offer log |
| **Edit house drink** | Edit | Edit | The fields | Freshness date only, offer log |
| **Delete house drink** | Delete | Delete | Row deleted | Freshness date, score, the gate, offer log |
| **Confirm house drink** | — | — | **Doesn't exist.** Editing is the only way to refresh one | — |

**Every admin path stamps "now", not the check date.** `confirmed_at` and the venue's freshness date are set to the moment of the click or the import, whatever `checked_at` says. That's fault 9, and it's sorted into Launch because the launch load goes through it.

## The badges

| Badge | Where it's shown | Rule | Admin | Owner | System |
|---|---|---|---|---|---|
| **Sprawdzona karta** | Venue page, tiles, list rows (✓ icon), the "sprawdzone" discovery filter, the city page count | `is_verified` **and** `last_menu_check_at` within 180 days (`uni.verification_valid_days`) | Switches `is_verified` (audited); sets the dates by hand (not audited); "Oznacz jako sprawdzone" sets `last_menu_check_at` = now (not audited) | **Nothing directly**, but every row an owner adds after the check is shown under the badge | Expires after 180 days |
| **Zaktualizowano X dni temu** | Venue page, tiles, the "aktualność" discovery filter | `offer_updated_at`; green within 90 days (`uni.freshness_days`); hidden when the menu is empty | Any menu change, "Potwierdź", the menu import | **Any menu change, or "Nadal w ofercie"**, so it can read "dziś" every day | The hourly job only moves it forward, to the newest row's `updated_at` |
| **Zarządza właściciel** | Venue page, tiles, the "właściciel" discovery filter | `is_claimed` | Approving a claim sets it; deleting the owner's account clears it; **demoting the owner in the user form doesn't** (fault 2) | Self-erasure deletes the whole venue (fault 5) | — |
| **Potwierdzone X dni temu** | Drink page, one per venue row | That product's `confirmed_at` at that venue | Add, "Potwierdź", import | **Add, "Nadal w ofercie"** | — |
| **ABV label** ("Zweryfikowane 0.0%", "ABV do potwierdzenia", …) | Drink, brand and venue pages; the "Tylko 0.0%" filter | `products.abv_status`, one value for the product everywhere | Product form, product import | Nothing. A proposal always arrives as unknown | — |
| **Venue type** (Bar, Restauracja, …) | Everywhere a venue is shown | `venue_type` | Venue form | Not editable | — |

## Orderings and listings

Not badges, but moved by the same actions, and they decide who a visitor sees first.

| Surface | Ordered or filtered by | Can an owner push it? |
|---|---|---|
| **Drink page** (at most 24 venues) | That drink's `confirmed_at`, newest first; then breadth; then id | **Yes.** A daily "Nadal w ofercie" keeps a venue first. This is the ranking lever in fault 1 |
| **Brand page** | Newest `confirmed_at` across the brand's products | **Yes**, the same way |
| **Discovery, default sort** | Breadth (products + house drinks) and category diversity | Yes, by adding items, including house drinks with no source |
| **Category pages, city × category pages** | Only venues whose product in that category was confirmed within 90 days **or never**; then the count in that category | Confirming keeps a venue listed |
| **Discovery filters** | Sprawdzone, właściciel, aktualność, as in the badges table | Aktualność: yes |

## What the tables show

Everything in the Owner column is the owner's word, but a visitor can't tell it apart from a fact UNI checked: it moves the same badges and the same orderings. Only "Sprawdzona karta" is admin-only, and even that badge covers rows an owner adds after the check.

On 06.10 it was decided that badges become rules over recorded evidence (the badges-are-rules-over-recorded-evidence record).

## Set by the founder, 07.10.2026

These reframe fault 1, and they are the starting point when it is picked up again.

- **No permanent manual check.** A badge is a rule over recorded facts; an admin going through a menu is V1 scaffolding, not the model.
- **The target meaning of "Sprawdzona karta": a venue its owner manages counts as checked.** UNI trusts the owner. **This reverses a written claim:** the what-the-badges-claim record (16.09) says the badge means "a person checked this menu within the last six months", and the 15.08 split made it independent of "Zarządza właściciel". Both are to be revised in the V2 badge step, not before.
- **No source labels on public pages** ("according to the menu", "according to the venue"). Visitors see dates, not provenance.
- **Owners are not asked for a menu link or any justification** when they add, edit or confirm. Every owner action is already recorded as theirs (`added_by`, the offer log), and that is UNI's answer in a dispute: the venue changed it.
- **The FAQ and the other public copy are drafts, written from the code**, never the other way round.

**What is left of fault 1 after this: the ranking lever.** "Potwierdzone N dni temu" is a per-drink date label, not a fixed badge: today it reads "Potwierdzone dziś", in two days "Potwierdzone 2 dni temu", past 90 days "N mies. temu". The drink page orders venues by that date, newest first, and an owner can press "Nadal w ofercie" once a day. A daily click therefore keeps a venue at the top of every drink page it serves, with nothing on the menu having changed. That is effort only an owner can spend, buying position on a shared page. **(Small, separate: the label counts yesterday as "dziś", because it treats 0 and 1 days alike; the venue's "Zaktualizowano" label does the same.)**

## Open, for when this is picked up again

- **The ranking lever:** what orders venues on a drink page, so that a daily click doesn't buy first place.
- **"Sprawdzona karta" redefined** around owner management, with the two records above revised.
- **E1–E3**, the evidence model's shape, in the 06.10 journal, Session 2. They need re-reading against the points above: with no source labels and no owner links, fewer kinds of evidence may be needed.
