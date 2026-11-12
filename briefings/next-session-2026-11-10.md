---
description: "Resume point for the venue-sourcing pipeline: the 10.11 findings, the extraction schema, the decisions, and the build — all of steps 3–6 done 11.11 (§11 lists what is open)."
owner: Paweł Milewski
updated: 2026-11-11
status: written 10.11 (talk only); updated 11.11 with the decisions taken and the build. **The build plan is done (§11); what is left is using it and the open items there.**
---

# Next session: the venue-sourcing pipeline

**On 10.11 we only talked; no application code changed.** Three inputs arrived (KCPU's second letter, a handoff from a claude.ai chat about a sourcing pipeline, and a handoff from a Python prototype that extracts NA drinks from menus), plus one addendum from each side answering follow-up prompts, plus two extra prototype runs. This document holds everything that came out of that, so the next session starts from here instead of re-reading 200 KB of input. Work mode stays the same: one problem at a time — I describe, you decide, then build, test, commit.

**Also still open from before:** the 28.10 audit (F3 next), see [[briefings/next-session-2026-10-28]]. Decide which comes first.

## Where the source material is

All in `research/prompts/`, **untracked in git on purpose** — read the "Do not commit" column before adding any of it.

| File | What it is | Do not commit because |
|---|---|---|
| `118284_PM  ponowna odpowiedź reklama i promocja napojów bezalkoholowych.pdf` | KCPU's 10.11 letter | Already transcribed into `compliance/correspondence/kcpu-2026.md` §4 (done 10.11); the PDF itself can go to `~/uni-reference/` |
| `sourcing-pipeline-handoff-2026-11-10.md` | The claude.ai chat's handoff (Polish) | §14 is alcohol-law analysis — the legal-analysis-stays-out-of-the-repo record |
| `uni-sourcing-handoff-addendum-2026-11-10.md` | The chat's answers: who decided what, the full trust-signals ADR text, sourced facts on Brave, Source B, consent for e-mail, TDM, GDPR art. 14 | Sections 3–4 are legal analysis; the file says so itself. Only its §2.3 product rules and §5 table may be copied into records |
| `LARAVEL_HANDOFF.md` | The prototype's handoff for a Laravel rebuild | Fine to keep as research input; several statements in it are wrong — the addendum corrects them |
| `LARAVEL_HANDOFF_ADDENDUM.md` | The prototype's corrections, verbatim rules (date detection, link discovery, optimiser), the 17-menu test set, runs (a) and (b) in §9 | Contains real venues' menu transcriptions |
| `export/*.json` (17 + `index.json`) | Per-menu extraction results from every Haiku run, the Opus reference, dates, tokens | Venue research material → belongs in `~/uni-reference/` (research-files-out-of-the-repo) |

**At risk of being lost:** the prototype session's hand-made ground truth for runs (a)/(b) is in that session's scratchpad, `/tmp/claude-1000/-var-www-out/7c35b585-e869-4bd8-9a27-106f1566603e/scratchpad/truth2.py`. `/tmp` is cleared on reboot — ask that session to copy it into its `export/` folder.

## 0. Updates on 11.11

- **The pipeline is decided:** [[decisions/adr/ADR-012-automated-venue-sourcing]] replaces the manual-only rule (ADR-002 and *venue-data-acquisition-flow* marked superseded). Your words: the rule "came from fear of doing something illegal. If the automated flow is legal, we are fine." The record turns that condition into rules: first-party pages only, every opt-out honoured, no Brave results stored, no personal data, nothing published without approval.
- **Brave:** account, credits and API key exist (`BRAVE_SEARCH_API_KEY` in the PC's `.env`).
- **Brave's own pricing and terms pages:** you'll check them later.
- **Source B's format, from your screenshots** (the list host doesn't resolve from the PC's sandbox, so I haven't loaded it myself):
  - The list page `cbip_zezwolenia_lst.asp` holds 16,671 permits on 834 pages of 20, newest "Ważne od" first. Filters: Adres punktu (text), Dzielnica punktu, Rodzaj, Typ zezwolenia. Columns: Lp., Ważne od, Rodzaj (A ≤4.5% and beer, B 4.5–18% except beer, C >18%), Typ (e.g. "Jednorazowy"), Punkt, Szczegóły.
  - A detail page holds Numer zezwolenia, Data wydania, Ważne od, Ważne do, Punkt, Adres, Rodzaj zezwolenia, and a "Wniosek" link.
  - **Better than the addendum assumed:** neither page shows an owner name, firm name or NIP. "Punkt" is the point's own name. The address is only on the detail page. The "Wniosek" link is the one place personal data could sit, so it is never followed.
  - **To filter out:** one-off event permits ("Jednorazowy", e.g. the Jarmark Warszawski stalls, dozens per event). One venue usually holds up to three permits (A, B, C), so dedupe by normalised address.
  - **The dropdowns (your screenshots, 11.11):** Typ zezwolenia = Detal, **Gastronomia**, Jednorazowy, Na wyprzedaż, Na org. przyjęć. Rodzaj = A, B, C. Dzielnica = the 18 Warsaw districts. So the list *does* separate on-premises from shops: **Source B reads Typ = Gastronomia, one district at a time**, and skips the other four types. Still unknown: how many Gastronomia permits a district holds (it decides how many detail pages must be fetched for the addresses), and the query-string parameters behind the form.
- **The five Brave test queries (11.11, 7 requests, nothing stored):**
  - **Content query works, with noise.** `"piwo bezalkoholowe" karta Warszawa` returned real venue menus (Słoik, Tygmont, Sipizza), but half the ten were supermarkets (Leclerc, Makro), Wolt, a brewery's product page and an article. A domain blocklist plus step 2 (address or phone on the page) has to remove these; shops and producers are never venues.
  - **`country=PL` + `search_lang=pl` change little** (the same top results, a few swapped). Keep them; they cost nothing.
  - **`filetype:pdf` works and is the most productive form:** 10 of 10 were PDFs, most of them real Warsaw venue menus (Pinta, Czerwony Wieprz, Semolino, Miejsce), plus noise: a Ukrainian chain's domain, a train menu, a hotel room-service menu. Several were years old (2021), which is fine: only the domain is taken from them.
  - **`site:` works on a real domain**, and the response says so (`query.search_operators.applied`, `sites`, `cleaned_query`). `site:semolino.pl menu` listed seven menu PDFs of different dates, which is exactly the fallback the menu finder needs, and why date detection matters. A domain with no indexed pages returns no web results (`bad_results: true`), a cheap signal in itself.
  - **A quoted street name does not pin the city:** `"ul. Chmielna"` also returned Gdańsk's Chmielna. Address queries need the city and still need step 2's verification.
  - **Rate limit:** the headers report 50 requests per second.
  - **What follows for the design:** source A runs a small set of content queries, mostly `filetype:pdf` forms, per category and per district name. Every result's domain goes through the blocklist and step 2 before it becomes a candidate. `site:` is the menu finder's fallback.

## 1. KCPU, 10.11 (DP.44.237.2026)

They did not answer the three questions one by one; they restated the test: **is the name a trademark or graphic mark of a specific alcoholic brand, or an ordinary (customary) name?** New in this letter: content must not encourage buying alcohol. They give no individual advice and suggest a lawyer.

For the product: style words ("lager", "IPA", "musujące") and classic cocktail names ("Mojito bezalkoholowe") are ordinary names, so they pass the test. The planned social post contains no trademark. The brand decision already stood on current law; this confirms it. **No code change follows from the letter itself.**

✅ Both KCPU-dependent records closed 11.11, citing the letter by date and reference number only.

## 2. What the inputs got wrong against existing records

The chat's addendum conceded all of these.

1. **Presentation ideas (handoff §14.5):** producer country, "rzemieślnicze" and flavour profile are banned by *menu-lines-describe-style-not-brand* (a precise combination points to one product; "IPA · czeskie" is the handoff's own violating example). Draught vs bottle was decided 27.10: not recorded for launch. Style and 0,0 vs ≤0,5 are already built.
2. **"Delete rejected candidates after 30 days"** breaks the project rule that retention is anonymisation, never deleting a row. Keep them, with the reason — they are also the memory that stops the pipeline re-proposing a rejected venue.
3. **The "Sygnały zaufania i etykiety" ADR** was called "already written" but existed only as a chat attachment. Its full text is now in the chat addendum §1.1.
4. **The naming tables and court citations (handoff §14.3, §14.6)** are legal analysis. The citation-free route: extend the category-names rule's one sentence ("never the name of a specific alcoholic drink, a spirit or a protected origin") to recipe names.

## 3. What the code already covers

- "(Nie)mocne" exists: slug `niemocne`, SEO slug `destylaty-bezalkoholowe`, hidden (`is_visible` false). `ProductStyle` is the closed style list; `Product::isNamedPublicly()` and `tests/Feature/Seo/NoBrandNameIsPublishedTest.php` guard brand names.
- Catalogue matching is `MenuItemResolver` + `RecordMenuItemAction` + the `VenueMenuImporter` rules (unknown brand refused, spellings confirmed, near misses on a recipe). **Pipeline approval must go through this same path**, never a new matcher. `source_url` + `checked_at` provenance is already required.
- `venues` already has `phone`, `email`, `website_url`, `instagram_handle`; geocoding is GUGiK (`GugikGeocodingService`).
- **UNI stores no prices anywhere.** Prices are not extracted for V1.
- Freshness is one threshold: `config('uni.freshness_days')` = 90 (`UNI_FRESHNESS_DAYS`). The chat's 60/120 proposal loses to the repo, by its own rule.
- **Approving a venue publishes it within the hour:** `CheckOfferFreshness::activateReadyVenues` makes any venue with coordinates and one product or house drink live, unless `switched_off_at` is set. Fine while production isn't live.

## 4. Gaps found that nobody had noticed

1. **House-drink descriptions are public** (`resources/views/venues/show.blade.php:400`) and would be copied from menus. Real menus put brands in them ("Martini Vibrante lub Floreale & Kinley Tonic", Pandan). The no-brand test covers catalogue products only. A Launch issue whether or not the pipeline is built; it also goes against the acquisition record's "written descriptions are not [copied]".
2. **Demo recipes break the category-names rule** (`database/seeders/ProductSeeder.php:77-86`): "Gin z tonikiem bezalkoholowy" / "Gin & Tonic 0%", descriptions "Gin 0% i tonik", "Gin 0%, gorzki aperitif…", "bez rumu", "bez wódki". Demo data, but it's the template for production entries. "Espresso martini" is borderline (Martini is a trademark; the cocktail name is customary).
3. **Venues named after an alcohol brand** (brewery taprooms) — the ban covers services too. Recommendation: not in V1, as a reason to reject at approval; no code.
4. **Unbranded menu lines** — "Piwo bezalkoholowe" (Karczma), "Wino bezalkoholowe białe lub czerwone" (Spaccanapoli), "Lech free (różne smaki)" — fit neither a catalogue product nor a house drink; the importer refuses them today, and under the kebab rule ("a named item… with a price") such a venue may not qualify. The pipeline will hit this constantly.
5. **Smoothies under a mocktail heading** (Cud Miód) — not covered by *what-belongs-in-the-catalogue*. Kombucha, sparkling tea and lemonade already are (out, test 3).
6. **Cold-outreach mailbox:** *transactional-email-provider* plans cold B2B mail on a separate subdomain. Marketing e-mail needs prior consent in Poland, B2B included (Prawo komunikacji elektronicznej) — retire it. A GDPR notice to a venue must not double as a "claim your listing" invite.
7. **Prompt injection:** fetched menu text is untrusted input to the model. Covered by the strict JSON schema, never executing output, and human approval — keep all three.

## 5. What the prototype proved, and what it didn't

**Proved:**
- **Haiku 5.5** reads Polish menus well and cheaply: 17 menus ≈ $0.014 at batch price; 68 requests (runs a+b twice) cost $0.065. No refusals, no cut-offs, no invalid JSON in 108+ calls.
- **But it is not stable:** two identical runs disagreed on 109 field values (names, language, sizes, brands), and one run put the alcoholic 55 PLN price into The Roof's mocktails. Human approval is mandatory; running each menu twice and highlighting disagreement is a cheap review signal (recommended).
- **Menus rarely state style (21 of 67 drinks) or strength (30 of 67 unknown).** UNI doesn't need them from the menu: style and `abv_status` come from the matched catalogue product.
- Batch API turnaround was 2 min 40 s for 17 requests (not needed in V1).

**Not proved — the biggest remaining unknown:** finding a menu from a venue's **homepage**. All 5 fetched files were direct PDF links; 12 were added by hand. JS sites, cookie walls and Drive/Issuu links were never met. Links without a file extension vanish silently.

**Prototype bugs not to port** (detail in `LARAVEL_HANDOFF_ADDENDUM.md` §1, §2.6, §8.4):
- Text compaction runs per page and drops repeated short lines, prices included (Spaccanapoli Merlot lost its price), while cross-page footers survive. Rebuild: never drop lines with digits; dedupe only lines repeating on ≥50% of pages.
- Garbled or interleaved text layers (Bierhalle, Pod Niebną) pass the ≥80-character check. Add a quality check (mojibake such as `³ œ ¹`), and rasterise those pages.
- Date detection reads the domain (`maj.pl` → May), misses `202506`, accepts `31.02`. Label a Last-Modified date "plik z dnia", never "karta z".
- `srcset` takes the last entry, not the largest; WordPress grouping drops the host; robots.txt allows everything on 401/403.
- The strict schema in the first handoff was never sent; raw HTTP (no SDK) was never tried. The first Laravel call must prove both.
- Token estimates: overhead ≈1,850 per request (not 600); Polish text ≈ chars/1.6.

**Keep from the prototype:** the ≥80-character text check (plus the quality check), rasterising scans at 220 DPI, tiling long images, the date-detection rules (fixed), the link-discovery keyword list (path + link text, never the domain), SHA-256 dedupe, never overwriting files, the model's `notes` shown in the approval view, retry once on Sonnet after a Haiku refusal, an SSRF guard on any fetched URL.

## 6. The extraction schema for UNI (from runs a and b)

| Field | Result in run (b) | Role |
|---|---|---|
| `kind`: branded_product / house_drink / generic_line / out_of_scope | 99% agreement; the only error was the smoothies | Routes each line into the existing import |
| `house_drink_base`: mocktail / nolo_cocktail | 100% correct | `venue_drinks.base_category` |
| `brand_guess` | 96% | Input to `MenuItemResolver`; unknown brand → brand queue |
| `name_as_printed` | 92% exact | Matching key against confirmed spellings; keeps `name` from drifting |
| `product_guess` | 82% agreement | Only with the catalogue match; disagreement → flag |
| `name_pl` | stable; definition incomplete | Public house-drink name. Add: "if the name is already Polish, repeat it" |

Per menu: `restaurant_name` (never a venue key — it's often inferred), `language`, `notes`. Per drink also `category` (6 UNI categories), `abv_as_printed`, `menu_section`.

**Dropped:** prices, descriptions, style, `also_sold_alcoholic` and `is_classic_cocktail_name` (unstable — 62% and 68% agreement — and UNI matches recipes itself), the dual-version prompt line (its only job was keeping alcoholic prices out; it also changed whether kombucha came back). Kombucha is filtered by `kind = out_of_scope`.

## 7. The pipeline as discussed

The only automated way into venue/menu tables is the **approval action**; nothing publishes itself. Everything lives inside UNI as one module (no microservice, no Python service).

- **Candidate sources** (one `sourcing_candidates` table with a `source` column):
  - **A · `brave_content`**: content searches via the Brave Search API (`"piwo bezalkoholowe" karta Warszawa`, `mocktail menu Warszawa`). Start here.
  - **B · `licence_list`**: Warsaw's list of on-premises alcohol licences (BIP: `bip.warszawa.pl/wnioski-i-zezwolenia-na-alkohol`, an HTML list plus a map) → resolve each address to a domain. Owner names are stripped on ingest. Only once A runs dry.
  - `manual` and `submission` enum values from day one. **C** (brewers' "where to drink us" lists, Dry January lists) later.
  - Measure approvals per source after ~100 candidates each.
- **Brave is also used in** the domain resolver (name + address → domain) and as a site-limited fallback for JS sites. **Its free tier is gone** ($5 monthly credit, card required). Its terms forbid storing results beyond transient use: store only the URL of our own fetch, and only after the venue's address or phone is found on that page. **Operators are unverified** — run five test queries before writing code that depends on them.
- **Flow:** candidate → domain resolver → verify the domain (address or phone on the page; target >80%) → collect links (sitemap + homepage) → keyword filter → Haiku picks the menu link only when ambiguous → fetch with robots.txt + TDM checks (`tdm-reservation` header/meta, `/.well-known/tdmrep.json`) → extract (twice) → catalogue match + GUGiK + eligibility → **approval queue** → clean up → periodic refresh by diff.
- **Refresh** tracks the page, not the file (`page_url` + `asset_url`); HEAD/ETag/hash first, normalised-text hash for HTML menus, a semantic diff of NA lines into the queue. A dead domain is flagged high priority as "possibly closed". Menus only on Instagram are `untrackable`.
- **Bot identity:** User-Agent `UNIbot/1.0 (+https://<domain>/bot)`, a public `/bot` page (a new top-level path → `ReservedPaths`, the support rule), a privacy-policy section before the first bulk run. ADR-009 blocks AI scrapers from UNI, so UNI's bot honours robots.txt and TDM opt-outs to the letter.
- **Approval speed is the lever:** keyboard shortcuts, clean cases first, bulk approve; ~45 s per clean venue.

**The admin UI you want, modelled on the prototype's screens:**

| Prototype | UNI admin (Filament) |
|---|---|
| Workspace § Menus | A **menu library** resource: date + where the date came from, source, size; actions *Pobierz z sieci* (textarea of URLs), *Dodaj pliki*, *Sprawdź zapisane strony* |
| Workspace § Run | A bulk action **Wyodrębnij** on selected menus, cost shown in the confirmation |
| Workspace § Activity | A jobs table polled by the page |
| Results | The **extraction view**: per-menu cards, model notes, *Otwórz menu*, each line already matched to the catalogue, **Zatwierdź / Popraw / Odrzuć** writing through `RecordMenuItemAction` |

Full names, brands and descriptions are fine in the admin panel (closed audience). Left out: comparing models, the Batch API, resolution presets.

**The trust-signals ADR (from the chat addendum §1.1, not yet recorded):** two venue-level signals — **freshness** ("Zaktualizowano X temu" + colour; any confirmation earns it, time takes it away) and a **binary owner badge** (a claim earns it); the "verified" checkmark and "Sprawdzona karta" merge into the owner badge; "confidence" becomes a term in the list-ordering formula (inputs undefined); no public colour, label or text reveals who confirmed data. Automation renews freshness only when the source was checked OK this cycle. You rejected colouring "Zaktualizowano" by source.

## 8. Decisions waiting on you

| # | Question | My recommendation |
|---|---|---|
| 1 | Unbranded lines ("Piwo bezalkoholowe") | ✅ **Decided 11.11: they don't count** — not recorded, not qualifying; the pipeline drops `generic_line` before the queue (*kebab-rule* amended). Open for the brand queue: "Lech free (różne smaki)" |
| 2 | Smoothies under a mocktail heading | ✅ **Decided 11.11: out, by the drink** — smoothies, shakes, lemonades, juices and iced tea are out under any heading; a house drink qualifies when built like a cocktail (*what-belongs-in-the-catalogue* amended) |
| 3 | House-drink descriptions | ✅ **Decided and built 11.11: hidden** — an internal note, never published ([[decisions/product/house-drink-descriptions-are-internal]]) |
| 4 | Recipe names with a spirit name | ✅ **Decided and built 11.11:** the category-names rule extended to recipes; G&T → "Botaniczny tonik bezalkoholowy"; Espresso martini kept as the one exception; the product form refuses listed words |
| 5 | Cold-outreach mailbox | Retire it; claim button, social, in person instead |
| 6 | Menu files | ✅ **Decided 11.11: the current file only** — one private copy per venue, opened only by the admin; replaced, rejected and opted-out files deleted; page URL, file URL, SHA-256 and dates always kept |
| 7 | Rejected candidates | Keep, with the reason |
| 8 | Contacts the pipeline saves | Only the venue's general contacts; no names, sole-trader firm names, NIP, named e-mails; business mobiles printed on menus are not saved |
| 9 | The "October pause until the Senate and President decide" the chat mentions | Not found in any record or journal; the 07.10 decision says launch ASAP. Is it real? |
| 10 | Approval publishes within the hour | Fine as it is while production isn't live |
| 11 | Venues named after an alcohol brand | ✅ **Decided 11.11: not in V1** — a rejection reason at approval, kept with the candidate (*no-brand-names-on-public-drink-labels* amended) |
| 12 | Category "Cydr 0%" (the chat flagged a legal definition of cider) | Keep: the same argument would hit "Piwo 0%" and "Wino 0%", and both the category-names record and KCPU's test allow generic words |
| 13 | "(Nie)mocne" SEO slug contains "destylat" | Not urgent — the category is hidden; decide before it goes visible |
| 14 | Run each menu twice | ✅ **Decided 11.11: twice, flag differences** — two Haiku runs, lines where they disagree highlighted with both readings; approval still covers every line |

## 9. Order of work once decided

1. **Docs:** close the two KCPU-dependent records; the pipeline ADR replacing "manual only" (ADR-002 / *venue-data-acquisition-flow*); the trust-signals ADR; retire the cold-outreach plan; records for decisions 1–3; backlog rows in `roadmap/undone-inventory.md`.
2. **Public-page fixes:** house-drink descriptions and recipe names, with the no-brand test extended.
3. **`uni:fetch {url}` core:** SSRF + robots + TDM checks → extraction (Haiku via the HTTP client, the schema in §6, twice) → approval queue on the existing resolver. Synthetic test fixtures for each trap (dual price, garbled layer, bilingual lines), never real menus.
4. **Real-site test:** menu finding from ~20 Warsaw venue homepages.
5. **Brave source A**, after the five operator test queries.
6. **Refresh (diff).** Then Source B, if A runs dry.

Before step 3: check the Haiku pricing and the API details the prototype used against current Anthropic docs.

## 10. Where step 3 stood (end of 11.11, session 1) — superseded by §11

**Paweł, 11.11:** "keep for next session, we don't have time today, make sure we get back to 100% of it next session." So: nothing below is half-done in the working tree; both commits are complete, tested (full suite 1,238 green) and committed on `main` in the application, not pushed.

### Built

| Commit | What | Where |
|---|---|---|
| 1 — fetching | `php artisan uni:fetch {url} [--page=]` fetches one menu and records it against the candidate for its domain. `SafeFetcher` is the only way the pipeline reads the web: `UrlGuard` (public addresses only, ports 80/443, re-checked at every redirect, connection pinned with `CURLOPT_RESOLVE`); `RobotsTxt` (RFC 9309, token `UNIbot`; 404/410 allow, 401/403/5xx refuse); TDM (`/.well-known/tdmrep.json`, the `tdm-reservation` header and meta tag); one request per page; 25 MB cap; UA `UNIbot/1.0 (+APP_URL/bot)`. `MenuSourceRecorder` keeps one private copy per candidate under `sourcing/menus/{sha256}.{ext}` (decision 6); the same content renews `fetched_at`; new content replaces the file and nulls the old row's `storage_path`. Deleting a venue deletes its menu files (`Venue` deleting hook); erasing one makes its candidate a rejection keeping only the domain (`EraseVenueAction`, `SourcingCandidate::REASON_ERASED`); `uni:fetch` refuses a rejected domain | `app/Services/Sourcing/{SafeFetcher,UrlGuard,HostResolver,RobotsTxt,FetchRefused,FetchedDocument,MenuSourceRecorder}.php`, `app/Console/Commands/FetchMenu.php`, `app/Models/{SourcingCandidate,MenuSource}.php`, `app/Enums/{SourcingSource,SourcingCandidateStatus}.php`, two migrations dated 2026_11_11, `config/uni.php` → `sourcing`, `database/schema.md` (new "Sourcing" group) |
| 2 — text | `MenuTextExtractor::extract(MenuSource): MenuText` gives text plus page images. PDF: `pdftotext -layout` per page; a page failing `TextQuality` (under 80 characters; Windows-1250 read as Latin-1; letters interleaved) → `pdftoppm -r 220 -singlefile` to `sourcing/pages/{sha}/page-N.png`, max 20 pages. HTML: `HtmlText` (block text; scripts, styles, nav, footer, forms dropped). Images taller than 3 widths are tiled into pieces two widths tall with 10% overlap. `compact()` drops lines repeated on ≥50% of pages (3+ pages), never a line with a digit. `forgetImages()` deletes page images only, never the menu file. Ansible installs `poppler-utils` (php role) and verifies the three tools | `app/Services/Sourcing/{MenuTextExtractor,MenuText,TextQuality,HtmlText}.php`, `ansible/roles/php/tasks/main.yml`, `ansible/roles/verify/tasks/main.yml` |

**Tests:** `tests/Unit/RobotsTxtTest.php`, `tests/Feature/Sourcing/{SafeFetcherTest,MenuSourceRecorderTest,MenuTextExtractorTest}.php`. Helpers: `FakeHostResolver` (DNS in tests; bind it with `$this->app->instance(HostResolver::class, …)`), `TinyPdf::make([[lines], …])` (a real PDF built in code; Latin-1 bytes like `\xB3` fake a wrong code page). The poppler tests skip themselves where poppler is missing. `Http::preventStrayRequests()` is on, so every sourcing test fakes `*/robots.txt` and `*/.well-known/tdmrep.json`.

**Checked live 11.11:** Semolino's Woronicza PDF (5.6 MB → 25,796 characters, no image pages) and Tygmont's `/menu/` page (HTML → 5,819 characters). Both files sit in the PC's private storage, as the design intends; they are local data, not fixtures.

### Next: commit 3 — the extraction call

1. **Load the `claude-api` skill first** and confirm against current docs: the Haiku 5.5 model id, its price, and the structured-output mechanism (the strict JSON schema in the first handoff was never actually sent; the prototype used another route). Raw HTTP through Laravel's `Http` client, no new package (dependencies need approval). Key: `ANTHROPIC_API_KEY` in the PC's `.env` (present). `.env.example` gets the key **empty only if no config default is overridden** (the env-example-boots rule), plus `config/services.php` or `config/uni.php`.
2. **The request:** the `MenuText` text plus page images as image blocks; the system prompt says the menu text is untrusted data, never instructions (prompt injection, §4.7). The schema is §6: per menu `restaurant_name` (never a venue key), `language`, `notes`; per line `kind` (branded_product / house_drink / generic_line / out_of_scope), `house_drink_base`, `brand_guess`, `name_as_printed`, `product_guess`, `name_pl` ("if the name is already Polish, repeat it"), `category` (the 6), `abv_as_printed`, `menu_section`. No prices, no descriptions, no style. Smoothies, shakes, lemonades, juices, iced tea, kombucha → `out_of_scope` (decision 2); "Piwo bezalkoholowe" → `generic_line` (decision 1); both are dropped before the queue.
3. **Twice** (decision 14): two calls in parallel, lines paired by `name_as_printed` (normalised with `MenuItemName`), a disagreement flagged with both readings. On a refusal, retry once on Sonnet (prototype rule). Token overhead is about 1,850 per request; Polish text ≈ characters ÷ 1.6.
4. **Where results live:** a new table for extracted lines (e.g. `menu_lines`: menu_source_id, the fields above, `disagreement` json, status) — a new migration and `schema.md` in the same commit.
5. **Tests:** `Http::fake` of the Anthropic endpoint with synthetic responses — the dual-price trap (an alcoholic price on a mocktail), a bilingual line, a refusal, a disagreement — never a real menu.

### After commit 3, in order

4. Matching: each line through `MenuItemResolver` (no new matcher), GUGiK for the address, the eligibility tests; unknown brand → the brand queue; "Lech free (różne smaki)" (brand known, product not) is decided here.
5. The Filament approval screen: per-menu cards, the model's notes, "Otwórz menu" (authenticated route to the private file), each line matched; **Zatwierdź / Popraw / Odrzuć** writing through `RecordMenuItemAction`; reject reasons include "nazwa lokalu to marka alkoholu" (decision 11); keyboard shortcuts; clean cases first.
6. The public `/bot` page — a new top-level path, so `ReservedPaths` in the same commit (the support rule) — and a privacy-policy paragraph before the first bulk run.
Then step 4 (menu finding from ~20 Warsaw homepages), step 5 (Brave source A, mostly `filetype:pdf` queries per category and district, domain blocklist, address-or-phone check), step 6 (refresh by diff; source B per district with Typ = Gastronomia).

### Still open, not blocking commit 3

§8 #5 (retire the cold-outreach mailbox), #9 (the "October pause" the chat mentioned — real?), #10, #12, #13; #7 and #8 are already rules in ADR-012, to be ticked. §9 step 1 leftovers: the trust-signals record (text in the chat addendum §1.1) and retiring the cold-outreach plan in *transactional-email-provider*. Ops, later by Paweł's choice: the home server's `migrate:fresh --seed` and one Ansible run. Brave's own pricing and terms pages: Paweł checks later.

## 11. The build, done (11.11, session 2) — resume here

Everything in §9 steps 3–6 is built, tested (full suite 1,344 green) and committed on `main` in the application, not pushed. Full account in [[journals/2026-11-11]] session 2. Paweł's instruction that shaped it: the pipeline's operations are **admin-panel buttons**, not console commands (`uni:fetch` removed).

**In the admin panel, in the order of use:** Kandydaci → *Szukaj lokali (Brave)* (runs listed in Wyszukiwania, counts only) → *Znajdź menu* (per candidate or bulk) → Biblioteka menu → *Wyodrębnij* (Haiku twice, cost shown) → the menu's page: *Utwórz lokal* (GUGiK) or *Powiąż z lokalem*, then *Zatwierdź / Popraw / Odrzuć* per line or *Zatwierdź pewne* → weekly *Odśwież* (and *Zniknęło z karty*). Pozycje z menu filtered to *Nieznana marka* is the brand queue.

**Five matching decisions taken 11.11 (all as recommended):** the model's product guess is only a suggestion; no brand-queue table; a brand without a product never qualifies ("Lech free (różne smaki)"); GUGiK at approval; `has_price` in the schema (no price → doesn't qualify).

**Measured live:** reading ≈ $0.005 per menu (read twice), 27 s for two menus; 5 Brave searches → 22 domains → 8 verified candidates → 4 venues; the finder right on 2 of the 4 before fixes (kids' and half-board menus, bar photos), and from Semolino's Woronicza page it found the May 2026 menu.

**Open:**
1. **Before the first bulk run:** the processor agreement with Anthropic (the privacy policy names it as a recipient, without claiming an agreement).
2. Source A's yield — tune the query templates (`config/uni.php` → `sourcing.search.queries`) over a few runs; the blocklist is there too.
3. Chains — one candidate per domain keeps one current menu; Semolino has six locations. Workaround: start from a location's page.
4. Haiku picking the menu link when the ranking is unsure — not built.
5. Source B (permit list) — only if A runs dry; its host doesn't resolve from the PC's sandbox.
6. §8 #5, #9, #10, #12, #13; the trust-signals record (chat addendum §1.1).
7. The home server: `migrate:fresh --seed` and one Ansible run (poppler), deferred.


## 12. 12.11 — what changed, and the resume point for 13.11

Full account in [[journals/2026-11-12]].

**Done 12.11 (application, tested, committed, not pushed):** *Wyodrębnij z obrazami* — a PDF menu read with every page as text and image, per menu ([[decisions/product/menus-are-read-as-text-images-on-request]]); Brave candidates keep their run and the query that found them, and Wyszukiwania → *Wydajność zapytań* shows candidates / with a menu / venues / rejected per query. Full suite 1,355 green. The PC's dev database was rebuilt (`migrate:fresh --seed`) for the edited create migrations, so the 11.11 local candidates and menus are gone; the home server needs the same on its next deploy.

**Answered 12.11:** the Anthropic DPA is incorporated by reference in Anthropic's Commercial Terms (recorded in `compliance/dpa/README.md` and `compliance/vendors/README.md`); its own text, sub-processors and transfer mechanism are still to be read once from the console before a bulk run.

**Corrected 12.11:** §11's chain workaround ("start from a location's page") does not work — a domain is one candidate, a second location's menu deletes the first's file, and linking moves every menu. Semolino's site shows locations both sharing a menu (Piastów and Ursus: one PDF) and having their own (Wilanów).

**Later on 12.11:** Paweł asked whether the chains recommendation covers six locations with six menus as well as several locations sharing one; it does (each location holds its own current menu; a shared file is stored once). He hasn't accepted it in so many words, so confirm before building. Both repositories were pushed. The permit-list CSV and the home server are for next time.

**Resume here, in order:**
1. Paweł decides [[decisions/product/a-sourcing-candidate-is-a-location]] (recommended: a candidate is a location), then build it: unique on domain + location page, *Dodaj lokalizację*, fetch/find resolve to the location by page, link and rejection per location, shared files stored once.
2. The first real small batch on the PC: one *Szukaj lokali* run → *Znajdź menu* → *Wyodrębnij* (try *z obrazami* on one PDF to measure its cost) → approve. Read *Wydajność zapytań* after it.
3. Source B: Paweł sends the permit-list CSV; check its columns (Typ = Gastronomia, the address) before designing the import (an upload action on Kandydaci; each address still has to become a website).
4. Still open: §8 #5, #9, #10, #12, #13; the trust-signals record; Haiku picking the menu link (held until the batch shows the ranking failing); the home server (`migrate:fresh --seed`, Ansible for poppler).
