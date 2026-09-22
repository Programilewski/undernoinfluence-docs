---
version: 1.0
owner: Paweł Milewski
updated: 2026-08-28
status: draft — do przetworzenia
źródło: sesja rozmowy 28.08.2026
---

# Sesja 28.08.2026 — ustalenia do rozdzielenia po vaulcie

Notatka surowa. Nic tu nie jest jeszcze rekordem decyzji ani wpisem w
roadmapie — to materiał do rozdzielenia. Sekcja 6 mówi, co gdzie trafia.

---

## 1. Nowe decyzje i korekty istniejących

### 1.1 Klastrowanie pinów NIE jest tracone — korekta rekordu

`decisions/product/vector-basemap-on-openfreemap.md` mówi, że klastrowanie
pinów zostaje porzucone. To jest nieprawda i trzeba poprawić przed
rozpoczęciem migracji.

MapLibre GL JS klastruje natywnie (`cluster: true`, `clusterRadius` na źródle
GeoJSON). Tracimy wtyczkę `leaflet.markercluster`, nie możliwość.

**Warunek:** klastrowanie działa wyłącznie na ścieżce „źródło GeoJSON +
warstwy `circle`/`symbol`", nie na obiektach `maplibregl.Marker` (DOM).
Czyli warstwa pinów to przepisanie, nie port. Przy `inline-venue-map-data`
dane są już w stronie, więc kształt jest blisko. Zysk dodatkowy: styl
sterowany danymi — kolor pinu per kategoria jako wyrażenie `match` w stylu,
nie warunek w JS.

### 1.2 Styl `dark` w OpenFreeMap jest najsłabiej utrzymywany

`single-palette-no-theming` usunął jasną mapę, więc styl ciemny jest
obowiązkowy. Tymczasem repozytorium stylów OpenFreeMap podaje, że style
wywodzące się z OpenMapTiles (Bright, Positron, **Dark**, Fiord) są porzucone
przez projekt źródłowy, a aktywnie rozwijany jest Liberty. Dark i Fiord są
opisane jako niedokończone, przeniesione bez zmian ze źródła i nie są
wystawione w Quick Start.

**Konsekwencja:** przetestować Dark na Warszawie i na realnych poziomach zoomu
w pierwszych godzinach migracji, nie na końcu. Ręczna praca nad stylem to
realny scenariusz w budżecie 2–4 dni. Ponieważ styl JSON jest w repo,
zaniedbanie upstreamu zamraża, a nie psuje.

### 1.3 Styl JSON nie uniezależnia od OpenFreeMap

Styl MapLibre odwołuje się do `glyphs` (fonty) i `sprite` (ikony) przez URL —
te będą wskazywać na OpenFreeMap. Fallback na Protomaps/PMTiles to więc **nie**
„ten sam kod, inny URL": trzeba też serwować glyphs i sprite'y. Dopisać do
rekordu, żeby fallback był realny, a nie założony.

### 1.4 Atrybucja OSM/OpenMapTiles jest obowiązkowa

Na mapie musi być widoczna atrybucja. To jedyne miejsce, w którym UNI dotyka
ODbL (patrz 2.1).

### 1.5 Kolejność prac analitycznych: 10 → 7 → 9 → 8

Punkty 7 i 10 checklisty dotyczą **tej samej tabeli**. Punkt 7 opisuje rollup
`lokal × dzień × kategoria × licznik`; punkt 10 przenosi `venue_stats` na
kształt długi `(venue_id, date, metric, count)`. Budowanie rollupu przed
przekształceniem = budowanie pod kształt, który zaraz się zmieni.

Jedno przejście, jedna migracja, kolejność: **10 → 7 → 9 → 8**.

### 1.6 Deadline 15.09 dotyczy włączenia schedulera, nie kalendarza

`analytics:prune-events` nigdy nie działał (brak crona — T-25b). Tabela
`events`: 482 wiersze, najstarszy 2026-06-17, retencja 90 dni → pierwszy dzień,
w którym cokolwiek skasuje, to 2026-09-15. Nic nie pęka 15.09, jeśli scheduler
pozostaje wyłączony — ale `uni:check-offer-freshness` musi działać na
produkcji, więc w praktyce: **rollup (T-20a) blokuje scheduler, scheduler
blokuje start.**

### 1.7 Rozdział analityki na dwa niezależne mechanizmy

- **PostHog — wyłącznie client-side**, za zgodą, wyłącznie do wewnętrznego
  czytania lejka. Usunąć `window.__capture` dla czterech zdarzeń całkowicie,
  nie kompensować podwójnego liczenia odejmowaniem.
- **Backend — wyłącznie server-side**, bez zgody (nic nie zapisywane na
  urządzeniu), kanoniczne źródło dla B2B.

