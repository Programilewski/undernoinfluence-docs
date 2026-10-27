# No brand names on any public drink label

**Date:** 2026-10-19
**Status:** Decided — confirmed 26.10
**Executed:** 2026-10-27 — only a shared recipe's name is public (`Product::isNamedPublicly()`); branded products show as their style; `/marka` and branded `/napoj` pages removed (404); sitemap, structured data, discovery tiles, the "Nowe w karcie" strip and the homepage demo follow; site search matches recipes and styles, never a brand or its spellings. One test renders every public surface with a fixture brand and asserts the name appears nowhere
**Area:** Brand | Venues

---

## Problem

The alcohol-advertising bill the Sejm passed on 08.10.2026 makes it enforceable to punish promoting a 0.0 product that carries an alcoholic drink's name or trademark. The ban on that kind of indirect advertising already exists; what the bill adds is the penalty that prosecutors said was missing. Most of the non-alcoholic beer UNI lists is sold under an alcohol brand (Lech Free alone is over a quarter of the market). Product names contain the brand ("Lech Free", "Freixenet 0.0%"), so hiding a brand chip isn't enough: the drink's own name is the exposure.

## Options considered

Keep showing every brand and rely on being a neutral, unpaid directory (the 07.09 position). A brand-safe switch, built now and left off until a lawyer answers (the 18.10 briefing's §3 A). Strip only the brands that share a name with an alcoholic drink, with a flag on each brand. Strip every brand, alcoholic-line or not.

## Decision

**No product of any brand is named on a public page.** Decided 19.10 in a claude.ai chat, confirmed 26.10. Stripping only the brands that share an alcohol name would need almost the same code, plus a promise to keep checking: a non-alcoholic-only brand can start an alcoholic line, and a missed check fails by showing a name that has become risky. Stripping all brands needs no flag, no classification and no monitoring. Occam's razor: the simplest rule that holds whatever a brand does next. The cost is detail on the menu, not search traffic: the brand searches that mattered were for beer brands, which share an alcohol name and would be stripped under either rule.

**KCPU's answer, 27.10 (their reference DP.44.237.2026):** naming a 0.0 drink sold under an alcohol trademark is advertising, in their reading of the law as it stands today, not of the bill. The decision therefore holds whatever the Senate or the President does with the amendment. See [[decisions/product/no-paid-legal-opinion-in-v1]].

## Rules

Public means every page and everything that leaves the site: venue pages, `/marka` and `/napoj`, page titles, descriptions, structured data, the sitemap, share cards, search results and social posts. A branded product appears as its category, described by its style (see [[decisions/product/menu-lines-describe-style-not-brand]]). Shared recipes and house drinks have no brand and keep their names. The admin and owner panels keep full names, because a closed audience isn't public. Producers stay internal as before. A stripped page is removed, never just marked `noindex`. Social content leads with a category, the map or a count, never a product.

## What this prevents

Being the test case under the new penalty, at a fine UNI can't pay, for traffic UNI doesn't need. It also prevents a classification that rots: a "safe brand" list nobody rechecks is worse than no list. And it prevents brand names being indexed at launch and lingering in Google after the law starts, since pages Google has indexed tend to stick and adding names later is the easy direction.

## Revisit when

The stay metric measured after launch falls below the threshold (to be defined before launch, e.g. venue page → directions click and a return within 30 days), or KCPU answers that naming brands without an alcoholic line is fine. Reopening brings back names only for brands that make no alcoholic drink, each with a date it was last checked, hidden automatically once that check is over 12 months old. Brands that share an alcohol name stay stripped.

---

*See also: [[decisions/product/brand-and-product-pages]] (superseded in part by this) · [[decisions/product/menu-lines-describe-style-not-brand]] · [[decisions/product/no-paid-legal-opinion-in-v1]] · [[decisions/product/producers-stay-internal]] · [[decisions/product/mission-is-the-healthy-choice]] · [[briefings/commute-2026-10-18]]*
