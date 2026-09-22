# On a venue page, the owner's line comes first and a guest's correction second

**Date:** 2026-09-19
**Status:** Decided
**Executed:** 2026-09-19 — `venues/show.blade.php`; "Coś się nie zgadza?" in `/faq` and `/kontakt`
**Area:** UI/UX | Venues

---

## Problem

Under a venue's buttons sat "To mój lokal / coś się nie zgadza" and, beside it, "Prowadzisz ten lokal? Przejmij profil" — two ways in for an owner, one of them mixed with a guest's correction. Paweł: *"now we got slight duplication… We need to indicate that the owner can manage the profile themselves. Right now it's not shown."* Then: *"the 'to twój lokal' should be above the 'coś się nie zgadza?' and be more visible."*

## Options considered

Relabel the correction button only while owner access is on — but `/faq` and `/kontakt` name that button, and would then name one that does not exist. Two lines, each for one person, in both states of the switch. Mention the owner's analytics on the venue page, or keep that for the owners' own page.

## Decision

Two lines. First, and more visible, the owner's: "To Twój lokal?" followed by what they can do. Second, smaller, the guest's: "Coś się nie zgadza?", the same in both states, so the pages that point at it stay true. Analytics are not mentioned on the venue page — Paweł was unsure because *"some end users will ask 'where do they get the analytics from?'"* — only on `/zglos-lokal`, which only owners read, and without an explanation of how views are counted: *"If they ask, we explain."*

## Rules

With owner access on, on a venue nobody manages yet, the owner line reads "To Twój lokal? Zarządzaj nim samodzielnie w panelu lokalu" and links to `/zglos-lokal` with the venue picked. With it off, "To Twój lokal? Napisz, co zmienić w karcie" opens the correction form with "To mój lokal" already chosen. A venue that already has an owner, or a request in progress, shows no owner line. The owner line is listed in [[decisions/product/owner-panel-ships-behind-one-switch]]. No exclamation marks: the site's voice is calm, not a sales pitch.

## What this prevents

An owner who never learns the profile can be theirs to manage, and a guest who wonders whether the correction link is meant for them. Also a venue page that advertises tracking to the people being counted.

## Revisit when

Owners are managing venues and "Coś się nie zgadza?" corrections keep arriving that are really from owners — then the owner line is not visible enough.

---

*See also: [[decisions/product/one-request-form-for-owners]] · [[decisions/product/venue-page-shows-only-its-venue]] · [[decisions/product/v1-copy-truth]]*
