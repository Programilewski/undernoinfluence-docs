---
description: "An external review: research, product, Polish, engineering, menu extraction."
---

# UNI — research, product, Polish, engineering, and menu extraction

## Premise corrections

- **[R]** **1c is based on a false premise:** the brief does not say producers can never be customers. It says they can never buy public influence or a venue prospecting list, while future area- and category-level aggregates remain an open commercial option.
- **[R]** **1b asks for evidence that could not be substantiated:** no three qualifying causal studies were identified; inventing them would be worse than returning fewer than three.
- **[R]** **2f asks for an unsupported causal promise:** UNI does not yet have evidence that showing demand data makes venues stock more non-alcoholic drinks.
- **[R]** **3b promises a feature not established in the brief:** “account settings” and self-service deletion cannot appear in current public copy unless those controls exist.
- **[R]** The model-ranking table in Part B cannot be completed because no candidate answers or model versions were supplied. Completing it would require each candidate’s answer and exact model/version identifier.

## Aspect 1 — Research integrity

### 1a. Rewards meta-analysis

- **[D]** Deci, Koestner and Ryan’s 1999 *Psychological Bulletin* meta-analysis covered **128 studies** overall; the engagement-contingent/free-choice subgroup contained 55 studies. It reported **Cohen’s d = −0.40** (95% CI −0.48 to −0.32) for engagement-contingent rewards on free-choice behaviour ([paper PDF](https://leeds-faculty.colorado.edu/dahe7472/deci%201999.pdf); [PubMed record](https://pubmed.ncbi.nlm.nih.gov/10589297/)).[^1][^2]
- **[D]** “Free-choice behaviour” was not rewarded-task performance. It was usually the time participants voluntarily returned to or persisted with the target activity in a later free-choice period, **after the experimental reward contingency had ended**; the paper treated self-reported interest as a separate outcome ([paper PDF](https://home.ubalt.edu/tmitch/642/Articles%20syllabus/Deci%20Koestner%20Ryan%20meta%20IM%20psy%20bull%2099.pdf)).

### 1b. Platform signals and stocking

- **[?]** No peer-reviewed study was identified that both (1) uses aggregated user-demand signals from a venue or food-directory platform such as HappyCow, Untappd or Yelp and (2) causally demonstrates that venues changed what they stocked. Therefore there are **zero studies to list honestly**, not three.
- **[D]** Adjacent Yelp evidence does not fill the gap: Michael Luca used Yelp’s rating-rounding thresholds to estimate an effect on restaurant demand/revenue—about 5–9% per additional displayed star—but did not test whether restaurants changed their inventory or menus ([working paper](https://www.hbs.edu/ris/Publication%2520Files/12-016_a7e4a5a2-03f9-490d-b093-8f951238dba2.pdf)).[^3]
- **[D]** Another adjacent longitudinal study measured restaurant menu changes around the COVID-19 crisis, but its exposure was the crisis and associated supply/financial conditions, not aggregated demand signals from a directory ([study](https://pmc.ncbi.nlm.nih.gov/articles/PMC11213553/)).[^4]
- **[R]** UNI should therefore treat “demand data causes stocking changes” as a hypothesis for a pilot, not as evidence or public copy. A credible future test would randomise eligible venues to receive or not receive the same aggregate demand report, preregister stocking outcomes, and verify menus on a fixed follow-up schedule.

### 1c. “Jak UNI zarabia”

**[R]** Corrected public paragraph, exactly two sentences:

> Producenci i dystrybutorzy nie mogą kupić miejsca w UNI ani wpływać na kolejność, wybór lokali lub informacje widoczne dla użytkowników. W przyszłości możemy oferować im wyłącznie zbiorcze dane o zainteresowaniu kategoriami w poszczególnych obszarach, ale nie listy lokali ani dane pozwalające planować wizyty handlowe.

### 1d. Reddit API, 2023

- **[D]** **Announcement and dates:** on **18 April 2023**, Reddit announced revised developer/API terms, enforced rate limits and premium access; on **9 June 2023**, it specified that higher-volume access would cost **$0.24 per 1,000 API calls from 1 July**, while qualifying low-volume use would remain free ([18 April announcement](https://www.reddit.com/r/reddit/comments/12qwagm/an_update_regarding_reddits_api/); [9 June announcement](https://www.reddit.com/r/reddit/comments/145bram/addressing_the_community_about_changes_to_our_api/)).[^5][^6]
- **[D]** **Moderators’ objections:** the blackout beginning **12 June** protested pricing expected to force major third-party clients to close, the loss of apps used by blind users, and the effect on moderation workflows and tools not matched by Reddit’s own mobile clients ([ModCoord account](https://www.reddit.com/r/ModCoord/comments/145l7wp/todays_ama_with_spez_did_nothing_to_alleviate/)).[^7]
- **[D]** **Concessions:** Reddit exempted non-commercial accessibility-focused apps and said moderator tools/bots would keep free API access, including work to restore approved moderator access to Pushshift; it **did not withdraw the core paid pricing** for large third-party clients ([Reddit response](https://www.reddit.com/r/reddit/comments/145bram/addressing_the_community_about_changes_to_our_api/)).[^8][^5]

## Aspect 2 — Mission judgement

### 2a. Sponsored “Zero Week” badge

- **Verdict — [R] Reject.**
- **Deciding rule — [R]** The brewery would buy public influence and stimulate the very signal that could later be presented as demand; the mechanic serves the producer before the person searching for a healthier option.
- **Changed version — [R]** None. If UNI ever runs a neutral confirmation prompt, it must cover eligible drinks without sponsorship, branding or paid weighting; campaign-induced taps must never enter commercial aggregates.

### 2b. SHA-256 IP hashes

- **Verdict — [R] Reject; replace the control.**
- **Deciding evidence — [D]** Hashing an IP normally pseudonymises rather than anonymises it, and the limited IP space permits dictionary/brute-force matching; pseudonymised data remain personal data ([European Commission](https://commission.europa.eu/law/law-topic/data-protection/data-protection-explained_en); [Dutch DPA](https://www.autoriteitpersoonsgegevens.nl/en/themes/security/security-of-personal-data/data-pseudonymisation)).[^9][^10]
- **Changed version — [R]** Use short-lived signed, venue-and-drink-bound, single-use tokens; a honeypot; cache-only short-window throttling; per-drink aggregate spike detection; and no IP, hash, session ID or fingerprint in report rows.

### 2c. A venue’s own analytics

- **Verdict — [R] Adopt.**
- **Deciding rule — [R]** A venue receiving aggregated metrics about its own page and outbound menu clicks neither buys ranking nor receives a competitor’s private information.
- **Changed version — [R]** Show sufficiently aggregated monthly totals, suppress tiny cells, define “page view” and “menu click,” and keep the paid service operationally separate from listing, ordering and public presentation.

### 2d. Three named nearby venues

- **Verdict — [R] Reject.**
- **Deciding evidence — [D]** EU guidance says reciprocal data-pool participants should in principle see their own information and only final aggregated information about others; individualised commercially sensitive data carries greater coordination risk ([2023 Horizontal Guidelines, paragraphs 395, 406 and 408](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=OJ:JOC_2023_259_R_0001)).[^11]
- **Changed version — [R]** Offer a sufficiently broad, thresholded benchmark such as “median for cafés in this area,” never named competitors’ non-public traffic; facts already public to every visitor may remain named.

### 2e. Weekly contribution streak

- **Verdict — [R] Reject for validation.**
- **Deciding evidence — [D]** In Gundry and Deterding’s preregistered experiment and replication, the game produced more enjoyment but less accurate collected data, with reported effects of **d = −0.68** and **d = −0.40** ([CHI 2022 paper](https://dl.acm.org/doi/fullHtml/10.1145/3491102.3502025)).[^12]
- **Changed version — [R]** Ask for a confirmation only when it resolves a real freshness gap; acknowledge receipt without streaks, leaderboards, volume rewards or public contribution counts.

### 2f. Venue pitch

- **Verdict — [R] Reject the causal promise; use testable, descriptive copy.**
- **Deciding rule — [R]** Aspect 1b found no qualifying causal evidence, so “will stock more” is an unverified hypothesis.
- **Changed version — [R]** “UNI pokazuje, jakich napojów bezalkoholowych ludzie szukają w Twojej okolicy. Te dane mogą pomóc Ci ocenić zainteresowanie ofertą, ale nie przewidują sprzedaży ani nie gwarantują, że zmiana menu się opłaci.”

## Aspect 3 — Polish

### 3a. “Dla lokali”

**[R]** Rewritten copy:

> UNI pokazuje osobom szukającym napojów bezalkoholowych, co mogą zamówić w twoim lokalu. Dodanie lokalu do katalogu jest bezpłatne.

**[R]** Changes and reasons:

- Removed **“Odblokuj pełen potencjał”** because it is an unsupported marketing cliché.
- Removed **“rewolucyjnej platformie”** because the adjective supplies no useful information.
- Replaced **“kompleksowe rozwiązania w zakresie widoczności”** with the concrete action—showing people what they can order.
- Replaced **“świadomych konsumentów”** with **“osobom szukającym napojów bezalkoholowych”** because it describes the audience without flattering or segmenting it vaguely.
- Changed marketing-style **“Twojego”** to ordinary lowercase **“twojego.”**
- Removed **“Dołącz do nas już dziś”** because no submission/onboarding flow is confirmed.
- Removed **“pierwszy krok ku przyszłości gastronomii”** because it is grandiose and makes no operational claim.
- Added that directory inclusion is free because that is a concrete standing rule relevant to a venue owner.

### 3b. Contributions paragraph

- **[R]** Current-safe public copy: **“Zgłoszenia pomagają nam sprawdzać i aktualizować informacje o lokalach. Pojedyncze zgłoszenie nie zmienia niczego automatycznie. Podanie adresu e-mail jest dobrowolne.”**
- **[R]** Do not publish the fourth sentence now. Once accounts and deletion controls actually exist, add: **“Swoje zgłoszenia możesz w każdej chwili usunąć w ustawieniach konta.”**

### 3c. Declension

- **[R]** „Byłem wczoraj **w Hali Koszyki**.” — *w* for location takes the locative; feminine *Hala* becomes *Hali*, while the identifying proper-name element *Koszyki* remains unchanged.
- **[R]** „Spotkajmy się **przed Pawilonami Nowy Świat**.” — *przed* takes the instrumental; plural *Pawilony* becomes *Pawilonami*, while the attached proper name *Nowy Świat* remains in its citation form.
- **[R]** „Najlepsze piwo 0.0 jest **w Uliczce Pełnej Kultury**.” — the location takes the locative: *Uliczka → Uliczce*, and the agreeing adjective becomes *Pełnej*; *Kultury* remains genitive as part of the name.

### 3d. Empty state

**[R]** „Brak wyników dla „kombuchy” na Mokotowie. Poszerz obszar wyszukiwania albo sprawdź kategorię „napoje”.”

## Aspect 4 — Engineering

### 4a. Defects

**[R]** Severity order:

1. **Inactive-row leak:** the ungrouped `orWhere()` produces `(is_active = true AND name matches) OR street matches`, so an inactive venue can leak through by matching `street_name`. Laravel explicitly recommends grouping `orWhere` clauses in a closure ([Laravel 13 query documentation](https://laravel.com/framework/docs/queries)).[^13]
2. **Null/blank search:** interpolating `null` yields `%%`, needlessly matching every active venue instead of omitting the text predicate.
3. **N+1 queries:** `$v->products()->count()` runs one count query per venue; `withCount('products')` adds relationship counts in the main query ([Laravel 13 Eloquent API](https://api.laravel.com/docs/13.x/Illuminate/Database/Eloquent/Builder.html)).[^14]
4. **Unescaped pattern metacharacters:** user-entered `%` and `_` act as `LIKE` wildcards unless escaped; PostgreSQL documents both behaviours and the `ESCAPE` clause ([PostgreSQL pattern matching](https://www.postgresql.org/docs/current/functions-matching.html)).[^15]
5. **Missing return type:** `render()` should declare `Illuminate\Contracts\View\View` for this implementation.
6. **Ambiguous `counts` shape:** `map()` creates a numerically keyed collection divorced from venue IDs. Prefer each model’s `products_count`, or explicitly key a separate map by venue ID.

**[R]** Corrected code:

```php
use Illuminate\Contracts\View\View;
use Illuminate\Database\Eloquent\Builder;

public function scopeDiscoverable(Builder $query, ?string $term): Builder
{
    $term = trim((string) $term);

    return $query
        ->where('is_active', true)
        ->when($term !== '', function (Builder $query) use ($term): void {
            $escaped = str_replace(
                ['!', '%', '_'],
                ['!!', '!%', '!_'],
                $term,
            );

            $pattern = "%{$escaped}%";

            $query->where(function (Builder $query) use ($pattern): void {
                $query
                    ->whereRaw("name ILIKE ? ESCAPE '!'", [$pattern])
                    ->orWhereRaw("street_name ILIKE ? ESCAPE '!'", [$pattern]);
            });
        });
}

// In the Livewire component:
public function render(): View
{
    $venues = Venue::query()
        ->discoverable($this->search)
        ->withCount('products')
        ->get();

    return view('livewire.venue-list', [
        'venues' => $venues,
    ]);
}
```

- **[R]** The Blade view should read `$venue->products_count`. If the existing template contract requires `counts`, pass `$venues->pluck('products_count', 'id')` instead.

### 4b. Guest presence signal

#### Data model

- **[R]** Reuse the existing `venue_drinks`/offering relation as the target. Do not duplicate the venue and drink foreign keys in each event if the relation already identifies both.
- **[R]** `drink_presence_signals`: `id` (bigint/ULID), `venue_drink_id` (FK), `direction` (`still_here|gone`), `reported_at_bucket` (UTC timestamp truncated to one hour), `created_date` only if operational retention needs it. It must contain **no** IP, IP hash, cookie/session ID, account ID, user agent, fingerprint, token/nonce or precise client timestamp.
- **[R]** `venue_drink_rechecks`: `id`, `venue_drink_id` (unique FK), `priority_score`, `still_here_count`, `gone_count`, `last_signal_bucket`, `status` (`queued|reviewing|resolved|dismissed`), `assigned_admin_id` nullable, `reviewed_at` nullable, `resolution` nullable, `notes` nullable. This is an admin workflow record, not a public fact.
- **[R]** Retain consumed nonces and short-window limiter keys in cache only, with TTLs; they are not database tables and are never joined to analytics.

#### Signal path

1. **[R]** Render a random capability token containing `venue_drink_id`, `direction`, random nonce and expiry, signed with the application key and valid for about 10 minutes. Laravel 13 documents expiring signed URLs and signature validation ([signed URLs](https://laravel.com/framework/docs/13.x/urls)).[^16]
2. **[R]** On tap, validate the signature, expiry, target relation, published venue/drink state and direction; atomically consume the nonce in cache so replay fails.
3. **[R]** If abuse checks pass, insert only the coarse signal event and update the queue aggregate in one transaction; `gone` may add more priority than `still_here`, but both only request a re-check.
4. **[R]** Never update `available`, `last_checked_at`, ABV status or any public field. Only an administrator’s evidence-based re-check may do that.

#### Abuse controls

| Control | Function | Privacy cost / limitation |
|---|---|---|
| **[R]** Signed, target-bound, 10-minute token | Stops fabricated IDs/directions and stale submissions | Stores an ephemeral nonce in cache; it identifies a capability, not a person. Refreshing the page can obtain another token. |
| **[R]** Single-use nonce with atomic cache operation | Stops straightforward replay and double-click races | Short-lived cache entry; no cross-visit identity. Laravel cache supports atomic locking, though an atomic `add`/consume design is simpler here ([cache locks](https://laravel.com/framework/docs/cache)).[^17] |
| **[R]** Honeypot plus minimum issue-to-submit time | Removes basic bots | No identifier; can create accessibility false positives if implemented as a focusable or announced field, so hide it accessibly and do not rely on it alone. |
| **[R]** Per-`venue_drink_id` and global rolling limits | Caps floods regardless of source | No personal data; an attacker can exhaust the shared allowance and suppress legitimate taps. |
| **[R]** Aggregate spike detection | Flags improbable bursts for admin review rather than accepting them as truth | Uses only bucketed counts; cannot distinguish a real event from coordinated manipulation. |
| **[D]/[R]** Optional cache-only IP limiter | Laravel’s limiter uses cache and can key a limit by request IP ([rate-limiting docs](https://laravel.com/framework/docs/routing)).[^18] The feature should instead HMAC the IP into a limiter key, keep it for only 5–10 minutes, never write it to the database/logs, and never reuse it. This still processes pseudonymous personal data and creates NAT false positives; it needs explicit founder/privacy approval. |
| **[R]** Edge/WAF throttling | Absorbs larger automated attacks before PHP | The provider processes IPs and may retain logs; approve the provider, region, DPA, retention and configuration before use. |

- **[?]** A literal prohibition on every guest session identifier may conflict with a standard Livewire web request’s session/CSRF path. Confirm whether the rule forbids only storage in UNI’s event/analytics data or also Laravel’s short-lived operational session; if it forbids the latter, the tap should use a minimal stateless signed POST endpoint with Alpine enhancement rather than a Livewire action.

#### Livewire 4 surface

**[R]** Proposed component: `App\Livewire\DrinkPresenceButtons`.

```php
#[Locked]
public int $venueDrinkId;

public string $website = ''; // honeypot

public function mount(VenueDrink $venueDrink): void;
public function report(string $direction, string $token): void;
public function render(): View;
```

- **[R]** `mount()` verifies that the relation belongs to the displayed, published venue. `report()` accepts no venue ID from the tap, validates the direction against an enum/allow-list, delegates to an application service, and returns only neutral acknowledgement such as “Dzięki — sprawdzimy tę informację.”
- **[R]** Tokens should be generated server-side for the rendered relation and direction. No feature-specific cookie, `localStorage`, browser fingerprint or public running total is added.

#### Filament 5 queue

- **[R]** Use `App\Filament\Resources\VenueDrinkRechecks\VenueDrinkRecheckResource` with `Pages\ListVenueDrinkRechecks` and `Pages\ViewVenueDrinkRecheck`; a dedicated list-first resource is preferable to pretending signals are ordinary editable CRUD records.
- **[D]** The table should use `Filament\Tables\Table`, columns under `Filament\Tables\Columns\*`, and row/header actions under **`Filament\Actions\*`**, for example `Filament\Actions\Action`—not the old `Filament\Tables\Actions\*` namespace ([Filament 5 table actions](https://filamentphp.com/docs/5.x/tables/actions)).[^19]
- **[D]** Any page layout uses `Filament\Schemas\Schema` and layout components under **`Filament\Schemas\Components\*`**, such as `Section` ([Filament 5 schemas](https://filamentphp.com/docs/5.x/schemas/overview)).[^20][^21]
- **[R]** Queue columns: priority, venue, drink, district, `gone`/`still here` counts, last signal bucket, last verified date and status. Default order is descending priority, then oldest verification date; filters cover district, direction mix, status and age.
- **[R]** Actions: “Rozpocznij sprawdzanie,” “Otwórz lokal,” “Potwierdź: nadal jest,” “Potwierdź: brak,” and “Odrzuć sygnały.” Only the two evidence-backed confirmation actions may invoke the existing domain service that changes public availability and `last_checked_at`.

#### PHPUnit 12 feature tests

- **[R]** `test_guest_can_submit_a_valid_still_here_signal` — one coarse event is stored and the re-check priority rises.
- **[R]** `test_guest_can_submit_a_valid_gone_signal` — `gone` is recorded and receives the configured queue weight.
- **[R]** `test_invalid_or_expired_token_is_rejected` — tampered and expired signatures create no event.
- **[R]** `test_token_is_bound_to_venue_drink_and_direction` — a token cannot be moved to another offering or reused for the opposite action.
- **[R]** `test_single_use_token_cannot_be_replayed` — the first valid request succeeds and subsequent uses create nothing.
- **[R]** `test_concurrent_replay_creates_at_most_one_signal` — atomic nonce consumption survives a double-submit race.
- **[R]** `test_honeypot_submission_is_discarded` — populated bot field creates neither event nor queue change.
- **[R]** `test_rate_limited_submission_creates_no_signal` — an exhausted limiter rejects or silently discards the request.
- **[R]** `test_unpublished_or_mismatched_offering_is_rejected` — hidden and cross-venue relations cannot receive signals.
- **[R]** `test_guest_signal_never_changes_public_availability` — availability, verification date and ABV fields remain exactly unchanged.
- **[R]** `test_signal_row_contains_no_visitor_identifier_or_precise_timestamp` — schema/persisted row has none of the forbidden fields and time is bucketed.
- **[R]** `test_spike_detection_flags_queue_item_without_publishing_a_fact` — a burst changes only internal review state.
- **[R]** `test_queue_orders_by_priority_then_verification_age` — Filament’s backing query returns the intended order.
- **[R]** `test_admin_resolution_uses_verified_domain_action` — only an authorised admin action with evidence can change the public record.

#### Deliberate exclusions

- **[R]** Do not build accounts, streaks, leaderboards, public vote totals, majority-rule status changes, device fingerprinting, persistent cookies/local storage, database IP hashes, user-agent storage, named competitor analytics, producer access or a public “confirmed by users” badge.
- **[R]** Founder approval is required for migrations and retention, queue weights/thresholds, any transient IP processing, log redaction, edge/WAF processing and DPA, and any new dependency or challenge service. A dependency such as ALTCHA or another CAPTCHA must not be added implicitly.

## Aspect 5 — Menu extraction

**[R]** Extraction uses only the supplied menu. A section heading or recipe label can justify directory relevance, but it cannot elevate an unprinted numerical ABV to a verified status.

```json
[
  {
    "name": "Lech Free 0,0%",
    "brand": "Lech",
    "category": "piwo",
    "abv_status": "verified_0_0",
    "abv_value": 0.0,
    "evidence": "Lech Free 0,0% — 0,5 l .................. 14 zł",
    "include": true,
    "note": "Menu prints 0,0%; the decimal comma is normalized only in the numeric field."
  },
  {
    "name": "Piwo bezalkoholowe z beczki",
    "brand": null,
    "category": "piwo",
    "abv_status": "unknown",
    "abv_value": null,
    "evidence": "Piwo bezalkoholowe z beczki 0,4 l ........ 13 zł",
    "include": true,
    "note": "The menu calls it non-alcoholic but prints no ABV figure; 0,4 l is volume, not ABV."
  },
  {
    "name": "Radler cytrynowy 0.0",
    "brand": null,
    "category": "piwo",
    "abv_status": "verified_0_0",
    "abv_value": 0.0,
    "evidence": "Radler cytrynowy 0.0 ..................... 12 zł",
    "include": true,
    "note": "The menu prints 0.0 but gives no brand."
  },
  {
    "name": "Shandy (piwo + lemoniada)",
    "brand": null,
    "category": "piwo",
    "abv_status": "unknown",
    "abv_value": null,
    "evidence": "Shandy (piwo + lemoniada) ................ 15 zł",
    "include": false,
    "note": "The explicit ingredient is beer and no non-alcoholic or numerical ABV claim is attached to this item; the section heading cannot override that conflict."
  },
  {
    "name": "Mojito Virgin",
    "brand": null,
    "category": "koktajl",
    "abv_status": "unknown",
    "abv_value": null,
    "evidence": "Mojito Virgin ............................ 22 zł",
    "include": true,
    "note": "Virgin makes it directory-relevant as a recipe claim, but no numerical ABV is printed."
  },
  {
    "name": "Kombucha domowa, imbir",
    "brand": null,
    "category": "kombucha",
    "abv_status": "unknown",
    "abv_value": null,
    "evidence": "Kombucha domowa, imbir ................... 16 zł",
    "include": true,
    "note": "No ABV is printed; the menu alone does not verify 0.0% or a sub-0.5% bound."
  },
  {
    "name": "Gin & Tonic 0% (Seedlip Garden 108)",
    "brand": "Seedlip",
    "category": "koktajl",
    "abv_status": "verified_0_0",
    "abv_value": 0.0,
    "evidence": "Gin & Tonic 0% (Seedlip Garden 108) ...... 28 zł",
    "include": true,
    "note": "The item itself prints 0%; Seedlip is the printed brand in parentheses."
  },
  {
    "name": "Wino musujące bezalkoholowe, <0,5%",
    "brand": null,
    "category": "wino",
    "abv_status": "verified_under_0_5",
    "abv_value": 0.5,
    "evidence": "Wino musujące bezalkoholowe, <0,5% ....... 24 zł",
    "include": true,
    "note": "0.5 is the printed exclusive upper bound, not an asserted exact ABV."
  },
  {
    "name": "Heineken 0.0",
    "brand": "Heineken",
    "category": "piwo",
    "abv_status": "verified_0_0",
    "abv_value": 0.0,
    "evidence": "Heineken 0.0 / Heineken .................. 14 / 15 zł",
    "include": true,
    "note": "The slash and paired prices indicate two separate drinks; this object is the explicitly marked 0.0 variant."
  },
  {
    "name": "Heineken",
    "brand": "Heineken",
    "category": "piwo",
    "abv_status": "unknown",
    "abv_value": null,
    "evidence": "Heineken 0.0 / Heineken .................. 14 / 15 zł",
    "include": false,
    "note": "The second product has no non-alcoholic or ABV marker and must not inherit 0.0 from the first product."
  }
]
```

---

## References

1. [A Meta-Analytic Review of Experiments Examining the Effects ...](https://leeds-faculty.colorado.edu/dahe7472/deci%201999.pdf)

2. [A meta-analytic review of experiments examining the effects of ...](https://pubmed.ncbi.nlm.nih.gov/10589297/) - A meta-analysis of 128 studies examined the effects of extrinsic rewards on intrinsic motivation. As...

3. [[PDF] Reviews, Reputation, and Revenue: The Case of Yelp.com](https://www.hbs.edu/ris/Publication%2520Files/12-016_a7e4a5a2-03f9-490d-b093-8f951238dba2.pdf)

4. [Food environments in times of crises: Examining menu changes in ...](https://pmc.ncbi.nlm.nih.gov/articles/PMC11213553/) - The COVID-19 pandemic has affected independently-owned restaurants with implications for food access...

5. [spez (u/spez)](https://www.reddit.com/user/spez/submitted/)

6. [An Update Regarding Reddit's API](https://www.reddit.com/r/reddit/comments/12qwagm/an_update_regarding_reddits_api/) - Reddit will limit access to mature content via our Data API as part of an ongoing effort to provide ...

7. [Today's AMA With Spez Did Nothing to Alleviate Concerns](https://www.reddit.com/r/ModCoord/comments/145l7wp/todays_ama_with_spez_did_nothing_to_alleviate/) - We're joining the Reddit blackout on June 12th, to protest the planned API changes that will kill 3r...

8. [Aborder la communauté au sujet des changements apportés à notre API](https://www.reddit.com/r/reddit/comments/145bram/sadresser_%C3%A0_la_communaut%C3%A9_au_sujet_des/fr/)

9. [Data protection explained - European Commission](https://commission.europa.eu/law/law-topic/data-protection/data-protection-explained_en) - Read about key concepts such as personal data, data processing, who the GDPR applies to, the princip...

10. [Data pseudonymisation](https://www.autoriteitpersoonsgegevens.nl/en/themes/security/security-of-personal-data/data-pseudonymisation) - Pseudonymisation is a security measure. It makes tracing data back to individuals more difficult.

11. [EUR-Lex - 52023XC0721 (01) - EN - EUR-Lex](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=OJ:JOC_2023_259_R_0001)

12. [Trading Accuracy for Enjoyment? Data Quality and Player ...](https://dl.acm.org/doi/fullHtml/10.1145/3491102.3502025) - by D Gundry · 2022 · Cited by 10 — the game generated substantially more enjoyment substantially les...

13. [Database: Query Builder | Laravel 13.x - The clean stack for Artisans ...](https://laravel.com/framework/docs/queries) - Laravel is a framework for building modern web apps and AI agents. Expressive syntax, built-in tools...

14. [Illuminate\Database\Eloquent\Builder - Laravel API](https://api.laravel.com/docs/13.x/Illuminate/Database/Eloquent/Builder.html)

15. [Documentation: 18: 9.7. Pattern Matching - PostgreSQL](https://www.postgresql.org/docs/current/functions-matching.html) - 9.7. Pattern Matching # 9.7.1. LIKE 9.7.2. SIMILAR TO Regular Expressions 9.7.3. POSIX Regular Expre...

16. [URL Generation | Laravel 13.x - The clean stack for Artisans and ...](https://laravel.com/framework/docs/13.x/urls) - Laravel is a framework for building modern web apps and AI agents. Expressive syntax, built-in tools...

17. [Cache | Laravel 13.x - The clean stack for Artisans and agents](https://laravel.com/framework/docs/cache) - Laravel is a framework for building modern web apps and AI agents. Expressive syntax, built-in tools...

18. [Routing | Laravel 13.x - The clean stack for Artisans and ...](https://laravel.com/framework/docs/routing) - Laravel includes powerful and customizable rate limiting services that you may utilize to restrict t...

19. [Actions - Filament](https://filamentphp.com/docs/5.x/tables/actions)

20. [Overview](https://filamentphp.com/docs/5.x/schemas/overview)

21. [Overview](https://filamentphp.com/docs/5.x/forms/overview)

