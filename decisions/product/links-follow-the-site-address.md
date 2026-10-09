# Links follow the site's own address, not the environment's name

**Date:** 2026-10-09
**Status:** Decided
**Executed:** 2026-10-09, released in `v0.1.6`
**Area:** Data Model | Operations

---

## Problem

Both servers sit behind something that handles HTTPS and passes plain HTTP to the application: Tailscale serve on the home server. No proxy is trusted (the 12.09 change that removed `trustProxies('*')`), so a request alone always reads as http. HTTPS links were forced only when the environment was called `production`, so the home server (`preprod`) served an https page that asked for its CSS and JS over http, and browsers blocked them: the page rendered unstyled.

## Options considered

Force HTTPS whenever the environment is not local. Trust the home server's proxy and read its `X-Forwarded-Proto` header. Force HTTPS whenever the site's own address, `APP_URL`, is https.

## Decision

The scheme of every link the application builds follows `APP_URL`: an https address means https links, whatever the environment is called. Production's address is https, so nothing changes there; local development on http stays on http.

## Rules

A new environment gets correct links by giving it the right `APP_URL`, with no code change. No proxy is trusted for this. A test proves an https address produces https links behind a plain-HTTP hop, and fails without the rule.

## What this prevents

An environment that looks broken only because of its name, and re-opening proxy trust (which made every rate limiter spoofable before 12.09) to fix a cosmetic problem.

## Revisit when

A server's public address and its `APP_URL` ever have to differ.

---

*See also: [[decisions/product/the-real-catalogue-reaches-production-only]], `ops/deployment-runbook.md` step 4.18*
