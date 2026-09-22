# Doc 7: The Alpine Component — How It All Connects

Alpine.js is the client-side glue between the Livewire-rendered list and the Leaflet map. This document explains how Alpine works in this project and how `discovery()` is structured.

---

## What Alpine Is

Alpine.js is a lightweight JavaScript framework (no build step, no virtual DOM) that lets you add reactive behaviour directly in HTML attributes. Think of it as "jQuery for the modern era, but with a clear state model."

In this project, Alpine is used for:
- Managing which view is visible (list vs map) on mobile
- Initialising and updating the Leaflet map
- Handling hover, click, and selection state for map pins
- Syncing the URL when cities change

---

## How `discovery()` Is Registered

`resources/js/app.js`:

```js
import discovery from './discovery.js';

document.addEventListener('alpine:init', () => {
    Alpine.data('discovery', discovery);
});
```

`Alpine.data('discovery', discovery)` registers a factory function under the name `'discovery'`. It's not yet called here — Alpine will call it when it encounters an element with `x-data="discovery()"` in the HTML.

---

## Where Alpine Takes Over in the Blade

```html
<div x-data="discovery()" class="flex-1 flex flex-col ...">
```

This is the root element of the Livewire component's output. When Alpine initialises, it calls `discovery()` to get the component's state object, then makes all properties and methods available inside this `<div>` and all its children.

---

## The State Object Structure

`discovery()` returns a plain JavaScript object. Everything in it is available in Alpine's HTML attributes:

```js
{
    // Properties (state)
    currentView: 'list',    // 'list' or 'map'
    isDesktop: false,
    mapReady: false,
    leafletMap: null,       // the Leaflet L.Map instance
    markerCluster: null,    // the Leaflet MarkerCluster instance
    markerMap: {},          // { venueId: LeafletMarker }
    selectedPinId: null,
    latestVenues: [],
    ...

    // Methods (called from HTML @click, @mouseenter, etc.)
    init() { ... },         // Alpine calls this automatically on startup
    toggleView() { ... },
    highlightPin(id) { ... },
    onCardClick(...) { ... },
    ...
}
```

In the HTML, you can reference any property or call any method:
```html
<span x-text="currentView === 'list' ? '🗺️ Mapa' : '📄 Lista'"></span>
<div x-show="currentView === 'map' || isDesktop">...</div>
```

---

## Alpine Directives Used in This Project

| Directive | What it does |
|---|---|
| `x-data="discovery()"` | Mounts the Alpine component |
| `x-show="..."` | Toggles `display:none` based on expression |
| `x-cloak` | Hides element until Alpine initialises (prevents flash) |
| `x-ref="mapEl"` | Names a DOM element for access via `this.$refs.mapEl` |
| `x-text="..."` | Sets the element's text content |
| `x-transition` | Adds fade/slide animation when `x-show` toggles |
| `@click="..."` | Shorthand for `x-on:click` |
| `@mouseenter="..."` | Shorthand for `x-on:mouseenter` |
| `x-data="{ open: false }"` | Inline component for small local state (city dropdown) |
| `@click.away="..."` | Fires when clicking outside the element |
| `x-model="q"` | Two-way bind to a local Alpine variable |

---

## `init()` — the Startup Method

Alpine calls `init()` automatically when the component is mounted. Here's what it does:

```js
init() {
    // 1. Respond to window resize → update isDesktop, init map if needed
    window.addEventListener('resize', this.onResize.bind(this));

    // 2. Respond to dark/light mode toggle → swap tile layer
    window.addEventListener('uni:theme-changed', (e) => {
        this.swapTiles(e.detail.dark);
    });

    // 3. Listen for Livewire filter changes → redraw map pins
    Livewire.on('venues-updated', (data) => { ... });

    // 4. Listen for Livewire city changes → update the URL
    Livewire.on('sync-discovery-url', (data) => { ... });

    // 5. Init the map immediately if on desktop
    if (this.isDesktop) {
        this.$nextTick(() => this.initMap(this.latestVenues));
    }

    // 6. Set up scroll-based impression tracking
    this.setupImpressionTracking();
}
```

`this.$nextTick(() => ...)` is Alpine's equivalent of "run this after the DOM has finished updating." It's needed here because the map container `<div>` must be visible (rendered) before Leaflet can measure its dimensions.

---

## Talking from Alpine to Livewire

Alpine can call Livewire methods via `this.$wire`:

```js
// Call a Livewire method
this.$wire.searchInArea(north, south, east, west);

// Set a Livewire property
this.$wire.set('sort', 'best');

// Call another method
this.$wire.setUserLocation(lat, lng);
```

`$wire` is injected by Livewire into all Alpine components that live inside a Livewire component's HTML. It's a proxy that sends the call to the server as an AJAX request.

---

## Talking from Livewire to Alpine

The PHP component dispatches events:

```php
$this->dispatch('venues-updated', venues: $venuesForMap, activeCategories: $this->categories);
```

Alpine listens:

```js
Livewire.on('venues-updated', (data) => {
    this.latestVenues = data.venues;
    ...
});
```

This is a one-way broadcast: PHP → browser event → Alpine handler.

---

## The Mobile View Toggle

On mobile, only one pane is visible at a time. The toggle button:

```html
<button @click="toggleView()">
    <span x-text="currentView === 'list' ? '🗺️ Mapa' : '📄 Lista'"></span>
</button>
```

```js
toggleView() {
    if (this.currentView === 'list') {
        // Save scroll position before leaving list
        this.listScrollTop = document.getElementById('view-list')?.scrollTop ?? 0;
        this.currentView = 'map';

        // Init the map now if it hasn't been yet
        if (!this.mapReady) {
            this.$nextTick(() => this.initMap(this.latestVenues));
        } else {
            // If already init'd, just tell Leaflet the container size may have changed
            this.$nextTick(() => this.leafletMap?.invalidateSize());
        }
    } else {
        this.currentView = 'list';
        // Restore scroll position
        this.$nextTick(() => {
            const list = document.getElementById('view-list');
            if (list) list.scrollTop = this.listScrollTop;
        });
    }
}
```

`leafletMap.invalidateSize()` — Leaflet needs to be told when its container changes size (e.g. goes from `display:none` to visible). Without this call, the map tiles don't fill the container correctly.

---

## The Inline Alpine Components (Dropdowns)

The city and district dropdowns are not part of the main `discovery()` component. They use inline `x-data`:

```html
<div x-data="{ open: false, q: '' }" @click.away="open = false; q = ''">
    <button @click="open = !open">Miasta</button>
    <div x-show="open">
        <input x-model="q" placeholder="Szukaj miasta…" />
        <label x-show="!q || 'warszawa'.includes(q.toLowerCase())">
            ...
        </label>
    </div>
</div>
```

`x-data="{ open: false, q: '' }"` creates a small local scope just for this dropdown. `open` and `q` are only accessible inside this `<div>`. This is the idiomatic Alpine way to handle small, isolated interactive elements without adding to the main component.

`@click.away` closes the dropdown when clicking outside it.

`x-model="q"` binds the search input to the local `q` variable. The `x-show` on each city label does live filtering by checking if the city name includes the typed query.
