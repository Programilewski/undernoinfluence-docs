# Handoff: półautomatyczny pipeline pozyskiwania lokali (Sourcing)

- **Data:** 2026-11-10
- **Dla:** Claude Code (repo UNI)
- **Autor ustaleń:** Paweł + Claude (rozmowa w czacie)
- **Status:** ustalenia kierunkowe; część decyzji czeka na potwierdzenie (sekcja 11)

---

## 0. Jak pracujemy z tym dokumentem

- Tryb pracy bez zmian: **jeden problem naraz — Claude opisuje, Paweł decyduje, potem build, test, commit.** Sesje zapisuj jako datowane journale w `docs/`.
- Ten plik to **kontekst i kierunek, nie gotowa specyfikacja do wykonania jednym ciągiem.** Zacznij od sekcji 12 (kolejność budowy) i przed każdym etapem przedstaw plan do akceptacji.
- Punkty oznaczone **[DO DECYZJI]** nie są przesądzone. Nie implementuj ich po swojemu — zapytaj.
- Pierwsze zadanie: zaproponuj ADR (sekcja 1) i dopisz pozycje do `roadmap/undone-inventory.md` we właściwych grupach (Launch / After launch / V2 / V3).

---

## 1. Cel i zmiana dotychczasowej decyzji

**Cel:** wrzucić na V1 ok. **100+ lokali w Warszawie** (docelowo „ile się da” w wybranych dzielnicach) i mieć **długoterminowy mechanizm pozyskiwania i odświeżania** danych, który skaluje się na kolejne miasta.

**Zmiana:** dotychczasowa decyzja „venue data sourcing: manual only, no scraping” zostaje zastąpiona:

> Wyszukiwanie kandydatów ręczne lub półautomatyczne (Brave Search API + listy publiczne), ekstrakcja menu automatyczna wyłącznie z **własnych stron lokali (first-party)**, **każdy lokal i każda zmiana przechodzi przez akceptację Pawła** w panelu. Nic nie publikuje się samo.

Do zapisania jako nowy ADR (numer: kolejny w repo). Pozostają w mocy: GUGiK jako jedyny geokoder, zakaz Google Maps / OSM / ODbL CSV, ręczne tworzenie marek, katalog i reguły menu.

---

## 2. Granice prawne (twarde wymagania, nie preferencje)

Kontekst: Polska / UE. Paweł nie konsultował tego z prawnikiem — poniższe to ostrożne założenia projektowe.

### 2.1 Co wolno / czego nie
| Dozwolone | Zakazane |
|---|---|
| Fakty z własnej strony lokalu: nazwa, adres, godziny, nazwy pozycji NA, ceny, deklaracja % | Pobieranie z agregatorów: Google Maps, Wolt, Pyszne, TripAdvisor, Uber Eats itp. (regulaminy + prawo sui generis do baz danych, wyrok TSUE CV-Online v Melons) |
| Link do oryginalnego menu | Republikowanie PDF-ów, zdjęć, opisów dań, layoutu menu (prawo autorskie) |
| Handle Instagrama **tylko jeśli podlinkowany na stronie lokalu** | Scrapowanie Instagrama (regulamin Meta zakazuje automatycznego zbierania, także bez logowania) |
| Wyszukiwanie przez oficjalne Brave Search API | Automatyczne odpytywanie Google („dorki” na Google) |

### 2.2 TDM (text and data mining) — art. 26³ pr. aut.
- Kopiowanie treści w celu automatycznej analizy jest dozwolone, **chyba że właściciel zastrzegł opt-out** w formie maszynowo czytelnej.
- **Przy każdym pobraniu** (nie tylko przy imporcie) sprawdzaj:
  1. `robots.txt` (reguły dla `*` i dla naszego User-Agenta),
  2. meta tag / nagłówek HTTP `tdm-reservation`,
  3. `/.well-known/tdmrep.json`.
- Opt-out → stop, status źródła `opt_out`, flaga do przeglądu.
- Kopie robocze tylko na czas ekstrakcji (patrz 2.4).

### 2.3 RODO — dane osobowe
- Mali przedsiębiorcy (JDG) mają nazwę firmy = imię i nazwisko → to dane osobowe. Precedens: UODO ukarało Bisnode (~220 tys. EUR) za scrapowanie danych JDG z rejestrów bez aktywnego powiadomienia (art. 14).
- **[DO DECYZJI — rekomendacja]** Zapisujemy **tylko ogólne kontakty lokalu** (info@, ogólny telefon lokalu, strona, handle IG lokalu). **Nie zapisujemy:** imion, nazwisk, nazw firm JDG, imiennych e-maili (`jan@…`), prywatnych komórek. Przy takiej polityce nie powstaje obowiązek powiadomień z art. 14.
- Model ekstrakcji ma **oznaczać flagą** kontakty wyglądające na osobowe; takich pól nie zapisujemy.
- Kolejka kandydatów (sekcja 4) jest wewnętrzna; odrzuceni kandydaci usuwani automatycznie po np. 30 dniach.

### 2.4 Retencja
- **[DO DECYZJI — rekomendacja]** Surowy plik (PDF/HTML/obraz) usuwany po akceptacji lub odrzuceniu. Zostają: `source_url`, `fetched_at`, hash treści, nagłówki `ETag`/`Last-Modified`.

