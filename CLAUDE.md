# The UNI workspace

**This repository is the thinking, not the application.** The journals, decision records,
roadmap documents, product rules and compliance material live here; the Laravel application is a
separate private repository, `undernoinfluence`, whose working directory is this folder's parent.
Its own `CLAUDE.md` governs work on the code.

**Prose here is never hard-wrapped: one paragraph is one line.** The editor soft-wraps.

**No commit ids.** A journal, a roadmap document or a decision record identifies a change by its
date and a description of what it did — see the journals-cite-dates-not-commit-ids record. A
branch or tag name may still be cited; those survive a squash.

**The schema map is not here.** `database/schema.md` lives in the application repository, beside
the migrations that change it, because the rule binding the two together has to hold inside one
commit.

## Mission

UNI exists to **promote the healthy choice** — not products, brands, producers or venues, which
are instruments. Harm reduction, not abstinence: two non-alcoholic drinks alongside two
alcoholic ones instead of four alcoholic ones is a success. The mission does not derive from
the current product; the product derives from the mission.

Test every product decision against *"does this help somebody find a healthier option they
would otherwise have missed?"* A feature that helps a brand more than a person is not a UNI
feature. See the mission-is-the-healthy-choice record before anything touching
brands, producers, or paid placement.

**UNI takes no public position on alcohol policy** — not that restriction works, not that it has
failed. The subject is what a person can order tonight, and that is the only thing UNI speaks
about publicly.

## Roadmap Decision Documents

`roadmap/decisions-waiting-on-you-vN.md` is a working document, not a reply. When the
founder returns one with inline answers, the next version must contain **all four** of:

1. **Findings raised unprompted** — what was found that he did not ask about, ranked by
   consequence, in their own section
2. **A forward plan** — the next sessions in order, with what gates what
3. **Open questions collected in one table**, each with a recommendation
4. **Answers to his notes**, with enough context to read without the previous version open

Read the whole document, not just `git diff` — working from the diff produces #4 alone. If a
structural section from the previous version disappears, that is a regression. "Respond without
coding" restricts the medium, never the ambition.

## Project Journals

At the end of every session — before the conversation closes — write or update the journal
entry for today's date in `journals/YYYY-MM-DD.md`.

**Rules:**
- If the file already exists for today, append a `## Session 2` (or `## Session N`) block — never overwrite.
- If it does not exist, create it from scratch.
- Use the section format defined in `journals/README.md`. Include only sections that are relevant to what happened in the session — skip empty sections.
- Always include: **What Was Built**, **Decision Register** (even if just one decision), **Technical Debt Log** (add new items or mark existing ones resolved), **Data Model State** (only if the schema changed), **Next Session Backlog**.
- Always update the **Canary Register** in `journals/README.md` if new canary venues were added.
- Write in the same voice as the existing journals — founder-facing, not developer-facing. Explain the *why* and *business impact*, not just the *what*.
- Today's date is always available in the system context as `currentDate`.
