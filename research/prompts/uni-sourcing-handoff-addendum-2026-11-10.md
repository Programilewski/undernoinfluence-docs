# UNI sourcing handoff: addendum and conflict answers

- **Date:** 2026-11-10
- **For:** Claude Code, read together with `Handoff: półautomatyczny pipeline pozyskiwania lokali (Sourcing)` (10.11.2026)
- **Written by:** Claude (the chat that produced the handoff), from that conversation and from web checks made today
- **Labels used on every point:**
  - **DECIDED by Paweł**: he said it; the paraphrase or quote is given.
  - **PROPOSED by Claude, not confirmed**: I suggested it; Paweł did not reject it, but he didn't explicitly approve it either. "Paweł asked for it to be written into the handoff" counts as approval to *record* it, not as a decision on the substance.
  - **OPEN**: nobody settled it.

> **Where this file lives.** About half of it is legal analysis (sections 3 and 4). The standing record *legal-analysis-stays-out-of-the-repo* applies to it. Unless Paweł reopens that record, don't commit this file to the repo docs. Copy only the product rules (section 2.3) and the open-questions table (section 5) into records and backlog.

---

## 1. What never made it into the handoff

### 1.1 The "Sygnały zaufania i etykiety" ADR, written out in full

Status of the whole ADR: **PROPOSED by Claude.** Paweł asked for it to be saved as an ADR ("Na ten moment zapisz jako ADR"). I produced a file (`ADR-XXX-sygnaly-zaufania.md`) and sent it to him in the chat, so it exists only as a chat attachment, not in the repo. Two of its premises are his decisions, and they are marked below.

**Problem.** The UI had accumulated 5–6 signals with overlapping meanings:
- the binary "verified" checkmark (freshness + confidence, inputs disclosed, weights secret, V1: on claim only);
- three-tier freshness (green/amber/red from `offer_updated_at`);
- a planned "Sprawdzona karta" badge (= the owner manages the venue);
- "Nowe w karcie";
- "Klasyk", "autorski" and "Wariant klasyka | X".

Paweł also asked whether "Zaktualizowano" should take a different colour when the owner made the update.

**Premises:**
- **DECIDED by Paweł:** "Zaktualizowano" is deliberately passive. It is shown whenever we know the offer is current, whoever confirmed it (admin, owner, automation).
- **DECIDED by Paweł:** an owner's update carries more value. First because the owner claimed the venue, second because the owner made the update.
- **DECIDED jointly:** Paweł suggested colouring by source himself and immediately called it over-engineering ("Choć brzmi jak over engineering"). I agreed and gave the reasons below. Treat this as rejected.

**Options considered:**
1. Colour "Zaktualizowano" by source (owner vs others). Rejected for three reasons:
   - it is a source label in disguise, and the existing rule says no source labels on public pages;
   - colour already encodes freshness, so one element would carry two meanings;
   - it would need a legend.
2. Keep the checkmark, the freshness signal and "Sprawdzona karta" as three separate signals. Rejected because three elements would answer two user questions.
3. **Chosen:** one signal per user question, described below.

