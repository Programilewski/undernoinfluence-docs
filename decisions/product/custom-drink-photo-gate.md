# Custom drink photo as anti-spam gate

**Date:** 2026-04-22
**Status:** Decided
**Executed:** superseded 2026-08-30 by [[decisions/product/custom-drink-photo-gate-retired]]
**Area:** Venues | Scoring

---

## Problem

Custom/house mocktails are high-value signals of genuine NoLo commitment, and they count toward breadth score. This makes them an obvious inflation vector — a venue could claim 15 fake custom drinks to jump the rankings without actually serving anything. Any listing mechanism for custom drinks needs to be high-friction for fakers and low-friction for honest venues.

## Options considered

**Admin review of every custom drink submission** — maximum quality control, completely unscalable. Creates a bottleneck that punishes honest venues with delay.

**Community verification only** — custom drinks appear immediately, users confirm or flag. Zero upfront friction. A determined faker can list 15 drinks before any user visits.

**Photo required upfront** — no photo, no listing. Honest venues take a phone photo of the drink. Fakers need to fabricate a photo for every fake drink, which is expensive to scale.

**Description required only** — lower bar than photo. A name and ingredients list is easy to invent.

## Decision

Photo required for every custom drink listing. No photo, no listing — the submission form blocks progression without an image. A short description (name, base ingredients, flavor profile) is also required. Drinks appear on the venue profile as "unverified" until community-confirmed. The photo requirement is the primary fraud barrier; community confirmation is the secondary quality layer.

## Rules

Custom drink submission requires: a photo upload, a drink name, and a short description (minimum meaningful content, not just a character count). Drinks without photos cannot be saved or submitted. Unverified custom drinks count toward breadth score at reduced weight. Once community-confirmed, they count at full weight. The photo must be of the drink itself — not a menu or bottle.

## What this prevents

Prevents score inflation through fake custom drink listings. Fabricating convincing drink photos at scale is expensive; fabricating names and descriptions is trivial. The photo gate makes fake submissions costly enough that it's cheaper to actually make the drink. It also gives users a visual reference to confirm or deny the drink exists when they visit the venue.

## Revisit when

Post-V1, if image storage costs become significant or if the photo review workflow reveals widespread use of irrelevant photos (menus, stock images). At that point, consider lightweight computer vision checks or admin spot-sampling instead of full photo requirement relaxation.

---

*See also: silent-flag-weighting.md*
