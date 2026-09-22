> **Retired 2026-09-17 and moved to `archive/`.** This was a snapshot of the 18.08 state and it aged into a misleading one: it describes the world before the map migration (01.09), the owner panel closing (16.09), the retention rebuild (16.09) and the pages built on 17.09. Its "wipe the generated venues" item is moot — production seeds cities, categories, districts and the two canaries only, so the fixtures are local. **What is not done now lives in [`../roadmap/undone-inventory.md`](../roadmap/undone-inventory.md).** Kept because its reasoning about ordering — backups before wiping, hosting before mail — is still sound and was never written down anywhere else.

---
version: 2.2
owner: Paweł Milewski
updated: 2026-08-27
status: approved
---

# Next Session — state as of 2026-08-18

> **Blocked on you, not on work:** [`decisions-waiting-on-you.md`](../roadmap/decisions-waiting-on-you.md) —
> refreshed to v3 on 30.08 against running code. Section A is the last place where waiting still
> destroys data; section B is what blocks the first sales conversation.

**464 tests passing.** The previous version of this file was from 5 May. It claimed 194 tests and
listed five tasks, four of which are done and the fifth of which contradicts
`decisions/product/browse-only-v1.md`. It was replaced in full.

Every item below was checked against running code and the database on 18.08, not copied from
another document.

> **Unread as of 2026-08-20 — read this first next session.**
> [`audit-2026-08-20.md`](../roadmap/audit-2026-08-20.md) adds nine findings from a code audit run on 20.08,
> with its own priority list, plus a session-2 addendum adding nine more (venue deletion and
> what the admin panel actually shows). Nothing in it blocks the four data and infrastructure items below,
> but **its top three concern data that cannot be recreated and should land before real venues go
> live.** The most urgent: `analytics:prune-events` hard-deletes every event older than 90 days,
> daily, with no rollup.
>
> **Corrected 2026-08-26:** it has never actually run — the scheduler has no cron entry (T-25b), so
> no history has been destroyed. The oldest event is 2026-06-17, so the first run that would delete
> anything is on or after **2026-09-15**. Fix the rollup before starting the scheduler, not after.
>
> **Closed 2026-08-30 — there is no deadline.** `../decisions/product/raw-events-are-kept-not-pruned.md`
> removed `analytics:prune-events` from the schedule entirely rather than building the rollup first.
> Raw events carry no identifier and are kept indefinitely. T-25b stands; the date does not.

> ~~**Added 2026-08-27 — one code task now does block launch.**~~ Every map rendered CARTO tiles
> stamped **"API KEY REQUIRED"**, and the same-day decision was to migrate to **MapLibre GL JS on
> OpenFreeMap vector tiles**
> ([`../decisions/product/vector-basemap-on-openfreemap.md`](../decisions/product/vector-basemap-on-openfreemap.md)).
> Full working: [`audit-2026-08-27.md`](../roadmap/audit-2026-08-27.md).
>
> **Done 2026-09-01** — self-hosted style at `public/map-styles/uni-dark.json` pointing at
> OpenFreeMap, MapLibre 5.24, no API key anywhere. **No code task blocks launch**, and the heading
> below is true again. CARTO no longer receives anything, which also settles the privacy-policy point
> that audit raised: the policy names OpenFreeMap, and naming CARTO would now be wrong.

---

## There are no code tasks left blocking V1

This is the main thing to absorb before planning anything. The public site, the admin panel and the
owner panel are complete and covered by tests. **Everything blocking launch is data, infrastructure
and decisions — not features.**

| Layer | State | Who unblocks it |
|---|---|---|
| Code | Ready — 464 tests | — |
| Data | 67 venues, all fabricated | You, by hand, ~2-3 weeks |
| Infrastructure | Does not exist: no hosting, domain, backups or mail | You, decision + execution |
| Business thesis | Untested — zero pricing conversations | You, while collecting venues |
| GDPR | Privacy policy names 1 of 4+ data recipients | You, after the hosting decision |

---

## Order of work (dependencies, not priorities)

### 1. Backups and a tested restore — **blocks everything that touches data**
There is nothing to roll back to. Until this exists, do not wipe the generated venues and do not
bulk-edit the database. Candidate already picked in `tech/dependencies.md`: `spatie/laravel-backup`
plus Backblaze B2.

### 2. Hosting, region and domain
Unblocks deployment, mail, backups and the recipient list in the privacy policy. Mail is already
decided — Scaleway TEM (`decisions/product/transactional-email-provider.md`) — what remains is
execution plus signing the processing agreement. `.env` currently has `MAIL_MAILER=log`, so claim
approval notifications go to a file, not to the owner.

