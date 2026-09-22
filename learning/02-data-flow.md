# Doc 2: How Venues Get from Database to Map

This traces the full journey of a venue — from the database row to a pin on the Leaflet map.

---

## Step 1: The Query (DiscoveryVenueQuery)

`app/Services/DiscoveryVenueQuery.php`

This is a plain PHP class (a "service") whose only job is to take a `DiscoveryFilters` object and return a collection of `Venue` models.

```php
$venues = app(DiscoveryVenueQuery::class)->get($filters);
```

Key things it always loads with the query:

```php
Venue::active()
    ->with(['city', 'districtRelation', 'products.category:id,name,slug', 'drinks'])
    ->withCount(['products', 'drinks'])
```

- `->active()` — only published venues (a scope on the Venue model)
- `->with([...])` — loads relationships in one extra query (avoids N+1 problems)
- `->withCount([...])` — adds `products_count` and `drinks_count` integer columns

The query is then filtered by whatever is active (city, category, search text, etc.) — covered in Doc 3.

---

## Step 2: Shaping Data for the Map (DiscoveryMapData)

`app/Services/DiscoveryMapData.php`

The Eloquent collection from Step 1 is too heavy for JavaScript — you don't want to serialise entire PHP objects with all their relationships. `DiscoveryMapData::forVenues()` transforms each `Venue` into a slim plain array:

```php
[
    'id'              => 42,
    'name'            => 'Bar Przykładowy',
    'slug'            => 'bar-przykladowy',
    'lat'             => 52.2297,
    'lng'             => 21.0122,
    'product_count'   => 14,
    'is_verified'     => true,
    'address'         => 'ul. Nowa 1, Warszawa',
    'venue_type'      => 'Bar',
    'categories'      => [
        ['slug' => 'piwo', 'count' => 8],
        ['slug' => 'drinki', 'count' => 6],
    ],
    'freshness_label' => '3 dni temu',
    'freshness_state' => 'fresh',
]
```

**The 500-venue cap:** `$venues->take(500)` — only the first 500 venues are prepared for the map. This is a performance guard; Leaflet handles hundreds of markers fine but thousands would be sluggish.

**Category count logic:** For each category, it counts matching products. The `drinki` category is special — it also adds custom drinks (the `venue_drinks` table) to its count.

---

## Step 3: Passing Data to JavaScript

At the bottom of `discovery-page.blade.php` there is an inline `<script>` block:

```html
<script>
    window.__discoveryInitialVenues = @js($venuesForMap);
    window.__discoveryActiveCategories = @js($categories);
    window.__discoveryCategories = @js($allCategories->mapWithKeys(...));
    window.__discoveryDefaultCity = @js($defaultCity);
</script>
```

`@js(...)` is a Blade helper that JSON-encodes a PHP value and escapes it safely for JavaScript. This data lands on `window` globals so Alpine can read it without an extra HTTP request.

---

## Step 4: Alpine Picks Up the Data

`resources/js/discovery.js`

When the Alpine component initialises, it reads from those globals:

```js
latestVenues: window.__discoveryInitialVenues || [],
categoryMeta: window.__discoveryCategories || {},
```

Then the map is initialised and `updateMarkers()` is called with those venues. This builds the Leaflet pins (covered in Doc 4).

---

## Step 5: What Happens on Filter Changes

After the initial page load, venues are updated via a Livewire event rather than globals:

```js
Livewire.on('venues-updated', (data) => {
    this.latestVenues = data.venues || [];
    this.latestActiveCategories = data.activeCategories || [];

    if (this.mapReady) {
        this.updateMarkers(this.latestVenues, this.latestActiveCategories, {
            fitBounds: this.shouldAutoFitMarkers(),
        });
    }
});
```

On every `render()` in the Livewire component, this event is dispatched:

```php
$this->dispatch('venues-updated', venues: $venuesForMap, activeCategories: $this->categories);
```

So after any filter change: PHP re-queries → reshapes data → dispatches event → Alpine gets the new venue array → map pins are cleared and redrawn.

---

## The Two Data Sets Side by Side

```
render() runs
     │
     ├── $venues (Eloquent Collection)
     │       └── passed to Blade → rendered as <div class="venue-item"> cards
     │
     └── $venuesForMap (plain PHP array)
             └── dispatched as venues-updated event → Alpine → Leaflet pins
```

The list and map are fed by the same source but shaped differently for their consumers.

---

## The Two Categories Sources

There is also `$allCategories` — these are the `Category` models for the filter pills. They come from:

```php
$allCategories = $mapData->categories();
// → Category::activeVisible()->orderBy('sort_order')->get()
```

These are passed to:
1. Blade (for the filter pills and venue-tile display)
2. JavaScript as `window.__discoveryCategories` (for marker icon colours and labels in popups)
