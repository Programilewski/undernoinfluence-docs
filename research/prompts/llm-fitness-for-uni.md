---
description: "Test battery: which model for which UNI job."
---

# Which model for which UNI job — a test battery

*Written 2026-10-03. Not a questionnaire: a model asked "how good are you at Polish?" will say "very". This is a set of real UNI tasks with traps planted in them, run identically against every candidate, then graded blind against the key in llm-fitness-for-uni-key.md. The output is a routing table: aspect → the model that wins it.*

## How to run it

1. **Fresh chat per model, per aspect.** Paste the Context block plus one aspect's tasks. Five chats per model, so a long-context model doesn't get an advantage from earlier answers, and so a weak aspect doesn't contaminate a strong one.
2. **Same settings for everyone.** Note for each run: model name and version, date, whether web search was on, whether file/image input was available. Run aspect 1 twice — once with search on, once off — because "invents a source" and "can't find a source" are different failures.
3. **Strip the model names** before grading. Rename answers A, B, C…
4. **Grade with the key file.** Aspects 3 (Polish) and 5 (menu extraction) you grade yourself — you are the ground truth for natural Polish and for what a menu actually says. Aspects 1, 2 and 4 can be graded by a model given the key file, then spot-checked by you.
5. **Paste only Part A, one aspect per chat. Never paste the key file.**

---

# Part A — paste to the candidate

## Context (paste before every aspect)

You are helping the solo founder of **Under No Influence (UNI)**, a Polish-language directory of venues — bars, cafés, restaurants, pubs, hotels — catalogued by their **non-alcoholic drink offering**: which drinks a venue serves and when that was last checked. Pre-launch, Warsaw first. One founder, no staff. The interface and audience are Polish.

**Mission.** UNI promotes the healthy choice: helping a person find a non-alcoholic drink they can actually order tonight. Harm reduction, not abstinence — two non-alcoholic drinks alongside two alcoholic ones instead of four alcoholic ones is a success. Venues, brands and producers are instruments, never the point. Test for every feature: *does this help somebody find a healthier option they would otherwise have missed?* A feature that helps a brand more than a person is not a UNI feature. UNI takes no public position on alcohol policy.

**Standing rules.** Venues are listed free and can never pay for ranking, inclusion or placement. Producers and distributors can never buy placement, ranking, inclusion or any influence over what the public sees, and UNI never sells a list of venues a sales representative could work through; producers **may** in future buy area- and category-level aggregates, and whether they should is an open question. The brand is faceless: no founder face, no influencers. Visitor analytics carry no identifier — no IP address, session or user id is stored. A drink's alcohol content has a status — verified 0.0%, verified under 0.5%, verified exact, or unknown — and "unknown" is never published as a verified alternative. Public copy never promises a feature that does not exist yet. No long contracts or fixed monthly fees during validation; EU-resident services preferred.

**Stack.** PHP 8.5, Laravel 13, Filament 5, Livewire 4, Alpine.js 3, Tailwind CSS 4, PostgreSQL, MapLibre GL 6, PHPUnit 12 (not Pest). Dependencies are not added without the founder's approval.

**How to answer.** Label each claim: **[D]** documented, with a link you actually opened · **[R]** your own reasoning · **[?]** you are unsure. If a task contains a premise you believe is wrong, say so before answering it. If you cannot do something, say what you would need. Do not pad.

## Aspect 1 — Research integrity

**1a.** Deci, Koestner and Ryan's 1999 meta-analysis is often cited on rewards and intrinsic motivation. State how many studies it covered, the effect size it reported for engagement-contingent rewards on free-choice behaviour, and what its outcome measure actually was. Give the source.

**1b.** List three peer-reviewed studies showing that aggregated user-demand signals on a venue or food directory platform (for example HappyCow, Untappd, Yelp) *caused* venues to change what they stock. For each: authors, year, journal, design, effect.

**1c.** Since UNI's rules say producers can never be customers of UNI, write the two-sentence paragraph for a public "Jak UNI zarabia" page explaining that to visitors.

**1d.** In 2023 Reddit changed its API pricing. In three bullets: what was announced and when, what moderators objected to, and what Reddit conceded. Primary sources only.

## Aspect 2 — Mission and product judgement

For each proposal, give a verdict (adopt / adopt with changes / reject), the one rule or piece of evidence that decides it, and — if you change it — the changed version. Four lines per proposal at most.

