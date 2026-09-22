# A request waiting more than 14 days is flagged and reminded, never rejected automatically

**Date:** 2026-09-19
**Status:** Decided
**Executed:** 2026-09-19 — "Czeka ponad 14 dni" in the admin's claims list and its filter; `uni:remind-waiting-claims` each morning at 08:00
**Area:** Venues | UI/UX

---

## Problem

An owner request that nobody confirms waits forever — the owner check ([[decisions/product/owner-requests-are-checked-through-the-venues-own-channels]]) approves nothing on its own and rejects nothing on its own. The process suggested rejecting a request left unconfirmed for about two weeks, but nothing would remind anyone to. Rejecting it automatically has a catch: a claimant on the Instagram path may have sent their code already, and be waiting on nobody but us to match it.

## Options considered

Reject automatically after 14 days. Leave it to the admin to notice. Flag it in the list and remind the admin by e-mail, and leave the rejection to a person.

## Decision

Paweł: *"keep the rejection manual. Add the flag and an email message to my inbox reminding of it."* A request pending for more than 14 days is marked in the admin's claims list for as long as it waits, and the admins get a morning e-mail naming it once, on the day it crosses the line. The admin decides: approve, reject with a note, or look again at the Instagram inbox.

## Rules

The threshold is 14 days from the request, set in one place (`uni.claim_waiting_days`). The list shows "Czeka ponad 14 dni" in place of "Oczekuje" and has a filter for such requests. The e-mail goes to every admin account, lists each newly waiting request with what it waits for — an unconfirmed channel, or the admin's own decision — tells the admin to check the Instagram inbox before rejecting one waiting for a code, and counts any earlier ones still waiting. Each request is reminded once; the reminder is recorded in the audit log. No e-mail when nothing new has crossed the line. Nothing is rejected, approved or changed by the reminder. A rejection for this reason reads *"Nie udało się potwierdzić, że zgłoszenie pochodzi z lokalu."* and the claimant may send a new request.

## What this prevents

A claimant rejected for our own delay in matching their code. And the opposite: requests nobody confirms piling up unseen, with owners who asked and never heard back.

## Revisit when

Requests reach about ten a day and the Instagram step is matched automatically — then an unconfirmed request can no longer be waiting on us, and automatic rejection after the threshold becomes safe. Or the once-only reminder turns out to be ignored, and a weekly repeat is needed.

---

*See also: [[decisions/product/owner-requests-are-checked-through-the-venues-own-channels]] · `product/features/Owner Verification.md`*
