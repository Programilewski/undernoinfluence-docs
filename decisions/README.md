# Decisions Log

Decision records for UNI, split into two tracks:

- **`adr/`** — Architectural Decision Records: technical and structural choices, numbered sequentially
- **`product/`** — Product decisions: venue logic, scoring, UI behaviour, category rules; descriptively named

## Record header

Every record opens with `**Date:**`, `**Status:**`, `**Executed:**` and `**Area:**`; ADR-001 to ADR-008 predate that header and carry the `**Executed:**` line under their Status heading. **Status** says what was decided; **Executed** says whether it has happened, because the two age independently and a record cannot otherwise tell "decided and not done" from "decided and done". Adopted 2026-09-14, and back-filled into every record the same day after checking each one against the code.

`**Executed:**` takes one of these forms:

- a date, or `yes — verified in the code <date>` — done. **A file or behaviour in the tree that contradicts a record marked done is a regression to investigate.**
- `no` — decided and not done. **The record is a task.**
- `partly — <what is missing>` — the missing part is the task.
- `standing rule` — nothing to execute once; the record constrains future work.
- `superseded — <by what>` or `not applicable in V1 — <why>`.

When the work lands, the line changes in the same commit as the code.

## Superseded — the rule that costs the most when it lapses

**A decision revised anywhere is amended in its own record, in the same commit that revises it.** A revision recorded only in a journal, a checklist or a roadmap document does not count, however clearly it is written there.

When a record is overridden, it gains a line directly under `**Executed:**`:

```
**Superseded:** 2026-08-18 by <what and where> — <one line on what changed>
```

The superseding decision links back, so the pair can be read in either direction.

**Why this exists.** Between 16.08 and 30.08 the owner panel acquired three positions — a record saying it stays live, a journal saying it is built but not exposed, and a checklist item saying it stays live after all. None of the three marked the others superseded. On 16.09 the oldest was read as current, and a security recommendation was built on it that would have locked every venue owner out of `/panel`. Four days earlier the same pattern produced a question raised as open that `repository-migration.md` had answered on 31.08, naming the two files it concerned.

Both cost a session. The failure is never the revision — it is that the original record stays silent about having been revised, and the original is what the next reader finds. **A record that has been overridden and does not say so is worse than no record**, because it is read with the confidence a record earns.

Adopted 2026-09-16.

## ADRs — Architecture

| ID | Decision | Status |
|---|---|---|
| ADR-001 | [[decisions/adr/ADR-001 Venue Name Column]] | Decided: plain string for V1 |
| ADR-002 | [[decisions/adr/ADR-002 Venue Seeding]] | Decided: CEIDG + manual enrichment |
| ADR-003 | [[decisions/adr/ADR-003 Analytics Architecture]] | Decided: own event capture + optional PostHog |
| ADR-004 | [[decisions/adr/ADR-004 Scoring Simplification]] | Decided: binary checkmark, no tiers |
| ADR-005 | [[decisions/adr/ADR-005 Layout Architecture]] | Decided: 60/40 desktop, FAB toggle mobile |
| ADR-006 | [[decisions/adr/ADR-006 No Reviews V1]] | Decided: flagging only, no reviews |
| ADR-007 | [[decisions/adr/ADR-007 No Social Media]] | **Superseded 10.09 / 18.09:** faceless brand accounts on Instagram and TikTok; the face-and-lifestyle ban lives in faceless-brand |
| ADR-008 | [[decisions/adr/ADR-008 Categories Over Weights]] | Decided: 6 flat categories, no scoring multipliers |
| ADR-009 | [[decisions/adr/ADR-009 AI Scraping Protection]] | Decided: 4-layer protection, implemented |
| ADR-010 | [[decisions/adr/ADR-010-migration-squash]] | Decided: one migration per table, 27 files; **revisited 12.09** — schema dump deleted, five later migrations folded in, test guards it |
| ADR-011 | [[decisions/adr/ADR-011-reserved-top-level-paths]] | Decided: static top-level paths reserved; a city slug may not take one, guarded at the model and by a test that walks the router |

## Product Decisions

