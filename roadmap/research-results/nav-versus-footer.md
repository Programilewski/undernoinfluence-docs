<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# @Academic You are advising a solo founder on the **primary navigation** of **Under No Influence (UNI)**, a Polish-language directory of venues — bars, cafés, restaurants, pubs, hotels — catalogued by the quality of their **non-alcoholic drink offering**. Pre-launch, no public traffic yet, Warsaw first, launch targeted for late November 2026. The interface is entirely in Polish; the audience is Polish.

The product exists to help somebody find a healthier option they would otherwise have missed. It is harm reduction, not abstinence advocacy, and it takes no public position on alcohol policy. There is no paid placement: no venue can buy a position, and the navigation must never become a sales surface.

### How people will arrive

**Organic search is the main growth channel** — city, district and category landing pages, plus a venue page per venue. The second channel is Instagram, three posts a week. There is no advertising budget. So internal links matter twice: for people, and because the navigation is the strongest internal link on the site and shapes how crawlers distribute authority.

### The six items currently in the navigation

Listed in their current order, with what each page actually is. All labels are Polish.


| \# | Label | Address | What it is |
| :-- | :-- | :-- | :-- |
| 1 | **Lokale** | `/mapa` | **The product itself** — a filterable map and list of catalogued venues. Filters for category, "verified drinks card", "managed by the owner", "only 0.0%", freshness of the data, plus search and sort. This is where somebody goes to decide where to go tonight. It is visually distinguished from the other five with a gradient outline |
| 2 | **Jak to działa** | `/jak-to-dziala` | How the catalogue is built and what each badge on a venue means — the "why should I trust this data" page. Indexable |
| 3 | **O nas** | `/o-nas` | What the project is and why it exists. Indexable |
| 4 | **Suchy styczeń** | `/suchy-styczen` | A Dry January landing page: what it is (the page must earn both the English "Dry January" and Polish "suchy styczeń" queries), why people do it, a **live list of venues from the catalogue**, what to order by category, and an explicit "nobody is telling you to quit" section. A **permanent** address, refreshed each year rather than created and deleted. Its traffic is overwhelmingly seasonal — late December through January — but it must be indexed *weeks before* January to rank during it |
| 5 | **FAQ** | `/faq` | Fourteen questions: where the data comes from, what the badges mean, why there are no prices, why there are no opening hours, how the project makes money, whether it is telling anyone to stop drinking, what "0,0%" means. Indexable |
| 6 | **Kontakt** | `/kontakt` | One e-mail address and what to write about: venue owners wanting to be listed, corrections to data, personal-data requests, press. **No form.** Indexable |

### What is in the footer today

City links (generated from the catalogue), then: Jak to działa · O nas · FAQ · Kontakt · Regulamin (terms) · Polityka prywatności (privacy policy).

So four of the six navigation items are **already duplicated in the footer**. The two legal pages are footer-only and are deliberately `noindex` — they are boilerplate that should not compete with real content for brand queries.

### Other pages that exist but are not in the navigation

Venue pages (`/miejsce/{venue}`), city pages (`/{city}`), district pages, and category pages (`/kategoria/{category}`). These are the search-landing surface and are reached from the map, from each other and from the sitemap.

### Pages that will exist within months, and may want a place

- **Brand pages and drink pages** — one per non-alcoholic brand and per drink, each ending in a counted link to the venues serving it ("served in fourteen places in Warsaw"). Five years of search data show real and growing demand for non-alcoholic *beer* and effectively none for phrases about non-alcoholic *bars*, so these are expected to become the **primary** search entry point. Not yet built.
- **A NoLo glossary** — definitions, mostly an internal-linking surface. Not yet built.


### Hard constraints — do not propose solutions that break these

1. **There is no room for a seventh item in the desktop bar.** The bar is absolutely centred on the header, which caps the space it can occupy at half the header width. Six one-line Polish labels already forced the bar's breakpoint up from 768px to 1024px; below that, all six live in a hamburger drawer. A recommendation to *add* an item must either name what leaves, or justify a structural redesign.
2. **There are no public user accounts** in this version. No login, register, profile or saved-places item is available to put anywhere.
3. **There is no "for venues" page.** A B2B landing page was deliberately withdrawn; venue owners are handled by e-mail through `/kontakt`. Do not recommend reinstating it — recommend only where the existing owner-facing route should sit.
4. **The legal pages stay in the footer** and stay out of the index.
5. **Polish labels, Polish market.** Where your evidence comes from English-language or US sources, say so, and say whether you expect it to transfer.

### The questions

