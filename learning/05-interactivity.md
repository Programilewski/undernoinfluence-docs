# Doc 5: Interactivity — Hover, Click, and Popups

This explains what happens when you interact with venue cards in the list or pins on the map.

---

## The venue-tile Component

Each venue card in the list is rendered by `resources/views/components/venue-tile.blade.php`. The outer `<div>` has several Alpine event handlers:

```html
<div class="venue-item ..."
    data-id="{{ $venue->id }}"
    data-lat="{{ $venue->latitude }}"
    data-lng="{{ $venue->longitude }}"
    @mouseenter="highlightPin({{ $venue->id }})"
    @mouseleave="unhighlightPin({{ $venue->id }})"
    @click="!$event.target.closest('button, a')
            && (window.location.href = '{{ route('venues.show', $venue->slug) }}')">
```

These `@` attributes are Alpine event listeners that call methods on the parent `discovery()` component.

---

## Hover Highlight

When you hover a venue card, the corresponding map pin brightens.

### In the Blade template:
```html
@mouseenter="highlightPin({{ $venue->id }})"
@mouseleave="unhighlightPin({{ $venue->id }})"
```

### In discovery.js:
```js
highlightPin(venueId) {
    if (!this.mapReady) return;
    const pinEl = this.markerMap[venueId]?.getElement();
    if (pinEl)
        pinEl.style.filter = 'brightness(1.6) drop-shadow(0 0 5px rgba(255,255,255,0.6))';
},

unhighlightPin(venueId) {
    if (!this.mapReady) return;
    const pinEl = this.markerMap[venueId]?.getElement();
    if (pinEl) pinEl.style.filter = '';
},
```

`this.markerMap[venueId]` does an instant lookup (it's just a plain JS object). `.getElement()` returns the actual DOM element of the Leaflet marker. Then a CSS filter is applied/removed directly on that element — no re-render needed.

The `?.` syntax is "optional chaining" — if `markerMap[venueId]` is undefined (e.g. the venue has no coordinates), the whole expression short-circuits to `undefined` instead of throwing an error.

---

## Card Click → Map Focus

When you click "Na mapie" (the map pin button) in a venue card:

```html
<button @click.stop="onCardClick($event, {{ $venue->id }},
    {{ $venue->latitude ?? 'null' }},
    {{ $venue->longitude ?? 'null' }})">
```

`.stop` prevents the click from bubbling up to the parent `<div>` (which would navigate to the venue detail page).

### On Desktop:
```js
if (this.isDesktop) {
    const marker = this.markerMap[venueId];
    if (marker) {
        this.selectPin(venueId);
        this.leafletMap.flyTo(marker.getLatLng(), 16, { duration: 0.5 });
        marker.openPopup();
    }
}
```

`flyTo()` animates the map camera to the pin's location at zoom level 16, taking 0.5 seconds.

### On Mobile:
```js
} else {
    this.listScrollTop = document.getElementById('view-list')?.scrollTop ?? 0;
    this.currentView = 'map'; // switches to map view
    // ... initialises the map if not already done
    const marker = this.markerMap[venueId];
    if (marker) {
        this.selectPin(venueId);
        this.leafletMap.panTo(marker.getLatLng());
        marker.openPopup();
    }
}
```

On mobile there is no split layout — only one view is visible at a time. Clicking "Na mapie" switches to the map view and pans (without animation) to the pin.

`this.listScrollTop` saves the current scroll position so that switching back to list view restores it.

---

## Pin Selection (the "selected" state)

Pin selection is distinct from hover highlight. A pin becomes "selected" when:
- You click a map pin directly
- You click "Na mapie" in a card

```js
selectPin(venueId) {
    this.deselectPins(); // clear any previous selection
    this.selectedPinId = venueId;
    const pin = this.markerMap[venueId]
        ?.getElement()
        ?.querySelector('.venue-pin');
    if (pin) pin.classList.add('venue-pin--selected');
},

deselectPins() {
    if (this.selectedPinId !== null) {
        const pin = this.markerMap[this.selectedPinId]
            ?.getElement()
            ?.querySelector('.venue-pin');
        if (pin) pin.classList.remove('venue-pin--selected');
    }
    this.selectedPinId = null;
},
```

Selection adds/removes a CSS class `venue-pin--selected`. The visual effect (e.g. a ring around the pin) is defined in CSS. When the popup is closed, `deselectPins()` is called automatically:

```js
marker.on('popupclose', () => {
    this.deselectPins();
});
```

---

## The Cluster Animation Edge Case

When you click a pin that is inside a cluster, Leaflet first animates the cluster "exploding" to reveal individual pins. During this animation, the pin DOM element doesn't yet exist, so `querySelector('.venue-pin')` would return null.

The solution:

```js
this.markerCluster.on('animationend', () => {
    if (this.selectedPinId !== null) {
        const pin = this.markerMap[this.selectedPinId]
            ?.getElement()
            ?.querySelector('.venue-pin');
        if (pin) pin.classList.add('venue-pin--selected');
    }
});
```

After the cluster animation finishes, the code re-applies the selected class to whichever pin should be selected. This is essentially "re-try after the DOM settles."

---

## Clicking the Whole Card (Not a Button)

The outer card div navigates to the venue page, but only if the click didn't land on a `<button>` or `<a>`:

```html
@click="!$event.target.closest('button, a')
        && (window.location.href = '{{ route('venues.show', $venue->slug) }}')"
```

`$event.target.closest('button, a')` walks up the DOM tree from the clicked element and returns the nearest `<button>` or `<a>` ancestor (if any). If found, `!<truthy>` is `false` and the right side of `&&` is never evaluated — so no navigation happens. This lets the "Na mapie", "Nawiguj", and "Zapisz" buttons work without navigating away.

---

## Card Impression Tracking

Alpine tracks which cards a user actually *sees* (not just loads). This is done with the browser's `IntersectionObserver` API.

```js
this._impressionObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
        const id = parseInt(entry.target.dataset.id);

        if (entry.isIntersecting) {
            // Start a 500ms timer
            this._impressionTimers.set(id, setTimeout(() => {
                this._impressedIds.add(id);
                capture('venue_card_impressed', {
                    venue_id: id,
                    position: cards.indexOf(entry.target) + 1,
                });
            }, 500));
        } else {
            // Cancel timer if card scrolled away before 500ms
            clearTimeout(this._impressionTimers.get(id));
        }
    }
}, { threshold: 0.5 }); // 50% of the card must be visible
```

An event fires to PostHog only if the card stayed 50%+ visible for at least 500ms — so rapid scrolling doesn't count as "seeing" a card. Each card is only counted once (the `_impressedIds` Set tracks this).

When Livewire re-renders the list (filter changes), new cards are added to the DOM. A `MutationObserver` watches for these additions and registers them with the `IntersectionObserver` automatically.

---

## The Navigate Button

The "Nawiguj" button is different from "Na mapie". It opens Google Maps directions in a new tab:

```html
@click.stop="window.open(
    '{{ route('venues.redirect', [$venue->slug, 'directions']) }}',
    '_blank',
    'noopener'
)"
```

The route goes to `VenueRedirectController`, which issues a redirect to a maps URL and also records the click in `venue_stats`. This means the navigation click count is tracked server-side without any client-side API call.
