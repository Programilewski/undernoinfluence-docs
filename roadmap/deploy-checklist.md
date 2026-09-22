---
version: 1.1
owner: Paweł Milewski
updated: 2026-09-09
status: approved — specified in decisions-waiting-on-you-v8 §10 and answered "write it as specified"
---

# Deploy checklist

Every line has a reason attached, because **a checklist item without a reason is the first one somebody skips.** This list is run before a deploy is called finished, on preprod first and then on production — [`../tech/going-to-production.md`](../tech/going-to-production.md) explains why preprod exists and what it has to prove before production is touched.

Status meanings: `DONE` — verified, with the date and how it was checked · `BLOCKED` — waits on something named · `EVERY DEPLOY` — has to be re-run each time, never permanently done · `TODO` — not started.

**Checked against the running system on 2026-09-09.** Anything marked `DONE` here was actually executed on that date, not read out of another document — the standing failure mode in this project is a checklist item that describes code nobody ran.

> **Read this before running the list — 2026-09-17.** Eight rows below still say `BLOCKED` **on the hosting decision**: A3, A5, A6, A7, B2, B3, D1 and E5. **That decision was made on 14.09** — OVH VPS-1, 2 vCore / 4 GB / 40 GB NVMe in a Polish datacentre, clean Ubuntu 26.04, Ploi **Basic** with staging, database on the same machine, mail through Scaleway TEM (`commute-2026-09-12.md` §2.4, §4.1). **Those eight rows are `TODO`, not blocked**, and each one now has everything it needs to be executed. Two of them also need correcting rather than executing as written: **A8** specifies SELinux contexts, which is Fedora and RHEL — this box is Ubuntu, so that is AppArmor; and **A3**'s `user=www-data` is *correct* on Ubuntu, so the row is answerable. The row-by-row rewrite is on the next-session list; this note exists so the list is not read as blocked in the meantime.

*v1.1, same day: **B2a** added after EmailLabs was compared against the Scaleway decision. **36 lines** — the earlier count of 32 (and 33 after B2a) was wrong from the first version; recounted 09.09: 14 DONE, 8 BLOCKED, 5 EVERY DEPLOY, 9 TODO.*

---

## A. The machine, before the first deploy

