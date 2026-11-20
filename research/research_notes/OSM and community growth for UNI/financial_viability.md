# Financial viability of a community-built, partly open, niche venue directory in Poland

Researched 30.10.2026. All PLN conversions use NBP mid rates of 22.10.2026: USD 3.8886, EUR 4.3685 ([comparic.pl, reporting the NBP table](https://comparic.pl/kurs-pln-mocno-w-dol-co-dzieje-sie-z-dolarem-euro-frankiem-i-funtem-23-10-2026/)). The URL is that outlet's 23.10 article, whose midday quotes differ from the fixing; check against nbp.pl before citing.

**Evidence labels.** [S] = sourced. [R] = from UNI's own records or code. [A] = my assumption with no source. [C] = calculated from the above. Most sources available were vendor blogs, aggregators or search snippets, and many pricing pages could not be opened. Where that matters, the entry says so. The search tool's summaries did not always tie a figure to a single page, so the links on snippet-only figures (notably Patronite, ZUS, the Warsaw wage, accounting) are my best attribution: open the page before quoting a number publicly.

**Headline.**
- The hypothesis holds in part. Name, address and coordinates are not a moat. Demand data is a moat only above a traffic level UNI has not reached, and until then the real asset is fresh menu data plus the review workflow.
- The model does not depend on location data being closed.
- It also does not replace a salary on Warsaw alone. Warsaw needs about 143 paying venues at 98 PLN. The base case gives about 10.
- The benchmarks also undermine the plan's narrowest assumption: comparable products charge for tools and marketing outcomes, and at least one gives its analytics away free.

## Premises in the brief that the records or sources correct

### Takeaway
Five premises need correcting before the report is written. Two change conclusions: the map is no longer on CARTO, and `osm-dropped` misdescribes the licence.

### Cited Findings
- **There is no CARTO setup.** The maps moved to MapLibre and OpenFreeMap, executed 01.09.2026, because CARTO watermarks keyless tiles, frames its free tier as non-commercial and is retiring raster. [R: vector-basemap-on-openfreemap]
- **Nominatim is gone too.** Geocoding comes from GUGiK, the state register. [R: osm-dropped amendment of 09.10; geocoding-comes-from-the-state-register]
- **`osm-dropped` says "the enriched data is UNI's core asset", not "the venue database".** Its own words separate enrichment from location. [R] So the tension with `database/schema.md`, which calls Numbers "the commercial asset" [R], is narrower than the brief states, but it is still real: the two records name different crown jewels.
- **`osm-dropped` misstates ODbL.** It says "any 'produced work' derived from the database" must remain openly licensed. [R] The OSMF FAQ says the opposite: "You can license a Produced Work under any terms you like", and it is a Derivative Database that must stay under ODbL. Recipients of a Produced Work can still request the underlying data and any Derivative Database used, and attribution is required. — [OSMF Licence FAQ](https://osmfoundation.org/wiki/Licence/Licence_and_Legal_FAQ)
- **PARPA:** the 2026 public-health competitions found are run by KCPU, not PARPA. — [KCPU competition order, 26.05.2026](https://kcpu.gov.pl/wp-content/uploads/2026/05/A.1.Zarzadzenie-nr.-42-z-dnia-26.05.2026-konkurs-budzet.pdf). I did not confirm the formal relationship between the two bodies in this run.
- **HappyCow is not a clean comparator.** It sells search placement, which UNI forbids (see the benchmarks section).

### Inferences
- The `osm-dropped` reasoning overstated the exposure of Produced Works, but the decision may survive anyway, because venue tables enriched with drinks look like a Derivative Database if they were built on OSM rows. See the moat section.

### Gaps
- No lawyer reviewed any of this, and the ODbL reading is taken from OSMF's own guidance only.

## Conflicts already inside UNI's records and code

### Takeaway
UNI's own documents and code break the hard lines in at least three places. These need fixing before any pricing work, whatever the report concludes.

### Cited Findings
- **A paid badge exists in code.** `app/Enums/VenuePlan.php` gives `StrongestCategoryBadge` to Premium only, and `business/pricing.md` calls it a "Shareable social proof asset". [R] This conflicts with no-pay-to-rank ("no bought badges, ever") and with model.md's refusal of "Premium badges that can be bought". The grep found it in the admin analytics view and report service. The file list was truncated, so I did not confirm whether a public view renders it.
- **`roadmap/v3.md` V3-F3 lists "Priority placement: Highlighted listing in discovery results (clearly labeled as promoted)".** Its fallback lists "sponsored category placements" and "affiliate links". [R] All of these conflict with no-pay-to-rank. `business/pricing.md` also still lists "Featured placement: TBD". [R]
- **Revenue scope conflict.** no-pay-to-rank says "the monetization mechanism stays B2B analytics only". venue-lists-are-never-sold-as-leads says "Producer revenue comes from aggregates". [R] Both are Decided. The undone inventory still lists producer aggregates as open. [R]
- **Plan prices exist in code but not in the docs.** `VenuePlan` labels: Basic 79, Pro 129, Premium 199 PLN/mo. `pricing.md` says TBD, and model.md says deferred until PMF. [R]
- **`TrendingProductAlerts`** ("future distributor intelligence value" in pricing.md) was already flagged on 03.10 as failing the producer rules. It is still in the Premium plan. [R: journals/2026-10-03]

### Inferences
- Deleting the V3-F3 placement lines and moving the badge to an earned rule costs nothing today and removes the easiest route for later drift. The badge fix also matches badges-are-rules-over-recorded-evidence.

### Gaps
- I found no record of the BV-1 pricing conversations having happened: the grep of the inventory and journals returned nothing. So UNI appears to have no first-party willingness-to-pay data.

## If location data were open under ODbL, what remains proprietary?

### Takeaway
Nearly everything that earns money remains proprietary, provided the layers are kept apart. Openness does not hurt the model, but on current evidence it does not help the finances enough to justify reversing `osm-dropped`.

### Cited Findings
- **Open base layers coexist with commercial value.** Foursquare released FSQ OS Places under Apache 2.0, with 22 core attributes for commercial use, arguing that without a distribution platform like Google Maps an accurate base layer is "best solved by an open source community". — [Foursquare](https://foursquare.com/resources/blog/products/foursquare-open-source-places-a-new-foundational-dataset-for-the-geospatial-community/) (self-reported)
- **Mapbox combines OSM with telemetry.** It describes anonymised telemetry from apps and vehicles alongside commercial, government and open data. — [Mapbox](https://mapbox.com/about/maps/)
- **Geofabrik sells services on OSM.** Consulting, training, tile servers, routing and geocoding; extracts are free, custom vector exports are quoted. Its founders say it won't "get rich quick". — [Geofabrik](https://blog.geofabrik.de/index.php/2013/10/01/so-what-is-it-that-you-geofabrik-people-do-anyway/)
- **Organic Maps** relies on donations and community support ([privacytools](https://privacytools.io/app/organic-maps)), and a governance dispute produced the CoMaps fork in 2025 ([Tuta](https://tuta.com/de/blog/google-maps-alternatives-foss)). **OsmAnd** is estimated at about $2.2M a year with 16 staff, an aggregator estimate only ([techlist.ai](https://techlist.ai/osmand.net)).
- **Komoot** runs a freemium model with B2B licensing ([Dealroom](https://app.dealroom.co/companies/komoot)). Forum posts report it was sold to Bending Spoons in March 2025 with about 85% of staff cut ([forum](https://singletrackworld.com/forum/bike-forum/komoot-sold/)); unverified against primary reporting.
- **Licence boundary.** Under OSMF's guideline, non-OSM data stays outside share-alike if each data type within a regional cut is wholly OSM or wholly non-OSM. Its own example: restaurant phone numbers linked to OSM restaurant names, where all numbers are yours, are not subject to share-alike. But merging a proprietary dataset with OSM data and removing duplicates falls outside the guideline, and share-alike may then reach the proprietary data. — [OSMF Collective Database Guideline](https://osmfoundation.org/wiki/Licence/Community_Guidelines/Collective_Database_Guideline_Guideline)
- **Numbers tables hold no identifiers.** `events` has no IP, session or user, and `venue_stats` is "the only thing in the product that cannot be recreated after the fact". [R: database/schema.md]
- **Exposure already recognised.** The undone inventory recommends against open-licensing venue data; 03.10 research recommended opening the schema and vocabulary only. [R]

Asset by asset. The moat ratings are my judgement [A]:

| Asset | Tables | Who else can get it | Moat |
|---|---|---|---|
| Name, address, coordinates | `venues` (part) | GUGiK, CEIDG, Google, OSM, Foursquare | None |
| Which NA drinks a venue serves, verified and dated | `venue_products`, `venue_drinks`, `venue_offer_logs` | Only by repeating the work. A public page can be copied once | Medium. A copy goes stale, so the moat is the update flow and not the snapshot |
| Demand signal | `events`, `venue_stats`, `venue_category_stats`, `search_stats` | Nobody, without UNI's traffic | High above a traffic threshold, zero below it |
| Earned trust and the review process | rules, not tables | Slow to copy | Medium to high, and the first thing to go if a hard line breaks |
| Owner relationships | `venue_claims` | Competitors can claim too | Low to medium |

### Inferences
- **Hypothesis verdict: partly supported.** Location is no moat. Menu data is a moat only as a live process, and demand data is one only after traffic exists. Before launch, neither Numbers table holds anything of value, so `schema.md`'s "commercial asset" describes a future state. The accurate sentence for the records: *the enriched offer data is what makes the product work; the demand data is what could make it pay.*
- **Does the model survive open location data? Yes, conditionally.** No planned revenue line sells location. The danger is mixing, not openness: the guideline's de-duplication exception is what `osm-dropped` feared. A separate, wholly non-OSM drinks layer referencing venue IDs looks compatible; a merged venue table does not. This is a legal question another note may cover in more depth.
- **The financial argument for reopening OSM is weak.** Coordinates already come free from GUGiK. The costly work is checking menus, which OSM does not supply. **Recommendation: do not reverse `osm-dropped` on financial grounds.** Do correct two things in it: the Produced Work sentence and the "core asset" wording. Its "Revisit when: Never" should stay unless the licensing research finds a non-financial reason.
- **Openness is a community argument, not a revenue one.** It could recruit contributors, because contributors dislike their free work being closed and sold (03.10 run 1 lists this pattern). That is the case for it, and it is outside this note's scope.

### Gaps
- Whether EU database rights protect UNI's menu data against copying: not researched.
- No source measures how fast a copied venue dataset loses accuracy. UNI's own freshness data would answer it later.

## Comparable products: revenue lines, prices, conversion, failures

### Takeaway
No comparable directory lives on analytics alone. They earn from placement (forbidden), consumer subscriptions, transaction fees, grants, or tools that do a job for the venue. **I found no published listed-to-paying conversion rate for any of them.**

### Cited Findings

| Product | Revenue lines | Prices (PLN at 22.10.2026) | Passes UNI's lines? | Evidence quality |
|---|---|---|---|---|
| HappyCow | Business plans with top placement, ads, paid app | $100/mo per location (389 PLN); elsewhere $149 and $299/mo (579 and 1,163 PLN). App $4.99 | **No**: sells placement | Snippets of [partner](https://www.happycow.net/partner) and supporter pages; both returned empty on fetch. Prices conflict. Program described on [Wikipedia](https://en.wikipedia.org/wiki/HappyCow) |
| Find Me Gluten Free | Consumer Premium, in-app ads, paid "Most Celiac Friendly" filter | $19.99/yr (78 PLN); other sources $24.99 | Consumer paywall on a filter, see below | [FAQ](https://findmeglutenfree.com/faq), [App Pricing Lab](https://apppricinglab.com/app/apple/431006818). Venue pricing not found |
| Untappd for Business | Menu-management subscription | $89.99–119.99/mo (350–467 PLN) | Tool, yes | Third-party, [official page](https://utfb.untappd.com/get-pricing/) gates price. One figure conflicts |
| BeerMenus | Free listing **with Insights**; paid promotion, print and digital menus | $29–99/mo (113–385 PLN) | Tools yes; promotion to its audience needs checking | [Pricing page](https://www.beermenus.com/pricing), the strongest source here |
| Too Good To Go | Per-bag fee, annual membership | $1.79 per bag, $89/yr in US (346 PLN) | Different model | [CNBC via NBC](https://www.nbcsandiego.com/news/business/money-report/this-startup-brings-in-162-million-a-year-helping-people-find-food-at-huge-discounts-its-the-most-genius-app/3678212/?amp=1). 2024 revenue **conflicts**: [DKK 725M](https://companydata.dk/en/virksomhed/37561304) vs [€193M](https://tools-codex.pages.dev/financials/intl/too-good-to-go-aps/) |
| AllTrails | Consumer subscription | $35.99/yr (140 PLN) | Different model | [Price](https://subger.com/en/service/alltrails). Revenue claims span $38M–$245M from low-quality sources: **do not use** |
| Wheelmap | Grants, prize money, donations; non-profit | Google Impact Challenge €825,000 (3.6M PLN) | Yes, but see grants | [Google](https://blog.google/intl/de-de/unternehmen/engagement/google-impact-challenge-disabilities-aw5y/), [Wikipedia](https://en.wikipedia.org/wiki/Sozialhelden) |
| Boisson | NA retail, not a directory | n/a | n/a | Chapter 11 and store closures, 2024: [Retail TouchPoint](https://www.retailtouchpoints.com/news/non-alcoholic-brand-boisson-files-for-bankruptcy-protection-closes-all-stores/142106/). CEO blamed macro conditions and infrastructure cost |
| Sans Drinks | NA retail | n/a | n/a | Bankruptcy in July 2023 per [CB Insights](https://www.cbinsights.com/compare/better-rhodes-vs-sans-drinks), thin source |

- **Untappd's scale:** nearly 20,000 Untappd for Business customers feed its Pricing Intelligence dashboard. — [Next Glass](https://nextglass.substack.com/p/craft-brewers-conference-series-45). This is the best proof found that a venue tool can produce a data product.
- **Trust cost of paid placement:** a HappyCow Trustpilot reviewer argues the top spot goes to the highest-rated subscriber. — [Trustpilot](https://uk.trustpilot.com/review/happycow.net). One review, anecdotal.
- **Conversion:** only vendor-blog numbers about visitor conversion surfaced, nothing on claimed-to-paid. — [Directorist](https://directorist.com/?p=362951) describes the mechanism only.

### Inferences
- **BeerMenus is the most telling data point.** Its free tier includes Insights, and the money is in menus and promotion. This is one case and not proof, but it directly challenges a plan where analytics is the paid product. It is also the closest match in shape: a drink-menu directory for venues.
- **The compatible pattern is "pay for a tool that saves work".** A hosted NA menu page or a website embed that stays current, and printed table cards, charge for a job done and touch no ranking. **This needs an amendment to no-pay-to-rank's "B2B analytics only" sentence. The record's prohibition on rank and badges would not change.**
- The NA retail failures are about inventory and shops, so they say little about a directory. They do show that category interest alone did not save those companies.
- Consumer subscription is the main line at FMGF and AllTrails, yet UNI has no accounts and its mission gains from a free answer. A paid filter would directly limit finding the healthier option. Rejected.

### Gaps
- **No data found:** Better Rhodes, Dry Atlas, Barnivore, Sober Curious lists, NA bar finders. Searches returned nothing usable, and I am not estimating them.
- FMGF's explanation of its paid filter returned 403; only the title was visible.
- Listed-to-paying conversion is unavailable for every comparable. This is the model's most important unknown.

## Poland: gastronomy, spending and willingness to pay

### Takeaway
The market is large in outlets but thin in small-firm profit, and there is no Polish evidence that a venue pays for analytics alone. 79 PLN is cheap against delivery commissions but is competing against tools that produce measurable orders.

### Cited Findings
- **Poland:** almost 102,000 gastronomic establishments at end-2024 per GUS, rising a few percent in 2025. — [xyz.pl](https://xyz.pl/?p=151464)
- **Restaurants and bars:** almost 30,000 restaurants and over 26,000 bars at end-2024 (GUS); BOŚ Bank estimates about 32,500 and 27,500 at end-2025. GUS's 2025 figures were due in November. — [BOŚ Bank, July 2026](https://www.bosbank.pl/__data/assets/pdf_file/0024/76902/BOSBank_Restauracje_2026.07.pdf) (PDF returned 403 on fetch; figures from the search snippet)
- **Margins:** BOŚ says the share of profitable firms in 2025 matched the 2015–19 average, micro-firm profitability is much lower and declining, and firms over nine staff stay profitable. — same source. No percentage margin obtained.
- **Warsaw counts conflict by a factor of nearly five:** 2,729 gastronomic points including 500+ restaurants ([Knight Frank Q4 2025](https://content.knightfrank.com/research/2301/documents/pl/warszawa-atrakcyjnosc-miast-i-rynek-biurowy-iv-kw-2025-12635.pdf)); over 3,500 ([se.pl, undated](https://www.se.pl/warszawa/warszawa-pierwsza-kulinarna-mapa-stolicy-aa-V6hP-gYiR-Lg81.html)); 12,893 in a broad definition ([XMap, March 2025](https://www.xmap.ai/location-intelligence-reports/dining--drinking-locations-in-poland)). No official GUS Warsaw figure found.
- **Delivery commissions:** Pyszne 13–30%, Glovo 15–30%, Uber Eats 15–30%. — [UpMenu, updated Nov 2023](https://www.upmenu.com/pl/blog/pyszne-glovo-uber-eats-prowizja). UpMenu competes with these platforms and the data is old.
- **Polish tool prices:** UpMenu 169 / 289 / 499 PLN per month per location, no long contract ([UpMenu](https://www.upmenu.com/pl/cennik/)). GoPOS Basic 79 PLN/mo on a yearly licence ([Capterra](https://www.capterra.co.uk/software/1018216/gopos)), or 100 PLN net at a reseller ([Posnet](https://saio.posnet.com.pl/en/cennik?preview)).
- **Tech budgets (US, dated):** 2.5% of revenue in a 2016 study ([Thrive POS, citing Hospitality Technology](https://thrivepos.com/blog/is-spending-too-little-on-technology-costing-your-restaurant-profits)); largest group at 1–1.99% in 2021 ([HT 2022](https://resellers.hughes.com/sites/hughes.com/files/2022-11/HT-2022-Restaurant-Technology-Study-Making-Magic-Happen.pdf)).
- **Fee resistance:** for independents "it's the ongoing usage fees that hurt". — [Restaurant Business](https://restaurantbusinessonline.com/technology/indies-arent-sold-tech)
- **What independents plan to buy:** payroll (68%) and scheduling (66%), per a vendor-run survey of 300 operators in 2022. Analytics was not a headline item. — [SpotOn](https://www.spoton.com/blog/state-of-restaurant-tech-report-reveal/)

### Inferences
- 79 PLN equals the commission on about 8 delivered orders at the 10 PLN per 50 PLN order in UpMenu's worked example [C]. It is affordable, so the barrier is not the sum. A commission buys an order, while a report buys knowledge the owner must then act on.
- 79 / 129 / 199 sits below UpMenu and overlaps GoPOS, and is under BeerMenus and Untappd in PLN [C]. **Price is not the constraint, so raising it will not fix the model** (see sensitivity). I would keep these prices for testing.
- **What would an independent Warsaw venue pay for demand analytics? Honest answer: unknown.** Perhaps 0 for reports alone. Owners with a real NA programme, multi-site groups and larger firms are the likelier buyers, since small-firm margin is thin [A]. BV-1 is the cheapest way to find out.

### Gaps
- **No Polish pricing found** for Moje Lokale, TheFork, Dotykačka, Restaumatic, or Pyszne's official terms. TheFork Manager's "39 per month" on [GetApp](https://www.getapp.com/retail-consumer-services-software/a/thefork-manager) has no currency, so it is unusable.
- Google Ads spend by Polish venues: no data.
- **No study compares willingness to pay for analytics against marketing outcomes.** The search returned only general tech-spending surveys. The conclusion above is inferred from BeerMenus' packaging and the surveys, and is not directly measured.
- SaaS churn for restaurant software: not found. Average monthly SaaS spend per Polish restaurant: not found.
- Gastrotrendy, Makro and Euromonitor figures were not obtained.

## Non-alcoholic market and producer data

### Takeaway
The category is real but slowing, and its money sits with producers UNI cannot take placement money from. Delayed aggregate reports have precedent and could be UNI's largest single line. That makes them the line most likely to distort the mission, so they should stay last and conditional.

### Cited Findings
- **2025 Poland:** NA beer PLN 1.823bn, up PLN 53.6M; 8.1% of beer value; about 2M hl; volume up about 3%, well below 2024's double-digit growth. — [xyz.pl citing NielsenIQ](https://xyz.pl/?p=169232)
- **Share trend:** about 6.5% of value at end-2023. — [xyz.pl](https://xyz.pl/?p=2038)
- **Context:** consumer spend on beer fell 4.1% in 2025. — [xyz.pl](https://xyz.pl/?p=169232)
- **Industry claims:** Browary Polskie says two-thirds of consumers believe NA beers help limit alcohol consumption. No survey named, and this comes from the industry body. — [xyz.pl](https://xyz.pl/?p=169232) **Not fit for UNI to repeat.**
- **Precedents:** Untappd's Pricing Intelligence ([Next Glass](https://nextglass.substack.com/p/craft-brewers-conference-series-45)); CGA by NIQ's On Premise Measurement, sold through sales contact ([CGA](https://cgastrategy.com/?p=80960)); BeerBoard publishes draft-beer recaps ([Brewbound](https://www.brewbound.com/tag/on-premise/page/3)). **No public price for any of them.**
- **UNI's own proposal:** category and area only, at least 10 venues and 30 events per cell, at least 90 days' delay, campaign periods excluded. Not yet adopted. [R: journals/2026-10-03, Q6]
- **Standing rule:** no venue identified to a paying third party, in any product, export, report or API. [R: venue-lists-are-never-sold-as-leads]
- **Producers are never public in UNI, and no producer can sponsor, reward or steer a contribution.** [R: schema notes in journals; community record]

### Inferences
- **Mission test.** Reports help nobody find a drink directly, so they pass only as funding, and only if a buyer cannot influence what users see. The conditions above do that. A further condition I would add: no single buyer above about a quarter of revenue [A], because dependency is the actual route to compromise.
- **Size, entirely assumed:** 3–8 buyers at 5,000–20,000 PLN a year gives 15,000–160,000 PLN a year, or 1,250–13,000 PLN a month [A/C]. The top end alone equals one salary. The price range is unsourced, so this is a sizing guess rather than a forecast.
- **A credibility problem at UNI's scale.** Producers already buy NielsenIQ retail panels, whereas UNI's on-premise demand from one city may be too small to matter until it has real traffic. Its distinctive signal is what people look for and do not find, which retail scans do not show [A].
- **Producer sales need a decision that records don't yet give.** Adopting them means amending no-pay-to-rank's "analytics only" wording and answering Q6.

### Gaps
- Producer-level NA figures (Żywiec, Kompania Piwowarska, Carlsberg Polska): not obtained. The on-trade/off-trade split: not found, and this is what would size the on-premise signal. Non-beer NA categories: no data.
- Any price for on-premise data products: none public. Would need a sales enquiry.

## Other revenue lines against the hard lines

### Takeaway
None of these replaces the core line. Tools for venues and, later, delayed aggregates are the only ones that scale. Paid stickers and affiliate links should be ruled out. Grants and donations are each compatible on paper but carry a framing risk.

### Cited Findings
- **Patronite:** 7,000+ creators and 650,000+ patrons in 2022 ([Spider's Web](https://spidersweb.pl/2022/08/wp-patronite-inwestycja.html)). Radio 357 about 670,000 PLN/mo in 2021 ([iFirma](https://www.ifirma.pl/aktualnosci/patronite.html)), an extreme outlier with a personal audience. Commission "a few percent" plus payment fees ([inEwi](https://inewi.pl/blog/patronite-i-portale-crowdfundingowe---jak-z-nich-korzystac-i-jak-je-rozliczyc)). Data is dated.
- **KCPU** runs public-health competitions under the National Health Programme 2021–2026, operational objective 2, addiction prevention. — [KCPU conditions](https://kcpu.gov.pl/wp-content/uploads/2026/03/A.2.-Zalacznik-nr-1-do-Zarzadzenia-Ogloszenie-Szczegolowe-Warunki-Konkursu.pdf). Whether a company or JDG is eligible was not determined.
- **Rules that bind here:** "we do not hide that behind non-profit framing", no forward-looking public statements about monetising, claim individual and never population-level impact. [R: mission record] The window sticker is "earned against a published standard, never paid for". Recovery and abstinence organisations are never a recruitment channel. No founder face. [R: brand-outreach-waits-for-traction] No brand named publicly. [R: no-brand-names-on-public-drink-labels]

| Line | Realistic size [A] | Hard lines | "Never boasted" rule | Verdict |
|---|---|---|---|---|
| Venue tools (menu page, embed, printed cards) | Same payer pool, could raise conversion | Pass, if no rank effect. Amend "analytics only" | Pass | **Test first** |
| Producer aggregate reports | 1,250–13,000 PLN/mo | Pass only with the 03.10 conditions | Pass if sold quietly | Last, after traffic gate |
| Paid sticker or verification | Small | **Fail**: buying a badge | n/a | Rule out. Earned sticker only |
| Affiliate links | Small; no Polish rate found | **Fail in practice**: pays per product shown and needs brand names | Fail | Rule out, and delete from V3 fallback |
| Donations or Patronite | 200–2,000 PLN/mo | Pass, with no perks affecting the product | **Tension**: a patron page is a public ask with a faceless brand | Hold until community exists |
| Grants (KCPU, municipal, EU) | One-off, tens of thousands of PLN at best | Pass on paper | **Tension**: see below | Check eligibility only |
| Events ("swap one" nights, parked) | Near zero net | Pass if no brand sponsor; sponsorship is excluded | Pass | Brand, not revenue |

### Inferences
- **Grants conflict in substance, not just tone.** Applications reward claimed population effects and prevention language, and UNI may claim neither. Non-profit structure would also bring the framing the mission record refuses. Grant money is compatible only if the application stays within "helps individuals find an option". Taking addiction-prevention funds may also read as a policy position, even though it does not require stating one. Flag this for the founder.
- Wheelmap shows a grant-funded directory works, but as a non-profit with prize money over years. That is a different organisation from UNI's stated one.

### Gaps
- PARP, NCBR, EU and municipal programmes: not researched; no sources obtained. Polish affiliate rates for NA e-shops: none found.

## Cost model

### Takeaway
Infrastructure is almost irrelevant at every scale: about 550 PLN a month at most, even at 10,000 venues, not counting accounting. **The cost that decides viability is human review**, because the community record keeps review with the founder.

### Cited Findings
- **OVH VPS-1:** €6.49/mo, 4 vCPU, 8 GB, 75 GB, about 28 PLN. — [VPSBenchmarks](https://www.vpsbenchmarks.com/hosters/ovhcloud/plans/vps-1). Prices conflict across sources, and increases of 40–67% were reported around April 2026 ([LowEndTalk](https://lowendtalk.com/discussion/219470/ovh-vps-1-2025-or-was-it-2026-in-sbg)). Using 30 PLN needs checking on OVH's own page.
- **Map tiles:** OpenFreeMap free, commercial use allowed, no key, no stated limits. Paid fallbacks Stadia $20/mo (78 PLN), MapTiler $30/mo (117 PLN), or self-hosted PMTiles. [R: vector-basemap-on-openfreemap, prices as of Aug 2026] CARTO for reference: commercial use needs an Enterprise licence ([CARTO FAQ](https://docs.carto.com/faqs/carto-basemaps)); a forum post quotes about $20K a year, unverified ([Plotly forum](https://community.plotly.com/t/are-carto-based-choropleth-map-tiles-free-for-commercial-use-within-plotly-maps/91296)).
- **Geocoding:** GUGiK, no charge observed. [R] 
- **Mail:** Scaleway TEM 300 free per month ([Scaleway](https://www.scaleway.com/en/docs/transactional-email/how-to/manage-tem-plans/)), then €0.25 per 1,000, the latter from a third party ([European Alternatives](https://european-alternatives.eu/product/scaleway-transactional-email)).
- **AI:** Mistral Small about $0.15–0.20 in and $0.60 out per million tokens; aggregators conflict and none is official. — [AnotherWrapper](https://anotherwrapper.com/llm-pricing/mistral-small-latest), [PricePerToken](https://pricepertoken.com/pricing-page/model/mistral-ai-mistral-small). Which model UNI uses is undecided (blind test record).
- **ZUS 2026:** full social about 1,774 PLN/mo on a 5,652.60 base ([Norman](https://norman.finance/pl/en/help-center/zus-for-a-jdg)), plus income-dependent health contribution. Sources conflict on small-ZUS tiers. "Ulga na start": health only, about 314–381 PLN for six months. Mały ZUS Plus: prior-year revenue under 120,000 PLN ([Freenance](https://freenance.io/podatki/maly-zus-plus-2026-warunki-skladki-przychod-120000-zl-jak-zlozyc-prawo-do-preferencji/)).
- **Accounting:** 150–350 PLN net for small JDGs; 250–600 in another guide. — [Oferteo](https://www.oferteo.pl/artykuly/cennik-uslug-ksiegowych-i-rachunkowych), [Freenance](https://freenance.io/przedsiebiorczosc/jednoosobowa-dzialalnosc-gospodarcza-koszty-2026/)
- **Warsaw salary:** 10,847.21 PLN gross, January 2026; the coverage is unclear and January is a single month. — [Super Biznes](https://superbiz.se.pl/wiadomosci/zarobki-w-warszawie-spadly-nowe-dane-z-rynku-pracy-stolicy-aa-mNQB-7LZY-5wfZ.html). National Q2 2026: 9,233.13 PLN. — [xyz.pl](https://xyz.pl/dzieje-sie/przecietne-wynagrodzenie-w-drugim-kwartale-2026-gus-podal-nowe-dane-o-zarobkach-3895)

Monthly costs in PLN. **Venue count barely drives infrastructure; traffic does.** The review row assumes 1 contribution per venue per month at 2 minutes each.

| Item | 100 venues | 500 | 2,000 | 10,000 | Basis |
|---|---|---|---|---|---|
| Hosting | 30 | 30 | 60 | 300 | 100/500 [S]; larger sizes [A], not priced |
| Map tiles | 0 | 0 | 0 | 0–117 | [R] |
| Geocoding | 0 | 0 | 0 | 0 | [R] |
| Backups | 10 | 10 | 20 | 50 | [A]; Scaleway storage price not found |
| Mail (5 per venue per month [A]) | 0 | 2 | 11 | 54 | [C] |
| AI triage (2,000 in / 200 out tokens each) | under 1 | 1 | 4 | 20 | [C] |
| Accounting | 300 | 300 | 300 | 400 | [S] range, midpoint [A] |
| **Cash total** | **about 340** | **about 345** | **about 395** | **about 825–940** | [C] |
| Review hours per month | 3.3 | 17 | 67 | 333 | [A/C] |
| Review, valued at 77 PLN/h | 257 | 1,283 | 5,133 | 25,667 | [C]; 13,000 PLN ÷ 168 h |

- Not in the table: payment fees, about 3% [A]; social and health contributions if full-time on the JDG, about 2,200 PLN [A, built from the above; health varies]; founder salary.

### Inferences
- **AI costs about 20 PLN to read everything at 10,000 venues; the reading is cheap and the decision is what costs.** The 06.10 amendment keeps founder review "for now" and names AI as a possibility. At about 2,000 venues review takes 40% of a full-time month [C]. **So the review rule, not hosting, caps the size of a one-person UNI.** Scaling past roughly 1,000–2,000 venues needs either AI-assisted review or a paid moderator, and that would revise the community record's amendment. The 2-minute and 1-per-venue figures are unmeasured, so the V1 guest report channel should measure them.
- Menu rechecking is additional, not included here, and could be larger.

### Gaps
- Scaleway Object Storage price, official Mistral pricing, larger OVH plans, and Stripe or Paddle fees for Poland were not obtained. Is the founder employed alongside the JDG, which would change ZUS materially? Not in the records read. The Warsaw figure is an average wage, not a developer's market rate, so founder opportunity cost is likely higher.

## Scenario model: what must be true

### Takeaway
Covering cash costs is easy: about 4 paying venues. Covering social contributions takes about 27. Replacing a Warsaw salary takes about 143 at 98 PLN. Warsaw reaches that only in a case better than the optimistic one. Base Poland gets to about 60% of it, with review already unaffordable at that size for one person.

### Cited Findings
All inputs below are **assumptions** because no benchmark exists; see the comparables section. Sourced anchors:
- Warsaw universe: 2,729 to 3,500+ venues ([Knight Frank](https://content.knightfrank.com/research/2301/documents/pl/warszawa-atrakcyjnosc-miast-i-rynek-biurowy-iv-kw-2025-12635.pdf), [se.pl](https://www.se.pl/warszawa/warszawa-pierwsza-kulinarna-mapa-stolicy-aa-V6hP-gYiR-Lg81.html)).
- Poland restaurants plus bars: about 60,000 ([BOŚ](https://www.bosbank.pl/__data/assets/pdf_file/0024/76902/BOSBank_Restauracje_2026.07.pdf)).
- Plan prices [R]. Launch target 70 venues, 80+ in Growth Strategy [R].

**Assumptions**

| Variable | Conservative | Base | Optimistic | Status |
|---|---|---|---|---|
| Warsaw listed | 300 | 600 | 1,200 | [A]: 10 / 20 / 40% of about 3,000 |
| Top 6 listed (Warsaw, Kraków, Wrocław, Gdańsk, Poznań, Łódź) | 750 | 1,500 | 3,000 | [A]: 2.5 × Warsaw, city list and multiple unsourced |
| Poland listed | 2,000 | 5,000 | 10,000 | [A]: 3 / 8 / 17% of 60,000 |
| Claimed share | 10% | 20% | 35% | [A] |
| Paying share of claimed | 3% | 8% | 15% | [A]: **no benchmark exists** |
| ARPU, PLN/mo | 79 | 98 | 129 | Prices [R]; mix [A]: base is 70% Basic, 25% Pro, 5% Premium |

**Results** [C]. Payers are steady-state, so churn is hidden inside the paying share. Prices are taken as net of VAT [A]; the code label does not say.

| Geography | Case | Listed | Claimed | Payers | MRR, PLN | ARR, PLN |
|---|---|---|---|---|---|---|
| Warsaw | Conservative | 300 | 30 | 0.9 | 71 | 853 |
| Warsaw | Base | 600 | 120 | 9.6 | 941 | 11,290 |
| Warsaw | Optimistic | 1,200 | 420 | 63 | 8,127 | 97,524 |
| Top 6 | Conservative | 750 | 75 | 2.3 | 178 | 2,133 |
| Top 6 | Base | 1,500 | 300 | 24 | 2,352 | 28,224 |
| Top 6 | Optimistic | 3,000 | 1,050 | 158 | 20,318 | 243,810 |
| Poland | Conservative | 2,000 | 200 | 6 | 474 | 5,688 |
| Poland | Base | 5,000 | 1,000 | 80 | 7,840 | 94,080 |
| Poland | Optimistic | 10,000 | 3,500 | 525 | 67,725 | 812,700 |

**Break-even, paying venues needed** [C], after 3% payment fees:

| Target | Monthly need, PLN | ARPU 79 | ARPU 98 | ARPU 129 |
|---|---|---|---|---|
| Cash costs at small scale | 340 | 4.4 | 3.6 | 2.7 |
| Cash plus JDG social and health | 2,540 | 33 | 27 | 20 |
| Replace a Warsaw salary | 13,600 | 178 | 143 | 109 |

Salary target: 10,847 gross × about 1.2048 employer cost = 13,068, rounded to 13,000, plus about 600 of running costs [A/C]. The employer multiplier is from general knowledge and unverified. Tax on JDG income is not modelled.

**What must be true in Warsaw alone for salary replacement:** 143 payers is 4.8% of all roughly 3,000 Warsaw venues, or 24% of a 600-venue listing [C]. With 1,200 listed and 35% claimed, 34% of claimers must pay [C], more than double the optimistic rate.

**Sensitivity, Poland base 7,840 PLN MRR, one variable moved through its range** [C]:

| Variable | Low → high | MRR low | MRR high | Swing, PLN |
|---|---|---|---|---|
| Venues listed | 2,000 → 10,000 | 3,136 | 15,680 | 12,544 |
| Paying share of claimed | 3% → 15% | 2,940 | 14,700 | 11,760 |
| Claimed share | 10% → 35% | 3,920 | 13,720 | 9,800 |
| ARPU | 79 → 129 | 6,320 | 10,320 | 4,000 |

### Inferences
- **Listed venues and paying share dominate, and ARPU matters least.** The model is multiplicative, so each swing reflects my chosen range. Still, the paying share is the one with no evidence behind it, and the one that can be tested cheaply now.
- **Is Warsaw-only viable?** As a project that pays for itself, yes: about 4 payers. As a job, no. Warsaw is the proof step, and geography is needed for income. **Treat Warsaw as testing whether the paying share is above roughly 8%, not as the business.**
- **The realistic outcome is a low-cost, self-funding public-interest product** with a chance of a modest income if Poland-wide listing and producer reports both work. Base Poland plus mid-range reports could approach one salary [A/C], which is why the reports' ethics matter so much.
- **Honest risk: the conservative column is entirely plausible,** and there it never earns anything meaningful at any size.

### Gaps
- Traffic is not an input to these results, though it gates them, see below. Churn is not modelled separately. Venue closure rates, which affect churn, were not found. Population multiples for cities were not sourced.

## Milestones and sequence

### Takeaway
Replace "PMF" and the V3 gate of 30 claimed venues with measured gates in this order: review time, data density, a paid test, then tooling and reports. Community-first changes the order by pulling review cost forward. It helps the biggest variable but does nothing for paying share.

### Cited Findings
- **Existing gates:** V3 asks for 500 visitors, 30 active venues, 30+ claimed, 5+ unprompted premium enquiries, and 3 owners asking for more. [R: roadmap/v3.md] Those figures imply about 17 visitors per venue a month [R], which I judge too thin for any demand report.
- **Existing thresholds:** reporting floor of 3 venues; research suggests 5 then 10; 30 events per cell for producers. [R] The brand-outreach record says thresholds for traction are "still to be set". [R: brand-outreach-waits-for-traction]
- **Sequencing rule:** outreach follows traction; 35 of 70 venues was the launch state on 03.10, and community work displacing venues was rated a high risk. [R: journals/2026-10-03]

Proposed gates. All numbers are [A] starting values to replace with measurement.

| # | Gate | Threshold | Unlocks | Time to spend before it |
|---|---|---|---|---|
| 0 | Fix conflicts | Paid badge, V3 placement lines | Everything | About an hour plus a record |
| 1 | BV-1 asked, non-phone | 5+ owners; separately test report vs menu tool | Whether to keep analytics as the lead | None to build |
| 2 | Review cost measured | Minutes per contribution over 100+ items | Community scope, AI decision | Guest report only |
| 3 | Warsaw data density | About 5,400–27,000 filtered searches a month, or roughly 18,000 sessions | Selling district and category reports | Keep events running, build nothing new |
| 4 | Venue signal | Median claimed venue with 200+ impressions a month | Selling venue-level reports | As above |
| 5 | Paid test | 30+ claimed venues offered a paid plan, target ≥8% after 60 days | Billing, second city | Manual invoices, no Stripe build |
| 6 | Second city | Warsaw sustains gates 3 and 5, review under about 20 h/month | Top 6 | Playbook only |
| 7 | Producer reports | Q6 decided, on-premise signal is unique, ≥10 venues per cell | First report | None before this |

Gate 3 arithmetic [C]: 18 districts × 10 categories × 30 events = 5,400 events with perfectly even spread; ×5 for skew [A] = 27,000; at 1.5 searches a session [A], about 18,000 sessions. The 10 categories and 18 districts should be checked against the product. A month of 18,000 sessions is about 1% of Warsaw's population, about 1.8M from general knowledge.

### Inferences
- **The current plan assumes:** seed by hand → SEO → analytics value → charge. **Community-first changes it to:** seed → guest signals → measure review → open proposals only if review stays affordable → charge. Its benefit: more venues and fresher menus, which is the largest swing variable and the thing protecting the medium-rated moat. Its cost: hours, trust and the extraction question ("you get tips for free and sell data"). So contributors should be told plainly what stays free before any sale, and producer sales should come after that statement.
- **Community does not create buyers.** It improves listing count and freshness, and possibly claims, while paying share stays a separate question. Do not count community success as evidence for the business model.
- **Do not build billing or Pro and Premium modules further before gate 5.** The code already holds these plans behind the switch. The owner-panel feedback says to build V2 features complete behind the switch, so this could be read as a change of emphasis; the founder should decide. I am not recommending removal.
- **Recommendation to name and date:** amend no-pay-to-rank's "B2B analytics only" to "B2B analytics and tools for venues, plus aggregates under the producer rules", leaving all ranking, placement and badge prohibitions unchanged. This is the only recommendation here that alters a Decided record's substance. The others correct wording (`osm-dropped`, `schema.md`) or enforce existing rules (`pricing.md`, `roadmap/v3.md`, `VenuePlan`).

### Gaps
- Polish search volume for NA-venue queries was not researched, so whether 18,000 Warsaw sessions a month is reachable is unknown. **This is the second most important unknown after paying share.** Keyword data from Search Console after launch would answer it.
