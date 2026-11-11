---
description: "Resume point for the venue-sourcing pipeline: what the 10.11 handoffs, addenda and prototype runs established, conflicts with existing records, the UNI extraction schema, and ten decisions waiting before any code."
owner: Paweł Milewski
updated: 2026-11-10
status: written at the end of the 10.11 session, which was talk only — no application code changed. Read this first next time; nothing below has been decided unless it says so.
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
- **Brave:** account, credits and API key exist. Next is the five test queries (§7).
- **Brave's own pricing and terms pages:** you'll check them later.
- **Source B's format, from your screenshots** (the list host doesn't resolve from the PC's sandbox, so I haven't loaded it myself):
  - The list page `cbip_zezwolenia_lst.asp` holds 16,671 permits on 834 pages of 20, newest "Ważne od" first. Filters: Adres punktu (text), Dzielnica punktu, Rodzaj, Typ zezwolenia. Columns: Lp., Ważne od, Rodzaj (A ≤4.5% and beer, B 4.5–18% except beer, C >18%), Typ (e.g. "Jednorazowy"), Punkt, Szczegóły.
  - A detail page holds Numer zezwolenia, Data wydania, Ważne od, Ważne do, Punkt, Adres, Rodzaj zezwolenia, and a "Wniosek" link.
  - **Better than the addendum assumed:** neither page shows an owner name, firm name or NIP. "Punkt" is the point's own name. The address is only on the detail page. The "Wniosek" link is the one place personal data could sit, so it is never followed.
  - **To filter out:** one-off event permits ("Jednorazowy", e.g. the Jarmark Warszawski stalls, dozens per event). One venue usually holds up to three permits (A, B, C), so dedupe by normalised address.
  - **Unknown:** the options of "Typ zezwolenia" and "Rodzaj" (the dropdowns), whether the list separates on-premises (gastronomy) from shops, and whether filtering by district keeps the page count small enough to fetch politely.

## 1. KCPU, 10.11 (DP.44.237.2026)

They did not answer the three questions one by one; they restated the test: **is the name a trademark or graphic mark of a specific alcoholic brand, or an ordinary (customary) name?** New in this letter: content must not encourage buying alcohol. They give no individual advice and suggest a lawyer.

For the product: style words ("lager", "IPA", "musujące") and classic cocktail names ("Mojito bezalkoholowe") are ordinary names, so they pass the test. The planned social post contains no trademark. The brand decision already stood on current law; this confirms it. **No code change follows from the letter itself.**

Still to do: close the open KCPU question in *menu-lines-describe-style-not-brand* and the "Revisit when KCPU answers" in *category-names-carry-no-alcoholic-drink-name*, citing the letter by date and reference number only.

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
| 1 | Unbranded lines ("Piwo bezalkoholowe") | One hidden generic product per category that counts towards going live and shows as its category; needs a record, since the kebab rule says "a named item" |
| 2 | Smoothies under a mocktail heading | Out (test 3): only alcohol-free versions of normally alcoholic drinks |
| 3 | House-drink descriptions | Hide them in V1; name + "wersja klasyka" is enough (the chat suggested brand-stripped ingredient lists as the alternative) |
| 4 | Recipe names with a spirit name | Extend the category-names rule; rename G&T, fix the descriptions; Espresso martini your call (I lean keep) |
| 5 | Cold-outreach mailbox | Retire it; claim button, social, in person instead |
| 6 | Menu files | Keep the current file per venue, private, never served; delete replaced, rejected and opted-out files; keep URL, hash and dates |
| 7 | Rejected candidates | Keep, with the reason |
| 8 | Contacts the pipeline saves | Only the venue's general contacts; no names, sole-trader firm names, NIP, named e-mails; business mobiles printed on menus are not saved |
| 9 | The "October pause until the Senate and President decide" the chat mentions | Not found in any record or journal; the 07.10 decision says launch ASAP. Is it real? |
| 10 | Approval publishes within the hour | Fine as it is while production isn't live |
| 11 | Venues named after an alcohol brand | Not in V1; a reject reason at approval |
| 12 | Category "Cydr 0%" (the chat flagged a legal definition of cider) | Keep: the same argument would hit "Piwo 0%" and "Wino 0%", and both the category-names record and KCPU's test allow generic words |
| 13 | "(Nie)mocne" SEO slug contains "destylat" | Not urgent — the category is hidden; decide before it goes visible |
| 14 | Run each menu twice | Yes — about $0.001 per menu, and disagreement marks what to check |

## 9. Order of work once decided

1. **Docs:** close the two KCPU-dependent records; the pipeline ADR replacing "manual only" (ADR-002 / *venue-data-acquisition-flow*); the trust-signals ADR; retire the cold-outreach plan; records for decisions 1–3; backlog rows in `roadmap/undone-inventory.md`.
2. **Public-page fixes:** house-drink descriptions and recipe names, with the no-brand test extended.
3. **`uni:fetch {url}` core:** SSRF + robots + TDM checks → extraction (Haiku via the HTTP client, the schema in §6, twice) → approval queue on the existing resolver. Synthetic test fixtures for each trap (dual price, garbled layer, bilingual lines), never real menus.
4. **Real-site test:** menu finding from ~20 Warsaw venue homepages.
5. **Brave source A**, after the five operator test queries.
6. **Refresh (diff).** Then Source B, if A runs dry.

Before step 3: check the Haiku pricing and the API details the prototype used against current Anthropic docs.
