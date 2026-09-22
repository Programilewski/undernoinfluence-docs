# Polish-only V1 — no i18n infrastructure, no English

**Date:** 2026-05-04
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** UI/UX | Data Model

---

## Problem

UNI targets Polish users and Polish venue owners. Building internationalization infrastructure (translation files, locale routing, multi-language slugs) adds complexity with zero benefit for a Polish-only launch. But the choice affects URL structure and copy approach permanently.

## Options considered

1. **Build i18n infrastructure now** — locale prefix (`/pl/`), translation keys, English fallback. Future-proof but premature.
2. **Polish-only with inline strings** — direct Polish copy in Blade templates, no `__('key')` indirection. Fast, readable.
3. **Polish locale with translation files for framework strings only** — pragmatic middle ground.

## Decision

Polish-only. `APP_LOCALE=pl` and `APP_FALLBACK_LOCALE=pl`. Inline Polish string literals for all custom copy — no `__('key')` indirection in Blade templates. Laravel framework strings (validation, pagination, mail chrome) use `lang/pl/` translation files. No `/pl/` locale prefix in URLs. No `hreflang` tags. Filament renders its own Polish translations automatically from the locale setting.

## Rules

All user-facing copy is written directly in Polish in Blade templates. No translation key abstraction. No `/pl/` URL prefix. No multi-language slug support. Framework validation messages use `lang/pl/validation.php`. Add `hreflang` middleware only when expanding to non-Polish cities.

**Amended 2026-09-14 — tourists are a separate trigger, parked for V3.** Researched on 14.09: foreign tourists in Warsaw are a real audience and the idea passes the mission test, but English means extracting every inline string, doubling hreflang and noindex gates, and keeping two legal texts true — and nothing ranks behind the pre-launch password. Recorded in `roadmap/v3.md` under V3-F2 as a post-launch probe (one hand-written English page and a glossary, measured in Search Console) rather than a translation. Nothing here changes: an `/en/` prefix would add addresses without touching any Polish one.

## What this prevents

Premature abstraction. A `__('search_placeholder')` indirection that maps to exactly one language is worse than `placeholder="Szukaj lokalu lub napoju…"` — it's harder to read, harder to grep, and the "future-proofing" may never be needed.

## Revisit when

When the first non-Polish city is added to the platform. That's the trigger for `hreflang`, locale routing, and translation key extraction — not before.
