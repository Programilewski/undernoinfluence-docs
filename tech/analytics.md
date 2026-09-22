---
version: 1.1
owner: Paweł Milewski
updated: 2026-08-18
status: approved
---

# Analytics

> Gather from day one. Historical data is irreplaceable.

## Principles

- Track decisions, not vanity data.
- Prefer aggregated metrics where event-level data is not needed.
- Keep event names stable and documented.
- Review analytics against [`../compliance/ropa.md`](../compliance/ropa.md) and
  [`../compliance/privacy-notice.md`](../compliance/privacy-notice.md).

## Architecture decision

Build our own event capture in Laravel, not dependent on any third-party analytics vendor.
PostHog Cloud is optional, for internal funnel analysis only — never infrastructure that B2B
revenue depends on.

See [[decisions/adr/ADR-003 Analytics Architecture]] for the full rationale.

## Implementation

Server-side event logging in Laravel. The model is **`AnalyticsEvent`** (table: `events`) —
corrected 2026-08-18; there is no `Event` model.

**Corrected 2026-08-24.** The sample below previously showed `user_id`, `session_id`,
`ip_hash` and `referrer` being written, and listed them in the schema. None of that has been
true since 22 June, and writing them again is forbidden — see
[[decisions/product/eventlogger-identifier-stripping]] and
[[decisions/product/pii-columns-dropped]]. Every write goes through `EventLogger::log()`,
which is the single enforcement point for that rule.

```php
app(EventLogger::class)->log(
    'venue_viewed',            // snake_case, not dot-notation
    $venue->id,                // nullable
    $venue->city_id,           // nullable
    ['filter' => 'piwo', 'result_count' => 22],
);
```

Events table schema, in full: `id`, `type` (varchar), `venue_id`, `city_id`,
`properties` (JSONB), `created_at`. Six columns, no identifiers of any kind — which is what
puts this table outside GDPR's scope rather than merely low-risk. There is no `product_id`
column and never was.

Dedicated FK columns (not JSONB blobs) for venue and city — this is intentional. It makes
aggregation queries for B2B analytics fast without JSON parsing.

Writes are synchronous. The `defer()` claim that stood here was never true; if event writing
ever shows up in response times, that is the change to make, and it needs measuring first.

## Events currently firing

**Corrected 2026-08-18.** Event names are snake_case, not the dot-notation this table used to list.
Counts are from the development database, so they measure your own clicking, not demand.

**Completed 2026-09-17.** `city_viewed` and `district_viewed` have been firing since the SEO cluster
shipped and were never listed here; `dry_january_viewed`, `drink_viewed` and `brand_viewed` were added
with `/suchy-styczen`, `/napoj/{slug}` and `/marka/{slug}` the same day. The last two are the ones that
answer whether the catalogue is a door: they count arrivals at a drink rather than at a venue.
The seasonal one is the number that matters in December — it is how we find out whether the page was
indexed in time, weeks before the traffic it was built for arrives.

| Event type | When | Key properties |
|---|---|---|
| `venue_viewed` | Venue profile loaded | venue_id, city_id |
| `venue_menu_viewed` | Menu section opened | venue_id |
| `venue_category_viewed` | A category accordion opened | venue_id, category |
| `venue_directions_clicked` | "Nawiguj" tapped | venue_id, venue_name, venue_slug |
| `venue_website_clicked`, `venue_instagram_clicked`, `venue_maps_clicked` | Outbound link tapped | venue_id, type |
| `discovery_searched` | A search is **committed** — typing settles for 1s, or Enter | query, result_count |
| `discovery_category_filtered` | Category filter changed | categories, result_count |
| `discovery_empty_results` | A filter state returns nothing, **once per distinct filter state** | full filter state |
| `discovery_sort_changed` | Sort changed | sort |
| `category_browsed` | Category landing page loaded | category |
| `city_viewed` | City overview page loaded | city_slug, venue_count |
| `district_viewed` | District page loaded | city_slug, district_slug, venue_count |
| `dry_january_viewed` | `/suchy-styczen` loaded | venue_count |
| `drink_viewed` | A drink page loaded | product_slug, venue_count |
| `brand_viewed` | A brand page loaded | brand_slug, venue_count |
| `user_logged_in` | Panel login | user_id |

**Corrected 2026-08-30.** `discovery_searched` used to fire on every debounced keystroke of the
live-bound `search` property, so one search recorded a row per prefix — `piw`, `piwo bez`,
`piwo bezalkoholowe` — and the shortest, least meaningful string won any "top searches" ranking.
`discovery_empty_results` fired on *every* render with zero results, including scrolling and map
pans, so the zero-results signal counted renders rather than dead ends. Both now fire once per
user intent: search on a settle/Enter commit (`DiscoveryPage::commitSearch()`), empty results
de-duplicated on `Filters::fingerprint()`. See
[[decisions/product/analytics-fires-on-intent-not-on-keystroke]].

