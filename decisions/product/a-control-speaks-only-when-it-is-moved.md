# A control speaks only when it is moved

**Date:** 2026-09-17
**Status:** Decided
**Executed:** 2026-09-17
**Area:** UI/UX | Venues

---

## Problem

The admin form's "Aktywny" switch carries a heavy meaning: turning a live venue off is a statement that the place is closed, wrong or disputed, so it is recorded and the activation gate will never undo it. But a venue's visibility also changes on its own, underneath a form that is already open — the gate publishes it the moment a product is attached in the panel beside it. The save then compared the value the form submitted against the record, found them different, and read a switch nobody had touched as a deliberate decision. On 17.09 a venue was published by the gate, switched off six seconds later by a save that changed only its name, and marked so that no later product could ever republish it. Nothing failed, nothing was logged as wrong, and the admin's own audit row said they had done it.

## Options considered

Refresh the parent form whenever the panel beside it writes, so its switch is never stale. Compare the submitted value against the value the form was rendered with, and write nothing when they agree. Take the meaning out of the switch and move "mark this closed" to its own button with its own confirmation. Accept the collision as rare and tell admins to reload before saving.

## Decision

**A control writes its field only when somebody moved it.** The question a form asks is not "what does this control hold" but "did anyone change this", and the two differ exactly when the record moved underneath an open page — which is when the answer matters most. Refreshing the form on every neighbouring write would have fixed one screen and left the same wrong comparison everywhere else. A separate button was rejected as a bigger change than the defect warranted, though it stays the right answer if the switch ever acquires a third meaning.

The switch keeps everything it meant before. It simply no longer speaks for an admin who said nothing.

## Rules

A control whose meaning is a decision rather than a value is compared against what it was rendered with, not against the current record. When the two agree, the field is left out of the save entirely, so the record keeps whatever it became while the page was open. After a save, the control is refilled from the saved record, so what the admin sees next is true. This applies wherever a form's value can be overtaken by something outside that form — a panel beside it, a background job, another person — and most sharply where the written value is irreversible by automatic means.

## What this prevents

An admin being recorded as making a decision they never made, and a venue left permanently unpublishable by a save that touched something else. The failure is invisible from both ends: the panel shows a switch that looks deliberately off, and the audit trail — the record that exists precisely to settle "who did this" — agrees with it.

## Revisit when

The switch takes on a third state or a second meaning, at which point it should become its own action with its own confirmation rather than a field on a form that saves everything at once.

See also: [[decisions/product/venue-activation-gate]], [[decisions/product/an-automatic-gate-runs-in-both-directions]]
