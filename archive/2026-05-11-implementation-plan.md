# Implementation Plan — URL Architecture & Category Taxonomy

**Date:** 2026-05-11
**Target session:** 2026-05-12
**Status:** Ready to implement — spec & architecture-explorer already updated

---

## Context

Two workstreams that must ship before Google starts indexing the site. The interactive discovery page moves from `/szukaj` to `/mapa` with city/district segments, and category slugs get `-bezalkoholowe` SEO suffixes. Separately, category display names and visibility need updating. Both workstreams touch routes, controllers, Livewire, Blade templates, seeders, and the sitemap — they're interleaved, so implement in the order below.

**Why this matters:** Once Google indexes `/szukaj` and `/kategoria/piwo`, changing them later means 301 redirects and lost link equity. Do it now while the site has zero indexed pages.

---

## Current State (verified 2026-05-11)

### Categories in DB right now

| id | name       | slug      | sort_order | notes                                    |
|----|------------|-----------|------------|------------------------------------------|
| 3  | Piwo       | piwo      | 1          | needs rename to "Piwo 0"                 |
| 4  | Wino       | wino      | 2          | needs rename to "Wino 0"                 |
| 5  | (Nie)mocne | niemocne  | 3          | already renamed from Destylaty! slug changed too. needs `is_visible=false` |
| 1  | Drinki     | koktajle  | 4          | name already "Drinki" but slug still "koktajle" — needs slug change to "drinki", name to "Drinki 0" |
| 6  | Cydr       | cydr      | 5          | needs rename to "Cydr 0"                 |
| 2  | Musujace   | musujace  | 6          | needs rename to "Babelki"                |

**Key finding:** The mocktajle/drinki/koktajle merge is already done — there's only one "Drinki" category (id=1). And destylaty was already renamed to (Nie)mocne with slug "niemocne". Less migration work than expected.

### Hardcoded references to find-and-fix

- `'koktajle'` slug hardcoded in:
  - `app/Livewire/DiscoveryPage.php:160` — drinks category lookup
  - `resources/views/venues/show.blade.php:50,82,90` — drinks category in accordion
  - `resources/views/components/venue-tile.blade.php:5` — venue tile drinks display
- `'/szukaj'` hardcoded in:
  - `resources/views/livewire/discovery-page.blade.php:11,17` — canonical URL, og:url
- `route('discovery')` used in (will auto-update if route name stays):
  - `nav.blade.php:38`, `home.blade.php:47,74,259,377`, `city/show.blade.php:122`, `city/district.blade.php:59,94`, `categories/show.blade.php:59`
- `route('categories.show', $category->slug)` used in:
  - `home.blade.php:270`, `city/show.blade.php:75`, `city/district-category.blade.php:84,115`, `categories/show.blade.php:12,23`
- `'destylaty'` string in Blade (meta descriptions only):
  - `home.blade.php:9,19` and `for-venues.blade.php:105`

### Route order in `routes/web.php` (lines 64-69)

```php
Route::get('/{citySlug}', [CityController::class, 'show'])->name('city.show')     // line 64
Route::get('/{citySlug}/{districtSlug}', ...)                                      // line 66
Route::get('/{citySlug}/{districtSlug}/{categorySlug}', ...)                       // line 69
```

The new `/{city}/{categorySlug}` route must go BETWEEN city.show and city.district with a regex constraint.

---

## Implementation Steps

### Step 1: Migration — add `seo_slug` and `is_visible` to categories

**Why:** Every subsequent step depends on these columns existing.

```bash
php artisan make:migration add_seo_slug_and_is_visible_to_categories_table --no-interaction
```

Migration content:
```php
// up()
Schema::table('categories', function (Blueprint $table) {
    $table->string('seo_slug')->nullable()->unique()->after('slug');
    $table->boolean('is_visible')->default(true)->after('is_active');
});

// Seed SEO slugs and set visibility
DB::table('categories')->where('slug', 'piwo')->update(['seo_slug' => 'piwo-bezalkoholowe']);
DB::table('categories')->where('slug', 'wino')->update(['seo_slug' => 'wino-bezalkoholowe']);
DB::table('categories')->where('slug', 'niemocne')->update([
    'seo_slug' => 'destylaty-bezalkoholowe',
    'is_visible' => false,  // hidden at launch
]);
DB::table('categories')->where('slug', 'koktajle')->update([
    'slug' => 'drinki',     // fix legacy slug
    'seo_slug' => 'drinki-bezalkoholowe',
]);
DB::table('categories')->where('slug', 'cydr')->update(['seo_slug' => 'cydr-bezalkoholowy']); // masculine
DB::table('categories')->where('slug', 'musujace')->update(['seo_slug' => 'napoje-musujace-bezalkoholowe']);

// down()
Schema::table('categories', function (Blueprint $table) {
    $table->dropColumn(['seo_slug', 'is_visible']);
});
// Revert slug change
DB::table('categories')->where('slug', 'drinki')->update(['slug' => 'koktajle']);
```

