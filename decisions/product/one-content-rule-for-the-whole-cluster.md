# One Content Rule For The Whole Cluster

**Date:** 2026-09-08
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** UI/UX | Venues

---

## Problem

Three places had to answer the same question — does this city × category or district × category page have any venues? The sitemap answered it with a plain join across venues, products and categories. The landing page answered it by also applying the freshness window before rendering anything. The city page did not ask at all. Each was written separately, each looked right on its own, and nothing compared them, so the sitemap was submitting seventy-one addresses that rendered as empty and noindexed.

## Options considered

Leave the three implementations and add a test that compares their output. Make the sitemap call the same query the page uses. Give the pages a precomputed column updated by an observer. Put the rule in one place that all three read.

## Decision

One rule lives in one place and the sitemap, the city page and the landing pages all read it. A pair counts as having content when a venue in it carries a product in that category whose offer is unconfirmed or confirmed inside the freshness window — the same condition the landing page already applied to itself. A precomputed column was rejected because it introduces a second thing that can go stale; a comparison test was rejected because it detects the divergence instead of preventing it.

## Rules

Any surface that decides whether a cluster page is worth linking, submitting or indexing reads the shared rule rather than writing its own query. A page's own empty state, the internal links pointing at it, and its presence in the sitemap are three consequences of one answer and must never be able to disagree. Adding a new entry point into the cluster means reading the same rule, not writing a fourth query. The invariant is asserted directly: every address in the sitemap must resolve and must not carry a noindex directive.

## What this prevents

Submitting pages we have told search engines to ignore, which spends crawl budget on nothing and makes the sitemap a worse signal for the pages that do matter. It also prevents the subtler half: internal links pointing at empty pages, which `seo-cluster-entry-points` already forbids but had no shared mechanism to enforce. Divergence of this kind is invisible in review — each query reads correctly, and only rendering every page reveals that they disagree.

## Revisit when

The rule needs to differ by page type — for instance if district × category pages are eventually gated on a minimum count the way district pages are. That is a change to the rule, made in one place, not a reason to fork it.

---

*See also: [[decisions/product/empty-landing-pages-noindex]], [[decisions/product/seo-cluster-entry-points]], [[decisions/product/national-category-pages-wait-for-a-second-city]]*
