# Menus are read as text; page images on request

**Date:** 2026-11-12
**Status:** Decided
**Executed:** 2026-11-12 — *Wyodrębnij z obrazami* on a menu's page (PDF only), `menu_extractions.with_page_images`, the cost note averaged per mode; tests in `ReadMenuActionTest`, `MenuTextExtractorTest`, `AdminMenuLibraryTest`
**Area:** Data Model | Venues

---

## Problem

A PDF menu is read from its text layer, and a page becomes an image only when its text is unusable: too short, the wrong code page, or interleaved columns. A text layer can be readable and still mislead. A price can land on the wrong drink in two columns, a heading can drift away from its drinks, and a 0% mark can be an icon. The two readings (decision 14) catch a disagreement, but not the same misreading made twice. Paweł asked on 12.11 whether text extraction loses something.

## Options considered

Keep text only and add a layout check. Send every page as text and as an image, always. Send the PDF itself as a document and let the API do both. Or keep text by default and let the admin ask for page images per menu.

## Decision

**Text by default; the admin can ask for page images per menu** with *Wyodrębnij z obrazami*, which sends every page as both text and image. Paweł chose it on 12.11 ("add an option where we can select send both when we want"). Text stays the default because it is cheap (about $0.005 a menu, read twice) and spells names exactly. The images are for the menus where the layout matters, at roughly 1,600 input tokens per page per reading.

## Rules

Only a PDF offers it: a photo is already an image, and a web page is never rendered. Reading again replaces the lines still waiting for a decision, and a menu with decided lines is not read again, the same as text-only. Both readings record the choice, and the confirmation states the measured average cost of the chosen mode, kept apart from the other. The model is told the images show the same pages as the text, to use the images for what belongs to what and the text for spelling.

## What this prevents

A shifted price or a misplaced heading passing approval because both readings made the same mistake, without paying image prices on every menu.

## Revisit when

When the first real batches show how often admins need it. If most PDFs end up read with images, make it the default. If the measured cost per menu is far above the estimate, cap the pages sent.

See also: [[decisions/adr/ADR-012-automated-venue-sourcing]], [[decisions/product/a-sourcing-candidate-is-a-location]].