| File | Decision | Status |
|---|---|---|
| [[decisions/product/menu-spellings-are-confirmed-not-guessed]] | Menus import as written; a row attaches only on a confirmed spelling or a unique exact name; strength claims ("0,0", "free") are never stripped | Decided, executed 14.09 |
| [[decisions/product/sessions-hold-no-ip-address]] | Production sessions in files, so no visitor IP address or browser string is stored; the policy describes the configured driver | Decided, executed 14.09 |
| [[decisions/product/actions-own-their-side-effects]] | An action does everything its operation owes — the change, the audit record and the e-mail after commit; the button that calls it only reports the result | Decided, executed 13.09 |
| [[decisions/product/catalogue-links-change-through-one-path]] | Every path that links or unlinks a catalogue product calls the same follow-up (freshness, offer history, score, live state); the hourly check repairs changes made where no code runs | Decided, executed 13.09 |
| [[decisions/product/tests-go-through-the-framework-not-around-it]] | Code a framework drives — imports, jobs, panel buttons — is tested through the framework's own entry point with realistic input, not a hand-written imitation | Decided, executed 13.09 |
| [[decisions/product/the-first-admin-is-made-at-the-console]] | The first production admin is created by a console command over SSH; the password is only ever typed at a prompt; existing accounts are promoted only on an explicit yes, with an audit record | Decided, executed 12.09 |
| [[decisions/product/the-map-library-stays-patched]] | Security fixes for the map library are taken across a major version and the extra first-visit weight is paid; map-library changes are checked against a built bundle | Decided, executed 12.09 |
| [[decisions/product/panel-scripts-load-with-the-page]] | A panel widget has one root element and loads no assets itself; its script is attached to the page that shows it | Decided, executed 12.09 |
| [[decisions/product/geocoding-comes-from-the-state-register]] | Coordinates from GUGiK's address register; importer no longer requires them; a venue without a point cannot go live | Decided, executed 12.09 |
| [[decisions/product/the-scheduler-reports-that-it-ran]] | A heartbeat every five minutes and a dashboard that says how long ago, because a broken crontab is silent | Decided, executed 12.09 |
| [[decisions/product/mocked-integrations-need-a-live-check]] | Integrations whose failure is invisible get a deliberately-run live check, at phone width where a browser is involved | Decided, executed 12.09 |
| [[decisions/product/venue-type-filtering]] | Absolute scoring + venue type filter | Decided |
| [[decisions/product/kebab-rule]] | Venue eligibility requires named menu item | Decided |
| [[decisions/product/silent-flag-weighting]] | New user flags silently zero-weighted, no visible gating | Decided |
| [[decisions/product/show-only-present]] | Render only present categories, never grey out absent ones | Decided |
| [[decisions/product/no-batch-confirm]] | Item-by-item reconfirmation only, no "confirm all" | Decided |
| [[decisions/product/credibility-formula-opacity]] | Inputs disclosed to owners, weights and threshold kept secret | Decided |
| [[decisions/product/popularity-excluded-from-credibility]] | View counts and clicks excluded from credibility score | Decided |
| [[decisions/product/custom-drink-photo-gate]] | Photo required for every custom drink listing | Superseded for V1 |
| [[decisions/product/no-pay-to-rank]] | No promoted placement, paid badges, or bought rankings | Decided |
| [[decisions/product/venue-lists-are-never-sold-as-leads]] | Producer revenue is aggregates only; venue lists are never sold as leads | Decided |
| [[decisions/product/retention-follows-identifiers]] | Retention only where rows identify a person; anonymous tables kept indefinitely | Decided |
| [[decisions/product/search-terms-are-scrubbed-not-rejected]] | Contact details redacted from stored search terms at write time | Decided |
| [[decisions/product/thin-district-pages-are-noindexed]] | District page needs three active venues to be indexable | Decided |
| [[decisions/product/country-names-come-from-icu]] | Country names resolved through ICU in the app locale, not a hardcoded list | Decided |
| [[decisions/product/server-side-get-filtering]] | All filters submit as GET params for shareable, indexable URLs | Decided |
| [[decisions/product/mission-is-the-healthy-choice]] | **Foundational.** The mission is the healthy choice; venues, brands and products are instruments | Decided |
| [[decisions/product/price-is-not-tracked]] | Prices not recorded — unmaintainable, and a stale price discredits the freshness claim | Decided |
| [[decisions/product/catalogue-excludes-actual-alcohol]] | Only genuinely non-alcoholic drinks — nothing above 0,5% ABV, ever | Decided |
| [[decisions/product/what-belongs-in-the-catalogue]] | Three tests — the place, the offer, the drink — all required | Decided |
| [[decisions/product/admin-access-is-three-layers]] | nginx allowlist, then TOTP, then a per-account counter — and `/panel` behind none of them | Decided |
| [[decisions/product/venue-types-track-capacity-not-cuisine]] | Six types, chosen for NoLo capacity; no default | Decided |
| [[decisions/product/fixtures-are-not-evidence]] | A state only a factory can produce is a factory bug | Standing rule |
| [[decisions/product/nothing-false-is-published-to-a-visitor]] | No invented data where a visitor can reach it; bait lives at the honeypot | Decided |
| [[decisions/product/personal-data-expires-rows-do-not]] | Retention is anonymisation, not deletion | Decided |
| [[decisions/product/one-ingestion-path-for-menu-data]] | A new source is a new caller of the resolver, never a new resolver | Decided |
| [[decisions/product/what-the-badges-claim]] | Every tile badge, its exact condition, and the claim it makes | Decided |
| [[decisions/product/staging-is-seeded-never-copied]] | Staging is seeded; a production dump never lands on it | Decided |
| [[decisions/product/the-alarm-rings-from-outside-the-building]] | An outside dead man's switch, because silence survives the server | Decided |
| [[decisions/product/catalogue-lists-every-category]] | Every non-alcoholic category is listed; imagery unrestricted; supersedes the 04.09 exclusions | Decided |
| [[decisions/product/legal-analysis-stays-out-of-the-repo]] | Alcohol-law analysis removed from the repo, context and memory; GDPR material kept | Decided |
| [[decisions/product/producers-stay-internal]] | Producers stored and used internally, rendered on no public page | Decided |
| [[decisions/product/ranking-is-never-for-sale]] | Position, inclusion and filters are never purchasable | Decided |
| [[decisions/product/internal-traffic-is-not-counted]] | Admin and owner sessions dropped at the analytics write | Superseded by [[decisions/product/internal-traffic-is-excluded-at-the-write]]; built, `app/Services/Analytics/InternalTraffic.php` |
| [[decisions/product/credibility-score-was-removed]] | The composite score is gone; two 22.04 records superseded | Decided |
| [[decisions/product/faceless-brand]] | No personal branding; platform is the authority | Decided; **platform ban lifted 10.09/18.09** — no face, no personal or lifestyle content, on any platform |
| [[decisions/product/analytics-three-tiers]] | Strict split: internal / free owner / paid premium analytics | Decided |
| [[decisions/product/email-verification-enforcement]] | B2B must verify email before claim submission and /panel access | Superseded for V1 |
| [[decisions/product/email-verification-ux-flow]] | Send verification email on registration; no redirect; prompt contextually | Superseded for V1 |
| [[decisions/product/admin-bar-navigation-sugar]] | Admin bar deep-links into Filament; no inline editing on public pages | Decided |
| [[decisions/product/inline-venue-map-data]] | Keep venue map data inlined in HTML; no async API endpoint | Decided |
| [[decisions/product/osm-dropped]] | OSM dropped as data source (ODbL); manual curation only | Decided |
| [[decisions/product/abv-trust-model]] | ABV trust tiers: verified_zero / under_0.5 / unknown + strict-zero filter | Decided |
| [[decisions/product/venue-url-structure]] | Flat /miejsce/{slug}, no city prefix, no locale prefix | Decided |
| [[decisions/product/no-venue-photos-v1]] | No venue or drink photos in V1 | Decided |
| [[decisions/product/no-opening-hours-v1]] | No opening hours; link to Google Maps instead | Decided |
| [[decisions/product/venue-activation-gate]] | A venue is live only with a map point and something on its menu — a catalogue product or a house drink; it goes offline when emptied, and a CSV cannot switch it on (amended 13.09) | Decided, executed 13.09 |
| [[decisions/product/category-taxonomy]] | Drinki 0% merge, -bezalkoholowe SEO slugs, (Nie)mocne hidden | Decided |
| [[decisions/product/gap-report-in-basic]] | Gap report in Basic tier, not Pro; no standalone SKU | Decided |
| [[decisions/product/discovery-list-cap]] | 24-card initial render; map keeps all venues | Decided |
| [[decisions/product/polish-only-v1]] | Polish-only, no i18n, inline strings, APP_LOCALE=pl | Decided |
| [[decisions/product/category-aware-sort]] | Category filter sorts by category-specific breadth, not overall | Decided |
| [[decisions/product/age-gate-legal-basis]] | Registration age gate is 18, based on civil law contractual capacity | Decided |
| [[decisions/product/browse-only-v1]] | V1 ships browse-only — no auth, no accounts, no B2B self-service | Decided |
| [[decisions/product/v1-copy-truth]] | Owner-facing copy in v1 describes email workflow only; panel references must be "jest w przygotowaniu" | Decided |
| [[decisions/product/svg-icon-sanitization]] | Category SVG icons sanitized in VenuePresenter before any template renders them | Decided |
| [[decisions/product/accordion-open-priority]] | Top 3 accordion auto-open follows VenuePresenter priority order (piwo→drinki→count), not re-sorted by count in view | Decided |
| [[decisions/product/hide-for-venues-v1]] | /dla-lokali hidden in V1; owners contact via email only | Decided; **superseded in part 18.09** — once `UNI_OWNER_ACCESS` is on |
| [[decisions/product/block-all-ai-crawlers]] | All AI crawlers blocked unconditionally — training and citation bots alike | Decided |
| [[decisions/product/posthog-analytics-role]] | PostHog is additive (session exploration/funnel debug); first-party stack is canonical for all owner-facing data | Decided |
| [[decisions/product/no-ab-testing-v1]] | No A/B tests in V1 — sample size makes them unreadable at launch scale; judgment + qualitative instead | Decided |
| [[decisions/product/frontend-analytics-module]] | `analytics.js` is the single authority for all client-side analytics — consent, capture, identify, stored-consent re-application | Decided |
| [[decisions/product/eventlogger-identifier-stripping]] | EventLogger strips all personal identifiers — events table is genuinely anonymous, no GDPR legal basis required | Decided |
| [[decisions/product/consent-banner-design]] | Category-based bottom panel with switches; Odrzuć/Zaakceptuj equal prominence. **Amended 18.09 (P38): it asks, it does not block** — overlay, scroll lock and `aria-modal` removed | Decided, executed 18.09 |
| [[decisions/product/posthog-cdn-lazy-init]] | PostHog CDN request deferred until after consent — zero network activity to PostHog before user grants consent | Decided |
| [[decisions/product/analytics-endpoint-server-gate]] | `/analytics/events` enforces consent server-side; `abort_unless(cookie === 'granted', 403)` before any processing | Decided |
| [[decisions/product/pii-columns-dropped]] | PII columns dropped from `events` table entirely (not left as nullable) — data model matches compliance intent | Decided |
| [[decisions/product/a-deploy-is-proved-by-a-clean-clone]] | A deploy claim is proved by cloning somewhere empty and running it, not by reading the file that declares it | Decided 22.09 |
| [[decisions/product/a-deploy-needs-more-than-git-carries]] | Gitignored runtime assets are enumerated in the runbook; a 200 is not proof, the content type is checked | Decided 22.09 |
| [[decisions/product/demo-data-is-allowed-everywhere-except-production]] | Invented data may exist anywhere but production; one entry point, DemoDataSeeder, which throws rather than no-ops | Decided 22.09 |
| [[decisions/product/three-environments-and-what-each-is-for]] | Local, home server (Tailscale, real devices), staging, production — each with one stated job; supersedes INFRA-01's "no preprod" | Decided 22.09 |
| [[decisions/product/a-release-is-a-tag-deployed-from-git]] | Every environment deploys the same git tag; nothing is ever copied from one environment to another | Decided 22.09 |
| [[decisions/product/the-workspace-git-store-lives-outside-syncthing]] | The workspace repository is created with `--separate-git-dir`, so its object store is never inside the Syncthing folder | Decided 22.09 |
| [[decisions/product/hero-live-social-proof]] | Hero shows live venue count from DB + floating category cards — trust signal over static claims | **Superseded 15.08** (the city-agnostic homepage change, then homepage-showcase-real-components); recorded 18.09 |
| [[decisions/product/prefers-reduced-motion]] | All animations fully disabled (not slowed) when OS reduced-motion preference is active | Decided |
| [[decisions/product/nis2-out-of-scope]] | NIS2 does not apply; Art. 21 measures tracked voluntarily until 50 employees or €10M revenue | Decided |
| [[decisions/product/dark-map-tile-provider]] | CARTO dark_all tiles for dark mode; CSS inversion rejected as perceptually wrong | Superseded 27.08 |
| [[decisions/product/city-agnostic-homepage]] | No hardcoded city strings in view templates; always read from City model via name_locative | Decided |
| [[decisions/product/transactional-email-provider]] | Scaleway TEM (EU/France) for transactional email on tx. subdomain; US providers rejected over DPF dependency. **EmailLabs compared 09.09 and the decision upheld — one deliverability test could still overturn it** | Decided |
| [[decisions/product/backup-storage-provider]] | Backups to Scaleway Object Storage `fr-par`, own Project, object lock on (compliance, 35 days), AES-256 before upload (gpg until 18.09), 7 daily + 4 weekly. **Supersedes Backblaze B2; overrides the `pl-waw` region agreed 14.09/16.09** — Paris separates the copy from the Warsaw host | Decided |
| [[decisions/product/ssot-document-structure]] | SSOT reordered into dependency order (evidence before decisions) with a summary-first At a Glance panel and themed audit appendix | Decided |
| [[decisions/product/mobile-filter-bottom-sheet]] | Mobile list-view filters collapse into a bottom-sheet behind a "Filtry" toggle; desktop stays inline | Decided |
| [[decisions/product/maps-redirect-type-retained]] | Keep the tested-but-unlinked `maps` outbound-redirect type; deleting throws away finished, zero-cost infrastructure | Decided |
| [[decisions/product/ssot-docs-journals-boundaries]] | Sort content by lifecycle: product-state → SSOT, dated history → journals, reference/audits → docs/ (SSOT links out) | Decided |
| [[decisions/product/internal-traffic-is-excluded-at-the-write]] | Our own visits are dropped at the write like bots — any signed-in account, an opt-out cookie, an optional address list; nothing about the request stored | Decided |
| [[decisions/product/offer-logs-record-knowledge-not-authorship]] | An offer-log row records what kind of knowledge it is (first catalogue / observed change / owner reported), never who typed it; trends ignore first cataloguing | Decided |
| [[decisions/product/analytics-event-naming]] | Event names state surface then action, past tense; never the consequence, never the destination; counter and event names come from one place | Decided |
| [[decisions/product/empty-landing-pages-noindex]] | Empty SEO landing pages return 200 with `noindex, follow` and sitemap exclusion — never 404 | Decided |
| [[decisions/product/seo-cluster-entry-points]] | Venue profile links to its city/district; footer lists cities with venues — the cluster is no longer orphaned | Decided |
| [[decisions/product/national-category-pages-wait-for-a-second-city]] | `/kategoria/{c}` is a national aggregate that never names a city, and stays `noindex` until a second city has the category | Decided |
| [[decisions/product/robots-txt-is-served-by-the-application]] | robots.txt comes from the route, never from `public/`; a static file there silently shadows every rule the route declares | Decided |
| [[decisions/product/one-content-rule-for-the-whole-cluster]] | Sitemap, internal links and a page's own empty state read one shared "has venues" rule — they can never disagree | Decided |
| [[decisions/product/landing-page-copy-comes-from-the-data]] | Landing pages open with a paragraph assembled from their own records — never templated prose with a name substituted in | Decided |
| [[decisions/product/one-share-card-for-the-whole-site]] | One og:image for every page, built from the wordmark already in the repo; per-page cards wait for venue photographs | Decided |
| [[decisions/product/admin-recorded-claims-v1]] | Owner panel stays live in V1; an admin records and approves claims after out-of-band verification — no self-service | Decided; **18.09: complete behind `UNI_OWNER_ACCESS`** — owners set their own password, optional 2FA, several venues per owner; V2 = the switch; **a claim request form on the venue page**, approval still by an admin after a phone call **19.09:** the admin no longer phones the claimant |
| [[decisions/product/email-verification-deferred-to-v2]] | No email verification in V1; identity is established by phone and NIP before the account exists | Decided; **amended 19.09** — nobody is phoned; the owner is still checked by a person before the account exists |
| [[decisions/product/homepage-showcase-real-components]] | Homepage showcase renders shipped components and the real map against invented venues — never a mockup, never a real venue | Decided |
| [[decisions/product/discovery-tile-skin-tokens]] | Tile skins re-point design tokens on one component; a skin may change palette, never the amount of detail | Decided |
| [[decisions/product/homepage-showcase-no-edge-fades]] | No gradient fades on the homepage map strip — nothing is painted over the map | Decided |
| [[decisions/product/single-palette-no-theming]] | One palette, dark only — switch, second palette, theme variant and light basemap all removed | Decided |
| [[decisions/product/abstraction-needs-a-second-user]] | An abstraction survives a cleanup only with a second implementation, a planned one, or a live test user | Decided |
| [[decisions/product/pre-launch-has-no-past-to-protect]] | Continuity-defending machinery is removed until there is continuity to defend; security and privacy never in scope | Decided |
| [[decisions/product/no-component-package-inside-the-app]] | No component package in this repo and no dependency on an ignored directory; components live in the app's views | Decided |
| [[decisions/product/community-reporting-needs-accounts]] | FAQ's phantom report button cut; community reporting ships in V2 with accounts, weighted by reporter credibility | Decided |
| [[decisions/product/carto-named-as-recipient]] | CARTO named in the privacy policy as a recipient of visitor IPs; admin-only services go to the ROPA instead | Decided |
| [[decisions/product/research-files-out-of-the-repo]] | Venue research material never lives in the repository; amended 21.09 — it leaves Syncthing too, to the laptop | Decided |
| [[decisions/product/the-application-and-the-thinking-are-two-repositories]] | `undernoinfluence` deploys and can be handed over; `undernoinfluence-docs` holds the thinking and is never deployed | Decided |
| [[decisions/product/journals-cite-dates-not-commit-ids]] | A change is identified by a date and a description; no commit id enters `docs/` | Decided |
| [[decisions/product/search-results-recorded]] | Discovery searches store the first 20 returned venue IDs in rank order; recording never feeds ranking | Decided |
| [[decisions/product/accessibility-target-aa]] | WCAG 2.2 AA is the target and there is no separate high-contrast mode; contrast failures are palette bugs | Decided |
| [[decisions/product/agent-worktrees-untracked]] | Agent worktrees untracked and ignored; `.claude` configuration and skills stay tracked | Decided |
| [[decisions/product/pull-never-push-when-migrating]] | The new environment pulls from a read-only source; nothing is ever written into a system that is not running | Decided |
| [[decisions/product/no-machine-addresses-in-the-repo]] | No host, IP, or machine path in the repository; dev server defaults to localhost, tailnet is an explicit mode | Decided |
| [[decisions/product/one-vendor-per-system-library]] | One supplier per system component, recorded per environment; distribution and vendor repositories are never mixed | Decided |
| [[decisions/product/vector-basemap-on-openfreemap]] | Vector tiles from OpenFreeMap drawn by MapLibre; CARTO watermarks keyless tiles and is retiring raster | Decided |
| [[decisions/product/analytics-split-posthog-and-events]] | PostHog fed from the browser only under consent; the events table is server-only, ungated, identifier-free, and is what we sell from | Decided |
| [[decisions/product/analytics-fires-on-intent-not-on-keystroke]] | Search records once per committed query, empty results once per filter state — never per keystroke or per render | Decided |
| [[decisions/product/no-identifier-based-deduplication]] | No rotating hash, fingerprint or session key for dedup; `events` stays anonymous and outside GDPR | Decided |
| [[decisions/product/raw-events-are-kept-not-pruned]] | Raw event retention raised to ten years; the ninety-day deletion was policy, not law | Decided |
| [[decisions/product/map-pins-as-a-data-layer]] | Pins drawn from one venue data list, not page elements; grouping ships off and switches on at ~120 venues in a city | Decided |
| [[decisions/product/map-pins-are-pre-rendered-images]] | Each pin drawn once to a canvas from the CSS measurements and placed as a map image, so the design survives a data layer | Decided |
| [[decisions/product/accent-only-map-clusters]] | Grouped pins stay the accent colour; colouring them by dominant category was built and rejected | Decided |
| [[decisions/product/map-attribution-lives-in-the-style]] | The ODbL credit is declared once on the source in our style file; no map adds its own | Decided |
| [[decisions/product/map-correctness-needs-a-browser]] | Layer definitions validated against the spec, and every map surface loaded in a real browser — nothing else can see a map that renders into a zero-sized box | Decided |
| [[decisions/product/custom-drink-photo-gate-retired]] | House-drink photo requirement retired for V1 — generated images killed the cost barrier and nobody can self-submit | Decided |
| [[decisions/product/brand-and-product-pages]] | Brand and drink pages become a primary search surface; text-only at launch, images only with provenance | Decided |
| [[decisions/product/discovery-filters-are-not-indexable]] | Filter combinations carry noindex-follow; the existing city cluster is the search surface | Decided |
| [[decisions/product/faq-gets-its-own-page]] | FAQ moves to `/faq` at eight questions or more; `/jak-to-dziala` links instead of repeating. Supersedes the 19.06 in-page decision | Decided |
| [[decisions/product/dry-january-is-a-permanent-page]] | `/suchy-styczen` exists all year at one address, carries a live venue list, and is refreshed rather than rebuilt | Decided |
| [[decisions/product/one-result-tile]] | One discovery tile — the lighter card; the dark skin, its prop and `UNI_DISCOVERY_TILE` deleted | Decided |
| [[decisions/product/v2-work-is-not-built-early]] | V2 features are not built early, hidden or otherwise; the exception is data that cannot be backfilled | Decided; **superseded in part 18.09** — the owner panel is built complete behind `UNI_OWNER_ACCESS` |
| [[decisions/product/every-page-shows-the-trail-it-publishes]] | One breadcrumb array per page feeds both the visible trail and the structured data; every trail starts at the home page | Decided |
| [[decisions/product/list-rows-show-the-place-not-a-map]] | A list row leads with the district as a block, and a drink page's rows carry that drink's own confirmation date; map thumbnails rejected | Decided |
| [[decisions/product/a-filter-that-narrows-the-list-is-visible]] | Anything that narrows the list is visible, counted and cleared by "clear all" — the map area included | Decided |
| [[decisions/product/venue-data-acquisition-flow]] | Business register stays outside the application as a prospect list; every fact carries a source address and a date | Decided |
| [[decisions/product/secrets-never-in-tracked-files]] | No credential in any committed file; a pre-commit secret scanner enforces it | Decided |
| [[decisions/product/search-presence-and-impression-are-different-numbers]] | Search visibility is three named numbers — match, presence, impression; the twenty-id cap is dropped | Decided |
| [[decisions/product/entry-buckets-are-a-closed-set]] | Entry source, device and view surface stored as closed-set buckets; tagged links beat referrer headers | Decided |
| [[decisions/product/owner-badge-waits-for-the-owner-panel]] | "Zarządza właściciel" badge suspended behind a flag until the panel opens | **Superseded 16.09** — flag deleted; the badge follows claim approval (recorded 18.09) |
| [[decisions/product/consent-must-be-storable-where-it-is-given]] | `Secure` set only where it can be honoured, so a refusal persists on the device it was given on | Decided |
| [[decisions/product/an-automatic-gate-runs-in-both-directions]] | A gate is triggered wherever any part of its condition changes, the scheduled job has a pass each way, and both go through the model so the move is audited | Decided, executed 17.09 |
| [[decisions/product/a-control-speaks-only-when-it-is-moved]] | A control whose meaning is a decision writes only when moved — compared against what it was rendered with, not against the record | Decided, executed 17.09 |
| [[decisions/product/owner-panel-ships-behind-one-switch]] | The owner panel is built complete now behind `UNI_OWNER_ACCESS`; V2 is the switch. Holds the table of everything the switch governs (19.09) | Decided, executed 19.09 |
| [[decisions/product/claim-requests-come-from-the-venue-page]] | A claim request form on the venue page, behind the switch; a request grants nothing, approval follows a phone call and makes or finds the account | **Superseded 19.09 in part** — the form is the first tab of `/zglos-lokal`, and nobody is phoned |
| [[decisions/product/a-venue-is-its-name-at-an-address]] | A venue is its name at an address in a city; its slug is name + street, set once; no chain table until a chain page is wanted | Decided, executed 18.09 |
| [[decisions/product/venue-page-shows-only-its-venue]] | A venue's page never names, lists or pins another venue; the "W pobliżu" list and neighbouring pins are gone, comparison lives on the map | Decided, executed 19.09 |
| [[decisions/product/new-in-the-menu-is-dated-by-the-offer-log]] | "Nowe w karcie" marks items added in the last 30 days, dated by offer-log rows of type observed change or owner reported — never the first cataloguing | Decided, executed 19.09 |
| [[decisions/product/new-venue-requests-create-no-venue]] | An owner can ask for a venue UNI does not list; the request stores the venue's details, creates no venue, and is approved only after the admin adds the venue and links it | Decided, executed 19.09; now the second tab of `/zglos-lokal` |
| [[decisions/product/one-request-form-for-owners]] | One owner page, `/zglos-lokal`: "Przejmij profil" (a search over listed venues) and "Dodaj nowy lokal" tabs, the person's fields once below both; a new-venue request at a listed venue's name, city and street becomes a claim on it | Decided, executed 19.09 |
| [[decisions/product/owner-requests-are-not-verified-by-phone]] | Nobody is phoned to verify an owner; the phone field is hidden from the form, the column kept | Decided, executed 19.09 |
| [[decisions/product/a-waiting-request-is-flagged-never-rejected-automatically]] | A request pending more than 14 days is flagged in the admin's list and e-mailed to the admins once; rejection stays a person's decision | Decided, executed 19.09 |
| [[decisions/product/owner-requests-are-checked-through-the-venues-own-channels]] | The owner check: proof is a channel the venue publishes and the claimant did not supply (its e-mail, website domain, KRS e-mail, Instagram); NIP looked up in the VAT list and KRS as background; a person approves, and without a confirmed channel writes why. Process: `product/features/Owner Verification.md` | Decided, executed 19.09 |
| [[decisions/product/owner-access-opens-only-once-owners-can-be-checked]] | `UNI_OWNER_ACCESS` is switched on only after the replacement owner check is built — the first step of the V2 opening list | Decided, standing rule |
| [[decisions/product/an-owner-can-have-several-claims-waiting]] | One account may wait on any number of claims, and the admin can give an existing owner another venue; one waiting claim per venue stays; bulk recording waits for a real chain | Decided, executed 19.09 |
| [[decisions/product/owner-line-comes-before-corrections]] | Under a venue's buttons: "To Twój lokal?" first and more visible, "Coś się nie zgadza?" second and the same in both switch states; analytics only on `/zglos-lokal` | Decided, executed 19.09 |

