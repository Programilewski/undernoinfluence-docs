# Doc 6: URL Management

The discovery page keeps the browser URL in sync with the active filters so users can share or bookmark their results. There are two separate mechanisms for this — and understanding why they're split is the key insight.

---

## Two Mechanisms, Two Reasons

| Filter | Mechanism | URL example |
|---|---|---|
| Categories | Livewire `#[Url]` | `?kategorie[]=piwo` |
| Verified | Livewire `#[Url]` | `?zweryfikowane=1` |
| Freshness | Livewire `#[Url]` | `?aktualnosc=30` |
| Sort | Livewire `#[Url]` | `?sortuj=name` |
| Search | Livewire `#[Url]` | `?szukaj=kraftowy` |
| **City (single)** | Alpine `replaceState` | `/mapa/warszawa` |
| **City (multiple)** | Alpine `replaceState` | `/mapa?miasta[0]=warszawa&miasta[1]=krakow` |
| **Districts** | Alpine `replaceState` | `?dzielnice[0]=5` |

---

## Livewire #[Url] — the Simple Cases

For most filters, Livewire handles URL sync automatically. Just add `#[Url]` to the property:

```php
#[Url(as: 'aktualnosc', except: '')]
public string $freshness = '';
```

When `$freshness` changes, Livewire adds `?aktualnosc=30` to the URL. When the page loads with `?aktualnosc=30`, Livewire sets `$freshness = '30'`.

`as: 'aktualnosc'` — the URL key (Polish for the user, English in PHP)
`except: ''` — skip adding to URL when the value is the default (empty string)

This covers the simplest case: query string parameters.

---

## Why Cities Need Special Treatment

If you filter by one city, the ideal URL is `/mapa/warszawa` — a clean, readable path segment that's good for SEO and sharing. Query strings like `?miasta[]=warszawa` are ugly and not the desired canonical URL.

The problem: Livewire's `#[Url]` can only handle **query string parameters**. It cannot change the **path** of the URL. So cities are handled differently.

---

## The replaceState Flow

When the city selection changes, `DiscoveryPage` dispatches a Livewire event:

```php
private function syncUrl(): void
{
    $this->dispatch('sync-discovery-url',
        cities: $this->selectedCities,
        districts: $this->selectedDistricts,
    );
}
```

`dispatch()` sends a named event from PHP to the browser. Alpine listens for it:

```js
Livewire.on('sync-discovery-url', (data) => {
    this.syncDiscoveryUrl(data.cities, data.districts);
});
```

Then `syncDiscoveryUrl()` rewrites the URL:

```js
syncDiscoveryUrl(cities, districts) {
    const url = new URL(window.location);

    // Remove any existing city/district params
    for (const key of [...url.searchParams.keys()]) {
        if (key.startsWith('miasta') || key.startsWith('dzielnice')) {
            url.searchParams.delete(key);
        }
    }

    // Set path for single city, query params for multiple
    if (cities.length === 1) {
        url.pathname = '/mapa/' + encodeURIComponent(cities[0]);
    } else {
        url.pathname = '/mapa';
        cities.forEach((c, i) =>
            url.searchParams.set('miasta[' + i + ']', c)
        );
    }

    // Always put districts in query params
    districts.forEach((d, i) =>
        url.searchParams.set('dzielnice[' + i + ']', d)
    );

    history.replaceState(null, '', url.toString());
}
```

**`history.replaceState`** — this is a browser API that changes the URL displayed in the address bar *without* triggering a page reload or adding a new browser history entry. It's how single-page apps manage URLs.

The user sees `/mapa/warszawa` in the address bar, but the page never actually navigated there — the URL was just updated in place.

---

## Reading Cities/Districts on Page Load

Since cities aren't in `#[Url]`, Livewire doesn't auto-populate them. Instead, `mount()` reads the URL manually on the initial page load:

```php
public function mount(?string $city = null): void
{
    // City comes from the route parameter for /mapa/{city}
    if ($city) {
        City::active()->where('slug', $city)->firstOrFail();
        $this->selectedCities = [$city];
    } else {
        // Or from ?miasta[]=... for multiple cities
        $raw = array_slice((array) request()->input('miasta', []), 0, 10);
        $this->selectedCities = array_values(array_filter(
            array_map('strval', $raw),
            fn (string $s): bool => (bool) preg_match('/^[a-z][a-z0-9-]{0,60}$/', $s),
        ));
    }

    // Districts from ?dzielnice[]=...
    $rawDistricts = array_slice((array) request()->input('dzielnice', []), 0, 50);
    $this->selectedDistricts = array_values(array_filter(
        array_map('strval', $rawDistricts),
        fn (string $s): bool => ctype_digit($s),
    ));
}
```

`mount()` runs only once, on the first HTTP request — not on subsequent Livewire updates. Notice the input validation: city slugs must match a regex pattern, district IDs must be numeric. This prevents garbage from landing in the filters.

---

## The Route Definition

The Laravel router defines two routes for the discovery page:

```
/mapa              → DiscoveryPage (no city)
/mapa/{city}       → DiscoveryPage (city slug as route parameter)
```

The `{city}` route parameter is injected into `mount(?string $city = null)` automatically by Laravel's dependency injection. Both routes serve the same Livewire component.

---

## Canonical URLs for SEO

The Blade template sets a canonical `<link>` so search engines know the preferred URL for each page state:

```php
$canonicalUrl = count($this->selectedCities) === 1
    ? route('discovery', ['city' => $this->selectedCities[0]])
    : route('discovery');
```

If one city is selected → canonical is `/mapa/warszawa`.
Otherwise → canonical is `/mapa` (no city in the path).

Multi-city views and filter combinations are not individually canonicalised (they'd be near-infinite). The canonical points to the clean base URL.

---

## Clearing Bounds (Map Area Filter)

The "Obszar mapy" (map area) filter works differently — it stores lat/lng bounds directly in Livewire properties but never puts them in the URL:

```php
public ?float $boundsNorth = null;
public ?float $boundsSouth = null;
public ?float $boundsEast = null;
public ?float $boundsWest = null;
```

These are cleared with a simple "X" button:

```php
public function clearBounds(): void
{
    $this->reset(['boundsNorth', 'boundsSouth', 'boundsEast', 'boundsWest']);
}
```

Bounds are intentionally not persisted in the URL — a bookmarked map area would be confusing if the user later visits the link from a different context.
