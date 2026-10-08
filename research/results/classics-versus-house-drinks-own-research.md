---
description: "Result: classics versus house drinks, Claude's own research (Warsaw menus, Polish search behaviour, the codebase), merged with the first result into one recommendation: a classic is a brandless product, a variant is a house drink linked to it."
---

# Classics and house drinks: my own research, and the merged recommendation

Written 08.10.2026, after the first result (`classics-versus-house-drinks.md`, in Polish) had been assessed in the product note. Paweł asked for an independent pass, the best of both, and a recommendation on the actual question: **is a classic drink a product, or is it free text?**

## The recommendation in one paragraph

**A classic is a product: a brandless entry in the `drinki` category, created only by UNI, with its own page at `/napoj/{slug}`, which already exists.** A menu line that *is* the classic (any known spelling, nothing added) is recorded the way every catalogue drink is recorded: a `venue_products` row, matched by the confirmed-spelling resolver the import already uses. A line that is the venue's own creation stays a house drink with its own name and description, and **may point at the classic it is built on** through one new nullable column, so it shows on the venue's page under the venue's name *and* on the classic's page under "wersje lokali". This is the first result's model (a curated layer, exact versus variant, the venue's name kept for variants), but built on the machinery the app already has instead of a parallel `canonical_drinks` table. "Exact" and "variant" stop being an enum: they are which table the line lives in.

## What I did

| Line of research | What it was | Why it was worth doing |
|---|---|---|
| **Warsaw menus, read directly** | Nine venues' own published menus, read on 08.10.2026, plus one secondary press list | The first result cited menus as evidence; I wanted a count: how much of a real menu is classics at all |
| **Polish search behaviour** | About thirty Google autocomplete probes, Polish locale (`hl=pl`, `gl=pl`) | The first result found no search data and suggested Keyword Planner. Autocomplete is free and shows what people actually type, though not how many |
| **The codebase** | Product, alias, venue-product and house-drink tables, the menu resolver, the drink page, the June "receptura" workaround | The external model could not see the code. The code turns out to settle most of the build question |
| **Google's spam policies** | Doorway abuse and scaled content abuse, read from the policy page | A classic page per drink, per city later, is exactly the shape those policies describe when it is thin |

## Findings

### 1. Half of what real mocktail menus serve is a classic, and one classic dominates

From the venues' own menus. Lemonades, juices, coffee and tea are left out, because UNI does not catalogue them. **C** = the line is a classic as written; **V** = a variant of one; **O** = the venue's own creation.

| Venue (menu read 08.10) | Lines | C | V | O | The lines |
|---|---|---|---|---|---|
| Panorama Sky Bar | 12 | 9 | 0 | 3 | C: Virgin Mojito, Virgin Mary, Virgin Pina Colada, Espresso Martini 0.0%, **Clover Club 0.0%**, Aperitivo Spritz 0.0%, Hugo 0.0%, Negroni 0.0%, Bellini 0.0% · O: Passion Fruit Emotions, Vanilla Sky, Bergamot Whispers |
| TheOne Warsaw | 4 | 3 | 0 | 1 | C: Whiskey Sour 0%, Gin Basil Smash 0%, Hugo 0% · O: Amalfi Rosa 0% |
| Feliks Bar Café | 3 | 1 | 1 | 1 | C: **Garibaldi 0%** · V: Limoncello Spritz 0% · O: Cafe Amaro 0% |
| Restauracja Podniebna | 3 | 2 | 0 | 1 | C: Aperol Spritz 0, Mojito 0 · O: Cucumber-Mint-Ginger Beer |
| Zacny Pyrkot | 4 | 2 | 0 | 2 | C: Pinacolada Virgin, Mojito Virgin · O: Jabłko Adama, Warsaw Sunrise |
| Moffo (Focus Hotel, Dec 2024 card) | 3 | 0 | 1 | 2 | V: Virgin Mojito Zen (ginger) · O: Calamansi & Yuzu Spritz, Winter Mule |
| Hard Rock Cafe (spring 2026 insert) | 2 | 0 | 0 | 2 | O: Golden Mango, Peach Spritz |
| Honoratka | 0 | | | | Beer 0% and Prosecco Zero only |
| Olbrachta 34a | 0 | | | | Lemonade only |
| **Total** | **31** | **17 (55%)** | **2 (6%)** | **12 (39%)** | |

