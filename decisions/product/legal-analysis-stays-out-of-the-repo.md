# Alcohol-law analysis stays out of the repository

**Date:** 2026-09-07
**Status:** Decided
**Executed:** 2026-09-07
**Area:** Brand | Strategy

---

## Problem

Three research rounds into Polish alcohol-advertising law produced roughly 50 KB of prose spread across a reference document, a position document, the statute itself, two decision records, half of two roadmap documents, three journals, `CLAUDE.md` and the assistant's session memory. It became the best-documented subject in the project, and a document of that weight does not sit quietly — it tilts every conversation toward itself. Asked twice what the next step was, the answer came back as a legal briefing rather than a plan of work.

## Options considered

Keep everything and rely on discipline not to lead with it. Remove only the alcohol-law material and keep the GDPR and ePrivacy sources. Remove every legal document in the project, GDPR included. Move the material to a folder outside the repository so the research is preserved but out of context. Rewrite branch history so the files are gone from the repository entirely.

## Decision

**Every document analysing Polish alcohol-advertising law is removed from the repository, from the assistant's context, and from session memory.** The GDPR and ePrivacy material stays — it is a different subject and the privacy policy still depends on it. Removal is by deletion from the working tree rather than a history rewrite, because a fresh repository started from these files carries no branch history anyway.

## Rules

No file in the project analyses alcohol-advertising law, cites its provisions, or reasons from them, and none is to be recreated without the founder saying so explicitly. Product rules that arose from that analysis survive only where they stand on their own footing — the 0,5% catalogue boundary is what *non-alcoholic* means, and producers stay internal for commercial and reader-value reasons — and those records carry no statutory citation. If a legal question arises in conversation, answer the product question and say plainly that the legal analysis is out of scope; do not write it into a file. Two items were left in place deliberately: the founder's own note in `decisions-waiting-on-you-v7.md` raising the original question, and the Warsaw permit-register link in v5, which is a cataloguing tool.

## What this prevents

A project whose documentation points at a risk nobody has ever been prosecuted for, at the expense of the catalogue and the venues that are the actual work. It also prevents the quieter failure: a body of analysis large enough that every future session reads it first and answers through it, which is what happened across three consecutive sessions.

## Revisit when

The founder asks for legal work again — that is his call to reopen, and it does not return to the repository without it.

---

*See also: [[decisions/product/catalogue-lists-every-category]], [[decisions/product/catalogue-excludes-actual-alcohol]], [[decisions/product/mission-is-the-healthy-choice]]*
