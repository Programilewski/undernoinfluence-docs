# NA Menu Extractor — Handoff for the Laravel implementation

This document describes a working Python prototype ("NA Menu Extractor") so it can be rebuilt **natively in
an existing Laravel app**. Do not port the Python code line by line. Rebuild the behaviour with Laravel
tools: queues, Eloquent, the Storage facade, the HTTP client, and the scheduler.

Everything below was learned by building and testing the prototype on 17 real Polish restaurant and bar
menus in November 2026. Sections marked **Learned** record decisions backed by test results. Keep these
decisions unless you have new evidence.

---

## 1. What the feature does

A user uploads a restaurant or bar menu (PDF or photo). The app returns **only the non-alcoholic drinks**
as structured JSON: NA beer, dealcoholized wine, NA sparkling wine, NA cider, NA spirits, and mocktails.
For each drink it returns the name, category, brand, description, ABV, prices with sizes, and the menu
section.

There is an optional mode that also includes ordinary soft drinks, juice, water, coffee and tea. It is off
by default.

The prototype has four parts:

1. **Single extraction.** Upload one menu, which can be several files. Get the result in a few seconds.
2. **Menu fetcher.** Download menus from restaurant websites. Store where each file came from and when
   the menu is dated.
3. **Bulk extraction.** Process many menus through the Anthropic **Message Batches API**, at 50% of the
   normal price.
4. **Model comparison.** Run the same menus on several LLMs and score them against a reference model.
   This was a research tool. It is how the default model was chosen. It is optional in Laravel (see §11).

---

## 2. End-to-end flow

```
upload(s) / fetched file
   │
   ▼
[1] Validate: ≤30 MB per request, known type (PDF or image). Several files = ONE menu.
   │
   ▼
[2] Optimize (CPU work, run in a queued job):
    PDF page with a text layer   → extract text → compact it → one text block
    PDF page without text (scan) → rasterize at 220 DPI → image pipeline
    image                        → EXIF rotate → flatten alpha onto white → skip if blank
                                   → trim margins → collapse empty bands → tile if very long
                                   → downscale → grayscale JPEG q80 → base64
   │
   ▼
[3] Build the Messages API request: system prompt + content blocks + JSON schema (structured output)
   │
   ▼
[4] Call Claude (live call, or the Batch API for bulk work)
   │
   ▼
[5] Check stop_reason (refusal / max_tokens) → parse JSON → validate against the schema
   │
   ▼
[6] Store result + token usage + cost (USD) + link to the source file and its date/origin
```

**Dry run ("preview optimization").** Run steps 1–2 only. Show the user what would be sent: images
(previews), text, and estimated tokens before and after optimization. This costs nothing. Keep this
feature, because users rely on it to choose a resolution preset.

---

## 3. Input optimization (the main cost saver)

**Learned:** The cost of a menu depends almost entirely on the input tokens. Optimizing the input matters
more than the choice of model.

### 3.1 PDFs

- For each page, extract the text in reading order. Python used PyMuPDF `get_text("text", sort=True)`.
  In PHP, use `pdftotext -layout` from poppler-utils, or `smalot/pdfparser`. Poppler is more reliable for
  layout.
- **Trust the text layer only when the page has ≥ 80 non-whitespace characters.** Otherwise treat the page
  as scanned: rasterize it at **220 DPI** and send it through the image pipeline. In PHP, use
  `pdftoppm -r 220 -png` or Imagick with Ghostscript.
- Put all text pages of one PDF in **one** text block. Separate the pages with `--- {filename} p{N} ---`.
  Put that text block **before** any image blocks of the same menu.
- **Compact the text** before you send it. Process each line as follows:
  - Replace runs of 3 or more of the characters `. · … _ -` with one space. This removes dot leaders:
    `"Beer ........ 5.00"` becomes `"Beer 5.00"`.
  - Collapse spaces, tabs and NBSP. Trim the line. Drop empty lines.
  - Drop a line that is **shorter than 60 characters and appeared before**. These are running headers and
    footers.
- **Result:** about 95% fewer tokens than sending the PDF natively. Native PDF input sends the text and an
  image of every page.

### 3.2 Images (photos, scans, rasterized pages)

