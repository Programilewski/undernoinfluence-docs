# The custom drink photo requirement is retired for V1

**Date:** 2026-08-30
**Status:** Decided — supersedes [[decisions/product/custom-drink-photo-gate]] for V1
**Executed:** yes — verified in the code 2026-09-14
**Area:** Venues

---

## Problem

A decision from April requires a photograph of every house drink before it can be listed, on the
grounds that faking a convincing drink photograph at scale is expensive while faking a name and a
description is trivial. Two things have changed. Generated images have made that expense
disappear, and V1 has no self-service at all — every house drink is entered by us in the admin
panel, so the person the gate defends against does not exist. The requirement has also never been
enforced anywhere in the code.

## Options considered

Keep the rule and finally enforce it. Keep the rule but let a photograph be optional. Retire the
rule for V1 and re-answer the fraud question when owners can submit their own drinks. Replace the
photograph with a different barrier now.

## Decision

The photo requirement is retired for V1. Nothing about it survives the two conditions it rested
on: image generation removed the cost of faking one, and browse-only V1 removed the person who
would want to. House drinks are recorded by us from a venue's own published menu, with the source
and the date noted, and that provenance is a stronger guarantee than a photograph ever was.

## Rules

House drinks may be listed with no image. No upload field for house drinks is built for V1.
The barrier against invented drinks in V1 is that a named item must appear on the venue's own
published menu, recorded with the address it came from and the date it was read — the same
evidence rule that governs every other piece of venue data. If self-service arrives in a later
version, the fraud question is reopened from scratch and the answer will not be photographs.

## What this prevents

Prevents storing and paying for images whose origin we cannot vouch for, and prevents a rule
sitting in the decision log claiming to protect something while nothing in the code enforces it —
which is worse than no rule, because it stops anybody looking for a real barrier. It also
prevents the more general error of trusting a defence whose whole strength was that something
used to be expensive.

## Revisit when

Venue owners can add their own drinks, which is the condition that created the original problem.
The replacement will need to be a barrier that does not assume anything is hard to fabricate.

---

*See also: [[decisions/product/custom-drink-photo-gate]] · [[decisions/product/browse-only-v1]] ·
[[decisions/product/no-venue-photos-v1]] · [[decisions/product/venue-data-acquisition-flow]]*