### 2.5 Marketing — art. 398 Prawa komunikacji elektronicznej
- E-mail, SMS i telefon z informacją handlową/marketingiem bezpośrednim **wymagają uprzedniej zgody**. Brak wyjątku B2B. Opublikowany `rezerwacje@lokal.pl` to nie zgoda.
- Zebranych kontaktów **nie używamy do cold outreachu**. Kontakty służą wyłącznie do wyświetlania na profilu lokalu.
- **[DO DECYZJI]** Dotychczasowa decyzja „manual domain mailbox for V1 cold outreach” jest sprzeczna z art. 398 — do wycofania/zastąpienia (wizyty osobiste, przycisk „to jest mój lokal”, social).

### 2.6 Brave Search API — regulamin
- Regulamin ogranicza przechowywanie wyników (przechowywanie tymczasowe). **Nie zapisujemy list wyników.** Zapisujemy tylko URL, który sami pobraliśmy i zweryfikowaliśmy na stronie lokalu.
- Składnię operatorów (`site:`, typ pliku itp.) **zweryfikuj w aktualnej dokumentacji Brave** — nie zakładaj, że działa jak w Google.

### 2.7 Etykieta bota
- User-Agent: `UNIbot/1.0 (+https://<domena>/bot)`.
- **Do zbudowania:** krótka publiczna strona `/bot`: co pobieramy, po co, jak zgłosić sprzeciw/usunięcie. Plus sekcja w polityce prywatności (polityka jest pisana z tego, co aplikacja faktycznie przetwarza).
- Jedno żądanie na stronę naraz, rate limit per domena, zero rekurencyjnego crawlowania poza znalezieniem menu.

---

## 3. Architektura

### 3.1 Wszystko w UNI, jako wydzielony moduł
- **Nie budujemy mikroaplikacji.** Powody: drugi deploy/monitoring, autoryzacja między aplikacjami, a dopasowanie marek/produktów potrzebuje katalogu UNI.
- Moduł: namespace `App\Sourcing`, własne tabele, własne komendy Artisan, własne zasoby Filament.
- **Granica:** moduł **nigdy nie pisze bezpośrednio** do tabel lokali/menu. Jedyna droga do danych produkcyjnych to **akcja akceptacji** w panelu.

### 3.2 Interfejsy (wymienne implementacje)
```php
interface CandidateSource   // zasila kolejkę kandydatów (źródło A, B, …)
interface UrlResolver       // nazwa + adres → zweryfikowana domena lokalu
interface MenuFinder        // domena → URL aktualnego menu napojów
interface MenuExtractor     // treść menu → ustrukturyzowany JSON
interface LlmClient         // endpoint zgodny z OpenAI (lokalny Ollama lub API)
```
Implementacja może być w PHP, wołać skrypt Pythona albo inny model — reszta UNI tego nie widzi.

### 3.3 Python — furtka, nie serwis
- Domyślnie wszystko w PHP: Laravel HTTP client, parsowanie `robots.txt` (np. `spatie/robots-txt`), sitemap XML i linki przez DOMDocument, tekst z PDF przez binarkę `pdftotext`.
- Jeśli któryś krok okaże się w Pythonie drastycznie prostszy (np. `trafilatura`, `pdfplumber`): **skrypt CLI** wołany przez fasadę `Process`, JSON na stdout, venv instalowany przez Ansible. Bez API, bez osobnego deployu.

### 3.4 Model AI
- Pipeline **niezależny od modelu**: `LlmClient` mówi do endpointu zgodnego z OpenAI; model i URL w `.env`.
- **[DO DECYZJI po teście]** Test na 10 prawdziwych menu (5 PDF tekstowych, 5 skanów/zdjęć): Bielik 4.5B lokalnie (Ollama) vs tani model API z widzeniem. Metryka: % poprawnie wyciągniętych pozycji NA.
- Fakty: Bielik (11B v3, 4.5B v3, Apache 2.0) jest **tekstowy** — skany/zdjęcia wymagają modelu z widzeniem. 11B Q4_K_M ~7,4 GB VRAM przy 2K kontekstu (nie mieści się komfortowo na 8 GB RX 6600 z kontekstem menu); 4.5B się mieści. Na AMD: Ollama/llama.cpp z Vulkan. Ekstrakcja to batch — lokalny model na CPU też jest akceptowalny (przebieg nocny).
- Prawdopodobny wynik: hybryda (tekst → tani/lokalny model, skany → model z widzeniem).

### 3.5 Budżet
- Na V1 zaakceptowane **~100–200 zł** na API (Brave + LLM). To świadomy wyjątek od zasady niskokosztowego V1.
- Twarde limity: limit wydatków ustawiony w panelu Brave i w konsoli dostawcy LLM **oraz** licznik w kodzie: `--budget=<zł>` na przebieg, który zatrzymuje kolejkę.
- Szacunek (do zweryfikowania na pierwszych 50 lokalach): Brave $5/1000 zapytań (miesięczny kredyt ~1000 zapytań), wybór linku przez LLM to ułamek grosza, ekstrakcja kilka–kilkanaście groszy na lokal.