**Warunek konieczny:** wszystkie linki wychodzące muszą iść przez własne
przekierowanie. `venue_directions_clicked` już tak ma
(`maps-redirect-type-retained`), ale `venue_website_clicked` i
`venue_instagram_clicked` też muszą — inaczej server-side ich nie zobaczy.

**Do dopisania w `posthog-analytics-role`:** PostHog widzi próbkę (tylko zgody),
backend widzi populację. Nigdy nie porównywać tych liczb.

### 1.8 Wymiar „skąd wejście" w płatnej analityce B2B

Dwie różne metryki o różnej wartości:

- **Punkt wejścia wewnątrz UNI** (mapa / lista / kategoria / wyszukiwanie /
  strona marki) — wysoka wartość, bo działalna: „62% wejść przyszło ze strony
  kategorii *piwo bezalkoholowe*" mówi właścicielowi, co rozszerzyć. Wpina się
  w gap report.
- **Źródło zewnętrzne** — słabsze, poza jednym przypadkiem: „ktoś wyszukał
  nazwę twojego lokalu i trafił do nas". To dowód wartości UNI dla niego
  konkretnie.

Uwagi:
- Referrer nie poda frazy z Google (od lat).
- **Search Console API poda** — frazy per URL, czyli dla `/miejsce/{slug}`
  lista zapytań, wyświetlenia i pozycja. Darmowe, wiarygodne, wymaga
  cyklicznego pobierania do rollupu.
- 30–50% wejść będzie bez źródła. Podawać jawnie jako „nieznane", nigdy nie
  rozdzielać proporcjonalnie.

**Konsekwencja schematu:** to jest wymiar na `venue_viewed`, więc
`venue_stats(venue_id, date, metric, count)` z punktu 10 tego nie pomieści.
Zaprojektować kolumnę wymiaru albo osobny rollup **w tej samej migracji** —
po starcie to backfill realnych danych.

### 1.9 Odwrócenie ADR-007 — social media wchodzą