1. **Item by item, does each of the six belong in the primary navigation, in the footer, in both, or nowhere?** Give a verdict for each, with reasoning. Treat "both" as a real option that has to be justified rather than a default.
2. **Does duplicating a link in the navigation and the footer help or hurt?** Separately for people (does it aid or clutter) and for search (does a second internal link to the same address add anything, dilute anything, or do nothing measurable). If the SEO claim you find is folklore rather than evidence, say so plainly.
3. **How many items should a primary navigation carry, and what happens past that number?** I am interested in actual evidence — eye-tracking, click-distribution, task-completion studies — not the frequently misapplied "7±2" heuristic. If the honest answer is that item count matters less than labelling and ordering, say that.
4. **Where should the seasonal item sit?** A page whose demand is concentrated in about six weeks but whose address is permanent and must be indexed well before the season starts. What do seasonal commerce and content sites actually do — add and remove the navigation entry each year, keep it permanently, or promote it from the footer on a date? **Is there evidence that removing a navigation item seasonally harms the page's ranking when it returns?** This is the single question with the most money attached, because Dry January is the largest seasonal opportunity this product will ever have.
5. **Where do "FAQ" and "Kontakt" conventionally sit, and does the convention have evidence behind it?** Both are commonly footer items. Both are also things a hesitant first-time visitor looks for specifically. Does the answer change for a product whose entire pitch is data trustworthiness — where "how do you know this" and "who are you" are the objections that block use?
6. **Is there any legal or regulatory floor** in Poland or the EU on how reachable contact details, terms and the privacy policy must be from any page — under the Polish act on providing services by electronic means, the GDPR's transparency duties, the Digital Services Act's point-of-contact requirements, or the European Accessibility Act? I am asking about **placement and prominence**, not the content of those documents. Cite the provisions where they exist and say where there is no requirement, only convention.
7. **Should the desktop bar and the mobile drawer hold the same items?** The drawer has room the bar does not. Is there evidence for or against differing between them, and does it create a discoverability problem when a person moves between devices?
8. **What is the right order?** The primary action ("Lokale") is currently first. Is that supported, or does the evidence favour an end position for a primary action? Does the answer differ between a horizontal bar and a vertical drawer?
9. **What should change when brand and drink pages ship?** If those become the main search entry point, does the navigation need a category or product entry — and does that mean a dropdown or mega-menu, at a catalogue of perhaps fifty venues and a few hundred drinks? Say if that would be premature.

### What a good answer looks like

- **A table with one row per item and a clear verdict** — navigation, footer, both, or neither — plus a confidence level and what the verdict rests on: a controlled study, an industry standard, an observed convention, or an opinion. Label which of those four it is every time.
- **A recommended final order** for the bar and, if different, for the drawer.
- **A dated trigger for the seasonal item** if your answer to question 4 is conditional — what should happen in November, and what in February.
- **What to measure after launch** to find out whether the recommendation was right: which Search Console and analytics signals would show that a navigation item is earning its place or not, and how long before the data means anything.
- Say explicitly where you could not find evidence. Silence in the literature is a finding; an inferred best practice presented as evidence is not.
- If you think one of the six pages should not exist at all, say that too — it is a more useful answer than a placement recommendation.

UNI’s primary navigation should stay lean (6 items), keep **Lokale** first, surface trust content (“Jak to działa”, FAQ, Kontakt) in both header and footer, and treat **Suchy styczeń** as a persistent URL that is promoted in the nav only during the seasonal window while remaining linked elsewhere off‑season.[^1_1][^1_2][^1_3][^1_4]

Below I’ll go question by question, starting with the requested table.

## Verdict per item

### Placement table

| \# | Label | URL | Recommended placement | Confidence | Basis type \& rationale |
| :-- | :-- | :-- | :-- | :-- | :-- |
| 1 | Lokale | `/mapa` | **Primary navigation only** | High | **Industry standard + observed convention.** Primary navigation is meant to expose the core task; case studies and audits consistently show top nav items focus on “what you do” and the main product/service.[^1_5][^1_6][^1_2] Users expect the main way to “use the product” to be in the header, and footer use for core product is rare outside very large sites.[^1_7][^1_8] City links already give a strong footer route into the catalogue, so duplicating a generic “Lokale” link there adds little for users or SEO. |
| 2 | Jak to działa | `/jak-to-dziala` | **Both navigation and footer** | High | **Controlled usability + industry standard.** Trust and “how it works” content is a primary objection‑buster; people often look either to the header or footer for explanation and guarantees.[^1_9][^1_10][^1_11] For a data‑trust pitch, giving this page site‑wide header visibility and footer redundancy matches patterns where trust and support content appears in both places (fat footers, support columns).[^1_7][^1_12] |
| 3 | O nas | `/o-nas` | **Footer only** | Medium | **Observed convention + expert opinion.** About/identity content is important but usually secondary to product and trust mechanics, and is very commonly placed in the footer only once primary needs are covered.[^1_7][^1_11][^1_13] On a constrained 6‑item bar, moving “O nas” down avoids crowding while preserving reachability from every page. This balances limited header space against the fact that “who are you?” can also be addressed in “Jak to działa” and FAQ. |
| 4 | Suchy styczeń | `/suchy-styczen` | **Seasonal: navigation + footer Dec–Jan; footer + contextual links Feb–Nov** | Medium | **SEO best practice (seasonality) + opinion.** Seasonal SEO literature and Google guidance strongly advise a **stable seasonal URL** reused each year, kept live year‑round, and boosted with internal links from homepage/nav shortly before demand peaks.[^1_3][^1_4][^1_14][^1_15] Removing the nav link after the season – while keeping footer and contextual links – is widely recommended to avoid year‑round prominence without harming authority, but there is no controlled study directly on “nav removal vs ranking” for seasonal pages. |
| 5 | FAQ | `/faq` | **Both navigation and footer** | High | **Usability research + observed convention.** Support and FAQ are classic “utility” destinations that users often go directly to the footer to find, yet they also benefit from header presence when trust and “how do you know this?” are core objections.[^1_11][^1_16][^1_12] Studies on contact/support discoverability show users scanning top nav and footer for these links; keeping FAQ in both places matches that pattern and reinforces UNI’s trust positioning.[^1_11][^1_17] |
| 6 | Kontakt | `/kontakt` | **Both navigation and footer** | High | **Usability research + legal expectations.** NN/g’s Contact Us research shows users expect a visible Contact link in **main or utility navigation and in the footer**, and see sites that hide contact details as evasive.[^1_17] Contact, address and email are also subject to EU/E‑commerce Directive and Polish electronic‑services act requirements to be “easily, directly and permanently” accessible.[^1_18][^1_19][^1_20] Putting Kontakt in both header and footer aligns with these expectations and supports legal transparency duties. |

