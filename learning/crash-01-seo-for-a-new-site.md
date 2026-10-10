---
description: "Crash course: how Google finds, indexes and ranks a brand-new site, and what that means for UNI's first 90 days."
version: 1.0
owner: Paweł Milewski
updated: 2026-10-10
status: teaching document — holiday series, course 1 of 6
---

# Course 1 — SEO for a brand-new site

V1 is launching early for one reason: so the SEO clock starts. This course explains what that clock actually is, what UNI already does right (it does a lot), what you control during the first 90 days and what you don't, and how to read Search Console without fooling yourself.

## 1. The three stages, and why "indexed" is not "ranked"

Google does three separate things to a page, and each can fail on its own:

1. **Discovery.** Google learns the address exists, from a link on a page it already knows, or from your sitemap. A new domain has no inbound links, so on day one the sitemap is almost the only way in.
2. **Crawling and indexing.** Googlebot fetches the page, renders it, decides whether it is worth keeping, and if so stores it in the index. "Worth keeping" is a judgement: Google does not index everything it crawls, and on a new site it is visibly reluctant.
3. **Ranking.** For each query, Google orders the indexed pages. A page can sit in the index for months and appear for nothing, because nothing about the site yet tells Google to trust it over pages that have years of links behind them.

Most first-month panic comes from confusing these. "My page isn't on Google" can mean not discovered (sitemap not read yet), discovered and not crawled (Google hasn't bothered yet), crawled and not indexed (Google decided it wasn't worth storing), or indexed and ranking on page 9 (normal for a new site). Search Console tells you which one, and the fix is different for each.

## 2. What a new domain should expect

These are rough patterns, not promises, but they're what most new sites see:

- **Days 1–7.** The sitemap is fetched. The home page and a handful of others get indexed. A few impressions appear, mostly for your own brand name ("under no influence", "uni piwo 0").
- **Weeks 2–8.** Indexing goes up in steps, not smoothly. Many pages sit in "Discovered — currently not indexed" or "Crawled — currently not indexed". That's normal on a new domain with few links: Google is spending a small *crawl budget* on you and is not yet convinced the pages are distinct and useful.
- **Months 2–6.** Long-tail queries start to produce impressions: specific, low-competition searches like "piwo bezalkoholowe mokotów", "gdzie wypić 0% warszawa", a drink name plus "warszawa". Position numbers jump around a lot. This is where UNI's programmatic pages earn their keep, because that's the shape of query they match.
- **Six months and on.** Broader queries begin to move only if the site has earned some links and the pages are visibly better than what ranks today.

The practical consequence: **don't judge any SEO decision on less than 8–12 weeks of data**, and don't change titles, URLs or page structure in the first month because "nothing's happening". Each change resets part of what Google was learning.

## 3. What UNI already does right

I read the code for this section. It's worth knowing how much of the groundwork is already in place, so you don't redo it in a panic later:

- **Empty pages are `noindex` and never in the sitemap.** `App\Support\SeoCluster` is the single rule that decides whether a city × category or district × category page holds venues. The page, the city's links and the sitemap all ask it, so Google is never sent to an empty page. Districts need 3 venues (`uni.min_venues_for_indexable_district`), and shared recipes need 3 as well. This is the single most important defence a programmatic site has (see §4).
- **Every public page has a canonical tag.** The discovery page computes its own: a single selected city points to the city's address, and filter combinations are `noindex, follow`. That's correct. The filters create endless URL variations, and none of them should compete with the real landing pages.
- **Drink and brand pages enter the sitemap only where a live venue serves them.** A shared recipe needs more than one venue (`Product::isIndexable()`).
- **Structured data (JSON-LD)** is on the home page, the venue page and the collection pages.
- **`robots.txt` is served by the application** and points at the sitemap. It blocks `/admin/`, `/panel/` and `/api/`.
- **Polish, flat, readable URLs** (`/miejsce/{slug}`, `/{city}/{district}/{category}`), decided not to need 301s on expansion.

So the technical foundation is in place. In the first 90 days, what moves results is **content per page, links into the site, and patience**.

## 4. The one real risk: "scaled content"

Since March 2024 Google has had an explicit spam policy against **scaled content abuse**: many pages generated from a template with little unique value, made mainly to rank. Programmatic city/district/category pages are exactly the shape that policy looks at. The question it asks is not "was this generated" but "does each page give the searcher something they couldn't get elsewhere".

