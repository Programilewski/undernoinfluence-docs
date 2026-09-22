# A component library lives outside the app or inside its views, never in packages/

**Date:** 2026-08-24
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** UI/UX

---

## Problem

A personal Blade component library sat at `packages/uni-ui` inside the UNI repository, wired in as a local Composer path dependency. It was built on the copy-into-your-project model, so after a component was copied it played no part in rendering anything. Its name and location implied it belonged to UNI, but its contents were generic — button, card, badge, input, modal, theme toggle — with no venue, freshness or category concept anywhere in it. Of nine templates, three were ever copied into the app and two of those had since been edited, leaving exactly one still matching the original.

## Options considered

Keep it where it was and maintain it as UNI's component set. Keep it in the repository but consume it as a published or version-controlled dependency rather than a local path. Delete the package and keep the copied components in the application's own views, leaving the library to live on as its own repository for seeding future projects.

## Decision

The package is removed from UNI's dependencies and the three copied components stay in the application's views where they already live. The library keeps existing as its own repository for starting future projects. A copy-in component library is cross-project by nature — that is the only reason the pattern exists — so parking one inside a single project makes it look owned by that project while it is not, and the copy-in indirection buys nothing for the project it sits in.

## Rules

UNI's components live in the application's own view directory and are edited in place. There is no component package in this repository, and no local path dependency pointing anywhere inside it.

Any component library kept for reuse across projects lives in its own repository, is not required by UNI, and is used by copying from it when a new project starts.

No dependency may point at a directory that version control ignores. A fresh clone of this repository must install with no manual steps beyond fetching dependencies, and that property is checked whenever the dependency list changes.

A component template that contradicts a shipped product decision is deleted from wherever it lives rather than kept for completeness.

## What this prevents

Prevents the concrete breakage found on 24.08, where the dependency pointed at a directory that version control ignored, so a fresh clone of UNI could not install at all until a second repository had been cloned into exactly the right place — a failure that would have surfaced during the operating system migration, on the machine with no working environment to debug it. It also prevents the slower failure of a library that looks shared but is maintained by nobody, drifting until its templates contradict decisions the product has already made.

## Revisit when

A second project genuinely needs the same components. At that point the library repository is the starting point and the answer is still to copy from it, not to depend on it from either side.

See also: [[decisions/product/single-palette-no-theming]], [[decisions/product/abstraction-needs-a-second-user]]
