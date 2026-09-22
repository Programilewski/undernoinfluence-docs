---
version: 1.2
owner: Paweł Milewski
updated: 2026-08-18
status: approved
---

# UNI Documentation

Everything non-code lives here. One folder, one home per topic.

Open `docs/` as an Obsidian vault — not the repo root — to browse it with working `[[wikilinks]]`. Setup and Syncthing topology: `tech/obsidian-sync.md`.

**Just came back to this?** [[new-notes]] is a dated reading guide to everything written between 25 and 27 August — ten new documents and eleven rewritten ones, in reading order.

## Where things live

| Folder | Question it answers | Contents |
|---|---|---|
| `product/` | **What is the product?** | `spec.html` (the SSOT), `features/`, `rules/`, `scoring.md` |
| `decisions/` | **Why is it like this?** | `README.md` (index), `v1-locked.md`, `adr/`, `product/` |
| `roadmap/` | **What's next?** | `undone-inventory.md` (what is not done), `deploy-checklist.md`, `v1.md`, `v2.md`, `v3.md` |
| `journals/` | **What happened?** | One entry per session + the Canary Register |
| `business/` | **How does it make money?** | BRD, model, pricing, metrics, competitors, growth, user stories |
| `brand/` | **How does it speak and look?** | Brand book, brand overview |
| `compliance/` | **What are we legally on the hook for?** | Audits, ROPA, data map, privacy notice, DPA/DPIA, breach runbook |
| `tech/` | **How is it built?** | Architecture, stack, dependencies, analytics, security, vault sync |
| `learning/` | **How does the code actually work?** | Guided walkthroughs 00–07 + interactive views |
| `archive/` | **Superseded** | Dated one-offs and old spec versions, kept for history |
| `Phone notes/` | **Raw capture** | Notes taken on the phone, unprocessed. Not a source of truth — decisions move out of here into `decisions/`. |

## State of these docs — 2026-08-18

A full audit ran on 2026-08-18: every claim in the planning and product docs was checked against
running code and the database, not against other documents. What it found, and what to trust:

| Folder | State after the audit |
|---|---|
| `roadmap/` | **Current.** `next-session.md` was rewritten from scratch (the previous version was from 5 May and listed four already-finished tasks plus one that contradicts a locked decision). `v1.md` status tables corrected. |
| `product/features/` | **Status lines current, specs aspirational.** Every `**Status:**` line was rewritten 18.08 — all fourteen were wrong, several claiming "not started" for features live for months. The prose under each status line is still the original spec: read it as the design target, not as a description of the code. |
| `decisions/` | **Current and complete.** Index covers every record. |
| `tech/` | `stack.md` and `dependencies.md` corrected 18.08 — they named five packages that were never installed, plus PostGIS and Redis, none of which exist here. `architecture.md` is an empty template stub, marked as such. |
| `compliance/` | **Mixed.** `audits/` and `compliance.md` are substantive; `privacy-notice.md`, `ropa.md` and `data-map.md` are unfilled stubs. See the warning at the top of `compliance/README.md`. |
| `product/spec.html` | **Last updated 8 July.** Still broadly accurate, with a known-drift banner at the top listing what changed after that date. |
| `business/`, `brand/` | Not re-audited on 18.08. `brand/` is known to have drifted from the app. |
| `learning/` | Accurate — checked, one line corrected. |

**The rule this audit produced:** a planning document older than two weeks is a hypothesis, not a
source of truth. Check it against the code before acting on it.

## The sorting rule

Sort by **lifecycle, not topic** — decided in `decisions/product/ssot-docs-journals-boundaries.md`:

- Describes the **current or target state** of the product → `product/`
- Records **why** a fork in the road went one way → `decisions/`
- Is **dated session history** (what shipped today, bugs found, todos) → `journals/`
- Is a **canonical reference or audit** → its topic folder, and `product/spec.html` links out to it
- Is **third-party** and we did not write it → `~/uni-reference/` on the laptop, outside git and Syncthing. Record the departure in [[tech/reference-material]]
- Is **superseded but worth keeping** → `archive/`

When a topic folder is staler than the SSOT, move the fresh content out of the SSOT rather than linking to a stale file. When a section leaves the SSOT, leave a pointer stub that keeps its anchor id so sidebar links still resolve.

## Conventions

- Markdown everywhere. PDF and DOCX only as released snapshots for audit, review, or signing.
- Vault notes keep their `Title Case.md` filenames — renaming them breaks `[[wikilinks]]`.
- Mark unknowns as `TODO` or `TBD`.
- Link between documents instead of duplicating a decision in two places.
- Update `version`, `updated`, and `status` when a document changes meaningfully.

## Status legend

`draft` — incomplete working document · `review` — ready for founder, legal, or technical review · `approved` — current source of truth · `archived` — kept for history only.