Supported formats: JPG, PNG, WebP, HEIC/HEIF (phones), AVIF, GIF, BMP, TIFF. For TIFF, every frame is a
page. For animated GIF or WebP, use the first frame only. In PHP, Imagick with libheif covers HEIC and
AVIF. Check that the server's ImageMagick build supports them.

Process each image in this order:

1. **Apply the EXIF orientation.** Phone photos are often rotated.
2. **Flatten transparency onto white.** This applies to RGBA, LA and palette images.
3. **Skip blank images.** Build a content mask as follows: convert to grayscale, apply a 3×3 median filter
   to remove JPEG and scan speckle, and mark each pixel whose difference from the **top-left pixel**
   (taken as the background) is greater than **18**. If ink covers less than **0.05%** of the area, the
   image is blank and you send nothing.
4. **Trim the margins** to the mask's bounding box, plus 12 px of padding. Crop only when the crop removes
   **more than 3%** of the area.
5. **Collapse empty horizontal bands.** Rows without content are background. Keep at most
   `max(16, width/30)` consecutive empty rows and remove the rest. Do nothing if this would keep more than
   95% of the rows. This removes the large gaps between menu sections.
6. **Tile long images instead of shrinking them.** Tile only when both conditions hold:
   - aspect ratio > **2.0**, and
   - the image would be downscaled anyway.

   Each tile is `short_edge × 2.0` long along the long axis. Tiles overlap by **4%**. The last tile is
   aligned to the end of the image. Label the tiles `"{name} tile i/n"`.
   **Learned:** If you shrink a long scrolling menu to fit, the text becomes unreadable. Tiling costs more
   tokens but keeps the text readable.
7. **Downscale** by the factor `scale = min(1, max_edge / long_edge, sqrt(max_pixels / (w*h)))`. Use a
   Lanczos filter.
8. **Encode** as **grayscale** JPEG (the default; the user can switch to color) with quality 80 and
   optimize on. Grayscale reduces the bytes but not the tokens. The request becomes faster with no loss of
   accuracy.

**Resolution presets** (UI option, default `standard`):

| preset   | max long edge | max pixels per image/tile | ≈ tokens per image |
|----------|---------------|---------------------------|--------------------|
| low      | 1024          | 600,000                   | ~800               |
| standard | 1568          | 1,150,000                 | ~1,500             |
| high     | 2048          | 2,300,000                 | ~3,000             |

Use *low* for clean printed menus. Use *high* for small print or blurry photos. Claude downsizes images
larger than about 1568 px / 1.15 MP itself, but you still pay to upload the larger file. *High* exists
for hard cases.

### 3.3 Token estimates (shown before any API call)

- Image: `width × height / 750`
- Text: `chars / 4`
- "Naive" baseline, shown for comparison: each PDF page as a page image of `(page_w×2, page_h×2)`, capped
  at 1568 px / 1.15 MP, plus its raw text. Each raw image is capped the same way.
- Batch estimates add about **600 tokens** per request for the system prompt and schema, and assume about
  **1,500 output tokens** per menu.
- After each call, show the **real** token counts from the API response `usage`.

---

## 4. The LLM request

### 4.1 Content blocks (order matters)

For each part of the optimized menu, in order:

- Text part:
  `{"type":"text","text":"<menu_text source=\"{source}\">\n{text}\n</menu_text>"}`
- Image part: first a label `{"type":"text","text":"[image: {source}]"}`, then
  `{"type":"image","source":{"type":"base64","media_type":"image/jpeg","data":"..."}}`

Finally, add `{"type":"text","text":"Extract the non-alcoholic drinks from this menu."}`.

### 4.2 System prompt (copy verbatim; it was tuned)

```
You extract non-alcoholic drinks from restaurant and bar menus.

Include an item only when the menu makes it clear it is alcohol-free:
- "0.0", "0%", "alcohol-free", "non-alcoholic", "NA", "zero", "bezalkoholowe", "alkoholfrei", "sans alcool", "sin alcohol" and similar markers in any language
- dealcoholized wines, NA beers and ciders, NA spirits (e.g. gin alternatives), mocktails / zero-proof cocktails
- beers labelled <=0.5% ABV count as non-alcoholic
Exclude regular alcoholic drinks, and exclude food.
{soft_rule}
Transcribe names and descriptions as printed (don't translate). Use numbers for prices, without currency symbols. If one item has several sizes, list each as a separate price. If no qualifying drinks exist, return an empty list.
```

