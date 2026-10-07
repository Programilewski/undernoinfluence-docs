---
description: "Result (Polish): classics as a curated layer over venue menu items, linked as exact or variant; the threshold, a starting list for Poland, owner gaming, owner-panel wording."
---

# UNI: kanon drinków bezalkoholowych i pozycje lokali

## Decyzja w skrócie

**[R — rekomendacja]** UNI powinno przejść z podziału „produkt albo house drink” na model **pozycji menu lokalu z opcjonalnym powiązaniem do kanonicznego drinka**. Każdy wpis zachowuje dokładną nazwę i opis lokalu; jeżeli odpowiada klasykowi, dostaje `canonical_drink_id` oraz relację `exact` albo `variant`. Dzięki temu „Garden Mojito” pozostaje kreacją danego baru, ale może pojawić się również na stronie „Virgin Mojito” jako wariant — bez podszywania się pod identyczną recepturę.

**[R — rekomendacja]** Należy odrzucić: (1) czyste **either/or**, bo odbiera wariantom albo tożsamość lokalu, albo wyszukiwalność; (2) automatyczne awansowanie do klasyka po przekroczeniu liczby lokali, bo popularność nie tworzy semantycznej tożsamości; (3) swobodne tworzenie klasyków przez właścicieli, bo powoduje duplikaty i pozwala samodzielnie wykreować nową stronę pozyskującą ruch; oraz (4) IBA jako jedyne źródło, ponieważ jej oficjalna lista obejmuje koktajle alkoholowe, choć jest wartościowym dowodem rozpoznawalności pierwowzoru.[^1][^2]

**[R — rekomendacja]** W panelu nie należy pytać właściciela abstrakcyjnie „klasyk czy autorski?”. Po wpisaniu istniejących dziś pól — nazwy, typu i opisu — system powinien pokazać najwyżej trzy podpowiedzi: „To wygląda jak: Virgin Mojito”, z wyborem **„Tak — pokaż także osobom szukającym Virgin Mojito”** albo **„Nie — to inny drink”**. To jest jedna decyzja wykorzystująca już podane dane, a nie dodatkowy obowiązkowy formularz.

## Etykiety dowodów

- **[D — udokumentowane]** oznacza informację wprost potwierdzoną przez podane źródło.
- **[O — zaobserwowana praktyka]** oznacza wzorzec widoczny w realnych menu lub działaniu platformy, ale niekoniecznie zapisany jako oficjalna polityka.
- **[R — rozumowanie/rekomendacja]** oznacza wniosek projektowy dla UNI.
- **[L — luka dowodowa]** oznacza brak znalezionych publicznych danych lub dokumentacji; brak dowodu nie jest dowodem braku funkcji.

## Reguła progu

**[R — reguła operacyjna]** *Klasyk to utrzymywany przez UNI, niezależny od lokalu koncept drinka, który ma rozpoznawalną nazwę i stabilny rdzeń składników lub profilu, potwierdzony co najmniej dwoma niezależnymi wiarygodnymi źródłami albo powtarzający się w menu co najmniej trzech niepowiązanych polskich lokali. Liczba lokali tylko nominuje klasyk; o utworzeniu decyduje kurator UNI, a nie automat ani właściciel.*

**[R — reguła dopasowania w kilka sekund]** *Jeżeli nazwa menu jest aliasem klasyka i opis nie przeczy jego rdzeniowi, oznacz `exact`; jeżeli menu jawnie odwołuje się do klasyka, lecz dodaje dominujący smak, zamienia bazę lub używa własnej nazwy, oznacz `variant`; bez nazwy/odwołania i bez wystarczającego opisu zostaw `own`.*

**[R — ważne rozróżnienie]** Klasyk nie jest jedną obowiązkową recepturą w gramach. To encja wyszukiwawcza z „odciskiem” — np. Virgin Mojito: limonka + mięta + słodycz + gazowanie, bez rumu alkoholowego — oraz z dozwolonymi zamianami, takimi jak woda sodowa versus lemon-lime soda. IBA sama pokazuje, że alkoholowy Mojito ma rozpoznawalny rdzeń rumu, limonki, mięty, cukru i sody, zaś realne warszawskie menu wersji virgin konsekwentnie zachowują rdzeń bez rumu.[^3][^4][^5][^6]

## Test na przykładach

