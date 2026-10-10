---
description: "Crash course: reading UNI's first 12 weeks of numbers without fooling yourself — noise, the funnel already in the events, and decisions written before the data."
version: 1.0
owner: Paweł Milewski
updated: 2026-10-10
status: teaching document — holiday series, course 5 of 6
---

# Course 5 — Measuring with small numbers

For the first months after launch, every number UNI produces will be small: 14 venue views on Tuesday, 3 direction clicks this week, 40 impressions for "piwo bezalkoholowe mokotów". Small numbers move a lot for no reason, and a founder watching them daily will see trends that aren't there. This course gives you four tools: a way to tell noise from signal, the funnel UNI is already recording, a short weekly review, and the habit of writing down what would change your mind *before* you look.

## 1. How much do small numbers wobble?

Counts of independent events (visits, clicks) wobble roughly by **the square root of the count**. That one rule covers most of what you'll need:

| This week | Natural wobble (≈ √n) | A real change needs roughly (≈ 2√n) |
|---|---|---|
| 9 | ±3 | a move of 6 or more |
| 25 | ±5 | 10 or more |
| 100 | ±10 | 20 or more |
| 400 | ±20 | 40 or more |

So "venue views went from 16 to 22 this week" is **not** a change: √16 = 4, and 6 is within normal wobble. "From 16 to 40" is. That's why the important thing in month one is **not over-reacting**. Most week-to-week movement will be inside the band.

Three practical consequences:

- **Look weekly, not daily.** Daily counts are smaller, so they wobble more, and they also swing by weekday. People look for a bar on Friday, not Monday. Compare a week with the week before, or this Friday with last Friday.
- **Look at sums before ratios.** A conversion rate of "33%" from 1 of 3 is meaningless. Wait until the denominator is in the dozens before reading a rate.
- **Look at the trend over 4+ weeks.** One high week is noise until the next three weeks agree with it.

## 2. Make sure you are counting other people

Server-side events already exclude two big sources of false counts (`App\Services\EventLogger`):

- **Bots**, by user-agent patterns (`BotDetector`). An empty user agent counts as a bot too. This matters because Googlebot fetching a venue page is not demand.
- **Internal traffic** (`InternalTraffic`): anyone logged in, anyone with the `uni_no_count=1` cookie, and any configured internal IP address.

The gap to close is **you on your phone, not logged in**. At launch, your own checking will be a large share of all traffic. Set the `uni_no_count` cookie in every browser you use on every device (phone, PC, tablet), and check the internal IP list on production includes your home address if it's stable. Otherwise the first month's numbers partly measure your own nervousness.

PostHog is a separate stream, and only for visitors who consented, so **its numbers will always be lower than the `events` table's**. That's expected, not a discrepancy. Use `events` for *how many*, and PostHog for *how people move* (paths, sessions).

## 3. The funnel you already have

UNI's events already describe the journey from search to "I'm going there". Arranged as a funnel:

```
Google impressions (Search Console)            ← someone saw UNI in a result
   │
Google clicks (Search Console)
   │
Landing:  city_viewed · district_viewed · category_browsed · drink_viewed · brand_viewed · dry_january_viewed
   │
venue_viewed                                    ← a specific place considered
   │
venue_menu_viewed · venue_category_viewed       ← the offer actually read
   │
venue_directions_clicked · venue_maps_clicked · venue_website_clicked · venue_instagram_clicked
                                                ← intent to go
```

**The bottom row is closest to the mission.** A directions or maps click means a person found a non-alcoholic option and is, plausibly, on their way to order it. If you want one number that says "UNI did its job this week", it's **intent-to-go clicks** (directions + maps). It's a proxy, since nobody can see the order being placed, but it's the honest one. Raw page views measure interest. These measure use.

Two events are diagnostic gold for the product rather than the funnel:

- **`discovery_empty_results`**: a filter combination that found nothing, recorded once per distinct state. Each one is a request you couldn't serve. Grouped by category and district, they're **a seeding priority list written by your visitors**.
- **`discovery_searched`** with its `query`: the words people actually type. Low-result queries name drinks and places you don't have yet, and the vocabulary feeds the glossary and the titles (course 1, §7).

## 4. Queries worth keeping

Run these on production with the read-only habit from course 3. These are starting points: check property names against `tech/analytics.md` before relying on them.

**The weekly funnel:**

