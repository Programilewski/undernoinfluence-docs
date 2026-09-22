# The catalogue lists every non-alcoholic category, and imagery is unrestricted

**Date:** 2026-09-07
**Status:** Decided — supersedes `no-alcohol-brand-imagery.md`, which was deleted
**Executed:** standing rule — nothing to execute once; it binds future work
**Area:** Data Model | Brand | Venues

---

## Problem

A decision recorded on 04.09.2026 excluded 0% line extensions of spirits, wine and cider from the catalogue and banned producer imagery outright. Both restrictions were adopted for reasons outside the product, and both removed the things that make a directory worth opening: the drinks a bar actually pours, and a page you can look at. A directory that silently omits categories sends somebody to a venue without telling them what is behind the counter, which is the one thing it exists to do.

## Options considered

Keep the exclusions and ship a text-only catalogue missing three categories. Reverse the line-extension exclusion but keep the imagery ban. Reverse the imagery ban but keep the catalogue narrow. Reverse both and treat catalogue scope as a product question with a single boundary.

## Decision

**The catalogue lists every non-alcoholic category a venue serves, and there is no rule against product imagery.** `Aperol Spritz 0%`, `Torres Natureo`, `Somersby Apple 0%` and `Crodino` stay. The one boundary is the one in [[decisions/product/catalogue-excludes-actual-alcohol]] — nothing above 0,5% ABV — and there is no second boundary inside it. Completeness is what the person choosing needs, and a category-shaped hole in a directory is a defect, not caution.

## Rules

Every non-alcoholic drink a venue serves may be catalogued regardless of whether its name or brand also belongs to an alcoholic product. Product and brand imagery may be used. Two rules from the deleted record survive on their own footing and are unchanged: **no producer name ever appears on a public page**, including producer names sitting in the brand field such as *Campari Group* and *Carlsberg* — see [[decisions/product/producers-stay-internal]] — and **no placement, ranking or inclusion is ever sold**, see [[decisions/product/ranking-is-never-for-sale]].

## What this prevents

A catalogue that is quietly incomplete in a way the reader cannot see. Somebody scanning a venue page has no way to know that three categories were withheld, so an omission reads as "this bar does not serve it" — the directory returns a wrong answer rather than a cautious one. It also prevents a visual product being stuck as a wall of text, which is the form least likely to get anyone to open it twice.

## Revisit when

The catalogue takes money from a producer, which would make brand presentation a commercial question rather than an editorial one, and would engage [[decisions/product/ranking-is-never-for-sale]] directly.

---

*See also: [[decisions/product/catalogue-excludes-actual-alcohol]], [[decisions/product/producers-stay-internal]], [[decisions/product/mission-is-the-healthy-choice]]*
