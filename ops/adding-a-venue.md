---
description: "How a venue gets into UNI: what qualifies, where to find candidates, what to record, and the steps in the admin, one at a time or in a batch."
owner: Paweł Milewski
updated: 2026-10-09
status: runbook — the procedure for every venue, on launch day and after. Steps read from the admin's code on 07.10.2026
---

# Adding a venue

The procedure for every venue: the first thirty on launch day, and each one after. The rules behind it are in four decision records: venue-data-acquisition-flow (sources and what is recorded), kebab-rule (eligibility), what-belongs-in-the-catalogue and catalogue-excludes-actual-alcohol (what counts as a drink). This page turns them into steps; when they disagree, the records win and this page is corrected.

---

## 1. What qualifies

A venue goes into UNI when **both** are true:

1. **It's a physical place where you can sit down and order a drink**: a bar, café, restaurant, pub, hotel bar or similar. Shops, delivery-only kitchens and event caterers don't qualify. Detail: `product/rules/Venue Rules.md`.
2. **Its own published offer names at least one non-alcoholic drink**: on its menu page, menu PDF, or its own Instagram or Facebook post. "We have alcohol-free beer" doesn't count; "Heineken 0.0" does. A house mocktail with a name counts as much as a bottled product.

**Nothing else is a condition.** Not the number of NA drinks, not the categories, not the district. A wine bar with five 0% wines qualifies the same way a cocktail bar with fifteen mocktails does. Decided 07.10.2026: every eligible venue found is added, in the order it is found; there is no "best first" filter.

**What is a drink, and what isn't:** a non-alcoholic member of a drinking category (beer, wine, sparkling, cider, spirits, mixed drinks), or a house drink of one of three types: `mocktail`, `koktajl_nolo`, `drink_spirytus_0`. Juice, lemonade and soft drinks are not.

**Classics and the venue's own drinks** (decided 08.10, the shared-recipes record): **the name decides the table, the description decides the link.** A line printed as a known classic ("Virgin Mojito", "Mojito 0", "Aperol Spritz 0") is the classic itself, a catalogue product like any bottle: leave the house-drink columns empty and the import matches it. A line with its own name ("Mojito rabarbarowe", "Torcello") is a house drink; when its description is built on a classic's core (lime, mint and fizz is a mojito; a 0% gin, bitter and vermouth is a negroni), also give the classic's slug in the `recipe` column, and it shows on the venue page as "Wariant klasyka" and on the classic's page under "Wersje lokali". Otherwise it is the venue's own creation. Classics are created only in the admin (Produkty, "Przepis wspólny"), when the first launch menu has one; their names end in "bezalkoholowe/-y/-a", e.g. "Mojito bezalkoholowe". Anything with actual alcohol in it is never catalogued.

## 2. Finding candidates

Finding venues is the slow part, so record everything you find, not just the ones that qualify.

- **Search engines with operators** have worked best so far. Examples:
  - `"bezalkoholowe" "karta" warszawa`
  - `"0%" "piwo" menu warszawa site:.pl`
  - `"mocktail" OR "koktajle bezalkoholowe" warszawa`
  - `filetype:pdf "karta napojów" "0%" warszawa`
- **The Warsaw alcohol licence register** (2,815 licence holders, in `~/fetch/lokale_parsed_2.xlsx`). It's a list of places that serve drinks, not of places that serve NA drinks. Use it to go through a street or a district systematically, opening each venue's own menu.
- **Brands' "where to drink us" pages** are good leads, but use them **alongside** your own searches, never instead. Used alone, they tilt the map toward one brand's stockists, which is exactly the influence UNI exists to avoid.

**Never copy from another listing site.** Item names are facts and may be recorded; descriptions are someone else's writing and may not.

## 3. The working spreadsheet

It lives outside both repositories and outside Syncthing, with your other working material. It holds:

- **every candidate you checked**, with the date;
- **the rejected ones, with the reason** ("no NA item on the menu", "menu not published", "closed"). The record requires this: it measures how fast the work goes, and it doubles as the sales prospect list;
- **contact or owner details, if you collect any for outreach. These stay in the spreadsheet; they never go into the application.**

## 4. What to record

### Per venue

| Field | Required | Note |
|---|---|---|
| Name | yes | As the venue writes it |
| Type | yes | One of: restauracja, pub, bar, kawiarnia, hotel, inne |
| City | yes | Must already exist (25 cities are seeded) |
| Street, number, postcode | for the map | From the venue's **own** pages, never from the licence register |
| District | no | **Geocoding fills it** for Warsaw, from GUGiK's cadastre (built 09.10). Fill it only to override: a district already on the venue is never replaced. A live venue without one is missing from its district page, so check it after geocoding |
| Slug | recommended | The venue's address on UNI, `/miejsce/<slug>`. If left empty, it's built from name + street. Fill it yourself when importing: the menu file refers to venues by slug. **Never change it once the venue is live**: there's no redirect, so the old address and its ranking are lost |
| Description, phone, website, Instagram | no | Only what the venue publishes itself |

Coordinates aren't typed in; the geocoder fills them from the address (step 5).

### Per drink

