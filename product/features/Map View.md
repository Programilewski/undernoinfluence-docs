# Map View

**Status:** **Built.** **Verified against code 2026-08-18.** Leaflet with CartoDB tiles, marker clustering (`leaflet.markercluster`), "search this area" via a bounding-box query, and bi-directional pin↔card sync (the selected-pin glow never worked at all until it was fixed on 17.08). The `breadth_score` column **does exist** and is indexed; `credibility_score` does not exist and will not (ADR-004). Distance queries run through a haversine expression in SQL (`Venue::HAVERSINE_SQL`) — **PostGIS is not installed**, despite what `tech/stack.md` claimed for months.

## Technology
Leaflet.js with CartoDB Dark Matter tiles. Map container wrapped in `wire:ignore`.

## Pin Display
- Default (no filter): category count number (e.g., "4")
- Single category filtered: product count in that category (e.g., "12")
- Multi category filtered: combined product count across filtered categories
- Verified checkmark icon overlay if venue earned it
- Venues with zero matching categories hidden entirely

## Clustering
At low zoom levels, pins cluster with count. Standard Leaflet MarkerCluster.

## "Search This Area"
- Button overlaid on map, appears after user pans/zooms
- Only fires on explicit tap — NOT on every pan/zoom
- Triggers PostGIS bounding box query:
```sql
SELECT id, name, latitude, longitude, credibility_score, breadth_score
FROM venues
WHERE ST_Within(location::geometry, ST_MakeEnvelope(?, ?, ?, ?, 4326))
ORDER BY credibility_score DESC, breadth_score DESC
LIMIT 60;
```
- LIMIT 60 is intentional: at wide zoom, only top venues appear
- Incentive: low-credibility venues vanish when user zooms out

## Pin Interactions

### Desktop
- Hover: tooltip with venue name + category count + checkmark
- Click: navigates to [[product/features/Venue Profile]]
- Bi-directional sync with list (see [[product/features/Discovery Page#Hover interaction]])

### Mobile
- Tap: popup with venue name, category count, checkmark, "Zobacz" link
- No hover states (touch devices)

## Analytics Events
- Map viewport search logged on "search this area" tap only
- Includes: center lat/lng, zoom level, timestamp, result count
- See [[tech/analytics|Analytics]]

## Performance
- Map lazy-loads on mobile (first FAB tap)
- Map initializes on page load on desktop
- Single instance shared across breakpoints
- `map.invalidateSize()` called on layout changes