`{soft_rule}` is one of two strings:

- Soft drinks OFF (default):
  `Do NOT include ordinary soft drinks, juices, water, coffee or tea - only alcohol-free versions of normally alcoholic drinks (beer, wine, cider, spirits, cocktails).`
- Soft drinks ON:
  `Also include ordinary soft drinks, juices, water, coffee and tea, using the matching categories.`

**Suggested improvement, based on a real error (see §9):** add the line
`If a drink is offered in both an alcohol-free and an alcoholic version, list only the alcohol-free price.`

### 4.3 Request parameters (Anthropic Messages API, `POST https://api.anthropic.com/v1/messages`)

```json
{
  "model": "claude-haiku-5-5",
  "max_tokens": 16000,
  "system": "<system prompt above>",
  "thinking": {"type": "adaptive"},
  "output_config": {
    "effort": "low",
    "format": {"type": "json_schema", "schema": { "...schema from 4.4..." }}
  },
  "messages": [{"role": "user", "content": ["...blocks from 4.1..."]}]
}
```

Headers: `x-api-key`, `anthropic-version: 2023-06-01`, `content-type: application/json`.

- **`effort: "low"`** is the default. Transcribing a menu needs little reasoning, and low effort keeps
  thinking tokens and cost down. Use `medium` for messy photos. Make it configurable.
- **Server-side refusal fallback (Sonnet and Opus only):** add the header
  `anthropic-beta: server-side-fallback-2026-07-01` and the body field `"fallbacks": "default"`. If a
  safety classifier declines the request, the API retries it on a fallback model within the same call.
  **Do not send this for Haiku 5.5** (not supported), and **do not send it in Batch API requests** (not
  accepted).
- Use Laravel's `Http` client, or the official Anthropic PHP SDK if the app already uses it. Make sure the
  client can pass `output_config`, `thinking` and beta headers. The raw HTTP client is the simplest way to
  be sure.
- Set the HTTP timeout to about 120 s. Large menus took up to about 21 s on Haiku.

### 4.4 Output JSON schema

In Python, this schema was generated from Pydantic models. In Laravel, write it by hand, for example as a
PHP array in a config file or a `MenuSchema` class. The version below makes **every field required and
nullable**. This is slightly stricter than the prototype, in which optional fields could be left out, and
it makes validation in PHP simpler.

```json
{
  "type": "object",
  "additionalProperties": false,
  "required": ["restaurant_name", "currency", "language", "drinks", "notes"],
  "properties": {
    "restaurant_name": {"type": ["string", "null"]},
    "currency": {"type": ["string", "null"], "description": "ISO 4217 code if determinable, e.g. 'EUR', 'PLN'"},
    "language": {"type": ["string", "null"], "description": "Primary language of the menu, ISO 639-1"},
    "notes":    {"type": ["string", "null"], "description": "Ambiguities worth flagging, e.g. unreadable prices"},
    "drinks": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["name", "category", "brand", "description", "abv", "prices", "menu_section"],
        "properties": {
          "name": {"type": "string"},
          "category": {"type": "string", "enum": ["na_beer","na_wine","na_sparkling","na_cider","na_spirit","mocktail","soft_drink","juice","water","hot_drink","other"]},
          "brand": {"type": ["string", "null"]},
          "description": {"type": ["string", "null"]},
          "abv": {"type": ["string", "null"], "description": "Alcohol content as printed, e.g. '0.0%' or '<0.5%'"},
          "menu_section": {"type": ["string", "null"], "description": "Heading the item was listed under"},
          "prices": {
            "type": "array",
            "items": {
              "type": "object",
              "additionalProperties": false,
              "required": ["amount", "size"],
              "properties": {
                "amount": {"type": "number"},
                "size": {"type": ["string", "null"], "description": "Serving size as written, e.g. '0.33l', 'glass', 'bottle'"}
              }
            }
          }
        }
      }
    }
  }
}
```