What the table says:

- **Classics are worth building.** More than half the mixed lines on menus that have any are a classic as written. Free text throws that away.
- **Mojito carries the model.** It is on four of the seven venues with mixed drinks (three exact, one variant). Spritz, Hugo and Piña Colada appear twice each; everything else once. At 30 venues, most classic pages will have one venue.
- **The 15-item list from the first result misses what the menus have:** Clover Club 0% and Garibaldi 0% were on menus I read; a Mule 0% is the obvious parent of "Winter Mule" (lime, ginger beer). Bellini 0% (provisional there) was on a menu; Paloma 0% was not.
- **Plain restaurants have no mixed drinks at all.** Two of nine venues serve only bottled 0% drinks. Classics matter for bars, hotels and cocktail-forward restaurants, not for the long tail of the licence register.
- **The sample is small and not random**: found through searches that favour venues publishing mocktail menus, and one bar contributes twelve lines. It is evidence of shape, not of proportions.

The secondary source (an Elle list of Warsaw mocktail venues, undated) adds two cases the rule has to handle: **"Torcello", described as a non-alcoholic Negroni**, an own name over a plain classic; and **"Kombucha Spritz" at two unrelated venues**, an own creation that is starting to repeat.

### 2. Polish people search drink names for recipes and shops, and search places by category

Autocomplete, Polish locale, 08.10.2026:

| Typed | What Google completes it to |
|---|---|
| `mojito bez` | mojito bezalkoholowe, … przepis, … **lidl**, … **biedronka**, … thermomix, … sprite, … **gdzie kupić** |
| `drinki bezalkoholowe w` | drinki bezalkoholowe **warszawa**, … warstwowe, … w puszce, … **wrocław** |
| `bar bezalkoholowy` | bar bezalkoholowy **warszawa**, **gdańsk**, **kraków**, **wrocław**, **poznań**, **katowice** |
| `mocktaile` | mocktaile przepisy, mocktaile **warszawa**, mocktaile **kraków**, mocktail bar **warszawa** |
| `bezalkoholowe koktajle` | … przepisy, koktajle bezalkoholowe **warszawa**, … **kraków** |
| `hugo bez` | hugo bezalkoholowe, … **lidl**, … przepis, … **biedronka**, … **kaufland** |
| `spritz bez` / `aperol spritz bez` | spritz bezalkoholowy, … lidl, … przepis; aperol spritz bezalkoholowy, … gotowy, … gdzie kupić |
| `negroni bez` / `espresso martini bez` | negroni bezalkoholowe, … przepis; espresso martini bezalkoholowe |
| `nojito` | Google rewrites it to **mojito**: the word is not used in Poland |
| `mojito bezalkoholowe w` / `virgin mojito w` | w puszce, w butelce, w domu; *with sprite*, *why it is called virgin*: no city appears |

What follows:

- **The place-finding searches are at the level of the category and the city** ("drinki bezalkoholowe warszawa", "bar bezalkoholowy kraków"). No drink name came back with a city. So a classic's page is **not mainly a search-engine door**; it answers "where can I get *this*" for someone already on UNI, and catches the long tail. The city and category pages remain the door. The drink page's own docblock already records the same lesson for bars: five years of data showed demand for the drink, not for "non-alcoholic bar" phrases. This finding refines it: for a *mixed* drink, the demand is for the recipe.
- **The Polish pattern is "{name} bezalkoholowe/-y/-a"**, for every classic tested: mojito bezalkoholowe, negroni bezalkoholowe, hugo bezalkoholowe, spritz bezalkoholowy, piña colada bezalkoholowa. "Virgin" is the second form. The first result put "Virgin Mojito" as the Polish name; the searches say the Polish name is "Mojito bezalkoholowe".
- **Autocomplete shows what is popular, never how many**, and a missing completion is not zero demand. This is a signal about shape, not a volume.

### 3. Classic names collide with shop products