| # | Check | Status | Why it is on the list |
|---|---|---|---|
| A1 | Crontab holds the single `* * * * * php /var/www/undernoinfluence/artisan schedule:run` line | **TODO** — `crontab -l` returns *no crontab for bub*, 09.09 | Without it **nothing scheduled ever runs and nothing errors.** Freshness badges rot silently and `uni:anonymise-expired-data` stops clearing personal data, which makes the privacy policy untrue. This is debt item **T-25b** and it has never run on any machine this project has lived on · **12.09: the silence is now detectable.** `uni:heartbeat` runs every five minutes and the admin dashboard reports how long ago the scheduler last ran, red after fifteen minutes — so a missing cron line is visible instead of silent. The cron line itself still has to be installed |
| A2 | Queue worker running under supervisor, surviving a reboot | **TODO** — no `queue:work` process, 09.09 | Notifications implement `ShouldQueue`. A claim approval or an erasure response sent while the worker is down is lost, not delayed |
| A3 | `supervisor/uni-worker.conf` names the web user this host actually has | **BLOCKED** on the hosting decision | Line 14 says `user=www-data`, which exists on Debian and Ubuntu and **not on Fedora or RHEL**. The file has never been loaded, so nothing has ever complained. A wrong value fails silently until a queued job never runs |
| A4 | `LOG_STACK` actually contains `daily` | **DONE 12.09 at source** — `.env.example` now ships `LOG_STACK=daily`, so the production `.env` built from it inherits the 30-day retention. Still confirm on the box after the first deploy: `config('logging.channels.stack.channels')` must return `["daily"]` | `config/logging.php` sets `days => 30` on the daily channel, but the stack decides which channels are in it. With `single` the published 30-day retention is fiction and one file grows until the disk is full |
| A5 | `logrotate` configured for the web server's access and error logs | **BLOCKED** on the hosting decision | Same reason as A4, for the logs Laravel does not own. Enforces the 30 days decided in v7 §7 and stops the disk filling |
| A6 | Backups run nightly, are copied off the box encrypted, **and a restore is rehearsed into an empty database** | **IN PROGRESS** — *18.09: the job is built and rehearsed on the laptop; the server half is left* | GDPR art. 32(1)(d) requires the restore to be *tested*, not merely configured. **Built 18.09:** `spatie/laravel-backup` runs at 01:30 UTC (database + uploaded files), rotation at 01:00 keeps 7 daily + 4 weekly, the monitor at 07:00 mails if the newest archive is over a day old. Every archive is AES-256 encrypted and `BackupEncryptionGuard` fails the run rather than write a readable one. Production writes to the `backups` disk (Scaleway, `BACKUP_S3_*`), everywhere else to `storage/app/backups`. **Rehearsed locally 18.09:** backup → wrong password refused → extract with `7z` → restore into an empty database → all 34 tables' row counts identical. **Left, in order:** (1) in the Scaleway console, enable object lock on `uni-backups-prod`; (2) set its default retention with one S3 API call — the console cannot; (3) add the lifecycle rules; (4) set the `BACKUP_*` variables in Ploi and keep the password in a password manager; (5) install `7zip` on the server; (6) run `php artisan backup:run` once by hand and see the archive arrive; (7) restore that archive into an empty scratch database on the server — never into staging, then quarterly |
| A7 | Secrets generated on the server, never copied from a laptop | **TODO** | The reverse of the dev-machine rule. `APP_KEY` and the database password exist only on the box. Related: the current Postgres password sits in four tracked files — [`../tech/repository-migration.md`](../tech/repository-migration.md) |
| A13 | **`git config core.hooksPath scripts/githooks`** on every clone — the laptop, the home server, the production box | **DONE on the laptop 22.09**; TODO everywhere else | The pre-commit secret scanner (`scripts/check-secrets.mjs`) is tracked, but the setting that runs it is **per-clone and not part of the repository**. A clone without this command has no scanner and gives no sign of it. One line, and it is the only thing standing between a hurried `git add -A` and a credential in a history that cannot be edited — which is the exact mistake this whole migration exists to undo |
| A8 | SELinux contexts set: `restorecon -Rv`, writable `storage/` and `bootstrap/cache/`, `httpd_can_network_connect_db` if the database is remote | **TODO** | `artisan serve` runs unconfined; a real web server does not. This is where "pull, don't push" stops being a preference |
| A9 | Search Console TXT record present, and the property verified | **TODO** | Removing it silently unverifies the property. Also: without Search Console the entire 08.09 SEO session is unmeasurable, so **connect it before the import** to have a baseline rather than after |
| A11 | **Two Postgres databases and two Postgres roles** — `prod_uni` / `prod_uni_app` and `stg_uni` / `stg_uni_app`. The staging role holds **no rights** on the production database | **TODO** — *added 16.09* | Ploi's staging feature creates a second site with its own `.env`; it does **not** create a database. Point it at production's credentials and staging *is* production with a different URL. Two roles rather than one, so a credential leaked from the less-guarded site cannot reach production. **The environment goes at the front of the name, not the end**: `uni_production` / `uni_staging` differ by a suffix that is skimmed past in a terminal at night, whereas a connection string starting `prod_` cannot be misread as staging — see [`../decisions/product/staging-is-seeded-never-copied.md`](../decisions/product/staging-is-seeded-never-copied.md) |
| A12 | **Staging is seeded, never restored from a production dump** — and the backup restore drill targets an empty scratch database, never staging | **TODO** — *added 16.09* | A production copy on staging is a second copy of every claim's `contact_name`, `contact_email`, `contact_phone` and `business_nip` on a box with weaker access rules, and it makes both environments' analytics untrustworthy by mixing real events with test traffic. This shortcut is never taken in a planning session — it is taken at 11 pm by somebody debugging, which is why it is a checklist row and a decision record rather than a convention |
| A10 | The first admin account exists, created on the box with `php artisan uni:create-admin` | **TODO** — command built 12.09, covered by `CreateAdminCommandTest` | Production seeds no user, and Filament's own `make:filament-user` prints *"may now log in"* while creating role `user`, which `/admin` refuses — verified in the 12.09 production rehearsal. The command prompts for the password rather than taking it as an option, so it stays out of the shell history, and it writes an `admin_created` audit record. Run it over SSH, never from a deploy script |

