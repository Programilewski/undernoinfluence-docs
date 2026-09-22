# An owner can have several claims waiting, and an existing owner can be given another venue

**Date:** 2026-09-19
**Status:** Decided
**Executed:** 2026-09-19 — `venue_claims_pending_user_unique` dropped; the admin's claim form lists users and owners, never administrators
**Area:** Venues | Data Model

---

## Problem

A chain's owner should hold all its venues under one login, and approval already joined a venue to an existing account. But the admin could not get there. Recording a claim offered only accounts that were not yet owners, so after one approved venue the owner vanished from the list (Paweł, `additions.txt`). And the database allowed one waiting claim per account, so a chain had to be recorded one venue, approved, the next venue, approved. Paweł: *"what if we got a chain happy to work with us, but of 80 venues, it'd take a week to go through it."*

## Options considered

Keep the one-waiting-claim rule and approve each venue before recording the next. Drop the rule and let an account wait on any number of claims. Build a bulk path that records and approves many venues in one step.

## Decision

The rule is dropped, and the admin's list offers existing owners. A chain's venues can be recorded one after another and approved when checked, all joining one account. The bulk path waits for a real chain: it is worth building when one asks, not before.

## Rules

An account may have any number of claims waiting. A venue still has at most one waiting or approved claim — that is the rule that protects the venue, and it stays. The admin's list of accounts never includes an administrator, because approving would make them an owner. Approving a venue for an existing owner keeps them an owner and sends the approval e-mail for that venue.

## What this prevents

A chain turned into eighty rounds of record-and-approve, and an owner who cannot be given a second venue at all.

## Revisit when

A chain actually signs up. Then the bulk path: pick the venues, record them for one account in one step, approve them together — and send the owner one e-mail listing them rather than one per venue.

---

*See also: [[decisions/product/admin-recorded-claims-v1]] · [[decisions/product/a-venue-is-its-name-at-an-address]] · [[decisions/product/one-request-form-for-owners]]*
