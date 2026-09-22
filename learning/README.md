# UNI Learning Docs

A series of documents explaining how the app works, from the whole-app request flow down to the `/mapa` discovery page specifically.

Read in order — each doc builds on the previous.

---

## Documents

0. **[00-app-flow-overview.md](00-app-flow-overview.md)** — Whole-app tour: routes, controllers, the `Venue` model, analytics architecture, write-path actions, Filament admin/owner panels, the claim flow
1. **[01-overview.md](01-overview.md)** — The big picture: files, technologies, and who owns what
2. **[02-data-flow.md](02-data-flow.md)** — How venues travel from the database to map pins
3. **[03-filters-and-livewire.md](03-filters-and-livewire.md)** — How filters work (Livewire state, PHP queries)
4. **[04-map-markers-and-clustering.md](04-map-markers-and-clustering.md)** — Marker creation, category icons, clustering
5. **[05-interactivity.md](05-interactivity.md)** — Hover highlight, card click, pin select, popups
6. **[06-url-management.md](06-url-management.md)** — Why URLs are managed two different ways
7. **[07-alpine-component.md](07-alpine-component.md)** — How Alpine.js connects everything

---

## Suggested Reading Path

**First time:** Read 00 for the whole-app picture, then 01 → 02 → 03 for the discovery map specifically.

**When debugging the map:** Go to 04 → 05.

**When URLs/links are broken:** Go to 06.

**When something feels broken between list and map:** Go to 07 (how Livewire and Alpine talk).
