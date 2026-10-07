---
description: "What roadmap/ holds: the version plans and the backlog, and how to read their statuses."
---

# Feature Roadmap

Versioned implementation plans for UNI. Each version document describes:
- **What to build** — features with enough detail to start implementation
- **Priming work** — things to build NOW that save significant effort in the next version
- **Dependencies** — what must exist before a feature can be built
- **Revisit triggers** — conditions that would pull a feature forward or push it back

## Versions

| Version | Theme | Target | Status |
|---|---|---|---|
| [V1](v1.md) | Data Authority MVP | June 2026 missed; launch as soon as it is stable (07.10) | In progress |
| [V2](v2.md) | Engagement & Trust Loop | Post-launch, data-driven | Planning |
| [V3](v3.md) | Expansion & Monetization | When V2 metrics prove the model | Aspirational |

## The backlog

[undone-inventory.md](undone-inventory.md) is the one list of what is not done. Its first section sorts every open item into **Launch**, **After launch**, **V2** and **V3**, and names where each item's discussion lives. Journals point to it rather than copying it.

## Before launch

[pre-launch-checklist.md](pre-launch-checklist.md) — things that are cheaper to change before launch than after (URL parameter names, badge expiry, font loading). Not a feature backlog: a list of things whose cost of change spikes on launch day.

## What moved out on 07.10.2026

This folder used to hold everything forward-looking. The deploy documents are now in `ops/`, the commute and decision documents in `briefings/`, the research prompts and results in `research/`, and the 01.10 idea note in `inbox/`.

## How to read these docs

Each feature has a status:
- `DONE` — shipped and tested
- `IN PROGRESS` — actively being worked on
- `TODO` — decided, not started
- `BLOCKED` — waiting on a dependency or decision
- `PRIMING` — V1 work that exists solely to prepare for a later version

## Relationship to other docs

- `../decisions/v1-locked.md` — architectural decisions that constrain V1. The roadmap says *what* to build; the decision doc says *how* certain things were decided.
- `../journals/` — session-by-session build log. The roadmap is the plan; journals are the execution record.
- `../product/scoring.md` — partially superseded by `../decisions/v1-locked.md`. Aspirational scoring spec, some parts deferred to V2.