Where I use English‑language sources, they are primarily from US/UK or broader EU contexts. There is no evidence that Polish users behave differently in these specific navigation patterns, and core expectations around “Contact”, “FAQ”, and trust pages are broadly consistent across markets.[^1_11][^1_17]

______________________________________________________________________

## Duplicate header + footer links: people and search

### For people

- Usability studies and practitioner research show that users look to **both** the header and footer for certain utility items — especially **Contact**, support/FAQ, and sometimes About.[^1_17][^1_13][^1_11]
- Having the same critical links in both places tends to **reduce search time and frustration** for these tasks, not increase clutter, provided the footer is a compact, well‑grouped block rather than a link dump.[^1_12][^1_8]

So, duplicating a few **high‑frequency, high‑trust** links (Jak to działa, FAQ, Kontakt) in both header and footer generally **helps** people. Duplicating low‑value or rarely used links widely would create noise.

### For search / SEO

- Modern internal‑link guidance and analyses of Google patents suggest that **only the first link to a given URL on a page carries full anchor‑text weight**, but all links contribute to crawlability and user navigation.[^1_21][^1_22][^1_23]
- Footer and header links are treated as **boilerplate navigation with lower ranking weight** than contextual in‑content links, under “reasonable surfer” style weighting.[^1_24][^1_25][^1_26]
- Multiple links to the same URL from one page generally **do not increase PageRank transfer** and at extreme scale can dilute link equity by increasing the denominator of outbound links, but this is only measurable for very large sites and dense link structures.[^1_27][^1_28][^1_21]

On a small, content‑lean site like UNI, having a header link and footer link to the same page:

- Does **not measurably hurt SEO**,
- Adds **crawl paths and site‑wide signals of importance**, but
- Provides almost no extra ranking advantage beyond the first navigation link.

Most of what you will read about “duplicate internal links” is practitioner extrapolation rather than controlled experiments; I did not find peer‑reviewed evidence quantifying header+footer duplication impact on rankings. The safe interpretation is: **use duplication sparingly for high‑value pages; rely on contextual links for real SEO gains.**[^1_29][^1_30]

______________________________________________________________________

## How many items in primary navigation?

### Evidence on item count

- Audits of B2B/SaaS and business sites consistently find **4–6 top‑level nav items**, with almost no sites exceeding 7.[^1_31][^1_2]
- Several UX best‑practice guides recommend **“five to seven”** primary items to avoid choice overload and maintain scanability, noting that “7±2” is often misapplied and the real constraint is visual scanning and decision cost, not memory capacity.[^1_6][^1_32]
- A navigation‑order eye‑tracking study on menus with **6–10 items** found **no statistically significant impact** of distance from center on time to first fixation; in other words, within that range, item position did not materially change how quickly users spotted a link.[^1_33]

The most honest reading is:

- With **around 4–7 items**, menus are typically easier to scan; above that, people start skimming and make faster, less considered choices or ignore the nav altogether.[^1_6][^1_31]
- **Item count matters less than labeling and grouping**: clear, task‑oriented labels and logical grouping are more important than whether you have 5 or 6 items.[^1_9][^1_34]
- Your current 6‑item bar is within the empirically safe range; further additions without consolidation would likely degrade scanability.

So UNI should **keep primary navigation at six or fewer items** until there is a clear, user‑validated need to promote more destinations.

______________________________________________________________________

## Seasonal page placement: Suchy styczeń

### What seasonal sites actually do

SEO and UX guidance for recurring seasonal events (Black Friday, holidays, etc.) converges on three patterns:[^1_3][^1_4][^1_15][^1_35]

- Use a **permanent, evergreen URL** (e.g. `/suchy-styczen`) that is reused each year and kept live year‑round.
- **Refresh content on that URL** before each season, rather than creating new year‑stamped pages that fragment authority.[^1_4][^1_14][^1_15]
- Temporarily **boost internal links** from homepage and main navigation leading up to and during the season, then remove or demote those links afterwards while keeping other internal links (from related content, category pages, footer).[^1_36][^1_37][^1_3]

Google’s own guidance (John Mueller) explicitly recommends **using one URL for all seasonal content and linking to it from the homepage or navigation during relevant periods**, to let that URL accumulate link equity over years.[^1_14]

### Does removing the nav link harm rankings next year?

I did not find a controlled experiment or large‑sample study that isolates “removing a navigation link seasonally” as a variable and measures the next year’s ranking impact. What exists are:

- Practitioner case studies where seasonal pages rank well year after year with **reused URLs and seasonal changes in navigation exposure**.[^1_38][^1_39][^1_3]
- Strong advice to keep the page **live and internally linked year‑round**, but no claim that keeping it in the top nav year‑round is necessary or even desirable.[^1_35][^1_4]

The consensus interpretation:

- **Removing a nav entry after the seasonal peak does *not* materially harm future rankings**, provided the page:
    - Keeps its URL stable,
    - Remains indexable and linked from some evergreen pages and/or the footer,
    - Gets navigation and homepage prominence again well before the next peak.
- The main ranking risks come from **deleting, redirecting, or chronically under‑linking** seasonal URLs, not from changing their position in the navigation.


### Recommended seasonal handling for UNI

Given Dry January’s importance:

- Keep `/suchy-styczen` live year‑round.
- From around **1 December to 31 January**, expose **Suchy styczeń** in the primary navigation and footer, and link it contextually from relevant content (map filters, venue pages, any Dry January blog pieces).
- From **February onwards**, remove it from the header, keep it in the footer’s internal‑links group, and continue contextual links from venues/categories that are particularly relevant (e.g. “tylko 0,0%” venues).

