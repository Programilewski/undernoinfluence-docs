# How venue data is gathered, and why the register stays out of the application

**Date:** 2026-08-30
**Status:** Decided
**Executed:** 2026-09-14
**Area:** Data Model | Venues

---

## Problem

The seeding decision says to pull bars and restaurants from the public business register and
enrich them by hand, but nothing says where that register data is allowed to live. For sole
traders the register carries the owner's name and often a home address, which is personal data
about a living person — and the whole privacy position of this product rests on holding none.
Separately, data gathered by hand today records no trace of where it came from, so the freshness
column the venue badge depends on has nothing to run on.

## Options considered

Import the register into the application and enrich records in place. Query the register and keep
the results in a spreadsheet outside the repository, promoting only qualified venues by hand.
Skip the register and find venues by searching. Store the owner's name for outreach. Keep
outreach details entirely outside the application.

## Decision

The register is a prospect list and never enters the application. Queries are exported to a
spreadsheet that lives with the other working material, outside the repository, and only venues
that pass the eligibility rule are entered by hand through the admin panel. The address stored
against a venue comes from that venue's own published pages, not from the register, and
coordinates come from the Polish government geocoder. Every fact recorded this way carries the
address it came from and the date it was read.

## Rules

No owner name and no registered address from the business register is ever written into the
application, in any column, for any reason; if that information is wanted for outreach it stays
in the working spreadsheet. A venue qualifies only when a named non-alcoholic item appears in its
own published offer, which is the existing eligibility rule. Every drink recorded against a venue
and every set of coordinates carries two additional pieces of information: the address it was
read from and the date. Venues rejected during research are recorded too, with the reason, in the
same working spreadsheet — that list is both the honest measure of how fast this work goes and
the sales prospect list. Nothing is copied wholesale from another site: item names are recorded
as facts, written descriptions are not.

**Amended 2026-09-14 — the screens now ask for what this record requires.** Until today the admin's "Dodaj produkt" and "Potwierdź" recorded no source and no date, house drinks accepted neither, and the geocode buttons wrote no provider — while a test attached through Eloquent with the columns filled and passed. The attach, the confirmation and the house-drink form now require the menu's address and the date read; every geocode writes `geocoded_by` and `geocoded_at`; the menu importer requires both per row ([[decisions/product/menu-spellings-are-confirmed-not-guessed]]). `DataProvenanceTest` presses the buttons.

## What this prevents

Prevents the privacy position quietly collapsing because a convenient import brought personal
data of sole traders into a database that is meant to contain none, and prevents having to
re-find every source when a menu needs rechecking a year later. The recorded date is also what
allows the verified-menu badge to expire honestly instead of claiming a check that happened
eighteen months ago.

## Revisit when

Expanding beyond Warsaw, where the same method applies with different register filters, or if a
supplier list ever provides pre-qualified venues, which changes where the prospect list comes
from but not what may be stored.

---

*See also: [[decisions/adr/ADR-002 Venue Seeding]] · [[decisions/product/kebab-rule]] ·
[[decisions/product/osm-dropped]] · [[decisions/product/pii-columns-dropped]] ·
[[decisions/product/research-files-out-of-the-repo]]*
