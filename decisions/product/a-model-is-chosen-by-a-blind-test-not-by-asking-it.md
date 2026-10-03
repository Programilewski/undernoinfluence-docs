# A model is chosen for a UNI job by a blind test, not by asking it

**Date:** 2026-10-03
**Status:** Decided — the method. Which model does which job is Open until a clean run
**Area:** Data Model | Brand

---

## Problem

UNI's research, copy, code and catalogue are increasingly produced by more than one LLM, and each is better at some jobs than others. Asking a model how good it is tells you nothing, because every model says "very good". The failures that cost UNI most are invisible in a fluent answer: an invented citation, a false premise accepted, a promise of a feature that doesn't exist, an "unknown" alcohol content quietly raised to verified.

## Options considered

Ask each model to rate itself on the aspects. Go by public benchmarks and reputation. Run the same real UNI tasks, with traps planted in them, against every model and grade the answers blind against a key.

## Decision

Models are compared on a battery of real UNI tasks across five aspects — research integrity, mission judgement, Polish, engineering in this stack, and menu extraction — each with traps whose right answer is written down in advance. Answers are graded with the model names removed, and the result is a table naming the best model per aspect, dated, because models change under the same name. The first run on 03.10 showed why the key must never travel with the tasks: both candidates were given Part B and copied it, so that run ranks nothing.

## Rules

The battery lives in the research-prompts folder as llm-fitness-for-uni. The tasks and the grading key are kept in separate files, and only the tasks are ever pasted into a candidate. Each aspect runs in a fresh chat per model, with the same settings, and the run records the model version, the date and whether web search was on; research integrity runs twice, with search on and off. The founder grades Polish and menu extraction himself, since he is the ground truth for both; the other three may be graded by a model holding the key and spot-checked. An invented citation, an accepted false premise on public copy, or an alcohol content raised from product knowledge caps that aspect regardless of everything else. Research integrity and menu extraction are re-run whenever a model's version changes. Where a contaminated run still shows something the key didn't contain — real sources, an extra defect found, a sound design question — that is noted, but it decides nothing.

## What this prevents

Choosing the model that sounds most confident for the job where confidence is the danger: research that cites papers nobody read, and catalogue entries that publish a guess as a verified 0.0%. Self-ratings and benchmarks would have hidden both; a run where the answers leaked would have rewarded copying.

## Revisit when

After the first clean run, if one model wins every aspect and the battery stops discriminating — then the traps are too easy and need replacing. Or when a job appears that none of the five aspects covers, such as reading menu photographs.

See also: fixtures-are-not-evidence, abv-trust-model, research-files-out-of-the-repo.