## Pending Decisions

**None.** How an owner request is verified was open for part of 19.09 and was decided and built the same day ([[decisions/product/owner-requests-are-checked-through-the-venues-own-channels]]). What stands between it and switching owner access on is work, not judgement: the checklist in `product/features/Owner Verification.md`.

*Until 19.09 this section read "None" — for the first time since the index existed, nothing was waiting on a decision.*

The backlog that used to live here — and then in `roadmap/decisions-waiting-on-you-v*.md`, and then in the `roadmap/commute-*.md` series — was worked through between 14.09 and 16.09. What remains in the records marked `Executed: no` is **work, not judgement**: brand and drink pages (not built), the venue-type filter (not built), SMTP and DNS (deploy steps), the research files and the secret scanner (the cleanup session and the repository migration). Each is a task with an owner and a place in the plan; none needs an answer first.

**When something does need deciding again**, it becomes a record here directly. The rolling question document was a queue, and a queue with nothing in it should not be maintained — it was right while twenty questions were open and is overhead now. Cataloguing and the first deploy will both produce new questions; that is when the format earns its place again, not before.

*Previously this section pointed at `roadmap/decisions-waiting-on-you.md` "rewritten to v3 on 30.08" and described a `venue_offer_logs` prune armed at six months. That prune no longer exists — retention is anonymisation now, at 24 months, and nothing is deleted to satisfy it ([[decisions/product/personal-data-expires-rows-do-not]]). Corrected 2026-09-16.*

