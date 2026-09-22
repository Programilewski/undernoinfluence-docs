# An abstraction survives a cleanup only if it has a second user

**Date:** 2026-08-24
**Status:** Decided
**Executed:** standing rule — nothing to execute once; it binds future work
**Area:** Data Model

---

## Problem

Every audit of this codebase produces a list of interfaces, wrappers and helper classes that look like over-engineering: one implementation, one caller, no obvious reason to exist. Deleting them all is wrong — some are seams deliberately placed for work that is already planned. Keeping them all is also wrong, because that is how a one-person project accumulates layers nobody can justify. The tension recurs every time the codebase is reviewed, and getting it wrong in either direction is expensive: a deleted seam has to be rebuilt under pressure, a kept one costs attention forever.

## Options considered

Delete every single-implementation abstraction on sight. Keep every abstraction on the grounds that it might be needed later. Judge each one by how elegant the code looks. Judge each one by whether a second user for it exists today or is written down in a decision or roadmap.

## Decision

An abstraction stays if it has a second implementation today, a second implementation named in a roadmap or decision record, or a live non-production user such as the test suite. Otherwise it goes. "It might be useful later" is not a second user, and neither is the fact that the abstraction is well written. The check is performed against the documents, not against intuition — the reviewer must be able to point at the file that justifies the seam.

## Rules

Before removing any interface, wrapper or helper, search the decisions directory and the roadmap for a planned second implementation, and search the test suite for a use the production code does not have. If either exists, the abstraction stays and the search result is recorded alongside the finding. If neither exists, it goes.

A class whose only purpose is to hold a rule that must be enforced in exactly one place counts as having a second user — the rule itself. The enforcement point is the reason the class exists, and inlining it removes the only place the promise can be kept.

Two surfaces that look identical today are not automatically duplication. If they belong to audiences that are documented as receiving different things, the duplication is a snapshot mid-divergence and must be left alone.

An audit that recommends deletion states its evidence. A recommendation without a documented check against the roadmap is not yet a finding.

## What this prevents

Prevents the failure that nearly happened during the 24.08 cleanup, where five separate recommendations to delete were all wrong: two seams were mandated by existing decision records, one was the only enforcement point for a compliance promise, one was a pair of test doubles that behave differently from the shared fake, and one was two admin surfaces that are documented as diverging. It also prevents the opposite failure — a codebase where every unjustified layer survives because nobody can prove it is unnecessary, which is how a solo project becomes unreadable to its own author.

## Revisit when

A second person joins the project. The rule assumes one author who can hold the roadmap in their head; with two, the documents have to carry more weight and the bar for keeping a seam probably rises.

See also: [[decisions/adr/ADR-010-migration-squash]], [[decisions/product/pre-launch-has-no-past-to-protect]]