Example result:

```json
{
  "restaurant_name": "Pandan", "currency": "PLN", "language": "pl", "notes": null,
  "drinks": [
    {"name": "Lech Free Lager 0%", "category": "na_beer", "brand": "Lech", "description": null,
     "abv": "0%", "prices": [{"amount": 16.0, "size": "0.33l"}], "menu_section": "PIWO BEZALKOHOLOWE 0,33 l"},
    {"name": "Lapsang Sour", "category": "mocktail", "brand": null,
     "description": "aksamitny – zbalansowany – … Bezalkoholowy wermut Martini Vibrante, herbata lapsang, cytrusy, białko",
     "abv": null, "prices": [{"amount": 32.0, "size": null}], "menu_section": "MOKTAJLE 0%"}
  ]
}
```

### 4.5 Response handling (in this order)

1. `stop_reason == "refusal"`: error "The model declined to process this menu." If the model was Haiku,
   suggest retrying on Sonnet. This can be automatic, because Haiku has no server-side fallback.
2. `stop_reason == "max_tokens"`: error "Output was cut off (menu too large). Try splitting it into fewer
   pages."
3. Take the first `content` block with `type == "text"`. If there is none, the error is "Model returned no
   JSON." Thinking blocks come before the text block. Ignore them.
4. `json_decode` the text and validate it against the schema. With structured output this almost never
   fails, but validate anyway.
5. Map HTTP errors to user-facing messages:

   | Error | Message |
   |---|---|
   | 401 | authentication failed / key missing |
   | 400 | "Request rejected: {message}" |
   | 429 | "Rate limited, try again shortly" |
   | other 4xx/5xx | "Anthropic API error {status}: {message}" |
   | connection error | "Could not reach the Anthropic API" |

   For a single upload, the prototype returned HTTP 502 for extraction errors and HTTP 400 for bad files.

Store the usage too: `model`, `input_tokens` and `output_tokens` from `usage`, the computed `cost_usd`,
and the elapsed seconds.

---

## 5. Model choice and pricing

### 5.1 Learned: comparison of 13 real menus on 7 models (9 Nov 2026)

The reference model was Claude Opus 5.5. All models received the same prompt, payload and schema, at
effort low and standard resolution.

| model | menus OK | drinks found vs ref | extra (wrong) drinks | prices agree | cost / menu | avg s |
|---|---|---|---|---|---|---|
| **claude-haiku-5-5** | 13/13 | **67/67** | **0** | **67/67** | **$0.00138** | 8.2 |
| claude-sonnet-5-5 | 13/13 | 67/67 | 1 | 64/67 | $0.0212 | 5.2 |
| claude-opus-5-5 (ref) | 13/13 | — | — | — | $0.0415 | 6.6 |
| gpt-6-luna | 13/13 | 64/67 | 2 | 64/64 | $0.00075 | 6.6 |
| gpt-6.1-sol | 13/13 | 67/67 | 0 | 67/67 | $0.0139 | 8.1 |
| gemini-3.5-flash-lite | 13/13 | 67/67 | 5 | 67/67 | $0.0028 | 2.5 |
| gemini-3.8-flash | 13/13 | 63/67 | 0 | 63/63 | $0.0051 | 5.5 |

**Decision: the default model is `claude-haiku-5-5` at effort `low`.** It matched the reference exactly on
every menu, at about 1/30 of Opus's cost (all 13 menus cost $0.018). Use `claude-sonnet-5-5` as the
fallback for refusals and for very hard photos.

Notes on the other models:

- **GPT-6 Luna** is cheaper but replaced printed names with generic ones ("Non-alcoholic beer" instead of
  "Lech Free Lager 0%"). This breaks the "transcribe as printed" rule.
- **Gemini 3.5 Flash-Lite** included regular alcoholic drinks (Martini Fiero, Cava 11.5%). Its precision is
  not good enough.
- **Gemini 3.8 Flash** missed items: 3 smoothies or mocktails on one menu, and one kombucha.
- **Haiku output.** Haiku wrote more output tokens (thinking) than Sonnet or Opus, and was slower on
  average. It was still by far the cheapest Claude model.

