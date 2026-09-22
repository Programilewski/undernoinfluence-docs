# An Event Name States the Surface and the Action, in That Order, in the Past Tense

**Date:** 2026-09-09
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** Analytics

---

## Problem

Thirty-six event names had grown three coexisting conventions, and two of them were simply swapped: a click on a map pin was reported as `venue_card_clicked` and a click on a list card as `venue_pin_focused`. A third name, `venue_navigate_clicked`, was read by a report and written by nothing at all, while `venue_maps_clicked` was written on every click and read by nothing. None of this is visible in a dashboard — a chart built on a swapped name looks exactly like a chart built on a correct one, and a chart built on a name nobody writes looks like a quiet week.

## Options considered

Leaving the names alone and documenting the quirks. Renaming only the two swapped ones. Adopting a naming rule and applying it to everything. Removing names entirely in favour of one event with a type parameter.

## Decision

An event name states the **surface** and the **action**, in that order, in the past tense: `map_pin_clicked`, `venue_card_clicked`, `discovery_searched`. Never the consequence, never the destination. Every event lives in exactly one system, and where a fact exists on both sides, the server-side name is canonical and the browser-side one matches it.

## Rules

Name the thing the person touched, not what happens next. Focusing a map pin is what a card click causes, so `venue_pin_focused` describes the wrong half of the interaction and a second handler is then free to claim the right name. Name the surface, not the destination: `venue_navigate_clicked` describes where the person was going rather than what they clicked, and a name like that has no obvious writer, which is how it became a name nothing wrote.

Where a counter and an event describe the same click, the two names come from one place in the code rather than being written out twice. Two lists of literals that must agree will eventually disagree, and when they did, the hour-of-day chart silently answered a different question from the day-of-week chart beside it.

Renaming is free before launch and expensive after. Any name still wrong when real traffic starts stays wrong, because the history recorded under it cannot be relabelled.

## What this prevents

It prevents a dashboard that is confidently wrong. A swapped pair does not look broken; it looks like people prefer the list to the map, which is a conclusion someone would act on. The version of this rule that only fixed the two known swaps would have left the naming free-for-all that produced them, and the next pair would have arrived the same way.

## Revisit when

A surface appears that the rule cannot name cleanly — a gesture with no obvious object, or an event that genuinely belongs to two surfaces at once.

---

*See also: [[decisions/product/analytics-split-posthog-and-events]] · [[decisions/product/offer-logs-record-knowledge-not-authorship]] · [[decisions/product/internal-traffic-is-excluded-at-the-write]]*
