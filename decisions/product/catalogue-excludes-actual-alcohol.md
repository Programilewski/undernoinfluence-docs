# The catalogue only holds drinks that are actually non-alcoholic

**Date:** 2026-09-04
**Status:** Decided — permanent scope rule
**Executed:** 2026-09-14
**Superseded:** in part, 2026-09-16 by [[decisions/product/what-belongs-in-the-catalogue]] — the ABV boundary below stands unchanged and permanently; the *scope* question this record deferred ("what kind of drink, in what kind of place") is answered there
**Area:** Data Model | Venues | Categories

---

## Problem

`abv-trust-model.md` set V1 scope at 0,0% and products up to 0,5%, and **deferred** broader low-alcohol (1–3%) rather than refusing it. Deferred is something a later decision can reasonably undo, without the person undoing it knowing what it costs. And what it costs is the product's identity: UNI is the place you go when you want something that is not alcohol. A directory that lists a 2% shandy has quietly become a drinks directory, and the person who came here to drink less can no longer trust anything on the page without checking it themselves.

## Options considered

Leave 1–3% deferred and decide case by case. Refuse anything above 0,5%, the line at which a drink stops being described as non-alcoholic. Refuse anything at 0,5% or above, adding a margin. Keep the `unknown` ABV state as it is.

## Decision

**UNI only ever lists drinks that are non-alcoholic — nothing exceeding 0,5% ABV, ever.** Exactly 0,5% stays in scope, because that is the boundary of the description itself and a product at the line is still a non-alcoholic drink. The point is not caution; **the point is that the catalogue's boundary is the definition of the category we serve**, which turns "we do not list alcohol" from an observation about today into a permanent property of the product.

## Rules

Nothing exceeding 0,5% enters the catalogue, and low-alcohol products in the 1–3% range are **refused, not deferred** — the earlier deferral is superseded and must not be revived without a decision that knowingly changes what UNI is. A product whose ABV is `unknown` is not merely incomplete data but **an unverified claim**, since it may in fact exceed the threshold, so unknown-ABV products are never safe by default and must not be published as verified alternatives. The three products currently at exactly 0,5% — `Paulaner Weißbier Alkoholfrei`, `Torres Natureo Syrah`, `Kombucha Jun Original` — **stay**, because they are within the category.

**Amended 2026-09-14 — a published description said otherwise.** The seeded "Wino 0%" category read "Wino bezalkoholowe i low-alcohol" on the homepage and four landing pages. Corrected in `CategorySeeder`; `PublishedPagesAreTrueTest` fails if any category description mentions low-alcohol again.

## What this prevents

The single change that would turn UNI from a non-alcoholic directory into a drinks directory, and — more importantly — prevents that change being made **casually**, by someone reading "deferred" as an invitation. It also protects the one thing the product sells: that everything on a venue page is something you can order without deciding whether it counts.

## Revisit when

Never on the threshold — 0,5% is what non-alcoholic means, and the rule moves only if that description does. The only live question is the `verified_under_0_5` label, which reads "≤0.5%" and now correctly matches the rule.

---

*See also: [[decisions/product/abv-trust-model]], [[decisions/product/mission-is-the-healthy-choice]]*