| Brzmienie w menu | Werdykt | Dlaczego |
|---|---|---|
| **Virgin Mojito** — limonka, mięta, cukier trzcinowy, woda gazowana | **Classic: Virgin Mojito** | **[D+R]** Dokładna nazwa i rdzeń; takie brzmienie występuje w warszawskich menu.[^4][^6] |
| **Mojito Virgin** — limonka, mięta, cukier, Sprite | **Classic: Virgin Mojito** | **[O+R]** Odwrócony szyk i zamiana sody na lemon-lime soda nie zmieniają intencji; realny przykład menu.[^5] |
| **Mojito 0** | **Classic: Virgin Mojito**, jeśli lokal potwierdza brak alkoholu | **[O+R]** Polska karta używa właśnie tej skróconej formy w sekcji napojów bezalkoholowych.[^7] |
| **Mojito 0%** — limonka, mięta, soda | **Classic: Virgin Mojito** | **[R]** „0%” jest kwalifikatorem bezalkoholowym, a opis potwierdza rdzeń. |
| **Bezalkoholowe mojito** | **Classic: Virgin Mojito** | **[O+R]** To polski alias; przepis z limonką, miętą, cukrem i gazowaniem powtarza się w polskich źródłach.[^8][^9] |
| **Nojito** — limonka, mięta, cukier, soda | **Classic: Virgin Mojito** | **[D+R]** Difford’s używa formy „No-jito” dla bezalkoholowego Mojito; opis rozstrzyga alias.[^10] |
| **Nojito** bez opisu | **Nierozstrzygnięte → own do czasu potwierdzenia** | **[R]** Sama gra słów jest silną wskazówką, lecz bez opisu i bez jawnego „0%” nie daje pewności co do składu ani alkoholu. |
| **Strawberry Virgin Mojito** | **Variant of Virgin Mojito** | **[D+R]** Truskawka jest dominującym dodatkiem do rdzenia; polskie źródło nazywa go wariacją Mojito.[^11] |
| **Virgin Mojito z rabarbarem** | **Variant of Virgin Mojito** | **[R]** Jawna nazwa rodzica, nowy dominujący smak. |
| **Garden Mojito** — Seedlip Garden, mięta, limonka, soda | **Variant of Virgin Mojito** | **[R]** Własna nazwa i baza 0%, ale czytelny rdzeń i jawne „Mojito”. |
| **Garden Mojito** — ogórek, jabłko, bazylia, tonic | **Own creation** | **[R]** Nazwa sugeruje Mojito, lecz opis przeczy jego rdzeniowi; opis ma pierwszeństwo przed tokenem marketingowym. |
| **Virgin Piña Colada** — ananas, kokos, śmietanka/mleko kokosowe | **Classic: Virgin Piña Colada** | **[D+R]** Powtarzalna nazwa i rdzeń występują w niezależnych warszawskich menu.[^4][^6] |
| **Piñacolada Virgin** bez opisu | **Classic: Virgin Piña Colada** | **[O+R]** Jednoznaczny alias pojawia się w realnym polskim menu.[^5] |
| **Mango Colada 0%** — mango, ananas, kokos | **Variant of Virgin Piña Colada** | **[R]** Zachowuje rodzinę colada, ale mango staje się wyróżniającym smakiem. |
| **Virgin Mary** — sok pomidorowy, sól selerowa, pieprz, Tabasco, Worcestershire | **Classic: Virgin Mary** | **[D+R]** Nazwa i pikantno-pomidorowy rdzeń są jawne w menu oraz w katalogu Difford’s.[^6][^10] |
| **Bloody Shame** — pomidor, cytryna, przyprawy | **Classic: Virgin Mary** jako alias | **[D+R]** Difford’s grupuje „Virgin Mary or Bloody Shame”.[^10] |
| **Shirley Temple** — grenadyna, cytryna, ginger ale | **Classic: Shirley Temple** | **[D+R]** Jest udokumentowaną bezalkoholową recepturą; różnice ginger ale/lemon-lime soda należy traktować jako dopuszczalny zakres.[^12] |
| **Dirty Shirley** | **Odrzuć — alkoholowy** | **[D+R]** Udokumentowana receptura zawiera wódkę i likier oraz około 6,14% ABV, więc nie spełnia zakresu UNI.[^13] |
| **Hugo 0%** — prosecco 0%, mięta, limonka, soda/bez 0% likieru | **Classic: Hugo 0%** | **[O+R]** Nazwa i profil powtarzają się w warszawskich menu, choć szczegóły bazy się różnią.[^14][^15] |
| **Elderflower Spritz 0%** — bezalkoholowe musujące, bez, soda | **Variant of Hugo 0%** lub **own**, zależnie od mięty/limonki | **[R]** Bez jawnego „Hugo” powiązanie wymaga opisu; sam kwiat bzu i bąbelki to za mało. |
| **Aperol Spritz 0** | **Classic: Spritz 0%** z aliasem ekspozycyjnym, nie „Aperol”, jeśli skład faktycznie nie zawiera Aperolu | **[O+R]** Polska karta używa tej nazwy, a inne menu pokazuje 0% prosecco + bitter aperitif + soda; UNI powinno zachować tekst menu, ale nie potwierdzać mylącej marki jako składnika.[^7][^6] |
| **Limoncello Spritz 0%** | **Variant of Spritz 0%** | **[O+R]** Realne menu zachowuje konstrukcję spritza, lecz wskazuje smak/bazę limoncello 0%.[^16] |
| **Negroni 0% / Nogroni / NOgroni** — gin 0%, bitter 0%, vermouth 0% | **Classic: Negroni 0%** | **[D+R]** „NOgroni” funkcjonuje w referencji mocktailowej, a polskie materiały używają „Negroni Non-Alcohol”.[^10][^17] |
| **Rhubarb Nogroni** | **Variant of Negroni 0%** | **[R]** Jawny rodzic, dominujący rabarbarowy twist. |
| **Espresso Martini 0.0%** — espresso, mleko orzechowe, wanilia | **Classic: Espresso Martini 0%** albo wariant, zależnie od przyjętego odcisku | **[O+R]** Nazwa występuje w warszawskim menu 0%; receptura odbiega od alkoholowego pierwowzoru, ale intencja wyszukiwawcza jest jednoznaczna.[^6] |
| **Coffee Cloud** — espresso, tonka, aquafaba, destylat 0% | **Own creation; opcjonalnie variant of Espresso Martini 0% dopiero po ręcznym potwierdzeniu** | **[R]** Brak odwołania w nazwie; automatyczny match na podstawie samej kawy byłby zbyt szeroki. |
| **Whiskey Sour 0%** — whisky 0%, cytryna, cukier, białko | **Classic: Whiskey Sour 0%** | **[O+R]** Polska karta podaje nazwę i kompletny odcisk sours.[^14] |
| **Gin Basil Smash 0%** — gin 0%, bazylia, cytryna, cukier | **Classic: Gin Basil Smash 0%** | **[O+R]** Nazwa i rdzeń występują w warszawskim menu; alkoholowy pierwowzór jest na liście IBA New Era.[^14][^18] |
| **Porn Star Martini 0%** — destylat 0%, marakuja, wanilia, musujące 0% | **Classic: Pornstar Martini 0%** | **[O+R]** Wersja 0% pojawia się w warszawskim menu, a pierwowzór należy do IBA New Era.[^15][^19] |
| **Sex on the Beach Free** | **Classic: Sex on the Beach 0%**, gdy opis potwierdza profil owocowy | **[O+R]** Takie nazewnictwo występuje w polskim menu; bez opisu przy wpisie właściciela warto pokazać podpowiedź, nie automatyczne przypięcie.[^20] |
| **Amalfi Rosa 0%** — tequila 0%, cytryna, pink grapefruit soda | **Own creation** | **[O+R]** Nazwa nie deklaruje Palomy, a receptura może być riffem; nie należy domniemywać rodzica wyłącznie z tequili 0% i grejpfruta.[^14] |
| **Passion Fruit Emotions** — ananas, marakuja, yuzu, imbir, białko | **Own creation** | **[O+R]** Realna autorska nazwa i brak jawnego klasyka.[^6] |
| **Vanilla Sky** — malina, żurawina, limonka, wanilia, lemoniada | **Own creation** | **[O+R]** Własna nazwa i wieloskładnikowa kompozycja bez jednoznacznego rodzica.[^6] |

## Model danych

**[R — model]** Najbezpieczniejsza abstrakcja brzmi: **każdy serwowany drink jest pozycją menu lokalu; klasyk jest opcjonalnym znaczeniem tej pozycji, a nie konkurencyjnym typem rekordu**.

| Encja | Minimalne pola | Rola |
|---|---|---|
| `canonical_drinks` | `id`, `slug`, `name_pl`, `name_en`, `definition`, `fingerprint`, `status`, `created_by`, `reviewed_at` | **[R]** Kuratorowany koncept i publiczna strona wspólna. |
| `canonical_aliases` | `canonical_drink_id`, `alias`, `locale`, `match_strength`, `requires_zero_context` | **[R]** Pisownie i tokeny wyszukiwawcze; np. „mojito” samo wymaga kontekstu 0%, „virgin mojito” nie. |
| `venue_menu_items` | `id`, `venue_id`, `raw_name`, `raw_description`, `house_type`, `canonical_drink_id` nullable, `relation` nullable (`exact`,`variant`), `source_url`, `source_seen_at`, `active` | **[R]** Jedno źródło prawdy o tym, co lokal faktycznie publikuje. Zachowuje dzisiejsze pola. |
| `match_decisions` | `venue_menu_item_id`, `suggested_id`, `decision`, `actor`, `method`, `confidence`, `decided_at` | **[R]** Audyt bez dokładania pól właścicielowi; pozwala później poprawiać reguły i cofać błędne automaty. |
| `canonical_candidates` | `normalized_phrase`, `venue_count`, `example_item_ids`, `state` | **[R]** Kolejka dla foundera, tworzona automatycznie z niepowiązanych pozycji; nie jest publicznym kanonem. |

**[R — renderowanie]** Na stronie lokalu trzeba zawsze pokazać `raw_name` i `raw_description`, z dyskretną etykietą „wariant: Virgin Mojito” tylko wtedy, gdy pomaga. Na stronie klasyka należy pokazać dwie sekcje: **„Pod tą nazwą / klasyczna wersja”** (`exact`) oraz **„Warianty lokali”** (`variant`), nigdy nie przepisywać własnej nazwy lokalu na nazwę kanoniczną.

**[R — wyszukiwanie]** Zapytanie „nojito Warszawa” powinno trafiać do kanonicznego Virgin Mojito przez alias, a następnie zwracać oba rodzaje powiązań; wynik musi jasno oznaczać warianty. Dla zapytania „Garden Mojito” wyszukiwarka powinna dodatkowo odnaleźć dokładną pozycję lokalu, nawet jeśli powiązanie kanoniczne zostanie później zmienione.

**[R — koszt]** Dodatkowy koszt względem obecnego modelu to nullable FK, enum relacji, aliasy, audyt decyzji i dwa widoki na stronie klasyka. Największym kosztem nie jest baza, tylko utrzymywanie granic kanonu i usuwanie fałszywych powiązań; ograniczenie prawa tworzenia klasyków do UNI zamienia nieograniczoną moderację w małą kolejkę wyjątków.

## Co pokazują precedensy

