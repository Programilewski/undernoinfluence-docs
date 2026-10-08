---
description: "Result: how a venue's \"Zaktualizowano\" should move when one item is confirmed — precedents (OpenStreetMap check_date, HappyCow, Google, freshness-UX notes) and the recommendation: the venue's date is its oldest confirmed item, plus an explicit whole-menu confirm."
---

# One click refreshes the whole venue: what to do about it

Written 08.10.2026, at Paweł's request, after "Zaktualizowano" was defined as the day someone vouched for the offer in the panel (the updated-means-vouched-for record).

## The problem

Every venue has one date, the one behind "Zaktualizowano X dni temu" and behind whether it counts as fresh (90 days). Today **any single action moves it to today**: the admin adding or confirming one drink, an owner clicking "Nadal w ofercie" on one item, or editing one house drink. A venue with 30 drinks, 29 of them unconfirmed since spring, reads "Zaktualizowano dziś" because one was clicked. The date says the whole menu was vouched for; only one item was.

It matters once owners can click (V2, behind the switch): one click a quarter keeps a venue looking fresh forever, which is the badge version of what the one-ordering record closed for ranking ("no click buys position"). With admin-only data it is harmless, because the admin checks whole menus.

## What others do

| Where | What the date means | Lesson |
|---|---|---|
| **OpenStreetMap, `check_date`** | The date of the latest review of the data. Mappers disagree whether it means *everything* was checked or only that the place *exists*, and have proposed separate keys (`check_date:existence`, `check_date:opening_hours`, `check_date:poi`) so a partial check is not read as a full one. StreetComplete asks "Is this still here?" and writes today's date only when the answer is yes and nothing else changed | **A date must say what was checked.** A partial check stamped as a full one is exactly the ambiguity OSM is still untangling |
| **HappyCow** | "Last update on [date] by [user]": the date of the last *edit*, of any kind. Users report wrong hours on recently "updated" listings and are told to check the venue's own pages | **"Last edit" is the weak pattern**, the one UNI has today: it reads as a check and isn't one |
| **Google Maps** | Hours judged stale from when the profile was last updated *combined with* other signals (similar shops nearby, Popular Times, Street View, phone calls) | A single edit date is not trusted on its own |
| **Freshness UX notes** (US digital standards research, HDX, Palantir, a Power BI answer) | No user research compares per-item and per-page labels directly. Common practice: a page-level "last verified" for context, per-item markers where people choose between items; a timestamp of *processing* says nothing about the freshness of the *data* | Per-item dates belong where somebody chooses a drink (UNI already shows "Potwierdzone X dni temu" per drink on drink pages); the venue date must not overstate them |

## Options

1. **Keep it** (any action moves the venue to today). Cheapest; overstates; gameable by owners.
2. **An explicit whole-menu confirmation.** A "Cała karta aktualna" button confirms every item at once and is the only thing that moves the venue's date; single-item confirms move only that item. Honest about intent, but one click still vouches for 30 items, and a venue that confirms items one by one never moves.
3. **The venue's date is its oldest confirmed item.** No extra button needed: the venue is as fresh as its least recently vouched-for drink. Confirming one item moves the venue only if that item was the oldest; confirming all (one by one or at once) moves it fully; removing a dropped drink stops it holding the date back.
4. **A share** (e.g. the date by which 80% of items were confirmed). Tolerant of one forgotten item, but a number nobody can explain to an owner or a visitor.

## Recommendation: 3, with 2's button as the convenience

**"Zaktualizowano" is the oldest confirmation among the venue's current drinks**, and the owner (and admin) gets a **"Wszystko nadal w ofercie"** action that confirms every item at once, which an owner who knows nothing changed will use.

- **It is exactly the vouching definition, applied to the whole menu:** the venue was updated on the day by which *everything* on it had been vouched for.
- **No click can buy freshness:** one item confirmed moves nothing unless it was the oldest. The whole-menu button is a deliberate claim about the whole menu, recorded per item, so it can be audited.
- **It tells the owner what to do:** the owner panel can show "Najstarsze potwierdzenie: Crodino, 84 dni" so the item holding the date back is obvious, which beats an opaque percentage.
- **The import fits it:** a menus file confirms the lines it contains; drinks on the venue that the file did not list keep their old date and hold the venue back until they are confirmed or removed. That is true: the file did not vouch for them.
- **Ranking fits it:** the one-ordering record wants confirmation rewarded as a state within the freshness window, not as recency; a whole-menu date is that state.

**What it costs:** the venue's date becomes derived from its items instead of written by each action (`markOfferFresh()` callers recompute it), the hourly drift step and the freshness streak follow the same derivation, and house drinks count with their own date. One owner-panel action and one line of owner copy. Before the owner switch, as the backlog row says.

**Open for Paweł:**
1. Option 3 (oldest item) or option 2 (explicit whole-menu button only)?
2. Should a newly *added* drink count as vouched for today? (Recommended yes: it was just seen.) It never makes the older items fresher under option 3.
3. Does a removed drink's removal count as looking at the menu? (Under option 3 it simply stops holding the date back; nothing else needed.)

## Sources

- [OSM Wiki: Key:check_date](https://wiki.openstreetmap.org/wiki/Key:check_date) · [Key:check_date:poi](https://wiki.openstreetmap.org/wiki/Key:check_date:poi) · [OSM Community: Should StreetComplete expand its use of check_date?](https://community.openstreetmap.org/t/should-streetcomplete-expand-its-use-of-check-date/143591/) · [Tagging list: Meaning of check_date (2021)](https://lists.openstreetmap.org/pipermail/tagging/2021-August/062171.html)
- [HappyCow listing example with "Last update … by"](https://www.happycow.net/reviews/farmers-market-thousand-oaks-5921) · [HappyCow listing marked closed](https://www.happycow.net/reviews/jalsa-leicester-17635)
- [Google Maps keeps business information up to date with AI (MapsPeople)](https://blog.mapspeople.com/google-maps-keeps-your-business-information-up-to-date-with-ai)
- [US digital standards: content timeliness indicator research](https://standards.digital.gov/standards/content-timeliness-indicator-research) · [HDX: Data Freshness in the UI](https://humanitarian.atlassian.net/wiki/spaces/HDX/pages/82509825/Data+Freshness+in+the+UI) · [Palantir Workshop: Data Freshness widget](https://palantir.com/docs/foundry/workshop/widgets-data-freshness/)

*See also: [[decisions/product/updated-means-vouched-for]] · [[decisions/product/one-ordering-for-every-venue-list]] · [[decisions/product/badges-are-rules-over-recorded-evidence]]*
