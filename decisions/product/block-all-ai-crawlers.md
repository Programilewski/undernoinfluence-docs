# Block all AI crawlers in robots.txt

**Date:** 2026-06-18
**Status:** Decided
**Executed:** yes — verified in the code 2026-09-14
**Area:** Data Model | Analytics

---

## Problem

AI crawlers fall into two categories: training bots (harvest content to train models) and citation bots (crawl for real-time search/answer engines like Perplexity or ChatGPT Search). Both consume UNI's manually verified venue data without contributing to UNI's discovery goals. The data UNI collects is the core asset — allowing any AI to absorb it freely undermines the value of building it.

## Options considered

Block training bots only, allow citation/search bots for visibility in AI search engines. Block all AI bots unconditionally. Allow all and rely on attribution.

## Decision

All AI crawlers are blocked in robots.txt — both training bots (GPTBot, ClaudeBot, CCBot, etc.) and citation/search bots (OAI-SearchBot, PerplexityBot, etc.). This is unconditional and applies to all routes. The comment in robots.txt states the intent explicitly.

## Rules

Any new AI crawler user-agent identified should be added to robots.txt immediately. The distinction between "training" and "search/citation" bots does not apply — both are blocked. Standard search indexing bots (Googlebot, Bingbot) are unaffected.

## What this prevents

UNI's verified venue and product data being absorbed into AI model weights or answer engines without any attribution, traffic, or commercial relationship. Once a competitor or AI aggregator has the data, the moat disappears.

## Revisit when

If UNI reaches a scale where AI citation traffic (e.g. Perplexity showing UNI as a source) becomes a measurable acquisition channel worth trading data access for. That is a post-V1 business negotiation, not a default setting.
