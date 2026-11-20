# NA Menu Extractor: Addendum to LARAVEL_HANDOFF.md

Written 10 Nov 2026 from the code in `menu_na/`, the stored results in `results/`, the origin file
`src/.sources.json`, and the build-session transcript of 9 Nov 2026. Every rule is cited as `file:line`.
Where the code or the records do not settle a question, the text says **not determined by the code**
(or **no record**).

Sources used, and what each one can and cannot tell you:

| Source | What it holds |
|---|---|
| `menu_na/*.py`, `menu_na/static/*.html` | The code as it is now. No file changed after 19:35 on 9 Nov. |
| `results/compare-20261109-143629/` | The only comparison run: 13 menus × 7 models, live calls, `runs.csv`, `compare.csv`, `mismatches.csv`, one JSON per model and menu. It stores `input_tokens`, `output_tokens`, `cost_usd` and `seconds`. It does **not** store `stop_reason` or thinking tokens. |
| `results/batches/msgbatch_01HZme6TtzTKBG4QmjFQ6Y2T.json` | Manifest of the Haiku batch (17 menus, 9 Nov 20:37). |
| Batch results, downloaded today | The handoff called this batch "never collected". I downloaded its results today. This was free, because the batch was already paid for. The raw results are kept outside the repo, and the parsed results are in `export/`. They include `stop_reason` and `thinking_tokens`. `results/` was not changed. |
| `src/.sources.json` | Origin records for the **5** files that were fetched from the web. |
| Offline re-runs of `optimize()` and `guess_date()` | Done today on all 17 files at no cost, to get pages, parts and estimated tokens, and to run ablations. |

New today, and not in the original handoff: a **second Haiku run on all 17 menus** (the batch). It changes
several conclusions (see §1 and §5).

---

## 1. Corrections to LARAVEL_HANDOFF.md

Each row gives the handoff section, what it says, and the correct version.

