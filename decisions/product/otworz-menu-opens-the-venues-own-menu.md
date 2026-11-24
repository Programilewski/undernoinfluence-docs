---
description: "In the menu approval screens, Otwórz menu and O open the menu on the venue's own site; UNI's stored copy stays as Kopia w UNI; W opens the venue's homepage and M the menu's page in UNI (24.11)."
---

# Otwórz menu opens the venue's own menu; UNI's copy is the second link

**Date:** 2026-11-24
**Status:** Decided
**Executed:** 2026-11-24, `v0.1.21`
**Area:** UI/UX | Sourcing

---

## Problem

During the 24.11 batch Paweł opened Kamanda Lwowska's menu and saw only a "0%" splash screen. UNI stores a page as it was fetched, and a page drawn by JavaScript is stored as its first frame. To check a line he had to find the original himself. He also had no quick way to the venue's site, which is where most doubts get settled.

## Options considered

Keep opening the stored copy. Open only the original. Open the original first and keep the stored copy as a second link.

## Decision

**"Otwórz menu" and O open the original**: the file or page on the venue's own site. **"Kopia w UNI" keeps the stored copy**, because it is the evidence of what was actually read, and the original can change or disappear. **W opens the venue's homepage**, the address stripped to its domain, and **M opens the menu's page in UNI**, which is what O used to do.

## Rules

On the menu page, "Otwórz menu" (Ctrl+Shift+O) is the original, "Kopia w UNI" the stored file, and "Strona lokalu" the homepage. In Przegląd pozycji, O is the original, W the homepage and M the menu page. The homepage comes from the venue's website, else the candidate's, else the menu's own address.

## What this prevents

A person approving or rejecting a line from a frozen first frame, or leaving the review to search for the venue's site.

## Revisit when

Originals start disappearing faster than menus are refreshed, so the stored copy becomes the more reliable link again.

---

*See also: [[decisions/product/an-approval-round-is-timed-from-its-decisions]]*