UNI is on the right side of that line for one structural reason: **each page lists real, verified venues and drinks that differ from page to page.** A "piwo bezalkoholowe — Mokotów" page with three venues and their actual 0% beers is useful. The same template with zero or one venue, plus filler text, is the thing the policy targets. The 3-venue threshold and the noindex-when-empty rule are what keep you safe, so **never lower the threshold to get more pages indexed**. With ~30 venues at launch, most district × category combinations will (correctly) not be indexed yet. That's the design working, not a problem.

Two habits keep you on the right side:

- **The text that differs between pages has to be real.** Venue counts, drink names and districts are real differentiators. Generic paragraphs that change only the district name are not.
- **Fewer, fuller pages beat many thin ones** for a new domain. Thin pages don't just fail to rank on their own. A large share of low-value pages can lower how Google judges the whole site.

## 5. Search Console, the instrument you'll use most

Search Console (GSC) is Google telling you what it sees. It's free and it is the only source of *query* data: what people typed before they saw UNI. Analytics can't give you that.

**Setting it up (checklist A9).** Use a **Domain property**, verified with a DNS TXT record at OVH. A domain property covers http/https and every subdomain, including `admin.`, in one view. The checklist's warning is real: if somebody removes that TXT record while tidying DNS, the property silently stops being verified. Then submit `https://<domain>/sitemap.xml` under *Sitemaps*.

**The four reports that matter:**

1. **Pages (Indexing → Pages).** How many addresses are indexed, and for each one that isn't, why. The reasons you'll see, translated:
   - *Excluded by 'noindex' tag*: expected for discovery filter URLs, empty landings, `/regulamin` and the privacy policy. Check that the list contains only what you meant to exclude.
   - *Alternate page with proper canonical tag*: expected. These are filter variants pointing at their canonical.
   - *Discovered — currently not indexed*: Google knows the URL and hasn't fetched it yet. On a new site this is crawl budget, not a fault. It shrinks as the site earns trust and links.
   - *Crawled — currently not indexed*: Google fetched the page and decided not to store it. One or two is noise. If a whole page type lands here (say, every brand page), Google thinks that type is thin or duplicate. That's the signal to improve the template, not to resubmit.
   - *Not found (404)*: per the 09.10 decision, every non-live venue returns 404. The backlog's trigger for building the "honest page" is exactly this report listing `/miejsce/` addresses that are still requested.
   - *Soft 404*: a page that returns 200 but looks empty. If you ever see this for landing pages, the noindex rule has a gap.
2. **Performance → Search results.** Clicks, impressions, CTR and average position, broken down by query, page, country and device. Impressions arrive long before clicks, and in the first months they are the number to watch.
3. **URL Inspection.** Paste one address and see whether it is indexed, what canonical Google chose (which can differ from yours), and when it was last crawled. *Request indexing* is a nudge, not a command. Use it for a handful of important pages after launch, not for hundreds.
4. **Sitemaps.** Should say *Success*, with a "discovered pages" count close to what you expect. A big gap between submitted and indexed is normal in month one and worth watching by month three.

**Two warnings about reading GSC:**

- **Average position is an average over every impression**, including the ones where you appeared on page 6 for one search. A page that ranks #3 for one query and #60 for ten others shows a meaningless "position 54". Always filter to a query or a page before reading position.
- **GSC keeps 16 months of data and then drops it.** If you ever want year-over-year comparisons, export monthly (or connect it to something that stores it) before the window rolls.

**Bing Webmaster Tools** is worth the five minutes: it can import the verified property straight from GSC, and Bing's index also feeds DuckDuckGo, Ecosia and others. It's a small share in Poland, but it costs nothing to add.

## 6. What actually moves rankings for UNI

In order of what you control:

1. **More real venues, spread so districts reach their threshold.** Every district that crosses 3 live venues unlocks new indexable pages. That's the most direct SEO lever you have, and it's the same work as the Launch row.
2. **Titles and the first lines of the page.** The `<title>` is the strongest on-page signal and also the line people see in the result. Write it for the query, in natural Polish: "Piwo bezalkoholowe na Mokotowie — 7 lokali | UNI" beats a brand-first title. A number in the title tends to raise CTR. (Check what the templates generate today before changing anything. This is a read-and-judge item, not a known problem.)
3. **Internal links.** Google measures importance partly by how many internal links point at a page and from where. City pages linking to their districts, venue pages linking to their drink pages and drink pages linking back to venues: that web is what spreads the little authority a new site has. A page with no internal links pointing at it is nearly invisible, whatever the sitemap says.
4. **Links from other sites.** For a new domain, a few relevant links (a Warsaw city guide, a sober-curious community, a brand's "where to buy" page, local press) are worth more than any on-page tuning. This connects to the B2B plan: a venue or brand that links to its UNI page is giving you exactly the signal Google is waiting for. Never buy links. That *is* a spam-policy violation.
5. **Freshness, honestly earned.** Pages whose content actually changes (a drink added, a venue updated) get recrawled more often. The `Zaktualizowano` date, which only moves when someone vouched for the offer, is the honest version of this. Never fake-touch dates to look fresh.

What doesn't matter much, despite what SEO blogs say: meta keywords (ignored), `<priority>` and `<changefreq>` in the sitemap (Google says it ignores them), the exact keyword density, and the `noai` / `noimageai` meta values (non-standard; Google ignores them, so they do no harm and no good for Search).

## 7. Polish-language specifics

- **People type without diacritics.** "piwo bezalkoholowe mokotow" and "mokotów" are both common. Google handles that well, so you don't need duplicate pages or slugs. Your slugs already strip diacritics, and the visible text should keep them.
- **Case endings matter for titles.** "na Mokotowie", "w Śródmieściu", "na Pradze-Południe". A title built as `{category} {district}` with the district in the nominative reads as machine-made. Where templates generate district names in a sentence, the locative form is worth having. That's a content decision, not an SEO trick, because people trust natural Polish.
- **Query vocabulary differs from yours.** People search "piwo 0", "piwo 0%", "bezalkoholowe", "drink bez alkoholu", "mocktail", "virgin mojito". After six weeks, the Performance report's query list will tell you which words real people use. That's the data for wording the glossary and titles, rather than guessing now.

## 8. AI answers, a trade-off worth knowing precisely

The block-all-ai-crawlers record (18.06) blocks both training and citation bots, deliberately, to protect the data. It's decided, and this course isn't reopening it. But two facts are useful to have exact:

- **Google's AI Overviews are produced from the normal Search index, crawled by ordinary Googlebot.** `Google-Extended` controls use of content for Gemini training and grounding. As far as Google has documented, it does **not** keep a page out of AI Overviews in Search. So UNI's content can appear in AI Overviews regardless of the robots line, and you couldn't prevent it without leaving Google Search entirely.
- **Blocking `OAI-SearchBot` and `PerplexityBot` means UNI won't be cited** in ChatGPT search or Perplexity answers to "gdzie w Warszawie wypiję piwo 0%". The record names exactly this as its revisit trigger. Measuring it requires a referrer from those engines, which can't arrive while they're blocked, so the trigger can never fire on its own data. Something to think about, not act on.

## 9. Your first 90 days, as a checklist

- **Before the import:** GSC Domain property verified (A9), sitemap submitted, Bing imported.
- **Week 1:** URL-inspect the home page, `/mapa`, the Warsaw city page and two venue pages. Check that Google's chosen canonical equals yours on each.
- **Weekly, 10 minutes:** Pages report (did a whole page type fall into "Crawled — not indexed"?), and the 404 list.
- **Monthly:** export Performance (queries and pages) to a file; write two lines in the journal about what changed.
- **Never in the first 90 days:** change a live slug (no redirect exists yet; that's backlog fault 10), lower the indexing threshold, add filler text to thin pages, or mass-request indexing.

## Questions to bring back

1. **Title templates.** Do the landing-page titles read as natural Polish with the district in the right case, and do they lead with the query rather than the brand? I didn't audit this. Worth one read-through of every template before launch, since titles are the cheapest lever and changing them later costs a re-learning period.
2. **Slug changes have no redirect** (backlog: fault 10, "don't change a venue's slug once it's live"). Should a slug-history table with automatic 301s move from After launch into Launch (⏳)? Venue names *will* get corrected in the first weeks, and each correction today loses the page's ranking.
3. **The AI citation trigger can't fire** (§8). Is there another way you'd want to measure it, such as a short test period, or is the record's intent "never, until a deal"?
4. **Links.** Would you be comfortable asking venues and brands, in the B2B outreach, to link to their UNI page? It's the single most useful thing they could do for UNI's SEO, and it's free for them.