The prototype supports only Anthropic in production. **Laravel needs only the Anthropic integration.**
The OpenAI and Gemini adapters existed only for this comparison.

### 5.2 Price table (USD per 1M tokens, input / output, Nov 2026)

Keep this table in config, because prices change.

| model | input | output |
|---|---|---|
| claude-opus-5-5 | 4.00 | 20.00 |
| claude-sonnet-5-5 | 2.00 | 10.00 |
| claude-haiku-5-5 | 0.10 | 0.50 (valid for prompts ≤100k tokens; every menu was far below that) |

`cost = (in × p_in + out × p_out) / 1e6`. Multiply by **0.5 for the Batch API**. An unknown model has a
cost of null; do not show it as zero.

### 5.3 Config / env

| key | default | notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | — | required |
| `MENU_MODEL` | `claude-haiku-5-5` | |
| `MENU_EFFORT` | `low` | `low` / `medium` / `high` |
| max upload | 30 MB per request | |
| max_tokens | 16000 | |

---

## 6. Bulk extraction (Message Batches API)

Use this when you process many menus, such as every menu fetched in a week. It costs **50% of the live
price**. Most batches finish within an hour; the maximum is 24 h.

The flow:

1. Optimize each menu. One file is one menu, and one menu is one request. Build the same params as
   §4.3, **without** the fallback beta.
2. `custom_id` must be unique per batch and at most 64 characters. Store the mapping
   `custom_id → menu/file, model` in the DB. Do not encode meaning in the id.
3. If the payload exceeds the limits, split it into several batches. The API limit is 256 MB per batch;
   the prototype used 200 MB to leave headroom. The other limit is 100,000 requests per batch.
4. `POST /v1/messages/batches` with `{"requests":[{"custom_id":..., "params":{...}}]}`. Store the
   `batch_id`, created time, model, effort, resolution and soft flag.
5. **Polling.** The prototype polled every 60 s. In Laravel, use a scheduled command or a delayed
   re-dispatched job. Call `GET /v1/messages/batches/{id}` until `processing_status == "ended"`.
6. **Collection.** Fetch the results (JSONL, one line per request), using `results_url` or
   `GET /v1/messages/batches/{id}/results`. For each line:
   - `result.type == "succeeded"`: run the same parse and validate step as §4.5 on `result.message`. If
     validation fails, mark the item "invalid". Store the cost at the batch rate.
   - `errored` / `expired` / `canceled`: mark the item failed and keep the error type and message.
7. Offer **"retry failed menus on a stronger model"**, for example Sonnet. Refusals in a batch show up as
   failures, because batches have no fallback.

Provide a free **estimate** action before submitting: tokens per menu, plus the live and batch cost for
each model.

---

## 7. Menu fetcher (getting menus from restaurant websites)

The input is a list of URLs. Each URL is either a **direct file link** or a **restaurant page** that links
to menu files. The page case is detected by `Content-Type: text/html` in the response, not by the URL.

### 7.1 Politeness and safety

- User-Agent: `na-menu-extractor/1.0 (menu fetcher)`. Use a generic one, without personal contact
  details.
- **Respect robots.txt.** Fetch it once per host and cache it. If it fails to load, allow the request.
- Wait at least **1 s between requests to the same host**. Many of these are small restaurant sites.
- Follow redirects. Use a 30 s timeout.
- Stream the download and **abort above 30 MB**.
- Only `http` and `https` URLs are allowed. In Laravel, also block private and internal IPs to prevent
  SSRF. The prototype ran locally and did not need this.

### 7.2 Finding menu links on a page

- Collect URLs from these sources:
  - `<a href>`, together with its link text
  - the `src`, `data-src`, `data-orig-file`, `data-large-file` and `href` attributes of `img`, `source`,
    `iframe`, `embed`, `object` and `link` elements, together with `alt` or `title`
  - the **largest** entry in `srcset`
- Resolve the URLs against the page URL. Keep only those with a menu file extension: `.pdf .jpg .jpeg
  .png .webp .heic .avif .gif .tif .tiff`.