Browser-only events (captured through `resources/js/discovery.js`, never written to `events`):
`filter_applied` (filter_type, filter_value), `venue_navigate_clicked`, card impressions,
`map_area_searched`. **Known defect carried since 14.08:** an anonymous visitor has three different
identities across the server layer, the frontend and PostHog, which breaks funnel reading. Fix it
before real traffic arrives — the history cannot be reconstructed afterwards.

## Planned events (not yet firing)

| Event | Data | Feeds |
|---|---|---|
| Product viewed | product_id, category, venue_id | Premium category interest |
| Flag submitted | product, venue, user activity score | Free flags, internal abuse detection |
| Dashboard login | owner_id, duration | Internal retention |
| Product added | product, category, photo yes/no | Free products listed |
| Product reconfirmed | product, decay %, nudge-to-action time | Free freshness, internal tuning |
| Product expired | product, venue | Free freshness, internal quality |

## Free text in events — and how it may be described

`properties->query` is the only free-text field written to `events`, and the only place a
visitor can put contact details into an otherwise anonymous table. `FreeTextScrubber`
redacts e-mail addresses and 9-or-more-digit runs, and caps the stored value at 100
characters, before `EventLogger` writes the row.

**Wording rule — this matters more than the filter.** The scrubber matches *shapes, not
meaning*. An address or a phone number is caught; a person's name typed into the search box
is not, and cannot be. Public and sales copy must therefore say:

> we filter contact details out of stored search terms

and must **never** say "search terms contain no personal data" or anything equivalent. The
first sentence is true and defensible; the second is a claim the code does not support, and
it would be found false by the first person who types a name into the search box. Applies
to the privacy policy, the methodology section of any producer deliverable, and any owner-
facing explanation of what we hold.

**Return visits are not on this list and will not be.** Computing a return rate requires holding
something that recognises the same visitor twice, and
[[decisions/product/no-identifier-based-deduplication]] rules out every form of that — rotating
hash, fingerprint and session key alike. The row was removed on 31.08 along with the matching
Tier 3 promise in [[business/model]]; it must not be reintroduced as a planned event without
superseding that decision first.

## Analytics entitlement modules

Owner analytics reports are built as reusable modules. Plans package modules, but a plan is not
the only way a module becomes available.

- `VenuePlan` defines the default bundle of analytics features.
- `VenueFeature` defines each individual report or capability.
- `venue_feature_flags` can manually enable or disable a specific feature for one venue.
- `$venue->hasFeature(VenueFeature::...)` is the access check that presentation code and business
  logic should use.

| Trigger | Meaning | Status |
|---|---|---|
| Plan subscription | Venue gets every feature in its plan bundle | Planned, gated on payment integration |
| Manual admin override | Admin grants or removes one module for a venue | Built, via feature flags |
| Beta / partner / comp | Admin grants a module for testing or relationship reasons | Built, via feature flag reasons |
| Trial | Temporary access to a module or bundle | Possible via `enabled_until` |
| One-off add-on | Payment unlocks one module without changing plan | Future |

**Design rule:** analytics UI asks whether the feature is entitled, never whether the plan name
matches. Plan names are for packaging, labels, and upgrade prompts. Feature modules are for
runtime access and QA.

## Events by tier

See [[business/model]] for what each tier exposes to whom.

## Web traffic analytics

Umami (self-hosted, status: planned) for the public-facing website. Cookieless, GDPR clean,
lightweight. Covers SEO page performance, referral sources, device split.

## GDPR Approach

- No Google Analytics, no Meta Pixel, no third-party trackers
- All in-app events are first-party server-side logs
- IP addresses stored as `sha256(ip)` — not raw IPs. GDPR-compliant pseudonymisation.
- Legal basis: legitimate interest for anonymized/pseudonymized product analytics
- Privacy policy must disclose what is collected, why, and the retention period
- Flagging behaviour tied to accounts is personal data, covered in the privacy policy
- No precise per-user location history — city/district level only
- No demographics collected, no cross-app tracking

Open: retention period per event type, and consent-withdrawal mechanics.

## The zero problem

Track every search that returns zero results and keep a dashboard of zeroes. These show where
users bounce, so venue recruitment can be prioritised in those areas and categories before
scaling marketing. Event: `search.no.results` — planned, not yet firing.

## Future tooling

Metabase (self-hosted) for owner-facing premium dashboards when the B2B tier launches. Sits on
top of PostgreSQL, no custom frontend needed per chart.

## Related

- Business metric definitions: [`../business/metrics.md`](../business/metrics.md)
- [`architecture.md`](architecture.md) · [`../compliance/data-map.md`](../compliance/data-map.md) · [`../compliance/ropa.md`](../compliance/ropa.md)