| Platforma | Encja kanoniczna | Kto ją tworzy | Powiązanie z lokalem/menu | Co się psuje lub czego brakuje |
|---|---|---|---|---|
| **Untappd** | **[D]** Piwo przypisane do browaru, wspólne w całym serwisie. | **[D]** Zarejestrowani użytkownicy i browary; uprawnienia mogą zostać odebrane za błędne wpisy.[^21][^22] | **[D]** Lokal wyszukuje istniejące piwo i dodaje je do menu; lokalne szczegóły pozycji nie zmieniają globalnej encji.[^23][^24] | **[D]** Duplikaty istnieją na tyle często, że są osobne mechanizmy merge, alias i akceptacja administratora; specjalne opakowanie lub nitro nie powinno tworzyć nowego piwa.[^25][^21][^26] **[R]** To najmocniejszy precedens dla oddzielenia kanonu od wystąpienia w lokalu, ale jego otwarte tworzenie wymaga zespołu porządkowego, którego UNI nie ma. |
| **Vivino** | **[D]** Wino/etykieta producenta, z rocznikiem jako istotnym wymiarem; skan i wyszukiwanie korzystają z jednej bazy.[^27][^28] | **[D]** Użytkownik przesyła etykietę, a brak dopasowania może trafić do ręcznej identyfikacji zespołu.[^27][^29] | **[O]** Encja łączy oceny i oferty butelki, nie autorskie pozycje restauracji. | **[D+R]** Roczniki i poziomy agregacji komplikują tożsamość; badanie Vivino wskazuje, że przy małej liczbie ocen publikowana bywa średnia całego wina zamiast konkretnego rocznika.[^30] To ostrzeżenie, by UNI nie mieszało oceny klasyka z oceną wykonania w lokalu. |
| **Google Maps** | **[D]** Menu item/dish jest elementem profilu konkretnego lokalu; „popular dishes” agregują zdjęcia, nazwy i opinie na tej samej stronie lokalu.[^31][^32] | **[D]** Właściciel i klienci mogą dodawać nazwy i zdjęcia; nazwa właściciela ma pierwszeństwo.[^33][^34] | **[D]** Brak jawnej globalnej encji „Mojito” łączącej lokale; użytkownik może zgłosić błędną nazwę lub brak dania.[^31] | **[D+R]** Nie każde danie jest dodawane, publikacja edycji nie jest gwarantowana, a rozstrzygnięcie pozostaje lokalne.[^31][^33] To nie rozwiązuje pytania UNI „gdzie dziś dostanę ten klasyk?”. |
| **Yelp** | **[D]** „Popular Dish” w obrębie jednego biznesu, wyprowadzany z recenzji i zdjęć. | **[D]** Wybór jest automatyczny; właściciel nie może ręcznie dodać dania jako popularnego.[^35] | **[D]** Partner danych menu może dostarczyć cenę, opis i zamawianie, lecz popularność pozostaje cechą lokalu.[^35] | **[D+R]** Automatyzacja ogranicza gaming właściciela, lecz może utrzymywać przestarzałe dania, które trzeba zgłaszać.[^35] Nie tworzy między-lokalowego kanonu. |
| **Tripadvisor** | **[L]** Nie znaleziono dostępnej publicznie dokumentacji opisującej globalną encję dania lub mechanizm łączenia tego samego drinka między lokalami. | **[L]** Dostępny wynik centrum pomocy wymagał JavaScriptu i nie ujawnił reguł modelu.[^36] | **[O]** Publiczne doświadczenie produktu koncentruje się na stronach lokali, menu, zdjęciach i recenzjach. | **[L+R]** Brak przejrzystej dokumentacji to sam w sobie wynik: nie należy przedstawiać Tripadvisor jako potwierdzonego precedensu dla kanonicznych drinków. |
| **TheFork** | **[D]** Danie jest pozycją à la carte konkretnej restauracji. | **[D]** Restaurator wpisuje nazwę, opis, cenę i zdjęcie albo przesyła PDF/link.[^37][^38] | **[D]** Zdjęcie wiąże się z pozycją w menu tego lokalu; nie ma udokumentowanego wspólnego ID dania między restauracjami.[^37] | **[R]** Bardzo małe tarcie i wierne odwzorowanie karty są dobre dla pozyskania danych, ale model nie odpowiada na wyszukiwanie wspólnego drinka. |
| **Wolt** | **[D]** Produkt/pozycja w listingu konkretnego merchant account. | **[D]** Merchant dodaje i edytuje nazwę, opis, cenę, VAT, alergeny i informację o alkoholu.[^39][^40] | **[D]** Pozycje, warianty i dostępność są zarządzane w menu lokalu; dokumentacja nie opisuje globalnego wspólnego dania. | **[R]** Optymalizuje zamówienie z jednego lokalu, więc duplikacja nazw między lokalami nie jest krytycznym błędem. To inny cel niż UNI. |
| **Uber Eats** | **[D]** Danie/pozycja oraz grupy modyfikatorów w menu konkretnego sklepu.[^41] | **[D]** Merchant tworzy lub aktualizuje nazwy, opisy, zdjęcia i modyfikatory.[^41] | **[D]** Brak udokumentowanej warstwy globalnego klasyka w dostępnej dokumentacji. | **[R]** Wygodne menu lokalne nie daje semantycznego łączenia między restauracjami. |
| **Glovo** | **[L]** Nie znaleziono dostępnej, pierwszoplanowej dokumentacji technicznej, która ujawniałaby model kanonicznych dań i ich relacji z lokalnymi pozycjami. | **[L]** Brak podstaw do wiarygodnego opisania uprawnień tworzenia wspólnej encji. | **[L]** Nie należy wnioskować ze zbliżonego interfejsu, że wewnętrzny model jest taki sam jak Wolt/Uber Eats. | **[L]** To wyraźna luka dowodowa, a nie potwierdzenie braku normalizacji wewnętrznej. |
| **Open Food Facts** | **[D]** Opakowany produkt identyfikowany przede wszystkim kodem kreskowym, z danymi i zdjęciami etykiety.[^42][^43] | **[D]** Społeczność może dodawać i poprawiać produkty.[^42][^44] | **[D]** Nie jest to model menu lokalu; barcode zapewnia mocniejszy naturalny klucz niż nazwa drinka mieszanego. | **[D]** OFF jawnie stawia łatwość zbierania ponad blokującą kontrolę jakości i przyznaje, że baza nie będzie bezbłędna.[^45] **[R]** UNI może przejąć audyt i poprawialność, ale nie barcode-first identity dla drinków robionych na miejscu. |
| **IBA** | **[D]** Oficjalny koktajl i standaryzowana receptura; lista jest branżowym punktem odniesienia od 1961 r., a wydanie 2026 obejmuje 101 pozycji.[^1][^2] | **[D]** Kanon tworzy organizacja zawodowa, nie lokal. | **[D]** Brak powiązania z menu konkretnych lokali. | **[D+R]** Lista obejmuje alkoholowe pierwowzory, np. Mojito zawiera rum.[^3] Jest dowodem rozpoznawalności nazwy, nie gotową listą wersji bezalkoholowych. |
| **Difford’s Guide** | **[D]** Redakcyjna receptura drinka z nazwą, składem, metodą i statusem alcohol-free; osobno istnieją community recipes.[^12][^46][^47] | **[D]** Redakcja oraz społeczność, ale treści społeczności są jawnie oznaczone jako nieprzetestowane i niezweryfikowane.[^46] | **[D]** Brak encji lokalu; wariant jest odrębną recepturą lub aliasem w przewodniku. | **[R]** Dobre źródło aliasów i odcisków receptur, lecz nie standard dostępności w Polsce ani arbitraż lokalnych nazw. |
| **ChillMaps / MockTale** | **[D]** Markowy napój, typ napoju i/lub wpis menu lokalu; produkty komunikują wyszukiwanie marek, stylów, mocktaili i miejsc.[^48][^49][^50] | **[D]** Dane pochodzą także ze zgłoszeń społeczności i skanowania menu.[^48][^51] | **[D]** Publiczny opis mówi o realnych menu i filtrach kategorii, lecz nie ujawnia reguły klasyk–wariant. | **[L+R]** Nie znaleziono publicznej specyfikacji, która rozstrzygałaby „Virgin Mojito” kontra autorski riff. Skala katalogu nie dowodzi jakości normalizacji. |
| **NA Bar Finder** | **[D]** Zweryfikowany lokal i dosłowna pozycja z opublikowanego menu; serwis deklaruje ręczne sprawdzanie i datę weryfikacji.[^52][^53] | **[D]** Zgłoszenia przechodzą ręczny review.[^52] | **[D]** Wyszukiwanie obsługuje 24 zdefiniowane rodzaje, m.in. NA Negroni, NA Spritz i zero-proof Espresso Martini, a wynik zachowuje nazwę pozycji.[^53] | **[R]** To najbliższy celowo precedens dla UNI, ale opiera jakość na ręcznej weryfikacji każdego wpisu — niezgodnej ze skalą samoobsługi bez review. |

