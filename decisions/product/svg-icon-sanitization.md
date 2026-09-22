# SVG Category Icon Sanitization

**Date:** 2026-06-17
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** Security | Admin Panel

---

## Problem

Category icons are SVG strings stored in the database by admins via the Filament admin panel. They are rendered with unescaped `{!! !!}` output in three public Blade templates (venue tiles, venue profile, map popups). A malicious or compromised admin account could set a category icon to contain a `<script>` block or an `on*` event handler, achieving stored XSS that executes in every visitor's browser on every page displaying venue categories. The attack surface is: compromised admin credential, not an external attacker with no DB access.

## Options considered

- Full HTML/SVG sanitizer library (e.g. `ezyang/htmlpurifier`, `league/html-to-markdown`)
- Regex stripping of `<script>` blocks and `on*` event handlers in the data-preparation layer
- Per-template escaping (lose SVG rendering entirely)
- Store icons in a controlled format (e.g. icon font or Heroicon name strings) — V2 option

## Decision

We strip `<script>` blocks and `on*="..."` event handler attributes in `VenuePresenter::sanitizeIcon()` using two `preg_replace` calls, applied at the data-preparation layer before any SVG reaches a template. No new package dependency (project rules prohibit adding dependencies without approval). Applied in all three call sites inside VenuePresenter so all consumers are automatically covered.

## Rules

Icons in the `categories.icon_svg` column are sanitized in VenuePresenter before any template sees them. No template renders a raw DB icon string. All three icon call sites (categoryRows, accordionCategories map, drinks-only fallback) pass through `sanitizeIcon()`. Adding a new consumer (e.g. API endpoint) must also call `sanitizeIcon()`.

## What this prevents

Stored XSS via a compromised admin account or a careless admin pasting an untrusted SVG from the internet into the icon field. Without this, a single icon update could inject JavaScript into every venue tile on the discovery page.

## Revisit when

If icons ever become user-uploaded (not just admin-managed), the regex approach is insufficient for the expanded threat model — upgrade to a proper SVG sanitizer library at that point. Also revisit if CSS-based XSS vectors (e.g. `style="background:url(javascript:...)"`) become a concern in the admin-content context.
