# Doc 1: The Big Picture

The discovery map (`/mapa`) is the core feature of UNI. It lets users browse no/low-alcohol venues on a split layout: a scrollable list on the left, an interactive map on the right.

---

## The Technology Stack

Three layers collaborate on this page:

| Layer | Technology | What it owns |
|---|---|---|
| Server | PHP / Livewire | Filters, DB queries, HTML list |
| Client state | Alpine.js | Map lifecycle, hover, pin select |
| Map rendering | Leaflet.js | Tiles, markers, clusters, popups |

**Key mental model:** Livewire owns the *list*. Alpine owns the *map*. They talk to each other through events.

---

## The Files

```
app/
  Livewire/DiscoveryPage.php      ← Livewire component (filters, query, render)
  Services/
    DiscoveryFilters.php          ← Value object holding all active filters
    DiscoveryVenueQuery.php       ← Builds + runs the Eloquent query
    DiscoveryMapData.php          ← Shapes venue data for the map (JS-friendly)

resources/
  views/
    livewire/discovery-page.blade.php   ← The main template
    components/venue-tile.blade.php     ← One venue card in the list

  js/
    app.js           ← Registers Alpine components
    discovery.js     ← The Alpine `discovery()` component (the map brain)
    map-config.js    ← Tile URLs, zoom limits, Poland bounds
    analytics.js     ← PostHog event capture wrapper
    venue-map.js     ← Mini-map on venue detail pages (unrelated)
```

---

## The Two Worlds

The page has **two parallel representations of the venues**:

1. **The list** (`$venues`) — full Eloquent models, rendered server-side as Blade HTML cards
2. **The map** (`$venuesForMap`) — slim PHP arrays, serialised to JavaScript as `window.__discoveryInitialVenues`

Both come from the same query result but are shaped differently. The list needs rich HTML. The map only needs `id`, `lat`, `lng`, `name`, and a few other scalars.

---

## Who Does What on a Filter Change

When a user clicks a filter (e.g. "Zweryfikowane"):

```
1. wire:model.live fires → Livewire sends the new value to the server
2. DiscoveryPage::render() runs again on the server
3. A fresh DB query runs through DiscoveryVenueQuery
4. Blade re-renders the venue list HTML → Livewire patches the DOM
5. DiscoveryPage::dispatch('venues-updated', ...) fires
6. Alpine catches 'venues-updated' → calls updateMarkers() → redraws map pins
```

The list and map always stay in sync because they both update from the same render cycle.

---

## Next Documents

- **Doc 2** — How venue data flows from DB to the map
- **Doc 3** — How filters work (Livewire state + PHP query)
- **Doc 4** — Map markers: creation, category icons, clustering
- **Doc 5** — Interactivity: hover, click, popups
- **Doc 6** — URL management (why some params use Livewire, some use replaceState)