**[R — synteza]** Najlepsza kombinacja precedensów to: strukturalne rozdzielenie Untappd (globalny byt + wystąpienie w menu), zachowanie dosłownego menu z NA Bar Finder, redakcyjne odciski i jawny status treści z Difford’s oraz zasada Open Food Facts, by kontrola jakości nie blokowała zbierania danych.[^25][^23][^45][^46][^53]

## Lista startowa dla Polski

**[R — polityka listy]** Start powinien być **małym, kuratorowanym rejestrem**, a nie zamkniętym standardem. Nowy kandydat wchodzi do kolejki po znalezieniu w co najmniej trzech niepowiązanych polskich lokalach lub po mocnym źródle branżowym i co najmniej jednym polskim menu; founder zatwierdza dopiero wtedy, gdy może zapisać odcisk, aliasy i granicę wariantów.

| Nazwa PL | Nazwa EN / slug | Pisownie do dopasowania | Dlaczego na start |
|---|---|---|---|
| Virgin Mojito | Virgin Mojito | `virgin mojito`, `mojito virgin`, `mojito 0`, `mojito 0%`, `mojito 0,0%`, `bezalkoholowe mojito`, `mojito bezalkoholowe`, `nojito`, `no-jito` | **[D+R]** Najsilniej udokumentowana powtarzalność w warszawskich i polskich menu; stabilny odcisk limonka–mięta–słodycz–gazowanie.[^4][^5][^6][^7][^54] |
| Virgin Piña Colada | Virgin Piña Colada | `virgin piña colada`, `virgin pina colada`, `pina colada virgin`, `pinacolada virgin`, `piña colada 0%`, `pina colada 0%`, `bezalkoholowa piña colada` | **[D+R]** Niezależne menu pokazują powtarzalny rdzeń ananas–kokos–kremowość.[^4][^5][^6] |
| Virgin Mary | Virgin Mary | `virgin mary`, `bloody shame`, `bloody mary 0%`, `bloody mary zero`, `bezalkoholowa bloody mary` | **[D+R]** Ugruntowany bezalkoholowy klasyk w Difford’s i realnym menu warszawskim.[^10][^6] |
| Shirley Temple | Shirley Temple | `shirley temple`, `szirlej temple` tylko jako słaby alias fonetyczny | **[D+R]** Klasyk pierwotnie bezalkoholowy z udokumentowaną recepturą, mimo że w zebranych warszawskich menu był mniej widoczny.[^12] |
| Spritz 0% | Non-Alcoholic Spritz | `spritz 0%`, `spritz zero`, `spritz bezalkoholowy`, `aperitivo spritz 0%`, `aperol spritz 0` | **[O+R]** Forma regularnie występuje w polskich materiałach i menu; marki trzeba oddzielić od klasyka.[^6][^7][^16][^55] |
| Hugo 0% | Non-Alcoholic Hugo | `hugo 0%`, `hugo zero`, `hugo bezalkoholowe`, `virgin hugo`, `hugo spritz 0%` | **[O+R]** Co najmniej dwa warszawskie menu pokazują tę nazwę, choć receptury wymagają szerokiego odcisku.[^14][^15] |
| Negroni 0% | Non-Alcoholic Negroni | `negroni 0%`, `negroni zero`, `negroni non-alcohol`, `virgin negroni`, `nogroni`, `NOgroni` | **[D+R]** Alias NOgroni występuje w źródle recepturowym, a Negroni Non-Alcohol w polskich publikacjach o menu.[^10][^17] |
| Gin & Tonic 0% | Non-Alcoholic Gin & Tonic | `gin tonic 0%`, `gin & tonic 0%`, `gin z tonikiem 0%`, `virgin gin tonic`, `g&t 0%` | **[O+R]** Polski materiał opisuje wariant Gin & Tonic na bezalkoholowym ginie, a warszawskie menu mają drinki o tej bazie; wymaga jawnego kontekstu 0%.[^15][^17] |
| Whiskey Sour 0% | Non-Alcoholic Whiskey Sour | `whiskey sour 0%`, `whisky sour 0%`, `whiskey sour zero`, `virgin whiskey sour`, `bezalkoholowy whiskey sour` | **[O+R]** Pełna wersja 0% jest udokumentowana w warszawskim menu.[^14] |
| Gin Basil Smash 0% | Non-Alcoholic Gin Basil Smash | `gin basil smash 0%`, `basil smash 0%`, `virgin basil smash`, `bezalkoholowy gin basil smash` | **[O+R]** Realna wersja 0% w Warszawie i oficjalny alkoholowy pierwowzór IBA.[^14][^18] |
| Espresso Martini 0% | Non-Alcoholic Espresso Martini | `espresso martini 0%`, `espresso martini 0.0%`, `espresso martini zero`, `virgin espresso martini`, `bezalkoholowe espresso martini` | **[O+R]** Wersja 0% występuje w warszawskim menu, a nazwa pierwowzoru jest w IBA New Era.[^6][^18] |
| Pornstar Martini 0% | Non-Alcoholic Pornstar Martini | `pornstar martini 0%`, `porn star martini 0%`, `pornstar martini zero`, `virgin pornstar martini` | **[O+R]** Wersja 0% występuje w warszawskim menu, a pierwowzór jest oficjalnym koktajlem IBA.[^15][^19] |
| Mimosa 0% | Non-Alcoholic Mimosa | `mimosa 0%`, `mimosa zero`, `virgin mimosa`, `bezalkoholowa mimosa` | **[O+R]** Bezalkoholowa Mimosa jest obserwowana w warszawskiej ofercie, a alkoholowy pierwowzór jest rozpoznany przez IBA.[^17][^56] |
| Bellini 0% | Non-Alcoholic Bellini | `bellini 0%`, `bellini zero`, `virgin bellini`, `bellini bezalkoholowe` | **[D+R]** Bellini jest klasykiem IBA, a na polskim rynku występują produkty i zastosowania alcohol-free; przed szerokim wdrożeniem warto potwierdzić w danych menu UNI.[^1][^57] |
| Paloma 0% | Non-Alcoholic Paloma | `paloma 0%`, `paloma zero`, `virgin paloma`, `bezalkoholowa paloma` | **[D+R]** Paloma jest na liście IBA New Era, ale polska obserwacja menu jest słabsza; oznaczyć jako **provisional** i aktywować publiczną stronę po pierwszych lokalnych trafieniach.[^19][^58] |

**[R — czego nie dodawać od razu]** „Mocktail”, „koktajl bezalkoholowy”, „drink 0%”, „lemoniada” i „spritz” bez kwalifikatora to kategorie lub zbyt szerokie nazwy, nie klasyki. „Amalfi Rosa”, „Passion Fruit Emotions”, „Vanilla Sky”, „Green Gin” i podobne nazwy powinny pozostać pozycjami lokali, dopóki niezależne użycie i wspólny odcisk nie pokażą czegoś innego.[^14][^15][^6]

## Jak rośnie kanon

**[R — proces]** Raz w miesiącu system powinien wygenerować listę niepowiązanych, znormalizowanych nazw użytych w co najmniej trzech niezależnych lokalach. Founder wykonuje tylko jedną z czterech operacji: `create canonical`, `add alias`, `map as variant`, `ignore for 90 days`; właściciele nie tworzą publicznych kanonów.

**[R — trendy]** „Espresso Martini 0%” nie powinno czekać na zewnętrzny komitet: gdy nazwa ma rozpoznawalny alkoholowy pierwowzór, co najmniej jedno wiarygodne źródło recepturowe lub branżowe i powtarza się w polskich menu, może wejść jako `provisional`. Status zmienia się na `established` po co najmniej trzech niepowiązanych lokalach albo po ręcznym potwierdzeniu szerokiej obecności.

**[R — nie używać liczby jako definicji]** Próg lokali jest wyzwalaczem review, nie automatycznym awansem. Cztery lokale jednej sieci liczą się jako jeden niezależny wzorzec, a sezonowa kampania marki nie powinna sama tworzyć klasyka.

## Polskie nazewnictwo i popyt

**[O — menu]** Polskie menu mieszają angielski i polski bez jednej dominującej składni: znaleziono `VIRGIN MOJITO`, `MOJITO VIRGIN`, `Mojito 0`, `Whiskey Sour 0%`, `Gin Basil Smash 0%`, `Hugo 0%`, `Espresso Martini 0.0%`, nagłówki `Mocktails`, `Moktajle / Koktajle` i `Koktaile bezalkoholowe`.[^4][^5][^15][^6][^7][^14]

