# A panel widget's script loads with the page, never from inside the widget

**Date:** 2026-09-12
**Status:** Decided
**Executed:** 2026-09-12
**Area:** UI/UX

---

## Problem

The location preview on a venue's edit page in the admin panel had never rendered since the panel's map moved to the current map library. Not the map, not even its heading. The widget's view began by loading its own script, and the component framework treats a component's first element as the whole component, so when the widget arrived after the page it kept the script tag and threw the preview away. No test failed and no error appeared; it was found only while checking the map library upgrade in a real browser.

## Options considered

Keep loading the script inside the widget and move it below the widget's markup. Stop the widget loading lazily. Use the component framework's own asset directive. Load the script through the panel, on the one page that shows the widget.

## Decision

Scripts a panel widget needs are loaded by the panel, on the page that uses them, and a widget's view contains exactly one root element and no asset tags. The preview's script is small, and the map library itself still loads only when a map is drawn, so loading the script with the page costs almost nothing.

## Rules

A widget view has one root element, and it is the widget. A widget view never loads scripts or stylesheets itself. A script a widget needs is attached to the specific page that shows the widget, not to every page in the panel. A widget that draws something has a test that its rendered root is the widget's own markup, so the same mistake fails a test rather than an admin's afternoon.

## What this prevents

Prevents a whole class of admin features that exist in the code, pass every test and are simply absent from the screen — the most expensive kind of defect, because it is discovered only when somebody goes looking for the feature and finds nothing. It also keeps the admin panel from loading map code on pages that have no map.

## Revisit when

A second widget needs the same script on several pages, at which point it may belong in the panel's shared assets instead of a per-page hook.

---

*See also: [[decisions/product/map-correctness-needs-a-browser]] · [[decisions/product/the-map-library-stays-patched]]*
