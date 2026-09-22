# Project Journals — Under No Influence

This directory is your project control centre. Each file covers one working session.
The format is designed to give you full situational awareness — technical, strategic,
and operational — without needing to read code.

---

## Who This Is For

**You, as the founder.** You don't need to understand every line of code. You need to
understand *what was decided*, *why*, *what it costs if we're wrong*, and *what to do next*.
These journals are written with that in mind.

---

## File Naming

```
YYYY-MM-DD.md
```

One file per session. If a day has multiple sessions, append `_2`, `_3`.

---

## Journal Sections

Each journal contains some or all of these sections, depending on what happened:

| Section | What it answers |
|---|---|
| **Session Overview** | What was the goal? What was the outcome? |
| **What Was Built** | Every change, with why and where |
| **Decision Register** | Forks in the road — what was chosen and what was rejected, and why |
| **Technical Debt Log** | Corners cut, shortcuts taken, things to fix later |
| **Data Model State** | Current database schema snapshot |
| **Analytics Events Catalog** | Every event being tracked and what business question it answers |
| **Canary Register** | Fictional venues used to detect scraping — DO NOT DELETE THESE |
| **Risk Register** | Things that could go wrong and their mitigations |
| **Open Questions** | Unresolved decisions needing input |
| **What to Test in the Browser** | Non-technical checklist to verify the session's work |
| **Business Impact** | How each change connects to acquisition, retention, or monetization |
| **Quick Commands** | Artisan/npm commands relevant to this session |
| **Learning Path** | Concepts and resources to understand the technical decisions made |
| **Next Session Backlog** | Prioritised suggestions for the next working session |

---

## Canary Register (Global)

Canary venues are **fictional places that do not exist**. They are seeded into the
database to detect scraping. If these names appear in any competitor's product,
dataset, or AI-generated content, it constitutes proof of scraping.

**Never delete or rename these venues. Never publicise their names.**

| Slug | Name | City | Seeded |
|---|---|---|---|
| `bezalkohol-spolka-uni-canary-1` | Bezalkohol & Spółka | Warszawa | 2026-04-07 |
| `nolo-krakowska-pijalnia-uni-canary-2` | NoLo Krakowska Pijalnia | Kraków | 2026-04-07 |

**Corrected 2026-09-16 — what these two actually are.** Every public route excludes `is_canary`: the venue page 404s, the sitemap and discovery use the `active()` scope, the analytics endpoint refuses them. So a crawler reading every page UNI publishes will never encounter either name. **They are a database-leak tripwire — proof somebody had the database — not a scraping detector.** The older description claimed a capability the code prevents.

### Honeypot bait — not canaries, and also never to be publicised

Eight invented venues live in `App\Support\HoneypotVenues` and are served **only** at `/export/venues.json`, a path nothing links to and `robots.txt` disallows. They never enter the database, so no visitor can reach them, no owner sees a product they do not stock, and no ranking score is touched — which is why they may exist at all. Warszawa ×3, Kraków ×2, Gdańsk ×2, Poznań ×1, live from **2026-09-16**.

**Do not delete them and do not publicise the names.** If any appears in somebody else's product, dataset or model output, it came from that endpoint and from nowhere else. See [`../decisions/product/nothing-false-is-published-to-a-visitor.md`](../decisions/product/nothing-false-is-published-to-a-visitor.md).

---

## How to Use These Journals

- **Before a session:** read the last journal's *Next Session Backlog* and *Open Questions*
- **After a session:** the AI assistant writes the journal entry; you review it
- **When something breaks:** check the *Risk Register* and *Technical Debt Log* from recent sessions
- **When pitching:** the *Business Impact* sections give you plain-language talking points
- **When onboarding a developer:** give them the full journals directory — it's a complete project history