**[R — konsekwencja]** Indeks wyszukiwania powinien normalizować wielkość liter, polskie znaki, `0`, `0%`, `0,0%`, `0.0%`, myślniki, `&` oraz kolejność `virgin + nazwa` / `nazwa + virgin`. Nie należy jednak usuwać tokenu `0%` przed rozstrzygnięciem, bo `Espresso Martini` bez niego oznacza zwykle drink alkoholowy, którego UNI nie kataloguje.

**[L — popyt wyszukiwarkowy]** Nie znaleziono publicznie dostępnych, wiarygodnych wolumenów zapytań **według miasta** dla `virgin mojito Warszawa`, `mojito bezalkoholowe Warszawa` ani pozostałych klasyków. Google Trends publikuje względny indeks, a nie dokładne liczby; dokładniejsze wolumeny i lokalizacje oferują narzędzia typu Google Ads/Keyword Tool, Senuto lub SEMSTORM, zwykle po zalogowaniu lub odpłatnie.[^59][^60][^61][^62]

**[O — sygnał, nie wolumen]** Istnieją polskie strony celujące w zapytania o `drinki bezalkoholowe Warszawa` oraz indeksy menu dla `Virgin Mojito`, co potwierdza, że taki język jest używany w treściach wyszukiwalnych, lecz nie dowodzi konkretnego popytu ani jego wielkości.[^63][^64][^65]

**[R — badanie przed premierą]** Najtańszy wiarygodny test to eksport z Google Ads Keyword Planner dla Polski i Warszawy dla pakietu aliasów, a po uruchomieniu — Search Console z wymiarem query oraz landing page. UNI powinno mierzyć także wyszukiwania wewnętrzne bez wyników, bo to bezpośrednio pokaże lokalną intencję, której zewnętrzne narzędzia mogą nie rejestrować.

## Zachowanie właścicieli

| Gaming / błąd | Co robi właściciel | Zysk | Prawdopodobieństwo | Najtańsze zabezpieczenie |
|---|---|---|---|---|
| „Każdy drink jest signature” | Zostawia zwykłe Virgin Mojito jako własną kreację. | **[R]** Prestiż i własna narracja na stronie lokalu. | **[R] Wysokie** | **[R]** Nie odbierać autorstwa: zachować własną nazwę/opis, a powiązanie opisać jako dodatkową wyszukiwalność. |
| „Wszystko jest klasykiem” | Przypina autorskie pozycje do popularnego Mojito/Negroni. | **[R]** Obecność na stronie z ruchem. | **[R] Wysokie** | **[R]** Tylko istniejący kanon z autocomplete; nie pozwalać właścicielowi tworzyć nowej strony; pokazywać dokładną nazwę i sekcję „warianty”. |
| Duplikowanie pozycji | Dodaje ten sam drink kilka razy z drobnymi zmianami pisowni. | **[R]** Wyższy licznik wyboru i potencjalnie lepsza pozycja lokalu. | **[R] Średnie–wysokie** | **[R]** Ostrzeżenie fuzzy duplicate w obrębie lokalu i nieuwzględnianie oczywistych duplikatów w score; wzorzec „search before create” stosuje Untappd.[^66] |
| Nadużycie aliasu marki | Wpisuje „Aperol Spritz 0%”, choć nie używa Aperolu ani produktu tej marki. | **[R]** Rozpoznawalność handlowa. | **[R] Średnie** | **[R]** Zachować raw name jako deklarację lokalu, ale canonical nazwać `Spritz 0%`; nie tworzyć strony marki bez produktu katalogowego. |
| Ukryty alkohol | Przypina koktajl z bitterem/likierem alkoholowym albo „low alcohol”. | **[R]** Większa widoczność bez sprawdzenia finalnego ABV. | **[R] Niskie–średnie, wysoki koszt błędu** | **[R]** Jeżeli opis zawiera markę/składnik znany jako alkoholowy i brak `0%`, blokować automatyczne powiązanie i pokazać krótkie ostrzeżenie. Polska granica prawna napoju alkoholowego to powyżej 0,5% obj.[^67][^68] |
| Fałszywy „exact” | Wariant rabarbarowy oznacza jako klasyczną wersję. | **[R]** Trafia do pierwszej sekcji strony klasyka. | **[R] Średnie** | **[R]** Domyślnie `variant`, gdy nazwa ma dodatkowy dominujący smak; `exact` tylko dla mocnych aliasów i zgodnego opisu. |
| Słowo kluczowe w nazwie | Zmienia nazwę na „Mojito Negroni Spritz 0%”. | **[R]** Próba wejścia na wiele stron. | **[R] Niskie na początku** | **[R]** Maksymalnie jeden canonical parent w MVP; multi-parent tylko po ręcznej decyzji UNI. |
| Usuwanie opisu | Wpisuje samą modną nazwę, aby system nie wykrył sprzeczności. | **[R]** Łatwiejsze niepoprawne przypięcie. | **[R] Średnie** | **[R]** Dla niejednoznacznych aliasów wymagaj kontekstu 0% w nazwie/typie; bez niego pozostaw `own`, bez blokowania zapisu. |
| Częste wyłączanie/włączanie | Odświeża pozycję, by wyglądała na nową. | **[R]** Potencjalny ranking freshness. | **[R] Niskie** | **[R]** Nie używać `updated_at` właściciela jako sygnału rankingu; utrzymywać osobne `source_seen_at` i historię. |
| Tworzenie wielu wariantów | Rozbija jeden drink na wersję malinową, mango, marakuja itd. | **[R]** Więcej „wyboru” w rankingu. | **[R] Średnie** | **[R]** W score oddzielić liczbę pozycji od różnorodności: malejąca wartość kolejnych wariantów tego samego parenta; publicznie nadal pokazać wszystkie prawdziwe pozycje. |

**[R — zasada antygamingowa]** Klasyfikacja `exact/variant/own` nie może sama wpływać na ranking lokalu: każda realna pozycja liczy się według tych samych reguł, a oczywiste duplikaty nie liczą się podwójnie. Na stronie klasyka kolejność lokali powinna zależeć od użyteczności dla użytkownika — przede wszystkim odległości, dostępności i świeżości potwierdzenia — nigdy od opłaty, liczby kliknięć właściciela ani statusu „exact” kupowalnego wysiłkiem.

## Tekst panelu właściciela

**[R — nagłówek pola]** `Czy ten drink jest wersją znanego klasyka?`

**[R — opis]** `Dzięki temu osoby szukające np. Virgin Mojito znajdą również Twój drink. Jego własna nazwa i opis pozostaną bez zmian na stronie lokalu.`

**[R — podpowiedź po nazwie]** `To wygląda jak: Virgin Mojito`

- **[R]** Przycisk główny: `Tak — to Virgin Mojito lub jego wariant`
- **[R]** Przycisk drugi: `Nie — to inny drink`
- **[R]** Link pomocniczy: `Jak to rozróżniamy?`

**[R — drugi krok tylko po „Tak”]**

- `Klasyczna wersja` — `Nazwa lub skład odpowiada zwykłemu Virgin Mojito; drobne różnice wykonania są OK.`
- `Własny wariant` — `Drink ma dodatkowy dominujący smak, inną bazę albo autorską nazwę.`

**[R — przykład inline]** `„Virgin Mojito” → klasyczna wersja · „Garden Mojito z rabarbarem” → własny wariant · „Garden Fresh: ogórek, jabłko, bazylia” → inny drink.`

**[R — nie używać]** Należy unikać etykiet `Klasyk / Autorski` jako dwóch równorzędnych radio buttonów. Sugerują one wybór tożsamości i prestiżu, podczas gdy właściwe pytanie brzmi o relację wyszukiwawczą; „własny wariant klasyka” może być jednocześnie autorski.

**[D+R — wzorce interakcji]** Dobre precedensy to Untappd: najpierw wyszukaj istniejący rekord, a dopiero przy braku dodaj nowy; Google: właścicielska nazwa ma pierwszeństwo, lecz społeczność może zgłosić błąd; Difford’s: treści społeczności są jawnie oznaczone jako niezweryfikowane. UNI powinno przejąć te zasady, ale nie dosłowne słownictwo.[^33][^66][^46]