---

## 4. Źródła kandydatów

Wszystkie źródła zasilają **jedną** tabelę `sourcing_candidates` z kolumną `source`. Jeden wspólny dalszy flow.

| `source` | Opis | Rola | Kiedy |
|---|---|---|---|
| `brave_content` (A) | Zapytania po treści przez Brave, np. „piwo bezalkoholowe” karta Warszawa, „mocktail” menu Warszawa | Wysoka trafność (trafia w pozycje NA), łapie lokale bez zezwolenia alkoholowego, od razu daje URL | **Start** |
| `licence_list` (B) | Lista punktów z zezwoleniem „do spożycia w miejscu sprzedaży” (gastronomia) w Warszawie → resolver | Kompletność per dzielnica, niska trafność; ma nazwę firmy (nie nazwę lokalu) + adres → **kluczem jest adres** | Gdy A się wyczerpie / do domknięcia dzielnic |
| `manual` | Ręcznie dodane | — | Od razu (sama wartość enum) |
| `submission` | Zgłoszenia przez „to jest mój lokal” / formularz | — | Od razu (sama wartość enum) |

Uwagi:
- **A:** wyniki zawierają agregatory i artykuły („10 barów z mocktailami”) — nazwy lokali z artykułu można użyć jako tropu (to fakty), treści artykułu nie kopiujemy. Stary PDF w wynikach nie szkodzi — bierzemy z niego tylko domenę.
- **B:** sprawdzić, czy Warszawa udostępnia dane punktów do pobrania (BRG publikuje mapę punktów sprzedaży); jeśli nie — wniosek o informację publiczną (CSV). Filtrujemy typ „gastronomia”, odrzucamy sklepy. **Nie zapisujemy nazwy przedsiębiorcy JDG** — tylko adres punktu.
- **CEIDG** (istniejące ADR-002): traktuj jako **wzbogacenie** — pole www pozwala pominąć resolver.
- **Na później (źródło C, nie teraz):** listy „gdzie nas wypijesz” browarów/producentów NA, listy uczestników akcji typu Suchy Styczeń. Producenci pozostają wewnętrzni — bierzemy tylko fakt istnienia lokalu.
- **Odpadają:** Google Maps, OSM, platformy dostawcze, Instagram.

**Deduplikacja** przed dalszym przetwarzaniem: po domenie i znormalizowanym adresie.

**Pomiar:** po ~100 kandydatach z każdego źródła raport: ile przeszło akceptację per źródło. Decyduje, w co dalej inwestować.

---

## 5. Flow (od kandydata do opublikowanego lokalu)

```
Kandydat (A/B/manual/submission)
  → [1] Resolver domeny (Brave)               ── brak/niezgodne ──→ kolejka ręczna
  → [2] Weryfikacja domeny (adres/telefon na stronie?)
  → [3] Zbieranie linków (sitemap + linki ze strony głównej)
  → [4] Filtr słów kluczowych
  → [5] LLM wybiera URL menu (tylko gdy [4] niejednoznaczny)
  → [6] Pobranie + kontrole TDM/robots + ekstrakcja + test aktualności
  → [7] Dopasowanie do katalogu + geokodowanie GUGiK + kryterium kwalifikacji
  → [8] Kolejka akceptacji w Filament (Paweł)
  → [9] Sprzątanie surowych plików
  → [10] Cykliczne odświeżanie (diff)
```

### [1] Resolver domeny
- Kandydaci URL: pole www z CEIDG → zgadywanie domeny → Brave (np. adres + typ lokalu).
- Odrzucaj domeny agregatorów i social (facebook, instagram, wolt, pyszne, tripadvisor, google…). Strona FB może być zapisana co najwyżej jako link, nie jako źródło menu.

### [2] Weryfikacja domeny (klucz automatyzacji)
- Pobierz stronę główną i/lub kontakt kandydata; sprawdź obecność **znormalizowanego adresu** (ulica + numer) lub telefonu.
- Zgodność → automatyczne przypisanie domeny. Brak → kolejka ręczna.
- Cel: >~80% trafności; jeśli niżej — zostajemy przy ręcznym wyszukiwaniu domen.

### [3] Zbieranie linków
- Sitemap: najpierw linia `Sitemap:` w `robots.txt`, potem `/sitemap.xml`, WordPress `/wp-sitemap.xml`, Yoast `/sitemap_index.xml`.
- **Zawsze dodatkowo** linki z nawigacji/strony głównej (małe strony często nie mają sitemapy, a PDF-y menu rzadko w niej są).

### [4] Filtr słów kluczowych
- Anchory/ścieżki: `menu`, `karta`, `napoje`, `drinki`, `bar`, `.pdf`, obrazy. Jednoznaczny wynik → bierzemy.

### [5] LLM wybiera menu (tylko gdy niejasne)
- Do modelu idzie **lista URL-i + teksty linków**, nie treść stron (kilkaset tokenów).
- Odpowiedź JSON: URL karty napojów albo `brak`. Przy kilku plikach (jedzenie/napoje/lunch) zapamiętaj, który był „napojowy”.
- Fallback dla stron renderowanych JS / ukrytych menu: zapytanie Brave ograniczone do domeny lokalu.