```sql
SELECT date_trunc('week', created_at)::date AS week, type, count(*)
FROM events
WHERE created_at >= now() - interval '8 weeks'
  AND type IN ('venue_viewed','venue_menu_viewed',
               'venue_directions_clicked','venue_maps_clicked','venue_website_clicked')
GROUP BY 1, 2
ORDER BY 1, 2;
```

**Where demand found nothing:**

```sql
SELECT properties, count(*)
FROM events
WHERE type = 'discovery_empty_results'
  AND created_at >= now() - interval '30 days'
GROUP BY properties
ORDER BY count(*) DESC
LIMIT 20;
```

**What people search for:**

```sql
SELECT lower(properties->>'query') AS query,
       count(*) AS times,
       round(avg((properties->>'result_count')::int), 1) AS avg_results
FROM events
WHERE type = 'discovery_searched'
  AND created_at >= now() - interval '30 days'
GROUP BY 1
ORDER BY times DESC
LIMIT 30;
```

**Which venues turn views into intent** (only once a venue has 30+ views):

```sql
SELECT venue_id,
       count(*) FILTER (WHERE type = 'venue_viewed') AS views,
       count(*) FILTER (WHERE type IN ('venue_directions_clicked','venue_maps_clicked')) AS going
FROM events
WHERE created_at >= now() - interval '30 days' AND venue_id IS NOT NULL
GROUP BY venue_id
HAVING count(*) FILTER (WHERE type = 'venue_viewed') >= 30
ORDER BY going DESC;
```

The last one is also the seed of the data-led B2B pitch ("82 people looked at your venue this month and 11 asked for directions"). It's the real version of the outreach template in the launch plan.

## 5. The 20-minute weekly review

Same day each week, written into a running file or that week's journal:

1. **Search Console:** impressions and clicks for the week; indexed page count; any new error type. (5 min)
2. **The funnel:** the five counts above vs the previous week. Mark only moves outside the 2√n band. (5 min)
3. **Empty results and searches:** the top five of each. Did any point at a venue or drink you could add? (5 min)
4. **One line:** what you think is happening, and what you'll do or not do because of it. (5 min)

The fourth line matters most. In three months you'll be able to check your own guesses against what happened, and that's how judgement about these numbers gets built.

## 6. Decide the thresholds before you see the data

The most useful habit in early-stage measurement: **write down, in advance, what result would make you do what.** Otherwise any number can be read as encouraging.

UNI already has one such rule: the city-expansion trigger (*Warsaw reaches 100+ venues, 30+ claimed, organic traffic proves model*). Two parts are countable. The third, "organic traffic proves model", isn't yet, and that's the part most vulnerable to wishful reading. Making it concrete would look like: *"12 consecutive weeks of growing organic clicks, and at least N intent-to-go clicks per week."* N is yours to pick, but pick it before the data arrives.

The same approach suits other open items in the backlog that already carry triggers:

- **The honest page for non-live venues:** trigger is Search Console's 404 report listing `/miejsce/` addresses still requested. Decide now how many make it worth building.
- **The discovery query rewrite:** 1 000 live venues. Already concrete.
- **The trial "tile brings the filtered category forward":** decide what you'll look at (e.g. venue_viewed from filtered discovery vs unfiltered) and for how long, before judging it.

## 7. Seasonality, and why December matters

Two calendar effects will dominate the first year's numbers:

- **Dry January.** `/suchy-styczen` exists for it. `tech/analytics.md` already names the point: `dry_january_viewed` in **December** tells you whether the page was indexed in time, weeks before the traffic it was built for. Put a reminder for early December to check the page in Search Console (indexed? impressions?) while there's still time to act.
- **Weekends and summer.** Venue-finding peaks on Thursday–Saturday evenings and in the outdoor-season months. A launch in autumn will see a winter dip that is the season, not the product. Compare like with like, and treat the first year as the baseline for the second.

## Questions to bring back

1. **The one number.** Do you want intent-to-go clicks (directions + maps) as UNI's headline weekly measure? If yes, it deserves a line in `business/metrics.md`, which is still an empty template.
2. **Your own devices.** Set `uni_no_count` on every browser you use before launch, and add the home IP to production's internal list? (Small, but it decides whether month one's numbers are real.)
3. **"Organic traffic proves model."** Agree a concrete version, with weeks and a number, before the data arrives?
4. **A December reminder** to check `/suchy-styczen` in Search Console, set now so it doesn't depend on memory?
