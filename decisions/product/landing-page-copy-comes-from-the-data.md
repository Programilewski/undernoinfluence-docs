# Landing Page Copy Comes From The Data

**Date:** 2026-09-08
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** UI/UX | Brand

---

## Problem

The city, district and category landing pages run between 130 and 180 words, and across the cluster they differ only by a name and a list. That is the shape a search engine treats as a doorway page — hundreds of near-identical addresses built to catch queries rather than to answer them. The obvious fix, an intro paragraph per page type, makes it worse: templated prose with a name substituted in is the definition of the pattern, not a defence against it.

## Options considered

Write the opening paragraph by hand for every city and category pair. Generate a templated sentence with the name substituted. Generate a paragraph from the data behind each page. Add nothing and rely on the venue lists growing. Merge the thinnest page types away entirely.

## Decision

Each landing page opens with a paragraph assembled from its own data — how many venues, which districts they cluster in, how many carry a checked menu. Hand-written copy was rejected because it does not survive multi-city expansion; a templated sentence was rejected because it adds words without adding information, which is the failure being defended against. The paragraph is worth reading on its own terms: it tells someone scanning the page where the options actually are.

## Rules

Generated copy states facts drawn from the page's own records and never asserts anything the data does not support. It is omitted entirely when the page has no venues rather than padded with an apology. Polish inflection is generated correctly for every count, including the twelve-to-fourteen exception, because a page that reads as machine output undermines the authority the directory is built on. Nothing in the paragraph is promotional — it counts and locates, it does not persuade.

## What this prevents

A cluster that reads as generated at scale, which is the one thing a programmatic directory cannot afford to look like. It also prevents the false comfort of a word count: adding templated prose would have raised every page above a threshold while leaving them as indistinguishable from each other as before.

## Revisit when

The catalogue is large enough that the venue lists alone carry the page — at which point the paragraph becomes a summary of a long list rather than a substitute for a short one, and may want a different shape.

---

*See also: [[decisions/product/empty-landing-pages-noindex]], [[decisions/product/one-content-rule-for-the-whole-cluster]], [[decisions/product/faceless-brand]]*