- **Group WordPress thumbnails with their original.** Remove `-{W}x{H}` and `-scaled` before the
  extension to get the canonical name. In each group, prefer the URL that is already canonical (the
  original upload), and then the longest URL.
- Keep a group only if its **URL path or link text**, but **not the domain** (the domain is often the
  bar's own name), contains one of these words. Match after lowercasing and removing accents (`ł`
  becomes `l`), at a word start:
  `menu, karta, koktajl, koktail, cocktail, mocktail, drink, napoj, napoi, bar, wino, wina, wine, piwo,
  piwa, beer, cennik, carta, speisekarte, getranke, alkohol, happy`
- If nothing matches, report the other file links that were found, so the user can fetch the right one
  directly.

### 7.3 Saving and deduplication

- Compute the **SHA-256** of the content. If the hash already exists, the file is "unchanged": update
  `last_checked` only, and do not download it again.
- Get the filename from `Content-Disposition` (including `filename*=UTF-8''`) or from the final URL path.
  Sanitize it, but keep Polish letters. If there is no extension, add one based on the content type.
- Same name with different content: save it as `name-2.pdf`, `name-3.pdf` and so on. Never overwrite.
- If a file with the same name and the same hash was saved by hand, link the origin to that file and do
  not duplicate it.
- **Refresh action:** re-scan every saved page URL and re-check every directly fetched URL. This finds
  newly uploaded menus. It is a good candidate for a weekly scheduled job.

### 7.4 Origin record (the prototype's `src/.sources.json`; use a DB table in Laravel)

Store these fields for each file: `url`, `final_url` (if redirected), `page_url` (the page where the link
was found, or null), `link_text`, `fetched_at`, `last_checked`, `http_last_modified` (date), `content_type`,
`bytes`, `sha256`, `date_guess {date, matched, rule, from}`.

### 7.5 Menu date detection

Menus are rarely dated inside the document, so the date usually comes from the URL. Match the rules
**in this order** on the URL. Before matching, decode the URL, lowercase it and remove accents (`ł`
becomes `l`). The first rule that gives a year from 2010 to current year + 1 wins.

| rule | example | regex idea | result |
|---|---|---|---|
| path | `/uploads/2026/04/` or `/2026/04/15/` | `/(20\d\d)/(0[1-9]\|1[0-2])(?:/(dd))?/` | 2026-04[-15] |
| ymd | `2026-04-15`, `2026_04_15`, `20260415` | `(?<!\d)(20\d\d)[-_.]?(MM)[-_.]?(DD)(?!\d)` | 2026-04-15 |
| dmy | `15.04.2026`, `15-04-2026` | `(?<!\d)(D?D)[-_.](M?M)[-_.](20\d\d)(?!\d)` | 2026-04-15 |
| my | `04.2026`, `4-2026`, `042026` | `(?<![\d.])(M?M)[-_.]?(20\d\d)(?!\d)` | 2026-04 |
| ym | `2026-04`, `2026_4` | `(?<!\d)(20\d\d)[-_.](M?M)(?!\d)` | 2026-04 |
| month-name | `marzec-2025`, `2025_Bierhalle_menu_marzec` | a Polish or English month word anywhere, plus a year anywhere | 2025-03 |
| timestamp | `17423796669662_Nowe ceny.pdf` | `(?<!\d)(1\d{9})(\d{3})?\d*`: 10-digit Unix seconds, optionally followed by ms digits | date of that timestamp |
| year | `Karta-napoje-2025.pdf` | a lone `20\d\d` | 2025 |

Polish month words include both the nominative and genitive forms: styczeń/stycznia, luty/lutego,
marzec/marca, kwiecień/kwietnia, maj/maja, czerwiec/czerwca, lipiec/lipca, sierpień/sierpnia,
wrzesień/września, październik/października, listopad/listopada, grudzień/grudnia. Also include the
English month names.

**Priority of sources:**

1. The final URL after redirects.
2. The original URL.
3. The server's `Last-Modified` header (stored with `from: "server"`).

For files saved by hand, use the **file name** (`from: "file name"`). Record `from` and `matched` so the UI
can show *why* a date was chosen ("dated 2026-04 from link: 2026/04").

---

## 8. UI (three pages in the prototype)