"Mojito bezalkoholowe lidl / w puszce", "hugo bezalkoholowe lidl", "aperol spritz bezalkoholowy gotowy", and on Zacny Pyrkot's menu, **"Kinley Virgin Mojito"**, a soda. Ready-to-drink cans and sodas carry the classics' names. A matcher that guessed from names would attach a soda to the Virgin Mojito page. **The app already prevents this**: the menu resolver attaches only a spelling a person has confirmed, or a unique exact product name, and never guesses (`MenuItemResolver`, the menu-spellings-are-confirmed-not-guessed record). A canned RTD with a brand is its own product, if it qualifies; a soda never does.

### 4. Menus name 0% spirits inside the drinks, and disagree about what "0%" means

Panorama's Negroni 0.0% is made with Martini Vibrante; Hard Rock's spirits list labels Martini Vibrante **"LOW ALC"**. TheOne names Beefeater 0%, Sober Whisky Zero, Polly Tequila 0% and HUP prosecco inside its drinks; Panorama names Tanqueray 0.0%. Two consequences:

- **A classic's page must never say "0.0%".** The venue's recipe decides, and venues label the same ingredient differently. UNI's line is "nothing above 0.5%", and the page should say what is true: "bez alkoholu (do 0,5%)" at most. An ABV badge does not belong on a classic.
- **An open question for later, not for launch:** does a venue that mixes Beefeater 0% into a drink "serve Beefeater 0%" for that product's page? It is evidence the bottle is behind the bar. V2 at the earliest.

### 5. The app has been storing classics as products since June, under a workaround

- **Products can be brandless**; the drink page and the venue page already render one without a brand.
- **`product_aliases`** holds confirmed menu spellings, and both the import and the site search read it. That is the alias table the first result asks for, already built and already governed.
- **The demo data records "Virgin mojito" and "Aperol Spritz 0%" as products in `drinki`**, under a brand called "Własna receptura". `Brand::isHouseRecipe()` checks whether a brand's *name* contains "receptura", and three views branch on it (the drink page's title, and two places on the venue page that show the "własna receptura" label instead of a brand). That is a classic-as-product, expressed through a fake brand.
- **`/napoj/{slug}`** already lists the venues serving a product, has a sitemap entry and breadcrumbs, and sits under its category page.

So the question "a new `canonical_drinks` table, or products?" has an answer in the code: products already do everything a classic needs except one thing (pointing a house drink at it), and the workaround shows the need was met once already, badly.

### 6. Thin classic pages are a search-engine risk with a known fix

Google's spam policies name **doorway abuse** ("pages … created to rank for specific, similar search queries") and **scaled content abuse** ("many pages … generated for the primary purpose of manipulating search rankings"). Fifteen classic pages with one venue each, and later fifteen per city, is that shape. UNI already solved this for districts: a district page with fewer than `uni.min_venues_for_indexable_district` (3) live venues is served but kept out of the index. **The same rule fits classics.**

### 7. The drink page's ordering will conflict with the first result's ranking rule once owners exist

The drink page orders venues by `venue_products.confirmed_at`, newest first. With admin-only entry at launch, that is the date the menu was read and it is fine. Once owners can confirm, it becomes "whoever clicked most recently ranks first", which the first result names as a gaming pattern and the one-ordering decision of 07.10 already intends to replace. Nothing to do now; it belongs to that decision's formula.

## Where the two researches agree, and where I differ

**Agree, and take from the first result:**

- A classic is a **curated layer that only UNI creates**; owners pick from the list or ask for a missing one, and a request never creates a page.
- **Exact versus variant** is the right distinction, and **a variant keeps the venue's own name and description**. That removes the incentive to record a classic as one's own creation.
- **One classic per drink.** No "Mojito-Negroni Spritz" on two pages.
- **Brand names on menus map to the generic classic.** "Aperol Spritz 0" is Spritz 0%; UNI does not confirm a brand that may not be in the glass.
- **The owner sees a suggestion, not a choice of identity** ("To wygląda jak: Mojito bezalkoholowe — Tak / Nie, to inny drink"). That is V2 work, when owners edit.
- **The link never changes a venue's rank by itself.**

**Differ:**