### [6] Pobranie, kontrole, ekstrakcja, test aktualności
- Kontrole z 2.2 przy każdym pobraniu. Jedno żądanie, UNIbot UA, bez rekurencji.
- HTML → oczyszczony tekst; PDF → `pdftotext`; skan/zdjęcie → model z widzeniem.
- **Ekstrakcja tylko pozycji NA** (minimalizacja danych, niższy koszt). Ścisły schemat JSON:
  - lokal: nazwa, adres, godziny, www, handle IG (tylko jeśli podlinkowany na stronie), ogólny telefon, ogólny e-mail, flaga `contact_looks_personal`;
  - pozycje: nazwa, kategoria (jedna z 6 kategorii V1), deklaracja % w brzmieniu z menu (rozróżnienie 0,0% / do 0,5%), cena, pojemność, forma podania (kran / butelka / puszka), styl (np. lager, pszeniczne, IPA; dla wina: kolor, wytrawność, musujące), sugerowana marka (tylko do użytku wewnętrznego — patrz sekcja 14).
  - **Bez opisów dań i zdjęć.**
- **Test aktualności:** czy strona lokalu **nadal linkuje** do tego menu? Jeśli nie (osierocony stary plik) → flaga „możliwe nieaktualne”. Sygnały pomocnicze: data w ścieżce (`/uploads/2025/03/`), `Last-Modified`.

### [7] Dopasowanie i kwalifikacja
- Fuzzy match marek/produktów do katalogu. **Nieznana marka → kolejka do ręcznego utworzenia** (zgodnie z regułą: import odrzuca nieznane marki; marki tworzone ręcznie).
- Klasyki (`is_recipe`) i house drinki wg istniejących reguł katalogu.
- Geokodowanie: **GUGiK** (punkt z rejestru adresów, dzielnica z ULDK), bez fallbacku.
- Automatyczna kontrola kwalifikacji: miejsce, gdzie się siedzi i zamawia, z ≥1 **nazwaną** pozycją NA na **własnej opublikowanej ofercie**.

### [8] Kolejka akceptacji (Filament)
- Widok: wynik ekstrakcji obok podglądu/linku do źródła; akcje Zatwierdź / Popraw / Odrzuć.
- **Szybkość akceptacji to główna dźwignia skali** (budżet nie jest wąskim gardłem): skróty klawiszowe na akcjach, czyste przypadki na górze, akcja masowa „zatwierdź wszystkie bez zmian”. Cel: ~45 s na czysty lokal.
- Jeśli Filament okaże się za wolny → jedna customowa strona Livewire w tym samym panelu, nie nowa aplikacja.
- Zatwierdzenie tworzy/aktualizuje lokal i menu wyłącznie przez akcję akceptacji. Nic nie publikuje się bez kliknięcia.
- Lokale nie-live nadal zwracają 404; dzielnica indeksowana od 3 live lokali (bez zmian).

### [9] Sprzątanie
- Usuń surowy plik po decyzji (patrz 2.4). Zachowaj `source_url`, `fetched_at`, hash, nagłówki.
- Odrzuceni kandydaci usuwani po ~30 dniach.

### [10] Odświeżanie (diff) — najwyższa wartość długoterminowa
- **Śledzimy stronę, nie plik:** dla każdego lokalu `page_url` (stabilna podstrona typu `/menu`, `/karta` lub strona główna) i `asset_url` (konkretny PDF/obraz lub sam `page_url` dla menu w HTML). Przy imporcie z linku do PDF ustal `page_url`; jeśli się nie da — Paweł ustawia raz ręcznie.
- Cykl (scheduler, np. tygodniowo), od najtańszego:
  1. Pobierz `page_url`, wyciągnij linki menu. **Nowy URL pliku** → nowe menu. **Stary URL zwraca 404** → do przeglądu.
  2. Ten sam URL → HEAD i porównanie `ETag`/`Last-Modified`/`Content-Length`; przy różnicy lub braku nagłówków → pobranie i hash.
  3. Menu HTML → hash **znormalizowanego** tekstu treści (bez skryptów, cookies, stopek, dat) — inaczej fałszywe zmiany co tydzień.
  4. Zmiana → ponowna ekstrakcja → **diff semantyczny pozycji NA** (dodane/usunięte/zmiana ceny). Do kolejki trafia tylko diff semantyczny.
- Sygnały specjalne:
  - domena nie działa / strona zniknęła → **możliwe zamknięcie lokalu, wysoki priorytet**;
  - pojawił się opt-out → stop i flaga;
  - menu tylko w obrazie na IG/stories → status `untrackable` (żyje z ręcznego potwierdzania).
- **[DO DECYZJI]** Kiedy automat odnawia świeżość („Zaktualizowano”) — patrz sekcja 8.

---

## 6. Model danych (szkic do dyskusji)