## Moderacja bez kolejki przed publikacją

**[R — publikacja]** Edycja właściciela publikuje się od razu na stronie lokalu. Powiązanie z klasykiem publikuje się od razu tylko przy mocnym aliasie i braku konfliktu w opisie; pozostałe przypadki trafiają jako `variant` z niższym confidence albo pozostają `own` bez blokowania zapisu.

**[R — korekta po fakcie]** Founder potrzebuje jednej kolejki ryzyka, nie przeglądu wszystkich edycji. Priorytet: (1) składniki mogące oznaczać alkohol, (2) nowe przypięcia do najczęściej odwiedzanych klasyków, (3) gwałtowny wzrost liczby pozycji lokalu, (4) zgłoszenia użytkowników i (5) nowe kandydaty do kanonu.

**[R — uprawnienia]** Właściciel może wybierać tylko z istniejącej listy klasyków i zgłosić „brakuje klasyka” jednym kliknięciem; zgłoszenie nie tworzy publicznej strony. To blokuje najtańszą formę spamu SEO bez zwiększania zwykłego formularza.

## Koszt zmiany później

| Punkt startowy | Migracja po kilkuset lokalach | Ryzyko |
|---|---|---|
| Tylko obecne `house_drinks` | **[R]** Normalizacja nazw, klastrowanie fuzzy, analiza opisów, utworzenie aliasów, masowe przypięcie pewnych przypadków, ręczny review niejednoznacznych, przekierowania URL jeśli powstaną nowe strony. | **[R] Wysokie**: „Nojito”, „Mojito 0%” i nazwy autorskie nie łączą się po prostym equality. |
| Każdy klasyk jako dzisiejszy `product` | **[R]** Trzeba dodać warstwę wystąpienia lokalu i odzyskać raw name/opis, których produkt wspólny nie powinien nadpisywać. | **[R] Bardzo wysokie**, jeśli oryginalny tekst menu został utracony. |
| Either/or: `product` albo `house_drink` | **[R]** Trzeba utworzyć wspólną tabelę pozycji lub polymorphic view, przenieść relacje venue–product i house rows, a następnie znaleźć warianty. | **[R] Średnie–wysokie**; dwa lifecycle’y i dwa zestawy reguł długo pozostają źródłem błędów. |
| `venue_menu_item` + nullable `canonical_drink_id` od początku | **[R]** Później zmieniają się aliasy, odciski i FK; raw dane oraz historia pozostają. | **[R] Niskie**; błędne decyzje klasyfikacyjne są odwracalne. |

**[R — bezpieczny start teraz]** Nawet bez pełnego panelu należy już zapisywać: dokładny `raw_name`, `raw_description`, `venue_id`, typ, źródłowy URL lub plik, datę zaobserwowania, aktywność oraz nullable `canonical_drink_id` i `relation`. Nie należy kodować czterech obecnych „house types” jako wzajemnie wykluczających prawd domenowych; to tag prezentacyjny, który może współistnieć z relacją do klasyka.

**[R — plan migracji]** Kolejność po istniejących danych: (1) backup i stabilne ID; (2) utworzenie `venue_menu_items`; (3) migracja house drinks 1:1; (4) migracja relacji venue–product jako menu items z zachowaniem oryginalnego tekstu linii; (5) canonical seed; (6) deterministic alias matching; (7) fuzzy candidate report; (8) ręczna ocena tylko niepewnych klastrów; (9) indeksacja i redirecty; (10) porównanie liczników wyboru przed/po.

## Co mierzyć po starcie

| Metryka | Definicja | Sygnał powodzenia / alarm |
|---|---|---|
| Canonical coverage | **[R]** Odsetek aktywnych mixed NA menu items z `canonical_drink_id`. | **[R]** Rośnie bez gwałtownego wzrostu zgłoszeń błędów. |
| Exact/variant share | **[R]** Udział obu relacji na klasyk i lokal. | **[R]** 100% `exact` u właściciela to możliwy gaming; 0% powiązań to niezrozumiały UI. |
| Suggestion acceptance | **[R]** Akceptacja podpowiedzi, odrzucenie i późniejsze cofnięcie. | **[R]** Wysoka akceptacja plus niski reversal oznacza dobre aliasy. |
| Reversal rate | **[R]** Odsetek owner decisions zmienionych przez UNI lub społeczność w 30 dni. | **[R]** Najważniejsza miara jakości bez premoderacji. |
| Search success | **[R]** Odsetek wyszukiwań klasyka z co najmniej jednym lokalnym wynikiem i kliknięciem. | **[R]** Powinien poprawić podstawową odpowiedź produktu „gdzie dostanę ten drink?”. |
| Zero-result queries | **[R]** Najczęstsze zapytania bez wyniku, po normalizacji. | **[R]** Źródło nowych aliasów i kandydatów do kanonu. |
| Variant CTR | **[R]** Klikalność wariantów kontra exact przy tej samej ekspozycji. | **[R]** Pokazuje, czy podział jest dla ludzi użyteczny, nie tylko czysty semantycznie. |
| Duplicate pressure | **[R]** Liczba ostrzeżeń o duplikacie i pozycji scalonych na lokal. | **[R]** Wzrost po zmianie rankingu ujawnia gaming. |
| Time to canonicalize | **[R]** Dni od trzeciego niezależnego lokalu do decyzji foundera. | **[R]** Kontroluje backlog bez obietnicy automatycznego awansu. |
| Freshness | **[R]** Mediana dni od ostatniego potwierdzenia menu, osobno owner/source/community. | **[R]** Chroni przed stronami klasyków pełnymi nieaktualnych lokali. |
| Ranking sensitivity | **[R]** Zmiana pozycji lokalu po dodaniu N podobnych wariantów. | **[R]** Powinna szybko maleć; inaczej system nagradza mnożenie wpisów. |
| Harmful false positive | **[R]** Powiązanie drinka zawierającego alkohol >0,5% z ofertą UNI. | **[R]** Cel operacyjny: zero; każdy przypadek wymaga analizy reguły.[^67] |

## Pytania pominięte, ale ważne

**[R — świeżość]** UNI potrzebuje statusu `last_seen` i prostego wygaszania, ponieważ poprawnie sklasyfikowany drink może zniknąć z menu. Wysokie pozycje na stronie klasyka z nieaktualną dostępnością podważą produkt szybciej niż kilka brakujących aliasów; NA Bar Finder eksponuje datowanie i ręczne potwierdzenie jako część swojej wartości.[^52][^53]

**[R — finalny ABV]** Trzeba ustalić, czy zakres UNI obejmuje wynik do 0,5% ABV zgodny z polską definicją ustawową „niealkoholowego”, czy wyłącznie literalne 0,0%. Polskie prawo kwalifikuje jako napój alkoholowy produkt przekraczający 0,5% obj., lecz obietnica produktu może być ostrzejsza niż minimum prawne.[^67][^68]

**[R — score lokalu]** Liczenie każdej pozycji jednakowo nie wystarczy, jeśli właściciel może mnożyć warianty. Należy rozdzielić publiczny katalog od rankingu: użytkownik widzi wszystkie realne pozycje, natomiast score stosuje malejącą wagę kolejnych drinków pod tym samym canonical parentem i osobny bonus za różnorodność kategorii, bez wpływu pieniędzy.

**[R — znaki towarowe]** Raw menu może zawierać nazwy marek, ale strona kanoniczna powinna używać nazwy generycznej, gdy marka nie jest rzeczywistym katalogowym produktem. To zmniejsza ryzyko, że UNI samo potwierdza mylący skład zamiast jedynie cytować deklarację lokalu.

**[R — jeden rodzic w MVP]** Drink powinien mieć maksymalnie jeden canonical parent w pierwszej wersji. Wielodziedziczenie („Mojito-Spritz”) komplikuje ranking i pozwala wejść na wiele stron; można je dodać później jako niepubliczne tagi podobieństwa, jeśli dane pokażą realną potrzebę.

**[R — treści stron klasyków]** Opisy i odciski należy pisać własnymi słowami, a źródła receptur traktować jako materiał faktograficzny. Nie należy kopiować pełnych receptur ani opisów z przewodników; strona UNI ma odpowiadać „gdzie”, nie zastępować publikacji barmańskiej.

## Plan wdrożenia solo