| Field | Required | Note |
|---|---|---|
| Venue | yes | Its slug |
| Drink, as the menu writes it | yes | "Heineken 0,0 but. 0,33". The import matches it to a catalogue product |
| Source | yes | **The web address of the menu you read it from**: menu page, PDF, or the venue's own post |
| House drink type | only for house drinks | `mocktail`, `koktajl_nolo` or `drink_spirytus_0`. Leave empty for catalogue products, classics included |
| Recipe | only for a house drink built on a classic | The classic's slug, e.g. `mojito-bezalkoholowe`. The import refuses an unknown slug, and a slug on a row without a house drink type |

**A web address is always required**, decided 07.10: a drink seen in the venue but not published anywhere online waits until it is. **Why the source is required:** it's what lets UNI say "checked, and here's where" if a visitor or an owner disputes a drink. The import refuses a drink row without it. **There is no date column** (decided 08.10, the updated-means-vouched-for record): every row is dated with the day of the import, and the venue reads "Zaktualizowano dziś", because loading the file is you vouching that the menu is current today. Load a menu only when you're sure it still holds.

### Per product (only when a drink isn't in the catalogue yet)

| Field | Required | Note |
|---|---|---|
| Name | yes | The product's own name, e.g. "Heineken 0.0" |
| Brand | yes | **Must already exist** (built 08.10): add it in the admin under Marki first. The import finds a brand ignoring capitals and extra spaces and never creates one; an unknown brand fails the row with the nearest existing name ("Nie ma marki „Heinken”. Najbliższa: Heineken"). Polish characters count: "Zywiec" is not "Żywiec" |
| Category | yes | Its slug: `piwo`, `wino`, `drinki`, `niemocne`, `cydr`, `musujace` |
| ABV and ABV status | no | Leave both empty if unknown. `0.0` only with `verified_zero`, and only when the producer states it |

## 5. Adding one venue in the admin

For a single venue, any day after launch.

1. **Lokale → Utwórz.** Fill in name, type, city, address; slug if you want a specific one. Leave "Aktywny" off: the venue switches itself on when it's ready (step 4).
2. **Open the venue → "Geokodowanie (GUGiK)".** This fills in the coordinates and, for Warsaw, the district, both from the state register. Check the district it picked.
3. **"Produkty w ofercie" tab → "Dodaj produkt"** for each catalogue drink, with the menu's address and the date read. If the drink isn't in the catalogue: create it first under **Produkty → Utwórz** (brand, category, ABV status), then come back.
4. **"Autorskie drinki" tab → "Dodaj drinka"** for each house drink, with its type, the menu's address and the date read.
5. **Done when** the venue is live on its own: once it has coordinates and at least one drink, it switches itself on, and the hourly check catches anything missed. Open `/miejsce/<slug>` and check that the menu shows.

## 6. Adding venues in a batch (and launch day)

Brands by hand, then three CSV files imported in this order from the admin. Each import has a button to download an example file. The order and every failure message below are rehearsed by `LaunchLoadTest` in the application.

| # | Step | Where |
|---|---|---|
| 0 | Cities, districts, categories | Already there: created by the seeders on every server |
| 1 | **Brands**, by hand, for every brand the products file names | Marki → Utwórz |
| 2 | **Products** file, for drinks not yet in the catalogue. A row naming an unknown brand fails with the nearest name | Produkty → Importuj |
| 3 | **Venues** file. **Fill `slug` on every row**: the menus file finds a venue by its slug. The district (`districtRelation`) can stay empty; geocoding fills it | Lokale → Importuj |
| 4 | **Coordinates and districts**: select the new venues, bulk action "Geokodowanie (GUGiK)". A venue without a street is skipped. Then look for an empty "Dzielnica" column and set those by hand | Lokale, table |
| 5 | **Menus** file, one row per drink | Lokale → "Importuj karty" |
| 6 | **Fix the failed rows and import them again**, until every import is clean | After each import |
| 7 | Producers, linked to brands by hand. Optional; never shown publicly | Producenci |

**Rows that fail** are listed with a reason after each import ("pobierz plik z przyczynami"). The usual ones: a brand that doesn't exist yet (step 1); a venue type outside the six; a menu line the import can't match to the catalogue (create the product, add the menu's spelling to an existing product with "Dodaj pisownię", or fill `house_drink_type` if it's the venue's own drink); a venue slug the menus file names but the venues file didn't create. Fix the cause and import just the failed rows again. Running a whole file twice is safe: rows are matched on slug, so nothing is duplicated.

**Nobody switches venues on.** Every imported venue starts as a draft, and goes live by itself once it has a map point and at least one drink. **The venues still offline after step 6 are your to-do list**: filter the venue list on "Aktywny: nie", and each one is missing either coordinates (fix the address, geocode again) or a menu. Never switch one on by hand to finish a load (`tech/venue-visibility.md`).

**Launch day only** (the-real-catalogue-reaches-production-only record):
1. **Before the day:** download each import's example file and check every spreadsheet column has a matching header (deploy checklist, E7).
2. **The real files run on production only**, which starts empty apart from the seeded reference data. The PC and the home server keep their own test data and never get the real files.
3. **From then on, the production admin is the only source of truth.** The spreadsheet keeps candidates and rejections; venues and menus are edited in the admin, never re-imported from an old file.

## 7. Before launch, and after each batch

- **Each district you want in Google needs at least 3 live venues.** A district page below that is served but kept out of the index (`uni.min_venues_for_indexable_district`). If a district you care about has one or two, add one or two more there.
- **Spot-check three venue pages:** the address, the map point, the drinks, and "Zaktualizowano dziś" (an import dates every row with its own day: the updated-means-vouched-for record).

## 8. Open