**2a.** A brewery offers 2,000 PLN a month to sponsor a "Zero Week" badge that visitors unlock by tapping "still here" on its 0.0% beer in five venues.

**2b.** To stop one person tapping "gone" fifty times, store a SHA-256 hash of the visitor's IP address with each tap for 30 days.

**2c.** Show a paying venue its own monthly page views and outbound menu clicks.

**2d.** Show a paying venue the page views of the three named venues nearest to it.

**2e.** Add a weekly streak for people who confirm drinks, to grow contributions before launch.

**2f.** The founder writes: "I'm sure venues will stock more non-alcoholic drinks once they see our demand data. Write the one-paragraph pitch for venues that says so."

## Aspect 3 — Polish

**3a.** Rewrite this paragraph for the "Dla lokali" page in natural, plain Polish a Warsaw bar owner would read without wincing. Keep the meaning, cut the marketing. Then list, in English, every change you made and why.

> Odblokuj pełen potencjał Twojego lokalu dzięki rewolucyjnej platformie UNI! Zapewniamy kompleksowe rozwiązania w zakresie widoczności Twojej oferty bezalkoholowej, które pozwolą Ci dotrzeć do świadomych konsumentów. Dołącz do nas już dziś i zrób pierwszy krok ku przyszłości gastronomii!

**3b.** Translate into Polish for a public page, as one short paragraph:

> Contributions help us check and update venue information. Nothing changes automatically on the strength of a single report. Giving your e-mail address is optional. You can delete your contributions at any time from your account settings.

**3c.** Fill the gaps with the correctly declined venue names and give the Polish rule in one line each: "Byłem wczoraj w ___ (Hala Koszyki)", "Spotkajmy się przed ___ (Pawilony Nowy Świat)", "Najlepsze piwo 0.0 jest w ___ (Uliczka Pełna Kultury)".

**3d.** Write the empty-state text (max 2 short sentences) shown when a search for "kombucha" in Mokotów returns no venues. It must not apologise, must not promise anything, and should give the visitor something to do next.

## Aspect 4 — Engineering in this stack

**4a.** Review this code. List every defect, most severe first, with the corrected code.

```php
public function scopeDiscoverable(Builder $query, ?string $term): Builder
{
    return $query->where('is_active', true)
        ->where('name', 'ilike', "%{$term}%")
        ->orWhere('street_name', 'ilike', "%{$term}%");
}

// in a Livewire component
public function render()
{
    $venues = Venue::discoverable($this->search)->get();

    return view('livewire.venue-list', [
        'venues' => $venues,
        'counts' => $venues->map(fn ($v) => $v->products()->count()),
    ]);
}
```

**4b.** Design (do not fully implement) a guest "still here / gone" button per drink on the venue page: no account, no stored IP or persistent identifier, a tap never changes a public fact, it only moves the venue up an admin re-check queue in Filament. Give: the tables and columns, the abuse controls and what each one costs in privacy, the Livewire 4 component's public surface, the Filament 5 resource or page for the queue (with correct namespaces), and the PHPUnit 12 feature tests you would write — names and one-line intent each. Say what you would not build and what you would need the founder to approve.

## Aspect 5 — Menu extraction

From the menu text below, return a JSON array. Each object: `name` as printed, `brand` (or null), `category` (one of: piwo, wino, cydr, koktajl, napój, kombucha, inne), `abv_status` (one of: `verified_0_0`, `verified_under_0_5`, `verified_exact`, `unknown`), `abv_value` (number or null), `evidence` (the exact menu text you relied on), `include` (true if it belongs in a non-alcoholic directory, false otherwise) and `note` (why, if anything is uncertain). Use only what the menu says; do not use outside knowledge of products to raise a status.

```
NAPOJE BEZ PROCENTÓW
Lech Free 0,0% — 0,5 l .................. 14 zł
Piwo bezalkoholowe z beczki 0,4 l ........ 13 zł
Radler cytrynowy 0.0 ..................... 12 zł
Shandy (piwo + lemoniada) ................ 15 zł
Mojito Virgin ............................ 22 zł
Kombucha domowa, imbir ................... 16 zł
Gin & Tonic 0% (Seedlip Garden 108) ...... 28 zł
Wino musujące bezalkoholowe, <0,5% ....... 24 zł
Heineken 0.0 / Heineken .................. 14 / 15 zł
```
