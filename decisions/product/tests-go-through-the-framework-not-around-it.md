# A test runs the framework's own path, not an imitation of it

**Date:** 2026-09-13
**Status:** Decided
**Executed:** 2026-09-14
**Area:** Infrastructure | Venues

---

## Problem

The venue importer had twelve tests, and they passed while an ordinary launch spreadsheet would have published every venue on the map with no location and nothing on its menu. The tests fed a row to the importer through a hand-written helper that filled the venue with the whole row. The real import fills only the columns a file contains, and a column it skips takes the database default — which for "live" is yes. The helper was a faithful imitation of what the importer should do, and so it could never notice what the framework actually does.

## Options considered

Keep the imitation and add the missing case to it. Test only through the browser, clicking the real import button. Call the framework's own entry point with a real row and a real column mapping, and keep the imitation only where it tests a narrower thing it can actually see.

## Decision

**A test of code that a framework drives — an import, a queued job, a panel action — goes through the framework's own entry point with realistic input, at least once for every rule that matters.** An imitation encodes our belief about the framework, which is exactly the belief the test should be checking. Browser tests stay where a browser is the only thing that can see the problem.

## Rules

An importer test runs a row through the importer's real entry point with the column mapping a user would produce, including a file that leaves columns out. A panel button that matters is pressed on its page in at least one test, alongside any test of the code it calls. Where a helper that bypasses the framework remains useful, it is named and documented as bypassing it, so nobody mistakes it for coverage of the real path. When a test passes while a real use fails, the fix includes rewriting the test to the real path before fixing the code, so the test is seen failing first.

**Amended 2026-09-14 — applied to the remaining offenders.** `ProductImporterTest` reached into a closure with reflection and never ran a row, so the ABV rules had no test; it now runs rows through the importer. `DataProvenanceTest` wrote columns directly; it now presses the attach, confirm and house-drink buttons. The GUGiK bulk geocode is pressed through the table, which found a real bug on its first run.

## What this prevents

Green tests over a broken feature, found by the first real use — in this case the first import of real venues, which would have published an unfinished catalogue on launch day before anybody opened the site.

## Revisit when

A framework entry point becomes too slow or too entangled to call in a test, at which point the imitation is acceptable only alongside one slower test through the real path.

---

*See also: [[decisions/product/mocked-integrations-need-a-live-check]] · [[decisions/product/venue-activation-gate]]*