**IMPORTANT:** The `koktajle` → `drinki` slug change will break the `categories_slug_unique` index temporarily — make sure no other row has slug `drinki` first (there isn't one based on current data).

Run: `php artisan migrate`

---

### Step 2: Migration — update category display names

**Why:** Display names should match the brand voice ("Piwo 0" pattern). Separate migration for clean rollback.

```bash
php artisan make:migration update_category_display_names --no-interaction
```

```php
// up()
DB::table('categories')->where('slug', 'piwo')->update(['name' => 'Piwo 0%']);
DB::table('categories')->where('slug', 'wino')->update(['name' => 'Wino 0%']);
DB::table('categories')->where('slug', 'drinki')->update(['name' => 'Drinki 0%']);
DB::table('categories')->where('slug', 'cydr')->update(['name' => 'Cydr 0%']);
DB::table('categories')->where('slug', 'musujace')->update(['name' => 'Szampan 0%']);
// (Nie)mocne name stays as-is — already correct
```

Run: `php artisan migrate`

---

### Step 3: Update Category model

**Why:** Model needs to expose `seo_slug`, filter by visibility, and resolve lookups by SEO slug.

File: `app/Models/Category.php`

Add:
```php
// Scope for public-facing queries
public function scopeVisible($query)
{
    return $query->where('is_visible', true);
}
```

Add `seo_slug` to any `$casts` if needed (it's a plain string, probably fine without).

---

### Step 4: Update CategorySeeder and CategoryFactory

**Why:** Fresh installs and tests must reflect the new schema.

File: `database/seeders/CategorySeeder.php`
- Change `'Koktajle' / 'koktajle'` → `'Drinki 0%' / 'drinki'`
- Change `'Destylaty' / 'destylaty'` → `'(Nie)mocne' / 'niemocne'`
- Add `seo_slug` and `is_visible` to each entry
- Set `is_visible => false` for (Nie)mocne
- Update all names to "Piwo 0%", "Wino 0%", "Cydr 0%", "Szampan 0%" pattern

File: `database/factories/CategoryFactory.php`
- Update `randomElement` array to new names
- Add `seo_slug` and `is_visible` to `definition()`

---

### Step 5: Update Filament CategoryResource

**Why:** Admin needs to toggle visibility and see/edit SEO slugs.

File: `app/Filament/Resources/Categories/Schemas/CategoryForm.php`
- Add `TextInput::make('seo_slug')` — unique, helperText about -bezalkoholowe suffix
- Add `Toggle::make('is_visible')->default(true)` — labeled "Show in filters & SEO pages"

File: `app/Filament/Resources/Categories/Tables/CategoriesTable.php`
- Add `TextColumn::make('seo_slug')` column
- Add `ToggleColumn::make('is_visible')->label('Visible')` column

---

### Step 6: Fix hardcoded `'koktajle'` slug references

**Why:** The DB slug changed from `koktajle` to `drinki`. All code that does `->slug === 'koktajle'` will break.

Files to change (replace `'koktajle'` with `'drinki'`):
1. `app/Livewire/DiscoveryPage.php:160` — `$drinksCategory = $allCategories->first(fn ($c) => $c->slug === 'drinki');`
2. `resources/views/venues/show.blade.php:50` — same pattern
3. `resources/views/venues/show.blade.php:82` — priority array key
4. `resources/views/venues/show.blade.php:90` — contains check
5. `resources/views/components/venue-tile.blade.php:5` — same pattern

**Test:** After this change, visit a venue profile page and verify the drinks accordion still renders correctly.

---

### Step 7: Filter public queries by `is_visible`

**Why:** Hidden categories ((Nie)mocne) should not appear in filter pills, navigation grids, or SEO pages.

Files to update:
1. `app/Livewire/DiscoveryPage.php` — category filter list: add `->where('is_visible', true)` or `->visible()`
2. `app/Http/Controllers/HomeController.php` — homepage category grid (if it queries categories)
3. `app/Http/Controllers/CityController.php:30` — `Category::where('is_active', true)` → add `->where('is_visible', true)`
4. `app/Http/Controllers/CityController.php:57` — same in `district()`
5. `resources/views/city/show.blade.php` — category navigation links
6. `app/Http/Controllers/SitemapController.php:34,63` — exclude hidden categories from sitemap

**Exception:** Venue profile accordion (`venues/show.blade.php`) should still show (Nie)mocne products if a venue has them — data transparency. Don't filter there.

---

### Step 8: Rename route `/szukaj` → `/mapa` with optional segments

**Why:** Separate interactive discovery namespace from SEO pages. Supports city/district pre-filtering via URL.

File: `routes/web.php`

Change line 23:
```php
// Before
Route::get('/szukaj', DiscoveryPage::class)->name('discovery');

// After
Route::get('/mapa/{city?}/{district?}', DiscoveryPage::class)->name('discovery');

// 301 redirect for any existing /szukaj links
Route::redirect('/szukaj', '/mapa', 301);
```

**Route name stays `discovery`** — all Blade templates using `route('discovery')` continue working. But now `route('discovery')` generates `/mapa` instead of `/szukaj`, and `route('discovery', ['city' => 'warszawa'])` generates `/mapa/warszawa`.

---

### Step 9: Update DiscoveryPage Livewire component

**Why:** Component needs to accept city/district from URL and stop hardcoding Warsaw.

File: `app/Livewire/DiscoveryPage.php`

Changes:
1. Add `mount(?string $city = null, ?string $district = null)` method
2. Resolve city from slug parameter (default to Warsaw if null)
3. Pre-select district filter if district param provided
4. Remove hardcoded `City::active()->where('slug', 'warszawa')->first()` — use the resolved city
5. Update `#[Title]` to include city name dynamically
6. Center map on city bounds when city param provided

Also update category filter to only show visible categories:
```php
$allCategories = Category::where('is_active', true)->where('is_visible', true)->orderBy('sort_order')->get();
```

---

### Step 10: Fix hardcoded `/szukaj` in discovery Blade

**Why:** Canonical URL and og:url still hardcode `/szukaj`.

File: `resources/views/livewire/discovery-page.blade.php`

Change lines 11 and 17:
```php
// Before
<link rel="canonical" href="{{ url('/szukaj') }}" />
<meta property="og:url" content="{{ url('/szukaj') }}" />

// After — use route helper for correct URL generation
<link rel="canonical" href="{{ route('discovery') }}" />
<meta property="og:url" content="{{ route('discovery') }}" />
```

If city/district are set, canonical should reflect that (e.g. `/mapa/warszawa`).

---

### Step 11: Update category routes to use SEO slugs

**Why:** Category URLs must use `-bezalkoholowe` suffix for legal/SEO protection.

File: `routes/web.php` — line 26:
```php
// Before
Route::get('/kategoria/{category:slug}', [CategoryController::class, 'show'])->name('categories.show');

// After — bind by seo_slug
Route::get('/kategoria/{category:seo_slug}', [CategoryController::class, 'show'])->name('categories.show');
```

File: `app/Http/Controllers/CategoryController.php`
- Route model binding now resolves via `seo_slug` — no controller changes needed
- But verify the implicit binding works (Category model must have `seo_slug` column)

File: all Blade templates using `route('categories.show', $category->slug)`:
- Change to `route('categories.show', $category->seo_slug)`
- Affected files:
  - `home.blade.php:270`
  - `city/show.blade.php:75`
  - `city/district-category.blade.php:84,115`
  - `categories/show.blade.php:12,23`

301 redirect for old slugs (optional but recommended):
```php
Route::get('/kategoria/{slug}', function (string $slug) {
    $category = Category::where('slug', $slug)->firstOrFail();
    return redirect()->route('categories.show', $category->seo_slug, 301);
})->where('slug', '[a-z]+'); // only match old-format slugs (no hyphens with bezalkoholowe)
```

---

### Step 12: Add `/{city}/{categorySlug}` SEO route

**Why:** New city x category landing pages (e.g. `/warszawa/piwo-bezalkoholowe`).

File: `routes/web.php`

Add BETWEEN `city.show` and `city.district` (order matters!):
```php
// Known category SEO slugs — regex constraint prevents collision with district slugs
Route::get('/{citySlug}/{categorySlug}', [CityController::class, 'category'])
    ->name('city.category')
    ->where('categorySlug', 'piwo-bezalkoholowe|wino-bezalkoholowe|drinki-bezalkoholowe|cydr-bezalkoholowy|destylaty-bezalkoholowe|napoje-musujace-bezalkoholowe');
```

**Why regex instead of dynamic lookup:** Route registration happens on every request before the DB is queried. Hardcoding the slugs is faster and the list is stable (6 categories). If a new category is added, update the regex.

File: `app/Http/Controllers/CityController.php`

Add new method:
```php
public function category(string $citySlug, string $categorySlug): View
{
    $city = City::where('slug', $citySlug)->where('is_active', true)->firstOrFail();
    $category = Category::where('seo_slug', $categorySlug)->where('is_active', true)->firstOrFail();

    // Hidden categories return 404
    if (!$category->is_visible) {
        abort(404);
    }

    $freshThreshold = Carbon::now()->subDays(config('uni.freshness_days'));

    $venues = Venue::active()
        ->where('city_id', $city->id)
        ->whereHas('products', function ($q) use ($category, $freshThreshold) {
            $q->where('category_id', $category->id)
                ->where(function ($q) use ($freshThreshold) {
                    $q->whereNull('venue_products.confirmed_at')
                        ->orWhere('venue_products.confirmed_at', '>=', $freshThreshold);
                });
        })
        ->withCount(['products as category_product_count' => fn ($q) => $q->where('category_id', $category->id)])
        ->orderByDesc('category_product_count')
        ->get();

    return view('city.category', compact('city', 'category', 'venues'));
}
```

Create view: `resources/views/city/category.blade.php`
- Copy structure from `city/district-category.blade.php` as starting point
- Breadcrumb: Home > City > Category
- H1: "{Category name} w {city name locative}" (e.g. "Piwo 0 w Warszawie")
- Venue list sorted by product count in category

---

### Step 13: Update `districtCategory` to use SEO slugs

**Why:** The `/{city}/{district}/{category}` route also needs SEO slug format.

File: `app/Http/Controllers/CityController.php:64`

Change:
```php
// Before
$category = Category::where('slug', $categorySlug)->where('is_active', true)->firstOrFail();

// After
$category = Category::where('seo_slug', $categorySlug)->where('is_active', true)->firstOrFail();
```

File: `routes/web.php:69`
- Update the route to use SEO slug constraint (or let it match any string since it's already third segment)

---

### Step 14: Update SitemapController

**Why:** Sitemap must reflect new routes and SEO slugs.

File: `app/Http/Controllers/SitemapController.php`

Changes:
1. Line 28: `route('discovery')` already generates `/mapa` after step 8 — no change needed
2. Line 36: Change `$category->slug` to `$category->seo_slug` in category page URLs
3. Line 34: Add `->where('is_visible', true)` to category query
4. Line 63: Same visibility filter
5. Line 77: Change `$category->slug` to `$category->seo_slug` in district+category URLs
6. Add new block: city+category pages
```php
// City + category SEO pages (NEW)
City::active()->each(function (City $city) use ($sitemap, $activeCategories) {
    foreach ($activeCategories as $category) {
        $hasVenues = Venue::active()
            ->where('city_id', $city->id)
            ->whereHas('products', fn ($q) => $q->where('category_id', $category->id))
            ->exists();

        if ($hasVenues) {
            $sitemap->add(
                Url::create(route('city.category', [$city->slug, $category->seo_slug]))
                    ->setPriority(0.7)
                    ->setChangeFrequency('weekly')
            );
        }
    }
});
```

---

### Step 15: Update Blade meta descriptions

**Why:** Some meta descriptions still say "destylaty" and "koktajle".

Files:
- `resources/views/home.blade.php:9,19` — update meta description to use new category names
- `resources/views/for-venues.blade.php:105` — update category list text

---

### Step 16: Run Pint and tests

```bash
vendor/bin/pint --dirty --format agent
php artisan test --compact
```

Fix any failures. Key things to test:
- Visit `/mapa` — discovery page loads
- Visit `/mapa/warszawa` — discovery page with Warsaw pre-selected
- Visit `/warszawa/piwo-bezalkoholowe` — city+category SEO page
- Visit `/kategoria/piwo-bezalkoholowe` — national category page
- Visit `/miejsce/{any-venue-slug}` — venue profile, drinks accordion works
- Visit `/warszawa` — city page, category links use SEO slugs
- Check (Nie)mocne does NOT appear in filter pills or navigation
- Check `/sitemap.xml` — all URLs use new format

---

## Dependency Graph

```
Step 1 (migration: seo_slug, is_visible, slug fix)
  ├── Step 2 (migration: display names)
  ├── Step 3 (Category model scope)
  ├── Step 4 (seeder + factory)
  ├── Step 5 (Filament form/table)
  ├── Step 6 (fix 'koktajle' hardcodes) — MUST come after slug change in Step 1
  ├── Step 7 (is_visible filtering) — needs scope from Step 3
  ├── Step 11 (category route SEO slugs) — needs seo_slug column
  ├── Step 12 (new city+category route) — needs seo_slug column
  └── Step 13 (districtCategory SEO slugs) — needs seo_slug column

Step 8 (route rename /szukaj → /mapa)
  ├── Step 9 (DiscoveryPage Livewire changes)
  └── Step 10 (fix /szukaj in Blade)

Step 14 (sitemap) — depends on Steps 1, 8, 11, 12
Step 15 (meta descriptions) — independent, do anytime
Step 16 (pint + tests) — last
```

**Recommended order:** 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 13 → 14 → 15 → 16

Steps 1-7 (category taxonomy) and 8-10 (URL rename) are independent tracks and could be parallelized if needed, but sequential is safer.

---

## Risk Notes

- **Slug change `koktajle` → `drinki`** is the riskiest step. The unique index means no two rows can share a slug. Current data confirms no `drinki` slug exists, so the rename is safe. But if someone seeds a "drinki" category between now and migration, it will fail.
- **Route order matters.** The `/{city}/{categorySlug}` route with regex MUST be before `/{city}/{districtSlug}`. If registered after, category slugs will 404 as "district not found".
- **Route model binding change** (`slug` → `seo_slug`) for categories changes all generated URLs. Any cached/bookmarked `/kategoria/piwo` links will 404 unless the fallback redirect (Step 11) is implemented.
- **`is_visible=false` on (Nie)mocne** means venues with destylaty products still show those products on their profile (good), but the category won't appear in filters or navigation (intended). If a user directly visits `/warszawa/destylaty-bezalkoholowe`, they get 404 (intended).

---

## Files Modified (complete list)

| File | Changes |
|------|---------|
| `database/migrations/new_1` | Add seo_slug, is_visible, fix koktajle→drinki slug |
| `database/migrations/new_2` | Update display names |
| `app/Models/Category.php` | Add `scopeVisible()` |
| `database/seeders/CategorySeeder.php` | New names, slugs, seo_slugs, is_visible |
| `database/factories/CategoryFactory.php` | New names, add seo_slug + is_visible |
| `app/Filament/Resources/Categories/Schemas/CategoryForm.php` | Add seo_slug input, is_visible toggle |
| `app/Filament/Resources/Categories/Tables/CategoriesTable.php` | Add seo_slug column, is_visible toggle |
| `app/Livewire/DiscoveryPage.php` | Accept city/district params, fix koktajle→drinki, filter visible |
| `resources/views/livewire/discovery-page.blade.php` | Fix canonical/og:url from /szukaj to route() |
| `resources/views/venues/show.blade.php` | Fix koktajle→drinki (3 occurrences) |
| `resources/views/components/venue-tile.blade.php` | Fix koktajle→drinki |
| `routes/web.php` | Rename /szukaj→/mapa, add city+category route, update category binding |
| `app/Http/Controllers/CategoryController.php` | No changes if binding works via seo_slug |
| `app/Http/Controllers/CityController.php` | Add category() method, update districtCategory() |
| `app/Http/Controllers/SitemapController.php` | Use seo_slug, add city+category pages, filter visible |
| `app/Http/Controllers/HomeController.php` | Filter visible categories (if applicable) |
| `resources/views/city/category.blade.php` | NEW — city+category SEO page view |
| `resources/views/home.blade.php` | Update category route params, fix meta |
| `resources/views/city/show.blade.php` | Update category route params |
| `resources/views/city/district-category.blade.php` | Update category route params |
| `resources/views/categories/show.blade.php` | Update category route params |
| `resources/views/for-venues.blade.php` | Update category list text |