**Decision (PROPOSED by Claude, recorded at Paweł's request):**
- **Venue level, two trust signals:**
  1. **Freshness.** Answers "Is this still true?". Text "Zaktualizowano X temu" plus green/amber/red. Any confirmation earns it (admin, owner, automation). Time takes it away.
  2. **Owner badge, binary.** Answers "Does the venue itself stand behind this?". A claim earns it. Losing or withdrawing the claim takes it away.
- **Item level, content labels (not trust signals):** "Nowe w karcie" (what changed; owner additions only, existing rules unchanged), and "Klasyk" / "autorski" / "Wariant klasyka | X" (drink type).

**What replaces the "verified" checkmark and "Sprawdzona karta":** both merge into the single owner badge. The checkmark's "freshness" input is already covered by signal 1. Its "confidence" input moves out of the badge and becomes a term in the list-ordering rule (next point).

**Where "confidence" goes in the ordering: PROPOSED by Claude, not confirmed, and underspecified.**
- The ordering rule itself is Paweł's earlier decision: reward confirmation as a state (never recency) and a generous offer with diminishing returns, formula still open, must land before the owner switch.
- My proposal was only that confidence becomes another term in that formula, because an ordering can carry secret weights and a badge can't.
- What "confidence" consists of was never defined in our conversation. Candidate inputs I had in mind: share of drinks confirmed by an owner, source status `ok`, and whether the current menu is still linked from the venue's page. None of these was discussed. **OPEN.**

**Freshness colour thresholds (days for green/amber/red): OPEN. Not discussed in our conversation, and the ADR doesn't define them.**
- The project notes say three-tier freshness exists, based on `offer_updated_at`. If the repo already has thresholds, they win.
- If not, a **PROPOSED by Claude** starting point: green ≤ 60 days, amber 61–120, red > 120. Reasoning: many venues change cards seasonally, roughly quarterly, so red should mean "older than one season plus a margin".
- One rule already applies: **DECIDED earlier by Paweł**, a venue is as fresh as its oldest confirmed drink, plus a "Wszystko nadal w ofercie" action.

**Rules:**
- No colour, label or text on public pages reveals who confirmed the data.
- Every new badge or label must answer three questions before it ships: (1) which user question does it answer, (2) who can earn it, (3) what takes it away. If (1) duplicates an existing signal, it isn't added. **PROPOSED by Claude.**

**What it prevents:**
- badges whose meaning users can't decode;
- disguised source labels;
- secret weights inside something users read as a yes/no fact;
- badge sprawl.

**Revisit when:**
- the owner switch (`UNI_OWNER_ACCESS`) goes on;
- the ordering formula is written;
- or Search Console or user feedback shows people misreading the freshness colours.

**Still open inside this ADR:** when automation may renew freshness (handoff §8). See section 5, item 5.

### 1.2 Decisions, preferences and rejected ideas the handoff left out

| Item | Status |
|---|---|
| The sitemap + Haiku idea for finding the menu on a site was Paweł's: "Nie mogę zgarnąć np sitemapy i do API haiku np wrzucić?" | **DECIDED by Paweł** (as the approach). I added "always also take links from the homepage". |
| Using the Brave API instead of manual Google dorks was Paweł's idea. | **DECIDED by Paweł** |
| Source B (alcohol-licence list → resolver) was Paweł's idea ("własny Search Engine… na podstawie list… pozwolenie na sprzedaż alkoholu"). Building a real search engine or index was rejected; only a resolver was kept. | Idea: Paweł. Rejecting the index: **PROPOSED by Claude**, not contested. |
| Google Custom Search JSON API ruled out. Fact: closed to new customers, discontinued on 1 Jan 2027 (firecrawl.dev and apify.com, read 2026-11-10). | Fact, not a decision |
| Target of ~100 venues on V1: "Chciałbym… wrzucić na v1 około 100 venues". It must also be the long-term mechanism. | **DECIDED by Paweł** |
| Don't make launch wait for 100 venues. Keep the existing "launch with ~30, then keep adding" rule and the December `/suchy-styczen` target. | **PROPOSED by Claude.** Paweł didn't answer. The ~30 launch rule is his earlier decision and still stands. |
| Budget: "do 100 zł powiedzmy na v1 będzie okej czy nawet 200 zł". An explicit exception to the low-cost V1 rule. | **DECIDED by Paweł** |
| Warsaw dense instead of three cities. Paweł asked "3 top miasta albo Warszawę, ale tyle ile się da?". | **PROPOSED by Claude** (Warsaw), not confirmed |
| The bottleneck is approval speed, not money. Invest in keyboard shortcuts and bulk actions in Filament. | **PROPOSED by Claude** |
| Keep sourcing inside UNI; no Python microservice. Paweł raised the worry about technology limits; Python only as a CLI script if ever needed. | **PROPOSED by Claude**, not contested |
| Filament is enough for the approval queue; a custom Livewire page if it proves too slow. | **PROPOSED by Claude** |
| No auto-publish. Every venue and change goes through Paweł's approval. | **PROPOSED by Claude.** Consistent with Paweł's earlier rule that community contributions stay founder-reviewed. |
| Sources beyond A and B (brewery "where to drink us" lists, Suchy Styczeń participant lists, CEIDG as enrichment): later, not now. Add only the `manual` and `submission` enum values now. | **PROPOSED by Claude**. Paweł's "Okej" was not explicit on this. |
| Per-field provenance (from the Perplexity report) rejected for V1; `source_url` + `checked_at` per venue is enough. | **PROPOSED by Claude** |
| Owners will mostly not self-update even with traction; strategy "pipeline does ~90%, owner confirms". | **PROPOSED by Claude** (an assessment, not a rule) |
| Safe mode stays on. Paweł asked "Safe mode zostawiamy włączony?"; I said yes. | **PROPOSED by Claude.** His next decision (no brand names at all) makes it moot. |
| No public product brand names, no exceptions, including NA-only brands: "Nie ma co robić wyjątków dla opcji które mają tylko 0%…" (too few to implement, too many to monitor if a brand starts promoting alcohol). | **DECIDED by Paweł** |
| `shares_alcohol_trademark` brand flag: rejected (same decision). | **DECIDED by Paweł** |
| Category "Spirytusowe" → "(Nie)mocne". | **DECIDED by Paweł** |
| SEO wording, `aria-label`, slug choice for "(Nie)mocne". | **PROPOSED by Claude.** Slug **OPEN**. |
| The name-mapping tables (§14.6). Paweł said "Tak" to writing them into the handoff. | Recording approved. Substance **PROPOSED by Claude**, and it's legal analysis (see conflict 3). |
| The KCPU follow-up letter (27.10) and its brand-free variant ("Piwo bezalkoholowe 0,0% · lager ×2 · pszeniczne", "Mojito bezalkoholowe"). | Paweł's own text and choices |
| Zero product graphics, logos, bottle or label photos, even after safe mode ends. | **PROPOSED by Claude.** Consistent with Paweł's earlier "no images for custom mocktails". |
| Bielik context: Paweł's GPU is an RX 6600 (8 GB); Bielik is text-only. | Facts; the test proposal is superseded (conflict 4) |
| The Perplexity report's PKE art. 398 point changed my advice: the GDPR notice must not double as a "claim your listing" invite. | **PROPOSED by Claude** |

**My errors in the chat, so you don't inherit them:**
- **robots.txt in Polish law.** I said Polish law "recognises robots.txt as an effective opt-out". The source was a low-quality aggregator (law.ungovr.org). Art. 26³ doesn't say that (see section 3, TDM).
- **The legal-analysis record.** I wrote legal analysis into §14 even though that record was in my context. I missed it.
- **The style record.** I didn't know about *menu-lines-describe-style-not-brand* or the 27.10 draught/bottle decision, so §14.5 contradicts them (conflict 1).

### 1.3 Reasoning behind each [DO DECYZJI] recommendation

| # | Recommendation | Why | Alternatives rejected |
|---|---|---|---|
| 1 | ADR for the pipeline | It changes the recorded decision "manual only, no scraping". | Silently changing practice: rejected because records must match reality. |
| 2 | Store only general venue contacts; no owner names, sole-trader firm names, NIP or named e-mails | Bisnode (section 3): data from public registers about people running a business triggers active Art. 14 GDPR notices, and posting a notice on the website wasn't enough. If we never store a person's data, the obligation doesn't arise. | (a) Store and notify each owner. Rejected: notices cost effort, and an e-mail notice risks becoming marketing under PKE art. 398. (b) Store and rely on the Art. 14(5) "disproportionate effort" exemption. Rejected: courts read it narrowly. |
| 3 | Withdraw "manual domain mailbox for V1 cold outreach" | PKE art. 398 requires prior consent for commercial information by e-mail, B2B included (section 3). It also clashes with Paweł's standing rule "outreach waits for traction". | Cold e-mail to the published `rezerwacje@` address. Rejected: a published address is not consent. |
| 4 | Model test (Bielik vs API) | Superseded by the prototype (conflict 4). | — |
| 5 | Automation renews freshness only when the source status is `ok` and the source was checked this cycle | Automation proves "the source didn't change", not "the venue still serves it". An old WordPress PDF can stay unchanged for a year after the card changed. | (a) Never renew automatically. Rejected: Paweł decided the passive "Zaktualizowano" may come from automation. (b) Renew on any unchanged hash. Rejected: overstates what we know. Fallback: a "bez zmian" list with a bulk "Zatwierdź wszystkie" (Paweł confirms with one click). |
| 6 | Delete raw files after the decision | Three reasons: (a) the TDM exception allows keeping copies only as long as the mining needs them (CDSM art. 4(2)); (b) we never republish menus; (c) storage. | Superseded by conflict 5. |
| 7 | Public `/bot` page + privacy-policy section | Transparency for site owners; an objection channel; the privacy policy is written from what the app actually processes. | Silent crawling. |
| 8 | Bulk approval a few weeks before launch | The reason was data going stale if launch slips during Paweł's own amendment pause, not legality. | Superseded by conflict 7. |
| 11 | Venues with an alcohol brand in their name | KCPU's test targets trademarks; a venue name containing one is the closest case. | Not resolved; see section 5. |
| 12 | Safe-mode presentation attributes | Make listings richer than "3× piwo bezalkoholowe". | Superseded by conflict 1. |

---

## 2. Conflicts Claude Code found

### 2.1 §14.5 ideas 4 and 5 vs *menu-lines-describe-style-not-brand*; draught/bottle decided 27.10

- **Known in our conversation?** No. I didn't know about that record or the 27.10 decision. I concede the point: "IPA · czeskie" breaks the record, because a precise combination points to one product, and that is exactly what the record forbids.
- **Changes the recommendation?** Yes.
- **Now recommend:**
  - Drop idea 2 (draught/bottle/can) for launch, per the 27.10 decision.
  - Drop idea 4 (producer country, "rzemieślnicze").
  - Drop idea 5 (flavour profile).
  - Keep idea 1 (style) only as far as the existing record allows.
  - Keep idea 3 (0,0% vs ≤0,5%) only if the record allows a strength claim. Note that classics are always "Bez alkoholu, do 0,5%", never 0,0% (Paweł's earlier rule).
  - Check one more thing against the record's own test: even style + strength can single out a product when only one NA product of that style is on the market (a rare style like sour 0,0%). Apply the record's rule, not mine.

### 2.2 "Rejected candidates deleted after 30 days" vs "retention is anonymisation, never deleting a row"

- **Known?** No; I didn't know the project rule.
- **Changes it?** Yes.
- **Now recommend:**
  - Keep rejected candidate rows with a reason, consistent with the venue-data-acquisition record.
  - Never store personal fields in the first place (holder name, sole-trader firm name, NIP, holder address from the licence list).
  - If any slip in (e.g. the raw licence-list name column), anonymise those fields after the agreed period and keep the row, source, address, district, reason and dates.

### 2.3 §14.3 and §14.6 are legal analysis vs *legal-analysis-stays-out-of-the-repo*

- **Known?** Yes. The record was in my context and I didn't apply it. My error.
- **Changes it?** Yes. Remove the citations, regulations and the reasoning behind the mapping tables from the repo version.
- **Product rules that stand without any citation:**
  1. No product brand names on any public page, post or export. No exceptions. Brands stay in the internal catalogue. (Paweł's decision.)
  2. No product graphics: logos, bottle photos, labels, packaging.
  3. No content that encourages buying alcohol: no "smakuje jak prawdziwe piwo", no references to alcoholic versions, no alcoholic offer of the venue.
  4. No health or wellness claims, no content aimed at minors.
  5. Public names of products, classics and categories never contain the name of a spirit (gin, whisky, wódka, rum, tequila…), a protected place name (Prosecco, szampan, porto, Kölsch…) or a trademark (Martini, Aperol, Campari…). Each classic and category has a hand-set `public_name`; the menu's own wording is stored internally only.
  6. Category label "(Nie)mocne"; the slug is still open.
  7. Preferred public wine term: "wino odalkoholizowane".
  8. Unclear names use the fallback name until checked (section 4).
  9. UNI takes no public position on alcohol policy (existing rule).
- Rules 5 and 7 *come from* legal reasoning, but as product rules they need no citation. The mapping tables can live in the repo as a plain list of `public_name` values without the "why".

### 2.4 Model choice after the prototype (Haiku 5.5: 67/67 drinks, 0 false positives, ~$0.0014/menu, 13 Polish menus)

- **Known?** No; the prototype came after our conversation. Note: Haiku was Paweł's own first instinct ("do API haiku"). The model-agnostic test was my addition.
- **Changes it?** Yes.
- **Now recommend:**
  - **Drop the Bielik/Ollama test.** Its rationale was Polish fluency and zero cost. Fluency doesn't matter for JSON extraction, Bielik can't read scans, and Haiku's cost is negligible.
  - **Drop the OpenAI-compatible `LlmClient`.** With one provider, that's the over-engineering Paweł asked me to call out. Keep one `MenuExtractor` class that calls the Anthropic API directly. It's still a seam for test fakes, but with no provider abstraction.
  - **Budget.** LLM cost is about $1.40 per 1,000 menus. Brave at 2 queries per candidate costs about $10 per 1,000 candidates minus the $5 monthly credit. The 100–200 zł ceiling stays as Paweł's cap, but it will never bind. Drop the in-code `--budget` counter and rely on the usage limits in the Brave dashboard and the Anthropic Console (check that both offer them in your accounts).
  - **Before relying on 67/67, check the 13-menu sample.** Did it include image-only scans, phone photos, multi-page PDFs, and menus where NA items sit inside cocktail sections? If not, add 3–5 such menus. Keep the set as a regression test.
  - **New risk not discussed in the chat:** fetched menu text is untrusted input to the LLM (prompt injection). Mitigations:
    - the system prompt treats the menu as data;
    - output is a strict JSON schema;
    - nothing the model returns is executed;
    - the human approval step stays.

### 2.5 Raw file retention vs the prototype's kept-and-refreshed menu library

- **Known?** Partly. I designed refresh around hashes and headers, so it didn't need the file.
- **Which reasons for deleting still apply if only the current file is kept and replaced or rejected files are deleted?**
  - (a) **TDM retention.** Keeping a copy for *ongoing* mining (re-extraction, diff) is arguably still "necessary for the purposes of text and data mining". CDSM art. 4(2) allows retention for as long as necessary. So keeping the *current* file is defensible and keeping old versions is not. **Uncertain:** I haven't checked the Polish wording of the retention rule.
  - (b) **No republication.** Still applies: the file must be private storage, never served publicly, never linked from UNI (link to the venue's own URL instead).
  - (c) **Storage.** Negligible at this scale.
  - (d) **New reason:** if a venue later adds an opt-out (robots/TDMRep), delete its stored file at that point.
- **Recommend:** keep exactly one current file per source, private, never served. Delete on replace, on reject and on opt-out. That reconciles both designs.

### 2.6 House-drink descriptions shown publicly, with brand names copied from menus

- **Known?** No, not discussed. The handoff's "no dish descriptions" didn't account for the existing "custom mocktails: description only" rule.
- **Changes it?** Yes. It's a hole in the brand rule.
- **Recommend (PROPOSED by Claude):**
  - Never show menu prose verbatim (brand names plus possible copyright in descriptive prose).
  - Extract a normalised ingredient list (`ingredients[]`) with brands stripped. "bezalkoholowy wermut Martini Vibrante, tonik, cytryna" becomes "aperitif winny 0%, tonik, cytryna".
  - Apply the same naming rule 5: no spirit names (and "wermut" is itself a ⚠ item).
  - The reviewer sees original and public text side by side.
- **OPEN for Paweł:** show ingredient lists at all in V1, or only the drink name plus "autorski"?

### 2.7 Waiting for the amendment before bulk approval

- **Known?** The KCPU reply of 10.11 arrived during the conversation, and I already concluded that brand-free content passes its trademark-vs-ordinary-name test. But I didn't revisit decision 8.
- **Is there still a reason to wait?**
  - **Legal reason under current law:** no. The planned content passes KCPU's test (non-binding).
  - **My stale-data reason:** weak now, because refresh will catch changes.
  - **What remains is Paweł's own October rule:** UNI paused until the Senate and the President decide, then watch the market. That is his call, not a legal requirement.
- **Status of the law (checked 2026-11-10):** the Senate passed amendments on 6.11, including NA beer advertising by 46:45 and entry into force June 2027. I found no report that the Sejm has voted on the Senate amendments yet (**unverified**). The President's signature follows.
- **Recommend:** decouple approval from publishing. Approving into the catalogue is safe now (non-live venues return 404). Going live is the gate, and that gate is Paweł's pause rule. If the `/suchy-styczen` target (indexed by early–mid December) matters more to him than waiting, he should decide consciously. The brand-free version doesn't depend on the amendment outcome, because both versions keep NA products without alcohol trademarks outside any ban, as far as the reports show. **OPEN for Paweł.**

---

## 3. Facts verified and sourced (checked 2026-11-10 unless stated)

### Brave Search API
- **Plans and prices:**
  - Search plan: $5 per 1,000 requests, $5 free credit every month (≈1,000 requests), 50 requests/second.
  - Answers plan: $4 per 1,000 plus $5 per million input/output tokens, 2 req/s.
  - The old free tier (2,000 queries/month) was retired in February 2026, and a card is needed to activate.
  - Sources (third parties reading Brave's pricing page): apiserpent.com/blog/free-brave-search-api (read by them 2026-10-23), apidog.com/blog/brave-api-key (Sept 2026), activepieces.com/blog/brave-search-api-pricing-plans-limits-cost-2026 (2026-11-04). **I did not load Brave's own pricing page.**
  - An older Brave docs page (api-docs.search.brave.software/pricing) still lists retired tiers, including "Data" plans with storage rights. Treat as stale; **unverified** whether storage plans are still sold.
- **Rate limits:** a one-second sliding window, HTTP 429 when exceeded, `X-RateLimit-*` headers, and only successful requests billed (third-party summaries of Brave's rate-limit guide: twitterapi.io/blog/brave-search-api).
- **Storage terms:** Search API Terms of Use, https://api-dashboard.search.brave.com/documentation/resources/terms-of-service (the fetched page says "Last updated: 1 Sep, 2026"; a search snippet of the same page showed 11 Feb 2026, so trust the fetched date).
  - Section 3(b): Customer shall not "(i) store, cache, or create a database of Search Results, in whole or in part, other than transient storage required for operation of Customer Applications or related software, service or systems".
  - "Search Results" = "any outputs from calls made to the API". "Transient" is not defined.
  - Also: (xiii) no use of results to train or benchmark AI models; (xiv) no retention of Search Results after the agreement ends.
- **May we keep a result URL after fetching and verifying the page ourselves?**
  - The terms don't say. A URL is "part of" a search result, so read strictly, storing it is restricted.
  - **My interpretation (unverified, not legal advice):** store the *final URL of our own fetch* (after redirects) only once we have verified the venue's address or phone on that page. It's then a fact we observed. Never store unverified result URLs, titles, snippets or rankings, and discard raw API responses after the run.
  - (xiv) matters: if UNI ever stops using Brave, anything that is still a "Search Result" must go, which is another reason to store only our own observation.
  - To remove doubt, ask Brave support. That costs nothing.
- **Operators: unverified.**
  - Brave's own operators help page couldn't be fetched.
  - Third-party lists mention `site:`, `filetype:`/`ext:`, quotes, `-`, `intitle:`, `inurl:`.
  - A 2024 test reported that `filetype:`/`ext:` were ignored in the Brave web UI (virtualcuriosities.com/articles/644).
  - API parameters seen in third-party docs:
    - `q` (≤ 400 chars / 50 words);
    - `country` (2-letter, e.g. `PL`);
    - `search_lang` (`pl`);
    - `ui_lang` (`pl-PL`);
    - `count` (≤ 20);
    - `freshness`;
    - an `operators` boolean.
  - There is no location or radius parameter for web search.
  - **Do this:** run five test queries (`site:`, `filetype:pdf`, a quoted Warsaw street address, `country=PL&search_lang=pl`) before writing code that depends on them.
- **Not evaluated:** Brave added a Place Search endpoint in 2026. It's a maps-style source under the same storage clause. **PROPOSED:** don't use it, consistent with the Google Maps exclusion.

### Source B: Warsaw alcohol licences
- **Published:** BIP page https://bip.warszawa.pl/wnioski-i-zezwolenia-na-alkohol links to:
  - the list of valid permits: https://kalkulatoralkoholi.um.warszawa.pl/alkohole/cbip_zezwolenia_lst.asp;
  - the list of applications and of limits;
  - a map: https://mapa.um.warszawa.pl/mapaApp1/mapa?service=alkohole&L=pl.
  - The page says the lists are published under art. 6(1) of the public information act and the registers are public "z wyłączeniem danych podlegających ochronie".
- **Unverified:** format (it's an `.asp` HTML list; I couldn't open it), fields, any CSV/XLS export, update frequency (the page says applications and limits are published "na bieżąco"; nothing stated for the permit list).
- **Likely fields (unverified for Warsaw):** another city's open-data export of the same register has the columns permit type, point type, NIP, owner (first and last name), firm, activity, street, postcode, district, permit number, validity dates (Jaworzno: otwartedane.um.jaworzno.pl).
- **Fields that could identify a sole trader:** owner's first and last name, the firm name (a sole trader's firm name contains the owner's name by law), NIP, and the owner's own address if listed. Point address + trade name usually don't on their own, but can be linked back via CEIDG.
- **If no download exists, request for public information:**
  - Ask for "wykaz ważnych zezwoleń na sprzedaż napojów alkoholowych przeznaczonych do spożycia w miejscu sprzedaży (gastronomia) na terenie m.st. Warszawy, w formie elektronicznej (CSV lub XLSX), w zakresie: adres punktu sprzedaży, dzielnica, nazwa punktu (jeśli ewidencjonowana), rodzaj zezwolenia (A/B/C), okres ważności".
  - Caveat: asking for a field selection may get it treated as "informacja przetworzona", which requires showing a public interest. Safer: ask for the existing electronic export as-is, and drop personal columns before import.
  - **Deadline:** without undue delay, at most 14 days; extendable to 2 months with notice of the reason (art. 13 of the Act of 6 Sept 2001; confirmed via orzeczenia.nsa.gov.pl judgments and gov.pl pages).

### PKE art. 398
- **Wording (summary of the four paragraphs; standardyprawa.pl/akt/532/art/63603; the official text is Dz.U. 2024 poz. 1221):**
  1. It is forbidden to use automated calling systems or telecommunications terminal equipment (incl. interpersonal communication services, i.e. e-mail) to send commercial information, including direct marketing, to a subscriber or end user, "chyba że uprzednio wyraził on na to zgodę".
  2. Consent may be given by providing an electronic address for receiving commercial information.
  3. It must not be at the recipient's cost.
  4. A breach is an act of unfair competition.
- **B2B:** no exemption. The Ministry's answer to a Sejm interpellation says the protection covers recipients regardless of legal status (api.sejm.gov.pl i12146-o1). prawo.pl reports UOKiK's view that even a contact *aimed at obtaining consent* is direct marketing (prawo.pl/biznes/…,506418).
- **A single "you were listed" e-mail with no offer:**
  - "Informacja handlowa" covers information meant to promote, directly or indirectly, goods, services or the *image* of a business. That definition is from memory (art. 2 pkt 2 of the e-services act), **not re-checked today**.
  - An e-mail telling a venue it's listed on UNI promotes UNI's service. With a claim link or an invitation it almost certainly counts.
  - A bare GDPR Art. 14 notice with no promotional content arguably doesn't, but the line is thin and contested.
  - **Unverified:** no authority or judgment on exactly this case found.
- **Which UNI decision was it?** The project notes record it in the SMTP decision: "Scaleway TEM for transactional; manual domain mailbox for V1 cold outreach". I don't know the record's number; grep the repo for "cold outreach" / "mailbox". It also conflicts with Paweł's standing rule "outreach waits for traction".

### TDM opt-out forms
- **Polish law:** art. 26³ ust. 1–2 of the Copyright Act: mining allowed "chyba że uprawniony zastrzegł inaczej"; the reservation is made "wyraźnie i odpowiednio do sposobu, w jaki utwór został udostępniony" (standardyprawa.pl/akt/19/art/59538, secondary source). The text **doesn't name robots.txt or any format** (my earlier claim corrected).
- **EU law:** CDSM Directive art. 4(3): expressly reserved "in an appropriate manner, such as machine-readable means in the case of content made publicly available online". Recital 18 mentions metadata and website terms and conditions.
- **Case law (Germany, persuasive only in Poland):**
  - Kneschke v LAION. The Hamburg Regional Court (27.9.2024) leaned towards natural-language terms of service being enough.
  - The Higher Regional Court Hamburg (10.12.2025) held that a natural-language ToS reservation was *not* machine-readable as of 2021, with a technology-dynamic standard that may change.
  - Sources: twobirds.com, freshfields TQ blog, openfuture.eu (all read 2026-11-10).
- **Forms in practice:**
  1. robots.txt: the widely recommended form, but it's a crawl directive, not a TDM-specific vocabulary.
  2. TDMRep (W3C Community Group report, not a W3C standard): `tdm-reservation` HTTP header, `<meta name="tdm-reservation">`, `/.well-known/tdmrep.json` (w3.org/community/reports/tdmrep/CG-FINAL-tdmrep-20220216/).
  3. Terms of service in natural language: contested.
- **A blanket `Disallow: /` for all agents:** whether it is a *copyright* reservation is unsettled. Operationally it's a crawl prohibition, so we don't fetch. **Status `blocked`.**
- **PROPOSED:**
  - honour robots.txt (any rule covering our URL for `*` or `UNIbot`) and all three TDMRep forms;
  - no automated ToS parsing (small venue sites rarely have ToS);
  - a reviewer glance at the footer on first approval.

### Bisnode / UODO
- **Facts:**
  - **15 Mar 2019:** UODO fined Bisnode Polska (now Dun & Bradstreet) just over PLN 943,000 (~€220k). It held data on ~7.5 million sole traders and company officers from public registers (CEIDG, KRS, REGON). It e-mailed only those with an e-mail address in the registers (~682k) and posted a notice on its website for the rest. UODO held that this was not enough: Art. 14 requires active notice, and "disproportionate effort" didn't apply.
  - **The WSA Warsaw** (II SA/Wa 1030/19) agreed that Art. 14 applied to people actively running or suspended businesses, but annulled the part about past entrepreneurs and the fine amount.
  - **The NSA dismissed the cassation appeal around 19 Sep 2023** (III OSK 2538/21). It confirmed that transparency is the rule and that the exemption must be read restrictively; the amount went back to UODO.
  - Sources: bip.uodo.gov.pl/en/553/1572, cms.law, prawo.pl.
- **Why it matters for UNI:**
  - The obligation attaches to *personal data* taken from registers.
  - If UNI stores only general venue contacts and no owner name, sole-trader firm name or NIP, there is no data subject to notify. That's why the contacts policy is the cheapest compliance.
  - **Residual uncertainty:** for a sole trader, even venue-level business data can count as personal data when it's easily linkable to the owner. Keep stored fields minimal and never store CEIDG person fields.

### Legal sources cited in §14 (✔ = opened or confirmed today via a source that quotes it; ○ = taken on trust)
| Source | URL | Status |
|---|---|---|
| CJEU C-563/24 (13 Nov 2025), "Virgin Gin Alkoholfrei" | https://www.matheson.com/insights/food-and-beverages-update-non-alcoholic-gin-cannot-be-sold-as-gin-in-the-eu/ | ✔ via commentary, judgment text not opened |
| Reg. (EU) 2019/787 art. 10(7) (legal names in description, presentation, labelling) | via Matheson above | ✔ via commentary |
| Reg. (EU) 2019/787 Annex I categories (bitter, anise drinks, liqueur…) | — | ○ |
| Nosecco / Prosecco PDO evocation (UK High Court 2020) | https://cms.law/en/gbr/legal-updates/nosecco-lost-its-sparkle-logo-trade-mark-application-rejected-by-uk-ipo-and-decision-upheld-by-high-court | ✔ |
| Reg. (EU) 2021/2117 (dealcoholised wine ≤ 0.5%) | https://magazine.wein.plus/news/eu-allows-claim-dealcoholised-for-wine-sparkling-and-semi-sparkling-wine-eu-regulation-regulates-wine-products-with-reduced-alcohol-content-for-the-first-time | ✔ |
| Reg. (EU) 2026/471 (sparkling from dealcoholised wine; NA aromatised wine products; NA Glühwein needs "owocowy" or a fruit name) | https://www.gov.pl/web/wijhars-olsztyn/nowe-przepisy-dla-sektora-wina | ✔ (summary, not the regulation) |
| Kölsch PGI (since 1997; broad "evocation" protection, e.g. "Sölsch" banned) | https://recht.nrw.de/mblnrw/2022-s190 | ✔ |
| Polish wine-products act 2021, art. 5: "cydr" = actual alcohol > 1.2% up to 8.5% | https://standardyprawa.pl/akt/523/art/61997 | ✔ |
| Caipirinha / cachaça protection | — | ○ |
| KCPU letters 27.10 and 10.11.2026 (DP.44.237.2026), non-binding | Paweł's correspondence | ✔ (text pasted in chat) |
| Senate amendments 6.11.2026 | https://spirits.com.pl/senat-zmienia-ustawe-antyalkoholowa/ , https://www.portalsamorzadowy.pl/polityka-i-spoleczenstwo/senat-z-poprawkami-do-nowelizacji-ustawy-o-wychowaniu-w-trzezwosci,683325.html | ✔ |
| "Piwo bezalkoholowe" as a statutory term | — | ○ I called it "termin ustawowy" in the chat without checking. It appears in the Senate amendment, but I haven't verified it in force-law text. |

**A cross-cutting uncertainty I didn't flag in the chat:** the spirit-name and PDO rules bind the "description, presentation and labelling" of beverages, aimed at producers and sellers. Whether a third-party directory naming drinks on venue menus is "presentation" is **unverified**. Rule 5 is cheap, so keep it regardless, but don't treat it as a confirmed legal requirement.

---

## 4. The ⚠ items in §14.6

| Item | What exactly is uncertain | What resolves it | Fallback name until then |
|---|---|---|---|
| Wódka → "Czysty destylat roślinny 0%" | Whether "destylat" in a NA product's description evokes a spirit-drink category | Read Reg. 2019/787 definitions (distillate of agricultural origin) and art. 10 | "Czysty roślinny 0%" (no "destylat") |
| "Destylat" as a technical term (also in the "(Nie)mocne" SEO text) | Same as above | Same | "bezalkoholowe alternatywy mocnych trunków" in SEO copy, or ask Paweł |
| Bitter → "Gorzki aperitif 0%" | Whether "bitter" is a protected legal name; whether "aperitif" is safe | Annex I of Reg. 2019/787 | "Gorzki 0%" |
| Absynt, pastis, ouzo, sambuca → "Anyżowy 0%" | Which of these are legal names or GIs (ouzo is a GI as far as I know; the others unverified) | Annex I + the eAmbrosia register | "Anyżowy 0%" (already neutral, so it's final unless "anyżowy" itself is caught, which is unlikely) |
| Wermut → "Ziołowy aperitif winny 0%" | Reg. 2026/471 allows NA aromatised wine products; whether the name "wermut" may then be used, and on what conditions, is unknown | Read Reg. 2026/471 changes to Reg. 251/2014 | "Ziołowy aperitif winny 0%"; never "wermut" publicly |
| Glühwein → "Grzaniec bezalkoholowy" | The WIJHARS summary says NA Glühwein must carry "owocowy" or a fruit name; whether "grzaniec" is a protected term | Reg. 2026/471 text; "grzaniec" is likely a generic Polish word (unverified) | "Grzaniec owocowy bezalkoholowy" |
| Caipirinha (kept unchanged in the table) | Whether the name is linked to cachaça protection in the EU | eAmbrosia / EU–Brazil agreements | Keep "Caipirinha bezalkoholowa" off public pages until checked; use "Limonkowy koktajl z trzciną 0%" if needed |
| Kölsch, Bayerisches Bier → "Jasne lekkie" | **Now resolved for Kölsch:** PGI confirmed, broad evocation protection. Bayerisches Bier: likely PGI, unverified | eAmbrosia for Bayerisches Bier | "Jasne lekkie" / avoid regional names (final for Kölsch) |
| Cydr bezalkoholowy | **Partly resolved:** Polish law defines "cydr" as > 1.2% alcohol, so the definition excludes 0% products. Whether "cydr bezalkoholowy" in a *description by a third party* is restricted is unverified (it binds product naming by producers) | Ask a lawyer when there's money, or KCPU/WIJHARS informally | **Risk to the category name "Cydr" itself.** Fallback category "Jabłkowe 0%" and item "napój jabłkowy fermentowany 0%". **OPEN for Paweł:** this touches a locked V1 category. |
| General: do these naming rules apply to a directory at all? | See the end of section 3 | A lawyer's view | Apply rule 5 anyway |

---

## 5. Open questions, ordered by what blocks building first

| # | Question | Recommendation | Reasoning |
|---|---|---|---|
| 1 | Pipeline ADR (replaces "manual only, no scraping") | Write it with: Brave (A) + licence list (B), first-party extraction, human approval always, inside UNI, Haiku direct | Everything below hangs on it |
| 2 | Contacts policy | Only general venue contacts; never owner names, sole-trader firm names or NIP; anonymise if they slip in | Cheapest way to avoid Art. 14 notices (Bisnode); fits the anonymisation rule |
| 3 | Cold-outreach mailbox decision | Withdraw it; replace with the "to jest mój lokal" button, in-person visits, social | PKE art. 398 + "outreach waits for traction" |
| 4 | Raw file retention | Keep one current file per source, private, never served; delete on replace, reject or opt-out | Reconciles the prototype library with TDM retention (conflict 5) |
| 5 | When automation renews freshness | Only for source status `ok` and checked this cycle; otherwise a "bez zmian" list with a bulk confirm | Automation proves "unchanged", not "still served" |
| 6 | Freshness thresholds | Use the repo's values if they exist; otherwise start with 60/120 days and tune later | Not discussed; seasonal cards |
| 7 | Brave operators | Run five test queries first | Unverified; a 2024 report says `filetype:` was ignored |
| 8 | Brave URL retention | Store only the verified final URL of our own fetch; optionally confirm with Brave support | The terms forbid storing results "in part"; (xiv) bites if UNI stops using Brave |
| 9 | Prototype sample coverage | Add 3–5 scans, phone photos and multi-page menus to the 13-menu set; keep it as a regression test | 67/67 may not cover the hard cases |
| 10 | House-drink descriptions | Brand-stripped normalised ingredient lists; or name only in V1 (Paweł's call) | Brand rule has no exceptions |
| 11 | Presentation attributes | Style only, as the existing record allows; strength claim only if the record allows it; drop the rest | Conflict 1 |
| 12 | "(Nie)mocne" slug | `destylaty-bezalkoholowe` is better for SEO but contains "destylat" (⚠); `niemocne` is safe but weak for SEO. Decide before launch | Changing a slug later costs SEO |
| 13 | Category "Cydr" vs the legal "cydr" definition (> 1.2%) | Decide whether to keep "Cydr" with the risk, or rename (e.g. "Jabłkowe 0%") before launch | A locked V1 category; renaming later costs SEO |
| 14 | Venues with an alcohol brand in their name | Internal rule before launch. Options: exclude from V1, or list under the name with no other brand content. Don't alter the name, since that misleads | KCPU's test is about trademarks; edge case |
| 15 | Source B data | Try the BIP list first; if no export, file a public-information request for the existing export as-is (14 days / max 2 months) | Only needed after source A is exhausted |
| 16 | `/bot` page + privacy-policy section | Write before the first bulk run on production | Transparency; objection channel |
| 17 | Go-live vs Paweł's amendment pause | Decouple: approve into the catalogue now, go live when Paweł lifts his pause; weigh against the `/suchy-styczen` December target | No legal reason left to wait (conflict 7) |
| 18 | Ordering formula incl. "confidence" | Define confidence inputs when writing the formula (before the owner switch) | Underspecified in the ADR |
| 19 | ⚠ name items | Use the fallbacks in section 4; check the regulations when convenient | Fallbacks are safe now |
| 20 | Sejm vote on Senate amendments | Track it; it doesn't block the brand-free build | Unverified today |