| Point | First result | Mine | Why |
|---|---|---|---|
| Where a classic lives | A new `canonical_drinks` table and an aliases table (the 07.10 assessment kept this, without the full `venue_menu_items` rebuild) | **A product**: brandless, category `drinki`, marked as a classic | The page, the aliases, the import matching, the site search, the sitemap and the category listing exist already. A parallel table rebuilds each of them |
| How exact versus variant is stored | A `relation` enum on the menu item | **Which table the line is in**: exact = `venue_products`, variant = `venue_drinks` with a link | Same meaning, one column instead of two, and the venue page needs no new branch for exact lines |
| The rule for an own name over a plain classic ("Torcello" = Negroni 0%) | Variant | **Variant too, and the rule is: the name decides the table, the description decides the link** | A rule that reads one field first is the one an admin applies in seconds |
| The page's name and slug | "Virgin Mojito" as the Polish name | **"Mojito bezalkoholowe", with "Virgin Mojito" beside it**; slug `mojito-bezalkoholowe` | The Polish searches use the "bezalkoholowe" form for every classic tested |
| The starting list | 15 fixed classics, 2 provisional | **Only the classics on the launch menus**, picked from a candidate list of 19 | Measured: at 30 venues most classics have one venue; an empty page is worse than no page |
| What the page claims about alcohol | Not addressed for the page | **Never "0.0%"**; no ABV badge on a classic | Venues label the same 0% ingredient differently |
| Indexing | Not addressed | **Out of the index below 3 venues**, the district rule | Google's doorway and scaled-content policies |
| Search demand | Not found; Keyword Planner suggested | **Autocomplete shows the shape**: the demand for drink names is recipe and retail; place searches are by category and city | Free, and enough to decide a URL and a page's role |

## What it costs, compared

| | The 07.10 plan: a new classics table | Mine: classics as products |
|---|---|---|
| Schema | Two new tables (classics, aliases), two columns on `venue_drinks` | One column on `products` (`is_classic`), one nullable column on `venue_drinks` (the classic it is built on), `virgin_classic` removed from the enum |
| Public page | New route, controller, view, sitemap entry, reserved path | The existing drink page, with a classic branch: no brand, no ABV badge, a "wersje lokali" section, the noindex threshold |
| Spellings | A new alias table and new matching | `product_aliases` and `MenuItemResolver`, already used by the import and the search |
| Admin | A new resource for classics; a picker on house drinks | Brand optional when "klasyk" is ticked; a classic picker on the house-drink form and a column in the menu import |
| What it retires | `virgin_classic` | `virgin_classic` **and** the "receptura" brand workaround (`isHouseRecipe()` and its three branches) |
| The URL decision | Open | **Decided by consequence**: `/napoj/{slug}` |

**What my version gives up:** an exact line loses the venue's own description ("Espresso Martini 0.0%: espresso, hazelnut milk, vanilla" becomes the classic's row). For a plain classic the description adds little; when it adds something real, the rule already makes the line a variant. If it turns out to matter, a nullable `menu_description` on `venue_products` brings it back without touching anything else. **A risk to check while building:** `abv_status = unknown` means "never published as a verified alternative", so a classic needs the ABV label replaced by its own wording, not an `unknown` status that would read as doubt.

## Recommendations, answering the five decisions

1. **Adopt the model: yes, built on products.** A classic is a brandless product in `drinki`, marked `is_classic`, created only in the admin. An exact menu line is a `venue_products` row. A variant is a house drink with the venue's name, linked to its classic.
2. **The starting list: evidence-led.** A classic is created when the first launch menu has it, from this candidate list: Mojito, Piña Colada, Mary (Bloody Mary), Shirley Temple, Spritz, Hugo, Negroni, Gin & Tonic, Whiskey Sour, Gin Basil Smash, Espresso Martini, Pornstar Martini, Mimosa, Bellini, Paloma, plus **Clover Club, Garibaldi, Mule, Sex on the Beach**, each in its "bezalkoholowe" form. Expect eight to twelve at launch.
3. **Where a classic's page lives: `/napoj/{slug}`, with a Polish slug**: `mojito-bezalkoholowe`, `pina-colada-bezalkoholowa`, `spritz-bezalkoholowy`. The title carries both names: "Mojito bezalkoholowe (Virgin Mojito)". Because it is a public URL, the slug pattern is the one thing here to fix before the first classic is created.
4. **Retire `virgin_classic`: yes.** A classic as written is now a product; a variant has the link. Production starts empty, so it costs one migration.
5. **Build before the load: yes.** The menu import already matches products by confirmed spelling, so exact classics need nothing new there: the spellings met on launch menus ("Mojito 0", "Pinacolada Virgin") are added through the existing "Dodaj pisownię" flow. The house-drink rows gain one optional column naming the classic.