1. **Extractor** (`/`). A drop zone that accepts several files, which form one menu. Options:
   - "Also include soft drinks, juice, coffee & tea": off
   - "Grayscale images": on
   - Image resolution: low / standard / high

   Buttons: **Preview optimization only** (free) and **Extract NA drinks**. The output is a table plus
   JSON with *Copy JSON* and *Download*, the real token usage and cost, and the "What gets sent" previews.
2. **Results browser** (`/results`). Lists every saved extraction. Shows the restaurant, the menu date and
   where that date came from, a link to the original URL and page, the drinks, and the cost. Has search,
   a category filter and CSV download. Shows comparison mismatches next to the drinks.
   - The original menu file can be opened, but **only files that a stored result points to**. This is an
     allowlist; never serve arbitrary paths. In Laravel, serve the files through a controller or signed
     URL from private storage.
3. **Workspace** (`/workspace`). Admin operations:
   1. Menus: list them, upload into the library (never overwrite), add from the web, and "check saved
      pages for new menus". Select all / select undated.
   2. Run on: model, effort, image quality. Actions: Estimate, Submit batch (half price), Check status,
      Collect results, Compare models (with reference model and "reuse earlier run").
   3. Activity: live log, Stop button, a "paid" flag on actions that cost money.

   The prototype ran CLI subprocesses and kept their logs in memory. **Do not copy this.** In Laravel,
   use queued jobs with a `menu_jobs` table (status, progress and log lines). Poll it from the page or
   use broadcasting. Show which API keys are configured, but never show the key values.

---

## 9. Learned: domain pitfalls and edge cases

- **Dual-version cocktails.** THE ROOF prints `ALMOST PURE 45 / *55 PLN`, where `*` means "also available
  in an alcoholic version". The correct NA price is **45 only**. Sonnet returned [45, 55]; Haiku and Opus
  were correct. Add the prompt line from §4.2, and consider flagging drinks that have several prices for
  review.
