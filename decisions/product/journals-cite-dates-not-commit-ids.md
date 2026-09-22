# Journals cite a date and a description, never a commit id

**Date:** 2026-09-21
**Status:** Decided
**Executed:** yes — 2026-09-22, step A5 of session A. All 76 real ids were removed from 37 files: five whole table columns dropped, two of those tables becoming lists, and the rest rewritten in prose. The rule applies from 21.09
**Area:** Documentation | Process

---

## Problem

Seventy-six commit ids cited across the documentation resolve to real commits in the current history, spread over thirty-four files, and twenty-three of them were written in the three working days to 19.09 — roughly seven per session that ships code. Every one of them dies the moment the repository is squashed into a single initial commit, which is a decision already taken.

Paweł, 21.09: *"aren't the docs and journals supposed to be for humans, while raw IDs of commits aren't 'human' friendly? Maybe useful for docs, but don't commit descriptions serve that purpose?"*

That is the whole of it. A raw id is useful only to a machine that still has the object, and after the squash no machine does. To a person reading the journal the useful part was never the id — it was the sentence beside it. The journals already prove this: forty-eight of the one hundred and forty-six backticked ids sit in the first cell of a table row whose second cell is the description, so the id is decoration next to the fact.

## Options considered

Keep citing ids and accept that they die. Keep citing them and rewrite all seventy-six before the squash, as version 1.0 of the migration plan proposed. Stop citing them now and sweep what exists once.

## Decision

**A journal, a roadmap document or a decision record identifies a change by its date and a description of what it did. It does not cite a commit id.** A table of the session's commits becomes a table of the session's changes, with the same descriptions and no first column.

**The existing seventy-six are swept in the cleanup session, before either squash.** Where the description already stands beside the id, the id is deleted and nothing is written. Where the id stands alone in prose, a date and a description replace it. This is the one step of the migration that cannot be redone afterwards.

## Rules

- No new commit id enters `docs/` from 21.09.2026.
- A branch name, a tag or a release name may still be cited: those survive a squash and a person can act on them.
- **The credential-origin trap: the fact must survive the deletion.** The ids go with all the others, but the sentence they sat in says the database password entered `phpunit.xml` on **29 April** — and `docs/journals/2026-08-31.md` T-30e "corrects" that to 5 April, which is wrong. Both dates are real and they describe different files: 5 April is when the value first entered history through `.env.example`; 29 April is when `phpunit.xml` got it. Deleting the ids without fixing the 31.08 line would leave the wrong correction standing with nothing left to disprove it. **Verified against the history on 22.09.2026 before the ids were removed, and a third error found with it: the value never sat in `DB_URL`, only ever in `DB_PASSWORD`.**

## What this prevents

Prevents the irreversible step of the repository migration growing by about seven citations every session it is delayed, and prevents a documentation tree full of references that look precise and resolve to nothing. A date and a description read the same before and after the squash.

## Revisit when

Never for journals. If a future decision record ever needs to point at an exact state of the code, it names a tag.

---

*See also: [[tech/repository-migration]] · [[decisions/product/secrets-never-in-tracked-files]] · [[decisions/adr/ADR-010-migration-squash]]*