**And four that come with it:**

6. **A classic page with fewer than 3 live venues is served but kept out of the index and the sitemap**, the district rule.
7. **A classic's page never says "0.0%"** and carries no ABV badge: "bez alkoholu (do 0,5%)" at most, plus a short definition in UNI's own words (the fingerprint: "limonka, mięta, cukier, woda gazowana").
8. **The classic page shows two lists**: venues that serve it as written, and "wersje lokali" (the variants, under each venue's own name). Ordering follows the drink page until the one-ordering formula is decided.
9. **Retire the "receptura" workaround** in the same change: `Brand::isHouseRecipe()`, its three view branches and the demo brand "Własna receptura".

**Left for later, deliberately:** owner wording and the suggestion step (V2), a candidate queue for new classics, a description on exact lines, 0% spirits named inside drinks counting for the spirit's own page, and "Kombucha Spritz"-style own creations that start repeating across venues.

## For Paweł to decide

1. **Classics as products** (mine) **or a separate classics table** (the 07.10 assessment)? *Recommended: products.*
2. **The slug pattern**: `mojito-bezalkoholowe` (what Poles type) or `virgin-mojito` (what menus print)? *Recommended: the Polish form.*
3. **The list**: created as the launch menus need them, from the 19 candidates, or the fixed 15 up front? *Recommended: as needed.*
4. **The rule for an admin reading a menu**, to confirm: *the name decides the table (a known spelling of a classic → the classic; anything else → a house drink), the description decides the link (a house drink built on a classic's core → linked as its variant).*

## Sources

- Menus: [Panorama Sky Bar](https://panoramaskybar.com/menu/mocktails/) · [TheOne Warsaw](https://theonewarsaw.pl/bar) · [Feliks Bar Café](https://feliksbarcafe.com/menu) · [Restauracja Podniebna](https://restauracjapodniebna.pl/pl/menu/menu-napojow-bezalkoholowych/) · [Zacny Pyrkot](https://zacny-pyrkot.pl/) · [Moffo, Focus Hotel (Dec 2024)](https://u.profitroom.com/2018-focushotels-pl/uploads/202412moffokoktajle.pdf) · [Hard Rock Cafe Warsaw, spring 2026 insert](https://cafe.hardrock.com/warsaw/pl/files/5598/Wkladka_LTO_Wiosna26_Waw_online.pdf) · [Hard Rock Cafe Warsaw, drinks menu](https://cafe.hardrock.com/warsaw/files/5511/WARSAW_DRINKS_ENG_2024USJ211393_-_HRC_EU_-_DRINKS_MENU_-_Florence_-_ENG.pdf) · [Honoratka](https://honoratka.com/menu/) · [Olbrachta 34a](https://olbrachta34a.pl/menu/)
- Secondary: [Elle.pl, where to go for mocktails in Warsaw](https://www.elle.pl/lifestyle/gdzie-pojsc-na-mocktaile-w-warszawie-ranking-najlepszych-restauracji-i-barow-serwujacych-koktajle-bezalkoholowe-w-stolicy/)
- Search: Google autocomplete (`suggestqueries.google.com`, `hl=pl`, `gl=pl`), queried 08.10.2026
- [Google Search spam policies](https://developers.google.com/search/docs/essentials/spam-policies): doorway abuse, scaled content abuse
- Code, read 08.10.2026: `app/Http/Controllers/DrinkController.php`, `app/Services/Catalogue/MenuItemResolver.php`, `app/Models/Brand.php` (`isHouseRecipe`), `resources/views/drinks/show.blade.php`, `resources/views/venues/show.blade.php`, `database/seeders/ProductSeeder.php`, `app/Support/DemoVenues.php`, `database/schema.md`

*See also: [[research/results/classics-versus-house-drinks]] (the first result) · [[product/rules/Classics and House Drinks]] (the note with the five decisions)*
