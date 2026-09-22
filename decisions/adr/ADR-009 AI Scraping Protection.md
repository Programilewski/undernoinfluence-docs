# ADR-009: AI Scraping Protection

**Status:** Decided and implemented (Session 2, 2026-04-07)
**Executed:** 2026-04-07
**Decision:** Four-layer protection system against bulk data extraction and AI training crawlers.

## Context

UNI's NoLo venue and product data is rare, labor-intensive to collect, and its value depends entirely on exclusivity. If a competitor can bulk-export the database in an afternoon, the competitive moat disappears. If an AI training crawler ingests the structured product data and redistributes it, UNI loses the "data authority" that is its core value proposition.

Standard `robots.txt` alone is insufficient — it's a polite convention, not a technical barrier. A serious scraper ignores it. Multiple layers with different failure modes are needed.

## Decision

Implement four complementary layers, each targeting a different scraper profile:

### Layer 1: robots.txt — Named Crawlers
Block 11 named AI crawlers by user agent string. Googlebot is explicitly allowed (SEO). Google-Extended (AI training) is explicitly blocked.

Targets: naive automated scrapers that respect robots.txt. Does not stop headless browsers or crawlers that spoof user agents.

### Layer 2: X-Robots-Tag HTTP Header
Every response includes `X-Robots-Tag: noai, noimageai` via middleware. Reinforces robots.txt for crawlers that read headers instead of or in addition to robots files.

Targets: crawlers that read response headers rather than requesting robots.txt separately.

### Layer 3: Coordinate Fuzzing
Venue coordinates are fuzzed ±0.0005° latitude / ±0.0007° longitude (~55m radius) in the controller before being sent to the client. The precise coordinates remain in the database. Navigation uses the address string (not coordinates), so users are unaffected.

Targets: scrapers that bulk-collect lat/lng to build a competing geospatial dataset. Map rendering still works (55m is invisible at normal zoom). Precise bulk export becomes useless.

**Important:** Fuzzing is applied in the controller, not stored in the database. This is intentional — authenticated owner API can receive precise coordinates if needed in future.

### Layer 4: Honeypot Endpoint
`GET /export/venues.json` exists as a route but returns HTTP 404 and fires a `bot.honeypot.triggered` analytics event. No legitimate user would request this URL. Any hit is a scraper signal.

Targets: scrapers that probe for common bulk export paths. Provides detection rather than prevention — if the honeypot fires, investigation begins.

## Options Considered

**Option A: robots.txt only** — Rejected. Too easy to ignore. Zero technical barrier.

**Option B: Rate limiting only** — Rejected. Sophisticated scrapers stay under rate limits. Also penalises legitimate users during traffic spikes.

**Option C: Authentication wall on all venue data** — Rejected. Would destroy SEO. All public venue data must be indexable by Googlebot.

**Option D: Four-layer approach** — Chosen. Each layer has different characteristics and failure modes. A scraper that defeats one layer likely won't defeat all four. Low ongoing maintenance cost. No user impact.

## Rationale

The layers are complementary, not redundant:
- Layer 1 stops the lazy scrapers
- Layer 2 catches crawlers that skip robots.txt
- Layer 3 degrades the value of bulk extraction even if it succeeds
- Layer 4 provides early detection of targeted scraping attempts

Coordinate fuzzing in particular is asymmetric — trivial to implement, significantly raises the cost of building a competing geolocation dataset from UNI's data.

## Canary System (Related)

Fictional venues are seeded in the database alongside real venues. If these names appear in any competitor product, dataset, or AI-generated content, it constitutes proof of data extraction. This is a detection mechanism, not a prevention mechanism.

Details are maintained in `journals/README.md` under the Canary Register. **The canary names must not be documented in this vault** — if this file is ever shared or indexed, the canaries must remain obscure.

## Consequences

- Navigation links use address strings, not coordinates — this is correct behavior regardless of fuzzing
- Honeypot events should be monitored; a spike indicates a scraping campaign in progress
- The four layers do not stop a determined headless Chrome scraper that renders pages and extracts DOM content — this is accepted risk for V1. Rate limiting and session fingerprinting are the next line of defense if headless scraping becomes a problem.
- `robots.txt` must be updated whenever a new named AI crawler appears in the landscape