| § | Handoff says | Correct version |
|---|---|---|
| 5.1, 9, 12 | "Haiku matched the reference exactly on every menu"; "67/67, 0 extra, 67/67 prices". | That is the **automatic score of one run**. The score matches names fuzzily (§9 of the handoff), so it hides transcription errors. Read against the menus, the comparison-run Haiku output has these errors: `KOŹLE 0,0%` for the printed `KOZEL 0,0%` (Jeff's); `Lech Free / Limonka i mięta` for `Lech Free / Limonka z miętą` (Woronicza); `gin Rassberry 0%` for `gin Rassbery 0%` (Nicoletta); PUMPKIN SWIZZLE and PADDINGTON descriptions taken from the English lines and partly paraphrased (Loreta); `Martini Vibrante lub` dropped from two Pandan descriptions; the section `PIWA W STAEJ OFERCIE` copied from a garbled text layer (Bierhalle). Prices and drink counts were correct. |
| 5.1, 9 | "Sonnet returned [45, 55]; Haiku and Opus were correct" (THE ROOF). | **Haiku makes the same error in a second run.** In the batch run (same prompt, same payload, same effort) Haiku added the 55 PLN alcoholic price to ALMOST PURE, GROW WILS and FAULT LINE (sizes `with Beefeater gin (alcoholic version)` and so on). The dual-version fix (§4.2) is needed for Haiku too. |
| 5.1 | Implies Haiku is deterministic enough to be judged on one run. | It is not. Between the two Haiku runs, the drink counts were identical on all 13 menus, but 109 field values differed: names (`O mój YUZU` became `Oh My YUZU`, which is the English page; sizes were appended to names, e.g. `Peroni Nastro Azzurro 0% 0,33l`; a printed misspelling was "corrected" to `Gewurztraminer`), brands, section capitalisation, `abv` filled or not, and descriptions. Details are in `export/*.json` (`haiku_compare_run` vs `haiku_batch_run`). |
| 3.1, 9 | "Drop a line shorter than 60 characters that appeared before. These are running headers and footers." / "The line deduplication removes them." | `compact_text()` is called **once per page** (`optimizer.py:229`), so the `seen` set (`optimizer.py:99`) resets on every page. Headers and footers repeated **across** pages are never removed; the Loreta footer is sent 16 times. Meanwhile the rule drops repeated short lines **within** a page, and that loses data: on Spaccanapoli p20 the Merlot 0% price line `100 PLN` was dropped because the Traminer above it also costs `100 PLN`. Haiku then reported the Merlot as "no price printed" (`prices: []`). Karczma also lost a `150,00 PLN` line (a wine price). |
| 3.1 | "about 95% fewer tokens than sending the PDF natively" | Never measured. Native PDF input was never sent. The only figures are the optimizer's own **estimates** (naive vs optimized), and the text estimate is far too low (next row). |
| 3.3 | Text tokens `chars / 4`; "about **600 tokens** per request for the system prompt and schema". | Measured from real `usage.input_tokens` on image-only menus: the fixed overhead (system prompt, schema, structured-output wrapper) is **≈1,800–1,860 tokens** on Claude 5.5 models, not 600. For Polish menu text, real tokens are **≈2.2–2.7 × the `chars/4` estimate**, so about chars / 1.6. The image estimate `w×h/750` was accurate. The table is in §4.3. |
| 3.2 | "Grayscale reduces the bytes but not the tokens. The request becomes faster with no loss of accuracy." | Bytes: −2% to −19% (§4.3). Accuracy and speed were **never tested**, because every real call used grayscale. |
| 3.2 | Presets low/standard/high and "*High* exists for hard cases". | Only `standard` was ever sent to a model. `low` and `high` exist only as estimates. |
| 4.4 | "The version below…" is presented as the schema. | That schema was **never sent**. The prototype sends `anthropic.transform_schema(MenuResult)`, which is different: it uses `$defs`/`$ref` and `anyOf` for nulls, requires only `drinks`, `name`, `category`, `prices` and `amount`, and puts the text `{default: None}` into the descriptions. The verbatim version is in §5.2. The handoff's stricter version is a reasonable design, but it is untested. |
| 4.3 | Header list `x-api-key`, `anthropic-version: 2023-06-01`. | The prototype used the Python SDK, which sets the headers itself. Raw HTTP with those headers was never tried. |
| 4.3 | Fallback beta "retries it on a fallback model". | The beta header and the `fallbacks` field were **accepted** in 26 real calls (13 Sonnet, 13 Opus). A fallback was **never observed** to fire, because `usage.model` always equals the requested model. |
| 6 | "Most batches finish within an hour". | The only batch (17 requests) ended **2 min 40 s** after creation (19:37:30 → 19:40:10 UTC). |
| 7.1 | "If [robots.txt] fails to load, allow the request." | True, and broader than it sounds: **any** non-200 status (401, 403, 404, 5xx) and any network error, timeout included, means "allow everything" (`fetch.py:236-239`). |
| 7.2 | "the **largest** entry in `srcset`" | The code takes the **last** entry (`fetch.py:172`). With `srcset="a-1024w.jpg 1024w, a-300w.jpg 300w"` it picks the 300 px file (verified). `data-srcset` is not read. |
| 7.2 | "Group WordPress thumbnails with their original." | It groups by **URL path only**, ignoring the host (`fetch.py:191`, `203`). The same path on a CDN host is merged and lost. Query string and fragment are ignored for grouping but kept in the chosen URL. |
| 7.2 | "at a word start" | Only the start is anchored (`(?<![a-z])`, `fetch.py:212`). `bar` matches `barwa`, `baranina`, `barbecue`; `menu` matches `menuet`. |
| 7.2 | (not mentioned) | Links without a menu file extension are dropped silently, and they are not listed among the "other file links" either (`fetch.py:201`). Google Drive, Dropbox, Issuu and `…/download?id=` links therefore vanish without a trace. |
| 7.3 | "If the hash already exists… do not download it again." | It **is** downloaded every time, because the hash needs the body. It is just not saved again (`fetch.py:275-286`). |
| 7.3 | `filename*=UTF-8''` parsing | One regex takes the **first** `filename` or `filename*` match (`fetch.py:261`). If both are present, the plain `filename` wins. Charsets other than UTF-8, and a language tag (`UTF-8'pl'…`), are not handled. |
| 7.4 | Origin record fields | Correct. But the manifest is written only in `close()` (`fetch.py:338-339`). A fetch that is stopped or crashes keeps the downloaded files but loses their origin records. |
| 7.5 | "Match the rules… on the URL" | On the **full** URL, domain included (`fetch.py:305`). `https://maj.pl/karta-2026.pdf` gives 2026-05, and `https://bar2025.pl/menu.pdf` gives 2025 (verified). The final URL and the original URL are both stored as `from: "link"`, so you cannot tell which one matched. More bugs are listed in §2.6. |
| 8 | Activity: "a 'paid' flag on actions that cost money". | `paid` is returned by `/api/jobs` (`jobs.py:62`) but **never displayed**. Paid actions only show a `confirm()` dialog (`workspace.html:299-308`). |
| 8 | Results browser "shows comparison mismatches next to the drinks". | They are shown in one box per **menu**, not next to each drink (`results.html:156-157`, in the results file's own line numbers; see §6). The page also has Run and Model selectors that the handoff omits. |
| 9 | (pitfalls list) | Missing from the list: **garbled text layers** (Bierhalle, where `ł` becomes `³` and `Ł` is lost) and **scrambled multi-column text layers** (Pod Niebną: Haiku could not assign the mocktail prices and returned `prices: []` for all three). Both pass the ≥80-character check. |
| 1 | Optional "soft drinks" mode | It was **never run** with soft drinks ON. |
| 12 | Batch "never collected" | Its results are now in `export/`. All 17 succeeded with `stop_reason: end_turn` and valid JSON. |
| (README) | "For your 9 menus on all 7 models, expect roughly $1." | The real 13-menu comparison cost $1.126 across 7 models (`runs.csv`). |
| (requirements) | — | `fetch.py:31` imports `httpx2`, which is **not** in `requirements.txt`. It is installed only as a dependency of `anthropic`. |

---

## 2. Menu date detection (§7.5), complete

### 2.1 Normalisation (`fetch.py:55-57`)

```python
def _plain(s: str) -> str:
    s = unicodedata.normalize("NFKD", unquote(s).lower().replace("ł", "l"))
    return "".join(c for c in s if not unicodedata.combining(c))
```

The order is: percent-decode (`urllib.parse.unquote`, UTF-8; `+` is **not** turned into a space), lowercase,
replace `ł` with `l` (NFKD does not decompose `ł`), NFKD-normalise, then remove combining marks (`ś`
becomes `s`, `ń` becomes `n`, and so on). The input is the **whole** URL, scheme and host included, or a
bare file name.

### 2.2 Rules, in evaluation order (`fetch.py:71-82`), verbatim

```python
rules = [
    # /2026/04/15/ or /uploads/2026/04/  (WordPress and most CMSs)
    ("path", r"/(20\d\d)/(0[1-9]|1[0-2])(?:/(0[1-9]|[12]\d|3[01]))?/"),
    # 2026-04-15, 2026_04_15, 2026.04.15, 20260415
    ("ymd", r"(?<!\d)(20\d\d)[-_.]?(0[1-9]|1[0-2])[-_.]?(0[1-9]|[12]\d|3[01])(?!\d)"),
    # 15.04.2026, 15-04-2026
    ("dmy", r"(?<!\d)(0?[1-9]|[12]\d|3[01])[-_.](0?[1-9]|1[0-2])[-_.](20\d\d)(?!\d)"),
    # 04.2026, 4-2026, 04_2026, 042026
    ("my", r"(?<![\d.])(0?[1-9]|1[0-2])[-_.]?(20\d\d)(?!\d)"),
    # 2026-04, 2026_4
    ("ym", r"(?<!\d)(20\d\d)[-_.](0?[1-9]|1[0-2])(?!\d)"),
]
```

Then these rules follow, in this order:

- **month-name** (`fetch.py:104-109`):
  ```python
  words = re.findall(r"[a-z]+", t)
  years = [int(y) for y in re.findall(r"(?<!\d)(20\d\d)(?!\d)", t) if ok_year(int(y))]
  for w in words:
      if w in POLISH_MONTHS and years:
          return {"date": f"{years[0]}-{POLISH_MONTHS[w]:02d}", "matched": f"{w} … {years[0]}", "rule": "month-name"}
  ```
  The month must be a whole run of letters (`marzec` in `menu_marzec-03` matches; `maja` inside
  `majowka` does not). The year is the **first** in-window year **anywhere** in the string, domain
  included. The month is the **first** month word in the string.
- **timestamp** (`fetch.py:112-116`):
  ```python
  for m in re.finditer(r"(?<!\d)(1\d{9})(\d{3})?\d*", t):
      secs = int(m.group(1))
      dt = datetime.fromtimestamp(secs, tz=timezone.utc)
      if ok_year(dt.year):
          return {"date": dt.strftime("%Y-%m-%d"), "matched": m.group(0), "rule": "timestamp"}
  ```
  The first 10 digits are taken as Unix seconds (UTC), whatever follows.
- **year** (`fetch.py:118-119`): `years[0]`, from the month-name step's `years` list.
- Otherwise the result is `None` (`fetch.py:120`).

### 2.3 Month words (`fetch.py:43-50`), verbatim

```python
POLISH_MONTHS = {
    "styczen": 1, "stycznia": 1, "luty": 2, "lutego": 2, "marzec": 3, "marca": 3, "kwiecien": 4, "kwietnia": 4,
    "maj": 5, "maja": 5, "czerwiec": 6, "czerwca": 6, "lipiec": 7, "lipca": 7, "sierpien": 8, "sierpnia": 8,
    "wrzesien": 9, "wrzesnia": 9, "pazdziernik": 10, "pazdziernika": 10, "listopad": 11, "listopada": 11,
    "grudzien": 12, "grudnia": 12,
    "january": 1, "february": 2, "march": 3, "april": 4, "may": 5, "june": 6, "july": 7, "august": 8,
    "september": 9, "october": 10, "november": 11, "december": 12,
}
```

The keys are already in normalised form (no accents, `ł`→`l`). Polish forms accepted: nominative and
genitive only. Locative (`w marcu`), other cases and abbreviations (`sty`, `mar`, `IV`) are not accepted.
English: full names only, no abbreviations (`jan`, `sept`). No German or Italian months.

### 2.4 Year window, "first rule wins", and tie-breaks

- Window (`fetch.py:66-69`): `2010 <= y <= datetime.now().year + 1`, using the **local** clock at call
  time. The `path`, `ymd`, `dmy`, `my` and `ym` rules check the year of each match (`fetch.py:101`). The
  month-name and year rules pre-filter `years` (`fetch.py:106`). The timestamp rule checks the decoded
  year (`fetch.py:115`). Out-of-window years return nothing from that rule.
- First wins (`fetch.py:83-102`): rules are tried in list order. Within one rule, matches are tried left to
  right (`re.finditer`), and the **first match whose year is in the window** returns at once. A match with
  a bad year makes the code try the next match of the same rule, then the next rule.
- Day and month validity are checked by the regex ranges only. `31.02.2026` is accepted as `2026-02-31`
  (verified).
- `matched` is `m.group(0).strip("/")` (`fetch.py:102`).
- Source tie-break (`fetch.py:300-309`):
  ```python
  guess = guess_date(str(r.url)) or guess_date(url)
  if guess:
      guess["from"] = "link"
  elif last_mod_iso:
      guess = {"date": last_mod_iso, "matched": last_mod, "rule": "last-modified", "from": "server"}
  ```
  1. Final URL after redirects (`r.url`). 2. Original URL. 3. `Last-Modified`, parsed with
  `email.utils.parsedate_to_datetime(...).date()`; unparsable values become `None`. Both URL cases are
  stored as `from: "link"`.
  4. File name, but only in `describe()` (`fetch.py:143-152`). It runs when the manifest entry has no
  `date_guess`, which covers files saved by hand **and** fetched files for which all three steps failed.
  It is stored as `from: "file name"`. A file name is never used for a fetched file that has any URL or
  server date.

### 2.5 Stored structure

`{"date": "YYYY" | "YYYY-MM" | "YYYY-MM-DD", "matched": <text>, "rule": <rule>, "from": "link" | "server" | "file name"}`.
For fetched files it is stored in `src/.sources.json` under `date_guess`. For hand-saved files it is
computed on every read and never stored.

Real examples. ymd, dmy and ym never fired on the 17 menus; the examples for those three are outputs of
`guess_date()` on test strings.

| rule | real example | stored `date_guess` |
|---|---|---|
| path | Menu-Obrzezna (URL) | `{"date":"2026-05","matched":"2026/05","rule":"path","from":"link"}` |
| ymd | *(test)* `IMG_20260415_123456.jpg` | `{"date":"2026-04-15","matched":"20260415","rule":"ymd"}` |
| dmy | *(test)* `menu_15.03.2026.pdf` | `{"date":"2026-03-15","matched":"15.03.2026","rule":"dmy"}` |
| my | napoje-alkohole (URL) | `{"date":"2026-03","matched":"03-2026","rule":"my","from":"link"}` |
| ym | *(test)* `menu_2026_4.pdf` | `{"date":"2026-04","matched":"2026_4","rule":"ym"}` |
| month-name | 2025_Bierhalle… (file name) | `{"date":"2025-03","matched":"marzec … 2025","rule":"month-name","from":"file name"}` |
| timestamp | 17423796669662_Nowe ceny Karczma (file name) | `{"date":"2025-03-19","matched":"17423796669662","rule":"timestamp","from":"file name"}` |
| year | Karta-napoje-2025 (file name) | `{"date":"2025","matched":"2025","rule":"year","from":"file name"}` |
| last-modified | menu-pl (server) | `{"date":"2026-11-02","matched":"Mon, 02 Nov 2026 23:13:30 GMT","rule":"last-modified","from":"server"}` |

### 2.6 All 17 menus

| file | input used | date | rule | assessment |
|---|---|---|---|---|
| 17423796669662_Nowe ceny Karczma.pdf | file name | 2025-03-19 | timestamp | Plausible. The 14 digits are a 13-digit ms timestamp plus one extra digit. Not confirmable from the PDF. |
| 2025_Bierhalle_menu_marzec-03-PL-WEB-2.pdf | file name | 2025-03 | month-name | Looks right. |
| 8-724x1024.jpg | file name | none | — | Correct: `724x1024` is a thumbnail size, not a date. |
| BAR-1-scaled.jpg | file name | none | — | — |
| Karta-napoje-2025.pdf | file name | 2025 | year | Looks right. |
| MENU-PL-PPN-PPM-PPN-210-scaled-1166x1654.webp | file name | none | — | — |
| Menu-Obrzezna-2026.pdf | URL `…/uploads/2026/05/…` | 2026-05 | path | Upload month. The file name alone would give `2026` (year). |
| Menu-Spaccanapoli-202506.pdf | URL `…/uploads/2025/06/…` | 2025-06 | path | Right, but only thanks to the path. **The file name alone gives `None`**: compact `YYYYMM` (`202506`) is not supported by any rule. |
| Menu-Woronicza.pdf | file name | none | — | — |
| Pandan.pdf | file name | none | — | — |
| Pod-Menu-New-V5.pdf | URL `…/uploads/2026/03/…` | 2026-03 | path | Upload month. |
| THE-ROOF-04.2026-strona.pdf | file name | 2026-04 | my | Looks right. |
| cud-warszawa-podkladka-062020.pdf | file name | 2020-06 | my | Probably right (a 2020 placemat; prices such as Coca-Cola 7,00 zł fit). |
| koktaile_pera_4.2026.jpg | file name | 2026-04 | my | Looks right. |
| loreta-menu.pdf | file name | none | — | — |
| menu-pl.pdf | Last-Modified | 2026-11-02 | last-modified | **Probably wrong as a menu date.** It is the server's file time, 7 days before the fetch. The URL has no date. Treat it as "file updated on", not "menu dated". |
| napoje-alkohole-scc-pl-03-2026.pdf | URL | 2026-03 | my | Looks right. The server's Last-Modified is 2026-04-22. |

Bugs confirmed by running `guess_date()`:

- `202506` (YYYYMM without a separator) is not detected.
- The domain feeds the rules: `maj.pl` gives May, and `bar2025.pl` gives 2025.
- 10-digit IDs are read as timestamps (`menu-1500000000.pdf` → 2017-07-14).
- `31.02.2026` is accepted.
- Version strings are read as dates: `napoje-v1.2026.pdf` → 2026-01.
- `menu-2019-2026.pdf` → 2019 (the first year wins, though a range usually means the later one).
- `karta-zima-2025-26.pdf` → 2025.
- `/uploads/2026/04` without a trailing slash does not match `path`, and falls through to `year` → 2026.
- An out-of-window path is skipped: `/uploads/2009/04/menu-2026.pdf` → 2026 (year).

---

## 3. Fetcher and link discovery (§7), complete

### 3.1 What is scanned (`fetch.py:157-182`)

The parser is the standard library `html.parser.HTMLParser`. It runs no JavaScript and does not decode
entities in attribute values beyond what `HTMLParser` does.

```python
def handle_starttag(self, tag, attrs):
    a = dict(attrs)
    if tag == "a" and a.get("href"):
        self._a, self._text = a["href"], []
    for key in ("src", "data-src", "data-orig-file", "data-large-file", "href"):
        if tag in ("img", "source", "iframe", "embed", "object", "link") and a.get(key):
            self.links.append((a[key], a.get("alt", "") or a.get("title", "")))
    if tag in ("img", "source") and a.get("srcset"):
        biggest = a["srcset"].split(",")[-1].strip().split(" ")[0]
        self.links.append((biggest, a.get("alt", "")))
```

- `<a href>` is collected at `</a>` together with all text data between the tags, joined with spaces
  (`fetch.py:175-182`). Nested `<a>` overwrites the open one.
- `img`, `source`, `iframe`, `embed`, `object` and `link`: the attributes `src`, `data-src`,
  `data-orig-file`, `data-large-file` and `href`, labelled with `alt` or else `title`. `object data=` is
  **not** read.
- `srcset`: split on `,`, take the **last** item, cut at the first space. It is not the largest, and URLs
  containing commas break.
- Not scanned: CSS `background-image`, `<meta property="og:image">`, `data-srcset`, `data-lazy-src`,
  JSON in scripts, and anything rendered by JavaScript.

### 3.2 Resolution and filtering (`fetch.py:199-203`)

```python
url = urljoin(page_url, href.strip())
if urlparse(url).scheme not in ("http", "https") or _ext(url) not in MENU_EXTS:
    continue
groups.setdefault(_canonical(url), []).append((url, text))
```

`page_url` is the URL that was **requested**, not the final URL after redirects (`fetch.py:281` passes
`url`). `<base href>` is ignored. The extension comes from the URL path only (`fetch.py:185-186`), so the
query string does not count and is kept in the URL. `MENU_EXTS` (`fetch.py:38`):
`{".pdf", ".jpg", ".jpeg", ".png", ".webp", ".heic", ".avif", ".gif", ".tif", ".tiff"}`. The match is
case-insensitive (`.PDF` is fine). The fragment stays in the stored URL; httpx does not send it.

### 3.3 WordPress grouping (`fetch.py:189-191`, `205-209`)

```python
def _canonical(url: str) -> str:
    return re.sub(r"(-\d{2,5}x\d{2,5}|-scaled)(?=\.\w+$)", "", urlparse(url).path)
...
items.sort(key=lambda x: (_canonical(x[0]) != urlparse(x[0]).path, -len(x[0])))
url = items[0][0]
text = " ".join(t for _, t in items if t)
```

The key is the **path only**: the host is dropped. The regex removes only **one** suffix at the end, so
`name-scaled-1166x1654.webp` becomes `name-scaled.webp`, not `name.webp`. The original upload and its
`-scaled` and `-WxH` variants therefore form two groups when the double suffix appears, as in the
test-set file `MENU-PL-PPN-…-scaled-1166x1654.webp`. Selection: an URL whose path
already equals its canonical path comes first, then the longest URL. The link texts of all members are
joined and cut to 120 characters for storage (`fetch.py:213`).

### 3.4 Keywords (`fetch.py:40-42`, `210-215`), verbatim

```python
MENU_WORDS = ("menu", "karta", "koktajl", "koktail", "cocktail", "mocktail", "drink", "napoj", "napoi",
              "bar", "wino", "wina", "wine", "piwo", "piwa", "beer", "cennik", "carta", "speisekarte",
              "getranke", "alkohol", "happy")
...
hay = _plain(f"{urlparse(url).path} {text}")
if any(re.search(rf"(?<![a-z]){w}", hay) for w in MENU_WORDS):
```

The haystack is the normalised path plus the joined link text; the domain is excluded. "Start of a word"
means only that the character before the keyword is not `a-z`. Digits and `_` count as word boundaries
(`2026_menu` matches), and the end is not anchored (`barwa` matches). Groups that fail go into `others`,
which is reported only as a count plus the first example (`fetch.py:329-332`).

### 3.5 robots.txt (`fetch.py:231-241`)

```python
host = urlparse(url).scheme + "://" + urlparse(url).netloc
if host not in self.robots:
    rp = RobotFileParser()
    try:
        r = self.client.get(host + "/robots.txt")
        rp.parse(r.text.splitlines() if r.status_code == 200 else [])
    except httpx2.HTTPError:
        rp.parse([])
    self.robots[host] = rp
return self.robots[host].can_fetch(USER_AGENT, url)
```

- The parser is Python's `urllib.robotparser.RobotFileParser`. `can_fetch` is called with the full UA
  string `na-menu-extractor/1.0 (menu fetcher)`. The parser matches the product token
  `na-menu-extractor` against `User-agent` lines, and falls back to `*`. Verified: `User-agent: *` with
  `Disallow: /wp-content/` blocks, and `User-agent: na-menu-extractor` with `Disallow: /` blocks.
- Cache: in memory, per `Fetcher` instance, one per CLI run. It is not persisted.
- 404, 5xx, 401 and 403: everything is allowed. Timeout or connection error: everything is allowed.
- The robots.txt request itself follows redirects, but it is **not throttled**, not size-capped, and not
  checked against robots.
- `Crawl-delay` and `Request-rate` are ignored.

### 3.6 Throttle, redirects, size cap, file names (`fetch.py:221-268`, `292-298`)

- Throttle: `delay` defaults to 1.0 s, and `--delay` changes it (`fetch.py:355`). It is keyed by
  `netloc`. The wait is `delay - (now - last_hit)`, using `time.monotonic` (`fetch.py:244-248`). Only
  `_get` is throttled, not robots.txt.
- Client: `httpx2.Client(follow_redirects=True, timeout=30, headers={"User-Agent": USER_AGENT})`
  (`fetch.py:225`). The library's default redirect limit applies (not set). The 30 s timeout applies to
  connect, read, write and pool, each.
- Status: `raise_for_status()`, so any 4xx or 5xx becomes `FAILED <url>: <first line>` (`fetch.py:250`,
  `276-277`).
- Size cap: streamed; aborts once the buffer exceeds `MAX_BYTES = 30 * 1024 * 1024` (`fetch.py:37`,
  `252-255`). `Content-Length` is not checked up front.
- HTML detection: the `Content-Type` starts with `text/html` (`fetch.py:279-281`). There is no
  content sniffing.
- Content-Disposition (`fetch.py:260-262`):
  `re.search(r"filename\*?=(?:UTF-8'')?\"?([^\";]+)", cd)`. The value is URL-decoded. The fallback is the
  last path segment of the **final** URL, URL-decoded.
- Sanitising (`fetch.py:263`): `re.sub(r"[^\w.\- ()ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+", "_", name).strip(" ._") or "menu"`.
  `\w` is Unicode, so other accented letters survive too.
- Extension inference, only when the name has no suffix (`fetch.py:264-267`):
  `{"application/pdf": ".pdf", "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}`.
  Anything else (HEIC, AVIF, `application/octet-stream`) is saved without an extension, and then
  `MENU_EXTS` hides it from the Workspace.
- `-2`/`-3` naming (`fetch.py:289-298`): a same-named file with the **same hash** is adopted, meaning
  only its origin is recorded. Otherwise the code tries `stem-2.ext`, `stem-3.ext` and so on, until a
  free name is found. Before that step, the hash is looked up across the whole manifest (`by_hash`,
  `fetch.py:229`, `283-286`); a hit only updates `last_checked`.
- Refresh (`fetch.py:371-380`): re-scans every distinct `page_url`, then calls `save(url)` on the
  original `url` of every direct entry.

### 3.7 Every site fetched

**Only 5 URLs were ever fetched successfully**, and all 5 were **direct file links**, not pages
(`page_url: null` in every `src/.sources.json` entry). The other 12 menus were added by hand and have no
recorded URL. The fetches ran at 20:20–20:36 on 9 Nov, outside any recorded Bash session. They were most
likely run from the Workspace page, whose job logs lived in memory and are gone. There is **no record** of
any failed fetch, of any page scan on a real site, of a robots.txt refusal, of a JS-rendered page, of a
cookie wall, or of a Facebook, Instagram, Drive, Dropbox or Issuu link. The only page scan ever run used
a local mock site (a copy of Pandan.pdf served by `python -m http.server` on 9 Nov, transcript
18:35 UTC).

| URL entered | kind | result |
|---|---|---|
| `https://semolino.pl/wp-content/uploads/2026/05/Menu-Obrzezna-2026.pdf` | direct PDF | saved; text layer; Last-Modified 2026-05-07 |
| `https://spaccanapoli.pl/wp-content/uploads/2025/06/Menu-Spaccanapoli-202506.pdf` | direct PDF | saved; 22 text pages plus 2 raster pages; Last-Modified 2025-06-19 |
| `https://restauracjapodniebna.pl/wp-content/uploads/2026/03/Pod-Menu-New-V5.pdf` | direct PDF | saved; text layer scrambled (multi-column) |
| `https://bistrocharlotte.com/wp-content/uploads/menu/charlotte-plac-zbawiciela-warszawa/menu-pl.pdf` | direct PDF | saved; no text layer at all (outlined text, 0 embedded images); undated URL |
| `https://jeffs.com/images/nasze-menu/napoje-alkohole-scc-pl-03-2026.pdf` | direct PDF | saved 20:20, then re-fetched 20:31 as "unchanged" (only `last_checked` moved); a single scanned page |

Inline images: the hand-added WordPress-style files (`8-724x1024.jpg`, `BAR-1-scaled.jpg`,
`MENU-PL-…-scaled-1166x1654.webp`) look like images embedded in pages. How they were obtained is **not
recorded**.

**TDM opt-out:** never checked, and never seen. The code does not read the `tdm-reservation` header,
the `<meta name="tdm-reservation">` tag, or `/.well-known/tdmrep.json`.

---

## 4. Optimisation pipeline (§3), complete

### 4.1 PDF (`optimizer.py:218-237`, `97-110`)

```python
doc = fitz.open(stream=data, filetype="pdf")             # PyMuPDF 2.1 / MuPDF 1.28.6
for i, page in enumerate(doc, 1):
    label = f"{name} p{i}"
    pw, ph = page.rect.width * 2, page.rect.height * 2
    result.original_est_tokens += _naive_image_tokens(pw, ph)
    text = page.get_text("text", sort=True) if opts.prefer_pdf_text else ""
    result.original_est_tokens += _text_tokens(text) if text else 0
    if len(re.sub(r"\s", "", text)) >= MIN_TEXT_CHARS:      # MIN_TEXT_CHARS = 80 (optimizer.py:37)
        text_buf.append(f"--- {label} ---\n{compact_text(text)}")
        continue
    pix = page.get_pixmap(dpi=opts.pdf_dpi)                # pdf_dpi = 220 (optimizer.py:50)
    img = Image.open(io.BytesIO(pix.tobytes("png")))
    result.parts.extend(_optimize_image(img, label, opts))
if text_buf:
    joined = "\n".join(text_buf)
    result.parts.insert(0, Part("text", name, text=joined, est_tokens=_text_tokens(joined)))
```

```python
def compact_text(text: str) -> str:
    lines, seen = [], set()
    for line in text.splitlines():
        line = re.sub(r"[.·…_\-]{3,}", " ", line)
        line = re.sub(r"[ \t ]+", " ", line).strip()     # space, tab, NBSP
        if not line:
            continue
        if len(line) < 60 and line in seen:
            continue
        seen.add(line)
        lines.append(line)
    return "\n".join(lines)
```

- The check counts non-whitespace characters (`\s` removed) ≥ 80, **per page**.
- The page separator is `--- {filename} p{N} ---`, and pages are joined with `\n`. The text part goes
  **before** all image parts (`insert(0, …)`), even when a raster page comes first in the document.
- Compaction runs per page (see the correction in §1). The dot-leader class is `. · … _ -`, so a run of 3
  or more hyphens or dots, such as `---` or `...`, also collapses.
- A PDF is detected by its extension **or** the magic bytes `%PDF-` (`optimizer.py:247`).

### 4.2 Images (`optimizer.py:198-215`, `113-195`), in order

| # | Step | Exact constants | Code |
|---|---|---|---|
| 1 | EXIF transpose | `ImageOps.exif_transpose` | `:199` |
| 2 | Flatten alpha | modes `RGBA`, `LA`, `P` become RGBA, pasted on a white RGB canvas using the alpha mask, then `convert("RGB")` | `:200-205` |
| 3 | Content mask | grayscale `L`, then `MedianFilter(3)`, then absolute difference from the **top-left pixel** value; `> 18` means ink (255) | `:113-118` |
| 4 | Blank skip | ink pixels `< 0.0005 × w × h` (0.05%) means the image is dropped | `:39`, `:121-124`, `:206-207` |
| 5 | Trim | bbox of the mask ± `pad = 12`, clamped; crop only if the new area is `≤ 0.97 ×` the old area | `:127-137` |
| 6 | Collapse empty rows | mask resized to `(1, h)` with `Image.BOX`; a row value `== 0` is empty; keep runs ≤ `max(16, w // 30)` rows; skip if kept rows `> 0.95 × h`; restitch bands | `:140-165` |
| 7 | Tile | if `long/short > 2.0` **and** `_fit_scale < 1.0`: `tile_len = int(short * 2.0)`, `overlap = int(tile_len * 0.04)`, `step = tile_len - overlap`, `n = ceil((long - overlap) / step)`, and the last tile is aligned to the end | `:168-185` |
| 8 | Downscale | `scale = min(1, max_edge / max(w, h), sqrt(max_pixels / (w * h)))`, `LANCZOS`, each side `max(1, int(side * scale))` | `:83-84`, `:188-191` |
| 9 | Encode | `L` (grayscale, default) or `RGB`; JPEG `quality=80`, `optimize=True`; standard base64 | `:192-195` |

Presets (`app.py:26-31`; `batch.py:35`): `low (1024, 600_000)`, `standard (1568, 1_150_000)`,
`high (2048, 2_300_000)`. An unknown value becomes `standard` in the web app (`app.py:45`); the CLI rejects
it. Labels are `"{name}"`, `"{name} tile i/n"`, `"{name} p{N}"` for PDF and TIFF pages, and
`"{name} p{N} tile i/n"`. For TIFF, every frame is a page. For other formats, only the first frame is
used (`optimizer.py:255-262`). Formats: whatever Pillow opens, plus HEIC, HEIF and AVIF through
`pillow_heif` (`optimizer.py:24-29`). If no parts survive, the error is "Nothing readable found in the
uploaded file(s)." (`optimizer.py:263-264`).

Token estimates: image `max(1, round(w * h / 750))` (`:79-80`); text `max(1, len // 4)` (`:93-94`); naive
baseline per PDF page: a page image at `(pt_w × 2, pt_h × 2)` capped at 1568 px / 1.15 MP, plus the raw
text (`:87-90`, `:224-227`).

### 4.3 What measurably changed cost or accuracy

**Accuracy:** no step was ever tested on its own. Every real call used the same settings (standard,
grayscale, all steps on). There is no measured accuracy effect for any step. The one measured accuracy
**loss** comes from compaction (the Spaccanapoli Merlot price, §1).

**Cost.** The ablation below was computed today from estimated tokens (`optimize()` with one step
replaced by a no-op), standard preset. Menus not listed showed no change (±2 tokens).

| menu | all steps | no trim | no collapse | no tiling | none of the three |
|---|---|---|---|---|---|
| 8-724x1024.jpg | 560 | 788 | 657 | 560 | 989 |
| loreta-menu.pdf (3 raster pages) | 5,477 | 6,490 | 5,522 | 5,477 | 9,373 |
| Menu-Spaccanapoli (2 raster pages) | 15,261 | 15,261 | 15,261 | 11,635 | 11,487 |
| menu-pl.pdf (11 raster pages) | 19,021 | 16,243 | 32,108 | 15,759 | 16,852 |

On menu-pl the pipeline **raises** the estimate by 13% over doing nothing: trimming and collapsing make
two pages longer than 2:1, and those pages then get tiled. Whether the tiles improved accuracy is **not
determined**; menu-pl was never run on a second setting.

**Estimated vs real input tokens.** Real input tokens come from Haiku, and they are identical for
Sonnet and Opus. Overhead = real − estimate.

| menu | naive est. | optimized est. | real input | real − est. |
|---|---|---|---|---|
| 8-724x1024.jpg | 989 | 560 | 2,419 | 1,859 |
| BAR-1-scaled.jpg | 1,532 | 1,532 | 3,384 | 1,852 |
| koktaile_pera_4.2026.jpg | 1,532 | 1,531 | 3,353 | 1,822 |
| MENU-PL-…webp | 1,532 | 1,532 | 3,392 | 1,860 |
| napoje-alkohole… (1 raster p.) | 1,532 | 1,531 | 3,336 | 1,805 |
| Pandan.pdf (2 raster) | 3,066 | 3,064 | 4,839 | 1,775 |
| cud-warszawa… (2 raster) | 3,064 | 3,064 | 4,927 | 1,863 |
| Menu-Woronicza (5 raster) | 7,658 | 7,660 | 9,466 | 1,806 |
| menu-pl (13 images) | 16,852 | 19,021 | 20,846 | 1,825 |
| Karta-napoje (text) | 12,060 | 1,613 | 5,875 | 4,262 |
| Bierhalle (text) | 9,370 | 2,281 | 7,988 | 5,707 |
| Pod-Menu (text) | 6,483 | 1,099 | 4,438 | 3,339 |
| Menu-Obrzezna (text) | 15,903 | 3,503 | 9,976 | 6,473 |
| THE ROOF (text) | 27,157 | 4,945 | 13,634 | 8,689 |
| Karczma (text + 1 raster) | 36,146 | 5,091 | 11,467 | 6,376 |
| loreta (text + 3 raster) | 43,429 | 5,477 | 13,436 | 7,959 |
| Spaccanapoli (text + 4 tiles) | 41,993 | 15,261 | 28,244 | 12,983 |

Use in Laravel: an overhead of ≈1,850 tokens per request, image tokens `w×h/750`, and Polish text at about
`chars / 1.6`.

**Grayscale vs colour** (base64 payload bytes, standard): −2% (cud) to −19% (Pandan); Woronicza −6%;
menu-pl −3%. Tokens are identical.

**Presets** (estimated tokens, low / standard / high): Woronicza 3,998 / 7,660 / 14,210; menu-pl 9,621 /
19,021 / 22,613; Pandan 1,598 / 3,064 / 6,130. Only `standard` was sent to a model.

### 4.4 Formats in the 17 menus

| format | menus | pipeline path exercised |
|---|---|---|
| PDF with a usable text layer | Bierhalle*, Karta-napoje, Menu-Obrzezna, Pod-Menu*, THE ROOF | text + compaction (*garbled / scrambled text) |
| PDF mixed text + raster pages | Karczma (p1 cover), loreta (p1, p13, p21; p2, p4, p12, p20 blank and skipped), Spaccanapoli (p1, p2, tiled 2 each) | both, plus blank skip and tiling |
| Scanned PDF, image per page | Pandan, cud-warszawa, Menu-Woronicza, napoje-alkohole | rasterise at 220 DPI → image pipeline |
| PDF with **no text and no images** (outlined vector text) | menu-pl | rasterise; tiling on p3 and p6 |
| JPEG | 8-724x1024, BAR-1-scaled, koktaile_pera | image pipeline; trim and collapse mattered only on 8-724 |
| WebP | MENU-PL-…-1166x1654 | image pipeline |
| PNG, HEIC, AVIF, GIF, TIFF, BMP | none | **never exercised** on real menus. `samples/` holds a JPEG, a WebP and two PDFs only. |

EXIF rotation and the alpha flatten were never triggered: none of the images is rotated, and none has
alpha.

---

## 5. The LLM call (§4)

### 5.1 System prompt, as sent today (soft drinks OFF), verbatim

Source: `extractor.py:80-94`, `132`. The `{soft_rule}` line has been replaced by `SOFT_EXCLUDE`.

```
You extract non-alcoholic drinks from restaurant and bar menus.

Include an item only when the menu makes it clear it is alcohol-free:
- "0.0", "0%", "alcohol-free", "non-alcoholic", "NA", "zero", "bezalkoholowe", "alkoholfrei", "sans alcool", "sin alcohol" and similar markers in any language
- dealcoholized wines, NA beers and ciders, NA spirits (e.g. gin alternatives), mocktails / zero-proof cocktails
- beers labelled <=0.5% ABV count as non-alcoholic
Exclude regular alcoholic drinks, and exclude food.
Do NOT include ordinary soft drinks, juices, water, coffee or tea - only alcohol-free versions of normally alcoholic drinks (beer, wine, cider, spirits, cocktails).
Transcribe names and descriptions as printed (don't translate). Use numbers for prices, without currency symbols. If one item has several sizes, list each as a separate price. If no qualifying drinks exist, return an empty list.
```

The build transcript shows the prompt was not edited after the comparison run. The 15:21 edit to
`extractor.py` (14:21 UTC) only changed the default model to Haiku.

User content blocks (`extractor.py:111-122`), for the real menu `koktaile_pera_4.2026.jpg`:

```json
[
 {"type": "text", "text": "[image: koktaile_pera_4.2026.jpg]"},
 {"type": "image", "source": {"type": "base64", "media_type": "image/jpeg",
   "data": "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYF…(228448 chars total)"}},
 {"type": "text", "text": "Extract the non-alcoholic drinks from this menu."}
]
```

A text menu (Karta-napoje) starts with
`{"type":"text","text":"<menu_text source=\"Karta-napoje-2025.pdf\">\n--- Karta-napoje-2025.pdf p1 ---\nLemoniada cytrynowa / Homemade lemonade 0,33 19zł\n…\n</menu_text>"}`.

### 5.2 JSON schema exactly as sent

This is `anthropic.transform_schema(MenuResult)`, from `extractor.py:136` and the models at `:57-77`.

```json
{"$defs": {"Drink": {"type": "object", "title": "Drink", "properties": {"name": {"type": "string", "title": "Name"}, "category": {"type": "string", "enum": ["na_beer", "na_wine", "na_sparkling", "na_cider", "na_spirit", "mocktail", "soft_drink", "juice", "water", "hot_drink", "other"], "title": "Category"}, "brand": {"anyOf": [{"type": "string"}, {"type": "null"}], "title": "Brand", "description": "{default: None}"}, "description": {"anyOf": [{"type": "string"}, {"type": "null"}], "title": "Description", "description": "{default: None}"}, "abv": {"anyOf": [{"type": "string"}, {"type": "null"}], "description": "Alcohol content as printed, e.g. '0.0%' or '<0.5%'\n\n{default: None}", "title": "Abv"}, "prices": {"type": "array", "title": "Prices", "items": {"$ref": "#/$defs/Price"}}, "menu_section": {"anyOf": [{"type": "string"}, {"type": "null"}], "description": "Heading the item was listed under\n\n{default: None}", "title": "Menu Section"}}, "additionalProperties": false, "required": ["name", "category", "prices"]}, "Price": {"type": "object", "title": "Price", "properties": {"amount": {"type": "number", "title": "Amount"}, "size": {"anyOf": [{"type": "string"}, {"type": "null"}], "description": "Serving size as written, e.g. '0.33l', 'glass', 'bottle'\n\n{default: None}", "title": "Size"}}, "additionalProperties": false, "required": ["amount"]}}, "type": "object", "title": "MenuResult", "properties": {"restaurant_name": {"anyOf": [{"type": "string"}, {"type": "null"}], "title": "Restaurant Name", "description": "{default: None}"}, "currency": {"anyOf": [{"type": "string"}, {"type": "null"}], "description": "ISO 4217 code if determinable, e.g. 'EUR', 'PLN'\n\n{default: None}", "title": "Currency"}, "language": {"anyOf": [{"type": "string"}, {"type": "null"}], "description": "Primary language of the menu, ISO 639-1\n\n{default: None}", "title": "Language"}, "drinks": {"type": "array", "title": "Drinks", "items": {"$ref": "#/$defs/Drink"}}, "notes": {"anyOf": [{"type": "string"}, {"type": "null"}], "description": "Ambiguities worth flagging, e.g. unreadable prices\n\n{default: None}", "title": "Notes"}}, "additionalProperties": false, "required": ["drinks"]}
```

The model nonetheless returned every field in all 30 stored Haiku results.

### 5.3 Request parameters

| parameter | value | confirmed by a real call? |
|---|---|---|
| `model` | `claude-haiku-5-5` (default, `extractor.py:14`); `claude-sonnet-5-5` and `claude-opus-5-5` in the comparison | yes: 13 live calls each, plus 17 Haiku batch calls |
| `max_tokens` | `16000` (`:17`) | yes. The largest output seen was 4,293 tokens (Loreta, batch). |
| `thinking` | `{"type": "adaptive"}` (`:133`) | yes. Thinking blocks appeared in 14 of 17 batch results; 3 had none. |
| `output_config.effort` | `low` (`:16`, `:135`) | yes. `medium` and `high` were **never** sent. |
| `output_config.format` | `{"type":"json_schema","schema":…}` (`:136`) | yes. 100% of responses validated. |
| `system`, `messages` | as above | yes |
| headers | set by the Python SDK 2.6.0 (`anthropic-version`, `x-api-key`) | through the SDK only; raw HTTP never tried |
| `betas=["server-side-fallback-2026-07-01"]`, `fallbacks="default"` | Sonnet and Opus only (`:173-179`) | **accepted** (26 calls); a fallback never fired |
| not sent | `temperature`, `top_p`, `stop_sequences`, `metadata`, prompt caching | — |
| Batch API | the same params, without the beta (`batch.py:173-174`); `custom_id = f"{model-without-claude-}__{i:05d}"[:64]` (`batch.py:172`) | yes, 1 batch |

### 5.4 Per menu, Haiku

The comparison run (live) gives tokens and seconds. The batch run gives thinking tokens and
`stop_reason`. The comparison run's `stop_reason` was not stored. It cannot have been `refusal` or
`max_tokens`, because `parse_message` would have raised an error (`extractor.py:144-147`). Live price:
$0.10 / $0.50 per Mtok. Batch: 50% of that.

| menu | in | out (live) | cost live | s (live) | out (batch) | thinking (batch) | cost batch | stop (batch) |
|---|---|---|---|---|---|---|---|---|
| 17423796669662_Nowe ceny Karczma | 11,467 | 612 | $0.001453 | 8.0 | 534 | 301 | $0.000707 | end_turn |
| 2025_Bierhalle… | 7,988 | 688 | $0.001143 | 7.9 | 535 | 338 | $0.000533 | end_turn |
| 8-724x1024 | 2,419 | 487 | $0.000485 | 3.3 | 468 | 0 | $0.000238 | end_turn |
| BAR-1-scaled | 3,384 | 878 | $0.000777 | 4.6 | 1,027 | 454 | $0.000426 | end_turn |
| cud-warszawa-podkladka-062020 | 4,927 | 1,180 | $0.001083 | 8.9 | 1,324 | 620 | $0.000577 | end_turn |
| Karta-napoje-2025 | 5,875 | 694 | $0.000935 | 7.2 | 646 | 350 | $0.000455 | end_turn |
| koktaile_pera_4.2026 | 3,353 | 353 | $0.000512 | 3.0 | 355 | 0 | $0.000256 | end_turn |
| loreta-menu | 13,436 | 4,133 | $0.003410 | 20.7 | 4,293 | 2,680 | $0.001745 | end_turn |
| MENU-PL-…webp | 3,392 | 1,282 | $0.000980 | 6.2 | 1,255 | 422 | $0.000483 | end_turn |
| Menu-Woronicza | 9,466 | 1,338 | $0.001616 | 10.3 | 1,379 | 584 | $0.000818 | end_turn |
| napoje-alkohole… | 3,336 | 1,246 | $0.000957 | 6.0 | 1,141 | 553 | $0.000452 | end_turn |
| Pandan | 4,839 | 2,348 | $0.001658 | 9.3 | 1,867 | 736 | $0.000709 | end_turn |
| THE-ROOF-04.2026-strona | 13,634 | 3,091 | $0.002909 | 11.2 | 2,288 | 0 | $0.001254 | end_turn |
| Menu-Obrzezna-2026 | 9,976 | — | — | — | 2,554 | 1,334 | $0.001137 | end_turn |
| Menu-Spaccanapoli-202506 | 28,244 | — | — | — | 2,881 | 1,770 | $0.002132 | end_turn |
| Pod-Menu-New-V5 | 4,438 | — | — | — | 1,457 | 1,093 | $0.000586 | end_turn |
| menu-pl | 20,846 | — | — | — | 1,367 | 572 | $0.001384 | end_turn |
| **total** | | 18,330 (13) | **$0.01792** | avg 8.2 | 25,371 (17) | 11,807 | **$0.01389** | |

"in" is the same in both runs. Thinking tokens are counted inside `output_tokens`. The thinking text came
back empty, so only its token count is known.

### 5.5 Failures seen

**None, with any model**: no refusal, no `max_tokens`, no invalid JSON, no schema failure. That covers 91
live calls (13 menus × 7 models) and 17 batch calls (`runs.csv` all `succeeded`; batch 17/17
`succeeded`). Two runs returned **empty `prices` arrays**, which the schema allows: Pod-Menu (3 mocktails,
because of the scrambled layout) and the Spaccanapoli Merlot (compaction loss). OpenAI and Gemini errors
were never hit either.

---

## 6. Results, flags and the UI

In this section, file line numbers for `results.html` and `index.html` are those files' own line
numbers.

### 6.1 Flags

A "flag" is one row of `results/compare-*/mismatches.csv`, written by `_compare()` (`batch.py:386-447`)
for each non-reference model:

- **missing**: a reference drink with no match at ≥ 0.8 (`batch.py:412-415`);
- **extra**: a drink of the model with no match (`:416-419`);
- **price differs**: a matched pair whose sorted `amount` lists differ (`:404-409`).

Matching: `_norm` (`batch.py:102-107`), `_similarity` (`:110-118`), and greedy one-to-one `_match` with
threshold 0.8 (`:121-133`). Names only; sizes and fields other than price are never compared.

- "Only menus with flags" (`results.html:132`): keeps the menus with ≥1 mismatch row for the selected run
  **and** model (`flagsFor`, `:129`).
- "comparison flags" stat (`:173-180`): the count of all mismatch rows for that run and model, regardless
  of the search and category filters.
- The reference model and the "Batch runs" run never have flags. Haiku has **0** flags in the stored run.

### 6.2 Model notes

The note is `result.notes`, written by the model (schema field `notes`). It is shown as
`Model note: …` (`results.html:155`). Haiku's notes, comparison run (13):

| menu | note |
|---|---|
| Karczma, Bierhalle, Pandan, cud-warszawa | *(null)* |
| 8-724x1024 | "Only the two wines listed under WINA BEZALKOHOLOWE (0% alk.) were included; the menu page is cut off at the bottom, so further alcohol-free wines may exist below the visible area." *(wrong: the page is complete)* |
| BAR-1-scaled | "Prices read as printed with ',-' suffix; currency inferred as PLN from the menu's format and Polish text." |
| Karta-napoje-2025 | "Lech free is listed under the low-alcohol beer section but its ABV is not printed; included based on section heading. Restaurant name not stated on the menu." |
| MENU-PL-…webp | "Menu is a happy hours menu (pon-pt 15:00-18:00) with a 2-for-1 offer on mocktails and cocktails. Only the MOCKTAILE section was included; the alcoholic cocktails section was excluded. Restaurant name not visible." |
| Menu-Woronicza | "Menu lists 'Lech Free / Limonka i mięta' with no explicit ABV printed; included under the alcohol-free beer section." *(the name is misread)* |
| napoje-alkohole… | "Section 'PIWO BEZALKOHOLOWE' lists the alcohol-free beers. The Lech Free entries show no ABV printed. The Kozel item is printed as 'KOZEL 0,0%' in the image; the name is transcribed as printed. Some small print in the image is hard to read, so the restaurant name and item descriptions may be imperfect." *(contradicts its own output `KOŹLE 0,0%`)* |
| THE-ROOF | "ALMOST PURE, GROW WILS and FAULT LINE are listed at 45 PLN for the 0% version and 55 PLN with spirit (alcoholic version, excluded); only the 45 PLN price is included. Price for Heineken 0,0% and Amaro Lucano 0% taken as printed. Restaurant name inferred from the file name." |
| koktaile_pera | "Currency not printed on menu; prices given as numbers only. Menu also has an 'Upgrade your cocktail' section with spirit add-ons, which were not extracted." |
| loreta-menu | "Beer price 21 is listed without a size (0,33 l or 0,5 l unclear). Kombucha and Bla sparkling tea are in the non-alcoholic wine section; included as they are alcohol-free but are closer to soft drinks, so you may want to exclude them. Bla price has no size. MŁODE price 37 is for 100 ml, the add-on layout was ambiguous. Menu lists Captain Morgan 0% and Tanqueray 0% as alternatives in the no-% section. Prices for the cocktail section were partially garbled in the text extraction." |

The batch-run notes for all 17 menus are in `export/*.json` → `haiku_batch_run.result.notes`. The notes for
the four new menus are quoted in §8.1.

### 6.3 Pages

**Extract one menu** (`/`, `index.html`):

- Drop zone and file picker, multiple files, `accept=".pdf,image/*,.heic,.heif,.avif"` (`:71-75`).
- Checkbox "Also include soft drinks, juice, coffee & tea", default off (`:78`).
- Checkbox "Grayscale images", default on (`:79`).
- Select resolution low / standard / high (`:80-86`).
- Buttons "Extract NA drinks" → `POST /api/extract`, and "Preview optimization only" →
  `POST /api/optimize` (`:89-90`, `:201-202`).
- Panel "What gets sent": stats for uploaded bytes, sent bytes, estimated tokens unoptimized and
  optimized, and % saved (or "+% more tokens: long image split into readable tiles"); a thumbnail or the
  first 900 characters of text per part (`:162-179`).
- Result: a table (Drink + brand + description, Type, ABV, Price / size), the notes, "Actual usage:
  in / out · model", the raw JSON, "Copy JSON", and "Download" (`na-drinks.json`) (`:181-211`). Cost is
  **not** shown here, although `usage.cost_usd` is returned.
- Errors: 400 for a bad file, 413 for >30 MB, 502 for extraction errors (`app.py:40`, `:49`, `:167`).

**Workspace** (`/workspace`):

- Key status dots for Anthropic, OpenAI and Gemini (`workspace.html:198-201`).
- **1 · Menus**: a table (checkbox, name, date + "from …", source host link + fetched date or "added by
  hand", size). Buttons Select all / Clear / Select undated. Textarea + **Fetch** (job `fetch`). **Check
  saved pages for new menus** (job `refresh`). A drop zone "Add files" (`POST /api/menus`; never
  overwrites; an identical file is reused, otherwise `-2`, `-3`; `jobs.py:217-236`).
- **2 · Run on**: tabs Estimate / Batch / Compare. Options: image quality, "Send images in color",
  Effort (Default / low / medium / high) and soft drinks, the last two hidden on the Estimate tab. Estimate
  (job, free). Batch: a model select (Claude only), **Submit batch** (confirm dialog), **Check status**,
  **Collect results** (runs `collect --wait`). Compare: model checkboxes (disabled without a key),
  "Score against" reference, "Reuse earlier run" (`--resume`), **Run comparison** (confirm dialog).
- **3 · Activity**: one `<details>` per job with the title, a status badge, start time and elapsed time,
  "See results →" after compare or collect, **Stop** while running, the command, and the log
  (`workspace.html:316-331`).

**Results** (`/results`):

- Selectors Run (each `compare-*` folder, plus "Batch runs") and Model (default Haiku); a Category
  filter; Search (drink, brand, description, section, restaurant, menu file); "Only menus with flags";
  **Download CSV** with the columns `restaurant, menu_file, menu_date, source_url, drink, brand, category,
  abv, price, size, currency, section, description` (one row per price, UTF-8 BOM) (`results.html:184-196`).
- Stats: menus, drinks, price range, mocktails, comparison flags.
- Per menu: name, drink count, file, "Open menu ↗" (`/api/source`, which serves only files named by a
  stored result; `app.py:134-143`), the date line with its source, "fetched … from host", the model note,
  the flags box, and a table (Drink, Type, ABV, Price, Section).
- The settings are remembered in `localStorage` (`results.*`).

Used in practice, as far as the records show: Compare (with `--resume`, from the terminal, per shell
history), Results, Extract (during development), and Workspace Fetch (5 files) and Submit batch (1
batch). Status and Collect were never used successfully before today. Estimate use is **not recorded**.

What I would drop in hindsight:

- the multi-provider Compare tab, its key status dots, and the `providers.py` adapters;
- the Run selector (with a database, filter by date instead);
- "Select undated";
- `collect --wait` as a blocking job (use a scheduled poll).

Keep: the dry-run preview, the date and source line, "Open menu", the CSV export, and the per-menu notes.

### 6.4 Jobs (`jobs.py:52-78`, `257-265`)

- States: `running` → `done` (exit 0) / `failed` (exit ≠ 0); `running` → `cancelling` (Stop) →
  `cancelled` (`jobs.py:75`). A job stopped just as it finishes is marked `cancelled` even when it
  exited 0.
- Progress: there is none, only log lines. Each stdout or stderr line of the subprocess is appended to an
  in-memory list. The page polls `GET /api/jobs/{id}?since=<n>` every 1.2 s (`workspace.html:343-362`).
- Retention: the last 30 jobs (`MAX_JOBS_KEPT`, `jobs.py:32`); older finished jobs are pruned. Everything
  is lost on server restart.
- Stop: `proc.terminate()` (SIGTERM; `jobs.py:264`). Effects:
  - `compare` keeps the per-call JSON files already written, so `--resume` can continue;
  - `fetch` keeps the files but loses their manifest entries (§1);
  - `submit` after the API call leaves a running, billed batch, possibly without its manifest or
    `LATEST`;
  - `collect --wait` stops polling, and the batch itself continues.

---

## 7. The test set, as fixtures

Columns: **Opus** = drinks in the Opus reference; **H-cmp** = Haiku in the comparison run; **H-bat** =
Haiku in the batch run. **Scorer** = Haiku mismatches in `mismatches.csv`. **Read** = Haiku errors found
by reading the menu. "Added by hand" means no URL was recorded.

| file | venue | file URL (page URL: none for all) | format | pages | date | Opus | H-cmp | H-bat | scorer | read (Haiku errors) |
|---|---|---|---|---|---|---|---|---|---|---|
| 17423796669662_Nowe ceny Karczma.pdf | Karczma (Hotel Gromada) | added by hand | PDF text + raster cover | 19 | 2025-03-19 | 2 | 2 | 2 | 0 | none |
| 2025_Bierhalle_menu_marzec-03-PL-WEB-2.pdf | Bierhalle | added by hand | PDF text (garbled encoding) | 3 | 2025-03 | 1 | 1 | 1 | 0 | section `STAEJ` copied from garbled text |
| 8-724x1024.jpg | not printed | added by hand | JPEG 724×1024 | 1 | — | 2 | 2 | 2 | 0 | wrong "cut off" note; batch "corrected" a printed spelling |
| BAR-1-scaled.jpg | Nicoletta | added by hand | JPEG 1810×2560 | 1 | — | 5 | 5 | 5 | 0 | `Rassberry` (printed `Rassbery`); batch: one category `other` |
| Karta-napoje-2025.pdf | U Barssa | added by hand | PDF text | 6 | 2025 | 2 | 2 | 2 | 0 | restaurant null; `0,0%` dropped from the name |
| MENU-PL-PPN-PPM-PPN-210-scaled-1166x1654.webp | not printed | added by hand | WebP 1166×1654 | 1 | — | 5 | 5 | 5 | 0 | none (Opus mis-cased the section) |
| Menu-Obrzezna-2026.pdf | Semolino (Obrzeżna) | semolino.pl/…/2026/05/Menu-Obrzezna-2026.pdf | PDF text | 6 | 2026-05 | — | — | 9 | — | Peroni size missing; Sabatin section null |
| Menu-Spaccanapoli-202506.pdf | Spaccanapoli | spaccanapoli.pl/…/2025/06/Menu-Spaccanapoli-202506.pdf | PDF text + 2 raster pages | 24 | 2025-06 | — | — | 10 | — | Merlot price lost (compaction) |
| Menu-Woronicza.pdf | Semolino (Woronicza) | added by hand | scanned PDF | 5 | — | 6 | 6 | 6 | 0 | `Limonka i mięta`; batch put sizes in the names |
| Pandan.pdf | Pandan | added by hand | scanned PDF (PL + EN pages) | 2 | — | 8 | 8 | 8 | 0 | descriptions shortened; batch `Oh My YUZU` (EN) |
| Pod-Menu-New-V5.pdf | Pod Niebną | restauracjapodniebna.pl/…/2026/03/Pod-Menu-New-V5.pdf | PDF text (scrambled) | 2 | 2026-03 | — | — | 3 | — | all 3 prices empty |
| THE-ROOF-04.2026-strona.pdf | The Roof | added by hand | PDF text | 13 | 2026-04 | 11 | 11 | 11 | 0 | batch: 55 PLN alcoholic price added ×3 |
| cud-warszawa-podkladka-062020.pdf | Cud Miód Warszawa | added by hand | scanned PDF (placemat) | 2 | 2020-06 | 6 | 6 | 6 | 0 | none |
| koktaile_pera_4.2026.jpg | Pera | added by hand | JPEG 1280×1810 | 1 | 2026-04 | 2 | 2 | 2 | 0 | currency null (not printed) |
| loreta-menu.pdf | Loreta (Puro Warszawa Centrum) | added by hand | PDF text + 3 raster + 4 blank | 23 | — | 12 | 12 | 12 | 0 | descriptions taken from the EN lines; Bla size missing |
| menu-pl.pdf | Charlotte (Plac Zbawiciela) | bistrocharlotte.com/…/menu-pl.pdf | PDF, outlined vector text, no text layer | 11 | 2026-11-02 (server) | — | — | 6 | — | not reviewed by eye |
| napoje-alkohole-scc-pl-03-2026.pdf | Jeff's | jeffs.com/images/nasze-menu/napoje-alkohole-scc-pl-03-2026.pdf | scanned PDF | 1 | 2026-03 | 5 | 5 | 5 | 0 | `KOŹLE 0,0%` (printed `KOZEL 0,0%`); batch restaurant null |

**Export:** `export/<menu stem>.json`, 17 files, plus `export/index.json`. Each file holds:

- `menu_file` (path only; the file itself is **not** included), `sha256`, `bytes`, `format`, `pages`,
  `pdf_pages` (per-page character counts and whether the text layer was used);
- `origin` (the URL fields, or `added_by_hand`) and `date_guess`;
- `optimizer_standard` (the parts and estimated tokens);
- `haiku_compare_run`, `haiku_batch_run` (with `stop_reason` and `thinking_tokens`) and `opus_reference`,
  each with `result` and `usage`;
- `comparison_mismatches`.

The menu files stay in `src/` and are third-party copyrighted documents.

---

## 8. Domain cases and what I'd do differently

### 8.1 Menu-reading pitfalls met

- **Bilingual lines.** Some menus put PL and EN on one line ("Lemoniada cytrynowa / Homemade lemonade",
  THE ROOF descriptions). Others use parallel lines (Loreta: PL line, then EN line) or parallel **pages**
  (Pandan p1 PL, p2 EN). Models pick either language at random: `O mój YUZU` vs `Oh My YUZU`, and Loreta
  descriptions in PL in one run and EN in the other. Section names got merged ("PIWO BEZALKOHOLOWE / NON-ALCOHOLIC
  BEER") or cut ("PROPOZYCJE BEZ %"). Decide on a rule, e.g. "the Polish version; EN only if there is no
  PL", and put it in the prompt.
- **Heading-only NA.** Many items are NA only because of their heading: Lech Free (5 menus, never with an
  ABV), all mocktails under "KOKTAJLE BEZALKOHOLOWE", Cud Miód's smoothies, and "Piwo bezalkoholowe" at
  Karczma. The Karta-napoje heading **contradicts itself**: "PIWO BEZALKOHOLOWE / LOW-ALCOHOL BEER".
- **Dual price NA / alcoholic.** THE ROOF prints `45 / *55 PLN` plus "*Dostępne również w wersji z
  alkoholem", and the description line reads "0% / with Beefeater gin". Loreta prints
  "Dodaj % / add % 44" and "49" (add a spirit) under the mocktails. Sonnet and Haiku (batch) both included
  the alcoholic price.
- **Sizes.** Sizes appear in names ("Peroni … 0% 0,33l"), in headings ("PIWO BEZALKOHOLOWE 0,33 l",
  "PIWO BUTELKOWE 0,33 l"), in column headers ("125 ml 750 ml" over two price columns at Loreta,
  "Szklanka / Dzbanek" at Jeff's), and garbled in text (Loreta "0% ml / 37 1500% ml"). One price under a
  two-column header (Bla 198) leaves the size ambiguous. `size` came back in five spellings (`0,33l`,
  `0.33l`, `0,33 l`, `330 ml but. / btl`, `butelka 330 ml`).
- **Described only.** "Piwo bezalkoholowe" and "Piwo bezalkoholowe smakowe" (Karczma), Spaccanapoli's
  "Wino bezalkoholowe białe lub czerwone (kieliszek)", "Prosecco bezalkoholowe", and "Mojito
  bezalkoholowe" have no brand. Also "Lech free (różne smaki)", which stands for several drinks in one
  line.
- **One line, several products.** "Martini Vibrante lub Floreale & Kinley Tonic"; "Wino bezalkoholowe
  białe lub czerwone".
- **Lemonade.** Cud Miód "Koktajle bezalkoholowe i lemoniady" (Lemoniada excluded by most models; Sonnet
  included it); seasonal and home-made lemonades on Spaccanapoli, Karta-napoje, Obrzeżna and Jeff's were
  all excluded.
- **Kombucha and sparkling tea** inside a wine section (Loreta): Kombucha 0,5% and Bla 0%. Categories
  varied: `other` in both Haiku runs, `na_sparkling` (Bla) in Opus. THE ROOF uses kombucha as an
  *ingredient*.
- **Mocktail vs soft drink.** Cud Miód's Spinach&Banan and Strawberry&Banan (fruit and yogurt smoothies)
  sit under the mocktail heading; all Claude models called them mocktails. Crodino Aperitivo is a bottled
  NA bitter sold as a "cocktail". Virgin Mojito is Sprite + lime + mint.
- **Aperitif vs NA spirit.** Martini Floreale and Vibrante, Zanin Aperitivo Zero, Crodino and Amaro
  Lucano 0% show up as ingredients, as stand-alone `na_spirit` (Amaro Lucano at THE ROOF and Loreta), or
  as the base of a spritz.
- **Alcoholic look-alikes next to NA items.** "Martini Prosecco 11,5%" and "Cava 11,5%" sit in the same
  box as "Wino musujące 0%" (Pandan; Gemini Flash-Lite took them). "MARTINI FIERO TONIC" (Cud Miód) is
  alcoholic. Pepsi Zero, Coca-Cola Zero, "REDBULL Zero" and "Zero Cukru" tonics contain "zero" but are
  sugar-free soft drinks.
- **"Mulled wine".** Spaccanapoli prints "Grzane wino bezalkoholowe/Mulled wine" in the NA section. The
  batch note says it excluded a mulled wine "with no alcohol-free marker" from page 13, which is a
  different line.
- **Printed misspellings.** "Książce" (Obrzeżna, Woronicza), "Nastro Azzuro", "Gewurtztraminer",
  "Rassbery", "Giffrad", "Fleure", "COCTAILS", "SPRARKLING VINE". The models correct some of them and not
  others, which breaks "transcribe as printed".
- **Broken text layers.** Bierhalle's font encoding (`z³`, `STAEJ`, `œ`). Pod Niebną's columns are
  interleaved, so prices cannot be assigned. menu-pl has no text layer at all.
- **No NA drinks, or few.** Every menu here had at least 1. An empty result was never tested on a real
  menu.

Batch notes on the four menus never compared, verbatim:

- **Obrzeżna:** "Sabatin 0% is printed in the layout near the Cognac section, so its section is uncertain.
  Aperitivo Free and Hugo Virgin have no size or ABV printed beyond the 0% in the Hugo Virgin description.
  Lech Free has no ABV printed."
- **Spaccanapoli:** "The Merlot alcohol-free red wine on page 20 has no price printed. The Mulled wine
  listed on page 13 (Grzane wino/Mulled wine, 18 PLN) has no alcohol-free marker, so it was excluded."
- **Pod Niebną:** "The mocktail prices could not be reliably matched to items because the PDF text layout
  is scrambled. Possible candidate values near the section are 8, 15 and 25, but the assignment is
  uncertain, so prices were left empty. Restaurant name taken from the footer address/website and may be
  inferred."
- **Charlotte:** "Glass sizes for French 75 0%, Mimoza 0% and Martini Floreale Sour 0% are not clearly
  printed (icons only, 150/150/300 ml), so size is left null."

### 8.2 Style and ABV certainty per drink (13 compared menus, 67 drinks)

I read this from the menus myself; no model was called. **Style** uses the closed list. "—" means the
menu does not state it. A style known only from product knowledge, e.g. that Heineken 0,0% is a lager, is
shown as "—" with the inferred style in brackets. **ABV** is `zero` when "0,0%" or "0%" is printed on the
drink line or its heading (the menus never distinguish these two), `up_to_half` when ≤0,5% is printed,
and `unknown` when only "bezalkoholowe" or "non-alcoholic" is printed, or nothing at all. Under Polish
rules "bezalkoholowe" allows up to 0,5%. *ing.* means 0% is printed only on an ingredient.

| menu | drink | style | ABV |
|---|---|---|---|
| Karczma | Piwo bezalkoholowe | — | unknown |
| Karczma | Piwo bezalkoholowe smakowe | — (flavoured) | unknown |
| Bierhalle | Piwo bezalkoholowe Tucher | — | unknown |
| 8-724 | The Very Cautious Gewurtztraminer/Riesling | białe ("jasnosłomkowej barwie") | zero ("0% alk.") |
| 8-724 | The Very Cautious Shiraz | czerwone ("Ciemnoczerwone wino") | zero ("0% alk.") |
| Nicoletta | Crodino Aperitivo | aperitif (name) | unknown |
| Nicoletta | Nicoletta Amore | — | unknown (*ing.* prosecco 0%) |
| Nicoletta | Bramble | — | unknown (*ing.* gin 0%) |
| Nicoletta | Tropical Refresher | — | unknown (*ing.* gin 0%, bitter 0%) |
| Nicoletta | Sweet Berry | — | unknown (*ing.*) |
| U Barssa | Lech free (różne smaki) | — | unknown (heading says "LOW-ALCOHOL") |
| U Barssa | Książęce IPA 0,0% | IPA | zero |
| Happy Hours webp | ZANIN ZERO SPRITZ | aperitif (Zanin Aperitivo Zero base) | unknown (*ing.* prosecco 0%) |
| Happy Hours webp | VIRGIN PASSION GIMLET | — | unknown (*ing.*) |
| Happy Hours webp | PEAR LIMONCELLO FIZZ | — | unknown |
| Happy Hours webp | CORONA FREE COOLER | — | unknown (*ing.*) |
| Happy Hours webp | FLOREALE BLOSSOM | — | unknown |
| Woronicza | Peroni Nastro Azzuro 0% 0,33l | — (lager) | zero |
| Woronicza | Lech Free / Limonka z miętą | — (flavoured) | unknown |
| Woronicza | Książce Złote Pszeniczne 0% | pszeniczne | zero |
| Woronicza | Książce IPA 0% | IPA | zero |
| Woronicza | APERITIVO FREE | aperitif (name) | unknown |
| Woronicza | HUGO VIRGIN | — | unknown |
| Pandan | Lapsang Sour | — | zero (heading "MOKTAJLE 0%") |
| Pandan | Bloom & Boom | — | zero (heading) |
| Pandan | O mój YUZU | — | zero (heading) |
| Pandan | Martini Vibrante lub Floreale & Kinley Tonic | aperitif | zero (heading) |
| Pandan | Martini Vibrante lub Floreale Spritz | aperitif | zero (heading) |
| Pandan | Lech Free Lager 0% | lager | zero |
| Pandan | Corona Cero 0% | — (lager) | zero |
| Pandan | Wino musujące 0% | musujące | zero |
| The Roof | ALMOST PURE | — | zero ("0% / with Beefeater gin") |
| The Roof | GROW WILS | — | zero |
| The Roof | FAULT LINE | — | zero |
| The Roof | DIRRRTY TIKI | — | unknown (*ing.*) |
| The Roof | GOOD GIRL LIKE YOU | — | unknown |
| The Roof | NO DEPRESSO | — | unknown (*ing.*) |
| The Roof | QUASI ITALIANO | bitter (Giffard Bitter 0% + prosecco 0%) | unknown (*ing.*) |
| The Roof | NAKED PALOMA | — | unknown (*ing.*) |
| The Roof | N-0%-groni | bitter (Negroni style) | zero (in the name) |
| The Roof | Amaro Lucano 0% | bitter | zero |
| The Roof | Heineken 0,0% | — (lager) | zero |
| Cud Miód | Mango and Mint | — | unknown |
| Cud Miód | Virgin Mojito | — | unknown |
| Cud Miód | Spinach&Banan | — | unknown |
| Cud Miód | Strawberry&Banan | — | unknown |
| Cud Miód | Lech free | — | unknown |
| Cud Miód | Lech free limonka & mięta | — (flavoured) | unknown |
| Pera | Peach Bloom 0% | — | zero |
| Pera | Italian Spritz 0% | bitter ("aperitif typu bitter") | zero |
| Loreta | PUMPKIN SWIZZLE | — | zero (each line prints "0%"; the layout is garbled) |
| Loreta | PADDINGTON | — | zero (same) |
| Loreta | MŁODE | — | zero |
| Loreta | Steinbock Alkoholfrei | białe (Riesling) | zero |
| Loreta | Kombucha by Lauren Blanc Floral | — | **up_to_half** ("0,5%") |
| Loreta | Bla, Copenhagen Sparkling Tea Company | — (sparkling tea, not wine) | zero |
| Loreta | Tanqueray 0% | — | zero |
| Loreta | Osco L'Original 0% | — | zero |
| Loreta | Fluère Smoked Agave 0% | — | zero |
| Loreta | Amaro Lucano 0% | bitter | zero |
| Loreta | Captain Morgan Spiced Gold 0% | — | zero |
| Loreta | Piwo bezalkoholowe 0% | — | zero |
| Jeff's | LECH FREE LAGER | lager | unknown |
| Jeff's | LECH FREE LIMONKA MIĘTA | — (flavoured) | unknown |
| Jeff's | KSIĄŻĘCE PSZENICZNE 0,0% | pszeniczne | zero |
| Jeff's | KSIĄŻĘCE IPA 0,0% | IPA | zero |
| Jeff's | KOZEL 0,0% | — | zero |

Totals: style readable for 21 of 67 drinks. ABV: `zero` 36, `up_to_half` 1, `unknown` 30. No drink
printed a value strictly between 0 and 0,5% other than the kombucha. No menu used pils, stout, radler,
sour, różowe or cydr for an NA item. The Lech Free flavoured beers are radler-like, but no menu calls them
that.

### 8.3 Contacts

| menu | contact details printed | personal? |
|---|---|---|
| Karta-napoje-2025 (U Barssa) | `biuro@ubarssa.pl` (a role address), `www.ubarssa.pl`, landline `(0-22) 635-24-76` and **mobile `(+48) 881 690 992`**, in the footer of every page | The mobile is a business line on the menu; the owner is not determined. No personal name. |
| Menu-Spaccanapoli | `spaccanapoli.ludna@gmail.com`, `spaccanapoli.warszawa@gmail.com` (Gmail, but named after the locations), `(22) 127 93 99`, **mobile `(48) 780 020 121`** | Named after the business, not a person; the mobile owner is not determined. |
| Karczma | phone numbers of Hotel Gromada locations, one of them a **mobile, `510 006 787`** (Łomża) | business |
| All other menus | none seen in the text, nor on the images I viewed (Jeff's "Jeff" signature is a mascot) | — |

No menu showed a named personal e-mail address or a sole trader's name. menu-pl's 11 images were not
reviewed by eye, and no venue web page was ever fetched.

### 8.4 Known bugs

1. Compaction is per page, and it drops repeated short lines including prices (`optimizer.py:99-107`,
   `:229`).
2. A garbled or scrambled text layer passes the 80-character check; there is no quality check
   (`optimizer.py:228`).
3. Date detection bugs (§2.6).
4. `srcset` takes the last entry; grouping drops the host; links without an extension vanish (§3).
5. robots.txt allows everything on 401 and 403 (`fetch.py:237`).
6. The manifest is saved only at the end, so a crash loses origins (`fetch.py:338-339`).
7. Result files are named by stem: `menu.pdf` and `menu.jpg` overwrite each other's results
   (`batch.py:249`, `:337`). "Batch runs" from different batches of the same model overwrite each other.
8. `cancelling` followed by a normal exit is reported as `cancelled` (`jobs.py:75`).
9. The `paid` flag is not displayed.
10. The Extract page never shows cost.
11. `httpx2` is missing from `requirements.txt`.
12. The scorer only compares names and prices, so transcription errors pass.
13. The handoff's statement that the estimate overhead is 600 tokens is wrong (`batch.py:144`).

### 8.5 What I'd build differently

- Decide per page whether to use text or an image by **quality**, not by length alone: detect mojibake
  (`³`, `œ`, `¹` in Polish text) and implausible column interleaving, and rasterise those pages. When the
  text layer is doubtful, send text **and** an image for the drink pages only.
- Compact across the whole document, never drop lines containing digits, and dedupe only lines that
  repeat on ≥50% of pages.
- Send only the drink pages: most tokens go on food pages. Spaccanapoli is 24 pages, and its NA items are
  on two of them.
- Add a structured `price_kind` field or a `variants` field instead of hoping the prompt keeps alcoholic
  prices out.
- Add a language rule for bilingual menus, and a `name_as_printed` field kept separate from any cleaned
  name.
- Normalise `size` to millilitres in code, keeping the printed string.
- Run each menu twice, or on two models, and flag disagreements. The two Haiku runs disagreed on
  109 fields; that disagreement is a better review signal than the Opus comparison.
- Score on all fields, not names only.
- Store `stop_reason`, `thinking_tokens` and the full `usage` for every call.
- Make the fetcher log every attempt, including failures, to the database. Today the only record of what
  was tried is five successful rows.

---

## 9. Two runs that need your approval

**Not run yet.** The estimates below are based on the real token counts of the 17-menu Haiku batch
(151,020 input and 25,371 output tokens in total).

| run | what changes | live API | Batch API (½ price, finished in ~3 min last time) |
|---|---|---|---|
| a) dual-version line, 17 menus | about +20 input tokens per request | ≈ $0.028 (upper bound ≈ $0.04 if output varies) | ≈ $0.014 |
| b) extended schema, 17 menus | schema about +250 input tokens per request; output about +25–40% (5 more fields per drink, about 96 drinks) | ≈ $0.033 (upper bound ≈ $0.05) | ≈ $0.017 |
| both | | ≈ $0.06 | ≈ $0.03 |

The results will be appended here once you approve.

---

## 10. Things the receiving app should know that nobody asked

- **The comparison is one sample.** Haiku output varies from run to run on names, brands and
  descriptions, and once on prices (THE ROOF). Budget for a review step, or for a second run.
- **Token budgeting:** about 1,850 tokens of overhead, image `w·h/750`, Polish text `chars/1.6`. The
  largest menu so far was 28k input tokens (Spaccanapoli). All 17 cost $0.014 at batch price.
- **Effort `low` produced 0 thinking tokens on 3 of 17 menus**, and up to 2,680 on Loreta.
- **Sizes and ABV strings are not normalised**: 5 spellings of 0,33 l, and `0%`, `0.0%`, `0,0%`,
  `0% alk.` for ABV.
- **`restaurant_name` is often missing or inferred**, from the file name (The Roof), a footer website
  (U Barssa, Pod Niebną) or the address. Do not use it as a venue key. Two menus belong to the same chain
  (Semolino Woronicza and Obrzeżna), and Karczma belongs to the Hotel Gromada chain.
- **Some fixtures are stale.** cud-warszawa is from 2020. Charlotte's date is a server file date.
- **Batch results downloaded today** are kept by Anthropic for a limited time. The parsed copies in
  `export/` are now the record.
- **API keys in the prototype** live in `~/.config/menu-na/keys.env` (Anthropic, OpenAI and Gemini). The
  values are not reproduced anywhere in this document or in `export/`.
- **Copyright and privacy:** the menus are third-party documents, and some carry business mobile numbers
  (§8.3). Keep the source files on a private disk, and do not show the contact lines in the UI.