```
sourcing_candidates
  id, source (enum: brave_content|licence_list|manual|submission|…),
  name, address_normalized, district_id?, website_url?, 
  status (new|resolving|resolved|needs_manual|rejected|accepted),
  rejected_at?, created_at, updated_at
  -- bez nazw przedsiębiorców JDG, bez danych osobowych

venue_sources
  id, venue_id, page_url, asset_url, kind (html|pdf|image),
  etag?, last_modified?, content_hash?,
  status (ok|404|blocked|opt_out|untrackable),
  checked_at?, changed_at?

sourcing_extractions   (kolejka akceptacji)
  id, candidate_id? | venue_id?, venue_source_id,
  payload (jsonb: lokal + pozycje NA + flagi),
  diff (jsonb, przy odświeżaniu), flags (jsonb: stale_menu, personal_contact, unknown_brands…),
  status (pending|approved|rejected), decided_at?

sourcing_runs   (budżet i pomiar)
  id, command, budget_limit, spent_estimate, brave_queries, llm_tokens_in, llm_tokens_out,
  started_at, finished_at
```
Nazwy i podział tabel do ustalenia z Pawłem przed migracjami.

---

## 7. Komendy Artisan (szkic)

- `uni:sourcing:collect {source} [--district=] [--budget=]` — zasila kolejkę kandydatów.
- `uni:sourcing:resolve [--budget=]` — resolver + weryfikacja domen.
- `uni:sourcing:extract [--budget=]` — linki → menu → ekstrakcja → kolejka akceptacji.
- `uni:sourcing:refresh` — cykliczne odświeżanie (scheduler).
- `uni:sourcing:prune` — usuwanie surowych plików i starych odrzuconych kandydatów.
- `uni:sourcing:report` — trafność per źródło, koszty z `sourcing_runs`.
- Ręczne wejście: `uni:fetch {url}` — wklejony link do menu przechodzi kroki [6]–[8].

Wszystko na kolejkach Laravela; rate limit per domena.

---

## 8. Powiązane decyzje: odznaki i świeżość (ADR już spisany)

Obowiązuje ADR „Sygnały zaufania i etykiety” (2026-11-10):
- Poziom lokalu: **świeżość** („Zaktualizowano X temu” + zielony/żółty/czerwony; źródło potwierdzenia bez znaczenia — admin, właściciel lub automat; strona bierna celowo) oraz **binarna odznaka właściciela** po claimie.
- Checkmark „verified” i „Sprawdzona karta” scalone w odznakę właściciela; składowa „confidence” przechodzi do reguły kolejności list.
- Brak etykiet źródła na stronach publicznych; brak koloru „Zaktualizowano” zależnego od źródła.
- **[DO DECYZJI]** Automat potwierdza, że *źródło się nie zmieniło*, nie że lokal nadal to serwuje. Propozycja: automat odnawia świeżość tylko gdy `venue_sources.status = ok` i źródło sprawdzono w bieżącym cyklu; `404`/`untrackable` nie są odnawiane automatycznie. Alternatywa: lista „bez zmian” + akcja masowa „Zatwierdź wszystkie” (Paweł potwierdza jednym kliknięciem).

---

## 9. Właściciele i wzrost (kontekst, nie do budowy teraz)

- Oczekiwanie realistyczne: nawet przy dobrym tractionie **większość lokali nie będzie sama aktualizować danych**; zrobią to głównie lokale z NA w pozycjonowaniu, nowe lokale i te, które zobaczą ruch z UNI.
- Strategia: **pipeline robi ~90%, właściciel tylko potwierdza.** W V2 pipeline przygotowuje wersję roboczą menu dla właściciela po claimie (właściciela nigdy nie prosimy o link do menu).
- Wskaźnik: kliknięcia „to jest mój lokal” bez zachęcania (już zaplanowany).
- Rekrutacja właścicieli **bez cold maili/SMS/telefonów** (art. 398 PKE).

---

## 10. Czego NIE robimy

- Mikroaplikacji / osobnego serwisu dla sourcingu.
- Automatycznej publikacji bez akceptacji Pawła.
- Pobierania z Google Maps, OSM, platform dostawczych, Instagrama; automatycznego odpytywania Google.
- Przechowywania list wyników Brave.
- Republikacji PDF-ów, zdjęć, opisów dań.
- Zapisywania danych osobowych (JDG, imienne kontakty).
- Cold outreachu do lokali.
- Źródeł C/D przed pomiarem trafności A i B.
- Wielu miast na V1 — **Warszawa gęsto** zamiast kilku miast rzadko.
- Publicznego wyświetlania **jakichkolwiek** nazw marek produktów (bez wyjątków, także dla marek istniejących tylko jako NA) — sekcja 14.
- Grafik produktowych, logotypów, zdjęć butelek i etykiet — sekcja 14.

---

## 11. Decyzje otwarte — zapytaj Pawła, nie zakładaj