TikTok i Instagram jako kanał: infografiki generowane z danych aplikacji,
slajdy z 5 lokalami (świadomie nie „top 5"), CTA na końcu rolki, link z UTM
w opisie. Bez twarzy — `faceless-brand` bez zmian, ale ADR-007
(„systems-only growth", brak social mediów) jest **odwrócony** i potrzebuje
własnego rekordu z uzasadnieniem.

Uzasadnienie: popyt produktowy w wyszukiwarce istnieje, popyt lokalowy
prawdopodobnie nie (patrz 3.1). Social to hedge, nie dodatek.

Ustalenia szczegółowe:
- **UTM łapać server-side przy pierwszym żądaniu**, nie przez PostHoga.
  Parametr jest w query stringu, nie wymaga niczego na urządzeniu, więc
  mieści się w modelu anonimowym — i daje pełną atrybucję zamiast tylko od
  tych, którzy zaakceptowali cookies.
- **Sprawdzić, czy Livewire nie zjada UTM.** `#[Url]` przepisuje adres;
  przetestować wejście na `/?utm_source=tiktok` i sprawdzić, co zostaje po
  pierwszym kliknięciu filtra.
- **Datownik zamiast disclaimera.** Nie „post może być nieaktualny", tylko
  mała pieczątka „dane: 28.08.2026". Hook budować na niedopowiedzeniu
  („mamy jeszcze 47 w Warszawie"), nie na aktualności.
- **Automatyzacja: generowanie tak, publikacja nie od razu.** Instagram —
  publikacja na własne konto nie wymaga app review (tryb deweloperski + rola
  Instagram Testera; review dotyczy podłączania kont innych osób). TikTok —
  Content Posting API wymaga zdanego audytu aplikacji, do tego czasu posty są
  wymuszenie prywatne. **Najpierw 10 postów ręcznie**, automatyzacja dopiero
  po potwierdzeniu, że format działa.

### 1.10 Odwrócenie logiki pakietów B2B

Pierwotna intuicja: tani pakiet = surowe dane, drogi pakiet = wnioski (bo
„robimy pracę za nich"). **To jest odwrócone.**

Cena idzie za niezastępowalnością, nie za włożoną pracą. Rekomendacja sezonowa
jest tania w produkcji (jedna reguła na kategorię × sezon, identyczna dla
wszystkich). Surowe dane per lokal są unikalne dla niego.

| Pakiet | Zawartość |
|---|---|
| Tani (~30 zł) | Wnioski i alerty. Mało liczb, dużo zdań. |
| Drogi | To samo + surowe dane, porównania do kategorii i dzielnicy, eksport, historia |

Spójne z `gap-report-in-basic`, które już umieszcza gap report w pakiecie
podstawowym.

Dodatkowo:
- Rekomendacja bez powiązania z jego danymi („na zimę zaopatrz się w wino")
  nie ma wartości. Wartość = gap report × sezonowość.
- Pierwszy sezon opiera się na Trends i wiedzy branżowej, nie na własnych
  danych. **Rozdzielić w interfejsie: „trend rynkowy" vs. „twoje dane".**
- Przy 30 zł/mc kosztem jest obsługa klienta, nie serwer.

### 1.11 Przycisk „to jest mój lokal" wchodzi do V1

Na profilu lokalu, prowadzi do formularza kontaktowego albo maila. **Bez kont,
bez weryfikacji, bez samoobsługi** — `browse-only-v1` bez zmian.

Trzy funkcje naraz:
1. Kanał, którym właściciel w ogóle się odezwie.
2. **Licznik popytu na samoobsługę = wyzwalacz V2.** Pierwszy właściciel, który
   sam napisze z prośbą o poprawkę, jest sygnałem — nie liczba lokali.
3. Domyka punkt 5 checklisty: zamiast wycinać zdanie o nieistniejącym
   przycisku „Zgłoś nieaktualne dane" z `/jak-to-dziala`, dajemy prawdziwy
   odpowiednik. `StoreVenueInaccuracyReportRequest` już istnieje — brakuje
   trasy, kontrolera i modala.

**Do rozstrzygnięcia:** jeden przycisk czy dwa. „To jest mój lokal"
(właściciel) i „coś się nie zgadza" (gość) to różne intencje. Jeden formularz
z polem wyboru wystarczy, ale licznik musi je rozdzielać — inaczej „40
zgłoszeń" nie powie, czy to sygnał do V2, czy że dane są nieaktualne.

`v1-copy-truth`: opis przycisku musi odpowiadać temu, co faktycznie robi.
Jeśli to mail z ręczną odpowiedzią w kilka dni — nie obiecywać natychmiastowej
poprawki.

### 1.12 Konta właścicieli NIE wchodzą do V1

Przy 30–50 lokalach i zerowym ruchu nikt nie ma powodu się logować.
Rejestracja, weryfikacja, przejmowanie profilu, edycja menu i moderacja
zbudowane pod pustkę. Wprost łamie `abstraction-needs-a-second-user`.

Panel właścicielski żyje (`admin-recorded-claims-v1`) — jeden zainteresowany
właściciel to pięć minut w adminie.

**Ważne dla planowania:** ręczne utrzymanie danych to nie faza przejściowa,
którą skróci „renoma". To stan na cały V1, bo kod nie dopuszcza samoobsługi.

### 1.13 Pozyskiwanie danych — metoda zatwierdzona

- Fakt istnienia lokalu: wyszukiwarka Google, ręcznie.
- Adres: ze strony lokalu.
- Geokodowanie: **polski geokoder rządowy (GUGiK)** — wolny od ograniczeń
  licencyjnych Nominatim (limity) i Google (zakaz przechowywania współrzędnych
  poza ich mapami). Warto własny rekord decyzji z uzasadnieniem.
- Karta/menu: ze strony lokalu, ręcznie.
- Bez scrapingu, bez Map Google, bez OSM.

Uwagi:
- Zakazy kopiowania siedzą w **regulaminie**, nie w polityce prywatności
  (ta dotyczy danych użytkowników).
- Notować **nazwy pozycji, nie literackie opisy** — fakty nie są utworem,
  opisy bywają.
- **Zapisywać źródło (URL) i datę pobrania przy każdej pozycji.** Dwie
  kolumny, trzy korzyści: obrona pochodzenia, podstawa pod
  `last_menu_check_at` i wygasanie „Sprawdzonej karty", możliwość ponownego
  sprawdzenia bez szukania od zera.

### 1.14 Nazwanie V1

Nie „V1 = kiedy właściciele chcą poprawić menu" — to opisuje wyzwalacz V2.

**V1 to katalog, który da się przeczytać i który da się zakwestionować.**
Czytelnicy: wyszukiwarka i mapa. Właściciele: jeden przycisk.

V1 udaje się, gdy dane są prawdziwe i strona się indeksuje. Odzew właścicieli
to sygnał czasu na V2, nie ocena V1.

---

## 2. Kwestie prawne

### 2.1 ODbL — co uruchamia share-alike

- **Produced Work** (wyrenderowana mapa, wydruk) → obowiązek: **atrybucja**.
- **Derivative Database** (baza wywiedziona z ich bazy) → obowiązek:
  **share-alike**, publikacja na ODbL.

Stąd:
- **Mapa jest OK.** Kafelki z danych OSM to Produced Work. Atrybucja na mapie
  i koniec. Nic nie dotyka tabeli `venues`.
- **CSV nie jest OK.** Import 2378 wierszy → tabela zawiera selekcję i treść
  OSM → Derivative Database → share-alike wywraca model biznesowy.

`uni_filtered_venues.csv` **wypada z repo i z historii** —
`research-files-out-of-the-repo` + hasło z `phpunit.xml` (T-25a) = jedno
przepisanie historii, **przed** wygenerowaniem sekretów produkcyjnych.

Wersja pośrednia (użycie jako listy „gdzie szukać" i niezależne pozyskanie
danych) jest sporna. Godzina u polskiego prawnika od IP, nie własna ocena.
Domyślnie: skasować, pracować z CEIDG wg ADR-002.

### 2.2 Analityka server-side — podstawa prawna

**Uzasadniony interes to zły trop.** `eventlogger-identifier-stripping` mówi,
że tabela `events` jest anonimowa i **nie wymaga podstawy prawnej** — to
pozycja mocniejsza. Powołanie się na LI to przyznanie, że dane są osobowe.

**Cookies to PKE, nie RODO.** Art. 399 PKE wymaga zgody na przechowywanie lub
dostęp do informacji w urządzeniu końcowym, niezależnie od tego, czy cookie
przetwarza dane osobowe. Wyjątek: pliki technicznie niezbędne. Uzasadniony
interes nie jest tam dostępną podstawą.

**Rozstrzyga jedno pytanie: czym server-side identyfikowana jest sesja?**

| Mechanizm | Skutek |
|---|---|
| Nic na urządzeniu, brak identyfikatorów | Poza PKE i poza RODO. Podstawa niepotrzebna. |
| Cookie / localStorage z ID | Art. 399, zgoda obowiązkowa, LI niedostępny. |
| Hash IP+UA | Pseudonimizacja, nie anonimizacja. RODO wraca, LI możliwy, ale wymaga testu równowagi, prawa sprzeciwu i opisu w polityce. |

**Do sprawdzenia:** czy server-side `VenueAnalytics` jest w ogóle bramkowane
zgodą — `analytics-endpoint-server-gate` opisuje endpoint `/analytics/events`,
a to inna ścieżka.

*Nie jest to porada prawna — do weryfikacji u kogoś od PKE.*

### 2.3 Punkt 12 checklisty — zmieniona lista odbiorców

Po zmianie hostingu na UpCloud lista to: **UpCloud** (nie Hetzner), **Ploi**,
**Backblaze B2** (region UE, inaczej dochodzi odbiorca spoza UE),
**Scaleway TEM**, **PostHog** (sprawdzić, czy instancja UE — jeśli US, dochodzi
kwestia transferu), **OpenFreeMap**, **Bunny Fonts**.

Ploi ma dostęp do serwera → umowa powierzenia.

Jeśli fonty zostaną self-hostowane (punkt 4), Bunny Fonts znika z listy.

**Konflikt w samym punkcie 12:** mówi jednocześnie „przepisać po decyzji
hostingowej" i „w tej samej zmianie co punkt 11". Hosting jest już zdecydowany
(UpCloud), więc konflikt znika — ale zapisać, że kolejność to hosting →
migracja mapy → jedno przepisanie sekcji 6.

---

## 3. SEO — zmiana strategii

### 3.1 Popyt lokalowy prawdopodobnie nie istnieje w wyszukiwarce

Google Trends, Polska:

- `piwo bezalkoholowe` — realna krzywa od 5 lat. Szczyty stabilne (~85, 70,
  83, 73, 85), **ale dno rośnie** (17–22 → 28). Kategoria nie rośnie
  w szczycie, tylko przestaje być sezonowa. Amplituda ~3×.
- `mocktaile` — **pięć lat płaskiego zera.** Wykreślić z taksonomii i planów
  treści.
- `piwo 0% warszawa`, `najlepsze drinki Warszawa`, `drinki 0%` — zero.
  Poniżej progu Trends.
- Wniosek własny: „bar bezalkoholowy" nie brzmi naturalnie po polsku, więc
  prawdopodobnie tej intencji w wyszukiwarce nie ma. Ludzie szukający gdzie
  wyjść idą do Map Google i Instagrama.

**Konsekwencja strategiczna:** klaster SEO odwraca kierunek —
**wejście przez produkt, konwersja na lokal.** Treść o piwach i markach łapie
ruch, który istnieje; z niej prowadzi się do „gdzie tego spróbować
w Warszawie".

**To podnosi rangę katalogu marek i napojów z danych pomocniczych do głównej
powierzchni SEO.**

Wymagania:
- Strona marki i strona napoju jako osobne typy URL. `venue-url-structure`
  obejmuje tylko `/miejsce/{slug}` — potrzebny nowy segment i nowa decyzja.
- CTA policzalne, nie generyczne: „Podajemy je w 14 lokalach w Warszawie",
  z linkiem do listy przefiltrowanej po marce.
- Deklinacja: `name_locative` już istnieje, przenieść tę logikę do wzorców
  title i H1.

### 3.2 Faceted navigation — brakujący punkt checklisty

`server-side-get-filtering` czyni każdą kombinację filtrów indeksowalnym URL-em.
Siedem parametrów → tysiące niemal-duplikatów z pięćdziesięciu lokali.

Do rozstrzygnięcia **przed startem** (potem to de-indeksacja już
zaindeksowanych stron):
- **Indeksować** wąski, ręcznie wybrany zestaw pasujący do realnych zapytań
  (jedna kategoria albo `zero=true` na stronie miasta).
- **`noindex, follow`** resztę. Follow, żeby crawler dotarł do lokali.
- **Canonical** z filtrowanego na rodzica tam, gdzie treść się pokrywa.

Punkt 1 checklisty pyta o nazwy parametrów; pytanie pod spodem to
indeksowalność. **Tego punktu nie ma na żadnej liście.**

### 3.3 Próg minimalnej liczby lokali dla stron dzielnic

`empty-landing-pages-noindex` obsługuje strony puste. Nie obsługuje **cienkich**
— 1–2 lokale w dzielnicy przy pięćdziesięciu w mieście. Rozważyć próg
minimalnej liczby lokali przed indeksowalnością. Jeden warunek.

### 3.4 Structured data

- **`LocalBusiness`** (podtypy: `BarOrPub`, `Restaurant`, `CafeOrCoffeeShop`)
  na profilu lokalu. Google wymaga minimum `name` + `address`; dodać `geo`,
  `url`, `sameAs`, `hasMap`.
- **`ItemList`** na stronach miasta i dzielnicy.

Markup będzie cienki z założenia: brak `openingHoursSpecification`
(`no-opening-hours-v1`), brak `image` (`no-venue-photos-v1`), brak
`aggregateRating` (ADR-006). To pola zalecane, nie wymagane.

Realna wartość to nie rich result (eligibility ≠ wyświetlenie, karuzela
restauracyjna ograniczona do zarejestrowanych dostawców), tylko **powiązanie
encji** — jednoznaczne wskazanie, że strona dotyczy tego konkretnego miejsca
w tych współrzędnych. To wygrywa zapytania o nazwę lokalu, czyli sporą część
ruchu katalogu.

Jeden partial Blade na typ strony. **Nie warstwa abstrakcji.**

### 3.5 Core Web Vitals

Dwa znane obciążenia LCP: pięć rodzin fontów render-blocking (punkt 4) i
teraz ~200 KB bundle MapLibre na stronie głównej. Jedno przejście.
**Self-hosting Poppins** załatwia LCP i usuwa Bunny Fonts z listy odbiorców
(punkt 12).

---

## 4. Monetyzacja i walidacja

### 4.1 Bramka monetyzacji: mediana, nie suma

**Kryterium: mediana zdarzeń na lokal, nie ruch łączny.** 5000 wejść na 50
lokali przy medianie 4 to raport bezwartościowy dla mediany.

Kształt progu: **mediana lokalu ≥30 zdarzeń miesięcznie przez trzy miesiące
z rzędu.** To jest bramka, nie data w kalendarzu.

### 4.2 Każda funkcja B2B ma inny próg

| Funkcja | Czego wymaga | Kiedy |
|---|---|---|
| Gap report | gęstości lokali w kategorii | praktycznie od startu |
| Skąd wchodzą na profil | ruchu na lokal | ~3 miesiące przyzwoitego ruchu |
| Porównanie do kategorii/dzielnicy | wypełnionych komórek kategoria × dzielnica | zależy od liczby lokali |
| Sezonowość rok do roku | pełnych 12 miesięcy | twardy limit |

Nie trzeba czekać roku, żeby zacząć sprzedawać — rok jest potrzebny **tylko
na prognozę sezonową**. Zegar rusza od startu, nie od dziś.

**Amplituda 3× utrzymuje się od pięciu lat i jest przewidywalna co do
miesiąca** — prognoza sezonowa ma realną wartość sprzedażową. To ta sama
funkcja, którą kasuje pruner. Kolejny argument za T-20a przed schedulerem.

### 4.3 Co server-side daje B2B, a czego nie

Tracimy dokładnie jedno: **ludzi i ścieżki** — unikalni użytkownicy,
powracający, konwersja per sesja.

Zostaje wszystko, co jest liczbą albo proporcją: wyświetlenia w wynikach,
frazy, wejścia na profil, kliknięcia wychodzące, porównania do kategorii
i dzielnicy, sezonowość, gap report.

**Analogia sprzedażowa: Google Search Console.** Pokazuje wyświetlenia,
kliknięcia, CTR i pozycję, nic nie wie o tożsamości, a cała branża płaci za
narzędzia zbudowane na tych danych.

Konwersję podawać jako **proporcję zagregowaną**: „na 100 wyświetleń profilu
12 osób poprosiło o trasę". Nazywać uczciwie — to nie konwersja per sesja.

Hash IP+UA albo cookie z ID kupuje najsłabiej sprzedawalne metryki kosztem
twierdzenia o anonimowości. **Nie warto.**

### 4.4 Odpowiedź na „skąd wiem, że nie zmyślasz danych"

Identyfikacja użytkownika **niczego nie dowodzi** — listę ID sfabrykować tak
samo łatwo jak licznik. Właściciel pyta w istocie: *czy to byli ludzie, czy
crawlery?*

Trzy realne odpowiedzi:
1. **Filtrowanie botów** — to jest prawdziwa luka, nie tożsamość. ADR-009
   i `block-all-ai-crawlers` coś dają, ale trzeba umieć powiedzieć „liczby po
   odfiltrowaniu botów" i pokazać jak. **Zrobić przed liczeniem czegokolwiek
   na sprzedaż.**
2. **Niezależna weryfikacja u niego** — link wychodzący z profilu z parametrem
   UTM. Właściciel widzi ruch z UNI we **własnej** analityce. Dowód
   niepochodzący od nas.
3. **Jawna metodologia** — opublikować, co liczy się jako wyświetlenie
   i kliknięcie. Uwaga: `credibility-formula-opacity` dotyczy **wzoru na
   wiarygodność lokalu**, nie liczenia zdarzeń. Przy danych sprzedawanych
   przejrzystość jest atutem.

Pozycja jest tu mocniejsza niż u konkurencji: „nie wiemy kto, bo świadomie nie
zbieramy" brzmi jak dyscyplina; „wiemy wszystko o każdym" brzmi jak ryzyko
RODO po stronie kupującego.

### 4.5 Pomysł na V3/V4 — publiczny raport zgodności

Agregacja weryfikacji po stronie właścicieli w publiczny dowód wiarygodności.
**Google i Meta nie pozwalają zweryfikować swoich liczb** — to różnica, której
duzi nie skopiują.

Doprecyzowania:
- **Metryką jest odchylenie w przedziale, nie „zgodność".** Kliknięcie
  wychodzące ≠ sesja u niego (zamknięte karty, blokery, prefetch, boty,
  brak JS). Realnie 60–85%. „W 87 na 100 lokali różnica mieści się w ±20%"
  brzmi wiarygodniej niż idealna zgodność.
- **Mianownik obowiązkowy:** ilu zaproszono, ilu udostępniło dane, ilu wypadło
  poza przedział i dlaczego. Bez mianownika to marketing, nie audyt.
- Poziomy pozyskania danych: samodeklaracja (słaba) → zrzut z GA4
  (weryfikowalna, nie skaluje się) → read-only GA4 API (mocna, OAuth, opór).
- **Warunek w V1:** parametr UTM na linkach wychodzących **teraz**. Bez tego
  V3 startuje bez historii. Infrastruktura redirectów już jest
  (`maps-redirect-type-retained`) — to doklejenie parametru, nie funkcja.
- Publikować dopiero przy niekrępującym wolumenie. Raport pokazuje też, **ile**
  ruchu wysyłamy.

### 4.6 Walidacja ceny bez pytania właściciela o zdanie

Pokazywanie makiety raportu i pytanie „ile byś dał" to praktyka, którą
właściciele znają i której unikają. Odrzucone.

Zamiast tego: **przyjść z researchem o nim, wykonanym przed rozmową.**
Gap report na jego lokalu z danych zbieranych przy enrichmencie — działa bez
ruchu, bez roku, bez niczego:

> „Sprawdziłem karty 40 warszawskich lokali z ofertą bezalkoholową. Masz
> 3 pozycje bezalkoholowe. Mediana w twojej okolicy to 7. Nikt w promieniu
> kilometra nie ma bezalkoholowego wina. Oto lista."

Walidacja = czy dopytuje, czy prosi o więcej, czy sam mówi „a możesz to robić
co miesiąc". Nie ankieta.

**Zastrzeżenie (istotne):** materiał akwizycyjny musi być wyjściem z produktu,
nie artefaktem na zamówienie — patrz złota myśl 5.4. Jeśli tego gap reportu
nie da się wygenerować automatycznie, nie nadaje się na zaczepkę.

Spójne z `gap-report-in-basic`: gap report nie czeka na dane.

---

## 5. Złote myśli — nowy plik

Propozycja: `docs/zlote-mysli.md` (albo w `decisions/`).

**Nagłówek pliku:** *Rekord decyzji mówi, co postanowiono. Złota myśl mówi,
jak postanawiać.* Rekordy się dezaktualizują i bywają superseded
(`dark-map-tile-provider`). Heurystyki żyją dłużej, bo nie są związane
z konkretną technologią.

**Warunek wejścia:** reguła trafia do pliku dopiero, gdy realnie coś
rozstrzygnęła, i wpisywana jest **razem z tą decyzją**. Inaczej plik staje się
zbiorem truizmów.

### Kandydaci z tej sesji

**5.1 — Im tańszy pakiet, tym taniej musi się go obsługiwać.**
Nie obserwacja, tylko **ograniczenie projektowe**: tani pakiet musi być
zaprojektowany tak, żeby *nie mógł* wygenerować kontaktu.
→ *Rozstrzygnęło:* wnioski w tanim pakiecie, surowe dane w drogim (1.10).

**5.2 — Cena idzie za niezastępowalnością, nie za włożoną pracą.**
→ *Rozstrzygnęło:* rekomendacje sezonowe (tanie w produkcji) trafiają do
pakietu podstawowego mimo że „robimy coś za nich" (1.10).

**5.3 — Rzeczy, których koszt zmiany rośnie po starcie, robi się przed
startem.**
→ *Rozstrzygnęło:* to jest cała logika pre-launch checklist; w tej sesji
faceted navigation (3.2) i wymiar źródła w schemacie rollupu (1.8).

**5.4 — Materiał akwizycyjny musi być wyjściem z produktu, nie artefaktem na
zamówienie.**
Jeśli czegoś nie da się wygenerować automatycznie, nie nadaje się na zaczepkę
sprzedażową — nie z powodu nieuczciwości, tylko dlatego, że sprzedaje coś, co
nie zostanie dostarczone. Ręczny research to co innego niż ręczna obsługa:
właściciel nie wie, że sprawdzało się jego kartę osobiście, więc oczekiwanie
nie powstaje. Oczekiwanie powstaje, gdy dostaje coś, czego pipeline nie
potrafi wyprodukować.
→ *Rozstrzygnęło:* kształt gap reportu akwizycyjnego (4.6).

**5.5 — Nie automatyzuj czegoś, czego nie sprawdziłeś ręcznie.**
→ *Rozstrzygnęło:* 10 postów na social ręcznie przed budową pipeline'u (1.9).

**5.6 — Automat wykrywa i monitoruje; weryfikacja zostaje ręczna, bo to
produkt, a nie koszt.**
→ *Rozstrzygnęło:* podział pracy przy pozyskiwaniu danych (1.13); spójne
z ADR-002 i z ręcznym przełącznikiem `is_verified`.

### Do przeniesienia z `decisions/product/`

Te dwa to nie decyzje o UNI, tylko heurystyki stosowalne do dowolnego
projektu. Wpadły do `decisions/product/` z braku lepszego miejsca — przenieść
albo przynajmniej zlinkować, żeby nie mieć dwóch zbiorów tego samego:

- `abstraction-needs-a-second-user`
- `pre-launch-has-no-past-to-protect`

---

## 6. Katalog marek i napojów — luka w planowaniu

**Nie występuje w pre-launch checklist, w `going-to-production`, ani w pozycji
„67 fabricated venues".** Szacunek 2–3 tygodni obejmuje wyłącznie lokale.

**`kebab-rule` czyni napoje *upstream* wobec lokali, nie równoległymi** — nie
da się potwierdzić kwalifikacji lokalu, dopóki nie wiadomo, co podaje.

`abv-trust-model` wymaga per produkt ABV **plus** poziomu zaufania do źródła.
To dane per marka z pochodzeniem, nie string.

Dobra wiadomość: polski rynek NA jest policzalny. Marki liczy się w dziesiątkach,
strony producentów i etykiety są autorytatywnym źródłem ABV. Dni, nie tygodnie —
inaczej niż lokale.

**Do rozstrzygnięcia przed rozpoczęciem zbierania:**
1. **Wspólna tabela marek/produktów, do której lokale się linkują, czy tekst
   per lokal?** Rekord decyzji, nie odkrycie w połowie seedowania. To decyduje,
   czy normalizuje się 30 wierszy, czy 150.
2. **Sprzeczność do rozstrzygnięcia:** `custom-drink-photo-gate` mówi, że
   zdjęcie jest wymagane przy każdym własnym drinku (status: Decided), a
   `stack.md` mówi, że uploady i przetwarzanie obrazów **nie istnieją w V1
   w ogóle** (D-03, D-04). Jedno z tych jest nieaktualne.

**Stan bieżący:** ~30 realnych wpisów w Excelu, każdy ze strony lokalu,
z menu. To więcej twardych danych niż cała baza (67 wierszy to fikcje).

Do zrobienia z tymi 30:
- **Notować też odrzucone** — nazwa i powód (brak strony / brak menu online /
  menu bez nazwanej pozycji bezalkoholowej). Daje realne tempo pracy,
  oszacowanie wielkości rynku i gotową listę prospektów.
- **Ustrukturyzować teraz, nie przy setnym wpisie** — po rozstrzygnięciu
  pytania o wspólną tabelę, plus kolumny źródła i daty.
- **Policzyć współczynnik trafień na pierwszych dziesięciu:** ile ma stronę,
  ile ma na niej menu, ile ma **nazwaną** pozycję bezalkoholową. Jeśli 3 na 10,
  szacunek 2–3 tygodni jest za niski.

---

## 7. Pełna lista przed produkcją

Kolejność ma znaczenie.

1. **Backupy + rehearsed restore na pustej maszynie.** Pierwszy punkt
   w `next-session` — wszystko, co dotyka danych, czeka na to.
2. **Przepisanie historii repo** — hasło z `phpunit.xml` (T-25a) + pliki
   research + `uni_filtered_venues.csv`. **Przed** wygenerowaniem sekretów
   produkcyjnych.
3. **T-20a rollup przed włączeniem schedulera.** Deadline 15.09.
4. **Punkty 10 → 7 → 9 → 8** jednym przejściem, z wymiarem źródła (1.8).
5. **Migracja mapy** (punkt 11) — z klastrowaniem (1.1), ze sprawdzeniem stylu
   Dark na starcie (1.2).
6. **PC1–PC4** — wymuszone HTTPS, zaufane proxy, HSTS, robots. Nigdzie jeszcze
   nie działały.
7. **Preprod z `config:cache`.** `env()` poza `config/` zwraca `null` dopiero
   po zbudowaniu cache — grep za `env(` poza `config/`.
8. `supervisor/uni-worker.conf` — `user=www-data` nie istnieje na Fedorze.
9. **Punkt 1** (nazwy parametrów) **+ faceted navigation** (3.2).
10. **Punkt 4** — fonty, self-hosting Poppins.
11. **Punkt 5** — przycisk „to jest mój lokal" (1.11) zamiast wycinania zdania.
12. **Punkt 6** — `/panel` w robots.
13. **Punkt 12** — jedno przepisanie sekcji 6 polityki, lista wg 2.3.
14. **UTM na linkach wychodzących** (4.5) — tanie, warunek V3.
15. **Filtrowanie botów** (4.4) — przed liczeniem czegokolwiek na sprzedaż.
16. **16 otwartych decyzji** z `decisions-waiting-on-you`.
17. **Katalog marek i napojów** (sekcja 6) — upstream wobec lokali.

Uwagi porządkowe:
- `public/hot` musi być gwarantowanie nieobecny na serwerze, nie „zakładany".
- Sekrety: produkcja generuje własny `APP_KEY` i hasło do bazy; nie kopiować.
- HSTS to zobowiązanie na czas `max-age` — zacząć od krótkiego, podnieść po
  pierwszym nienadzorowanym odnowieniu certyfikatu.

---

## 8. Gdzie to rozdzielić

| Sekcja | Cel |
|---|---|
| 1.1–1.4 | poprawki w `vector-basemap-on-openfreemap`, `tech/stack.md` |
| 1.5, 1.6 | `roadmap/pre-launch-checklist` (punkty 7–10), `roadmap/next-session` |
| 1.7, 1.8 | nowy rekord + `posthog-analytics-role` + schemat rollupu |
| 1.9 | **nowy rekord** odwracający ADR-007 |
| 1.10 | nowy rekord o strukturze pakietów; sprawdzić spójność z `gap-report-in-basic` |
| 1.11, 1.12 | `roadmap/pre-launch-checklist` punkt 5; nowy rekord; `browse-only-v1` bez zmian |
| 1.13 | nowy rekord o metodzie pozyskiwania + rekord o geokoderze GUGiK |
| 1.14 | `roadmap/v1` — nagłówek/definicja |
| 2.1 | `osm-dropped` (rozszerzyć o uzasadnienie), plan przepisania historii |
| 2.2 | nowy rekord o podstawie prawnej analityki; do weryfikacji prawnej |
| 2.3 | `roadmap/pre-launch-checklist` punkt 12 |
| 3.1 | **nowy rekord** o odwróceniu klastra SEO; `roadmap/v1` |
| 3.2, 3.3 | **nowe punkty checklisty** — obecnie nie istnieją |
| 3.4, 3.5 | `roadmap/v1`; punkt 4 checklisty |
| 4.1–4.4 | `roadmap/v1`, dokumentacja B2B analytics |
| 4.5 | `roadmap/v3` albo backlog; **punkt UTM do V1** |
| 4.6 | notatka sprzedażowa / `roadmap/next-session` |
| 5 | **nowy plik** `zlote-mysli.md` |
| 6 | **nowy obszar w roadmapie** — obecnie nie istnieje nigdzie |
| 7 | `roadmap/pre-launch-checklist` + `roadmap/next-session` |

---

## 9. Nierozstrzygnięte

- Jeden przycisk czy dwa („to jest mój lokal" vs. „coś się nie zgadza") — 1.11
- Wspólna tabela marek/produktów czy tekst per lokal — sekcja 6
- `custom-drink-photo-gate` vs. `stack.md` (zdjęcia w V1) — sekcja 6
- Które URL-e z filtrami indeksowalne — 3.2
- Próg minimalnej liczby lokali dla strony dzielnicy — 3.3
- Czym server-side identyfikowana jest sesja — 2.2
- Czy `VenueAnalytics` jest bramkowane zgodą — 2.2
- Los `uni_filtered_venues.csv` (domyślnie: skasować) — 2.1
- Region instancji PostHog (UE czy US) — 2.3
- 16 otwartych pytań w `decisions-waiting-on-you`
