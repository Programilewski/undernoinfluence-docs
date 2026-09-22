# ADR-001: Venue Name — String vs JSONB

## Status
**Decided: Plain string for V1.**
**Executed:** yes — verified in the code 2026-09-14

## Context
Venue names could be stored as a plain string or as JSONB with language keys (like the `description` column).

## Options Considered
1. **Plain string + translations table** — simple schema, standard Laravel localization, easy to query
2. **JSONB column** — fast reads, consistent with description column, PostgreSQL-specific

## Decision
Plain string. V1 is Polish-only, English support is months away. Don't over-engineer for a localization need that doesn't exist yet.

## When to Revisit
When English language support is actually planned for implementation. At that point, evaluate whether JSONB or a translations table is more appropriate based on how the `description` JSONB column has worked in practice.