1. **ADR pipeline'u** (sekcja 1) — treść do akceptacji.
2. **Polityka kontaktów** (2.3) — rekomendacja: tylko ogólne kontakty lokalu.
3. **Cold outreach** (2.5) — wycofanie decyzji o skrzynce do zimnych maili i kanał zastępczy.
4. **Model AI** (3.4) — po teście na 10 menu.
5. **Odnawianie świeżości przez automat** (sekcja 8).
6. **Retencja surowych plików** (2.4) — rekomendacja: usuwanie po decyzji.
7. **Strona `/bot` + sekcja w polityce prywatności** (2.7) — treść.
8. **Timing masowej akceptacji** — UNI czeka na decyzję w sprawie nowelizacji ustawy alkoholowej; rekomendacja: zbudować pipeline i przemielić kandydatów, masową akceptację zrobić kilka tygodni przed launchem.
9. **Formuła kolejności list** — otwarta wcześniej; teraz przejmuje też „confidence”.
10. **Schemat tabel i nazwy komend** (sekcje 6–7).
11. **Lokale z marką alkoholową w nazwie** (sekcja 14.4) — zasada wewnętrzna przed launchem.
12. **Atrybuty prezentacji w safe mode** (sekcja 14.5) — które z propozycji wchodzą do V1.
13. **Pozycje ⚠️ w mapowaniu nazw** (sekcja 14.6) — do weryfikacji w tekstach przepisów przed publikacją; do tego czasu obowiązuje nazwa zapasowa.

---

## 12. Kolejność budowy

1. **ADR + backlog** (sekcja 0/1, decyzje 1–3 z sekcji 11).
2. **Rdzeń dla wklejonego linku:** `uni:fetch` → kontrole TDM/robots → ekstrakcja (`LlmClient` niezależny od modelu) → kolejka akceptacji w Filament → sprzątanie. *(minimum do importu)*
3. **Test modeli na 10 menu** → decyzja 4.
4. **Dopasowanie do katalogu** (fuzzy match, kolejka nieznanych marek) — przy 100+ lokalach to warunek, nie dodatek.
5. **Szybka akceptacja:** skróty, sortowanie czystych przypadków, akcje masowe.
6. **Źródło A** (`brave_content`) + resolver + weryfikacja domen + MenuFinder (sitemap, linki, filtr, LLM).
7. **Budżet i raport** (`sourcing_runs`, `--budget`, `uni:sourcing:report`).
8. **Odświeżanie (diff)** — po launchu lub tuż przed.
9. **Źródło B** (lista zezwoleń) — gdy A się wyczerpie.
10. **Strona `/bot` i polityka prywatności** — przed pierwszym masowym przebiegiem na produkcji.

---

## 13. Kryteria „działa” (do testów)

- Wklejony link do PDF z menu kończy jako pozycja w kolejce akceptacji z poprawnymi pozycjami NA, bez zapisanych danych osobowych.
- Strona z opt-outem TDM lub zakazem w `robots.txt` → brak ekstrakcji, status `opt_out`/`blocked`.
- Kandydat z adresem niezgodnym z domeną → kolejka ręczna, nie automatyczne przypisanie.
- Menu niepodlinkowane już ze strony → flaga „możliwe nieaktualne”.
- Nieznana marka → kolejka marek, brak automatycznego tworzenia.
- Przekroczenie `--budget` → przebieg się zatrzymuje.
- Surowe pliki znikają po decyzji; zostaje `source_url` + hash.
- Odświeżenie bez zmian treści → brak pozycji w kolejce; zmiana ceny pozycji NA → diff w kolejce.
- Martwa domena → wysoki priorytet „możliwe zamknięcie”.
- Żadna ścieżka poza akcją akceptacji nie zapisuje do tabel lokali/menu.
- Żadna publiczna strona, post ani eksport nie zawiera nazwy marki produktu, mimo że marka jest zapisana w katalogu.

---

## 14. Safe mode, nazewnictwo i zasady treści

Kontekst: druga, niewiążąca odpowiedź KCPU (10.11.2026, znak DP.44.237.2026). Test KCPU: czy nazwa jest **znakiem towarowym lub oznaczeniem graficznym konkretnej marki alkoholowej**, czy **nazwą zwyczajową**. Promocja napojów bezalkoholowych ze znakiem tożsamym lub bardzo podobnym do znaku napoju alkoholowego jest według KCPU zakazana (art. 13¹ ust. 3). Treści nie mogą zachęcać do nabywania napojów alkoholowych. Odpowiedź dotyczy obecnego stanu prawnego; po ewentualnym wejściu nowelizacji (planowo czerwiec 2027) — ponowna ocena.