This follows best practice for seasonal SEO while respecting the principle that the nav bar should focus on year‑round tasks.[^1_37][^1_3][^1_4]

______________________________________________________________________

## FAQ and Kontakt placement

### Conventional placement

- NN/g and other UX researchers consistently report that users expect **Contact** (and often Help/FAQ) links in the **top navigation or utility area and in the footer**.[^1_13][^1_8][^1_11][^1_17]
- Eye‑tracking and qualitative studies show that when asked to find support or contact information, users scan the **top right of the header and then the footer**, and sites that bury these links are seen as evasive or untrustworthy.[^1_11][^1_17]
- Observational studies of corporate and e‑commerce sites find that while FAQ is often in the footer or help center, **high‑trust contexts** (banking, healthcare) surface help and explanation more prominently.[^1_10][^1_16][^1_9]


### Does the convention have evidence behind it?

Yes, for Contact:

- NN/g’s dedicated Contact Us study and footers pattern analysis are based on task‑completion tests and eye‑tracking, not just opinion. Participants reliably looked first to header and footer; absence in either increased task time and frustration.[^1_17][^1_11]

For FAQ:

- Evidence is weaker; most is from e‑commerce testing where FAQs about returns/shipping are high‑value and are expected in footer quick paths. There is no specific controlled study comparing FAQ in header vs footer, but the pattern of grouping support/help in footer is well documented in audits.[^1_7][^1_16][^1_8][^1_12]


### UNI’s trust pitch

Because UNI’s pitch hinges on **data trustworthiness** (“jak to działa”, badges, 0,0% definitions):

- I recommend keeping **FAQ and Jak to działa visible in the top navigation and duplicated in the footer**, as trust‑critical destinations.
- **Kontakt** should also be in both header and footer to support perceived openness, especially as there is no form and email is the single public contact method.[^1_18][^1_17]

This deliberately departs slightly from the “FAQ‑only‑in‑footer” convention, but aligns with evidence on contact discoverability and UNI’s specific trust objections.

______________________________________________________________________

## Legal and regulatory floor in Poland/EU

You asked about **placement and prominence**, not content. Here the law sets **accessibility standards**, but does *not* prescribe “header vs footer”.

### Act on Providing Services by Electronic Means (Poland)

- The Polish Act on Providing Services by Electronic Means (Ustawa o świadczeniu usług drogą elektroniczną) requires that the provider make **basic information “clearly, explicitly and directly available” via the ICT system used by the recipient**.[^1_20][^1_18]
- Basic information includes: electronic address(es), name/company and address, and – for entrepreneurs or regulated professions – authorisation and registry details.[^1_18][^1_20]

This is interpreted (in Polish legal commentary) as requiring **site‑wide, easily accessible contact and identity information**, often via a **permanent footer or header link** to contact and legal pages, but not specifying visual prominence.[^1_20]

### E‑commerce Directive (2000/31/EC)

- Article 5 requires that service providers render **name, geographic address, email, and contact details “easily, directly and permanently accessible”** to recipients and authorities.[^1_19][^1_40][^1_41]
- The ECJ has clarified that **email alone is not sufficient**; another rapid, direct, effective means must be offered, such as a phone number or web form, and that information should be permanently accessible, typically via the website.[^1_42][^1_43]

Again, this is about **existence and ease of access**, not header vs footer. A globally visible footer link to Kontakt and legal information meets the “permanent and easily accessible” standard.

### GDPR transparency

- GDPR Articles 12–14 and transparency guidelines require privacy notices to be **easily accessible, written in clear language**, and visible wherever personal data is collected.[^1_44][^1_45][^1_46][^1_47]
- The Article 29 Working Party explicitly recommends a **clearly visible link to a privacy statement on each page**, under a term like “Polityka prywatności” or “Informacja o ochronie danych”, often in the footer.[^1_46][^1_47]

This effectively sets a floor: **a link to the privacy policy must be present on every page and easy to find**, which your footer implementation already satisfies.

### Digital Services Act (DSA)

- The DSA requires intermediary service providers to designate a point of contact for authorities (Article 11) and to provide users with an “easy method for contacting them”, including an electronic means such as email or a contact form (Article 12).[^1_48][^1_49]
- Guidance suggests including contact information in legal documents and providing a Contact page linked from header or footer so users can find it from any page.[^1_49]

UNI is a content/platform service; treating `Kontakt` as that user‑facing contact point, accessible globally from header and footer, aligns with DSA expectations.

### European Accessibility Act (2019/882)

- The Act requires that websites and apps be **perceivable, operable, understandable, and robust** for persons with disabilities. It focuses on technical accessibility (semantics, keyboard navigation, contrast), not specific visual placement of contact or legal links.[^1_50]

Overall:

- **Law and regulation set floors for *availability and ease of access*, not header vs footer.**
- A consistent footer with Kontakt, Regulamin, Polityka prywatności on every page, plus a Kontakt link in the header, comfortably meets EU and Polish requirements.

I did not find any provision mandating that contact or legal links must appear in the *primary* navigation bar specifically.

______________________________________________________________________

## Desktop bar vs mobile drawer

### Evidence on hidden vs visible navigation

- NN/g’s quantitative study of hidden vs visible navigation found that **hidden menus (hamburger/drawer) cut discoverability almost in half**, reduced navigation use, and increased task time and perceived difficulty on both desktop and mobile.[^1_1]
- For mobile specifically, they recommend visible links when you have **four or fewer top‑level items**, and hiding some items only when necessary beyond that.[^1_1]

Sparkbox’s analysis of content‑rich mobile sites adds:

- Use **visual hierarchy** to distinguish primary vs secondary navigation in mobile menus, and allow users to open/close sections to drill down.[^1_51]
- Keep the main menu robust rather than relying on additional section menus; ensure every page can serve as a first landing page.[^1_51]


### Same items or different?

There’s **no direct controlled study** comparing “same items in desktop header vs mobile drawer” versus “different sets” and measuring discoverability across devices.

However, from the above:

- For **primary destinations** (Lokale, Jak to działa, FAQ, Kontakt, Suchy styczeń in season), they should be **accessible in both desktop and mobile primary navigation**, even if desktop shows them inline and mobile shows them in a drawer. Hiding an item only on one platform creates cross‑device inconsistencies and discoverability gaps.
- Mobile drawers can safely contain **additional lower‑priority links or groupings** (e.g. city shortcuts) that don’t exist in the desktop bar, provided the hierarchy is clear and keyboard/assistive navigation order respects importance.[^1_52][^1_51]

So:

- **Desktop bar and mobile drawer should share the same top‑level items** for UNI’s six primary destinations.
- The drawer can add extra convenience links (e.g. cities, glossary) without those becoming primary desktop items.

______________________________________________________________________

## Order of items

### Evidence on position within menu

- The eye‑tracking study on navigation menu order found **no significant relationship between distance from center and time to first fixation** for items in horizontal and vertical menus with 6–10 items. This suggests that within a short menu, exact position (first vs last) does not dramatically change how quickly users find an item.[^1_33]
- More general eye‑tracking work shows an **F‑shaped scanning pattern**, with users’ attention concentrated on the top and left areas first. This is why logos and primary actions are commonly placed at the left/top.[^1_32]

Taken together:

- There is **no strong empirical reason** to move the primary action from the leftmost position to the rightmost; what matters more is **label clarity and visual emphasis** (your gradient outline on Lokale).[^1_32][^1_33]
- Keeping **Lokale** first is consistent with F‑pattern scanning and common navigation patterns for task‑first products.


### Recommended order: desktop bar

Off‑season (February–November):

1. **Lokale** (`/mapa`) – primary action.
2. **Jak to działa** – trust/explanation.
3. **FAQ** – objections and details.
4. **O nas** – identity (if kept in header at all; see below).
5. (Slot reserved for future “Napoje”/brands entry).
6. **Kontakt** – rightmost, matching expectation of contact link in top right.[^1_13][^1_17]

Given header constraints, my more opinionated recommendation is to **remove O nas from the bar and keep it footer‑only**, freeing a slot for future brands/drinks without exceeding six items.

In that configuration, off‑season:

1. Lokale
2. Jak to działa
3. FAQ
4. (future Napoje / Drinks)
5. Suchy styczeń (if you opt to keep it visible year‑round, which I don’t recommend) or another resource
6. Kontakt

In‑season (December–January), with six items:

1. Lokale
2. Suchy styczeń
3. Jak to działa
4. FAQ
5. (future Napoje slot, if launched)
6. Kontakt

O nas stays in the footer; Dry January earns a central slot to signal seasonal relevance.

### Recommended order: mobile drawer

For the drawer, use the **same items in the same logical order**, but you can group them visually:

1. Lokale
2. Suchy styczeń (seasonal)
3. Jak to działa
4. FAQ
5. O nas (if you keep it in header)
6. Kontakt

The key is that tab/keyboard order matches visual order, as accessibility guidance recommends.[^1_52][^1_50]

______________________________________________________________________

## When brand and drink pages ship

### Anticipated role

Five years of search data suggest that **non‑alcoholic drink and brand queries (especially beer) will become the primary search entry point**, not venue or “non‑alcoholic bar” queries. That implies:[^1_4][^1_36]

- Many users will land first on **brand or drink pages** (e.g. specific 0,0% beers) and only then navigate to venues.
- These pages need strong internal links to venue listings (“Podawane w czternastu miejscach w Warszawie”) and vice versa.


### Do they deserve a top‑level nav item?

Evidence from e‑commerce navigation UI research:

- Adding **mega‑menus** for large product catalogs can improve perceived trust, understandability, and usability when users are browsing many categories, but horizontal menus without drop‑downs neither harmed nor particularly improved navigation satisfaction in some studies.[^1_53][^1_54]
- Mega‑menus add complexity; they are most beneficial when the catalog is large and users regularly browse through category hierarchies.

UNI at launch:

- ~50 venues and a few hundred drinks is relatively small; brand/drink pages will mainly serve as **search landing pages and internal linking hubs**, not as browsing destinations like “shop categories” yet.
- Adding a top‑level “Napoje” with a dropdown grouping drink types (piwo 0,0, wina bezalkoholowe, koktajle bez alkoholu, etc.) would be useful **once you have clear taxonomy and consistent search demand across multiple drink categories**, but may be premature at very small scale.


### Recommended approach

Phase 1 (early after brand/drinks launch):

- Do **not** add a new primary nav item yet; keep within six.
- Ensure brand and drink pages are:
    - Linked from venue pages (“podawane tutaj”),
    - Linked from category pages (e.g. “piwo 0,0%” filter),
    - Present in the sitemap and internally linked from content (glossary, Dry January page, guides).

Phase 2 (when drink pages account for a substantial share of organic entry, and taxonomies stabilise):

- Introduce a **single primary nav item** like **Napoje bezalkoholowe** or **Napoje \& marki**, pointing to a **drinks hub page** that:
    - Explains drink categories and badges,
    - Lists brands and drinks with filters,
    - Links to drink detail pages.
- If you take this step, you should **keep total top‑level items at six** by retiring O nas from the header (footer‑only), as suggested above.

