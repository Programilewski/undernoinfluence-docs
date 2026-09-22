# Filter combinations are not indexable; the city cluster is the search surface

**Date:** 2026-08-30
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** UI/UX | Venues

---

## Problem

Discovery filters are deliberately written into the web address so links can be shared, which
also makes every combination of them a page a search engine can index. Seven filters over fifty
venues produce thousands of nearly identical pages, and free-text search and sort order produce
an unlimited number. Nothing in any checklist or plan covers this, and once those pages are in
the index removing them is a slow, manual job rather than a decision.

## Options considered

Index everything and let the search engine work it out. Index a small hand-picked set matching
real searches. Index nothing on the map page and rely on the existing city and district pages.
Stop putting filters in the address, which would break sharing.

## Decision

Filters stay in the address for sharing, and none of those addresses are indexable. The map page
tells crawlers not to index whenever any filter is present, while still asking them to follow the
links out, and points its canonical address at the plain city map. The search surface is the city
cluster that already exists — city, district, category and district-with-category — because those
are the four shapes a person actually types, and they are already built.

## Rules

The rule lives in the view next to the canonical tag, matching how empty landing pages already
work, not in a controller. Sort order and free-text search are never indexable under any
circumstance, because they produce unlimited near-duplicates of the same venues. New search pages
are not created by adding filter combinations; when a new search shape is wanted it becomes a
real page in the cluster with its own address. A filter earns a page of its own only when there
is evidence people type it, and the only evidence that counts is Search Console after launch,
not a guess before it.

## What this prevents

Prevents fifty venues generating thousands of thin pages that compete with each other and dilute
the handful of pages that should rank, and prevents the situation where fixing it means removing
already-indexed addresses one at a time. It also stops the map, which is a browsing tool, being
mistaken for a search surface, which is what the city pages are for.

## Revisit when

Search Console shows demand for a filter shape we did not anticipate, at which point it becomes
a real page in the cluster rather than an indexable filter combination.

---

*See also: [[decisions/product/server-side-get-filtering]] ·
[[decisions/product/empty-landing-pages-noindex]] · [[decisions/product/seo-cluster-entry-points]] ·
[[decisions/product/brand-and-product-pages]]*