## B. Environment, every deploy

| # | Check | Status | Why it is on the list |
|---|---|---|---|
| B1 | `APP_ENV=production`, `APP_DEBUG=false` | **EVERY DEPLOY** | `APP_DEBUG=true` in production leaks environment variables, including database credentials, on any error page. Local `.env` is `local`/`true` today, which is correct for local and fatal if copied |
| B2 | `MAIL_MAILER=smtp` against Scaleway TEM on `tx.undernoinfluence.pl`, verified with a real send | **BLOCKED** on the hosting decision | `.env` is `MAIL_MAILER=log` today, so a claim approval goes to a file. Provider decided 29.06 ([`../decisions/product/transactional-email-provider.md`](../decisions/product/transactional-email-provider.md)); what remains is execution plus **signing the Scaleway DPA before the first real claim is processed** |
| B2a | **Polish-inbox deliverability test, before B2 is called done** | **BLOCKED** on B2 | Send the real claim-approval template to **wp.pl, o2.pl, interia.pl, onet.pl and gmail.com**, from Scaleway and from EmailLabs' free tier, and record inbox versus spam. Venue owners in Poland use those providers, and international senders often carry weaker reputation with them than with Gmail. **This is the only thing that would reverse the 29.06 provider decision** — see its 09.09 revisit section. An afternoon, no cost, and it settles a question no pricing page can |
| B3 | SPF, DKIM and DMARC records published for `tx.undernoinfluence.pl` | **BLOCKED** on B2 | Transactional mail that fails authentication lands in spam, and a password reset in spam reads to the owner as a broken product |
| B4 | `ANALYTICS_INTERNAL_IPS` set if the box will be browsed from a fixed address | **EVERY DEPLOY** (optional) | Third of the three internal-traffic signals. Empty is a safe default; a wrong value fails silently towards counting nothing |
| B5 | No visual variant switch reaches production | **DONE 18.09** — both switches are deleted, not set: `UNI_DISCOVERY_TILE` on 17.09 (one tile, the lighter card) and `UNI_HOME_SHOWCASE` on 18.09 (one showcase, the full-bleed strip). The comparison mode that made every fifth tile on `/mapa` look different cannot reach a visitor because the code for it is gone |
| B6 | `HSTS_MAX_AGE` still short | **EVERY DEPLOY** | HSTS is a promise a browser keeps for the whole max-age and cannot be withdrawn early. Raise it only **after the first unattended certificate renewal has run** — not on launch day, when a botched certificate locks every visitor out for a year. Currently 300 |
| B7 | `SESSION_DRIVER=file`, `SESSION_ENCRYPT=true`, `SESSION_SECURE_COOKIE=true`, `SESSION_DOMAIN=undernoinfluence.pl` | **EVERY DEPLOY** — *added 14.09* | The file driver stores no visitor IP address (`sessions-hold-no-ip-address`), and the privacy policy describes whichever driver is set. Without `SESSION_SECURE_COOKIE` the admin session cookie can travel over plain HTTP while HSTS is still short |
| B8 | Staging site: `MAIL_MAILER=log` unless deliberately testing mail | **EVERY STAGING DEPLOY** — *added 14.09* | A test claim on staging would otherwise e-mail seeded addresses, and bounces hurt the sending reputation production depends on |
| B9 | `UNI_HEALTHCHECK_PING_URL` set to the outside check's ping URL, and the first ping seen arriving | **TODO** — *added 14.09* | The only signal that reaches you when the server, worker or database is down (`PingExternalHealthcheck`). Empty means off |