### 3. Wipe the generated venues — **only after item 1**
67 venues, all `source=manual`, including four "Botanic Bars" at four different addresses. This also
clears the false badges: 14 venues show "Zarządza właściciel" with no owner behind them (there are
0 claims in the database), and 20 carry a menu-verification mark nobody ever earned.

### 4. Collect real venues, and talk pricing while you do it
The longest task, and nothing in the code blocks it. Target from `v1.md`: 50-60 Warsaw venues. The
playbook is in `decisions/adr/ADR-002 Venue Seeding.md`. Have the pricing conversations on the same
calls — one phone call, two outcomes.

### 5. Pick the visual variants and delete the losers
`UNI_HOME_SHOWCASE` and `UNI_DISCOVERY_TILE` exist so a choice can be reverted without a deploy.
Until the choice is made, each one is two code paths to maintain. **Note:** `.env` currently has
`UNI_DISCOVERY_TILE=split` — a comparison mode that makes every fifth tile on `/mapa` look
different. That is not a bug.

### 6. Fixes to land before the first real traffic
- **Geolocation** — `SetSecurityHeaders.php:29` disables `geolocation`, and the product uses it for the "nearest" sort. Check in a browser first, then set `geolocation=(self)`.
- **PostHog identity** — an anonymous visitor has three different identifiers. Fix it before traffic arrives, not after; the history cannot be reconstructed.
- **Privacy policy** — names PostHog, OpenFreeMap and Scaleway as of 08.09. **CARTO is gone** (maps moved to OpenFreeMap on 01.09) and **Bunny Fonts is gone** (fonts self-hosted from `public/fonts/poppins`, see `resources/css/fonts.css`), so neither should be added. The only recipient still missing is **the host, once chosen** — which makes this a one-line edit after the hosting decision, not the open GDPR gap it is still described as elsewhere.
- **Fonts** — five families downloaded, one used. This hits LCP, which hits SEO directly.

### 7. Walk one real owner through the entire path
From the phone call to their first menu edit. The path was repaired on 16.08, but nobody has walked
it yet.

---

## Deliberately deferred from the 18.08 session

Three changes agreed in direction and consciously not implemented that day. Each is small; none
blocks anything above.

| # | Change | Where | Why |
|---|---|---|---|
| O-1 | Stale colour from red to neutral grey | `config/uni.php` → `freshness_colors.stale` | The update date on the tile already carries the whole message. Red adds a judgement nobody can act on in V1 — you are the only person updating menus, so a red badge is a report on your own backlog. The "Sprawdzona karta" badge already expires on the same fact, so the venue is punished twice for one thing. **Do not remove the `stale` key from the config** — `VenuePresenter::freshnessColor()` then returns `null` and the entire pill disappears, taking the date with it. |
| O-2 | Owner panel switch in config | `config/uni.php` + middleware in `OwnerPanelProvider` | The panel should be built and working but not exposed. Nothing links to `/panel` today — the only "exposure" is a login form at a known URL. Default on, `UNI_OWNER_PANEL=false` turns it off. **Requires an amendment to `decisions/product/admin-recorded-claims-v1.md`**, which explicitly states the panel stays live in V1 — otherwise the contradiction closed on 16.08 comes back. |
| O-3 | "Prowadzisz ten lokal?" on the venue page | `resources/views/venues/show.blade.php` | `o-nas` and `jak-to-dziala` have that link, the venue page does not — and the venue page is where an owner lands from Google searching for their own place. A `mailto:` with the venue name in the subject, plus an `owner_cta_clicked` event. A form writing to a leads table would mean a new table, a new public endpoint, a data-map entry and a privacy-policy change, in a V1 whose entire GDPR posture rests on collecting no personal data. The form waits for V2, when the click count justifies it. |

---

## What is not here, and why

- **Public user registration** — the previous version of this file listed it as task "PR-2a". It contradicts `decisions/product/browse-only-v1.md`. Do not build it in V1.
- **SEO pages (formerly P7)** — done, the cluster has been live since 14.08.
- **Daily `offer_updated_at` check (formerly P8)** — done, `routes/console.php:7`. Hourly until 24.08; see the D-13 amendment in `../decisions/v1-locked.md`.
- **`venue_visits` table** — the migration has existed since June.
- **Queues** — notifications implement `ShouldQueue`, worker config is in `supervisor/uni-worker.conf`.