- **Lemonade in a "Koktajle bezalkoholowe i lemoniady" section** ("Non-alcoholic cocktails and
  lemonades"). With soft drinks off, lemonade is a soft drink and is excluded. Most models excluded it.
  It is a borderline case; do not treat it as a bug.
- **Name transcription matters.** Keep names exactly as printed, in the original language (mostly
  Polish). Do not translate them. Downstream matching and display depend on this.
- **Section headings carry information.** Examples: "PIWO BEZALKOHOLOWE 0,33 l" (non-alcoholic beer)
  gives the size, and "MOKTAJLE 0%" (mocktails 0%) marks items as NA. Store `menu_section`.
- **Menus are bilingual** (PL/EN on the same page), and decimals use a comma (`11,5%`). Store `abv` as the
  printed string, not as a number.
- **Prices** are numbers without the currency. The currency is stored once per menu, and is almost
  always PLN here. Each size is a separate price entry.
- **Many menus have no NA drinks or only 1–2.** An empty `drinks` list is a valid, successful result.
- **Long scrolling WordPress images** (`-scaled.jpg`, `-1166x1654.webp`) are common. Tiling (§3.2) is
  what makes them readable.
- **Scanned PDFs exist.** "Placemat" PDFs (podkładka) and phone-scanned menus have no text layer, so the
  per-page text check (≥80 characters) matters.
- **Running headers and footers** repeat on every PDF page. The line deduplication removes them.

### Scoring and comparing results

This applies if you ever build QA or evaluation of results. Match drinks by **normalized name**:

1. Lowercase the name and replace `ł` with `l`.
2. Remove accents (NFKD).
3. Remove serving sizes such as `0,5l`, `125 ml` and `cl`.
4. Keep only `[a-z0-9%]`.

Then compute similarity with a SequenceMatcher-style ratio, such as PHP's `similar_text` percentage.
Score **0.85** when the tokens of one name are a subset of the other ("Bla" vs "Bla, Copenhagen Sparkling
Tea Company"). The match threshold is **0.8**. Pair the drinks one-to-one, best scores first. A price
matches when the sorted amount lists are equal.

The score is only rough. The reference model can also be wrong, so check the mismatches against the menu.

---

## 10. Suggested Laravel design (adapt it to the existing app's conventions)

**Tables (suggested):**

- `menu_sources`: one row per stored file. Columns: `disk_path`, `original_name`, `sha256` (unique),
  `bytes`, `content_type`, `url`, `final_url`, `page_url`, `link_text`, `fetched_at`, `last_checked_at`,
  `http_last_modified`, `menu_date`, `menu_date_precision` (year/month/day), `date_from`, `date_matched`,
  `date_rule`, and optionally `restaurant_id` if the app already has restaurants.
- `menu_extractions`: `menu_source_id` (or a pivot table, because several files can form one menu),
  `status` (pending/optimizing/sent/succeeded/failed/invalid), `mode` (live/batch), `model`, `effort`,
  `resolution`, `grayscale`, `include_soft_drinks`, `restaurant_name`, `currency`, `language`, `notes`,
  `raw_result` (JSON), `input_tokens`, `output_tokens`, `cost_usd`, `seconds`, `error`, `batch_id`,
  `custom_id`.
- `menu_drinks`: normalized from the result. Columns: `extraction_id`, `name`, `category`, `brand`,
  `description`, `abv`, `menu_section`, `prices` (JSON, or a child table `menu_drink_prices` with `amount`
  and `size`).
- `menu_batches`: `batch_id`, `status`, `model`, `effort`, `resolution`, `include_soft_drinks`,
  `request_count`, `submitted_at`, `ended_at`.
- `menu_fetch_pages` (optional): page URLs to re-scan on refresh.

**Services and jobs:**

- `MenuOptimizer` (Imagick + poppler): returns a DTO with parts (kind, source label, text or base64,
  w, h, est_tokens), `original_bytes`, `original_est_tokens` and `est_tokens`. Run it inside a queued job,
  because it is CPU-heavy.
- `MenuExtractor`: builds the params, calls the Anthropic API, parses and validates the response, and
  computes the cost.
- `ExtractMenuJob`: the live path. The UI polls for the result, or the call runs synchronously for small
  single uploads.
- `SubmitMenuBatchJob`, `PollMenuBatchesCommand` (scheduled every few minutes) and
  `CollectMenuBatchJob`.
- `MenuFetcher`: robots.txt, per-host throttle, link discovery, dedup and date detection.
  `RefreshMenuSourcesCommand` can run on a schedule, for example weekly.
- Store the files on a **private** disk. Serve them only through an authorized controller.

**Server dependencies:** ImageMagick with HEIC/AVIF/WebP support (php-imagick), poppler-utils
(`pdftotext`, `pdftoppm`), and Ghostscript if Imagick rasterizes the PDFs.

---

## 11. What NOT to port

- The **subprocess job runner** and in-memory job logs (`jobs.py`). Use Laravel queues instead.
- The **file-system "database"**: results in `results/<model>/<menu>.json`, CSV summaries, a `LATEST` file
  for batch ids, and `src/.sources.json`. Use DB tables instead.
- The **key file** `~/.config/menu-na/keys.env`. Use `.env` / config.
- The **OpenAI and Gemini adapters**, and probably the whole multi-provider **compare** tool. If you keep
  an evaluation feature, a Claude-only version (Haiku vs Sonnet vs Opus) is enough.
- The CLI argument parsing. Artisan commands can replace it if a CLI is useful.

---

## 12. Open items left in the prototype

- One Haiku batch (`msgbatch_01HZme6TtzTKBG4QmjFQ6Y2T`, 9 Nov 2026, all 17 menus) was submitted but never
  collected. Its results can still be collected in the prototype (`python -m menu_na.batch collect`). The
  Laravel app does not need them.
- Four fetched menus were never part of the model comparison: Menu-Obrzezna-2026, Menu-Spaccanapoli-202506,
  Pod-Menu-New-V5 and menu-pl. The 67/67 result covers the other 13 menus.
- The prompt improvement for dual-version prices (§4.2, §9) was found but **not yet applied** in the
  prototype.
- Haiku refusals are not retried automatically. Laravel should retry once on `claude-sonnet-5-5`.
- The comparison score matches only on names. A model that spells a name differently counts as a miss.