A full mega‑menu with all brands is likely premature at UNI’s expected scale; a **hub page plus contextual links** is a lower‑complexity pattern supported by navigation research. There is no strong evidence that a mega‑menu improves UX for small catalogs in this domain.[^1_54][^1_51]

______________________________________________________________________

## Seasonal triggers for Suchy styczeń

Assuming Dry January interest peaks late December–January:

- **By mid‑October**: Ensure `/suchy-styczen` content is updated for the coming season (current year, venues, recommended orders) and passes basic SEO checks (indexable, internal links from map/city pages).[^1_36][^1_35][^1_4]
- **By 15 November**:
    - Add **Suchy styczeń** to the primary navigation and footer.
    - Add contextual internal links from relevant evergreen pages (map, venues, any glossary entries on Dry January), as seasonal guidance suggests internal linking 1–2 months before peak.[^1_55][^1_15][^1_3]
- **By 1 February**:
    - Remove **Suchy styczeń** from the primary navigation.
    - Keep it in the footer and ensure contextual links remain from any evergreen content where Dry January is relevant.

This timing aligns with evidence that seasonal pages need internal‑link prominence **weeks ahead** of demand, not just during it.[^1_55][^1_4][^1_36]

______________________________________________________________________

## What to measure after launch

### Search Console

Per‑page for each navigation destination:

- **Impressions and clicks** for queries matching each nav item (especially `/mapa`, `/jak-to-dziala`, `/faq`, `/kontakt`, `/suchy-styczen`).
- **Average position** and **CTR** year‑round, plus **seasonal spikes** for `/suchy-styczen` (late December–January).
- **Internal links count** to each page (Search Console “Links > Internal links”), as a proxy for how much site‑wide authority each nav page receives.[^1_28][^1_23][^1_37]

Signals that a nav item is earning its place:

- Growth in **organic clicks** and **CTR** for relevant queries.
- **Stable or improving positions** without needing external links.
- Meaningful internal link counts relative to site size.

You’ll need at least **8–12 weeks of live data** (longer for seasonal items) to distinguish structural effects from noise.[^1_39][^1_4]

### Analytics / event tracking

Instrument:

- **Nav click events** per item, segmented by device and page type (homepage vs deep entry).
- **Task success proxies**:
    - For Lokale: map interactions, filter use, clicks to venue pages, “copy address” or click‑to‑map events.
    - For Jak to działa / FAQ: scroll depth, completion of trust‑related tasks (e.g. arriving from search and then using the catalogue).
    - For Kontakt: emails sent (or mailto clicks).

Look for:

- **Click distribution**: Items with consistently negligible nav clicks and low organic demand might not deserve header space.
- **Downstream behaviour**: Whether users who visit trust pages from navigation then go on to use Lokale (harm‑reduction outcome).
- **Device differences**: If mobile users under‑use hidden navigation compared to desktop, consider rebalancing which items are visible vs in the drawer.[^1_51][^1_1]

Tools like Hotjar/Clarity can complement event data with **click maps on nav and footer**, as suggested in navigation best‑practice guides.[^1_31][^1_32]

______________________________________________________________________

## Where evidence was missing

Explicit gaps I encountered:

- **No controlled study** directly measuring the SEO impact of adding and then removing a navigation link to a seasonal page year after year. Recommendations are based on theory and case studies.[^1_3][^1_14][^1_4]
- **No empirical work** comparing “same vs different item sets” between desktop nav and mobile drawer across devices; guidance focuses on hidden vs visible navigation and mobile patterns generally.[^1_51][^1_1]
- **Little formal research** on FAQ placement specifically (header vs footer); patterns come mostly from e‑commerce testing and design audits rather than targeted experiments.[^1_16][^1_7]

Where I’ve given more opinionated recommendations (moving O nas to footer; reserving a future slot for Napoje), they are anchored in general navigation and trust evidence, but not in direct studies of UNI‑like harm‑reduction directories.

______________________________________________________________________

If you’d like, we can sketch a concrete Polish‑language nav and footer copy (labels, hover states, drawer grouping) aligned with this structure, and define the exact events to implement in GA4/PostHog to validate these decisions after launch.

<span style="display:none">[^1_100][^1_101][^1_102][^1_103][^1_104][^1_105][^1_106][^1_107][^1_108][^1_109][^1_110][^1_111][^1_112][^1_113][^1_56][^1_57][^1_58][^1_59][^1_60][^1_61][^1_62][^1_63][^1_64][^1_65][^1_66][^1_67][^1_68][^1_69][^1_70][^1_71][^1_72][^1_73][^1_74][^1_75][^1_76][^1_77][^1_78][^1_79][^1_80][^1_81][^1_82][^1_83][^1_84][^1_85][^1_86][^1_87][^1_88][^1_89][^1_90][^1_91][^1_92][^1_93][^1_94][^1_95][^1_96][^1_97][^1_98][^1_99]</span>

<div align="center">⁂</div>

[^1_1]: https://www.nngroup.com/articles/hamburger-menus/

[^1_2]: https://www.brandvm.com/post/website-navigation-best-practices

[^1_3]: https://www.lumar.io/blog/best-practice/seo-tips-for-the-holiday-shopping-season-and-beyond/

[^1_4]: https://searchengineland.com/guide/seo-seasonality

[^1_5]: https://www.diva-portal.org/smash/get/diva2:1877450/FULLTEXT01.pdf

[^1_6]: https://www.alfdesigngroup.com/post/intuitive-navigation-best-practices-for-seamless-ux-design

[^1_7]: https://iacis.org/iis/2013/271_iis_2013_182-185.pdf

[^1_8]: https://www.sliderrevolution.com/design/footer-navigation-best-practices/

