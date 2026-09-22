# Under No Influence (UNI)

A web platform that aggregates physical venues serving non-alcoholic drinks in Poland. Users find places and evaluate their NoLo offering. Businesses get analytics on local demand.

## Vault Structure

- [[brand/UNI-Brand-Book|Brand Book]] — colors, fonts, tone, values, identity
- [[product/rules/Venue Rules]] — what gets listed, restrictions, quality gates
- [[product/rules/Custom Drinks Rules]] — photo requirements, validation, tagging
- [[product/features/Features Index]] — all features with flows and status
- [[business/model|Business Model]] — monetization, B2B tiers, pricing
- [[tech/stack|Tech Stack]] — TALL stack, database, layout contexts
- [[tech/analytics|Analytics]] — event tracking, tiers, GDPR
- [[business/Growth Strategy]] — SEO, physical touchpoints, expansion
- [[decisions/README|Decisions Log]] — architectural decisions and their rationale

## Ground Truth: Session Journals

The vault is the product vision. The **session journals** are the ground truth on what has actually been built, what was decided in practice, and what the current codebase state is. When the vault and reality conflict, the journals win.

Journals live in `journals/` at the project root. Read the most recent journal before starting any session. The `journals/README.md` contains the global Canary Register — fictional venues used for scraping detection. Do not delete or publicise those entries.

The [[VAULT REVIEW]] document cross-references this vault against the actual codebase and identifies what is accurate, stale, or missing.

## Core Value Proposition

**For consumers:** Find honest, accurate, up-to-date info on non-alcoholic drink options nearby.

**For businesses:** Aggregated demand data, visibility among motivated NoLo consumers, incentive to improve their offering.

**The differentiator:** Data authority. Structured NoLo menus verified by community flagging, owner reconfirmation, and decay systems. Not reviews, not ratings — verified catalog data that no one else has.

## V1 Scope

Warsaw only. 6 categories. Anonymous users, no registration required. Owner dashboard via Filament. SEO-first growth. No social media, no paid ads. See [[product/features/Features Index]] for full V1 spec and current implementation status.
