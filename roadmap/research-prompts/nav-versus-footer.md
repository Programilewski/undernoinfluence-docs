---
topic: Which primary-navigation items earn their place, and which belong in the footer
raised: 2026-09-17
status: pinned — awaiting external research
context: journals/2026-09-17.md — three pages added to the nav, taking it from three items to six
---

# Research prompt — what belongs in the nav, and what belongs in the footer

*Paste the block below into a research-specialised model. Everything it needs is inside it; it does not have access to our repository.*

---

## Prompt

You are advising a solo founder on the **primary navigation** of **Under No Influence (UNI)**, a Polish-language directory of venues — bars, cafés, restaurants, pubs, hotels — catalogued by the quality of their **non-alcoholic drink offering**. Pre-launch, no public traffic yet, Warsaw first, launch targeted for late November 2026. The interface is entirely in Polish; the audience is Polish.

The product exists to help somebody find a healthier option they would otherwise have missed. It is harm reduction, not abstinence advocacy, and it takes no public position on alcohol policy. There is no paid placement: no venue can buy a position, and the navigation must never become a sales surface.

### How people will arrive

**Organic search is the main growth channel** — city, district and category landing pages, plus a venue page per venue. The second channel is Instagram, three posts a week. There is no advertising budget. So internal links matter twice: for people, and because the navigation is the strongest internal link on the site and shapes how crawlers distribute authority.

### The six items currently in the navigation

Listed in their current order, with what each page actually is. All labels are Polish.

| # | Label | Address | What it is |
|---|---|---|---|
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