1. **[R]** Zastąpić dwa publiczne typy jedną tabelą `venue_menu_items`, pozostawiając produkty opakowane jako osobny katalog i relację dostępności.
2. **[R]** Dodać nullable parent i `exact/variant`; zasilić pierwsze 10–15 klasyków wraz z aliasami.
3. **[R]** Przepiąć istniejące Virgin Mojito deterministycznie po mocnych aliasach; nie dopasowywać własnych nazw bez opisu.
4. **[R]** Uruchomić stronę klasyka z rozdzieleniem klasycznych wersji i wariantów oraz neutralnym sortowaniem lokali.
5. **[R]** W panelu wdrożyć sugestię po wpisaniu istniejących pól, bez dodatkowego wymaganego pytania.
6. **[R]** Dodać log decyzji, zgłoszenie błędu i miesięczny raport kandydatów zamiast premoderacji.
7. **[R]** Po 8–12 tygodniach ocenić coverage, reversal, zero-result queries, duplicate pressure i ranking sensitivity; dopiero potem rozszerzać kanon.

**[R — końcowa decyzja]** Dla UNI właściwym obiektem pierwotnym jest wierna pozycja menu, a klasyk jest kontrolowaną przez UNI warstwą znaczeniową. Taki model spełnia jednocześnie trzy cele, których model either/or nie potrafi pogodzić: wyszukiwanie między lokalami, zachowanie autorstwa lokalu i odwracalne decyzje przy bardzo małym koszcie moderacji.

---

## References

