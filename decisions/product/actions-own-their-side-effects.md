# An action does everything its operation owes, and the button only calls it

**Date:** 2026-09-13
**Status:** Decided
**Executed:** 2026-09-13
**Area:** Infrastructure | Venues

---

## Problem

Business operations — approve a claim, erase a venue, approve a product proposal — live in action classes so that every door calls the same code. But on 13.09 the claim approval sent its e-mail to the owner from the admin table button that called the action, not from the action itself, while erasure sent its own. The audit record written inside the action already said the e-mail was queued. Any second way of approving a claim would have approved silently, with an audit trail claiming otherwise, and nothing would have failed.

## Options considered

Leave the e-mail in each button and remember to copy it to every new caller. Fire an event from the action and send the e-mail from a listener. Put the e-mail in the action itself, sent after the database change has been saved.

## Decision

**An action does everything the operation owes — the database change, the audit record and the message to the person affected — and whatever calls it does nothing but call it and report the result on screen.** Messages go out after the transaction commits, so nobody is ever told about a change that rolled back. An event and a listener would have added a second place to look for the same behaviour without a second caller to justify it.

## Rules

A panel button, page or command that performs an operation calls its action and adds only what belongs to the screen, such as a success notice. Anything that must happen whenever the operation happens — an e-mail, an audit record, a recalculation — lives in the action, not beside the call. E-mails from an action are queued after its transaction completes, never inside it. A test calls the action directly and asserts the message, so the message is proven for every caller rather than only for the button that happens to be tested.

## What this prevents

The operation that behaves differently depending on which door it came through: the owner who is approved but never told, the audit log that records a notification nobody sent, and the second caller — an import, a command, the owner panel opening — that silently skips a step the first caller did by hand.

## Revisit when

An operation genuinely needs different follow-up depending on who triggered it, or a second, unrelated reaction to the same operation appears — at which point an event with listeners earns its extra indirection.

---

*See also: [[decisions/product/admin-recorded-claims-v1]] · [[decisions/product/catalogue-links-change-through-one-path]] · [[decisions/product/abstraction-needs-a-second-user]]*
