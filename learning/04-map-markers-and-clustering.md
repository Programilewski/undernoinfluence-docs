# Doc 4: Map Markers, Categories, and Clustering

This explains how the Leaflet map is initialised, how pins are created (including their category-aware icons), and how clustering works.

---

## Leaflet in One Paragraph

Leaflet is a JavaScript mapping library. It draws an interactive map in a `<div>` by loading image tiles (small square map images from a server) and letting you place markers, draw shapes, etc. on top. Every marker has an *icon* — by default a blue balloon, but we use custom HTML icons called `divIcon`.

---

## Map Initialisation

The map is created in `initMap()` inside `discovery.js`. This only happens once:

```js
this.leafletMap = L.map(this.$refs.mapEl, {
    minZoom: 6,
    maxBounds: L.latLngBounds([[49.0, 14.1], [54.9, 24.2]]), // Poland
    preferCanvas: true,
    // ... performance options
});
```

`this.$refs.mapEl` refers to the `<div id="map" x-ref="mapEl">` in the Blade template. Alpine's `x-ref` is a way to get a reference to a DOM element without `document.getElementById`.

**When does the map init?**
- Desktop: immediately on `init()` (the page loads with the map visible)
- Mobile: deferred until the user taps the "Mapa" toggle button (saves resources)

---

## Tile Layers (The Map Background)

Tiles are the background images that form the map. Two providers are used:

- **Dark mode:** CARTO dark tiles
- **Light mode:** OpenStreetMap tiles

They're defined in `map-config.js` and swapped on the `uni:theme-changed` event:

```js
window.addEventListener('uni:theme-changed', (e) => {
    this.swapTiles(e.detail.dark);
});
```

---

## Marker Clustering

Before any markers are added, a cluster group is created:

```js
this.markerCluster = L.markerClusterGroup({
    maxClusterRadius: 50,    // px — markers within this range merge into one cluster
    chunkedLoading: true,    // adds markers in batches to avoid freezing the UI
    spiderfyOnMaxZoom: true, // click a cluster at max zoom → pins spread out like a spider
    showCoverageOnHover: false,
    iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        const size = count < 10 ? 'small' : count < 30 ? 'medium' : 'large';
        return L.divIcon({
            html: '<div>' + count + '</div>',
            className: 'marker-cluster marker-cluster-' + size,
            iconSize: L.point(40, 40),
        });
    },
});
```

`iconCreateFunction` controls what a cluster bubble looks like. It renders an HTML `<div>` containing the count number. CSS classes `marker-cluster-small/medium/large` apply different background colours.

All markers are added to `this.markerCluster`, not directly to `this.leafletMap`. Leaflet Markercluster handles the grouping automatically.

---

## Creating One Marker

Every time venues are updated, `updateMarkers()` runs. It clears all existing markers and rebuilds them from scratch.

For each venue with a valid lat/lng:

### Step 1: Decide which category to show on the pin

```js
const filterSet = activeCategories.length > 0
    ? new Set(activeCategories)
    : null;

// If a category filter is active, only consider those categories.
// Otherwise consider all of the venue's categories.
const candidates = filterSet
    ? venue.categories.filter((c) => filterSet.has(c.slug))
    : venue.categories;

// Pick the category with the highest product count
const topCat = candidates.length
    ? [...candidates].sort((a, b) => b.count - a.count)[0]
    : null;
```

**Why this logic matters:** If you filter by "piwo", pins should show the beer count, not the total. If no filter is active, the dominant category wins.

### Step 2: Build the pin HTML

```js
const topMeta = topCat ? this.categoryMeta[topCat.slug] : null;

const pinInner = topCat
    ? `<span class="venue-pin__cat venue-pin__cat--main"
            style="color:${topMeta?.color || 'var(--color-primary)'}">
          <span class="venue-pin__cat-icon">${topMeta?.icon || ''}</span>
          ${topCat.count}
       </span>`
    : `<span class="venue-pin__cat venue-pin__cat--main">
          ${venue.product_count}
       </span>`;
```

If a top category exists: show its SVG icon + count in the category colour.
If no categories at all: show the raw total product count.

### Step 3: Create the icon

```js
const icon = L.divIcon({
    className: '',
    html: `<div class="venue-pin venue-pin--rich${verifiedClass}">${pinInner}</div>`,
    iconSize: [null, null],
    iconAnchor: [20, 30],   // the pixel offset of the "tip" of the pin
    popupAnchor: [0, -30],  // where the popup appears relative to the anchor
});
```

`L.divIcon` lets you use arbitrary HTML as a marker icon instead of an image file.

`venue-pin--verified` is added as a CSS class when `venue.is_verified` is true — this triggers a visual indicator (e.g. a border colour).

### Step 4: Add to the cluster

```js
const marker = L.marker([venue.lat, venue.lng], { icon });
marker._venueData = venue; // store data on the marker for later use

this.markerCluster.addLayer(marker);
this.markerMap[venue.id] = marker; // keep a lookup by venue ID
```

`this.markerMap` is a plain JS object used as a dictionary: `{ 42: <LeafletMarker>, 57: <LeafletMarker>, ... }`. This is how Alpine can instantly find and manipulate any marker by venue ID without searching through all markers.

---

## Tooltips (Desktop Only)

On desktop, hovering a pin shows a tooltip with the venue name:

```js
if (isDesktop) {
    marker.bindTooltip(venue.name, {
        direction: 'top',
        offset: [0, -42],
        className: 'leaflet-tooltip-venue',
    });
}
```

Tooltips are skipped on mobile because you need to tap to interact.

---

## Popups (All Devices)

Every marker has a popup with rich info:

```js
marker.bindPopup(`
    <div class="popup-venue-header">
        <div class="popup-venue-name">${venue.name}</div>
        ${typeBadge}
        ${verifiedBadge}
    </div>
    <div class="popup-venue-address">${venue.address}</div>
    ${catsHtml}
    ${freshnessHtml}
    <a href="/miejsce/${venue.slug}" class="popup-venue-link">
        Zobacz lokal →
    </a>
`, { maxWidth: 280, minWidth: 200 });
```

This HTML is a string built in JavaScript. The link goes to the venue detail page.

---

## Auto-fitting the Map Bounds

After markers are added, the map zooms and pans to fit all visible pins:

```js
if (fitBounds && bounds.length > 0) {
    this.leafletMap.fitBounds(bounds, {
        padding: [30, 30],
        maxZoom: 15,
    });
}
```

`maxZoom: 15` prevents zooming in too far when there's only one result.

If there are zero results (empty `bounds` array) and a default city is set, it falls back to the city's stored centre coordinates.

**`fitBounds` is skipped** when `shouldAutoFitMarkers()` returns false — specifically when the user is on mobile and currently viewing the map. This prevents the map from jumping around while the user is browsing it.