[^1_9]: http://www.ojcmt.net/download/a-literature-review-website-design-and-user-engagement.pdf

[^1_10]: https://www.mdpi.com/2227-9709/10/3/75/pdf?version=1695179165

[^1_11]: https://www.nngroup.com/articles/footers/

[^1_12]: https://www.elevatedmagazines.com/single-post/a-practical-guide-to-website-footers-that-help-visitors-find-their-next-step

[^1_13]: https://www.orbitmedia.com/blog/website-footer-design-best-practices/

[^1_14]: https://www.searchenginejournal.com/google-recommends-using-one-url-for-all-seasonal-content/280445/

[^1_15]: https://ahrefs.com/blog/holiday-seo/

[^1_16]: https://baymard.com/research-articles/footer-needs-return-shipping-links

[^1_17]: https://www.nngroup.com/articles/contact-us-pages/

[^1_18]: https://www.g-regs.com/downloads/POActProvisionElectronicServices.pdf

[^1_19]: https://eur-lex.europa.eu/eli/dir/2000/31/oj/eng

[^1_20]: https://czasopisma.kul.pl/index.php/recl/article/download/15478/14313

[^1_21]: https://leadsuitenow.com/blog/internal-linking-strategy-seo

[^1_22]: https://www.link-assistant.com/news/link-location-and-seo-value.html

[^1_23]: https://seosherpa.com/internal-links/

[^1_24]: https://moz.com/blog/links-headers-footers-navigation-impact-seo

[^1_25]: https://www.seroundtable.com/google-footer-sitewide-links-weight-21540.html

[^1_26]: https://unveilseo.com/blog/anatomy-good-internal-link

[^1_27]: https://www.linkedin.com/pulse/duplicate-internal-links-harmful-seo-scale-brian-wood-njubc

[^1_28]: https://www.link-assistant.com/news/internal-linking-strategies.html

[^1_29]: https://www.mdpi.com/1999-5903/11/2/32/pdf?version=1548846996

[^1_30]: https://pmc.ncbi.nlm.nih.gov/articles/PMC5365094/

[^1_31]: https://lovable.dev/guides/website-navigation-best-practices-that-convert

[^1_32]: https://www.wearetenet.com/blog/website-navigation-best-practices

[^1_33]: https://uxpajournal.org/examining-the-order-effect-of-website-navigation-menus-with-eye-tracking/

[^1_34]: https://pmc.ncbi.nlm.nih.gov/articles/PMC4974011/

[^1_35]: https://ighenatt.es/en/blog/seasonal-seo-persistent-campaign-pages/

[^1_36]: https://techseoconsultant.com/seasonal-seo/

[^1_37]: https://blog.uncommonlogic.com/internal-linking-strategies-money-pages-q4

[^1_38]: https://www.collaborada.com/blog/holiday-seo

[^1_39]: https://itsrefresh.com/blog/seasonal-ecommerce-seo

[^1_40]: https://www.columbia.edu/~mr2651/ecommerce3/2nd/statutes/ElectronicCommerceDirective.pdf

[^1_41]: https://www.eumonitor.eu/9353000/1/j4nvhdfdk3hydzq_j9vvik7m1c3gyxp/vk8ia3ffl1yh

[^1_42]: https://www.jdsupra.com/post/fileServer.aspx?fName=55919e71-4c44-4fd0-a32c-0364a9b8d592.pdf

[^1_43]: https://www.pinsentmasons.com/out-law/news/ecj-says-websites-need-phone-numbers-or-web-forms

[^1_44]: https://www.gdd.de/wp-content/uploads/2023/06/GDPR-Good-Practices-Transparency-obligations-in-data-processing.pdf

[^1_45]: https://www.cnil.fr/en/sheet-ndeg12-inform-users

[^1_46]: https://termly.io/resources/articles/eu-compliant-privacy-policy/

[^1_47]: https://gdpr-text.com/guidelines/transparency/

[^1_48]: https://digital-strategy.ec.europa.eu/en/faqs/digital-services-act-questions-and-answers

[^1_49]: https://www.termsfeed.com/blog/digital-services-act-dsa/

[^1_50]: https://eur-lex.europa.eu/eli/dir/2019/882/oj/eng

[^1_51]: https://sparkbox.com/foundry/mobile_navigation_ux_navigation_menu_design_for_content_rich_websites

[^1_52]: https://trevorcalabro.substack.com/p/primary-navigation-interaction-guide

[^1_53]: https://scandiweb.com/blog/navigation-menu-optimization-case-study/

[^1_54]: https://www.diva-portal.org/smash/get/diva2:1566833/FULLTEXT01.pdf

[^1_55]: https://www.deepinseogeo.com/seasonal-e-commerce-seo-preparing-for-peak-periods/

[^1_56]: http://thesai.org/Downloads/Volume7No4/Paper_47-User_Interface_Menu_Design_Performance_and_User_Preferences.pdf

[^1_57]: http://thesai.org/Downloads/Volume3No9/Paper_31-The_Impact_on_Effectiveness_and_User_Satisfaction_of_Menu_Positioning_on_Web_Pages.pdf

[^1_58]: https://www.scienceopen.com/document_file/0785d007-1905-4111-b479-6e54e6445d33/ScienceOpen/001_Bouzit.pdf

[^1_59]: https://online-journals.org/index.php/i-joe/article/download/17763/8391

[^1_60]: http://thesai.org/Downloads/Volume6No4/Paper_19-Menu_Positioning_on_Web_Pages_Does_it_Matter.pdf

[^1_61]: https://pmc.ncbi.nlm.nih.gov/articles/PMC4797699/

[^1_62]: https://pmc.ncbi.nlm.nih.gov/articles/PMC3957402/