1. [Cocktails – IBA](https://iba-world.com/cocktails/)

2. [the-official-iba-101-cocktails – IBA](https://iba-world.com/the-official-iba-101-cocktails/)

3. [Mojito – IBA](https://iba-world.com/iba-cocktail/mojito/) - Ingredients 45 ml White Cuban Ron 20 ml Fresh Lime Juice 6 pcs Mint Sprigs 2 tsp White Cane Sugar So...

4. [koktajle cocktails](https://www.motel-one.com/fileadmin/dam/Motel_One_Website/F_B/Motel_One_Warsaw_Drinks_Menu_11_2023.pdf)

5. [Zacny Pyrkot - Restauracja & Pub, Restauracja Warszawa, kuchnia ...](https://zacny-pyrkot.pl/) - Skosztuj zacnej kuchni. Jedyne co można zaryzykować to uzależnienie od naszych pysznych dań! Traditi...

6. [Mocktails / Strefa 0%](https://panoramaskybar.com/menu/mocktails/) - Virgin Pina Colada. Sok Ananasowy, Mleko Kokosowe, Prażone Chipsy Kokosowe 0% ABV. 44 PLN. Espresso ...

7. [Menu napojów bezalkoholowych](https://restauracjapodniebna.pl/pl/menu/menu-napojow-bezalkoholowych/)

8. [MULTIPAK Mojito bezalkoholowe](https://mamyito.pl/mojito-bezalkoholowe-multipak) - Mojito bezalkoholowe, MULTIPAK | Mamyito.pl. Kupisz w najlepszych cenach na Mamyito.pl w supermarkec...

9. [Drinki Bezalkoholowe - Warsaw Free Spirits](https://warsawfreespirits.pl/collections/drinki-bezalkoholowe) - Warsaw Free Spirits - Sklep Bezalkoholowy Online. Najlepsza jakość. Zamów teraz z dostawą do domu. Ż...

10. [Superstar Mocktails: Top Non-Alcoholic Drinks](https://www.diffordsguide.com/g/1283/mocktails/superstar-mocktails) - This Mojito may lack alcohol; indeed, it's alcohol-free -but it's refreshing, balanced, and tasty no...

11. [Drink STRAWBERRY VIRGIN MOJITO Przepisy na koktajle drinki ...](https://www.barexpert.pl/PL-H21/przepisy-na-koktajle/40/strawberry-virgin-mojito.html) - Sklep internetowy oferuje syropy barmańskie, puree owocowe, likiery, dodatki oraz napoje do drinków ...

12. [Shirley Temple Cocktail Recipe](https://www.diffordsguide.com/cocktails/recipe/1817/shirley-temple) - Discover how to make a Shirley Temple using Grenadine syrup, Lemon juice and Ginger ale in just 5 ea...

13. [Dirty Shirley Cocktail Recipe](https://www.diffordsguide.com/cocktails/recipe/15826/dirty-shirley) - Discover how to make a Dirty Shirley using Vodka, Cherry brandy, Grenadine syrup, Lemon juice and Gi...

14. [Karta barowa - TheOne Warsaw](https://theonewarsaw.pl/bar) - Restaurant, club, cocktail bar, lounge and event space in the heart of Warsaw.

15. [W OGRODZIE: dania, ceny i menu - ToDanie](https://www.todanie.pl/restauracje/w-ogrodzie--f6b95e5f-3db0-4ed7-abb6-7769f76b39c2)

16. [Menu Cocktail Bar Warsaw](https://feliksbarcafe.com/menu) - Koktajle, wina i przekąski w Feliks Bar Café przy Nowogrodzkiej 15 w Warszawie. Burrata, salumi, pol...

17. [Gdzie pójść na mocktaile w Warszawie? Lista najlepszych ...](https://www.elle.pl/lifestyle/gdzie-pojsc-na-mocktaile-w-warszawie-ranking-najlepszych-restauracji-i-barow-serwujacych-koktajle-bezalkoholowe-w-stolicy/) - Poza wspaniałą kuchnią Bibenda oferuje dwa koktajle bezalkoholowe, a są nimi: Kombucha spritz i Negr...

18. [All Cocktails – Page 2 – IBA](https://iba-world.com/cocktails/all-cocktails/page/2/)

19. [All Cocktails – Page 4 – IBA - International Bartenders Association](https://iba-world.com/cocktails/all-cocktails/page/4/)

20. [Jesień MENU.A](https://pub-restauracyjny.pl/wp-content/uploads/2021/08/menu-alkohole.pdf)

21. [Brewery Page Management Tools](https://help.untappd.com/hc/en-us/articles/360034035852-Brewery-Page-Management-Tools) - Your brewery account has a variety of tools to manage your portfolio, interact with users and see st...

22. [Add a New Beer/Brewery](https://help.untappd.com/hc/en-us/articles/360034392751-Add-a-New-Beer-Brewery) - You can add beers or breweries if they are not yet in our database by searching for the beer/brewery...

23. [Why Won't My Beers Sync to the Untappd App?](https://help.untappd.com/hc/en-us/articles/4417714845588-Why-Won-t-My-Beers-Sync-to-the-Untappd-App) - You may be editing your beers and notice that they are correct on your menu builder, but not the sam...

24. [Building Menus](https://help.untappd.com/hc/en-us/articles/6378208200212-Building-Menus) - Building menus to display to your customers is the foundational block of your Untappd for Business a...

25. [Breweries - How do I manage my beers on Untappd?](https://help.untappd.com/hc/en-us/articles/360033797752-Breweries-How-do-I-manage-my-beers-on-Untappd) - The purpose of this article is to provide instructions for use of the Beer Management functionality ...

26. [Naming Standards](https://help.untappd.com/hc/en-us/articles/360034018212-Naming-Standards) - We support a variety of different drink types. Before creating your beer or beverage, make sure it i...

27. [How the Vivino Label Scanner works](https://www.vivino.com/en/wine-news/how-the-vivino-label-scanner-works) - If part of a label is missing, try scanning the part that remains – vintage, producer name, and appe...

28. [Download the Vivino App](https://www.vivino.com/en/app) - Never pick the wrong bottle again. Scan bottle labels, shop shelves, or even wine lists to instantly...

29. [Terms of Service](https://www.vivino.com/legal/terms-of-service) - The Vivino Platform allows users to submit, post, and share content, including ratings, reviews, com...

30. [Factors influencing wine ratings in an online wine community](https://www.cambridge.org/core/journals/journal-of-wine-economics/article/factors-influencing-wine-ratings-in-an-online-wine-community-the-case-of-trentinoalto-adige/4728B75F96DB10E627C8E5F9B01BB9C6) - Factors influencing wine ratings in an online wine community: The case of Trentino–Alto Adige - Volu...

31. [Add & explore dishes in Google Maps](https://support.google.com/maps/answer/7321152?hl=en) - Add or edit a dish · Open the Google Maps app Maps . · Search for a place or tap it on the map. · Sc...

32. [About the menu editor - Google Business Profile Help](https://support.google.com/business/answer/9455840?hl=en) - Add, edit, or delete a menu item or section. Go to your Business Profile ... Find and edit popular d...

33. [Manage your restaurant's popular dish names](https://support.google.com/business/answer/9322475?hl=en) - Add, edit, or correct a dish name. Tap Menu. Tap on the dish you want to edit. To edit a dish name, ...

34. [Znajdowanie i edytowanie popularnych dań restauracji](https://support.google.com/business/answer/9322475?hl=pl&authuser=117) - W aplikacji Mapy Google możesz zarządzać menu restauracji w profilu swojej firmy, m.in. przeglądać p...

35. [What are Popular Dishes?](https://biz.yelp.com/support-center/article?articleNumber=000045535&l=en-US)

36. [Tripadvisor Support](https://www.tripadvisorsupport.com/en-US/hc/owner/articles/403) - No information is available for this page.

37. [How to update my restaurant profile on TheFork?](https://support.theforkmanager.com/s/article/How-to-update-my-restaurant-profile-on-TheFork?language=en_US)

38. [How to upload a PDF restaurant menu on TheFork](https://www.theforkmanager.com/en/blog/thefork-tools/upload-pdf-restaurant-menu-thefork) - Learn how to optimise and upload a PDF restaurant menu on The Fork. Enhance your restaurant's online...

39. [How to manage your menu on Wolt - Wolt (Greece)](https://explore.wolt.com/en/grc/merchant/learning-center/manage-menu) - Learn how to easily add new menu items, options, and categories, as well as update photos, prices, a...

40. [How to manage your menu on Wolt - Wolt (Poland)](https://explore.wolt.com/en/pol/merchant/learning-center/manage-menu) - Learn how to easily add new menu items, options, and categories, as well as update photos, prices, a...

41. [Setting up your storefront and Menu](https://merchants.ubereats.com/us/en/academy/storefront/) - Make your dishes easy to customize. · Write thorough descriptions. · Add a clear photo for every ite...

42. [Scan, Discover & Compare ...](https://play.google.com/store/apps/details/Open_Food_Facts_Food_Quality?id=org.openfoodfacts.scanner&hl=en_GB) - Scan barcodes to see if your food is good for you & the planet

43. [Tutorial on using the Open Food Facts API](https://openfoodfacts.github.io/openfoodfacts-server/api/tutorial-off-api/)

44. [Open Food Facts](https://github.com/openfoodfacts) - Open Food Facts is a collaborative, free and open database of food products … scan barcodes and uplo...

45. [Data quality](https://wiki.openfoodfacts.org/Data_quality)

46. [Shirley Fucking Temple (DJS) Cocktail Recipe](https://www.diffordsguide.com/cocktails/recipe/38373/shirley-fucking-temple-djs) - This recipe has not been tested or verified by Difford's Guide. Published on 14th of December 2025. ...

47. [Top 97 Non-alcoholic cocktails by rating](https://www.diffordsguide.com/cocktails/directory/Styles/non-alcoholic) - The top 97 rated Non-alcoholic cocktails on Difford's Guide, such as Berry Blast, Temperance Amaro M...

48. [NA Beer & More: ChillMaps - App Store - Apple](https://apps.apple.com/us/app/na-beer-more-chillmaps/id6450683690) - Download NA Beer & More: ChillMaps by Fried Pickles LLC on the App Store. See screenshots, ratings a...

49. [Mocktail Finder - MockTale - App Store - Apple](https://apps.apple.com/gb/app/mocktale-mocktail-finder/id6752661945) - Download MockTale - Mocktail Finder by Empty Enterprises, LLC on the App Store. See screenshots, rat...

50. [Find Non-Alcoholic Beer Near You | NA Beer Finder by ChillMaps](https://beerfordriving.com/) - NA Beer Finder is now ChillMaps. Search 1M+ bars, restaurants, and stores serving non-alcoholic beer...

51. [Non-Alcoholic Drinks App: Find NA Beer Near You](https://beerfordriving.com/non-alcoholic-drinks-app/) - The free non-alcoholic drinks app. Find NA beer, mocktails, THC drinks, and zero-proof wine at 1 mil...

52. [NA Bar Finder | Find Non-Alcoholic Bars & Mocktails Near You](https://nabarfinder.com/) - Discover bars, restaurants, and shops serving great non-alcoholic drinks. 1548 verified venues acros...

53. [nabarfinder - MCP Connector](https://glama.ai/mcp/connectors/com.nabarfinder/nabarfinder) - Human-verified directory of non-alcoholic bars: 1,500+ venues in 70 cities, rated and re-checked.

54. [SPRITZERS REFRESHING MOCKTAILS 0% MATCHA ...](https://document-tc.galaxy.tf/wdpdf-evddbdbvw5tz77z48hsutysey/file.pdf)

55. [Gotowe Drinki Bezalkoholowe w Butelkach](https://warsawfreespirits.pl/k/drinki-bezalkoholowe/) - Wysokiej jakości, doskonałe w smaku gotowe drinki bezalkoholowe w butelkach. Kolorowa i smaczna prop...

56. [All Cocktails – Page 3 – IBA](https://iba-world.com/cocktails/all-cocktails/page/3/)

57. [BEZALKOHOLOWE - Sklep online Propaganda24h.pl](https://propaganda24h.pl/pl/c/BEZALKOHOLOWE/184) - Szukają Państwo BEZALKOHOLOWE w dobrej cenie i jakości? Zapraszamy do naszej oferty BEZALKOHOLOWE do...

58. [The New Era – IBA](https://iba-world.com/cocktails/the-new-era/) - The New Era · Bee's Knees · Bramble · Canchanchara · Chartreuse Swizzle · Dark 'N' Stormy · Don's Sp...

59. [Baza słów kluczowych](https://www.senuto.com/pl/baza-slow-kluczowych/) - Odkryj, czego szukają użytkownicy w Google. Senuto pokazuje 80 milionów fraz z polskiego rynku — wyb...

60. [keywordtool.io · google-trendsGoogle Trends (Alternative) ⚠️ Trending Keywords【FREE】](https://keywordtool.io/google-trends) - Google Trends alternative ᐈ Find trending keywords & search trends for SEO and keyword research with...

61. [Check Search Volume](https://keywordtool.io/search-volume/google) - Check Google search volume for any keyword list ✅ Get monthly volume, CPC, competition & trend data ...

62. [SEMSTORM - Content marketing, SEO Rank traker and Research Tools](https://www.semstorm.com/pl)

63. [Drinki bezalkoholowe Warszawa - najlepsze bary i drinki](https://warszawacodziennie.pl/drinki-bezalkoholowe-warszawa/) - Szukasz orzeźwiających alternatyw dla klasycznych drinków w Warszawie, które pozwolą Ci cieszyć się ...

64. [Virgin mojito - województwo małopolskie - menu i zdjęcia](https://menuradar.pl/pl/wojewodztwo-malopolskie/menu/virgin-mojito/)

65. [Drinki bezalkoholowe Warszawa – najlepsze bary i miejsca](https://jawarszawiak.pl/gdzie-zjesc/drinki-bezalkoholowe-warszawa/) - Szukasz idealnego drinka bezalkoholowego, który umili Ci wieczór w Warszawie, a może zastanawiasz si...

66. [How do I add a beer to my menu that doesn't exist yet?](https://help.untappd.com/hc/en-us/articles/360035813472-How-do-I-add-a-beer-to-my-menu-that-doesn-t-exist-yet) - Here's a step-by-step guide to show you how you can add brand new beers to the Untappd database dire...

67. [stan po spożyciu alkoholu; stan nietrzeźwości] - Art. 46.](https://sip.lex.pl/akty-prawne/dzu-dziennik-ustaw/wychowanie-w-trzezwosci-i-przeciwdzialanie-alkoholizmowi-16791032/art-46) - Sprawdź aktualny stan prawny - Art. 46. - [Napój alkoholowy; stan po spożyciu alkoholu; stan nietrze...

68. [Pytania i odpowiedzi - KCPU](https://kcpu.gov.pl/prawo/pytania-i-odpowiedzi/)