### 14.1 Reguła marek (decyzja Pawła)
- **Publicznie żadnych nazw marek produktów. Bez wyjątków** — także dla marek istniejących wyłącznie jako NA. Uzasadnienie: zbyt mało takich marek, by opłacała się implementacja, a wystarczająco dużo, by nie dało się kontrolować, czy któraś nie zacznie promować wersji alkoholowych.
- Marki **zostają w katalogu wewnętrznie** (dopasowanie w pipeline'ie, raporty, przyszłe addytywne włączenie nazw bez strat SEO).
- Brak flagi typu `shares_alcohol_trademark` — świadomie odrzucona.
- Publicznie produkt opisywany nazwą zwyczajową, np. „Piwo bezalkoholowe 0,0% · lager · z kranu”.

### 14.2 Zasady treści
- Zero grafik produktowych, logotypów, zdjęć butelek, etykiet i opakowań — także po ewentualnym wyłączeniu safe mode.
- Nic, co zachęca do nabywania alkoholu: brak porównań typu „smakuje jak prawdziwe piwo”, brak odniesień do alkoholowych wersji produktów, brak oferty alkoholowej lokalu.
- Brak twierdzeń zdrowotnych i wellness („zdrowsze”, „regeneruje”, „detoks”); brak treści kierowanych do małoletnich.
- Brak publicznego stanowiska UNI w polityce alkoholowej (bez zmian).
- Komunikacja nie jest kierowana do osób w trzeźwieniu (bez zmian: organizacje wsparcia nie są kanałem pozyskiwania).

### 14.3 Nazewnictwo — ograniczenia z prawa UE (niezależne od KCPU)
- **Nazwy prawne napojów spirytusowych** (gin, whisky, wódka, rum itd.) nie mogą opisywać napojów bezalkoholowych — wyrok TSUE C-563/24 (13.11.2025, „Virgin Gin Alkoholfrei”, art. 10 ust. 7 rozp. 2019/787); dopisek „bezalkoholowy” nie pomaga. Konsekwencje dla UNI:
  - klasyki: „Gin z tonikiem bezalkoholowy” → przemianować na nazwę opisową bez słowa „gin” (np. „Tonik z botanicznym destylatem 0%” — do ustalenia); „Mojito bezalkoholowe” nie zawiera nazwy prawnej spirytusu → OK;
  - ekstrakcja może zapisać nazwę z menu lokalu wewnętrznie, ale **publiczna nazwa produktu/klasyku nie zawiera nazw prawnych spirytusów**;
  - **Decyzja Pawła:** kategoria „Spirytusowe” zmienia nazwę na **„(Nie)mocne”** — szczegóły w 14.6.
- **Chronione nazwy pochodzenia (ChNP/PDO)**: Prosecco, Champagne/szampan, Porto itd. — nie używać jako stylu ani opisu napojów NA (orzecznictwo o „ewokacji”, np. sprawa Nosecco).
- **Wino:** poprawny termin unijny to **„wino odalkoholizowane”** (≤0,5%); od 18.03.2026 dopuszczone także wina musujące z wina odalkoholizowanego. „Wino bezalkoholowe” jako nazwa zwyczajowa w UI — do decyzji; termin unijny jest bezpieczniejszy.
- **Piwo:** „piwo bezalkoholowe” to termin ustawowy; style piwne (lager, pils, pszeniczne, IPA, stout, sour) to nazwy zwyczajowe.

### 14.4 Przypadek brzegowy — lokale z marką alkoholową w nazwie
- Np. pub nazwany od browaru lub marki piwa. Test KCPU dotyczy znaków towarowych, więc nazwa lokalu zawierająca znak alkoholowy jest ryzykowna.
- **[DO DECYZJI]** Zasada wewnętrzna przed launchem: np. takie lokale nie trafiają do V1 albo są prezentowane bez części nazwy będącej znakiem towarowym (wymaga rozważenia, bo zmiana nazwy lokalu wprowadza w błąd).

### 14.5 Prezentacja oferty w safe mode — propozycje (do decyzji)
Cel: więcej niż „3× piwo bezalkoholowe”, bez marek. Wszystkie atrybuty to fakty z menu lub nazwy zwyczajowe:
1. **Styl / typ** (lager, pszeniczne, IPA, sour, stout; wino: białe/czerwone/różowe, wytrawne/półwytrawne, musujące, szczep).
2. **Forma podania** (z kranu / butelka / puszka) + pojemność + cena. Piwo 0% z kranu to rzadki wyróżnik → kandydat na filtr.
3. **Zawartość: 0,0% vs do 0,5%** — fakt istotny m.in. dla kierowców; bez narracji zdrowotnej.
4. **Pochodzenie producenta bez marki** („rzemieślnicze”, kraj) — atrybuty przypisane ręcznie do marki w katalogu raz, wyświetlane bez nazwy marki.
5. **Profil smakowy** (gorzkie, owocowe, kwaśne, ziołowe, wytrawne) — tylko jeśli podany w menu lub z deterministycznej mapy styl → profil; nie generowany swobodnie przez AI.

Przykład:
```
Piwo bezalkoholowe ×3
· Lager · z kranu · 0,0%
· Pszeniczne · rzemieślnicze · butelka
· IPA · czeskie · do 0,5%
```
Implikacje dla ekstrakcji: pola z punktów 1–3 w schemacie JSON (sekcja 5 [6]); punkt 4 to pola na marce w katalogu (wewnętrzne); punkt 5 opcjonalny.

### 14.6 Mapowanie nazw prawnych/chronionych na nazwy publiczne

**Zasada:** usuń nazwę prawną spirytusu, chronioną nazwę pochodzenia lub znak towarowy i zastąp ją opisem smaku, bazy albo stylu. Klasyczne nazwy koktajli bez nazwy spirytusu i bez znaku towarowego zostają (nazwy zwyczajowe w rozumieniu testu KCPU). ⚠️ = do weryfikacji w tekście przepisu; do tego czasu publicznie obowiązuje nazwa zapasowa.

**Implementacja (bez over-engineeringu):** jedno ręcznie ustawiane pole `public_name` przy klasykach i kategoriach. Pipeline zapisuje nazwę z menu lokalu wewnętrznie, publicznie zawsze pokazywane jest `public_name`. Bez automatycznego mapowania — klasyków jest kilkadziesiąt.

#### Kategoria „Spirytusowe” → „(Nie)mocne” (decyzja Pawła)
- Etykieta w UI: **„(Nie)mocne”**; `aria-label="Niemocne"` (czytniki ekranu różnie czytają nawias).
- **SEO:** nikt nie wyszukuje „niemocne” → `<title>`, H1/podtytuł i opis strony oparte na frazach wyszukiwanych, np. „(Nie)mocne: bezalkoholowe destylaty botaniczne”.
- **Slug:** bez nawiasów — `destylaty-bezalkoholowe` lub `niemocne` (do decyzji; opisowy lepszy dla SEO).
- Świadomy wyjątek tonu: jedyna kategoria będąca grą słów (pozostałe opisowe).
- Lekkie ryzyko ewokacji („mocne” → mocny alkohol): opisy w kategorii nie mogą iść w stronę „jak prawdziwy mocny trunek”.

#### Spirytusy (rozp. 2019/787, wyrok TSUE C-563/24)
| Nazwa prawna | Status dla NA | `public_name` |
|---|---|---|
| Gin | ❌ | Botaniczny z jałowcem 0% |
| Wódka | ❌ | Czysty destylat roślinny 0% ⚠️ |
| Rum | ❌ | Trzcinowy / karmelowo-korzenny 0% |
| Whisky | ❌ | Dymny / dębowy 0% |
| Brandy, Cognac, Armagnac | ❌ (+ chronione nazwy pochodzenia) | Winogronowy dębowy 0% |
| Tequila, Mezcal | ❌ (chronione oznaczenia) | Agawowy 0% |
| Likier | ❌ | Słodki ziołowy / owocowy 0% |
| Bitter (kategoria spirytusu) | ⚠️ | Gorzki aperitif 0% |
| Absynt, pastis, ouzo, sambuca | ❌ / ⚠️ | Anyżowy 0% |
| Wermut | ⚠️ (od 03.2026 dopuszczone wersje NA aromatyzowanych produktów winiarskich — warunki do sprawdzenia) | Ziołowy aperitif winny 0% |

„Destylat” traktujemy jako termin techniczny, nie nazwę prawną kategorii ⚠️.

#### Wino (chronione nazwy pochodzenia)
| Nazwa chroniona | `public_name` |
|---|---|
| Szampan / Champagne | Wino musujące odalkoholizowane, białe, wytrawne |
| Prosecco | Wino musujące odalkoholizowane, białe, owocowe |
| Cava, Crémant | Wino musujące odalkoholizowane |
| Porto, Sherry | Wino słodkie odalkoholizowane / deserowe 0% |
| Glühwein | Grzaniec bezalkoholowy ⚠️ (NA Glühwein wymaga dopisku „owocowy”) |

Termin bazowy: **„wino odalkoholizowane”** (unijny). „Wino bezalkoholowe” dopuszczalne jako nazwa zwyczajowa, ale mniej precyzyjne.

#### Koktajle klasyczne
**Bez zmian (z dopiskiem „bezalkoholowe”):** Mojito, Margarita, Daiquiri, Piña Colada, Cosmopolitan, Moscow Mule, Negroni, Old Fashioned, Paloma, Hugo, Bellini, Mimosa, Spritz, Sex on the Beach, Caipirinha ⚠️ (powiązanie z cachaçą do sprawdzenia).

**Do przemianowania:**
| Nazwa z menu | Problem | `public_name` |
|---|---|---|
| Gin z tonikiem | Gin | Tonik botaniczny |
| Whisky Sour | Whisky | Sour dębowy |
| Rum z colą | Rum | Cuba Libre bezalkoholowe |
| Vodka Martini, Espresso Martini | Wódka + Martini (znak towarowy) | Espresso Shake / kawowy koktajl |
| Tequila Sunrise | Tequila | Sunrise bezalkoholowy |
| Aperol Spritz | Aperol (znak towarowy) | Spritz pomarańczowy gorzki |
| Campari Tonic | Campari (znak towarowy) | Gorzki aperitif z tonikiem |
| Jäger Bomb, Baileys itp. | Znaki towarowe | Opis składu albo pominięcie |

Martini, Aperol, Campari, Jägermeister, Baileys to **znaki towarowe** — odpadają już według testu KCPU, niezależnie od prawa UE.

#### Piwo i cydr
| Nazwa | Status | `public_name` |
|---|---|---|
| Piwo bezalkoholowe | Termin ustawowy | Bez zmian |
| Lager, pils, pszeniczne, IPA, stout, sour | Nazwy zwyczajowe | Bez zmian |
| Kölsch, Bayerisches Bier | Chronione oznaczenia ⚠️ | Jasne lekkie (bez nazw regionalnych) |
| Cydr bezalkoholowy | ⚠️ cydr ma definicję w polskim prawie winiarskim | Bez zmian, jeśli przepis dopuszcza; zapasowo „napój jabłkowy fermentowany 0%” |

**Uwaga:** mapowanie przygotowane w rozmowie, nie przez prawnika. Pozycje ⚠️ zweryfikować przed publikacją.