[^1_63]: https://pmc.ncbi.nlm.nih.gov/articles/PMC9792669/

[^1_64]: https://medium.com/@jpholdsworth4/restaurant-menu-navigation-a-case-study-a2f71f3b88b6

[^1_65]: https://uxmovement.com/navigation/the-fastest-navigation-layout-for-a-three-level-menu/

[^1_66]: https://thesai.org/Downloads/Volume7No4/Paper_47-User_Interface_Menu_Design_Performance_and_User_Preferences.pdf

[^1_67]: https://ico.org.uk/for-organisations/advice-and-services/audits/data-protection-audit-framework/toolkits/accountability/transparency/

[^1_68]: https://iapp.org/news/a/top-10-operational-responses-to-the-gdpr-part-6-transparency-and-privacy-notices

[^1_69]: http://www.dataprotection.ie/en/individuals/know-your-rights/right-be-informed-transparency-article-13-14-gdpr

[^1_70]: https://trustyourwebsite.com/eu/en/guides/contact-form-gdpr

[^1_71]: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/individual-rights/right-to-be-informed/

[^1_72]: https://europa.eu/youreurope/business/governance-and-sustainability/digital-and-data-compliance/data-protection-gdpr/index_en.htm

[^1_73]: https://www.edpb.europa.eu/system/files_en?file=2026-04/recommendations-on-imi-transparency-obligations_en.pdf

[^1_74]: https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/obligations_en

[^1_75]: https://komentarzrodo.pl/en/home/chapter-iii/section-2/art-13/commentary-on-art-13

[^1_76]: https://cms.law/en/deu/legal-updates/transparency-and-information-obligations-under-the-gdpr

[^1_77]: https://arxiv.org/pdf/1709.02858.pdf

[^1_78]: https://downloads.hindawi.com/journals/mpe/2014/418605.pdf

[^1_79]: http://arxiv.org/pdf/0711.2867.pdf

[^1_80]: https://sierraexclusive.com/seo-multiple-links-to-same-page/

[^1_81]: https://aiformarketings.com/blog/footer-links-seo/

[^1_82]: https://yestupa.net/footer-links/

[^1_83]: https://nexklicks.com/seo-multiple-links-to-same-page/

[^1_84]: https://moz.com/community/q/topic/48709/multiple-internal-links-to-same-destinations

[^1_85]: https://www.contentpowered.com/blog/sitewide-header-footer-links/

[^1_86]: https://www.linkedin.com/posts/sugrib-dev-nath-seo-expert_evolution-google-common-activity-7376586247617642496-cIgz

[^1_87]: https://www.mdpi.com/2071-1050/13/18/10415/pdf?version=1632284023

[^1_88]: https://arxiv.org/pdf/2409.07627.pdf

[^1_89]: http://inventory.poltekatipdg.ac.id/index.php/inventory/article/download/138/67

[^1_90]: https://interoperable-europe.ec.europa.eu/sites/default/files/inline-files/DPA_Factsheets_2023_Poland_vFINAL.pdf

[^1_91]: https://ux.stackexchange.com/questions/34270/contact-us-in-navigation-bars

[^1_92]: https://eur-lex.europa.eu/legal-content/PL/TXT/PDF/?uri=CELEX:02018R1724-20250119

[^1_93]: https://www.telerik.com/blogs/dos-donts-website-footer

[^1_94]: https://digital-strategy.ec.europa.eu/en/factpages/user-rights-under-digital-services-act

[^1_95]: https://www.dns.pl/en/contact_point_for_the_DSA_matters

[^1_96]: https://interoperable-europe.ec.europa.eu/sites/default/files/inline-files/DPA_Factsheets_2021_Poland_vFinal.pdf

[^1_97]: https://digital-strategy.ec.europa.eu/en/policies/digital-services-act

[^1_98]: https://www.granthaalayahpublication.org/ijetmr-ojms/index.php/ijetmr/article/download/14_IJETMR18_A02_261/151

[^1_99]: http://arxiv.org/pdf/2411.00780.pdf

[^1_100]: https://orbis.agency/us/blog/ecommerce-seo-black-friday-cyber-monday/

[^1_101]: https://www.vizion.com/blog/holiday-seo-for-local-businesses-how-customers-will-find-you-this-season/

[^1_102]: https://www.loungelizard.com/blog/holiday-checklist-for-seo-optimization/

[^1_103]: https://www.get-ryze.ai/blog/ecommerce-internal-linking-strategy-7-patterns-that-move-rankings

[^1_104]: https://gempages.net/blogs/shopify/seasonal-landing-page

[^1_105]: https://content.sciendo.com/downloadpdf/journals/wrlae/7/2/article-p58.pdf

[^1_106]: https://journals.umcs.pl/sil/article/download/14990/pdf

[^1_107]: https://eur-lex.europa.eu/legal-content/EN-FR/TXT/?uri=CELEX:32000L0031

[^1_108]: https://eur-lex.europa.eu/legal-content/EL-EN/ALL/?uri=CELEX:32000L0031

[^1_109]: https://cms.law/en/gbr/legal-updates/the-e-commerce-directive

[^1_110]: https://www.europarl.europa.eu/RegData/etudes/note/join/2007/382178/IPOL-IMCO_NT(2007)382178_EN.pdf

[^1_111]: https://curia.europa.eu/jcms/upload/docs/application/pdf/2019-06/fiche_thematique\_-commerce_electronique_et_obligations_contractuelles\_-\_en.pdf

[^1_112]: https://www.legislation.gov.uk/uksi/2002/2013

[^1_113]: https://www.legislation.gov.uk/uksi/2002/2013/made/data.html

