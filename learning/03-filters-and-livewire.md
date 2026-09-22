# Doc 3: Filters and How Livewire Works

This explains how each filter on the discovery page stores its state, reacts to user input, and translates into a database query.

---

## What Livewire Is (in One Paragraph)

Livewire lets you write PHP classes that behave like reactive UI components. Each public property on the class is a piece of state. When a property changes, Livewire automatically sends it to the server, re-runs `render()`, and patches the DOM with the new HTML. You don't write any fetch/AJAX code — Livewire handles all of it over WebSocket-like requests behind the scenes.

---

## The State Properties in DiscoveryPage

```php
// These sync to the URL automatically (via #[Url])
public array $categories = [];      // ?kategorie[]=piwo&kategorie[]=wino
public bool $verified = false;      // ?zweryfikowane=1
public string $freshness = '';      // ?aktualnosc=7
public string $sort = 'best';       // ?sortuj=name
public string $search = '';         // ?szukaj=kraftowy

// These do NOT sync automatically — managed manually via Alpine replaceState
public array $selectedCities = [];
public array $selectedDistricts = [];

// These are ephemeral — never in the URL
public ?float $userLat = null;
public ?float $userLng = null;
public ?float $boundsNorth = null;
// ... etc
```

---

## The #[Url] Attribute

Properties marked `#[Url]` are automatically read from and written to the browser URL query string:

```php
#[Url(as: 'aktualnosc', except: '')]
public string $freshness = '';
```

- `as: 'aktualnosc'` — the URL parameter name (Polish, user-facing)
- `except: ''` — don't add to URL when the value is this (avoids `?aktualnosc=` clutter)

When the page loads, Livewire reads `?aktualnosc=30` from the URL and populates `$freshness = '30'` automatically.

---

## wire:model.live

In the Blade template, filters are bound to Livewire properties:

```html
<input wire:model.live.debounce.300ms="search" ... />

<input type="checkbox" wire:model.live="verified" ... />
<input type="checkbox" wire:model.live="categories" value="piwo" ... />
```

- `wire:model` — two-way binding (HTML element ↔ Livewire property)
- `.live` — sends the value to the server immediately on change (not on form submit)
- `.debounce.300ms` — waits 300ms after the user stops typing (avoids a server call on every keypress)

**Without `.live`**, changes would only be sent when the form is explicitly submitted.

---

## The Updated Hooks

These PHP methods run automatically whenever a specific property changes:

```php
public function updatedSearch(string $value): void
{
    if (strlen($value) > 100) {
        $this->search = substr($value, 0, 100);
        return;
    }
    if ($value !== '') {
        $this->searchChanged = true; // for analytics
    }
}

public function updatedSelectedCities(): void
{
    if ($this->selectedCities === []) {
        $this->selectedDistricts = []; // clear districts when city cleared
    }
    $this->syncUrl(); // push cities to browser URL manually
}
```

Naming convention: `updated` + StudlyCasedPropertyName.

---

## The DiscoveryFilters Value Object

All filter state is packed into a single read-only object before the query runs:

```php
private function filters(): DiscoveryFilters
{
    return new DiscoveryFilters(
        categories: $this->categories,
        selectedCities: $this->selectedCities,
        verified: $this->verified,
        freshness: $this->freshness,
        sort: $this->sort,
        search: $this->search,
        userLat: $this->userLat,
        // ... etc
    );
}
```

This "value object" pattern has one benefit: `DiscoveryVenueQuery` doesn't need to know about the Livewire component — it just receives a plain PHP object with all the data it needs. This makes the query logic easy to test in isolation.

---

## How Each Filter Hits the Database

Inside `DiscoveryVenueQuery::get()`:

```php
// City filter
if ($filters->selectedCities !== []) {
    $cityIds = City::active()->whereIn('slug', $filters->selectedCities)->pluck('id');
    $query->whereIn('city_id', $cityIds);
}

// Category filter (uses a scope on the Venue model)
if ($filters->categories !== []) {
    $query->withCategories($filters->categories);
}

// Verified toggle
if ($filters->verified) {
    $query->where('is_verified', true);
}

// Freshness filter (converts string key to days)
$freshnessDays = $filters->freshnessDays(); // e.g. '30' → 30
if ($freshnessDays !== null) {
    $query->whereNotNull('offer_updated_at')
        ->where('offer_updated_at', '>=', now()->subDays($freshnessDays));
}

// Text search (uses a scope)
if ($filters->search !== '') {
    $query->search($filters->search);
}

// Bounds (from "search in this area" map interaction)
if ($filters->hasBounds()) {
    $query->whereBetween('latitude', [$filters->boundsSouth, $filters->boundsNorth])
        ->whereBetween('longitude', [$filters->boundsWest, $filters->boundsEast]);
}
```

---

## Sort Options

There are three sort modes:

**`best` (default)** — custom ranking SQL:
1. `breadth_score` (precomputed column on the venue — more types of drinks = higher score)
2. Number of distinct product categories
3. Whether the venue has any custom drinks in the "drinki" category
4. Alphabetical name as tiebreaker

**`name`** — simple `ORDER BY name ASC`

**`nearest`** — uses the Haversine formula (great-circle distance on a sphere):
```php
const HAVERSINE_SQL = '(6371 * acos(cos(radians(?)) * cos(radians(latitude))
    * cos(radians(longitude) - radians(?)) + sin(radians(?))
    * sin(radians(latitude))))';
```
The user's location is obtained client-side via `navigator.geolocation` and then sent to the server via `$wire.setUserLocation(lat, lng)`.

---

## The "Clear Filters" Button

```php
public function clearFilters(): void
{
    $this->reset(['search', 'categories', 'selectedCities',
                  'selectedDistricts', 'verified', 'freshness']);
    $this->syncUrl();
}
```

`$this->reset([...])` is a Livewire helper that resets named properties back to their default values (the ones set in the class definition or `mount()`).

---

## Why Cities and Districts Don't Use #[Url]

If `selectedCities = ['warszawa']`, the ideal URL is `/mapa/warszawa` — a clean path segment, not `?miasta[]=warszawa`. Livewire's `#[Url]` can only manage query string parameters, not path segments.

So instead:
- Cities/districts use plain `public array` properties (no `#[Url]`)
- When they change, `syncUrl()` dispatches an Alpine event
- Alpine rewrites the URL itself using `history.replaceState()`

This is covered fully in Doc 6.
