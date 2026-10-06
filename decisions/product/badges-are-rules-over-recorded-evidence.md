# Badges are rules over recorded evidence, not switches someone keeps setting

**Date:** 2026-10-06
**Status:** Decided — the direction, and the first step (the evidence model). The shape of the evidence model (questions E1–E3) and the badge rules themselves are Open
**Executed:** no — nothing built
**Area:** Data Model | Venues | UI/UX

---

## Problem

Mapping every panel flow on 06.10 showed that an owner's word looks the same as a fact read from the venue's menu. "Sprawdzona karta" is one switch per venue that covers rows added after the check. `confirmed_at` is one date with no source, so an owner's click and an at-source check write the same thing. House drinks don't record who added them. And drink pages sort venues by that date, so an owner pressing "Nadal w ofercie" every day stays on top. The first fixes proposed all kept a person in the loop: an admin queue, an admin re-check, a badge an admin renews. But the final UNI system is meant to run by itself; the founder's manual checking exists only because V1 is small and has no owners or users.

## Options considered

Keep "Sprawdzona karta" as an admin switch and mark owner rows next to it. Queue owner additions for admin approval. Let an owner's edit cancel the badge. Record, for every fact, what kind of evidence backs it, the date it describes and where it came from, and compute every badge and ordering from that evidence.

## Decision

**Every badge and every ordering on a public page is a rule the app computes from evidence it has recorded. No badge depends on an admin keeping it true.** The founder's V1 check is simply the first kind of evidence, read from the menu at the source, with nothing special about it. The founder said: *"The final system is supposed to automatic and autonomous… some badges need admin governance. It does not."* The first step is the evidence model alone, with no visible change. The badge and ordering rules are the next decision, made over that data.

## Rules

Evidence is recorded per fact (a catalogue product or a house drink at a venue), never only per venue. Every piece of evidence records its kind, the date it describes and its source where one exists. The kind says how something was known, never who typed it, following the offer-logs-record-knowledge-not-authorship record; "admin" is not a kind. The proposed kinds are read from the venue's own menu, the owner's statement, a visitor's signal and the venue's till system. A visitor's signal counts as evidence only after it has been reviewed, because community contributions stay founder-reviewed (see uni-grows-through-a-community-whose-contributions-are-reviewed). Every confirmation is recorded, not just additions and removals, and a new confirmation never erases the record of an earlier one. A fact with no recorded source is stored as unknown, never assumed to have been checked. Every path that changes or confirms what a venue serves records its evidence through one shared step, as the catalogue-links-change-through-one-path record already requires for the menu follow-up. Badge wording promises only what a rule can guarantee: a public sentence saying "somebody from UNI looked at this by hand" belongs to V1 and is rewritten when the rules are.

## What this prevents

A badge that is true only while one person keeps checking, and quietly false at 200 venues. A ranking lever the most persistent owner can pull for free, which the what-the-badges-claim record rules out ("cannot be bought") and no human would be watching. And a rebuild later: recording only the latest date, or only who typed it, would have to be redone the day visitors' signals or a till integration arrive.

## Revisit when

The badge rules are decided (the next problem). The evidence kinds need extending, for example a new source of menu data. Or community moderation becomes automated, perhaps by AI, which would change when a visitor's signal counts as evidence.

---

*See also: [[decisions/product/what-the-badges-claim]] · [[decisions/product/offer-logs-record-knowledge-not-authorship]] · [[decisions/product/catalogue-links-change-through-one-path]] · [[decisions/product/uni-grows-through-a-community-whose-contributions-are-reviewed]] · [[decisions/product/mission-is-the-healthy-choice]] · [[tech/change-flows]]*
