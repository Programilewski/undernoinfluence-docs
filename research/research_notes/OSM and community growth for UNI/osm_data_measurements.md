---
description: Live measurements (30.10.2026) of OSM, Overture and municipal alcohol-permit lists as venue sources for Warsaw and Poland, plus a GUGiK versus Nominatim test that finds the "every second address" failure in UNI's matching rules.
---

# OSM and open venue data for UNI: live measurements, 30.10.2026

**How to read this.** "Measured" means I ran it on 30.10.2026, with the scripts and raw data in `/tmp/claude-1000/-var-www-undernoinfluence/6b63ff58-5c10-4ca8-9e07-085d69d3f56c/scratchpad` (temporary; `scripts/` and `data/`). "Read" means a published source I did not reproduce. Intervals are 95% Wilson intervals. The samples are 26–46 items, so a difference of ten or fifteen points between two numbers here is not evidence of a real difference.

## How much venue data does OSM hold (Warsaw, five cities, Poland)?

### Takeaway
OSM holds about 3,400 food and drink venues plus 175 hotels in Warsaw, and about 34,000 venues plus 6,400 hotels in Poland (fast food excluded). Coverage is not what limits it; missing contact data is.

### Cited Findings
Measured via [Overpass](https://maps.mail.ru/osm/tools/overpass/api/interpreter) on the mail.ru mirror. Polygons are `admin_level=8` city boundaries, with OSM data stamped 2026-10-30. overpass-api.de, private.coffee and kumi.systems all timed out from this machine, and the mirror returned many 504s.

| Area | restaurant | cafe | bar | pub | nightclub | biergarten | hotel | Total |
|---|---|---|---|---|---|---|---|---|
| Warsaw | 1,974 | 923 | 305 | 138 | 55 | 6 | 175 | 3,576 |
| Kraków | 870 | 445 | 154 | 111 | 35 | 6 | 265 | 1,886 |
| Poznań | 586 | 223 | 64 | 63 | 40 | 4 | 95 | 1,075 |
| Gdańsk | 575 | 184 | 69 | 44 | 14 | 3 | 124 | 1,013 |
| Łódź | 435 | 126 | 35 | 37 | 14 | 1 | 57 | 705 |
| Wrocław (bounding box, not city boundary) | 482 | 337 | 68 | 92 | 23 | 24 | 119 | 1,145 |

- Poland, from [Geofabrik taginfo](https://taginfo.geofabrik.de/europe:poland/api/4/tag/stats?key=amenity&value=bar) (data to 2026-10-28): restaurant 22,572; cafe 5,865; bar 2,241; pub 2,200; nightclub 611; biergarten 447; hotel 6,391; fast_food 12,861.
- Warsaw `fast_food` could not be fetched: 504 on three attempts. Every Warsaw figure here therefore excludes it, which matters for the recall test below because pizzerias and kebab places are often tagged that way.

### Inferences
- Warsaw alone has 34 times the founder's 100-venue worry. Discovering candidates is not the bottleneck; verifying them is.

### Gaps
- The Wrocław figure uses a rectangle because the boundary query kept timing out, so it is not comparable with the other cities.

## How complete are the tags in Warsaw, and does any tag record non-alcoholic availability?

### Takeaway
No usable tag records non-alcoholic availability: 2 of 3,576 Warsaw venues have any `drink:*` tag, and neither concerns non-alcoholic drinks. Names are nearly complete, full addresses reach 64%, and websites only 34%.

### Cited Findings
Measured from the [Overpass](https://maps.mail.ru/osm/tools/overpass/api/interpreter) download, n=3,576:

| Type | n | name | street + number | website | phone | opening_hours | instagram | any drink:* | any diet:* |
|---|---|---|---|---|---|---|---|---|---|
| restaurant | 1,974 | 99% | 61% | 36% | 34% | 61% | 3% | 0% | 10% |
| cafe | 923 | 99% | 65% | 23% | 17% | 71% | 4% | 0% | 11% |
| bar | 305 | 96% | 58% | 20% | 15% | 38% | 1% | 0% | 1% |
| pub | 138 | 96% | 70% | 43% | 22% | 51% | 4% | 0% | 0% |
| nightclub | 55 | 98% | 89% | 62% | 36% | 24% | 4% | 0% | 0% |
| hotel | 175 | 99% | 85% | 69% | 61% | 13% | 4% | 0% | 0% |
| biergarten | 6 | 83% | 33% | 0% | 17% | 17% | 0% | 0% | 0% |
| **All** | 3,576 | 99% | 64% | 34% | 29% | 59% | 3% | 0% | 9% |

- Website share among bar, pub and restaurant combined: 841 of 2,417 (35%). Across all types, 125 "websites" are Facebook or Instagram links.
- Warsaw `drink:*` tags: `drink:wine` twice and `drink:coffee` once, on 2 venues in total.
- Poland, [taginfo](https://taginfo.geofabrik.de/europe:poland/api/4/keys/all?query=drink&page=1&rp=40&sortname=count_all&sortorder=desc): `drink:beer` 65, `drink:wine` 58, `drink:coffee` 41, `drink:soft_drink` 1, `drink:cocktail` 1, `drink:mocktail` 1, `drink:beer:low_alcohol` 1. `drink:non_alcoholic`, `non_alcoholic`, `drink:beer:non_alcoholic` and `drink:alcohol_free` all return 0.
- Worldwide, the same query on [global taginfo](https://taginfo.openstreetmap.org/api/4/keys/all?query=drink&page=1&rp=25&sortname=count_all&sortorder=desc) shows `drink:beer` at 7,883, and no non-alcoholic key in the top 25.
- The [Key:drink wiki page](https://wiki.openstreetmap.org/wiki/Key:drink) documents no non-alcoholic value or subkey.

### Inferences
- OSM cannot tell UNI which venues pass the activation gate. Writing such a tag back into OSM would start from zero, and a community tag would not be evidence of a named item on an offer anyway.
- Other cities have lower address and website completeness than Warsaw: address 42–61%, website 35–47% (Measured, [Overpass](https://maps.mail.ru/osm/tools/overpass/api/interpreter)).

### Gaps
- Warsaw and Poland totals are not split by `drink:*` per type beyond the above, because the counts are too small to split.

## How fresh is OSM, and how many venues are closed?

### Takeaway
48% of Warsaw venues were edited in the last 12 months and 93% in the last 60, and 60% carry a `check_date`, which is better than I expected. The closed rate could not be measured directly: my best range is 3–20% of the sample, and much of that range comes from what the checks cannot see.

### Cited Findings
Measured from `out meta` on [Overpass](https://maps.mail.ru/osm/tools/overpass/api/interpreter), share of venues whose last edit falls within each window:

| Type | ≤12 months | ≤24 months | ≤60 months |
|---|---|---|---|
| All (3,576) | 48% | 67% | 93% |
| restaurant | 46% | 65% | 93% |
| cafe | 54% | 74% | 94% |
| bar | 46% | 60% | 97% |
| pub | 49% | 62% | 86% |
| nightclub | 35% | 60% | 96% |
| hotel | 37% | 65% | 90% |

- `check_date` is on 2,131 of 3,576 venues (60%), of which 930 are dated 2026 and 558 dated 2025. `check_date:opening_hours` is on 391. Only 17% of venues are still at version 1.
- Closed-venue sample (Measured): 30 random named Warsaw venues, seed fixed. Of those, 21 have no website, so a website check says nothing about them. That is the main limitation.
- Second evidence, [Overture](https://docs.overturemaps.org/guides/places/) (same name within 100 m): 24 of 30 match. The 6 with no match are Regency Club (last edited 2023), Alinka (2023), WypasAnie (2023), Sweet Club (2014, dead URL), Miso Ramen (2026) and Aroma Coffee (2025). Two of the 24 matches are doubtful: Królewski and Dim Sum Box.
- Third evidence, [Warsaw's permit list](https://kalkulatoralkoholi.um.warszawa.pl/alkohole/cbip_zezwolenia_lst.asp): 26 random OSM bars, pubs and restaurants with addresses, searched by address among on-premise permits. 10 have a permit under the same name. 2 have a similar name (Casa M&M for Casa Mia; N31 for No 31). 1 shows a different venue at the address (Sztuka Mleka has "Sajgonki"). 13 have no permit found at the address.
- Stale URLs (Measured, both website samples combined): 9 of 39 URLs are broken (23%, CI 13–38): 4 DNS failures, 3 HTTP 404s, 1 parked domain and 1 certificate failure. Broken does not mean closed: Spice & You has a broken URL but a 0.98-confidence Overture record, and a Piselli Pizza Napoletana (possibly the same business) [holds a permit](https://kalkulatoralkoholi.um.warszawa.pl/alkohole/cbip_zezwolenia_lst.asp).

### Inferences
- A rough closed rate: at least 1 of 30 (Sweet Club is the only strong case), at most about 6 of 30 (20%) if every venue without an Overture match really closed. None of these checks is ground truth, since Overture is largely Meta data, which can also be stale.
- No permit does not mean closed: a venue may not serve alcohol, or the address may be spelled differently. It cannot be read as a closure signal.
- A last edit does not prove a venue was checked. Mass edits and bots count too: `b-jazz-bot` was the last editor on 78 venues.

### Gaps
- Field verification, which is the only real ground truth, was not done. Google Maps was not used.

## What is the funnel from OSM venue to a named non-alcoholic item?

### Takeaway
Roughly 35% of Warsaw bars, pubs and restaurants have a listed website, about half of those sites have a readable menu, and 17% of the sites (5 of 30) name an explicit non-alcoholic item. That gives an estimate of roughly 140 venues in Warsaw, with a plausible range of 60–290, and more if lemonade and kombucha count.

### Cited Findings
Measured: 30 random Warsaw venues of type bar, pub or restaurant with a website in OSM (24 restaurants, 4 bars, 2 pubs, from a pool of 840). I fetched each homepage and up to 4 menu-looking links, including PDFs, read hits by hand and removed false positives such as "Extra Virgin Olive Oil" and "Suma: 0.00 zł". No JavaScript was run, and images were not read.

| Stage | n of 30 | Who |
|---|---|---|
| URL broken or not the venue | 6 | +One Bar, Babajaga, Sabich, Małe Piwo, Guru, Sentyment (domain for sale) |
| Social media only | 2 | Chata Trapera, Drożdż |
| Site gives no readable menu without JS, or is image-based or an aggregator | 8 | Zagrywki, Kwintesencja, Pizza Hut, Lipari, Nguyen's Bistro, Na Cyplu, Przystanek Wisła, Mr. Pancake |
| Readable menu or drinks page | 14 (47%, CI 30–64) | see the next two rows |
| Of those, explicit non-alcoholic item named | 5 (17% of 30, CI 7–34) | U Barssa (Książęce IPA 0,0%), Miąższ (Żywiec biały bezalkoholowe 0%), Taka Tajka (Corona 0%), Pizzini (Prosecco 0.0%), Rozbrat 20 (Pairing 0.00%) |
| Of those, only lemonade or kombucha found | 4 | Wok & Talk (lemoniada), Sushi Chef (kombucha 330 ml), The Eatery (kombucha), Klubokawiarnia KEN 54 (lemoniada, mentioned in prose) |

- From the other sample, not in this denominator: Pasta i Basta names "Aperol Virgin 0%" and "Perła 0% smakowa".
- Worked estimate: 2,417 venues × 35% with a site = 841; × 17% explicit item = about 143 (CI 59–286). Counting lemonade and kombucha, 9 of 30 (30%) gives about 252.

### Inferences
- 5 of 30 is a lower bound for "publishes a named non-alcoholic item", because image and JS menus were not read and the 8 unreadable sites could hold more. A person with a browser would find more than this script did.
- Applying the 35% to a venue's existence understates the real pool: 65% of venues have no website in OSM, yet may have one in reality. In Overture, 67% have a website (see below).
- Scraping alone produces around 140 candidates ready to check, not 3,400, and each needs a human or a stronger reader. This is the sample that most needs a larger run with a browser.
- The founder's worry concerns maintenance as well as seeding. Offers rotate: Big Book Cafe's homepage links seasonal PDFs (`..._jesien.pdf`), and the one I tried returned 404 to my script.

### Gaps
- Only 6 of 30 are bars or pubs, so nothing can be said about those types separately. Hotels and cafes were not sampled.
- Whether a soft drink such as Cappy juice counts as "a named non-alcoholic item" under UNI's gate decides the rate: most restaurants would pass if it does. I counted only explicit substitutes and lemonade or kombucha. This is a product definition question.

## GUGiK, UNI's rules and Nominatim head to head: where does "every second address" fail?

### Takeaway
The founder and the record are both right. **GUGiK answers correctly; UNI's acceptance rules reject correct answers.** Written the way a person or the register writes it, half or all addresses fail: 49% pass on the hard set, and 0 of 40 real register addresses pass when typed with "ul." or "al.". The cause is one-sided prefix stripping plus an accuracy cutoff. I found no address that was confirmed to exist and was missing from the register.

### Cited Findings
Measured against [GUGiK UUG](https://services.gugik.gov.pl/uug/) and [Nominatim](https://nominatim.openstreetmap.org/) (1 request per 1.2 s, identified User-Agent, per [its policy](https://operations.osmfoundation.org/policies/nominatim/)). `GugikGeocodingService::isAcceptableMatch` was ported to Python, with no live app code involved. GUGiK returned no errors on any request.

**Three address sets:**

| Set | n | UNI rules accept | Better rule (below) accepts | Nominatim finds |
|---|---|---|---|---|
| Hard, hand-built, multi-city | 74 | 36 (49%, CI 38–60) | 64, plus 2 flagged ambiguous | 71 (96%), but only 65 at the exact house number and 5 road only |
| Random OSM venue addresses: Warsaw 30, and 4 each from Kraków, Gdańsk, Łódź, Poznań | 46 | 43 (93%, CI 82–98) | 45, plus 1 ambiguous | 46 (100%, biased: the addresses come from OSM itself) |
| Random Warsaw on-premise permits, register's own spelling | 40 | see next table | 38 (95%, CI 83–99) | not run |

**The same 40 real permits, typed four ways, through UNI's rules:**

| How it is typed | Accepted | Why the rest fail |
|---|---|---|
| Register text, lokal in the number field: `ul. Piwna` + `12/14 lokal nr LU3` | 0 of 40 | no-results 26, street-not-contained 13, accuracy 1 |
| Cleaned, type word kept: `ul. Piwna` + `12/14` | 0 of 40 | street-not-contained 35, accuracy 4, no-results 1 |
| Short form with the type word and initials removed: `Piwna` + `12/14` | 34 of 40 (85%, CI 71–93) | accuracy 4, no-results 2 |
| Better rule, type word kept | 38 of 40 (95%) | 2 not found |

**Failure causes on the hard set (38 rejections), from which formatting and missing data can be separated:**

| Cause | Count | Whose fault | Examples |
|---|---|---|---|
| Prefix stripped on one side only | 21 | **UNI rule** | `Aleja Jana Pawła II 18`, `Plac Konstytucji 1`, `Plac Bankowy 2`, `ul. Piękna 20`, `al. Wyzwolenia 18`. Register accuracy is 1.0 on several |
| Accuracy under 0.7, GUGiK's top answer correct | 7 | **UNI threshold** | `Andersa 21` (0.53), `Skorupki 5` (0.53), `Plater 53` (0.59), `al. Słowackiego 1` (0.62), `al. Piłsudskiego 15/23` Łódź (0.54) |
| Accuracy under 0.7, rejection correct | 3 | Rule working | `Nowotki 5` (returned Nowotyska), `Plac Piłsudskiego 1` (returned Fort Piłsudskiego), `Puławska 12 lok. 3` (returned Puławska 3) |
| No result, query format | 6 | **Input form** | `Rondo ONZ 1` (register: Rondo Organizacji Narodów Zjednoczonych 1, found at 1.0), `Nowy Świat 6` (register: 6/12), `Chmielna 2-4` and `2/4` (register: 2 and 4 separately), `Ząbkowska 27/31` (27 and 31 separately), `Puławska 12/3` (flat number) |
| No result, possibly missing data | 1 | Unverified | `Plac Zbawiciela 3`: neither GUGiK nor Nominatim has it, so it may not exist |

Also from the permit sample: `A. E. Odyńca 57` found no acceptable match and has not been explained; it might be a second case of missing data. `Rondo ONZ 1` failed as above.

**The bug in the code.** `isAcceptableMatch` runs `stripStreetPrefix` on the register's street but not on the typed one. So typing "Aleja Krakowska" compares `alejakrakowska` with `krakowska`, and a perfect 1.0 match fails. The decision record's rule says the prefix is stripped, but only one side is. The accuracy cutoff has a second problem: a short name scores low *because* the register's name is long, and short names are exactly what people type. The record's own example, 0.79 for an exact address against 0.65 for a wrong street, leaves little margin.

**It also accepts wrong points.** UNI accepts `Jana Pawła II 82`, landing on *ulica* Jana Pawła II in Wesoła (52.2167, 21.2260), when Arkadia is at *Aleja* Jana Pawła II 82 (52.2564, 20.9823), about 16 km away. All rules pass and the 60 km check cannot catch it. Typing `Aleja Jana Pawła II 82` gets the right one first at 1.0, yet UNI then rejects it through the prefix bug. Warsaw has both streets, and the API returns both records. UNI reads only the first.

**Agreement between the two geocoders** (UNI-accepted points against Nominatim): hard set median 12 m, 90th percentile 65 m (n=36); random set median 8 m, 90th percentile 91 m, maximum 249 m (n=43), where the largest gaps come from Nominatim returning a shop polygon rather than the address point (Stary Browar, Leroy Merlin). The one gap above 250 m is `Tomasza 22` in Kraków, a truly ambiguous input: GUGiK says św. Tomasza, Nominatim says Tomasza Prylińskiego, 4.5 km apart.

**Where Nominatim did better:** it resolves old names (`Nowotki 5` gives Andersa 5), `Rondo ONZ 1` and short names such as `Andersa 21`. **Where it did worse:** it missed `Piękna 20` entirely, and it returns a road rather than an address when it lacks the number, with no error. It still returns a shop for Górczewska 124, and every response carries `Data © OpenStreetMap contributors, ODbL 1.0` (Measured).

**Better rule tested:** expand `al.` and `pl.` to the full word in the query (never remove them, or the Aleja/ulica distinction is lost: my first attempt did that and put `al. Jana Pawła II 23` in Wesoła); drop `lokal …` and brackets from the number; check every returned record rather than the first; accept when the number is equal and every significant typed word appears in the register street; and flag rather than store when two different streets both match. Against Nominatim, it gives a median of 8–11 m and 2 gaps above 250 m (`Plac Piłsudskiego 1`, which is a genuine wrong answer, Fort Piłsudskiego, and `Tomasza 22`). So this rule still needs a guard; it is a tested direction and not finished code.

**Also seen in the code (read, not tested live):** `callForward` caches a failure for 30 days under the query's hash, and `request` returns null on any non-2xx, so one outage or one rule change leaves addresses failing for a month unless the text is retyped. The admin form and `StoreVenueRequest` accept free text with no normalising, and `street_number` allows `12 lok. 3`. The local database holds only fixtures (90 venues, mostly Faker names, 0 with a prefix), so it could not reproduce the founder's addresses.

**GUS:** a GET to [geo.stat.gov.pl/api/fts/](https://geo.stat.gov.pl/api/fts/) returns the HTML documentation and a POST returns 405. I did not reconstruct the request shape, so this is not a measurement of GUS. The record says its search answered nothing, and that stands unconfirmed by me today.

### Inferences
- "Every second address" is reproduced by the hard set at 49%, and is consistent with any input containing "Aleja", "Plac" or "ul.". Which real figure he saw depends on how he typed them, and I cannot see those addresses.
- The record's verification tested four addresses, all simple ones, and the live test uses only `Górczewska 124`, so neither could see this. No test covers a typed prefix on the requested side. Adding a live or faked case with `Aleja Krakowska 218` would have caught it.
- Nominatim is not needed to fix the found rate. Fixing the rule raises it from 49% to 86–89% on the hard set and to 95% on real permits, with no provider change, no ODbL notice, and at about 6 ms a call.
- A real fallback is still worth considering for short forms (`Rondo ONZ 1`), but a small alias list would cover it.

### Gaps
- Correctness is judged by agreement with Nominatim and by hand on the disputed cases, not surveyed truth.
- The random set uses addresses that OSM mappers wrote, often copied from the register, which flatters both geocoders.
- `Chmielna 2-4` and `2/4` were constructed by me as range tests and may not be anyone's real address.

## Overture Maps and Foursquare OS Places compared with OSM

### Takeaway
On the same permit test, Overture found 33 of 40 and OSM 30 of 40, which is not a measurable difference, but together they reach 36 of 40. Overture has far better contact data (67% website against 34%) and much more junk. Foursquare could not be sampled without an account.

### Cited Findings
Measured: [Overture](https://docs.overturemaps.org/guides/places/) release 2026-10-21.0, queried with DuckDB directly on S3. Warsaw bounding box (larger than the city, not deduplicated): 105,246 places of all kinds.

- Food, drink and hotel categories by taxonomy: 8,240 places; 5,657 at confidence ≥0.7; 3,621 at ≥0.9. That compares with 3,576 in OSM (which also excludes fast food, and has a tighter boundary). Top categories: restaurant 1,588, coffee_shop 772, hotel 767, pizza_restaurant 529, bar 515, cafe 481, pub 178.
- Fill rates on those 8,240: website 67%, phone 89%, social link 91%, address 99% (freeform; 94% contain a number). Source of first record across all Warsaw places: Meta 87,096, Microsoft 6,712, AllThePlaces 4,503, Foursquare 4,113, PinMeTo 2,300.
- Update dates: 7,751 of 8,240 stamped 2026. `operating_status`: `permanently_closed` 139, `open` 2,884, empty 102,216 across all Warsaw places, so it is mostly unset.
- Overture's own docs say Places "is known to contain duplicates, a high junk rate, and low property completeness", that confidence is a "relative filtering tool" and that it contains "no OpenStreetMap data". The licence is CDLA Permissive 2.0 and Apache 2.0 depending on source, and joining with OSM "may" require ODbL ([Overture docs](https://docs.overturemaps.org/guides/places/)).

**Recall test (Measured).** 40 random current on-premise permits from [Warsaw's list](https://kalkulatoralkoholi.um.warszawa.pl/alkohole/cbip_zezwolenia_lst.asp), looked up by name within 60 m of the geocoded address and then by name anywhere, then read by hand:

| Source | Found at the address | Found by name elsewhere too | Missing |
|---|---|---|---|
| OSM | 22 (55%, CI 40–69) | 30 (75%, CI 60–86) | Matto, Piselli, Pub Pinball Station, Lanse, Felicita, the unnamed shop point, BREIZH, Hallo Pizza, Burger Bros, Kto to Zjadł |
| Overture | 27 (68%, CI 52–80) | 33 (82%, CI 68–91) | The Exchange, Pub Pinball Station, Jutro, Sąsiedzi, the unnamed shop point, BREIZH, Hallo Pizza |
| Either | | 36 (90%, CI 77–96) | Pub Pinball Station, the unnamed shop point, BREIZH, Hallo Pizza |

- Foursquare: the [Hugging Face dataset](https://huggingface.co/datasets/foursquare/fsq-os-places) is gated (`"gated":"auto"`; contact details must be shared, last modified 2026-10-15, Apache 2.0), and the old public S3 path returns 404 (Measured). It is described as [over 100 million POIs, monthly updates](https://hyper.ai/en/datasets/36514). A [mirror](https://source.coop/fused/fsq-os-places/2024-11-19) is dated 2024. I did not sample it. Only the 4,113 Warsaw records inside Overture attribute to Foursquare.
- Comparisons read, not measured: a [2024 blog](https://community.openstreetmap.org/t/a-global-comparison-of-restaurants-in-openstreetmap-and-overture-places/120475) checked 100 restaurants per source against Google Maps. A search snippet gave 72 for OSM against 60 for Overture, with Overture ahead on high-confidence data only. I could not open the post itself (403), so treat those figures as unverified. Replies there ask for broader baselines.

### Inferences
- OSM misses mostly new venues and Overture misses a different set, so the two complement each other as candidate lists; the 4 missed by both are mostly small or unnamed.
- OSM's real recall is likely higher than 75%, since `fast_food` was not in the comparison (Pizzeria Hallo, Burger Bros and similar). Name matching also has false positives: "Jutro" and "Exchange" required hand judgement.
- Overture's 67% website rate would widen the top of the funnel by about 2×, though its Facebook-heavy origin means many will be social pages. It would not make the menu stage better.

### Gaps
- Overture's junk rate in Warsaw was not measured; I sampled recall, not precision. That needs a random draw of Overture rows checked against reality.
- Whether Overture's Meta-sourced data may be used commercially as a UNI worklist beyond the licence text is unexamined.

## How active is the Polish OSM community, and is there a venue-maintenance culture?

### Takeaway
Poland is a large, active OSM country, and Warsaw venues do show survey habits, since 60% have a `check_date`. But it rests on few people: a single account is the last editor of 35% of Warsaw venues.

### Cited Findings
- 239 contributors and 64,196 map changes in Poland on 29.10.2026, 6th of 260 countries by contributors, after Germany (1,068), the US, France, the UK and Italy; Czechia had 102 ([OSMstats](https://osmstats.neis-one.org/?item=countries)). The page warns of 2–10% inaccuracy and this is a single day.
- Measured: 417 distinct accounts are the last editors of Warsaw's 3,576 venues; 192 accounts in the last 12 months. `Rogoyski` is the last editor on 1,259 (35%), and on 733 of the 1,708 edited in the last 12 months (43%). Next are `NorthCrab_upload` 223 and `starsep` 120 ([Overpass](https://maps.mail.ru/osm/tools/overpass/api/interpreter)).
- A 2020 grant proposal gave [about 155 daily active Polish mappers and about 50 active association members](https://wiki.openstreetmap.org/wiki/Microgrants/Microgrants_2020/Proposal/Publication_of_a_book_for_learning_the_basics_of_OSM_editing_(Polish_language)). The association, OSM Polska, [applied to be a local chapter](https://lists.openstreetmap.org/pipermail/osmf-talk/2021-February/007745.html) in 2021.
- [The Polish forum](https://community.openstreetmap.org/c/communities/pl/) was active in the last week: "Prośby o zmapowanie/poprawę" has 3,151 replies, "Pytania początkujących" 6,621. Its first page is mostly roads and tagging, with one POI address topic ("Szczegółowe adresy - numery lokali w POI") and nothing on gastronomy or closed venues.
- A Polish OSM diary post [names StreetComplete, Every Door and OsmAnd](https://www.openstreetmap.org/diary/pl) as tools locals use. I found no usage counts for any of them.

**Quality studies, all read:**
- No study of OSM POI or restaurant completeness in Poland was found. Polish work covers other layers: [forests](https://bibliotekanauki.pl/articles/986666.pdf), [buildings in Piaseczno county](https://journals.pan.pl/dlibra/publication/141922/edition/127689/content) and [land cover in five counties](https://typeset.io/pdf/analysis-of-openstreetmap-data-quality-for-selected-counties-u5tciu13.pdf).
- [Pinho et al. 2023](https://researchinformation.umcutrecht.nl/en/publications/the-quality-of-openstreetmap-food-related-point-of-interest-data-/): food POIs in five European countries; "Agreement between POI data in OSM compared to GSV was poor", though counts were usable for exposure measures.
- [Klinkhardt et al. 2023](https://heibib.ub.uni-heidelberg.de/search/Record/1896226124): 49 German areas, completeness depends on POI category. [Brückner et al. 2021](https://agile-giss.copernicus.org/articles/2/20/2021/agile-giss-2-20-2021-relations.html): shops in two German states, district values from 42% to 100%.
- [A State of the Map 2025 talk](https://2025.stateofthemap.org/sessions/EH3ZWQ/) on Brno reported about 34.94% of features matched against field data (search snippet, not the paper itself).

### Inferences
- My 75% (name anywhere) and 55% (at the address) sit reasonably with those studies, but this is one city and it uses a licensed-venue sample only.
- A correction loop into OSM would depend on one or two people in Warsaw. That argues against relying on the community to maintain anything for UNI.

### Gaps
- MapComplete use in Poland: nothing found. [Its homepage](https://mapcomplete.org/) returned nothing usable. Tool shares could be derived from changeset `created_by` tags, which I did not do.

## Which other legal bulk sources exist in Poland, especially municipal alcohol lists?

### Takeaway
Municipal alcohol-permit lists are real, current and strong. **Warsaw publishes a searchable register of 16,397 permits, 2,742 of them on-premise type A, with venue name and address**, and Gdańsk publishes a CC BY 4.0 CSV. They find exactly the venues OSM lacks, but Warsaw's has no stated open licence and no bulk export.

### Cited Findings
**Warsaw, Measured.** The [BIP page](https://bip.warszawa.pl/web/biuro-rozwoju-gospodarczego/-/wnioski-i-zezwolenia-na-sprzedaz-alkoholu) links to the [permit list](https://kalkulatoralkoholi.um.warszawa.pl/alkohole/cbip_zezwolenia_lst.asp), an applications list, a limits list and a map.

- Format: paginated HTML (20 rows a page), ISO-8859-2, with detail pages. Filters are district, address, type A/B/C and kind (Detal, Gastronomia, Jednorazowy and others). Filters only survive paging when passed in the URL.
- Totals: 16,397 permits. Gastronomia: A (up to 4.5% and beer) 2,742, B 2,573, C 1,887. Detal A 2,772. For comparison, OSM has 3,401 food and drink venues.
- Fields on a detail page: permit number, issue date, valid from, valid to, point name, address, type. The licensee column is commented out in the HTML with "Dostosowanie do RODO". Validity is future-dated up to 2036, and some rows start after today: the list is not filtered to current permits only.
- Addresses are in register style with lokal text, e.g. `ul. Fort Piłsudskiego 1 lok. 4,5` and `Rondo ONZ 1 (budynek B kompleksu RONDO 1)`. This is what UNI's rules reject.
- Noise: seasonal gardens, wine-shop tasting points, and sport clubs (e.g. `Klub Bilardowy`, `West Bouldering`). Not every row is a venue someone would visit for a drink tonight, and venues without alcohol are absent by construction.
- No licence statement was seen on either page. The linked [map URL](https://mapa.um.warszawa.pl/mapaApp1/mapa?service=alkohole&L=pl) returned 404 to curl. It may need a browser.
- [api.um.warszawa.pl](https://api.um.warszawa.pl/) reset the connection after TLS on repeated attempts from this machine, by curl and by WebFetch, so I could not check its catalogue.

**Gdańsk, Measured.** [Dataset 32481 on dane.gov.pl](https://api.dane.gov.pl/1.4/datasets/32481) is CC BY 4.0, with [CSV](https://api.dane.gov.pl/resources/2606728,wykaz-punktow-sprzeday-napojow-alkoholowych-stan-na-202609-09csv) and XLSX. It has 1,713 rows: 850 Gastronomia and 863 retail. Columns are entity, location name, address, district, permits and type. Dated 2026-09-10, with frequency marked daily in the metadata. Example: `RESTAURACJA CHATA CHŁOPSKA; UL. GEN. ANTONIEGO GIEŁGUDA 4`. Note that it names the licensee, including sole traders such as `ROBSTAR ROBERT CIULKIEWICZ`, which is personal data even though the source is open. Gdańsk has 1,013 OSM venues by comparison.

**Others on dane.gov.pl.** [A search](https://api.dane.gov.pl/1.4/search?q=punkty%20sprzeda%C5%BCy%20alkoholu&per_page=30) finds lists for Czeladź, Dąbrowa Górnicza, Pyskowice, Siewierz and Bojszowy, all Silesian. I did not find Warsaw, Kraków, Wrocław, Poznań or Łódź there. A [Wrocław BIP attachment](https://bip.um.wroc.pl/attachments/download/163708) turned up in search, but I did not open it.

**CEIDG and KRS, read.** CEIDG has [an API with a token and rate limits](https://pliki.biznes.gov.pl/20220425/pliki/HD-CEIDG-API-Hurtowni-Danych-Dokumentacja-dla-integratorow-v1-5.pdf), and [government documentation mentions XML file sharing](https://www.gov.pl/web/ia/portale-interoperacyjnosci). I did not test the API, and I did not read its terms of use.

### Inferences
- Candidate order for Warsaw: the permit list gives existence (independently renewed and dated), Overture gives website and phone, OSM adds further websites. Together, they replace most searching. The permit list has one property neither map source has: someone with a legal duty keeps it current. A permit's end date also gives a natural recheck trigger.
- A venue holding an on-premise alcohol permit is exactly UNI's harm-reduction audience, where someone is out with friends who are drinking. But the list misses alcohol-free venues, and using it should stay an internal worklist: UNI takes no public position on alcohol, and citing the permit register publicly would read like one.
- CEIDG and KRS would likely be weak for this purpose, as PKD 56 identifies a registered business and not necessarily a trading venue or its public name. This is my reasoning; I did not measure it.
- A full Warsaw download is roughly 138 list pages plus up to 2,742 detail pages. At 2 s each that is about 1.6 hours, polite but a bulk job, so I deliberately did not do it.

### Gaps
- Re-use terms for Warsaw's list are not stated. Whether re-use needs a request under the public-information re-use law was not examined. The same goes for ODbL exposure if OSM attributes guide a worklist: the osm-dropped record is the existing decision, and any use of OSM here reopens it. Nominatim was removed on 09.10 for that reason, so this research does not by itself clear the way back.
- Warsaw's list was sampled at 40 rows, and its noise rate was not quantified; roughly 3–5 of the 40 looked unlike a place to go for a drink.
- CEIDG PKD 56 counts, KRS API availability and licence terms were not verified.