## C. The deploy itself

| # | Check | Status | Why it is on the list |
|---|---|---|---|
| C1 | **`php artisan queue:restart` after every deploy** | **EVERY DEPLOY** | A worker holds code in memory. Without this it keeps running the **old** code indefinitely — the single most common Laravel deploy bug, and it produces a system that is half-updated in a way no page reveals |
| C2 | Assets built **off** the box and deployed compiled | **EVERY DEPLOY** | Vite spikes memory; on a 4 GB VPS a build can OOM-kill Postgres in the middle of a deploy |
| C3 | `public/hot` absent, `public/build/manifest.json` present | **DONE locally 09.09** — `public/hot` absent, manifest present | If `public/hot` exists, Laravel emits asset URLs pointing at a dev server that is not there: a complete, fast, correct-looking page whose scripts hang forever. This is the production form of the failure that cost an evening on 25.08 · **22.09: this row also explains a test result.** On a development machine that has run `npm run dev`, `public/hot` exists and Laravel's Vite helper points at the dev server without ever reading the manifest — so `php artisan test` passes with no `public/build` at all, and appears to prove something it has not. In a fresh clone, where `public/hot` cannot exist, 261 rendering tests fail with `ViteManifestNotFoundException`. `composer run test` builds first for this reason; a bare `php artisan test` does not |
| C4 | `config:cache`, `route:cache`, `view:cache` run, and the app still works | **TODO — first run belongs on preprod** | Config caching changes behaviour: any `env()` call outside a `config/` file returns `null` once the cache exists. That is a class of bug that appears **only** in a cached environment and never in development |
| C5 | Migrations run, and `discovery_type` present on `venue_offer_logs` | **DONE locally 09.09** | The guard that keeps the first import out of the trend reports. It has to exist **before** any product is entered — nothing in an existing row says which pass it came from |
| C6 | nginx sends long cache headers for `/build/` and `/vendor/` (e.g. `location ~ ^/(build\|vendor)/ { expires max; add_header Cache-Control "public, immutable"; }`) | **TODO** — *added 14.09* | Both paths are versioned. Without the headers MapLibre's worker downloads the ~145 KB shared module a second time on every map (measured 14.09 — `the-map-library-stays-patched`) |

## D. What the first visitor sees

| # | Check | Status | Why it is on the list |
|---|---|---|---|
| D1 | HTTPS end to end: `route()` and `url()` emit `https://`, proxy headers trusted | **PARTLY DONE 12.09** — `trustProxies(at: '*')` is deleted and `TrustedProxiesTest` asserts that `X-Forwarded-For`, `-Host` and `-Proto` are all ignored. `forceScheme('https')` remains wired for production, so what is left is the one-off confirmation on the real box that `route()` emits `https://` | `'*'` trusted every client's forwarded headers, which made every rate limiter spoofable — including Filament's five-per-minute login limit. There is no proxy in front of this server, so nothing needs to be trusted. If one is ever added, list its ranges, never `'*'` |
| D2 | Consent cookie carries `Secure` over HTTPS | **DONE 09.09** — `consentCookieString()` appends `Secure` when `location.protocol === 'https:'`; the `uni_no_count` opt-out button follows the same rule | The flag is conditional by design so local HTTP still works. Production must be the branch that sets it, and only production can prove it does |
| D3 | `/robots.txt` served by the application, not from `public/` | **DONE 09.09** — `public/robots.txt` deleted, `RobotsTest` asserts its absence | A web server checks the disk before it reaches PHP. A stale static file silently overrode the AI-crawler block and the panel exclusions for months, and no route test can detect that |
| D4 | `/sitemap.xml` addresses all return 200 and none is `noindex` | **DONE 09.09** — `SitemapConsistencyTest` walks every address | The sitemap and the pages once used two different rules for "has venues", so 71 of 161 submitted addresses rendered empty and noindex |
| D5 | Custom 404 renders in the site's identity | **DONE 09.09** | A raw Laravel error page on a product whose whole claim is being a trustworthy source reads as a broken site |
| D6 | Sharing a link produces a card, not bare text | **DONE 09.09** — `og:image`, `twitter:card`, `og:locale` on every page | Instagram three times a week is the growth plan; every link posted before this went out as a naked URL |
| D7 | The "najbliżej" sort actually asks for a position | **DONE 09.09** — `Permissions-Policy: geolocation=(self)`, covered by `SecurityHeadersTest`. **Still worth one manual browser check on the first HTTPS deploy**, because a permission prompt is the kind of thing only a browser can confirm | It was `geolocation=()`, an empty allowlist that refuses our own origin too, so the sort silently returned nothing for every visitor who chose it |
| D8 | Maps render without a watermark | **DONE 01.09** | MapLibre against self-hosted OpenFreeMap styles, no API key. CARTO stamped keyless requests "API KEY REQUIRED" on all three map surfaces |
| D9 | No producer name renders as a brand | **DONE 09.09** — data corrected, `ProductSeeder` corrected, `ProducerNamesStayInternalTest` guards it | `producers-stay-internal` was being broken in front of the reader: Crodino was entered as "Campari Group", Somersby as "Carlsberg" |

