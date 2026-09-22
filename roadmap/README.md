# Feature Roadmap

Versioned implementation plans for UNI. Each version document describes:
- **What to build** — features with enough detail to start implementation
- **Priming work** — things to build NOW that save significant effort in the next version
- **Dependencies** — what must exist before a feature can be built
- **Revisit triggers** — conditions that would pull a feature forward or push it back

## Versions

| Version | Theme | Target | Status |
|---|---|---|---|
| [V1](v1.md) | Data Authority MVP | June 2026 | In progress |
| [V2](v2.md) | Engagement & Trust Loop | Post-launch, data-driven | Planning |
| [V3](v3.md) | Expansion & Monetization | When V2 metrics prove the model | Aspirational |

## Before launch

[pre-launch-checklist.md](pre-launch-checklist.md) — rzeczy, które taniej zmienić przed startem niż po nim (nazwy parametrów URL, wygasanie odznak, ładowanie fontów). Nie backlog funkcji — lista, w której koszt zmiany rośnie w dniu premiery.

## How to read these docs

Each feature has a status:
- `DONE` — shipped and tested
- `IN PROGRESS` — actively being worked on
- `TODO` — decided, not started
- `BLOCKED` — waiting on a dependency or decision
- `PRIMING` — V1 work that exists solely to prepare for a later version

## The commute documents

**Every file here is named for the day it was written, not the day it was meant to be read.** Several documents a day are `_2`, `_3` and so on, in the order they were written. Settled on 21.09.2026 (D13) and applied to the whole folder on 22.09.2026 — before that, a document was named for the morning it would be read on, which works until the calendar catches up and two documents want the same filename.

Each renamed file carries a `renamed:` line in its frontmatter saying what it used to be called, so an old link or an old journal sentence can still be traced.

| File | Version | Written | Was called | For the commute of |
|---|---|---|---|---|
| `commute-2026-09-09.md` | v1.0 | 09.09 | `commute-2026-09-10.md` | 10.09 |
| `commute-2026-09-10.md` | v1.1 | 10.09 | `commute-2026-09-11.md` | 11.09 |
| `commute-2026-09-12.md` | v1.8 | 12.09, revised 13.09 | `commute-2026-09-14.md` | 14.09 |
| `commute-2026-09-14.md` | v2.0 | 14.09, evening | `commute-2026-09-15.md` | 15.09 |
| `commute-2026-09-16.md` | v3.0 | 16.09 | — | 16.09 |
| `commute-2026-09-16_2.md` | v4.0 | 16.09 | `commute-2026-09-17.md` | 17.09 |
| `commute-2026-09-16_3.md` | v5.0 | 16.09 | `commute-2026-09-18.md` | 18.09 |
| `commute-2026-09-16_4.md` | v6.0 | 16.09, 17:12 | `commute-2026-09-19.md` | 19.09 |
| `commute-2026-09-16_5.md` | v7.0 | 16.09, 19:36 | `commute-2026-09-20.md` | 20.09 |
| `commute-2026-09-16_6.md` | v8.0 | 16.09, 21:16 | `commute-2026-09-21.md`, then `_2` | 21.09 |
| `commute-2026-09-16_7.md` | v9.0 | 16.09, 21:36 | `commute-2026-09-22.md`, then `_3` | 22.09 |
| `commute-2026-09-20.md` | v10.0 | 20.09 | `commute-2026-09-20_2.md` | 21.09 |
| `commute-2026-09-21.md` | v11.0 | 21.09 | — | 22.09 |

**Seven of the thirteen were written on 16.09** — one per session of that day, each answering the one before it. That is why the `_2` … `_7` run exists and why the old names spread across six different days in the filename.

**The version number, the write date and the filename now all sort the same way.** The last file in the folder is the newest thinking, which is the only property this convention has to have.

## Relationship to other docs

- `../decisions/v1-locked.md` — architectural decisions that constrain V1. The roadmap says *what* to build; the decision doc says *how* certain things were decided.
- `../journals/` — session-by-session build log. The roadmap is the plan; journals are the execution record.
- `../product/scoring.md` — partially superseded by `../decisions/v1-locked.md`. Aspirational scoring spec, some parts deferred to V2.