## E. Scope and truthfulness gates

| # | Check | Status | Why it is on the list |
|---|---|---|---|
| E1 | `uni.owner_managed_badge` still `false` | **DONE 09.09** — `config('uni.owner_managed_badge') === false` | Suspended on 02.09 for being untrue: 14 venues carried "Zarządza właściciel" with zero claims behind them. A deploy is exactly when a suspended flag quietly comes back |
| E2 | No venue carries a badge nobody earned | **NOT APPLICABLE to production** — the production database starts empty: outside `local`, `DatabaseSeeder` loads cities, categories, districts and the two canaries only. The 14 owner-managed and 20 menu-verified marks are local fixtures | Kept as a local note: the local database still carries them, so no screenshot or demo should be taken from it |
| E3 | Canary venues present and excluded from every public surface | **DONE 09.09** — both canaries present; `Venue::active()` excludes them and the venue, redirect and analytics endpoints 404 them | Scrape detection only works if they are live, and it stops being evidence if they leak into a public count |
| E4 | Owner panel reachable only at `/panel`, excluded from indexing | **DONE 30.08** — `/panel/` excluded in `robots.blade.php` | **v8 §10 item 11 said this should 404. That is out of date and should not be re-applied**: the 16.08 decision (`admin-recorded-claims-v1`) deliberately keeps the panel live, because admin-created owners have to log in somewhere. Note O-2 in `next-session.md` offers a config switch if that is ever reversed |
| E5 | Privacy policy names every recipient, including the host and the panel operator | **BLOCKED** on the hosting decision | Section 6 names Scaleway, OpenFreeMap and PostHog correctly. The host and Ploi are still described generically. **Ploi has credentialed access to a server holding personal data — that is an art. 28 processor relationship and needs a DPA and a ROPA entry**, exactly as any other |
| E6 | Public copy promises nothing the code does not do | **DONE 30.08** | `v1-copy-truth`. `/jak-to-dziala` promised a report button that did not exist; the button was built rather than the sentence cut |

---

## The four items that gate a launch date

Everything above is either inside this list or after it. From v8 §15, still unanswered:

1. **30 real venues imported and verified** — blocked on A6 (backups) and the wipe
2. **The SEO surface live and measurable** — blocked on A9 (Search Console)
3. **This checklist green** — blocked on the hosting decision, which unblocks nine lines at once
4. **A restore rehearsed into an empty machine** — A6

**Order matters and only one thing is genuinely first: hosting.** It unblocks A3, A5, A6, A7, B2, B3, D1 and E5 — eight of the fourteen blocked lines — and nothing else on this page moves until it is chosen.

---

*See also: [`undone-inventory.md`](undone-inventory.md) · [`pre-launch-checklist.md`](pre-launch-checklist.md) · [`../tech/going-to-production.md`](../tech/going-to-production.md) · [`../tech/repository-migration.md`](../tech/repository-migration.md)*
